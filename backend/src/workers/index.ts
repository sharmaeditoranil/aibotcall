import { createCallWorker } from './call-worker.js';
import { createWebhookWorker } from './webhook-worker.js';
import { createReconciliationWorker } from './reconciliation-worker.js';
import { reconciliationQueue } from '../queues/queue-manager.js';
import { logger } from '../utils/logger.js';

logger.info('Starting BullMQ background workers...');

const callWorker = createCallWorker();
const webhookWorker = createWebhookWorker();
const reconciliationWorker = createReconciliationWorker();

// Schedule reconciliation job every 2 minutes
setInterval(async () => {
  try {
    await reconciliationQueue.add('reconcile-calls', {}, { removeOnComplete: true });
  } catch (err: any) {
    logger.debug({ err: err.message }, 'Failed to schedule periodic reconciliation');
  }
}, 120000);

logger.info('All background workers running successfully.');

async function shutdown() {
  logger.info('Shutting down background workers...');
  await Promise.all([callWorker.close(), webhookWorker.close(), reconciliationWorker.close()]);
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
