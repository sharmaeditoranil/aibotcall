import React, { useState } from 'react';
import {
  PhoneCall,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Clock,
  Phone,
  Bot,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  Wallet,
  Calculator,
  Percent,
} from 'lucide-react';

interface PricingPageProps {
  onSelectPlan: (planId: string) => void;
  onGoToLogin: () => void;
  onBackToHome: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onSelectPlan,
  onGoToLogin,
  onBackToHome,
}) => {
  const [pricingModel, setPricingModel] = useState<'payg' | 'subscription'>('payg');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paygMinutes, setPaygMinutes] = useState<number>(500);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const paygCost = Math.round(paygMinutes * 2.49);

  const paygPacks = [
    {
      id: 'pkg_payg_200',
      name: '200 Voice Minutes',
      price: '₹498',
      perMin: '₹2.49/min',
      minutes: 200,
      validity: 'Lifetime Validity',
      popular: false,
      desc: 'Ideal for small outreach or quick testing.',
    },
    {
      id: 'pkg_payg_500',
      name: '500 Voice Minutes',
      price: '₹1,245',
      perMin: '₹2.49/min',
      minutes: 500,
      validity: 'Lifetime Validity',
      popular: true,
      best: true,
      desc: 'Most popular for real estate & lead qualifications.',
    },
    {
      id: 'pkg_payg_1000',
      name: '1,000 Voice Minutes',
      price: '₹2,490',
      perMin: '₹2.49/min',
      minutes: 1000,
      validity: 'Lifetime Validity',
      popular: false,
      desc: 'Best for weekly customer feedback & surveys.',
    },
    {
      id: 'pkg_payg_2500',
      name: '2,500 Voice Minutes',
      price: '₹6,225',
      perMin: '₹2.49/min',
      minutes: 2500,
      validity: 'Lifetime Validity',
      popular: false,
      desc: 'For high-volume monthly sales campaigns.',
    },
  ];

  const plans = [
    {
      id: 'FREE_TRIAL',
      name: 'Free Trial',
      monthlyPrice: '₹0',
      yearlyPrice: '₹0',
      period: 'forever free',
      minutes: '30 Voice Minutes Free',
      concurrency: '2 Concurrent Lines',
      agents: '1 AI Voice Agent',
      desc: 'Test real speech quality and latency on your mobile phone in 60 seconds.',
      features: [
        '30 Free calling minutes included',
        '1 Customizable AI Voice Agent',
        '2 Concurrent telephony lines',
        'Website Leads Webhook (5-sec dispatch)',
        'Turn-by-turn live transcripts',
        'Barge-in interruption support',
      ],
      buttonText: 'Claim 30 Free Minutes',
      popular: false,
      color: 'emerald',
    },
    {
      id: 'STARTER',
      name: 'Starter Plan',
      monthlyPrice: '₹2,999',
      yearlyPrice: '₹2,399',
      period: '/month',
      minutes: '300 Minutes Included',
      extraRate: '₹4.99/extra minute',
      concurrency: '5 Concurrent Lines',
      agents: '3 AI Voice Agents',
      desc: 'Ideal for coaching academies, clinics, local service agencies, and consultants.',
      features: [
        '300 Calling minutes included each month',
        '3 AI Voice Agents (Hindi / English)',
        '5 Concurrent telephony lines',
        'CSV Broadcast Campaigns',
        'Deal CRM & WhatsApp CRM sync',
        'DNC Suppression list protection',
        'Standard Exotel telephony trunk',
      ],
      buttonText: 'Get Started',
      popular: false,
      color: 'blue',
    },
    {
      id: 'GROWTH',
      name: 'Growth Plan',
      monthlyPrice: '₹7,999',
      yearlyPrice: '₹6,399',
      period: '/month',
      minutes: '1,000 Minutes Included',
      extraRate: '₹4.16/extra minute',
      concurrency: '10 Concurrent Lines',
      agents: '10 AI Voice Agents',
      desc: 'For high-growth institutions, real estate agencies, and e-commerce companies.',
      features: [
        '1,000 Calling minutes included each month',
        '10 AI Voice Agents with custom voices',
        '10 Concurrent telephony lines',
        'Unlimited CSV Broadcast Campaigns',
        'Custom template variables {{name}}, {{city}}',
        'Multi-user team workspace permissions',
        'Priority low-latency telephony trunk',
        'Instant Razorpay minute top-up discount',
      ],
      buttonText: 'Start Growth Plan',
      popular: true,
      color: 'emerald',
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise Scale',
      monthlyPrice: '₹19,999',
      yearlyPrice: '₹15,999',
      period: '/month',
      minutes: '3,500 Minutes Included',
      extraRate: '₹2.99/extra minute',
      concurrency: '30 Concurrent Lines',
      agents: 'Unlimited AI Agents',
      desc: 'For high-volume contact centers, pan-India ed-tech firms, and enterprises.',
      features: [
        '3,500 Calling minutes included each month',
        'Unlimited AI Voice Agents',
        '30 Concurrent telephony lines',
        'Dedicated Virtual Caller ID (ExoPhone)',
        'Custom Exotel SIP Trunk integration (BYOT)',
        'Custom Knowledge Base indexing & vector sync',
        'Dedicated 24/7 Account Engineer',
        'Custom SLA & 99.9% Uptime Guarantee',
      ],
      buttonText: 'Contact Enterprise',
      popular: false,
      color: 'purple',
    },
  ];

  const faqs = [
    {
      q: 'How does the Pay As You Go (PAYG) model work?',
      a: 'With Pay As You Go, there are zero monthly rentals or recurring subscription fees. You only recharge voice minutes whenever you need them at a flat rate of ₹2.49/minute. Unspent minutes carry forward forever and never expire.',
    },
    {
      q: 'Are there any hidden charges or platform fees in Pay As You Go?',
      a: 'Zero hidden fees. There are no setup fees, no per-agent rental costs, and no monthly platform subscriptions. You only pay for the real connected seconds of conversations delivered by your AI agent.',
    },
    {
      q: 'How does talk-time minute calculation work?',
      a: 'We only deduct credits for real answered seconds of the conversation. If a customer is busy, does not pick up, or disconnects immediately, 0 talk-time is deducted. Seconds are calculated accurately with per-second billing.',
    },
    {
      q: 'Do calling minutes expire at the end of the month?',
      a: 'No! All Pay As You Go and top-up minutes purchased via Razorpay roll over indefinitely with lifetime validity. You keep them until they are used in real calls.',
    },
    {
      q: 'Can the AI speak natural conversational Hindi and Hinglish?',
      a: 'Yes, AiBotCall utilizes OpenAI Realtime speech-to-speech with natural Indian cadence. It understands when customers speak Hindi, English, or mixed Hinglish, and answers naturally with warmth and proper pronunciation.',
    },
    {
      q: 'Can I connect my own Exotel Virtual Number (Caller ID)?',
      a: 'Yes. You can use our high-availability shared Exotel trunk out of the box, or easily connect your own Exotel Account SID, Token, and virtual number via the API Connect hub in your dashboard.',
    },
    {
      q: 'Which payment methods are accepted through Razorpay?',
      a: 'Razorpay accepts all Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), Debit & Credit Cards (RuPay, Visa, Mastercard), and NetBanking from 50+ Indian banks.',
    },
    {
      q: 'Can I switch between Pay As You Go and monthly plans at any time?',
      a: 'Yes! You can switch between Pay As You Go and any fixed subscription plan anytime from your dashboard. Any existing balance remains 100% safe in your wallet.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#070a13]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div
            onClick={onBackToHome}
            className="flex items-center cursor-pointer group"
          >
            <img
              src="/aibotcall-logo-full.png"
              alt="AiBotCall"
              className="h-9 sm:h-11 w-auto object-contain hover:opacity-95 transition-opacity drop-shadow-md"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
            <button onClick={onBackToHome} className="hover:text-cyan-400 transition-colors">
              Home
            </button>
            <button onClick={onBackToHome} className="hover:text-cyan-400 transition-colors">
              Features
            </button>
            <span className="text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5">
              Pricing & Plans
            </span>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToLogin}
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onSelectPlan('PAY_AS_YOU_GO')}
              className="py-2.5 px-4 rounded-xl bg-gradient-brand hover:brightness-110 text-white text-xs font-bold shadow-md glow-brand-sm transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Start Pay As You Go</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Title */}
      <section className="pt-16 pb-8 px-6 text-center max-w-4xl mx-auto relative">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Flexible Pay As You Go & Monthly Plans for Indian Businesses</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Transparent Voice AI Pricing <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            No Rental Fees. Flat ₹2.49/Min.
          </span>
        </h1>
        <p className="mt-4 text-sm text-slate-400 max-w-2xl mx-auto">
          Choose between pure <b>Pay As You Go</b> with zero monthly commitments, or high-volume <b>Subscription Bundles</b>. Unused minutes never expire.
        </p>

        {/* Master Model Switcher */}
        <div className="mt-8 flex justify-center">
          <div className="p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center space-x-1">
            <button
              onClick={() => setPricingModel('payg')}
              className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                pricingModel === 'payg'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-300" />
              <span>Pay As You Go (PAYG)</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950">
                ₹0 Monthly Fee
              </span>
            </button>

            <button
              onClick={() => setPricingModel('subscription')}
              className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                pricingModel === 'subscription'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Subscription Plans</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Monthly / Yearly
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION A: PAY AS YOU GO MODEL */}
      {pricingModel === 'payg' && (
        <section className="max-w-6xl mx-auto px-6 pb-20 space-y-12">
          {/* Main PAYG Calculator & Showcase Card */}
          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0c1626] to-slate-950 border border-emerald-500/40 shadow-2xl shadow-emerald-950/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Plan description & interactive slider */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-3">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Pure Pay As You Go Model</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    Flat ₹2.49 / Minute with Zero Commitments
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    No monthly rentals, no platform fees, and no contracts. Only pay when your AI voice agent speaks with real customers. Unused balance carries forward forever.
                  </p>
                </div>

                {/* Minute Slider */}
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>Choose Expected Monthly Minutes:</span>
                    </span>
                    <span className="text-xl font-black text-emerald-400">
                      {paygMinutes.toLocaleString('en-IN')} <span className="text-xs font-medium text-slate-400">Mins</span>
                    </span>
                  </div>

                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={100}
                    value={paygMinutes}
                    onChange={(e) => setPaygMinutes(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[200, 500, 1000, 2500].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setPaygMinutes(mins)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          paygMinutes === mins
                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {mins.toLocaleString('en-IN')} Mins (₹{Math.round(mins * 2.49).toLocaleString('en-IN')})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Features List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>₹0 Monthly Fee:</b> Never pay any recurring rentals</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>Per-Second Billing:</b> No charges for unanswered calls</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>5 Concurrent Lines:</b> Dial multiple leads simultaneously</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>All 6 AI Agents:</b> Real estate, clinics, sales, support</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>Lifetime Validity:</b> Balance never expires</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>Instant Razorpay:</b> Top-up in 10 seconds via UPI</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Calculated estimate card */}
              <div className="lg:col-span-5">
                <div className="p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/50 shadow-xl space-y-6 text-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block">
                    Pay As You Go Estimate
                  </span>

                  <div>
                    <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
                      ₹{paygCost.toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      for <b>{paygMinutes.toLocaleString('en-IN')} calling minutes</b> (Flat ₹2.49/min)
                    </p>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                      + 30 Free Welcome Minutes on Signup!
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Monthly Rental:</span>
                      <span className="font-bold text-emerald-400">₹0 (Free Forever)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Equivalent Conversations:</span>
                      <span className="font-bold text-white">~{Math.round(paygMinutes / 2)} calls</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Credit Expiry:</span>
                      <span className="font-bold text-emerald-400">Never / Lifetime</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Telephony Trunk:</span>
                      <span className="font-bold text-white">High Speed Exotel</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectPlan('PAY_AS_YOU_GO')}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Start Pay As You Go</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-slate-500">
                    Includes 30 Free Minutes • Instant access • No credit card required to start
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Recharge Packs Section */}
          <div className="space-y-4">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Ready Pay As You Go Packages
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Recharge your wallet anytime with Razorpay. UPI, GPay, PhonePe, Cards & NetBanking supported.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {paygPacks.map((pack) => (
                <div
                  key={pack.id}
                  className={`p-6 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                    pack.best
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {pack.best && (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 inline-block mb-2">
                        Most Popular
                      </span>
                    )}
                    <h4 className="text-base font-bold text-white">{pack.name}</h4>
                    <div className="text-3xl font-black text-emerald-400 mt-1">{pack.price}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{pack.perMin}</div>
                    <p className="text-[11px] text-slate-400 mt-2">{pack.desc}</p>
                    <span className="inline-block mt-3 text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/20">
                      {pack.validity}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectPlan('PAY_AS_YOU_GO')}
                    className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    Select & Recharge
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION B: SUBSCRIPTION PLANS MODEL */}
      {pricingModel === 'subscription' && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          {/* Monthly / Yearly Toggle */}
          <div className="mb-10 flex items-center justify-center space-x-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-7 rounded-full bg-slate-800 p-1 relative transition-colors focus:outline-none border border-slate-700"
            >
              <div
                className={`w-5 h-5 rounded-full bg-emerald-500 shadow-md transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center space-x-1.5 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
              <span>Yearly Billing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Save 20%
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => {
              const price = billingCycle === 'yearly' ? p.yearlyPrice : p.monthlyPrice;

              return (
                <div
                  key={p.id}
                  className={`p-7 rounded-3xl border flex flex-col justify-between transition-all relative ${
                    p.popular
                      ? 'bg-gradient-to-b from-slate-900 to-[#0c1626] border-emerald-500/60 shadow-2xl shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md">
                        Most Popular Plan
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-white">{p.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 min-h-[32px]">{p.desc}</p>
                    </div>

                    <div className="py-4 border-y border-slate-800/80 my-4">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-black text-white">{price}</span>
                        <span className="text-xs text-slate-400">{p.period}</span>
                      </div>
                      <div className="mt-2 flex items-center space-x-1.5 text-xs font-semibold text-emerald-400">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{p.minutes}</span>
                      </div>
                      {p.extraRate && (
                        <p className="text-[10px] text-slate-500 mt-0.5">{p.extraRate}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 mb-6 text-xs text-slate-300">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Included Capacity:
                      </div>
                      <div className="flex items-center space-x-2 text-white font-medium">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{p.concurrency}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-white font-medium pb-3 border-b border-slate-800/60">
                        <Bot className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{p.agents}</span>
                      </div>

                      <div className="pt-2 space-y-2">
                        {p.features.map((feat, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-[11px] text-slate-300 leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectPlan(p.id)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                      p.popular
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {p.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 mt-2">Everything you need to know about billing, Pay As You Go & minutes</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = expandedFaq === i;
            return (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="pb-24 px-6 max-w-5xl mx-auto">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Start Dialing Leads Automatically in 60 Seconds
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              Choose Pay As You Go or claim 30 free trial calling minutes to test your AI voice agent live on your own mobile phone right now.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onSelectPlan('PAY_AS_YOU_GO')}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Start Pay As You Go (₹0 Fee)</span>
              </button>
              <button
                onClick={() => onSelectPlan('FREE_TRIAL')}
                className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all inline-flex items-center space-x-2"
              >
                <span>Claim 30 Free Minutes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
