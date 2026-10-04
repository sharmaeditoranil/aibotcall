import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { getRedisClient } from '../queues/queue-manager.js';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  });

  fastify.get('/ready', async (_req, reply) => {
    let dbStatus = 'healthy';
    let redisStatus = 'healthy';

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'degraded';
    }

    try {
      const redis = getRedisClient();
      await redis.ping();
    } catch {
      redisStatus = 'degraded';
    }

    const isReady = dbStatus === 'healthy' && redisStatus === 'healthy';

    return reply.status(isReady ? 200 : 503).send({
      ready: isReady,
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
      timestamp: new Date().toISOString(),
    });
  });
}
