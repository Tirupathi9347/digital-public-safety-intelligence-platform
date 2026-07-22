import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import MapComponent from './components/MapComponent';
import ScamDetector from './components/ScamDetector';
import CurrencyScanner from './components/CurrencyScanner';
import NetworkGraph from './components/NetworkGraph';
import CitizenShield from './components/CitizenShield';
import FirebaseConfigModal from './components/FirebaseConfigModal';
import LandingPage from './components/LandingPage';
import PoliceDashboard from './components/PoliceDashboard';
import AdminIncidentManager from './components/AdminIncidentManager';
import CyberSafetyQuiz from './components/CyberSafetyQuiz';
import FraudBlacklist from './components/FraudBlacklist';

import { GeoIncident, BanknoteAnalysisResult, ScamCallAnalysis, CitizenAssessment, UserRole, UserSession, BlacklistEntry } from './types';
import { Navigation, ShieldAlert, CreditCard, Network, ShieldCheck, Info, Layers, Key, Shield, Sparkles, Search } from 'lucide-react';
import { 
  isFirebaseConnected, 
  verifyFirestoreConnection,
  fetchIncidentsFromFirebase, 
  saveIncidentToFirebase, 
  saveAssessmentToFirebase,
  deleteIncidentFromFirebase,
  INITIAL_BLACKLIST_DATA,
  fetchBlacklistFromFirebase,
  saveBlacklistEntryToFirebase,
  deleteBlacklistEntryFromFirebase
} from './firebase';

type TabType = 'geospatial' | 'scam_detector' | 'currency_scanner' | 'network_graph' | 'citizen_shield' | 'fraud_blacklist' | 'police_dashboard' | 'admin_crud' | 'cyber_safety_quiz';

