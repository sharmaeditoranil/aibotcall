import React, { useEffect, useState } from 'react';
import {
  Plug,
  PhoneForwarded,
  Bot,
  Webhook,
  Code2,
  Copy,
  Check,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { api } from '../api/client';

export const Integrations: React.FC<{ user?: any }> = ({ user }) => {
  const currentUser = user || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('aibotcall_user') || '{}') : {});
  const isSuperAdmin = currentUser?.email === 'admin@aibotcall.com';

  const [integrationsData, setIntegrationsData] = useState<any>(null);
  const [snippetsData, setSnippetsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'html' | 'wordpress' | 'react'>('html');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form states
  const [exotelForm, setExotelForm] = useState({
    account_sid: '',
    api_key: '',
    api_token: '',
    caller_id: '',
    custom_telephony_enabled: true,
  });

  const [crmForm, setCrmForm] = useState({
    crm_webhook_url: '',
  });

  const [savingExotel, setSavingExotel] = useState(false);
  const [savingCrm, setSavingCrm] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const [intRes, snipRes] = await Promise.all([
        api.get('/api/v1/integrations'),
        api.get('/api/v1/integrations/embed-snippets'),
      ]);

      setIntegrationsData(intRes.data);
      setSnippetsData(snipRes.data);

      if (intRes.data.telephony) {
        setExotelForm((prev) => ({
          ...prev,
          caller_id: intRes.data.telephony.caller_id || '',
          custom_telephony_enabled: intRes.data.telephony.custom_enabled ?? true,
        }));
      }

      if (intRes.data.crm_webhook) {
        setCrmForm({
          crm_webhook_url: intRes.data.crm_webhook.crm_webhook_url || '',
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSaveExotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingExotel(true);
      setFeedback(null);
      const res = await api.put('/api/v1/integrations/exotel', exotelForm);
      setFeedback({ type: 'success', message: res.data.message });
      fetchIntegrations();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.error || err.message });
    } finally {
      setSavingExotel(false);
    }
  };

  const handleSaveCrm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingCrm(true);
      setFeedback(null);
      const res = await api.put('/api/v1/integrations/crm', crmForm);
      setFeedback({ type: 'success', message: res.data.message });
      fetchIntegrations();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.error || err.message });
    } finally {
      setSavingCrm(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!crmForm.crm_webhook_url) {
      setFeedback({ type: 'error', message: 'Please enter a CRM webhook URL first' });
      return;
    }
    try {
      setTestingWebhook(true);
      setTestResult(null);
      const res = await api.post('/api/v1/integrations/test-crm-webhook', {
        url: crmForm.crm_webhook_url,
      });
      setTestResult(res.data);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.response?.data?.error || err.message,
      });
    } finally {
      setTestingWebhook(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
          <span>API Connect & Integrations Hub</span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Realtime Live
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Connect your Indian Telephony trunk (Exotel), AI Voice Engine (OpenAI Realtime), CRM webhooks, and generate website lead capture forms.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center space-x-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 1: Telephony Integration */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 glass-card space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <PhoneForwarded className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AiBotCall Cloud Telephony</h3>
                <p className="text-[11px] text-slate-400">Enterprise PSTN calling with low latency audio streaming</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Active & Ready</span>
            </span>
          </div>

          {!isSuperAdmin ? (
            /* Standard User View: Zero Setup Needed */
            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Virtual Caller ID</span>
                <span className="font-mono text-emerald-400 font-bold">{integrationsData?.telephony?.caller_id || '09513886363'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Telephony Carrier Line</span>
                <span className="text-white font-medium">AiBotCall High-Speed Indian Trunk</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Outbound Calling</span>
                <span className="text-emerald-400 font-medium">Enabled & Verified</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-blue-300 text-[11px] flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <b>Zero Technical Setup Required:</b> Your account is pre-configured with AiBotCall's cloud telecom lines. You do not need any Exotel account or API keys. Simply recharge your wallet and start making AI voice calls directly!
                </span>
              </div>
            </div>
          ) : (
            /* Super Admin View: Form to configure Exotel credentials */
            <form onSubmit={handleSaveExotel} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Virtual Number / Caller ID (DID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 08047359000 or 09513886363"
                  value={exotelForm.caller_id}
                  onChange={(e) => setExotelForm({ ...exotelForm, caller_id: e.target.value })}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Exotel Account SID</label>
                  <input
                    type="text"
                    placeholder="e.g. your_company_sid"
                    value={exotelForm.account_sid}
                    onChange={(e) => setExotelForm({ ...exotelForm, account_sid: e.target.value })}
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Exotel API Key</label>
                  <input
                    type="password"
                    placeholder="Paste API Key"
                    value={exotelForm.api_key}
                    onChange={(e) => setExotelForm({ ...exotelForm, api_key: e.target.value })}
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Exotel API Token</label>
                <input
                  type="password"
                  placeholder="Paste API Token"
                  value={exotelForm.api_token}
                  onChange={(e) => setExotelForm({ ...exotelForm, api_token: e.target.value })}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Media Stream: <code className="text-blue-400">/exotel/media</code>
                </span>
                <button
                  type="submit"
                  disabled={savingExotel}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {savingExotel ? 'Saving...' : 'Connect Exotel API'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* SECTION 2: AI Voice Engine Configuration */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 glass-card space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Voice Engine (OpenAI Realtime)</h3>
                <p className="text-[11px] text-slate-400">Speech-to-Speech natural conversational pipeline</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Realtime Model</span>
              <span className="font-mono text-emerald-400 font-bold">gpt-4o-realtime-preview</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Audio Codec / Sampling</span>
              <span className="text-white font-medium">G.711 mu-law (8,000Hz Telephony Native)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Voice Activity Detection (VAD)</span>
              <span className="text-emerald-400 font-medium">Server VAD (Threshold 0.60, 450ms Silence)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Barge-In Interruption Latency</span>
              <span className="text-white font-medium">&lt; 300ms instantaneous clear signal</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <b>Telephony Audio Tuning Enabled:</b> Bidirectional audio packets are synchronized in 20ms frames to prevent jitter and stuttering across Airtel, Jio, and Vi networks.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Outgoing CRM & WhatsApp Webhook */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 glass-card space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Webhook className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Deal CRM / WhatsApp Webhook Sync</h3>
                <p className="text-[11px] text-slate-400">
                  Realtime post-call webhook with qualification tags, transcript, recording URL, and HMAC SHA-256 signature.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              HMAC Secured
            </span>
          </div>

          <form onSubmit={handleSaveCrm} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Your CRM Post-Call Webhook URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://crm.yourcompany.com/api/webhooks/voice-call-finished"
                  value={crmForm.crm_webhook_url}
                  onChange={(e) => setCrmForm({ ...crmForm, crm_webhook_url: e.target.value })}
                  required
                  className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={testingWebhook}
                  className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testingWebhook ? 'Pinging...' : 'Send Test Ping'}</span>
                </button>
                <button
                  type="submit"
                  disabled={savingCrm}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  {savingCrm ? 'Saving...' : 'Save URL'}
                </button>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="font-semibold mb-1">
                  {testResult.success ? '✓ Webhook Ping Succeeded!' : '✗ Webhook Ping Failed'}
                </div>
                <div className="text-[11px] opacity-90">{testResult.message || testResult.error}</div>
              </div>
            )}
          </form>
        </div>

        {/* SECTION 4: Website Lead Form Integration Snippets */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 glass-card space-y-5 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Website Lead Embed & Connect Code</h3>
                <p className="text-[11px] text-slate-400">
                  Embed on WordPress, Elementor, React, or HTML. When lead fills form, AI calls them in 10 seconds!
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveSnippetTab('html')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeSnippetTab === 'html'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                HTML / JS Form
              </button>
              <button
                onClick={() => setActiveSnippetTab('wordpress')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeSnippetTab === 'wordpress'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                WordPress PHP
              </button>
              <button
                onClick={() => setActiveSnippetTab('react')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeSnippetTab === 'react'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                React Component
              </button>
            </div>
          </div>

          {/* Snippet Display */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400">
              <span>
                {activeSnippetTab === 'html' && 'Universal HTML & JavaScript Form (Works anywhere)'}
                {activeSnippetTab === 'wordpress' && 'WordPress functions.php / Contact Form 7 Hook'}
                {activeSnippetTab === 'react' && 'React Functional Component with API Dispatch'}
              </span>
              <button
                onClick={() => {
                  const content =
                    activeSnippetTab === 'html'
                      ? snippetsData?.snippets?.html_form
                      : activeSnippetTab === 'wordpress'
                      ? snippetsData?.snippets?.wordpress_php
                      : snippetsData?.snippets?.react_component;
                  copyToClipboard(content || '', activeSnippetTab);
                }}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all"
              >
                {copiedKey === activeSnippetTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-80 leading-relaxed">
              <code>
                {activeSnippetTab === 'html' && (snippetsData?.snippets?.html_form || 'Loading HTML snippet...')}
                {activeSnippetTab === 'wordpress' &&
                  (snippetsData?.snippets?.wordpress_php || 'Loading WordPress snippet...')}
                {activeSnippetTab === 'react' &&
                  (snippetsData?.snippets?.react_component || 'Loading React snippet...')}
              </code>
            </pre>
          </div>
        </div>

        {/* SECTION 5: 1-Click Floating Website Call Widget (Zero-Code Embed) */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/80 border border-emerald-500/30 glass-card space-y-5 lg:col-span-2 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
                ⚡
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">1-Click Floating Website Call Widget</h3>
                <p className="text-[11px] text-slate-400">
                  Don't want to build forms? Paste this 1-line script tag into your website. A floating "Call Me with AI" button appears instantly!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const widgetScript = `<!-- AiBotCall 1-Click Floating Website Voice Widget -->\n<script src="https://cdn.aibotcall.com/widget.v1.js" data-tenant="org_demo_1" data-agent="agent_default_1" data-position="bottom-right" data-color="#10b981" async></script>`;
                copyToClipboard(widgetScript, 'widget_script');
              }}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
            >
              {copiedKey === 'widget_script' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Script Tag!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy 1-Line Script</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1-Line Code Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">1-Line Embed Code (Paste before &lt;/body&gt;)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Zero Code
                </span>
              </div>
              <pre className="p-3 bg-slate-900/90 rounded-xl text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
{`<!-- AiBotCall 1-Click Floating Voice Widget -->
<script 
  src="https://cdn.aibotcall.com/widget.v1.js" 
  data-tenant="org_demo_1" 
  data-agent="agent_default_1" 
  data-position="bottom-right" 
  data-color="#10b981" 
  async>
</script>`}
              </pre>
              <p className="text-[11px] text-slate-400">
                Works on <b>WordPress, Shopify, Wix, Squarespace, Webflow, PHP, Next.js</b> or custom HTML.
              </p>
            </div>

            {/* Live Interactive Preview */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 relative min-h-[180px] flex flex-col justify-between overflow-hidden">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-white block">Interactive Live Preview</span>
                <span className="text-[11px]">How the floating button looks on your website visitor's screen:</span>
              </div>

              {/* Simulated floating button */}
              <div className="flex justify-end p-2 mt-4">
                <div className="relative">
                  <div className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-500/30 cursor-pointer animate-pulse">
                    <span>📞</span>
                    <span>Get Instant Call from AI (5s)</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>⚡ Triggers sub-5s outbound phone call directly to visitor's phone!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
