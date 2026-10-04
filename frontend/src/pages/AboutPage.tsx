import React from 'react';
import {
  ArrowLeft,
  PhoneCall,
  Sparkles,
  Bot,
  Zap,
  ShieldCheck,
  Award,
  Video,
  ExternalLink,
  MessageSquare,
  Users,
  Lock,
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle2,
  Mail,
  Phone,
  Clock,
  Youtube,
  GraduationCap,
} from 'lucide-react';

interface AboutPageProps {
  onBackToHome: () => void;
  onGoToContact: () => void;
  onGoToPricing?: () => void;
  onGoToRegister?: () => void;
  onGoToLogin?: () => void;
  onGoToBlog?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackToHome,
  onGoToContact,
  onGoToPricing,
  onGoToRegister,
  onGoToLogin,
  onGoToBlog,
}) => {
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

            {/* Official Horizontal Widescreen Logo */}
            <div onClick={onBackToHome} className="cursor-pointer flex items-center">
              <img
                src="/aibotcall-logo-full.png"
                alt="AiBotCall Official Brand Logo"
                className="h-9 sm:h-10 w-auto object-contain hover:opacity-95 transition-opacity"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={onGoToPricing}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Pricing & Plans
            </button>
            {onGoToBlog && (
              <button
                onClick={onGoToBlog}
                className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Blog & Playbooks
              </button>
            )}
            <button
              onClick={onGoToContact}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </nav>

          <div className="flex items-center space-x-2.5">
            {onGoToLogin && (
              <button
                onClick={onGoToLogin}
                className="py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
            {onGoToRegister && (
              <button
                onClick={onGoToRegister}
                className="py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:opacity-90 shadow-lg glow-brand-sm transition-all active:scale-95 cursor-pointer"
              >
                Start Free Trial (30 Mins)
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-14 space-y-20">
        <section className="text-center space-y-6 relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Smart Automation · Better Communication · Business Growth</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            About <span className="text-gradient-brand">AiBotCall & Ai Botflow</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            AiBotCall ek enterprise communication aur smart AI automation platform hai, jo AI Voice Calling, WhatsApp Business API, Facebook aur Instagram automation ke saath modern CRM ki suvidha deta hai. Hamara maksad businesses ko customer enquiries, leads aur follow-ups aasaani se manage karne mein madad karna hai.
          </p>

          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Hamare solutions businesses ko routine communication automate karne aur customer details ek jagah organize karne mein madad karte hain, taaki aapki sales team manual dialing chhodkar sirf deal close karne par dhyan de sake.
          </p>

          {/* Stats Grid with Brand Colors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-indigo-500/20 text-center space-y-1 shadow-lg">
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">1,200+</p>
              <p className="text-xs font-semibold text-slate-400">Active Businesses Scaled</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-blue-500/20 text-center space-y-1 shadow-lg">
              <p className="text-3xl sm:text-4xl font-black text-cyan-400">45M+</p>
              <p className="text-xs font-semibold text-slate-400">Interactions & Minutes</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-violet-500/20 text-center space-y-1 shadow-lg">
              <p className="text-3xl sm:text-4xl font-black text-violet-400">99.99%</p>
              <p className="text-xs font-semibold text-slate-400">Cloud Uptime SLA</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-sky-500/20 text-center space-y-1 shadow-lg">
              <p className="text-3xl sm:text-4xl font-black text-sky-400">0%</p>
              <p className="text-xs font-semibold text-slate-400">Hidden Markups</p>
            </div>
          </div>
        </section>

        {/* Founder & Leadership Section ("Hamare Peechhe Kaun Hain?") with Authentic Photo */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0e1628] via-[#090e1b] to-violet-950/20 border border-indigo-500/30 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Leadership & Vision</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Hamare Peechhe Kaun Hain?</h2>
            <p className="text-xs text-slate-400">
              Meet the visionary blending 10+ years of creative expertise with practical business workflow automation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Founder Card with Exact Photo */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-1 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 shadow-2xl glow-brand-lg">
                <div className="bg-[#090d18] rounded-[22px] p-6 text-center space-y-4">
                  {/* Real Photo of Anil Sharma */}
                  <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-violet-500 to-cyan-400 shadow-xl">
                    <img
                      src="/assets/anil_sharma.jpg"
                      alt="Anil Sharma - Founder of AiBotCall & Quick Art Photography Academy"
                      className="w-full h-full object-cover rounded-[14px] aspect-square"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white">Anil Sharma</h3>
                    <p className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                      Founder & Creative Technologist
                    </p>
                    <p className="text-xs text-slate-300 mt-1.5 flex items-center justify-center space-x-1.5">
                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                      <span>Founder, <strong>Quick Art Photography Academy</strong></span>
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href="https://quickartphotography.in/master-class/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Masterclass Profile</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    <a
                      href="https://www.youtube.com/@AiBotFlow"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-300 text-xs font-medium border border-red-500/30 flex items-center space-x-1.5 transition-colors"
                    >
                      <Youtube className="w-3.5 h-3.5 text-red-400" />
                      <span>YouTube Channel</span>
                      <ExternalLink className="w-3 h-3 text-red-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Narrative */}
            <div className="lg:col-span-7 space-y-5 text-slate-300 text-sm leading-relaxed">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>10+ Saal Ka Rich Experience</span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                Creative Industry Se Lekar <span className="text-gradient-brand">Smart Business Automation</span> Tak
              </h3>

              <p>
                <strong>AiBotCall ke peechhe hain Anil Sharma</strong>, jo Quick Art Photography Academy ke Founder aur ek highly experienced video editor, filmmaker aur educator hain. Video editing aur filmmaking mein <strong>10 se zyada saal ke experience</strong> ke saath, unhone creative skills ki training aur practical business workflows par extensively kaam kiya hai.
              </p>

              <p>
                Creative industry se jude apne background ko aage badhate hue, Anil AI Voice Calling aur smart communication automation ke zariye businesses ke liye customer interactions ko ultra-fast aur aasaan banana chahte hain.
              </p>

              <p className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs font-medium leading-relaxed shadow-inner">
                💡 <em>"Unka real-world anubhav batata hai ki ek website enquiry par pehle 5 minute ke andar diya gaya personalized phone response deal conversion chance ko <strong>4 guna tak badha deta hai</strong>. Isi purpose ke sath AiBotCall ko har scale ke business ke liye plug-and-play banaya gaya hai."</em>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Video className="w-4 h-4 text-cyan-400" />
                    <span>10+ Years Creative Industry</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Deep insight into human engagement, authentic voice tone, and customer storytelling.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-violet-400" />
                    <span>Practical Business Workflows</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Eliminating manual calling friction so sales teams focus strictly on closing high-intent leads.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Solutions ("Hum Kya Karte Hain?") */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Core Solutions</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Hum Kya Karte Hain?</h2>
            <p className="text-xs text-slate-400">
              Hamare solutions businesses ko routine communication automate karne aur customer details ek jagah organize karne mein madad karte hain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-indigo-500/30 hover:border-indigo-500/60 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Autonomous AI Voice Calling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Two-way natural Hindi, Hinglish & English conversational telephony. Dial website leads under 5 seconds, handle live barge-in interruptions, and conduct bulk CSV broadcast campaigns.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-cyan-500/30 hover:border-cyan-500/60 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">WhatsApp Business API & Social</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Official Meta Cloud API integration with zero per-message markup. Automated Instagram comment-to-DM, Story mentions, and Click-to-WhatsApp ad triggers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-violet-500/30 hover:border-violet-500/60 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">CRM & Multi-Agent Inbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete lead lifecycle tracking, automated tag assignments, webhook dispatch to Deal CRM / WhatsApp CRM, and verified DNC suppression blacklist protection.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-950/60 via-[#0a0f1e] to-cyan-950/60 border border-indigo-500/40 text-center space-y-4 shadow-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-violet-500/15 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hamara Mission</span>
          </span>

          <blockquote className="text-xl sm:text-2xl font-black text-white max-w-3xl mx-auto leading-relaxed">
            “Businesses ke liye automation ko simple aur practical banana, taaki har enquiry par dhyan diya ja sake aur har customer ko behtar experience mile.”
          </blockquote>

          <p className="text-gradient-brand font-bold text-sm tracking-wide">
            AiBotCall — Har conversation mein growth ki ek nayi opportunity.
          </p>
        </section>

        {/* Call to Action Bar */}
        <section className="p-8 rounded-3xl bg-[#0e1424] border border-slate-800 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-bold text-white">Ready to automate your sales calls & enquiries?</h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Speak directly with our solutions team or start your free 30-minute trial today with zero upfront card requirement.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoToContact}
              className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer flex items-center space-x-2"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contact Solutions Desk</span>
            </button>
            {onGoToRegister && (
              <button
                onClick={onGoToRegister}
                className="py-2.5 px-6 rounded-xl bg-gradient-brand hover:opacity-90 text-white text-xs font-bold shadow-lg glow-brand-sm transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Start Free Trial (30 Mins)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Footer with Logo */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-10 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <img
              src="/aibotcall-logo-full.png"
              alt="AiBotCall"
              className="h-8 w-auto object-contain"
            />
            <span className="text-[11px] text-slate-500 border-l border-slate-800 pl-3">
              Founded by Anil Sharma
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={onGoToPricing} className="hover:text-cyan-400 transition-colors">
              Pricing
            </button>
            {onGoToBlog && (
              <button onClick={onGoToBlog} className="hover:text-cyan-400 transition-colors">
                Blog
              </button>
            )}
            <button onClick={onGoToContact} className="hover:text-cyan-400 transition-colors">
              Contact
            </button>
          </div>

          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} AiBotCall / Ai Botflow · All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
