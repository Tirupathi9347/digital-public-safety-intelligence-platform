import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  MessageSquare, 
  AlertTriangle, 
  HelpCircle, 
  PhoneCall, 
  Globe, 
  ArrowRight, 
  RefreshCw, 
  Upload, 
  Image as ImageIcon, 
  Link2, 
  FileText, 
  CheckCircle, 
  Info, 
  ShieldAlert, 
  BookOpen,
  Eye,
  Activity,
  Sparkles,
  Lock,
  Compass,
  FileCode,
  AlertCircle
} from 'lucide-react';

interface CitizenShieldProps {
  onAssessMulti: (payload: {
    inputType: 'text' | 'url' | 'image' | 'file';
    text: string;
    imageBase64?: string;
    fileBase64?: string;
    fileName?: string;
    language: string;
  }) => Promise<any>;
  onReportNewIncident?: (report: any) => Promise<any> | void;
  incidents?: any[];
  onUpdateIncident?: (updated: any) => Promise<any> | void;
  loading: boolean;
}

export default function CitizenShield({ 
  onAssessMulti, 
  onReportNewIncident, 
  incidents = [], 
  onUpdateIncident, 
  loading 
}: CitizenShieldProps) {
  // Navigation inside Citizen Shield
  const [activeSubTab, setActiveSubTab] = useState<'scanner' | 'academy' | 'complaints'>('scanner');
  
  // Scanner States
  const [inputType, setInputType] = useState<'text' | 'url' | 'image' | 'file'>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; base64?: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scannerResult, setScannerResult] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const regionalLanguages = [
    "English", "Hindi", "Bengali", "Telugu", "Tamil", 
    "Marathi", "Gujarati", "Kannada", "Odia", "Malayalam", "Punjabi", "Assamese"
  ];

  // Templates for fast test testing
  const quickTestTemplates = {
    text: [
      {
        title: "Narcotics Video Extortion",
        text: "I got a call from someone claiming to be MHA customs. They said a package with 120 grams of MDMA under my Aadhaar was blocked at Mumbai airport. They are transferring me to a Skype call with narcotics inspectors to record a statement. They said if I leave the room or call anyone, I will be digitally arrested and sent to Tihar jail immediately."
      },
      {
        title: "Telegram Part-time Like Job",
        text: "I was contacted on WhatsApp from a UK number (+44) offering to make money by liking YouTube videos. They paid me 150 rupees for 3 likes. Now they have added me to a VIP group and say I have to deposit 5000 rupees to get tasks that pay 15000 rupees."
      }
    ],
    url: [
      {
        title: "IndiaPost Failed Address Portal",
        text: "http://ind-post-verify-parcel.org/update-details"
      },
      {
        title: "Urgent Electricity Disconnect Link",
        text: "http://state-electricity-bill-disconnection.xyz/pay-due"
      }
    ]
  };

  const handleTextTemplateClick = (text: string) => {
    setTextInput(text);
    setScannerResult(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setFileDetails({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, base64 });
      setScannerResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFileDetails({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, base64 });
      setScannerResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleScannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScannerResult(null);

    let payloadText = textInput;
    if (inputType === 'url') {
      payloadText = textInput;
    }

    try {
      const result = await onAssessMulti({
        inputType,
        text: payloadText,
        imageBase64: inputType === 'image' ? imagePreview || undefined : undefined,
        fileBase64: inputType === 'file' ? fileDetails?.base64 || undefined : undefined,
        fileName: inputType === 'file' ? fileDetails?.name || undefined : undefined,
        language: selectedLanguage
      });
      setScannerResult(result);
    } catch (err) {
      console.error("Multi-input citizen scan failed:", err);
    }
  };

  const clearForm = () => {
    setTextInput('');
    setFileDetails(null);
    setImagePreview(null);
    setScannerResult(null);
  };

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'CRITICAL': return 'bg-rose-500/15 border-rose-500/30 text-rose-400';
      case 'HIGH': return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      case 'MEDIUM': return 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400';
      case 'SAFE': return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      default: return 'bg-slate-500/15 border-slate-500/30 text-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      
      {/* Sub-Header Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-blue-900/10 px-6 py-4 gap-3 shrink-0">
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 border border-blue-900/10 rounded-xl">
          <button
            onClick={() => { setActiveSubTab('scanner'); setScannerResult(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeSubTab === 'scanner'
                ? 'bg-blue-600/25 border border-blue-500/50 text-blue-400 font-black shadow-inner shadow-blue-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-blue-400" />
            <span>Threat Scanner</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('academy')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeSubTab === 'academy'
                ? 'bg-blue-600/25 border border-blue-500/50 text-blue-400 font-black shadow-inner shadow-blue-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Scam Prevention Tips</span>
          </button>

          <button
            onClick={() => setActiveSubTab('complaints')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeSubTab === 'complaints'
                ? 'bg-blue-600/25 border border-blue-500/50 text-blue-400 font-black shadow-inner shadow-blue-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>My Complaints & Resolve</span>
          </button>
        </div>

        {/* Global Multi-lingual Language Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 border border-blue-900/10 px-3 py-1.5 rounded-xl self-end sm:self-auto">
          <Globe className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
          <span className="text-[9px] text-slate-500 font-mono font-extrabold uppercase shrink-0">AI VERDICT REGIONAL LANG:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              setScannerResult(null);
            }}
            className="bg-transparent text-xs font-mono text-slate-200 outline-none cursor-pointer border-none p-0 shrink-0 font-bold"
          >
            {regionalLanguages.map((lang) => (
              <option key={lang} value={lang} className="bg-slate-950 text-slate-200">
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeSubTab === 'scanner' ? (
        <div className="flex flex-col gap-6 p-6 flex-1 max-w-4xl mx-auto w-full">
          
          {/* Scanner Input Card */}
          <div className="glass rounded-2xl p-5 flex flex-col justify-between shadow-lg border border-blue-900/30 bg-[#020509]/30 relative glow-blue">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-blue-900/10 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="text-sm font-display font-bold text-slate-100 uppercase tracking-wide">Aegis Citizen Protection Terminal</h3>
                    <p className="text-[9px] text-slate-500 font-mono">CHANNEL DISCRIMINATION ENGINE</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-blue-400 animate-pulse">
                  ACTIVE DETECTORS
                </span>
              </div>

              {/* 4 Inputs Type Buttons Selector */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[9px] text-slate-500 font-mono font-extrabold uppercase tracking-wider block">
                  Select Target Threat Input
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setInputType('text'); clearForm(); }}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold font-mono flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      inputType === 'text'
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400 font-extrabold shadow-md glow-blue'
                        : 'bg-[#03060b]/40 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>TEXT / PHONE CALL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setInputType('url'); clearForm(); }}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold font-mono flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      inputType === 'url'
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400 font-extrabold shadow-md glow-blue'
                        : 'bg-[#03060b]/40 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Link2 className="w-4 h-4" />
                    <span>WEBSITE LINK</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setInputType('image'); clearForm(); }}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold font-mono flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      inputType === 'image'
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400 font-extrabold shadow-md glow-blue'
                        : 'bg-[#03060b]/40 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>IMAGE / SCREENSHOT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setInputType('file'); clearForm(); }}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold font-mono flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      inputType === 'file'
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400 font-extrabold shadow-md glow-blue'
                        : 'bg-[#03060b]/40 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>DOCUMENT / PDF</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Input Form Render */}
              <form onSubmit={handleScannerSubmit} className="space-y-4">
                
                {inputType === 'text' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-mono uppercase block">Describe Call Transcript, Voice, or SMS Details</label>
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Paste threatening messages, Skype call transcripts, CBI or police impersonation demands, or bank lock notifications..."
                        rows={5}
                        required
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-slate-200 outline-none focus:border-blue-500/50 font-sans text-xs leading-relaxed shadow-inner"
                      />
                    </div>

                    {/* Quick templates for text */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider block">Rapid Testing Presets (Click to load):</span>
                      <div className="flex flex-col gap-1.5">
                        {quickTestTemplates.text.map((tpl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleTextTemplateClick(tpl.text)}
                            className="w-full text-left bg-[#03060b]/80 hover:bg-[#060a12] border border-slate-900 hover:border-slate-800 p-2.5 rounded-xl text-slate-300 text-[10.5px] font-sans flex items-center justify-between cursor-pointer transition-all"
                          >
                            <span className="truncate font-semibold text-slate-300">{tpl.title}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {inputType === 'url' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-mono uppercase block">Paste Suspicious Link, Domain, or Payment URL</label>
                      <div className="relative">
                        <Link2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="url"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          placeholder="e.g., http://india-post-cargo-tracking.xyz/claim-verification"
                          required
                          className="w-full bg-slate-950 border border-slate-900 rounded-xl py-3 pl-10 pr-3 text-slate-200 text-xs outline-none focus:border-blue-500/50 font-mono"
                        />
                      </div>
                    </div>

                    {/* Quick templates for url */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider block">Suspicious Link Presets (Click to load):</span>
                      <div className="flex flex-col gap-1.5">
                        {quickTestTemplates.url.map((tpl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleTextTemplateClick(tpl.text)}
                            className="w-full text-left bg-[#03060b]/80 hover:bg-[#060a12] border border-slate-900 hover:border-slate-800 p-2.5 rounded-xl text-slate-300 text-[10.5px] font-sans flex items-center justify-between cursor-pointer transition-all"
                          >
                            <span className="truncate font-semibold text-slate-300">{tpl.title}: <strong className="text-cyan-400 font-mono text-[9px] ml-1">{tpl.text}</strong></span>
                            <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {inputType === 'image' && (
                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-400 font-mono uppercase block">Upload Screenshot of Threat Profile / Skype Call / WhatsApp message</label>
                    
                    <div 
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-900 hover:border-blue-500/40 rounded-xl p-6 bg-[#03060b]/40 hover:bg-[#03060b] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[160px]"
                    >
                      <input 
                        type="file" 
                        ref={imageInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                      
                      {imagePreview ? (
                        <div className="space-y-2">
                          <img 
                            src={imagePreview} 
                            alt="Screenshot Preview" 
                            className="max-h-24 mx-auto rounded border border-slate-900 object-contain shadow-inner" 
                          />
                          <p className="text-[10px] text-slate-400 font-mono">{fileDetails?.name} ({fileDetails?.size})</p>
                          <span className="text-[9px] text-blue-400 font-mono uppercase underline block">Change screenshot</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="bg-[#0c1322] p-2.5 border border-blue-900/10 rounded-full inline-block">
                            <Upload className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-200 font-semibold">Click to upload threat screenshot</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-1">Supports PNG, JPG, JPEG (Max 5MB)</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {inputType === 'file' && (
                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-400 font-mono uppercase block">Upload Official Warrant, Court SUMMONS, or Arrest PDF</label>
                    
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-900 hover:border-blue-500/40 rounded-xl p-6 bg-[#03060b]/40 hover:bg-[#03060b] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[160px]"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept=".pdf,.doc,.docx"
                        onChange={handleDocFileUpload}
                        className="hidden" 
                      />
                      
                      {fileDetails ? (
                        <div className="space-y-2">
                          <FileText className="w-10 h-10 text-rose-400 mx-auto" />
                          <div>
                            <p className="text-xs text-slate-200 font-semibold truncate max-w-xs mx-auto">{fileDetails.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{fileDetails.size}</p>
                          </div>
                          <span className="text-[9px] text-blue-400 font-mono uppercase underline block">Change file</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="bg-[#0c1322] p-2.5 border border-blue-900/10 rounded-full inline-block">
                            <Upload className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-200 font-semibold">Click to upload digital arrest warrant</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-1">Supports PDF, DOC, DOCX (Max 5MB)</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={loading || (inputType === 'text' && !textInput.trim()) || (inputType === 'url' && !textInput.trim()) || (inputType === 'image' && !imagePreview) || (inputType === 'file' && !fileDetails)}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-950/25 cursor-pointer transition-all uppercase tracking-wider text-xs font-mono"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        🔍 ANALYZING FOR SCAMS...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        🔍 SCAN FOR SCAM THREATS
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={clearForm}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

              </form>
            </div>

            <div className="flex items-start gap-2 bg-[#03060b]/60 border border-slate-900 p-3 rounded-xl text-[10px] text-slate-500 font-mono mt-4">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Submit suspect details for deep security assessments. Under Indian jurisprudence, official agencies never issue warrants over Skype or demands via crypto wallets.</span>
            </div>

            {/* Interactive Simulated Citizen Submission Module (Police Integration Test) */}
            {onReportNewIncident && (
              <div className="mt-5 p-4.5 bg-[#03060b]/90 border border-blue-900/30 rounded-xl relative overflow-hidden text-left shadow-lg glow-blue/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#081326_1px,transparent_1px),linear-gradient(to_bottom,#081326_1px,transparent_1px)] bg-[size:0.6rem_0.6rem] opacity-20 pointer-events-none" />
                
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <h4 className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-wide">Police Dashboard Simulation Testbed</h4>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    Test real-time dashboard updates. Click below to file a simulated threat report which injects new active incident telemetry and spikes the trend charts instantly.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onReportNewIncident({
                          type: 'digital_arrest',
                          title: `🚨 SIMULATED APEX DIGITAL ARREST ATTACK - Mewat Sector`,
                          location: 'Mewat Sector, Haryana',
                          involvedAmount: '₹84.5 Lakhs',
                          details: 'Simulated high-frequency VoIP robocall wave mimicking CBI headquarters. Spikes tactical dashboard metrics instantly.',
                          status: 'ACTIVE',
                          severity: 'CRITICAL',
                          timestamp: new Date().toISOString(),
                          isCitizenReport: true
                        });
                      }}
                      className="bg-blue-950/45 hover:bg-blue-900/50 text-blue-400 hover:text-blue-300 font-bold py-2 px-2 border border-blue-900/35 text-[9.5px] font-mono cursor-pointer transition-all flex items-center justify-center gap-1 uppercase rounded-lg"
                    >
                      💥 Test Mewat Report
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onReportNewIncident({
                          type: 'cyber_fraud',
                          title: `⚠️ SIMULATED MASS PHISHING CAMPAIGN - Delhi NCR`,
                          location: 'Delhi NCR',
                          involvedAmount: '₹42.0 Lakhs',
                          details: 'Simulated SMS phishing campaign spreading fake IndiaPost parcel verification links. Triggers emergency alerts.',
                          status: 'ACTIVE',
                          severity: 'HIGH',
                          timestamp: new Date().toISOString(),
                          isCitizenReport: true
                        });
                      }}
                      className="bg-cyan-950/45 hover:bg-cyan-900/50 text-cyan-400 hover:text-cyan-300 font-bold py-2 px-2 border border-cyan-900/35 text-[9.5px] font-mono cursor-pointer transition-all flex items-center justify-center gap-1 uppercase rounded-lg"
                    >
                      💥 Test Delhi Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scanner Result Card */}
          <div className="glass rounded-2xl p-6 flex flex-col justify-between shadow-lg border border-blue-900/30 bg-[#020509]/30 relative glow-blue h-auto w-full">
            {loading ? (
              <div className="space-y-6 h-full flex flex-col justify-center items-center py-10 relative z-10 text-center animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
                  <ShieldCheck className="w-12 h-12 text-blue-400 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-blue-400 font-extrabold uppercase tracking-widest animate-pulse">
                    RUNNING COGNITIVE DISCRIMINATOR
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono max-w-xs leading-relaxed">
                    Analyzing communication structure, pressure triggers, coercive threats, fake official credentials, and psychological leverage indicators.
                  </p>
                </div>

                {/* Live Cyber Threat Feed logs */}
                <div className="w-full bg-[#020509]/95 border border-blue-900/30 rounded-xl p-3 text-left font-mono text-[9px] text-blue-400/80 space-y-1 h-32 overflow-hidden select-none opacity-80 shadow-inner">
                  <div className="text-[8px] text-slate-500 font-bold border-b border-slate-900 pb-1 mb-1.5 flex justify-between">
                    <span>AEGIS SECURE THREAT ENGINE</span>
                    <span className="text-rose-400 animate-pulse">STANDBY VERIFICATION</span>
                  </div>
                  <div className="truncate">COERCION_TRIGGERS: ENGAGED [CHECKING TRANSCRIPT]</div>
                  <div className="truncate text-rose-400">IMPOSTER_SIGNATURE: POLICE/CBI LEVEL MATCH</div>
                  <div className="truncate">URL_HARVESTER_DB: QUERIED CENTRAL REPOSITORY</div>
                  <div className="truncate text-yellow-400">REGIONAL_TRANSLATION_FEED: {selectedLanguage.toUpperCase()} [GENERATING]</div>
                  <div className="truncate">IT_ACT_SEC_65B: ADMISSIBLE LOG DATA RECORDED [TRUE]</div>
                </div>

                <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>SAFETY VERDICT SYSTEM</span>
                  <span className="text-blue-400 animate-pulse">CALIBRATING_PROBABILITY</span>
                </div>
              </div>
            ) : scannerResult ? (
              <div className="space-y-4">
                {/* Result Header */}
                <div className="border-b border-slate-900 pb-3 mb-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">AI SHIELD REPORT</span>
                    <span className="text-slate-100 font-display font-black text-sm block mt-0.5">
                      SOURCE: {inputType.toUpperCase()} INPUT
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">THREAT LEVEL</span>
                    <span className={`text-[11px] font-mono font-black px-2.5 py-0.5 rounded border uppercase ${getRiskColor(scannerResult.riskLevel)}`}>
                      {scannerResult.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Localized Verdict */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">
                    AI VERDICT ({selectedLanguage.toUpperCase()})
                  </span>
                  <div className={`p-3.5 rounded-xl border leading-relaxed text-xs font-semibold flex items-start gap-2.5 ${
                    scannerResult.isScam 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-300 shadow-inner shadow-rose-950/10' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 shadow-inner shadow-emerald-950/10'
                  }`}>
                    <span className="text-md leading-none">{scannerResult.isScam ? '🚨' : '🛡️'}</span>
                    <span>{scannerResult.verdict}</span>
                  </div>
                </div>

                {/* AI Better Phrasing Supportive Warning */}
                {scannerResult.phrasingOutput && (
                  <div className="space-y-1.5 bg-slate-950/80 border border-slate-900 rounded-xl p-3.5">
                    <span className="text-[10px] text-blue-400 font-mono font-bold uppercase block flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                      Empathetic AI Breakdown & Phrasing Guidance
                    </span>
                    <p className="text-slate-200 text-xs font-sans leading-relaxed mt-1">
                      {scannerResult.phrasingOutput}
                    </p>
                  </div>
                )}

                {/* Detection Indicators */}
                {scannerResult.indicatorsFound && scannerResult.indicatorsFound.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Anomalies & Indicators Spotted</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scannerResult.indicatorsFound.map((ind: string, idx: number) => (
                        <span key={idx} className="bg-slate-950 border border-slate-900 text-slate-300 text-[10px] px-2.5 py-1 rounded-lg font-sans flex items-center gap-1">
                          <Eye className="w-3 h-3 text-cyan-400" /> {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coercion Tactics */}
                {scannerResult.coercionTactics && scannerResult.coercionTactics.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-rose-400 font-mono font-bold uppercase block">Tactical Manipulation Warnings</span>
                    <ul className="space-y-1.5">
                      {scannerResult.coercionTactics.map((tac: string, idx: number) => (
                        <li key={idx} className="bg-rose-500/5 border border-rose-500/10 text-rose-300/80 text-xs p-2.5 rounded-xl flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{tac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Immediate protective guidelines */}
                {scannerResult.guidance && scannerResult.guidance.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block">Emergency Citizen Action Steps</span>
                    <div className="space-y-1.5">
                      {scannerResult.guidance.map((step: string, idx: number) => (
                        <div key={idx} className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* National cyber support buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider block">Verify/Report Secure Channels</span>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:1930"
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-900 p-2.5 rounded-xl flex items-center justify-between text-slate-200 text-xs font-mono cursor-pointer"
                    >
                      <span className="text-slate-400 font-semibold">1930 Cyber Cell</span>
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    </a>
                    
                    <a
                      href="https://sancharsaathi.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-900 p-2.5 rounded-xl flex items-center justify-between text-slate-200 text-xs font-mono cursor-pointer"
                    >
                      <span className="text-slate-400 font-semibold">Report Sanchar Saathi</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    </a>
                  </div>
                </div>

                {/* Police Resolution Options */}
                <div className="space-y-2 pt-3 border-t border-slate-900">
                  <span className="text-[9px] text-rose-400 font-mono font-bold uppercase tracking-wider block flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    Police Action & Dispatch
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (onReportNewIncident) {
                        onReportNewIncident({
                          type: 'cyber_fraud',
                          title: `Citizen Scan: Suspected Cyber Threat (${inputType.toUpperCase()})`,
                          location: 'MHA Aegis Portal',
                          involvedAmount: '₹50,000 Estimated',
                          details: `Threat verified by citizen via Aegis multi-scanner. Risk Level: ${scannerResult.riskLevel}. Input Preview: ${textInput ? textInput.slice(0, 150) + '...' : 'Uploaded Scan Material'}. Verdict: ${scannerResult.verdict}`,
                          status: 'ACTIVE',
                          severity: scannerResult.riskLevel === 'CRITICAL' ? 'CRITICAL' : scannerResult.riskLevel === 'HIGH' ? 'HIGH' : 'MEDIUM',
                          isCitizenReport: true
                        });
                        setActiveSubTab('complaints');
                      }
                    }}
                    className="w-full bg-rose-600/90 hover:bg-rose-600 text-white font-bold font-mono py-2.5 px-3 rounded-xl text-[10.5px] cursor-pointer transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide shadow-lg shadow-rose-950/20"
                  >
                    🚨 Alert Police Department & Track Progress
                  </button>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-4">
                <div className="bg-slate-950 border border-blue-900/10 p-4 rounded-full shadow-inner relative">
                  <ShieldCheck className="w-8 h-8 text-blue-500/40" />
                  <Activity className="absolute bottom-1 right-1 w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-300 font-display uppercase tracking-wide">Shield Diagnostics Standby</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                    Select your threat input channel, enter suspicious materials (call transcript, phishing website, screenshot image, or fake PDF warrant), and request a safety verdict.
                  </p>
                </div>
                <div className="w-full max-w-[280px] bg-[#03060b] border border-slate-900/60 rounded-xl p-3 text-[10px] text-slate-500 font-mono text-left space-y-1.5">
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span>AEGIS DECRYPT ENGINE:</span>
                    <span className="text-emerald-400 font-bold">READY</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span>SCAN CHANNELS:</span>
                    <span>VOIP/URL/IMAGE/PDF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IT ACT SECTION 65B:</span>
                    <span className="text-blue-400 font-bold">ENFORCED</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : activeSubTab === 'academy' ? (
        /* VISUALLY STUNNING ONLINE SCAMS AWARENESS ACADEMY & DASHBOARD */
        <div className="p-6 flex-1 space-y-6">
          
          <div className="border-b border-blue-900/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-md font-display font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                <BookOpen className="w-5 h-5 text-blue-400 animate-pulse" />
                National Cyber Crime Prevention Academy
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Equip yourself with digital vigilance checklists, forensic breakdowns, and prevention protocols against contemporary Indian cyber frauds.
              </p>
            </div>
            <span className="text-[9px] font-mono bg-blue-500/10 text-cyan-400 border border-blue-500/30 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest self-start sm:self-auto">
              PUBLIC VIGILANCE UNIT
            </span>
          </div>

          {/* Interactive Bento Dashboard of Scams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Digital Arrest Scams Card */}
            <div className="bg-[#020509]/30 border border-blue-900/25 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="bg-rose-500/10 text-rose-400 p-2 rounded-xl border border-rose-500/20 text-xs font-mono font-bold group-hover:scale-105 transition-transform">01</span>
                  <div>
                    <h3 className="text-sm font-display font-bold text-slate-100 uppercase tracking-wide">Digital Arrest & Narcotics Mimicry</h3>
                    <span className="text-[9px] text-rose-400 font-mono font-bold uppercase tracking-wider">CRITICAL THREAT VECTOR</span>
                  </div>
                </div>

                {/* Visual Illustration of Laptop Camera Trap */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 my-3 flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest block font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400" /> Typical Modus Operandi
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Scammers posing as CBI or customs agents call claiming a parcel contains narcotics under your Aadhaar. They force a Skype call in a closed room, posing in mock police stations, and demand a "temporary verification deposit" under threat of physical arrest.
                    </p>
                  </div>
                  <div className="w-20 h-20 shrink-0 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center p-2 relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1.5 left-1/2 -translate-x-1/2 animate-ping" />
                    <Compass className="w-6 h-6 text-rose-500" />
                    <span className="text-[8px] text-rose-400 font-mono mt-1 font-bold">VIDEO TRAP</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-[10.5px]">
                  <div className="bg-[#03060b]/60 p-2.5 rounded-xl border border-slate-900">
                    <strong className="text-rose-400 block mb-1">🔍 How to spot it:</strong>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Demand to keep call secret or locked.</li>
                      <li>• Government never issues warrants or legal reviews on video calls.</li>
                    </ul>
                  </div>
                  <div className="bg-[#03060b]/60 p-2.5 rounded-xl border border-slate-900">
                    <strong className="text-emerald-400 block mb-1">🛡️ What to do:</strong>
                    <ul className="space-y-1 text-slate-300">
                      <li>• **HANG UP** immediately.</li>
                      <li>• Dial **1930** and report details to Sanchar Saathi.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Telegram Part-Time Likes Frauds */}
            <div className="bg-[#020509]/30 border border-blue-900/25 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="bg-amber-500/10 text-amber-400 p-2 rounded-xl border border-amber-500/20 text-xs font-mono font-bold group-hover:scale-105 transition-transform">02</span>
                  <div>
                    <h3 className="text-sm font-display font-bold text-slate-100 uppercase tracking-wide">YouTube Task & Part-Time Job Frauds</h3>
                    <span className="text-[9px] text-amber-400 font-mono font-bold uppercase tracking-wider">HIGH THREAT CLUSTER</span>
                  </div>
                </div>

                {/* Visual Illustration of Task Fraud */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 my-3 flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest block font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-400" /> Typical Modus Operandi
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Victims receive WhatsApp offers paying ₹100-300 for liking Youtube videos. After minor transfers to build trust, they are recruited into VIP Telegram channels where they are coerced into making massive "crypto investments" that cannot be withdrawn.
                    </p>
                  </div>
                  <div className="w-20 h-20 shrink-0 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center p-2">
                    <MessageSquare className="w-6 h-6 text-amber-400" />
                    <span className="text-[8px] text-amber-400 font-mono mt-1 font-bold">TELEGRAM TRAP</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-[10.5px]">
                  <div className="bg-[#03060b]/60 p-2.5 rounded-xl border border-slate-900">
                    <strong className="text-amber-400 block mb-1">🔍 How to spot it:</strong>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Offering commissions for likes or reviews.</li>
                      <li>• Coercion to pay security deposits to retrieve earnings.</li>
                    </ul>
                  </div>
                  <div className="bg-[#03060b]/60 p-2.5 rounded-xl border border-slate-900">
                    <strong className="text-emerald-400 block mb-1">🛡️ What to do:</strong>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Leave the group instantly.</li>
                      <li>• Freeze suspect UPI accounts at your local bank.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Phishing Links & Delivery Mimicry */}
            <div className="bg-[#020509]/30 border border-blue-900/25 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="bg-blue-500/10 text-blue-400 p-2 rounded-xl border border-blue-500/20 text-xs font-mono font-bold group-hover:scale-105 transition-transform">03</span>
                  <div>
                    <h3 className="text-sm font-display font-bold text-slate-100 uppercase tracking-wide">Delivery Phishing & Spoofed Domains</h3>
                    <span className="text-[9px] text-blue-400 font-mono font-bold uppercase tracking-wider">MEDIUM THREAT VECTOR</span>
                  </div>
                </div>

                {/* Visual Illustration */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 my-3 flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest block font-bold flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-blue-400" /> Typical Modus Operandi
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      SMS claiming an IndiaPost cargo shipment is blocked due to incomplete addresses. Clicking a custom URL redirects you to a forged mock postal portal requesting minor address verify fees, which captures card tokens and installs SMS OTP malware.
                    </p>
                  </div>
                  <div className="w-20 h-20 shrink-0 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center p-2">
                    <FileCode className="w-6 h-6 text-blue-400" />
                    <span className="text-[8px] text-blue-400 font-mono mt-1 font-bold">FAKE DOMAIN</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-[10.5px]">
                  <div className="bg-[#03060b]/60 p-2.5 rounded-xl border border-slate-900">
                    <strong className="text-blue-400 block mb-1">🔍 How to spot it:</strong>
                    <ul className="space-y-1 text-slate-300">
                      <li>• URLs using suspect domains (.xyz, .com-info).</li>
                      <li>• Messages arriving from ordinary 10-digit mobile lines.</li>
                    </ul>
                  </div>
                  <div className="bg-[#03060b]/60 p-2.5 rounded-xl border border-slate-900">
                    <strong className="text-emerald-400 block mb-1">🛡️ What to do:</strong>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Never click delivery verification links.</li>
                      <li>• Cross-verify only on official IndiaPost portals.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. FICN Counterfeit Currency Alerts */}
            <div className="bg-[#020509]/30 border border-blue-900/25 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="bg-emerald-500/10 text-emerald-400 p-2 rounded-xl border border-emerald-500/20 text-xs font-mono font-bold group-hover:scale-105 transition-transform">04</span>
                  <div>
                    <h3 className="text-sm font-display font-bold text-slate-100 uppercase tracking-wide">FICN Counterfeit Bill Indicators</h3>
                    <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-wider">FINANCIAL INTEL VECTOR</span>
                  </div>
                </div>

                {/* Visual Illustration */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 my-3 flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-emerald-400" /> RBI Official Security Markers
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Genuine banknote series feature complex Mahatma Gandhi watermarking, optical green-to-blue shifts on security threads, thick intaglio-print raised features, and microprinted devanagari letters under ultraviolet magnification.
                    </p>
                  </div>
                  <div className="w-20 h-20 shrink-0 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center p-2">
                    <Lock className="w-6 h-6 text-emerald-400" />
                    <span className="text-[8px] text-emerald-400 font-mono mt-1 font-bold">₹500 STANDARD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-[10.5px]">
                  <div className="bg-[#03060b]/60 p-2.5 rounded-xl border border-slate-900">
                    <strong className="text-emerald-400 block mb-1">🔍 How to spot a fake:</strong>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Flat security thread with no dynamic color transition.</li>
                      <li>• Distorted watermark boundaries and blurry intaglio prints.</li>
                    </ul>
                  </div>
                  <div className="bg-[#03060b]/60 p-2.5 rounded-xl border border-slate-900">
                    <strong className="text-emerald-400 block mb-1">🛡️ What to do:</strong>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Run the specimen through our AI Forensics scanning tool.</li>
                      <li>• Deposit suspicious bills only at official banking institutions.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Guidance Emergency Box */}
          <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <strong className="text-xs text-slate-200 block uppercase tracking-wider">Caught in an active extortion or digital arrest crisis?</strong>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Important safety note: **Law enforcement agencies do not conduct active arrests or formal witness statements over video channels.** Disconnect immediately, secure your premises, and contact the national cyber helpline.
                </p>
              </div>
            </div>
            <a
              href="tel:1930"
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold font-mono text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer shrink-0 transition-all uppercase tracking-wider"
            >
              <PhoneCall className="w-4 h-4" />
              <span>DIAL 1930 HELPLINE</span>
            </a>
          </div>

        </div>
      ) : (
        /* COMPLAINTS TRACKER & SOLVE VIEWPORT */
        <div className="p-6 flex-1 space-y-6 animate-fade-in text-left">
          <div className="border-b border-blue-900/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-md font-display font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                <CheckCircle className="w-5 h-5 text-emerald-400 animate-pulse" />
                Aegis Complaint Tracker & Interactive Resolution Center
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Monitor complaints reported from your account or simulated in this session. Real-time changes instantly synchronize with the investigator command dashboards.
              </p>
            </div>
            <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest self-start sm:self-auto">
              CITIZEN INTEGRITY PROTOCOL
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active Citizen Complaints Panel */}
            <div className="lg:col-span-7 space-y-4">
              <div className="glass rounded-2xl p-5 border border-blue-900/20 bg-[#020509]/30 relative glow-blue">
                <div className="flex items-center justify-between border-b border-blue-900/10 pb-3 mb-4">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">YOUR FILED COMPLAINTS ({incidents.filter(inc => inc.isCitizenReport).length})</span>
                  <span className="text-[8.5px] font-mono text-slate-500">[ REAL-TIME SYNCED WITH MHA ]</span>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {incidents.filter(inc => inc.isCitizenReport).length > 0 ? (
                    incidents.filter(inc => inc.isCitizenReport).map(inc => (
                      <div 
                        key={inc.id}
                        className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-200 ${
                          inc.status === 'RESOLVED'
                            ? 'bg-emerald-950/15 border-emerald-500/20 text-slate-300'
                            : 'bg-slate-950/40 border-slate-900/80 hover:border-blue-900/40 text-slate-100'
                        }`}
                      >
                        {/* Status border indicator */}
                        <div className={`absolute top-0 left-0 h-full w-[3px] ${
                          inc.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />

                        <div className="flex items-center justify-between gap-3 mb-2 pl-1">
                          <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase">{inc.id} • {inc.location}</span>
                          <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase ${
                            inc.status === 'RESOLVED' 
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                              : 'bg-amber-500/15 border border-amber-500/30 text-amber-400 animate-pulse'
                          }`}>
                            {inc.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold font-display pl-1">{inc.title}</h4>
                        <p className="text-[10.5px] text-slate-400 mt-2 font-sans leading-relaxed pl-1">{inc.details}</p>

                        {inc.assignedOfficer ? (
                          <div className="mt-3 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25 text-slate-300 font-mono text-[10.5px] space-y-1 ml-1">
                            <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider">
                              <span>👮</span>
                              <span>Assigned Investigator:</span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-200">{inc.assignedOfficer}</p>
                              <p className="text-[9px] text-slate-400">Badge: {inc.assignedOfficerBadge || "IPS-2021-0428"} • {inc.assignedOfficerSector || "National Cyber Wing"}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-yellow-400/80 font-mono text-[9.5px] flex items-center gap-2 ml-1 animate-pulse">
                            <span>🚨</span>
                            <span>Broadcasting Case... Awaiting Officer Claim</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-slate-900/60 pl-1 text-[10px]">
                          <span className="text-slate-500 font-mono">DAMAGES: <strong className="text-slate-300">{inc.involvedAmount}</strong></span>
                          
                          {inc.status !== 'RESOLVED' ? (
                            <button
                              onClick={() => {
                                if (onUpdateIncident) {
                                  onUpdateIncident({
                                    ...inc,
                                    status: 'RESOLVED'
                                  });
                                }
                              }}
                              className="bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold font-mono px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all shadow-md uppercase tracking-wider"
                            >
                              ✔️ Mark Resolved
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (onUpdateIncident) {
                                  onUpdateIncident({
                                    ...inc,
                                    status: 'ACTIVE'
                                  });
                                }
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold font-mono px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all border border-slate-800 uppercase tracking-wider"
                            >
                              🔄 Re-open Case
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <ShieldCheck className="w-8 h-8 text-slate-700 mx-auto mb-2.5" />
                      <p className="text-xs font-mono uppercase tracking-wider">No citizen complaints currently filed.</p>
                      <p className="text-[10px] text-slate-600 max-w-xs mx-auto mt-1 leading-relaxed">
                        Go to the **Threat Scanner** tab or trigger a report simulation to view, track, and test interactive resolution loops.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MHA Cyber Resolution Portal FAQ & Checklist */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="glass rounded-2xl p-5 border border-blue-900/20 bg-[#020509]/30 relative glow-blue space-y-4">
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider block border-b border-blue-900/10 pb-2">
                  🛡️ Active Redressal Protocol
                </span>

                <div className="space-y-3 font-sans text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 leading-relaxed">
                    <strong className="text-slate-200 block mb-1">How can a citizen resolve their issue?</strong>
                    <p className="text-slate-400 text-[10.5px]">
                      Under Aegis digital safety systems, citizens can log in to report threat indicators and flag extortion calls. If police dispatch resolves the danger, or if the extortion threats subside, marking a case as resolved immediately restores the regional map status to **SAFE** (Green).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 leading-relaxed">
                    <strong className="text-slate-200 block mb-1">Police Dispatch Feedback Integration</strong>
                    <p className="text-slate-400 text-[10.5px]">
                      All complaints marked resolved here sync instantly with the Investigator Command Suite. Similarly, actions taken by on-duty investigators to close cases reflect on this dashboard in real-time.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-mono leading-relaxed">
                  📢 **MHA Security Note:** Safe status updates comply with IT Security Guidelines 2026. Data hashes are protected using state-of-the-art national enclave parameters.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
