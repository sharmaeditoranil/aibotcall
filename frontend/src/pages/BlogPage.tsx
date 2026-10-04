import React, { useState } from 'react';
import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';
import {
  ArrowLeft,
  Sparkles,
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Share2,
  ExternalLink,
  Bot,
  PhoneCall,
  MessageSquare,
  Users,
  X,
  Zap,
} from 'lucide-react';

interface BlogPageProps {
  onBackToHome: () => void;
  onGoToAbout: () => void;
  onGoToContact: () => void;
  onGoToPricing: () => void;
  onGoToRegister: () => void;
  onGoToLogin: () => void;
  onGoToDocs?: () => void;
  onNavigateDocs?: () => void;
  onNavigatePolicy?: (policy: 'terms' | 'privacy' | 'refund') => void;
}

interface Article {
  id: string;
  category: 'ai_voice' | 'whatsapp' | 'deliverability' | 'compliance' | 'conversion';
  categoryLabel: string;
  badgeColor: string;
  title: string;
  summary: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  tags: string[];
  content: string[];
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onBackToHome,
  onGoToAbout,
  onGoToContact,
  onGoToPricing,
  onGoToRegister,
  onGoToLogin,
  onGoToDocs,
  onNavigateDocs,
  onNavigatePolicy,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: 'ai-voice-telephony-playbook-2026',
      category: 'ai_voice',
      categoryLabel: 'AI Voice Calling',
      badgeColor: 'border-violet-500/30 text-violet-400 bg-violet-500/10',
      title: 'How AI Voice Telephony & 5-Second Callbacks Drive 4X Deal Conversions in 2026',
      summary:
        'When a prospect submits a lead form, intent drops 80% within 15 minutes. Discover the exact architecture behind 5-second autonomous voice callbacks and natural conversational qualification.',
      readTime: '8 min read',
      date: 'Oct 2026',
      author: 'Anil Sharma',
      authorRole: 'Founder & Creative Technologist',
      tags: ['5-Second Callback', 'High-Intent Dialing', 'Real-Time Barge-In', 'Deal Conversion'],
      content: [
        'In today’s hyper-competitive digital landscape, lead response speed is the single most predictive metric for deal conversion. Industry analytics prove that calling a website lead within the first 5 minutes increases conversion rates by more than 400% compared to a 30-minute delay.',
        'Traditional call centers suffer from manual agent lag, busy queues, and high attrition. AiBotCall replaces manual dialing with an autonomous two-way AI voice engine that connects directly to the prospect’s phone within 5 seconds of form submission.',
        'Key Architecture Pillars:',
        '1. Sub-Second Speech-to-Speech Engine: Natural Hindi, Hinglish, and English voice synthesis that understands conversational nuances, fillers, and accents without awkward robotic latency.',
        '2. Real-Time Interruption (Barge-In): The customer can speak at any second to interrupt the AI. The system immediately halts voice playback and parses the customer statement seamlessly.',
        '3. Live Dynamic Knowledge Base: The voice agent queries your course catalog, branch locations, batch fees, or property specifications via secure server-side tools in real time.',
        '4. Deal CRM Automated Webhook: Full call transcripts, qualification tags (HOT, WARM, COLD), and audio recordings are instantly pushed to your Deal CRM or WhatsApp inbox.',
      ],
    },
    {
      id: 'green-tick-verification-guide-2026',
      category: 'whatsapp',
      categoryLabel: 'Meta Verification',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      title: 'How to Get Official WhatsApp Green Tick Verification in 2026: Complete Step-by-Step Guide',
      summary:
        'The definitive roadmap to achieving Meta Official Business Account (OBA) status. Avoid the common rejection traps faced by Indian businesses with required GST, MSME, and MCA documentation checklists.',
      readTime: '9 min read',
      date: 'Sep 2026',
      author: 'Anil Sharma',
      authorRole: 'Founder, AiBotCall & Ai Botflow',
      tags: ['Meta Green Tick', 'Official Business Account', 'GST REG-06', 'Appeal Script'],
      content: [
        'A verified Green Tick badge beside your business name on WhatsApp instantly establishes trust, increases message open rates above 95%, and displays your official company name even if the customer has not saved your contact.',
        'Why Most First-Time Indian Applications Get Rejected:',
        'Over 60% of rejections occur due to mismatched company names between Meta Business Manager and the official GST REG-06 certificate, or failure to demonstrate organic brand notability in Tier 1 digital news publications.',
        'The Step-by-Step Verification Blueprint:',
        'Step 1: Ensure Two-Factor Authentication is active on your Meta Business Portfolio.',
        'Step 2: Submit your exact legal name matching your MCA Certificate of Incorporation or GST registration.',
        'Step 3: Provide 3 to 5 organic editorial news articles featuring your brand (press releases and sponsored advertorials are automatically flagged and rejected).',
        'Step 4: Use AiBotCall’s official Cloud API partner connection to request Tier 4 review with guaranteed direct appeal escalation.',
      ],
    },
    {
      id: 'scaling-bulk-broadcasts-without-bans',
      category: 'deliverability',
      categoryLabel: 'Deliverability & Bans',
      badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
      title: 'Scaling Bulk Voice & WhatsApp Broadcasts to 100k+ Contacts Without Carrier Bans',
      summary:
        'Why third-party browser extensions and unofficial SIM modems trigger permanent bans, and how to scale to Tier 4 unlimited broadcast campaigns through official carrier trunks safely.',
      readTime: '10 min read',
      date: 'Sep 2026',
      author: 'Core Engineering Team',
      authorRole: 'Telephony Infrastructure Specialists',
      tags: ['Carrier Trunks', 'DNC Blacklist', 'Zero Ban Guarantee', 'Quality Score Tier 4'],
      content: [
        'Broadcasting sales promotions and course updates using unofficial Chrome extensions or virtual SIM dongles violates TRAI telecommunications regulations and Meta terms of service, resulting in catastrophic phone number blacklisting.',
        'The Safe Enterprise Architecture:',
        '1. Certified Carrier Trunks: Utilizing verified PRI/SIP trunks through licensed telecom providers (Exotel) ensures 100% legal outbound dialing with registered virtual caller IDs (ExoPhones).',
        '2. Automatic DNC Suppression Registry: Every outbound broadcast campaign automatically checks your suppression list and TRAI National Do Not Call registry before initiating a call attempt.',
        '3. Intelligent Rate Limiting & Retry Schedules: Instead of flooding the carrier switch, outbound calls are queued with concurrency throttles (5 to 30 simultaneous lines) and smart 15-minute retry intervals for busy lines.',
        '4. Dynamic Template Variable Personalization: Every outbound WhatsApp message uses customized fields (First Name, Course Enquired, City) to prevent generic spam flagging.',
      ],
    },
    {
      id: 'ai-agents-vs-static-ivr',
      category: 'ai_voice',
      categoryLabel: 'AI Voice Calling',
      badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
      title: 'Autonomous AI Voice Agents vs Static IVR Phone Trees: Why Conversational AI Converts 340% Higher',
      summary:
        'Press 1 for Sales, Press 2 for Support is dead. Discover how modern LLM-driven voice assistants hold natural human conversations, handle objections, and qualify high-ticket admissions.',
      readTime: '7 min read',
      date: 'Sep 2026',
      author: 'Research & AI Labs',
      authorRole: 'Conversational Voice Engineering',
      tags: ['Static IVR vs AI', 'Voice Prompts', 'Objection Handling', '340% Lift'],
      content: [
        'Consumers despise rigid IVR menus. When forced to navigate multi-level keypress trees, over 55% of callers hang up in frustration before reaching an agent.',
        'By contrast, AiBotCall’s conversational voice assistant greets the user warmly by name in fluent Hindi, Hinglish, or English: "Namaste Aarav ji! Aapne video editing course ke liye enquiry ki thi. Kya aap classroom batch lena chahte hain ya online weekend batch?"',
        'The customer simply answers in their natural mother tongue. The agent detects intent, answers specific fee questions accurately from the knowledge base, and secures an appointment or batch enrollment in real time.',
      ],
    },
    {
      id: 'recovering-abandoned-leads-whatsapp',
      category: 'conversion',
      categoryLabel: 'Sales & Conversion',
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      title: 'Recovering 42% of Abandoned Leads on Websites Using Automated WhatsApp & Voice Call Sequences',
      summary:
        'A comprehensive case study on how local institutes and D2C brands turn abandoned website carts and half-filled forms into verified customers with automated dual-channel follow-ups.',
      readTime: '6 min read',
      date: 'Sep 2026',
      author: 'Growth Strategy Desk',
      authorRole: 'Lead Generation & Automation',
      tags: ['Abandoned Recovery', 'Dual-Channel Sync', 'WhatsApp + Voice', '42% Recovery'],
      content: [
        'Most businesses lose 60% to 70% of potential customers at the checkout or lead form stage. Relying solely on email follow-ups yields less than an 8% open rate in India.',
        'The High-Converting Dual-Channel Blueprint:',
        'Phase 1 (Minute 1): Prospect drops off without completing payment. A gentle WhatsApp message is dispatched with the pre-filled checkout link.',
        'Phase 2 (Minute 5): If unread, the AI Voice Telephony engine dials the prospect: "Hi [Name], we noticed you started registering for our Growth Masterclass. Do you have any questions about the syllabus or EMI payment options?"',
        'Phase 3 (Hour 2): A personalized WhatsApp coupon with a 4-hour countdown timer is sent to secure conversion.',
        'Result: Our partner academies and D2C merchants recover an average of 42% of previously lost drop-off leads with zero manual labor.',
      ],
    },
    {
      id: 'telephony-compliance-india-2026',
      category: 'compliance',
      categoryLabel: 'Telephony Compliance',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      title: 'The 2026 Indian Telephony Compliance Handbook: TRAI, TCCCPR & Consumer Protection Guidelines',
      summary:
        'Everything business owners need to know about transactional vs promotional voice calling, consent logs, calling time windows (9 AM to 8 PM), and avoiding statutory penalties.',
      readTime: '8 min read',
      date: 'Aug 2026',
      author: 'Legal & Regulatory Council',
      authorRole: 'Telecom Compliance Division',
      tags: ['TRAI Regulations', 'TCCCPR 2018', 'Calling Hours', 'Audit Trail'],
      content: [
        'Compliance with the Telecom Commercial Communications Customer Preference Regulations (TCCCPR 2018) is strictly enforced in India. Commercial calling without verifiable opt-in consent risks carrier line termination and regulatory scrutiny.',
        'Core Rules Every Business Must Implement:',
        '1. Permitted Calling Hours: Commercial outbound voice calls are restricted strictly between 09:00 AM and 08:00 PM IST.',
        '2. Explicit Consent Logging: Always capture timestamp, IP address, and form URL when obtaining user telephone numbers.',
        '3. Real-Time DNC Scrubbing: Number lists must be scrubbed against both your internal unsubscribe registry and the national DND database.',
        '4. AI Disclosure Standard: Under emerging consumer transparency standards, AI assistants should politely disclose their automated nature if directly questioned by callers.',
      ],
    },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Unified Public Header */}
      <PublicHeader
        activePage="blog"
        onNavigateHome={onBackToHome}
        onNavigateAbout={onGoToAbout}
        onNavigateBlog={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateDocs={onGoToDocs || onNavigateDocs}
        onNavigatePricing={onGoToPricing}
        onNavigateContact={onGoToContact}
        onNavigateLogin={onGoToLogin}
        onNavigateRegister={onGoToRegister}
      />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <section className="text-center max-w-3xl mx-auto space-y-4 relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Engineering Playbooks, Telephony & WhatsApp Growth</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Insights & Playbooks for{' '}
            <span className="text-gradient-brand">High-Performance Teams</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Actionable voice telephony architectures, Meta API compliance roadmaps, high-volume broadcasting blueprints, and AI conversion masterclasses. Zero fluff, 100% practical guidance.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search playbooks (e.g. Green Tick, 5-Second Call, 100k Broadcast, IVR)..."
                className="w-full pl-11 pr-4 py-3 bg-[#0d1424] border border-slate-800 focus:border-indigo-500 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Guides' },
              { id: 'ai_voice', label: 'AI Voice Calling' },
              { id: 'whatsapp', label: 'WhatsApp & Meta' },
              { id: 'deliverability', label: 'Deliverability & Bans' },
              { id: 'conversion', label: 'Conversion & Sales' },
              { id: 'compliance', label: 'TRAI Compliance' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-brand text-white shadow-md glow-brand-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Editorial Story */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#0d1424] to-cyan-950/30 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Editor's Masterclass</span>
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>8 min read · Updated October 2026</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {articles[0].title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {articles[0].summary}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {articles[0].tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/80 text-cyan-400 border border-slate-800 text-[11px] font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setActiveArticle(articles[0])}
                  className="py-2.5 px-6 rounded-xl bg-gradient-brand hover:opacity-90 text-white text-xs font-bold shadow-lg glow-brand-sm transition-all cursor-pointer flex items-center space-x-2"
                >
                  <span>Read Complete Playbook</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 p-0.5">
                    <img
                      src="/assets/anil_sharma.jpg"
                      alt="Anil Sharma"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Anil Sharma</p>
                    <p className="text-[10px] text-slate-400">Founder & Creative Technologist</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Highlights Box */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#090e1c] border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Inside This Blueprint:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>5-Minute response law & 400% lift</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Real-time speech interruption handling</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Live knowledge base function tools</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Deal CRM webhook automated tags</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* All Articles Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span>All Articles</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-normal">
                {filteredArticles.length} Playbooks
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="p-6 rounded-3xl bg-[#0f172a]/70 hover:bg-[#0f172a] border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl cursor-pointer group hover:scale-[1.01]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${article.badgeColor}`}
                    >
                      {article.categoryLabel}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                    {article.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{article.author}</span>
                    <span className="text-cyan-400 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-950/60 via-[#0a0f1e] to-cyan-950/60 border border-indigo-500/40 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to deploy these playbooks in your business?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Test our AI voice telephony and WhatsApp automation live right now with 30 free trial calling minutes.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onGoToRegister}
              className="py-3 px-6 rounded-xl bg-gradient-brand hover:opacity-90 text-white font-bold text-xs shadow-lg glow-brand-sm transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>Start Free Trial (30 Mins)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToContact}
              className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Talk to Solution Architect
            </button>
          </div>
        </section>
      </main>

      {/* Article Detail Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0b101e] border border-indigo-500/30 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${activeArticle.badgeColor}`}
              >
                {activeArticle.categoryLabel}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 leading-relaxed text-sm">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeArticle.title}
                </h2>
                <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                  <span>Author: <strong className="text-white">{activeArticle.author}</strong> ({activeArticle.authorRole})</span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/20 text-xs text-violet-200 leading-relaxed font-medium">
                💡 <em>Executive Summary: {activeArticle.summary}</em>
              </div>

              <div className="space-y-4 text-slate-300">
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {activeArticle.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800 text-xs"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onGoToRegister();
                  }}
                  className="py-2.5 px-5 rounded-xl bg-gradient-brand hover:opacity-90 text-white font-bold text-xs shadow-md cursor-pointer flex items-center space-x-2"
                >
                  <span>Implement This in Your Business</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Public Footer */}
      <PublicFooter
        onNavigateHome={onBackToHome}
        onNavigateAbout={onGoToAbout}
        onNavigateBlog={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateDocs={onGoToDocs || onNavigateDocs}
        onNavigatePricing={onGoToPricing}
        onNavigateContact={onGoToContact}
        onNavigateLogin={onGoToLogin}
        onNavigateRegister={onGoToRegister}
        onNavigatePolicy={onNavigatePolicy || ((p) => onBackToHome())}
      />
    </div>
  );
};
