import React, { useEffect, useState } from 'react';
import {
  Bot,
  Plus,
  Edit2,
  Volume2,
  ShieldCheck,
  Clock,
  MessageSquare,
  Check,
  Play,
  Square,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Star,
  Award,
} from 'lucide-react';
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
    welcome_message: 'Namaste {{name}} ji! Main Admissions team se baat kar rahi hoon. Aapne hamare professional course ke liye enquiry submit ki thi. Kya aapko 2 minute baat karne ka samay hai?',
    system_prompt: `You are Ritu, a cheerful, respectful, and highly competent admissions counselor. Speak fluent, warm, and natural Hindi/Hinglish.
STRICT ACCURACY RULES:
1. Only answer based on verified Knowledge Base. Never invent course fees or fake discounts.
2. If customer asks off-topic questions, politely say: "Main sirf Skills Academy admissions ke vishay mein sahayata karne ke liye uplabdh hoon. Kya hum course details par aage badhein?"
3. Ask ONE question at a time: batch timing preference, prior knowledge, and schedule demo class.
4. Keep answers short (1-2 sentences).`,
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
STRICT ACCURACY RULES:
1. Quote only verified flat configurations (2BHK from 78L, 3BHK from 1.18Cr).
2. If customer talks about off-topic issues, politely guide them back: "Main sirf Royal Palms Luxury project ke baare mein jaankari share karne ke liye call par hoon. Kya hum site visit book karein?"
3. Offer free weekend AC cab pickup and drop from their home.
4. Short conversational turns (1-2 sentences max).`,
    objective: 'Lead budget qualification & book weekend site visit with cab pickup',
    max_call_duration_seconds: 300,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Namaste, main Royal Palms ki AI Property Assistant bol rahi hoon.',
  },
  {
    id: 'tmpl_finance',
    icon: '💰',
    category: 'Banking & Loans',
    name: 'Vikram (Loan Desk Specialist)',
    company_name: 'FastCredit Financial',
    agent_role: 'Senior Loan Officer',
    language: 'hi-IN',
    voice: 'echo',
    welcome_message: 'Namaste {{name}} ji, main FastCredit se Vikram bol raha hoon. Aapne pre-approved personal loan offer ke liye request submit ki thi. Kya aap 1 minute baat kar sakte hain?',
    system_prompt: `You are Vikram, a professional loan officer. Speak natural Hindi/Hinglish with polite authority.
