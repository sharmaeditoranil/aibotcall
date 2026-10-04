import React, { useState } from 'react';
import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';
import {
  BookOpen,
  Search,
  Code2,
  Copy,
  Check,
  Zap,
  Bot,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Plug,
  Terminal,
  ExternalLink,
  ChevronRight,
  Radio,
  Clock,
  Layers,
  FileCode,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface DocsPageProps {
  onBackToHome: () => void;
  onGoToAbout: () => void;
  onGoToBlog: () => void;
  onGoToPricing: () => void;
  onGoToContact: () => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onGoToDocs?: () => void;
  onNavigateDocs?: () => void;
  onNavigatePolicy: (policy: 'terms' | 'privacy' | 'refund') => void;
}

export const DocsPage: React.FC<DocsPageProps> = ({
  onBackToHome,
  onGoToAbout,
  onGoToBlog,
  onGoToPricing,
  onGoToContact,
  onGoToLogin,
  onGoToRegister,
  onGoToDocs,
  onNavigateDocs,
  onNavigatePolicy,
}) => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'python' | 'node' | 'php'>('curl');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const navCategories = [
    {
      title: 'Platform Architecture',
      items: [
        { id: 'getting-started', label: '1. Getting Started & Architecture', icon: Sparkles },
        { id: 'first-call', label: '2. Your First Call in 60 Sec', icon: Zap },
      ],
    },
    {
      title: 'AI Agent Configuration',
      items: [
        { id: 'agent-prompts', label: '3. Agent Persona & Prompts', icon: Bot },
        { id: 'knowledge-base', label: '4. Zero-Code Knowledge Base', icon: BookOpen },
        { id: 'speech-tuning', label: '5. Latency & Voice Settings', icon: Radio },
      ],
    },
    {
      title: 'Telephony & Campaigns',
      items: [
        { id: 'instant-callbacks', label: '6. 5-Sec Lead Auto-Dialing', icon: PhoneCall },
        { id: 'bulk-broadcast', label: '7. Bulk Voice Broadcasts', icon: Layers },
        { id: 'exotel-carrier', label: '8. Exotel DID & PRI Trunks', icon: Radio },
      ],
    },
    {
      title: 'Integrations & Webhooks',
      items: [
        { id: 'webhooks-lifecycle', label: '9. Webhook Architecture & Sync', icon: Plug },
        { id: 'whatsapp-crm', label: '10. WhatsApp CRM Dispatches', icon: Terminal },
        { id: 'hmac-security', label: '11. HMAC SHA-256 Signatures', icon: Lock },
      ],
    },
    {
      title: 'TRAI & Compliance',
      items: [
        { id: 'trai-compliance', label: '12. TRAI, TCCCPR & DNC Rules', icon: ShieldCheck },
      ],
    },
    {
      title: 'Developer REST API',
      items: [
        { id: 'api-reference', label: '13. REST API Reference', icon: Code2 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Unified Public Header */}
      <PublicHeader
        activePage="docs"
        onNavigateHome={onBackToHome}
        onNavigateAbout={onGoToAbout}
        onNavigateBlog={onGoToBlog}
        onNavigateDocs={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigatePricing={onGoToPricing}
        onNavigateContact={onGoToContact}
        onNavigateLogin={onGoToLogin}
        onNavigateRegister={onGoToRegister}
      />

      {/* Docs Header Banner */}
      <section className="relative border-b border-slate-800/80 bg-gradient-to-b from-[#0e1628] via-[#0f172a] to-[#0b1120] py-14 px-6 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#162340]/90 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Developer & Platform Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              AiBotCall <span className="text-gradient-brand">Documentation Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Step-by-step guides, telephony architecture, dynamic knowledge bases, webhooks, and REST APIs to deploy conversational AI voice calls.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides, endpoints, TRAI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131d35]/90 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/70 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Main Documentation Body (Sidebar + Content) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Navigation Menu */}
          <aside className="lg:col-span-3 sticky top-24 space-y-6 bg-[#0f172a]/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            <div className="space-y-4">
              {navCategories.map((cat, i) => (
                <div key={i} className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    {cat.title}
                  </p>
                  <div className="space-y-0.5">
                    {cat.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection(item.id);
                            const el = document.getElementById(item.id);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                            isActive
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Support Concierge Box */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <p className="text-[11px] text-slate-400">Need custom integration assistance?</p>
              <button
                onClick={onGoToContact}
                className="w-full py-2 px-3 rounded-xl bg-[#162340] hover:bg-[#1c2c50] text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>WhatsApp Solutions Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>

          {/* Right Main Content Guide Area */}
          <main className="lg:col-span-9 space-y-14">
            {/* Section 1: Architecture & Getting Started */}
            <section id="getting-started" className="space-y-6 scroll-mt-28">
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Platform Overview</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">1. Platform Architecture & Data Flow</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  How AiBotCall connects webhooks, OpenAI Realtime speech-to-speech models, and licensed carrier telephony with sub-500ms response latency.
                </p>
              </div>

              {/* Technical Architecture Graphic */}
              <div className="p-1 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 shadow-2xl glow-brand-lg overflow-hidden">
                <div className="bg-[#090d18] rounded-[22px] overflow-hidden p-2">
                  <img
                    src="/assets/docs_architecture_flow.jpg"
                    alt="AI Voice Calling Technical Architecture Data Flow Diagram"
                    className="w-full h-auto object-cover rounded-2xl shadow-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#131d35]/85 border border-slate-700/60 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>5-Second Callback</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Website form fills trigger an encrypted webhook payload, dispatching an immediate outbound call while customer intent is 100%.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#131d35]/85 border border-slate-700/60 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Bot className="w-4 h-4 text-violet-400" />
                    <span>Realtime Speech Model</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    OpenAI Realtime model handles direct speech-to-speech without robotic STT-TTS latency, supporting natural Indian Hindi & Hinglish.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#131d35]/85 border border-slate-700/60 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Radio className="w-4 h-4 text-blue-400" />
                    <span>Exotel Carrier DID</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Calls are carried over high-availability Exotel SIP/PRI carrier trunks, displaying your verified 140-series business virtual caller ID.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: First Call in 60 Sec */}
            <section id="first-call" className="space-y-6 scroll-mt-28">
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Quickstart Tutorial</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">2. Testing Your First AI Voice Call in 60 Seconds</h2>
                <p className="text-xs text-slate-300">
                  Follow these 3 simple steps to place an automated test call directly to your own mobile phone.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="p-5 rounded-2xl bg-[#131d35]/80 border border-slate-700/60 space-y-2">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center font-bold text-xs">1</span>
                    <span>Create Free Account & Claim 30 Minutes</span>
                  </h3>
                  <p>
                    Register at <button onClick={onGoToRegister} className="text-cyan-400 underline font-semibold">Sign Up Page</button>. Your account is automatically credited with <b>30 Free Voice Minutes</b> and 2 concurrent lines out of the box.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#131d35]/80 border border-slate-700/60 space-y-2">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">2</span>
                    <span>Configure or Pick Default Agent (Agent Ritu)</span>
                  </h3>
                  <p>
                    Navigate to <b>AI Voice Agents</b> in your dashboard. You will see pre-configured <b>Agent Ritu (Admissions Counselor)</b>. You can customize the greeting message, course fees, and language preference in under 30 seconds.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#131d35]/80 border border-slate-700/60 space-y-2">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">3</span>
                    <span>Trigger Fast Test Call from Dashboard</span>
                  </h3>
                  <p>
                    Click the <b>"Quick Outbound Call"</b> button at the top right of your dashboard, enter your 10-digit mobile number, and pick Agent Ritu. Within 5 seconds, your phone will ring and the AI will greet you in warm conversational Hindi!
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Agent Prompts & Engineering */}
            <section id="agent-prompts" className="space-y-6 scroll-mt-28">
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Conversational AI</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">3. Agent Persona & System Prompt Engineering</h2>
                <p className="text-xs text-slate-300">
                  Best practices for structuring system prompts so the AI speaks with natural Indian warmth, empathy, and strict domain adherence.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Recommended Production Prompt Template:</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `You are Ritu, a warm, polite and highly knowledgeable admissions counselor at Quick Art Photography Academy.
1. Language: Speak primarily in conversational Hindi with natural everyday English words (Hinglish). Use terms like "fees", "admission", "batch", "weekend classes", "certification".
2. Tone: Warm, energetic, helpful, and respectful. Use polite honorifics ("ji").
3. Objection Handling: If the student asks about discounts, explain the 10% early-bird waiver for upfront payment.
4. Call Goal: Qualify whether the student wants Online Weekend or Offline Classroom batch, answer course fee questions, and confirm a callback slot.`,
                        'prompt-template'
                      )
                    }
                    className="flex items-center space-x-1 text-cyan-300 hover:text-white cursor-pointer font-semibold"
                  >
                    {copiedCodeId === 'prompt-template' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeId === 'prompt-template' ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-[#090d18] border border-slate-700/80 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
{`You are Ritu, a warm, polite and highly knowledgeable admissions counselor at Quick Art Photography Academy.

1. Language: Speak primarily in conversational Hindi with natural everyday English words (Hinglish). Use terms like "fees", "admission", "batch", "weekend classes", "certification".
2. Tone: Warm, energetic, helpful, and respectful. Use polite honorifics ("ji").
3. Anti-Hallucination: ONLY answer course fee, duration, and syllabus details from your verified Knowledge Base. If asked about an unlisted course, say: "Abhi hum sirf professional video editing aur cinematography courses provide karte hain."
4. Call Goal: Qualify whether the student wants Online Weekend or Offline Classroom batch, answer course fee questions, and confirm their booking slot.`}
                </pre>
              </div>
            </section>

            {/* Section 4: Webhook & CRM Architecture */}
            <section id="webhooks-lifecycle" className="space-y-6 scroll-mt-28">
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Automation & Workflows</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">4. Webhook Lifecycle & CRM Synchronization</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  How call recordings, turn-by-turn transcripts, sentiment analytics, and lead qualification statuses are pushed to your WhatsApp CRM and databases.
                </p>
              </div>

              {/* Webhook CRM Flow Graphic */}
              <div className="p-1 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 shadow-2xl glow-brand-lg overflow-hidden">
                <div className="bg-[#090d18] rounded-[22px] overflow-hidden p-2">
                  <img
                    src="/assets/docs_webhook_crm_flow.jpg"
                    alt="AI Voice Call CRM Sync and Webhook Integration Workflow"
                    className="w-full h-auto object-cover rounded-2xl shadow-xl"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#131d35]/80 border border-slate-700/60 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Outbound Webhook Event Schema (`call.completed`)</span>
                </h4>
                <p className="text-xs text-slate-300">
                  When a call terminates, your configured Webhook URL receives an HTTP POST request signed with HMAC SHA-256 in the <code className="text-cyan-300">X-AiBotCall-Signature</code> header.
                </p>

                <pre className="p-4 rounded-xl bg-[#090d18] border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
{`{
  "event": "call.completed",
  "call_id": "call_98412847192",
  "phone": "+919876543210",
  "duration_seconds": 142,
  "status": "COMPLETED",
  "disposition": "QUALIFIED_HOT_LEAD",
  "recording_url": "https://storage.aibotflow.in/recordings/call_98412847192.mp3",
  "ai_summary": "Lead enquired about 3-Month Advanced Video Editing batch. Confirmed budget and requested syllabus via WhatsApp.",
  "transcript": [
    { "role": "assistant", "text": "Namaste Rohit ji! Quick Art Academy se baat kar rahi hoon." },
    { "role": "user", "text": "Haan ji mujhe video editing course ki fees jaanni thi." }
  ],
  "timestamp": 1728038400
}`}
                </pre>
              </div>
            </section>

            {/* Section 5: Regulatory TRAI Compliance */}
            <section id="trai-compliance" className="space-y-6 scroll-mt-28">
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Telecom Governance</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">5. TRAI & TCCCPR Regulatory Compliance</h2>
                <p className="text-xs text-slate-300">
                  Critical Indian telecommunication rules for outbound calling, commercial communications, and automated DNC suppression.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-5 rounded-2xl bg-[#131d35]/85 border border-slate-700/60 space-y-2">
                  <h4 className="font-bold text-white flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Statutory Calling Windows</span>
                  </h4>
                  <p>
                    Under TRAI TCCCPR rules, commercial promotional calling is strictly restricted to between <b>9:00 AM and 9:00 PM local time</b>. AiBotCall includes automatic scheduling guards that hold campaigns outside this permissible window.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#131d35]/85 border border-slate-700/60 space-y-2">
                  <h4 className="font-bold text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-violet-400" />
                    <span>Automated DNC Scrubbing</span>
                  </h4>
                  <p>
                    Every phone number in a broadcast list is automatically scrubbed against your account's suppression list and national DND registers. Numbers that request opt-out are permanently suppressed across all future campaigns.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: REST API Reference */}
            <section id="api-reference" className="space-y-6 scroll-mt-28">
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Developer Reference</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">6. Developer REST API Reference</h2>
                <p className="text-xs text-slate-300">
                  Trigger calls programmatically from your Node.js, Python, or PHP backend.
                </p>
              </div>

              {/* Language Switcher Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 p-1 rounded-xl bg-[#131d35] border border-slate-700">
                  {(['curl', 'python', 'node', 'php'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                        selectedLanguage === lang
                          ? 'bg-gradient-brand text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const code =
                      selectedLanguage === 'curl'
                        ? `curl -X POST https://voice.aibotflow.in/api/v1/calls/dispatch \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "+919876543210",
    "agent_id": "agent_admissions_ritu",
    "first_name": "Aarav Sharma",
    "variables": { "course": "Video Editing", "source": "Landing Page Form" }
  }'`
                        : selectedLanguage === 'python'
                        ? `import requests

url = "https://voice.aibotflow.in/api/v1/calls/dispatch"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "phone": "+919876543210",
    "agent_id": "agent_admissions_ritu",
    "first_name": "Aarav Sharma",
    "variables": {"course": "Video Editing"}
}
response = requests.post(url, json=payload, headers=headers)
print(response.json())`
                        : selectedLanguage === 'node'
                        ? `const axios = require('axios');

async function triggerAiCall() {
  const res = await axios.post('https://voice.aibotflow.in/api/v1/calls/dispatch', {
    phone: '+919876543210',
    agent_id: 'agent_admissions_ritu',
    first_name: 'Aarav Sharma',
    variables: { course: 'Video Editing' }
  }, {
    headers: { Authorization: 'Bearer YOUR_API_KEY' }
  });
  console.log(res.data);
}
triggerAiCall();`
                        : `<?php
$ch = curl_init('https://voice.aibotflow.in/api/v1/calls/dispatch');
$payload = json_encode([
    'phone' => '+919876543210',
    'agent_id' => 'agent_admissions_ritu',
    'first_name' => 'Aarav Sharma',
    'variables' => ['course' => 'Video Editing']
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;
                    copyToClipboard(code, 'api-code');
                  }}
                  className="flex items-center space-x-1.5 text-xs text-cyan-300 hover:text-white font-semibold cursor-pointer"
                >
                  {copiedCodeId === 'api-code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCodeId === 'api-code' ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code Display Area */}
              <div className="rounded-2xl bg-[#090d18] border border-slate-700/80 p-5 overflow-x-auto shadow-xl">
                {selectedLanguage === 'curl' && (
                  <pre className="font-mono text-xs text-cyan-300 leading-relaxed">
{`curl -X POST https://voice.aibotflow.in/api/v1/calls/dispatch \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "+919876543210",
    "agent_id": "agent_admissions_ritu",
    "first_name": "Aarav Sharma",
    "variables": {
      "course": "Video Editing Masterclass",
      "source": "Website Lead Form"
    }
  }'`}
                  </pre>
                )}

                {selectedLanguage === 'python' && (
                  <pre className="font-mono text-xs text-violet-300 leading-relaxed">
{`import requests

url = "https://voice.aibotflow.in/api/v1/calls/dispatch"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "phone": "+919876543210",
    "agent_id": "agent_admissions_ritu",
    "first_name": "Aarav Sharma",
    "variables": {
        "course": "Video Editing Masterclass",
        "source": "Website Lead Form"
    }
}

response = requests.post(url, json=payload, headers=headers)
print("Call Dispatch ID:", response.json().get("call_id"))`}
                  </pre>
                )}

                {selectedLanguage === 'node' && (
                  <pre className="font-mono text-xs text-emerald-300 leading-relaxed">
{`const axios = require('axios');

async function triggerAiCall() {
  try {
    const res = await axios.post('https://voice.aibotflow.in/api/v1/calls/dispatch', {
      phone: '+919876543210',
      agent_id: 'agent_admissions_ritu',
      first_name: 'Aarav Sharma',
      variables: {
        course: 'Video Editing Masterclass'
      }
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });

    console.log('Call Initiated:', res.data.call_id);
  } catch (err) {
    console.error('Dispatch error:', err.response?.data);
  }
}

triggerAiCall();`}
                  </pre>
                )}

                {selectedLanguage === 'php' && (
                  <pre className="font-mono text-xs text-sky-300 leading-relaxed">
{`<?php
$ch = curl_init('https://voice.aibotflow.in/api/v1/calls/dispatch');

$payload = json_encode([
    'phone' => '+919876543210',
    'agent_id' => 'agent_admissions_ritu',
    'first_name' => 'Aarav Sharma',
    'variables' => ['course' => 'Video Editing Masterclass']
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
echo "Call ID: " . $result['call_id'];
?>`}
                  </pre>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Unified Public Footer */}
      <PublicFooter
        onNavigateHome={onBackToHome}
        onNavigateAbout={onGoToAbout}
        onNavigateBlog={onGoToBlog}
        onNavigateDocs={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigatePricing={onGoToPricing}
        onNavigateContact={onGoToContact}
        onNavigateLogin={onGoToLogin}
        onNavigateRegister={onGoToRegister}
        onNavigatePolicy={onNavigatePolicy}
      />
    </div>
  );
};
