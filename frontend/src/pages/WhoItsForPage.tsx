import React, { useState } from 'react';
import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';
import {
  Building,
  GraduationCap,
  HeartPulse,
  Briefcase,
  ShoppingBag,
  CreditCard,
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Volume2,
  Zap,
  Users,
  ShieldCheck,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface WhoItsForPageProps {
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
  onNavigateAffiliate?: () => void;
}

export const WhoItsForPage: React.FC<WhoItsForPageProps> = ({
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
  onNavigateAffiliate,
}) => {
  const [activeTab, setActiveTab] = useState<string>('real-estate');

  const industries = [
    {
      id: 'real-estate',
      label: 'Real Estate & Builders',
      icon: Building,
      headline: 'Automate Site Visits & Property Buyer Qualification',
      badge: '3.8x Higher Site Visit Bookings',
      problem:
        'When prospective buyers submit enquiries on 99acres, MagicBricks, or Facebook Ads, they usually wait hours before a sales agent calls. By then, the prospect has engaged with a competing project or forgotten the floor plan.',
      solution:
        'AiBotCall triggers an outbound carrier phone call in under 5 seconds. The AI greets the buyer by name in natural Hindi/English, clarifies their budget range, BHK preference, and possession timeline, and schedules a weekend site visit directly on your sales team’s Google or Outlook calendar.',
      script: {
        speaker: 'AI Agent (Priya):',
        text: '“Namaste Vikram ji! Main Godrej Woods se bol rahi hoon. Aapne hamare 3 BHK luxury apartment ke liye enquiry submit ki thi. Kya aap Noida Sector 43 wale sample flat ka visit is Saturday 11 baje schedule karna chahenge?”',
        customer: '“Haan, Saturday 11 baje theek rahega. Kya parking space included hai?”',
        aiReply: '“Bilkul sir, 3 BHK ke saath 2 reserved car parking spaces included hain. Maine aapka visit slot Saturday 11:00 AM lock kar diya hai aur location WhatsApp par bhej di hai!”',
      },
      stats: [
        { label: 'Speed-to-Lead', val: '< 5 Seconds' },
        { label: 'Site Visit Rate', val: '+380%' },
        { label: 'Unreachable Leads', val: 'Reduced 65%' },
      ],
      features: [
        'Instant webhook trigger from 99acres, MagicBricks, Housing.com, Meta Ads',
        'Budget, configuration (1/2/3/4 BHK) & possession timeline qualification',
        'Automated calendar invite sync for site visit executives',
        'Turn-by-turn transcripts and audio recordings synced into LeadSquared or Zoho CRM',
      ],
      seoSlug: 'ai-voice-agent-for-real-estate',
    },
    {
      id: 'education',
      label: 'Coaching & Universities',
      icon: GraduationCap,
      headline: 'Instant Student Counseling & Demo Class Confirmations',
      badge: 'Zero Missed Student Inquiries',
      problem:
        'Counseling teams face seasonal peak overload during board exam results and admissions windows. Answering thousands of questions about fee structures, scholarship tests, and batch timings manually leads to caller fatigue and dropped admissions.',
      solution:
        'AiBotCall acts as your 24/7 autonomous admissions counselor. It dials students or parents within seconds of brochure downloads, answers syllabus and faculty questions, and books demo lecture seats with instant WhatsApp confirmation.',
      script: {
        speaker: 'AI Agent (Admissions Desk):',
        text: '“Namaste Rahul! Main Allen Career Institute se baat kar rahi hoon. Aapne hamare JEE 2027 foundation batch ke liye interest show kiya tha. Kya aap offline classroom batch dekh rahe hain ya online live interactive program?”',
        customer: '“Main weekend offline batch dekh raha hoon. Kya scholarship test available hai?”',
        aiReply: '“Haan Rahul! Hamara ASAT scholarship test upcoming Sunday ko conduct ho raha hai jisme aap 90% tak fee waiver earn kar sakte hain. Kya main aapka test registration link WhatsApp par share kar doon?”',
      },
      stats: [
        { label: 'Demo Attendance', val: '+52%' },
        { label: 'Counselor Productivity', val: '4x' },
        { label: 'Admissions Funnel Speed', val: 'Instant' },
      ],
      features: [
        'Bilingual Hindi & English conversational counseling with polite respect',
        'Demo lecture and scholarship test slot reservations',
        'Automatic WhatsApp syllabus PDF & fee structure dispatch via AiBotFlow',
        'Automated attendance reminder calls on the morning of the demo session',
      ],
      seoSlug: 'ai-calling-for-coaching-institutes',
    },
    {
      id: 'healthcare',
      label: 'Clinics & Healthcare',
      icon: HeartPulse,
      headline: 'Autonomous Doctor Appointments & Diagnostic Prep Reminders',
      badge: '24/7 Patient Concierge',
      problem:
        'Clinic front-desks are congested during OPD hours. Patients calling for appointments get busy tones or long hold times, while no-shows for diagnostic tests cost clinics tens of thousands in lost revenue.',
      solution:
        'AiBotCall provides a 24/7 bilingual medical voice receptionist. Patients book, reschedule, or cancel doctor consultations without human intervention. The AI also places automated outbound reminder calls with specific pre-test fasting instructions.',
      script: {
        speaker: 'AI Health Assistant:',
        text: '“Namaste Smt. Anjali ji! Main CareMax Hospital se baat kar rahi hoon. Aapka Dr. Sharma ke saath cardiology consultation kal subah 10:30 AM scheduled hai. Kya aap is appointment ko confirm karna chahte hain?”',
        customer: '“Haan confirm hai, kya mujhe blood test ke liye khali pet aana hai?”',
        aiReply: '“Ji bilkul Anjali ji. Fasting lipid profile ke liye please 10 ghante ki fasting maintain kariyega. Aapka appointment 10:30 AM confirm ho gaya hai!”',
      },
      stats: [
        { label: 'Patient Hold Time', val: '0 Seconds' },
        { label: 'No-Show Reduction', val: '-44%' },
        { label: '24/7 Availability', val: '100% Uptime' },
      ],
      features: [
        'OPD Doctor schedule lookups and slot confirmations',
        'Pre-operative and diagnostic test fasting guidance calls',
        'Automated appointment reschedule & cancellation handling',
        'Zero patient hold time on toll-free, virtual mobile or landline numbers',
      ],
      seoSlug: 'ai-calling-for-healthcare',
    },
    {
      id: 'sales-teams',
      label: 'Sales & B2B SDR Teams',
      icon: Briefcase,
      headline: 'Eliminate Cold Calling Fatigue & Maximize Live Talk-Time',
      badge: '5x More Qualified Pipeline',
      problem:
        'Human sales reps spend over 70% of their workday dialing unanswered phones, listening to rings, navigating gatekeepers, and speaking with uninterested leads. This leads to burnout and missed monthly quotas.',
      solution:
        'AiBotCall conducts automated initial speed-to-lead outreach and bulk qualification. The AI filters out disconnected lines, asks BANT qualifying questions, and seamlessly routes high-intent buyers to human closers with full context.',
      script: {
        speaker: 'AI SDR (Rohan):',
        text: '“Hi Amit! I’m calling from AiBotCall regarding your inquiry on our enterprise sales automation software. Are you currently looking to automate your outbound calling workflow this quarter?”',
        customer: '“Yes, we have 15 telecallers and lead response time is too slow.”',
        aiReply: '“Understood! AiBotCall can call your incoming web leads in under 5 seconds automatically. Let me connect you directly with our Senior Solution Architect, or would you prefer a quick 15-minute demo tomorrow at 3 PM?”',
      },
      stats: [
        { label: 'Lead Contact Rate', val: '350% Boost' },
        { label: 'Rep Live Talk Time', val: '4.5 hrs/day' },
        { label: 'Cost per Qualified Lead', val: '-60%' },
      ],
      features: [
        'Under 5-second automated response on inbound form fills',
        'BANT qualification (Budget, Authority, Need, Timeline)',
        'CRM status tag updates & real-time webhook dispatch',
        'Live warm transfer to sales reps for high-intent prospects',
      ],
      seoSlug: 'ai-calling-for-sales-teams',
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce & D2C',
      icon: ShoppingBag,
      headline: 'Slash COD Return-to-Origin (RTO) & Recover Carts',
      badge: 'Save 30% RTO Losses',
      problem:
        'In India, Cash on Delivery (COD) orders suffer from 25% to 40% Return-to-Origin (RTO) losses due to fake orders, impulse buyers refusing delivery, or incorrect address entries.',
      solution:
        'Within 2 minutes of checkout, AiBotCall places an automated verification call to confirm order details and delivery address. If the buyer placed the order by mistake or gave an incomplete address, the order is flagged before shipping.',
      script: {
        speaker: 'AI Order Assistant:',
        text: '“Namaste Gaurav ji! Main UrbanFashion se bol raha hoon. Aapne hamari website se ₹1,899 ka Smartwatch COD order place kiya hai. Kya aap is order ko confirm karna chahte hain?”',
        customer: '“Haan maine order kiya tha, confirm hai.”',
        aiReply: '“Shukriya Gaurav ji! Aapka order confirm ho gaya hai aur kal dispatch kar diya jayega. Tracking details WhatsApp par bhej di gayi hain!”',
      },
      stats: [
        { label: 'RTO Loss Reduction', val: '-32%' },
        { label: 'Order Verification Speed', val: '2 Minutes' },
        { label: 'Abandoned Cart Recovery', val: '+18%' },
      ],
      features: [
        'Instant Shopify, WooCommerce, and custom checkout webhook sync',
        'Automated COD order confirmation and pin-code verification',
        'Abandoned cart follow-up calls offering timed discount codes',
        'Automatic order cancellation in CRM if customer rejects call',
      ],
      seoSlug: 'ai-voice-calling-software',
    },
    {
      id: 'customer-support',
      label: 'Customer Support Desks',
      icon: Headphones,
      headline: '24/7 Tier-1 Helpdesk with Zero Hold Time & Authentic Hindi/English',
      badge: 'Sub-500ms Instant Answers',
      problem:
        'Customers hate waiting on hold for 15 minutes to ask simple questions like "Where is my order?", "How do I reset my password?", or "What are your branch timings?". Hiring round-the-clock shift staff is cost prohibitive.',
      solution:
        'AiBotCall answers 100% of customer support calls on the first ring. Operating with sub-500ms speech-to-speech latency and vector knowledge base integration, it resolves routine tickets immediately and escalates complex queries with full transcripts.',
      script: {
        speaker: 'AI Support Desk:',
        text: '“Namaste! AiBotCall Support me aapka swagat hai. Main aapki kya sahayata kar sakti hoon?”',
        customer: '“Mera refund abhi tak account me nahi aaya, status check karke batao.”',
        aiReply: '“Kripya apna registered mobile number ya Order ID batayein... Shukriya, maine check kiya hai: aapka ₹2,400 ka refund kal शाम 5:30 PM par initiate hua hai aur 2 working days me aapke bank account me reflect ho jayega!”',
      },
      stats: [
        { label: 'First Contact Resolution', val: '78%' },
        { label: 'Average Wait Time', val: '0 Seconds' },
        { label: 'Support Cost Savings', val: '-68%' },
      ],
      features: [
        'Dynamic vector knowledge base retrieval for instant accurate answers',
        'Order status, refund timeline & warranty verification via live API lookup',
        'Intelligent barge-in support: callers can interrupt naturally at any time',
        'Instant escalation to human tier-2 supervisor with full call transcript',
      ],
      seoSlug: 'ai-calling-for-customer-support',
    },
    {
      id: 'finance',
      label: 'Finance & Lending',
      icon: CreditCard,
      headline: 'Gentle EMI Reminders & Instant Loan Pre-Approvals',
      badge: 'Strict RBI & TRAI Compliant',
      problem:
        'Collections calling often triggers friction, high agent attrition, and compliance headaches under TRAI and RBI fair practice guidelines. Late reminders cause portfolio slippages.',
      solution:
        'AiBotCall delivers polite, respectful conversational payment reminders within permissible calling hours (9:00 AM to 9:00 PM). It shares payment links via WhatsApp and records customer repayment promises.',
      script: {
        speaker: 'AI Collections Assistant:',
        text: '“Namaste Suresh ji! Main SwiftLoans se baat kar rahi hoon. Aapki monthly EMI ₹4,500 due date 5 October ko scheduled hai. Kya aapne payment initiate kar di hai ya main payment link WhatsApp par share kar doon?”',
        customer: '“Main kal subah pay karunga, link bhej dijiye.”',
        aiReply: '“Theek hai Suresh ji! Maine instant UPI payment link aapke WhatsApp par share kar diya hai. Kal subah payment complete karte hi aapko SMS confirmation mil jayega. Shukriya!”',
      },
      stats: [
        { label: 'On-Time EMI Recovery', val: '+28%' },
        { label: 'Compliance Adherence', val: '100% TRAI' },
        { label: 'Cost per Collection Call', val: '₹4.87 Flat' },
      ],
      features: [
        'Automated 9 AM to 9 PM TRAI calling window compliance guards',
        'Polite, respectful customer reminders without aggression',
        'Instant WhatsApp UPI QR code dispatch via sister platform AiBotFlow',
        'Customer promised-to-pay (PTP) date logging into loan management CRM',
      ],
      seoSlug: 'outbound-ai-calling',
    },
  ];

  const current = industries.find((i) => i.id === activeTab) || industries[0];

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <PublicHeader
        activePage="solutions"
        onNavigateHome={onBackToHome}
        onNavigateAbout={onGoToAbout}
        onNavigateBlog={onGoToBlog}
        onNavigateDocs={onGoToDocs}
        onNavigatePricing={onGoToPricing}
        onNavigateContact={onGoToContact}
        onNavigateLogin={onGoToLogin}
        onNavigateRegister={onGoToRegister}
        onNavigateSeoPage={onNavigateSeoPage}
        onNavigateAffiliate={onNavigateAffiliate}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-lg glow-brand-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Tailored Industry Solutions
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Who Is <span className="text-gradient-brand">AiBotCall Built For?</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            From high-velocity real estate developers and coaching institutes to clinics and B2B sales teams — discover how India’s leading businesses replace manual telecalling lag with autonomous voice AI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            {industries.map((ind) => {
              const Icon = ind.icon;
              const isSelected = ind.id === activeTab;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveTab(ind.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-brand text-white border-transparent shadow-lg glow-brand-sm scale-105'
                      : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{ind.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deep-Dive Active Industry Panel */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl glass-panel relative overflow-hidden space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-gradient-brand text-white shadow-md glow-brand-sm">
                  <current.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {current.badge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                    {current.headline}
                  </h2>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center space-x-3">
              <button
                onClick={onGoToRegister}
                className="px-6 py-3 rounded-xl bg-gradient-brand text-white font-extrabold text-xs shadow-lg glow-brand-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Deploy for {current.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Problem vs Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>The Industry Bottleneck:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {current.problem}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>The AiBotCall Autonomous Solution:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {current.solution}
              </p>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-4">
            {current.stats.map((st, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-xl sm:text-2xl font-black text-cyan-400">{st.val}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{st.label}</div>
              </div>
            ))}
          </div>

          {/* Live Conversational Dialogue Simulator */}
          <div className="p-6 rounded-2xl bg-[#070b16] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Volume2 className="w-4 h-4" />
                <span>Real Conversational Dialogue Transcript (Hindi / Hinglish / English)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Sub-500ms Latency
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-violet-400">{current.script.speaker} </span>
                <span className="text-slate-200">{current.script.text}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 pl-6">
                <span className="font-bold text-cyan-400">Customer: </span>
                <span className="text-slate-200">{current.script.customer}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-violet-400">{current.script.speaker} </span>
                <span className="text-slate-200">{current.script.aiReply}</span>
              </div>
            </div>
          </div>

          {/* Key Capabilities Bullet Points */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Included Automated Workflow Features:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid of All Industries Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Enterprise Breadth
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Universal Voice AI Across Every Vertical
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Regardless of your business model, if you call customers or receive incoming calls, AiBotCall slashes costs and drives conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                onClick={() => {
                  setActiveTab(ind.id);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all cursor-pointer space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-slate-800 group-hover:bg-gradient-brand text-cyan-400 group-hover:text-white transition-all shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
                    {ind.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {ind.label}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {ind.headline}. {ind.problem}
                </p>
                <div className="pt-2 flex items-center text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA with New 3D Logo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-violet-950/60 via-[#0d172e] to-cyan-950/60 border border-cyan-500/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-lg glow-brand-sm">
            <img src="/aibotcall-emblem.png" alt="AiBotCall" className="w-12 h-12 object-contain logo-glow" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Automate Customer Calls in Your Industry?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Get 30 free trial calling minutes. Test speech latency, barge-in response, and CRM webhook sync in 60 seconds.
          </p>

          <button
            onClick={onGoToRegister}
            className="px-8 py-4 rounded-2xl bg-gradient-brand text-white font-extrabold text-sm shadow-xl glow-brand hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center space-x-2"
          >
            <span>Start Free Trial (30 Free Mins)</span>
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
        onNavigateAffiliate={onNavigateAffiliate}
      />
    </div>
  );
};
