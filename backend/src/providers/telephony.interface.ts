export interface MakeCallParams {
  to: string; // Customer phone (E.164)
  from?: string; // Virtual number / Caller ID
  internalCallId: string;
  agentId: string;
  streamUrl: string; // WSS URL for Bidirectional Audio
  statusCallbackUrl: string;
  maxDuration?: number; // In seconds
  customFields?: Record<string, any>;
}

export interface MakeCallResult {
  success: boolean;
  providerCallId: string;
  status: string;
  error?: string;
  raw?: any;
}

export interface CallStatusResult {
  providerCallId: string;
  status: 'queued' | 'ringing' | 'in_progress' | 'completed' | 'busy' | 'no_answer' | 'failed' | 'unknown';
  duration?: number;
  recordingUrl?: string;
  answeredAt?: Date;
  endedAt?: Date;
  error?: string;
  raw?: any;
}

export interface StatusWebhookResult {
  event: string;
  providerCallId: string;
  status: 'queued' | 'ringing' | 'in_progress' | 'completed' | 'busy' | 'no_answer' | 'failed' | 'unknown';
  duration?: number;
  recordingUrl?: string;
  price?: number;
  raw: any;
}

export interface TelephonyProvider {
  readonly name: string;

  /**
   * Initiates an outbound voice call connecting to our Bidirectional WebSocket Gateway.
   */
  makeCall(params: MakeCallParams): Promise<MakeCallResult>;

  /**
   * Terminates an ongoing call.
   */
  hangupCall(providerCallId: string): Promise<boolean>;

  /**
   * Fetches latest authoritative call status from provider REST API.
   */
  getCallStatus(providerCallId: string): Promise<CallStatusResult>;

  /**
   * Connects or updates audio stream for the call.
   */
  startStream(providerCallId: string, streamUrl: string): Promise<boolean>;

  /**
   * Verifies and normalizes incoming telephony status callback webhook.
   */
  handleStatusWebhook(payload: any, signature?: string): Promise<StatusWebhookResult>;

  /**
   * Retrieves call recording URL if available.
   */
  getRecording(providerCallId: string): Promise<string | null>;
}