export default function App() {
  // Authentication State
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  // General App States
  const [activeTab, setActiveTab] = useState<TabType>('geospatial');
  const [incidents, setIncidents] = useState<GeoIncident[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(INITIAL_BLACKLIST_DATA);
  const [geminiAvailable, setGeminiAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialSyncLoading, setInitialSyncLoading] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(false);
  const [firebaseModalOpen, setFirebaseModalOpen] = useState<boolean>(false);

  // Sync incidents and Gemini engine connectivity stats on mount
  const syncConsoleChannels = async () => {
    setInitialSyncLoading(true);
    setLoading(true);
    try {
      let fbStatus = isFirebaseConnected();
      if (fbStatus) {
        // Run network reachability check to verify connection to Firestore
        const reachable = await verifyFirestoreConnection();
        if (!reachable) {
          fbStatus = false;
          showFeedback("Firestore server unreachable. Defaulting to local sandbox mode.", "info");
        }
      }
      setFirebaseConnected(fbStatus);

      // 1. Fetch live incidents from API first (as a baseline / fallback)
      let finalIncidents: GeoIncident[] = [];
      const geoRes = await fetch('/api/geospatial-data');
      let apiIncidents: GeoIncident[] = [];
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        apiIncidents = geoData.incidents;
      }

      if (fbStatus) {
        // Try to fetch from custom Firebase Firestore
        const fbIncidents = await fetchIncidentsFromFirebase();
        if (fbIncidents && fbIncidents.length > 0) {
          finalIncidents = fbIncidents;
        } else if (fbIncidents !== null) {
          // If Firestore is successfully queried but is empty, automatically seed it with current records
          for (const inc of apiIncidents) {
            await saveIncidentToFirebase(inc);
          }
          finalIncidents = apiIncidents;
          showFeedback("Live Firestore database initialized with safety registry records.", "success");
        } else {
          // If fetching failed (returned null) due to missing permissions or uninitialized DB
          finalIncidents = apiIncidents;
          showFeedback("Firestore connection error: Verify permissions or check Firebase console.", "error");
        }
      } else {
        finalIncidents = apiIncidents;
      }

      setIncidents(finalIncidents);

      // 1.5 Fetch live Fraud Blacklist from Firestore or seed
      if (fbStatus) {
        const fbBlacklist = await fetchBlacklistFromFirebase();
        if (fbBlacklist && fbBlacklist.length > 0) {
          setBlacklist(fbBlacklist);
        } else if (fbBlacklist !== null) {
          for (const entry of INITIAL_BLACKLIST_DATA) {
            await saveBlacklistEntryToFirebase(entry);
          }
          setBlacklist(INITIAL_BLACKLIST_DATA);
        }
      }

      // 2. Check Gemini core status
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setGeminiAvailable(healthData.geminiAvailable);
        
        if (!healthData.geminiAvailable) {
          showFeedback("No GEMINI_API_KEY secret detected. Running in Sandbox Simulation mode.", "info");
        } else if (!fbStatus) {
          showFeedback("Secure connection with Gemini AI Engine online.", "success");
        }
      }
    } catch (err) {
      console.error("Failed to synchronize public safety console channels:", err);
      showFeedback("Synchronisation error. Connecting to fallback sandbox server.", "error");
    } finally {
      setLoading(false);
      setInitialSyncLoading(false);
    }
  };

  useEffect(() => {
    syncConsoleChannels();
  }, []);

  // Update default tab when user switches role
  useEffect(() => {
    if (userSession) {
      if (userSession.role === 'CITIZEN') {
        setActiveTab('citizen_shield');
      } else if (userSession.role === 'POLICE') {
        setActiveTab('police_dashboard');
      } else if (userSession.role === 'ADMIN') {
        setActiveTab('admin_crud');
      }
    }
  }, [userSession]);

  // Reset scroll position to top when user logs in/out
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    // Also scroll any overflow-y containers if needed
    const scrollContainers = document.querySelectorAll('.overflow-y-auto');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
    });
  }, [userSession]);

  const showFeedback = (text: string, type: 'info' | 'success' | 'error') => {
    setFeedbackMsg({ text, type });
    // Auto clear after 6 seconds
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 6000);
  };

  // REST: Dispatch Alert simulated action (Admin + Police operation)
  const handleDispatch = async (incidentId: string, assignedUnit: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/dispatch-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId, assignedUnit })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const updated = data.updatedIncident;
          setIncidents(prev => prev.map(inc => inc.id === incidentId ? updated : inc));
          
          if (isFirebaseConnected()) {
            await saveIncidentToFirebase(updated);
          }
          
          showFeedback(`Tactical dispatch completed: ${assignedUnit} deployed.`, "success");
        }
      }
    } catch (err) {
      console.error("Dispatch transaction failed:", err);
      showFeedback("Could not complete dispatch protocol.", "error");
    } finally {
      setLoading(false);
    }
  };

  // REST: Citizens reports a new incident
  const handleReportNewIncident = async (report: Partial<GeoIncident>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/report-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const newInc = data.incident;
          setIncidents(prev => [newInc, ...prev]);

          if (isFirebaseConnected()) {
            await saveIncidentToFirebase(newInc);
          }

          // Auto-sync suspect details (callerNumber / phone / UPI) into Fraud Blacklist
          const suspectIdentifier = newInc.callerNumber?.trim();
          if (suspectIdentifier && suspectIdentifier.length >= 5) {
            const today = new Date().toISOString().split('T')[0];
            const existingIndex = blacklist.findIndex(b => b.identifier.toLowerCase() === suspectIdentifier.toLowerCase());
            if (existingIndex >= 0) {
              const updatedEntry: BlacklistEntry = {
                ...blacklist[existingIndex],
                reportCount: blacklist[existingIndex].reportCount + 1,
                lastReportedDate: today
              };
              setBlacklist(prev => prev.map((item, idx) => idx === existingIndex ? updatedEntry : item));
              if (isFirebaseConnected()) {
                await saveBlacklistEntryToFirebase(updatedEntry);
              }
            } else {
              const newBlacklistRecord: BlacklistEntry = {
                id: `blk-${Date.now()}`,
                identifier: suspectIdentifier,
                category: suspectIdentifier.includes('@') ? 'UPI' : 'PHONE',
                scamType: newInc.title || 'Digital Arrest & Extortion',
                severity: newInc.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
                status: 'UNDER_INVESTIGATION',
                reportCount: 1,
                firstReportedDate: today,
                lastReportedDate: today,
                description: newInc.details || `Reported via citizen incident file ${newInc.id}`,
                reportedByRoles: ['CITIZEN'],
                verifiedByLea: false,
                associatedLocation: newInc.location || 'Pan-India'
              };
              setBlacklist(prev => [newBlacklistRecord, ...prev]);
              if (isFirebaseConnected()) {
                await saveBlacklistEntryToFirebase(newBlacklistRecord);
              }
            }
          }

          showFeedback(`Scam alert filed successfully & added to Fraud Blacklist Registry! ID: ${newInc.id}`, "success");
        }
      }
    } catch (err) {
      console.error("Failed to submit public scam report:", err);
      showFeedback("Error filing report to centralized database.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Admin Direct Incident Add CRUD
  const handleAdminAddIncident = async (payload: Partial<GeoIncident>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/report-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const newInc = data.incident;
          // Apply Admin custom coordinates adjustments if needed
          setIncidents(prev => [newInc, ...prev]);

          if (isFirebaseConnected()) {
            await saveIncidentToFirebase(newInc);
          }

          showFeedback(`Successfully logged and synchronized new incident ${newInc.id}`, "success");
        }
      }
    } catch (err) {
      console.error("Admin incident insertion failed:", err);
      showFeedback("Could not insert incident record.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Admin Direct Incident Update CRUD
  const handleAdminUpdateIncident = async (updated: GeoIncident) => {
    setLoading(true);
    try {
      // Update local state first
      setIncidents(prev => prev.map(inc => inc.id === updated.id ? updated : inc));

      if (isFirebaseConnected()) {
        const success = await saveIncidentToFirebase(updated);
        if (!success) {
          showFeedback("Firestore sync failed (verify security rules/permissions). Local updated.", "error");
          return;
        }
      }

      showFeedback(`Incident ${updated.id} successfully updated.`, "success");
    } catch (err) {
      console.error("Admin update transaction failed:", err);
      showFeedback("Error updating incident record.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Admin Direct Incident Delete CRUD
  const handleAdminDeleteIncident = async (incidentId: string) => {
    setLoading(true);
    try {
      // Update local state first
      setIncidents(prev => prev.filter(inc => inc.id !== incidentId));

      if (isFirebaseConnected()) {
        const success = await deleteIncidentFromFirebase(incidentId);
        if (!success) {
          showFeedback("Firestore deletion rejected (verify security rules/permissions). Local removed.", "error");
          return;
        }
      }

      showFeedback(`Incident ${incidentId} has been successfully expunged.`, "success");
    } catch (err) {
      console.error("Admin deletion failed:", err);
      showFeedback("Error deleting incident record.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Blacklist Add Handler
  const handleAddBlacklistEntry = async (entry: BlacklistEntry): Promise<boolean> => {
    try {
      setBlacklist(prev => [entry, ...prev]);
      if (isFirebaseConnected()) {
        await saveBlacklistEntryToFirebase(entry);
      }
      return true;
    } catch (err) {
      console.error("Failed to add blacklist entry:", err);
      return false;
    }
  };

  // Blacklist Update Handler
  const handleUpdateBlacklistEntry = async (updated: BlacklistEntry): Promise<boolean> => {
    try {
      setBlacklist(prev => prev.map(item => item.id === updated.id ? updated : item));
      if (isFirebaseConnected()) {
        await saveBlacklistEntryToFirebase(updated);
      }
      return true;
    } catch (err) {
      console.error("Failed to update blacklist entry:", err);
      return false;
    }
  };

  // Blacklist Delete Handler
  const handleDeleteBlacklistEntry = async (entryId: string): Promise<boolean> => {
    try {
      setBlacklist(prev => prev.filter(item => item.id !== entryId));
      if (isFirebaseConnected()) {
        await deleteBlacklistEntryFromFirebase(entryId);
      }
      return true;
    } catch (err) {
      console.error("Failed to delete blacklist entry:", err);
      return false;
    }
  };

  // REST: Analyze Scam Call flow
  const handleAnalyzeScamCall = async (transcript: string): Promise<ScamCallAnalysis> => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-scam-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callTranscript: transcript })
      });
      if (res.ok) {
        const result = await res.json();
        showFeedback("AI Digital Arrest scam pattern analysis completed.", "success");
        return result;
      }
      throw new Error("Analysis request returned non-OK status");
    } catch (err) {
      console.error("Scam call analysis pipeline failed:", err);
      showFeedback("Extortion pattern classification failed.", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // REST: Analyze Banknote (Currency scanner)
  const handleAnalyzeCurrency = async (imageBase64: string, noteDetails: any): Promise<BanknoteAnalysisResult> => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-currency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, noteDetails, denomination: "500" })
      });
      if (res.ok) {
        const result = await res.json();
        showFeedback("FICN banknote inspection completed.", "success");
        return result;
      }
      throw new Error("Currency verify request returned non-OK status");
    } catch (err) {
      console.error("Currency scan request failed:", err);
      showFeedback("Microprint optical scanning failed.", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // REST: Draft Intel Evidence Package (Graph AI)
  const handleDraftIntelPackage = async (nodeId: string, notes: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/fraud-network-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, note: notes })
      });
      if (res.ok) {
        const result = await res.json();
        showFeedback("Court-admissible forensic intelligence package drafted.", "success");
        return result;
      }
      throw new Error("Intelligence draft request returned non-OK status");
    } catch (err) {
      console.error("Intelligence package generation failed:", err);
      showFeedback("Forensic court report drafting failed.", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // REST: Citizen assessment chat guidance (obsolete but kept for back-compat)
  const handleAssessCitizenThreat = async (message: string, language: string): Promise<CitizenAssessment> => {
    setLoading(true);
    try {
      const res = await fetch('/api/citizen-shield-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language })
      });
      if (res.ok) {
        const result = await res.json();
        if (isFirebaseConnected()) {
          await saveAssessmentToFirebase({
            message,
            language,
            assessment: result
          });
        }
        showFeedback(`Threat assessment completed in ${language}.`, "success");
        return result;
      }
      throw new Error("Citizen shield API returned non-OK status");
    } catch (err) {
      console.error("Citizen assessment API pipeline failed:", err);
      showFeedback("Safety evaluation failed.", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // REST: Advanced Multi-input Citizen Scanner
  const handleAssessCitizenMultiScam = async (payload: {
    inputType: 'text' | 'url' | 'image' | 'file';
    text: string;
    imageBase64?: string;
    fileBase64?: string;
    fileName?: string;
    language: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-citizen-multi-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const result = await res.json();

        // Save metadata assessment triggers to Firebase if connected
        if (isFirebaseConnected()) {
          await saveAssessmentToFirebase({
            inputType: payload.inputType,
            textExcerpt: payload.text?.slice(0, 500),
            language: payload.language,
            fileName: payload.fileName,
            assessment: {
              isScam: result.isScam,
              riskLevel: result.riskLevel,
              scamType: result.scamType,
              verdict: result.verdict
            }
          });
        }

        showFeedback(`AI safety scan completed for ${payload.inputType}.`, "success");
        return result;
      }
      throw new Error("Multi-input scan API returned non-OK status");
    } catch (err) {
      console.error("Multi-input citizen scanning failed:", err);
      showFeedback("Vigilance scanning engine pipeline error.", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Gated Render: If not logged in, show the ultra-premium 3D Landing Page & Secure Gateway
  if (!userSession) {
    return <LandingPage onEnterPlatform={(session) => setUserSession(session)} geminiAvailable={geminiAvailable} />;
  }

  // Get valid tabs for each specific role
  const getTabsForRole = (role: UserRole) => {
    switch (role) {
      case 'CITIZEN':
        return [
          { id: 'citizen_shield', label: 'Citizen Fraud Shield', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
          { id: 'fraud_blacklist', label: 'Fraud Blacklist Search', icon: <Search className="w-4 h-4 text-rose-400" /> },
          { id: 'currency_scanner', label: 'Counterfeit Currency Scanner', icon: <CreditCard className="w-4 h-4 text-blue-400" /> },
          { id: 'cyber_safety_quiz', label: 'Cyber Defense Arena', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> }
        ];
      case 'POLICE':
        return [
          { id: 'police_dashboard', label: 'Investigator Command Suite', icon: <Layers className="w-4 h-4 text-blue-400" /> },
          { id: 'fraud_blacklist', label: 'Fraud Blacklist Registry', icon: <Search className="w-4 h-4 text-rose-400" /> },
          { id: 'geospatial', label: 'Geospatial Crime Hotspots', icon: <Navigation className="w-4 h-4 text-blue-400" /> },
          { id: 'network_graph', label: 'Fraud Network Graph AI', icon: <Network className="w-4 h-4 text-blue-400" /> },
          { id: 'scam_detector', label: 'Digital Arrest Classifier AI', icon: <ShieldAlert className="w-4 h-4 text-blue-400" /> }
        ];
      case 'ADMIN':
        return [
          { id: 'admin_crud', label: 'MHA Administrative Panel', icon: <Shield className="w-4 h-4 text-rose-500" /> },
          { id: 'fraud_blacklist', label: 'Fraud Blacklist Registry', icon: <Search className="w-4 h-4 text-rose-400" /> },
          { id: 'geospatial', label: 'Geospatial Crime Hotspots', icon: <Navigation className="w-4 h-4 text-blue-400" /> },
          { id: 'police_dashboard', label: 'Police Analytics View', icon: <Layers className="w-4 h-4 text-blue-400" /> },
          { id: 'network_graph', label: 'Fraud Network Graph AI', icon: <Network className="w-4 h-4 text-blue-400" /> },
          { id: 'currency_scanner', label: 'Counterfeit Currency Scanner', icon: <CreditCard className="w-4 h-4 text-blue-400" /> },
          { id: 'citizen_shield', label: 'Citizen Shield Preview', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
          { id: 'cyber_safety_quiz', label: 'Cyber Defense Arena', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> }
        ];
      default:
        return [];
    }
  };

  const visibleTabs = getTabsForRole(userSession.role);

  // Generate 15 deterministic floating telemetry micro-particles for atmospheric 3D depth
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: `p-${i}`,
    top: `${(i * 7 + 13) % 100}%`,
    left: `${(i * 11 + 7) % 100}%`,
    size: `${(i % 3) + 1.5}px`,
    delay: `${(i * 0.4).toFixed(1)}s`,
    duration: `${6 + (i % 4) * 2}s`,
  }));

  return (
    <div className="min-h-screen bg-[#020408] text-[#E2E8F0] flex flex-col p-4 md:p-6 space-y-4 font-sans select-none relative overflow-hidden">
      
      {/* --- UNDERLAY SPATIAL SCENERY --- */}
      {/* Main Cyber Grid Layer */}
      <div className="cyber-grid" />
      <div className="cyber-grid-fine" />

      {/* Atmospheric Lighting Hotspots */}
      <div className="environmental-glow-1" />
      <div className="environmental-glow-2" />
      <div className="environmental-glow-red" />
      
      {/* Dynamic Light Shaft Volumetrics */}
      <div className="light-shafts" />

      {/* Atmospheric Telemetry Floating Particles (High-performance lightweight layout) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-cyan-400/20 rounded-full animate-pulse filter blur-[0.5px]"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* --- GLOBAL APP NAVBAR (HEADER) --- */}
      <Header 
        geminiAvailable={geminiAvailable} 
        onRefresh={syncConsoleChannels} 
        loading={loading} 
        firebaseConnected={firebaseConnected}
        onOpenFirebaseConfig={() => setFirebaseModalOpen(true)}
        userSession={userSession}
        onLogout={() => setUserSession(null)}
      />

      {/* --- SYSTEM STATUS FEEDBACK / TACTICAL ALERTS TICKER --- */}
      {feedbackMsg && (
        <div 
          id="system-toast"
          className={`mx-0 px-5 py-3 text-xs font-mono flex items-center justify-between gap-4 transition-all duration-300 rounded-xl glass-premium border relative overflow-hidden z-40 shrink-0 ${
            feedbackMsg.type === 'error' 
              ? 'border-rose-500/40 text-rose-400 glow-red' 
              : feedbackMsg.type === 'success'
              ? 'border-emerald-500/40 text-emerald-400 glow-border-emerald'
              : 'border-cyan-500/40 text-cyan-400 glow-border-cyan'
          }`}
        >
          {/* Animated red alert warning line */}
          <div className={`absolute top-0 left-0 h-full w-[3px] ${
            feedbackMsg.type === 'error' ? 'bg-rose-500' : feedbackMsg.type === 'success' ? 'bg-emerald-500' : 'bg-cyan-500'
          }`} />

          {/* Glaze reflection */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />

          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-1 rounded-md shrink-0 ${
              feedbackMsg.type === 'error' 
                ? 'bg-rose-500/10 text-rose-400' 
                : feedbackMsg.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-cyan-500/10 text-cyan-400'
            }`}>
              <Info className="w-4 h-4 shrink-0" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest font-mono">
                {feedbackMsg.type === 'error' ? 'VIGILANCE REJECTION' : feedbackMsg.type === 'success' ? 'TRANSACTION COMPLETED' : 'CONSOLE NOTIFICATION'}
              </span>
              <span className="font-bold tracking-wide text-[11px] mt-0.5">{feedbackMsg.text}</span>
            </div>
          </div>

          {!geminiAvailable && feedbackMsg.type === 'info' && (
            <span className="text-[9px] bg-cyan-500/15 text-cyan-300 border border-cyan-500/35 px-2.5 py-1 rounded font-bold uppercase shrink-0 font-mono relative z-10 tracking-widest">
              SETTINGS &gt; ADD SECRETS KEY
            </span>
          )}
        </div>
      )}

      {/* --- NATIONAL INTELLIGENCE DASHBOARD STATS --- */}
      <DashboardStats totalIncidents={incidents.length} />

      {/* --- CONSOLE WORKSPACE VIEWPORTS --- */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 bg-transparent relative z-10">
        
        {/* Navigation Sidebar (Tactical Glass rail) */}
        <nav className="w-full lg:w-68 glass rounded-xl flex flex-row lg:flex-col p-3.5 gap-2 overflow-x-auto lg:overflow-x-visible shrink-0 z-20 glow-blue border border-slate-800/80 relative">
          {/* Subtle top horizontal indicator */}
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
          
          <div className="hidden lg:flex items-center justify-between px-3 mb-2 shrink-0">
            <span className="text-[9px] font-mono text-cyan-500/80 font-black tracking-widest uppercase">
              TACTICAL SERVICES
            </span>
            <span className="text-[8px] font-mono text-slate-600 uppercase font-bold tracking-wider">
              [ {userSession.role} ]
            </span>
          </div>

          <div className="flex flex-row lg:flex-col gap-1.5 w-full min-w-max lg:min-w-0 relative">
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  id={`sidebar-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  whileHover={{ scale: 1.012 }}
                  whileTap={{ scale: 0.988 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-semibold flex items-center justify-between gap-3 cursor-pointer select-none transition-all duration-200 relative ${
                    isActive
                      ? 'text-cyan-400 font-bold shadow-sm shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/30 hover:shadow-[0_2px_8px_rgba(6,182,212,0.06)]'
                  }`}
                >
                  {/* Sliding active background indicator using layoutId */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveTabBackground"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-950/45 to-blue-950/20 border-l-[3px] border-l-cyan-400 border border-slate-800/80 rounded-lg -z-10"
                      transition={{ type: "tween", ease: "easeInOut", duration: 0.24 }}
                    />
                  )}

                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'}`}>
                       {tab.icon}
                    </div>
                    <span className="tracking-wide text-[11px]">{tab.label}</span>
                  </div>
                  
                  {isActive && (
                    <span className="hidden lg:inline-block w-1 h-1 rounded-full bg-cyan-400 animate-ping shrink-0 relative z-10" />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="hidden lg:block mt-auto p-3 bg-[#03060c]/50 rounded-lg border border-slate-900 text-center space-y-1.5">
            <div className="text-[8px] font-mono text-slate-500 tracking-wider">AEGIS COGNITIVE HUB</div>
            <div className="text-[7.5px] font-mono text-cyan-500/60 break-all leading-relaxed uppercase">
              ID: {userSession.fullName.slice(0, 3)}-{userSession.role}-2026
            </div>
          </div>
        </nav>

        {/* Workspace Active Viewport Container with corner brackets and cyber overlay */}
        <section className={`flex-1 glass rounded-xl relative flex flex-col glow-blue min-h-[600px] bg-slate-950/20 border border-slate-800/80 ${
          activeTab === 'geospatial' || activeTab === 'network_graph' ? 'overflow-hidden' : 'overflow-y-auto'
        }`}>
          
          {/* Tactical HUD Corner Brackets */}
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-500/45 pointer-events-none z-30" />
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-500/45 pointer-events-none z-30" />
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-500/45 pointer-events-none z-30" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-500/45 pointer-events-none z-30" />

          {/* Subdued digital grid within active workspace for precision feeling */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none z-0" />

          {/* --- HIGH-FIDELITY HOLO DIAGNOSTIC LOADING SCREEN --- */}
          {initialSyncLoading && (
            <div className="absolute inset-0 bg-[#02050b]/85 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-4 animate-fade-in">
              <div className="relative flex items-center justify-center">
                {/* Outer spinning scan reticle */}
                <div className="w-16 h-16 rounded-full border border-dashed border-cyan-500/30 animate-[spin_10s_linear_infinite]" />
                {/* Intermediate reverse spinning tech dial */}
                <div className="absolute w-12 h-12 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-500/20 border-l-transparent animate-[spin_4s_linear_infinite_reverse]" />
                {/* Central pulse core */}
                <div className="absolute w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center animate-pulse">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-cyan-400 font-display text-[11.5px] font-black tracking-widest uppercase glow-text-cyan">
                  SYNCHRONIZING AEGIS DATA CORE
                </p>
                <div className="flex items-center justify-center gap-1.5 text-[8.5px] font-mono text-slate-500 uppercase tracking-widest">
                  <span>[ LOCK STATE: VERIFIED ]</span>
                  <span>•</span>
                  <span className="text-cyan-600 font-bold animate-pulse">[ SECURE INGESTION ACTIVE ]</span>
                </div>
              </div>

              {/* Progress feedback block */}
              <div className="w-48 bg-[#040810] border border-slate-900 h-1.5 rounded-full overflow-hidden relative">
                <div className="absolute h-full bg-cyan-400 w-[60%] animate-[scanner-laser_1.5s_ease-in-out_infinite]" />
              </div>
            </div>
          )}

          {/* Active module renderer */}
          <div className="flex-1 flex flex-col relative z-10 min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="flex-1 flex flex-col min-h-0"
              >
                {activeTab === 'geospatial' && (
                  <MapComponent 
                    incidents={incidents} 
                    onDispatch={handleDispatch} 
                    onReportNewIncident={handleReportNewIncident}
                    onUpdateIncident={handleAdminUpdateIncident}
                    loading={loading}
                  />
                )}

                {activeTab === 'scam_detector' && (
                  <ScamDetector 
                    onAnalyze={handleAnalyzeScamCall} 
                    loading={loading} 
                  />
                )}

                {activeTab === 'currency_scanner' && (
                  <CurrencyScanner 
                    onScan={handleAnalyzeCurrency} 
                    loading={loading} 
                    onReportNewIncident={handleReportNewIncident}
                  />
                )}

                {activeTab === 'network_graph' && (
                  <NetworkGraph 
                    onDraftIntelPackage={handleDraftIntelPackage} 
                    loading={loading} 
                  />
                )}

                {activeTab === 'citizen_shield' && (
                  <CitizenShield 
                    onAssessMulti={handleAssessCitizenMultiScam} 
                    onReportNewIncident={handleReportNewIncident}
                    incidents={incidents}
                    onUpdateIncident={handleAdminUpdateIncident}
                    loading={loading} 
                  />
                )}

                {activeTab === 'fraud_blacklist' && (
                  <FraudBlacklist 
                    blacklist={blacklist}
                    userSession={userSession}
                    onAddEntry={handleAddBlacklistEntry}
                    onUpdateEntry={handleUpdateBlacklistEntry}
                    onDeleteEntry={handleDeleteBlacklistEntry}
                    showFeedback={showFeedback}
                  />
                )}

                {activeTab === 'cyber_safety_quiz' && (
                  <CyberSafetyQuiz />
                )}

                {activeTab === 'police_dashboard' && (
                  <PoliceDashboard 
                    incidents={incidents}
                    onUpdateIncident={handleAdminUpdateIncident}
                    loading={loading}
                    userSession={userSession}
                  />
                )}

                {activeTab === 'admin_crud' && (
                  <AdminIncidentManager 
                    incidents={incidents}
                    onAdd={handleAdminAddIncident}
                    onUpdate={handleAdminUpdateIncident}
                    onDelete={handleAdminDeleteIncident}
                    loading={loading}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </section>
      </main>

      {/* --- AEGIS HIGH-FIDELITY CONSOLE FOOTER --- */}
      <footer className="glass-premium rounded-xl p-0.5 glow-blue shrink-0">
        <div className="px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] bg-[#02050b]/90 rounded-[10px] relative overflow-hidden">
          
          {/* Cyber edge glazes */}
          <div className="absolute top-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 uppercase font-bold tracking-wider text-slate-500">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE CORE LINKED</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>SAT: INSAT-3DR [36E]</span>
            <span className="text-slate-600">•</span>
            <span>ENC-HASH: AES-256-SHA3</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-mono tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 text-[8px]">
              ACCESS: {userSession.role} MODE
            </span>
          </div>

          <div className="text-[9.5px] font-mono font-medium text-slate-400 tracking-wide text-center sm:text-right">
            © 2026 MINISTRY OF HOME AFFAIRS | NATIONAL DIGITAL CORE ENCLAVE
          </div>
        </div>
      </footer>

      {/* --- FIREBASE DYNAMIC CONFIG MODAL --- */}
      <FirebaseConfigModal 
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
        onSaved={syncConsoleChannels}
      />
    </div>
  );
}
