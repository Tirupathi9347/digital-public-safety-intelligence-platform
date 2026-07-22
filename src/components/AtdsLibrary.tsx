import React, { useState, useEffect, useRef, useId } from 'react';
import { 
  Shield, 
  Terminal as TerminalIcon, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  Maximize2, 
  Minimize2,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// TYPES & HELPER FUNCTIONS
// ==========================================

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'critical' | 'neutral';
export type ThreatLevel = 'LOW' | 'MODERATE' | 'SUBSTANTIAL' | 'SEVERE' | 'CRITICAL';

// ==========================================
// 1. PRIMARY BUTTON
// ==========================================
interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`relative overflow-hidden font-display font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-lg text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
        ${disabled || loading 
          ? 'bg-slate-800/40 border border-slate-700/30 text-slate-500 cursor-not-allowed' 
          : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/35 hover:border-cyan-400/60 shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98]'
        } ${className}`}
      {...props}
    >
      {/* Glare effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
      
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};

// ==========================================
// 2. SECONDARY BUTTON
// ==========================================
interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`font-display font-medium text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
        ${disabled 
          ? 'bg-slate-900/20 border border-slate-800/20 text-slate-600 cursor-not-allowed' 
          : 'bg-[#060b13]/40 hover:bg-[#0c1624]/70 border border-blue-900/50 hover:border-cyan-500/40 text-slate-300 hover:text-white active:scale-[0.98]'
        } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

// ==========================================
// 3. COMMAND BUTTON
// ==========================================
interface CommandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  shortcut?: string;
}

export const CommandButton: React.FC<CommandButtonProps> = ({
  children,
  icon,
  shortcut,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`font-mono text-[11px] uppercase tracking-wider px-4 py-2.5 rounded border border-blue-950/80 bg-slate-950/60 hover:bg-[#050b14] hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer active:scale-[0.97] group ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
      {shortcut && (
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-blue-950/60 text-slate-500 group-hover:text-cyan-500/60 transition-colors">
          {shortcut}
        </span>
      )}
    </button>
  );
};

// ==========================================
// 4. GLASS CARD
// ==========================================
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glowColor?: 'blue' | 'red' | 'cyan' | 'amber' | 'emerald' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverEffect = true,
  glowColor = 'none',
  className = '',
  ...props
}) => {
  const glowClasses = {
    none: '',
    blue: 'shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/25',
    red: 'shadow-[0_0_15px_rgba(239,68,68,0.15)] border-rose-500/25',
    cyan: 'shadow-[0_0_15px_rgba(6,182,212,0.15)] border-cyan-500/25',
    amber: 'shadow-[0_0_15px_rgba(245,158,11,0.15)] border-amber-500/25',
    emerald: 'shadow-[0_0_15px_rgba(16,185,129,0.15)] border-emerald-500/25',
  };

  return (
    <div
      className={`glass rounded-2xl p-5 shadow-xl relative overflow-hidden transition-all duration-300 border border-white/10
        ${hoverEffect ? 'hover:border-white/20 hover:shadow-2xl hover:shadow-black/40' : ''}
        ${glowClasses[glowColor]} ${className}`}
      {...props}
    >
      {/* HUD corner lines */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
      
      {children}
    </div>
  );
};

