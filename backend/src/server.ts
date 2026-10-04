import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import websocket from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { handleExotelMediaWebSocket } from './websocket/voice-gateway.js';
import { healthRoutes } from './routes/health.route.js';
import { leadsWebhookRoute } from './routes/leads-webhook.route.js';
import { exotelWebhookRoute } from './routes/exotel-webhook.route.js';
import { callsRoute } from './routes/calls.route.js';
import { campaignsRoute } from './routes/campaigns.route.js';
import { agentsRoute } from './routes/agents.route.js';
import { knowledgeRoute } from './routes/knowledge.route.js';
import { suppressionRoute } from './routes/suppression.route.js';
import { apiKeysRoute } from './routes/api-keys.route.js';
import { webhooksRoute } from './routes/webhooks.route.js';
import { analyticsRoute } from './routes/analytics.route.js';
import { authRoute } from './routes/auth.route.js';
import { billingRoute } from './routes/billing.route.js';
import { teamRoute } from './routes/team.route.js';
import { adminRoute } from './routes/admin.route.js';
import { integrationsRoute } from './routes/integrations.route.js';
import { phoneNumbersRoute } from './routes/phone-numbers.route.js';
import { referralsRoute } from './routes/referrals.route.js';

export async function buildServer() {
  const fastify = Fastify({
    logger: false, // We use custom Pino logger
    bodyLimit: 10 * 1024 * 1024, // 10MB limit for CSV uploads
  });

  // Enable CORS
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  // Enable URL-encoded form body parsing (Required for Exotel callbacks)
  await fastify.register(formbody);

  // Enable WebSocket support
  await fastify.register(websocket, {
    options: {
      maxPayload: 1024 * 1024, // 1MB for audio chunks
    },
  });

  // Register dedicated Bidirectional Voice WebSocket Gateway
  fastify.register(async function (voiceScope) {
    voiceScope.get('/exotel/media', { websocket: true }, (connection: any, req) => {
      const ws = connection.socket || connection;
      handleExotelMediaWebSocket(ws, req);
    });
    // Alias for generic voice media streaming
    voiceScope.get('/voice/media', { websocket: true }, (connection: any, req) => {
      const ws = connection.socket || connection;
      handleExotelMediaWebSocket(ws, req);
    });
  });

  // Register REST API Routes
  await fastify.register(healthRoutes);
  await fastify.register(authRoute);
  await fastify.register(leadsWebhookRoute);
  await fastify.register(exotelWebhookRoute);
  await fastify.register(callsRoute);
  await fastify.register(campaignsRoute);
  await fastify.register(agentsRoute);
  await fastify.register(knowledgeRoute);
  await fastify.register(suppressionRoute);
  await fastify.register(apiKeysRoute);
  await fastify.register(webhooksRoute);
  await fastify.register(analyticsRoute);
  await fastify.register(billingRoute);
  await fastify.register(teamRoute);
  await fastify.register(adminRoute);
  await fastify.register(integrationsRoute);
  await fastify.register(phoneNumbersRoute);
  await fastify.register(referralsRoute);

  // Serve static dashboard if built
  const frontendDist = path.resolve(process.cwd(), '../frontend/dist');
  if (fs.existsSync(frontendDist)) {
    await fastify.register(fastifyStatic, {
      root: frontendDist,
      prefix: '/',
    });

    fastify.setNotFoundHandler((req, reply) => {
      if (!req.raw.url?.startsWith('/api/') && !req.raw.url?.startsWith('/exotel/')) {
        reply.sendFile('index.html');
      } else {
        reply.status(404).send({ error: 'Endpoint not found' });
      }
    });
  }

  return fastify;
}

async function start() {
  try {
    const server = await buildServer();
    await server.listen({ port: config.port, host: config.host });
    logger.info(
      `🚀 AiBotCall Server running on http://${config.host}:${config.port}`
    );
    logger.info(
      `🎙️ Exotel Media Stream WebSocket ready at wss://${config.host}:${config.port}/exotel/media`
    );
    logger.info(
      `🔗 Ingestion webhook endpoint: http://${config.host}:${config.port}/api/v1/webhooks/leads`
    );
  } catch (err: any) {
    logger.error({ err: err.message }, 'Failed to start server');
    process.exit(1);
  }
}

// Start server
start();
