import axios from 'axios';
import { prisma } from '../db/prisma.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { generateEventId, generateHmacSignature } from '../utils/crypto.js';
import { webhookQueue } from '../queues/queue-manager.js';

export class CrmWebhookService {
  /**
   * Builds the structured CRM payload and creates a WebhookDelivery record,
   * then enqueues it for guaranteed delivery with exponential backoff.
   */
  async dispatchCallCompletedWebhook(callId: string): Promise<string | null> {
    const call = await prisma.call.findUnique({
      where: { id: callId },
      include: {
        lead: true,
        agent: true,
        transcripts: {
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!call) return null;

    // Determine target webhook URL (Agent specific override or global default)
    const targetUrl = call.agent.crm_webhook_url || config.webhooks.crmWebhookUrl;
    if (!targetUrl) {
      logger.info(
        { callId: call.internal_call_id },
        'No CRM_WEBHOOK_URL configured, skipping outgoing webhook'
      );
      return null;
    }

    const eventId = generateEventId('evt_voice');
    const qualificationData = (call.qualification_data as Record<string, any>) || {};

    const payload = {
      event: 'voice.call.completed',
      event_id: eventId,
      call_id: call.internal_call_id,
      provider_call_id: call.provider_call_id || null,
      lead: {
        lead_id: call.lead?.external_lead_id || call.lead?.id || null,
        name: call.lead?.name || 'Customer',
        phone: call.customer_phone,
        email: call.lead?.email || null,
        city: call.lead?.city || null,
        service: call.lead?.service || null,
        source: call.lead?.source || (call.campaign_id ? 'Voice Broadcast' : 'Direct Call'),
      },
      direction: call.direction,
      campaign_id: call.campaign_id || null,
      agent_id: call.agent_id,
      call_status: call.status,
      started_at: call.started_at ? call.started_at.toISOString() : null,
      answered_at: call.answered_at ? call.answered_at.toISOString() : null,
      ended_at: call.ended_at ? call.ended_at.toISOString() : new Date().toISOString(),
      duration_seconds: call.duration_seconds,
      recording_url: call.recording_url || null,
      qualification: {
        status: call.qualification_status || 'Unknown',
        course: qualificationData.course_interest || call.lead?.service || null,
        mode: qualificationData.mode_preference || null,
        joining_time: qualificationData.joining_timeline || null,
      },
      callback: {
        requested: call.callback_requested,
        preferred_time: call.callback_preferred_time || '',
        note: call.callback_note || '',
      },
      summary: call.summary || 'AI Voice Call Completed',
      important_points: (call.important_points as string[]) || [],
      next_action: call.next_action || 'Follow Up',
      tags: (call.tags as string[]) || ['voice-ai', call.campaign_id ? 'broadcast' : 'website-lead'],
      transcript: call.transcripts.map((t) => ({
        speaker: t.speaker,
        text: t.text,
      })),
      metadata: (call.technical_meta as Record<string, any>) || {},
    };

    // Create delivery record in database
    const delivery = await prisma.webhookDelivery.create({
      data: {
        organization_id: call.organization_id,
        call_id: call.id,
        endpoint_url: targetUrl,
        event: 'voice.call.completed',
        event_id: eventId,
        payload: payload as any,
        status: 'pending',
        attempt_count: 0,
        max_attempts: 5,
      },
    });

    // Add to BullMQ webhook retry queue for reliable delivery
    try {
      await webhookQueue.add(
        'deliver-crm-webhook',
        { deliveryId: delivery.id },
        {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 60000, // 1 min, 5 min, 15 min, 1 hr handled by worker
          },
          removeOnComplete: true,
        }
      );
    } catch (err: any) {
      logger.warn(
        { deliveryId: delivery.id, err: err.message },
        'Redis queue unavailable, attempting direct inline delivery'
      );
      await this.executeDelivery(delivery.id);
    }

    return delivery.id;
  }

  /**
   * Executes HTTP POST delivery to CRM endpoint with HMAC-SHA256 signature.
   */
  async executeDelivery(deliveryId: string): Promise<boolean> {
    const delivery = await prisma.webhookDelivery.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) return false;

    const payloadJson = JSON.stringify(delivery.payload);
    const signature = generateHmacSignature(payloadJson, config.webhooks.crmWebhookSecret);
    const attempt = delivery.attempt_count + 1;

    try {
      logger.info(
        { deliveryId, endpoint: delivery.endpoint_url, attempt },
        'Delivering CRM outgoing webhook'
      );

      const startTime = Date.now();
      const response = await axios.post(delivery.endpoint_url, delivery.payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-AiBotFlow-Signature': signature,
          'X-Event-ID': delivery.event_id,
          'User-Agent': 'AiBotFlow-Voice-Gateway/1.0',
        },
        timeout: 10000,
      });

      const durationMs = Date.now() - startTime;

      await prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'delivered',
          http_status: response.status,
          attempt_count: attempt,
          last_attempt_at: new Date(),
          last_error: null,
          next_retry_at: null,
        },
      });

      logger.info(
        { deliveryId, status: response.status, durationMs },
        'CRM webhook delivered successfully'
      );
      return true;
    } catch (err: any) {
      const httpStatus = err.response?.status || null;
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;

      // Determine next retry interval:
      // Attempt 1: 1 min, Attempt 2: 5 min, Attempt 3: 15 min, Attempt 4: 60 min
      const intervals = [60, 300, 900, 3600];
      const nextDelaySeconds = intervals[Math.min(attempt - 1, intervals.length - 1)];
      const nextRetryAt = attempt < delivery.max_attempts ? new Date(Date.now() + nextDelaySeconds * 1000) : null;
      const finalStatus = attempt >= delivery.max_attempts ? 'failed' : 'retrying';

      await prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: finalStatus,
          http_status: httpStatus,
          attempt_count: attempt,
          last_attempt_at: new Date(),
          next_retry_at: nextRetryAt,
          last_error: errorMsg.slice(0, 500),
        },
      });

      logger.warn(
        { deliveryId, attempt, finalStatus, error: errorMsg },
        'Failed to deliver CRM webhook'
      );

      if (finalStatus === 'retrying') {
        throw new Error(`Webhook delivery failed with status ${httpStatus}: ${errorMsg}`);
      }

      return false;
    }
  }

  /**
   * Interactive tester for admin to test any CRM Webhook URL with a sample payload.
   */
  async testWebhook(
    url: string,
    secret: string,
    sampleEvent = 'voice.call.completed'
  ): Promise<{ success: boolean; status?: number; responseTimeMs: number; responseData?: any; error?: string }> {
    const eventId = generateEventId('test_evt');
    const testPayload = {
      event: sampleEvent,
      event_id: eventId,
      call_id: 'call_test_12345',
      provider_call_id: 'exo_test_67890',
      lead: {
        lead_id: 'TEST-LEAD-001',
        name: 'Rahul Kumar (Test)',
        phone: '+919876543210',
        email: 'rahul.test@example.com',
        city: 'Patna',
        service: 'Video Editing Course',
        source: 'Webhook Tester',
      },
      direction: 'outbound',
      campaign_id: null,
      agent_id: 'agent_sample_ritu',
      call_status: 'completed',
      started_at: new Date(Date.now() - 120000).toISOString(),
      answered_at: new Date(Date.now() - 115000).toISOString(),
      ended_at: new Date().toISOString(),
      duration_seconds: 115,
      recording_url: 'https://example.com/recordings/test.wav',
      qualification: {
        status: 'Interested',
        course: 'Video Editing Course',
        mode: 'Offline',
        joining_time: 'This Month',
      },
      callback: {
        requested: true,
        preferred_time: 'Tomorrow 11 AM',
        note: 'Customer wants syllabus breakdown',
      },
      summary: 'Customer expressed high interest in offline video editing batch.',
      important_points: ['Budget confirmed', 'Prefers weekend batch'],
      next_action: 'Sales callback',
      tags: ['voice-ai', 'test-event'],
      transcript: [
        { speaker: 'assistant', text: 'Namaste Rahul ji, main Quick Art Academy se bol rahi hoon.' },
        { speaker: 'customer', text: 'Haan ji, mujhe offline course ki jaankari chahiye.' },
      ],
      metadata: { test_mode: true },
    };

    const signature = generateHmacSignature(JSON.stringify(testPayload), secret || config.webhooks.crmWebhookSecret);
    const start = Date.now();

    try {
      const response = await axios.post(url, testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'X-AiBotFlow-Signature': signature,
          'X-Event-ID': eventId,
          'User-Agent': 'AiBotFlow-Voice-Gateway-Tester/1.0',
        },
        timeout: 8000,
      });

      return {
        success: response.status >= 200 && response.status < 300,
        status: response.status,
        responseTimeMs: Date.now() - start,
        responseData: response.data,
      };
    } catch (err: any) {
      return {
        success: false,
        status: err.response?.status,
        responseTimeMs: Date.now() - start,
        error: err.response?.data ? JSON.stringify(err.response.data) : err.message,
      };
    }
  }
}

export const crmWebhookService = new CrmWebhookService();
