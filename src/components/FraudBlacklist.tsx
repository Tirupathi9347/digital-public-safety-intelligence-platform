import React, { useState, useMemo } from 'react';
import { BlacklistEntry, UserSession } from '../types';
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Phone, 
  CreditCard, 
  Globe, 
  Landmark, 
  Wallet, 
  AlertTriangle, 
  Plus, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Edit3, 
  Trash2, 
  Users, 
  Lock, 
  ExternalLink, 
  Shield, 
  Filter, 
  Sparkles,
  ChevronRight,
  Info,
  Check,
  AlertCircle
} from 'lucide-react';

interface FraudBlacklistProps {
  blacklist: BlacklistEntry[];
  userSession?: UserSession | null;
  onAddEntry: (entry: BlacklistEntry) => Promise<boolean>;
  onUpdateEntry: (entry: BlacklistEntry) => Promise<boolean>;
  onDeleteEntry: (entryId: string) => Promise<boolean>;
  showFeedback?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function FraudBlacklist({
  blacklist,
  userSession,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  showFeedback
}: FraudBlacklistProps) {
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'UPI' | 'PHONE' | 'URL' | 'BANK_ACCOUNT' | 'CRYPTO_WALLET'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BlacklistEntry | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    identifier: '',
    category: 'UPI' as BlacklistEntry['category'],
    scamType: 'Digital Arrest & Extortion',
    severity: 'CRITICAL' as BlacklistEntry['severity'],
    status: 'UNDER_INVESTIGATION' as BlacklistEntry['status'],
    leaReferenceId: '',
    description: '',
    associatedLocation: 'Pan-India',
    verifiedByLea: false
  });

  const [submitting, setSubmitting] = useState(false);

  // Quick live check result when user types in search
  const cleanSearchTerm = searchQuery.trim().toLowerCase();
  
  const exactMatch = useMemo(() => {
    if (!cleanSearchTerm || cleanSearchTerm.length < 3) return null;
    return blacklist.find(item => 
      item.identifier.toLowerCase().replace(/[\s\-\+\(\)]/g, '') === cleanSearchTerm.replace(/[\s\-\+\(\)]/g, '') ||
      item.identifier.toLowerCase().includes(cleanSearchTerm)
    ) || null;
  }, [cleanSearchTerm, blacklist]);

  // Filtered List
  const filteredBlacklist = useMemo(() => {
    return blacklist.filter(item => {
      // Category Match
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      // Severity Match
      if (severityFilter !== 'ALL' && item.severity !== severityFilter) return false;
      // Search Match
      if (cleanSearchTerm) {
        const matchIdent = item.identifier.toLowerCase().includes(cleanSearchTerm);
        const matchScam = item.scamType.toLowerCase().includes(cleanSearchTerm);
        const matchDesc = item.description.toLowerCase().includes(cleanSearchTerm);
        const matchLea = item.leaReferenceId?.toLowerCase().includes(cleanSearchTerm);
        const matchLoc = item.associatedLocation?.toLowerCase().includes(cleanSearchTerm);
        return matchIdent || matchScam || matchDesc || matchLea || matchLoc;
      }
      return true;
    });
  }, [blacklist, categoryFilter, severityFilter, cleanSearchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = blacklist.length;
    const critical = blacklist.filter(b => b.severity === 'CRITICAL').length;
    const frozenMules = blacklist.filter(b => b.status === 'MULE_ACCOUNT_FROZEN').length;
    const verified = blacklist.filter(b => b.verifiedByLea).length;
    const totalReports = blacklist.reduce((acc, b) => acc + (b.reportCount || 1), 0);
    return { total, critical, frozenMules, verified, totalReports };
  }, [blacklist]);

  // Open modal for Create or Edit
  const openCreateModal = () => {
    setEditingEntry(null);
    setFormData({
      identifier: '',
      category: 'UPI',
      scamType: 'Digital Arrest & Extortion',
      severity: 'CRITICAL',
      status: 'UNDER_INVESTIGATION',
      leaReferenceId: '',
      description: '',
      associatedLocation: 'Pan-India',
      verifiedByLea: userSession?.role === 'POLICE' || userSession?.role === 'ADMIN'
    });
    setShowModal(true);
  };

  const openEditModal = (entry: BlacklistEntry) => {
    setEditingEntry(entry);
    setFormData({
      identifier: entry.identifier,
      category: entry.category,
      scamType: entry.scamType,
      severity: entry.severity,
      status: entry.status,
      leaReferenceId: entry.leaReferenceId || '',
      description: entry.description,
      associatedLocation: entry.associatedLocation || 'Pan-India',
      verifiedByLea: entry.verifiedByLea || false
    });
    setShowModal(true);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.description.trim()) return;

    setSubmitting(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      if (editingEntry) {
        // Update existing
        const updated: BlacklistEntry = {
          ...editingEntry,
          identifier: formData.identifier.trim(),
          category: formData.category,
          scamType: formData.scamType.trim(),
          severity: formData.severity,
          status: formData.status,
          leaReferenceId: formData.leaReferenceId.trim() || undefined,
          description: formData.description.trim(),
          associatedLocation: formData.associatedLocation.trim() || 'Pan-India',
          verifiedByLea: formData.verifiedByLea,
          lastReportedDate: today
        };
        const success = await onUpdateEntry(updated);
        if (success && showFeedback) {
          showFeedback(`Fraud record [${updated.identifier}] successfully updated in central registry.`, 'success');
        }
      } else {
        // Create new
        const isPoliceOrAdmin = userSession?.role === 'POLICE' || userSession?.role === 'ADMIN';
        const newRecord: BlacklistEntry = {
          id: `blk-${Date.now()}`,
          identifier: formData.identifier.trim(),
          category: formData.category,
          scamType: formData.scamType.trim(),
          severity: formData.severity,
          status: formData.status,
          reportCount: 1,
          firstReportedDate: today,
          lastReportedDate: today,
          leaReferenceId: formData.leaReferenceId.trim() || undefined,
          description: formData.description.trim(),
          reportedByRoles: isPoliceOrAdmin ? [userSession!.role] : ['CITIZEN'],
          verifiedByLea: isPoliceOrAdmin ? formData.verifiedByLea : false,
          associatedLocation: formData.associatedLocation.trim() || 'Pan-India'
        };
        const success = await onAddEntry(newRecord);
        if (success && showFeedback) {
          showFeedback(`New suspect identifier [${newRecord.identifier}] logged in Crowdsourced Blacklist.`, 'success');
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      if (showFeedback) showFeedback('Failed to save blacklist entry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (entryId: string, identifier: string) => {
    if (!window.confirm(`Are you sure you want to remove [${identifier}] from the public blacklist registry?`)) return;
    const success = await onDeleteEntry(entryId);
    if (success && showFeedback) {
      showFeedback(`Blacklist entry [${identifier}] deleted.`, 'info');
    }
  };

  // Increment Report Count for Citizen verification
  const handleReportIncrement = async (entry: BlacklistEntry) => {
    const today = new Date().toISOString().split('T')[0];
    const roles = entry.reportedByRoles || [];
    const currentRole = userSession?.role || 'CITIZEN';
    const updatedRoles = roles.includes(currentRole) ? roles : [...roles, currentRole];

    const updated: BlacklistEntry = {
      ...entry,
      reportCount: entry.reportCount + 1,
      lastReportedDate: today,
      reportedByRoles: updatedRoles
    };
    const success = await onUpdateEntry(updated);
    if (success && showFeedback) {
      showFeedback(`Report logged for [${entry.identifier}]. Total reports: ${updated.reportCount}`, 'success');
    }
  };

  // Render Icon by Category
  const getCategoryIcon = (category: BlacklistEntry['category']) => {
    switch (category) {
      case 'UPI': return <CreditCard className="w-4 h-4 text-rose-400" />;
      case 'PHONE': return <Phone className="w-4 h-4 text-blue-400" />;
      case 'URL': return <Globe className="w-4 h-4 text-amber-400" />;
      case 'BANK_ACCOUNT': return <Landmark className="w-4 h-4 text-purple-400" />;
      case 'CRYPTO_WALLET': return <Wallet className="w-4 h-4 text-emerald-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Hero & Crowdsourced Banner */}
      <div className="bg-[#03070f]/90 border border-blue-950 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f1d_1px,transparent_1px),gradient(to_bottom,#080f1d_1px,transparent_1px)] bg-[size:0.8rem_0.8rem] opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 animate-pulse" />
                MHA NATIONAL CYBER CRIME REGISTRY
              </span>
              <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase">
                CROWDSOURCED & LEA VERIFIED
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-black text-slate-100 tracking-tight">
              Crowdsourced Fraud Blacklist Search
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Publicly searchable database of verified scammer UPI IDs, extortion phone numbers, fake job links, fraudulent bank mule accounts, and crypto wallets reported by citizens and law enforcement officers.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openCreateModal}
              className="bg-rose-600 hover:bg-rose-500 text-white font-black px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-950/40 cursor-pointer transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              {userSession?.role === 'POLICE' || userSession?.role === 'ADMIN' ? 'Add Blacklist Record' : 'Report Fraud Scammer'}
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-blue-950/80 font-mono">
          <div className="bg-[#020509]/80 border border-blue-950/80 p-3 rounded-xl">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">TOTAL BLACKLISTED</span>
            <strong className="text-sm font-black text-slate-100">{stats.total} Entities</strong>
          </div>
          <div className="bg-[#020509]/80 border border-blue-950/80 p-3 rounded-xl">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">CRITICAL THREATS</span>
            <strong className="text-sm font-black text-rose-400">{stats.critical} Critical</strong>
          </div>
          <div className="bg-[#020509]/80 border border-blue-950/80 p-3 rounded-xl">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">FROZEN MULE ACCOUNTS</span>
            <strong className="text-sm font-black text-purple-400">{stats.frozenMules} Accounts</strong>
          </div>
          <div className="bg-[#020509]/80 border border-blue-950/80 p-3 rounded-xl">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">LEA VERIFIED CASES</span>
            <strong className="text-sm font-black text-emerald-400">{stats.verified} Verified</strong>
          </div>
          <div className="bg-[#020509]/80 border border-blue-950/80 p-3 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">CITIZEN REPORTS LOGGED</span>
            <strong className="text-sm font-black text-cyan-400">{stats.totalReports} Submissions</strong>
          </div>
        </div>
      </div>

      {/* Main Search Bar & Quick Instant Alert Banner */}
      <div className="bg-[#03070f]/90 border border-blue-950 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search UPI ID (e.g. cbi.extortion@ybl), Phone (+91 98765...), Fake URL, or Bank Account..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#020509] border border-blue-950 focus:border-rose-500/60 rounded-xl pl-11 pr-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 font-mono text-xs">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-[#020509] border border-blue-950 text-slate-300 rounded-xl px-3 py-3 text-xs outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="UPI">UPI Handles</option>
              <option value="PHONE">Phone Numbers</option>
              <option value="URL">Fake Website URLs</option>
              <option value="BANK_ACCOUNT">Bank Mule Accounts</option>
              <option value="CRYPTO_WALLET">Crypto Wallets</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="bg-[#020509] border border-blue-950 text-slate-300 rounded-xl px-3 py-3 text-xs outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Severity</option>
              <option value="HIGH">High Severity</option>
              <option value="MEDIUM">Medium Severity</option>
            </select>
          </div>
        </div>

        {/* Live Instant Match Warning Box (If user searched an entity that exists in blacklist) */}
        {exactMatch && (
          <div className="bg-rose-950/40 border-2 border-rose-500/80 rounded-xl p-5 relative overflow-hidden animate-fade-in shadow-2xl">
            <div className="absolute top-0 right-0 bg-rose-600 text-slate-950 font-black text-[9px] font-mono px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              CONFIRMED FRAUD MATCH
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-400 shrink-0">
                <AlertTriangle className="w-7 h-7 animate-bounce" />
              </div>

              <div className="space-y-2 flex-1 font-sans">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-rose-300 flex items-center gap-2">
                    ⚠️ WARNING: This entity is flagged in the National Fraud Registry!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-mono">
                    SUSPECT IDENTIFIER: <strong className="text-white bg-slate-950 px-2 py-0.5 rounded border border-rose-500/40">{exactMatch.identifier}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs pt-1">
                  <div className="bg-[#020509]/80 border border-rose-900/40 p-2 rounded-lg">
                    <span className="text-[9px] text-slate-400 block uppercase">SCAM TYPE</span>
                    <strong className="text-rose-300 font-bold">{exactMatch.scamType}</strong>
                  </div>
                  <div className="bg-[#020509]/80 border border-rose-900/40 p-2 rounded-lg">
                    <span className="text-[9px] text-slate-400 block uppercase">CITIZEN REPORTS</span>
                    <strong className="text-cyan-400 font-bold">{exactMatch.reportCount} Citizens Logged</strong>
                  </div>
                  <div className="bg-[#020509]/80 border border-rose-900/40 p-2 rounded-lg">
                    <span className="text-[9px] text-slate-400 block uppercase">LEA FIR / REF</span>
                    <strong className="text-amber-300 font-bold">{exactMatch.leaReferenceId || 'UNDER LEA REVIEW'}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-rose-950 font-mono">
                  {exactMatch.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2 rounded-lg">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span><strong>SAFETY ADVISORY:</strong> DO NOT send money, share OTPs, or click links from this suspect. Call Cyber Crime Helpline <strong>1930</strong> immediately.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Blacklist Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-slate-400 px-1">
          <span className="font-bold uppercase tracking-wider text-slate-300">
            REGISTERED SUSPECT ENTITIES ({filteredBlacklist.length})
          </span>
          <span>
            {searchQuery ? `Filtered by "${searchQuery}"` : 'Showing All Verified Threat Logs'}
          </span>
        </div>

        {filteredBlacklist.length === 0 ? (
          <div className="bg-[#03070f]/90 border border-blue-950 rounded-2xl p-10 text-center space-y-3 font-mono">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
            <p className="text-sm font-bold text-slate-300 uppercase">No Scammer Records Found Matching Query</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              If you received a suspicious call or payment demand from an unlisted number/UPI, click below to report it to the public safety registry.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-2 bg-rose-600 hover:bg-rose-500 text-white font-black px-4 py-2 rounded-xl text-xs uppercase cursor-pointer"
            >
              Report New Fraud Entity
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBlacklist.map((item) => (
              <div
                key={item.id}
                className="bg-[#03070f]/90 border border-blue-950 hover:border-blue-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header Badge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-blue-950/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                          {item.category} CATEGORY
                        </span>
                        <h4 className="text-xs sm:text-sm font-mono font-black text-slate-100 truncate">
                          {item.identifier}
                        </h4>
                      </div>
                    </div>

                    {/* Status & Severity Pill */}
                    <div className="flex flex-col items-end gap-1 font-mono">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                        item.severity === 'CRITICAL' ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' :
                        item.severity === 'HIGH' ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' :
                        'bg-blue-500/15 border-blue-500/30 text-blue-400'
                      }`}>
                        {item.severity} RISK
                      </span>
                      {item.verifiedByLea && (
                        <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> LEA VERIFIED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-400 font-bold">{item.scamType}</span>
                      <span className="text-[10px] text-slate-500">
                        Status: <strong className="text-slate-300">{item.status.replace(/_/g, ' ')}</strong>
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans bg-[#020509]/80 p-3 rounded-xl border border-blue-950/60">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Meta & Controls */}
                <div className="pt-2 border-t border-blue-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <strong>{item.reportCount} Reports</strong>
                    </span>
                    {item.leaReferenceId && (
                      <span className="text-amber-400 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-900/40">
                        {item.leaReferenceId}
                      </span>
                    )}
                  </div>

                  {/* Interactive Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReportIncrement(item)}
                      title="Report this scammer if you experienced a similar threat"
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3 text-cyan-400" />
                      +1 Report
                    </button>

                    {(userSession?.role === 'POLICE' || userSession?.role === 'ADMIN') && (
                      <>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-900 text-blue-300 rounded-lg cursor-pointer transition-all"
                          title="Edit Blacklist Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.identifier)}
                          className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900 text-rose-300 rounded-lg cursor-pointer transition-all"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Blacklist Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#03070f] border border-rose-500/40 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative font-mono text-left animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                  {editingEntry ? 'Update Blacklist Entry' : 'Report / Blacklist Fraud Entity'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-300 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">
                  Suspect Identifier (UPI, Phone, Link, or Account) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. extortion.mha@ybl, +91 9876543210, or HDFC 0123456..."
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">Entity Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-rose-500"
                  >
                    <option value="UPI">UPI ID / VPA</option>
                    <option value="PHONE">Phone Number</option>
                    <option value="URL">Fake Website URL</option>
                    <option value="BANK_ACCOUNT">Bank Mule Account</option>
                    <option value="CRYPTO_WALLET">Crypto Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">Threat Severity</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-rose-500 font-bold"
                  >
                    <option value="CRITICAL" className="text-rose-400">CRITICAL RISK</option>
                    <option value="HIGH" className="text-amber-400">HIGH RISK</option>
                    <option value="MEDIUM" className="text-blue-400">MEDIUM RISK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">Scam Type / Classification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Digital Arrest, Customs Extortion, Work-From-Home Trap..."
                  value={formData.scamType}
                  onChange={(e) => setFormData({ ...formData, scamType: e.target.value })}
                  className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">Status Classification</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-rose-500"
                  >
                    <option value="VERIFIED_FRAUD">VERIFIED FRAUD</option>
                    <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
                    <option value="MULE_ACCOUNT_FROZEN">MULE ACCOUNT FROZEN</option>
                    <option value="ACTIVE_WARNING">ACTIVE WARNING</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">LEA FIR / Ref Number</label>
                  <input
                    type="text"
                    placeholder="e.g. FIR-2026-DEL-1092"
                    value={formData.leaReferenceId}
                    onChange={(e) => setFormData({ ...formData, leaReferenceId: e.target.value })}
                    className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase block font-bold mb-1">
                  Fraud Description / Extortion Tactics *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe how this suspect operates, messages sent, coerced money transfers, fake department names used..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#020509] border border-blue-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-rose-500"
                />
              </div>

              {(userSession?.role === 'POLICE' || userSession?.role === 'ADMIN') && (
                <div className="flex items-center gap-2 p-3 bg-blue-950/30 border border-blue-900/50 rounded-xl text-xs">
                  <input
                    type="checkbox"
                    id="verifiedByLea"
                    checked={formData.verifiedByLea}
                    onChange={(e) => setFormData({ ...formData, verifiedByLea: e.target.checked })}
                    className="w-4 h-4 accent-cyan-500 cursor-pointer"
                  />
                  <label htmlFor="verifiedByLea" className="text-slate-300 font-bold cursor-pointer">
                    Mark as Official LEA Verified Scammer
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-black px-4 py-2 rounded-xl text-xs uppercase cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingEntry ? 'Save Changes' : 'Submit Blacklist Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