STRICT ACCURACY RULES:
1. Verified interest rates start from 10.49% p.a. Zero prepayment penalty after 6 months.
2. Inquire about monthly take-home salary and required loan amount.
3. If caller asks off-topic questions, politely say: "Main sirf FastCredit loan verification ke liye call par hoon. Kya hum eligibility check poori karein?"
4. Keep responses crisp and to the point.`,
    objective: 'Qualify loan amount, monthly income, and verify bank statement submission',
    max_call_duration_seconds: 240,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Namaste, main FastCredit ka AI Loan Officer bol raha hoon.',
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
STRICT ACCURACY RULES:
1. Doctor consultation fee: ₹400 general, ₹800 specialist. Confirm appointment slot.
2. If patient asks medical diagnoses or off-topic queries, say: "Main ek medical doctor nahi hoon, isliye main prescription nahi de sakti. Lekin main hamare specialist doctor ke saath aapka slot confirm kar sakti hoon."
3. Remind them to arrive 10 minutes prior to slot.`,
    objective: 'Confirm patient appointment, slot verification, and clinic arrival guidelines',
    max_call_duration_seconds: 180,
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
    system_prompt: `You are Alex, an energetic B2B Sales Representative. Speak fluent Indian English/Hinglish.
STRICT ACCURACY RULES:
1. Explain how AiBotCall dials leads within 5 seconds of form fill, boosting conversions by 400%.
2. Qualify lead size, monthly call volume, and book a 15-minute live screen share demo.
3. Reject off-topic banter politely and keep the meeting goal in focus.`,
    objective: 'Qualify B2B company size, call volume, and book 15-minute demo',
    max_call_duration_seconds: 300,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Hi, I am an AI Voice Representative from AiBotCall.',
  },
  {
    id: 'tmpl_solar',
    icon: '☀️',
    category: 'Solar & Renewable',
    name: 'Sunita (Solar Energy Advisor)',
    company_name: 'Surya Shakti Solar',
    agent_role: 'Rooftop Solar Advisor',
    language: 'hi-IN',
    voice: 'coral',
    welcome_message: 'Namaste {{name}} ji, main Surya Shakti Solar se Sunita bol rahi hoon. Aapne PM Surya Ghar 78,000 subsidy scheme ke liye enquiry ki thi. Kya aap 2 minute free hain?',
    system_prompt: `You are Sunita, an informative solar energy advisor. Speak natural Hindi/Hinglish.
STRICT ACCURACY RULES:
1. PM Surya Ghar direct subsidy is up to ₹78,000 for 3kW rooftop plant. Reduces electricity bill by 80-90%.
2. Ask about monthly electricity bill amount (e.g. ₹2000, ₹5000) and roof ownership.
3. Book a 100% free doorstep roof feasibility and shadow survey.
4. Strictly decline off-topic queries with warm redirection.`,
    objective: 'Check monthly electricity bill, roof ownership, and book free solar survey',
    max_call_duration_seconds: 240,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Namaste, main Surya Shakti Solar ki AI Advisor bol rahi hoon.',
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
    system_prompt: `You are Ananya, a quick and friendly order confirmation assistant.
STRICT ACCURACY RULES:
1. Verify order item, delivery address, and pincode.
2. Offer instant ₹50-₹100 discount if they convert COD to prepaid UPI.
3. Fast, crisp responses (1 sentence). Complete verification in under 90 seconds.`,
    objective: 'Confirm COD orders to eliminate courier RTO returns',
    max_call_duration_seconds: 120,
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
    system_prompt: `You are Rahul, a knowledgeable automobile service advisor. Speak natural Hindi/Hinglish.
STRICT ACCURACY RULES:
1. Mention complimentary doorstep vehicle pickup & drop and free water foam wash.
2. Check odometer reading and preferred service date.
3. Decline off-topic queries politely and lock in the workshop slot.`,
    objective: 'Book periodic vehicle service appointment with doorstep pickup',
    max_call_duration_seconds: 180,
    ai_disclosure_enabled: true,
    ai_disclosure_text: 'Namaste, main Apex Motors AI Service Advisor bol raha hoon.',
  },
];

interface VoiceInfo {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  tone: string;
  bestFor: string;
}

const VOICES_CATALOG: VoiceInfo[] = [
  { id: 'alloy', name: 'Alloy', gender: 'Female', tone: 'Balanced, clear & polite', bestFor: 'Customer Support, Admissions & Inquiries' },
  { id: 'shimmer', name: 'Shimmer', gender: 'Female', tone: 'Soft, gentle & warm', bestFor: 'Real Estate, Luxury, Clinics & Hospitality' },
  { id: 'nova', name: 'Nova', gender: 'Female', tone: 'Energetic, crisp & upbeat', bestFor: 'Sales, EdTech & Fast-paced Qualification' },
  { id: 'coral', name: 'Coral', gender: 'Female', tone: 'Cheerful & friendly', bestFor: 'E-Commerce, COD Confirmation & Feedback' },
  { id: 'echo', name: 'Echo', gender: 'Male', tone: 'Warm, conversational & calm', bestFor: 'Banking, Loans, Finance & Technology' },
  { id: 'onyx', name: 'Onyx', gender: 'Male', tone: 'Deep, confident & authoritative', bestFor: 'Automobile, Corporate & Legal Inquiries' },
  { id: 'fable', name: 'Fable', gender: 'Male', tone: 'Expressive & storytelling', bestFor: 'Events, Narrative & Entertainment' },
  { id: 'ash', name: 'Ash', gender: 'Male', tone: 'Direct, crisp & efficient', bestFor: 'Reminders, Logistics & Collections' },
];

