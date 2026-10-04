import React, { useState } from 'react';
import { Menu, X, ArrowRight, ChevronDown, Sparkles, PhoneCall, Bot, Zap, Building, GraduationCap, Users, ShieldCheck, BookOpen, Layers, Plug } from 'lucide-react';

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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  const productLinks = [
    { slug: 'inbound-ai-call-agent', label: 'Inbound AI Call Agent', desc: '24/7 Smart Receptionist & Zero Wait Time', icon: PhoneCall },
    { slug: 'outbound-ai-calling', label: 'Outbound AI Calling', desc: 'Automated Lead Outreach & Qualification', icon: Zap },
    { slug: 'ai-call-broadcast', label: 'AI Call Broadcast', desc: 'High-Volume Voice Campaigns in Minutes', icon: Layers },
    { slug: 'website-lead-calling', label: 'Website Lead Calling', desc: '5-Second Automated Webhook Dispatch', icon: Bot },
    { slug: 'ai-call-automation', label: 'Webhook & API Automation', desc: 'HMAC-Signed Real-time Telephony APIs', icon: Plug },
    { slug: 'ai-voice-calling-software', label: 'AI Voice Calling Software', desc: 'Full Platform Capabilities & Architecture', icon: Sparkles },
    { slug: 'ai-voice-agent-india', label: 'AI Voice Agent India', desc: 'Bilingual Hindi/English Conversational AI', icon: Users },
  ];

  const solutionLinks = [
    { slug: 'ai-voice-agent-for-real-estate', label: 'Real Estate', desc: 'Site Visits & Property Buyer Qualification', icon: Building },
    { slug: 'ai-calling-for-education', label: 'Universities & Colleges', desc: 'Admissions Counseling & Exam Reminders', icon: GraduationCap },
    { slug: 'ai-calling-for-coaching-institutes', label: 'Coaching Institutes', desc: 'Demo Class Bookings & Parent Counseling', icon: BookOpen },
    { slug: 'ai-calling-for-healthcare', label: 'Healthcare & Clinics', desc: 'Doctor OPD Bookings & Diagnostic Prep', icon: ShieldCheck },
    { slug: 'ai-calling-for-sales-teams', label: 'Sales Development', desc: 'MQL to SQL Qualification & Warm Transfers', icon: Zap },
    { slug: 'ai-calling-for-customer-support', label: 'Customer Support', desc: 'Tier-1 Helpdesk & Order Tracking Lookups', icon: PhoneCall },
  ];

  const resourceLinks = [
    { action: () => onNavigateDocs ? onNavigateDocs() : onNavigateBlog(), label: 'Documentation & Guides', desc: 'API Reference, Webhooks & Quickstart', icon: BookOpen },
    { action: () => onNavigateBlog(), label: 'Blog & Engineering Playbooks', desc: 'Voice AI Case Studies & Conversion Tips', icon: Sparkles },
    { slug: 'ai-lead-follow-up', label: 'Speed-to-Lead Follow-Up', desc: 'Multi-touch Sales Cadence Strategies', icon: Zap },
    { slug: 'ai-appointment-booking', label: 'Appointment Booking', desc: 'Voice Calendar Scheduling & Reminders', icon: PhoneCall },
  ];

  const handleSeoNavigate = (slug: string) => {
    if (onNavigateSeoPage) {
      onNavigateSeoPage(slug);
    } else {
      window.location.href = `/${slug}/`;
    }
    setProductDropdownOpen(false);
    setSolutionsDropdownOpen(false);
    setResourcesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d1527]/95 backdrop-blur-xl border-b border-slate-700/60 px-4 sm:px-8 py-3.5 sm:py-4.5 transition-all shadow-lg shadow-black/15">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Sleek Brand Logo with Official 3D Emblem */}
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
              className="h-8 w-8 sm:h-[34px] sm:w-[34px] object-contain logo-glow group-hover:scale-110 transition-transform duration-300"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#0d1527]"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-[18px] sm:text-[20px] font-black tracking-tight leading-none">
              <span className="text-violet-400 group-hover:brightness-125 transition-all">Ai</span>
              <span className="text-white">Bot</span>
              <span className="text-cyan-400 group-hover:brightness-125 transition-all">Call</span>
            </div>
            <span className="text-[9px] text-cyan-400/90 font-bold tracking-widest uppercase mt-0.5 hidden xs:inline-block">
              AI Voice Telephony
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links with Clean Dropdowns */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
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

          {/* Product Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProductDropdownOpen(true)}
            onMouseLeave={() => setProductDropdownOpen(false)}
          >
            <button
              onClick={() => setProductDropdownOpen(!productDropdownOpen)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer flex items-center space-x-1"
            >
              <span>Product</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${productDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {productDropdownOpen && (
              <div className="absolute top-full left-0 w-80 p-2.5 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl backdrop-blur-xl animate-fade-in z-50 space-y-1">
                {productLinks.map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => handleSeoNavigate(item.slug)}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors flex items-start space-x-3 cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-105 transition-all mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setSolutionsDropdownOpen(true)}
            onMouseLeave={() => setSolutionsDropdownOpen(false)}
          >
            <button
              onClick={() => setSolutionsDropdownOpen(!solutionsDropdownOpen)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer flex items-center space-x-1"
            >
              <span>Solutions</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${solutionsDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {solutionsDropdownOpen && (
              <div className="absolute top-full left-0 w-80 p-2.5 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl backdrop-blur-xl animate-fade-in z-50 space-y-1">
                {solutionLinks.map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => handleSeoNavigate(item.slug)}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors flex items-start space-x-3 cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 group-hover:scale-105 transition-all mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Integrations */}
          <button
            onClick={() => handleSeoNavigate('integrations')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activePage === 'integrations'
                ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Integrations
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

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setResourcesDropdownOpen(true)}
            onMouseLeave={() => setResourcesDropdownOpen(false)}
          >
            <button
              onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer flex items-center space-x-1"
            >
              <span>Resources</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${resourcesDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {resourcesDropdownOpen && (
              <div className="absolute top-full right-0 w-80 p-2.5 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl backdrop-blur-xl animate-fade-in z-50 space-y-1">
                {resourceLinks.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                        setResourcesDropdownOpen(false);
                      } else if (item.slug) {
                        handleSeoNavigate(item.slug);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors flex items-start space-x-3 cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-105 transition-all mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* About */}
          <button
            onClick={onNavigateAbout}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activePage === 'about'
                ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            About
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onNavigateLogin}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onNavigateRegister}
            className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:brightness-110 shadow-lg glow-brand-sm transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
          >
            <span>Start Free Trial (30 Mins)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={onNavigateRegister}
            className="py-2 px-3.5 rounded-xl text-[11px] font-bold text-white bg-gradient-brand active:scale-95 cursor-pointer shadow-md"
          >
            Try Free
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-300 hover:text-white rounded-xl bg-slate-800/70 border border-slate-700/60 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Accordion Links */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-4 pb-4 px-3 border-t border-slate-800/80 mt-3 space-y-2 animate-fade-in max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white text-center"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigatePricing();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-bold text-emerald-300 text-center"
            >
              Pricing (₹4.87/m)
            </button>
          </div>

          {/* Product links */}
          <div className="space-y-1 pt-2 border-t border-slate-800/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 mb-1">
              AI Voice Capabilities
            </p>
            {productLinks.slice(0, 5).map((item) => (
              <button
                key={item.slug}
                onClick={() => handleSeoNavigate(item.slug)}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/50 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 -rotate-90" />
              </button>
            ))}
          </div>

          {/* Solution links */}
          <div className="space-y-1 pt-2 border-t border-slate-800/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400 px-2 mb-1">
              Industry Solutions
            </p>
            {solutionLinks.slice(0, 5).map((item) => (
              <button
                key={item.slug}
                onClick={() => handleSeoNavigate(item.slug)}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/50 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 -rotate-90" />
              </button>
            ))}
          </div>

          {/* Resources & Info */}
          <div className="space-y-1 pt-2 border-t border-slate-800/60">
            <button
              onClick={() => {
                if (onNavigateDocs) onNavigateDocs();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              Developer Docs
            </button>
            <button
              onClick={() => {
                onNavigateBlog();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              Blog & Playbooks
            </button>
            <button
              onClick={() => {
                handleSeoNavigate('integrations');
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              Integrations (WhatsApp & CRM)
            </button>
            <button
              onClick={() => {
                onNavigateAbout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              About Us
            </button>
            <button
              onClick={() => {
                onNavigateContact();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              Contact Support
            </button>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800/60 flex items-center space-x-2">
            <button
              onClick={() => {
                onNavigateLogin();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-300 rounded-xl bg-slate-900 border border-slate-800"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onNavigateRegister();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-gradient-brand rounded-xl shadow-md"
            >
              Start Free (30 Mins)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
