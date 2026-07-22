import React, { useState, useRef, useEffect } from 'react';
import { BanknoteAnalysisResult } from '../types';
import { 
  CreditCard, 
  Eye, 
  AlertCircle, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Upload,
  Cpu,
  Shield,
  Activity,
  Maximize2,
  Lock,
  Layers,
  Sparkles,
  Sliders,
  Atom,
  Radio,
  Sun,
  Flame,
  Info
} from 'lucide-react';

interface CurrencyScannerProps {
  onScan: (imageBase64: string, noteDetails: any) => Promise<BanknoteAnalysisResult>;
  loading: boolean;
  onReportNewIncident?: (report: any) => Promise<any> | void;
}

type SpectralMode = 'VIS' | 'UV' | 'IR';

export default function CurrencyScanner({ onScan, loading, onReportNewIncident }: CurrencyScannerProps) {
  const [selectedNote, setSelectedNote] = useState<any | null>({
    id: "tpl-genuine",
    label: "Genuine ₹500 Bill (Reference Standard)",
    serialNumber: "8AB 324128",
    isFakeTemplate: false,
    colorTheme: "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400",
    description: "Official currency issue featuring standard Microprinting, Gandhi Intaglio Portraits, and optical-shift security threads."
  });
  const [analysisResult, setAnalysisResult] = useState<BanknoteAnalysisResult | null>(null);
  const [scanAnimation, setScanAnimation] = useState(false);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New multi-spectral forensic states
  const [spectralMode, setSpectralMode] = useState<SpectralMode>('VIS');
  const [sensorGain, setSensorGain] = useState<number>(100);
  const [scanSpeed, setScanSpeed] = useState<number>(50);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  // Oscilloscope scanning signal waves
  const [signalTicks, setSignalTicks] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate organic oscilloscope waveforms dynamically based on speed & selected spectrum
    const interval = setInterval(() => {
      setSignalTicks(prev => {
        let multiplier = 25;
        if (scanAnimation) multiplier = 55;
        else if (spectralMode === 'UV') multiplier = 40;
        else if (spectralMode === 'IR') multiplier = 30;

        const next = [...prev, Math.random() * multiplier + (spectralMode === 'UV' ? 30 : 10)];
        if (next.length > 30) next.shift();
        return next;
      });
    }, Math.max(50, 160 - scanSpeed));

    return () => clearInterval(interval);
  }, [scanAnimation, spectralMode, scanSpeed]);

  // High-fidelity pre-loaded Indian currency templates (Authentic vs Fake)
  const noteTemplates = [
    {
      id: "tpl-genuine",
      label: "Genuine ₹500 Bill (Reference Standard)",
      serialNumber: "8AB 324128",
      isFakeTemplate: false,
      colorTheme: "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400",
      description: "Official currency issue featuring standard Microprinting, Gandhi Intaglio Portraits, and optical-shift security threads."
    },
    {
      id: "tpl-fake",
      label: "Suspected Counterfeit ₹500 (High-Quality FICN)",
      serialNumber: "5CD 992481",
      isFakeTemplate: true,
      colorTheme: "border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400",
      description: "Flagged high-denomination fake note detected at cooperative bank. Missing proper Devanagari microprint and optical ink shifts."
    }
  ];

  const handleSelectTemplate = (tpl: any) => {
    setSelectedNote(tpl);
    setUploadedImageBase64(null);
    setAnalysisResult(null);
    setScanAnimation(false);
    triggerCalibrationEffect();
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedImageBase64(base64);
      setSelectedNote({
        id: "custom-upload",
        label: `Uploaded: ${file.name}`,
        serialNumber: "Detecting...",
        isFakeTemplate: false,
        description: "User uploaded image of ₹500 banknote."
      });
      setAnalysisResult(null);
      setScanAnimation(false);
      triggerCalibrationEffect();
    };
    reader.readAsDataURL(file);
  };

  // Immersive visual pulse whenever modes change
  const triggerCalibrationEffect = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
    }, 600);
  };

  const changeSpectralMode = (mode: SpectralMode) => {
    setSpectralMode(mode);
    triggerCalibrationEffect();
  };

  const triggerScanAnalysis = async () => {
    if (!selectedNote && !uploadedImageBase64) return;
    
    // Start scan animation
    setScanAnimation(true);
    setAnalysisResult(null);

    try {
      const dummyBase64 = uploadedImageBase64 || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      const result = await onScan(dummyBase64, {
        isFakeTemplate: selectedNote?.isFakeTemplate || false,
        serialNumber: selectedNote?.serialNumber || "Unknown",
        isCustomUpload: !!uploadedImageBase64
      });
      setAnalysisResult(result);
    } catch (err) {
      console.error("Currency scanning failed:", err);
    } finally {
      setScanAnimation(false);
    }
  };

  // Dust fluorescent fibers scatter parameters under UV light
  const fluorescentFibers = [
    { top: '15%', left: '18%', color: 'bg-rose-400 shadow-rose-400', rotate: '12deg', len: 'w-4' },
    { top: '32%', left: '42%', color: 'bg-green-400 shadow-green-400', rotate: '-35deg', len: 'w-5' },
    { top: '68%', left: '22%', color: 'bg-cyan-400 shadow-cyan-400', rotate: '45deg', len: 'w-3' },
    { top: '18%', left: '72%', color: 'bg-yellow-400 shadow-yellow-400', rotate: '80deg', len: 'w-4' },
    { top: '78%', left: '78%', color: 'bg-rose-400 shadow-rose-400', rotate: '-15deg', len: 'w-3.5' },
    { top: '48%', left: '62%', color: 'bg-green-400 shadow-green-400', rotate: '30deg', len: 'w-6' },
    { top: '82%', left: '38%', color: 'bg-cyan-400 shadow-cyan-400', rotate: '60deg', len: 'w-4' },
    { top: '22%', left: '33%', color: 'bg-yellow-400 shadow-yellow-400', rotate: '-45deg', len: 'w-5' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 bg-transparent">
      
      {/* Dynamic UV and Infrared SVG Filter Definitions */}
      <svg className="hidden">
        <defs>
          <filter id="forensic-uv-filter">
            {/* Shift spectrum to purple and dark violet, and blow up the blues & greens */}
            <feColorMatrix type="matrix" values="
              0.10  0.00  0.30  0.00  0.10
              0.00  0.15  0.00  0.00  0.00
              0.60  0.30  1.60  0.00  0.20
              0.00  0.00  0.00  1.00  0.00" 
            />
            {/* Add responsive color blur for neon fluorescence glow */}
            <feGaussianBlur stdDeviation="1.0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="forensic-ir-filter">
            {/* Convert to high-contrast Metameric Infrared monochrome */}
            <feColorMatrix type="matrix" values="
              0.299  0.587  0.114  0.00  0.00
              0.299  0.587  0.114  0.00  0.00
              0.299  0.587  0.114  0.00  0.00
              0.000  0.000  0.000  1.00  0.00" 
            />
            <feComponentTransfer>
              <feFuncR type="linear" slope="3.0" intercept="-0.8" />
              <feFuncG type="linear" slope="3.0" intercept="-0.8" />
              <feFuncB type="linear" slope="3.0" intercept="-0.8" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* 1. Selection & Scan Stage (Left Col - 7 Span) */}
      <div className="lg:col-span-7 bg-[#03070f]/95 border border-blue-950 rounded-2xl p-6 flex flex-col justify-between min-h-[580px] shadow-2xl relative overflow-hidden">
        
        {/* Holographic Background Matrix Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#081022_1px,transparent_1px),linear-gradient(to_bottom,#081022_1px,transparent_1px)] bg-[size:16px_16px] opacity-35 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-blue-950 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/25 rounded-xl">
                <Atom className="w-5.5 h-5.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <h3 className="text-sm font-display font-black text-slate-100 uppercase tracking-wider">
                  HOLOGRAPHIC FORENSICS LAB
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">MULTI-SPECTRAL BANKNOTE ANALYSIS TERMINAL</p>
              </div>
            </div>
            <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg font-black uppercase tracking-widest animate-pulse">
              LAB-SPEC LEVEL 3
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-5 font-sans leading-relaxed">
            Examine the structural and chemical security features of high-value Indian Rupees (₹500 denomination). Utilize custom SVG-filtered UV/IR light sensors to verify microscopic intaglio matrix threads and metameric ink signatures.
          </p>

          {/* Reference Case Library */}
          <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-wider block">
                CASE REFERENCE STANDARDS
              </span>
              <span className="text-[9px] font-mono text-cyan-500">MHA_FICN_STANDARDS.DB</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {noteTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`border p-4 rounded-xl text-left cursor-pointer transition-all duration-300 flex flex-col justify-between gap-2 h-28 relative overflow-hidden ${
                    selectedNote?.id === tpl.id 
                      ? 'border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500/35 shadow-md shadow-cyan-950/20 text-cyan-300' 
                      : 'border-blue-950/60 hover:border-blue-900 bg-[#02050a]/80 text-slate-300 hover:bg-[#050b16]'
                  }`}
                >
                  <div className="relative z-10">
                    <span className="text-[11px] font-display font-black block flex items-center gap-1.5 uppercase tracking-wide truncate">
                      <Shield className={`w-3.5 h-3.5 shrink-0 ${tpl.isFakeTemplate ? 'text-rose-400' : 'text-emerald-400'}`} />
                      {tpl.label}
                    </span>
                    <span className="text-[9px] text-slate-500 font-sans block mt-1 leading-normal line-clamp-2">
                      {tpl.description}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[8px] font-mono border-t border-blue-950/40 pt-1.5 mt-1 relative z-10">
                    <span className="text-slate-500">SERIAL BLOCK</span>
                    <span className="font-extrabold text-slate-400 tracking-wider">{tpl.serialNumber}</span>
                  </div>

                  {selectedNote?.id === tpl.id && (
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-24 h-24 bg-cyan-500/5 rounded-full filter blur-xl pointer-events-none" />
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={handleUploadClick}
                className={`border p-4 rounded-xl text-left cursor-pointer transition-all duration-300 flex flex-col justify-between gap-2 h-28 relative overflow-hidden ${
                  selectedNote?.id === 'custom-upload'
                    ? 'border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500/35 shadow-md shadow-cyan-950/20 text-cyan-300'
                    : 'border-dashed border-blue-500/30 hover:border-cyan-500 bg-blue-500/5 text-slate-300 hover:bg-blue-500/10'
                }`}
              >
                <div className="relative z-10 flex flex-col justify-between h-full w-full">
                  <div>
                    <span className="text-[11px] font-display font-black block flex items-center gap-1.5 uppercase tracking-wide text-cyan-400">
                      <Upload className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                      Upload Custom Note
                    </span>
                    <span className="text-[9px] text-slate-400 font-sans block mt-1 leading-normal line-clamp-2">
                      {uploadedImageBase64 ? 'Spectral attachment registered.' : 'Analyze physical bill snapshot from file.'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-mono border-t border-blue-950/40 pt-1.5 mt-1">
                    <span className="text-slate-500">STATUS</span>
                    <span className="font-extrabold tracking-wider text-cyan-400">
                      {uploadedImageBase64 ? '✓ LOADED' : 'SELECT IMAGE'}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Immersive Spectral Mode Hub Selectors */}
          <div className="bg-[#020509] border border-blue-950 rounded-2xl p-4 mb-5">
            <span className="text-[9px] text-slate-500 font-mono font-black uppercase tracking-wider block mb-3">
              SPECTRAL WAVE LENS SELECTOR (CHOOSE LENS MODE)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'VIS', name: 'VISIBLE LIGHT', wave: '550 nm', color: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/5', activeColor: 'bg-emerald-500/15 border-emerald-500 text-emerald-300' },
                { id: 'UV', name: 'ULTRAVIOLET', wave: '365 nm', color: 'border-purple-500/30 text-purple-400 hover:bg-purple-500/5', activeColor: 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-purple-950/50 shadow-inner' },
                { id: 'IR', name: 'INFRARED METAMERIC', wave: '850 nm', color: 'border-amber-500/30 text-amber-400 hover:bg-amber-500/5', activeColor: 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-amber-950/50 shadow-inner' }
              ].map((spec) => (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => changeSpectralMode(spec.id as SpectralMode)}
                  className={`border py-3 px-2 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                    spectralMode === spec.id 
                      ? spec.activeColor + ' scale-[1.02] font-extrabold ring-1 ring-white/10'
                      : spec.color + ' font-semibold'
                  }`}
                >
                  <span className="text-[10px] font-display tracking-wider uppercase">{spec.name}</span>
                  <span className="text-[9px] font-mono opacity-85 px-2 py-0.5 rounded-md bg-black/40 border border-white/5">{spec.wave}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Everyday Language Explanation of the Scientific Mode */}
            <div className="mt-3.5 p-3 rounded-xl bg-slate-950 border border-slate-900 text-[11px] leading-relaxed text-slate-300 font-sans flex items-start gap-2.5">
              <Info className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                {spectralMode === 'VIS' && (
                  <span>
                    <strong>Visible Light Mode (Standard Sight Scan):</strong> Examines Mahatma Gandhi's portrait, serial numbers, and visual crispness. Real bills have sharp, non-blurry ink and microprints on the border.
                  </span>
                )}
                {spectralMode === 'UV' && (
                  <span>
                    <strong>Ultraviolet Mode (Blacklight Fiber Scan):</strong> Triggers glowing fluorescent security fibers scattered across the paper and reveals the official glowing RBI shield. Counterfeit copies usually remain completely dull.
                  </span>
                )}
                {spectralMode === 'IR' && (
                  <span>
                    <strong>Infrared Mode (Metameric Ink Scan):</strong> Simulates specialized infrared camera sensors. Real banknotes use unique inks that make the Gandhi portrait completely invisible, while the metallic thread is partially visible. Counterfeit notes usually fail this test.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Active Banknote Forensic Stage Visualizer */}
          {(selectedNote || uploadedImageBase64) && (
            <div className={`relative border border-blue-950 bg-[#010307] rounded-2xl p-5 overflow-hidden h-52 flex items-center justify-center shadow-inner select-none transition-all duration-300 ${
              spectralMode === 'UV' ? 'bg-[#020108]' : spectralMode === 'IR' ? 'bg-[#060606]' : ''
            }`}>
              
              {/* Scan laser line animation */}
              {(scanAnimation || loading) && (
                <div 
                  className={`absolute left-0 right-0 h-[4px] shadow-lg shadow-cyan-400/80 bg-cyan-400 z-30 animate-[bounce_2s_infinite]`}
                  style={{
                    boxShadow: '0 0 12px #22d3ee, 0 0 20px #06b6d4',
                  }}
                />
              )}

              {/* Glass Scan Loading Overlay */}
              {(loading) && (
                <div className="absolute inset-0 bg-[#020509]/90 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 z-20 animate-fade-in space-y-3">
                  <div className="relative">
                    <Atom className="w-10 h-10 text-cyan-400 animate-spin" style={{ animationDuration: '2s' }} />
                    <Activity className="absolute inset-0 m-auto w-4 h-4 text-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-wider font-extrabold uppercase animate-pulse">
                    COGNITIVE SPECTRAL SCAN ACTIVE...
                  </span>
                  <div className="w-40 h-1 bg-slate-950 border border-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 animate-[pulse_1.5s_infinite]" style={{ width: '70%' }} />
                  </div>
                </div>
              )}

              {/* Calibration Screen flash overlay */}
              {isCalibrating && (
                <div className="absolute inset-0 bg-cyan-400/25 animate-pulse z-20 transition-all pointer-events-none" />
              )}

              {/* Grid Background HUD layer */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:15px_15px] opacity-25 pointer-events-none" />

              {/* Absolute Corner HUD Tech Markings */}
              <div className="absolute top-2 left-2 text-[8px] text-slate-600 font-mono">CH:{spectralMode}_ALIGNMENT_V1</div>
              <div className="absolute bottom-2 left-2 text-[8px] text-slate-600 font-mono">GAIN:{(sensorGain)}%</div>
              <div className="absolute top-2 right-2 text-[8px] text-slate-600 font-mono">WAVE:{spectralMode === 'VIS' ? '550nm' : spectralMode === 'UV' ? '365nm' : '850nm'}</div>
              <div className="absolute bottom-2 right-2 text-[8px] text-slate-600 font-mono">SWEEP_FREQ:{scanSpeed}Hz</div>

              {uploadedImageBase64 ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={uploadedImageBase64} 
                    alt="Forensic Currency Bill" 
                    className="max-h-full max-w-full object-contain rounded-lg transition-all duration-300"
                    style={{ 
                      filter: spectralMode === 'UV' 
                        ? `url(#forensic-uv-filter) contrast(${sensorGain / 100}) brightness(1.2)` 
                        : spectralMode === 'IR' 
                          ? `url(#forensic-ir-filter) brightness(${sensorGain / 100}) contrast(1.1)` 
                          : `contrast(${sensorGain / 100}) brightness(1.0)`
                    }}
                  />
                  
                  {/* Fluorescent Overlay elements over custom uploaded photo under UV */}
                  {spectralMode === 'UV' && (
                    <div className="absolute inset-0 pointer-events-none z-10 animate-fade-in">
                      {/* Fluorescent fibres scatter */}
                      {fluorescentFibers.map((fib, idx) => (
                        <div 
                          key={idx}
                          className={`absolute h-0.5 rounded-full opacity-80 animate-pulse ${fib.color} ${fib.len}`}
                          style={{
                            top: fib.top,
                            left: fib.left,
                            transform: `rotate(${fib.rotate})`,
                            animationDelay: `${idx * 0.25}s`,
                            filter: 'blur(0.3px)'
                          }}
                        />
                      ))}
                      
                      {/* Central Glowing Thread on upload placeholder area */}
                      <div className="absolute left-[54%] top-0 bottom-0 w-2 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 opacity-60 shadow-md shadow-lime-400 animate-pulse" />
                    </div>
                  )}
                </div>
              ) : (
                /* Interactive Holographic Vector representation of Rs 500 bill with precise spectral response */
                <div 
                  className={`w-full h-full max-w-[380px] border rounded-xl flex flex-col justify-between p-4 relative font-mono overflow-hidden transition-all duration-300 ${
                    spectralMode === 'UV' 
                      ? 'border-purple-900/50 bg-purple-950/10 text-purple-400/90' 
                      : spectralMode === 'IR' 
                        ? 'border-neutral-800 bg-neutral-900/10 text-neutral-400/90' 
                        : 'border-emerald-900/30 bg-emerald-950/15 text-emerald-400/80'
                  }`}
                  style={{
                    filter: spectralMode === 'UV'
                      ? `url(#forensic-uv-filter) contrast(${sensorGain / 100})`
                      : spectralMode === 'IR'
                        ? `url(#forensic-ir-filter) brightness(${sensorGain / 100})`
                        : `contrast(${sensorGain / 100})`
                  }}
                >
                  {/* Scanning scan line overlay glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse pointer-events-none" />

                  <div className="flex justify-between items-start">
                    <span className="text-sm font-black text-emerald-300">₹500</span>
                    <div className="text-center">
                      <span className="text-[7px] block font-black tracking-widest">RESERVE BANK OF INDIA</span>
                      <span className="text-[4.5px] block font-sans uppercase opacity-65">GUARANTEED BY THE CENTRAL GOVERNMENT</span>
                    </div>
                    <span className="text-[9px] font-black tracking-wider text-cyan-400">{selectedNote.serialNumber}</span>
                  </div>

                  {/* Gandhi portrait, metameric thread & watermark zones */}
                  <div className="flex items-center justify-between gap-3 my-2">
                    {/* Watermark Zone - UV fluorescent, IR transparent */}
                    <div className={`w-11 h-11 border rounded-full flex flex-col items-center justify-center text-[5.5px] bg-[#02050a]/40 transition-all duration-300 ${
                      spectralMode === 'UV' 
                        ? 'border-cyan-500/40 text-cyan-400/80 animate-pulse shadow-md shadow-cyan-950' 
                        : spectralMode === 'IR' 
                          ? 'border-neutral-900 text-neutral-900/10 opacity-5' 
                          : 'border-emerald-900/20 text-emerald-500/40'
                    }`}>
                      {spectralMode === 'UV' ? (
                        <>
                          <div className="w-5 h-5 rounded-full border border-dashed border-cyan-400/50 flex items-center justify-center">
                            <Lock className="w-3 h-3 text-cyan-400 animate-pulse" />
                          </div>
                          <span className="mt-1 font-black">VALID WM</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-emerald-500/15" />
                          <span className="mt-0.5">WATERMARK</span>
                        </>
                      )}
                    </div>

                    {/* Optically Variable / Metameric Security Thread */}
                    {/* Under IR: only half of the thread absorbs and is visible. Under UV: Fluoresces yellow/green. */}
                    <div className={`w-2 h-20 rounded border-r transition-all duration-300 ${
                      spectralMode === 'UV' 
                        ? 'bg-yellow-400 border-yellow-300 animate-pulse shadow-md shadow-yellow-500/50' 
                        : spectralMode === 'IR'
                          ? 'bg-neutral-900 border-neutral-950 h-10 opacity-100' // Half visible in IR
                          : 'bg-emerald-500 border-emerald-600'
                    }`} />

                    {/* Mahatma Gandhi Portrait zone - invisible under IR metameric check */}
                    <div className={`w-14 h-16 border bg-[#02050a]/50 rounded flex flex-col items-center justify-center relative transition-all duration-300 ${
                      spectralMode === 'IR' 
                        ? 'border-neutral-950 opacity-5 text-neutral-900' // disappear under IR
                        : spectralMode === 'UV'
                          ? 'border-purple-500/30 text-purple-300 bg-purple-950/20'
                          : 'border-emerald-950/30 bg-emerald-950/20 text-emerald-400/90'
                    }`}>
                      <span className="text-[7px] font-black">GANDHI</span>
                      <span className="text-[4.5px] uppercase opacity-60">Intaglio Matrix</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[5.5px] opacity-70">
                    <span>SWACHH BHARAT</span>
                    <span>Rs 500 DENOMINATION</span>
                  </div>

                  {/* Scatter tiny fluorescent fibres ONLY in UV mode on Mock note */}
                  {spectralMode === 'UV' && (
                    <div className="absolute inset-0 pointer-events-none z-10 animate-fade-in">
                      {fluorescentFibers.map((fib, idx) => (
                        <div 
                          key={idx}
                          className={`absolute h-0.5 rounded-full opacity-95 animate-pulse ${fib.color} ${fib.len}`}
                          style={{
                            top: fib.top,
                            left: fib.left,
                            transform: `rotate(${fib.rotate})`,
                            animationDelay: `${idx * 0.15}s`,
                            filter: 'blur(0.4px)'
                          }}
                        />
                      ))}
                      
                      {/* Fluorescent RBI seal */}
                      <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-6 h-6 rounded-full border border-yellow-400/40 bg-yellow-400/5 flex items-center justify-center text-[4px] font-bold text-yellow-400 animate-pulse">
                        RBI
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Interactive Lab Sliders */}
          <div className="bg-[#020509] border border-blue-950 rounded-2xl p-4 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500 uppercase font-black">Sensor Gain / Light Intensity</span>
                <span className="text-cyan-400 font-bold">{sensorGain}%</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="160" 
                value={sensorGain} 
                onChange={(e) => setSensorGain(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-blue-950 rounded-lg cursor-pointer"
              />
              <span className="text-[9.5px] text-slate-400 font-sans block leading-snug">
                <strong>Brightness:</strong> Slide up to shine brighter light, making faint hidden watermarks and glowing security fibers easier to spot.
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500 uppercase font-black">Scan Sweep Speed / Frequency</span>
                <span className="text-cyan-400 font-bold">{scanSpeed} Hz</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={scanSpeed} 
                onChange={(e) => setScanSpeed(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-blue-950 rounded-lg cursor-pointer"
              />
              <span className="text-[9.5px] text-slate-400 font-sans block leading-snug">
                <strong>Precision:</strong> Adjust the speed of the scanner. Slower speeds check the paper fibers and ink patterns with higher detail.
              </span>
            </div>
          </div>

          {/* Forensic Image Uploader Mount */}
          <div className="mt-5">
            <div 
              onClick={handleUploadClick}
              className={`border-2 border-dashed border-blue-950/60 hover:border-cyan-500/40 bg-[#02050a]/90 rounded-2xl p-5 text-center cursor-pointer transition-all ${
                uploadedImageBase64 ? 'border-cyan-500/30 bg-cyan-500/5' : ''
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                {uploadedImageBase64 ? (
                  <div className="space-y-1">
                    <span className="text-xs text-cyan-400 font-bold font-mono flex items-center justify-center gap-2 animate-pulse">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> 
                      SPECTRAL ATTACHMENT REGISTERED
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono">CLICK TO LOAD ALTERNATE FORENSIC CAPTURE</span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-slate-400 hover:text-cyan-400 transition-colors" />
                    <span className="text-xs text-slate-200 font-black font-display uppercase tracking-wide">
                      Scan Your Own Banknote (Upload ₹500 Note)
                    </span>
                    <span className="text-[10.5px] text-slate-400 font-sans leading-normal">
                      Upload a flat, clear photo of a physical ₹500 banknote. Our smart verification algorithms will analyze the visible features, UV fluorescence, and IR metameric transparency.
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scan Action triggers */}
        {(selectedNote || uploadedImageBase64) && (
          <button
            onClick={triggerScanAnalysis}
            disabled={loading || scanAnimation}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-5 shadow-lg shadow-blue-950/25 cursor-pointer transition-all z-10 font-mono uppercase tracking-wider text-xs border border-blue-500/20"
          >
            {loading || scanAnimation ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                RUNNING AI SPECTRAL ANALYSIS...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                START AI FORENSIC ANALYSIS SCAN
              </>
            )}
          </button>
        )}
      </div>

      {/* 2. Scanning Diagnosis Terminal (Right Col - 5 Span) */}
      <div className="lg:col-span-5 bg-[#03070f]/95 border border-blue-950 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
        
        {/* Decorative Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#081022_1px,transparent_1px),linear-gradient(to_bottom,#081022_1px,transparent_1px)] bg-[size:16px_16px] opacity-35 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        {(loading || scanAnimation) ? (
          <div className="space-y-6 h-full flex flex-col justify-center items-center py-10 relative z-10 text-center animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
              <Cpu className="w-12 h-12 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-cyan-400 font-extrabold uppercase tracking-widest animate-pulse">
                DEPLOYING DISCRIMINATION MATRIX
              </h4>
              <p className="text-[10px] text-slate-400 font-mono max-w-xs leading-relaxed">
                Analyzing fiber luminescence, microprint grid spacing, watermark boundaries, and optically-variable ink signatures via central server.
              </p>
            </div>

            {/* Live Flashing Hexadecimal streams */}
            <div className="w-full bg-[#020509]/95 border border-blue-900/30 rounded-xl p-3 text-left font-mono text-[9px] text-emerald-400/80 space-y-1 h-32 overflow-hidden select-none opacity-80 shadow-inner">
              <div className="text-[8px] text-slate-500 font-bold border-b border-slate-900 pb-1 mb-1.5 flex justify-between">
                <span>CHANNEL DATA_CORE FEED</span>
                <span className="text-cyan-400 animate-pulse">LIVE STREAM</span>
              </div>
              <div className="truncate">SYS_INIT_SEQUENCE: OK [SEC_LEVEL_3]</div>
              <div className="truncate text-cyan-400">UV_FIBER_MATRIX: RUNNING CHANNELS [PASS]</div>
              <div className="truncate">IR_METAMERIC_DENSITY: VALUE 0.84 [CHECK...]</div>
              <div className="truncate text-yellow-400">INTAGLIO_INK_TEXTURE: SCANNING THREADS [ANALYZING]</div>
              <div className="truncate">EM_FREQUENCY: MATCH 344.22 MHz [LOCK]</div>
            </div>

            <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>PROBABILITY DISSECTION</span>
              <span className="text-cyan-400 animate-pulse">STAGE_2_ENGAGED</span>
            </div>
          </div>
        ) : analysisResult ? (
          <div className="space-y-5 h-full flex flex-col justify-between relative z-10 animate-fade-in">
            <div>
              {/* Header result */}
              <div className="border-b border-blue-950 pb-4 mb-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">RBI DISSECTION READOUT</h4>
                  <span className="text-slate-100 font-display font-black text-sm block mt-1 uppercase tracking-wide">
                    DENOMINATION: {analysisResult.denomination}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-widest font-black">VERDICT</span>
                  <span className={`text-xs font-mono font-black uppercase tracking-wider border px-2.5 py-1 rounded-md ${
                    analysisResult.isGenuine 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' 
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse'
                  }`}>
                    {analysisResult.isGenuine ? 'AUTHENTIC' : 'SUSPECTED FICN'}
                  </span>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="space-y-1.5 mb-5">
                <div className="flex justify-between text-[10px] font-mono font-black text-slate-500 tracking-wider">
                  <span>DISCRIMINATIVE BIOMETRIC PROBABILITY</span>
                  <span className={analysisResult.isGenuine ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {analysisResult.confidence}%
                  </span>
                </div>
                <div className="h-2 w-full bg-[#020509] rounded-full overflow-hidden border border-blue-950">
                  <div 
                    className={`h-full transition-all duration-700 rounded-full ${
                      analysisResult.isGenuine ? 'bg-emerald-500 shadow-md shadow-emerald-950' : 'bg-rose-500 shadow-md shadow-rose-950'
                    }`}
                    style={{ width: `${analysisResult.confidence}%` }}
                  />
                </div>
              </div>

              {/* Checklist details */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                  <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-wider">
                    Banknote Security Checklist Results
                  </span>
                  <span className="text-[9.5px] text-cyan-400 font-mono">STATUS DECODED</span>
                </div>
                
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto scrollbar-none pr-1">
                  {analysisResult.anomalies.map((feat, i) => (
                    <div key={i} className="bg-[#020509]/95 border border-blue-950 p-3.5 rounded-xl flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {feat.status === 'PASS' ? (
                          <div className="p-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                        ) : feat.status === 'FAIL' ? (
                          <div className="p-1 bg-rose-500/10 border border-rose-500/30 rounded-lg animate-pulse">
                            <XCircle className="w-4 h-4 text-rose-400" />
                          </div>
                        ) : (
                          <div className="p-1 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-display font-black text-slate-200 tracking-wide uppercase">
                            {feat.feature}
                          </span>
                          <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase ${
                            feat.status === 'PASS' 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                              : feat.status === 'FAIL'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                          }`}>
                            {feat.status === 'PASS' ? '✓ Standard Match' : feat.status === 'FAIL' ? '✗ Counterfeit Alarm' : '⚠ Caution'}
                          </span>
                        </div>
                        
                        <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
                          {feat.description}
                        </p>

                        <p className="text-[9.5px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-950">
                          {feat.status === 'PASS' && "✅ Genuine Feature: This is an official, hard-to-copy standard security feature of real currency."}
                          {feat.status === 'FAIL' && "🚨 Critical Fraud Risk: Fakes fail this test because making this feature requires extremely expensive printing plates."}
                          {feat.status === 'WARNING' && "⚠️ Low Visibility Check: This feature is unclear. Could be due to wear and tear or minor physical dirt."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expert analysis summary */}
              <div className="space-y-2 mt-5">
                <span className="text-[9px] text-slate-500 font-mono font-black uppercase block tracking-wider">
                  📋 AI Verification Summary & Actionable Advice
                </span>
                <div className="bg-[#020509]/95 border border-blue-950 p-4 rounded-xl text-slate-300 text-[10.5px] leading-relaxed font-sans shadow-inner">
                  {analysisResult.summary}
                </div>
              </div>

              {/* Post Counterfeit Alert to Police Department */}
              {onReportNewIncident && !analysisResult.isGenuine && (
                <div className="mt-4 pt-3 border-t border-blue-950/40">
                  <button
                    type="button"
                    onClick={() => {
                      onReportNewIncident({
                        type: 'counterfeit_currency',
                        title: `Suspected Fake Banknote Alert (Serial: ${selectedNote?.serialNumber || 'Unknown'})`,
                        location: 'Central Banking Enclave',
                        involvedAmount: '₹500 Counterfeit',
                        details: `Forensic optical scan flagged suspected counterfeit FICN banknote. Serial: ${selectedNote?.serialNumber || 'Unknown'}. Verdict summary: ${analysisResult.summary}. Anomalies: ${analysisResult.anomalies.filter(a => a.status === 'FAIL').map(a => a.feature).join(', ') || 'General Offset'}`,
                        status: 'ACTIVE',
                        severity: 'HIGH',
                        isCitizenReport: true
                      });
                    }}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all font-mono uppercase tracking-wider text-[10px] shadow-md shadow-rose-950/30 border border-rose-500/20"
                  >
                    🚨 Alert Police of Counterfeit Cash
                  </button>
                </div>
              )}
            </div>

            <div className="text-[9px] text-slate-600 font-mono border-t border-blue-950/60 pt-4 mt-4 text-center font-bold">
              Automated checksum dispatched to Reserve Bank of India centralized fraud register.
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-4 relative z-10">
            <div className="bg-[#020509] border border-blue-950 p-4 rounded-full shadow-inner relative">
              <Eye className="w-8 h-8 text-cyan-500/30" />
              <Activity className="absolute bottom-1 right-1 w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            
            {/* Real-time Oscilloscope mock simulation */}
            <div className="w-full bg-[#020509] border border-blue-950 rounded-xl p-3 space-y-1.5">
              <span className="text-[8px] font-mono text-slate-600 block text-left uppercase font-black tracking-wider">Spectrogram Oscilloscope</span>
              <div className="h-12 flex items-end justify-center gap-0.5 border-b border-blue-950/30 pb-1">
                {signalTicks.map((val, idx) => (
                  <div 
                    key={idx} 
                    className={`w-1 rounded-t-sm transition-all duration-100 ${
                      scanAnimation 
                        ? 'bg-cyan-500 shadow-md shadow-cyan-400/80' 
                        : spectralMode === 'UV' 
                          ? 'bg-purple-500' 
                          : spectralMode === 'IR' 
                            ? 'bg-amber-500' 
                            : 'bg-blue-900/40'
                    }`} 
                    style={{ height: `${val}%` }} 
                  />
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-600">
                <span>0.00 Hz</span>
                <span>F_SAMPLE: {scanSpeed * 10}S/s</span>
                <span>1.20 GHz</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-black text-slate-200 font-display uppercase tracking-wide">🔍 Scanner Ready for Verification</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed font-sans font-medium">
                Choose one of our reference banknotes above, or upload your own banknote photo. Then press the <strong>"START AI FORENSIC ANALYSIS SCAN"</strong> button below to start the verification process!
              </p>
            </div>

            <div className="w-full bg-[#020509] border border-blue-950 rounded-xl p-3.5 text-left text-[9px] font-mono text-slate-500 space-y-1.5 max-w-[270px]">
              <div className="flex justify-between border-b border-blue-950/40 pb-1">
                <span>ACTIVE SPECTRAL MODE:</span>
                <span className="text-cyan-400 font-bold">{spectralMode === 'VIS' ? 'VISIBLE LIGHT' : spectralMode === 'UV' ? 'ULTRAVIOLET' : 'INFRARED'}</span>
              </div>
              <div className="flex justify-between border-b border-blue-950/40 pb-1">
                <span>LENS RESOLUTION:</span>
                <span className="text-slate-300 font-bold">1200 DPI MICRO-INTRAL</span>
              </div>
              <div className="flex justify-between">
                <span>CALIBRATION:</span>
                <span className="text-emerald-400 font-bold">STANDARDS REGISTERED</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
