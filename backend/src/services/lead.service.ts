import { prisma } from '../db/prisma.js';
import { normalizePhoneNumber } from '../utils/phone.js';
import { generateCallId } from '../utils/crypto.js';
import { suppressionService } from './suppression.service.js';
import { callQueue } from '../queues/queue-manager.js';
import { logger } from '../utils/logger.js';

export interface IngestLeadInput {
  organizationId: string;
  lead_id?: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  service?: string;
  source?: string;
  message?: string;
  consent: boolean;
  consent_timestamp?: string;
  metadata?: Record<string, any>;
  agentId?: string; // Optional custom voice agent override
}

export interface IngestLeadResult {
  success: boolean;
  leadId: string;
  callId?: string;
  status: 'queued' | 'suppressed' | 'no_consent' | 'duplicate_skipped' | 'invalid_phone';
  message: string;
}

export class LeadService {
  /**
   * Ingests a website lead, validates consent and suppression, creates call job,
   * and dispatches immediately to BullMQ call queue.
   */
  async processIncomingLead(input: IngestLeadInput): Promise<IngestLeadResult> {
    const { isValid, e164, error: phoneError } = normalizePhoneNumber(input.phone);
    if (!isValid) {
      logger.warn({ phone: input.phone, phoneError }, 'Incoming lead phone validation failed');
      return {
        success: false,
        leadId: '',
        status: 'invalid_phone',
        message: phoneError || 'Invalid phone number format',
      };
    }

    // Consent check
    if (input.consent !== true) {
      logger.info({ phone: e164 }, 'Lead rejected due to missing customer consent');
      return {
        success: false,
        leadId: '',
        status: 'no_consent',
        message: 'Explicit customer consent is required to trigger automated calls.',
      };
    }

    // Suppression / DNC check
    const isDnc = await suppressionService.isSuppressed(input.organizationId, e164);
    if (isDnc) {
      logger.info({ phone: e164 }, 'Lead is on Do Not Call suppression list');
      return {
        success: false,
        leadId: '',
        status: 'suppressed',
        message: 'Phone number is registered on the suppression / Do Not Call list.',
      };
    }

    // Duplicate check: avoid dialing the same number multiple times within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existingRecentCall = await prisma.call.findFirst({
      where: {
        organization_id: input.organizationId,
        customer_phone: e164,
        created_at: { gte: fiveMinutesAgo },
        status: { in: ['queued', 'initiated', 'ringing', 'in_progress'] },
      },
    });

    if (existingRecentCall) {
      logger.info({ phone: e164, callId: existingRecentCall.internal_call_id }, 'Duplicate lead call skipped');
      return {
        success: true,
        leadId: existingRecentCall.lead_id || '',
        callId: existingRecentCall.internal_call_id,
        status: 'duplicate_skipped',
        message: 'Call already recently queued or in progress for this phone number.',
      };
    }

    // Find default active Voice Agent for organization if not specified
    let agentId = input.agentId;
    if (!agentId) {
      const defaultAgent = await prisma.voiceAgent.findFirst({
        where: {
          organization_id: input.organizationId,
          is_active: true,
        },
        orderBy: { created_at: 'asc' },
      });

      if (!defaultAgent) {
        throw new Error('No active Voice Agent configured for this organization');
      }
      agentId = defaultAgent.id;
    }

    // Upsert or create Lead record
    const lead = await prisma.lead.create({
      data: {
        organization_id: input.organizationId,
        external_lead_id: input.lead_id || null,
        name: input.name,
        phone: e164,
        email: input.email || null,
        city: input.city || null,
        service: input.service || null,
        source: input.source || 'Website',
        message: input.message || null,
        consent: true,
        consent_source: 'website_enquiry_form',
        consent_timestamp: input.consent_timestamp ? new Date(input.consent_timestamp) : new Date(),
        custom_fields: input.metadata || {},
        status: 'queued',
      },
    });

    const internalCallId = generateCallId();

    // Create Call record
    const call = await prisma.call.create({
      data: {
        organization_id: input.organizationId,
        internal_call_id: internalCallId,
        provider: 'exotel',
        direction: 'outbound',
        lead_id: lead.id,
        agent_id: agentId,
        status: 'queued',
        customer_phone: e164,
        tags: ['voice-ai', 'website-lead', input.source || 'website'],
        technical_meta: input.metadata || {},
      },
    });

    // Enqueue call job into BullMQ
    const customVariables = {
      name: input.name,
      city: input.city || 'your city',
      course: input.service || 'the course',
      service: input.service || 'the service',
      source: input.source || 'our website',
      message: input.message || '',
    };

    await callQueue.add(
      'outbound-call',
      {
        internalCallId: call.internal_call_id,
        callRecordId: call.id,
        organizationId: input.organizationId,
        customerPhone: e164,
        agentId: agentId,
        leadId: lead.id,
        customVariables,
      },
      {
        priority: 1, // High priority for instant website leads
        attempts: 2,
        backoff: { type: 'fixed', delay: 10000 },
      }
    );

    logger.info(
      { leadId: lead.id, callId: internalCallId, phone: e164 },
      'Website lead enqueued for instant AI call'
    );

    return {
      success: true,
      leadId: lead.id,
      callId: internalCallId,
      status: 'queued',
      message: 'Lead received and instant AI call queued successfully.',
    };
  }
}

export const leadService = new LeadService();
