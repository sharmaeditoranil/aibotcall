import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { generateApiKey } from '../utils/crypto.js';
import { z } from 'zod';

const CreateApiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required'),
  scopes: z.array(z.string()).default(['voice:lead', 'voice:call', 'call:read']),
});

export async function apiKeysRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/v1/api-keys
   */
  fastify.get('/api/v1/api-keys', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const keys = await prisma.apiKey.findMany({
      where: { organization_id: orgId },
      select: {
        id: true,
        name: true,
        key_prefix: true,
        scopes: true,
        status: true,
        last_used_at: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return { keys };
  });

  /**
   * POST /api/v1/api-keys
   * Generates a new API key. Returns full secret only once!
   */
  fastify.post('/api/v1/api-keys', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const parseResult = CreateApiKeySchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { name, scopes } = parseResult.data;
    const { key, prefix, hash } = generateApiKey('abf_live_');

    const created = await prisma.apiKey.create({
      data: {
        organization_id: orgId,
        name,
        key_prefix: prefix,
        key_hash: hash,
        scopes,
        status: 'active',
      },
    });

    return reply.status(201).send({
      success: true,
      key_id: created.id,
      name: created.name,
      api_key: key, // Full key shown ONLY once!
      prefix: created.key_prefix,
      scopes: created.scopes,
      message: 'Store this API key securely. It will not be shown again.',
    });
  });

  /**
   * DELETE /api/v1/api-keys/:id
   * Revokes an API key.
   */
  fastify.delete('/api/v1/api-keys/:id', async (request, reply) => {
    const orgId = request.user?.organizationId;
    const { id } = request.params as { id: string };

    await prisma.apiKey.deleteMany({
      where: { id, organization_id: orgId },
    });

    return { success: true, message: 'API key revoked successfully' };
  });
}
