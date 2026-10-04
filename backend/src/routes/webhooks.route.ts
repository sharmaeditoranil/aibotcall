import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { crmWebhookService } from '../services/crm-webhook.service.js';
import { z } from 'zod';

const TestWebhookSchema = z.object({
  url: z.string().url('A valid HTTP/HTTPS URL is required'),
  secret: z.string().optional().default(''),
  event: z.string().optional().default('voice.call.completed'),
});

export async function webhooksRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/v1/webhooks/deliveries
   * List all CRM outgoing webhook deliveries.
   */
  fastify.get('/api/v1/webhooks/deliveries', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const query = request.query as any;
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const status = query.status as string;

    const where: any = { organization_id: orgId };
    if (status) where.status = status;

    const [deliveries, total] = await Promise.all([
      prisma.webhookDelivery.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.webhookDelivery.count({ where }),
    ]);

    return {
      deliveries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  });

  /**
   * POST /api/v1/webhooks/deliveries/:id/retry
   * Manually trigger re-delivery of a failed webhook from dashboard.
   */
  fastify.post('/api/v1/webhooks/deliveries/:id/retry', async (request, reply) => {
    const orgId = request.user?.organizationId;
    const { id } = request.params as { id: string };

    const delivery = await prisma.webhookDelivery.findFirst({
      where: { id, organization_id: orgId },
    });

    if (!delivery) return reply.status(404).send({ error: 'Webhook delivery record not found' });

    const success = await crmWebhookService.executeDelivery(delivery.id);
    const updated = await prisma.webhookDelivery.findUnique({ where: { id: delivery.id } });

    return {
      success,
      delivery: updated,
      message: success ? 'Webhook delivered successfully' : 'Webhook retry failed, recorded error details',
    };
  });

  /**
   * POST /api/v1/webhooks/test
   * Interactive tester tool for verifying external CRM endpoints.
   */
  fastify.post('/api/v1/webhooks/test', async (request, reply) => {
    const parseResult = TestWebhookSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { url, secret, event } = parseResult.data;
    const result = await crmWebhookService.testWebhook(url, secret, event);

    return result;
  });
}
