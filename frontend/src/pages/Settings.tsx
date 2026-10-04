import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Radio,
  Cpu,
  Network,
  CheckCircle2,
  AlertCircle,
  Save,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/client';

export const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form States
  const [callerId, setCallerId] = useState('');
  const [accountSid, setAccountSid] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [showApiToken, setShowApiToken] = useState(false);

  const [openaiKey, setOpenaiKey] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [realtimeModel, setRealtimeModel] = useState('gpt-4o-realtime-preview');

  const [crmWebhookUrl, setCrmWebhookUrl] = useState('');
  const [concurrency, setConcurrency] = useState('5');
  const [maxDuration, setMaxDuration] = useState('300');

  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const currentHost = typeof window !== 'undefined' ? window.location.host : 'voice.aibotflow.in';
  const websocketUrl = `wss://${currentHost}/exotel/media`;
  const leadWebhookUrl = `https://${currentHost}/api/v1/webhooks/leads`;
  const statusWebhookUrl = `https://${currentHost}/api/v1/webhooks/exotel/status`;

  // Load current settings from backend
  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/integrations');
      const data = res.data;

      if (data.telephony) {
        if (data.telephony.caller_id && !data.telephony.caller_id.includes('Shared')) {
          setCallerId(data.telephony.caller_id);
        }
        if (data.telephony.account_sid) {
          setAccountSid(data.telephony.account_sid);
        }
        if (data.telephony.api_key) {
          setApiKey(data.telephony.api_key);
        }
        if (data.telephony.api_token) {
          setApiToken(data.telephony.api_token);
        }
      }

      if (data.ai_engine) {
        if (data.ai_engine.openai_key) {
          setOpenaiKey(data.ai_engine.openai_key);
        }
        if (data.ai_engine.model) {
          setRealtimeModel(data.ai_engine.model);
        }
      }

      if (data.crm_webhook?.crm_webhook_url) {
        setCrmWebhookUrl(data.crm_webhook.crm_webhook_url);
      }

      // Check localStorage for saved custom keys as fallback
      const savedOpenai = localStorage.getItem('aibot_openai_key');
      if (savedOpenai && !data.ai_engine?.openai_key) setOpenaiKey(savedOpenai);

      const savedSid = localStorage.getItem('aibot_account_sid');
      if (savedSid && !data.telephony?.account_sid) setAccountSid(savedSid);

      const savedCaller = localStorage.getItem('aibot_caller_id');
      if (savedCaller && !data.telephony?.caller_id) setCallerId(savedCaller);

      const savedToken = localStorage.getItem('aibot_api_token');
      if (savedToken && !data.telephony?.api_token) setApiToken(savedToken);

      const savedKey = localStorage.getItem('aibot_api_key');
      if (savedKey && !data.telephony?.api_key) setApiKey(savedKey);

      const savedCrm = localStorage.getItem('aibot_crm_url');
      if (savedCrm && !data.crm_webhook?.crm_webhook_url) setCrmWebhookUrl(savedCrm);
    } catch {
      // Local fallback
      const savedOpenai = localStorage.getItem('aibot_openai_key');
      if (savedOpenai) setOpenaiKey(savedOpenai);
      const savedSid = localStorage.getItem('aibot_account_sid');
      if (savedSid) setAccountSid(savedSid);
      const savedCaller = localStorage.getItem('aibot_caller_id');
      if (savedCaller) setCallerId(savedCaller);
      const savedToken = localStorage.getItem('aibot_api_token');
      if (savedToken) setApiToken(savedToken);
      const savedKey = localStorage.getItem('aibot_api_key');
      if (savedKey) setApiKey(savedKey);
      const savedCrm = localStorage.getItem('aibot_crm_url');
      if (savedCrm) setCrmWebhookUrl(savedCrm);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      // 1. Call Master Save API (saves to Postgres DB, memory, and .env on server)
      const res = await api.put('/api/v1/integrations/all-settings', {
        caller_id: callerId,
        account_sid: accountSid,
        api_key: apiKey,
        api_token: apiToken,
        openai_key: openaiKey,
        realtime_model: realtimeModel,
        crm_webhook_url: crmWebhookUrl,
        concurrency,
        max_duration: maxDuration,
      });

      // 2. Persist locally for immediate dashboard reactivity
      if (accountSid) localStorage.setItem('aibot_account_sid', accountSid);
      if (apiKey) localStorage.setItem('aibot_api_key', apiKey);
      if (apiToken) localStorage.setItem('aibot_api_token', apiToken);
      if (callerId) localStorage.setItem('aibot_caller_id', callerId);
      if (openaiKey) localStorage.setItem('aibot_openai_key', openaiKey);
      if (crmWebhookUrl) localStorage.setItem('aibot_crm_url', crmWebhookUrl);

      setFeedback({
        type: 'success',
        message: res.data?.message || 'All System, Exotel & OpenAI Settings saved permanently! 🎉',
      });
    } catch (err: any) {
      // Fallback local save if offline
      if (accountSid) localStorage.setItem('aibot_account_sid', accountSid);
      if (apiKey) localStorage.setItem('aibot_api_key', apiKey);
      if (apiToken) localStorage.setItem('aibot_api_token', apiToken);
      if (callerId) localStorage.setItem('aibot_caller_id', callerId);
      if (openaiKey) localStorage.setItem('aibot_openai_key', openaiKey);
      if (crmWebhookUrl) localStorage.setItem('aibot_crm_url', crmWebhookUrl);

      setFeedback({
        type: 'success',
        message: 'Settings saved locally in browser! (Server error: ' + (err.response?.data?.error || err.message) + ')',
      });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span>System & Telephony Settings</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live & Editable
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure your Exotel calling credentials, OpenAI Realtime voice engine, and WhatsApp CRM integration endpoints.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={loadSettings}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2 animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Telephony Settings */}
          <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Radio className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Exotel Telephony Configuration</h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                India Telephony
              </span>
            </div>
            <p className="text-xs text-slate-400">Enter your Exotel Account SID, API Key and Caller ID to route real calls</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Exotel Virtual Caller ID (ExoPhone) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 08047359000 or +919876543210"
                  value={callerId}
                  onChange={(e) => setCallerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Exotel Account SID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. your_company_sid"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Exotel API Key *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4a2f8b9c..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Exotel API Token *
                  </label>
                  <div className="relative">
                    <input
                      type={showApiToken ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={apiToken}
                      onChange={(e) => setApiToken(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiToken(!showApiToken)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-white"
                    >
                      {showApiToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">WebSocket Voice Media Gateway (Auto-Routed)</span>
                <input
                  type="text"
                  readOnly
                  value={websocketUrl}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* 2. OpenAI Settings */}
          <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-teal-400">
                <Cpu className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">OpenAI Realtime Voice Engine</h3>
              </div>
              <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-bold">
                Ultra-Low Latency
              </span>
            </div>
            <p className="text-xs text-slate-400">Configure your speech-to-speech AI model for human-like conversational Hindi</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  OpenAI API Key (sk-proj-...)
                </label>
                <div className="relative">
                  <input
                    type={showOpenaiKey ? 'text' : 'password'}
                    placeholder="sk-proj-..."
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-teal-300 font-mono placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-white"
                  >
                    {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Configured Realtime Model
                </label>
                <select
                  value={realtimeModel}
                  onChange={(e) => setRealtimeModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-teal-500"
                >
                  <option value="gpt-4o-realtime-preview">gpt-4o-realtime-preview (Recommended • Natural Cadence)</option>
                  <option value="gpt-4o-mini-realtime-preview">gpt-4o-mini-realtime-preview (Ultra-Fast)</option>
                </select>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Telephony Native Codec</span>
                <input
                  type="text"
                  disabled
                  value="G.711 mu-law (8kHz Native Telephony - Zero transcoding latency)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 font-mono text-[11px]"
                />
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Voice Activity Detection (Barge-in)</span>
                <input
                  type="text"
                  disabled
                  value="Server VAD enabled with instant interruption handling"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* 3. WhatsApp CRM Webhook */}
          <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-400">
                <Send className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">WhatsApp CRM Webhook Dispatch</h3>
              </div>
              <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-bold">
                Auto-Sync
              </span>
            </div>
            <p className="text-xs text-slate-400">Sends call transcripts, lead tags, and summaries directly to your WhatsApp CRM</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Outgoing CRM Webhook URL *
                </label>
                <input
                  type="url"
                  placeholder="https://crm.aibotflow.in/api/v1/webhook"
                  value={crmWebhookUrl}
                  onChange={(e) => setCrmWebhookUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  When a call ends, full recording URL and JSON transcript are POSTed here.
                </p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Signature Verification Header</span>
                <input
                  type="text"
                  disabled
                  value="X-AiBotFlow-Signature (HMAC-SHA256 Timing-Safe)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* 4. Queue & Telecom Concurrency */}
          <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-purple-400">
                <Network className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Capacity & Concurrency Limits</h3>
              </div>
              <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                Dialer Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">Control how many simultaneous telephone lines dial in parallel</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Active Call Concurrency Limit
                </label>
                <select
                  value={concurrency}
                  onChange={(e) => setConcurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500"
                >
                  <option value="2">2 Concurrent Lines (Free Trial)</option>
                  <option value="5">5 Concurrent Lines (Pay As You Go / Starter)</option>
                  <option value="10">10 Concurrent Lines (Growth Plan)</option>
                  <option value="30">30 Concurrent Lines (Enterprise Scale)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Max Call Duration Watchdog (Seconds)
                </label>
                <input
                  type="number"
                  min={60}
                  max={1800}
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Prevents runaway calls if customer leaves line open (Default: 300s = 5 mins).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Endpoints Helper Card */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Your Public Ingestion Endpoints (Copy & Use)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Incoming Lead Webhook (For Website Forms):</span>
              <div className="flex items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="font-mono text-emerald-400 truncate flex-1 text-[11px] select-all">
                  {leadWebhookUrl}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(leadWebhookUrl)}
                  className="ml-2 text-slate-400 hover:text-white shrink-0"
                >
                  {copiedWebhook ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Exotel StatusCallback Webhook URL:</span>
              <div className="flex items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="font-mono text-teal-400 truncate flex-1 text-[11px] select-all">
                  {statusWebhookUrl}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(statusWebhookUrl)}
                  className="ml-2 text-slate-400 hover:text-white shrink-0"
                >
                  {copiedWebhook ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end space-x-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-900/40 active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving System Settings...' : 'Save Configuration (सेव करें)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
