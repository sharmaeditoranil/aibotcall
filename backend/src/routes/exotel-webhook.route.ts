import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { providerRegistry } from '../providers/index.js';
import { logger } from '../utils/logger.js';
import { crmWebhookService } from '../services/crm-webhook.service.js';

export async function exotelWebhookRoute(fastify: FastifyInstance) {
  /**
   * Status callback endpoint from Exotel:
   * POST /api/v1/webhooks/exotel/status
   */
  fastify.post('/api/v1/webhooks/exotel/status', async (request, reply) => {
    const query = (request.query as Record<string, string>) || {};
    const payload = (request.body as Record<string, any>) || {};

    const internalCallId = query.internal_call_id || payload.CustomField;
    const provider = providerRegistry.get('exotel');

    logger.info(
      { internalCallId, callSid: payload.CallSid, status: payload.Status },
      'Received Exotel StatusCallback webhook'
    );

    try {
      const parsed = await provider.handleStatusWebhook(payload);

      // Locate call record
      const call = await prisma.call.findFirst({
        where: {
          OR: [
            ...(internalCallId ? [{ internal_call_id: internalCallId }] : []),
            ...(parsed.providerCallId ? [{ provider_call_id: parsed.providerCallId }] : []),
          ],
        },
        include: { agent: true },
      });

      if (!call) {
        logger.warn(
          { internalCallId, providerCallId: parsed.providerCallId },
          'Call not found for incoming Exotel status callback'
        );
        return reply.status(200).send({ received: true, matched: false });
      }

      // Record CallEvent in database
      await prisma.callEvent.create({
        data: {
          call_id: call.id,
          event_type: `telephony_${parsed.status}`,
          data: payload,
        },
      });

      // Update call fields based on status
      const updateData: any = {
        provider_call_id: parsed.providerCallId || call.provider_call_id,
      };

      if (parsed.duration) {
        updateData.duration_seconds = parsed.duration;
      }
      if (parsed.recordingUrl) {
        updateData.recording_url = parsed.recordingUrl;
      }

      // Map telephony status to CallStatus enum
      if (parsed.status === 'in_progress' && call.status !== 'completed') {
        updateData.status = 'in_progress';
        if (!call.answered_at) updateData.answered_at = new Date();
      } else if (parsed.status === 'ringing' && call.status === 'queued') {
        updateData.status = 'ringing';
      } else if (parsed.status === 'completed') {
        updateData.status = 'completed';
        if (!call.ended_at) updateData.ended_at = new Date();
      } else if (parsed.status === 'busy') {
        updateData.status = 'busy';
        updateData.qualification_status = call.qualification_status || 'Busy';
      } else if (parsed.status === 'no_answer') {
        updateData.status = 'no_answer';
        updateData.qualification_status = call.qualification_status || 'No Answer';
      } else if (parsed.status === 'failed') {
        updateData.status = 'failed';
        updateData.qualification_status = call.qualification_status || 'Failed';
        updateData.provider_error = payload.ErrorMessage || 'Telephony provider failure';
      }

      const updatedCall = await prisma.call.update({
        where: { id: call.id },
        data: updateData,
      });

      // Update campaign contact status if applicable
      if (call.campaign_id) {
        const contact = await prisma.campaignContact.findFirst({
          where: { call_id: call.id },
        });

        if (contact) {
          let contactStatus = 'dialing';
          if (parsed.status === 'completed') contactStatus = 'completed';
          else if (parsed.status === 'busy') contactStatus = 'busy';
          else if (parsed.status === 'no_answer') contactStatus = 'no_answer';
          else if (parsed.status === 'failed') contactStatus = 'failed';

          await prisma.campaignContact.update({
            where: { id: contact.id },
            data: { status: contactStatus as any },
          });
        }
      }

      // If call is terminal (completed, busy, no_answer, failed) and no CRM webhook has been dispatched yet
      const isTerminal = ['completed', 'busy', 'no_answer', 'failed'].includes(parsed.status);
      if (isTerminal) {
        const existingDelivery = await prisma.webhookDelivery.findFirst({
          where: { call_id: updatedCall.id },
        });

        if (!existingDelivery) {
          logger.info(
            { callId: updatedCall.internal_call_id, status: parsed.status },
            'Triggering CRM webhook dispatch from terminal status callback'
          );
          await crmWebhookService.dispatchCallCompletedWebhook(updatedCall.id);
        }
      }

      return reply.status(200).send({ received: true, call_id: updatedCall.internal_call_id });
    } catch (err: any) {
      logger.error({ err: err.message }, 'Error handling Exotel status callback');
      return reply.status(200).send({ received: true, error: err.message });
    }
  });
}
