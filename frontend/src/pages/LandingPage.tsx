import React, { useState } from 'react';
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
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register', plan?: string) => void;
  onOpenPricing: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onOpenPricing }) => {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const features = [
    {
      icon: Zap,
      title: '5-Second Instant AI Dialing',
      desc: 'When a customer fills a lead form on your website or landing page, AiBotCall dials their phone in under 5 seconds to qualify them while their intent is at its highest.',
    },
    {
      icon: Bot,
      title: 'Natural Hindi, Hinglish & English',
      desc: 'Speaks with human-like conversational warmth, pauses, and empathy. Seamlessly understands customer language switching without awkward IVR robotic delays.',
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
      features: ['30 Free Calling Minutes', '1 AI Voice Agent', '2 Concurrent Lines', 'Full Website Lead Webhook', 'Full Transcripts & AI Summaries'],
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
      features: ['300 Voice Minutes Included', '3 AI Voice Agents', '5 Concurrent Lines', 'CRM Outgoing Webhook Sync', 'Basic Voice Broadcast', 'DNC Suppression Registry'],
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
      features: ['1,000 Voice Minutes Included', '10 AI Voice Agents', '10 Concurrent Lines', 'Unlimited Broadcast Campaigns', 'CSV Field Variable Personalization', 'Multi-User Team Workspace', 'Priority Exotel Telecom Trunk'],
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
      features: ['3,500 Voice Minutes Included', 'Unlimited AI Agents', '30 Concurrent Lines', 'Dedicated Virtual Caller IDs (ExoPhones)', 'Custom Telecom Trunks', 'Dedicated Account Engineer', 'Custom LLM Fine-Tuning'],
      buttonText: 'Contact Enterprise',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#080c14]/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <PhoneCall className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                AiBot<span className="text-emerald-400">Call</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] text-emerald-400/80 font-semibold tracking-wider uppercase border-l border-slate-700 pl-2">
                AI Voice Calls & Smart Automation
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenPricing}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Pricing & Plans
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/30 transition-all active:scale-95"
            >
              Start Free Trial (30 Mins)
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Two-Way Voice Telephony</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Turn Website Leads into <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Live AI Phone Calls in 5 Seconds
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            AiBotCall automatically calls prospective students and clients as soon as they submit an enquiry. It speaks fluent <b>Hindi, Hinglish & English</b>, understands preferences, answers fees and batch questions, and syncs directly to your CRM.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/40 transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free (30 Mins)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-colors"
            >
              Live Admin Demo
            </button>
          </div>

          {/* Interactive Audio Preview Widget */}
          <div className="mt-12 max-w-xl mx-auto p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 glass-card shadow-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform"
              >
                {isPlayingDemo ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Agent Ritu (Quick Art Academy)</p>
                <p className="text-[11px] text-emerald-400">Hindi/Hinglish Course Counselor Demo</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 h-8 px-4">
              {[14, 28, 18, 32, 22, 12, 26, 30, 16, 20, 24, 18].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-full bg-emerald-400 ${isPlayingDemo ? 'wave-bar' : ''}`}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            <span className="text-[11px] font-mono text-slate-400">0:14</span>
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
                  className={`mt-8 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
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

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800/80 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>AiBotCall — AI Voice Calls & Smart Automation</span>
          </div>
          <p>© {new Date().getFullYear()} AiBotCall Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
