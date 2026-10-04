import React from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface PolicyProps {
  onBackToHome: () => void;
}

export const RefundPolicyPage: React.FC<PolicyProps> = ({ onBackToHome }) => {
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
            Customer Assurance
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Billing & Cancellation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: October 4, 2026 | Governing all Razorpay subscriptions and voice credit recharge transactions
          </p>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            At <b>AiBotCall Technologies Pvt. Ltd.</b>, we strive to deliver transparent, reliable, and high-performance AI telephony services. We understand that circumstances may arise where you need to cancel a subscription or request a refund. This policy outlines the terms and procedures for cancellations and refunds.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            1. Subscription Cancellations
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>You can cancel your monthly recurring subscription (Starter, Growth, or Enterprise) at any time directly through your dashboard under the <b>Billing</b> tab.</li>
            <li>Upon cancellation, your subscription will remain active until the end of your current monthly billing period. No further automatic charges will be debited to your card or UPI mandate.</li>
            <li>Remaining calling minutes in your account remain available for use until the conclusion of the billing cycle.</li>
          </ul>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            2. Refund Eligibility & 7-Day Window
          </h2>
          <p>
            Refunds are considered under the following transparent conditions:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><b>Unused Credit Packages:</b> If you purchased a voice minute top-up pack and have not consumed any of the purchased minutes, you may request a 100% full refund within <b>7 days</b> of the transaction date.</li>
            <li><b>Platform Technical Service Outage:</b> In the rare event that our voice gateway fails to place calls due to verified systemic platform downtime that cannot be resolved within 48 hours, you are entitled to a pro-rated refund for the affected service period.</li>
            <li><b>Non-Refundable Items:</b> Setup fees, virtual phone number activation fees (which incur direct non-refundable telecom carrier licensing costs), and voice minutes that have already been dialed/consumed are strictly non-refundable.</li>
          </ul>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            3. Automated Failed Call Credit Guarantee
          </h2>
          <p>
            Our intelligent call worker tracks every telephony event in real-time. If an outbound call is marked as failed due to carrier telecom network congestion or API failure on our end, your voice minutes balance is <b>automatically credited back</b> to your wallet instantly with zero deduction.
          </p>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            4. Refund Request Procedure
          </h2>
          <p>
            To submit a formal refund request, please email our billing team at <span className="text-emerald-400 font-mono">billing@aibotcall.com</span> with:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>Your registered account email and Organization ID</li>
            <li>The Razorpay Payment ID (starts with <code className="text-emerald-400">pay_...</code>)</li>
            <li>Detailed reason for the refund request</li>
          </ul>

          <h2 className="text-base sm:text-lg font-bold text-white pt-4">
            5. Processing Timeline via Razorpay
          </h2>
          <p>
            Once your refund request is approved by our billing team:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <p className="flex items-center space-x-2 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Standard Refund Processing: 5 to 7 Business Days</span>
            </p>
            <p className="text-slate-400">
              Approved refunds are credited directly back to the original payment source (your bank account, credit card, or UPI VPA) through the <b>Razorpay payment gateway</b>. You will receive an automated email confirmation from Razorpay once the refund is dispatched.
            </p>
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
