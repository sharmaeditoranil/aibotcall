import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { z } from 'zod';

const KnowledgeItemSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  content: z.string().min(1),
  agent_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true),
});

export async function knowledgeRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/v1/knowledge-base
   */
  fastify.get('/api/v1/knowledge-base', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const query = request.query as any;
    const where: any = { organization_id: orgId };

    if (query.agent_id) where.agent_id = query.agent_id;
    if (query.category) where.category = query.category;

    const items = await prisma.knowledgeBase.findMany({
      where,
      include: {
        agent: { select: { id: true, name: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return { items };
  });

  /**
   * POST /api/v1/knowledge-base
   */
  fastify.post('/api/v1/knowledge-base', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const parseResult = KnowledgeItemSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const item = await prisma.knowledgeBase.create({
      data: {
        organization_id: orgId,
        ...parseResult.data,
      },
    });

    return reply.status(201).send({ success: true, item });
  });

  /**
   * POST /api/v1/knowledge-base/bulk
   * 1-Click Import Multi-Industry Knowledge Packs
   */
  fastify.post('/api/v1/knowledge-base/bulk', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const body = request.body as { items: Array<{ title: string; category: string; content: string; agent_id?: string | null }> };
    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return reply.status(400).send({ error: 'Invalid payload: items array required' });
    }

    const created = await prisma.$transaction(
      body.items.map((item) =>
        prisma.knowledgeBase.create({
          data: {
            organization_id: orgId,
            title: item.title,
            category: item.category,
            content: item.content,
            agent_id: item.agent_id || null,
            is_active: true,
          },
        })
      )
    );

    return reply.status(201).send({ success: true, count: created.length, items: created });
  });

  /**
   * PUT /api/v1/knowledge-base/:id
   */
  fastify.put('/api/v1/knowledge-base/:id', async (request, reply) => {
    const orgId = request.user?.organizationId;
    const { id } = request.params as { id: string };

    const parseResult = KnowledgeItemSchema.partial().safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    await prisma.knowledgeBase.updateMany({
      where: { id, organization_id: orgId },
      data: parseResult.data,
    });

    const updated = await prisma.knowledgeBase.findUnique({ where: { id } });
    return { success: true, item: updated };
  });

  /**
   * DELETE /api/v1/knowledge-base/:id
   */
  fastify.delete('/api/v1/knowledge-base/:id', async (request, reply) => {
    const orgId = request.user?.organizationId;
    const { id } = request.params as { id: string };

    await prisma.knowledgeBase.deleteMany({
      where: { id, organization_id: orgId },
    });

    return { success: true, message: 'Knowledge item deleted' };
  });
}
