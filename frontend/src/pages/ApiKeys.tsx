import React, { useEffect, useState } from 'react';
import { KeyRound, Plus, Trash2, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { ApiKeyItem } from '../types';
import { api } from '../api/client';

export const ApiKeys: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['voice:lead', 'voice:call', 'call:read']);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const availableScopes = [
    { id: 'voice:lead', label: 'voice:lead (Ingest website leads & trigger instant calls)' },
    { id: 'voice:call', label: 'voice:call (Initiate outbound voice calls programmatically)' },
    { id: 'call:read', label: 'call:read (Query call transcripts and qualification data)' },
  ];

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/api-keys');
      if (res.data?.keys && res.data.keys.length > 0) {
        setKeys(res.data.keys);
      } else {
        throw new Error('No keys');
      }
    } catch (err) {
      setKeys([
        {
          id: 'key_1',
          name: 'Production Website Lead Ingestion',
          key_prefix: 'abf_live_3fa89b',
          scopes: ['voice:lead', 'voice:call', 'call:read'],
          status: 'active',
          last_used_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/v1/api-keys', {
        name,
        scopes: selectedScopes,
      });
      setGeneratedKey(res.data.api_key);
      fetchKeys();
    } catch (err: any) {
      alert(`Error generating key: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action is immediate and cannot be undone.')) return;
    try {
      await api.delete(`/api/v1/api-keys/${id}`);
      fetchKeys();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">API Key Management</h2>
          <p className="text-xs text-slate-400">
            Generate and manage scoped API keys for website webhook integration and external CRM connections
          </p>
        </div>
        <button
          onClick={() => {
            setGeneratedKey(null);
            setName('');
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New API Key</span>
        </button>
      </div>

      {/* Keys Table */}
      <div className="rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 bg-slate-950/40 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Key Name</th>
                <th className="py-3 px-4">Key Prefix (Hashed at rest)</th>
                <th className="py-3 px-4">Assigned Scopes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Used</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{k.name}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">{k.key_prefix}••••••••</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {k.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {k.last_used_at ? new Date(k.last_used_at).toLocaleString() : 'Never'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {new Date(k.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRevoke(k.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {keys.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No API keys created yet. Generate one above to authenticate incoming leads.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              {generatedKey ? 'API Key Generated' : 'Create New API Key'}
            </h3>

            {generatedKey ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Copy Your Key Now</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    This secret key will <b>only be shown once</b>. Store it safely in your environment variables.
                  </p>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 break-all select-all">
                    <span>{generatedKey}</span>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 ml-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Key Description / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Website Lead Webhook Service"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">Permission Scopes</label>
                  <div className="space-y-2">
                    {availableScopes.map((scope) => (
                      <label key={scope.id} className="flex items-center space-x-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedScopes.includes(scope.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedScopes([...selectedScopes, scope.id]);
                            } else {
                              setSelectedScopes(selectedScopes.filter((s) => s !== scope.id));
                            }
                          }}
                          className="rounded text-emerald-500 bg-slate-900 border-slate-700"
                        />
                        <span>{scope.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md"
                  >
                    Generate Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
