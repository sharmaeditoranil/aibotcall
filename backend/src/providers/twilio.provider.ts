import {
  TelephonyProvider,
  MakeCallParams,
  MakeCallResult,
  CallStatusResult,
  StatusWebhookResult,
} from './telephony.interface.js';
import { logger } from '../utils/logger.js';

/**
 * Pluggable Twilio Provider implementation.
 * Demonstrates modularity without modifying core business logic.
 */
export class TwilioProvider implements TelephonyProvider {
  readonly name = 'twilio';
  private accountSid: string;
  private authToken: string;
  private callerId: string;

  constructor(options?: { accountSid?: string; authToken?: string; callerId?: string }) {
    this.accountSid = options?.accountSid || process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = options?.authToken || process.env.TWILIO_AUTH_TOKEN || '';
    this.callerId = options?.callerId || process.env.TWILIO_CALLER_ID || '';
  }

  async makeCall(params: MakeCallParams): Promise<MakeCallResult> {
    logger.info({ provider: 'twilio', internalCallId: params.internalCallId }, 'Twilio makeCall called');
    // Using Twilio TwiML <Connect><Stream url="..."/></Connect>
    const mockSid = `CA${Date.now()}`;
    return {
      success: true,
      providerCallId: mockSid,
      status: 'queued',
    };
  }

  async hangupCall(providerCallId: string): Promise<boolean> {
    logger.info({ provider: 'twilio', providerCallId }, 'Twilio hangupCall called');
    return true;
  }

  async getCallStatus(providerCallId: string): Promise<CallStatusResult> {
    return {
      providerCallId,
      status: 'completed',
    };
  }

  async startStream(providerCallId: string, streamUrl: string): Promise<boolean> {
    return true;
  }

  async handleStatusWebhook(payload: any): Promise<StatusWebhookResult> {
    const rawStatus = (payload?.CallStatus || 'completed').toLowerCase();
    let status: 'queued' | 'ringing' | 'in_progress' | 'completed' | 'busy' | 'no_answer' | 'failed' | 'unknown' = 'unknown';

    if (rawStatus === 'queued' || rawStatus === 'initiated') status = 'queued';
    else if (rawStatus === 'ringing') status = 'ringing';
    else if (rawStatus === 'in-progress') status = 'in_progress';
    else if (rawStatus === 'completed') status = 'completed';
    else if (rawStatus === 'busy') status = 'busy';
    else if (rawStatus === 'no-answer') status = 'no_answer';
    else if (rawStatus === 'failed' || rawStatus === 'canceled') status = 'failed';

    return {
      event: 'call.status',
      providerCallId: payload?.CallSid || '',
      status,
      duration: payload?.CallDuration ? parseInt(payload.CallDuration, 10) : undefined,
      recordingUrl: payload?.RecordingUrl,
      raw: payload,
    };
  }

  async getRecording(providerCallId: string): Promise<string | null> {
    return null;
  }
}
