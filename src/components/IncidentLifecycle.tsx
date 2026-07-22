import React, { useState } from 'react';
import { GeoIncident, UserSession, IncidentTimelineLog } from '../types';
import { 
  Clock, 
  ShieldAlert, 
  UserCheck, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  PlusCircle, 
  ChevronRight, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar, 
  Send, 
  MessageSquare, 
  Shield, 
  Lock, 
  ArrowRight,
  FileText,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface IncidentLifecycleProps {
  incidents: GeoIncident[];
  selectedIncidentId?: string;
  onSelectIncident?: (id: string) => void;
  onUpdateIncident?: (updated: GeoIncident) => void;
  userSession?: UserSession | null;
}

export default function IncidentLifecycle({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onUpdateIncident,
  userSession
}: IncidentLifecycleProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    selectedIncidentId || (incidents.length > 0 ? incidents[0].id : '')
  );

  const [showLogModal, setShowLogModal] = useState(false);
  const [newStage, setNewStage] = useState<'DISPATCH' | 'MULE_FROZEN' | 'INVESTIGATION' | 'RESOLVED' | 'NOTE'>('INVESTIGATION');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'DISPATCHED' | 'RESOLVED' | 'NOT_RESOLVED'>('ACTIVE');

  // Active incident
  const activeId = selectedIncidentId || internalSelectedId;
  const currentIncident = incidents.find(i => i.id === activeId) || incidents[0];

  const handleSelect = (id: string) => {
    setInternalSelectedId(id);
    if (onSelectIncident) onSelectIncident(id);
  };

  if (!currentIncident) {
    return (
      <div className="bg-[#03070f]/90 border border-blue-950 rounded-2xl p-8 text-center text-slate-500 font-mono">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="text-sm font-bold uppercase text-slate-300">No Incidents Found</p>
        <p className="text-xs text-slate-500 mt-1">Log or report a crime incident to generate an interactive lifecycle timeline.</p>
      </div>
    );
  }

  // Derive constructed chronological timeline nodes from incident state
  const constructedNodes: {
    id: string;
    timestamp: string;
    stageTitle: string;
    stageCategory: 'REPORT' | 'ASSIGNMENT' | 'DISPATCH' | 'TRANSFER' | 'CUSTOM_LOG' | 'RESOLUTION';
    badgeColor: string;
    icon: React.ReactNode;
    author?: string;
    badgeNumber?: string;
    details: React.ReactNode;
  }[] = [];

  // Node 1: Original Crime Report
  constructedNodes.push({
    id: `node-report-${currentIncident.id}`,
    timestamp: new Date(currentIncident.timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    stageTitle: "INCIDENT REPORT FILED",
    stageCategory: 'REPORT',
    badgeColor: "bg-rose-500/15 border-rose-500/30 text-rose-400",
    icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
    author: currentIncident.isCitizenReport ? "Citizen Public Safety Portal" : "Police Intelligence Desk",
    details: (
      <div className="space-y-2 text-xs">
        <p className="text-slate-300 font-medium leading-relaxed">{currentIncident.details}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
          <span className="bg-slate-900/80 border border-slate-800 p-1.5 rounded text-slate-400">
            Sector: <strong className="text-slate-200">{currentIncident.location}</strong>
          </span>
          <span className="bg-slate-900/80 border border-slate-800 p-1.5 rounded text-slate-400">
            Severity: <strong className="text-rose-400 font-bold">{currentIncident.severity}</strong>
          </span>
          <span className="bg-slate-900/80 border border-slate-800 p-1.5 rounded text-slate-400">
            Amount: <strong className="text-emerald-400">{currentIncident.involvedAmount}</strong>
          </span>
          {currentIncident.callerNumber && (
            <span className="bg-slate-900/80 border border-slate-800 p-1.5 rounded text-slate-400 col-span-2 sm:col-span-1">
              Suspect: <strong className="text-amber-400">{currentIncident.callerNumber}</strong>
            </span>
          )}
        </div>
      </div>
    )
  });

  // Node 2: LEA Assignment
  if (currentIncident.assignedOfficer) {
    constructedNodes.push({
      id: `node-assignment-${currentIncident.id}`,
      timestamp: new Date(currentIncident.timestamp).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      stageTitle: "INVESTIGATOR CLAIMED & ASSIGNED",
      stageCategory: 'ASSIGNMENT',
      badgeColor: "bg-blue-500/15 border-blue-500/30 text-blue-400",
      icon: <UserCheck className="w-4 h-4 text-blue-400" />,
      author: currentIncident.assignedOfficer,
      badgeNumber: currentIncident.assignedOfficerBadge || "IPS-OFFICER",
      details: (
        <div className="space-y-1.5 text-xs font-mono text-slate-300">
          <p className="flex items-center gap-2">
            <span>Primary Lead:</span>
            <strong className="text-cyan-400">{currentIncident.assignedOfficer}</strong>
            <span className="text-slate-500 text-[10px]">({currentIncident.assignedOfficerBadge || 'IPS'})</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Jurisdiction Sector: {currentIncident.assignedOfficerSector || 'Central Cyber Command'}
          </p>
        </div>
      )
    });
  }

  // Node 3: Case Transfer Logs (if any)
  if (currentIncident.transferHistory && currentIncident.transferHistory.length > 0) {
    currentIncident.transferHistory.forEach((tx, idx) => {
      constructedNodes.push({
        id: `node-tx-${idx}`,
        timestamp: new Date(tx.timestamp).toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        stageTitle: "CASE JURISDICTION TRANSFERRED",
        stageCategory: 'TRANSFER',
        badgeColor: "bg-purple-500/15 border-purple-500/30 text-purple-400",
        icon: <ArrowRight className="w-4 h-4 text-purple-400" />,
        author: tx.fromOfficer,
        details: (
          <div className="text-xs font-mono text-slate-300 bg-purple-950/20 border border-purple-900/40 p-2 rounded-lg">
            Re-routed from <strong className="text-slate-200">{tx.fromOfficer}</strong> to <strong className="text-cyan-300">{tx.toOfficer}</strong>.
          </div>
        )
      });
    });
  }

  // Node 4: Dispatched Support
  if (currentIncident.assignedUnit || currentIncident.status === 'DISPATCHED') {
    constructedNodes.push({
      id: `node-dispatch-${currentIncident.id}`,
      timestamp: new Date(currentIncident.timestamp).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      stageTitle: "FIELD TACTICAL DISPATCH DEPLOYED",
      stageCategory: 'DISPATCH',
      badgeColor: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
      icon: <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />,
      author: "National Cyber Command Dispatch",
      details: (
        <div className="space-y-1.5 text-xs font-mono">
          <p className="text-slate-300">
            Taskforce Unit: <strong className="text-cyan-300">{currentIncident.assignedUnit || 'I4C Special Cyber Strike Force'}</strong>
          </p>
          <div className="flex items-center gap-2 text-[10.5px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-2 rounded-md">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Mule Bank Account Freeze Directive dispatched under Sec 102 CrPC.</span>
          </div>
        </div>
      )
    });
  }

  // Node 5: Custom Timeline Logs
  if (currentIncident.timelineLogs && currentIncident.timelineLogs.length > 0) {
    currentIncident.timelineLogs.forEach((log) => {
      constructedNodes.push({
        id: log.id,
        timestamp: new Date(log.timestamp).toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        stageTitle: log.title.toUpperCase(),
        stageCategory: 'CUSTOM_LOG',
        badgeColor: "bg-amber-500/15 border-amber-500/30 text-amber-400",
        icon: <MessageSquare className="w-4 h-4 text-amber-400" />,
        author: log.author,
        badgeNumber: log.badgeNumber,
        details: (
          <div className="space-y-1 text-xs">
            <p className="text-slate-200 leading-relaxed font-sans">{log.description}</p>
            {log.statusBadge && (
              <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 uppercase mt-1">
                STATUS UPDATED TO: {log.statusBadge}
              </span>
            )}
          </div>
        )
      });
    });
  }

  // Node 6: Resolution State Node
  if (currentIncident.status === 'RESOLVED' || currentIncident.status === 'NOT_RESOLVED') {
    const isResolved = currentIncident.status === 'RESOLVED';
    constructedNodes.push({
      id: `node-resolution-${currentIncident.id}`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      stageTitle: isResolved ? "CASE RESOLVED & COMPLETED" : "INVESTIGATION CLOSED (UNRESOLVED)",
      stageCategory: 'RESOLUTION',
      badgeColor: isResolved ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-rose-500/15 border-rose-500/30 text-rose-400",
      icon: isResolved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />,
      author: currentIncident.assignedOfficer || "Investigating Officer",
      details: (
        <div className={`p-3 rounded-lg border text-xs font-mono ${
          isResolved ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
        }`}>
          {isResolved ? (
            <p>🎉 Crime threat successfully mitigated. Suspect credentials logged in national registry & victim funds frozen for court release.</p>
          ) : (
            <p>⚠️ Investigation suspended pending additional evidence or cross-border subpoena response.</p>
          )}
        </div>
      )
    });
  }

  // Submit new timeline entry
  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !onUpdateIncident) return;

    const authorName = userSession?.fullName || currentIncident.assignedOfficer || "Investigating Officer";
    const authorBadge = userSession?.badgeNumber || currentIncident.assignedOfficerBadge || "IPS-OFFICER";

    const newLog: IncidentTimelineLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      stage: newStage,
      title: newTitle,
      description: newDescription,
      author: authorName,
      badgeNumber: authorBadge,
      statusBadge: newStatus !== currentIncident.status ? newStatus : undefined
    };

    const updatedIncident: GeoIncident = {
      ...currentIncident,
      status: newStatus,
      timelineLogs: [...(currentIncident.timelineLogs || []), newLog]
    };

    onUpdateIncident(updatedIncident);

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setShowLogModal(false);
  };

  return (
    <div className="bg-[#03070f]/90 border border-blue-950 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6">
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f1d_1px,transparent_1px),linear-gradient(to_bottom,#080f1d_1px,transparent_1px)] bg-[size:0.8rem_0.8rem] opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Header & Case Picker */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-950 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/25 rounded-xl text-cyan-400">
            <Activity className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-display font-black text-slate-100 uppercase tracking-wide">
                Incident Lifecycle Timeline
              </h3>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded uppercase">
                CHRONOLOGICAL INVESTIGATION AUDIT
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              REAL-TIME DISPATCH, JURISDICTION, AND FORENSIC EVENT PROGRESSION
            </p>
          </div>
        </div>

        {/* Selector */}
        <div className="flex items-center gap-2">
          <select
            value={activeId}
            onChange={(e) => handleSelect(e.target.value)}
            className="bg-[#020509] border border-blue-950 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-200 outline-none cursor-pointer max-w-xs truncate"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id} className="bg-[#03070f] text-slate-300">
                [{inc.id}] {inc.title.slice(0, 36)}...
              </option>
            ))}
          </select>

          {onUpdateIncident && (
            <button
              onClick={() => setShowLogModal(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-950/20 transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Log Event / Status
            </button>
          )}
        </div>
      </div>

      {/* Case Meta Brief */}
      <div className="relative z-10 bg-[#020509]/80 border border-blue-950/80 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div>
          <span className="text-[9px] text-slate-500 uppercase block font-bold">CASE TITLE</span>
          <strong className="text-slate-100 block truncate">{currentIncident.title}</strong>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 uppercase block font-bold">PRIMARY SECTOR</span>
          <span className="text-cyan-400 font-bold">{currentIncident.location}</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 uppercase block font-bold">INVESTIGATION STATUS</span>
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
            currentIncident.status === 'RESOLVED' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
            currentIncident.status === 'DISPATCHED' ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' :
            currentIncident.status === 'NOT_RESOLVED' ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' :
            'bg-amber-500/15 border-amber-500/30 text-amber-400'
          }`}>
            {currentIncident.status}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 uppercase block font-bold">ASSIGNED LEAD</span>
          <span className="text-slate-300 font-bold">{currentIncident.assignedOfficer || 'UNASSIGNED'}</span>
        </div>
      </div>

      {/* Interactive Vertical Timeline */}
      <div className="relative z-10 pl-4 sm:pl-6 my-2">
        {/* Continuous Connecting Vertical Line */}
        <div className="absolute left-[27px] sm:left-[35px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-rose-500/50 via-cyan-500/50 to-emerald-500/50" />

        <div className="space-y-6">
          {constructedNodes.map((node, index) => (
            <div key={node.id} className="relative flex items-start gap-4 group">
              {/* Timeline Bullet Node Icon */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-lg ${node.badgeColor} bg-[#020509]`}>
                {node.icon}
              </div>

              {/* Node Card Content */}
              <div className="flex-1 bg-[#020509]/90 border border-blue-950/70 rounded-xl p-4 hover:border-blue-800/80 transition-all shadow-inner font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-blue-950/60 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-slate-100 uppercase tracking-wide">
                      {node.stageTitle}
                    </span>
                    {node.author && (
                      <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/30 border border-cyan-900/40 px-2 py-0.5 rounded">
                        BY: {node.author} {node.badgeNumber ? `(${node.badgeNumber})` : ''}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-600" />
                    {node.timestamp}
                  </span>
                </div>

                {/* Details snippet */}
                <div>
                  {node.details}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Form to Log New Event */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03070f] border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative font-mono text-left animate-fade-in">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-cyan-400" />
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Append Milestone / Update Status</h4>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-500 hover:text-slate-300 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLogSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">Event Category Stage</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value as any)}
                  className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                >
                  <option value="INVESTIGATION">Field Investigation Log</option>
                  <option value="DISPATCH">Tactical Unit Dispatch</option>
                  <option value="MULE_FROZEN">Mule Account / Funds Frozen</option>
                  <option value="RESOLVED">Case Resolved</option>
                  <option value="NOTE">Investigator General Note</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">Milestone Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Bank Freeze Order Served under Sec 102 CrPC"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">Investigation Details / Forensic Findings</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide explicit operational findings, evidence numbers, or bank directives..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">Update Case Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500 font-bold"
                >
                  <option value="ACTIVE" className="text-amber-400">ACTIVE INVESTIGATION</option>
                  <option value="DISPATCHED" className="text-blue-400">DISPATCHED / SUPPORT DEPLOYED</option>
                  <option value="RESOLVED" className="text-emerald-400">RESOLVED / SOLVED</option>
                  <option value="NOT_RESOLVED" className="text-rose-400">NOT RESOLVED / SUSPENDED</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Append Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
