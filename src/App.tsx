import React, { useState } from 'react';
import { 
  Mic2, 
  Languages, 
  Play, 
  RotateCcw, 
  Clipboard, 
  Sparkles, 
  Loader2,
  Volume2,
  FileText,
  MessageSquareQuote
} from 'lucide-react';
import { generateDubbingScript, DubbingLine } from './services/gemini';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [inputScript, setInputScript] = useState('');
  const [results, setResults] = useState<DubbingLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputScript.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateDubbingScript(inputScript);
      setResults(data);
    } catch (err) {
      setError('Failed to generate script. Please check your connection and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputScript('');
    setResults([]);
    setError(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E6] font-sans selection:bg-[#F27D26] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#1F1F23] bg-[#0E0E11]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F27D26] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(242,125,38,0.3)]">
              <Mic2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase italic font-serif">
                Anime Dub <span className="text-[#F27D26]">Director</span>
              </h1>
              <p className="text-[10px] text-[#8E9299] uppercase tracking-[0.2em] font-mono">
                Professional Hindi Localization Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-[#8E9299] bg-[#151619] px-3 py-1.5 rounded-full border border-[#1F1F23]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEM_READY // V3.1
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-[#151619] rounded-2xl border border-[#1F1F23] p-6 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Languages size={120} />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="text-[#F27D26] w-4 h-4" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#8E9299]">Source Script</h2>
              </div>
              <button 
                onClick={handleReset}
                className="text-[10px] uppercase tracking-tighter text-[#8E9299] hover:text-white transition-colors flex items-center gap-1"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <textarea
              value={inputScript}
              onChange={(e) => setInputScript(e.target.value)}
              placeholder="Paste your English or Bengali anime script here...&#10;&#10;Example:&#10;Naruto: I will never give up! That's my ninja way!&#10;Sasuke: You're still as annoying as ever."
              className="w-full h-[400px] bg-[#0E0E11] border border-[#1F1F23] rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#F27D26] transition-all resize-none placeholder:text-[#3A3A40]"
            />

            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputScript.trim()}
              className={cn(
                "w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-3 transition-all",
                isLoading || !inputScript.trim() 
                  ? "bg-[#1F1F23] text-[#3A3A40] cursor-not-allowed" 
                  : "bg-[#F27D26] text-white hover:bg-[#FF8A33] shadow-[0_4px_20px_rgba(242,125,38,0.2)] active:scale-[0.98]"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Analyzing Script...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Generate Dubbing Script
                </>
              )}
            </button>
          </section>

          {/* Quick Tips */}
          <div className="bg-[#151619]/50 rounded-xl border border-[#1F1F23] p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#F27D26] mb-3 flex items-center gap-2">
              <Sparkles size={12} /> Director's Notes
            </h3>
            <ul className="space-y-2 text-[11px] text-[#8E9299]">
              <li className="flex gap-2">
                <span className="text-[#F27D26]">•</span>
                Use character names followed by a colon for better parsing.
              </li>
              <li className="flex gap-2">
                <span className="text-[#F27D26]">•</span>
                Include scene context if possible for more accurate emotional cues.
              </li>
              <li className="flex gap-2">
                <span className="text-[#F27D26]">•</span>
                The AI automatically optimizes for Hindi lip-sync timing.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {results.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquareQuote className="text-[#F27D26] w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#8E9299]">Dubbing Output</h2>
                  </div>
                  <div className="text-[10px] font-mono text-[#8E9299]">
                    {results.length} LINES PROCESSED
                  </div>
                </div>

                <div className="bg-[#151619] rounded-2xl border border-[#1F1F23] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#0E0E11] border-b border-[#1F1F23]">
                          <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#8E9299] w-24">Char</th>
                          <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#8E9299]">Original / Hindi Dub</th>
                          <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#8E9299] w-48">Emotional Cue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1F1F23]">
                        {results.map((line, idx) => (
                          <motion.tr 
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group hover:bg-[#1F1F23]/30 transition-colors"
                          >
                            <td className="px-4 py-4 align-top">
                              <span className="text-[11px] font-bold text-[#F27D26] uppercase tracking-tighter block truncate">
                                {line.character}
                              </span>
                            </td>
                            <td className="px-4 py-4 space-y-3">
                              <div className="text-[11px] text-[#8E9299] italic opacity-60">
                                "{line.originalLine}"
                              </div>
                              <div className="relative group/line">
                                <div className="text-sm font-medium text-white leading-relaxed">
                                  {line.hindiDubbedScript}
                                </div>
                                <button 
                                  onClick={() => copyToClipboard(line.hindiDubbedScript)}
                                  className="absolute -right-2 top-0 p-1 opacity-0 group-hover/line:opacity-100 transition-opacity text-[#8E9299] hover:text-[#F27D26]"
                                  title="Copy Hindi Script"
                                >
                                  <Clipboard size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <div className="bg-[#0E0E11] rounded-lg p-2 border border-[#1F1F23] group-hover:border-[#F27D26]/30 transition-colors">
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#F27D26] uppercase mb-1">
                                  <Volume2 size={10} /> Expression
                                </div>
                                <p className="text-[11px] text-[#8E9299] leading-tight font-serif italic">
                                  {line.emotionalCue}
                                </p>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : isLoading ? (
              <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-[#1F1F23] border-t-[#F27D26] rounded-full animate-spin" />
                  <Mic2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#F27D26] w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase italic tracking-widest animate-pulse">Processing Vocal Dynamics</h3>
                  <p className="text-xs text-[#8E9299] font-mono mt-2">OPTIMIZING LIP-SYNC // ANALYZING EMOTIONAL INFLECTION</p>
                </div>
              </div>
            ) : (
              <div className="h-[600px] border-2 border-dashed border-[#1F1F23] rounded-2xl flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-[#151619] rounded-full flex items-center justify-center mb-4 border border-[#1F1F23]">
                  <Play className="text-[#3A3A40] w-6 h-6 ml-1" />
                </div>
                <h3 className="text-sm font-bold text-[#8E9299] uppercase tracking-widest">Ready for Production</h3>
                <p className="text-xs text-[#3A3A40] max-w-xs mt-2">
                  Enter your anime script on the left to generate professional-grade Hindi dubbing scripts with emotional cues.
                </p>
              </div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1F1F23] py-8 mt-12 bg-[#0E0E11]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#3A3A40] uppercase tracking-widest">
            <span>© 2026 ANIME DUB DIRECTOR AI</span>
            <span className="hidden md:inline">|</span>
            <span>HINDI LOCALIZATION SPECIALIST</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] text-[#8E9299]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F27D26]" />
              LIP-SYNC OPTIMIZED
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#8E9299]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F27D26]" />
              EMOTIONAL INFLECTION V2
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
