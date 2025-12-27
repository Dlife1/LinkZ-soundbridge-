import React, { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, Loader2, Send, Command } from 'lucide-react';
import { consultIntelligence } from '../services/gemini';

export const ReasoningEngine: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [displayedResponse, setDisplayedResponse] = useState('');
  
  // Typing effect logic
  useEffect(() => {
    if (response) {
      let i = 0;
      setDisplayedResponse('');
      const interval = setInterval(() => {
        setDisplayedResponse(prev => prev + response.charAt(i));
        i++;
        if (i >= response.length) clearInterval(interval);
      }, 10); // Speed of typing
      return () => clearInterval(interval);
    }
  }, [response]);

  const handleConsult = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResponse(null);
    setDisplayedResponse('');
    
    try {
      const result = await consultIntelligence(input);
      setResponse(result);
    } catch (e) {
      setResponse("System Malfunction: Unable to retrieve intelligence data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[zoomIn_0.5s_ease-out]">
      <div className="bg-[#0f0f19]/70 backdrop-blur-xl p-12 rounded-[2rem] border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="flex items-center gap-6 mb-12 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center text-white shadow-xl animate-pulse">
            <Brain size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white">Reasoning AI</h3>
            <p className="text-indigo-400 text-sm font-bold uppercase tracking-[0.2em] mt-1">LinkZ Neural Core</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center gap-3 mb-6">
             <div className="p-2 text-slate-500"><Command size={16} /></div>
             <p className="text-xs text-slate-400 font-mono">Connected to Model: <span className="text-emerald-400">gemini-1.5-pro-preview</span></p>
          </div>

          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Input your distribution query. The Gemini Reasoning Engine will analyze your track metadata against global streaming trends to generate a high-fidelity release strategy.
          </p>
          
          <div className="relative group">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-[#020205] border border-white/10 rounded-2xl p-8 min-h-[180px] text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-lg transition-all placeholder:text-slate-700 resize-none font-medium shadow-inner" 
              placeholder="> Initialize query protocol..."
            />
            <button 
              onClick={handleConsult}
              disabled={loading || !input.trim()}
              className="absolute bottom-6 right-6 bg-gradient-to-br from-indigo-600 to-violet-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all px-10 py-4 rounded-xl text-xs font-black text-white uppercase tracking-widest shadow-xl flex items-center gap-3"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Processing Data</>
              ) : (
                <><Send size={16} /> Consult Intelligence</>
              )}
            </button>
          </div>

          {(displayedResponse || loading) && (
            <div className="pt-8 border-t border-white/5 animate-[fadeIn_0.5s_ease-out]">
              <div className="flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {loading ? 'Analyzing Neural Pathways...' : 'AI Recommendation'}
              </div>
              <div className="text-slate-200 leading-relaxed font-mono text-sm p-8 bg-black/40 rounded-3xl border border-white/5 shadow-inner whitespace-pre-wrap min-h-[100px]">
                {displayedResponse}
                {loading && <span className="animate-pulse">|</span>}
                {!loading && displayedResponse && <span className="animate-pulse text-indigo-500">_</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};