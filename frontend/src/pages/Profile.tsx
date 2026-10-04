import React, { useState, useEffect } from 'react';
import {
  UserCircle,
  Mail,
  Building,
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Award,
  CreditCard,
  Gift,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { User } from '../types';
import { api } from '../api/client';
import { Billing } from './Billing';
import { Referrals } from './Referrals';

interface ProfileProps {
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
  initialSection?: 'details' | 'billing' | 'referrals';
  onSectionChange?: (section: 'details' | 'billing' | 'referrals') => void;
}

export const Profile: React.FC<ProfileProps> = ({
  user,
  onUpdateUser,
  initialSection = 'details',
  onSectionChange,
}) => {
  const [activeSection, setActiveSection] = useState<'details' | 'billing' | 'referrals'>(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const handleSectionSwitch = (section: 'details' | 'billing' | 'referrals') => {
    setActiveSection(section);
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const [name, setName] = useState(user?.name || '');
  const [companyName, setCompanyName] = useState(user?.organization?.name || '');
  const [billingEmail, setBillingEmail] = useState(user?.organization?.billing_email || user?.email || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // States
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      const res = await api.put('/api/v1/auth/profile', {
        name,
        company_name: companyName,
        billing_email: billingEmail,
      });

      if (res.data?.user) {
        onUpdateUser(res.data.user);
        localStorage.setItem('aibotcall_user', JSON.stringify(res.data.user));
      }
      showToast('success', 'Profile and account details updated successfully!');
    } catch (err: any) {
      showToast('error', err.response?.data?.error || err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('error', 'New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'New password and confirm password do not match');
      return;
    }

    try {
      setPasswordSaving(true);
      await api.put('/api/v1/auth/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      showToast('success', 'Password updated successfully! Please use your new password next time.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast('error', err.response?.data?.error || err.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const copyReferral = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-full">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-red-500 text-white'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Profile Overview Header & Navigation Tabs */}
      <div className="bg-[#0b101b] border-b border-slate-800/80 px-8 pt-8 pb-0">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Banner with Profile Summary */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/30 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-black text-emerald-400 uppercase">
                  {user?.name ? user.name[0] : 'U'}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h2 className="text-xl font-bold text-white tracking-tight">{user?.name || 'User Profile'}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {user?.role || 'CLIENT'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                  <span>{user?.email}</span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium">{user?.organization?.name || 'AiBotCall Platform'}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics / Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Voice Balance</p>
                  <p className="text-xs font-black text-emerald-400 font-mono">
                    {user?.organization?.credits_balance_minutes !== undefined
                      ? `${user.organization.credits_balance_minutes} Mins`
                      : 'Active'}
                  </p>
                </div>
                <button
                  onClick={() => handleSectionSwitch('billing')}
                  className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all cursor-pointer"
                  title="Top-up Voice Credits"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Refer & Earn</p>
                  <p className="text-xs font-black text-amber-400">20% Lifetime</p>
                </div>
                <button
                  onClick={() => handleSectionSwitch('referrals')}
                  className="p-1.5 rounded-xl bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 transition-all cursor-pointer"
                  title="View Referral Commissions"
                >
                  <Gift className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-800">
            <button
              onClick={() => handleSectionSwitch('details')}
              className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'details'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <UserCircle className="w-4 h-4" />
              <span>Personal Details & Security</span>
            </button>

            <button
              onClick={() => handleSectionSwitch('billing')}
              className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'billing'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Billing & Voice Wallet</span>
            </button>

            <button
              onClick={() => handleSectionSwitch('referrals')}
              className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'referrals'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Refer & Earn (20% Commission)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      <div className="py-8">
        {activeSection === 'details' && (
          <div className="max-w-7xl mx-auto px-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Personal & Company Info Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-5 shadow-lg">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <UserCircle className="w-4 h-4 text-emerald-400" />
                      <span>Personal & Business Information</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Update your personal display name, organization title, and billing contact email.
                    </p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Login Email Address (Permanent)
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled
                          value={user?.email || ''}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          Verified
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        To change your verified login address, please contact support.
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Company / Organization Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Billing & Invoice Email
                      </label>
                      <input
                        type="email"
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        placeholder="billing@yourdomain.com"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                      >
                        {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Change Password Card */}
                <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-5 shadow-lg">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Security & Password</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ensure your account is using a strong, unique password for maximum platform security.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">Current Password *</label>
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                        >
                          {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showCurrentPass ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-300">New Password *</label>
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                          >
                            {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{showNewPass ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          required
                          placeholder="Min 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Confirm New Password *
                        </label>
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          required
                          placeholder="Repeat new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={passwordSaving}
                        className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        {passwordSaving ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Account & Workspace Info */}
              <div className="space-y-6">
                {/* Plan & Calling Credits */}
                <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>Subscription & Wallet</span>
                    </h4>
                    <button
                      onClick={() => handleSectionSwitch('billing')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Active Plan:</span>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wider">
                        {user?.organization?.plan || 'FREE_TRIAL'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Voice Minutes Balance:</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        {user?.organization?.credits_balance_minutes !== undefined
                          ? `${user.organization.credits_balance_minutes} Mins`
                          : 'Active'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSectionSwitch('billing')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Recharge Voice Credits</span>
                  </button>
                </div>

                {/* Referral Partner Link */}
                <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span>Refer & Earn (20%)</span>
                    </h4>
                    <button
                      onClick={() => handleSectionSwitch('referrals')}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Full Stats</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Your Referral Code:</span>
                      <button
                        onClick={() => copyReferral(user?.organization?.referral_code || 'REF-AI9988')}
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 text-xs font-mono font-bold text-emerald-400 text-center tracking-wider border border-slate-800">
                      {user?.organization?.referral_code || 'REF-AI9988'}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Earn 20% lifetime cash commission on all recharges made by businesses referred by you. Instant UPI withdrawal!
                    </p>
                  </div>

                  <button
                    onClick={() => handleSectionSwitch('referrals')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Referrals & Withdraw</span>
                  </button>
                </div>

                {/* Telephony Gateway Status */}
                <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-3 shadow-lg">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Platform Connectivity</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Telephony Gateway:</span>
                      <span className="text-emerald-400 font-semibold flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>Exotel Cloud Active</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">AI Voice Engine:</span>
                      <span className="text-emerald-400 font-semibold">OpenAI Realtime</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-slate-400">Session Security:</span>
                      <span className="text-white font-medium">256-bit TLS 1.3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Embedded Billing & Voice Credits Tab */}
        {activeSection === 'billing' && (
          <div className="animate-in fade-in duration-200">
            <Billing />
          </div>
        )}

        {/* Embedded Refer & Earn Tab */}
        {activeSection === 'referrals' && (
          <div className="animate-in fade-in duration-200">
            <Referrals />
          </div>
        )}
      </div>
    </div>
  );
};
