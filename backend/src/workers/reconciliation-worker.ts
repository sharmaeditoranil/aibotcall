import { Worker, Job } from 'bullmq';
import { getRedisClient } from '../queues/queue-manager.js';
import { prisma } from '../db/prisma.js';
import { providerRegistry } from '../providers/index.js';
import { logger } from '../utils/logger.js';

export function createReconciliationWorker(): Worker {
  const worker = new Worker(
    'status-reconciliation',
    async (job: Job) => {
      logger.info('Running call status reconciliation job');

      // Find calls in non-terminal states created more than 3 minutes ago
      const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
      const pendingCalls = await prisma.call.findMany({
        where: {
          status: { in: ['initiated', 'ringing'] },
          created_at: { lte: threeMinutesAgo },
          provider_call_id: { not: null },
        },
        take: 20,
      });

      for (const call of pendingCalls) {
        if (!call.provider_call_id) continue;
        try {
          const provider = providerRegistry.get(call.provider);
          const statusResult = await provider.getCallStatus(call.provider_call_id);

          if (statusResult.status !== 'unknown' && statusResult.status !== 'ringing' && statusResult.status !== 'queued') {
            logger.info(
              { internalCallId: call.internal_call_id, status: statusResult.status },
              'Reconciliation updated call status from provider'
            );

            await prisma.call.update({
              where: { id: call.id },
              data: {
                status: statusResult.status as any,
                duration_seconds: statusResult.duration || call.duration_seconds,
                recording_url: statusResult.recordingUrl || call.recording_url,
                ended_at: statusResult.endedAt || new Date(),
              },
            });
          }
        } catch (err: any) {
          logger.warn(
            { internalCallId: call.internal_call_id, err: err.message },
            'Failed to reconcile call status'
          );
        }
      }
    },
    {
      connection: getRedisClient(),
      concurrency: 1,
    }
  );

  return worker;
}
