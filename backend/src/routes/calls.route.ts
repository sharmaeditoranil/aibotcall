import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { normalizePhoneNumber } from '../utils/phone.js';
import { generateCallId } from '../utils/crypto.js';
import { callQueue } from '../queues/queue-manager.js';
import { providerRegistry } from '../providers/index.js';
import { suppressionService } from '../services/suppression.service.js';
import { z } from 'zod';

const InitiateCallSchema = z.object({
  phone: z.string().min(5),
  name: z.string().optional().default('Customer'),
  agent_id: z.string().uuid(),
  custom_variables: z.record(z.any()).optional().default({}),
});

export async function callsRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/v1/calls
   * List calls with multi-factor filters and pagination.
   */
  fastify.get('/api/v1/calls', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const query = request.query as any;
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = { organization_id: orgId };

    if (query.agent_id) where.agent_id = query.agent_id;
    if (query.campaign_id) where.campaign_id = query.campaign_id;
    if (query.status) where.status = query.status;
    if (query.direction) where.direction = query.direction;
    if (query.qualification_status) where.qualification_status = query.qualification_status;
    if (query.phone) where.customer_phone = { contains: query.phone };

    if (query.start_date || query.end_date) {
      where.created_at = {};
      if (query.start_date) where.created_at.gte = new Date(query.start_date);
      if (query.end_date) where.created_at.lte = new Date(query.end_date);
    }

    const [calls, total] = await Promise.all([
      prisma.call.findMany({
        where,
        include: {
          agent: { select: { id: true, name: true, voice: true } },
          campaign: { select: { id: true, name: true } },
          lead: { select: { id: true, name: true, email: true, city: true, service: true } },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.call.count({ where }),
    ]);

    return {
      calls,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  });

  /**
   * GET /api/v1/calls/:id
   * Get full details of a specific call including transcripts, events timeline,
   * qualification, and CRM webhook deliveries.
   */
  fastify.get('/api/v1/calls/:id', async (request, reply) => {
    const orgId = request.user?.organizationId;
    const { id } = request.params as { id: string };

    const call = await prisma.call.findFirst({
      where: {
        organization_id: orgId,
        OR: [{ id }, { internal_call_id: id }, { provider_call_id: id }],
      },
      include: {
        agent: true,
        campaign: true,
        lead: true,
        transcripts: { orderBy: { created_at: 'asc' } },
        events: { orderBy: { created_at: 'asc' } },
      },
    });

    if (!call) {
      return reply.status(404).send({ error: 'Call not found' });
    }

    // Fetch CRM deliveries for this call
    const deliveries = await prisma.webhookDelivery.findMany({
      where: { call_id: call.id },
      orderBy: { created_at: 'desc' },
    });

    return {
      call,
      webhook_deliveries: deliveries,
    };
  });

  /**
   * POST /api/v1/calls
   * Initiate an immediate single outbound voice call.
   */
  fastify.post('/api/v1/calls', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const parseResult = InitiateCallSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { phone, name, agent_id, custom_variables } = parseResult.data;
    const { isValid, e164, error } = normalizePhoneNumber(phone);

    if (!isValid) {
      return reply.status(400).send({ error: error || 'Invalid phone format' });
    }

    // Suppression check
    const isSuppressed = await suppressionService.isSuppressed(orgId, e164);
    if (isSuppressed) {
      return reply.status(400).send({
        error: 'Cannot dial number: Phone is registered on the Do Not Call suppression list.',
      });
    }

    const internalCallId = generateCallId();

    const call = await prisma.call.create({
      data: {
        organization_id: orgId,
        internal_call_id: internalCallId,
        provider: 'exotel',
        direction: 'outbound',
        agent_id,
        status: 'queued',
        customer_phone: e164,
        tags: ['voice-ai', 'manual-call'],
      },
      include: { agent: true },
    });

    // Enqueue call
    await callQueue.add(
      'outbound-call',
      {
        internalCallId,
        callRecordId: call.id,
        organizationId: orgId,
        customerPhone: e164,
        agentId: agent_id,
        customVariables: { name, ...custom_variables },
      },
      { priority: 1 }
    );

    return reply.status(201).send({
      success: true,
      call_id: internalCallId,
      status: 'queued',
      message: 'Call queued successfully.',
    });
  });

  /**
   * POST /api/v1/calls/:id/hangup
   * Hang up an active call.
   */
  fastify.post('/api/v1/calls/:id/hangup', async (request, reply) => {
    const orgId = request.user?.organizationId;
    const { id } = request.params as { id: string };

    const call = await prisma.call.findFirst({
      where: {
        organization_id: orgId,
        OR: [{ id }, { internal_call_id: id }],
      },
    });

    if (!call) return reply.status(404).send({ error: 'Call not found' });

    if (call.provider_call_id) {
      const provider = providerRegistry.get(call.provider);
      await provider.hangupCall(call.provider_call_id);
    }

    await prisma.call.update({
      where: { id: call.id },
      data: { status: 'completed', ended_at: new Date() },
    });

    return { success: true, message: 'Hangup command issued' };
  });
}
