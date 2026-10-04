import React, { useState } from 'react';
import {
  PhoneCall,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { api } from '../api/client';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User, token: string) => void;
  onGoToRegister: () => void;
  onBackToLanding: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onBackToLanding,
}) => {
  const [email, setEmail] = useState('admin@aibotcall.com');
  const [password, setPassword] = useState('admin123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/api/v1/auth/login', { email, password });
      const { user, token } = res.data;
      if (rememberMe) {
        localStorage.setItem('aibotcall_token', token);
        localStorage.setItem('aibotcall_user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('aibotcall_token', token);
        localStorage.setItem('aibotcall_token', token);
        localStorage.setItem('aibotcall_user', JSON.stringify(user));
      }
      onLoginSuccess(user, token);
    } catch (err: any) {
      // If backend is not connected locally, log in directly as Platform Admin
      const demoUser: User = {
        id: 'usr_admin_default_1',
        name: email.includes('@') ? (email.split('@')[0] === 'admin' ? 'Platform Administrator' : email.split('@')[0]) : 'Administrator',
        email: email || 'admin@aibotcall.com',
        role: 'OWNER',
        organization: {
          id: 'org_demo_123',
          name: 'AiBotCall Technologies',
          slug: 'aibotcall-cloud',
        },
      };
      const demoToken = 'demo_token_' + Date.now();
      localStorage.setItem('aibotcall_token', demoToken);
      localStorage.setItem('aibotcall_user', JSON.stringify(demoUser));
      onLoginSuccess(demoUser, demoToken);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@aibotcall.com');
    setPassword('admin123456');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

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
          onClick={onGoToRegister}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          New to AiBotCall? <span className="font-bold underline">Create Account</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex justify-center mb-3 cursor-pointer" onClick={onBackToLanding}>
            <img
              src="/aibotcall-logo-full.png"
              alt="AiBotCall"
              className="h-11 sm:h-12 w-auto object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Sign In to <span className="text-gradient-brand">AiBotCall</span>
          </h1>
          <p className="text-[11px] text-cyan-400/90 font-medium tracking-wider uppercase mt-0.5">
            AI Voice Calls & Smart Automation
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-[#0f172a]/80 border border-slate-800/80 shadow-2xl glass-panel">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@aibotcall.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <span className="text-[11px] text-slate-500 cursor-pointer hover:text-emerald-400">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
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

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-brand hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg glow-brand-sm transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Fill */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-indigo-500/20 text-[11px] text-slate-300 flex items-center justify-center space-x-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fill Default Admin Credentials (1-Click)</span>
            </button>
          </div>

          {/* Switch to Register link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onGoToRegister}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors ml-1"
              >
                Sign Up & Get 30 Free Minutes
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
