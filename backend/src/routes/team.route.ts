import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const InviteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'AGENT', 'VIEWER']),
  temporary_password: z.string().min(6).optional(),
});

export async function teamRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/v1/team
   */
  fastify.get('/api/v1/team', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const members = await prisma.user.findMany({
      where: { organization_id: orgId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return { members };
  });

  /**
   * POST /api/v1/team/invite
   */
  fastify.post(
    '/api/v1/team/invite',
    { preHandler: [authorizeRoles(['OWNER', 'ADMIN'])] },
    async (request, reply) => {
      const orgId = request.user?.organizationId;
      if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

      const parseResult = InviteSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parseResult.error.flatten(),
        });
      }

      const { name, email, role, temporary_password } = parseResult.data;

      // Check existing
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return reply.status(400).send({ error: 'User with this email already exists' });
      }

      const tempPass = temporary_password || 'AiBotCall123!';
      const hash = await bcrypt.hash(tempPass, 10);

      const user = await prisma.user.create({
        data: {
          organization_id: orgId,
          name,
          email,
          role,
          password_hash: hash,
        },
      });

      return reply.status(201).send({
        success: true,
        member: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        temporary_password: tempPass,
        message: 'Team member added successfully',
      });
    }
  );

  /**
   * DELETE /api/v1/team/:id
   */
  fastify.delete(
    '/api/v1/team/:id',
    { preHandler: [authorizeRoles(['OWNER', 'ADMIN'])] },
    async (request, reply) => {
      const orgId = request.user?.organizationId;
      const { id } = request.params as { id: string };

      if (id === request.user?.id) {
        return reply.status(400).send({ error: 'Cannot delete your own account' });
      }

      await prisma.user.deleteMany({
        where: { id, organization_id: orgId },
      });

      return { success: true, message: 'Member removed' };
    }
  );
}
