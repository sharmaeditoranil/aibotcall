import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';
import { creditReferralCommission } from './referrals.route.js';

const PACKAGES: Record<string, { minutes: number; price: number; name: string }> = {
  pkg_payg_200: { minutes: 200, price: 498, name: 'Pay As You Go: 200 Voice Minutes (₹498)' },
  pkg_payg_500: { minutes: 500, price: 1245, name: 'Pay As You Go: 500 Voice Minutes (₹1,245)' },
  pkg_payg_1000: { minutes: 1000, price: 2490, name: 'Pay As You Go: 1,000 Voice Minutes (₹2,490)' },
  pkg_payg_2500: { minutes: 2500, price: 6225, name: 'Pay As You Go: 2,500 Voice Minutes (₹6,225)' },
  pkg_starter_200: { minutes: 200, price: 999, name: '200 Voice Minutes Pack' },
  pkg_growth_600: { minutes: 600, price: 2499, name: '600 Voice Minutes Pack' },
  pkg_scale_1500: { minutes: 1500, price: 4999, name: '1,500 Voice Minutes Pack' },
  pkg_enterprise_5000: { minutes: 5000, price: 14999, name: '5,000 Voice Minutes Enterprise Pack' },
};

const TopupSchema = z.object({
  package_id: z.string().min(1),
  payment_method: z.string().default('RAZORPAY'),
});

const RazorpayOrderSchema = z.object({
  package_id: z.string().min(1),
});

const RazorpayVerifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  package_id: z.string().min(1),
});

const ChangePlanSchema = z.object({
  plan: z.enum(['FREE_TRIAL', 'PAY_AS_YOU_GO', 'STARTER', 'GROWTH', 'ENTERPRISE']),
});

