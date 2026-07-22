import React, { useState } from 'react';
import { X, Database, ShieldCheck, AlertCircle, Trash2, Check, ExternalLink, HelpCircle, Copy, Sparkles } from 'lucide-react';
import { FirebaseConfig, getSavedFirebaseConfig, saveFirebaseConfig } from '../firebase';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

type SetupTab = 'snippet' | 'manual';

export default function FirebaseConfigModal({ isOpen, onClose, onSaved }: FirebaseConfigModalProps) {
  const currentSaved = getSavedFirebaseConfig();
  const [activeTab, setActiveTab] = useState<SetupTab>('snippet');
  const [apiKey, setApiKey] = useState(currentSaved?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(currentSaved?.authDomain || '');
  const [projectId, setProjectId] = useState(currentSaved?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(currentSaved?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentSaved?.messagingSenderId || '');
  const [appId, setAppId] = useState(currentSaved?.appId || '');

  const [rawText, setRawText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Parser for Firebase JS setup snippet
  const handleParseRawText = () => {
    try {
      const cleanText = rawText.trim();
      if (!cleanText) {
        setError("Please paste your Firebase configuration code first.");
        return;
      }

      // Check if it's pure JSON
      if (cleanText.startsWith('{')) {
        const parsed = JSON.parse(cleanText);
        if (parsed.apiKey && parsed.projectId) {
          setApiKey(parsed.apiKey);
          setAuthDomain(parsed.authDomain || '');
          setProjectId(parsed.projectId);
          setStorageBucket(parsed.storageBucket || '');
          setMessagingSenderId(parsed.messagingSenderId || '');
          setAppId(parsed.appId || '');
          setError(null);
          setRawText('');
          setActiveTab('manual');
          return;
        }
      }

      // Regex matching for standard JavaScript object assignments
      const extractValue = (key: string): string => {
        const regexes = [
          new RegExp(key + '\\s*:\\s*["\'`]([^\'"`]+)["\'`]'),
          new RegExp('"' + key + '"\\s*:\\s*["\'`]([^\'"`]+)["\'`]'),
          new RegExp("'" + key + "'\\s*:\\s*[\"'`]([^\'\"`]+)[\"'`]")
        ];
        for (const regex of regexes) {
          const match = cleanText.match(regex);
          if (match && match[1]) return match[1];
        }
        return '';
      };

      const extractedApiKey = extractValue('apiKey');
      const extractedProjectId = extractValue('projectId');
      const extractedAppId = extractValue('appId');

      if (extractedApiKey && extractedProjectId && extractedAppId) {
        setApiKey(extractedApiKey);
        setAuthDomain(extractValue('authDomain'));
        setProjectId(extractedProjectId);
        setStorageBucket(extractValue('storageBucket'));
        setMessagingSenderId(extractValue('messagingSenderId'));
        setAppId(extractedAppId);
        setError(null);
        setRawText('');
        setActiveTab('manual'); // switch to show values
      } else {
        setError("Could not extract a valid Firebase configuration. Please make sure the pasted code contains apiKey, projectId, and appId.");
      }
    } catch (e: any) {
      setError("Failed to parse the snippet: " + e.message);
    }
  };

  const handleSave = () => {
    if (!apiKey || !projectId || !appId) {
      setError("API Key, Project ID, and App ID are required parameters.");
      return;
    }

    const config: FirebaseConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    saveFirebaseConfig(config);
    setError(null);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onSaved();
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    saveFirebaseConfig(null);
    setApiKey('');
    setAuthDomain('');
    setProjectId('');
    setStorageBucket('');
    setMessagingSenderId('');
    setAppId('');
    setRawText('');
    setError(null);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Firebase Database Integration
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Connect to your custom Firebase instance to securely store, synchronize, and persist platform reports in real time.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Setup Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-none">
          
          {/* Active Status Banner */}
          {currentSaved ? (
            <div className="bg-emerald-950/10 border border-emerald-500/25 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left">
                  <span className="text-xs font-semibold text-slate-200 block">Cloud Synchronization Enabled</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Connected to: {currentSaved.projectId}</span>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          ) : (
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 flex items-start gap-3 text-left">
              <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-200 block">Currently Running in Sandbox Mode</span>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Incidents are currently saved in transient browser memory. Link a Firebase project below to persist and share data across multiple clients instantly.
                </p>
              </div>
            </div>
          )}

          {/* Setup Method Selector */}
          <div className="flex border-b border-slate-800 pb-px">
            <button
              onClick={() => setActiveTab('snippet')}
              className={`pb-2.5 text-xs font-medium transition-colors border-b-2 px-4 ${
                activeTab === 'snippet'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Paste Web Snippet
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`pb-2.5 text-xs font-medium transition-colors border-b-2 px-4 ${
                activeTab === 'manual'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Manual Configuration
            </button>
          </div>

          {/* Tab 1: Web Snippet Paste */}
          {activeTab === 'snippet' && (
            <div className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  Paste Firebase Config Object
                </label>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-3 h-3" /></a> → Project Settings → Web App configuration, then paste the code block below:
                </p>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "...",\n  projectId: "...",\n  storageBucket: "...",\n  messagingSenderId: "...",\n  appId: "..."\n};`}
                  rows={6}
                  className="w-full bg-[#05080f] border border-slate-800 rounded-xl p-3.5 text-slate-300 outline-none focus:border-blue-500/50 font-mono text-[11px] leading-relaxed transition-colors shadow-inner"
                />
              </div>
              <button
                type="button"
                onClick={handleParseRawText}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Parse and Validate Config
              </button>
            </div>
          )}

          {/* Tab 2: Manual Configuration Fields */}
          {activeTab === 'manual' && (
            <div className="space-y-4 text-left animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">API Key *</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#05080f] border border-slate-800 focus:border-blue-500/50 rounded-xl px-3 py-2.5 text-slate-200 font-mono text-xs outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Project ID *</label>
                  <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="my-firebase-project-id"
                    className="w-full bg-[#05080f] border border-slate-800 focus:border-blue-500/50 rounded-xl px-3 py-2.5 text-slate-200 font-mono text-xs outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Auth Domain</label>
                  <input
                    type="text"
                    value={authDomain}
                    onChange={(e) => setAuthDomain(e.target.value)}
                    placeholder="my-project.firebaseapp.com"
                    className="w-full bg-[#05080f] border border-slate-800 focus:border-blue-500/50 rounded-xl px-3 py-2.5 text-slate-200 font-mono text-xs outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">App ID *</label>
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="1:123456789:web:abcdef..."
                    className="w-full bg-[#05080f] border border-slate-800 focus:border-blue-500/50 rounded-xl px-3 py-2.5 text-slate-200 font-mono text-xs outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Storage Bucket</label>
                  <input
                    type="text"
                    value={storageBucket}
                    onChange={(e) => setStorageBucket(e.target.value)}
                    placeholder="my-project.appspot.com"
                    className="w-full bg-[#05080f] border border-slate-800 focus:border-blue-500/50 rounded-xl px-3 py-2.5 text-slate-200 font-mono text-xs outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Messaging Sender ID</label>
                  <input
                    type="text"
                    value={messagingSenderId}
                    onChange={(e) => setMessagingSenderId(e.target.value)}
                    placeholder="123456789012"
                    className="w-full bg-[#05080f] border border-slate-800 focus:border-blue-500/50 rounded-xl px-3 py-2.5 text-slate-200 font-mono text-xs outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Feedback Overlays */}
          {error && (
            <div className="bg-rose-500/5 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs flex items-start gap-2.5 font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5 font-sans">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Configuration applied and authenticated successfully!</span>
            </div>
          )}

        </div>

        {/* Action Controls Footer */}
        <div className="border-t border-slate-800 p-6 bg-[#06090f] flex justify-between gap-3 items-center">
          <span className="text-[11px] text-slate-500 font-sans">
            Fields marked with * are required
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-lg flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Connection
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

