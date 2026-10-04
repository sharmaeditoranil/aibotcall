import { Worker, Job } from 'bullmq';
import { getRedisClient } from '../queues/queue-manager.js';
import { prisma } from '../db/prisma.js';
import { providerRegistry } from '../providers/index.js';
import { suppressionService } from '../services/suppression.service.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export interface CallJobData {
  internalCallId: string;
  callRecordId: string;
  organizationId: string;
  customerPhone: string;
  agentId: string;
  leadId?: string;
  campaignId?: string;
  contactId?: string;
  customVariables?: Record<string, any>;
}

let activeWorker: Worker | null = null;

export function createCallWorker(): Worker {
  if (activeWorker) return activeWorker;

  logger.info('🚀 Initializing Call Worker (BullMQ queue: voice-calls)...');
  const worker = new Worker(
    'voice-calls',
    async (job: Job<CallJobData>) => {
      const {
        internalCallId,
        callRecordId,
        organizationId,
        customerPhone,
        agentId,
        campaignId,
        contactId,
        customVariables,
      } = job.data;

      logger.info({ jobId: job.id, internalCallId, customerPhone }, 'Processing outbound call job');

      // 1. Strict pre-dial suppression check
      const isSuppressed = await suppressionService.isSuppressed(organizationId, customerPhone);
      if (isSuppressed) {
        logger.info({ internalCallId, customerPhone }, 'Pre-dial suppression detected, cancelling call');
        await prisma.call.update({
          where: { id: callRecordId },
          data: {
            status: 'cancelled',
            qualification_status: 'Do Not Call',
            summary: 'Call skipped because phone is on suppression / DNC list.',
          },
        });
        if (contactId) {
          await prisma.campaignContact.update({
            where: { id: contactId },
            data: { status: 'opted_out' },
          });
        }
        return;
      }

      // 1b. SaaS Credit Balance Check
      const org = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { credits_balance_minutes: true },
      });

      if (org && org.credits_balance_minutes <= 0) {
        logger.warn({ internalCallId, organizationId }, 'Outbound call cancelled: Subscription minutes and Pay As You Go backup credits are exhausted');
        await prisma.call.update({
          where: { id: callRecordId },
          data: {
            status: 'cancelled',
            summary: 'Call declined: Subscription minutes & Pay As You Go backup credits exhausted. Top up Pay As You Go minutes (₹4.87/min) to resume calling.',
          },
        });
        if (contactId) {
          await prisma.campaignContact.update({
            where: { id: contactId },
            data: { status: 'failed' },
          });
        }
        return;
      }

      // 2. Fetch call details
      const call = await prisma.call.findUnique({
        where: { id: callRecordId },
        include: { agent: true },
      });

      if (!call) {
        throw new Error(`Call record ${callRecordId} not found`);
      }

      // 3. Select Telephony Provider (Default Exotel)
      const provider = providerRegistry.get(call.provider || 'exotel');

      // Construct Stream URL and Status Callback URL
      // Exotel connects to this WSS stream URL on call pickup
      const streamUrl = `${config.exotel.streamUrl}?internal_call_id=${encodeURIComponent(
        internalCallId
      )}&agent_id=${encodeURIComponent(agentId)}`;

      const statusCallbackUrl = `${config.webhooks.publicBaseUrl}/api/v1/webhooks/exotel/status`;

      // 4. Trigger Outbound Call via Provider
      const result = await provider.makeCall({
        to: customerPhone,
        from: config.exotel.callerId,
        internalCallId,
        agentId,
        streamUrl,
        statusCallbackUrl,
        maxDuration: call.agent.max_call_duration_seconds || config.telephony.defaultMaxCallDuration,
        customFields: {
          campaignId,
          contactId,
          ...customVariables,
        },
      });

      // 5. Update call record with provider response
      if (result.success) {
        await prisma.call.update({
          where: { id: callRecordId },
          data: {
            status: 'initiated',
            provider_call_id: result.providerCallId,
            started_at: new Date(),
          },
        });

        if (contactId) {
          await prisma.campaignContact.update({
            where: { id: contactId },
            data: {
              status: 'dialing',
              call_id: callRecordId,
              last_attempt_at: new Date(),
              attempts: { increment: 1 },
            },
          });
        }

        logger.info(
          { internalCallId, providerCallId: result.providerCallId },
          'Call initiated successfully via telephony provider'
        );
      } else {
        await prisma.call.update({
          where: { id: callRecordId },
          data: {
            status: 'failed',
            provider_error: result.error || 'Failed to place call via provider',
            summary: `Call failed: ${result.error || 'Provider rejected request'}`,
          },
        });

        if (contactId) {
          await prisma.campaignContact.update({
            where: { id: contactId },
            data: {
              status: 'failed',
              last_attempt_at: new Date(),
              attempts: { increment: 1 },
            },
          });
        }

        logger.error(
          { internalCallId, error: result.error },
          'Telephony provider rejected outbound call'
        );
      }
    },
    {
      connection: getRedisClient(),
      concurrency: config.telephony.concurrency,
      limiter: {
        max: 10,
        duration: 1000, // Maximum 10 calls initiated per second to satisfy telecom rate limits
      },
    }
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err: err.message }, 'Call worker job failed');
  });

  activeWorker = worker;
  return worker;
}

// Auto-initialize singleton worker so it starts whenever loaded
createCallWorker();

