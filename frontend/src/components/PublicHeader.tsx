import React, { useState } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Bot,
  Zap,
  Building,
  GraduationCap,
  Users,
  ShieldCheck,
  BookOpen,
  Layers,
  Plug,
  Gift,
  HeartPulse,
  Briefcase,
  ShoppingBag,
  Headphones,
  CreditCard,
  TrendingUp,
} from 'lucide-react';

export interface PublicHeaderProps {
  activePage?: string;
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateBlog: () => void;
  onNavigateDocs?: () => void;
  onNavigatePricing: () => void;
  onNavigateContact: () => void;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  onNavigateSeoPage?: (slug: string) => void;
  onNavigateAffiliate?: () => void;
  onNavigateWhoItsFor?: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePage = 'home',
  onNavigateHome,
  onNavigateAbout,
  onNavigateBlog,
  onNavigateDocs,
  onNavigatePricing,
  onNavigateContact,
  onNavigateLogin,
  onNavigateRegister,
  onNavigateSeoPage,
  onNavigateAffiliate,
  onNavigateWhoItsFor,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productMegaOpen, setProductMegaOpen] = useState(false);
  const [solutionsMegaOpen, setSolutionsMegaOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  const productFeatures = [
    {
      slug: 'inbound-ai-call-agent',
      label: 'Inbound AI Receptionist',
      desc: '24/7 Virtual Voice Agent & Zero Customer Wait Time',
      icon: PhoneCall,
      tag: 'Zero Wait',
    },
    {
      slug: 'outbound-ai-calling',
      label: 'Outbound AI Calling',
      desc: 'Autonomous Lead Dialing & BANT Qualification',
      icon: Zap,
      tag: '5s Dial',
    },
    {
      slug: 'ai-call-broadcast',
      label: 'Mass Voice Broadcast',
      desc: 'Broadcast 10,000+ AI Voice Calls Concurrently',
      icon: Layers,
      tag: 'High Scale',
    },
    {
      slug: 'website-lead-calling',
      label: 'Website Lead Callback',
      desc: 'Instant Webhook Triggers from WordPress, Shopify, Meta',
      icon: Bot,
      tag: '<5 Sec',
    },
    {
      slug: 'ai-call-automation',
      label: 'Webhook & REST APIs',
      desc: 'HMAC SHA-256 Authenticated Call Event Telephony',
      icon: Plug,
      tag: 'Dev Ready',
    },
    {
      slug: 'ai-voice-agent-india',
      label: 'Bilingual Speech-to-Speech',
      desc: 'Authentic Hindi, Hinglish & English Cadence (<500ms)',
      icon: Users,
      tag: 'Indian Voice',
    },
  ];

  const industrySolutions = [
    {
      slug: 'ai-voice-agent-for-real-estate',
      label: 'Real Estate & Developers',
      desc: 'Site visits, budget qualification & floor plan discussions',
      icon: Building,
      stat: '+380% Visits',
    },
    {
      slug: 'ai-calling-for-coaching-institutes',
      label: 'Coaching & Universities',
      desc: 'Student counseling, fee FAQs & demo lecture bookings',
      icon: GraduationCap,
      stat: '52% Demo Rate',
    },
    {
      slug: 'ai-calling-for-healthcare',
      label: 'Clinics & Hospitals',
      desc: 'Doctor OPD appointments & pre-test fasting prep calls',
      icon: HeartPulse,
      stat: '-44% No-shows',
    },
    {
      slug: 'ai-calling-for-sales-teams',
      label: 'B2B & Sales SDR Teams',
      desc: 'Speed-to-lead follow-up, cold qualification & warm transfers',
      icon: Briefcase,
      stat: '350% Contact',
    },
    {
      slug: 'ai-voice-calling-software',
      label: 'E-Commerce & D2C Brands',
      desc: 'COD order verification, address validation & cart recovery',
      icon: ShoppingBag,
      stat: '-30% RTO Loss',
    },
    {
      slug: 'ai-calling-for-customer-support',
      label: 'Customer Support Desks',
      desc: 'Tier-1 ticket resolution, order tracking & 24/7 helpdesk',
      icon: Headphones,
      stat: '0s Hold Time',
    },
  ];

  const handleSeoNavigate = (slug: string) => {
    if (onNavigateSeoPage) {
      onNavigateSeoPage(slug);
    } else {
      window.location.href = `/${slug}/`;
    }
    setProductMegaOpen(false);
    setSolutionsMegaOpen(false);
    setResourcesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleAffiliateClick = () => {
    if (onNavigateAffiliate) {
      onNavigateAffiliate();
    } else {
      onNavigateRegister();
    }
    setProductMegaOpen(false);
    setSolutionsMegaOpen(false);
    setMobileMenuOpen(false);
  };

  const handleWhoItsForClick = () => {
    if (onNavigateWhoItsFor) {
      onNavigateWhoItsFor();
    } else {
      handleSeoNavigate('ai-voice-calling-software');
    }
    setProductMegaOpen(false);
    setSolutionsMegaOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#090e1a]/95 backdrop-blur-2xl border-b border-slate-700/60 px-4 sm:px-8 py-3 sm:py-4 transition-all shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo with Official 3D Emblem & Glow */}
        <div
          onClick={() => {
            onNavigateHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer flex items-center space-x-3 group select-none shrink-0"
        >
          <div className="relative">
            <img
              src="/aibotcall-emblem.png"
              alt="AiBotCall"
              className="h-8.5 w-8.5 sm:h-9 sm:w-9 object-contain logo-glow group-hover:scale-110 transition-transform duration-300"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#0d1527]"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-[19px] sm:text-[21px] font-black tracking-tight leading-none">
              <span className="text-violet-400 group-hover:brightness-125 transition-all">Ai</span>
              <span className="text-white">Bot</span>
              <span className="text-cyan-400 group-hover:brightness-125 transition-all">Call</span>
            </div>
            <span className="text-[9px] text-cyan-400/90 font-bold tracking-widest uppercase mt-0.5 hidden xs:inline-block">
              AI Voice Telephony
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links with Creative Mega Menus */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
          {/* Home */}
          <button
            onClick={onNavigateHome}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activePage === 'home'
                ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>

          {/* Product Creative Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setProductMegaOpen(true)}
            onMouseLeave={() => setProductMegaOpen(false)}
          >
            <button
              onClick={() => setProductMegaOpen(!productMegaOpen)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                productMegaOpen
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>Product</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${productMegaOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {productMegaOpen && (
              <div className="absolute top-full -left-20 w-[660px] p-5 rounded-3xl bg-[#0b1222] border border-cyan-500/30 shadow-2xl backdrop-blur-2xl animate-fade-in z-50 grid grid-cols-12 gap-5">
                {/* 2 Columns of Core Features */}
                <div className="col-span-8 grid grid-cols-2 gap-2.5">
                  {productFeatures.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => handleSeoNavigate(item.slug)}
                      className="p-2.5 rounded-2xl hover:bg-slate-800/80 text-left transition-all flex items-start space-x-2.5 cursor-pointer group border border-transparent hover:border-slate-700/80"
                    >
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-gradient-brand group-hover:text-white transition-all shrink-0 mt-0.5 shadow-sm">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {item.label}
                          </p>
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-snug line-clamp-2 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right Callout Spotlight Card */}
                <div className="col-span-4 p-4 rounded-2xl bg-gradient-to-br from-violet-950/50 via-slate-900 to-cyan-950/50 border border-slate-700/80 flex flex-col justify-between text-left">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <img src="/aibotcall-emblem.png" alt="AiBotCall" className="w-7 h-7 object-contain logo-glow" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                        Speed-to-Lead
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-white leading-snug">
                      Calls Website Leads in Under 5 Seconds
                    </h4>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      Autonomously qualifies prospective buyers with natural Hindi & English speech.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <button
                      onClick={onNavigateRegister}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-brand text-white font-extrabold text-[11px] shadow-md glow-brand-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <span>Claim 30 Free Mins</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Solutions Creative Mega Menu ("Kiske Kiske Liye Hai") */}
          <div
            className="relative"
            onMouseEnter={() => setSolutionsMegaOpen(true)}
            onMouseLeave={() => setSolutionsMegaOpen(false)}
          >
            <button
              onClick={() => setSolutionsMegaOpen(!solutionsMegaOpen)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                solutionsMegaOpen || activePage === 'solutions'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>Solutions</span>
              <span className="px-1.5 py-0.2 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Industries
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${solutionsMegaOpen ? 'rotate-180 text-violet-400' : ''}`} />
            </button>

            {solutionsMegaOpen && (
              <div className="absolute top-full -left-28 w-[680px] p-5 rounded-3xl bg-[#0b1222] border border-violet-500/30 shadow-2xl backdrop-blur-2xl animate-fade-in z-50 space-y-3">
                {/* Top Banner Button: View All Industries */}
                <div
                  onClick={handleWhoItsForClick}
                  className="p-3 rounded-2xl bg-gradient-to-r from-violet-950/60 via-slate-900 to-cyan-950/60 border border-violet-500/40 hover:border-cyan-400 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-gradient-brand text-white shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                        Who Is AiBotCall Built For? (Explore All Industries & Live Scripts)
                      </p>
                      <p className="text-[10px] text-slate-400">
                        See tailored solutions, conversational Hindi/English audio scripts, and ROI metrics →
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* 2-Column Grid of 6 Industry Solutions */}
                <div className="grid grid-cols-2 gap-2.5">
                  {industrySolutions.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => handleSeoNavigate(item.slug)}
                      className="p-2.5 rounded-2xl hover:bg-slate-800/80 text-left transition-all flex items-start space-x-2.5 cursor-pointer group border border-transparent hover:border-slate-700/80"
                    >
                      <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-gradient-brand group-hover:text-white transition-all shrink-0 mt-0.5 shadow-sm">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                            {item.label}
                          </p>
                          <span className="text-[9px] font-bold text-emerald-400 font-mono">
                            {item.stat}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-snug line-clamp-2 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reseller & Affiliate Partner Program Button */}
          <button
            onClick={handleAffiliateClick}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 group border ${
              activePage === 'affiliate'
                ? 'bg-gradient-to-r from-violet-950 to-cyan-950 border-cyan-400 text-white shadow-md glow-brand-sm'
                : 'bg-slate-900/80 hover:bg-slate-800 text-cyan-300 hover:text-white border-cyan-500/40'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Reseller & Affiliate</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-sm">
              25% Comm
            </span>
          </button>

          {/* Pricing */}
          <button
            onClick={onNavigatePricing}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activePage === 'pricing'
                ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>Pricing</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
              ₹4.87/m
            </span>
          </button>

          {/* Documentation & Developer Hub */}
          <button
            onClick={() => onNavigateDocs ? onNavigateDocs() : handleSeoNavigate('docs')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activePage === 'docs'
                ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>Docs</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
              API
            </span>
          </button>
        </nav>

        {/* Action Buttons Right */}
        <div className="hidden sm:flex items-center space-x-2.5">
          <button
            onClick={onNavigateLogin}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onNavigateRegister}
            className="px-4.5 py-2.5 rounded-xl bg-gradient-brand hover:brightness-110 text-white text-xs font-black shadow-lg glow-brand-sm transition-all duration-200 active:scale-95 cursor-pointer flex items-center space-x-1.5"
          >
            <span>30 Free Mins</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-4 rounded-3xl bg-[#0b1222] border border-slate-700/80 shadow-2xl animate-fade-in space-y-3 max-h-[80vh] overflow-y-auto">
          {/* Reseller Banner Highlight */}
          <button
            onClick={handleAffiliateClick}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-violet-950/60 via-slate-900 to-cyan-950/60 border border-cyan-500/40 text-left flex items-center justify-between group"
          >
            <div className="flex items-center space-x-2.5">
              <Gift className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-bold text-white">Reseller & Affiliate Program</span>
                <span className="block text-[10px] text-slate-400">Earn 25% recurring lifetime commission</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950">
              25% Comm
            </span>
          </button>

          {/* Solutions / Who It's For Highlight */}
          <button
            onClick={handleWhoItsForClick}
            className="w-full p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left flex items-center justify-between"
          >
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <div>
                <span className="text-xs font-bold text-white">Who It's For (All Industries)</span>
                <span className="block text-[10px] text-slate-400">Real estate, coaching, clinics, sales, support</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
          </button>

          <div className="border-t border-slate-800 pt-2 space-y-1">
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-left text-xs font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-800"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigatePricing();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-left text-xs font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Pricing Plans</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                Flat ₹4.87/m
              </span>
            </button>
            <button
              onClick={() => {
                if (onNavigateDocs) onNavigateDocs();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-left text-xs font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-800"
            >
              Documentation & Guides
            </button>
            <button
              onClick={() => {
                onNavigateBlog();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-left text-xs font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-800"
            >
              Engineering Blog
            </button>
          </div>

          {/* Industry Slugs Quick List */}
          <div className="border-t border-slate-800 pt-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Popular Industry Solutions:
            </p>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {industrySolutions.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleSeoNavigate(item.slug)}
                  className="py-1.5 px-2.5 text-left text-slate-300 hover:text-cyan-300 rounded-lg hover:bg-slate-800/60 truncate"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center space-x-2">
            <button
              onClick={() => {
                onNavigateLogin();
                setMobileMenuOpen(false);
              }}
              className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold text-center"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onNavigateRegister();
                setMobileMenuOpen(false);
              }}
              className="w-1/2 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold text-center shadow-md"
            >
              Claim 30 Mins
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
