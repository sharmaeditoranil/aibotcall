import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth.js';
import { suppressionService } from '../services/suppression.service.js';
import { z } from 'zod';

const AddSuppressionSchema = z.object({
  phone: z.string().min(5),
  reason: z.string().optional().default('Manual DNC request'),
});

export async function suppressionRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/v1/suppression
   */
  fastify.get('/api/v1/suppression', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const query = request.query as any;
    const search = query.search as string;
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '50', 10);

    const result = await suppressionService.listSuppression(
      orgId,
      search,
      (page - 1) * limit,
      limit
    );

    return {
      items: result.items,
      total: result.total,
      page,
      limit,
    };
  });

  /**
   * POST /api/v1/suppression
   */
  fastify.post('/api/v1/suppression', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const parseResult = AddSuppressionSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { phone, reason } = parseResult.data;
    await suppressionService.addSuppression(orgId, phone, reason, 'manual_admin');

    return reply.status(201).send({
      success: true,
      message: 'Phone added to suppression list',
    });
  });

  /**
   * DELETE /api/v1/suppression/:id
   */
  fastify.delete('/api/v1/suppression/:id', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });
    const { id } = request.params as { id: string };

    const success = await suppressionService.removeSuppression(orgId, id);
    return { success, message: 'Removed from suppression list' };
  });
}
