import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import { generateApiKey } from '../utils/crypto.js';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const RegisterSchema = z.object({
  name: z.string().min(1, 'Your name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  company_name: z.string().min(1, 'Company or organization name is required'),
  company_slug: z.string().optional(),
  referral_code: z.string().optional(),
});

export async function authRoute(fastify: FastifyInstance) {
  /**
   * POST /api/v1/auth/register
   * Multi-tenant SaaS Self-Serve Signup:
   * 1. Creates Organization
   * 2. Sets Free Trial Plan with 30 Free Minutes
   * 3. Creates Owner User
   * 4. Generates Starter AI Voice Agent (e.g. Ritu)
   * 5. Seeds Starter Knowledge Base & API Key
   * 6. Returns JWT & Login session
   */
  fastify.post('/api/v1/auth/register', async (request, reply) => {
    const parseResult = RegisterSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { name, email, password, company_name, referral_code } = parseResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ error: 'An account with this email already exists' });
    }

    // Generate unique slug
    let slug = company_name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const slugExists = await prisma.organization.findUnique({ where: { slug } });
    if (slugExists) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Check if valid referral code was provided
    let referredById: string | null = null;
    if (referral_code && referral_code.trim()) {
      const referrer = await prisma.organization.findFirst({
        where: {
          referral_code: {
            equals: referral_code.trim(),
            mode: 'insensitive',
          },
        },
      });
      if (referrer) {
        referredById = referrer.id;
      }
    }

    // Generate unique referral code for this new organization
    const myReferralCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 1. Create Organization with 30 Free Trial Minutes
    const org = await prisma.organization.create({
      data: {
        name: company_name,
        slug,
        plan: 'FREE_TRIAL',
        credits_balance_minutes: 30.0,
        billing_email: email,
        max_concurrency: 2,
        referral_code: myReferralCode,
        referred_by_id: referredById,
      },
    });

    // 2. Create Owner User
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        organization_id: org.id,
        email,
        name,
        password_hash: passwordHash,
        role: 'OWNER',
      },
    });

    // 3. Create Default Voice Agent for new Organization
    await prisma.voiceAgent.create({
      data: {
        organization_id: org.id,
        name: 'Ritu',
        company_name,
        agent_role: 'AI Voice Counselor',
        language: 'hi-IN',
        voice: 'alloy',
        welcome_message: `Namaste {{name}} ji, main ${company_name} se Ritu bol rahi hoon. Aapne hamare course/service ke baare me enquiry ki thi.`,
        system_prompt: `You are Ritu, an AI Voice Assistant for ${company_name}.
Speak naturally and politely in simple Hindi/Hinglish.
Keep answers short and conversational.
Understand why the person submitted the enquiry.
Ask qualification questions one at a time.
Answer questions using verified knowledge base.
If customer asks for a callback, invoke request_callback.
If customer asks not to be called, invoke do_not_call.`,
        objective: 'Qualify student/client enquiries, collect details, and offer callback.',
        max_call_duration_seconds: 300,
        recording_enabled: true,
        ai_disclosure_enabled: true,
        ai_disclosure_text: `Namaste {{name}} ji, main ${company_name} ki AI assistant Ritu bol rahi hoon.`,
      },
    });

    // 4. Create Initial Starter API Key
    const { key, prefix, hash } = generateApiKey('abf_live_');
    await prisma.apiKey.create({
      data: {
        organization_id: org.id,
        name: 'Default Website Leads Key',
        key_prefix: prefix,
        key_hash: hash,
        scopes: ['voice:lead', 'voice:call', 'call:read'],
      },
    });

    // 5. Record Welcome Bonus Transaction
    await prisma.billingTransaction.create({
      data: {
        organization_id: org.id,
        amount: 0,
        currency: 'INR',
        credits_minutes: 30.0,
        description: 'Welcome Free Trial Grant (30 Calling Minutes)',
        type: 'TRIAL_GRANT',
        status: 'completed',
      },
    });

    // Generate JWT Token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: org.id,
    });

    return reply.status(201).send({
      success: true,
      token,
      api_key: key,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: {
          id: org.id,
          name: org.name,
          slug: org.slug,
          plan: org.plan,
          credits_balance_minutes: org.credits_balance_minutes,
        },
      },
    });
  });

  /**
   * POST /api/v1/auth/login
   */
  fastify.post('/api/v1/auth/login', async (request, reply) => {
    const parseResult = LoginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Invalid email or password format' });
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organization_id,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
          plan: user.organization.plan,
          credits_balance_minutes: user.organization.credits_balance_minutes,
        },
      },
    };
  });

  /**
   * GET /api/v1/auth/me
   */
  fastify.get('/api/v1/auth/me', { preHandler: [authenticate] }, async (request, reply) => {
    if (!request.user) return reply.status(401).send({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: { organization: true },
    });

    if (!user) return reply.status(404).send({ error: 'User not found' });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
      },
    };
  });

  /**
   * PUT /api/v1/auth/profile
   * Update current user profile and company info
   */
  fastify.put('/api/v1/auth/profile', { preHandler: [authenticate] }, async (request, reply) => {
    if (!request.user) return reply.status(401).send({ error: 'Unauthorized' });

    const ProfileSchema = z.object({
      name: z.string().min(1, 'Name is required').optional(),
      company_name: z.string().min(1).optional(),
      billing_email: z.string().email().optional(),
    });

    const parseResult = ProfileSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { name, company_name, billing_email } = parseResult.data;

    // Update user name
    if (name) {
      await prisma.user.update({
        where: { id: request.user.id },
        data: { name },
      });
    }

    // Update organization details if user is OWNER or ADMIN
    if (request.user.role === 'OWNER' || request.user.role === 'ADMIN') {
      const orgUpdates: any = {};
      if (company_name) orgUpdates.name = company_name;
      if (billing_email) orgUpdates.billing_email = billing_email;

      if (Object.keys(orgUpdates).length > 0) {
        await prisma.organization.update({
          where: { id: request.user.organizationId },
          data: orgUpdates,
        });
      }
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: { organization: true },
    });

    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        name: updatedUser?.name,
        role: updatedUser?.role,
        organization: updatedUser?.organization,
      },
    };
  });

  /**
   * PUT /api/v1/auth/password
   * Change user password securely
   */
  fastify.put('/api/v1/auth/password', { preHandler: [authenticate] }, async (request, reply) => {
    if (!request.user) return reply.status(401).send({ error: 'Unauthorized' });

    const PasswordSchema = z.object({
      current_password: z.string().min(1, 'Current password is required'),
      new_password: z.string().min(6, 'New password must be at least 6 characters'),
    });

    const parseResult = PasswordSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { current_password, new_password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
    });

    if (!user) return reply.status(404).send({ error: 'User not found' });

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return reply.status(400).send({ error: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await prisma.user.update({
      where: { id: request.user.id },
      data: { password_hash: newHash },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  });
}
