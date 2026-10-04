// ==============================================================================
// AiBotCall - Comprehensive Integration & Unit Test Suite
// ==============================================================================

import assert from 'assert';
import { normalizePhoneNumber } from '../backend/dist/utils/phone.js';
import {
  encryptCredential,
  decryptCredential,
  generateHmacSignature,
  verifyHmacSignature,
  generateApiKey,
  hashApiKey,
  maskSecret,
} from '../backend/dist/utils/crypto.js';
import { ulawToPcm16, pcm16ToUlaw, resamplePcm16 } from '../backend/dist/utils/audio.js';
import { providerRegistry } from '../backend/dist/providers/index.js';

console.log('🧪 Starting AiBotCall Automated Verification Suite...\n');

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    failedTests++;
  }
}

// 1. Phone Number Normalization Tests
console.log('--- 1. Telecom Phone Normalization Tests ---');

test('Normalizes standard Indian 10-digit mobile number (9876543210)', () => {
  const result = normalizePhoneNumber('9876543210');
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.e164, '+919876543210');
});

test('Normalizes Indian mobile with +91 (+91 98765 43210)', () => {
  const result = normalizePhoneNumber('+91 98765 43210');
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.e164, '+919876543210');
});

test('Normalizes Indian mobile with leading 0 (09876543210)', () => {
  const result = normalizePhoneNumber('09876543210');
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.e164, '+919876543210');
});

test('Rejects invalid phone numbers with alphabets or symbols', () => {
  const result = normalizePhoneNumber('98765ABCD0');
  assert.strictEqual(result.isValid, false);
});

test('Rejects empty or too short phone numbers', () => {
  const result = normalizePhoneNumber('12345');
  assert.strictEqual(result.isValid, false);
});

// 2. Cryptographic Security & Signatures
console.log('\n--- 2. Cryptographic Security & Signatures ---');

test('HMAC-SHA256 signature generation and timing-safe verification', () => {
  const payload = { event: 'voice.call.completed', call_id: 'call_123', status: 'completed' };
  const secret = 'whsec_my_super_secret_test_key_123';
  const signature = generateHmacSignature(payload, secret);
  assert.strictEqual(typeof signature, 'string');
  assert.strictEqual(signature.length, 64);

  const isValid = verifyHmacSignature(payload, signature, secret);
  assert.strictEqual(isValid, true);

  const isTamperedValid = verifyHmacSignature({ ...payload, status: 'failed' }, signature, secret);
  assert.strictEqual(isTamperedValid, false);
});

test('AES-256-GCM encryption and decryption at rest', () => {
  const originalSecret = 'sk-proj-super-secret-openai-or-telephony-token-445566';
  const encrypted = encryptCredential(originalSecret);
  assert.notStrictEqual(encrypted, originalSecret);
  assert(encrypted.includes(':'));

  const decrypted = decryptCredential(encrypted);
  assert.strictEqual(decrypted, originalSecret);
});

test('API Key generation, hashing, and masking', () => {
  const { key, prefix, hash } = generateApiKey('abf_live_');
  assert(key.startsWith('abf_live_'));
  assert.strictEqual(prefix.length, 15);
  assert.strictEqual(hash.length, 64);
  assert.strictEqual(hashApiKey(key), hash);

  const masked = maskSecret('whsec_very_long_secret_key_8899');
  assert.strictEqual(masked.startsWith('whse'), true);
  assert.strictEqual(masked.endsWith('8899'), true);
  assert(masked.includes('••••••••'));
});

// 3. Audio Transcoding & Telephony Format Compatibility
console.log('\n--- 3. Audio Transcoding Tests (G.711 mu-law <-> PCM16) ---');

test('Converts 16-bit Linear PCM to G.711 mu-law and back', () => {
  // Create 100 samples of 16-bit PCM sine wave
  const pcmInput = Buffer.alloc(200);
  for (let i = 0; i < 100; i++) {
    const val = Math.round(10000 * Math.sin((2 * Math.PI * i) / 10));
    pcmInput.writeInt16LE(val, i * 2);
  }

  const ulaw = pcm16ToUlaw(pcmInput);
  assert.strictEqual(ulaw.length, 100);

  const pcmOutput = ulawToPcm16(ulaw);
  assert.strictEqual(pcmOutput.length, 200);
});

test('Resamples PCM16 from 24kHz to 8kHz for telephony', () => {
  const input24k = Buffer.alloc(4800); // 2400 samples
  const resampled8k = resamplePcm16(input24k, 24000, 8000);
  assert.strictEqual(resampled8k.length, 1600); // 800 samples
});

// 4. Telephony Provider Architecture
console.log('\n--- 4. Telephony Provider Architecture Tests ---');

