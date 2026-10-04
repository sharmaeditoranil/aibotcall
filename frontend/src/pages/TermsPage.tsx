import React from 'react';
import { Shield, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

interface PolicyProps {
  onBackToHome: () => void;
}

export const TermsPage: React.FC<PolicyProps> = ({ onBackToHome }) => {
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
            AiBotCall Legal Compliance
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Policy Document</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: October 4, 2026 | Effective for all registered tenants, businesses, and end-users
          </p>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By creating an account, accessing, or using <b>AiBotCall</b> (“Platform”, “We”, “Our”, “Us”), operated by <b>AiBotCall Technologies Pvt. Ltd.</b>, you (“User”, “Client”, “Merchant”) agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue using our services immediately.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            2. Scope of Services & Telephony AI
          </h2>
          <p>
            AiBotCall provides automated AI-driven outbound and inbound conversational voice calling software, dynamic knowledge base management, broadcast campaign scheduling, and CRM webhook integrations. Telephony connectivity is powered by certified telecommunications partners (including Exotel) and artificial intelligence voice models (OpenAI Realtime API).
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            3. Regulatory Telecommunications Compliance (TRAI & NDNC)
          </h2>
          <p>
            All users of the Platform must strictly adhere to all applicable Indian telecommunication rules, including the <b>Telecom Regulatory Authority of India (TRAI)</b> regulations, <b>Telecom Commercial Communications Customer Preference Regulations (TCCCPR)</b>, and the <b>National Do Not Call (NDNC)</b> registry:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>You agree to dial only those contacts from whom you have obtained explicit, verifiable prior consent or opt-in.</li>
            <li>Users must strictly respect and maintain the built-in Suppression (DNC) list.</li>
            <li>Calling hours must strictly follow local statutory limits (9:00 AM to 9:00 PM local time).</li>
            <li>Any attempt to spoof caller IDs, impersonate emergency services, or conduct illegal robocalling is strictly prohibited and will result in immediate termination of the account without refund and reporting to statutory authorities.</li>
          </ul>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            4. User Account & Security
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your account login credentials, API keys, and phone numbers. You agree to immediately notify us of any unauthorized use or security breach of your account.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            5. Billing, Payments & Razorpay Gateway
          </h2>
          <p>
            Subscription plans, voice credit top-ups, and virtual number purchases are billed in <b>Indian Rupees (INR)</b>. Payments are securely processed via <b>Razorpay Software Private Limited</b>. By making a payment, you authorize Razorpay and our payment systems to debit the designated amount from your selected payment instrument (Credit/Debit Card, UPI, NetBanking, or Wallet). All applicable Goods and Services Tax (GST) will be charged in accordance with Indian tax laws.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            6. Fair Usage & Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate accounts that engage in fraudulent activity, abusive traffic spikes exceeding subscribed concurrency limits, harassment, or violations of third-party intellectual property or privacy rights.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            7. Limitation of Liability & Governing Law
          </h2>
          <p>
            In no event shall AiBotCall Technologies Pvt. Ltd., its directors, employees, or partners be liable for any indirect, incidental, or consequential damages resulting from telecommunication carrier outages, internet disruptions, or third-party API downtime. These Terms shall be governed by and construed in accordance with the laws of <b>India</b>, and courts in <b>Mumbai, Maharashtra</b> shall have exclusive jurisdiction.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            8. Grievance Officer & Contact
          </h2>
          <p>
            For any queries or formal grievances regarding these Terms, please reach out to our legal officer at <span className="text-emerald-400 font-mono">legal@aibotcall.com</span> or via our Contact Us portal.
          </p>
        </section>

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
