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
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register', plan?: string) => void;
  onOpenPricing: () => void;
  onOpenPolicy?: (policy: 'terms' | 'privacy' | 'refund' | 'contact' | 'about' | 'blog') => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenBlog?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenPricing,
  onOpenPolicy,
  onOpenAbout,
  onOpenContact,
  onOpenBlog,
}) => {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

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
        "Namaste Aarav ji! Main Skills Academy se Ritu bol rahi hoon. Aapne professional video editing course ke liye enquiry ki thi. Kya aap online live batch seekhna chahte hain ya classroom batch?"
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

  const features = [
    {
      icon: Zap,
      title: '5-Second Instant AI Dialing',
      desc: 'When a customer fills a lead form on your website or landing page, AiBotCall dials their phone in under 5 seconds to qualify them while their intent is at its highest.',
    },
    {
      icon: Bot,
      title: 'Natural Hindi, Hinglish & English',
      desc: 'Speaks with human-like conversational warmth, pauses, and empathy. Seamlessly understands customer language switching without robotic delays.',
    },
    {
      icon: Radio,
      title: 'Bulk Voice Broadcast Campaigns',
      desc: 'Import thousands of course or sales leads via CSV. Dial contacts with intelligent rate-limiting, retry rules for busy numbers, and live progress analytics.',
    },
    {
      icon: Sparkles,
      title: 'Real-Time Barge-In (Interruption)',
      desc: 'Customers can naturally interrupt the AI assistant at any moment. The system immediately stops speaking and listens to the customer.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Code Dynamic Knowledge Base',
      desc: 'Update course fees, batch schedules, branch addresses, and FAQs from your dashboard. AI accesses verified answers through safe server-side function tools.',
    },
    {
      icon: Send,
      title: 'Deal CRM & WhatsApp CRM Sync',
      desc: 'Complete call recordings, turn-by-turn transcripts, AI summaries, and lead qualification statuses are pushed to your CRM with HMAC SHA-256 signatures.',
    },
  ];

  const pricingTiers = [
    {
      id: 'FREE_TRIAL',
      name: 'Free Trial',
      price: '₹0',
      period: 'instant start',
      minutes: '30 Voice Minutes Included',
      desc: 'Perfect for evaluating real speech quality on your mobile phone.',
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
      price: '₹2,999',
      period: '/month',
      minutes: '300 Minutes Included (₹4.99/extra min)',
      desc: 'Ideal for local coaching academies, clinics, and service agencies.',
      features: [
        '300 Voice Minutes Included',
        '3 AI Voice Agents',
        '5 Concurrent Lines',
        'CRM Outgoing Webhook Sync',
        'Basic Voice Broadcast',
        'DNC Suppression Registry',
      ],
      buttonText: 'Get Started',
      popular: false,
    },
    {
      id: 'GROWTH',
      name: 'Growth',
      price: '₹7,999',
      period: '/month',
      minutes: '1,000 Minutes Included (₹4.16/extra min)',
      desc: 'For high-growth institutions, real estate firms, and e-commerce.',
      features: [
        '1,000 Voice Minutes Included',
        '10 AI Voice Agents',
        '10 Concurrent Lines',
        'Unlimited Broadcast Campaigns',
        'CSV Field Variable Personalization',
        'Multi-User Team Workspace',
        'Priority Exotel Telecom Trunk',
      ],
      buttonText: 'Start Growth Plan',
      popular: true,
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise Scale',
      price: '₹19,999',
      period: '/month',
      minutes: '3,500 Minutes Included (₹2.99/extra min)',
      desc: 'High-volume call centers and multi-branch educational academies.',
      features: [
        '3,500 Voice Minutes Included',
        'Unlimited AI Agents',
        '30 Concurrent Lines',
        'Dedicated Virtual Caller IDs (ExoPhones)',
        'Custom Telecom Trunks',
        'Dedicated Account Engineer',
        'Custom LLM Fine-Tuning',
      ],
      buttonText: 'Contact Enterprise',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Unified Public Navigation Bar */}
      <PublicHeader
        activePage="home"
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateAbout={() => (onOpenAbout ? onOpenAbout() : onOpenPolicy?.('about'))}
        onNavigateBlog={() => (onOpenBlog ? onOpenBlog() : onOpenPolicy?.('blog'))}
        onNavigatePricing={onOpenPricing}
        onNavigateContact={() => (onOpenContact ? onOpenContact() : onOpenPolicy?.('contact'))}
        onNavigateLogin={() => onOpenAuth('login')}
        onNavigateRegister={() => onOpenAuth('register')}
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-violet-600/15 via-blue-600/15 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous Two-Way Voice Telephony</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Turn Website Leads into <br />
            <span className="text-gradient-brand">
              Live AI Phone Calls in 5 Seconds
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            AiBotCall automatically calls prospective customers and clients as soon as they submit an enquiry. It speaks fluent <b>Hindi, Hinglish & English</b>, understands preferences, answers fees and batch questions, and syncs directly to your CRM.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-brand hover:brightness-110 text-white font-bold text-sm shadow-xl glow-brand-sm transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Get Started Free (30 Mins)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              Live Admin Demo
            </button>
          </div>

          {/* Interactive Audio Preview Widget */}
          <div className="mt-8 max-w-xl mx-auto p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 glass-card shadow-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlayAudio}
                className="w-12 h-12 rounded-full bg-gradient-brand text-white flex items-center justify-center shadow-lg glow-brand-sm hover:scale-105 transition-transform cursor-pointer"
              >
                {isPlayingDemo ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Agent Ritu (Admissions Counselor)</p>
                <p className="text-[11px] text-cyan-400">Click to listen: Hindi/Hinglish Voice Demo</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 h-8 px-4">
              {[14, 28, 18, 32, 22, 12, 26, 30, 16, 20, 24, 18].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-full bg-gradient-to-t from-violet-500 to-cyan-400 ${isPlayingDemo ? 'animate-pulse' : ''}`}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            <span className="text-[11px] font-mono text-slate-400">{isPlayingDemo ? 'Playing...' : '0:14'}</span>
          </div>
        </div>

        {/* Hero Visual Dashboard Showcase */}
        <div className="mt-14 max-w-6xl mx-auto relative">
          <div className="rounded-3xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 overflow-hidden bg-slate-950 group relative">
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

      {/* Live Phone Interaction Split Showcase */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-gradient-to-b from-slate-950/60 to-[#080c14]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Telephony Experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Human-Like Speech Quality with <br />
              <span className="text-emerald-400">Sub-500ms Conversational Latency</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              No robotic IVR menus, no awkward pauses. AiBotCall listens to customer responses with real-time barge-in, adapts to Hindi, English, and local dialects, and automatically collects customer preferences.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#0f172a]/70 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Full Indian PSTN Carrier Integration</h4>
                  <p className="text-[11px] text-slate-400">Direct carrier trunk routing via Exotel for crystal clear audio with zero packet drops.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#0f172a]/70 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Strict Topic Adherence & Anti-Hallucination</h4>
                  <p className="text-[11px] text-slate-400">AI answers exclusively from your verified business Knowledge Base and rejects off-topic chit-chat.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#0f172a]/70 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Automatic Call Recording & Instant CRM Webhooks</h4>
                  <p className="text-[11px] text-slate-400">Delivers transcripts and lead dispositions to WhatsApp CRM and custom APIs in under 1 second.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 overflow-hidden bg-slate-950">
              <img
                src="/assets/phone_mockup.jpg"
                alt="AI Voice Calling Realtime Phone Interaction"
                className="w-full object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for High-Converting Admissions & Sales
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              Combines telecom-grade Exotel infrastructure with OpenAI Realtime intelligence for zero-latency conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-[#0f172a]/60 border border-slate-800 glass-card glass-card-hover space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership & Vision Highlight: Meet Anil Sharma */}
      <section className="py-16 px-6 border-t border-slate-800/80 bg-gradient-to-b from-[#070a13] via-[#0d1326] to-[#070a13]">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-10 bg-slate-900/60 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
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
                  onClick={() => (onOpenAbout ? onOpenAbout() : onOpenPolicy?.('about'))}
                  className="py-2.5 px-4 rounded-xl bg-gradient-brand hover:brightness-110 text-white text-xs font-bold transition-all shadow-md glow-brand-sm cursor-pointer flex items-center space-x-2"
                >
                  <span>Read Full About Us</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => (onOpenBlog ? onOpenBlog() : onOpenPolicy?.('blog'))}
                  className="py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Read Founder's Telephony Playbook</span>
                </button>
                <button
                  onClick={() => (onOpenContact ? onOpenContact() : onOpenPolicy?.('contact'))}
                  className="py-2.5 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>Connect with Us</span>
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
              Simple, Transparent SaaS Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              Start with 30 free trial calling minutes. Upgrade or buy top-up bundles as your volume scales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-900/20'
                    : 'bg-[#0f172a]/60 border-slate-800'
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

      {/* Unified Public Footer */}
      <PublicFooter
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateAbout={() => (onOpenAbout ? onOpenAbout() : onOpenPolicy?.('about'))}
        onNavigateBlog={() => (onOpenBlog ? onOpenBlog() : onOpenPolicy?.('blog'))}
        onNavigatePricing={onOpenPricing}
        onNavigateContact={() => (onOpenContact ? onOpenContact() : onOpenPolicy?.('contact'))}
        onNavigateLogin={() => onOpenAuth('login')}
        onNavigateRegister={() => onOpenAuth('register')}
        onNavigatePolicy={(policy) => onOpenPolicy?.(policy)}
      />
    </div>
  );
};
