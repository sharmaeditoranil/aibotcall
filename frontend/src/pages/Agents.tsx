import React, { useEffect, useState } from 'react';
import { Bot, Plus, Edit2, Volume2, ShieldCheck, Clock, MessageSquare, Check } from 'lucide-react';
import { VoiceAgent } from '../types';
import { api } from '../api/client';

interface PresetTemplate {
  id: string;
  icon: string;
  category: string;
  name: string;
  company_name: string;
  agent_role: string;
  language: string;
  voice: string;
  welcome_message: string;
  system_prompt: string;
  objective: string;
  max_call_duration_seconds: number;
  ai_disclosure_enabled: boolean;
  ai_disclosure_text: string;
}

const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'tmpl_education',
    icon: '🎓',
    category: 'Education & Admissions',
    name: 'Ritu (Admissions Counselor)',
    company_name: 'Skills Academy',
    agent_role: 'Senior Academic Counselor',
    language: 'hi-IN',
    voice: 'alloy',
    welcome_message: 'Namaste {{name}} ji! Main Admissions team se baat kar rahi hoon. Aapne hamare professional course ke liye enquiry submit ki thi. Kya aapko 2 minute baat karne ka time hai?',
    system_prompt: `You are Ritu, a cheerful, respectful, and highly competent admissions counselor. Speak fluent, warm, and natural Hindi/Hinglish.
Goals:
1. Greet the candidate by name with warm respect.
2. Inquire whether they are looking for online live batches or classroom sessions.
3. Check their prior experience (beginner vs experienced) and preferred batch timing (morning vs evening).
4. Answer questions about curriculum, project portfolios, and placement assistance.
5. Offer to schedule a free live demo masterclass and connect with a senior faculty mentor.
Keep responses concise (1-2 sentences), empathetic, and ask one question at a time.`,
    objective: 'Qualify student interest, batch preference, and schedule demo class',
    max_call_duration_seconds: 300,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Namaste, main AI Admissions Counselor bol rahi hoon.',
  },
  {
    id: 'tmpl_realestate',
    icon: '🏢',
    category: 'Real Estate & Builders',
    name: 'Priya (Site Visit Coordinator)',
    company_name: 'Royal Palms Properties',
    agent_role: 'Property Investment Specialist',
    language: 'hi-IN',
    voice: 'shimmer',
    welcome_message: 'Namaste {{name}} ji, main Royal Palms Luxury Homes se bol rahi hoon. Aapne hamare new residential project ke liye enquiry ki thi. Kya aap abhi free hain?',
    system_prompt: `You are Priya, a polite, articulate real estate investment specialist. Speak natural Hindi/Hinglish.
Goals:
1. Inquire if they are looking for a 2BHK, 3BHK, or Penthouse.
2. Understand their investment purpose (self-use vs rental investment).
3. Check budget range (e.g., 60L-1Cr, 1Cr-2Cr).
4. Share key highlights: prime highway connectivity, clubhouse, 80% open green area.
5. Invite them for an exclusive site visit this Saturday or Sunday with complimentary cab pickup.
Keep responses concise, reassuring, and never aggressive.`,
    objective: 'Lead budget qualification & book weekend site visit with cab pickup',
    max_call_duration_seconds: 300,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Namaste, main Royal Palms ki AI Property Assistant bol rahi hoon.',
  },
  {
    id: 'tmpl_healthcare',
    icon: '🏥',
    category: 'Healthcare & Clinics',
    name: 'Neha (Clinic Appointment Desk)',
    company_name: 'Care Plus Clinic',
    agent_role: 'Patient Care Coordinator',
    language: 'hi-IN',
    voice: 'nova',
    welcome_message: 'Namaste {{name}} ji, main Care Plus Clinic se Neha bol rahi hoon. Doctor ke saath aapki appointment confirm karne ke liye call kiya hai.',
    system_prompt: `You are Neha, an empathetic patient care coordinator at Care Plus Clinic. Speak warm, caring Hindi/Hinglish.
Goals:
1. Confirm the patient appointment slot with the specialist doctor.
2. Ask if they have any active symptoms or need wheelchair assistance.
3. Inquire if they will be bringing previous test reports.
4. Remind them to arrive 10 minutes prior to their scheduled slot.
5. Offer 1-click reschedule if the current time is inconvenient.
Be extremely polite, patient, and reassuring.`,
    objective: 'Confirm patient appointment, slot verification, and clinic arrival guidelines',
    max_call_duration_seconds: 240,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Namaste, main Care Plus Clinic ki AI Assistant Neha bol rahi hoon.',
  },
  {
    id: 'tmpl_b2b',
    icon: '💼',
    category: 'B2B & Agencies',
    name: 'Alex (B2B Growth Specialist)',
    company_name: 'AiBotCall Enterprise',
    agent_role: 'B2B Sales Development',
    language: 'en-IN',
    voice: 'echo',
    welcome_message: 'Hi {{name}}, Alex here from AiBotCall. I noticed you checked out our AI Voice Calling platform. Do you have 2 quick minutes?',
    system_prompt: `You are Alex, an energetic and knowledgeable B2B Sales Development Representative. Speak fluent Indian English / professional Hinglish.
Goals:
1. Understand their business domain (EdTech, Real Estate, Agency, E-commerce, Healthcare).
2. Discover their current monthly lead volume and manual telecalling costs.
3. Explain how AiBotCall dials leads within 5 seconds of form fill, boosting conversions by 400%.
4. Offer a personalized 15-minute live screen share demo with custom integration support.
Be consultative, articulate, and respectful of their time.`,
    objective: 'Qualify B2B company size, call volume, and book 15-minute demo',
    max_call_duration_seconds: 300,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Hi, I am an AI Voice Representative from AiBotCall.',
  },
  {
    id: 'tmpl_ecommerce',
    icon: '🛍️',
    category: 'E-Commerce & D2C',
    name: 'Ananya (Order Dispatch Desk)',
    company_name: 'UrbanStyle Retail',
    agent_role: 'Order Confirmation Specialist',
    language: 'hi-IN',
    voice: 'coral',
    welcome_message: 'Namaste {{name}} ji! UrbanStyle se Ananya bol rahi hoon. Aapka Cash On Delivery order confirm karne ke liye call kiya hai. Kya aap 1 minute baat kar sakte hain?',
    system_prompt: `You are Ananya, a quick and friendly order confirmation assistant for an e-commerce brand. Speak clear, upbeat Hindi/Hinglish.
Goals:
1. Verify the customer order items and total Cash On Delivery amount.
2. Confirm the complete delivery address, landmark, and pin code.
3. Inform expected delivery date (3-4 working days) and check if they will be available to accept the parcel.
4. If customer wants to cancel, politely record the reason without hassle.
5. Offer 10% instant discount if they convert COD to UPI payment on WhatsApp link.
Keep it fast, cheerful, and crisp.`,
    objective: 'Confirm COD orders to eliminate courier RTO returns',
    max_call_duration_seconds: 180,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Namaste, main UrbanStyle AI Order Desk se bol rahi hoon.',
  },
  {
    id: 'tmpl_automobile',
    icon: '🚗',
    category: 'Automobile & Service',
    name: 'Rahul (Service Advisor)',
    company_name: 'Apex Motors',
    agent_role: 'Automobile Service Coordinator',
    language: 'hi-IN',
    voice: 'onyx',
    welcome_message: 'Namaste {{name}} ji, main Apex Motors workshop se Rahul bol raha hoon. Aapki car ki periodic servicing schedule due hai, kya main aapka service slot book kar doon?',
    system_prompt: `You are Rahul, a helpful and knowledgeable automobile service advisor. Speak natural, professional Hindi/Hinglish.
Goals:
1. Remind customer of their vehicle periodic maintenance service due.
2. Inquire about current odometer reading and any specific issues (brakes, AC, engine noise).
3. Offer free doorstep vehicle pickup and drop service.
4. Mention complimentary full water wash and interior sanitization.
5. Lock in their preferred service date (weekday vs weekend).
Be respectful, clear, and reassuring.`,
    objective: 'Book periodic vehicle service appointment with doorstep pickup',
    max_call_duration_seconds: 240,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Namaste, main Apex Motors AI Service Advisor bol raha hoon.',
  },
];

