import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Users, PlayCircle } from 'lucide-react';

const data = [
  { name: '00:00', streams: 4000 },
  { name: '04:00', streams: 3000 },
  { name: '08:00', streams: 2000 },
  { name: '12:00', streams: 2780 },
  { name: '16:00', streams: 1890 },
  { name: '20:00', streams: 2390 },
  { name: '23:59', streams: 3490 },
];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#0f0f19]/70 backdrop-blur-xl p-8 rounded-3xl border border-white/5 col-span-2 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-black text-white">Real-Time Ingestion</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Global DSP Stream Count</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                        <span className="text-xs text-slate-400">Live Data</span>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f0f19', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                itemStyle={{ color: '#818cf8' }}
                            />
                            <Area type="monotone" dataKey="streams" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStreams)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-6">
                <MetricCard 
                    icon={<TrendingUp size={24} className="text-emerald-400" />}
                    label="Growth Rate"
                    value="+12.5%"
                    sub="+2.1% from last hour"
                />
                <MetricCard 
                    icon={<Users size={24} className="text-cyan-400" />}
                    label="Unique Listeners"
                    value="842.3K"
                    sub="Across 4 Platforms"
                />
                <MetricCard 
                    icon={<PlayCircle size={24} className="text-amber-400" />}
                    label="Skip Rate"
                    value="14.2%"
                    sub="Below industry avg"
                />
            </div>
        </div>
    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string; sub: string }> = ({ icon, label, value, sub }) => (
    <div className="bg-[#0f0f19]/70 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:bg-[#0f0f19] transition-colors h-full flex flex-col justify-center shadow-lg">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-xl">
                {icon}
            </div>
        </div>
        <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-black text-white mb-1">{value}</h3>
            <p className="text-xs text-slate-400 font-medium">{sub}</p>
        </div>
    </div>
);