import pino from 'pino';
import { config } from '../config/index.js';

export const logger = pino({
  level: config.env === 'development' ? 'debug' : 'info',
  transport:
    config.env === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss Z',
          },
        }
      : undefined,
  redact: {
    paths: [
      'req.headers.authorization',
      'headers.authorization',
      'req.headers["x-api-key"]',
      'headers["x-api-key"]',
      'password',
      'password_hash',
      'secret',
      'apiKey',
      'apiToken',
      'media.payload',
      'audio',
      'base64Audio',
      'data.payload',
    ],
    remove: true,
  },
});

export interface LogContext {
  request_id?: string;
  call_id?: string;
  provider_call_id?: string;
  lead_id?: string;
  campaign_id?: string;
  organization_id?: string;
}

export function createChildLogger(context: LogContext) {
  return logger.child(context);
}
