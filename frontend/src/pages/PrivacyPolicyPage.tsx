import React from 'react';
import { Shield, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

interface PolicyProps {
  onBackToHome: () => void;
}

export const PrivacyPolicyPage: React.FC<PolicyProps> = ({ onBackToHome }) => {
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
            Data Privacy & Security
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: October 4, 2026 | Compliant with Digital Personal Data Protection (DPDP) Act 2023 & IT Rules
          </p>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            At <b>AiBotCall Technologies Pvt. Ltd.</b> (“AiBotCall”, “we”, “our”, or “us”), we respect your privacy and are committed to protecting the personal data of our users and their customers. This Privacy Policy describes how we collect, store, process, and protect your information when you access or use our AI Voice Calling platform.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><b>Account Information:</b> Name, company name, business email, phone number, billing address, and authentication credentials.</li>
            <li><b>Contact & Lead Records:</b> Names, telephone numbers, tags, and custom CRM parameters uploaded or pushed via webhook for the explicit purpose of placing authorized voice calls.</li>
            <li><b>Call Audio & Transcripts:</b> Digital audio streams, turn-by-turn conversational transcripts, call durations, sentiment scores, and AI summaries generated during automated calls.</li>
            <li><b>Payment & Billing Information:</b> Transaction reference numbers, plan details, and invoice receipts. Payment card, UPI ID, and bank credentials are handled directly and securely by <b>Razorpay</b> under PCI-DSS Level 1 compliance; we never store your raw CVV or banking passwords.</li>
          </ul>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            2. How We Use Your Information
          </h2>
          <p>
            We process collected information solely for legitimate business operations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>To execute real-time outbound AI voice telephone calls via Exotel and OpenAI Realtime API.</li>
            <li>To synthesize natural speech responses and answer customer questions based on your verified Knowledge Base.</li>
            <li>To dispatch webhook notifications and sync call dispositions to your connected CRM (WhatsApp CRM / Deal CRM).</li>
            <li>To compute billing usage meters, invoice calling minutes, and prevent telecommunication fraud.</li>
            <li>To provide customer support and troubleshoot telephony connection latency.</li>
          </ul>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            3. Data Sharing & Third-Party Processors
          </h2>
          <p>
            We do not sell, rent, or trade your personal data to any third parties for advertising. We share data only with certified enterprise infrastructure partners necessary to deliver our services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><b>Exotel Techcom Private Limited:</b> Licensed Indian telecom carrier for voice routing and PSTN gateway streams.</li>
            <li><b>OpenAI, LLC:</b> Realtime conversational voice processing (processed via zero-retention enterprise API endpoints).</li>
            <li><b>Razorpay Software Private Limited:</b> PCI-DSS certified payment gateway for processing Indian and international payments.</li>
            <li><b>Law Enforcement & Regulatory Authorities:</b> When legally required under Indian statutory law or court orders.</li>
          </ul>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            4. Data Security & Storage
          </h2>
          <p>
            All data in transit is protected using industry-standard <b>TLS 1.3 encryption</b>. Data at rest is encrypted using <b>AES-256</b>. Databases are hosted in secure enterprise data centers with automated hourly backups and strict role-based access control (RBAC).
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            5. User Rights & Data Deletion
          </h2>
          <p>
            You have the right to access, rectify, or permanently delete your contact lists, call transcripts, audio recordings, or entire organization account at any time. Simply use the delete controls in your dashboard or email <span className="text-emerald-400 font-mono">support@aibotflow.in</span>. We fulfill all valid deletion requests within 7 business days.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            6. Grievance Redressal Officer
          </h2>
          <p>
            In compliance with the Information Technology Act 2000 and Digital Personal Data Protection Act 2023, the details of our Grievance Officer are:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
            <p><b>Officer Name:</b> Anil Sharma (Grievance Redressal Officer)</p>
            <p><b>Email:</b> <span className="text-emerald-400 font-mono">support@aibotflow.in</span></p>
            <p><b>Phone / WhatsApp:</b> <span className="text-emerald-400 font-mono">+91 99398 00780</span></p>
            <p><b>Address:</b> AiBotCall / Ai Botflow, Gopalganj, Bihar 841428, India</p>
            <p><b>Turnaround Time:</b> Within 24 hours of acknowledgement.</p>
          </div>
        </section>

        <div className="pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>© {new Date().getFullYear()} AiBotCall / Ai Botflow · Founded by Anil Sharma</span>
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
