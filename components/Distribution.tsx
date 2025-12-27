import React, { useState, useEffect, useRef } from 'react';
import { Globe, Server, Database, Wifi, Terminal, Play, RotateCw, CheckCircle2, AlertTriangle, Shield, Activity, XCircle } from 'lucide-react';
import { LogEntry, ServiceStatus } from '../types';

export const Distribution: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'network' | 'orchestrator'>('orchestrator');
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Initial Service State
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Website', status: 'offline', port: '8080', latency: '-' },
    { name: 'Backend API', status: 'offline', port: '8000', latency: '-' },
    { name: 'Frontend', status: 'offline', port: '3000', latency: '-' },
    { name: 'PostgreSQL', status: 'offline', port: '5432', latency: '-' },
    { name: 'Redis', status: 'offline', port: '6379', latency: '-' },
    { name: 'Mobile APK', status: 'offline', port: '-', latency: '-' },
  ]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const updateServiceStatus = (name: string, status: ServiceStatus['status']) => {
    setServices(prev => prev.map(s => s.name === name ? { 
      ...s, 
      status, 
      latency: status === 'running' ? `${Math.floor(Math.random() * 40) + 10}ms` : '-' 
    } : s));
  };

  const runDeployment = async () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setLogs([]);
    setProgress(0);
    setServices(s => s.map(srv => ({ ...srv, status: 'pending' })));

    // Script Simulation
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    try {
      // Banner
      addLog("LINKZ IAED PLATFORM - MASTER DEPLOYMENT ORCHESTRATOR v2.0.1", 'command');
      addLog("Initializing deployment sequence...", 'info');
      await delay(800);

      // Prerequisites
      addLog("Checking Prerequisites...", 'info');
      await delay(500);
      addLog("✓ docker installed", 'success');
      addLog("✓ node installed", 'success');
      addLog("✓ npm installed", 'success');
      setProgress(10);

      // Project Structure
      addLog("Creating Project Structure...", 'info');
      await delay(600);
      addLog("mkdir -p linkz-iaed/backend", 'command');
      addLog("mkdir -p linkz-iaed/frontend", 'command');
      addLog("Project structure created.", 'success');
      setProgress(25);

      // Database
      addLog("Initializing Database Services...", 'info');
      await delay(1000);
      addLog("Starting PostgreSQL container...", 'info');
      updateServiceStatus('PostgreSQL', 'running');
      addLog("✓ PostgreSQL running on port 5432", 'success');
      await delay(400);
      addLog("Starting Redis Cache...", 'info');
      updateServiceStatus('Redis', 'running');
      addLog("✓ Redis running on port 6379", 'success');
      setProgress(45);

      // Backend
      addLog("Deploying Backend API...", 'info');
      await delay(1200);
      addLog("pip install fastapi uvicorn", 'command');
      updateServiceStatus('Backend API', 'running');
      addLog("✓ Backend API healthy at http://localhost:8000", 'success');
      setProgress(65);

      // Frontend
      addLog("Building Frontend Dashboard...", 'info');
      await delay(1500);
      addLog("npm run build", 'command');
      updateServiceStatus('Frontend', 'running');
      updateServiceStatus('Website', 'running');
      addLog("✓ Frontend deployed to http://localhost:3000", 'success');
      setProgress(85);

      // Mobile
      addLog("Compiling Mobile APK (Expo)...", 'info');
      await delay(1000);
      addLog("eas build -p android --profile preview", 'command');
      updateServiceStatus('Mobile APK', 'running');
      addLog("✓ APK Build Complete", 'success');
      
      setProgress(100);
      addLog("DEPLOYMENT SUCCESSFUL!", 'success');
      addLog("All systems operational.", 'info');

    } catch (e) {
      addLog("Deployment Failed.", 'error');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out] h-full flex flex-col">
      {/* Header Tabs */}
      <div className="flex items-center gap-4 bg-[#0f0f19]/70 backdrop-blur-xl p-2 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => setActiveTab('orchestrator')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'orchestrator' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
        >
          <Terminal size={14} /> Orchestrator
        </button>
        <button 
          onClick={() => setActiveTab('network')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'network' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
        >
          <Globe size={14} /> Global Network
        </button>
      </div>

      {activeTab === 'orchestrator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
          {/* Left Panel: Controls & Status */}
          <div className="space-y-6">
            <div className="bg-[#0f0f19]/70 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">System Control</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase">Master Deployment</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button 
                onClick={runDeployment}
                disabled={isDeploying}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {isDeploying ? <RotateCw className="animate-spin" size={16} /> : <Play size={16} />}
                {isDeploying ? 'Deploying Sequence...' : 'Initialize Deployment'}
              </button>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <div key={service.name} className="bg-[#0f0f19]/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'running' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                      service.status === 'pending' ? 'bg-amber-400 animate-pulse' : 
                      'bg-slate-700'
                    }`} />
                    <span className="font-bold text-sm text-slate-200">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-indigo-400">{service.port}</div>
                    <div className="text-[10px] font-bold text-slate-600 uppercase">{service.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Terminal */}
          <div className="lg:col-span-2 bg-[#020205] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative font-mono text-sm">
             {/* Terminal Header */}
            <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
              </div>
              <div className="ml-4 text-xs text-slate-500 font-medium">LinkZ-IAED-Orchestrator — -zsh — 80x24</div>
            </div>

            {/* Terminal Body */}
            <div ref={logContainerRef} className="flex-1 p-6 overflow-y-auto space-y-2 scroll-smooth">
              <div className="opacity-50 mb-4 select-none">
                <pre className="text-[10px] leading-tight text-cyan-500 font-bold">
{`
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║   ██╗     ██╗███╗   ██╗██╗  ██╗███████╗    ██╗ █████╗ ███████╗██████╗    ║
║   ██║     ██║████╗  ██║██║ ██╔╝╚══███╔╝    ██║██╔══██╗██╔════╝██╔══██╗   ║
║   ██║     ██║██╔██╗ ██║█████╔╝   ███╔╝     ██║███████║█████╗  ██║  ██║   ║
║   ██║     ██║██║╚██╗██║██╔═██╗  ███╔╝      ██║██╔══██║██╔══╝  ██║  ██║   ║
║   ███████╗██║██║ ╚████║██║  ██╗███████╗    ██║██║  ██║███████╗██████╔╝   ║
║   ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝    ╚═╝╚═╝  ╚═╝╚══════╝╚═════╝    ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
`}
                </pre>
                <div className="text-xs text-slate-500 mt-2">LinkZ Intelligent Autonomous Equity Distribution Platform v2.0.1</div>
              </div>
              
              {logs.length === 0 && !isDeploying && (
                <div className="text-slate-600 italic">Waiting for deployment command...</div>
              )}

              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 animate-[fadeIn_0.1s_ease-out]">
                  <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                  <span className={`${
                    log.type === 'command' ? 'text-yellow-400 font-bold' :
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'error' ? 'text-red-400' :
                    'text-slate-300'
                  }`}>
                    {log.type === 'command' && '$ '}
                    {log.message}
                  </span>
                </div>
              ))}
              {isDeploying && (
                 <div className="animate-pulse text-cyan-400">_</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Global Network View (Existing) */
        <div className="bg-[#0f0f19]/70 backdrop-blur-xl p-12 rounded-[2rem] border border-white/5 text-center relative overflow-hidden flex-1 flex flex-col items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-[#020205] to-[#020205]"></div>
            
            <div className="relative z-10 mb-8 animate-[zoomIn_0.5s_ease-out]">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-500/10 mb-6 relative group cursor-pointer hover:bg-indigo-500/20 transition-all">
                    <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping group-hover:animate-none"></div>
                    <Globe size={48} className="text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-4xl font-black text-white mb-4">Global Node Network</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    Real-time asset propagation across 186 territories. Your content is currently replicated on 42 edge clusters.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl relative z-10 mt-12">
                <NodeCard 
                    icon={<Server size={24} className="text-emerald-400" />}
                    title="Americas Cluster"
                    status="Operational"
                    latency="12ms"
                />
                 <NodeCard 
                    icon={<Database size={24} className="text-cyan-400" />}
                    title="EMEA Storage"
                    status="Syncing (98%)"
                    latency="45ms"
                />
                 <NodeCard 
                    icon={<Wifi size={24} className="text-amber-400" />}
                    title="APAC Relay"
                    status="Operational"
                    latency="82ms"
                />
            </div>
        </div>
      )}
    </div>
  );
};

const NodeCard: React.FC<{ icon: React.ReactNode; title: string; status: string; latency: string }> = ({ icon, title, status, latency }) => (
    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl text-left hover:bg-white/10 hover:border-indigo-500/30 hover:-translate-y-1 transition-all cursor-default group">
        <div className="flex justify-between items-start mb-4">
            <div className="group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <span className="text-[10px] font-mono text-slate-500 bg-black/20 px-2 py-1 rounded-md border border-white/5 group-hover:text-white transition-colors">{latency}</span>
        </div>
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-xs text-slate-400 group-hover:text-indigo-300 transition-colors">{status}</p>
    </div>
);