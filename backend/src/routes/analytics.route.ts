import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';

export async function analyticsRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/v1/analytics/overview
   * Computes genuine, real database metrics for the organization.
   */
  fastify.get('/api/v1/analytics/overview', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const [
      totalCalls,
      answeredCalls,
      noAnswerCalls,
      busyCalls,
      failedCalls,
      interestedCalls,
      qualifiedCalls,
      callbackRequestedCalls,
      optOutCalls,
      durationStats,
      recentCalls,
      broadcastStats,
    ] = await Promise.all([
      prisma.call.count({ where: { organization_id: orgId } }),
      prisma.call.count({ where: { organization_id: orgId, status: { in: ['in_progress', 'completed'] } } }),
      prisma.call.count({ where: { organization_id: orgId, status: 'no_answer' } }),
      prisma.call.count({ where: { organization_id: orgId, status: 'busy' } }),
      prisma.call.count({ where: { organization_id: orgId, status: 'failed' } }),
      prisma.call.count({ where: { organization_id: orgId, qualification_status: 'Interested' } }),
      prisma.call.count({ where: { organization_id: orgId, qualification_status: 'Qualified' } }),
      prisma.call.count({ where: { organization_id: orgId, callback_requested: true } }),
      prisma.suppressionList.count({ where: { organization_id: orgId } }),
      prisma.call.aggregate({
        where: { organization_id: orgId, duration_seconds: { gt: 0 } },
        _avg: { duration_seconds: true },
        _sum: { duration_seconds: true },
      }),
      prisma.call.findMany({
        where: { organization_id: orgId },
        include: {
          agent: { select: { name: true } },
          lead: { select: { name: true } },
        },
        orderBy: { created_at: 'desc' },
        take: 8,
      }),
      prisma.campaignContact.groupBy({
        by: ['status'],
        where: { campaign: { organization_id: orgId } },
        _count: true,
      }),
    ]);

    // Aggregate campaign contact statuses
    const campaignCounts: Record<string, number> = {
      total: 0,
      queued: 0,
      dialed: 0,
      answered: 0,
      completed: 0,
      failed: 0,
      opt_out: 0,
    };

    for (const group of broadcastStats) {
      campaignCounts.total += group._count;
      if (group.status === 'queued') campaignCounts.queued += group._count;
      else if (group.status === 'dialing') campaignCounts.dialed += group._count;
      else if (group.status === 'answered') campaignCounts.answered += group._count;
      else if (group.status === 'completed') campaignCounts.completed += group._count;
      else if (group.status === 'failed') campaignCounts.failed += group._count;
      else if (group.status === 'opted_out') campaignCounts.opt_out += group._count;
    }

    const avgDuration = Math.round(durationStats._avg.duration_seconds || 0);
    const totalDuration = durationStats._sum.duration_seconds || 0;

    return {
      overview: {
        total_calls: totalCalls,
        answered: answeredCalls,
        no_answer: noAnswerCalls,
        busy: busyCalls,
        failed: failedCalls,
        interested: interestedCalls,
        qualified: qualifiedCalls,
        callback_requested: callbackRequestedCalls,
        opt_out: optOutCalls,
        avg_duration_seconds: avgDuration,
        total_duration_minutes: Math.round(totalDuration / 60),
      },
      broadcast: campaignCounts,
      recent_calls: recentCalls,
    };
  });
}
