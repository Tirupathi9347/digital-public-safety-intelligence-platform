import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  ChevronRight, 
  Terminal, 
  Cpu, 
  Fingerprint, 
  Globe, 
  Activity, 
  Wifi, 
  Server, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  Database,
  LockKeyhole
} from 'lucide-react';
import { UserRole, UserSession } from '../types';

interface LoginProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('CITIZEN');

  // Interactive biometric scanning state
  const [biometricState, setBiometricState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [biometricProgress, setBiometricProgress] = useState(0);

  // Dynamic diagnostic simulation logs
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([
    'SEC_CONN: Establishing secure socket tunnel...',
    'SHIELD_ENG: Cryptographic firewall live.',
    'GEO_LOC: Pinpointing node terminal beacons...',
  ]);

  // Rotate through real-time military telemetry coordinates and hashes
  const [terminalHash, setTerminalHash] = useState('0x9F42...BE3C');
  const [pingRate, setPingRate] = useState(24);

  useEffect(() => {
    const hashInterval = setInterval(() => {
      const hex = '0123456789ABCDEF';
      let newHash = '0x';
      for (let i = 0; i < 4; i++) newHash += hex[Math.floor(Math.random() * 16)];
      newHash += '...';
      for (let i = 0; i < 4; i++) newHash += hex[Math.floor(Math.random() * 16)];
      setTerminalHash(newHash);
      setPingRate(Math.floor(Math.random() * 12) + 18);
    }, 5000);

    const logInterval = setInterval(() => {
      const telemetryStrs = [
        'GATE_KEEPER: Handshake code verified.',
        'MONITOR: Real-time scan filters active.',
        'PORTAL: Link channel payload ready.',
        'INTEGRITY: AES-256 GCM salt updated.',
        'SAT_LINK: Constellation tracking synced.',
        'CORE_LOG: DB packet routing active.',
      ];
      const randomStr = telemetryStrs[Math.floor(Math.random() * telemetryStrs.length)];
      setDiagnosticLogs(prev => [...prev.slice(-3), `${new Date().toLocaleTimeString().split(' ')[0]} - ${randomStr}`]);
    }, 4500);

    return () => {
      clearInterval(hashInterval);
      clearInterval(logInterval);
    };
  }, []);

  const executeLoginAction = (role: UserRole) => {
    if (role === 'ADMIN') {
      onLoginSuccess({
        role: 'ADMIN',
        username: 'admin',
        fullName: 'Suresh Kumar',
        badgeNumber: 'MHA-ADM-9941',
        sector: 'Digital Safety Central Directorate'
      });
    } else if (role === 'POLICE') {
      onLoginSuccess({
        role: 'POLICE',
        username: 'police',
        fullName: 'Inspector Vijay Kumar',
        badgeNumber: 'IPS-2021-0428',
        sector: 'I4C Cyber Crime Wing'
      });
    } else {
      onLoginSuccess({
        role: 'CITIZEN',
        username: 'citizen',
        fullName: 'Indian Citizen'
      });
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const u = username.trim().toLowerCase();
      const p = password;

      if (u === 'admin' && p === 'password') {
        executeLoginAction('ADMIN');
      } else if (u === 'police' && p === 'password') {
        executeLoginAction('POLICE');
      } else if (u === 'citizen') {
        executeLoginAction('CITIZEN');
      } else {
        setError('SEC_GATEWAY_ERR: Invalid security authorization credentials. Verify access codes or use direct override portals below.');
        setLoading(false);
      }
    }, 800);
  };

  const handleQuickLogin = (role: UserRole) => {
    setError('');
    setSelectedRole(role);
    setLoading(true);

    setTimeout(() => {
      executeLoginAction(role);
    }, 600);
  };

  // Interactive fingerprint scanner scan-loop
  const startBiometricScan = () => {
    if (biometricState === 'scanning' || loading) return;
    
    setError('');
    setBiometricState('scanning');
    setBiometricProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 8;
      if (progress >= 100) {
        setBiometricProgress(100);
        clearInterval(interval);
        setBiometricState('success');
        
        // Auto authenticate with selected role after fingerprint scan succeeds
        setTimeout(() => {
          executeLoginAction(selectedRole);
        }, 500);
      } else {
        setBiometricProgress(progress);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#020408] text-[#E2E8F0] flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden select-none">
      
      {/* Spatial Environment Scenery Layers */}
      <div className="cyber-grid" />
      <div className="cyber-grid-fine" />
      <div className="environmental-glow-1" />
      <div className="environmental-glow-2" />
      <div className="environmental-glow-red" />
      <div className="light-shafts" />
      <div className="scanlines" />

      {/* Futuristic top visual system banner */}
      <div className="absolute top-4 left-6 hidden md:flex items-center gap-2 text-[9px] font-mono text-slate-500 tracking-widest uppercase">
        <Server className="w-3 h-3 text-cyan-400" />
        <span>SECURE NODE SPEC: INTEL-GW-MHA</span>
        <span>|</span>
        <span>LATENCY: {pingRate}MS</span>
      </div>

      <div className="absolute top-4 right-6 hidden md:flex items-center gap-2 text-[9px] font-mono text-slate-500 tracking-widest uppercase">
        <span>GATEWAY STRUCT: SECURE-L3</span>
        <span>|</span>
        <span className="text-cyan-400">{terminalHash}</span>
      </div>

      {/* MAIN CONTAINER: Dual Column High-Fidelity Terminal HUD */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 my-4 md:my-8">
        
        {/* ================= LEFT SIDE: TACTICAL SECURITY GRAPH & WORLD NODE MAP ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#030814]/85 border border-slate-800/80 shadow-2xl relative overflow-hidden min-h-[520px] group/map">
          
          {/* Cybernetic edge lighting accents */}
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-cyan-950/10 via-transparent to-transparent pointer-events-none" />

          {/* Top Panel Brand */}
          <div className="space-y-5 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-xl filter blur-sm animate-pulse" />
                <div className="bg-gradient-to-b from-[#0b172d] to-[#040815] border border-cyan-500/35 rounded-xl p-3 flex items-center justify-center font-bold text-white shadow-lg relative z-10">
                  <Shield className="w-6 h-6 text-cyan-400 animate-[spin_30s_linear_infinite]" />
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-extrabold block font-mono">GOVERNMENT OF INDIA</span>
                <span className="text-xs uppercase tracking-wider text-slate-300 font-mono font-black">MINISTRY OF HOME AFFAIRS</span>
              </div>
            </div>

            {/* Tactical Shield Title */}
            <div className="space-y-2.5">
              <h1 className="font-display text-sm md:text-base font-black text-slate-100 tracking-widest leading-snug uppercase">
                AEGIS <span className="text-cyan-400">CYBER INTELLIGENCE</span> GATEWAY
              </h1>
              <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans font-medium">
                National security portal for digital arrests threat prevention, dynamic incident telemetry logs, and spatial law enforcement dispatch coordination.
              </p>
            </div>
          </div>

          {/* INTERACTIVE ANIMATED WORLD/INDIA GEO-CONSTELLATION MAP */}
          <div className="my-5 relative h-36 bg-[#02050b]/90 border border-slate-800/80 rounded-xl overflow-hidden flex flex-col items-center justify-center group/map-canvas">
            {/* Ambient cyber pulse wave rings */}
            <div className="absolute w-24 h-24 border border-cyan-500/10 rounded-full animate-ping pointer-events-none" />
            <div className="absolute w-44 h-44 border border-cyan-500/5 rounded-full animate-[ping_4s_infinite] pointer-events-none" />

            {/* Simulated Vector Cyber Grid of India Area */}
            <svg className="w-full h-full opacity-60 relative z-10" viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
              {/* Constellation Schematic Paths (Satellite communication links) */}
              <line x1="200" y1="40" x2="160" y2="100" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="200" y1="40" x2="220" y2="120" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="160" y1="100" x2="220" y2="120" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" />
              <line x1="220" y1="120" x2="260" y2="90" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
              
              {/* Satellite Transmission Laser Sweeps */}
              <line x1="160" y1="100" x2="200" y2="40" stroke="rgba(6, 182, 212, 0.8)" strokeWidth="1.5" className="animate-[pulse_1.5s_infinite]" />
              
              {/* Dynamic blinking node beacons (Tech hub links) */}
              {/* Delhi Beacon */}
              <g>
                <circle cx="200" cy="40" r="4" className="fill-cyan-500 animate-pulse" />
                <circle cx="200" cy="40" r="10" className="stroke-cyan-500/30 fill-none stroke-2 animate-ping" />
                <text x="208" y="44" fill="#06b6d4" className="font-mono text-[7px] font-black tracking-widest uppercase">DELHI (HQ)</text>
              </g>

              {/* Mumbai Beacon */}
              <g>
                <circle cx="160" cy="100" r="3" className="fill-blue-400" />
                <circle cx="160" cy="100" r="7" className="stroke-blue-400/30 fill-none stroke-1 animate-pulse" />
                <text x="110" y="103" fill="#60a5fa" className="font-mono text-[7px] font-bold uppercase">MUMBAI_W</text>
              </g>

              {/* Bengaluru Beacon */}
              <g>
                <circle cx="220" cy="120" r="3" className="fill-cyan-400" />
                <circle cx="220" cy="120" r="7" className="stroke-cyan-400/30 fill-none stroke-1 animate-pulse" />
                <text x="228" y="123" fill="#22d3ee" className="font-mono text-[7px] font-bold uppercase">BENGALURU_S</text>
              </g>

              {/* Kolkata Beacon */}
              <g>
                <circle cx="260" cy="90" r="3" className="fill-cyan-500/70" />
                <text x="268" y="93" fill="#0891b2" className="font-mono text-[7px] font-semibold uppercase">KOLKATA_E</text>
              </g>
            </svg>

            {/* Watermark map status */}
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[8px] font-mono text-slate-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>ACTIVE SAT MAP: INSAT-3DR LNK</span>
            </div>
          </div>

          {/* PERSPECTIVE SECURITY TUNNEL PORTAL VISUALIZATION */}
          <div className="mb-5 p-3.5 bg-[#02050b]/80 border border-slate-900 rounded-xl relative overflow-hidden">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[9px] font-black uppercase tracking-widest mb-2">
              <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span>Gateway Tunnel Path Security</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Nested rotating CSS circles representing secure tunnel firewall */}
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center rounded-full bg-[#050e1f] border border-cyan-500/20 shadow-inner overflow-hidden">
                <div className="absolute inset-1 border border-dashed border-cyan-400/40 rounded-full animate-[spin_8s_linear_infinite]" />
                <div className="absolute inset-2 border border-dotted border-blue-500/60 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-3 border border-cyan-500/30 rounded-full animate-pulse" />
                <LockKeyhole className="w-4 h-4 text-cyan-400 relative z-10" />
              </div>

              <div className="space-y-1 text-[10px] font-sans font-medium text-slate-400">
                <p className="text-slate-300">Level 3 Ingress Shield: <strong className="text-cyan-400">ENFORCED</strong></p>
                <p className="text-[9px] leading-relaxed">Continuous SHA256 integrity inspection active. Session tokens terminate after 15 minutes of inactivity.</p>
              </div>
            </div>
          </div>

          {/* LOWER SECTION: SESSION DIAGNOSTICS SCREEN */}
          <div className="space-y-3 relative z-10">
            <div className="bg-[#010307] border border-slate-900 rounded-xl p-3.5 font-mono text-[9.5px] text-slate-400 space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-slate-500 uppercase tracking-wider border-b border-slate-950 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Terminal className="w-3 h-3 text-cyan-500" />
                  <span>Real-Time Logs</span>
                </span>
                <span>SEC_PORTAL_V4</span>
              </div>
              <div className="space-y-1 min-h-[54px] flex flex-col justify-end">
                {diagnosticLogs.map((log, index) => (
                  <div key={index} className="truncate flex items-start gap-1.5">
                    <span className="text-cyan-600 font-bold">&gt;&gt;</span>
                    <span className="font-mono">{log}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono bg-[#02050b]/80 px-3.5 py-2.5 rounded-xl border border-slate-900">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-cyan-500/80 animate-pulse shrink-0" />
                <span>CHANNEL: SSL ENCRYPTED LINK</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>VERIFIED</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE: CREDENTIALS GATEWAY & ROLE PATH SELECTOR ================= */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-8 rounded-2xl bg-[#030814]/85 border border-slate-800/80 shadow-2xl relative overflow-hidden">
          
          {/* Cybernetic visual lines */}
          <div className="absolute top-0 right-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          
          <div className="relative z-10">
            {/* Header Area */}
            <div className="border-b border-slate-900 pb-4 mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-display font-black text-slate-200 uppercase tracking-widest">
                  AUTHORIZE SECURE SECTOR
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Select a clearance credential path or utilize manual cryptographic overrides.
                </p>
              </div>
              <Lock className="w-5 h-5 text-cyan-500/60 shrink-0 hidden sm:block animate-pulse" />
            </div>

            {/* Validation Feedback Alert */}
            {error && (
              <div className="bg-rose-950/20 border border-rose-500/40 text-rose-400 px-4 py-3 rounded-xl text-xs font-mono mb-5 flex items-start gap-3 glow-red relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[3px] h-full bg-rose-500 animate-pulse" />
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500 animate-bounce" />
                <div className="space-y-0.5">
                  <div className="text-[10px] text-rose-400 font-extrabold uppercase tracking-widest font-mono">AUTHORIZATION REJECTED</div>
                  <p className="tracking-wide text-[10.5px] leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* CLEARANCE ROLE PATHS (Badge Style Quick Login Selectors) */}
            <div className="space-y-3 mb-6">
              <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest block">
                POLICE DIRECTIVE CLEARANCE PATHWAYS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* ADMIN PATH BADGE */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('ADMIN')}
                  className={`p-4 rounded-xl text-left flex flex-col justify-between cursor-pointer transition-all duration-200 relative group/btn ${
                    selectedRole === 'ADMIN'
                      ? 'bg-rose-500/10 border border-rose-500/50 text-rose-400 glow-red scale-[1.02]'
                      : 'bg-[#02050c]/80 hover:bg-rose-500/5 border border-slate-800 text-slate-400 hover:text-rose-300'
                  }`}
                >
                  <span className="text-[8px] font-mono font-extrabold block uppercase tracking-widest text-rose-500/80">LEVEL 1 DIRECTIVE</span>
                  <span className="mt-3.5 flex items-center justify-between w-full">
                    <span className="font-display font-black tracking-wider text-xs">MHA ADMIN</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  {selectedRole === 'ADMIN' && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                  )}
                </button>

                {/* POLICE PATH BADGE */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('POLICE')}
                  className={`p-4 rounded-xl text-left flex flex-col justify-between cursor-pointer transition-all duration-200 relative group/btn ${
                    selectedRole === 'POLICE'
                      ? 'bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 glow-border-cyan scale-[1.02]'
                      : 'bg-[#02050c]/80 hover:bg-cyan-500/5 border border-slate-800 text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <span className="text-[8px] font-mono font-extrabold block uppercase tracking-widest text-cyan-500/80">LEVEL 2 DIRECTIVE</span>
                  <span className="mt-3.5 flex items-center justify-between w-full">
                    <span className="font-display font-black tracking-wider text-xs">I4C INVESTIGATOR</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  {selectedRole === 'POLICE' && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>

                {/* CITIZEN PATH BADGE */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('CITIZEN')}
                  className={`p-4 rounded-xl text-left flex flex-col justify-between cursor-pointer transition-all duration-200 relative group/btn ${
                    selectedRole === 'CITIZEN'
                      ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 glow-border-emerald scale-[1.02]'
                      : 'bg-[#02050c]/80 hover:bg-emerald-500/5 border border-slate-800 text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  <span className="text-[8px] font-mono font-extrabold block uppercase tracking-widest text-emerald-500/80">LEVEL 3 DIRECTIVE</span>
                  <span className="mt-3.5 flex items-center justify-between w-full">
                    <span className="font-display font-black tracking-wider text-xs">CITIZEN SHIELD</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  {selectedRole === 'CITIZEN' && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Split divider styling */}
            <div className="relative flex py-2 items-center mb-5 select-none">
              <div className="flex-grow border-t border-slate-900" />
              <span className="flex-shrink mx-4 text-[8px] font-mono text-slate-600 uppercase font-black tracking-widest">
                MANUAL CRYPTOGRAPHIC LOGIN
              </span>
              <div className="flex-grow border-t border-slate-900" />
            </div>

            {/* MANUAL AUTHENTICATION FORM */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-widest block">IDENTIFICATION USERNAME</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        // Auto-adjust selected clearance based on prefix typing
                        const val = e.target.value.toLowerCase();
                        if (val.includes('admin')) setSelectedRole('ADMIN');
                        else if (val.includes('police')) setSelectedRole('POLICE');
                        else if (val.includes('citizen')) setSelectedRole('CITIZEN');
                      }}
                      placeholder="admin, police, or citizen"
                      required
                      className="w-full bg-[#02050b] border border-slate-800 rounded-xl py-3 pl-10 pr-3.5 text-slate-200 text-xs outline-none focus:border-cyan-500/50 font-mono tracking-wide transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono font-extrabold uppercase tracking-widest block">ACCESS PINCODE / KEY</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security access code"
                      required={username.trim().toLowerCase() !== 'citizen'}
                      className="w-full bg-[#02050b] border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-slate-200 text-xs outline-none focus:border-cyan-500/50 font-mono tracking-wide transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Submit Button with loader animation */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 disabled:opacity-50 text-[#02050b] font-display font-black py-4 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 text-xs tracking-widest uppercase border border-cyan-400/30 shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.005]"
              >
                {loading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>LOGGING IN...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4.5 h-4.5" />
                    <span>SECURE LOG IN</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ================= BIOMETRIC SCANNER (FINGERPRINT PAD) ================= */}
          <div className="mt-6 p-4 bg-[#02050c]/90 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10 group/biometric">
            
            <div className="space-y-1 text-center sm:text-left">
              <span className="flex items-center justify-center sm:justify-start gap-1.5 text-cyan-400 font-mono text-[9.5px] font-black uppercase tracking-widest">
                <Radio className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                <span>BIOMETRIC SCANNING TERMINAL</span>
              </span>
              <p className="text-[10px] text-slate-400 max-w-[340px] leading-relaxed">
                Press your digital thumbprint to automatically scan, match, and bypass the clearance terminal for the selected role: <strong className="text-cyan-400 uppercase font-semibold">{selectedRole}</strong>.
              </p>
            </div>

            {/* Animated Interactive Fingerprint Scanner */}
            <button
              type="button"
              onClick={startBiometricScan}
              disabled={biometricState === 'scanning' || loading}
              className={`w-20 h-20 rounded-xl shrink-0 border relative flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-gradient-to-b from-[#061226] to-[#020610] ${
                biometricState === 'scanning'
                  ? 'border-cyan-500/70 glow-border-cyan'
                  : biometricState === 'success'
                  ? 'border-emerald-500/70 glow-border-emerald'
                  : 'border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              {/* Dynamic Laser Scanning sweep line */}
              {biometricState === 'scanning' && (
                <div className="absolute left-0 w-full h-[2.5px] bg-cyan-400 shadow-[0_0_10px_#06b6d4] animate-[scanner-laser_1.2s_ease-in-out_infinite]" />
              )}

              {/* Progress Indicator Radial Fill */}
              {biometricState === 'scanning' && (
                <div 
                  className="absolute bottom-0 left-0 bg-cyan-500/10 w-full transition-all duration-100 pointer-events-none" 
                  style={{ height: `${biometricProgress}%` }}
                />
              )}

              <Fingerprint className={`w-9 h-9 transition-transform duration-200 ${
                biometricState === 'scanning'
                  ? 'text-cyan-400 scale-105 animate-pulse'
                  : biometricState === 'success'
                  ? 'text-emerald-400 scale-105'
                  : 'text-slate-400 group-hover/biometric:text-cyan-400'
              }`} />

              <span className={`text-[7px] font-mono font-black uppercase tracking-widest mt-1.5 block ${
                biometricState === 'scanning'
                  ? 'text-cyan-400'
                  : biometricState === 'success'
                  ? 'text-emerald-400'
                  : 'text-slate-500 group-hover/biometric:text-cyan-500'
              }`}>
                {biometricState === 'scanning' ? `${biometricProgress}%` : biometricState === 'success' ? 'READY' : 'SCAN'}
              </span>
            </button>

          </div>

          {/* Quick reference credentials help bar */}
          <div className="mt-5 p-3.5 bg-[#010307]/90 border border-slate-900 rounded-xl text-[9px] text-slate-500 font-mono space-y-1.5 relative z-10">
            <span className="text-slate-400 uppercase font-black tracking-widest block">🔐 SYSTEM SECURE CODES KEYRING:</span>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[8.5px]">
              <span className="flex items-center gap-1">Admin: <strong className="text-slate-300 select-all font-bold">admin</strong> / password</span>
              <span className="flex items-center gap-1">Police: <strong className="text-slate-300 select-all font-bold">police</strong> / password</span>
              <span className="flex items-center gap-1">Citizen: <strong className="text-slate-300 select-all font-bold">citizen</strong> (No Pass)</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