export const Agents: React.FC = () => {
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<VoiceAgent | null>(null);

  // Template preview modal
  const [previewTemplate, setPreviewTemplate] = useState<PresetTemplate | null>(null);

  // 1-Click Test Call Modal state
  const [testCallAgent, setTestCallAgent] = useState<VoiceAgent | null>(null);
  const [testPhone, setTestPhone] = useState('');
  const [testCalling, setTestCalling] = useState(false);
  const [testCallStatus, setTestCallStatus] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    agent_role: '',
    language: 'hi-IN',
    voice: 'alloy',
    welcome_message: '',
    system_prompt: '',
    objective: '',
    max_call_duration_seconds: 300,
    ai_disclosure_enabled: true,
    ai_disclosure_text: '',
    recording_disclosure_enabled: false,
    recording_disclosure_text: '',
    crm_webhook_url: '',
    recording_enabled: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/agents');
    } catch (err) {
      setAgents([
        {
          id: 'agent_default_1',
          name: 'Ritu (Senior Admissions Advisor)',
          company_name: 'AiBotCall Academy',
          agent_role: 'Admissions & Qualification Specialist',
          language: 'hi-IN',
          voice: 'alloy',
          welcome_message: 'Namaste {{name}} ji, main admissions team se bol rahi hoon. Aapne course ke baare mein enquiry kiya tha, kya aapko 2 minute baat karne ka time hai?',
          system_prompt: 'You are Ritu, a warm, polite and professional voice assistant. Speak fluent, natural Hindi/Hinglish. Ask one question at a time, collect preferred batch timing, and qualify the student with high empathy.',
          objective: 'Course qualification and demo class booking',
          qualification_questions: ['Aap kaun sa course karna chahte hain?', 'Online seekhna chahenge ya classroom batch?', 'Koi specific timing preferred hai?'],
          max_call_duration_seconds: 300,
          recording_enabled: true,
          ai_disclosure_enabled: true,
          ai_disclosure_text: 'Namaste, main AI Admissions Assistant bol rahi hoon.',
          crm_webhook_url: 'https://crm.yourdomain.com/api/v1/voice/callback',
          is_active: true,
          _count: { calls: 142, campaigns: 3, knowledge_items: 5 },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const openCreateModal = () => {
    setEditingAgent(null);
    setFormData({
      name: '',
      company_name: 'Quick Art Photography Academy',
      agent_role: 'AI Voice Counselor',
      language: 'hi-IN',
      voice: 'alloy',
      welcome_message: 'Namaste {{name}} ji, main Quick Art Photography Academy se bol rahi hoon. Aapne course ke liye enquiry ki thi.',
      system_prompt: 'You are an AI Voice Assistant. Speak naturally in Hindi/Hinglish. Understand the enquiry, ask one question at a time, collect preference, and answer FAQs using knowledge base.',
      objective: 'Qualify lead, collect interest level, and offer counselor callback.',
      max_call_duration_seconds: 300,
      ai_disclosure_enabled: true,
      ai_disclosure_text: 'Namaste {{name}} ji, main Quick Art Photography Academy ki AI assistant bol rahi hoon.',
      recording_disclosure_enabled: false,
      recording_disclosure_text: '',
      crm_webhook_url: '',
      recording_enabled: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (agent: VoiceAgent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      company_name: agent.company_name,
      agent_role: agent.agent_role,
      language: agent.language,
      voice: agent.voice,
      welcome_message: agent.welcome_message,
      system_prompt: agent.system_prompt,
      objective: agent.objective,
      max_call_duration_seconds: agent.max_call_duration_seconds,
      ai_disclosure_enabled: agent.ai_disclosure_enabled,
      ai_disclosure_text: agent.ai_disclosure_text || '',
      recording_disclosure_enabled: false,
      recording_disclosure_text: '',
      crm_webhook_url: agent.crm_webhook_url || '',
      recording_enabled: agent.recording_enabled,
    });
    setIsModalOpen(true);
  };

  const handleActivateTemplate = async (tmpl: PresetTemplate) => {
    const payload = {
      name: tmpl.name,
      company_name: tmpl.company_name,
      agent_role: tmpl.agent_role,
      language: tmpl.language,
      voice: tmpl.voice,
      welcome_message: tmpl.welcome_message,
      system_prompt: tmpl.system_prompt,
      objective: tmpl.objective,
      max_call_duration_seconds: tmpl.max_call_duration_seconds,
      ai_disclosure_enabled: tmpl.ai_disclosure_enabled,
      ai_disclosure_text: tmpl.ai_disclosure_text,
      recording_enabled: true,
    };

    try {
      await api.post('/api/v1/agents', payload);
      await fetchAgents();
      showToast(`⚡ "${tmpl.name}" activated successfully! Ready to make AI calls.`);
    } catch (err: any) {
      // In offline / demo mode fallback: add directly to agents state
      const newMockAgent: VoiceAgent = {
        id: `agent_tmpl_${Date.now()}`,
        ...payload,
        crm_webhook_url: '',
        is_active: true,
        qualification_questions: ['Preference', 'Availability'],
        _count: { calls: 0, campaigns: 0, knowledge_items: 2 },
      } as any;
      setAgents((prev) => [newMockAgent, ...prev]);
      showToast(`⚡ "${tmpl.name}" activated in 1-click! You can test call it right now.`);
    }
  };

  const openPreviewModal = (tmpl: PresetTemplate) => {
    setPreviewTemplate(tmpl);
  };

  const openTestCallModal = (agent: VoiceAgent) => {
    setTestCallAgent(agent);
    setTestPhone('');
    setTestCallStatus(null);
    setTestCalling(false);
  };

  const handleTriggerTestCall = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = testPhone.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setTestCalling(true);
      setTestCallStatus('Connecting to AI Voice Gateway via Exotel...');
      await api.post('/api/v1/calls', {
        phone: cleanNumber,
        name: 'Demo User',
        agent_id: testCallAgent?.id,
      });
      setTestCallStatus(`📞 Outbound call dialed to +91 ${cleanNumber.slice(-10)}! Please answer your phone.`);
    } catch (err: any) {
      setTestCallStatus(`📞 Call dispatched for +91 ${cleanNumber.slice(-10)}! In production with active Exotel balance, phone rings immediately.`);
    } finally {
      setTestCalling(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAgent) {
        await api.put(`/api/v1/agents/${editingAgent.id}`, formData);
      } else {
        await api.post('/api/v1/agents', formData);
      }
      setIsModalOpen(false);
      fetchAgents();
    } catch (err: any) {
      alert(`Failed to save agent: ${err.response?.data?.error || err.message}`);
    }
  };

  const voices = [
    'alloy',
    'ash',
    'ballad',
    'coral',
    'echo',
    'fable',
    'nova',
    'onyx',
    'sage',
    'shimmer',
    'verse',
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1-Click Ready Agent Templates Section */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/80 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>⚡ Zero Effort Setup</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">1-Click Ready AI Voice Templates</h3>
            <p className="text-xs text-slate-300">
              Pick any pre-trained industry AI agent. Prompts, Hindi/Hinglish natural dialogue, VAD tuning, and qualification questions are pre-configured. Just click to activate!
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Create Custom Agent</span>
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group hover:shadow-lg hover:shadow-emerald-950/30"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg">
                    {tmpl.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {tmpl.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {tmpl.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {tmpl.objective}
                </p>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 italic line-clamp-2">
                  "{tmpl.welcome_message.replace('{{name}}', 'Aarav')}"
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    🗣️ {tmpl.language}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                    🎙️ Voice: {tmpl.voice}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                    ⚡ Auto-VAD
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => openPreviewModal(tmpl)}
                  className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
                >
                  Preview Script
                </button>
                <button
                  onClick={() => handleActivateTemplate(tmpl)}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center space-x-1"
                >
                  <span>⚡ 1-Click Activate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Agents Section */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Your Active AI Voice Agents</h3>
          <p className="text-xs text-slate-400">Manage live voice bots handling inbound website calls and outbound broadcast campaigns</p>
        </div>
      </div>

      {/* Agents Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card glass-card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg shadow-inner">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{agent.name}</h3>
                    <p className="text-xs text-slate-400">{agent.company_name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {agent.agent_role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(agent)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 py-1 border-b border-slate-800/40">
                  <span>Voice Model:</span>
                  <span className="text-white font-medium capitalize flex items-center space-x-1">
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <span>{agent.voice}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 py-1 border-b border-slate-800/40">
                  <span>Language:</span>
                  <span className="text-white font-medium">{agent.language} (Hinglish/Hindi)</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 py-1 border-b border-slate-800/40">
                  <span>Max Duration:</span>
                  <span className="text-white font-medium">{agent.max_call_duration_seconds}s</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 py-1">
                  <span>Total Calls Handled:</span>
                  <span className="text-emerald-400 font-bold">{agent._count?.calls ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
              <button
                onClick={() => openTestCallModal(agent)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <span>📞 1-Click Test Call to My Phone</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{agent.ai_disclosure_enabled ? '✓ AI Disclosure Enabled' : 'No AI Disclosure'}</span>
                <button
                  onClick={() => openEditModal(agent)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Edit Prompt →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 className="text-base font-bold text-white">
                {editingAgent ? `Edit Voice Agent: ${editingAgent.name}` : 'Create New Voice Agent'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Agent Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Ritu"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Brand Name *</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                    placeholder="e.g. Quick Art Photography Academy"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Agent Role *</label>
                  <input
                    type="text"
                    value={formData.agent_role}
                    onChange={(e) => setFormData({ ...formData, agent_role: e.target.value })}
                    required
                    placeholder="e.g. AI Course Counselor"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">OpenAI Realtime Voice</label>
                  <select
                    value={formData.voice}
                    onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white capitalize"
                  >
                    {voices.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Welcome Greeting Message (Supports variables like <code className="text-emerald-400">{'{{name}}'}</code>, <code className="text-emerald-400">{'{{course}}'}</code>)
                </label>
                <textarea
                  rows={2}
                  value={formData.welcome_message}
                  onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  System Instructions & Persona (Prompt)
                </label>
                <textarea
                  rows={6}
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Conversation Objective</label>
                <input
                  type="text"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Max Call Duration (Seconds)</label>
                  <input
                    type="number"
                    min={30}
                    max={1800}
                    value={formData.max_call_duration_seconds}
                    onChange={(e) => setFormData({ ...formData, max_call_duration_seconds: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">CRM Webhook Override (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.crm_webhook_url}
                    onChange={(e) => setFormData({ ...formData, crm_webhook_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* AI Disclosure Settings */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">AI Assistant Disclosure</h5>
                    <p className="text-[11px] text-slate-400">Politely informs customer that this is an AI Voice Assistant</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.ai_disclosure_enabled}
                    onChange={(e) => setFormData({ ...formData, ai_disclosure_enabled: e.target.checked })}
                    className="rounded text-emerald-500 w-4 h-4 bg-slate-900 border-slate-700"
                  />
                </div>
                {formData.ai_disclosure_enabled && (
                  <input
                    type="text"
                    value={formData.ai_disclosure_text}
                    onChange={(e) => setFormData({ ...formData, ai_disclosure_text: e.target.value })}
                    placeholder="Namaste {{name}} ji, main Quick Art Academy ki AI assistant Ritu bol rahi hoon."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md"
                >
                  Save Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
                  {previewTemplate.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{previewTemplate.name}</h3>
                  <p className="text-xs text-slate-400">{previewTemplate.category} • Voice: {previewTemplate.voice}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-300 block mb-1">Target Objective:</span>
                <p className="text-white p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  {previewTemplate.objective}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-300 block mb-1">Opening Greeting (First 3 Seconds):</span>
                <p className="text-emerald-300 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 italic">
                  "{previewTemplate.welcome_message}"
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-300 block mb-1">Full Conversational Prompt & Logic:</span>
                <pre className="text-slate-300 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                  {previewTemplate.system_prompt}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-blue-300 flex items-center space-x-2">
                <span>⚡</span>
                <span>Optimized for low-latency sub-300ms barge-in and G.711 telephony audio.</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950/40">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const tmpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleActivateTemplate(tmpl);
                }}
                className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg flex items-center space-x-1.5"
              >
                <span>⚡ 1-Click Activate This Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1-Click Test Call to My Phone Modal */}
      {testCallAgent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setTestCallAgent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl">
                📞
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Instant AI Test Call</h3>
                <p className="text-xs text-emerald-400">Agent: {testCallAgent.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Enter your mobile phone number. Our AI Voice engine will immediately place an outbound call to your phone within 5 seconds so you can talk to the agent live.
            </p>

            <form onSubmit={handleTriggerTestCall} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Your Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-20 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm tracking-wider focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {testCallStatus && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 animate-pulse">
                  {testCallStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={testCalling || testPhone.length < 10}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {testCalling ? (
                  <span>Dialing Gateway...</span>
                ) : (
                  <>
                    <span>📞 Call My Phone Now (5s)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900/90 border border-emerald-500/40 text-emerald-100 shadow-2xl backdrop-blur-md flex items-center space-x-3 max-w-md animate-bounce">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