// ==========================================
// 5. INTELLIGENCE CARD
// ==========================================
interface IntelligenceCardProps {
  title: string;
  subtitle?: string;
  status?: string;
  statusType?: StatusType;
  footerLeft?: string;
  footerRight?: string;
  badgeIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const IntelligenceCard: React.FC<IntelligenceCardProps> = ({
  title,
  subtitle,
  status,
  statusType = 'neutral',
  footerLeft,
  footerRight,
  badgeIcon,
  children,
  className = '',
}) => {
  return (
    <div className={`glass rounded-xl p-5 border border-blue-950/80 bg-[#03070f]/90 relative overflow-hidden flex flex-col justify-between shadow-2xl glow-blue ${className}`}>
      {/* High-tech corner bracket accents */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/40" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/40" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/40" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/40" />
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 gap-3 relative z-10">
        <div>
          <h3 className="font-display font-extrabold text-sm text-slate-100 tracking-tight flex items-center gap-2">
            {badgeIcon && <span className="text-cyan-400 shrink-0">{badgeIcon}</span>}
            <span className="truncate">{title}</span>
          </h3>
          {subtitle && <p className="font-sans text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
        
        {status && (
          <StatusBadge status={status} type={statusType} />
        )}
      </div>

      {/* Main Content */}
      <div className="text-xs text-slate-300 font-sans leading-relaxed flex-1 relative z-10 mb-4">
        {children}
      </div>

      {/* Footer Divider */}
      {(footerLeft || footerRight) && (
        <div className="flex justify-between items-center text-[9px] font-mono border-t border-blue-950/50 pt-3 relative z-10">
          <span className="text-slate-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 animate-pulse" />
            {footerLeft}
          </span>
          <span className="font-bold text-slate-400 tracking-widest">{footerRight}</span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. STATUS BADGE
// ==========================================
interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'neutral',
  className = '',
}) => {
  const styles: Record<StatusType, string> = {
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30 glow-border-rose',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-border-emerald',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    neutral: 'bg-slate-800/40 text-slate-400 border-slate-700/30',
  };

  const dotColors: Record<StatusType, string> = {
    critical: 'bg-rose-400',
    error: 'bg-red-400',
    warning: 'bg-amber-400',
    success: 'bg-emerald-400',
    info: 'bg-cyan-400',
    neutral: 'bg-slate-400',
  };

  const isBlinking = type === 'critical' || type === 'success';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-extrabold border uppercase tracking-wider ${styles[type]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[type]} ${isBlinking ? 'animate-pulse' : ''}`} />
      <span>{status}</span>
    </span>
  );
};

// ==========================================
// 7. METRIC CARD
// ==========================================
interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  subtext?: string;
  telemetryText?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  subtext,
  telemetryText,
  className = '',
}) => {
  return (
    <div className={`glass rounded-xl p-5 border border-blue-950 bg-[#02050a]/80 shadow-lg flex flex-col justify-between glow-blue relative overflow-hidden ${className}`}>
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(6,182,212,0.03)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Label */}
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">{label}</span>
        
        {/* Value and Trend */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-display font-black tracking-tight text-white">{value}</span>
          {trend && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold
              ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend.value}
            </span>
          )}
        </div>
      </div>

      {/* Footer Text & Telemetry */}
      {(subtext || telemetryText) && (
        <div className="flex justify-between items-center text-[9px] font-mono border-t border-slate-900 pt-3 mt-4 relative z-10">
          <span className="text-slate-400 truncate">{subtext}</span>
          <span className="text-slate-600 truncate">{telemetryText}</span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 8. GLASS PANEL
// ==========================================
interface GlassPanelProps {
  title?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  title,
  headerActions,
  children,
  className = '',
}) => {
  return (
    <div className={`glass rounded-2xl border border-white/10 bg-[#040810]/70 shadow-2xl relative flex flex-col ${className}`}>
      {/* Neon Top strip accent */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      
      {/* Panel Header */}
      {title && (
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <h2 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            {title}
          </h2>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 p-6 relative overflow-visible">
        {children}
      </div>
    </div>
  );
};

// ==========================================
// 9. SECTION HEADER
// ==========================================
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  tag?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actions,
  tag,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-950/45 pb-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Glow Line Indicator */}
        <span className="w-1 h-10 bg-gradient-to-b from-cyan-500 to-blue-600 rounded shadow-[0_0_10px_rgba(6,182,212,0.8)] self-stretch" />
        
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-black text-lg text-white tracking-tight uppercase">{title}</h1>
            {tag && (
              <span className="bg-cyan-500/10 text-cyan-400 text-[8px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase tracking-widest">
                {tag}
              </span>
            )}
          </div>
          {subtitle && <p className="font-sans text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};

// ==========================================
// 10. TERMINAL PANEL
// ==========================================
interface TerminalPanelProps {
  title?: string;
  lines: string[];
  onClear?: () => void;
  className?: string;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  title = "COMMAND_SHELL.EXE",
  lines,
  onClear,
  className = '',
}) => {
  return (
    <div className={`bg-black/95 border border-emerald-950 rounded-xl p-4 font-mono text-[11px] text-emerald-400 shadow-2xl relative overflow-hidden flex flex-col min-h-[180px] ${className}`}>
      {/* Scanline and Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-40" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-emerald-950/60 pb-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Mock Win Controls */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40 border border-rose-500/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40 border border-amber-500/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-500/20" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 ml-2">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-500/70" />
            <span className="text-[10px] tracking-widest text-emerald-500/70 uppercase font-bold">{title}</span>
          </div>
        </div>

        {onClear && (
          <button 
            onClick={onClear}
            className="text-[9px] uppercase tracking-wider text-emerald-600 hover:text-emerald-400 cursor-pointer"
          >
            [CLEAR_BUFFER]
          </button>
        )}
      </div>

      {/* Line Buffer Container */}
      <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none max-h-[300px]">
        {lines.length === 0 ? (
          <span className="text-emerald-600 block animate-pulse">SYSTEM STANDBY. READY FOR TELEMETRY INPUT...</span>
        ) : (
          lines.map((line, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-emerald-700 shrink-0">[{i.toString().padStart(2, '0')}]</span>
              <span className="break-all whitespace-pre-wrap">{line}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 11. INPUT FIELD
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-slate-500 shrink-0">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full rounded-xl bg-slate-950/70 border px-4 py-3 text-xs font-sans text-slate-200 placeholder-slate-600 focus:outline-none transition-all duration-300
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/25' 
              : 'border-blue-950 hover:border-blue-900/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/25'
            }`}
          {...props}
        />
      </div>

      {error && (
        <span className="text-[10px] font-mono text-rose-400 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </span>
      )}
    </div>
  );
};

// ==========================================
// 12. SELECT FIELD
// ==========================================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={`w-full rounded-xl bg-slate-950/70 border border-blue-950 px-4 py-3 text-xs font-sans text-slate-200 focus:outline-none transition-all duration-300 cursor-pointer
          ${error 
            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/25' 
            : 'border-blue-950 hover:border-blue-900/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/25'
          }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#050912]">
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="text-[10px] font-mono text-rose-400 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </span>
      )}
    </div>
  );
};

// ==========================================
// 13. TABS HEADER
// ==========================================
interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex border-b border-blue-950/80 p-1 gap-1.5 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2.5 rounded-lg text-xs font-display font-medium tracking-wide flex items-center gap-2 transition-all relative cursor-pointer whitespace-nowrap
              ${isActive 
                ? 'text-cyan-400 border border-cyan-500/20 bg-cyan-500/5' 
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-slate-900/30'
              }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full
                ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-slate-500'}`}>
                {tab.count}
              </span>
            )}
            
            {/* Active Highlighter capsule border indicator */}
            {isActive && (
              <motion.div 
                layoutId="activeTabUnderline"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

// ==========================================
// 14. DIALOG / MODAL OVERLAY
// ==========================================
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#02050a]/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative w-full max-w-lg glass bg-[#040811]/90 rounded-2xl border border-blue-900/40 shadow-2xl overflow-hidden flex flex-col glow-blue z-10 ${className}`}
        >
          {/* Top header neon line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

          {/* Secure Corner Markers */}
          <span className="absolute top-2 left-2 text-slate-700 font-mono text-[8px] select-none">AEGIS_SECURE</span>
          
          <div className="flex items-center justify-between border-b border-blue-950/60 px-6 py-4 mt-1">
            <h3 className="font-display font-extrabold text-sm text-white tracking-tight uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh] text-xs font-sans text-slate-300 leading-relaxed scrollbar-none">
            {children}
          </div>

          {/* Footer Actions */}
          {actions && (
            <div className="border-t border-blue-950/60 px-6 py-4 bg-slate-950/40 flex justify-end items-center gap-3">
              {actions}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ==========================================
// 15. SLIDE DRAWER
// ==========================================
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  className = '',
}) => {
  if (!isOpen) return null;

  const positions = {
    left: 'left-0 top-0 bottom-0 w-full max-w-md border-r',
    right: 'right-0 top-0 bottom-0 w-full max-w-md border-l',
    bottom: 'bottom-0 left-0 right-0 h-[60vh] border-t',
  };

  const initialAnims = {
    left: { x: '-100%' },
    right: { x: '100%' },
    bottom: { y: '100%' },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#02050a]/75 backdrop-blur-sm"
        />

        {/* Slide-out Frame */}
        <motion.div 
          initial={initialAnims[position]}
          animate={{ x: 0, y: 0 }}
          exit={initialAnims[position]}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className={`absolute glass bg-[#03060d]/95 border-blue-900/30 flex flex-col shadow-2xl ${positions[position]} ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blue-950 px-6 py-5">
            <h3 className="font-display font-extrabold text-sm text-white tracking-tight uppercase">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 p-6 overflow-y-auto scrollbar-none text-xs font-sans text-slate-300 leading-relaxed">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ==========================================
// 16. TOOLTIP
// ==========================================
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [visible, setVisible] = useState(false);

  const caretStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-950 border-r-transparent border-b-transparent border-l-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-950 border-r-transparent border-t-transparent border-l-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-950 border-r-transparent border-b-transparent border-t-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-950 border-l-transparent border-b-transparent border-t-transparent',
  };

  const posStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`absolute z-50 ${posStyles[position]} pointer-events-none`}>
          <div className="bg-slate-950/95 border border-cyan-500/30 text-cyan-400 font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded shadow-xl whitespace-nowrap relative">
            {content}
            <span className={`absolute border-[4px] ${caretStyles[position]}`} />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 17. TIMELINE FORENSIC LOG
// ==========================================
interface TimelineItem {
  time: string;
  title: string;
  desc?: string;
  status?: StatusType;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  className = '',
}) => {
  const bulletColors: Record<StatusType, string> = {
    critical: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]',
    error: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]',
    warning: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]',
    success: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]',
    info: 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.7)]',
    neutral: 'bg-slate-700 shadow-none',
  };

  return (
    <div className={`flex flex-col relative pl-6 border-l border-blue-950/60 space-y-5 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="relative group">
          {/* Timeline node bullet */}
          <span className={`absolute left-[-29px] top-1.5 w-2.5 h-2.5 rounded-full border border-black/80 transition-transform duration-300 group-hover:scale-125 ${bulletColors[item.status || 'neutral']}`} />
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold text-slate-500">{item.time}</span>
              <h4 className="font-display font-bold text-xs text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{item.title}</h4>
            </div>
            {item.desc && (
              <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-xl">{item.desc}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 18. NOTIFICATION SECURITY INCIDENT BANNER
// ==========================================
interface NotificationProps {
  title: string;
  description: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp?: string;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  title,
  description,
  severity = 'MEDIUM',
  timestamp,
  onClose,
}) => {
  const severityColors = {
    CRITICAL: 'border-rose-500 bg-rose-500/5 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    HIGH: 'border-orange-500 bg-orange-500/5 text-orange-300',
    MEDIUM: 'border-amber-500 bg-amber-500/5 text-amber-300',
    LOW: 'border-cyan-500 bg-cyan-500/5 text-cyan-300',
  };

  return (
    <div className={`relative border-l-4 rounded-r-xl p-4 flex gap-4 items-start shadow-xl ${severityColors[severity]}`}>
      {/* Blinking Hazard Stripes */}
      <div className="absolute top-0 right-0 bottom-0 w-2.5 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[size:10px_10px] opacity-15 pointer-events-none rounded-r-xl" />
      
      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
      
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-1 gap-2">
          <h4 className="font-display font-black text-xs uppercase tracking-wider">{title}</h4>
          {timestamp && <span className="font-mono text-[9px] text-slate-500">{timestamp}</span>}
        </div>
        <p className="font-sans text-[11px] leading-relaxed opacity-90 pr-4">{description}</p>
      </div>

      {onClose && (
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

// ==========================================
// 19. TOAST ALERTS
// ==========================================
interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    info: 'border-cyan-500/30 bg-[#020509]/95 text-cyan-400 shadow-cyan-950/20',
    success: 'border-emerald-500/30 bg-[#020509]/95 text-emerald-400 shadow-emerald-950/20',
    warning: 'border-amber-500/30 bg-[#020509]/95 text-amber-400 shadow-amber-950/20',
    error: 'border-rose-500/30 bg-[#020509]/95 text-rose-400 shadow-rose-950/20',
  };

  const icons = {
    info: <Info className="w-4 h-4 shrink-0 text-cyan-400 animate-pulse" />,
    success: <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />,
    warning: <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />,
    error: <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />,
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-xl border p-4 flex gap-3 items-center shadow-2xl max-w-sm backdrop-blur-md glow-blue ${styles[type]}`}>
      {icons[type]}
      <span className="font-mono text-[11px] font-bold uppercase tracking-wide flex-1">{message}</span>
      <button 
        onClick={onClose}
        className="text-slate-500 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ==========================================
// 20. LOADING SKELETON
// ==========================================
interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'line' | 'circle';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'line',
}) => {
  return (
    <div className={`relative overflow-hidden bg-slate-900/40 border border-blue-950/50 animate-pulse
      ${variant === 'card' ? 'rounded-2xl p-6 min-h-[140px]' : ''}
      ${variant === 'circle' ? 'rounded-full aspect-square' : ''}
      ${variant === 'line' ? 'rounded h-3' : ''}
      ${className}`}
    >
      {/* Laser sweep scan line */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      
      {variant === 'card' && (
        <div className="space-y-4">
          <div className="h-4 bg-slate-800/60 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-800/40 rounded w-full" />
            <div className="h-3 bg-slate-800/40 rounded w-5/6" />
          </div>
          <div className="h-3 bg-slate-800/40 rounded w-2/3" />
        </div>
      )}
    </div>
  );
};

// ==========================================
// 21. PROGRESS RING
// ==========================================
interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 80,
  strokeWidth = 6,
  color = 'text-cyan-500',
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Base Track */}
          <circle
            className="text-slate-900"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Active progress */}
          <circle
            className={`${color} transition-all duration-500 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {/* Central percentage indicator */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="font-mono text-xs font-black text-white">{percentage}%</span>
        </div>
      </div>
      {label && <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{label}</span>}
    </div>
  );
};

// ==========================================
// 22. RISK GAUGE DIAL
// ==========================================
interface GaugeProps {
  value: number; // 0 to 100
  title?: string;
  labels?: string[];
  className?: string;
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  title,
  labels = ['LOW', 'MODERATE', 'CRITICAL'],
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, value));
  // Standard semi-circle SVG coordinates (radius: 40, circumference: ~125.6)
  const radius = 40;
  const circ = Math.PI * radius; // 125.6
  const offset = circ - (percentage / 100) * circ;

  const getDialColor = (val: number) => {
    if (val < 40) return 'stroke-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
    if (val < 75) return 'stroke-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
    return 'stroke-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]';
  };

  const getLabelColor = (val: number) => {
    if (val < 40) return 'text-emerald-400';
    if (val < 75) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className={`flex flex-col items-center p-4 bg-slate-950/20 border border-slate-900 rounded-2xl relative overflow-hidden ${className}`}>
      {title && <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-3 font-bold">{title}</span>}
      
      <div className="relative w-44 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 55">
          {/* Base rail */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#0a1224"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Dynamic Gauge Fill */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            className={`${getDialColor(percentage)} transition-all duration-700 ease-out`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>

        {/* Central Counter Display */}
        <div className="absolute bottom-1 left-0 right-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-display font-black tracking-tight leading-none ${getLabelColor(percentage)}`}>
            {value}
          </span>
          <span className="text-[8px] font-mono text-slate-500 font-bold uppercase tracking-widest mt-1">
            RISK LEVEL
          </span>
        </div>
      </div>

      {/* Extreme boundaries label scale */}
      <div className="flex justify-between w-full text-[8px] font-mono text-slate-500 px-2 mt-1">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
        <span>{labels[2]}</span>
      </div>
    </div>
  );
};

// ==========================================
// 23. DEFENSE THREAT BADGE
// ==========================================
interface ThreatBadgeProps {
  level: ThreatLevel;
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({ level }) => {
  const config = {
    LOW: {
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      tag: 'LEVEL_05',
      desc: 'STANDARD DEFENSE ACTIVE'
    },
    MODERATE: {
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      tag: 'LEVEL_04',
      desc: 'INTELLIGENCE PATROLS ACTIVE'
    },
    SUBSTANTIAL: {
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      tag: 'LEVEL_03',
      desc: 'COUNTER-MEASURE PROTOCOL 1B'
    },
    SEVERE: {
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      tag: 'LEVEL_02',
      desc: 'CYBER FORCE SHIELD FULL'
    },
    CRITICAL: {
      color: 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]',
      tag: 'LEVEL_01',
      desc: 'IMMEDIATE MHA INTERVENTION'
    }
  };

  return (
    <div className={`border p-3.5 rounded-xl flex items-center justify-between gap-4 bg-[#020509]/40 relative overflow-hidden ${config[level].color}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/60 border border-slate-800 shrink-0">
          <Shield className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-500 block leading-tight font-extrabold tracking-wider">{config[level].tag}</span>
          <h4 className="font-display font-black text-xs uppercase tracking-wider mt-0.5">{level} THREAT STATUS</h4>
          <p className="font-sans text-[9px] opacity-75 mt-0.5">{config[level].desc}</p>
        </div>
      </div>
      
      {/* Micro Status Radar pulse indicator */}
      <span className="relative flex h-2.5 w-2.5 mr-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-current" />
      </span>
    </div>
  );
};

// ==========================================
// 24. ANIMATED TICKER COUNTER
// ==========================================
interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1.2,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const stepTime = Math.abs(Math.floor(totalMiliseconds / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, Math.max(stepTime, 20));

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="font-display font-black tracking-tight text-white">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// ==========================================
// 25. FLOATING COMPACT PANEL
// ==========================================
interface FloatingPanelProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  onClose?: () => void;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  title,
  children,
  defaultPosition = { x: 30, y: 100 },
  onClose,
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const relPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      setIsDragging(true);
      const rect = dragRef.current.getBoundingClientRect();
      relPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - relPos.current.x,
          y: e.clientY - relPos.current.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={dragRef}
      className="fixed z-40 glass rounded-xl shadow-2xl border border-blue-900/40 bg-[#040810]/95 flex flex-col glow-blue select-none w-72"
      style={{ left: position.x, top: position.y }}
    >
      {/* Title bar / Drag Handle */}
      <div 
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between border-b border-blue-950/60 px-4 py-2.5 cursor-grab active:cursor-grabbing bg-slate-950/40 rounded-t-xl"
      >
        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-extrabold truncate">
          :: {title}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Draggable panel contents */}
      {!isMinimized && (
        <div className="p-4 text-xs font-sans text-slate-300 max-h-64 overflow-y-auto scrollbar-none">
          {children}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 26. COMMAND DOCK / SHORTCUT DOCK
// ==========================================
interface DockAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
}

interface CommandDockProps {
  actions: DockAction[];
}

export const CommandDock: React.FC<CommandDockProps> = ({ actions }) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 glass rounded-2xl px-4 py-2 flex items-center gap-1 bg-[#02060c]/90 border border-blue-900/40 shadow-2xl glow-blue">
      {/* Left HUD decoration */}
      <div className="flex flex-col gap-0.5 text-slate-600 font-mono text-[7px] mr-2 pr-2 border-r border-slate-900">
        <span>AEGIS</span>
        <span>SYS.DOCK</span>
      </div>

      {actions.map((act, idx) => (
        <Tooltip key={idx} content={act.label + (act.shortcut ? ` [${act.shortcut}]` : '')} position="top">
          <button
            onClick={act.onClick}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-900/60 transition-all duration-300 relative group cursor-pointer active:scale-90"
          >
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="scale-95 group-hover:scale-105 transition-transform">{act.icon}</span>
          </button>
        </Tooltip>
      ))}
    </div>
  );
};
