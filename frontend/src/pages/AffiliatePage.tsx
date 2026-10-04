import React, { useState } from 'react';
import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';
import {
  Gift,
  DollarSign,
  TrendingUp,
  Users,
  Wallet,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Zap,
  Building,
  GraduationCap,
  Briefcase,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AffiliatePageProps {
  onBackToHome: () => void;
  onGoToAbout: () => void;
  onGoToBlog: () => void;
  onGoToDocs: () => void;
  onGoToPricing: () => void;
  onGoToContact: () => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onNavigatePolicy: (policy: 'terms' | 'privacy' | 'refund' | 'security' | 'data-privacy' | 'call-consent-policy') => void;
  onNavigateSeoPage?: (slug: string) => void;
}

export const AffiliatePage: React.FC<AffiliatePageProps> = ({
  onBackToHome,
  onGoToAbout,
  onGoToBlog,
  onGoToDocs,
  onGoToPricing,
  onGoToContact,
  onGoToLogin,
  onGoToRegister,
  onNavigatePolicy,
  onNavigateSeoPage,
}) => {
  const [clientCount, setClientCount] = useState<number>(15);
  const [avgSpend, setAvgSpend] = useState<number>(4870); // 1,000 mins pack
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const commissionRate = 0.25; // 25% recurring
  const monthlyEarnings = Math.round(clientCount * avgSpend * commissionRate);
  const yearlyEarnings = monthlyEarnings * 12;

  const faqs = [
    {
      q: 'How much commission do I earn as an AiBotCall Partner / Reseller?',
      a: 'You earn a flat 25% recurring lifetime commission on every subscription payment and every Pay As You Go voice minute pack recharged by clients who sign up using your referral link or partner code.',
    },
    {
      q: 'How and when do I get paid?',
      a: 'Payouts are processed directly via Instant UPI (Google Pay, PhonePe, Paytm, BHIM) or Direct Bank IMPS/NEFT. The minimum withdrawal threshold is only ₹100, and payouts are approved within 24 hours.',
    },
    {
      q: 'Is there any registration fee or setup cost to join?',
      a: 'No. Joining the AiBotCall Partner & Reseller program is 100% free with zero fees. You immediately receive 30 free trial calling minutes to test the platform yourself, along with your dedicated partner link.',
    },
    {
      q: 'What benefit do my clients get when using my link?',
      a: 'Every client who registers through your partner link automatically receives 30 Free Calling Minutes added to their account instantly to test real AI voice calls on their phone.',
    },
    {
      q: 'Can marketing agencies offer AI voice calling as a service to their clients?',
      a: 'Absolutely! Many performance marketing agencies, CRM consultants, and SaaS agencies resell AiBotCall to real estate builders, hospitals, coaching academies, and retail brands to automate lead qualification and boost client ROI.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <PublicHeader
        activePage="affiliate"
        onNavigateHome={onBackToHome}
        onNavigateAbout={onGoToAbout}
        onNavigateBlog={onGoToBlog}
        onNavigateDocs={onGoToDocs}
        onNavigatePricing={onGoToPricing}
        onNavigateContact={onGoToContact}
        onNavigateLogin={onGoToLogin}
        onNavigateRegister={onGoToRegister}
        onNavigateSeoPage={onNavigateSeoPage}
        onNavigateAffiliate={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-lg glow-brand-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              AiBotCall Partner & Reseller Network
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Earn <span className="text-gradient-brand">25% Lifetime Commission</span> <br className="hidden sm:block" />
            Empowering Businesses with Voice AI
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Partner with India’s leading conversational AI Voice Calling platform. Recommend AiBotCall to agencies, real estate builders, coaching institutes, and sales teams. Earn recurring revenue on every minute they dial!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGoToRegister}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-brand text-white font-extrabold text-sm shadow-xl glow-brand hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Join Reseller Program Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Wallet className="w-4 h-4 text-cyan-400" />
              <span>Partner Dashboard Login</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-2xl font-black text-cyan-400">25%</div>
              <div className="text-xs text-slate-400 mt-0.5">Recurring Commission</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-2xl font-black text-emerald-400">₹100</div>
              <div className="text-xs text-slate-400 mt-0.5">Min UPI Withdrawal</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-2xl font-black text-violet-400">30 Mins</div>
              <div className="text-xs text-slate-400 mt-0.5">Free for Each Referral</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-2xl font-black text-white">Lifetime</div>
              <div className="text-xs text-slate-400 mt-0.5">Cookie & Attribution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Commission Calculator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a1122]/70 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Passive Income Estimator
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Calculate Your Monthly Partner Earnings
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Slide to see how much monthly recurring income you can generate by onboarding clients to AiBotCall.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/80 border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl glass-panel">
            {/* Sliders Left */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    Referred Active Clients / Businesses
                  </span>
                  <span className="text-lg font-black text-cyan-400">
                    {clientCount} Clients
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={clientCount}
                  onChange={(e) => setClientCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1 Client</span>
                  <span>50 Clients</span>
                  <span>100 Clients</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    Average Monthly Spend per Client (Recharges / Plan)
                  </span>
                  <span className="text-lg font-black text-violet-400">
                    ₹{avgSpend.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="999"
                  max="20000"
                  step="500"
                  value={avgSpend}
                  onChange={(e) => setAvgSpend(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>₹999 (Starter)</span>
                  <span>₹4,870 (1,000 Mins)</span>
                  <span>₹20,000 (Enterprise)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>25% Lifetime Recurring Payout on every recharge</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-6">
                  Even when clients top up additional Pay As You Go minutes at ₹4.87/min, your commission is credited instantaneously.
                </p>
              </div>
            </div>

            {/* Earnings Result Right */}
            <div className="lg:col-span-5 p-7 rounded-2xl bg-gradient-to-br from-violet-950/60 via-slate-900 to-cyan-950/60 border border-cyan-500/40 text-center space-y-4 shadow-xl">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block">
                Estimated Passive Income
              </span>

              <div>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  ₹{monthlyEarnings.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-cyan-300 font-bold mt-1">
                  per month, paid directly to your UPI
                </div>
              </div>

              <div className="py-3 px-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Yearly Recurring:</span>
                  <span className="font-extrabold text-emerald-400">
                    ₹{yearlyEarnings.toLocaleString('en-IN')} / yr
                  </span>
                </div>
              </div>

              <button
                onClick={onGoToRegister}
                className="w-full py-3.5 rounded-xl bg-gradient-brand text-white font-extrabold text-xs shadow-lg glow-brand-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Start Earning 25% Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Partner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
            Who Can Join
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Ideal For Agencies, Integrators & Marketers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Whether you run a digital marketing firm, consult on CRM systems, or build software, AiBotCall adds high-margin recurring income to your service roster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Digital Marketing Agencies</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bundle AI Voice Calling with your Meta & Google ad campaigns. When leads get called within 5 seconds, client conversion shoots up 300% and clients stick with you forever.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-violet-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">CRM & Automation Consultants</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Integrate AiBotCall webhooks into Zoho, HubSpot, Salesforce, and LeadSquared. Charge implementation fees plus enjoy 25% lifetime calling commission.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Freelancers & B2B Affiliates</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Share your link with your business network, WhatsApp communities, YouTube channels, and LinkedIn followers. High conversion with 30 free trial minutes for every signup.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a1122]/60 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              3 Simple Steps
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              How the Partner Program Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gradient-brand text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h4 className="text-base font-bold text-white">Get Your Referral Link</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sign up in 30 seconds. Your dashboard generates a unique partner link and referral code with real-time tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gradient-brand text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h4 className="text-base font-bold text-white">Clients Sign Up Free</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clients receive 30 Free Calling Minutes immediately upon joining. They test real AI voice calls on their phone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gradient-brand text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h4 className="text-base font-bold text-white">Earn 25% Forever</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every subscription or PAYG minute recharge credits 25% directly to your wallet. Withdraw to UPI in 1 click!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Partner Program Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400">Everything you need to know about payouts, cookies, and reseller terms</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
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
      </section>

      {/* Bottom CTA Banner with 3D Logo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-violet-950/60 via-[#0d172e] to-cyan-950/60 border border-cyan-500/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-lg glow-brand-sm">
            <img src="/aibotcall-emblem.png" alt="AiBotCall" className="w-12 h-12 object-contain logo-glow" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Start Your AI Voice Calling Reseller Business Today
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Free registration • 25% recurring lifetime revenue • Instant UPI payouts • Dedicated partner dashboard
          </p>

          <button
            onClick={onGoToRegister}
            className="px-8 py-4 rounded-2xl bg-gradient-brand text-white font-extrabold text-sm shadow-xl glow-brand hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center space-x-2"
          >
            <span>Claim Your Free Partner Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter
        onNavigateHome={onBackToHome}
        onNavigateAbout={onGoToAbout}
        onNavigateBlog={onGoToBlog}
        onNavigateDocs={onGoToDocs}
        onNavigatePricing={onGoToPricing}
        onNavigateContact={onGoToContact}
        onNavigateLogin={onGoToLogin}
        onNavigateRegister={onGoToRegister}
        onNavigatePolicy={onNavigatePolicy}
        onNavigateSeoPage={onNavigateSeoPage}
      />
    </div>
  );
};
