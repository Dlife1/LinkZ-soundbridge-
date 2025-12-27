import React from 'react';
import { ViewState } from '../types';
import { CloudUpload, UserCircle } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  onViewChange?: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Artist Hub';
      case 'distribution': return 'Network Infrastructure';
      case 'ai': return 'Reasoning Intelligence';
      case 'analytics': return 'Stream Analytics';
      case 'create-release': return 'DDEX 4.3 Ingestion';
      case 'library': return 'Catalog Management';
      default: return 'Artist Hub';
    }
  };

  return (
    <header className="h-24 px-12 flex items-center justify-between border-b border-white/5 bg-[#020205]/40 backdrop-blur-md z-20 shrink-0">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">{getTitle()}</h2>
        <p className="text-xs text-slate-500 font-medium mt-1">ID: <span className="text-indigo-400 font-mono">LNZ-DIST-BEAVERTON-01</span></p>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
          </div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Healthy</span>
        </div>
        
        <div className="h-8 w-[1px] bg-white/10"></div>

        <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-white">Studio Admin</p>
                <p className="text-[10px] text-slate-500">studio-156266</p>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 border border-white/10">
                <UserCircle size={24} />
            </div>
        </div>
      </div>
    </header>
  );
};