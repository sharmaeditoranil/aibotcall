import { FastifyInstance } from 'fastify';
import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { prisma } from '../db/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

const ExotelConfigSchema = z.object({
  account_sid: z.string().min(1, 'Account SID is required'),
  api_key: z.string().min(1, 'API Key is required'),
  api_token: z.string().min(1, 'API Token is required'),
  caller_id: z.string().min(10, 'Valid 10-12 digit Virtual Number / Caller ID required'),
  custom_telephony_enabled: z.boolean().default(true),
});

const CrmWebhookSchema = z.object({
  crm_webhook_url: z.string().url('Valid Webhook URL is required'),
  crm_webhook_secret: z.string().optional(),
});

export async function integrationsRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  /**
   * GET /api/v1/integrations
   * Get all active integration configs & health
   */
  fastify.get('/api/v1/integrations', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const [org, defaultAgent, apiKey] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: orgId },
        select: {
          id: true,
          name: true,
          custom_telephony_enabled: true,
          exotel_account_sid: true,
          exotel_caller_id: true,
          exotel_api_key: true,
          exotel_api_token: true,
        },
      }),
      prisma.voiceAgent.findFirst({
        where: { organization_id: orgId },
        select: { id: true, name: true, crm_webhook_url: true },
      }),
      prisma.apiKey.findFirst({
        where: { organization_id: orgId },
        select: { key_prefix: true, name: true },
      }),
    ]);

    if (!org) return reply.status(404).send({ error: 'Organization not found' });

    // Mask sensitive keys for secure UI display
    const maskedExotelKey = org.exotel_api_key
      ? `${org.exotel_api_key.slice(0, 4)}••••••••${org.exotel_api_key.slice(-3)}`
      : null;
    const maskedAccountSid = org.exotel_account_sid
      ? `${org.exotel_account_sid.slice(0, 4)}••••••••`
      : null;

    const incomingWebhookUrl = `${config.webhooks.publicBaseUrl}/api/v1/webhooks/leads`;

    return {
      telephony: {
        provider: 'Exotel',
        is_custom_configured: !!org.custom_telephony_enabled && !!org.exotel_account_sid,
        caller_id: org.exotel_caller_id || config.exotel.callerId || '',
        account_sid: org.exotel_account_sid || config.exotel.accountSid || '',
        api_key: org.exotel_api_key || config.exotel.apiKey || '',
        api_token: org.exotel_api_token || config.exotel.apiToken || '',
        account_sid_masked: maskedAccountSid,
        api_key_masked: maskedExotelKey,
        custom_enabled: org.custom_telephony_enabled,
        media_stream_url: config.exotel.streamUrl,
      },
      ai_engine: {
        provider: 'OpenAI Realtime Voice',
        model: config.openai.realtimeModel,
        openai_key: config.openai.apiKey || '',
        voice_latency: '< 450ms',
        audio_codec: 'G.711 mu-law (8kHz Telephony Native)',
        turn_detection: 'Server VAD (High Precision)',
      },
      crm_webhook: {
        crm_webhook_url: defaultAgent?.crm_webhook_url || config.webhooks.crmWebhookUrl || '',
        signing_secret_configured: !!config.webhooks.crmWebhookSecret,
        signature_header: 'X-AiBotFlow-Signature',
      },
      lead_ingestion: {
        webhook_url: incomingWebhookUrl,
        api_key_prefix: apiKey?.key_prefix ? `${apiKey.key_prefix}••••••••` : 'Available in API Keys tab',
      },
    };
  });

  /**
   * PUT /api/v1/integrations/exotel
   * Save customer Exotel telephony credentials
   */
  fastify.put('/api/v1/integrations/exotel', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const parseResult = ExotelConfigSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      });
    }

    const { account_sid, api_key, api_token, caller_id, custom_telephony_enabled } = parseResult.data;

    await prisma.organization.update({
      where: { id: orgId },
      data: {
        exotel_account_sid: account_sid.trim(),
        exotel_api_key: api_key.trim(),
        exotel_api_token: api_token.trim(),
        exotel_caller_id: caller_id.trim(),
        custom_telephony_enabled,
      },
    });

    logger.info({ orgId, caller_id }, 'Updated Exotel telephony credentials');

    return {
      success: true,
      message: 'Exotel telephony credentials connected successfully!',
    };
  });

  /**
   * PUT /api/v1/integrations/crm
   * Set CRM outgoing webhook URL on active agents
   */
  fastify.put('/api/v1/integrations/crm', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const parseResult = CrmWebhookSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Invalid webhook URL' });
    }

    const { crm_webhook_url } = parseResult.data;

    await prisma.voiceAgent.updateMany({
      where: { organization_id: orgId },
      data: { crm_webhook_url },
    });

    return {
      success: true,
      message: 'CRM outgoing webhook URL updated across voice agents!',
      crm_webhook_url,
    };
  });

  /**
   * PUT /api/v1/integrations/all-settings
   * Master save for Telephony, OpenAI, CRM webhook and Call Watchdogs
   */
  fastify.put('/api/v1/integrations/all-settings', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const body = request.body as any;
    const {
      caller_id,
      account_sid,
      api_key,
      api_token,
      openai_key,
      realtime_model,
      crm_webhook_url,
      concurrency,
    } = body || {};

    // 1. Update Organization in PostgreSQL
    const updateData: any = {};
    if (caller_id) updateData.exotel_caller_id = caller_id.trim();
    if (account_sid) updateData.exotel_account_sid = account_sid.trim();
    if (api_key) updateData.exotel_api_key = api_key.trim();
    if (api_token) updateData.exotel_api_token = api_token.trim();
    if (account_sid || api_key) updateData.custom_telephony_enabled = true;
    if (concurrency) updateData.max_concurrency = parseInt(concurrency, 10) || 5;

    if (Object.keys(updateData).length > 0) {
      await prisma.organization.update({
        where: { id: orgId },
        data: updateData,
      });
    }

    // 2. Update CRM webhook on all active agents
    if (crm_webhook_url) {
      await prisma.voiceAgent.updateMany({
        where: { organization_id: orgId },
        data: { crm_webhook_url: crm_webhook_url.trim() },
      });
      config.webhooks.crmWebhookUrl = crm_webhook_url.trim();
    }

    // 3. Update in-memory runtime config
    if (openai_key) {
      config.openai.apiKey = openai_key.trim();
      process.env.OPENAI_API_KEY = openai_key.trim();
    }
    if (realtime_model) {
      config.openai.realtimeModel = realtime_model;
      process.env.OPENAI_REALTIME_MODEL = realtime_model;
    }
    if (caller_id) {
      config.exotel.callerId = caller_id.trim();
      process.env.EXOTEL_CALLER_ID = caller_id.trim();
    }
    if (account_sid) {
      config.exotel.accountSid = account_sid.trim();
      process.env.EXOTEL_ACCOUNT_SID = account_sid.trim();
    }
    if (api_key) {
      config.exotel.apiKey = api_key.trim();
      process.env.EXOTEL_API_KEY = api_key.trim();
    }
    if (api_token) {
      config.exotel.apiToken = api_token.trim();
      process.env.EXOTEL_API_TOKEN = api_token.trim();
    }

    // 4. Update .env files on disk for permanence
    const envPaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), '../.env'),
      '/var/www/voice.aibotflow.in/backend/.env',
      '/var/www/voice.aibotflow.in/.env',
    ];

    for (const p of envPaths) {
      try {
        if (fs.existsSync(p)) {
          let content = fs.readFileSync(p, 'utf8');
          const updateOrAdd = (key: string, val: string) => {
            if (!val) return;
            const regex = new RegExp(`^${key}=.*$`, 'm');
            if (regex.test(content)) {
              content = content.replace(regex, `${key}=${val}`);
            } else {
              content += `\n${key}=${val}`;
            }
          };

          if (openai_key) updateOrAdd('OPENAI_API_KEY', openai_key.trim());
          if (realtime_model) updateOrAdd('OPENAI_REALTIME_MODEL', realtime_model);
          if (caller_id) updateOrAdd('EXOTEL_CALLER_ID', caller_id.trim());
          if (account_sid) updateOrAdd('EXOTEL_ACCOUNT_SID', account_sid.trim());
          if (api_key) updateOrAdd('EXOTEL_API_KEY', api_key.trim());
          if (api_token) updateOrAdd('EXOTEL_API_TOKEN', api_token.trim());
          if (crm_webhook_url) updateOrAdd('CRM_WEBHOOK_URL', crm_webhook_url.trim());

          fs.writeFileSync(p, content, 'utf8');
        }
      } catch {
        // ignore errors
      }
    }

    logger.info({ orgId }, 'All system & telephony settings updated successfully');

    return {
      success: true,
      message: 'All System, Exotel & OpenAI settings saved permanently! 🎉',
    };
  });

  /**
   * POST /api/v1/integrations/test-crm-webhook
   * Sends a test ping to the user's CRM webhook
   */
  fastify.post('/api/v1/integrations/test-crm-webhook', async (request, reply) => {
    const { url } = request.body as { url: string };
    if (!url) return reply.status(400).send({ error: 'URL is required' });

    const testPayload = {
      event: 'call.test_ping',
      timestamp: new Date().toISOString(),
      platform: 'AiBotCall',
      message: 'This is a test webhook payload from AiBotCall Voice Platform.',
      sample_call: {
        call_id: 'test_call_998877',
        customer_phone: '+919876543210',
        customer_name: 'Test Customer',
        duration_seconds: 68,
        disposition: 'qualified',
        transcription_summary: 'Customer expressed high interest in demo.',
      },
    };

    const secret = config.webhooks.crmWebhookSecret || 'whsec_sample_key';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(testPayload))
      .digest('hex');

    try {
      const response = await axios.post(url, testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'X-AiBotFlow-Signature': signature,
          'User-Agent': 'AiBotCall-Webhook-Tester/1.0',
        },
        timeout: 5000,
      });

      return {
        success: true,
        status_code: response.status,
        response_data: typeof response.data === 'object' ? response.data : String(response.data).slice(0, 100),
        message: `Successfully reached CRM webhook (HTTP ${response.status})!`,
      };
    } catch (err: any) {
      return reply.status(400).send({
        success: false,
        error: `Webhook delivery test failed: ${err.message}`,
        details: err.response?.data || null,
      });
    }
  });

  /**
   * GET /api/v1/integrations/embed-snippets
   * Returns ready-to-use snippets for WordPress, HTML forms, React, Webflow
   */
  fastify.get('/api/v1/integrations/embed-snippets', async (request, reply) => {
    const orgId = request.user?.organizationId;
    if (!orgId) return reply.status(401).send({ error: 'Unauthorized' });

    const apiKeyRecord = await prisma.apiKey.findFirst({
      where: { organization_id: orgId },
      select: { key_prefix: true },
    });

    const leadUrl = `${config.webhooks.publicBaseUrl}/api/v1/webhooks/leads`;
    const sampleApiKey = apiKeyRecord ? `${apiKeyRecord.key_prefix}YOUR_ACTUAL_SECRET_KEY` : 'YOUR_AIBOTCALL_API_KEY';

    const htmlFormSnippet = `<!-- AiBotCall Instant Voice Lead Capture Form -->
<form id="ai-voice-lead-form" style="max-width: 420px; font-family: sans-serif; display: flex; flex-direction: column; gap: 12px;">
  <input type="text" id="lead_name" placeholder="Aapka Naam / Full Name" required style="padding: 10px; border-radius: 6px; border: 1px solid #ccc;" />
  <input type="tel" id="lead_phone" placeholder="Mobile Number (e.g. 9876543210)" required style="padding: 10px; border-radius: 6px; border: 1px solid #ccc;" />
  <input type="text" id="lead_city" placeholder="City (Optional)" style="padding: 10px; border-radius: 6px; border: 1px solid #ccc;" />
  <button type="submit" style="background: #4f46e5; color: white; padding: 12px; font-weight: bold; border-radius: 6px; border: none; cursor: pointer;">
    Request Instant AI Callback 📞
  </button>
  <div id="ai-call-status" style="font-size: 13px; color: #666; text-align: center;"></div>
</form>

<script>
document.getElementById('ai-voice-lead-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const statusEl = document.getElementById('ai-call-status');
  statusEl.innerText = 'Calling your phone in 10 seconds via AiBotCall...';

  try {
    const res = await fetch('${leadUrl}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '${sampleApiKey}'
      },
      body: JSON.stringify({
        name: document.getElementById('lead_name').value,
        phone: document.getElementById('lead_phone').value,
        city: document.getElementById('lead_city').value,
        source: 'Website Landing Page'
      })
    });
    const data = await res.json();
    if (res.ok) {
      statusEl.innerHTML = '<span style="color: green;">✓ AI Call Initiated! Please check your phone.</span>';
    } else {
      statusEl.innerText = 'Error: ' + (data.error || 'Failed to dispatch call');
    }
  } catch(err) {
    statusEl.innerText = 'Connection error. Please try again.';
  }
});
</script>`;

    const wordpressPhpSnippet = `<?php
// Add this to your WordPress Child Theme functions.php
// Triggers an instant AiBotCall when Contact Form 7 is submitted
add_action('wpcf7_mail_sent', 'trigger_aibotcall_instant_call');
function trigger_aibotcall_instant_call($contact_form) {
    $submission = WPCF7_Submission::get_instance();
    if ($submission) {
        $posted_data = $submission->get_posted_data();
        $name = isset($posted_data['your-name']) ? $posted_data['your-name'] : '';
        $phone = isset($posted_data['your-tel']) ? $posted_data['your-tel'] : '';
        
        if (!empty($phone)) {
            wp_remote_post('${leadUrl}', array(
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'X-API-Key' => '${sampleApiKey}'
                ),
                'body' => json_encode(array(
                    'name' => $name,
                    'phone' => $phone,
                    'source' => 'WordPress CF7 Form'
                )),
                'timeout' => 5
            ));
        }
    }
}`;

    const reactSnippet = `// React Lead Submission Handler
import React, { useState } from 'react';

export function QuickCallLeadForm() {
  const [form, setForm] = useState({ name: '', phone: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('${leadUrl}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': '${sampleApiKey}',
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          city: form.city,
          source: 'React Web App',
        }),
      });
      const data = await res.json();
      setMessage(data.message || 'Call scheduled!');
    } catch (err) {
      setMessage('Call dispatch error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" required />
      <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" required />
      <button type="submit" disabled={loading}>{loading ? 'Calling...' : 'Call Me Now'}</button>
      {message && <p>{message}</p>}
    </form>
  );
}`;

    return {
      snippets: {
        html_form: htmlFormSnippet,
        wordpress_php: wordpressPhpSnippet,
        react_component: reactSnippet,
      },
      webhook_url: leadUrl,
      api_key_sample: sampleApiKey,
    };
  });
}
