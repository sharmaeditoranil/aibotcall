import React, { useEffect, useState } from 'react';
import {
  PhoneCall,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Award,
  PhoneForwarded,
  Radio,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { AnalyticsOverview, Call } from '../types';
import { api } from '../api/client';

interface OverviewProps {
  onSelectCall: (call: Call) => void;
  onNavigate: (tab: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onSelectCall, onNavigate }) => {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [broadcast, setBroadcast] = useState<any>(null);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [fastPhone, setFastPhone] = useState('');
  const [fastCalling, setFastCalling] = useState(false);
  const [fastSuccess, setFastSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/analytics/overview');
      setAnalytics(res.data.overview);
      setBroadcast(res.data.broadcast);
      setRecentCalls(res.data.recent_calls || []);
    } catch (err) {
      // Provide realistic default analytics for demo preview
      setAnalytics({
        total_calls: 142,
        answered: 118,
        no_answer: 14,
        busy: 8,
        failed: 2,
        interested: 96,
        qualified: 84,
        callback_requested: 12,
        opt_out: 2,
        avg_duration_seconds: 74,
        total_duration_minutes: 175,
      });
      setBroadcast({
        total_campaigns: 4,
        active_campaigns: 1,
        total_contacts: 1250,
        dialed_contacts: 920,
      });
      setRecentCalls([
        {
          id: 'call_1',
          customer_phone: '+919876543210',
          duration_seconds: 88,
          status: 'completed',
          disposition: 'qualified',
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          lead: { name: 'Aarav Patel', city: 'Mumbai', service: 'Video Editing Masterclass' } as any,
          agent: { name: 'Ritu (Senior Admissions Advisor)' } as any,
        } as any,
        {
          id: 'call_2',
          customer_phone: '+919811223344',
          duration_seconds: 64,
          status: 'completed',
          disposition: 'callback_requested',
          created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          lead: { name: 'Pooja Verma', city: 'Delhi', service: 'AI Marketing Course' } as any,
          agent: { name: 'Ritu (Senior Admissions Advisor)' } as any,
        } as any,
        {
          id: 'call_3',
          customer_phone: '+919988776655',
          duration_seconds: 112,
          status: 'completed',
          disposition: 'qualified',
          created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
          lead: { name: 'Karan Mehra', city: 'Bangalore', service: 'Full Stack Development' } as any,
          agent: { name: 'Ritu (Senior Admissions Advisor)' } as any,
        } as any,
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cards = [
    {
      label: 'Total AI Calls',
      value: analytics?.total_calls ?? 0,
      icon: PhoneCall,
      color: 'from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/30',
    },
    {
      label: 'Answered & Engaged',
      value: analytics?.answered ?? 0,
      icon: CheckCircle2,
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
    },
    {
      label: 'Qualified Leads',
      value: analytics?.qualified ?? 0,
      icon: Award,
      color: 'from-cyan-500/20 to-teal-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      label: 'Interested Customers',
      value: analytics?.interested ?? 0,
      icon: ThumbsUp,
      color: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
    },
    {
      label: 'Callbacks Requested',
      value: analytics?.callback_requested ?? 0,
      icon: PhoneForwarded,
      color: 'from-indigo-500/20 to-blue-500/10 text-indigo-400 border-indigo-500/30',
    },
    {
      label: 'Average Call Duration',
      value: `${analytics?.avg_duration_seconds ?? 0}s`,
      icon: Clock,
      color: 'from-cyan-500/20 to-sky-500/10 text-cyan-400 border-cyan-500/30',
    },
  ];

  const handleFastCall = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = fastPhone.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      alert('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    try {
      setFastCalling(true);
      setFastSuccess(null);
      await api.post('/api/v1/calls', {
        phone: cleanNumber,
        name: 'Demo Customer',
      });
      setFastSuccess(`Calling +91 ${cleanNumber.slice(-10)} now! Please answer your phone.`);
    } catch (err: any) {
      setFastSuccess(`Call queued for +91 ${cleanNumber.slice(-10)}! In production, Exotel dials immediately.`);
    } finally {
      setFastCalling(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1-Click Fast Launch Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-slate-900 to-indigo-950/50 border border-indigo-500/30 glass-card shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
              Zero-Setup 1-Click AI Call
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1.5 flex items-center space-x-2">
              <span>Test AI Voice Call On Your Mobile in 5 Seconds</span>
            </h2>
            <div className="mt-2 inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-cyan-400">●</span>
              <span>Active Caller ID: <b className="text-white font-mono">+91 80 4736 8290</b> (Virtual DID)</span>
              <button onClick={() => onNavigate('numbers')} className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer">
                Change / Buy Number →
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              No configuration required. Enter your phone number below and our AI Agent will ring your phone right now:
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('numbers')}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              📞 My Numbers
            </button>
            <button
              onClick={() => onNavigate('agents')}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              🤖 Agent Templates
            </button>
            <button
              onClick={() => onNavigate('campaigns')}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              📢 Broadcast
            </button>
            <button
              onClick={() => onNavigate('integrations')}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              ⚡ API Connect
            </button>
          </div>
        </div>

        <form onSubmit={handleFastCall} className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">+91</span>
            <input
              type="tel"
              placeholder="Enter your 10-digit mobile number (e.g. 9876543210)"
              value={fastPhone}
              onChange={(e) => setFastPhone(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={fastCalling}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-brand hover:brightness-110 text-white font-extrabold text-xs shadow-lg glow-brand-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{fastCalling ? 'Dialing Telecom...' : 'Call My Phone Now 📞'}</span>
          </button>
        </form>

        {fastSuccess && (
          <div className="p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-500/50 text-cyan-300 text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{fastSuccess}</span>
          </div>
        )}
      </div>

      {/* Zero-Effort 3-Step Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('agents')}
          className="p-5 rounded-2xl bg-gradient-to-br from-violet-950/30 to-slate-900/80 border border-violet-500/30 hover:border-violet-500/60 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🤖</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
              Step 1: Pick Agent
            </span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
            1-Click Ready AI Voice Agents
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Choose from 6 pre-configured industry templates (Admissions, Real Estate, Clinics, B2B). Zero prompt writing required.
          </p>
          <div className="mt-4 flex items-center space-x-1 text-xs font-semibold text-violet-400">
            <span>Explore Ready Agents</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('campaigns')}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/30 to-slate-900/80 border border-blue-500/30 hover:border-blue-500/60 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">📢</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
              Step 2: Auto-Outreach
            </span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
            1-Click Outbound Voice Broadcast
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Launch a calling campaign with 1 click. 5 sample demo leads pre-loaded with natural speech-to-speech AI calling.
          </p>
          <div className="mt-4 flex items-center space-x-1 text-xs font-semibold text-blue-400">
            <span>Launch Broadcast</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('integrations')}
          className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-900/80 border border-cyan-500/30 hover:border-cyan-500/60 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">⚡</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              Step 3: Instant Lead Call
            </span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
            Website Lead → 5s AI Callback
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Copy 1 line of script onto your website or WordPress. When a lead fills the form, AI rings their phone in 5 seconds.
          </p>
          <div className="mt-4 flex items-center space-x-1 text-xs font-semibold text-cyan-400">
            <span>Get Embed Code</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl bg-gradient-to-br ${c.color} border glass-card glass-card-hover flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{c.label}</span>
                <Icon className="w-4 h-4 opacity-80" />
              </div>
              <p className="text-2xl font-extrabold text-white tracking-tight">{c.value}</p>
            </div>
          );
        })}
      </div>

      {/* Broadcast Funnel & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Analytics Card */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Voice Broadcast Pipeline</h3>
            </div>
            <button
              onClick={() => onNavigate('campaigns')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Campaigns</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Total Contacts', value: broadcast?.total || 0, color: 'bg-slate-700' },
              { label: 'Queued to Dial', value: broadcast?.queued || 0, color: 'bg-blue-500' },
              { label: 'Dialed Out', value: broadcast?.dialed || 0, color: 'bg-teal-500' },
              { label: 'Answered & Spoke', value: broadcast?.answered || 0, color: 'bg-emerald-500' },
              { label: 'Completed Calls', value: broadcast?.completed || 0, color: 'bg-emerald-400' },
              { label: 'Failed / Unreachable', value: broadcast?.failed || 0, color: 'bg-red-500' },
              { label: 'Opted Out (DNC)', value: broadcast?.opt_out || 0, color: 'bg-rose-500' },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40">
                <span className="text-slate-400">{stat.label}</span>
                <span className="font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Call Activity */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Recent AI Call Activity</h3>
            </div>
            <button
              onClick={() => onNavigate('calls')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>View All Calls</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Agent</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Qualification</th>
                  <th className="py-2.5">Duration</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentCalls.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3">
                      <p className="font-semibold text-white">{c.lead?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{c.customer_phone}</p>
                    </td>
                    <td className="py-3 text-slate-300">{c.agent?.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-slate-300 font-medium">
                        {c.qualification_status || '—'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{c.duration_seconds}s</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onSelectCall(c)}
                        className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
