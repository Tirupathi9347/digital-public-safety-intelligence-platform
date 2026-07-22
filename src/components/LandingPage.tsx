import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck,
  Activity, 
  Terminal, 
  Play, 
  CheckCircle, 
  Cpu, 
  Navigation, 
  Layers, 
  Globe, 
  UserCheck, 
  Zap, 
  Sliders, 
  ArrowRight, 
  TrendingUp, 
  Lock, 
  Eye, 
  Server, 
  EyeOff,
  Search,
  BookOpen,
  MapPin,
  Flame,
  MousePointer,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, UserSession } from '../types';

interface LandingPageProps {
  onEnterPlatform: (session: UserSession | null) => void;
  geminiAvailable: boolean;
}

export default function LandingPage({ onEnterPlatform, geminiAvailable }: LandingPageProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  
  // Login Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Statistics counters
  const [stats, setStats] = useState({
    threats: 9481230,
    accuracy: 94.5,
    monitoring: "24/7",
    protected: 95420
  });

  // Active hover card ID for Capability showcase
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  // Interactive Tech Stack floating position multipliers
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // References for Canvas backgrounds
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const globeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active step in AI workflow pipeline
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // Live Threat Logs ticker
  const [liveThreatLogs, setLiveThreatLogs] = useState<string[]>([
    "SECURE_GATEWAY: Ingested call signature from Delhi NCR (+91 99532...)",
    "AI_CLASSIFIER: High confidence (97.4%) - Digital Arrest scam pattern matched.",
    "MHA_REGISTRY: Synchronizing Jamtara Sector 4 ledger nodes.",
    "CYBER_CELL: Tactical Unit dispatch triggered for sector Mewat-10B."
  ]);

  // Handle Mouse Move for Parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 35;
    const y = (clientY - window.innerHeight / 2) / 35;
    setMousePos({ x, y });
  };

  // Live Threat Ticker timer
  useEffect(() => {
    const logs = [
      "I4C_GATEWAY: Intercepted spoofed CBI credentials in Bengaluru Sector.",
      "VISION_AI: FICN scanner triggered. Watermark discrepancy isolated.",
      "GEMINI_REASONING: Risk profile updated to CRITICAL for Mule Account L2.",
      "SECURE_LINK: Dispatched alert matrix to MHA Command HQ.",
      "API_PORTAL: Verified Section 65B metadata package integrity."
    ];
    const interval = setInterval(() => {
      setLiveThreatLogs(prev => {
        const next = [...prev];
        next.shift();
        next.push(logs[Math.floor(Math.random() * logs.length)]);
        return next;
      });
      
      // Randomly change stat counters slightly
      setStats(prev => ({
        ...prev,
        threats: prev.threats + Math.floor(Math.random() * 4) + 1,
        protected: prev.protected + Math.floor(Math.random() * 2)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // AI Workflow loop timer
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflowStep(prev => (prev + 1) % 8);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Core Earth 3D Canvas Background Engine
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Track resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars particle pool
    const stars: { x: number; y: number; z: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        z: Math.random() * 1000,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2
      });
    }

    // Trajectory lines pool (From random lat/longs to others)
    interface Trajectory {
      startLat: number;
      startLng: number;
      endLat: number;
      endLng: number;
      progress: number;
      speed: number;
      color: string;
      arcHeight: number;
    }
    const trajectories: Trajectory[] = [];
    const colors = ["#3b82f6", "#06b6d4", "#a855f7", "#ec4899", "#f59e0b"];

    function createTrajectory(): Trajectory {
      return {
        startLat: (Math.random() - 0.5) * Math.PI,
        startLng: Math.random() * Math.PI * 2,
        endLat: (Math.random() - 0.5) * Math.PI,
        endLng: Math.random() * Math.PI * 2,
        progress: 0,
        speed: Math.random() * 0.008 + 0.003,
        color: colors[Math.floor(Math.random() * colors.length)],
        arcHeight: Math.random() * 45 + 15
      };
    }

    for (let i = 0; i < 20; i++) {
      trajectories.push(createTrajectory());
    }

    // Camera and Globe angles
    let angleY = 0;
    let angleX = -0.2;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Mouse Parallax integration
      const targetAngleY = angleY + (mousePos.x * 0.001);
      const targetAngleX = angleX + (mousePos.y * 0.001);
      angleY += 0.0015; // Autoplay orbit

      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * 0.25; // Globe radius

      // Draw Atmospheric Space Nebula Backglow
      const nebulaGlow = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 1.8);
      nebulaGlow.addColorStop(0, 'rgba(5, 11, 28, 1)');
      nebulaGlow.addColorStop(0.4, 'rgba(8, 22, 59, 0.4)');
      nebulaGlow.addColorStop(0.7, 'rgba(17, 24, 39, 0.15)');
      nebulaGlow.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = nebulaGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw Stars
      stars.forEach(star => {
        // Project stars
        const sz = star.z - (angleY * 20) % 1000;
        if (sz <= 0) return;
        const sx = (star.x / sz) * width + cx;
        const sy = (star.y / sz) * height + cy;
        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (1 - sz / 1000)})`;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Auroral Ambient Horizon behind Earth
      ctx.beginPath();
      const aurGrad = ctx.createRadialGradient(cx, cy, r * 0.95, cx, cy, r * 1.25);
      aurGrad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      aurGrad.addColorStop(0.3, 'rgba(59, 130, 246, 0.22)');
      aurGrad.addColorStop(0.65, 'rgba(168, 85, 247, 0.08)');
      aurGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aurGrad;
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Help function: 3D Globe Point Projection (Latitude, Longitude to X, Y, Z)
      const project = (lat: number, lng: number): { x: number; y: number; z: number; visible: boolean } => {
        // Rotated longitude
        const currentLng = lng + targetAngleY;

        // Spherical coordinate math
        const x3d = r * Math.cos(lat) * Math.sin(currentLng);
        const y3d = r * Math.sin(lat);
        const z3d = r * Math.cos(lat) * Math.cos(currentLng);

        // Apply pitch (angleX)
        const cosX = Math.cos(targetAngleX);
        const sinX = Math.sin(targetAngleX);
        const rotatedY = y3d * cosX - z3d * sinX;
        const rotatedZ = y3d * sinX + z3d * cosX;

        // Return projected coords
        return {
          x: cx + x3d,
          y: cy + rotatedY,
          z: rotatedZ,
          visible: rotatedZ > -r * 0.1 // check if point is on the front side of the sphere
        };
      };

      // Draw Earth Grid Lines (Latitude/Longitude curves)
      ctx.strokeStyle = "rgba(30, 58, 138, 0.15)";
      ctx.lineWidth = 0.8;
      const gridCount = 14;
      for (let i = 0; i <= gridCount; i++) {
        // Latitudinal lines
        const lat = ((i / gridCount) - 0.5) * Math.PI;
        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 40; j++) {
          const lng = (j / 40) * Math.PI * 2;
          const pt = project(lat, lng);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        }
        ctx.stroke();
      }

      // Draw Continents (represented as custom neon network data points)
      // We will define specific land coordinate groups
      const continentPlacements = [
        { name: "Asia/India", lats: [0.3, 0.4, 0.1, 0.2, 0.5, 0.6], lngs: [1.2, 1.3, 1.4, 1.1, 1.5, 1.6] },
        { name: "Europe", lats: [0.7, 0.8, 0.6, 0.9], lngs: [0.1, 0.3, 0.4, 0.2] },
        { name: "N.America", lats: [0.5, 0.7, 0.6, 0.8, 0.4], lngs: [4.2, 4.4, 4.5, 4.3, 4.6] },
        { name: "S.America", lats: [-0.1, -0.3, -0.4, -0.2], lngs: [4.8, 4.9, 5.0, 4.7] },
        { name: "Africa", lats: [-0.1, -0.2, 0.1, 0.2, 0.0], lngs: [0.5, 0.6, 0.4, 0.7, 0.55] },
        { name: "Australia", lats: [-0.4, -0.5, -0.3], lngs: [2.3, 2.4, 2.2] }
      ];

      ctx.fillStyle = "rgba(56, 189, 248, 0.45)"; // Soft neon blue for land dots
      continentPlacements.forEach(land => {
        land.lats.forEach(lat => {
          land.lngs.forEach(lng => {
            // Add slight random noise to form elegant land mass dot textures
            const seedLat = lat + Math.sin(lng * 5) * 0.04;
            const seedLng = lng + Math.cos(lat * 5) * 0.04;
            const pt = project(seedLat, seedLng);
            if (pt.visible) {
              ctx.beginPath();
              // Depth scale factor
              const size = Math.max(1, (r + pt.z) / r * 1.5);
              ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        });
      });

      // Draw Orbiting Outer Satellite Rings & Network Arcs
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // Draw outer circle orbit ring
      ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
      ctx.stroke();

      // Satellite blinking dots on orbital rings
      const satTime = Date.now() * 0.0006;
      for (let i = 0; i < 3; i++) {
        const satAngle = satTime + (i * Math.PI * 0.66);
        const satX = cx + Math.cos(satAngle) * r * 1.25;
        const satY = cy + Math.sin(satAngle) * r * 0.45; // ellipse tilt projection
        ctx.fillStyle = "#06b6d4";
        ctx.beginPath();
        ctx.arc(satX, satY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing glow ring around satellite
        ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(satX, satY, 7 + Math.sin(Date.now() * 0.005) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Render Trajectories (Cyber Attack Arcs over Globe)
      trajectories.forEach((traj, idx) => {
        const start = project(traj.startLat, traj.startLng);
        const end = project(traj.endLat, traj.endLng);

        // Update progress of the traveling laser dot
        traj.progress += traj.speed;
        if (traj.progress >= 1) {
          // Reset/Re-randomize completed trajectories
          trajectories[idx] = createTrajectory();
          return;
        }

        // Draw bezier arc between points if both visible
        if (start.visible && end.visible) {
          ctx.strokeStyle = `${traj.color}22`; // highly translucent base line
          ctx.lineWidth = 1.2;

          // Midpoint for arc coordinate curving
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2 - traj.arcHeight;

          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.quadraticCurveTo(midX, midY, end.x, end.y);
          ctx.stroke();

          // Laser pulse particle coordinate math
          const t = traj.progress;
          // Quadratic bezier interpolation formula
          const pulseX = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midX + t * t * end.x;
          const pulseY = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midY + t * t * end.y;

          // Pulse core dot
          ctx.fillStyle = traj.color;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
          ctx.fill();

          // Pulse trailing tail glow
          ctx.strokeStyle = traj.color;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          // Slight back trace segment representing tail
          const prevT = Math.max(0, t - 0.06);
          const prevX = (1 - prevT) * (1 - prevT) * start.x + 2 * (1 - prevT) * prevT * midX + prevT * prevT * end.x;
          const prevY = (1 - prevT) * (1 - prevT) * start.y + 2 * (1 - prevT) * prevT * midY + prevT * prevT * end.y;
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(pulseX, pulseY);
          ctx.stroke();
        }
      });

      // Front side ambient lens spotlight for maximum Apple WWDC feeling
      const spotGlow = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      spotGlow.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      spotGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.02)');
      spotGlow.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      ctx.fillStyle = spotGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Sharp crisp outline ring
      ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos]);

  // Handle Quick login simulation
  const handleQuickLogin = (role: UserRole) => {
    setLoginLoading(true);
    setTimeout(() => {
      if (role === 'ADMIN') {
        onEnterPlatform({
          role: 'ADMIN',
          username: 'admin',
          fullName: 'Suresh Kumar',
          badgeNumber: 'MHA-ADM-9941',
          sector: 'Digital Safety Central Directorate'
        });
      } else if (role === 'POLICE') {
        onEnterPlatform({
          role: 'POLICE',
          username: 'police',
          fullName: 'Inspector Vijay Kumar',
          badgeNumber: 'IPS-2021-0428',
          sector: 'I4C Cyber Crime Wing'
        });
      } else {
        onEnterPlatform({
          role: 'CITIZEN',
          username: 'citizen',
          fullName: 'Indian Citizen'
        });
      }
      setLoginLoading(false);
    }, 400);
  };

  // Handle Manual credentials login
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    setTimeout(() => {
      const u = username.trim().toLowerCase();
      const p = password;

      if (u === 'admin' && p === 'password') {
        onEnterPlatform({
          role: 'ADMIN',
          username: 'admin',
          fullName: 'Suresh Kumar',
          badgeNumber: 'MHA-ADM-9941',
          sector: 'Digital Safety Central Directorate'
        });
      } else if (u === 'police' && p === 'password') {
        onEnterPlatform({
          role: 'POLICE',
          username: 'police',
          fullName: 'Inspector Vijay Kumar',
          badgeNumber: 'IPS-2021-0428',
          sector: 'I4C Cyber Crime Wing'
        });
      } else if (u === 'citizen') {
        onEnterPlatform({
          role: 'CITIZEN',
          username: 'citizen',
          fullName: 'Indian Citizen'
        });
      } else {
        setLoginError('Access denied. Invalid credentials. Use the quick-access direct portals.');
        setLoginLoading(false);
      }
    }, 600);
  };

  const capabilities = [
    {
      id: 1,
      title: "AI Scam Extortion Classifier",
      description: "Applies real-time phonetic parsing to map digital arrest extortion calls, classifying risk telemetry using multi-lingual threat indexes.",
      badge: "MULTIMODAL AI",
      color: "border-blue-500/30 text-blue-400 glow-blue",
      stat: "99.4% Accuracy"
    },
    {
      id: 2,
      title: "Counterfeit Currency Scanner",
      description: "Performs optical microprint OCR verification matching RBI secure banknote signatures, isolating counterfeit fluorescent variables.",
      badge: "VISION AI",
      color: "border-indigo-500/30 text-indigo-400 glow-indigo",
      stat: "FICN Verified"
    },
    {
      id: 3,
      title: "Citizen Fraud Shield",
      description: "Advanced upload inspector accepting documents, links, and text captures to screen and isolate phishing traps with Gemini reasoning.",
      badge: "SHIELD MATRIX",
      color: "border-emerald-500/30 text-emerald-400 glow-emerald",
      stat: "Immediate Audit"
    },
    {
      id: 4,
      title: "Police Intelligence Dashboard",
      description: "Direct action panel linking active alerts with geolocation hubs to generate section 65B court-admissible forensic packages.",
      badge: "COMMAND UNIT",
      color: "border-rose-500/30 text-rose-400 glow-rose",
      stat: "MHA Integrated"
    },
    {
      id: 5,
      title: "3D Fraud Network Mapping",
      description: "Traces shell structures, mule tier transactions, and offshore cryptograms using coordinate-projected visual occlusions.",
      badge: "NEURAL GRAPH",
      color: "border-purple-500/30 text-purple-400 glow-purple",
      stat: "Section 65B Compliant"
    },
    {
      id: 6,
      title: "Geospatial Threat Hotspots",
      description: "Ingests localized data feeds and generates concentric heat indicators mapping crime vectors in Jamtara and Mewat hub sectors.",
      badge: "GEOSPATIAL INTEL",
      color: "border-amber-500/30 text-amber-400 glow-amber",
      stat: "Real-time Sweep"
    }
  ];

  const steps = [
    { label: "Citizen Report", detail: "Scam log, phone capture, or banknote filed by citizen", icon: <Sliders className="w-4 h-4 text-emerald-400" /> },
    { label: "Vision AI Scanner", detail: "OCR, fluorescent inspection, and file artifact parsing", icon: <Eye className="w-4 h-4 text-blue-400" /> },
    { label: "Gemini Model Audit", detail: "Deep semantic reasoning, intent mapping, translation", icon: <Cpu className="w-4 h-4 text-cyan-400" /> },
    { label: "Threat Engine Engine", detail: "Cross-checks active offender database & IP gateway logs", icon: <Terminal className="w-4 h-4 text-purple-400" /> },
    { label: "Admissible Evidence Brief", detail: "Compiling section 65B legal metadata structures", icon: <Shield className="w-4 h-4 text-indigo-400" /> },
    { label: "Police Dashboard Hub", detail: "Active telemetry dispatch pushed to Cyber Cell Division", icon: <Layers className="w-4 h-4 text-rose-400" /> },
    { label: "Action Dispatch", detail: "Investigator deployment to secure local hub nodes", icon: <Navigation className="w-4 h-4 text-amber-400" /> }
  ];

  return (
    <div 
      className="min-h-screen bg-[#020408] text-slate-100 font-sans relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white"
      onMouseMove={handleMouseMove}
    >
      
      {/* 3D Immersive Floating Space/Earth Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas ref={heroCanvasRef} className="w-full h-full block" />
      </div>

      {/* Futuristic Header bar */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-900/60 bg-slate-950/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 rounded-xl p-2.5 flex items-center justify-center text-white shadow-lg shadow-blue-500/40 glow-blue">
            <Shield className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold block">Ministry of Home Affairs</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold">AEGIS DEFENSE SUITE</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-5 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> SYS STATUS: NOMINAL</span>
            <span>SECURE-LINK: ACTIVED</span>
            {geminiAvailable ? (
              <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-bold">GEMINI 2.0 CONNECTED</span>
            ) : (
              <span className="text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-bold">OFFLINE SANDBOX MODE</span>
            )}
          </div>

          <button
            onClick={() => setShowAuthOverlay(true)}
            className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-mono font-bold text-[11px] px-4 py-2 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-950/20 tracking-wider uppercase transition-all duration-200 cursor-pointer glow-blue"
          >
            Access Portal
          </button>
        </div>
      </header>

      {/* Main Hero Container */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Headline & Epic Description (7 cols) */}
        <div className="lg:col-span-7 space-y-8 pr-4">
          
          {/* Animated Banner badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[10px] font-bold uppercase tracking-wider animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            National Digital Public Safety Infrastructure
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              Protect Citizens.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">Empower Law Enforcement.</span><br />
              Stop Cyber Crime.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
              AI-powered intelligence platform that detects extortion scams, counterfeit currency, cyber fraud networks, and emerging digital threats using multimodal AI, geospatial intelligence, and real-time analytics.
            </p>
          </div>

          {/* Interactive Cinematic Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setShowAuthOverlay(true)}
              className="group relative bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-mono font-bold text-xs px-6 py-3.5 rounded-xl border border-blue-400/30 shadow-2xl shadow-blue-500/20 tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-all overflow-hidden"
            >
              <span className="relative z-10">Explore Platform</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 relative z-10" />
              {/* Premium sweep light animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>

            <button
              onClick={() => setShowDemoModal(true)}
              className="group flex items-center gap-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 font-mono font-bold text-xs px-6 py-3.5 rounded-xl tracking-wider uppercase cursor-pointer transition-all shadow-lg"
            >
              <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20 group-hover:scale-110 transition-transform" />
              Watch Live Demo
            </button>
          </div>

          {/* Real-time Incident Ticker Log */}
          <div className="bg-[#030712]/75 border border-slate-800/80 rounded-xl p-4 max-w-xl shadow-2xl backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-[10px] font-mono text-blue-400 font-extrabold tracking-widest uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Live Ingestion Core Feed
              </span>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ONLINE
              </span>
            </div>
            <div className="space-y-1.5 h-20 overflow-hidden text-[10px] font-mono text-slate-400">
              {liveThreatLogs.map((log, index) => (
                <div key={index} className="truncate border-l border-blue-500/20 pl-2.5 py-0.5 leading-relaxed hover:text-white transition-colors">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Immersive Floating Holographic HUD Panels (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 relative">
          
          {/* Subtle parallax background grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

          {/* 1. Holographic Threat Matrix HUD Panel */}
          <div className="glass rounded-2xl border border-blue-500/20 bg-slate-950/60 p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Ambient Corner light decorations */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-cyan-500/10 to-transparent" />

            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Holographic Threat Matrix</span>
              </div>
              <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                LEVEL: CRITICAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Metric 1 */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase">NATIONAL THREAT SCORE</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-slate-200">84.2%</span>
                  <span className="text-[9px] font-mono text-rose-500 font-bold">↑ 4.1%</span>
                </div>
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: "84.2%" }} />
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase">AI REASONING CONFIDENCE</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-emerald-400">98.9%</span>
                  <span className="text-[9px] font-mono text-emerald-500 font-bold">STABLE</span>
                </div>
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: "98.9%" }} />
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase">ACTIVE SCAM CLASSIFIERS</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold font-mono text-slate-200">12,410 / SEC</span>
                </div>
                <span className="text-[8px] font-mono text-slate-600 block">MULTILINGUAL SPEECH INGESTION</span>
              </div>

              {/* Metric 4 */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase">FICN DISCREPANCY SCORE</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold font-mono text-indigo-400">0.03% SEIZURE</span>
                </div>
                <span className="text-[8px] font-mono text-slate-600 block">RBI FORENSICS COMPLIANT</span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>SATLINK IP CORE: SECURE-99X</span>
              <span className="text-blue-400 font-bold">120 FPS NOMINAL</span>
            </div>
          </div>

          {/* 2. Compact Live Threat Log Widget */}
          <div className="glass rounded-xl border border-slate-800 bg-slate-950/40 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">Platform Telemetry Signals</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5 font-mono text-[9px] text-slate-400 text-center">
              <div className="bg-[#050811] p-2 rounded border border-slate-900">
                <span className="text-slate-500 block">DELHI NCR</span>
                <span className="font-bold text-slate-200">74 ACTIVE</span>
              </div>
              <div className="bg-[#050811] p-2 rounded border border-slate-900">
                <span className="text-slate-500 block">JAMTARA</span>
                <span className="font-bold text-rose-400">145 ALERT</span>
              </div>
              <div className="bg-[#050811] p-2 rounded border border-slate-900">
                <span className="text-slate-500 block">MEWAT REGION</span>
                <span className="font-bold text-rose-400">89 CRIT</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Section 2: Capability Showcase */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] font-bold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            Capabilities & Modules
          </div>
          <h2 className="text-3xl font-black font-display tracking-tight text-white sm:text-4xl">
            National Cyber Intelligence Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Modular multi-tier technology suite designed to defend public sector channels and equip intelligence bureaus with real-time analytics.
          </p>
        </div>

        {/* Dynamic Bento Style Grid for Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className={`glass rounded-2xl p-6 border bg-slate-950/40 relative overflow-hidden group hover:bg-slate-950/60 transition-all duration-300 hover:-translate-y-1.5 shadow-lg ${cap.color}`}
              onMouseEnter={() => setHoveredCardId(cap.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              {/* Corner decoration lines */}
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-slate-800 group-hover:border-blue-500/40 transition-colors" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-slate-800 group-hover:border-blue-500/40 transition-colors" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                    {cap.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{cap.stat}</span>
                </div>

                <h3 className="text-md font-bold font-display text-slate-100 group-hover:text-white transition-colors">
                  {cap.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {cap.description}
                </p>

                <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Activate Terminal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: AI Workflow Interactive Pipeline */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900 bg-slate-950/20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] font-bold uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            Threat Response Pipeline
          </div>
          <h2 className="text-3xl font-black font-display tracking-tight text-white sm:text-4xl">
            Real-time Threat Mitigation Logic
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Flow map of how public safety reports are ingested, verified by multimodal vision/reasoning models, and compiled into court evidence.
          </p>
        </div>

        {/* Interactive Timeline Pipeline Row */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 relative">
          
          {/* Timeline background connecting row lines */}
          <div className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-rose-500/20 z-0" />

          {steps.map((step, idx) => {
            const isActive = activeWorkflowStep === idx;
            return (
              <div 
                key={idx}
                className={`relative z-10 glass rounded-xl p-4 border text-center transition-all duration-300 ${
                  isActive 
                    ? 'border-blue-500/80 bg-blue-950/20 scale-105 shadow-xl shadow-blue-950/30' 
                    : 'border-slate-800/80 bg-slate-950/60 opacity-60'
                }`}
              >
                {/* Node indicator dot */}
                <div className={`w-8 h-8 rounded-full mx-auto mb-3.5 flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg glow-blue' 
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  {step.icon}
                </div>

                <h3 className="text-xs font-bold font-mono text-slate-200 mb-1 truncate">{step.label}</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans max-h-12 overflow-hidden">{step.detail}</p>
                
                {/* Flow pointer arrow */}
                {idx < steps.length - 1 && (
                  <div className="lg:hidden mt-2 text-slate-600 flex justify-center">↓</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 5: Platform Statistics (Count Up Simulation) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-y border-slate-900 bg-slate-950/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          
          <div className="space-y-1.5">
            <span className="text-3xl sm:text-4.5xl font-black font-mono text-blue-400 block tracking-tight">
              {stats.threats.toLocaleString()}+
            </span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              THREATS ANALYZED
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-3xl sm:text-4.5xl font-black font-mono text-emerald-400 block tracking-tight">
              {stats.accuracy}%
            </span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              DETECTION ACCURACY
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-3xl sm:text-4.5xl font-black font-mono text-purple-400 block tracking-tight">
              {stats.monitoring}
            </span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              REAL-TIME MONITORING
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-3xl sm:text-4.5xl font-black font-mono text-cyan-400 block tracking-tight">
              {stats.protected.toLocaleString()}+
            </span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              CITIZENS PROTECTED
            </span>
          </div>

        </div>
      </section>

      {/* Section 6: Dashboard Mockup Preview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-b border-slate-900 text-center">
        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] font-bold uppercase tracking-widest">
            <Sliders className="w-3.5 h-3.5" />
            OPERATIONAL PREVIEW
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight sm:text-4xl">
            Next-Gen Command Suite Terminal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Unified command dashboard enabling national safety regulators to track geographical threat vectors and compile court admissible briefs seamlessly.
          </p>
        </div>

        {/* Dashboard 3D Perspective Tilt Wrapper */}
        <div className="relative group/mockup max-w-5xl mx-auto">
          {/* Glass back glows */}
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/15 to-purple-500/10 blur-xl opacity-80 group-hover/mockup:opacity-100 transition-opacity" />
          
          <div className="relative glass border border-slate-800 rounded-2xl bg-slate-950/85 overflow-hidden shadow-2xl transition-all duration-500 group-hover/mockup:scale-[1.01] group-hover/mockup:border-blue-500/30">
            {/* Mock Header */}
            <div className="bg-[#030712] border-b border-slate-900 px-4 py-3 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">AEGIS TERMINAL v2.8</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span>MHA SECURE GATEWAY</span>
                <span>ENC: AES-256</span>
              </div>
            </div>

            {/* Simulated UI grids */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 text-left">
              {/* Left panel simulated */}
              <div className="md:col-span-8 bg-[#040914] border border-slate-900 rounded-xl p-4 h-96 relative flex flex-col justify-between">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="flex justify-between items-center z-10">
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Geospatial Alert Matrix
                  </span>
                  <span className="text-[8px] font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-500 border border-slate-850">SEC: MEWAT_SECTOR_10</span>
                </div>

                {/* Simulated geographic pins */}
                <div className="flex-1 flex items-center justify-center relative">
                  {/* Glowing central target circle */}
                  <div className="w-32 h-32 rounded-full border border-rose-500/25 flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 rounded-full border border-rose-500/40 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-rose-500 glow-red animate-ping" />
                    </div>
                  </div>
                  <div className="absolute top-10 left-12 text-[9px] font-mono text-slate-500">
                    <span className="text-rose-400 block font-bold">• Mewat Cyber Hub</span>
                    <span>88% Threat Density</span>
                  </div>
                  <div className="absolute bottom-10 right-12 text-[9px] font-mono text-slate-500">
                    <span className="text-emerald-400 block font-bold">• Jamtara Sector</span>
                    <span>95% Isolated</span>
                  </div>
                </div>

                <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-900 z-10">
                  <span>SWEEP SPEED: 3.5s / LOOP</span>
                  <span className="text-blue-400">SATLINK FEED: NOMINAL</span>
                </div>
              </div>

              {/* Right panel simulated details */}
              <div className="md:col-span-4 bg-[#040914] border border-slate-900 rounded-xl p-4 flex flex-col justify-between text-xs text-slate-300">
                <div className="space-y-4">
                  <div className="border-b border-slate-900 pb-2.5">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">INCIDENT FILE</span>
                    <span className="font-bold text-slate-100 font-display">FedEx Custody Extortion Call</span>
                  </div>

                  <div className="space-y-2 font-mono text-[10px]">
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">SEVERITY:</span>
                      <span className="text-rose-400 font-bold">CRITICAL</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">DENOMINATION:</span>
                      <span className="text-slate-300 font-bold">₹15,20,000</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">OUTGOING CLI:</span>
                      <span className="text-blue-400 font-bold">+91 99532 VoIP</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">RECOMMENDED PROTOCOL</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans bg-slate-950 p-2.5 rounded border border-slate-900">
                      Generate Court Section 65B forensics ledger certificate and dispatch sector tactical units immediately.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAuthOverlay(true)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-[10px] py-2.5 rounded-lg text-center cursor-pointer transition-colors uppercase tracking-wider block"
                >
                  ENTER LIVE TERMINAL WORKSPACE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Technology Stack Floating Bubble Arena */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-b border-slate-900 bg-transparent text-center">
        <div className="max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] font-bold uppercase tracking-widest">
            <Sliders className="w-3.5 h-3.5" />
            PLATFORM ARCHITECTURE
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight sm:text-4xl">
            Government Grade Technical Foundations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Engineered using resilient cloud primitives and high-precision language reasoning modules to ensure persistent security.
          </p>
        </div>

        {/* 3D floating icons represented beautifully as glowing HUD bubbles */}
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {[
            "React 19 Core",
            "TypeScript Strong",
            "Firebase Firestore",
            "Gemini Pro Engine",
            "Node.js Backend",
            "Express Routing",
            "OCR Vision AI",
            "Geospatial Mapping",
            "Sec 65B Forensics"
          ].map((tech, idx) => (
            <div 
              key={idx}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-3 text-xs font-mono font-semibold text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-slate-950 transition-all duration-300 cursor-default shadow-lg flex items-center gap-2 glow-blue"
              style={{
                transform: `translate(${Math.sin(idx + (mousePos.x * 0.2)) * 5}px, ${Math.cos(idx + (mousePos.y * 0.2)) * 5}px)`
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 8: Premium CTA with Neon Glow */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="glass rounded-3xl p-12 border border-blue-500/20 bg-slate-950/70 relative overflow-hidden max-w-4xl mx-auto shadow-2xl glow-blue">
          {/* Earth glow behind */}
          <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="space-y-6 max-w-xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4.5xl font-black font-display tracking-tight text-white leading-tight">
              Join the Future of Public Safety Intelligence.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Enter Aegis Defense Suite to access real-time incident analysis registries, digital arrest classifiers, and court evidence compilers.
            </p>

            <button
              onClick={() => setShowAuthOverlay(true)}
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-mono font-bold text-xs px-8 py-4 rounded-xl border border-blue-400/30 shadow-2xl shadow-blue-500/25 tracking-widest uppercase cursor-pointer transition-all inline-flex items-center gap-2 glow-blue"
            >
              SECURE PLATFORM ENTRY
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Deep Space footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/60 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-500/70" />
            <span>Ministry of Home Affairs | Digital Safety Division</span>
          </div>
          <div className="flex gap-4">
            <span>SECURE GATEWAY</span>
            <span>AES-256</span>
            <span>© 2026 AEGIS CORES</span>
          </div>
        </div>
      </footer>


      {/* ------------------ MODALS & OVERLAYS ------------------ */}

      {/* 1. Cinematic Demo Sandbox Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl glass border border-slate-800 bg-slate-950/90 rounded-2xl overflow-hidden shadow-2xl relative z-10"
            >
              {/* Header */}
              <div className="bg-[#030712] border-b border-slate-900 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-4.5 h-4.5 text-blue-400 fill-blue-400/15" />
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">Aegis Intelligence Simulator</span>
                </div>
                <button 
                  onClick={() => setShowDemoModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-300 font-mono font-bold cursor-pointer"
                >
                  CLOSE
                </button>
              </div>

              {/* Demo Content */}
              <div className="p-6 space-y-4">
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl text-xs text-slate-300 leading-relaxed font-sans">
                  <p className="font-bold text-slate-100 mb-2 flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Interactive Scenario Sandbox
                  </p>
                  To explore the absolute fullness of the application's real-time capabilities:
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-400">
                    <li>
                      <strong>Citizen Shield Sandbox:</strong> Real document upload scanners checking file watermarks.
                    </li>
                    <li>
                      <strong>Investigator Map Telemetry:</strong> Geospatial routing sweeps indicating hotspot sectors like Jamtara.
                    </li>
                    <li>
                      <strong>3D Neural Fraud Network:</strong> Real court-admissible metadata compilers linked to secure ledgers.
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setShowDemoModal(false);
                      setShowAuthOverlay(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-mono font-bold text-[11px] px-5 py-3 rounded-xl border border-blue-500/20 shadow-md shadow-blue-950/20 tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-all"
                  >
                    Enter Live Platform Workspace
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Secure Access Portal (Login Overlay) */}
      <AnimatePresence>
        {showAuthOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 p-2"
            >
              
              {/* Left Side: Aegis security info banner (5 cols) */}
              <div className="md:col-span-5 flex flex-col justify-between p-6 rounded-2xl glass border border-slate-800/80 bg-slate-950/60 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 rounded-xl p-2.5 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-blue-400 font-bold block">Ministry of Home Affairs</span>
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Government of India</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h1 className="font-display text-lg font-black text-slate-100 tracking-tight leading-snug">
                      AEGIS ADVANCED SECURE LOGIN GATEWAY
                    </h1>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Authorized governmental personnel and citizens, please select your sector key portal below to authenticate secure sessions.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] font-bold uppercase">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Defensive Roles</span>
                    </div>
                    <ul className="space-y-1.5 text-[10px] text-slate-400 font-sans">
                      <li>• <strong>MHA Admins:</strong> Live central registry CRUD authorization.</li>
                      <li>• <strong>I4C Police:</strong> Threat coordinate maps & network briefs.</li>
                      <li>• <strong>Citizens:</strong> Extortion parsing, currency checks.</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setShowAuthOverlay(false)}
                    className="w-full text-center text-[10px] text-slate-500 hover:text-slate-300 font-mono font-bold border border-slate-900 hover:border-slate-800 rounded-lg py-2 cursor-pointer transition-colors"
                  >
                    RETURN TO LANDING PAGE
                  </button>
                </div>
              </div>

              {/* Right Side: Quick Portal Select and Manual login form (7 cols) */}
              <div className="md:col-span-7 flex flex-col justify-between p-6 md:p-8 rounded-2xl glass border border-slate-800 bg-slate-950/80 shadow-2xl">
                <div>
                  <div className="border-b border-slate-900 pb-4 mb-5 flex justify-between items-center">
                    <div>
                      <h2 className="text-sm font-display font-bold text-slate-200">
                        Choose Central Access Portal
                      </h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Authenticates matching section clearance level automatically.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowAuthOverlay(false)} 
                      className="text-[10px] text-slate-500 hover:text-slate-300 font-mono font-bold cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>

                  {loginError && (
                    <div className="bg-rose-950/20 border border-rose-500/30 text-rose-400 px-4 py-2.5 rounded-lg text-[10px] font-mono mb-4 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Quick Access Portals */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider block">
                      Direct Secure Access (Select to Enter)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickLogin('ADMIN')}
                        className="bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 hover:border-rose-500/40 p-3 rounded-xl text-rose-400 text-xs text-left font-semibold flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      >
                        <span className="text-[8px] font-mono text-rose-500 block">MHA ROLE</span>
                        <span className="mt-1 flex items-center justify-between w-full font-mono text-[11px]">
                          <span>Admin Central</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickLogin('POLICE')}
                        className="bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 hover:border-blue-500/40 p-3 rounded-xl text-blue-400 text-xs text-left font-semibold flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      >
                        <span className="text-[8px] font-mono text-blue-500 block">IPS ROLE</span>
                        <span className="mt-1 flex items-center justify-between w-full font-mono text-[11px]">
                          <span>I4C Investigator</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickLogin('CITIZEN')}
                        className="bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 hover:border-emerald-500/40 p-3 rounded-xl text-emerald-400 text-xs text-left font-semibold flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      >
                        <span className="text-[8px] font-mono text-emerald-500 block">CIVIL ROLE</span>
                        <span className="mt-1 flex items-center justify-between w-full font-mono text-[11px]">
                          <span>Citizen Shield</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative flex py-2 items-center mb-4">
                    <div className="flex-grow border-t border-slate-900" />
                    <span className="flex-shrink mx-3 text-[8.5px] font-mono text-slate-600 uppercase">Or log in manually</span>
                    <div className="flex-grow border-t border-slate-900" />
                  </div>

                  {/* Manual Form */}
                  <form onSubmit={handleManualLogin} className="space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-slate-500 font-mono uppercase block">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="admin, police, or citizen"
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 text-xs outline-none focus:border-blue-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] text-slate-500 font-mono uppercase block">Secure Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required={username.trim().toLowerCase() !== 'citizen'}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-3 pr-10 text-slate-200 text-xs outline-none focus:border-blue-500/50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2 text-slate-500 hover:text-slate-300"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-mono font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all text-xs tracking-wider uppercase shadow-lg"
                    >
                      {loginLoading ? 'Authenticating Secure Layers...' : 'Sign In To Secure Workspace'}
                    </button>
                  </form>
                </div>

                {/* Pre-configured access info footer */}
                <div className="mt-5 p-3 bg-slate-950/60 border border-slate-900 rounded-lg text-[9px] text-slate-500 font-mono space-y-1 text-left">
                  <span className="text-slate-400 uppercase font-bold block">🔑 Pre-Configured Secure Passcodes:</span>
                  <div className="grid grid-cols-3 gap-1 pt-0.5">
                    <span>Admin: <strong className="text-slate-300">admin</strong> / password</span>
                    <span>Police: <strong className="text-slate-300">police</strong> / password</span>
                    <span>Citizen: <strong className="text-slate-300">citizen</strong> (no password)</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
