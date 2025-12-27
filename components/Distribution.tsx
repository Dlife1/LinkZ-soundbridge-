import React, { useState, useEffect, useRef } from 'react';
import { Globe, Server, Database, Wifi, Terminal, Play, RotateCw, Activity, FileJson, Code, AlertCircle } from 'lucide-react';
import { LogEntry, ServiceStatus } from '../types';
import { LinkZService } from '../services/linkzService';

export const Distribution: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'network' | 'orchestrator' | 'config'>('orchestrator');
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  
  // Ref type updated to allow the fallback object which isn't a strict WebSocket
  const wsRef = useRef<any>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Initial Network Check
  useEffect(() => {
    const checkNetwork = async () => {
      const status = await LinkZService.getNetworkStatus();
      setServices(status);
    };
    checkNetwork();
    const interval = setInterval(checkNetwork, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runDeployment = async () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setLogs([]);
    setProgress(5);
    
    try {
      addLog("Initializing secure handshake with api.linkz.io...", 'info');
      
      // 1. Trigger Build
      addLog("POST /v1/builds - target: android, profile: preview", 'command');
      
      const { buildId } = await LinkZService.triggerBuild('android', 'preview');
      
      if (buildId.startsWith('local-')) {
          addLog("Remote Host Unreachable. Initializing Local Runner...", 'warning');
      } else {
          addLog(`Build initialized. ID: ${buildId}`, 'success');
      }
      
      setProgress(15);

      // 2. Connect WebSocket (or Mock Stream)
      addLog(`Connecting to log stream [${buildId}]...`, 'info');
      
      wsRef.current = LinkZService.connectBuildStream(
        buildId,
        (log) => {
            // Process incoming log to update progress roughly
            if (log.message.includes('dependencies')) setProgress(30);
            if (log.message.includes('Configuring')) setProgress(50);
            if (log.message.includes('Building')) setProgress(70);
            if (log.message.includes('Gradle')) setProgress(80);
            if (log.message.includes('Success')) setProgress(100);
            
            setLogs(prev => [...prev, log]);
        },
        () => {
             addLog("Connection interrupted.", 'warning');
        }
      );
      
    } catch (e: any) {
      addLog(`Critical Error: ${e.message}`, 'error');
      setIsDeploying(false);
    }
  };

  // Cleanup WS on unmount
  useEffect(() => {
    return () => {
        if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out] h-full flex flex-col">
      {/* Header Tabs */}
      <div className="flex items-center gap-4 bg-[#0f0f19]/70 backdrop-blur-xl p-2 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => setActiveTab('orchestrator')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'orchestrator' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
        >
          <Terminal size={14} /> Mobile Builder
        </button>
        <button 
          onClick={() => setActiveTab('config')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'config' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
        >
          <FileJson size={14} /> Configuration
        </button>
        <button 
          onClick={() => setActiveTab('network')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'network' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
        >
          <Globe size={14} /> Network Status
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
                  <h3 className="font-black text-white text-lg">Build Control</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase">LinkZ Mobile (APK)</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  <span>Build Progress</span>
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
                {isDeploying ? 'Running Build...' : 'Execute Build Script'}
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
                      service.status === 'error' ? 'bg-red-500' :
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
              <div className="ml-4 text-xs text-slate-500 font-medium">linkz-mobile-build — bash — 80x24</div>
            </div>

            {/* Terminal Body */}
            <div ref={logContainerRef} className="flex-1 p-6 overflow-y-auto space-y-2 scroll-smooth">
              <div className="opacity-50 mb-4 select-none">
                <pre className="text-[10px] leading-tight text-cyan-500 font-bold">
{`
   __    __   _  _  _  _  ____ 
  (  )  (  ) ( \( )( )/ )(_   )
  / (_/\ )(   )  (  )  (  / /_ 
  \____/(__) (_)\_)(_)\_)(____)
  
  MOBILE BUILD ORCHESTRATOR
`}
                </pre>
                <div className="text-xs text-slate-500 mt-2">Connected to LinkZ Cloud Runner</div>
              </div>
              
              {logs.length === 0 && !isDeploying && (
                <div className="text-slate-600 italic">Ready to run ./build-apk.sh</div>
              )}

              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 animate-[fadeIn_0.1s_ease-out]">
                  <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                  <span className={`${
                    log.type === 'command' ? 'text-yellow-400 font-bold' :
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'warning' ? 'text-amber-400' :
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
      ) : activeTab === 'config' ? (
        <div className="bg-[#020205] rounded-[2rem] border border-white/10 shadow-2xl flex-1 overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-64 border-r border-white/5 bg-white/[0.02] p-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Project Files</div>
                <div className="space-y-2">
                    <FileItem active label="package.json" />
                    <FileItem label="app.json" />
                    <FileItem label="eas.json" />
                    <FileItem label="build-apk.sh" />
                    <FileItem label="README.md" />
                </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto font-mono text-xs">
                <h3 className="text-emerald-400 font-bold mb-4">// package.json (LinkZ IAED Mobile)</h3>
                <pre className="text-slate-300 leading-relaxed">
{`{
  "name": "linkz-iaed-mobile",
  "version": "2.0.1",
  "description": "LinkZ IAED Mobile - Intelligent Autonomous Equity Distribution",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android --profile production",
    "build:apk": "eas build -p android --profile preview",
    "eject": "expo eject"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-native-async-storage/async-storage": "1.18.2",
    "expo-linear-gradient": "~12.3.0",
    "@expo/vector-icons": "^13.0.0",
    "react-native-webview": "13.2.2",
    "expo-secure-store": "~12.3.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}`}
                </pre>
            </div>
        </div>
      ) : (
        /* Global Network View */
        <div className="bg-[#0f0f19]/70 backdrop-blur-xl p-12 rounded-[2rem] border border-white/5 text-center relative overflow-hidden flex-1 flex flex-col items-center justify-center">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-[#020205] to-[#020205]"></div>
            
            <div className="relative z-10 mb-8 animate-[zoomIn_0.5s_ease-out]">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-500/10 mb-6 relative group cursor-pointer hover:bg-indigo-500/20 transition-all">
                    <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping group-hover:animate-none"></div>
                    <Globe size={48} className="text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-4xl font-black text-white mb-4">Global Node Network</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    Active connection to LinkZ Core Infrastructure.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                     api.linkz.io: CONNECTED
                </div>
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

const FileItem: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
    <div className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${active ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
        <Code size={14} />
        <span className="text-xs font-mono">{label}</span>
    </div>
);