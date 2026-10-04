import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ContactUsProps {
  onBackToHome: () => void;
  onGoToAbout?: () => void;
  onGoToBlog?: () => void;
}

export const ContactUsPage: React.FC<ContactUsProps> = ({ onBackToHome, onGoToAbout, onGoToBlog }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [solution, setSolution] = useState('growth');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encodedText = encodeURIComponent(
      `Hello AiBotCall Team,\nMy Name: ${name}\nBusiness Email: ${email}\nPhone: ${phone}\nInterested Solution: ${solution}\nMessage: ${message || 'I would like to explore AI calling & automation.'}`
    );
    window.open(`https://wa.me/919939800780?text=${encodedText}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar with Official Brand Logo */}
      <header className="sticky top-0 z-50 bg-[#070a13]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Home</span>
            </button>

            <div onClick={onBackToHome} className="cursor-pointer flex items-center">
              <img
                src="/aibotcall-logo-full.png"
                alt="AiBotCall"
                className="h-9 sm:h-10 w-auto object-contain hover:opacity-95 transition-opacity"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onGoToAbout && (
              <button
                onClick={onGoToAbout}
                className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                About Us
              </button>
            )}
            {onGoToBlog && (
              <button
                onClick={onGoToBlog}
                className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Blog
              </button>
            )}
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-l border-slate-800 pl-3">
              Direct Support & Sales
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Priority Technical & Sales Concierge</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Let's Connect & <span className="text-gradient-brand">Scale Your Business</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Have questions about AI voice calling setup, telephony minute packages, high-volume broadcasting, or custom enterprise deployments? Our solution specialists respond rapidly.
          </p>
        </div>

        {/* Contact Layout: Left Channels, Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Direct Support Channels */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight">Direct Channels</h2>
            <p className="text-xs text-slate-400">Reach us instantly through your preferred channel.</p>

            {/* WhatsApp VIP Concierge */}
            <a
              href="https://wa.me/919939800780?text=Hi%20AiBotCall%2C%20I%20am%20interested%20in%20learning%20more%20about%20your%20AI%20Voice%20Calling%20platform."
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-3xl bg-[#0f172a]/70 hover:bg-[#0f172a] border border-cyan-500/30 hover:border-cyan-500/60 transition-all flex items-center space-x-4 shadow-lg group cursor-pointer block glow-brand-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">WhatsApp VIP Concierge</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    Instant
                  </span>
                </div>
                <p className="text-xs text-cyan-400 font-mono font-semibold mt-0.5">+91 99398 00780</p>
                <p className="text-[11px] text-slate-400 mt-1">Chat directly with our solutions architect</p>
              </div>
            </a>

            {/* Direct Phone Calling */}
            <a
              href="tel:+919939800780"
              className="p-5 rounded-3xl bg-[#0f172a]/70 hover:bg-[#0f172a] border border-violet-500/30 hover:border-violet-500/60 transition-all flex items-center space-x-4 shadow-lg group cursor-pointer block"
            >
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white">Direct Phone Calling</h3>
                <p className="text-xs text-violet-400 font-mono font-semibold mt-0.5">+91 99398 00780</p>
                <p className="text-[11px] text-slate-400 mt-1">Voice support desk & sales consultation</p>
              </div>
            </a>

            {/* Email Support */}
            <a
              href="mailto:support@aibotflow.in"
              className="p-5 rounded-3xl bg-[#0f172a]/70 hover:bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-4 shadow-lg group cursor-pointer block"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white">Enterprise Email Support</h3>
                <p className="text-xs text-indigo-400 font-mono font-semibold mt-0.5">support@aibotflow.in</p>
                <p className="text-[11px] text-slate-400 mt-1">Official correspondence & billing inquiries</p>
              </div>
            </a>

            {/* Business Operating Hours */}
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Business Operating Hours</span>
              </div>
              <p className="text-xs text-white font-medium">Monday – Saturday · 9:30 AM to 7:00 PM IST</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Guaranteed response within 15 minutes during operating hours for enterprise accounts. AI Calling Gateway runs 24/7/365 uninterrupted.
              </p>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-[#0f172a]/90 border border-indigo-500/30 shadow-2xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white tracking-tight">Send an Inquiry</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Fill out the details below and our team will connect with you via WhatsApp or Phone call immediately.
                </p>
              </div>

              {submitted && (
                <div className="p-4 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Your enquiry has been prepared! If WhatsApp did not open automatically, click the WhatsApp VIP button on the left.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amit Verma"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Interested Plan / Solution</label>
                  <select
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="growth">Growth Plan (₹7,999/mo) — 1,000 Voice Mins (Most Popular)</option>
                    <option value="starter">Starter Plan (₹2,999/mo) — 300 Voice Mins</option>
                    <option value="enterprise">Enterprise Scale (₹19,999/mo) — 3,500 Voice Mins</option>
                    <option value="payg">Pay-As-You-Go Custom Top-Up Pack</option>
                    <option value="whatsapp_crm">WhatsApp Business API & CRM Suite</option>
                    <option value="reseller">Affiliate & Partner Program (20% Lifetime)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Message / Requirements</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your business, expected call volume, or CRM integration requirements..."
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-brand hover:opacity-90 text-white text-xs font-bold shadow-lg glow-brand-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit & Connect on WhatsApp (+91 99398 00780)</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Google Maps & Office Headquarters */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#0f172a]/70 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AiBotCall / Ai Botflow Headquarters</h3>
                <p className="text-xs text-slate-400">Gopalganj, Bihar, India · Official Business Location</p>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/t1ubo5wu53wGhVWT6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>

          {/* Google Maps Iframe Embed */}
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3574.8683552067155!2d84.3039197!3d26.3631196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39930137472a7747%3A0xef05dfc88d746ac9!2sAi%20Botflow!5e0!3m2!1sen!2sin!4v1789846936926!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Ai Botflow Google Maps Location"
            />
          </div>
        </section>

        {/* Corporate Details & Grievance Officer */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Registered Corporate Entity</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-1">
              <p className="font-bold text-white">AiBotCall Technologies / Ai Botflow</p>
              <p>Founded by Anil Sharma</p>
              <p>Gopalganj, Bihar 841428, India</p>
              <p className="text-slate-400 pt-1 font-mono text-[11px]">Meta Tech Partner & Telecom Integration</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Grievance Officer (IT Rules & RBI Compliance)</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-1">
              <p className="font-bold text-white">Anil Sharma (Grievance Redressal Officer)</p>
              <p>Email: <span className="text-cyan-400 font-mono">support@aibotflow.in</span></p>
              <p>Phone: <span className="text-cyan-400 font-mono">+91 99398 00780</span></p>
              <p className="text-[11px] text-slate-400 pt-1">
                Acknowledgement within 24 hours. Resolution within 15 working days.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-8 px-6 text-center text-xs text-slate-500 space-y-2">
        <p>© {new Date().getFullYear()} AiBotCall / Ai Botflow · All rights reserved.</p>
        <p className="text-[11px] text-slate-600">Priority Hotline: +91 99398 00780 · support@aibotflow.in</p>
      </footer>
    </div>
  );
};
