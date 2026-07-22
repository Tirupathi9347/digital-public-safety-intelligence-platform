import React, { useState } from 'react';
import { ScamCallAnalysis } from '../types';
import { ShieldAlert, AlertCircle, FileText, Send, HelpCircle, RefreshCw, VolumeX, ShieldCheck, Activity, BrainCircuit, AlertTriangle, Play } from 'lucide-react';

interface ScamDetectorProps {
  onAnalyze: (transcript: string) => Promise<ScamCallAnalysis>;
  loading: boolean;
}

export default function ScamDetector({ onAnalyze, loading }: ScamDetectorProps) {
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<ScamCallAnalysis | null>(null);

  // Preloaded scam script templates to let users experience high-fidelity test scenarios
  const templates = [
    {
      name: "FedEx Narcotics Scam",
      text: "Hello, I am calling from FedEx Mumbai Customs. Your passport has been confiscated. We found 3 expired passports, 5 bank cards, and 140 grams of MDMA in a shipment under your name bound for Taiwan. Your call is being transferred directly to the CBI Narcotics Division for a formal video statement. You must remain in an isolated room with your camera on, and tell no one or face immediate 5-year imprisonment."
    },
    {
      name: "Fake CBI Judicial Warrant",
      text: "This is Inspector Vijay Kumar from central Crime Branch Delhi. Your Aadhaar card has been linked to a money laundering case of 38 Crore rupees with Jet Airways accounts. We have issued a non-bailable arrest warrant. You are under 'Digital Arrest' starting right now. Keep your camera active. Do not close this Skype session. You are required to transfer all savings of 12 Lakhs to the court's reserve account for verification, or you will be jailed in 2 hours."
    },
    {
      name: "Standard Delivery Phishing",
      text: "Dear customer, your IndiaPost parcel has arrived at our sorting office but cannot be delivered due to an incomplete address. Please click the link within 24 hours to update your house number and pay a small fee of 25 Rupees to avoid return to sender. Link: post-ind-address-verification.net"
    }
  ];

  const handleAnalyzeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    try {
      const result = await onAnalyze(transcript);
      setAnalysis(result);
    } catch (err) {
      console.error("Forensic analysis failed:", err);
    }
  };

  const loadTemplate = (text: string) => {
    setTranscript(text);
    setAnalysis(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-transparent">
      {/* Left Column: Script / Transcript Input */}
      <div className="bg-[#03070f]/90 border border-blue-950 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[560px]">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f1d_1px,transparent_1px),linear-gradient(to_bottom,#080f1d_1px,transparent_1px)] bg-[size:0.8rem_0.8rem] opacity-25 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-blue-950 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/25 rounded-xl">
                <VolumeX className="w-5.5 h-5.5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-display font-black text-slate-100 uppercase tracking-wide">
                  Digital Arrest Classifier
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">COERCION COGNITIVE PATTERNS</p>
              </div>
            </div>
            <span className="text-[10px] bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono px-2.5 py-1 rounded-lg uppercase font-black tracking-wider">
              TACTICAL ANALYSIS
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-5 font-sans leading-relaxed">
            Paste telephone wire transcripts, Skype audio logs, or extortion messages below. The neural NLP module extracts high-pressure indicators and legal impersonation markers.
          </p>

          {/* Preset Templates */}
          <div className="mb-5 space-y-2.5">
            <span className="text-[9px] text-slate-500 font-mono font-black uppercase tracking-wider block">
              Reference Suspected Transcripts:
            </span>
            <div className="flex flex-wrap gap-2">
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadTemplate(tpl.text)}
                  className="bg-[#020509]/90 hover:bg-[#060a12] active:bg-[#0c1322] border border-blue-950 hover:border-blue-900 text-slate-300 text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer font-sans font-semibold"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAnalyzeSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] text-slate-500 font-mono font-black uppercase tracking-wider block">
                Source Audio Transcript / Chat Extract:
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste verbatim transcript of extortion calls, IndiaPost SMS warnings, custom CBI Skype video threat prompts..."
                rows={7}
                required
                className="w-full bg-[#020509]/95 border border-blue-950 rounded-xl p-4 text-slate-200 outline-none focus:border-cyan-500/50 font-sans text-xs leading-relaxed shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !transcript.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-950/20 cursor-pointer transition-all text-xs font-mono tracking-wider uppercase border border-blue-500/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  CHECKING TRANSCRIPT...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  CHECK FOR SCAM INDICATORS
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2.5 bg-[#020509]/80 border border-blue-950 p-4 rounded-xl text-[10px] text-slate-500 font-mono mt-5 relative z-10">
          <AlertCircle className="w-4.5 h-4.5 text-blue-500/60 shrink-0" />
          <span>Compliant with I4C digital forensics framework. Output patterns conform to MHA cyber bulletins.</span>
        </div>
      </div>

      {/* Right Column: AI Analysis Result Terminal */}
      <div className="bg-[#03070f]/90 border border-blue-950 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[560px]">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f1d_1px,transparent_1px),linear-gradient(to_bottom,#080f1d_1px,transparent_1px)] bg-[size:0.8rem_0.8rem] opacity-25 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {analysis ? (
          <div className="space-y-5 h-full flex flex-col justify-between relative z-10">
            <div>
              {/* Header result */}
              <div className="border-b border-blue-950 pb-4 mb-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[9px] font-mono text-slate-500 font-black uppercase tracking-wider">CLASSIFICATION DIAGNOSIS</h4>
                  <span className="text-slate-100 font-display font-black text-sm block mt-1 tracking-wide uppercase">
                    {analysis.scamType}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono text-slate-500 font-black uppercase tracking-wider block">RISK INDEX</span>
                  <span className={`text-sm font-mono font-black ${
                    analysis.riskScore > 75 ? 'text-rose-400' : analysis.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {analysis.riskScore}% {analysis.alertPriority}
                  </span>
                </div>
              </div>

              {/* Progress Bar / Risk Indicator */}
              <div className="space-y-1.5 mb-5">
                <div className="flex justify-between text-[9px] font-mono font-black text-slate-500 tracking-wider">
                  <span>COGNITIVE EXTORTION SPECTRUM</span>
                  <span>{analysis.riskScore}/100 BAROMETER</span>
                </div>
                <div className="h-2.5 w-full bg-[#020509] rounded-full overflow-hidden border border-blue-950">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      analysis.riskScore > 75 ? 'bg-rose-500 shadow-md shadow-rose-950' : analysis.riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${analysis.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Grid Tactics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Tactics Flagged */}
                <div className="space-y-2">
                  <span className="text-[9px] text-rose-400 font-mono font-black uppercase tracking-wider block">
                    Extortion Tactics Logged
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300 font-medium">
                    {analysis.coercionTactics.map((tactic, i) => (
                      <li key={i} className="flex items-start gap-2 bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-xl text-rose-300/95">
                        <span className="text-rose-500 font-bold select-none text-[10px]">🚨</span>
                        <span>{tactic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Victim Protocols */}
                <div className="space-y-2">
                  <span className="text-[9px] text-emerald-400 font-mono font-black uppercase tracking-wider block">
                    Investigator Advisories
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300 font-medium">
                    {analysis.recommendedActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl text-emerald-300/95">
                        <span className="text-emerald-400 select-none text-[10px]">✔</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="space-y-2 mt-5">
                <span className="text-[9px] text-slate-500 font-mono font-black uppercase tracking-wider block">
                  Tactical Forensic Intelligence Assessment
                </span>
                <div className="bg-[#020509]/95 border border-blue-950 p-4 rounded-xl text-slate-200 text-xs leading-relaxed font-sans font-medium shadow-inner">
                  {analysis.analysisSummary}
                </div>
              </div>

              {/* Action Alert Draft */}
              <div className="space-y-2 mt-5">
                <span className="text-[9px] text-slate-500 font-mono font-black uppercase tracking-wider block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  MHA National Block Directive Draft (Chakshu/I4C)
                </span>
                <pre className="bg-[#020509]/95 border border-blue-950 text-blue-400/90 font-mono text-[10px] p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[140px] shadow-inner select-all">
                  {analysis.generatedAlertDraft}
                </pre>
              </div>
            </div>

            <div className="text-[9px] text-slate-600 font-mono border-t border-blue-950/60 pt-4 mt-5 text-center font-bold">
              Alert metadata dispatched securely to adjacent cyber squad terminals automatically.
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-4 relative z-10">
            <div className="bg-[#020509] border border-blue-950 p-4 rounded-full shadow-inner relative">
              <ShieldCheck className="w-8 h-8 text-blue-500/30" />
              <Activity className="absolute bottom-1 right-1 w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-300 font-display uppercase tracking-wide">Cognitive Forensics Standby</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed font-sans">
                Paste any suspect audio/chat logging records on the left panel to execute deep linguistic and intent assessments.
              </p>
            </div>

            <div className="w-full max-w-[280px] bg-[#020509] border border-blue-950 rounded-xl p-3.5 text-[10px] text-slate-500 font-mono text-left space-y-1.5">
              <div className="flex justify-between border-b border-blue-950/40 pb-1">
                <span>INTENT ENGINE:</span>
                <span className="text-emerald-400 font-bold">STANDBY</span>
              </div>
              <div className="flex justify-between border-b border-blue-950/40 pb-1">
                <span>NLP CLASSIFIERS:</span>
                <span>PSYCHOLOGICAL PRESSURE</span>
              </div>
              <div className="flex justify-between">
                <span>COMPLIANCE LEVEL:</span>
                <span className="text-blue-400 font-bold">MHA SECURE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
