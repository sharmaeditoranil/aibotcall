import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { z } from 'zod';

const AgentSchema = z.object({
  name: z.string().min(1),
  company_name: z.string().min(1),
  agent_role: z.string().min(1),
  language: z.string().default('hi-IN'),
  voice: z.string().default('alloy'),
  welcome_message: z.string().min(1),
  system_prompt: z.string().min(10),
  objective: z.string().min(1),
  qualification_questions: z.any().optional().default([]),
  max_call_duration_seconds: z.number().int().min(30).max(1800).default(300),
  end_call_rules: z.any().optional().default([]),
  recording_enabled: z.boolean().default(true),
  ai_disclosure_enabled: z.boolean().default(true),
  ai_disclosure_text: z.string().optional(),
  recording_disclosure_enabled: z.boolean().default(false),
  recording_disclosure_text: z.string().optional(),
  crm_webhook_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export async function agentsRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/v1/agents
   */
  fastify.get('/api/v1/agents', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const agents = await prisma.voiceAgent.findMany({
      where: { organization_id: orgId },
      include: {
        _count: {
          select: { calls: true, campaigns: true, knowledge_items: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return { agents };
  });

  /**
   * GET /api/v1/agents/:id
   */
  fastify.get('/api/v1/agents/:id', async (request, reply) => {
    const orgId = request.user?.organizationId;
    const { id } = request.params as { id: string };

    const agent = await prisma.voiceAgent.findFirst({
      where: { id, organization_id: orgId },
      include: {
        knowledge_items: true,
      },
    });

    if (!agent) return reply.status(404).send({ error: 'Agent not found' });
    return { agent };
  });

  /**
   * POST /api/v1/agents
   */
  fastify.post('/api/v1/agents', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const parseResult = AgentSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const data = parseResult.data;
    const agent = await prisma.voiceAgent.create({
      data: {
        organization_id: orgId,
        ...data,
      },
    });

    return reply.status(201).send({ success: true, agent });
  });

  /**
   * PUT /api/v1/agents/:id
   */
  fastify.put('/api/v1/agents/:id', async (request, reply) => {
    const orgId = request.user?.organizationId;
    const { id } = request.params as { id: string };

    const parseResult = AgentSchema.partial().safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const agent = await prisma.voiceAgent.updateMany({
      where: { id, organization_id: orgId },
      data: parseResult.data,
    });

    if (agent.count === 0) {
      return reply.status(404).send({ error: 'Agent not found' });
    }

    const updated = await prisma.voiceAgent.findUnique({ where: { id } });
    return { success: true, agent: updated };
  });
}
