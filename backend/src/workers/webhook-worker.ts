import { Worker, Job } from 'bullmq';
import { getRedisClient } from '../queues/queue-manager.js';
import { crmWebhookService } from '../services/crm-webhook.service.js';
import { logger } from '../utils/logger.js';

export interface WebhookJobData {
  deliveryId: string;
}

export function createWebhookWorker(): Worker {
  const worker = new Worker(
    'crm-webhooks',
    async (job: Job<WebhookJobData>) => {
      const { deliveryId } = job.data;
      logger.info({ jobId: job.id, deliveryId }, 'Processing CRM webhook delivery job');
      await crmWebhookService.executeDelivery(deliveryId);
    },
    {
      connection: getRedisClient(),
      concurrency: 5,
    }
  );

  worker.on('failed', (job, err) => {
    logger.warn({ jobId: job?.id, err: err.message }, 'CRM Webhook delivery worker job failed');
  });

  return worker;
}
