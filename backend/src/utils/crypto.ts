import crypto from 'crypto';
import { config } from '../config/index.js';

// AES-256-GCM Encryption for credentials at rest
export function encryptCredential(plainText: string): string {
  if (!plainText) return '';
  const key = Buffer.from(config.security.encryptionKey.slice(0, 64), 'hex');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptCredential(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(':')) return '';
  try {
    const [ivHex, authTagHex, encryptedHex] = encryptedData.split(':');
    const key = Buffer.from(config.security.encryptionKey.slice(0, 64), 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return '';
  }
}

// HMAC-SHA256 Signature Generation & Verification
export function generateHmacSignature(payload: string | object, secret: string): string {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

export function verifyHmacSignature(payload: string | object, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const expected = generateHmacSignature(payload, secret);
    const expectedBuf = Buffer.from(expected);
    const signatureBuf = Buffer.from(signature);
    if (expectedBuf.length !== signatureBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, signatureBuf);
  } catch {
    return false;
  }
}

// API Key generation
export function generateApiKey(prefix = 'abf_live_'): { key: string; prefix: string; hash: string } {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const key = `${prefix}${randomBytes}`;
  const keyPrefix = key.slice(0, 15);
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  return { key, prefix: keyPrefix, hash };
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

// Mask sensitive credentials for UI display
export function maskSecret(secret?: string | null): string {
  if (!secret) return '';
  if (secret.length <= 8) return '••••••••';
  const prefix = secret.slice(0, 4);
  const suffix = secret.slice(-4);
  return `${prefix}••••••••${suffix}`;
}

export function generateEventId(prefix = 'evt'): string {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

export function generateCallId(): string {
  return `call_${Date.now()}_${crypto.randomBytes(5).toString('hex')}`;
}
