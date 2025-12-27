import React from 'react';
import { ReleaseMetadata } from '../types';
import { MoreVertical, Search, Filter, Box } from 'lucide-react';

const mockReleases: Partial<ReleaseMetadata>[] = [
    { id: '1', title: 'Neon Nights', displayArtist: 'Synthwave Duo', status: 'distributed', primaryGenre: 'Electronic', releaseDate: '2024-10-12', upc: '891238123', coverArtUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop' },
    { id: '2', title: 'Acoustic Sessions', displayArtist: 'Jane Doe', status: 'ready', primaryGenre: 'Folk', releaseDate: '2024-11-01', upc: '891238444', coverArtUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop' },
    { id: '3', title: 'Urban Echoes', displayArtist: 'The City', status: 'ai-review', primaryGenre: 'Hip Hop', releaseDate: 'TBD', coverArtUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=300&h=300&fit=crop' },
];

export const ReleaseLibrary: React.FC = () => {
  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h3 className="text-3xl font-black text-white">Release Library</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Manage your catalog, track deliveries, and view AI audits.</p>
            </div>
            <div className="flex gap-3">
                <button className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl border border-white/10"><Search size={18} /></button>
                <button className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl border border-white/10"><Filter size={18} /></button>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {mockReleases.map((release) => (
                <div key={release.id} className="bg-[#0f0f19]/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex items-center gap-6 hover:bg-white/5 transition-all group">
                    <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden relative border border-white/10 shrink-0">
                        {release.coverArtUrl ? (
                            <img src={release.coverArtUrl} alt={release.title} className="w-full h-full object-cover" />
                        ) : (
                            <Box className="text-slate-600 m-auto mt-4" />
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-lg truncate">{release.title}</h4>
                        <p className="text-sm text-slate-500 font-medium">{release.displayArtist} • {release.primaryGenre}</p>
                    </div>

                    <div className="hidden md:block text-right">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">UPC</p>
                        <p className="text-sm font-mono text-indigo-300">{release.upc || 'PENDING'}</p>
                    </div>

                    <div className="px-6">
                        <StatusBadge status={release.status} />
                    </div>

                    <button className="text-slate-500 hover:text-white p-2">
                        <MoreVertical size={20} />
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
    let color = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    let label = status;

    if (status === 'distributed') {
        color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
        label = 'Live on DSPs';
    } else if (status === 'ai-review') {
        color = 'bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse';
        label = 'Neural Review';
    } else if (status === 'ready') {
        color = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
        label = 'Ready to Ship';
    }

    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${color}`}>
            {label}
        </span>
    );
};