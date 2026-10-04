import React, { useState } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export interface PublicHeaderProps {
  activePage?: 'home' | 'about' | 'blog' | 'pricing' | 'contact' | 'terms' | 'privacy' | 'refund';
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateBlog: () => void;
  onNavigatePricing: () => void;
  onNavigateContact: () => void;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePage = 'home',
  onNavigateHome,
  onNavigateAbout,
  onNavigateBlog,
  onNavigatePricing,
  onNavigateContact,
  onNavigateLogin,
  onNavigateRegister,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', action: onNavigateHome },
    { id: 'about', label: 'About Us', action: onNavigateAbout },
    { id: 'blog', label: 'Blog & Playbooks', action: onNavigateBlog, badge: 'New' },
    { id: 'pricing', label: 'Pricing', action: onNavigatePricing },
    { id: 'contact', label: 'Contact', action: onNavigateContact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0d1527]/92 backdrop-blur-xl border-b border-slate-700/60 px-4 sm:px-6 py-2.5 sm:py-3 transition-all shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Sleek, Perfectly-Proportioned Brand Logo */}
        <div
          onClick={() => {
            onNavigateHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer flex items-center space-x-2.5 group select-none shrink-0"
        >
          <div className="relative">
            <img
              src="/aibotcall-emblem.png"
              alt="AiBotCall"
              className="h-7 w-7 sm:h-[30px] sm:w-[30px] object-contain logo-glow group-hover:scale-110 transition-transform duration-300"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#0d1527]"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-[17px] sm:text-[18px] font-black tracking-tight leading-none">
              <span className="text-violet-400 group-hover:brightness-125 transition-all">Ai</span>
              <span className="text-white">Bot</span>
              <span className="text-cyan-400 group-hover:brightness-125 transition-all">Call</span>
            </div>
            <span className="text-[8.5px] text-cyan-400/90 font-bold tracking-widest uppercase mt-0.5 hidden xs:inline-block">
              AI Voice Telephony
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={link.action}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold uppercase">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center space-x-2.5">
          <button
            onClick={onNavigateLogin}
            className="py-1.5 px-3.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onNavigateRegister}
            className="py-1.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:brightness-110 shadow-md glow-brand-sm transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5"
          >
            <span>Start Free Trial (30 Mins)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={onNavigateRegister}
            className="py-1.5 px-3 rounded-lg text-[11px] font-bold text-white bg-gradient-brand active:scale-95 cursor-pointer"
          >
            Try Free
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 px-2 border-t border-slate-800/80 mt-2 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                link.action();
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                activePage === link.id
                  ? 'text-cyan-300 bg-cyan-500/10 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-2">
            <button
              onClick={() => {
                onNavigateLogin();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-semibold text-slate-300 rounded-lg bg-slate-900 border border-slate-800"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onNavigateRegister();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-bold text-white bg-gradient-brand rounded-lg shadow-sm"
            >
              Start Free (30 Mins)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
