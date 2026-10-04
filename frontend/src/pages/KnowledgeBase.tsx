import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, CheckCircle2, Search, Tag } from 'lucide-react';
import { KnowledgeItem } from '../types';
import { api } from '../api/client';

export const KnowledgeBase: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Courses',
    content: '',
  });

  const categories = ['Courses', 'Pricing', 'Timings', 'Locations', 'FAQs', 'Policies', 'Offers'];

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/knowledge-base');
      if (res.data?.items && res.data.items.length > 0) {
        setItems(res.data.items);
      } else {
        throw new Error('No items');
      }
    } catch (err) {
      setItems([
        {
          id: 'kb_1',
          title: 'Video Editing Masterclass Fee Structure',
          category: 'Pricing',
          content: 'The 3-month Professional Video Editing Masterclass total fee is ₹18,500. A flexible 2-part installment plan is available (₹10,000 upfront + ₹8,500 in the second month). Includes lifetime access to software presets and stock footage.',
          is_active: true,
          created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
        },
        {
          id: 'kb_2',
          title: 'Weekday & Weekend Batch Schedules',
          category: 'Timings',
          content: 'Morning Batch: Monday to Thursday, 10:00 AM to 12:30 PM. Evening Batch: Monday to Thursday, 6:00 PM to 8:30 PM. Working Professionals Weekend Batch: Saturday and Sunday, 2:00 PM to 6:00 PM.',
          is_active: true,
          created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
        },
        {
          id: 'kb_3',
          title: 'Academy Location & Campus Address',
          category: 'Locations',
          content: 'Main Campus: 3rd Floor, Apex Business Tower, Near Metro Pillar 142, Andheri West, Mumbai. Free student parking is available on premises.',
          is_active: true,
          created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
        },
        {
          id: 'kb_4',
          title: 'Certificate & 100% Placement Support',
          category: 'Policies',
          content: 'All certified students receive government-recognized skill certification along with guaranteed portfolio reviews and interview scheduling with 40+ media houses and creative agencies.',
          is_active: true,
          created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ title: '', category: 'Courses', content: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormData({ title: item.title, category: item.category, content: item.content });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/api/v1/knowledge-base/${editingItem.id}`, formData);
      } else {
        await api.post('/api/v1/knowledge-base', formData);
      }
      setIsModalOpen(false);
      fetchKnowledge();
    } catch (err: any) {
      alert(`Save error: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this knowledge item?')) return;
    try {
      await api.delete(`/api/v1/knowledge-base/${id}`);
      fetchKnowledge();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filtered = items.filter(
    (item) =>
      (!selectedCategory || item.category === selectedCategory) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Knowledge Base</h2>
          <p className="text-xs text-slate-400">
            Verified course fees, batch schedules, branch locations & policies used by AI during calls
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Item</span>
        </button>
      </div>

      {/* Categories & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card">
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === ''
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Categories ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((it) => it.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search knowledge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card glass-card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {item.category}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{item.content}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>{item.agent ? `Agent: ${item.agent.name}` : 'Global Company Knowledge'}</span>
              <span>Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">
              {editingItem ? 'Edit Knowledge Item' : 'New Knowledge Item'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Video Editing Masterclass Fees & EMI"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Verified Information Content *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Provide precise details. AI will use this text verbatim to answer student questions."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                />
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
                  Save Knowledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
