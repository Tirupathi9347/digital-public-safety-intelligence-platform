import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Database, LogOut, UserCheck, Sparkles, Clock, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { UserSession } from '../types';

interface HeaderProps {
  geminiAvailable: boolean;
  onRefresh: () => void;
  loading: boolean;
  firebaseConnected: boolean;
  onOpenFirebaseConfig: () => void;
  userSession: UserSession | null;
  onLogout: () => void;
}

export default function Header({ 
  geminiAvailable, 
  onRefresh, 
  loading, 
  firebaseConnected, 
  onOpenFirebaseConfig,
  userSession,
  onLogout
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
      setCurrentTime(new Intl.DateTimeFormat('en-IN', options).format(now) + " IST");
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0f1d]/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Agency Description */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-left hidden sm:block">
            <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              AEGIS PUBLIC SAFETY
              <span className="text-[10px] font-medium bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase">
                MHA Portal
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
              National Security & Scam Deterrence Grid
            </p>
          </div>
          {/* Mobile minimal title */}
          <div className="text-left sm:hidden">
            <h1 className="text-xs font-bold text-white">AEGIS PORTAL</h1>
          </div>
        </div>

        {/* Right Side: Connections, Clock, Profiles & System Actions */}
        <div className="flex items-center gap-3">
          
          {/* Live Date/Time */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-300 font-mono bg-slate-900/60 border border-slate-800/60 px-3 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime || "Syncing clock..."}</span>
          </div>

          {/* Cloud Sync Connection status */}
          <motion.button
            onClick={onOpenFirebaseConfig}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors duration-200 cursor-pointer ${
              firebaseConnected 
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400' 
                : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
            title="Database Connection Settings"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {firebaseConnected ? 'Cloud Active' : 'Sandbox Mode'}
            </span>
          </motion.button>

          {/* AI core status indicator */}
          <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${
            geminiAvailable 
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
              : 'bg-slate-900/60 border-slate-800 text-slate-400'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI {geminiAvailable ? 'Ready' : 'Simulated'}</span>
          </div>

          {/* Separator line */}
          <div className="h-6 w-[1px] bg-slate-800 hidden sm:block" />

          {/* User Session profile details */}
          {userSession && (
            <div className="flex items-center gap-2">
              <div className="bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-xl flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-semibold text-slate-200 leading-tight">
                    {userSession.fullName.split(' ')[0]}
                  </div>
                  <div className="text-[8.5px] font-mono text-slate-500 uppercase leading-none">
                    {userSession.role}
                  </div>
                </div>
                <motion.button
                  onClick={onLogout}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88 }}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded hover:bg-rose-500/10 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          )}

          {/* Primary Refresh action button */}
          <motion.button
            onClick={onRefresh}
            disabled={loading}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors border border-blue-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>

        </div>
      </div>
    </header>
  );
}
