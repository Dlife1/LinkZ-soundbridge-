import React from 'react';
import { Disc, Radio, Zap, ShieldCheck, CheckCircle, RefreshCw, MoreHorizontal } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-[fadeIn_0.7s_ease-out]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Disc size={28} className="text-indigo-400" />} 
          label="Total Assets" 
          value="24,802" 
        />
        <StatCard 
          icon={<Radio size={28} className="text-emerald-400" />} 
          label="Live Streams" 
          value="1.2M+" 
        />
        <StatCard 
          icon={<Zap size={28} className="text-amber-400" />} 
          label="Active Nodes" 
          value="186" 
        />
        <StatCard 
          icon={<ShieldCheck size={28} className="text-cyan-400" />} 
          label="Meta Index" 
          value="100%" 
        />
      </div>

      <div className="bg-[#0f0f19]/70 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <h4 className="font-black uppercase tracking-tight text-white">Global Distribution Queue</h4>
          </div>
          <div className="flex gap-2">
            <Badge text="ISRC VERIFIED" />
            <Badge text="FLAC READY" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-white/5 text-slate-500 uppercase text-[10px] font-black">
              <tr>
                <th className="px-10 py-5">Track Identifier</th>
                <th className="px-10 py-5">Metadata Status</th>
                <th className="px-10 py-5">Dist. Node</th>
                <th className="px-10 py-5">Territories</th>
                <th className="px-10 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-sm">
              <tr className="hover:bg-white/5 transition-all duration-200 group cursor-pointer hover:shadow-lg hover:border-l-4 hover:border-indigo-500">
                <td className="px-10 py-6">
                  <div className="font-black text-white group-hover:text-indigo-400 transition-colors">Midnight Resonance</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1 group-hover:text-slate-400">US-LNZ-25-00042</div>
                </td>
                <td className="px-10 py-6">
                  <span className="text-emerald-400 font-black text-xs uppercase flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                    <CheckCircle size={14} /> High Fidelity
                  </span>
                </td>
                <td className="px-10 py-6 text-indigo-400 font-mono group-hover:text-white transition-colors">cluster-west-01</td>
                <td className="px-10 py-6 text-slate-400 font-black">Global (All)</td>
                <td className="px-10 py-6 text-slate-600 group-hover:text-white">
                    <MoreHorizontal size={20} />
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-all duration-200 group cursor-pointer hover:shadow-lg hover:border-l-4 hover:border-amber-500">
                <td className="px-10 py-6">
                  <div className="font-black text-white group-hover:text-amber-400 transition-colors">Metadata Magic</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1 group-hover:text-slate-400">US-LNZ-25-00043</div>
                </td>
                <td className="px-10 py-6">
                  <span className="text-amber-400 font-black text-xs uppercase flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full w-fit">
                    <RefreshCw size={14} className="animate-spin" /> Syncing Assets
                  </span>
                </td>
                <td className="px-10 py-6 text-indigo-400 font-mono group-hover:text-white transition-colors">cluster-west-02</td>
                <td className="px-10 py-6 text-slate-400 font-black">142 Territories</td>
                 <td className="px-10 py-6 text-slate-600 group-hover:text-white">
                    <MoreHorizontal size={20} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-[#0f0f19]/70 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl hover:bg-[#0f0f19]/90 hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-300 cursor-default group">
    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-slate-400">{label}</p>
    <h3 className="text-3xl font-black text-white">{value}</h3>
  </div>
);

const Badge: React.FC<{ text: string }> = ({ text }) => (
  <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black shadow-[0_0_10px_rgba(99,102,241,0.1)]">
    {text}
  </span>
);