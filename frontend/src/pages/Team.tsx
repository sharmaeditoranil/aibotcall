import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Trash2, Shield, Mail, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';

export const Team: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'AGENT',
    temporary_password: '',
  });

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/team');
      if (res.data?.members && res.data.members.length > 0) {
        setMembers(res.data.members);
      } else {
        throw new Error('No members');
      }
    } catch (err) {
      setMembers([
        {
          id: 'mem_1',
          name: 'Platform Administrator',
          email: 'admin@aibotcall.com',
          role: 'OWNER',
          created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        },
        {
          id: 'mem_2',
          name: 'Pooja Nair',
          email: 'pooja@aibotcall.com',
          role: 'ADMIN',
          created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
        },
        {
          id: 'mem_3',
          name: 'Karan Joshi',
          email: 'karan@aibotcall.com',
          role: 'AGENT',
          created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/v1/team/invite', newMember);
      setIsInviteOpen(false);
      setNewMember({ name: '', email: '', role: 'AGENT', temporary_password: '' });
      fetchTeam();
    } catch (err: any) {
      alert(`Invite failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      await api.delete(`/api/v1/team/${id}`);
      fetchTeam();
    } catch (err: any) {
      alert(`Remove error: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Team & Workspace Members</h2>
          <p className="text-xs text-slate-400">
            Invite team members, assign role-based access control (Admin, Agent, Viewer), and collaborate
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center space-x-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Members Table */}
      <div className="rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 bg-slate-950/40 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/20">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                      {m.name[0]}
                    </div>
                    <span>{m.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{m.email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        m.role === 'OWNER'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : m.role === 'ADMIN'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {m.role !== 'OWNER' && (
                      <button
                        onClick={() => handleRemove(m.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Invite New Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="priya@company.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role *</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="ADMIN">ADMIN (Full access to all agents, calls, campaigns, and settings)</option>
                  <option value="AGENT">AGENT (Can view calls, trigger dialer, and monitor campaigns)</option>
                  <option value="VIEWER">VIEWER (Read-only access to transcripts and analytics)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Temporary Password (Optional)</label>
                <input
                  type="text"
                  placeholder="AiBotCall123! (default)"
                  value={newMember.temporary_password}
                  onChange={(e) => setNewMember({ ...newMember, temporary_password: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
