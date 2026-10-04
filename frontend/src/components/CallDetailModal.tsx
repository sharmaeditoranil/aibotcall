import React, { useState } from 'react';
import {
  X,
  Phone,
  Clock,
  User,
  Bot,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  Play,
  Pause,
  ExternalLink,
  RotateCw,
  Send,
  HelpCircle,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { Call, WebhookDelivery } from '../types';
import { api } from '../api/client';

interface CallDetailModalProps {
  call: Call | null;
  webhookDeliveries?: WebhookDelivery[];
  onClose: () => void;
  onRefresh?: () => void;
}

export const CallDetailModal: React.FC<CallDetailModalProps> = ({
  call,
  webhookDeliveries = [],
  onClose,
  onRefresh,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'conversation' | 'crm' | 'technical'>('conversation');
  const [retryingWebhookId, setRetryingWebhookId] = useState<string | null>(null);

  if (!call) return null;

  const handleRetryWebhook = async (deliveryId: string) => {
    try {
      setRetryingWebhookId(deliveryId);
      await api.post(`/api/v1/webhooks/deliveries/${deliveryId}/retry`);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(`Webhook retry failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setRetryingWebhookId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Completed</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse">In Progress</span>;
      case 'ringing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">Ringing</span>;
      case 'busy':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">Busy</span>;
      case 'no_answer':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">No Answer</span>;
      case 'failed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">Failed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">{status}</span>;
    }
  };

  const getQualificationBadge = (status?: string) => {
    if (!status) return null;
    const colors: Record<string, string> = {
      Qualified: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      Interested: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
      Hot: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      Warm: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      'Callback Requested': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      'Not Interested': 'bg-slate-500/20 text-slate-400 border-slate-500/40',
      'Do Not Call': 'bg-red-500/20 text-red-400 border-red-500/40',
    };
    const style = colors[status] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>{status}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{call.customer_phone}</h3>
                {getStatusBadge(call.status)}
                {getQualificationBadge(call.qualification_status)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Internal ID: <span className="font-mono text-slate-300">{call.internal_call_id}</span> • Agent:{' '}
                <span className="text-emerald-400 font-medium">{call.agent.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-6">
          <button
            onClick={() => setActiveTab('conversation')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'conversation'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Conversation & Qualification</span>
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'crm'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>CRM Webhook Delivery ({webhookDeliveries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'technical'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Telephony & Debug</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'conversation' && (
            <>
              {/* Audio Recording Player */}
              {call.recording_url && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <div>
                      <p className="text-xs font-semibold text-white">Call Audio Recording</p>
                      <p className="text-[11px] text-slate-400">Duration: {call.duration_seconds}s</p>
                    </div>
                  </div>

                  {/* Visual Waveform Bar */}
                  <div className="flex items-center space-x-1 h-8 px-4">
                    {[16, 24, 12, 28, 20, 14, 26, 18, 10, 22, 16, 20].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full bg-emerald-500/60 ${isPlaying ? 'wave-bar' : ''}`}
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>

                  <a
                    href={call.recording_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Download WAV</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* AI Summary Card */}
              {call.summary && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AI Call Summary</span>
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed">{call.summary}</p>
                  
                  {call.next_action && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center space-x-2 text-xs">
                      <span className="text-emerald-400 font-semibold">Recommended Next Action:</span>
                      <span className="text-white px-2 py-0.5 rounded bg-emerald-500/20 font-medium">
                        {call.next_action}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Callback Alert */}
              {call.callback_requested && (
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-1.5 mb-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Human Callback Requested</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div>
                      <span className="text-slate-400">Preferred Time:</span>
                      <p className="text-white font-medium">{call.callback_preferred_time || 'As soon as possible'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Notes / Topic:</span>
                      <p className="text-white font-medium">{call.callback_note || 'Discuss course admission'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Structured Qualification Data */}
              {call.qualification_data && Object.keys(call.qualification_data).length > 0 && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Captured Lead Qualification
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(call.qualification_data).map(([key, val]) => (
                      <div key={key} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-semibold text-emerald-300 mt-0.5 block">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation Transcript */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Voice Transcript ({call.transcripts?.length || 0} Exchanges)</span>
                </h4>

                {call.transcripts && call.transcripts.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {call.transcripts.map((t, idx) => {
                      const isAssistant = t.speaker === 'assistant';
                      return (
                        <div
                          key={idx}
                          className={`flex items-start space-x-3 ${isAssistant ? '' : 'flex-row-reverse space-x-reverse'}`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              isAssistant
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            }`}
                          >
                            {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                          </div>
                          <div
                            className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                              isAssistant
                                ? 'bg-slate-800/90 text-slate-100 rounded-tl-sm border border-slate-700/60'
                                : 'bg-emerald-600 text-white rounded-tr-sm shadow-md shadow-emerald-900/20'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1 opacity-75 text-[10px]">
                              <span>{isAssistant ? `${call.agent.name} (AI)` : 'Customer'}</span>
                            </div>
                            <p>{t.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                    No transcript recorded for this call.
                  </div>
                )}
              </div>
            </>
          )}

          {/* CRM Deliveries Tab */}
          {activeTab === 'crm' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Deal CRM / WhatsApp CRM Deliveries</h4>
                  <p className="text-xs text-slate-400">Guaranteed idempotent delivery tracking with HMAC SHA-256</p>
                </div>
              </div>

              {webhookDeliveries.length > 0 ? (
                <div className="space-y-3">
                  {webhookDeliveries.map((del) => (
                    <div key={del.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                              del.status === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : del.status === 'retrying'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {del.status}
                          </span>
                          <span className="text-xs font-mono text-slate-300 truncate max-w-sm">
                            {del.endpoint_url}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRetryWebhook(del.id)}
                          disabled={retryingWebhookId === del.id}
                          className="flex items-center space-x-1.5 py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${retryingWebhookId === del.id ? 'animate-spin' : ''}`} />
                          <span>Retry Webhook</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                        <div>
                          <span>HTTP Status:</span> <b className="text-white">{del.http_status || 'N/A'}</b>
                        </div>
                        <div>
                          <span>Attempts:</span> <b className="text-white">{del.attempt_count} / {del.max_attempts}</b>
                        </div>
                        <div>
                          <span>Event ID:</span> <b className="text-slate-300 font-mono text-[10px]">{del.event_id}</b>
                        </div>
                        <div>
                          <span>Next Retry:</span> <b className="text-white">{del.next_retry_at ? new Date(del.next_retry_at).toLocaleTimeString() : 'None'}</b>
                        </div>
                      </div>

                      {del.last_error && (
                        <div className="p-2.5 rounded bg-red-950/30 border border-red-500/30 text-xs text-red-300">
                          <b>Last Delivery Error:</b> {del.last_error}
                        </div>
                      )}

                      <details className="text-xs text-slate-400">
                        <summary className="cursor-pointer text-emerald-400 hover:underline">View Dispatched Payload JSON</summary>
                        <pre className="mt-2 p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
                          {JSON.stringify(del.payload, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                  No outgoing webhooks recorded for this call yet.
                </div>
              )}
            </div>
          )}

          {/* Technical Debug Tab */}
          {activeTab === 'technical' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Telephony Metadata</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block">Telephony Provider:</span>
                    <span className="text-white font-mono uppercase">{call.provider}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block">Provider Call SID:</span>
                    <span className="text-emerald-400 font-mono">{call.provider_call_id || 'N/A'}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block">Stream SID:</span>
                    <span className="text-teal-400 font-mono">{call.stream_id || 'N/A'}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block">Started Time:</span>
                    <span className="text-white font-mono">{call.started_at ? new Date(call.started_at).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>

                {call.provider_error && (
                  <div className="mt-3 p-3 rounded bg-red-950/30 border border-red-500/40 text-xs text-red-300">
                    <b>Provider Error:</b> {call.provider_error}
                  </div>
                )}
              </div>

              {/* Call Events Timeline */}
              {call.events && call.events.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Telephony Lifecycle Events</h4>
                  <div className="space-y-2">
                    {call.events.map((evt) => (
                      <div key={evt.id} className="flex items-center justify-between text-xs p-2 rounded bg-slate-950/40 border border-slate-800/50">
                        <span className="font-semibold text-emerald-400">{evt.event_type}</span>
                        <span className="text-slate-500 text-[11px]">{new Date(evt.created_at).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
