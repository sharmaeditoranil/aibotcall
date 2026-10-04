import { parse } from 'csv-parse/sync';
import { prisma } from '../db/prisma.js';
import { normalizePhoneNumber } from '../utils/phone.js';
import { generateCallId } from '../utils/crypto.js';
import { callQueue } from '../queues/queue-manager.js';
import { suppressionService } from './suppression.service.js';
import { logger } from '../utils/logger.js';

export interface CreateCampaignInput {
  organizationId: string;
  name: string;
  agentId: string;
  scheduledAt?: string;
  concurrencyLimit?: number;
  retryOnBusy?: boolean;
  retryOnNoAnswer?: boolean;
  maxRetries?: number;
  retryDelayMinutes?: number;
}

export interface ImportContactInput {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  lead_id?: string;
  custom_variables?: Record<string, any>;
}

export class CampaignService {
  /**
   * Creates a new campaign record.
   */
  async createCampaign(input: CreateCampaignInput) {
    return prisma.campaign.create({
      data: {
        organization_id: input.organizationId,
        name: input.name,
        agent_id: input.agentId,
        status: input.scheduledAt ? 'scheduled' : 'draft',
        scheduled_at: input.scheduledAt ? new Date(input.scheduledAt) : null,
        concurrency_limit: input.concurrencyLimit || 5,
        retry_on_busy: input.retryOnBusy ?? true,
        retry_on_no_answer: input.retryOnNoAnswer ?? false,
        max_retries: input.maxRetries || 2,
        retry_delay_minutes: input.retryDelayMinutes || 15,
      },
    });
  }

  /**
   * Imports contacts from raw CSV text with field mapping.
   */
  async importContactsFromCsv(
    campaignId: string,
    csvContent: string,
    mapping: {
      nameField: string;
      phoneField: string;
      emailField?: string;
      cityField?: string;
      leadIdField?: string;
      courseField?: string;
    }
  ): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    const records: Record<string, string>[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    const contactsToInsert: any[] = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rawPhone = row[mapping.phoneField];
      const name = row[mapping.nameField] || 'Customer';

      if (!rawPhone) {
        skipped++;
        errors.push(`Row ${i + 1}: Missing phone number`);
        continue;
      }

      const { isValid, e164 } = normalizePhoneNumber(rawPhone);
      if (!isValid) {
        skipped++;
        errors.push(`Row ${i + 1}: Invalid phone number format (${rawPhone})`);
        continue;
      }

      // Check DNC
      const isDnc = await suppressionService.isSuppressed(campaign.organization_id, e164);
      if (isDnc) {
        skipped++;
        errors.push(`Row ${i + 1}: Number ${e164} is in Do Not Call list`);
        continue;
      }

      const customVariables: Record<string, any> = {
        name,
        city: mapping.cityField ? row[mapping.cityField] || '' : '',
        course: mapping.courseField ? row[mapping.courseField] || '' : '',
        ...row,
      };

      contactsToInsert.push({
        campaign_id: campaignId,
        name,
        phone: e164,
        email: mapping.emailField ? row[mapping.emailField] || null : null,
        city: mapping.cityField ? row[mapping.cityField] || null : null,
        lead_id: mapping.leadIdField ? row[mapping.leadIdField] || null : null,
        custom_variables: customVariables,
        status: 'pending',
      });
      imported++;
    }

    if (contactsToInsert.length > 0) {
      await prisma.campaignContact.createMany({
        data: contactsToInsert,
      });

      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          total_contacts: { increment: imported },
          queued_count: { increment: imported },
        },
      });
    }

    return { imported, skipped, errors };
  }

  /**
   * Starts or resumes a broadcast campaign.
   */
  async startCampaign(campaignId: string): Promise<boolean> {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { agent: true },
    });

    if (!campaign) throw new Error('Campaign not found');

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'running' },
    });

    // Fetch pending contacts
    const pendingContacts = await prisma.campaignContact.findMany({
      where: {
        campaign_id: campaignId,
        status: 'pending',
      },
      take: 500, // Batch enqueue
    });

    logger.info(
      { campaignId, contactCount: pendingContacts.length },
      'Enqueueing contacts for campaign execution'
    );

    // Enqueue with slight staggered delay to respect telephony limits
    let delay = 0;
    for (const contact of pendingContacts) {
      const internalCallId = generateCallId();

      // Create Call record
      const call = await prisma.call.create({
        data: {
          organization_id: campaign.organization_id,
          internal_call_id: internalCallId,
          provider: 'exotel',
          direction: 'outbound',
          agent_id: campaign.agent_id,
          campaign_id: campaign.id,
          status: 'queued',
          customer_phone: contact.phone,
          tags: ['voice-ai', 'broadcast', campaign.name],
        },
      });

      await prisma.campaignContact.update({
        where: { id: contact.id },
        data: {
          status: 'queued',
          call_id: call.id,
        },
      });

      await callQueue.add(
        'outbound-call',
        {
          internalCallId,
          callRecordId: call.id,
          organizationId: campaign.organization_id,
          customerPhone: contact.phone,
          agentId: campaign.agent_id,
          campaignId: campaign.id,
          contactId: contact.id,
          customVariables: (contact.custom_variables as Record<string, any>) || { name: contact.name },
        },
        {
          delay, // Staggered enqueue
          attempts: 1,
        }
      );

      // Increment delay slightly (e.g. 500ms between calls)
      delay += 500;
    }

    return true;
  }

  /**
   * Pauses an active campaign.
   */
  async pauseCampaign(campaignId: string): Promise<boolean> {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'paused' },
    });
    return true;
  }

  /**
   * Stops an active campaign.
   */
  async stopCampaign(campaignId: string): Promise<boolean> {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'stopped' },
    });
    return true;
  }

  /**
   * Fetches real-time analytics for a campaign.
   */
  async getCampaignAnalytics(campaignId: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        agent: { select: { name: true, voice: true } },
      },
    });

    if (!campaign) throw new Error('Campaign not found');

    const [
      total,
      pending,
      queued,
      dialing,
      answered,
      completed,
      busy,
      noAnswer,
      failed,
      optedOut,
    ] = await Promise.all([
      prisma.campaignContact.count({ where: { campaign_id: campaignId } }),
      prisma.campaignContact.count({ where: { campaign_id: campaignId, status: 'pending' } }),
      prisma.campaignContact.count({ where: { campaign_id: campaignId, status: 'queued' } }),
      prisma.campaignContact.count({ where: { campaign_id: campaignId, status: 'dialing' } }),
      prisma.campaignContact.count({ where: { campaign_id: campaignId, status: 'answered' } }),
      prisma.campaignContact.count({ where: { campaign_id: campaignId, status: 'completed' } }),
      prisma.campaignContact.count({ where: { campaign_id: campaignId, status: 'busy' } }),
      prisma.campaignContact.count({ where: { campaign_id: campaignId, status: 'no_answer' } }),
      prisma.campaignContact.count({ where: { campaign_id: campaignId, status: 'failed' } }),
      prisma.campaignContact.count({ where: { campaign_id: campaignId, status: 'opted_out' } }),
    ]);

    return {
      campaign,
      stats: {
        total,
        pending,
        queued,
        dialing,
        answered,
        completed,
        busy,
        noAnswer,
        failed,
        optedOut,
        progressPercent: total > 0 ? Math.round(((completed + failed + optedOut) / total) * 100) : 0,
      },
    };
  }
}

export const campaignService = new CampaignService();
