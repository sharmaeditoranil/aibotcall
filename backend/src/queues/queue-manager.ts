import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

let sharedRedis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!sharedRedis) {
    sharedRedis = new Redis(config.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
    });

    sharedRedis.on('connect', () => {
      logger.info('Connected to Redis');
    });

    sharedRedis.on('error', (err) => {
      logger.error({ err: err.message }, 'Redis connection error');
    });
  }

  return sharedRedis;
}

// Job Queues
export const callQueue = new Queue('voice-calls', {
  connection: getRedisClient(),
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

export const webhookQueue = new Queue('crm-webhooks', {
  connection: getRedisClient(),
  defaultJobOptions: {
    removeOnComplete: 500,
    removeOnFail: 1000,
  },
});

export const campaignQueue = new Queue('campaign-scheduler', {
  connection: getRedisClient(),
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

export const reconciliationQueue = new Queue('status-reconciliation', {
  connection: getRedisClient(),
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});