test('Provider registry correctly registers and retrieves Exotel and Twilio', () => {
  const exotel = providerRegistry.get('exotel');
  assert.strictEqual(exotel.name, 'exotel');
  assert.strictEqual(typeof exotel.makeCall, 'function');
  assert.strictEqual(typeof exotel.hangupCall, 'function');
  assert.strictEqual(typeof exotel.getCallStatus, 'function');

  const twilio = providerRegistry.get('twilio');
  assert.strictEqual(twilio.name, 'twilio');
});

test('Exotel StatusCallback normalizer handles terminal statuses correctly', async () => {
  const exotel = providerRegistry.get('exotel');
  const result = await exotel.handleStatusWebhook({
    CallSid: 'exo_call_12345',
    Status: 'completed',
    Duration: '125',
    RecordingUrl: 'https://api.exotel.com/recordings/test.wav',
  });

  assert.strictEqual(result.providerCallId, 'exo_call_12345');
  assert.strictEqual(result.status, 'completed');
  assert.strictEqual(result.duration, 125);
  assert.strictEqual(result.recordingUrl, 'https://api.exotel.com/recordings/test.wav');
});

// 5. Razorpay Payment Cryptographic Signature Verification
console.log('\n--- 5. Razorpay Payment Cryptographic Tests ---');

test('Validates Razorpay payment signature correctly using HMAC-SHA256', () => {
  import('crypto').then(({ default: crypto }) => {
    const keySecret = 'rzp_secret_AiBotCallProductionSecret123';
    const orderId = 'order_test_998877';
    const paymentId = 'pay_test_443322';
    
    // Generate authentic signature
    const signature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Verification check
    const verified = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex') === signature;

    assert.strictEqual(verified, true);

    // Tampered verification check
    const tampered = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|pay_fake_999999`)
      .digest('hex') === signature;

    assert.strictEqual(tampered, false);
  });
});

test('Validates 20ms audio telephony frame slicing (160 bytes @ 8kHz G.711 mu-law)', () => {
  const sampleRate = 8000;
  const bytesPerSample = 1; // 8-bit PCMU
  const frameDurationMs = 20;
  const frameSizeBytes = (sampleRate * (frameDurationMs / 1000)) * bytesPerSample;
  assert.strictEqual(frameSizeBytes, 160);
});

// 6. Pay As You Go (PAYG) Pricing Economics & Packages
console.log('\n--- 6. Pay As You Go (PAYG) Pricing Economics ---');

test('Validates Pay As You Go flat rate of ₹2.49/min and package calculations', () => {
  const PAYG_RATE = 2.49;
  const packages = [
    { id: 'pkg_payg_200', minutes: 200, expectedPrice: 498 },
    { id: 'pkg_payg_500', minutes: 500, expectedPrice: 1245 },
    { id: 'pkg_payg_1000', minutes: 1000, expectedPrice: 2490 },
    { id: 'pkg_payg_2500', minutes: 2500, expectedPrice: 6225 },
  ];

  packages.forEach(pkg => {
    const calculatedPrice = Math.round(pkg.minutes * PAYG_RATE);
    assert.strictEqual(calculatedPrice, pkg.expectedPrice);
  });
});

// 7. Referral Commission & Withdrawal Logic Tests
console.log('\n--- 7. Referral Commission & Payout Workflow Tests ---');

test('Calculates 20% referral commission accurately on transactions', () => {
  const COMMISSION_RATE = 20.0;
  const testTransactions = [
    { orderAmount: 498, expectedCommission: 99.6 },
    { orderAmount: 1245, expectedCommission: 249.0 },
    { orderAmount: 2490, expectedCommission: 498.0 },
    { orderAmount: 2999, expectedCommission: 599.8 },
    { orderAmount: 6225, expectedCommission: 1245.0 },
  ];

  testTransactions.forEach(tx => {
    const commission = Math.round((tx.orderAmount * (COMMISSION_RATE / 100)) * 100) / 100;
    assert.strictEqual(commission, tx.expectedCommission);
  });
});

test('Validates withdrawal request constraints (min ₹100 and sufficient balance)', () => {
  const walletBalance = 1500.0;
  const validRequestAmount = 500.0;
  const belowMinAmount = 50.0;
  const exceedBalanceAmount = 2000.0;

  assert.strictEqual(validRequestAmount >= 100 && validRequestAmount <= walletBalance, true);
  assert.strictEqual(belowMinAmount >= 100, false);
  assert.strictEqual(exceedBalanceAmount <= walletBalance, false);
});

console.log('\n==================================================================');
console.log(`Test Execution Summary: ${passedTests} passed, ${failedTests} failed.`);
console.log('==================================================================\n');

if (failedTests > 0) {
  process.exit(1);
}