export async function billingRoute(fastify: FastifyInstance) {
  /**
   * Razorpay Webhook (Public server-to-server callback)
   * POST /api/v1/billing/razorpay/webhook
   */
  fastify.post('/api/v1/billing/razorpay/webhook', async (request, reply) => {
    const signature = request.headers['x-razorpay-signature'] as string;
    const webhookSecret = config.razorpay.webhookSecret;

    if (webhookSecret && signature) {
      const bodyStr = JSON.stringify(request.body);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(bodyStr)
        .digest('hex');

      if (expectedSignature !== signature) {
        logger.warn('Razorpay webhook signature mismatch');
        return reply.status(400).send({ error: 'Invalid signature' });
      }
    }

    const payload: any = request.body;
    logger.info({ event: payload?.event }, 'Received Razorpay webhook event');

    if (payload?.event === 'payment.captured' || payload?.event === 'order.paid') {
      const notes = payload?.payload?.payment?.entity?.notes || payload?.payload?.order?.entity?.notes;
      const orgId = notes?.organization_id;
      const pkgId = notes?.package_id;

      if (orgId && pkgId && PACKAGES[pkgId]) {
        const pkg = PACKAGES[pkgId];
        await prisma.$transaction([
          prisma.organization.update({
            where: { id: orgId },
            data: { credits_balance_minutes: { increment: pkg.minutes } },
          }),
          prisma.billingTransaction.create({
            data: {
              organization_id: orgId,
              amount: pkg.price,
              currency: 'INR',
              credits_minutes: pkg.minutes,
              description: `Razorpay Webhook: ${pkg.name} (${pkg.minutes} Mins)`,
              type: 'CREDIT_TOPUP',
              gateway: 'RAZORPAY',
              gateway_order_id: payload?.payload?.payment?.entity?.order_id || 'webhook_captured',
              status: 'completed',
            },
          }),
        ]);
        logger.info({ orgId, minutes: pkg.minutes }, 'Credits credited via Razorpay webhook');
      }
    }

    return { status: 'ok' };
  });

  // Authenticated Billing Routes
  fastify.register(async function (authScope) {
    authScope.addHook('preHandler', authenticate);

    /**
     * GET /api/v1/billing
     * Summary, balance, packages, transactions
     */
    authScope.get('/api/v1/billing', async (request, reply) => {
      const orgId = request.user?.organizationId;
      if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

      const [org, transactions, totalCallsDuration] = await Promise.all([
        prisma.organization.findUnique({
          where: { id: orgId },
          select: {
            id: true,
            name: true,
            plan: true,
            credits_balance_minutes: true,
            billing_email: true,
            max_concurrency: true,
          },
        }),
        prisma.billingTransaction.findMany({
          where: { organization_id: orgId },
          orderBy: { created_at: 'desc' },
          take: 25,
        }),
        prisma.call.aggregate({
          where: { organization_id: orgId },
          _sum: { duration_seconds: true },
          _count: true,
        }),
      ]);

      if (!org) return reply.status(404).send({ error: 'Organization not found' });

      const totalSeconds = totalCallsDuration._sum.duration_seconds || 0;
      const totalMinutesUsed = Math.round((totalSeconds / 60) * 10) / 10;

      return {
        plan: org.plan,
        credits_balance_minutes: Math.round(org.credits_balance_minutes * 10) / 10,
        total_minutes_used: totalMinutesUsed,
        total_calls: totalCallsDuration._count,
        max_concurrency: org.max_concurrency,
        transactions,
        available_packages: PACKAGES,
        razorpay_key_id: config.razorpay.keyId,
      };
    });

    /**
     * GET /api/v1/billing/razorpay/key
     * Returns Razorpay public Key ID for client-side checkout
     */
    authScope.get('/api/v1/billing/razorpay/key', async () => {
      return {
        key_id: config.razorpay.keyId,
        currency: 'INR',
      };
    });

    /**
     * POST /api/v1/billing/razorpay/create-order
     * Generates a genuine Razorpay Order ID for checkout
     */
    authScope.post('/api/v1/billing/razorpay/create-order', async (request, reply) => {
      const orgId = request.user?.organizationId;
      if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

      const parseResult = RazorpayOrderSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ error: 'Invalid package selection' });
      }

      const pkg = PACKAGES[parseResult.data.package_id];
      if (!pkg) return reply.status(400).send({ error: 'Unknown package' });

      const amountInPaise = Math.round(pkg.price * 100);
      const receipt = `rcpt_${orgId.slice(0, 8)}_${Date.now().toString().slice(-6)}`;

      try {
        let razorpayOrder: any;

        // Check if real or test Razorpay keys are configured
        if (config.razorpay.keyId && config.razorpay.keySecret && !config.razorpay.keyId.includes('DefaultKey')) {
          const rzp = new Razorpay({
            key_id: config.razorpay.keyId,
            key_secret: config.razorpay.keySecret,
          });

          razorpayOrder = await rzp.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt,
            notes: {
              organization_id: orgId,
              package_id: parseResult.data.package_id,
              minutes: String(pkg.minutes),
            },
          });
        } else {
          // Fallback order ID for dev/test environment
          razorpayOrder = {
            id: `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            entity: 'order',
            amount: amountInPaise,
            amount_paid: 0,
            amount_due: amountInPaise,
            currency: 'INR',
            receipt,
            status: 'created',
            notes: {
              organization_id: orgId,
              package_id: parseResult.data.package_id,
            },
          };
        }

        return {
          success: true,
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key_id: config.razorpay.keyId,
          package: pkg,
        };
      } catch (err: any) {
        logger.error({ err: err.message, orgId }, 'Failed to create Razorpay order');
        return reply.status(500).send({ error: 'Failed to initiate Razorpay order: ' + err.message });
      }
    });

    /**
     * POST /api/v1/billing/razorpay/verify-payment
     * Verifies cryptographic HMAC-SHA256 signature and credits voice minutes
     */
    authScope.post('/api/v1/billing/razorpay/verify-payment', async (request, reply) => {
      const orgId = request.user?.organizationId;
      if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

      const parseResult = RazorpayVerifySchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ error: 'Invalid verification payload', details: parseResult.error.flatten() });
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, package_id } = parseResult.data;
      const pkg = PACKAGES[package_id];
      if (!pkg) return reply.status(400).send({ error: 'Unknown package' });

      // Cryptographic verification
      let isValidSignature = false;
      if (config.razorpay.keySecret && !config.razorpay.keyId.includes('DefaultKey')) {
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
          .createHmac('sha256', config.razorpay.keySecret)
          .update(body)
          .digest('hex');

        isValidSignature = expectedSignature === razorpay_signature;
      } else {
        // In local development / test mode with sandbox keys
        isValidSignature = true;
      }

      if (!isValidSignature) {
        logger.warn({ orgId, razorpay_order_id, razorpay_payment_id }, 'Razorpay signature verification failed');
        return reply.status(400).send({ error: 'Payment signature verification failed' });
      }

      // Prevent duplicate processing
      const existingTx = await prisma.billingTransaction.findFirst({
        where: {
          organization_id: orgId,
          gateway_order_id: razorpay_order_id,
        },
      });

      if (existingTx) {
        return {
          success: true,
          message: 'Payment already credited previously',
          transaction: existingTx,
        };
      }

      // Credit minutes atomically
      const [updatedOrg, transaction] = await prisma.$transaction([
        prisma.organization.update({
          where: { id: orgId },
          data: {
            credits_balance_minutes: { increment: pkg.minutes },
          },
        }),
        prisma.billingTransaction.create({
          data: {
            organization_id: orgId,
            amount: pkg.price,
            currency: 'INR',
            credits_minutes: pkg.minutes,
            description: `Razorpay: ${pkg.name} (${pkg.minutes} Voice Minutes)`,
            type: 'CREDIT_TOPUP',
            gateway: 'RAZORPAY',
            gateway_order_id: razorpay_order_id,
            status: 'completed',
          },
        }),
      ]);

      logger.info(
        { orgId, minutes: pkg.minutes, newBalance: updatedOrg.credits_balance_minutes },
        'Razorpay payment verified & minutes credited'
      );

      // Automatically credit 20% referral commission to referrer if applicable
      await creditReferralCommission(orgId, pkg.price, transaction.id, `Recharge: ${pkg.name}`);

      return {
        success: true,
        message: `Payment verified! Credited ${pkg.minutes} calling minutes to your account.`,
        new_balance_minutes: Math.round(updatedOrg.credits_balance_minutes * 10) / 10,
        transaction,
      };
    });

    /**
     * POST /api/v1/billing/topup (Instant / Sandbox top-up)
     */
    authScope.post('/api/v1/billing/topup', async (request, reply) => {
      const orgId = request.user?.organizationId;
      if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

      const parseResult = TopupSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ error: 'Invalid package selection' });
      }

      const pkg = PACKAGES[parseResult.data.package_id];
      if (!pkg) return reply.status(400).send({ error: 'Unknown package' });

      const [updatedOrg, tx] = await prisma.$transaction([
        prisma.organization.update({
          where: { id: orgId },
          data: {
            credits_balance_minutes: { increment: pkg.minutes },
          },
        }),
        prisma.billingTransaction.create({
          data: {
            organization_id: orgId,
            amount: pkg.price,
            currency: 'INR',
            credits_minutes: pkg.minutes,
            description: `Top-up: ${pkg.name} (${pkg.minutes} Minutes)`,
            type: 'CREDIT_TOPUP',
            gateway: parseResult.data.payment_method,
            status: 'completed',
          },
        }),
      ]);

      // Automatically credit 20% referral commission to referrer if applicable
      await creditReferralCommission(orgId, pkg.price, tx.id, `Recharge: ${pkg.name}`);

      return {
        success: true,
        message: `Successfully topped up ${pkg.minutes} calling minutes!`,
        new_balance_minutes: updatedOrg.credits_balance_minutes,
        transaction: tx,
      };
    });

    /**
     * POST /api/v1/billing/change-plan
     */
    authScope.post('/api/v1/billing/change-plan', async (request, reply) => {
      const orgId = request.user?.organizationId;
      if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

      const parseResult = ChangePlanSchema.safeParse(request.body);
      if (!parseResult.success) return reply.status(400).send({ error: 'Invalid plan' });

      const newPlan = parseResult.data.plan;
      let maxConcurrency = 2;
      if (newPlan === 'PAY_AS_YOU_GO') maxConcurrency = 5;
      else if (newPlan === 'STARTER') maxConcurrency = 5;
      else if (newPlan === 'GROWTH') maxConcurrency = 10;
      else if (newPlan === 'ENTERPRISE') maxConcurrency = 30;

      const org = await prisma.organization.update({
        where: { id: orgId },
        data: {
          plan: newPlan,
          max_concurrency: maxConcurrency,
        },
      });

      return {
        success: true,
        plan: org.plan,
        max_concurrency: org.max_concurrency,
        message: `Upgraded to ${newPlan} plan!`,
      };
    });
  });
}
