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
    <aside className="w-64 bg-[#0c1220]/90 border-r border-slate-800/80 flex flex-col h-screen select-none backdrop-blur-xl shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <PhoneCall className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight leading-tight">
              AiBot<span className="text-emerald-400">Call</span>
            </h1>
            <p className="text-[10px] text-emerald-400/80 font-medium tracking-wide uppercase">
              AI Voice Calls & Smart Automation
            </p>
          </div>
        </div>
      </div>

      {/* Quick Outbound Action Button & Calling Balance */}
      <div className="px-4 pt-4 space-y-2">
        <button
          onClick={onQuickCall}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <PhoneOutgoing className="w-4 h-4" />
          <span>New AI Voice Call</span>
        </button>

        {/* SaaS Calling Balance Pill */}
        <button
          onClick={() => {
            setActiveTab('profile');
            onSelectProfileSection?.('billing');
          }}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] hover:bg-emerald-950/60 transition-colors cursor-pointer"
          title="Manage Wallet & Top-up Voice Credits"
        >
          <span className="text-slate-300 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Voice Balance:</span>
          </span>
          <span className="font-bold text-emerald-400 font-mono">
            {user?.organization ? 'Active' : '30 Mins'}
          </span>
        </button>
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
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div
          onClick={() => {
            setActiveTab('profile');
            onSelectProfileSection?.('details');
          }}
          className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/50 hover:border-emerald-500/40 hover:bg-slate-900 cursor-pointer transition-all group"
          title="Open My Profile & Settings"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs uppercase group-hover:scale-105 transition-transform">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user?.organization?.name || 'AiBotCall'}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
