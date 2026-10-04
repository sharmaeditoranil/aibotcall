import React, { useEffect, useState } from 'react';
import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';
import { SEO_PAGES_DATA, SeoPageData } from '../data/seoPagesData';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Bot,
  CreditCard,
  Send,
  Globe,
  Volume2,
  ShieldCheck,
  FileText,
  Users,
  Lock,
  TrendingUp,
  PhoneCall,
  BookOpen,
  Layers,
  FileCode,
  Activity,
  RefreshCw,
  Calendar,
  Clock,
  MessageSquare,
  Award,
  Cpu,
  Plug,
  Search,
  Building,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Check,
  Phone,
  HelpCircle,
} from 'lucide-react';

interface SeoLandingPageProps {
  slug: string;
  onBackToHome: () => void;
  onGoToAbout: () => void;
  onGoToBlog: () => void;
  onGoToDocs?: () => void;
  onGoToPricing: () => void;
  onGoToContact: () => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onNavigateDocs?: () => void;
  onNavigatePolicy: (policy: 'terms' | 'privacy' | 'refund' | 'security' | 'data-privacy' | 'call-consent-policy') => void;
  onNavigateSeoPage?: (slug: string) => void;
}

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({
  slug,
  onBackToHome,
  onGoToAbout,
  onGoToBlog,
  onGoToDocs,
  onGoToPricing,
  onGoToContact,
  onGoToLogin,
  onGoToRegister,
  onNavigateDocs,
  onNavigatePolicy,
  onNavigateSeoPage,
}) => {
  const pageData: SeoPageData = SEO_PAGES_DATA[slug] || SEO_PAGES_DATA['ai-voice-calling-software'];
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Dynamic document title, meta description & JSON-LD injection
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = pageData.metaTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageData.metaDescription);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://voice.aibotflow.in/${pageData.slug}/`);

    // Dynamic FAQ Schema Script
    const existingScript = document.getElementById('seo-faq-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (pageData.faqs && pageData.faqs.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: pageData.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      };

      const script = document.createElement('script');
      script.id = 'seo-faq-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(faqSchema);
      document.head.appendChild(script);
    }
  }, [slug, pageData]);

  // Icon resolver
  const renderIcon = (iconName: string) => {
    const iconClass = 'w-5 h-5 text-cyan-400';
    switch (iconName) {
      case 'Zap': return <Zap className={iconClass} />;
      case 'Bot': return <Bot className={iconClass} />;
      case 'CreditCard': return <CreditCard className={iconClass} />;
      case 'Send': return <Send className={iconClass} />;
      case 'Globe': return <Globe className={iconClass} />;
      case 'Volume2': return <Volume2 className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'FileText': return <FileText className={iconClass} />;
      case 'Users': return <Users className={iconClass} />;
      case 'Lock': return <Lock className={iconClass} />;
      case 'TrendingUp': return <TrendingUp className={iconClass} />;
      case 'PhoneCall': return <PhoneCall className={iconClass} />;
      case 'BookOpen': return <BookOpen className={iconClass} />;
      case 'Layers': return <Layers className={iconClass} />;
      case 'FileCode': return <FileCode className={iconClass} />;
      case 'Activity': return <Activity className={iconClass} />;
      case 'RefreshCw': return <RefreshCw className={iconClass} />;
      case 'Calendar': return <Calendar className={iconClass} />;
      case 'Clock': return <Clock className={iconClass} />;
      case 'MessageSquare': return <MessageSquare className={iconClass} />;
      case 'Award': return <Award className={iconClass} />;
      case 'Cpu': return <Cpu className={iconClass} />;
      case 'Plug': return <Plug className={iconClass} />;
      case 'Search': return <Search className={iconClass} />;
      case 'Building': return <Building className={iconClass} />;
      case 'GraduationCap': return <GraduationCap className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Background Aurora Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[700px] h-[400px] bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-[130px]" />
        <div className="absolute top-1/3 right-10 w-[600px] h-[450px] bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent rounded-full blur-[140px]" />
      </div>

      {/* Unified Public Header */}
      <PublicHeader
        onNavigateHome={onBackToHome}
        onNavigateAbout={onGoToAbout}
        onNavigateBlog={onGoToBlog}
        onNavigateDocs={onGoToDocs || onNavigateDocs}
        onNavigatePricing={onGoToPricing}
        onNavigateContact={onGoToContact}
        onNavigateLogin={onGoToLogin}
        onNavigateRegister={onGoToRegister}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-16">
        {/* Breadcrumb Navigation with Semantic Schema */}
        <nav aria-label="Breadcrumb" className="pt-2">
          <ol className="flex items-center space-x-2 text-xs text-slate-400">
            <li>
              <button
                onClick={onBackToHome}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Home
              </button>
            </li>
            <li className="text-slate-600">/</li>
            <li className="text-slate-400 font-medium">{pageData.categoryLabel}</li>
            <li className="text-slate-600">/</li>
            <li className="text-cyan-300 font-bold truncate max-w-[200px] sm:max-w-md">
              {pageData.primaryKeyword}
            </li>
          </ol>
        </nav>

        {/* Hero Section with Exact Single H1 */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#131d35]/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{pageData.heroBadge}</span>
            <span className="text-slate-600">|</span>
            <span className="text-violet-300 font-medium">Flat ₹4.87 / Min</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            {pageData.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {pageData.tagline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onGoToRegister}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-brand hover:brightness-110 text-white font-bold text-sm shadow-xl glow-brand-sm transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Start Free Trial (30 Free Mins)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToContact}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#131d35] hover:bg-[#182542] text-slate-200 border border-slate-700/80 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Book Live Architecture Demo</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sub-500ms Audio Latency</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Native Hindi & Indian Cadence</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>TRAI DLT & DND Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Instant CRM & WhatsApp Sync</span>
            </div>
          </div>
        </section>

        {/* Generative AI / GEO Answer Box (Answer Engine Optimization) */}
        <section className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#131d35] to-[#0f172a] border border-cyan-500/40 shadow-xl relative overflow-hidden">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 shrink-0 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {pageData.geoAnswerBlock.question}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {pageData.geoAnswerBlock.answer}
              </p>
            </div>
          </div>
        </section>

        {/* Deep Overview Section */}
        <section className="max-w-4xl mx-auto space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          {pageData.overview.map((paragraph, idx) => (
            <p key={idx} className="p-5 rounded-2xl bg-[#0e1628]/70 border border-slate-800/80">
              {paragraph}
            </p>
          ))}
        </section>

        {/* Visual Product Workflow Diagram */}
        {pageData.workflowSteps && pageData.workflowSteps.length > 0 && (
          <section className="max-w-5xl mx-auto p-8 rounded-3xl bg-[#10192e] border border-slate-800 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Automated Pipeline</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {pageData.workflowTitle || 'End-to-End Voice AI Workflow'}
              </h2>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">
                How AiBotCall autonomously turns leads into revenue with human-level conversation in under 5 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {pageData.workflowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#14203b]/80 border border-slate-700/60 relative group hover:border-cyan-500/50 transition-all flex items-start space-x-3"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-brand text-white text-xs font-black shrink-0 shadow-md">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Step {idx + 1}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core Capabilities Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Features Built for {pageData.primaryKeyword}
            </h2>
            <p className="text-xs text-slate-400">
              Battle-tested telephony infrastructure, OpenAI Realtime models, and transparent billing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {pageData.keyCapabilities.map((cap, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-[#121c33]/80 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 group shadow-lg"
              >
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 w-fit group-hover:scale-110 transition-transform">
                  {renderIcon(cap.iconName)}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {cap.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Industry Use Cases Section (if available) */}
        {pageData.industryUseCases && (
          <section className="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-[#111a30] to-[#152342] border border-violet-500/30 space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Award className="w-5 h-5 text-violet-400" />
              <span>{pageData.industryUseCases.headline}</span>
            </h2>
            <ul className="space-y-3">
              {pageData.industryUseCases.points.map((pt, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Contextual Synergy Banner (AiBotCall + AiBotFlow) */}
        <section className="max-w-4xl mx-auto p-6 rounded-3xl bg-[#131d35] border border-cyan-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Omnichannel Architecture
            </span>
            <h3 className="text-base font-bold text-white">
              Power Your Calls with AiBotFlow WhatsApp Automation
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              AiBotCall conducts the live phone call, while sister platform{' '}
              <a
                href="https://aibotflow.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 font-semibold underline hover:text-white"
              >
                AiBotFlow
              </a>{' '}
              delivers official WhatsApp brochures, catalogs, and CRM pipelines.
            </p>
          </div>
          <a
            href="https://aibotflow.in"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shrink-0 flex items-center space-x-2"
          >
            <span>Visit AiBotFlow CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </section>

        {/* Frequently Asked Questions */}
        {pageData.faqs && pageData.faqs.length > 0 && (
          <section className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Frequently Asked Questions about {pageData.primaryKeyword}
              </h2>
              <p className="text-xs text-slate-400">
                Everything you need to know regarding implementation, pricing, and compliance.
              </p>
            </div>

            <div className="space-y-3">
              {pageData.faqs.map((faq, i) => {
                const isOpen = expandedFaq === i;
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-[#0f172a]/90 border border-slate-800 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : i)}
                      className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{faq.q}</span>
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
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
        )}

        {/* Related Category Cross-Links for Internal SEO Link Equity */}
        {pageData.relatedSlugs && pageData.relatedSlugs.length > 0 && (
          <section className="max-w-4xl mx-auto p-6 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Related Capabilities & Solutions:
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {pageData.relatedSlugs.map((relSlug) => {
                const relPage = SEO_PAGES_DATA[relSlug];
                if (!relPage) return null;
                return (
                  <button
                    key={relSlug}
                    onClick={() => onNavigateSeoPage?.(relSlug)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>{relPage.primaryKeyword}</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                  </button>
                );
              })}
              <button
                onClick={onGoToPricing}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <span>Pricing (Flat ₹4.87/min)</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
          </section>
        )}

        {/* Final Conversion CTA Banner */}
        <section className="max-w-5xl mx-auto pt-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-950/70 via-[#0e172a] to-cyan-950/70 border border-cyan-500/40 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Ready to Experience AI Voice Calling on Your Own Phone?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Sign up in 30 seconds and receive 30 free minutes to test human-like Indian speech quality, instant barge-in, and CRM webhook dispatch live.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onGoToRegister}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-brand hover:brightness-110 text-white font-bold text-xs shadow-xl glow-brand-sm transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Start Free Trial (30 Mins)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onGoToPricing}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  View Transparent Pricing
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Unified Public Footer */}
      <PublicFooter
        onNavigateHome={onBackToHome}
        onNavigateAbout={onGoToAbout}
        onNavigateBlog={onGoToBlog}
        onNavigateDocs={onGoToDocs || onNavigateDocs}
        onNavigatePricing={onGoToPricing}
        onNavigateContact={onGoToContact}
        onNavigateLogin={onGoToLogin}
        onNavigateRegister={onGoToRegister}
        onNavigatePolicy={onNavigatePolicy}
      />
    </div>
  );
};
