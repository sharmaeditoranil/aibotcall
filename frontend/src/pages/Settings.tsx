import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, Radio, Cpu, Network, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">System & Telephony Settings</h2>
        <p className="text-xs text-slate-400">
          Environment configuration, telephony bridges, OpenAI models, and queue limits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Telephony Settings */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Radio className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Exotel Telephony Configuration</h3>
          </div>
          <p className="text-xs text-slate-400">Primary telephony carrier for outbound Indian telecom networks</p>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Exotel Virtual Caller ID (ExoPhone)</span>
              <input
                type="text"
                disabled
                value="080XXXXXXXX (Configured in .env)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 font-mono"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Exotel Base API URL</span>
              <input
                type="text"
                disabled
                value="https://api.exotel.com"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 font-mono"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">WebSocket Voice Media Gateway URL</span>
              <input
                type="text"
                disabled
                value="wss://voice.yourdomain.com/exotel/media"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* OpenAI Settings */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card space-y-4">
          <div className="flex items-center space-x-2 text-teal-400">
            <Cpu className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">OpenAI Realtime Voice Engine</h3>
          </div>
          <p className="text-xs text-slate-400">Ultra-low latency speech-to-speech AI model</p>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Configured Realtime Model</span>
              <input
                type="text"
                disabled
                value="gpt-4o-realtime-preview (Configurable via OPENAI_REALTIME_MODEL)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-teal-400 font-mono"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Audio Format</span>
              <input
                type="text"
                disabled
                value="G.711 mu-law (8kHz Telephony Native - Zero transcoding latency)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-mono"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Voice Activity Detection (VAD)</span>
              <input
                type="text"
                disabled
                value="Server VAD enabled with Realtime Barge-In Interruption support"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Queue & Capacity */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card space-y-4">
          <div className="flex items-center space-x-2 text-blue-400">
            <Network className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Queue & Telecom Concurrency</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Active Call Concurrency Limit</span>
              <input
                type="text"
                disabled
                value="5 Concurrent Lines (CALL_CONCURRENCY)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Default Max Call Duration Watchdog</span>
              <input
                type="text"
                disabled
                value="300 Seconds (5 Minutes)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Webhook URLs Documentation */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Integration Endpoints</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Website Lead Ingestion Webhook</span>
              <code className="text-emerald-400 font-mono text-[11px] block bg-slate-950 p-2 rounded border border-slate-800">
                POST /api/v1/webhooks/leads
              </code>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Exotel StatusCallback Webhook</span>
              <code className="text-teal-400 font-mono text-[11px] block bg-slate-950 p-2 rounded border border-slate-800">
                POST /api/v1/webhooks/exotel/status
              </code>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Outgoing CRM Signature Header</span>
              <code className="text-slate-300 font-mono text-[11px] block bg-slate-950 p-2 rounded border border-slate-800">
                X-AiBotFlow-Signature (HMAC-SHA256)
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
