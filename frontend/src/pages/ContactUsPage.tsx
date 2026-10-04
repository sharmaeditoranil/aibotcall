import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, ShieldCheck, Send } from 'lucide-react';

interface PolicyProps {
  onBackToHome: () => void;
}

export const ContactUsPage: React.FC<PolicyProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#080c14]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Corporate Support & Contact
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Support Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact Us & Grievance Redressal
          </h1>
          <p className="text-xs text-slate-400">
            Official business contact details and regulatory grievance officer for AiBotCall Technologies Pvt. Ltd.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Email Us</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              For general enquiries, billing assistance, or technical integrations:
            </p>
            <div className="space-y-1 text-xs font-medium text-emerald-400 font-mono">
              <p>support@aibotflow.in</p>
              <p>billing@aibotflow.in</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Helpline & Calling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Talk directly with our telecom engineering & customer care desk:
            </p>
            <div className="space-y-1 text-xs font-medium text-blue-400 font-mono">
              <p>+91 95138 86363</p>
              <p className="text-slate-400 font-sans text-[11px]">Toll-Free & Direct Landline</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Operating Hours</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our business operations and voice technical engineers are available:
            </p>
            <div className="space-y-1 text-xs text-slate-200">
              <p className="font-semibold text-purple-300">Mon - Sat: 9:30 AM - 6:30 PM IST</p>
              <p className="text-[11px] text-slate-400">Automated AI Telecom: 24/7/365 Active</p>
            </div>
          </div>
        </div>

        {/* Corporate Address & Grievance Officer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Registered Corporate Office</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-1">
              <p className="font-bold text-white">AiBotCall Technologies Private Limited</p>
              <p>3rd Floor, Apex Business Tower, Near Metro Pillar 142,</p>
              <p>Andheri West, Mumbai, Maharashtra 400053, India</p>
              <p className="pt-2 text-slate-400 font-mono text-[11px]">CIN: U72900MH2024PTC398712</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Statutory Grievance Redressal Officer</span>
            </div>
            <p className="text-xs text-slate-400">
              In accordance with Indian Consumer Protection (E-Commerce) Rules and IT Act:
            </p>
            <div className="text-xs text-slate-300 space-y-1">
              <p><b>Officer:</b> Grievance Redressal Officer, Compliance Division</p>
              <p><b>Email:</b> <span className="text-emerald-400 font-mono">grievance@aibotflow.in</span></p>
              <p><b>Escalation SLA:</b> Response within 48 business hours</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>© {new Date().getFullYear()} AiBotCall Technologies Pvt. Ltd.</span>
          <button
            onClick={onBackToHome}
            className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};
