import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

const AssignPlanSchema = z.object({
  plan: z.enum(['FREE_TRIAL', 'STARTER', 'GROWTH', 'ENTERPRISE']),
  max_concurrency: z.number().int().min(1).max(100).optional(),
});

const AddCreditsSchema = z.object({
  minutes: z.number().min(-10000).max(100000),
  reason: z.string().min(1).default('Admin manual credit grant'),
});

export async function adminRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // Authorization check: User must be OWNER or ADMIN in their org
  fastify.addHook('preHandler', async (request, reply) => {
    const userRole = request.user?.role;
    if (userRole !== 'OWNER' && userRole !== 'ADMIN') {
      return reply.status(403).send({ error: 'Super Admin access required' });
    }
  });

  /**
   * GET /api/v1/admin/stats
   * High level platform overview
   */
  fastify.get('/api/v1/admin/stats', async () => {
    const [
      totalOrgs,
      totalUsers,
      totalCalls,
      durationSum,
      transactionsSum,
      orgsByPlan,
      recentCalls,
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.call.count(),
      prisma.call.aggregate({ _sum: { duration_seconds: true } }),
      prisma.billingTransaction.aggregate({ _sum: { amount: true } }),
      prisma.organization.groupBy({
        by: ['plan'],
        _count: true,
      }),
      prisma.call.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const totalSeconds = durationSum._sum.duration_seconds || 0;
    const totalMinutes = Math.round((totalSeconds / 60) * 10) / 10;
    const totalRevenue = Math.round(transactionsSum._sum.amount || 0);

    const planStats: Record<string, number> = {
      FREE_TRIAL: 0,
      STARTER: 0,
      GROWTH: 0,
      ENTERPRISE: 0,
    };
    for (const item of orgsByPlan) {
      planStats[item.plan] = item._count;
    }

    return {
      total_organizations: totalOrgs,
      total_users: totalUsers,
      total_calls: totalCalls,
      total_minutes: totalMinutes,
      total_revenue: totalRevenue,
      calls_last_24h: recentCalls,
      plan_stats: planStats,
    };
  });

  /**
   * GET /api/v1/admin/organizations
   * List all tenant organizations with stats
   */
  fastify.get('/api/v1/admin/organizations', async (request) => {
    const query = (request.query as any)?.search || '';

    const orgs = await prisma.organization.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { slug: { contains: query, mode: 'insensitive' } },
              { billing_email: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true,
          },
        },
        _count: {
          select: {
            calls: true,
            campaigns: true,
            agents: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 100,
    });

    return {
      organizations: orgs.map((org) => {
        const owner = org.users.find((u) => u.role === 'OWNER') || org.users[0];
        return {
          id: org.id,
          name: org.name,
          slug: org.slug,
          plan: org.plan,
          credits_balance_minutes: Math.round(org.credits_balance_minutes * 10) / 10,
          max_concurrency: org.max_concurrency,
          custom_telephony: org.custom_telephony_enabled,
          caller_id: org.exotel_caller_id,
          user_count: org.users.length,
          call_count: org._count.calls,
          campaign_count: org._count.campaigns,
          agent_count: org._count.agents,
          owner_name: owner?.name || 'N/A',
          owner_email: owner?.email || org.billing_email || 'N/A',
          created_at: org.created_at,
          users: org.users,
        };
      }),
    };
  });

  /**
   * POST /api/v1/admin/organizations/:id/assign-plan
   * Assign a new plan tier & max concurrency to any tenant
   */
  fastify.post('/api/v1/admin/organizations/:id/assign-plan', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parseResult = AssignPlanSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Invalid plan or parameters' });
    }

    const { plan } = parseResult.data;
    let concurrency = parseResult.data.max_concurrency;
    if (!concurrency) {
      if (plan === 'FREE_TRIAL') concurrency = 2;
      else if (plan === 'STARTER') concurrency = 5;
      else if (plan === 'GROWTH') concurrency = 10;
      else if (plan === 'ENTERPRISE') concurrency = 30;
      else concurrency = 2;
    }

    const updated = await prisma.organization.update({
      where: { id },
      data: {
        plan,
        max_concurrency: concurrency,
      },
    });

    // Record audit transaction
    await prisma.billingTransaction.create({
      data: {
        organization_id: id,
        amount: 0,
        currency: 'INR',
        credits_minutes: 0,
        description: `Plan updated to ${plan} (Concurrency: ${concurrency}) by Admin`,
        type: 'PLAN_ASSIGNMENT_ADMIN',
        gateway: 'ADMIN_PANEL',
        status: 'completed',
      },
    });

    logger.info({ orgId: id, plan, concurrency }, 'Super Admin assigned plan to organization');

    return {
      success: true,
      message: `Organization plan successfully updated to ${plan}`,
      organization: {
        id: updated.id,
        name: updated.name,
        plan: updated.plan,
        max_concurrency: updated.max_concurrency,
      },
    };
  });

  /**
   * POST /api/v1/admin/organizations/:id/add-credits
   * Manually grant or adjust voice calling minutes
   */
  fastify.post('/api/v1/admin/organizations/:id/add-credits', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parseResult = AddCreditsSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Invalid minutes amount' });
    }

    const { minutes, reason } = parseResult.data;

    const [updatedOrg, tx] = await prisma.$transaction([
      prisma.organization.update({
        where: { id },
        data: {
          credits_balance_minutes: { increment: minutes },
        },
      }),
      prisma.billingTransaction.create({
        data: {
          organization_id: id,
          amount: 0,
          currency: 'INR',
          credits_minutes: minutes,
          description: `Admin Grant: ${minutes > 0 ? '+' : ''}${minutes} Minutes (${reason})`,
          type: 'CREDIT_GRANT_ADMIN',
          gateway: 'ADMIN_CONSOLE',
          status: 'completed',
        },
      }),
    ]);

    logger.info({ orgId: id, minutes, reason }, 'Super Admin granted credits to organization');

    return {
      success: true,
      message: `Successfully updated credit balance by ${minutes > 0 ? '+' : ''}${minutes} minutes!`,
      new_balance: Math.round(updatedOrg.credits_balance_minutes * 10) / 10,
      transaction: tx,
    };
  });

  /**
   * GET /api/v1/admin/users
   * List all platform users
   */
  fastify.get('/api/v1/admin/users', async () => {
    const users = await prisma.user.findMany({
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            plan: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 100,
    });

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        organization_id: u.organization_id,
        organization_name: u.organization?.name,
        plan: u.organization?.plan,
        created_at: u.created_at,
      })),
    };
  });

  /**
   * GET /api/v1/admin/transactions
   * System-wide ledger of recent billing transactions
   */
  fastify.get('/api/v1/admin/transactions', async () => {
    const transactions = await prisma.billingTransaction.findMany({
      include: {
        organization: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 100,
    });

    return {
      transactions: transactions.map((t) => ({
        id: t.id,
        organization_name: t.organization.name,
        amount: t.amount,
        currency: t.currency,
        credits_minutes: t.credits_minutes,
        description: t.description,
        type: t.type,
        gateway: t.gateway,
        status: t.status,
        created_at: t.created_at,
      })),
    };
  });

  /**
   * GET /api/v1/admin/gateway/razorpay
   * Return Razorpay settings for Super Admin
   */
  fastify.get('/api/v1/admin/gateway/razorpay', async () => {
    const { config } = await import('../config/index.js');
    const isLive = config.razorpay.keyId?.startsWith('rzp_live');
    const isConfigured = Boolean(
      config.razorpay.keyId &&
      config.razorpay.keySecret &&
      !config.razorpay.keyId.includes('DefaultKey')
    );

    return {
      key_id: config.razorpay.keyId || '',
      key_secret_masked: config.razorpay.keySecret
        ? config.razorpay.keySecret.slice(0, 4) + '••••••••••••' + config.razorpay.keySecret.slice(-4)
        : '',
      webhook_secret: config.razorpay.webhookSecret || '',
      webhook_url: `${config.appUrl || 'https://voice.aibotflow.in'}/api/v1/billing/razorpay/webhook`,
      is_live: isLive,
      is_configured: isConfigured,
      currency: 'INR',
    };
  });

  /**
   * POST /api/v1/admin/gateway/razorpay
   * Update Razorpay keys and persist to .env
   */
  fastify.post('/api/v1/admin/gateway/razorpay', async (request, reply) => {
    const RazorpayConfigSchema = z.object({
      key_id: z.string().min(1),
      key_secret: z.string().min(1),
      webhook_secret: z.string().optional().default(''),
    });

    const parseResult = RazorpayConfigSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { key_id, key_secret, webhook_secret } = parseResult.data;
    const { config } = await import('../config/index.js');
    const fs = await import('fs');
    const path = await import('path');

    // Update in-memory config
    config.razorpay.keyId = key_id;
    config.razorpay.keySecret = key_secret;
    config.razorpay.webhookSecret = webhook_secret;

    // Persist to .env files if present
    const envPaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), '../.env'),
    ];

    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        try {
          let envContent = fs.readFileSync(envPath, 'utf8');
          const updates: Record<string, string> = {
            RAZORPAY_KEY_ID: key_id,
            RAZORPAY_KEY_SECRET: key_secret,
            RAZORPAY_WEBHOOK_SECRET: webhook_secret,
          };

          for (const [k, v] of Object.entries(updates)) {
            const regex = new RegExp(`^${k}=.*$`, 'm');
            if (regex.test(envContent)) {
              envContent = envContent.replace(regex, `${k}="${v}"`);
            } else {
              envContent += `\n${k}="${v}"`;
            }
          }
          fs.writeFileSync(envPath, envContent, 'utf8');
        } catch (err: any) {
          logger.warn({ err: err.message, envPath }, 'Failed updating .env with Razorpay keys');
        }
      }
    }

    logger.info({ key_id, is_live: key_id.startsWith('rzp_live') }, 'Razorpay gateway credentials updated by Super Admin');

    return {
      success: true,
      message: 'Razorpay configuration updated successfully',
      is_live: key_id.startsWith('rzp_live'),
    };
  });
}
