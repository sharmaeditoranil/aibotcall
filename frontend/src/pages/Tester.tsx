import React, { useState } from 'react';
import { FlaskConical, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';

export const Tester: React.FC = () => {
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [event, setEvent] = useState('voice.call.completed');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sampleEvents = [
    { id: 'voice.call.completed', label: 'voice.call.completed (Full Call Summary & Transcripts)' },
    { id: 'voice.lead.qualified', label: 'voice.lead.qualified (Qualified Course Enquiry)' },
    { id: 'voice.callback.requested', label: 'voice.callback.requested (Counselor Callback)' },
  ];

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await api.post('/api/v1/webhooks/test', {
        url,
        secret,
        event,
      });
      setResult(res.data);
    } catch (err: any) {
      setResult({
        success: false,
        status: err.response?.status,
        error: err.response?.data?.error || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Outgoing CRM Webhook Tester</h2>
        <p className="text-xs text-slate-400">
          Verify connectivity to Deal CRM or WhatsApp CRM with HMAC SHA-256 signatures before running live campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>Send Test Event</span>
          </h3>

          <form onSubmit={handleTest} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Destination Webhook URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://crm.yourdomain.com/api/v1/voice/callback"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                HMAC SHA-256 Secret Key (Optional - will use default server secret if empty)
              </label>
              <input
                type="password"
                placeholder="whsec_••••••••••••"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Sample Webhook Event
              </label>
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              >
                {sampleEvents.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Test Payload...' : 'Dispatch Test Webhook'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Test Result Display */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4">Inspection & Response</h3>

          {result ? (
            <div className="space-y-4 flex-1">
              <div
                className={`p-4 rounded-xl border flex items-start space-x-3 ${
                  result.success
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/30 border-red-500/40 text-red-300'
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-bold">
                    {result.success ? 'Delivery Succeeded (HTTP 2xx)' : 'Delivery Failed or Rejected'}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    HTTP Status: <b className="font-mono">{result.status || 'Connection Error'}</b> • Response Latency:{' '}
                    <b className="font-mono">{result.responseTimeMs}ms</b>
                  </p>
                </div>
              </div>

              {result.error && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300">
                  {result.error}
                </div>
              )}

              {result.responseData && (
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Server Response Body:</span>
                  <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-60">
                    {typeof result.responseData === 'object'
                      ? JSON.stringify(result.responseData, null, 2)
                      : String(result.responseData)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
              <FlaskConical className="w-8 h-8 text-slate-600 mb-2" />
              <span>Enter a destination webhook URL and click "Dispatch Test Webhook" to view real-time HTTP response and HMAC signature validation.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
