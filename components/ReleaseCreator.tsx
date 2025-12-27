import React, { useState } from 'react';
import { ReleaseMetadata } from '../types';
import { generateCoverArt, analyzeReleaseMetadata } from '../services/gemini';
import { Wand2, Upload, Disc, CheckCircle, Loader2, FileAudio, FileImage, ShieldCheck, AlertCircle, Calendar, Globe, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export const ReleaseCreator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [artworkMode, setArtworkMode] = useState<'generate' | 'upload'>('generate');

  const [metadata, setMetadata] = useState<Partial<ReleaseMetadata>>({
    status: 'draft',
    language: 'en',
    type: 'Single',
    explicit: false,
    releaseDate: new Date().toISOString().split('T')[0],
    cLine: `© ${new Date().getFullYear()} `,
    pLine: `℗ ${new Date().getFullYear()} `,
  });

  const handleInputChange = (field: keyof ReleaseMetadata, value: any) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateArt = async () => {
    if (!metadata.title && !metadata.primaryGenre) return;
    setLoading(true);
    try {
      const prompt = `Album cover for ${metadata.primaryGenre} track named "${metadata.title}" by ${metadata.displayArtist || 'artist'}. ${metadata.secondaryGenre ? `Style: ${metadata.secondaryGenre}` : 'Abstract, minimalist, high fidelity'}.`;
      const img = await generateCoverArt(prompt);
      if (img) {
        setGeneratedImage(img);
        handleInputChange('coverArtUrl', img);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setGeneratedImage(result);
        handleInputChange('coverArtUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeReleaseMetadata(metadata);
      setAiAnalysis(analysis);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'DDEX Metadata' },
    { id: 2, label: 'Media Assets' },
    { id: 3, label: 'Artwork' },
    { id: 4, label: 'Neural Review' }
  ];

  return (
    <div className="max-w-6xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12 px-4">
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center relative z-10">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 ${
                step >= s.id 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                  : 'bg-[#0f0f19] border-slate-700 text-slate-500'
              }`}
            >
              {step > s.id ? <CheckCircle size={18} /> : s.id}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest mt-3 ${step >= s.id ? 'text-indigo-400' : 'text-slate-600'}`}>
              {s.label}
            </span>
          </div>
        ))}
        {/* Progress Line */}
        <div className="absolute top-[4.5rem] left-0 w-full h-0.5 bg-slate-800 -z-0 hidden md:block max-w-[calc(100%-4rem)] mx-8 translate-x-4">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-[#0f0f19]/70 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl min-h-[600px] relative">
        
        {/* Step 1: DDEX Metadata */}
        {step === 1 && (
          <div className="space-y-8 animate-[slideIn_0.3s_ease-out]">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <Disc size={20} />
                </div>
                <h3 className="text-xl font-black text-white">Core Metadata (DDEX 4.3)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Track Title" value={metadata.title} onChange={v => handleInputChange('title', v)} placeholder="e.g. Midnight Horizon" />
              <InputGroup label="Display Artist" value={metadata.displayArtist} onChange={v => handleInputChange('displayArtist', v)} placeholder="e.g. Lunar Boy" />
              <InputGroup label="Primary Genre" value={metadata.primaryGenre} onChange={v => handleInputChange('primaryGenre', v)} placeholder="e.g. Electronic" />
              
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Release Type" value={metadata.type} onChange={v => handleInputChange('type', v)} placeholder="Single, EP, Album" />
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Release Date</label>
                    <div className="relative">
                        <input 
                            type="date" 
                            value={metadata.releaseDate}
                            onChange={e => handleInputChange('releaseDate', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium placeholder:text-slate-700"
                        />
                        <Calendar className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={16} />
                    </div>
                 </div>
              </div>
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                <InputGroup label="Label Name" value={metadata.labelName} onChange={v => handleInputChange('labelName', v)} placeholder="Record Label LLC" />
                <InputGroup label="C-Line (Copyright)" value={metadata.cLine} onChange={v => handleInputChange('cLine', v)} />
                <InputGroup label="P-Line (Phonographic)" value={metadata.pLine} onChange={v => handleInputChange('pLine', v)} />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup label="UPC / EAN" value={metadata.upc} onChange={v => handleInputChange('upc', v)} placeholder="Auto-generate if empty" />
                <InputGroup label="GRID / ISRC" value={metadata.grid} onChange={v => handleInputChange('grid', v)} placeholder="Auto-generate if empty" />
                <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Content Language</label>
                     <div className="relative">
                        <select 
                            value={metadata.language}
                            onChange={e => handleInputChange('language', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium appearance-none"
                        >
                            <option value="en" className="bg-[#0f0f19]">English</option>
                            <option value="es" className="bg-[#0f0f19]">Spanish</option>
                            <option value="fr" className="bg-[#0f0f19]">French</option>
                            <option value="de" className="bg-[#0f0f19]">German</option>
                            <option value="jp" className="bg-[#0f0f19]">Japanese</option>
                        </select>
                        <Globe className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={16} />
                    </div>
                </div>
              </div>

               <div className="md:col-span-2 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${metadata.explicit ? 'bg-red-500/20 border-red-500' : 'border-slate-600 bg-white/5'}`}>
                             {metadata.explicit && <AlertTriangle size={14} className="text-red-500" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={metadata.explicit} onChange={e => handleInputChange('explicit', e.target.checked)} />
                        <span className={`text-sm font-bold transition-colors ${metadata.explicit ? 'text-red-400' : 'text-slate-400 group-hover:text-white'}`}>Explicit Content (Parental Advisory)</span>
                    </label>
               </div>

            </div>
          </div>
        )}

        {/* Step 2: Media Assets */}
        {step === 2 && (
          <div className="space-y-8 animate-[slideIn_0.3s_ease-out]">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                    <FileAudio size={20} />
                </div>
                <h3 className="text-xl font-black text-white">Master Audio Ingestion</h3>
            </div>

            <div 
              className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all cursor-pointer group"
              onClick={() => setAudioFile('master-v1.flac')}
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4 group-hover:scale-110 transition-transform group-hover:text-white">
                {audioFile ? <CheckCircle className="text-emerald-500" /> : <Upload />}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{audioFile ? audioFile : 'Drop Master File (WAV/FLAC)'}</h4>
              <p className="text-xs text-slate-500 font-medium">Supports 24-bit/96kHz • Max 500MB</p>
            </div>

            {audioFile && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4 animate-[fadeIn_0.5s_ease-out]">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-emerald-400">Analysis Complete: 124 BPM • Key: Am • Loudness: -14 LUFS</span>
                </div>
            )}
          </div>
        )}

        {/* Step 3: Artwork */}
        {step === 3 && (
          <div className="space-y-8 animate-[slideIn_0.3s_ease-out]">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                    <FileImage size={20} />
                </div>
                <h3 className="text-xl font-black text-white">Artwork & Visuals</h3>
            </div>

            <div className="flex bg-white/5 p-1 rounded-xl w-fit mb-6">
                <button 
                    onClick={() => setArtworkMode('generate')}
                    className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${artworkMode === 'generate' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                    <Wand2 size={14} /> Generative AI
                </button>
                <button 
                    onClick={() => setArtworkMode('upload')}
                    className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${artworkMode === 'upload' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                    <Upload size={14} /> Manual Upload
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {artworkMode === 'generate' ? (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    <p className="text-sm text-slate-400">
                    Generate unique, high-fidelity artwork tailored to your track's mood and metadata using Gemini Vision.
                    </p>
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Prompt Context</p>
                        <p className="text-sm text-white italic">"{metadata.primaryGenre} track named {metadata.title}..."</p>
                    </div>
                    <button 
                    onClick={handleGenerateArt}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                    >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                    Generate Artwork
                    </button>
                </div>
              ) : (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    <p className="text-sm text-slate-400">
                        Upload your 3000x3000px compliant artwork. Must be JPG or PNG, RGB color space.
                    </p>
                    <label className="block w-full border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all cursor-pointer group">
                        <input type="file" className="hidden" accept="image/*" onChange={handleManualUpload} />
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3 group-hover:scale-110 transition-transform group-hover:text-white">
                            <Upload size={20} />
                        </div>
                        <p className="text-sm font-bold text-white">Click to Upload Image</p>
                        <p className="text-xs text-slate-500 mt-1">Max 5MB</p>
                    </label>
                </div>
              )}

              <div className="aspect-square bg-black/40 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group">
                {generatedImage ? (
                  <>
                    <img src={generatedImage} alt="Art" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform">View Full</button>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-mono border border-white/10">
                        {artworkMode === 'generate' ? 'AI GENERATED' : 'USER UPLOAD'}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-600">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-widest">No Artwork Selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

         {/* Step 4: Neural Review */}
         {step === 4 && (
          <div className="space-y-8 animate-[slideIn_0.3s_ease-out]">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                    <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-black text-white">Neural Compliance Review</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
                 {!aiAnalysis ? (
                    <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-white/5">
                        <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                            Our Gemini 3 powered neural engine will scan your metadata against 50+ DSP style guides (Spotify, Apple Music, Tidal) to ensure 100% compliance and optimize for SEO.
                        </p>
                        <button 
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="bg-cyan-500 hover:bg-cyan-400 text-black py-4 px-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all inline-flex items-center gap-3 hover:scale-105"
                        >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                        Run Gemini 3 Flash Audit
                        </button>
                    </div>
                 ) : (
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-8 animate-[fadeIn_0.5s_ease-out] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
                        <div className="flex items-center gap-3 mb-6">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Analysis Complete</span>
                        </div>
                        <div className="font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                            {aiAnalysis}
                        </div>
                    </div>
                 )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 w-full p-8 border-t border-white/5 flex justify-between items-center bg-[#0f0f19]/90 backdrop-blur-xl rounded-b-3xl z-20">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="text-slate-500 hover:text-white font-bold text-xs uppercase tracking-wider disabled:opacity-30 transition-colors flex items-center gap-2"
          >
            Back
          </button>
          
          {step < 4 ? (
             <button 
                onClick={() => setStep(s => Math.min(4, s + 1))}
                className="bg-white text-black hover:bg-slate-200 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-white/10"
            >
                Continue
            </button>
          ) : (
            <button 
                className="bg-emerald-500 text-white hover:bg-emerald-400 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-105"
            >
                <CheckCircle size={16} /> Distribute Release
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{ label: string; value?: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type="text" 
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium placeholder:text-slate-700"
      placeholder={placeholder}
    />
  </div>
);