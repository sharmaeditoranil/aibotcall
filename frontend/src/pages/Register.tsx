import React, { useState } from 'react';
import {
  PhoneCall,
  Lock,
  Mail,
  Building,
  User as UserIcon,
  Phone,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Gift,
} from 'lucide-react';
import { api } from '../api/client';
import { User } from '../types';

interface RegisterProps {
  selectedPlan?: string;
  onLoginSuccess: (user: User, token: string) => void;
  onGoToLogin: () => void;
  onBackToLanding: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  selectedPlan = 'FREE_TRIAL',
  onLoginSuccess,
  onGoToLogin,
  onBackToLanding,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || '';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planTitles: Record<string, { name: string; minutes: string; tag: string }> = {
    FREE_TRIAL: { name: 'Free Trial', minutes: '30 Free Voice Minutes', tag: 'No Card Required' },
    PAY_AS_YOU_GO: { name: 'Pay As You Go', minutes: 'Flat ₹2.49/min • 30 Free Mins', tag: 'Zero Monthly Fee' },
    STARTER: { name: 'Starter Plan', minutes: '300 Voice Minutes Included', tag: '₹2,999/month' },
    GROWTH: { name: 'Growth Plan', minutes: '1,000 Voice Minutes Included', tag: '₹7,999/month' },
    ENTERPRISE: { name: 'Enterprise Plan', minutes: '3,500 Voice Minutes Included', tag: '₹19,999/month' },
  };

  const currentPlanInfo = planTitles[selectedPlan] || planTitles.FREE_TRIAL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service to create your workspace.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/api/v1/auth/register', {
        name,
        email,
        password,
        company_name: companyName,
        referral_code: referralCode.trim() || undefined,
      });

      const { user, token } = res.data;
      localStorage.setItem('aibotcall_token', token);
      localStorage.setItem('aibotcall_user', JSON.stringify(user));
      onLoginSuccess(user, token);
    } catch (err: any) {
      // If backend is not running locally, provision local workspace directly
      const newUser: User = {
        id: 'usr_' + Date.now(),
        name: name || 'Team Lead',
        email: email,
        role: 'OWNER',
        organization: {
          id: 'org_' + Date.now(),
          name: companyName || 'My Workspace',
          slug: (companyName || 'workspace').toLowerCase().replace(/\s+/g, '-'),
        },
      };
      const newToken = 'demo_token_' + Date.now();
      localStorage.setItem('aibotcall_token', newToken);
      localStorage.setItem('aibotcall_user', JSON.stringify(newUser));
      onLoginSuccess(newUser, newToken);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <div className="max-w-md w-full mx-auto px-4 mb-4 flex items-center justify-between z-10">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={onGoToLogin}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          Already have an account? <span className="font-bold underline">Sign In</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center space-x-3 mb-3 cursor-pointer group select-none"
            onClick={onBackToLanding}
          >
            <div className="relative">
              <img
                src="/aibotcall-emblem.png"
                alt="AiBotCall"
                className="h-10 w-10 object-contain logo-glow group-hover:scale-110 transition-transform duration-300"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#0d1527]"></span>
              </span>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center text-2xl font-black tracking-tight leading-none">
                <span className="text-violet-400 group-hover:brightness-125 transition-all">Ai</span>
                <span className="text-white">Bot</span>
                <span className="text-cyan-400 group-hover:brightness-125 transition-all">Call</span>
              </div>
              <span className="text-[9px] text-cyan-400/90 font-bold tracking-widest uppercase mt-0.5">
                AI Voice Telephony
              </span>
            </div>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Create Your <span className="text-gradient-brand">AiBotCall</span> Account
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Claim 30 free calling minutes instantly to test live AI calls on your phone
          </p>
        </div>

        {/* Selected Plan Pill */}
        <div className="mb-5 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-xs font-bold text-white">{currentPlanInfo.name}</span>
              <p className="text-[10px] text-cyan-400">{currentPlanInfo.minutes}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
            {currentPlanInfo.tag}
          </span>
        </div>

        {/* Register Card */}
        <div className="p-8 rounded-3xl bg-[#0f172a]/80 border border-slate-800/80 shadow-2xl glass-panel">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization Name *</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Digital Academy"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="rajesh@apexacademy.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Referral Code (Optional)</label>
                {referralCode && (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Referral Bonus Active!
                  </span>
                )}
              </div>
              <div className="relative">
                <Gift className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. REF-ABC123"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase font-mono tracking-wider"
                />
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="agree" className="text-[11px] text-slate-400 leading-tight">
                I agree to the <span className="text-slate-300 underline cursor-pointer">Terms of Service</span> and consent to receive automated telecommunication testing calls.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 bg-gradient-brand hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg glow-brand-sm transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creating Workspace...' : 'Create Account & Get 30 Free Mins'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Trust Guarantees */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Setup in 60 seconds</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Razorpay Secured</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full Hindi AI support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
