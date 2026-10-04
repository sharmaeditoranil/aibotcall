import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  PhoneCall,
  Clock,
  Heart,
  ExternalLink,
  MessageSquare,
  Bot,
  Zap,
  Building,
  GraduationCap,
  Users,
  BookOpen,
} from 'lucide-react';

export interface PublicFooterProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateBlog: () => void;
  onNavigateDocs?: () => void;
  onNavigatePricing: () => void;
  onNavigateContact: () => void;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  onNavigatePolicy: (policy: 'terms' | 'privacy' | 'refund' | 'security' | 'data-privacy' | 'call-consent-policy') => void;
  onNavigateSeoPage?: (slug: string) => void;
  onNavigateAffiliate?: () => void;
  onNavigateWhoItsFor?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onNavigateHome,
  onNavigateAbout,
  onNavigateBlog,
  onNavigateDocs,
  onNavigatePricing,
  onNavigateContact,
  onNavigateLogin,
  onNavigateRegister,
  onNavigatePolicy,
  onNavigateSeoPage,
  onNavigateAffiliate,
  onNavigateWhoItsFor,
}) => {
  const handleSeoClick = (slug: string) => {
    if (onNavigateSeoPage) {
      onNavigateSeoPage(slug);
    } else {
      window.location.href = `/${slug}/`;
    }
  };

  return (
    <footer className="border-t border-slate-700/60 bg-[#090f1d] text-slate-400 relative z-20 overflow-hidden">
      {/* Omnichannel Ecosystem Synergy Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-violet-950/40 via-[#0d1527] to-cyan-950/40 px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="p-2 rounded-xl bg-gradient-brand text-white shadow-md glow-brand-sm shrink-0 hidden sm:block">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white flex items-center justify-center md:justify-start space-x-2">
                <span>The Unified AI Customer Engagement Suite</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Voice + WhatsApp
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                <b className="text-cyan-300">AiBotCall</b> handles autonomous AI phone calls & speed-to-lead qualification ·{' '}
                <a
                  href="https://aibotflow.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-300 hover:text-white underline font-semibold inline-flex items-center space-x-1"
                >
                  <span>AiBotFlow</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>{' '}
                manages official WhatsApp Business API automation & CRM.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="https://aibotflow.in"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Explore AiBotFlow WhatsApp</span>
              <ExternalLink className="w-3 h-3 text-violet-400" />
            </a>
            <button
              onClick={onNavigateRegister}
              className="py-2 px-4 rounded-xl bg-gradient-brand hover:brightness-110 text-white text-xs font-bold shadow-md glow-brand-sm transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>Try AiBotCall Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 5-Column SEO Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand & Founder */}
          <div className="space-y-3.5 lg:col-span-1">
            <div
              onClick={() => {
                onNavigateHome();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer flex items-center space-x-2.5 group select-none"
            >
              <img
                src="/aibotcall-emblem.png"
                alt="AiBotCall"
                className="h-8 w-8 object-contain logo-glow group-hover:scale-110 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <div className="flex items-center text-lg font-black tracking-tight leading-none">
                  <span className="text-cyan-400 group-hover:brightness-125 transition-all">Ai</span>
                  <span className="text-white">Bot</span>
                  <span className="text-violet-400 group-hover:brightness-125 transition-all">Call</span>
                </div>
                <span className="text-[8.5px] text-cyan-400/90 font-bold tracking-widest uppercase mt-0.5">
                  AI Voice Telephony
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise AI Voice Calling Software in India for instant website lead calls, automated outbound campaigns, and CRM synchronization.
            </p>
            <div className="pt-1 space-y-1 text-[11px] text-slate-400">
              <p>
                Founded & Built by{' '}
                <button
                  onClick={onNavigateAbout}
                  className="text-slate-200 font-semibold hover:text-cyan-300 underline cursor-pointer"
                >
                  Anil Sharma
                </button>
              </p>
              <p className="text-slate-500">Parent Platform: <a href="https://aibotflow.in" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">AiBotFlow.in</a></p>
            </div>
          </div>

          {/* Column 2: Capabilities & Products */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voice Capabilities</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleSeoClick('ai-voice-calling-software')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  AI Voice Calling Software
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('inbound-ai-call-agent')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Inbound AI Call Agent
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('outbound-ai-calling')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Outbound AI Calling
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('ai-call-broadcast')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  AI Call Broadcast (Bulk)
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('website-lead-calling')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Website Lead Calling (5s)
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('ai-call-automation')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  AI Call Webhooks & APIs
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('integrations')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  CRM & WhatsApp Connectors
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Industry Solutions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-violet-400" />
              <span>Industry Solutions</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleSeoClick('ai-voice-agent-for-real-estate')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Real Estate & Developers
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('ai-calling-for-education')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Universities & Admissions
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('ai-calling-for-coaching-institutes')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Coaching & Test Prep
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('ai-calling-for-healthcare')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Healthcare & Diagnostics
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('ai-calling-for-sales-teams')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  B2B Sales Teams & SDRs
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('ai-calling-for-customer-support')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Customer Support Helpdesks
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources & Guides */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Resources & Tech</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateAffiliate ? onNavigateAffiliate() : onNavigateRegister()}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left flex items-center space-x-1.5 text-cyan-400 font-bold"
                >
                  <span>Reseller & Affiliate Program</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-black">25% Comm</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateWhoItsFor ? onNavigateWhoItsFor() : handleSeoClick('ai-voice-calling-software')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left flex items-center space-x-1.5"
                >
                  <span>Who It's For (All Industries)</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-300 font-bold">Guide</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateDocs ? onNavigateDocs() : onNavigateBlog()} className="hover:text-cyan-300 transition-colors cursor-pointer text-left flex items-center space-x-1.5">
                  <span>Developer Docs</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">API</span>
                </button>
              </li>
              <li>
                <button onClick={onNavigateBlog} className="hover:text-cyan-300 transition-colors cursor-pointer text-left flex items-center space-x-1.5">
                  <span>Blog & Playbooks</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-300 font-bold">New</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('ai-voice-agent-india')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Hindi & Indian Voice Models
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('ai-lead-follow-up')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Speed-to-Lead Follow-Up
                </button>
              </li>
              <li>
                <button onClick={() => handleSeoClick('ai-appointment-booking')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Voice Appointment Booking
                </button>
              </li>
              <li>
                <button onClick={onNavigatePricing} className="hover:text-cyan-300 transition-colors cursor-pointer text-left text-emerald-400 font-semibold">
                  Pricing (Flat ₹4.87/Min)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust, Security & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Security & Policies</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigatePolicy('security')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Security & Compliance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePolicy('data-privacy')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Data Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePolicy('call-consent-policy')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Call Consent & DND Rules
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePolicy('terms')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePolicy('privacy')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePolicy('refund')} className="hover:text-cyan-300 transition-colors cursor-pointer text-left">
                  Refund & Cancellation
                </button>
              </li>
              <li>
                <button onClick={onNavigateContact} className="hover:text-cyan-300 transition-colors cursor-pointer text-left text-white font-medium">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} AiBotCall. All rights reserved. Powered by AiBotFlow ecosystem.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>TRAI DND Compliant</span>
            </span>
            <span>·</span>
            <span className="flex items-center space-x-1 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 Encrypted</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
