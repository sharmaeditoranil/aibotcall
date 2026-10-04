import React from 'react';
import { Activity, Radio, Cpu, RefreshCw, PhoneCall } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  onQuickCall: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  onQuickCall,
  isRefreshing,
}) => {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-3">
        {/* Status Indicators */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-300">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Voice Gateway</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1 text-slate-400">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>Exotel</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1 text-slate-400">
            <Cpu className="w-3 h-3 text-teal-400" />
            <span>OpenAI Realtime</span>
          </div>
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        )}

        {/* Quick Outbound Trigger */}
        <button
          onClick={onQuickCall}
          className="flex items-center space-x-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Number</span>
        </button>
      </div>
    </header>
  );
};
