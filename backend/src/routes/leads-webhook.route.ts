import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { validateIncomingWebhook } from '../middleware/api-key.js';
import { leadService } from '../services/lead.service.js';
import { logger } from '../utils/logger.js';

// Strict schema validation for incoming website leads
const IncomingLeadSchema = z.object({
  lead_id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(100),
  phone: z.string().min(5, 'Phone number is required').max(25),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().max(100).optional(),
  service: z.string().max(150).optional(),
  source: z.string().max(100).optional().default('Website'),
  message: z.string().max(2000).optional(),
  consent: z.boolean({
    required_error: 'Consent boolean flag is required for automated voice calls',
  }),
  consent_timestamp: z.string().optional(),
  agent_id: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional().default({}),
});

export async function leadsWebhookRoute(fastify: FastifyInstance) {
  /**
   * Primary Webhook Ingestion: POST /api/v1/webhooks/leads
   * Receives leads from website or external CRM, validates authentication,
   * consent and DNC, safely queues the AI Voice Call, and immediately returns HTTP 200.
   */
  fastify.post(
    '/api/v1/webhooks/leads',
    {
      preHandler: [validateIncomingWebhook],
    },
    async (request, reply) => {
      const startTime = Date.now();
      const parseResult = IncomingLeadSchema.safeParse(request.body);

      if (!parseResult.success) {
        logger.warn(
          { errors: parseResult.error.flatten() },
          'Invalid incoming lead payload schema'
        );
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        });
      }

      const leadData = parseResult.data;
      const organizationId = request.user?.organizationId;

      if (!organizationId) {
        return reply.status(400).send({
          success: false,
          error: 'Missing organization context',
        });
      }

      try {
        const result = await leadService.processIncomingLead({
          organizationId,
          lead_id: leadData.lead_id,
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          city: leadData.city,
          service: leadData.service,
          source: leadData.source,
          message: leadData.message,
          consent: leadData.consent,
          consent_timestamp: leadData.consent_timestamp,
          metadata: leadData.metadata,
          agentId: leadData.agent_id,
        });

        const processingTimeMs = Date.now() - startTime;
        logger.info(
          {
            leadId: result.leadId,
            callId: result.callId,
            status: result.status,
            processingTimeMs,
          },
          'Incoming lead processed and queued'
        );

        return reply.status(200).send({
          success: result.success,
          lead_id: result.leadId,
          call_id: result.callId,
          status: result.status,
          message: result.message,
          timestamp: new Date().toISOString(),
        });
      } catch (err: any) {
        logger.error(
          { phone: leadData.phone, error: err.message },
          'Error processing incoming lead webhook'
        );
        return reply.status(500).send({
          success: false,
          error: 'Internal server error processing lead call',
          message: err.message,
        });
      }
    }
  );
}
