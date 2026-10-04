import { WebSocket } from 'ws';
import { FastifyRequest } from 'fastify';
import { CallSession } from '../realtime/call-session.js';
import { prisma } from '../db/prisma.js';
import { logger } from '../utils/logger.js';
import { providerRegistry } from '../providers/index.js';

// Map of active call sessions keyed by internal call ID
const activeSessions = new Map<string, CallSession>();

export async function handleExotelMediaWebSocket(socket: WebSocket, req: FastifyRequest) {
  const query = (req.query as Record<string, string>) || {};
  let internalCallId = query.internal_call_id || '';
  let agentId = query.agent_id || '';

  logger.info({ internalCallId, query }, 'Incoming Exotel media WebSocket connection');

  let currentSession: CallSession | null = null;
  let streamSid: string | null = null;

  socket.on('message', async (data: Buffer | string) => {
    try {
      const message = JSON.parse(data.toString());
      const eventType = message.event;

      switch (eventType) {
        case 'connected':
          logger.info({ event: 'connected' }, 'Exotel media stream connected handshake');
          break;

        case 'start': {
          streamSid = message.streamSid || message.start?.streamSid;
          const callSid = message.start?.callSid;
          const customParams = message.start?.customParameters || {};

          if (!internalCallId && customParams.internalCallId) {
            internalCallId = customParams.internalCallId;
          }
          if (!agentId && customParams.agentId) {
            agentId = customParams.agentId;
          }

          logger.info(
            { streamSid, callSid, internalCallId, agentId },
            'Exotel stream started'
          );

          // Find Call record in DB
          const call = await prisma.call.findFirst({
            where: {
              OR: [
                { internal_call_id: internalCallId },
                ...(callSid ? [{ provider_call_id: callSid }] : []),
              ],
            },
            include: { lead: true },
          });

          if (!call) {
            logger.error({ internalCallId, callSid }, 'Call record not found for active media stream');
            socket.close();
            return;
          }

          // Build custom template variables
          const customVariables: Record<string, any> = {
            name: call.lead?.name || 'Customer',
            city: call.lead?.city || 'your city',
            course: call.lead?.service || 'the course',
            service: call.lead?.service || 'the service',
            source: call.lead?.source || 'Website',
            ...((call.lead?.custom_fields as Record<string, any>) || {}),
            ...customParams,
          };

          // Create isolated CallSession
          currentSession = new CallSession({
            internalCallId: call.internal_call_id,
            providerCallId: callSid || call.provider_call_id || undefined,
            streamSid: streamSid || undefined,
            agentId: call.agent_id,
            leadId: call.lead_id || undefined,
            organizationId: call.organization_id,
            customerPhone: call.customer_phone,
            customVariables,
            exotelWs: socket,
            onHangup: async () => {
              if (callSid) {
                const provider = providerRegistry.get(call.provider);
                await provider.hangupCall(callSid);
              }
            },
          });

          if (streamSid) {
            currentSession.setStreamSid(streamSid);
          }

          activeSessions.set(call.internal_call_id, currentSession);

          // Update call stream_id and provider_call_id
          await prisma.call.update({
            where: { id: call.id },
            data: {
              stream_id: streamSid,
              provider_call_id: callSid || call.provider_call_id,
            },
          });

          // Start the AI audio session
          await currentSession.start();
          break;
        }

        case 'media': {
          // Inbound audio chunk from customer
          const base64Audio = message.media?.payload;
          if (base64Audio && currentSession) {
            currentSession.handleExotelAudio(base64Audio);
          }
          break;
        }

        case 'stop': {
          logger.info({ streamSid, internalCallId }, 'Exotel stream stop event received');
          if (currentSession) {
            await currentSession.endCall('telephony_stream_stopped');
          }
          break;
        }

        default:
          break;
      }
    } catch (err: any) {
      logger.error({ err: err.message }, 'Error handling Exotel WebSocket message');
    }
  });

  socket.on('error', (err) => {
    logger.error({ internalCallId, err: err.message }, 'Exotel WebSocket error');
  });

  socket.on('close', async (code, reason) => {
    logger.info(
      { internalCallId, code, reason: reason.toString() },
      'Exotel media WebSocket closed'
    );
    if (currentSession) {
      await currentSession.endCall('websocket_closed');
    }
    if (internalCallId) {
      activeSessions.delete(internalCallId);
    }
  });
}
