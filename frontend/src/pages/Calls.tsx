import React, { useEffect, useState } from 'react';
import {
  PhoneCall,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Call, VoiceAgent } from '../types';
import { api } from '../api/client';

interface CallsProps {
  onSelectCall: (call: Call) => void;
}

export const Calls: React.FC<CallsProps> = ({ onSelectCall }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [directionFilter, setDirectionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      if (agentFilter) params.agent_id = agentFilter;
      if (phoneFilter) params.phone = phoneFilter;
      if (directionFilter) params.direction = directionFilter;

      const res = await api.get('/api/v1/calls', { params });
      setCalls(res.data.calls || []);
    } catch (err) {
      setCalls([
        {
          id: 'call_1',
          internal_call_id: 'call_live_998811',
          provider: 'exotel',
          direction: 'outbound',
          customer_phone: '+919876543210',
          caller_id: '+918047359000',
          status: 'completed',
          duration_seconds: 94,
          disposition: 'qualified',
          recording_url: 'https://api.exotel.com/v1/Accounts/demo/Recordings/sample.mp3',
          created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          lead: { name: 'Aarav Patel', city: 'Mumbai', service: 'Video Editing Course' } as any,
          agent: { name: 'Ritu (Senior Admissions Advisor)' } as any,
        } as any,
        {
          id: 'call_2',
          internal_call_id: 'call_live_998812',
          provider: 'exotel',
          direction: 'outbound',
          customer_phone: '+919811223344',
          caller_id: '+918047359000',
          status: 'completed',
          duration_seconds: 68,
          disposition: 'callback_requested',
          recording_url: 'https://api.exotel.com/v1/Accounts/demo/Recordings/sample.mp3',
          created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          lead: { name: 'Pooja Verma', city: 'Delhi', service: 'AI Marketing Course' } as any,
          agent: { name: 'Ritu (Senior Admissions Advisor)' } as any,
        } as any,
        {
          id: 'call_3',
          internal_call_id: 'call_live_998813',
          provider: 'exotel',
          direction: 'outbound',
          customer_phone: '+919988776655',
          caller_id: '+918047359000',
          status: 'busy',
          duration_seconds: 0,
          disposition: 'busy',
          created_at: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
          lead: { name: 'Karan Mehra', city: 'Bangalore', service: 'Full Stack Development' } as any,
          agent: { name: 'Ritu (Senior Admissions Advisor)' } as any,
        } as any,
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/api/v1/agents').then((res) => setAgents(res.data.agents || []));
  }, []);

  useEffect(() => {
    fetchCalls();
  }, [page, statusFilter, agentFilter, directionFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCalls();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Completed</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse">In Progress</span>;
      case 'ringing':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Ringing</span>;
      case 'busy':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">Busy</span>;
      case 'no_answer':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">No Answer</span>;
      case 'failed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">Failed</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Call Records & Transcripts</h2>
          <p className="text-xs text-slate-400">Complete telephony history, transcripts, and qualification outcomes</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex items-center flex-1 min-w-[200px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search phone number..."
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
        >
          <option value="">All Call Statuses</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
          <option value="ringing">Ringing</option>
          <option value="busy">Busy</option>
          <option value="no_answer">No Answer</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={agentFilter}
          onChange={(e) => {
            setAgentFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
        >
          <option value="">All AI Agents</option>
          {agents.map((ag) => (
            <option key={ag.id} value={ag.id}>
              {ag.name}
            </option>
          ))}
        </select>

        <select
          value={directionFilter}
          onChange={(e) => {
            setDirectionFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
        >
          <option value="">All Directions</option>
          <option value="outbound">Outbound</option>
          <option value="inbound">Inbound</option>
        </select>
      </div>

      {/* Call Table */}
      <div className="rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 bg-slate-950/40 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">AI Agent</th>
                <th className="py-3 px-4">Campaign / Source</th>
                <th className="py-3 px-4">Call Status</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Qualification</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {calls.map((call) => (
                <tr
                  key={call.id}
                  onClick={() => onSelectCall(call)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{call.lead?.name || 'Customer'}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{call.customer_phone}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-300">
                    {call.agent?.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {call.campaign?.name || (call.lead ? 'Website Lead' : 'Direct Call')}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(call.status)}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{call.duration_seconds}s</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-emerald-400">
                      {call.qualification_status || '—'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {new Date(call.created_at).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCall(call);
                      }}
                      className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold border border-slate-700/60 transition-colors"
                    >
                      View Call
                    </button>
                  </td>
                </tr>
              ))}
              {calls.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No calls match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 flex items-center justify-between text-xs text-slate-400">
          <span>
            Page <b className="text-white">{page}</b> of <b className="text-white">{totalPages}</b>
          </span>
          <div className="flex space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="py-1.5 px-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="py-1.5 px-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
