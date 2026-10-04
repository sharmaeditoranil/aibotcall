import axios, { AxiosInstance } from 'axios';
import {
  TelephonyProvider,
  MakeCallParams,
  MakeCallResult,
  CallStatusResult,
  StatusWebhookResult,
} from './telephony.interface.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export class ExotelProvider implements TelephonyProvider {
  readonly name = 'exotel';
  private client: AxiosInstance;
  private accountSid: string;
  private callerId: string;
  private baseUrl: string;

  constructor(options?: {
    apiKey?: string;
    apiToken?: string;
    accountSid?: string;
    callerId?: string;
    baseUrl?: string;
  }) {
    const apiKey = options?.apiKey || config.exotel.apiKey;
    const apiToken = options?.apiToken || config.exotel.apiToken;
    this.accountSid = options?.accountSid || config.exotel.accountSid;
    this.callerId = options?.callerId || config.exotel.callerId;
    this.baseUrl = (options?.baseUrl || config.exotel.baseUrl).replace(/\/$/, '');

    const basicAuth = Buffer.from(`${apiKey}:${apiToken}`).toString('base64');
    this.client = axios.create({
      baseURL: `${this.baseUrl}/v1/Accounts/${this.accountSid}`,
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });
  }

  /**
   * Triggers an outbound call using Exotel Call Connect API.
   */
  async makeCall(params: MakeCallParams): Promise<MakeCallResult> {
    const fromNumber = params.from || this.callerId;
    const toNumber = params.to;

    // Format Indian numbers for Exotel: 10-digit with leading 0 (e.g. 09939967431)
    const formatNumber = (num: string): string => {
      let cleaned = (num || '').replace(/\D/g, '');
      if (cleaned.startsWith('91') && cleaned.length === 12) {
        cleaned = '0' + cleaned.substring(2);
      } else if (cleaned.length === 10) {
        cleaned = '0' + cleaned;
      }
      return cleaned;
    };

    const formattedTo = formatNumber(toNumber);
    const formattedFrom = formatNumber(fromNumber);

    // Build URL query params for status callback and stream
    const statusCallback = `${params.statusCallbackUrl}?internal_call_id=${encodeURIComponent(
      params.internalCallId
    )}&agent_id=${encodeURIComponent(params.agentId)}`;

    // Prepare payload for Exotel Connect API
    // Exotel accepts x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('From', formattedTo); // Customer phone (first party to dial)
    formData.append('To', formattedFrom); // Second party (ExoPhone virtual number)
    formData.append('CallerId', formattedFrom); // Exophone virtual number
    formData.append('CallType', 'trans'); // Transactional
    formData.append('StatusCallback', statusCallback);
    formData.append('StatusCallbackEventType', 'terminal');
    formData.append('CustomField', params.internalCallId);

    // If maxDuration specified
    if (params.maxDuration) {
      formData.append('TimeLimit', params.maxDuration.toString());
    }

    // Attach stream URL if custom applet or stream flow is specified
    if (params.streamUrl) {
      formData.append('StreamUrl', params.streamUrl);
    }

    logger.info(
      {
        provider: 'exotel',
        internalCallId: params.internalCallId,
        from: formattedTo,
        to: formattedFrom,
        callerId: formattedFrom,
      },
      'Initiating outbound call via Exotel'
    );

    try {
      const response = await this.client.post('/Calls/connect.json', formData.toString());
      const callData = response.data?.Call || response.data;
      const providerCallId = callData?.Sid || callData?.Sid_id || `exo_${Date.now()}`;

      logger.info(
        {
          provider: 'exotel',
          internalCallId: params.internalCallId,
          providerCallId,
          status: callData?.Status || 'queued',
        },
        'Exotel call initiated successfully'
      );

      return {
        success: true,
        providerCallId,
        status: this.normalizeStatus(callData?.Status || 'queued'),
        raw: response.data,
      };
    } catch (err: any) {
      let errorMsg =
        err.response?.data?.RestException?.Message ||
        err.response?.data?.message ||
        err.message ||
        'Unknown Exotel error';

      if (typeof err.response?.data === 'string' && err.response.data.includes('<Message>')) {
        const match = err.response.data.match(/<Message>(.*?)<\/Message>/);
        if (match && match[1]) errorMsg = match[1];
      }

      logger.error(
        {
          provider: 'exotel',
          internalCallId: params.internalCallId,
          error: errorMsg,
          statusCode: err.response?.status,
        },
        'Failed to initiate Exotel call'
      );

      return {
        success: false,
        providerCallId: '',
        status: 'failed',
        error: errorMsg,
        raw: err.response?.data,
      };
    }
  }

  /**
   * Hang up an ongoing call via Exotel REST API.
   */
  async hangupCall(providerCallId: string): Promise<boolean> {
    try {
      const formData = new URLSearchParams();
      formData.append('Status', 'completed');
      await this.client.post(`/Calls/${providerCallId}.json`, formData.toString());
      logger.info({ provider: 'exotel', providerCallId }, 'Call hung up successfully');
      return true;
    } catch (err: any) {
      logger.warn(
        {
          provider: 'exotel',
          providerCallId,
          error: err.response?.data || err.message,
        },
        'Failed to hang up call via Exotel API'
      );
      return false;
    }
  }

  /**
   * Fetches latest call status from Exotel.
   */
  async getCallStatus(providerCallId: string): Promise<CallStatusResult> {
    try {
      const response = await this.client.get(`/Calls/${providerCallId}.json`);
      const call = response.data?.Call || response.data;
      const status = this.normalizeStatus(call?.Status);
      const duration = call?.Duration ? parseInt(call.Duration, 10) : undefined;
      const recordingUrl = call?.RecordingUrl || undefined;

      return {
        providerCallId,
        status,
        duration,
        recordingUrl,
        raw: response.data,
      };
    } catch (err: any) {
      logger.error(
        {
          provider: 'exotel',
          providerCallId,
          error: err.response?.data || err.message,
        },
        'Failed to query Exotel call status'
      );
      return {
        providerCallId,
        status: 'unknown',
        error: err.message,
      };
    }
  }

  async startStream(providerCallId: string, streamUrl: string): Promise<boolean> {
    logger.info({ providerCallId, streamUrl }, 'Exotel startStream requested');
    return true;
  }

  /**
   * Normalizes incoming status callback from Exotel webhook.
   */
  async handleStatusWebhook(payload: any): Promise<StatusWebhookResult> {
    const callData = payload?.Call || payload;
    const providerCallId = callData?.Sid || callData?.CallSid || payload?.CallSid || '';
    const rawStatus = callData?.Status || payload?.Status || 'completed';
    const status = this.normalizeStatus(rawStatus);
    const duration = payload?.Duration || callData?.Duration ? parseInt(payload.Duration || callData.Duration, 10) : undefined;
    const recordingUrl = payload?.RecordingUrl || callData?.RecordingUrl || undefined;
    const price = payload?.Price ? parseFloat(payload.Price) : undefined;

    return {
      event: payload?.EventType || 'call.status',
      providerCallId,
      status,
      duration,
      recordingUrl,
      price,
      raw: payload,
    };
  }

  async getRecording(providerCallId: string): Promise<string | null> {
    const status = await this.getCallStatus(providerCallId);
    return status.recordingUrl || null;
  }

  /**
   * Normalizes Exotel call statuses to unified CallStatus enum.
   */
  private normalizeStatus(status?: string): 'queued' | 'ringing' | 'in_progress' | 'completed' | 'busy' | 'no_answer' | 'failed' | 'unknown' {
    if (!status) return 'unknown';
    const s = status.toLowerCase();
    if (s.includes('queued') || s.includes('initiating')) return 'queued';
    if (s.includes('ringing')) return 'ringing';
    if (s.includes('in-progress') || s.includes('answered') || s.includes('in_progress')) return 'in_progress';
    if (s.includes('completed')) return 'completed';
    if (s.includes('busy')) return 'busy';
    if (s.includes('no-answer') || s.includes('noanswer')) return 'no_answer';
    if (s.includes('failed') || s.includes('canceled') || s.includes('cancelled')) return 'failed';
    return 'unknown';
  }
}
