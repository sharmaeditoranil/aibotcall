import React, { useState } from 'react';
import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';
import {
  PhoneCall,
  Bot,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  ArrowRight,
  Radio,
  Layers,
  Sparkles,
  Users,
  Clock,
  Send,
  Lock,
  ExternalLink,
  CreditCard,
  Building,
  Volume2,
  Check,
  Star,
  MessageSquare,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register', plan?: string) => void;
  onOpenPricing: () => void;
  onOpenPolicy?: (policy: 'terms' | 'privacy' | 'refund' | 'security' | 'data-privacy' | 'call-consent-policy') => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenBlog?: () => void;
  onOpenDocs?: () => void;
  onNavigateSeoPage?: (slug: string) => void;
  onNavigateAffiliate?: () => void;
  onNavigateWhoItsFor?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenPricing,
  onOpenPolicy,
  onOpenAbout,
  onOpenContact,
  onOpenBlog,
  onOpenDocs,
  onNavigateSeoPage,
  onNavigateAffiliate,
  onNavigateWhoItsFor,
}) => {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Play audio sample demo in browser
  const togglePlayAudio = () => {
    if (typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) {
      setIsPlayingDemo(!isPlayingDemo);
      return;
    }

    if (isPlayingDemo) {
      window.speechSynthesis.cancel();
      setIsPlayingDemo(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "Namaste ji! Main AiBotCall se bol rahi hoon. Aapne hamari website par AI Voice Calling Software ke liye enquiry submit ki thi. Kya main aapko batane ke liye 1 minute le sakti hoon ki kaise hamara AI agent aapke naye leads ko 5 second me call karke qualify kar sakta hai?"
      );
      utterance.pitch = 1.05;
      utterance.rate = 0.98;

      const voices = window.speechSynthesis.getVoices();
      const hiVoice = voices.find(
        (v) => v.lang.includes('hi') || v.lang.includes('IN') || v.lang.includes('en-IN')
      );
      if (hiVoice) utterance.voice = hiVoice;

      utterance.onend = () => setIsPlayingDemo(false);
      utterance.onerror = () => setIsPlayingDemo(false);

      setIsPlayingDemo(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const workflowSteps = [
    { num: '01', title: 'Lead Generated', desc: 'Customer fills an enquiry form on your Website, Facebook Ad, or Portal.', icon: Users },
    { num: '02', title: 'Webhook Trigger', desc: 'Your form or CRM dispatches a webhook to AiBotCall in milliseconds.', icon: Zap },
    { num: '03', title: 'AI Dials in 5 Seconds', desc: 'AiBotCall initiates an outbound carrier phone call to the customer instantly.', icon: PhoneCall },
    { num: '04', title: 'Human AI Conversation', desc: 'AI speaks in fluent Hindi/English, answers questions & overcomes objections.', icon: Bot },
    { num: '05', title: 'Lead Qualified', desc: 'AI tags lead status (Hot, Warm, Cold), books meetings, or confirms appointments.', icon: CheckCircle2 },
    { num: '06', title: 'CRM & WhatsApp Sync', desc: 'Call recording, transcript & summary sync to CRM and trigger WhatsApp via AiBotFlow.', icon: Send },
  ];

  const capabilities = [
    {
      icon: PhoneCall,
      title: 'Inbound AI Receptionist',
      slug: 'inbound-ai-call-agent',
      desc: 'Answers customer calls 24/7 on the first ring. Answers questions from your knowledge base, takes messages, and eliminates wait times.',
    },
    {
      icon: Zap,
      title: 'Outbound AI Calling',
      slug: 'outbound-ai-calling',
      desc: 'Autonomous phone outreach for sales qualification, lead re-engagement, event confirmations, and customer follow-up.',
    },
    {
      icon: Radio,
      title: 'AI Call Broadcast (Bulk)',
      slug: 'ai-call-broadcast',
      desc: 'Launch thousands of concurrent two-way voice calls simultaneously with CSV contact imports, variable tags, and retry logic.',
    },
    {
      icon: Bot,
      title: '5-Second Website Lead Calling',
      slug: 'website-lead-calling',
      desc: 'Automatically ring prospect phones within 5 seconds of form submission while their purchase intent is at its highest.',
    },
    {
      icon: MessageSquare,
      title: 'AiBotFlow WhatsApp CRM Sync',
      slug: 'integrations',
      desc: 'Seamlessly connected with sister platform AiBotFlow to send PDF brochures, location pins, and payment links after every voice call.',
    },
    {
      icon: Volume2,
      title: 'Natural Hindi, Hinglish & English',
      slug: 'ai-voice-agent-india',
      desc: 'Speaks with genuine Indian conversational cadence, respectful honorifics, and real-time interruption (barge-in) support.',
    },
  ];

  const geoFaqs = [
    {
      q: 'What is AiBotCall and how does it work?',
      a: 'AiBotCall is an enterprise AI Voice Calling Software in India that autonomously dials and receives phone calls using conversational speech-to-speech AI. Operating with sub-500ms latency on Indian telecom networks via Exotel, it enables businesses to call website leads in under 5 seconds, qualify prospective buyers, and sync call recordings to their CRM.'
    },
    {
      q: 'Can an AI voice agent automatically call a website lead?',
      a: 'Yes. When a prospect submits an enquiry form on WordPress, Webflow, Shopify, or Facebook Ads, a webhook triggers AiBotCall in milliseconds. The AI agent places an outbound carrier phone call in under 5 seconds, addresses the customer by name, clarifies their requirements, and books an appointment.'
    },
    {
      q: 'Can AiBotCall make outbound calls and receive inbound calls?',
      a: 'Yes. AiBotCall operates as both an Outbound AI Calling system (for speed-to-lead follow-up, cold qualification, and mass broadcast campaigns) and an Inbound AI Call Agent (answering 24/7 on virtual mobile, landline, or toll-free numbers with zero hold time).'
    },
    {
      q: 'Can call results and recordings be sent to a CRM?',
      a: 'Yes. At the conclusion of every conversation, AiBotCall dispatches an HMAC SHA-256 authenticated webhook containing complete audio recording URLs, turn-by-turn transcripts, sentiment analysis, and lead qualification tags to your CRM (HubSpot, Salesforce, Zoho, LeadSquared, or Google Sheets).'
    },
    {
      q: 'Can it integrate with AiBotFlow WhatsApp CRM?',
      a: 'Yes. AiBotCall and AiBotFlow are tightly integrated platforms. While AiBotCall conducts the live phone conversation, sister platform AiBotFlow triggers official WhatsApp Business API messaging to deliver catalogs, site visit pins, or payment links to the customer immediately.'
    },
    {
      q: 'What is the difference between an AI Voice Agent and traditional IVR?',
      a: 'Traditional IVR forces callers through rigid numeric keypad trees ("press 1 for sales, press 2 for accounts") and cannot understand spoken intent. An AI Voice Agent speaks and listens naturally: callers talk conversationally, interrupt freely, ask questions, and receive intelligent answers without pressing keys.'
    },
    {
      q: 'How does AI voice calling help sales teams?',
      a: 'AiBotCall eliminates manual cold calling fatigue. The AI agent dials leads, filters out invalid numbers, conducts initial BANT qualification (Budget, Authority, Need, Timeline), and schedules meetings on sales reps calendars, allowing human closers to focus exclusively on closing ready buyers.'
    },
    {
      q: 'What happens if my monthly subscription call minutes finish?',
      a: 'Your calls never stop or drop! AiBotCall features an automated Pay-As-You-Go fallback system. If your monthly bundled minutes are exhausted, calls automatically continue using your Pay-As-You-Go wallet balance at our flat rate of ₹4.87/minute with zero interruption to your campaigns or webhook lead calls.'
    },
  ];

  const pricingTiers = [
    {
      id: 'FREE_TRIAL',
      name: 'Free Trial',
      price: '₹0',
      period: 'instant start',
      minutes: '30 Voice Minutes Included',
      desc: 'Perfect for evaluating real speech quality on your mobile phone in 60 seconds.',
      features: [
        '30 Free Calling Minutes',
        '1 AI Voice Agent',
        '2 Concurrent Lines',
        'Full Website Lead Webhook',
        'Full Transcripts & AI Summaries',
      ],
      buttonText: 'Claim 30 Free Minutes',
      popular: false,
    },
    {
      id: 'STARTER',
      name: 'Starter',
      price: '₹999',
      period: '/month',
      minutes: '200 Minutes Included',
      desc: 'Ideal for local coaching academies, clinics, and solo consultants.',
      features: [
        '200 Voice Minutes Included',
        '⚡ Auto Pay-As-You-Go fallback (₹4.87/min)',
        '3 AI Voice Agents',
        '5 Concurrent Lines',
        'CRM Outgoing Webhook Sync',
        'Basic Voice Broadcast',
        'DNC Suppression Registry',
      ],
      buttonText: 'Get Started (₹999/mo)',
      popular: false,
    },
    {
      id: 'GROWTH',
      name: 'Growth',
      price: '₹2,499',
      period: '/month',
      minutes: '600 Minutes Included',
      desc: 'For high-growth institutions, real estate brokers, and active sales outreach.',
      features: [
        '600 Voice Minutes Included',
        '⚡ Continuous Calling: Zero-drop Pay As You Go fallback (₹4.87/min)',
        '10 AI Voice Agents',
        '10 Concurrent Lines',
        'Unlimited Broadcast Campaigns',
        'CSV Field Variable Personalization',
        'Multi-User Team Workspace',
        'Priority Exotel Telecom Trunk',
      ],
      buttonText: 'Start Growth (₹2,499/mo)',
      popular: true,
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise Scale',
      price: '₹5,999',
      period: '/month',
      minutes: '1,500 Minutes Included',
      desc: 'High-volume call centers and multi-branch educational academies.',
      features: [
        '1,500 Voice Minutes Included',
        '⚡ Seamless Pay-As-You-Go overdraft protection (₹4.87/min)',
        'Unlimited AI Agents',
        '30 Concurrent Lines',
        'Dedicated Virtual Caller IDs (ExoPhones)',
        'Custom Telecom Trunks',
        'Dedicated Account Engineer',
        'Custom LLM Fine-Tuning',
      ],
      buttonText: 'Get Enterprise (₹5,999/mo)',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Unified Public Navigation Bar with Clean Dropdowns */}
      <PublicHeader
        activePage="home"
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateAbout={() => (onOpenAbout ? onOpenAbout() : onOpenPolicy?.('about' as any))}
        onNavigateBlog={() => (onOpenBlog ? onOpenBlog() : onOpenPolicy?.('blog' as any))}
        onNavigateDocs={onOpenDocs}
        onNavigatePricing={onOpenPricing}
        onNavigateContact={() => (onOpenContact ? onOpenContact() : onOpenPolicy?.('contact' as any))}
        onNavigateLogin={() => onOpenAuth('login')}
        onNavigateRegister={() => onOpenAuth('register')}
        onNavigateSeoPage={onNavigateSeoPage}
        onNavigateAffiliate={onNavigateAffiliate}
        onNavigateWhoItsFor={onNavigateWhoItsFor}
      />

      {/* Hero Section with Official Single H1 and Above-The-Fold Value Concept */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Luminous Aurora Mesh Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[950px] h-[520px] bg-gradient-to-tr from-violet-600/30 via-blue-600/25 to-cyan-400/25 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#162340]/90 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide shadow-lg shadow-cyan-500/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span>AI Voice Calling Software in India</span>
            <span className="text-slate-600">|</span>
            <span className="text-violet-300 text-[11px] font-semibold">⚡ Sub-500ms Indian Telephony</span>
          </div>

          {/* Primary H1 */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.12]">
            AI Voice Agent for <br />
            <span className="text-gradient-brand">
              Inbound & Outbound Calls
            </span>
          </h1>

          {/* User's Exact Value Concept */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-200 leading-relaxed font-medium bg-[#131d35]/60 border border-slate-700/60 p-4 rounded-2xl shadow-md">
            Website enquiry आते ही AI automatically customer को call करे, conversation करे, lead qualify करे और result आपके CRM या WhatsApp system में send करे.
          </p>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed">
            Deploy conversational AI Voice Agents in India with native Hindi, English, and Hinglish speech. Connect with leads in under 5 seconds with per-second billing at flat ₹4.87/minute.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-brand hover:brightness-110 text-white font-bold text-sm shadow-xl glow-brand-sm transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Start Free Trial (30 Free Mins)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#162340]/80 hover:bg-[#1a2b50] text-slate-200 border border-slate-700/80 text-sm font-semibold transition-colors cursor-pointer"
            >
              Live Admin Demo
            </button>
          </div>

          {/* Interactive Audio Preview Widget */}
          <div className="mt-8 max-w-xl mx-auto p-4 rounded-2xl bg-[#131d35]/90 border border-cyan-500/30 glass-card shadow-2xl shadow-indigo-950/40 flex items-center justify-between hover:border-cyan-400/60 transition-all">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlayAudio}
                className="w-12 h-12 rounded-full bg-gradient-brand text-white flex items-center justify-center shadow-lg glow-brand-sm hover:scale-105 transition-transform cursor-pointer"
                aria-label="Play audio demo"
              >
                {isPlayingDemo ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Agent Ritu (Admissions & Sales Counselor)</p>
                <p className="text-[11px] text-cyan-400">Click to listen: Natural Hindi/Hinglish Voice Sample</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 h-8 px-4">
              {[14, 28, 18, 32, 22, 12, 26, 30, 16, 20, 24, 18].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-full bg-gradient-to-t from-violet-500 to-cyan-400 ${isPlayingDemo ? 'animate-pulse' : ''}`}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            <span className="text-[11px] font-mono text-cyan-300 font-semibold">{isPlayingDemo ? 'Playing...' : '0:14'}</span>
          </div>
        </div>

        {/* Hero Visual Dashboard Showcase */}
        <div className="mt-14 max-w-6xl mx-auto relative">
          <div className="rounded-3xl border border-indigo-500/40 shadow-2xl shadow-indigo-950/60 overflow-hidden bg-slate-900 group relative shimmer-card">
            <div className="absolute top-4 left-6 z-20 flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-slate-400">voice.aibotflow.in — AI Voice Calling Engine</span>
            </div>
            <img
              src="/assets/dashboard_mockup.jpg"
              alt="AiBotCall AI Voice Calling Dashboard Interface"
              className="w-full object-cover rounded-3xl opacity-95 group-hover:opacity-100 transition-opacity pt-6"
            />
          </div>
        </div>
      </section>

      {/* Visual Product Workflow Diagram: Important Product Differentiator */}
      <section className="py-16 px-6 border-t border-slate-800/80 bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#0b1120]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Speed-to-Lead Automation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              The 6-Step Voice AI Automation Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              See how new leads convert automatically from enquiry to CRM without manual dialing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflowSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#131d35]/70 border border-slate-700/60 relative group hover:border-cyan-500/50 transition-all space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-cyan-400/40 group-hover:text-cyan-400 transition-colors font-mono">
                      {step.num}
                    </span>
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
                      <StepIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core AI Voice Capabilities Grid with Direct SEO Landing Page Links */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-[#0d1527]/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Complete AI Calling Platform for Indian Businesses
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Enterprise telecom infrastructure, sub-500ms latency, and seamless CRM integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="p-7 rounded-3xl bg-[#131d35]/80 border border-slate-700/60 glass-card glass-card-hover flex flex-col justify-between space-y-4 shadow-lg group"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{c.desc}</p>
                  </div>

                  <button
                    onClick={() => onNavigateSeoPage?.(c.slug)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 pt-2 cursor-pointer"
                  >
                    <span>Learn more about {c.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Omnichannel Architecture Synergy (AiBotCall + AiBotFlow) */}
      <section className="py-14 px-6 border-t border-slate-800/80 bg-gradient-to-r from-violet-950/40 via-[#0e172a] to-cyan-950/40">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 border border-cyan-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
              The Power of Two
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Combine AI Voice Calling with WhatsApp CRM
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              <strong className="text-cyan-300">AiBotCall</strong> handles the live voice phone calls and speech qualification. Sister platform{' '}
              <a
                href="https://aibotflow.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-300 hover:text-white underline font-semibold"
              >
                AiBotFlow
              </a>{' '}
              manages official Meta WhatsApp Business API automation, broadcast campaigns, and visual Kanban CRM pipelines.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://aibotflow.in"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore AiBotFlow WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => onOpenAuth('register')}
              className="py-3 px-6 rounded-xl bg-gradient-brand hover:brightness-110 text-white text-xs font-bold shadow-md glow-brand-sm transition-all"
            >
              Start Free Voice Trial
            </button>
          </div>
        </div>
      </section>

      {/* Leadership & Vision: Meet Founder Anil Sharma */}
      <section className="py-16 px-6 border-t border-slate-800/80 bg-gradient-to-b from-[#0b1120] via-[#10192e] to-[#0b1120]">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-10 bg-[#131d35]/80 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-4 text-center md:text-left space-y-3">
              <div className="w-28 h-28 mx-auto md:mx-0 rounded-2xl bg-gradient-to-tr from-violet-600 via-blue-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/20 overflow-hidden">
                <img
                  src="/assets/anil_sharma.jpg"
                  alt="Anil Sharma - Founder"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Anil Sharma</h3>
                <p className="text-xs font-semibold text-gradient-brand">Founder & Creative Technologist</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Founder, Quick Art Photography Academy</p>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Leadership & Vision</span>
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Creative Industry Se Lekar <span className="text-gradient-brand">Smart Business Automation</span> Tak
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                10+ saal ke creative filmmaking aur educational workflow experience ke saath, Anil Sharma ka maksad har business ke liye customer communication ko aasaan banana hai. Unka anubhav batata hai ki ek website lead ko pehle 5 minute ke andar personalized voice response milne par conversion <strong>4 guna tak badh jata hai</strong>.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => (onOpenAbout ? onOpenAbout() : onOpenPolicy?.('about' as any))}
                  className="py-2.5 px-4 rounded-xl bg-gradient-brand hover:brightness-110 text-white text-xs font-bold transition-all shadow-md glow-brand-sm cursor-pointer flex items-center space-x-2"
                >
                  <span>Read Full About Us</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => (onOpenBlog ? onOpenBlog() : onOpenPolicy?.('blog' as any))}
                  className="py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Read Founder's Telephony Playbook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section className="py-20 px-6 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Simple, Affordable SaaS Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              Start with 30 free trial calling minutes. Flat ₹4.87 per minute calling with zero hidden telecom markups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-b from-cyan-950/30 via-[#162340] to-[#111a30] border-cyan-400/50 shadow-xl shadow-cyan-950/20'
                    : 'bg-[#131d35]/80 border-slate-700/60 shadow-md'
                }`}
              >
                <div>
                  {tier.popular && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 inline-block mb-3">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  <div className="flex items-baseline space-x-1 mt-2">
                    <span className="text-3xl font-black text-white">{tier.price}</span>
                    <span className="text-xs text-slate-400">{tier.period}</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">{tier.minutes}</p>
                  <p className="text-[11px] text-slate-400 mt-2">{tier.desc}</p>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onOpenAuth('register', tier.id)}
                  className={`mt-8 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tier.popular
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GEO & AI Search Answer Engine Optimization Blocks */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-[#0e1628]/60">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Search & Knowledge Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Frequently Asked Questions & Technical Overview
            </h2>
            <p className="text-xs text-slate-400">
              Direct, factual answers about AiBotCall capabilities, compliance, and integration.
            </p>
          </div>

          <div className="space-y-3">
            {geoFaqs.map((faq, i) => {
              const isOpen = expandedFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-[#131d35]/90 border border-slate-700/60 overflow-hidden transition-all shadow-md"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center space-x-2.5">
                      <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Unified Public Footer with 5-Column SEO Links */}
      <PublicFooter
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateAbout={() => (onOpenAbout ? onOpenAbout() : onOpenPolicy?.('about' as any))}
        onNavigateBlog={() => (onOpenBlog ? onOpenBlog() : onOpenPolicy?.('blog' as any))}
        onNavigateDocs={onOpenDocs}
        onNavigatePricing={onOpenPricing}
        onNavigateContact={() => (onOpenContact ? onOpenContact() : onOpenPolicy?.('contact' as any))}
        onNavigateLogin={() => onOpenAuth('login')}
        onNavigateRegister={() => onOpenAuth('register')}
        onNavigatePolicy={(policy) => onOpenPolicy?.(policy)}
        onNavigateSeoPage={onNavigateSeoPage}
        onNavigateAffiliate={onNavigateAffiliate}
        onNavigateWhoItsFor={onNavigateWhoItsFor}
      />
    </div>
  );
};
