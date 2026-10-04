import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../db/prisma.js';
import { config } from '../config/index.js';
import { hashApiKey, verifyHmacSignature } from '../utils/crypto.js';
import { logger } from '../utils/logger.js';

// Cache processed event IDs for replay protection (in-memory LRU set with expiry)
const seenEventIds = new Map<string, number>();

// Clean expired event IDs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, ts] of seenEventIds.entries()) {
    if (now - ts > 15 * 60 * 1000) {
      // 15 min TTL
      seenEventIds.delete(id);
    }
  }
}, 5 * 60 * 1000);

/**
 * Validates incoming webhook requests:
 * 1. API Key (X-API-Key or Bearer token) OR HMAC Signature (X-Webhook-Signature)
 * 2. Replay protection (X-Event-ID or lead_id)
 * 3. Timestamp tolerance (X-Timestamp within 5 minutes)
 */
export async function validateIncomingWebhook(request: FastifyRequest, reply: FastifyReply) {
  const headers = request.headers;
  const apiKey = (headers['x-api-key'] || headers['x-api-token']) as string;
  const signature = headers['x-webhook-signature'] as string;
  const timestampHeader = headers['x-timestamp'] as string;
  const eventId = (headers['x-event-id'] || (request.body as any)?.lead_id) as string;

  // 1. Timestamp validation (within 5 minutes if timestamp provided)
  if (timestampHeader) {
    const requestTime = parseInt(timestampHeader, 10);
    const now = Date.now();
    if (isNaN(requestTime) || Math.abs(now - requestTime) > 5 * 60 * 1000) {
      logger.warn({ timestampHeader }, 'Webhook rejected: Timestamp expired or skewed');
      return reply.status(401).send({ error: 'Request timestamp expired or out of tolerance' });
    }
  }

  // 2. Replay protection
  if (eventId) {
    if (seenEventIds.has(eventId)) {
      logger.info({ eventId }, 'Webhook duplicate event ID detected (replay protection)');
      return reply.status(200).send({
        success: true,
        status: 'duplicate_skipped',
        message: 'Event was already processed recently',
      });
    }
    seenEventIds.set(eventId, Date.now());
  }

  // 3. Authenticate via HMAC Signature if provided
  if (signature && config.webhooks.incomingWebhookSecret) {
    const rawBody = JSON.stringify(request.body);
    const isValid = verifyHmacSignature(rawBody, signature, config.webhooks.incomingWebhookSecret);
    if (isValid) {
      // Fetch default organization
      const org = await prisma.organization.findFirst();
      request.user = {
        id: 'system_hmac',
        email: 'webhook@external.system',
        name: 'HMAC Webhook Client',
        role: 'ADMIN',
        organizationId: org?.id || '',
      };
      return;
    }
  }

  // 4. Authenticate via API Key
  if (apiKey) {
    const keyHash = hashApiKey(apiKey);
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key_hash: keyHash },
    });

    if (keyRecord && keyRecord.status === 'active') {
      const scopes = (keyRecord.scopes as string[]) || [];
      if (!scopes.includes('voice:lead') && !scopes.includes('*')) {
        return reply.status(403).send({ error: 'API key lacks voice:lead permission scope' });
      }

      await prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { last_used_at: new Date() },
      });

      request.user = {
        id: `key_${keyRecord.id}`,
        email: 'api-service@aibotflow.local',
        name: keyRecord.name,
        role: 'ADMIN',
        organizationId: keyRecord.organization_id,
      };
      return;
    }
  }

  // 5. Fallback check: If bearer auth token matches INCOMING_WEBHOOK_SECRET
  const authHeader = headers.authorization;
  if (
    authHeader &&
    config.webhooks.incomingWebhookSecret &&
    authHeader.replace(/^Bearer\s+/i, '') === config.webhooks.incomingWebhookSecret
  ) {
    const org = await prisma.organization.findFirst();
    request.user = {
      id: 'secret_token',
      email: 'secret@external.system',
      name: 'Bearer Secret Client',
      role: 'ADMIN',
      organizationId: org?.id || '',
    };
    return;
  }

  // In development without configured secrets, allow fallback to first organization
  if (config.env === 'development' && !config.webhooks.incomingWebhookSecret && !apiKey) {
    const org = await prisma.organization.findFirst();
    if (org) {
      request.user = {
        id: 'dev_user',
        email: 'dev@local',
        name: 'Development Client',
        role: 'ADMIN',
        organizationId: org.id,
      };
      return;
    }
  }

  return reply.status(401).send({
    error: 'Unauthorized: Valid X-API-Key, Bearer token, or X-Webhook-Signature required',
  });
}
