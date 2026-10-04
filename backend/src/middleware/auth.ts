import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';
import { hashApiKey } from '../utils/crypto.js';
import { config } from '../config/index.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'AGENT' | 'VIEWER';
  organizationId: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
    apiKey?: {
      id: string;
      name: string;
      scopes: string[];
      organizationId: string;
    };
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    },
    config.security.jwtSecret,
    { expiresIn: '7d' }
  );
}

/**
 * Middleware: Verifies JWT token from Authorization header or cookie.
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  // 1. Check Bearer JWT token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, config.security.jwtSecret) as AuthUser;
      request.user = decoded;
      return;
    } catch {
      return reply.status(401).send({ error: 'Unauthorized: Invalid or expired token' });
    }
  }

  // 2. Check X-API-Key header
  const apiKeyHeader = request.headers['x-api-key'] as string;
  if (apiKeyHeader) {
    const keyHash = hashApiKey(apiKeyHeader);
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key_hash: keyHash },
    });

    if (keyRecord && keyRecord.status === 'active') {
      await prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { last_used_at: new Date() },
      });

      request.apiKey = {
        id: keyRecord.id,
        name: keyRecord.name,
        scopes: (keyRecord.scopes as string[]) || [],
        organizationId: keyRecord.organization_id,
      };

      request.user = {
        id: `key_${keyRecord.id}`,
        email: 'api-service@aibotflow.local',
        name: keyRecord.name,
        role: 'ADMIN',
        organizationId: keyRecord.organization_id,
      };
      return;
    } else {
      return reply.status(401).send({ error: 'Unauthorized: Invalid API key' });
    }
  }

  return reply.status(401).send({ error: 'Unauthorized: Missing authentication credentials' });
}

/**
 * RBAC middleware: ensures user has one of the allowed roles.
 */
export function authorizeRoles(roles: Array<'OWNER' | 'ADMIN' | 'AGENT' | 'VIEWER'>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return reply.status(403).send({ error: 'Forbidden: Insufficient permissions for this action' });
    }
  };
}
