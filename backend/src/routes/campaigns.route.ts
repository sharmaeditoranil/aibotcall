import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { campaignService } from '../services/campaign.service.js';
import { z } from 'zod';

const CreateCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  agent_id: z.string().uuid('Valid agent ID required'),
  scheduled_at: z.string().optional(),
  concurrency_limit: z.number().int().min(1).max(50).optional().default(5),
  retry_on_busy: z.boolean().optional().default(true),
  retry_on_no_answer: z.boolean().optional().default(false),
  max_retries: z.number().int().min(0).max(5).optional().default(2),
  retry_delay_minutes: z.number().int().min(1).max(1440).optional().default(15),
});

const ImportCsvSchema = z.object({
  csv_content: z.string().min(5),
  mapping: z.object({
    nameField: z.string().default('Name'),
    phoneField: z.string().default('Phone'),
    emailField: z.string().optional(),
    cityField: z.string().optional(),
    leadIdField: z.string().optional(),
    courseField: z.string().optional(),
  }),
});

export async function campaignsRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/v1/campaigns
   */
  fastify.get('/api/v1/campaigns', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const campaigns = await prisma.campaign.findMany({
      where: { organization_id: orgId },
      include: {
        agent: { select: { id: true, name: true, voice: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return { campaigns };
  });

  /**
   * POST /api/v1/campaigns
   */
  fastify.post('/api/v1/campaigns', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const parseResult = CreateCampaignSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const data = parseResult.data;
    const campaign = await campaignService.createCampaign({
      organizationId: orgId,
      name: data.name,
      agentId: data.agent_id,
      scheduledAt: data.scheduled_at,
      concurrencyLimit: data.concurrency_limit,
      retryOnBusy: data.retry_on_busy,
      retryOnNoAnswer: data.retry_on_no_answer,
      maxRetries: data.max_retries,
      retryDelayMinutes: data.retry_delay_minutes,
    });

    return reply.status(201).send({ success: true, campaign });
  });

  /**
   * GET /api/v1/campaigns/:id
   */
  fastify.get('/api/v1/campaigns/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const data = await campaignService.getCampaignAnalytics(id);
      return data;
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  /**
   * POST /api/v1/campaigns/:id/contacts/csv
   */
  fastify.post('/api/v1/campaigns/:id/contacts/csv', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parseResult = ImportCsvSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { csv_content, mapping } = parseResult.data;

    try {
      const result = await campaignService.importContactsFromCsv(id, csv_content, mapping);
      return {
        success: true,
        imported: result.imported,
        skipped: result.skipped,
        errors: result.errors.slice(0, 10),
      };
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  /**
   * POST /api/v1/campaigns/:id/start
   */
  fastify.post('/api/v1/campaigns/:id/start', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await campaignService.startCampaign(id);
      return { success: true, message: 'Campaign started successfully' };
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  /**
   * POST /api/v1/campaigns/:id/pause
   */
  fastify.post('/api/v1/campaigns/:id/pause', async (request, reply) => {
    const { id } = request.params as { id: string };
    await campaignService.pauseCampaign(id);
    return { success: true, message: 'Campaign paused' };
  });

  /**
   * POST /api/v1/campaigns/:id/resume
   */
  fastify.post('/api/v1/campaigns/:id/resume', async (request, reply) => {
    const { id } = request.params as { id: string };
    await campaignService.startCampaign(id);
    return { success: true, message: 'Campaign resumed' };
  });

  /**
   * POST /api/v1/campaigns/:id/stop
   */
  fastify.post('/api/v1/campaigns/:id/stop', async (request, reply) => {
    const { id } = request.params as { id: string };
    await campaignService.stopCampaign(id);
    return { success: true, message: 'Campaign stopped' };
  });
}
