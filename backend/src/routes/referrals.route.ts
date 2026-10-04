import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

const WithdrawSchema = z.object({
  amount: z.number().min(100, 'Minimum withdrawal amount is ₹100'),
  payout_method: z.enum(['UPI', 'BANK_TRANSFER']),
  upi_id: z.string().optional(),
  bank_account_number: z.string().optional(),
  bank_ifsc: z.string().optional(),
  bank_holder_name: z.string().optional(),
});

const ProcessWithdrawalSchema = z.object({
  action: z.enum(['PAID', 'REJECTED']),
  admin_notes: z.string().optional(),
});

/**
 * Helper to credit referral commission when any referred org spends money
 */
export async function creditReferralCommission(
  buyerOrgId: string,
  orderAmount: number,
  txId?: string,
  desc?: string
) {
  try {
    const buyer = await prisma.organization.findUnique({
      where: { id: buyerOrgId },
      select: { id: true, name: true, referred_by_id: true },
    });

    if (!buyer || !buyer.referred_by_id || orderAmount <= 0) {
      return;
    }

    const commissionPercent = 20.0; // 20% commission on every transaction
    const commissionAmount = Math.round((orderAmount * (commissionPercent / 100)) * 100) / 100;

    await prisma.$transaction([
      prisma.organization.update({
        where: { id: buyer.referred_by_id },
        data: {
          referral_wallet_balance: { increment: commissionAmount },
          total_referral_earned: { increment: commissionAmount },
        },
      }),
      prisma.referralEarning.create({
        data: {
          referrer_id: buyer.referred_by_id,
          referred_id: buyer.id,
          transaction_id: txId,
          order_amount: orderAmount,
          commission_percent: commissionPercent,
          commission_amount: commissionAmount,
          description: desc || `20% Referral Commission from ${buyer.name}`,
          status: 'credited',
        },
      }),
    ]);

    logger.info(
      { referrerId: buyer.referred_by_id, buyerId: buyer.id, commissionAmount },
      'Referral commission credited to wallet'
    );
  } catch (err: any) {
    logger.error({ err: err.message, buyerOrgId }, 'Failed to credit referral commission');
  }
}

