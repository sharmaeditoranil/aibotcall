import React from 'react';
import { Lock, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

export interface PublicFooterProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateBlog: () => void;
  onNavigatePricing: () => void;
  onNavigateContact: () => void;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  onNavigatePolicy: (policy: 'terms' | 'privacy' | 'refund') => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onNavigateHome,
  onNavigateAbout,
  onNavigateBlog,
  onNavigatePricing,
  onNavigateContact,
  onNavigateLogin,
  onNavigateRegister,
  onNavigatePolicy,
}) => {
  return (
    <footer className="border-t border-slate-800/90 bg-[#090f1d] text-slate-300 text-xs selection:bg-indigo-600 selection:text-white">
      {/* Trust & Compliance Ribbon */}
      <div className="border-b border-slate-800/70 bg-[#0c1424]/50 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="font-bold text-white block">TRAI & TCCCPR Compliant Telephony</span>
              <span className="text-[11px] text-slate-500">140-Series Virtual DIDs & Automated DNC Suppression</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
              <Lock className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <span className="font-bold text-white block">256-Bit Bank-Grade Encryption</span>
              <span className="text-[11px] text-slate-500">Certified Razorpay Payment Gateway & TLS 1.3 Audio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Founder Info */}
          <div className="space-y-3.5">
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
                className="h-7 w-7 sm:h-[30px] sm:w-[30px] object-contain logo-glow group-hover:scale-110 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <div className="flex items-center text-[17px] sm:text-[18px] font-black tracking-tight leading-none">
                  <span className="text-violet-400 group-hover:brightness-125 transition-all">Ai</span>
                  <span className="text-white">Bot</span>
                  <span className="text-cyan-400 group-hover:brightness-125 transition-all">Call</span>
                </div>
                <span className="text-[8.5px] text-cyan-400/90 font-bold tracking-widest uppercase mt-0.5">
                  AI Voice Telephony
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous two-way AI conversational phone calling platform for admissions, sales qualification, and broadcast campaigns.
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Founded & Operated by <span className="text-slate-300 font-semibold">Anil Sharma</span> · Creative Technologist
            </p>
          </div>

          {/* Column 2: Product & Solutions */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5 flex items-center space-x-1.5">
              <span className="text-cyan-400">●</span>
              <span>Product & Pricing</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={onNavigatePricing}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Pricing & Calling Plans
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateRegister}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left text-violet-300 font-semibold flex items-center space-x-1"
                >
                  <span>Start Free Trial (30 Mins)</span>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateLogin}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Dashboard Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateHome}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  AI Voice Agents & Hindi Telephony
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Resources */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5 flex items-center space-x-1.5">
              <span className="text-violet-400">●</span>
              <span>Company & Guides</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={onNavigateAbout}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  About Us & Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateBlog}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left flex items-center space-x-1.5"
                >
                  <span>Blog & AI Playbooks</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-violet-500/20 text-violet-300 font-mono font-bold">NEW</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateContact}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Contact & VIP Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Legal */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5 flex items-center space-x-1.5">
              <span className="text-blue-400">●</span>
              <span>Compliance & Support</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigatePolicy('terms')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePolicy('privacy')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePolicy('refund')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Refund & Cancellation Policy
                </button>
              </li>
              <li className="pt-1 text-[11px] text-slate-400">
                <span className="text-white font-medium block">WhatsApp: +91 99398 00780</span>
                <span>Email: support@aibotflow.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Certification */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AiBotCall / Ai Botflow · Founded by Anil Sharma. All rights reserved.</p>
          <p className="flex items-center space-x-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Razorpay Certified Partner & Telecom SIP Gateway</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
