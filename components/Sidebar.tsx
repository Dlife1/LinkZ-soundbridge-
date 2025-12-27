import React from 'react';
import { ViewState } from '../types';
import { AudioWaveform, Layers, Globe, Cpu, ChartLine, Accessibility, Library, PlusSquare } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navClass = (view: ViewState) => 
    `w-full flex items-center gap-4 px-6 py-3 rounded-xl transition-all font-semibold text-sm mb-1 ${
      currentView === view 
        ? 'bg-[#4f46e5]/15 text-[#818cf8] border-l-4 border-[#6366f1]' 
        : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`;

  return (
    <aside className="w-72 bg-[#0f0f19]/70 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 shrink-0">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <AudioWaveform size={24} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight leading-none text-white">LinkZ</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">SoundBridge</p>
          </div>
        </div>

        <div className="mb-2 px-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Platform</div>
        <nav className="mb-8">
          <button onClick={() => onViewChange('dashboard')} className={navClass('dashboard')}>
            <Layers size={18} />
            Dashboard
          </button>
          <button onClick={() => onViewChange('analytics')} className={navClass('analytics')}>
            <ChartLine size={18} />
            Analytics
          </button>
           <button onClick={() => onViewChange('distribution')} className={navClass('distribution')}>
            <Globe size={18} />
            Network
          </button>
        </nav>

        <div className="mb-2 px-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Catalog</div>
        <nav>
          <button onClick={() => onViewChange('create-release')} className={navClass('create-release')}>
            <PlusSquare size={18} />
            New Release
          </button>
          <button onClick={() => onViewChange('library')} className={navClass('library')}>
            <Library size={18} />
            Release Library
          </button>
           <button onClick={() => onViewChange('ai')} className={navClass('ai')}>
            <Cpu size={18} />
            Neural Core
          </button>
        </nav>
      </div>

      <div className="mt-auto p-8">
        <div className="bg-indigo-500/5 rounded-2xl p-5 border border-indigo-500/10">
          <div className="flex items-center gap-3 mb-3 text-cyan-400">
            <Accessibility size={16} />
            <span className="text-[11px] font-black uppercase tracking-tighter">A11y Engine</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Screen reader accessibility API key verified for 2025 standards.</p>
        </div>
      </div>
    </aside>
  );
};