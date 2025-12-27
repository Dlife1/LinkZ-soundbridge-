import React, { useEffect, useState } from 'react';
import { ReleaseMetadata } from '../types';
import { MoreVertical, Search, Filter, Box, Loader2, AlertCircle } from 'lucide-react';
import { LinkZService } from '../services/linkzService';

export const ReleaseLibrary: React.FC = () => {
  const [releases, setReleases] = useState<Partial<ReleaseMetadata>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await LinkZService.getReleases();
        setReleases(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

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

        {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Loader2 size={32} className="animate-spin mb-4 text-indigo-500" />
                <p className="text-xs font-bold uppercase tracking-widest">Loading Catalog from LinkZ Node...</p>
            </div>
        ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-red-500/5 rounded-3xl border border-red-500/10">
                <AlertCircle size={32} className="mb-4 text-red-400" />
                <p className="text-xs font-bold uppercase tracking-widest text-red-300">Connection Failed</p>
                <p className="text-xs mt-2">Could not reach https://api.linkz.io</p>
            </div>
        ) : releases.length === 0 ? (
            <div className="text-center py-24 text-slate-600">
                <Box size={48} className="mx-auto mb-4 opacity-50" />
                <p>No releases found in catalog.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {releases.map((release) => (
                    <div key={release.id} className="bg-[#0f0f19]/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex items-center gap-6 hover:bg-white/5 transition-all group">
                        <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden relative border border-white/10 shrink-0">
                            {release.coverArtUrl ? (
                                <img src={release.coverArtUrl} alt={release.title} className="w-full h-full object-cover" />
                            ) : (
                                <Box className="text-slate-600 m-auto mt-4" />
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-lg truncate">{release.title || 'Untitled'}</h4>
                            <p className="text-sm text-slate-500 font-medium">{release.displayArtist || 'Unknown Artist'} • {release.primaryGenre || 'Genre'}</p>
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
        )}
    </div>
  );
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
    let color = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    let label = status || 'Unknown';

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