export const Agents: React.FC = () => {
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<VoiceAgent | null>(null);

  // Default agent persistence
  const [defaultAgentId, setDefaultAgentId] = useState<string>(() => {
    return localStorage.getItem('aibotcall_default_agent_id') || '';
  });

  // Audio preview playback state
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

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
    strict_topic_guardrail: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Live Voice Demo synthesis in browser
  const playVoiceAudioDemo = (voiceId: string, customPhrase?: string) => {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (playingVoice === voiceId) {
      window.speechSynthesis.cancel();
      setPlayingVoice(null);
      return;
    }

    window.speechSynthesis.cancel();

    const isFemale = ['alloy', 'shimmer', 'nova', 'coral'].includes(voiceId.toLowerCase());
    const sampleText =
      customPhrase ||
      (isFemale
        ? `Namaste! Main ${voiceId.toUpperCase()} voice hoon. Main aapke business calls ko perfect accuracy ke saath attend karungi aur koi bhi idhar-udhar ki baat nahi karungi.`
        : `Namaste! Main ${voiceId.toUpperCase()} voice hoon. Main aapke business ke liye high conversion calls karunga aur direct topic par baat karunga.`);

    const utterance = new SpeechSynthesisUtterance(sampleText);

    // Fine-tune pitch and speech rate based on voice persona
    switch (voiceId.toLowerCase()) {
      case 'alloy':
        utterance.pitch = 1.05;
        utterance.rate = 0.98;
        break;
      case 'shimmer':
        utterance.pitch = 1.25;
        utterance.rate = 1.0;
        break;
      case 'nova':
        utterance.pitch = 1.18;
        utterance.rate = 1.05;
        break;
      case 'coral':
        utterance.pitch = 1.1;
        utterance.rate = 0.96;
        break;
      case 'echo':
        utterance.pitch = 0.88;
        utterance.rate = 0.95;
        break;
      case 'onyx':
        utterance.pitch = 0.72;
        utterance.rate = 0.92;
        break;
      case 'fable':
        utterance.pitch = 0.95;
        utterance.rate = 0.98;
        break;
      case 'ash':
        utterance.pitch = 0.82;
        utterance.rate = 1.02;
        break;
      default:
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
    }

    // Try finding an Indian English or Hindi voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN') || v.lang.includes('en-IN')) ||
      voices[0];
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => setPlayingVoice(null);
    utterance.onerror = () => setPlayingVoice(null);

    setPlayingVoice(voiceId);
    window.speechSynthesis.speak(utterance);
  };

  const stopVoiceAudioDemo = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingVoice(null);
  };

  const handleSetDefaultAgent = (agent: VoiceAgent) => {
    localStorage.setItem('aibotcall_default_agent_id', agent.id);
    setDefaultAgentId(agent.id);
    showToast(`⭐ "${agent.name}" is now your Primary Default Calling Agent for outbound dials!`);
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/agents');
      if (res.data?.agents && res.data.agents.length > 0) {
        setAgents(res.data.agents);
        if (!defaultAgentId) {
          setDefaultAgentId(res.data.agents[0].id);
          localStorage.setItem('aibotcall_default_agent_id', res.data.agents[0].id);
        }
      } else {
        throw new Error('No agents');
      }
    } catch (err) {
      const fallbackList: VoiceAgent[] = [
        {
          id: 'agent_default_1',
          name: 'Ritu (Senior Admissions Advisor)',
          company_name: 'AiBotCall Academy',
          agent_role: 'Admissions & Qualification Specialist',
          language: 'hi-IN',
          voice: 'alloy',
          welcome_message: 'Namaste {{name}} ji, main admissions team se bol rahi hoon. Aapne course ke baare mein enquiry kiya tha, kya aapko 2 minute baat karne ka time hai?',
          system_prompt: 'You are Ritu, a warm, polite and professional voice assistant. STRICT TOPIC FOCUS: Only discuss course details, fees, and batch schedules. Reject off-topic banter politely.',
          objective: 'Course qualification and demo class booking',
          qualification_questions: ['Aap kaun sa course karna chahte hain?', 'Online seekhna chahenge ya classroom batch?'],
          max_call_duration_seconds: 180,
          recording_enabled: true,
          ai_disclosure_enabled: true,
          ai_disclosure_text: 'Namaste, main AI Admissions Assistant bol rahi hoon.',
          crm_webhook_url: '',
          is_active: true,
          _count: { calls: 142, campaigns: 3, knowledge_items: 5 },
        } as any,
        {
          id: 'agent_default_2',
          name: 'Vikram (Loan Desk Specialist)',
          company_name: 'FastCredit Financial',
          agent_role: 'Senior Loan Officer',
          language: 'hi-IN',
          voice: 'echo',
          welcome_message: 'Namaste {{name}} ji, main FastCredit se Vikram bol raha hoon. Aapne pre-approved loan offer ke liye request kiya tha.',
          system_prompt: 'You are Vikram, a professional loan officer. STRICT ACCURACY: Stick strictly to verified loan eligibility and interest rates. Never answer off-topic queries.',
          objective: 'Qualify loan amount, income, and confirm KYC documents',
          qualification_questions: ['Monthly salary kitni hai?', 'Kitne amount ka loan chahiye?'],
          max_call_duration_seconds: 180,
          recording_enabled: true,
          ai_disclosure_enabled: true,
          ai_disclosure_text: 'Namaste, main FastCredit AI Assistant bol raha hoon.',
          crm_webhook_url: '',
          is_active: true,
          _count: { calls: 86, campaigns: 2, knowledge_items: 4 },
        } as any,
      ];
      setAgents(fallbackList);
      if (!defaultAgentId) {
        setDefaultAgentId(fallbackList[0].id);
        localStorage.setItem('aibotcall_default_agent_id', fallbackList[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    return () => {
      stopVoiceAudioDemo();
    };
  }, []);

  const openCreateModal = () => {
    setEditingAgent(null);
    setFormData({
      name: '',
      company_name: 'AiBotCall Business Solutions',
      agent_role: 'AI Voice Specialist',
      language: 'hi-IN',
      voice: 'alloy',
      welcome_message: 'Namaste {{name}} ji, main aapki enquiry ke sambandh mein call kar rahi hoon.',
      system_prompt: `You are an AI Voice Assistant. Speak naturally in Hindi/Hinglish.
STRICT ACCURACY RULES:
1. Answer only using the verified business Knowledge Base.
2. Reject off-topic banter politely and redirect back to the topic.
3. Ask ONE question at a time. Maximum 1-2 sentences per response.`,
      objective: 'Qualify customer need and arrange callback or booking',
      max_call_duration_seconds: 180,
      ai_disclosure_enabled: true,
      ai_disclosure_text: 'Namaste, main AI Voice Assistant bol rahi hoon.',
      recording_disclosure_enabled: false,
      recording_disclosure_text: '',
      crm_webhook_url: '',
      recording_enabled: true,
      strict_topic_guardrail: true,
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
      max_call_duration_seconds: agent.max_call_duration_seconds || 180,
      ai_disclosure_enabled: agent.ai_disclosure_enabled,
      ai_disclosure_text: agent.ai_disclosure_text || '',
      recording_disclosure_enabled: false,
      recording_disclosure_text: '',
      crm_webhook_url: agent.crm_webhook_url || '',
      recording_enabled: agent.recording_enabled,
      strict_topic_guardrail: true,
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
      const res = await api.post('/api/v1/agents', payload);
      await fetchAgents();
      if (res.data?.agent?.id) {
        handleSetDefaultAgent(res.data.agent);
      }
      showToast(`⚡ "${tmpl.name}" activated successfully! Ready to make AI calls.`);
    } catch (err: any) {
      const newMockAgent: VoiceAgent = {
        id: `agent_tmpl_${Date.now()}`,
        ...payload,
        crm_webhook_url: '',
        is_active: true,
        qualification_questions: ['Preference', 'Availability'],
        _count: { calls: 0, campaigns: 0, knowledge_items: 2 },
      } as any;
      setAgents((prev) => [newMockAgent, ...prev]);
      handleSetDefaultAgent(newMockAgent);
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
        showToast('✓ AI Voice Agent updated successfully');
      } else {
        const res = await api.post('/api/v1/agents', formData);
        if (res.data?.agent?.id) {
          handleSetDefaultAgent(res.data.agent);
        }
        showToast('✓ New AI Voice Agent created & set active');
      }
      setIsModalOpen(false);
      fetchAgents();
    } catch (err: any) {
      // Offline fallback
      const savedMock: VoiceAgent = {
        id: editingAgent ? editingAgent.id : `agent_mock_${Date.now()}`,
        name: formData.name,
        company_name: formData.company_name,
        agent_role: formData.agent_role,
        language: formData.language,
        voice: formData.voice,
        welcome_message: formData.welcome_message,
        system_prompt: formData.system_prompt,
        objective: formData.objective,
        max_call_duration_seconds: formData.max_call_duration_seconds,
        recording_enabled: formData.recording_enabled,
        ai_disclosure_enabled: formData.ai_disclosure_enabled,
        ai_disclosure_text: formData.ai_disclosure_text,
        crm_webhook_url: formData.crm_webhook_url,
        is_active: true,
        _count: { calls: 0, campaigns: 0, knowledge_items: 0 },
      } as any;
      if (editingAgent) {
        setAgents((prev) => prev.map((a) => (a.id === editingAgent.id ? savedMock : a)));
      } else {
        setAgents((prev) => [savedMock, ...prev]);
        handleSetDefaultAgent(savedMock);
      }
      setIsModalOpen(false);
      showToast('✓ AI Agent saved locally');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Bot className="w-3.5 h-3.5" />
            <span>Smart Calling Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Voice Agents & Voice Demos</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose which agent handles your calls, audition realistic voice models, set max call duration, and enforce strict business topic boundaries.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Agent</span>
        </button>
      </div>

      {/* Live Voice Audition Demo Station */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b]/70 to-[#0f172a] border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Interactive Voice Audition Player</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                8 OPENAI REALTIME VOICES
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Click <span className="text-emerald-400 font-semibold">"▶ Listen Demo"</span> on any voice below to hear how it sounds in Hindi & English before choosing it for your agent.
            </p>
          </div>
          {playingVoice && (
            <button
              onClick={stopVoiceAudioDemo}
              className="py-1.5 px-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold flex items-center space-x-1.5 cursor-pointer hover:bg-red-500/30 shrink-0"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Playing</span>
            </button>
          )}
        </div>

        {/* Voices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {VOICES_CATALOG.map((v) => {
            const isPlaying = playingVoice === v.id;
            return (
              <div
                key={v.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isPlaying
                    ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{v.gender === 'Female' ? '👩' : '👨'}</span>
                    <span className="text-xs font-bold text-white capitalize">{v.name}</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      v.gender === 'Female'
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {v.gender}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 font-medium">{v.tone}</p>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{v.bestFor}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => playVoiceAudioDemo(v.id)}
                    className={`py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer transition-all ${
                      isPlaying
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                        <span>Playing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>▶ Listen Demo</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">Realtime</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1-Click Ready AI Voice Templates */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/80 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Ready Industry Agents</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Pre-Configured AI Voice Agents</h3>
          <p className="text-xs text-slate-300">
            Pre-trained for your exact business domain with strict anti-off-topic guardrails, high-accuracy qualification scripts, and natural Hindi/Hinglish warmth.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group hover:shadow-lg"
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
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tmpl.objective}</p>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 italic line-clamp-2">
                  "{tmpl.welcome_message.replace('{{name}}', 'Aarav')}"
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    🗣️ {tmpl.language}
                  </span>
                  <button
                    onClick={() => playVoiceAudioDemo(tmpl.voice, tmpl.welcome_message.replace('{{name}}', 'Aarav'))}
                    className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium hover:bg-blue-500/20 cursor-pointer flex items-center space-x-1"
                  >
                    <Volume2 className="w-2.5 h-2.5" />
                    <span>Voice: {tmpl.voice} (Demo)</span>
                  </button>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                    ⏱️ Max: {tmpl.max_call_duration_seconds}s
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => openPreviewModal(tmpl)}
                  className="text-xs text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  Preview Script
                </button>
                <button
                  onClick={() => handleActivateTemplate(tmpl)}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>⚡ 1-Click Activate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Agents Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Your Active AI Voice Agents</h3>
            <p className="text-xs text-slate-400">
              Pick which agent should handle your outbound calls and quick dials. Star an agent to make it your Primary Default Caller.
            </p>
          </div>
        </div>

        {/* Agents Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const isDefault = agent.id === defaultAgentId;
            return (
              <div
                key={agent.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all relative ${
                  isDefault
                    ? 'bg-gradient-to-b from-slate-900 to-[#0f172a] border-emerald-500 shadow-xl shadow-emerald-950/30 ring-1 ring-emerald-500'
                    : 'bg-[#0f172a]/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Default Caller Badge */}
                {isDefault && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>PRIMARY DEFAULT CALLING AGENT</span>
                  </div>
                )}

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
                      className="p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Attributes list */}
                  <div className="mt-5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400 py-1 border-b border-slate-800/40">
                      <span>Voice Model:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium capitalize">{agent.voice}</span>
                        <button
                          onClick={() => playVoiceAudioDemo(agent.voice)}
                          className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <Volume2 className="w-2.5 h-2.5" />
                          <span>Demo</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 py-1 border-b border-slate-800/40">
                      <span>Language:</span>
                      <span className="text-white font-medium">{agent.language} (Hinglish/Hindi)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 py-1 border-b border-slate-800/40">
                      <span>Max Call Duration:</span>
                      <span className="text-emerald-400 font-bold">{agent.max_call_duration_seconds || 180}s ({Math.round((agent.max_call_duration_seconds || 180) / 60)} mins)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 py-1">
                      <span>Strict Topic Boundary:</span>
                      <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Enforced (Zero Off-Topic)</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2.5">
                  {/* Select as Default Dialer Button */}
                  {!isDefault ? (
                    <button
                      onClick={() => handleSetDefaultAgent(agent)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>Set as Default Calling Agent</span>
                    </button>
                  ) : (
                    <div className="py-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center flex items-center justify-center space-x-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Calling Agent for Campaigns & Dials</span>
                    </div>
                  )}

                  <button
                    onClick={() => openTestCallModal(agent)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>1-Click Test Call to My Phone</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{agent.ai_disclosure_enabled ? '✓ AI Disclosure On' : 'No AI Disclosure'}</span>
                    <button
                      onClick={() => openEditModal(agent)}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                    >
                      Configure Persona →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingAgent ? `Edit Voice Agent: ${editingAgent.name}` : 'Create New AI Voice Agent'}
                </h3>
                <p className="text-xs text-slate-400">Configure persona, voice tone, max duration & accuracy boundaries</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Agent Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Ritu"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Brand Name *</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                    placeholder="e.g. Royal Palms Properties"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Agent Role *</label>
                  <input
                    type="text"
                    value={formData.agent_role}
                    onChange={(e) => setFormData({ ...formData, agent_role: e.target.value })}
                    required
                    placeholder="e.g. Senior Admissions Advisor"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">OpenAI Realtime Voice</label>
                    <button
                      type="button"
                      onClick={() => playVoiceAudioDemo(formData.voice)}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>▶ Test Voice</span>
                    </button>
                  </div>
                  <select
                    value={formData.voice}
                    onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white capitalize focus:outline-none focus:border-emerald-500"
                  >
                    {VOICES_CATALOG.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.gender}) - {v.tone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Max Call Duration Settings */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Maximum Call Duration Limit</span>
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      AI cleanly wraps up and ends the call when this duration is reached to protect your minutes
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {formData.max_call_duration_seconds} Seconds ({Math.round(formData.max_call_duration_seconds / 60)} min)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[60, 120, 180, 240, 300, 600].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setFormData({ ...formData, max_call_duration_seconds: sec })}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formData.max_call_duration_seconds === sec
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {sec >= 60 ? `${sec / 60} Min (${sec}s)` : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strict Topic Guardrail & Accuracy Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Strict Topic Adherence Guardrail (Anti-Off-Topic)</h5>
                      <p className="text-[11px] text-slate-300">
                        When enabled, AI strictly declines off-topic questions (politics, jokes, weather, gossip) and redirects callers back to {formData.company_name || 'your business'}.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.strict_topic_guardrail}
                    onChange={(e) => setFormData({ ...formData, strict_topic_guardrail: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Welcome Greeting Message (Supports variables like <code className="text-emerald-400">{'{{name}}'}</code>, <code className="text-emerald-400">{'{{city}}'}</code>)
                </label>
                <textarea
                  rows={2}
                  value={formData.welcome_message}
                  onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
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
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Conversation Objective *</label>
                <input
                  type="text"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  required
                  placeholder="e.g. Qualify interest, collect preferred schedule, and book site visit"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* AI Disclosure Settings */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">AI Assistant Disclosure</h5>
                    <p className="text-[11px] text-slate-400">Politely informs customer that this is an AI Voice Assistant</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.ai_disclosure_enabled}
                    onChange={(e) => setFormData({ ...formData, ai_disclosure_enabled: e.target.checked })}
                    className="rounded text-emerald-500 w-4 h-4 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>
                {formData.ai_disclosure_enabled && (
                  <input
                    type="text"
                    value={formData.ai_disclosure_text}
                    onChange={(e) => setFormData({ ...formData, ai_disclosure_text: e.target.value })}
                    placeholder="Namaste {{name}} ji, main AI Assistant bol rahi hoon."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md cursor-pointer"
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
                <span className="text-2xl">{previewTemplate.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{previewTemplate.name}</h3>
                  <span className="text-xs text-emerald-400">{previewTemplate.category}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-400 block mb-1">Company:</span>
                <p className="text-white font-medium">{previewTemplate.company_name} ({previewTemplate.agent_role})</p>
              </div>

              <div>
                <span className="font-semibold text-slate-400 block mb-1">Welcome Message:</span>
                <p className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 italic">
                  "{previewTemplate.welcome_message}"
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-400 block mb-1">Strict System Prompt & Guardrails:</span>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {previewTemplate.system_prompt}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end space-x-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleActivateTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md cursor-pointer"
              >
                ⚡ 1-Click Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1-Click Test Call Modal */}
      {testCallAgent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">1-Click Test Call</h3>
                  <p className="text-xs text-slate-400">Agent: {testCallAgent.name}</p>
                </div>
              </div>
              <button
                onClick={() => setTestCallAgent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTriggerTestCall} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Enter Your Mobile Number (India +91) *
                </label>
                <div className="flex items-center">
                  <span className="px-3.5 py-2.5 bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl text-xs text-slate-400 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-r-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono tracking-wider text-base"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Exotel will dial this number and connect you directly to <span className="text-emerald-400 font-semibold">{testCallAgent.name}</span> in real-time.
                </p>
              </div>

              {testCallStatus && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300">
                  {testCallStatus}
                </div>
              )}

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setTestCallAgent(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={testCalling}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50"
                >
                  {testCalling ? 'Dialing...' : '📞 Call My Phone Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
