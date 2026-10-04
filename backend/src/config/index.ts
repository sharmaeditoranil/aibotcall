import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env if present
dotenv.config();

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  host: string;
  appUrl: string;
  databaseUrl: string;
  redisUrl: string;
  openai: {
    apiKey: string;
    realtimeModel: string;
    realtimeWsUrl: string;
  };
  exotel: {
    apiKey: string;
    apiToken: string;
    accountSid: string;
    callerId: string;
    baseUrl: string;
    streamUrl: string;
  };
  webhooks: {
    publicBaseUrl: string;
    crmWebhookUrl: string;
    crmWebhookSecret: string;
    incomingWebhookSecret: string;
  };
  telephony: {
    concurrency: number;
    defaultMaxCallDuration: number;
  };
  razorpay: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
  };
  security: {
    encryptionKey: string;
    jwtSecret: string;
  };
}

export const config: AppConfig = {
  env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  host: process.env.HOST || '0.0.0.0',
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://voice_user:voice_secure_pass_123@localhost:5432/voice_db?schema=public',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    realtimeModel: process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview',
    realtimeWsUrl: 'wss://api.openai.com/v1/realtime',
  },
  exotel: {
    apiKey: process.env.EXOTEL_API_KEY || '',
    apiToken: process.env.EXOTEL_API_TOKEN || '',
    accountSid: process.env.EXOTEL_ACCOUNT_SID || '',
    callerId: process.env.EXOTEL_CALLER_ID || '',
    baseUrl: process.env.EXOTEL_BASE_URL || 'https://api.exotel.com',
    streamUrl: process.env.EXOTEL_STREAM_URL || 'wss://voice.yourdomain.com/exotel/media',
  },
  webhooks: {
    publicBaseUrl: process.env.PUBLIC_WEBHOOK_BASE_URL || 'http://localhost:4000',
    crmWebhookUrl: process.env.CRM_WEBHOOK_URL || '',
    crmWebhookSecret: process.env.CRM_WEBHOOK_SECRET || 'whsec_default_secret_key',
    incomingWebhookSecret: process.env.INCOMING_WEBHOOK_SECRET || '',
  },
  telephony: {
    concurrency: parseInt(process.env.CALL_CONCURRENCY || '5', 10),
    defaultMaxCallDuration: parseInt(process.env.DEFAULT_MAX_CALL_DURATION || '300', 10),
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_AiBotCallDefaultKey',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_AiBotCallSecret123',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret-voice-platform-2026',
  },
};
