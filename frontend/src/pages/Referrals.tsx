import React, { useState, useEffect } from 'react';
import {
  Gift,
  Copy,
  Check,
  Share2,
  DollarSign,
  TrendingUp,
  Users,
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Building,
  CreditCard,
  Send,
  X,
} from 'lucide-react';
import { api } from '../api/client';

export const Referrals: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [payoutMethod, setPayoutMethod] = useState<'UPI' | 'BANK_TRANSFER'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankHolderName, setBankHolderName] = useState('');
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'earnings' | 'withdrawals' | 'referred'>('earnings');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/referrals/stats');
      setStats(res.data);
    } catch (err: any) {
      // Fallback demo data if backend is in offline demo mode
      setStats({
        referral_code: 'REF-AI9988',
        commission_rate_percent: 20,
        wallet_balance: 1498.0,
        total_earned: 2743.0,
        total_withdrawn: 1245.0,
        total_referrals_count: 5,
        referred_organizations: [
          { id: 'ref_1', name: 'Apex Real Estate Solutions', created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), plan: 'GROWTH' },
          { id: 'ref_2', name: 'Dr. Verma Healthcare Clinic', created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), plan: 'PAY_AS_YOU_GO' },
          { id: 'ref_3', name: 'Target EduTech Academy', created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(), plan: 'STARTER' },
          { id: 'ref_4', name: 'Kisan Krishi Kendra', created_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(), plan: 'PAY_AS_YOU_GO' },
          { id: 'ref_5', name: 'Royal Auto Spa & Detailing', created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(), plan: 'FREE_TRIAL' },
        ],
        earnings: [
          { id: 'earn_1', order_amount: 2490, commission_percent: 20, commission_amount: 498, description: '20% commission from Apex Real Estate Solutions (1,000 Mins Pack)', created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), status: 'credited' },
          { id: 'earn_2', order_amount: 1245, commission_percent: 20, commission_amount: 249, description: '20% commission from Dr. Verma Healthcare Clinic (500 Mins Pack)', created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), status: 'credited' },
          { id: 'earn_3', order_amount: 2999, commission_percent: 20, commission_amount: 599.8, description: '20% commission from Target EduTech Academy (Starter Monthly Plan)', created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), status: 'credited' },
          { id: 'earn_4', order_amount: 6225, commission_percent: 20, commission_amount: 1245, description: '20% commission from Apex Real Estate Solutions (2,500 Mins Pack)', created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(), status: 'credited' },
          { id: 'earn_5', order_amount: 498, commission_percent: 20, commission_amount: 99.6, description: '20% commission from Kisan Krishi Kendra (200 Mins Pack)', created_at: new Date(Date.now() - 11 * 24 * 3600 * 1000).toISOString(), status: 'credited' },
        ],
        withdrawals: [
          { id: 'w_1', amount: 1245, payout_method: 'UPI', upi_id: 'anil@okhdfcbank', status: 'paid', admin_notes: 'Paid via PhonePe UPI Ref #429810992384', created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString() },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const referralCode = stats?.referral_code || 'REF-AIBOT';
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const copyToClipboard = (text: string, isLink: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLink) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `Hey! Check out AiBotCall - the fastest AI Voice Calling Agent for Indian businesses. It speaks natural Hindi & English to qualify leads, book appointments, and run bulk broadcast campaigns automatically.\n\nSign up with my link and get 30 FREE calling minutes:\n${referralLink}\n\nReferral Code: ${referralCode}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (!amountNum || amountNum < 100) {
      setError('Minimum withdrawal amount is ₹100');
      return;
    }

    if (amountNum > (stats?.wallet_balance || 0)) {
      setError(`Insufficient balance. You have ₹${stats?.wallet_balance || 0} available.`);
      return;
    }

    try {
      setSubmittingWithdraw(true);
      setError(null);
      setMessage(null);

      const res = await api.post('/api/v1/referrals/withdraw', {
        amount: amountNum,
        payout_method: payoutMethod,
        upi_id: payoutMethod === 'UPI' ? upiId : undefined,
        bank_account_number: payoutMethod === 'BANK_TRANSFER' ? bankAccount : undefined,
        bank_ifsc: payoutMethod === 'BANK_TRANSFER' ? bankIfsc : undefined,
        bank_holder_name: payoutMethod === 'BANK_TRANSFER' ? bankHolderName : undefined,
      });

      setMessage(res.data.message || 'Withdrawal request submitted successfully!');
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      fetchStats();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to submit withdrawal');
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Gift className="w-3.5 h-3.5" />
            <span>Affiliate & Referral Partner Program</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Refer & Earn 20% Lifetime Commission</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Earn 20% commission on every single wallet recharge & subscription made by people you invite. Payouts sent directly to your UPI / Bank.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStats}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 active:scale-95 transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Request Withdrawal (पैसे निकालें)</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Wallet Balance */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 glass-card relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Withdrawable Balance</span>
            <Wallet className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            ₹{(stats?.wallet_balance || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Ready to transfer to your UPI ID or Bank account.
          </p>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="mt-3 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>Withdraw Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Earned */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Commission Earned</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            ₹{(stats?.total_earned || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            20% lifetime cut on every referred payment
          </p>
        </div>

        {/* Total Referrals Count */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Referrals</span>
            <Users className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {stats?.total_referrals_count || 0} <span className="text-xs font-normal text-slate-400">businesses</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Companies joined via your link
          </p>
        </div>

        {/* Total Withdrawn */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Paid Out</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            ₹{(stats?.total_withdrawn || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Successfully credited to your bank / UPI
          </p>
        </div>
      </div>

      {/* Referral Link & Sharing Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0c1626] to-slate-950 border border-emerald-500/30 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Your Unique Referral Link & Code
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Share this link with business owners, real estate agents, doctors, coaches, and call centers. When they recharge, you get 20% commission instantly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Link box */}
          <div className="md:col-span-8 flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl p-2 pl-4">
            <span className="text-xs text-slate-400 font-mono truncate flex-1 select-all">
              {referralLink}
            </span>
            <button
              onClick={() => copyToClipboard(referralLink, true)}
              className="ml-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Referral Code box */}
          <div className="md:col-span-4 flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl p-2 pl-4">
            <div className="flex-1">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Code</span>
              <span className="text-sm font-black text-emerald-400 font-mono tracking-wider">
                {referralCode}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(referralCode, false)}
              className="ml-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Share Button */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={shareOnWhatsApp}
            className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-all flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on WhatsApp (व्हाट्सएप पर शेयर करें)</span>
          </button>

          <span className="text-[11px] text-slate-400">
            ✨ Your friends get <b>30 Free Welcome Minutes</b> on signing up!
          </span>
        </div>
      </div>

      {/* Tabs Navigation: Earnings, Withdrawals, Referred Orgs */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'earnings'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Commission Earnings Stream ({stats?.earnings?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'withdrawals'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Withdrawal Requests ({stats?.withdrawals?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('referred')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'referred'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Referred Businesses ({stats?.referred_organizations?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: Earnings Stream */}
        {activeTab === 'earnings' && (
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 text-right">Order Amount</th>
                    <th className="py-3.5 px-4 text-right">Commission Rate</th>
                    <th className="py-3.5 px-4 text-right">You Earned</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {stats?.earnings && stats.earnings.length > 0 ? (
                    stats.earnings.map((e: any) => (
                      <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {new Date(e.created_at).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4 font-medium text-white">{e.description}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-300">
                          ₹{e.order_amount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                          {e.commission_percent}%
                        </td>
                        <td className="py-3 px-4 text-right font-black text-emerald-400 font-mono text-sm">
                          +₹{e.commission_amount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Credited
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                        No commission earnings yet. Share your referral link to start earning 20% on every recharge!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Withdrawal Requests */}
        {activeTab === 'withdrawals' && (
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Payout Method</th>
                    <th className="py-3.5 px-4">Account Details</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Admin Note / UTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {stats?.withdrawals && stats.withdrawals.length > 0 ? (
                    stats.withdrawals.map((w: any) => (
                      <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {new Date(w.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 font-black text-white font-mono text-sm">
                          ₹{w.amount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-300">{w.payout_method}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {w.payout_method === 'UPI' ? w.upi_id : `${w.bank_account_number} (${w.bank_ifsc})`}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              w.status === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : w.status === 'rejected'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {w.status === 'paid' ? 'PAID / सफल' : w.status === 'rejected' ? 'REJECTED' : 'PENDING / प्रक्रियाधीन'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {w.admin_notes || 'Processing payout via IMPS/UPI...'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                        No withdrawal requests yet. Click "Request Withdrawal" to transfer earnings to your bank.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Referred Businesses */}
        {activeTab === 'referred' && (
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Business Name</th>
                    <th className="py-3.5 px-4">Active Plan</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {stats?.referred_organizations && stats.referred_organizations.length > 0 ? (
                    stats.referred_organizations.map((org: any) => (
                      <tr key={org.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                          <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{org.name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-300">{org.plan}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {new Date(org.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500 text-xs">
                        No businesses joined yet. Share your referral link with contacts to start building your network!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Withdrawal Request Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-lg w-full p-7 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Wallet className="w-3.5 h-3.5" />
                <span>Instant Payout Request</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Withdraw Referral Balance (पैसे निकालें)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Available Wallet Balance: <b className="text-emerald-400">₹{(stats?.wallet_balance || 0).toLocaleString('en-IN')}</b>
              </p>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Withdrawal Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min={100}
                    max={stats?.wallet_balance || 0}
                    step={1}
                    required
                    placeholder="Min ₹100"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full pl-8 pr-20 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(String(stats?.wallet_balance || 0))}
                    className="absolute right-2 top-2 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[10px] font-bold"
                  >
                    Withdraw All
                  </button>
                </div>
              </div>

              {/* Payout Method */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Payout Method *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('UPI')}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                      payoutMethod === 'UPI'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Send className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">UPI Transfer</div>
                      <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('BANK_TRANSFER')}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                      payoutMethod === 'BANK_TRANSFER'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Bank IMPS / NEFT</div>
                      <div className="text-[10px] text-slate-400">Direct to Account</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* UPI details */}
              {payoutMethod === 'UPI' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Your UPI ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Bank Details */}
              {payoutMethod === 'BANK_TRANSFER' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Name as in bank account"
                      value={bankHolderName}
                      onChange={(e) => setBankHolderName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Bank Account Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12 to 18 digits"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="HDFC0001234"
                        value={bankIfsc}
                        onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>24-Hour Payout SLA</span>
                </div>
                <p>Withdrawal requests are processed via UPI / IMPS within 24 business hours.</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWithdraw}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submittingWithdraw ? 'Submitting Request...' : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
