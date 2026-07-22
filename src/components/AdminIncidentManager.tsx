import React, { useState } from 'react';
import { GeoIncident } from '../types';
import IncidentLifecycle from './IncidentLifecycle';
import { Shield, Plus, Edit3, Trash2, CheckCircle2, AlertTriangle, Save, X, RefreshCw, Layers, Database, Clock } from 'lucide-react';

interface AdminIncidentManagerProps {
  incidents: GeoIncident[];
  onAdd: (incident: Partial<GeoIncident>) => void;
  onUpdate: (incident: GeoIncident) => void;
  onDelete: (incidentId: string) => void;
  loading: boolean;
}

export default function AdminIncidentManager({ incidents, onAdd, onUpdate, onDelete, loading }: AdminIncidentManagerProps) {
  // CRUD & View States
  const [viewMode, setViewMode] = useState<'CRUD' | 'LIFECYCLE'>('CRUD');
  const [selectedLifecycleId, setSelectedLifecycleId] = useState<string>('');
  const [editingIncident, setEditingIncident] = useState<GeoIncident | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'digital_arrest' | 'counterfeit_currency' | 'money_mule' | 'cyber_fraud'>('digital_arrest');
  const [newLocation, setNewLocation] = useState('Delhi NCR');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('HIGH');
  const [newAmount, setNewAmount] = useState('₹1,50,000');
  const [newDetails, setNewDetails] = useState('');
  const [newCaller, setNewCaller] = useState('');

  // Edit Form State
  const [editTitle, setEditTitle] = useState('');
  const [editSeverity, setEditSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('HIGH');
  const [editStatus, setEditStatus] = useState<'ACTIVE' | 'DISPATCHED' | 'RESOLVED'>('ACTIVE');
  const [editLocation, setEditLocation] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editUnit, setEditUnit] = useState('');

  const indianHubLocations = [
    "Delhi NCR", "Mewat Sector, Haryana", "Jamtara, Jharkhand", "Mumbai, Maharashtra", "Bengaluru, Karnataka", "Ahmedabad, Gujarat", "Kolkata Border, West Bengal"
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAdd({
      type: newType,
      title: newTitle,
      location: newLocation,
      severity: newSeverity,
      involvedAmount: newAmount,
      details: newDetails,
      callerNumber: newCaller || undefined,
      status: 'ACTIVE'
    });

    // Reset Add state
    setNewTitle('');
    setNewDetails('');
    setNewCaller('');
    setNewAmount('₹1,50,000');
    setShowAddForm(false);
  };

  const startEdit = (inc: GeoIncident) => {
    setEditingIncident(inc);
    setEditTitle(inc.title);
    setEditSeverity(inc.severity);
    setEditStatus(inc.status);
    setEditLocation(inc.location);
    setEditAmount(inc.involvedAmount);
    setEditDetails(inc.details);
    setEditUnit(inc.assignedUnit || '');
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIncident) return;

    onUpdate({
      ...editingIncident,
      title: editTitle,
      severity: editSeverity,
      status: editStatus,
      location: editLocation,
      involvedAmount: editAmount,
      details: editDetails,
      assignedUnit: editUnit || undefined
    });

    setEditingIncident(null);
  };

  const filteredIncidents = incidents.filter(inc => 
    inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-transparent font-sans">
      
      {/* Top View Mode Header Bar */}
      <div className="bg-[#03070f]/90 border border-blue-950 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 border border-rose-500/25 rounded-xl">
            <Shield className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h2 className="text-sm font-display font-black text-slate-100 uppercase tracking-wide">
              MHA Central Administrative Panel
            </h2>
            <p className="text-[10px] font-mono text-slate-500">
              NATIONAL CYBER CRIME REGISTRY MANAGEMENT
            </p>
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 border border-blue-950 rounded-xl font-mono text-xs">
          <button
            type="button"
            onClick={() => setViewMode('CRUD')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 cursor-pointer transition-all uppercase ${
              viewMode === 'CRUD'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Threat Matrix CRUD</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('LIFECYCLE')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 cursor-pointer transition-all uppercase ${
              viewMode === 'LIFECYCLE'
                ? 'bg-cyan-600 text-slate-950 font-black shadow-lg shadow-cyan-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Incident Lifecycle Timeline</span>
          </button>
        </div>
      </div>

      {viewMode === 'LIFECYCLE' ? (
        <IncidentLifecycle 
          incidents={incidents}
          selectedIncidentId={selectedLifecycleId}
          onSelectIncident={setSelectedLifecycleId}
          onUpdateIncident={onUpdate}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* List / Search Workspace (Col span 7) */}
      <div className="lg:col-span-7 flex flex-col justify-between bg-[#03070f]/90 border border-blue-950 rounded-2xl p-6 shadow-2xl relative overflow-hidden min-h-[580px]">
        {/* Decorative Grid and Borders */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f1d_1px,transparent_1px),linear-gradient(to_bottom,#080f1d_1px,transparent_1px)] bg-[size:0.8rem_0.8rem] opacity-25 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-blue-950 pb-4 mb-5 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 border border-rose-500/25 rounded-xl">
                <Shield className="w-5.5 h-5.5 text-rose-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-display font-black text-slate-100 uppercase tracking-wide">National Threat Register</h3>
                <p className="text-[10px] text-slate-500 font-mono">SECURE MHA DATABASE INSTANCE</p>
              </div>
            </div>

            <button
              onClick={() => { setShowAddForm(true); setEditingIncident(null); }}
              className="bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider font-mono shadow-lg shadow-rose-950/20 border border-rose-500/20"
            >
              <Plus className="w-4 h-4" />
              Log New Threat
            </button>
          </div>

          {/* Search bar */}
          <div className="mb-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threat matrix by ID, Hub, keyword, status, etc..."
              className="w-full bg-[#020509] border border-blue-950 focus:border-rose-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-600 font-mono shadow-inner transition-colors"
            />
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-none pr-1">
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="bg-[#020509]/80 border border-blue-950/60 p-4 rounded-xl hover:border-blue-900 transition-colors flex items-center justify-between gap-4 text-left"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[9.5px] font-mono">
                      <span className="text-slate-500 font-bold">{inc.id}</span>
                      <span className={`px-2 py-0.5 border rounded uppercase font-black ${
                        inc.status === 'ACTIVE'
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          : inc.status === 'DISPATCHED'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {inc.status}
                      </span>
                      <span className={`px-2 py-0.5 border rounded uppercase font-black ${
                        inc.severity === 'CRITICAL' ? 'bg-rose-950/50 border-rose-800 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        {inc.severity}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 font-display truncate tracking-wide">
                      {inc.title}
                    </h4>

                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono font-medium">
                      <span className="flex items-center gap-1"><span className="text-rose-500">📍</span> {inc.location.split(',')[0]}</span>
                      <span className="flex items-center gap-1"><span className="text-emerald-500">₹</span> {inc.involvedAmount}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(inc)}
                      className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 hover:border-blue-500/50 p-2.5 rounded-xl text-blue-400 cursor-pointer transition-colors"
                      title="Edit Threat Specs"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(inc.id)}
                      className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/50 p-2.5 rounded-xl text-rose-400 cursor-pointer transition-colors"
                      title="Expunge Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-600 bg-slate-950/20 border border-dashed border-blue-950 rounded-2xl">
                <Layers className="w-8 h-8 text-blue-950 mx-auto mb-3 animate-pulse" />
                <p className="text-xs font-mono">No active threat records registered in console memory cache.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 p-4 bg-[#020509] border border-blue-950 rounded-xl text-[10px] text-slate-500 font-mono flex items-center gap-2 relative z-10">
          <Database className="w-4 h-4 text-rose-500/60" />
          <span>Real-time persistence enabled. All administrative modifications commit to database logs immediately.</span>
        </div>
      </div>

      {/* Editor / Form Workspace (Col span 5) */}
      <div className="lg:col-span-5 relative">
        
        {/* ADD INCIDENT FORM */}
        {showAddForm && (
          <div className="bg-[#03070f]/95 border border-blue-950 rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f1d_1px,transparent_1px),linear-gradient(to_bottom,#080f1d_1px,transparent_1px)] bg-[size:0.8rem_0.8rem] opacity-20 pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-blue-950 pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-mono font-black uppercase text-slate-200">Log New Crime Case</h3>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-slate-500 hover:text-slate-300 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs relative z-10">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Incident Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Fake Customs Video Arrest Threat Block"
                  className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-200 focus:border-rose-500/50 outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Threat Type</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-300 focus:border-rose-500/50 outline-none cursor-pointer font-mono font-bold"
                  >
                    <option value="digital_arrest">Digital Arrest</option>
                    <option value="counterfeit_currency">Counterfeit Currency</option>
                    <option value="money_mule">Money Mule</option>
                    <option value="cyber_fraud">Cyber Fraud</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Target Location Hub</label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-300 focus:border-rose-500/50 outline-none cursor-pointer font-mono font-bold"
                  >
                    {indianHubLocations.map(hub => (
                      <option key={hub} value={hub}>{hub.split(',')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e: any) => setNewSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-300 focus:border-rose-500/50 outline-none cursor-pointer font-mono font-bold"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Funds Exposed Amount</label>
                  <input
                    type="text"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. ₹4,50,000"
                    className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-200 focus:border-rose-500/50 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Caller CLI Number (Optional)</label>
                <input
                  type="text"
                  value={newCaller}
                  onChange={(e) => setNewCaller(e.target.value)}
                  placeholder="e.g. +91 98410 42201"
                  className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-200 focus:border-rose-500/50 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Intelligence Summary</label>
                <textarea
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  rows={4}
                  required
                  placeholder="Summarize threat scenario, suspect accounts, payment links and tactics..."
                  className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-200 focus:border-rose-500/50 outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors font-mono tracking-wider uppercase shadow-lg shadow-rose-950/20 border border-rose-500/30"
              >
                <Save className="w-4 h-4" />
                Commit Incident Record
              </button>
            </form>
          </div>
        )}

        {/* EDIT INCIDENT FORM */}
        {editingIncident && (
          <div className="bg-[#03070f]/95 border border-blue-950 rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f1d_1px,transparent_1px),linear-gradient(to_bottom,#080f1d_1px,transparent_1px)] bg-[size:0.8rem_0.8rem] opacity-20 pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-blue-950 pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400 animate-pulse" />
                <h3 className="text-xs font-mono font-black uppercase text-slate-200">Modify Specification</h3>
              </div>
              <button onClick={() => setEditingIncident(null)} className="text-slate-500 hover:text-slate-300 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs relative z-10">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-200 focus:border-blue-500/50 outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Severity</label>
                  <select
                    value={editSeverity}
                    onChange={(e: any) => setEditSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-300 focus:border-blue-500/50 outline-none cursor-pointer font-mono font-bold"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Operational Status</label>
                  <select
                    value={editStatus}
                    onChange={(e: any) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-300 focus:border-blue-500/50 outline-none cursor-pointer font-mono font-bold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Target Location Hub</label>
                  <select
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-300 focus:border-blue-500/50 outline-none cursor-pointer font-mono font-bold"
                  >
                    {indianHubLocations.map(hub => (
                      <option key={hub} value={hub}>{hub.split(',')[0]}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Funds Exposed</label>
                  <input
                    type="text"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-200 focus:border-blue-500/50 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Assigned tactical unit</label>
                <input
                  type="text"
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                  placeholder="e.g. Cyber Cell Division Alpha"
                  className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-200 focus:border-blue-500/50 outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-wider block">Forensic Summary</label>
                <textarea
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-blue-950 rounded-xl p-2.5 text-slate-200 focus:border-blue-500/50 outline-none font-sans"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors font-mono tracking-wider uppercase shadow-lg border border-blue-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingIncident(null)}
                  className="bg-slate-950 hover:bg-slate-900 border border-blue-950/60 px-5 py-3 rounded-xl text-slate-400 hover:text-slate-200 font-bold uppercase tracking-wider cursor-pointer font-mono"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STANDBY DISPLAY */}
        {!showAddForm && !editingIncident && (
          <div className="bg-[#03070f]/90 border border-blue-950 rounded-2xl p-6 shadow-xl h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 min-h-[580px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f1d_1px,transparent_1px),linear-gradient(to_bottom,#080f1d_1px,transparent_1px)] bg-[size:0.8rem_0.8rem] opacity-25 pointer-events-none" />
            <div className="bg-slate-950/80 border border-blue-950 p-5 rounded-full mb-4 shadow-inner relative z-10">
              <Shield className="w-9 h-9 text-rose-500/55 animate-pulse" />
            </div>
            <h4 className="text-sm font-black text-slate-300 font-display uppercase tracking-wider relative z-10">Administrative Control Idle</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed font-sans font-medium relative z-10">
              Select any incident threat specification record from the registry database to update severity levels, assign custom response tactical cell dispatch configurations, or log brand new records.
            </p>
          </div>
        )}

      </div>
    </div>
    )}

  </div>
);
}
