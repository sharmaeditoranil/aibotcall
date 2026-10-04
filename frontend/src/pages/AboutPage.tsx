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
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackToHome,
  onGoToContact,
  onGoToPricing,
  onGoToRegister,
  onGoToLogin,
}) => {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#080c14]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <PhoneCall className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">
              AiBot<span className="text-emerald-400">Call</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {onGoToPricing && (
              <button
                onClick={onGoToPricing}
                className="hidden sm:inline-block text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Pricing
              </button>
            )}
            <button
              onClick={onGoToContact}
              className="py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              Contact Us
            </button>
            {onGoToRegister && (
              <button
                onClick={onGoToRegister}
                className="py-1.5 px-3.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-14 space-y-20">
        <section className="text-center space-y-6 relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Automation · Better Communication · Business Growth</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">AiBotCall & Ai Botflow</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            AiBotCall ek enterprise communication aur smart AI automation platform hai, jo AI Voice Calling, WhatsApp Business API, Facebook aur Instagram automation ke saath modern CRM ki suvidha deta hai. Hamara maksad businesses ko customer enquiries, leads aur follow-ups aasaani se manage karne mein madad karna hai.
          </p>

          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Hamare solutions businesses ko routine communication automate karne aur customer details ek jagah organize karne mein madad karte hain, taaki aapki sales team manual dialing chhodkar sirf deal close karne par dhyan de sake.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">1,200+</p>
              <p className="text-xs font-semibold text-slate-400">Active Businesses Scaled</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-blue-400">45M+</p>
              <p className="text-xs font-semibold text-slate-400">Interactions & Minutes</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-teal-400">99.99%</p>
              <p className="text-xs font-semibold text-slate-400">Cloud Uptime SLA</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-amber-400">0%</p>
              <p className="text-xs font-semibold text-slate-400">Hidden Markups</p>
            </div>
          </div>
        </section>

        {/* Founder & Leadership Section ("Hamare Peechhe Kaun Hain?") */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0c1220] to-emerald-950/20 border border-slate-800 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Leadership & Vision</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Hamare Peechhe Kaun Hain?</h2>
            <p className="text-xs text-slate-400">
              Meet the visionary blending 10+ years of creative expertise with practical business workflow automation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Founder Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-1 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-blue-500 shadow-2xl">
                <div className="bg-[#0b101b] rounded-[22px] p-6 text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-1 shadow-lg shadow-emerald-500/20">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-4xl text-emerald-400">
                      AS
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white">Anil Sharma</h3>
                    <p className="text-xs font-semibold text-emerald-400">Founder & Creative Technologist</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center justify-center space-x-1">
                      <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                      <span>Founder, <strong>Quick Art Photography Academy</strong></span>
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href="https://quickartphotography.in/master-class/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5 text-blue-400" />
                      <span>Masterclass Profile</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    <a
                      href="https://www.youtube.com/@AiBotFlow"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-300 text-xs font-medium border border-red-500/30 flex items-center space-x-1.5 transition-colors"
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
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>10+ Saal Ka Rich Experience</span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                Creative Industry Se Lekar <span className="text-emerald-400">Smart Business Automation</span> Tak
              </h3>

              <p>
                <strong>AiBotCall ke peechhe hain Anil Sharma</strong>, jo Quick Art Photography Academy ke Founder aur ek highly experienced video editor, filmmaker aur educator hain. Video editing aur filmmaking mein <strong>10 se zyada saal ke experience</strong> ke saath, unhone creative skills ki training aur practical business workflows par extensively kaam kiya hai.
              </p>

              <p>
                Creative industry se jude apne background ko aage badhate hue, Anil AI Voice Calling aur smart communication automation ke zariye businesses ke liye customer interactions ko ultra-fast aur aasaan banana chahte hain.
              </p>

              <p className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs font-medium leading-relaxed">
                💡 <em>"Unka real-world anubhav batata hai ki ek website enquiry par pehle 5 minute ke andar diya gaya personalized phone response deal conversion chance ko <strong>4 guna tak badha deta hai</strong>. Isi purpose ke sath AiBotCall ko har scale ke business ke liye plug-and-play banaya gaya hai."</em>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>10+ Years Creative Industry</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Deep insight into human engagement, authentic voice tone, and customer storytelling.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
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
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5" />
              <span>Core Solutions</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Hum Kya Karte Hain?</h2>
            <p className="text-xs text-slate-400">
              Hamare solutions businesses ko routine communication automate karne aur customer details ek jagah organize karne mein madad karte hain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-emerald-500/30 hover:border-emerald-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Autonomous AI Voice Calling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Two-way natural Hindi, Hinglish & English conversational telephony. Dial website leads under 5 seconds, handle live barge-in interruptions, and conduct bulk CSV broadcast campaigns.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-blue-500/30 hover:border-blue-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">WhatsApp Business API & Social</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Official Meta Cloud API integration with zero per-message markup. Automated Instagram comment-to-DM, Story mentions, and Click-to-WhatsApp ad triggers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-purple-500/30 hover:border-purple-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
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
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/60 border border-emerald-500/40 text-center space-y-4 shadow-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hamara Mission</span>
          </span>

          <blockquote className="text-xl sm:text-2xl font-black text-white max-w-3xl mx-auto leading-relaxed">
            “Businesses ke liye automation ko simple aur practical banana, taaki har enquiry par dhyan diya ja sake aur har customer ko behtar experience mile.”
          </blockquote>

          <p className="text-emerald-400 font-bold text-sm tracking-wide">
            AiBotCall — Har conversation mein growth ki ek nayi opportunity.
          </p>
        </section>

        {/* Principles & What Sets Us Apart */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Our Principles</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What Sets AiBotCall Apart</h2>
            <p className="text-xs text-slate-400">
              Why fast-growing institutes, agencies, and enterprises choose our automated voice platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>100% Certified Telecom & Meta API</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero gray-route SIM boxes or unauthorized scraping scripts. All telephony connects via certified Exotel carrier trunks and official Meta Cloud APIs with 100% compliance.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Zero Per-Message Markup</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlike legacy aggregators who charge 20% to 50% extra on top of Meta's rates, we provide transparent minute packages and direct pass-through pricing.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Dynamic Realtime Knowledge Base</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Teach the AI assistant your exact course fees, batch schedules, doctor timings, and property brochures. The AI references safe live function tools to answer with 100% accuracy.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-Bit TLS & 99.99% Cloud SLA</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All voice audio, customer phone numbers, and webhook payloads are protected with 256-bit encryption, DNC suppression rules, and 24/7 server health monitors.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Bar */}
        <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Ready to automate your sales calls & enquiries?</h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Speak directly with our solutions team or start your free 30-minute trial today with zero upfront card requirement.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoToContact}
              className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer flex items-center space-x-2"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Contact Solutions Desk</span>
            </button>
            {onGoToRegister && (
              <button
                onClick={onGoToRegister}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Start Free Trial (30 Mins)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-8 px-6 text-center text-xs text-slate-500 space-y-2">
        <p>© {new Date().getFullYear()} AiBotCall / Ai Botflow · Founded by Anil Sharma. All rights reserved.</p>
        <p className="text-[11px] text-slate-600">Gopalganj, Bihar, India · Support: +91 99398 00780 · support@aibotflow.in</p>
      </footer>
    </div>
  );
};