export async function referralsRoute(fastify: FastifyInstance) {
  fastify.register(async function (authScope) {
    authScope.addHook('onRequest', authenticate);

    /**
     * GET /api/v1/referrals/stats
     * Returns the user's referral code, link, wallet balance, earnings history, and withdrawal status
     */
    authScope.get('/api/v1/referrals/stats', async (request, reply) => {
      const orgId = request.user?.organizationId;
      if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

      let org = await prisma.organization.findUnique({
        where: { id: orgId },
        select: {
          id: true,
          name: true,
          referral_code: true,
          referral_wallet_balance: true,
          total_referral_earned: true,
          total_referral_withdrawn: true,
        },
      });

      if (!org) return reply.status(404).send({ error: 'Organization not found' });

      // Generate a referral code if missing
      if (!org.referral_code) {
        const newCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        org = await prisma.organization.update({
          where: { id: orgId },
          data: { referral_code: newCode },
          select: {
            id: true,
            name: true,
            referral_code: true,
            referral_wallet_balance: true,
            total_referral_earned: true,
            total_referral_withdrawn: true,
          },
        });
      }

      // Fetch referred organizations
      const referredOrgs = await prisma.organization.findMany({
        where: { referred_by_id: orgId },
        select: {
          id: true,
          name: true,
          created_at: true,
          plan: true,
        },
        orderBy: { created_at: 'desc' },
      });

      // Fetch commission earnings
      const earnings = await prisma.referralEarning.findMany({
        where: { referrer_id: orgId },
        orderBy: { created_at: 'desc' },
        take: 50,
      });

      // Fetch withdrawal requests
      const withdrawals = await prisma.withdrawalRequest.findMany({
        where: { organization_id: orgId },
        orderBy: { created_at: 'desc' },
        take: 50,
      });

      return {
        referral_code: org.referral_code,
        commission_rate_percent: 20,
        wallet_balance: Math.round(org.referral_wallet_balance * 100) / 100,
        total_earned: Math.round(org.total_referral_earned * 100) / 100,
        total_withdrawn: Math.round(org.total_referral_withdrawn * 100) / 100,
        total_referrals_count: referredOrgs.length,
        referred_organizations: referredOrgs,
        earnings,
        withdrawals,
      };
    });

    /**
     * POST /api/v1/referrals/withdraw
     * User submits a payout/withdrawal request
     */
    authScope.post('/api/v1/referrals/withdraw', async (request, reply) => {
      const orgId = request.user?.organizationId;
      if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

      const parseResult = WithdrawSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parseResult.error.flatten(),
        });
      }

      const { amount, payout_method, upi_id, bank_account_number, bank_ifsc, bank_holder_name } = parseResult.data;

      // Validate payment details
      if (payout_method === 'UPI' && (!upi_id || !upi_id.includes('@'))) {
        return reply.status(400).send({ error: 'A valid UPI ID (e.g. yourname@upi) is required' });
      }

      if (payout_method === 'BANK_TRANSFER' && (!bank_account_number || !bank_ifsc || !bank_holder_name)) {
        return reply.status(400).send({ error: 'Bank Account Number, IFSC code, and Holder Name are all required' });
      }

      const org = await prisma.organization.findUnique({
        where: { id: orgId },
        select: { referral_wallet_balance: true },
      });

      if (!org || org.referral_wallet_balance < amount) {
        return reply.status(400).send({
          error: `Insufficient referral wallet balance. Available: ₹${org?.referral_wallet_balance || 0}`,
        });
      }

      // Deduct balance and create withdrawal request in an atomic transaction
      const [updatedOrg, withdrawal] = await prisma.$transaction([
        prisma.organization.update({
          where: { id: orgId },
          data: {
            referral_wallet_balance: { decrement: amount },
            total_referral_withdrawn: { increment: amount },
          },
        }),
        prisma.withdrawalRequest.create({
          data: {
            organization_id: orgId,
            amount,
            payout_method,
            upi_id,
            bank_account_number,
            bank_ifsc,
            bank_holder_name,
            status: 'pending',
          },
        }),
      ]);

      logger.info(
        { orgId, withdrawalId: withdrawal.id, amount, payout_method },
        'Referral withdrawal request created'
      );

      return {
        success: true,
        message: `Withdrawal request for ₹${amount} submitted successfully! Admin will process your payout within 24 hours.`,
        new_wallet_balance: updatedOrg.referral_wallet_balance,
        withdrawal,
      };
    });

    /**
     * GET /api/v1/referrals/admin/withdrawals
     * Admin endpoint to inspect all pending and processed payouts
     */
    authScope.get('/api/v1/referrals/admin/withdrawals', async (request, reply) => {
      const requests = await prisma.withdrawalRequest.findMany({
        include: {
          organization: {
            select: {
              name: true,
              billing_email: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      return { requests };
    });

    /**
     * POST /api/v1/referrals/admin/withdrawals/:id/process
     * Admin marks a withdrawal request as PAID or REJECTED
     */
    authScope.post('/api/v1/referrals/admin/withdrawals/:id/process', async (request, reply) => {
      const { id } = request.params as { id: string };
      const parseResult = ProcessWithdrawalSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ error: 'Invalid payload' });
      }

      const { action, admin_notes } = parseResult.data;

      const reqRecord = await prisma.withdrawalRequest.findUnique({
        where: { id },
      });

      if (!reqRecord) {
        return reply.status(404).send({ error: 'Withdrawal request not found' });
      }

      if (reqRecord.status === 'paid') {
        return reply.status(400).send({ error: 'Withdrawal request has already been paid' });
      }

      if (action === 'PAID') {
        const updated = await prisma.withdrawalRequest.update({
          where: { id },
          data: {
            status: 'paid',
            admin_notes: admin_notes || 'Paid via UPI/Bank Transfer',
            processed_at: new Date(),
          },
        });

        return {
          success: true,
          message: `Withdrawal of ₹${reqRecord.amount} marked as PAID.`,
          withdrawal: updated,
        };
      } else if (action === 'REJECTED') {
        // Refund amount back to organization's referral wallet
        const [updatedOrg, updated] = await prisma.$transaction([
          prisma.organization.update({
            where: { id: reqRecord.organization_id },
            data: {
              referral_wallet_balance: { increment: reqRecord.amount },
              total_referral_withdrawn: { decrement: reqRecord.amount },
            },
          }),
          prisma.withdrawalRequest.update({
            where: { id },
            data: {
              status: 'rejected',
              admin_notes: admin_notes || 'Rejected by admin and refunded to wallet',
              processed_at: new Date(),
            },
          }),
        ]);

        return {
          success: true,
          message: `Withdrawal request rejected and ₹${reqRecord.amount} refunded to wallet.`,
          withdrawal: updated,
          new_balance: updatedOrg.referral_wallet_balance,
        };
      }
    });
  });
}
