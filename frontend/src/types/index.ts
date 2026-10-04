export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'AGENT' | 'VIEWER';
  organization: {
    id: string;
    name: string;
    slug: string;
    plan?: string;
    credits_balance_minutes?: number;
    billing_email?: string;
    referral_code?: string;
  };
}

export interface VoiceAgent {
  id: string;
  name: string;
  company_name: string;
  agent_role: string;
  language: string;
  voice: string;
  welcome_message: string;
  system_prompt: string;
  objective: string;
  qualification_questions: string[];
  max_call_duration_seconds: number;
  recording_enabled: boolean;
  ai_disclosure_enabled: boolean;
  ai_disclosure_text?: string;
  crm_webhook_url?: string;
  is_active: boolean;
  _count?: {
    calls: number;
    campaigns: number;
    knowledge_items: number;
  };
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  content: string;
  agent_id?: string | null;
  agent?: { id: string; name: string };
  is_active: boolean;
  created_at: string;
}

export interface Call {
  id: string;
  internal_call_id: string;
  provider: string;
  provider_call_id?: string;
  stream_id?: string;
  direction: 'inbound' | 'outbound';
  status: 'queued' | 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'busy' | 'no_answer' | 'failed' | 'cancelled';
  customer_phone: string;
  started_at?: string;
  answered_at?: string;
  ended_at?: string;
  duration_seconds: number;
  recording_url?: string;
  summary?: string;
  qualification_status?: string;
  qualification_data?: Record<string, any>;
  callback_requested: boolean;
  callback_preferred_time?: string;
  callback_note?: string;
  next_action?: string;
  important_points?: string[];
  tags?: string[];
  provider_error?: string;
  technical_meta?: Record<string, any>;
  created_at: string;
  agent: { id: string; name: string; voice: string };
  lead?: { id: string; name: string; email?: string; city?: string; service?: string };
  campaign?: { id: string; name: string };
  transcripts?: Array<{ id: string; speaker: 'assistant' | 'customer'; text: string; created_at: string }>;
  events?: Array<{ id: string; event_type: string; data: any; created_at: string }>;
}

export interface Campaign {
  id: string;
  name: string;
  agent_id: string;
  agent: { name: string; voice: string };
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'stopped';
  scheduled_at?: string;
  total_contacts: number;
  queued_count: number;
  dialed_count: number;
  answered_count: number;
  completed_count: number;
  busy_count: number;
  failed_count: number;
  opt_out_count: number;
  concurrency_limit: number;
  created_at: string;
}

export interface WebhookDelivery {
  id: string;
  call_id?: string;
  endpoint_url: string;
  event: string;
  event_id: string;
  payload: any;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  http_status?: number;
  attempt_count: number;
  max_attempts: number;
  last_attempt_at?: string;
  next_retry_at?: string;
  last_error?: string;
  created_at: string;
}

export interface SuppressionItem {
  id: string;
  phone: string;
  reason: string;
  source: string;
  created_at: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  status: string;
  last_used_at?: string;
  created_at: string;
}

export interface AnalyticsOverview {
  total_calls: number;
  answered: number;
  no_answer: number;
  busy: number;
  failed: number;
  interested: number;
  qualified: number;
  callback_requested: number;
  opt_out: number;
  avg_duration_seconds: number;
  total_duration_minutes: number;
}
