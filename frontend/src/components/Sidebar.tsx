import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Radio,
  Users,
  PhoneCall,
  BookOpen,
  SendHorizontal,
  ShieldBan,
  KeyRound,
  FlaskConical,
  Settings,
  UserCheck,
  LogOut,
  PhoneOutgoing,
  Sparkles,
  Plug,
  ShieldAlert,
  Phone,
  UserCircle,
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  onQuickCall: () => void;
  onSelectProfileSection?: (section: 'details' | 'billing' | 'referrals') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  onQuickCall,
  onSelectProfileSection,
}) => {
  const isSuperAdmin = user?.email === 'admin@aibotcall.com';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile & Account', icon: UserCircle },
    { id: 'agents', label: 'AI Voice Agents', icon: Bot },
    { id: 'numbers', label: 'My Numbers & DIDs', icon: Phone },
    { id: 'campaigns', label: 'Broadcast Campaigns', icon: Radio },
    { id: 'leads', label: 'Contacts / Leads', icon: Users },
    { id: 'calls', label: 'Calls Log', icon: PhoneCall },
    { id: 'integrations', label: 'CRM & Webhooks', icon: Plug },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'webhooks', label: 'Lead Webhooks', icon: SendHorizontal },
    { id: 'suppression', label: 'Suppression (DNC)', icon: ShieldBan },
    { id: 'team', label: 'Team Members', icon: UserCheck },
    ...(isSuperAdmin
      ? [
          { id: 'admin', label: 'Super Admin', icon: ShieldAlert },
          { id: 'settings', label: 'Telephony & AI Settings', icon: Settings },
          { id: 'apikeys', label: 'Platform API Keys', icon: KeyRound },
          { id: 'tester', label: 'Webhook Tester', icon: FlaskConical },
        ]
      : []),
  ];

  return (
    <aside className="w-64 bg-[#0d1424] border-r border-slate-700/60 flex flex-col h-screen select-none backdrop-blur-xl shrink-0 z-30 shadow-xl">
      {/* Brand Header with Official 3D Emblem & Razor-Sharp Typography */}
      <div className="p-4 border-b border-slate-700/60 bg-[#0a101d]/60">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <img
              src="/aibotcall-emblem.png"
              alt="AiBotCall"
              className="w-8 h-8 object-contain logo-glow shrink-0 hover:scale-110 transition-transform duration-300"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#0d1424]"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-lg font-black tracking-tight leading-none">
              <span className="text-violet-400">Ai</span>
              <span className="text-white">Bot</span>
              <span className="text-cyan-400">Call</span>
            </div>
            <span className="text-[9px] text-cyan-400/90 font-bold tracking-wider uppercase mt-1">
              AI Voice Telephony
            </span>
          </div>
        </div>
      </div>

      {/* Quick Outbound Action Button & Calling Balance */}
      <div className="px-4 pt-4 space-y-2.5">
        <button
          onClick={onQuickCall}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-gradient-brand hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg glow-brand-sm transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <PhoneOutgoing className="w-4 h-4 text-cyan-200" />
          <span>New AI Voice Call</span>
        </button>

        {/* SaaS Calling Balance Pill */}
        <div
          onClick={() => {
            setActiveTab('profile');
            onSelectProfileSection?.('billing');
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs hover:border-cyan-400/50 hover:bg-slate-900 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-slate-300 font-medium group-hover:text-white transition-colors">Balance:</span>
          </div>
          <span className="font-bold text-cyan-400 font-mono text-[11px] bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            {user?.organization?.credits_balance_minutes !== undefined ? `${user.organization.credits_balance_minutes} Mins` : '30 Mins'}
          </span>
        </div>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/25 via-blue-600/20 to-transparent text-white border-l-4 border-violet-500 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div
          onClick={() => {
            setActiveTab('profile');
            onSelectProfileSection?.('details');
          }}
          className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800/60 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer transition-all group"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center font-bold text-xs uppercase group-hover:scale-105 transition-transform shadow-md shrink-0">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-100 truncate group-hover:text-cyan-400 transition-colors">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-cyan-400/80 truncate font-medium">{user?.organization?.name || 'AiBotCall'}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
