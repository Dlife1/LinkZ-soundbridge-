import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ReasoningEngine } from './components/ReasoningEngine';
import { Analytics } from './components/Analytics';
import { Distribution } from './components/Distribution';
import { ReleaseCreator } from './components/ReleaseCreator';
import { ReleaseLibrary } from './components/ReleaseLibrary';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'ai':
        return <ReasoningEngine />;
      case 'analytics':
        return <Analytics />;
      case 'distribution':
        return <Distribution />;
      case 'create-release':
        return <ReleaseCreator />;
      case 'library':
        return <ReleaseLibrary />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#020205]">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none z-0"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')" }}
        />

        <Header currentView={currentView} onViewChange={setCurrentView} />

        <div className="flex-1 overflow-y-auto z-10 p-8 md:p-12 scroll-smooth">
          {renderView()}
        </div>

        <footer className="h-16 px-12 border-t border-white/5 bg-[#020205]/40 backdrop-blur-md flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] z-20 shrink-0">
            <span>LinkZ SoundBridge v2.1.0</span>
            <div className="flex gap-8">
                <span>Oregon Deployment Node: 0x4F8</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Metadata Verified</span>
            </div>
        </footer>
      </main>
    </div>
  );
};

export default App;