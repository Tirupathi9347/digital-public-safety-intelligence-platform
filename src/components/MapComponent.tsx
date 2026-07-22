import React, { useState, useEffect, useRef } from 'react';
import { GeoIncident } from '../types';
import { 
  MapPin, 
  Navigation, 
  Shield, 
  Layers, 
  HelpCircle, 
  Send, 
  AlertTriangle, 
  Compass, 
  Zap, 
  Activity, 
  Radio,
  RotateCw,
  Maximize2,
  Search
} from 'lucide-react';

interface MapComponentProps {
  incidents: GeoIncident[];
  onDispatch: (incidentId: string, assignedUnit: string) => void;
  onReportNewIncident: (report: Partial<GeoIncident>) => void;
  onUpdateIncident?: (updated: GeoIncident) => void;
  loading: boolean;
}

export default function MapComponent({ incidents, onDispatch, onReportNewIncident, onUpdateIncident, loading }: MapComponentProps) {
  const [selectedIncident, setSelectedIncident] = useState<GeoIncident | null>(null);
  const [assignedUnitInput, setAssignedUnitInput] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom interactive map toggles
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showRadarSweep, setShowRadarSweep] = useState<boolean>(true);
  const [hazardRange, setHazardRange] = useState<number>(120); // visual slider (50 - 250px)

  // Quick Report Form state
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState<'digital_arrest' | 'counterfeit_currency' | 'money_mule' | 'cyber_fraud'>('digital_arrest');
  const [reportTitle, setReportTitle] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  const [reportAmount, setReportAmount] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // 3D Orbit Camera States (Stored in refs for fast performance, synced to state for HUD)
  const cameraRef = useRef({
    yaw: -0.3,
    pitch: 0.6,
    zoom: 1.15,
    isDragging: false,
    startX: 0,
    startY: 0,
    targetYaw: -0.3,
    targetPitch: 0.6
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Indian Cyber Security Hub Coordinate map relative to SVG ViewBox 800 x 600
  const hubCoordinates: Record<string, { x: number; y: number; threatIndex: string; density: string }> = {
    "Mewat Sector, Haryana": { x: 390, y: 160, threatIndex: "CRITICAL", density: "88%" },
    "Delhi NCR": { x: 390, y: 140, threatIndex: "HIGH", density: "74%" },
    "Jamtara, Jharkhand": { x: 520, y: 230, threatIndex: "CRITICAL", density: "95%" },
    "Kolkata Border, West Bengal": { x: 550, y: 250, threatIndex: "HIGH", density: "81%" },
    "Ahmedabad, Gujarat": { x: 260, y: 215, threatIndex: "MEDIUM", density: "62%" },
    "Mumbai, Maharashtra": { x: 290, y: 320, threatIndex: "HIGH", density: "79%" },
    "Bengaluru, Karnataka": { x: 370, y: 440, threatIndex: "MEDIUM", density: "55%" }
  };

  const indiaPoints2D = [
    [380,80], [400,90], [420,110], [440,115], [460,110], [470,140], [450,160], [490,170], [510,180], [520,200], [550,210], [580,215], [590,230], [590,245], [570,250], [560,260], [570,280], [550,290], [530,290], [510,310], [500,340], [470,360], [480,380], [490,410], [470,440], [440,490], [420,520], [400,560], [395,570], [390,560], [385,530], [380,500], [370,470], [350,440], [340,410], [330,390], [310,380], [300,350], [290,320], [280,310], [250,300], [240,280], [235,260], [240,240], [260,230], [270,200], [280,180], [310,160], [320,130], [350,110]
  ];

  const getIncidentCoords = (incident: GeoIncident) => {
    if (hubCoordinates[incident.location]) {
      return hubCoordinates[incident.location];
    }
    const hash = incident.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const x = 200 + (hash % 400);
    const y = 150 + ((hash * 7) % 300);
    return { x, y };
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesType = filterType === 'all' || inc.type === filterType;
    const matchesSearch = searchQuery === '' || 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesType || !matchesSearch) return false;
    if (selectedState === 'ALL') return true;
    
    const locationUpper = inc.location.toUpperCase();
    const stateUpper = selectedState.toUpperCase();
    return (locationUpper.includes(stateUpper) || (selectedState === 'DELHI' && locationUpper.includes('DELHI')));
  });

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !assignedUnitInput.trim()) return;
    onDispatch(selectedIncident.id, assignedUnitInput);
    
    setSelectedIncident({
      ...selectedIncident,
      status: 'DISPATCHED',
      assignedUnit: assignedUnitInput
    });
    setAssignedUnitInput('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportLocation.trim()) return;
    onReportNewIncident({
      type: reportType,
      title: reportTitle,
      location: reportLocation,
      details: reportDetails,
      involvedAmount: reportAmount || '₹0',
    });

    setReportTitle('');
    setReportLocation('');
    setReportAmount('');
    setReportDetails('');
    setShowReportForm(false);
  };

  // Draggable Orbit Interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    cameraRef.current.isDragging = true;
    cameraRef.current.startX = e.clientX;
    cameraRef.current.startY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cameraRef.current.isDragging) return;
    const deltaX = e.clientX - cameraRef.current.startX;
    const deltaY = e.clientY - cameraRef.current.startY;
    
    cameraRef.current.targetYaw = cameraRef.current.targetYaw + deltaX * 0.007;
    cameraRef.current.targetPitch = Math.min(1.2, Math.max(0.1, cameraRef.current.targetPitch + deltaY * 0.007));
    
    cameraRef.current.startX = e.clientX;
    cameraRef.current.startY = e.clientY;
  };

  const handleMouseUp = () => {
    cameraRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    cameraRef.current.zoom = Math.min(2.5, Math.max(0.4, cameraRef.current.zoom - e.deltaY * 0.001));
  };

  // Reset Camera angle
  const handleResetCamera = () => {
    cameraRef.current.targetYaw = -0.3;
    cameraRef.current.targetPitch = 0.6;
    cameraRef.current.zoom = 1.15;
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    
    if (state === 'ALL') {
      cameraRef.current.targetYaw = -0.3;
      cameraRef.current.targetPitch = 0.6;
      cameraRef.current.zoom = 1.15;
    } else if (state === 'HARYANA') {
      cameraRef.current.targetYaw = -0.25;
      cameraRef.current.targetPitch = 0.45;
      cameraRef.current.zoom = 1.6;
    } else if (state === 'DELHI') {
      cameraRef.current.targetYaw = -0.1;
      cameraRef.current.targetPitch = 0.45;
      cameraRef.current.zoom = 1.75;
    } else if (state === 'JHARKHAND') {
      cameraRef.current.targetYaw = -0.55;
      cameraRef.current.targetPitch = 0.52;
      cameraRef.current.zoom = 1.65;
    } else if (state === 'WEST BENGAL') {
      cameraRef.current.targetYaw = -0.7;
      cameraRef.current.targetPitch = 0.55;
      cameraRef.current.zoom = 1.65;
    } else if (state === 'GUJARAT') {
      cameraRef.current.targetYaw = 0.35;
      cameraRef.current.targetPitch = 0.5;
      cameraRef.current.zoom = 1.6;
    } else if (state === 'MAHARASHTRA') {
      cameraRef.current.targetYaw = 0.25;
      cameraRef.current.targetPitch = 0.65;
      cameraRef.current.zoom = 1.55;
    } else if (state === 'KARNATAKA') {
      cameraRef.current.targetYaw = -0.05;
      cameraRef.current.targetPitch = 0.75;
      cameraRef.current.zoom = 1.7;
    }
  };

  const filteredIncidentsRef = useRef(filteredIncidents);
  const selectedIncidentRef = useRef(selectedIncident);
  const hazardRangeRef = useRef(hazardRange);
  const showRadarSweepRef = useRef(showRadarSweep);

  useEffect(() => {
    filteredIncidentsRef.current = filteredIncidents;
  }, [filteredIncidents]);

  useEffect(() => {
    selectedIncidentRef.current = selectedIncident;
  }, [selectedIncident]);

  useEffect(() => {
    hazardRangeRef.current = hazardRange;
  }, [hazardRange]);

  useEffect(() => {
    showRadarSweepRef.current = showRadarSweep;
  }, [showRadarSweep]);

  // State to hold hovered node info
  const [hoveredNode, setHoveredNode] = useState<{ name: string; x: number; y: number; index?: string } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localHoverNode: any = null;

    // 3D Trajectory curve particles
    const particles: Array<{
      progress: number;
      speed: number;
      source: { x: number; y: number; z: number };
      target: { x: number; y: number; z: number };
      color: string;
    }> = [];

    // Trigger threat arcs occasionally
    const lastArcSpawn = { current: 0 };

    const animate = (time: number) => {
      // Smoothly interpolate camera transitions
      cameraRef.current.yaw += (cameraRef.current.targetYaw - cameraRef.current.yaw) * 0.1;
      cameraRef.current.pitch += (cameraRef.current.targetPitch - cameraRef.current.pitch) * 0.1;

      // Update HUD values once in a while directly via DOM to bypass re-renders
      const yawVal = Math.round(cameraRef.current.yaw * 180 / Math.PI);
      const pitchVal = Math.round(cameraRef.current.pitch * 180 / Math.PI);
      const yawEl = document.getElementById('map-hud-yaw');
      const pitchEl = document.getElementById('map-hud-pitch');
      if (yawEl) yawEl.textContent = `YAW_COORD: ${yawVal}°`;
      if (pitchEl) pitchEl.textContent = `PITCH_TILT: ${pitchVal}°`;

      // Read values from refs to keep the loop independent of state updates
      const filteredIncidents = filteredIncidentsRef.current;
      const selectedIncident = selectedIncidentRef.current;
      const hazardRange = hazardRangeRef.current;
      const showRadarSweep = showRadarSweepRef.current;

      // Fixed internal resolution to prevent collapse and feedback loop issues
      const rect = canvas.getBoundingClientRect();
      const w = 1200;
      const h = 900;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.clearRect(0, 0, w, h);

      // Camera parameters
      const yaw = cameraRef.current.yaw;
      const pitch = cameraRef.current.pitch;
      const zoom = cameraRef.current.zoom;

      // Projection Helper
      const project3D = (vx: number, vy: number, vz: number) => {
        const cx = w / 2;
        const cy = h / 2;
        const scaleMultiplier = Math.min(w / 800, h / 600) * 1.45;

        // Scale coordinates
        const sx = vx * scaleMultiplier;
        const sy = vy * scaleMultiplier;
        const sz = vz * scaleMultiplier;

        // Yaw Y-Rotation
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const x1 = sx * cosY - sz * sinY;
        const z1 = sx * sinY + sz * cosY;

        // Pitch X-Rotation
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        const y2 = sy * cosP - z1 * sinP;
        const z2 = sy * sinP + z1 * cosP;

        // Distance & perspective projection factor
        const distance = 650;
        const denominator = distance + z2;
        const scaleFactor = denominator > 20 ? distance / denominator : 0;
        const screenX = cx + x1 * scaleFactor * zoom;
        const screenY = cy + y2 * scaleFactor * zoom;

        return { x: screenX, y: screenY, depth: z2, scale: scaleFactor };
      };

      // 1. Draw Starfield background / floating dots
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      for (let i = 0; i < 30; i++) {
        const theta = (i * 12 + time * 0.0001) % (Math.PI * 2);
        const phi = (i * 27) % Math.PI;
        const r = 220 + (i * 5) % 80;
        const sx = r * Math.sin(phi) * Math.cos(theta);
        const sy = -60 + r * Math.cos(phi);
        const sz = r * Math.sin(phi) * Math.sin(theta);

        const p = project3D(sx, sy, sz);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, 1.2 * p.scale), 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Floor Reference Grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
      ctx.lineWidth = 1;
      const gridSize = 320;
      const gridCount = 10;
      for (let i = 0; i <= gridCount; i++) {
        const ratio = (i / gridCount) - 0.5;
        const pos = ratio * gridSize;

        // Parallel to X axis
        const p1 = project3D(-gridSize / 2, 45, pos);
        const p2 = project3D(gridSize / 2, 45, pos);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Parallel to Z axis
        const p3 = project3D(pos, 45, -gridSize / 2);
        const p4 = project3D(pos, 45, gridSize / 2);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // Convert SVG border path coordinates
      const borderTop3D = indiaPoints2D.map(([x, y]) => ({ x: x - 400, y: -15, z: y - 300 }));
      const borderBottom3D = indiaPoints2D.map(([x, y]) => ({ x: x - 400, y: 15, z: y - 300 }));

      // 3. Draw extruded India 3D hologram base
      // Draw bottom face fill
      ctx.fillStyle = 'rgba(10, 18, 36, 0.5)';
      ctx.beginPath();
      borderBottom3D.forEach((pt, idx) => {
        const p = project3D(pt.x, pt.y, pt.z);
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();

      // Draw top face fill (semi-transparent tech mesh)
      ctx.fillStyle = 'rgba(15, 32, 67, 0.45)';
      ctx.beginPath();
      borderTop3D.forEach((pt, idx) => {
        const p = project3D(pt.x, pt.y, pt.z);
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();

      // Draw vertical extruded connection bars (to make it a solid block)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)';
      ctx.lineWidth = 1;
      for (let i = 0; i < borderTop3D.length; i += 2) {
        const pTop = project3D(borderTop3D[i].x, borderTop3D[i].y, borderTop3D[i].z);
        const pBot = project3D(borderBottom3D[i].x, borderBottom3D[i].y, borderBottom3D[i].z);
        ctx.beginPath();
        ctx.moveTo(pTop.x, pTop.y);
        ctx.lineTo(pBot.x, pBot.y);
        ctx.stroke();
      }

      // Draw bottom wireframe contour
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      borderBottom3D.forEach((pt, idx) => {
        const p = project3D(pt.x, pt.y, pt.z);
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.stroke();

      // Draw top wireframe contour with glowing cyan cyber style
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.65)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      borderTop3D.forEach((pt, idx) => {
        const p = project3D(pt.x, pt.y, pt.z);
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.stroke();

      // 4. Draw static cities / hub pillars
      Object.entries(hubCoordinates).forEach(([name, coords]) => {
        const x3d = coords.x - 400;
        const z3d = coords.y - 300;
        
        const pBase = project3D(x3d, 15, z3d);
        const pTop = project3D(x3d, -15, z3d);

        // Check if there are any active incidents in this hub
        const activeIncidentsInHub = filteredIncidents.some(inc => {
          const incLoc = inc.location.toLowerCase();
          const hubLoc = name.toLowerCase();
          const keyTerms = ["mewat", "delhi", "jamtara", "kolkata", "ahmedabad", "mumbai", "bengaluru"];
          const matchingTerm = keyTerms.find(term => hubLoc.includes(term) && incLoc.includes(term));
          return matchingTerm ? (inc.status === 'ACTIVE' || inc.status === 'DISPATCHED') : false;
        });

        const isSafe = !activeIncidentsInHub;

        const isSelectedHub = selectedState !== 'ALL' && (
          name.toUpperCase().includes(selectedState.toUpperCase()) ||
          (selectedState === 'DELHI' && name.toUpperCase().includes('DELHI'))
        );

        if (isSelectedHub) {
          // 1. Draw a powerful, glowing vertical light beacon / beam
          const gradient = ctx.createLinearGradient(pBase.x, pBase.y, pTop.x, pTop.y - 120 * pTop.scale);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.05)');
          gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.5)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(pBase.x - 12 * pBase.scale, pBase.y);
          ctx.lineTo(pTop.x - 4 * pTop.scale, pTop.y - 120 * pTop.scale);
          ctx.lineTo(pTop.x + 4 * pTop.scale, pTop.y - 120 * pTop.scale);
          ctx.lineTo(pBase.x + 12 * pBase.scale, pBase.y);
          ctx.closePath();
          ctx.fill();

          // 2. Draw pulsing, glowing locator concentric rings on the ground
          const pulse = (time * 0.0015) % 1;
          ctx.strokeStyle = `rgba(6, 182, 212, ${1 - pulse})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          const steps = 32;
          for (let s = 0; s <= steps; s++) {
            const angle = (s / steps) * Math.PI * 2;
            const rx = x3d + Math.cos(angle) * (30 * pulse);
            const rz = z3d + Math.sin(angle) * (30 * pulse);
            const pRing = project3D(rx, 15, rz);
            if (s === 0) ctx.moveTo(pRing.x, pRing.y);
            else ctx.lineTo(pRing.x, pRing.y);
          }
          ctx.stroke();

          // Another static ring
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let s = 0; s <= steps; s++) {
            const angle = (s / steps) * Math.PI * 2;
            const rx = x3d + Math.cos(angle) * 15;
            const rz = z3d + Math.sin(angle) * 15;
            const pRing = project3D(rx, 15, rz);
            if (s === 0) ctx.moveTo(pRing.x, pRing.y);
            else ctx.lineTo(pRing.x, pRing.y);
          }
          ctx.stroke();
          
          // Crosshairs targeting box / lines
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          // Top-left
          ctx.moveTo(pTop.x - 15, pTop.y - 15);
          ctx.lineTo(pTop.x - 5, pTop.y - 15);
          ctx.lineTo(pTop.x - 15, pTop.y - 5);
          // Top-right
          ctx.moveTo(pTop.x + 15, pTop.y - 15);
          ctx.lineTo(pTop.x + 5, pTop.y - 15);
          ctx.lineTo(pTop.x + 15, pTop.y - 5);
          // Bottom-left
          ctx.moveTo(pTop.x - 15, pTop.y + 15);
          ctx.lineTo(pTop.x - 5, pTop.y + 15);
          ctx.lineTo(pTop.x - 15, pTop.y + 5);
          // Bottom-right
          ctx.moveTo(pTop.x + 15, pTop.y + 15);
          ctx.lineTo(pTop.x + 5, pTop.y + 15);
          ctx.lineTo(pTop.x + 15, pTop.y + 5);
          ctx.stroke();
        }

        // Draw vertical pillar core
        ctx.strokeStyle = isSelectedHub 
          ? 'rgba(34, 211, 238, 0.8)' 
          : (isSafe 
              ? 'rgba(16, 185, 129, 0.35)' 
              : (coords.threatIndex === "CRITICAL" ? 'rgba(244, 63, 94, 0.35)' : 'rgba(234, 179, 8, 0.35)'));
        ctx.lineWidth = isSelectedHub ? 2 : 1.2;
        ctx.beginPath();
        ctx.moveTo(pBase.x, pBase.y);
        ctx.lineTo(pTop.x, pTop.y);
        ctx.stroke();

        // Top node cap
        ctx.fillStyle = isSelectedHub 
          ? '#22d3ee' 
          : (isSafe 
              ? '#10b981' 
              : (coords.threatIndex === "CRITICAL" ? '#f43f5e' : '#eab308'));
        ctx.beginPath();
        ctx.arc(pTop.x, pTop.y, Math.max(0, (isSelectedHub ? 5 : 3) * pTop.scale), 0, Math.PI * 2);
        ctx.fill();

        // Aligned display label on map
        let displayLabel = "";
        if (name.includes("Mewat")) displayLabel = "HARYANA (MEWAT)";
        else if (name.includes("Delhi")) displayLabel = "DELHI NCR";
        else if (name.includes("Jamtara")) displayLabel = "JHARKHAND (JAMTARA)";
        else if (name.includes("Kolkata")) displayLabel = "WEST BENGAL (KOLKATA)";
        else if (name.includes("Ahmedabad")) displayLabel = "GUJARAT (AHMEDABAD)";
        else if (name.includes("Mumbai")) displayLabel = "MAHARASHTRA (MUMBAI)";
        else if (name.includes("Bengaluru")) displayLabel = "KARNATAKA (BENGALURU)";
        else displayLabel = name.toUpperCase();

        // Draw the text billboard
        ctx.fillStyle = isSelectedHub ? '#22d3ee' : 'rgba(203, 213, 225, 0.8)';
        ctx.font = isSelectedHub ? 'bold 15px Fira Code, monospace' : 'bold 13px Fira Code, monospace';
        ctx.textAlign = 'left';

        // Background banner for active selected hub
        if (isSelectedHub) {
          const textWidth = ctx.measureText(displayLabel).width;
          ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
          ctx.fillRect(pTop.x + 6 * pTop.scale, pTop.y - 12 * pTop.scale, textWidth + 10, 20);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
          ctx.lineWidth = 1;
          ctx.strokeRect(pTop.x + 6 * pTop.scale, pTop.y - 12 * pTop.scale, textWidth + 10, 20);
          
          ctx.fillStyle = '#22d3ee';
          ctx.fillText(displayLabel, pTop.x + 11 * pTop.scale, pTop.y + 2 * pTop.scale);
        } else {
          ctx.fillText(displayLabel, pTop.x + 8 * pTop.scale, pTop.y + 4 * pTop.scale);
        }
      });

      // 5. Draw active incident nodes, hazard ranges, and radar sweeps
      let currentHovered: any = null;
      let minDistance = 24; // hover radius

      filteredIncidents.forEach((incident) => {
        const rawCoords = getIncidentCoords(incident);
        const x3d = rawCoords.x - 400;
        const z3d = rawCoords.y - 300;
        const isSelected = selectedIncident?.id === incident.id;

        // Project coordinate
        const pNode = project3D(x3d, -15, z3d);

        // Map colors
        let pinColor = "#f43f5e"; // rose for digital arrest
        if (incident.status === 'RESOLVED') pinColor = "#10b981"; // safe green for resolved cases
        else if (incident.type === 'counterfeit_currency') pinColor = "#eab308"; // yellow
        else if (incident.type === 'money_mule') pinColor = "#3b82f6"; // blue
        else if (incident.type === 'cyber_fraud') pinColor = "#06b6d4"; // cyan

        const isActive = incident.status === 'ACTIVE';

        // Hover tracking
        const canvasMouse = { x: 0, y: 0 };
        // We'll calculate mouse distance from canvas client coordinates
        // Since canvas uses internal dimensions vs CSS scale, normalize coords
        const mouseEventRef = (window as any)._mapCanvasMouse || { x: -9999, y: -9999 };
        const mx = mouseEventRef.x * (canvas.width / rect.width);
        const my = mouseEventRef.y * (canvas.height / rect.height);
        
        const dist = Math.hypot(pNode.x - mx, pNode.y - my);
        if (dist < minDistance) {
          minDistance = dist;
          currentHovered = {
            name: incident.title,
            x: pNode.x / 2,
            y: pNode.y / 2,
            incident
          };
        }

        // Draw 3D projected Concentric Hazard Range (as horizontal circle projection)
        if (isSelected && incident.status !== 'RESOLVED') {
          ctx.strokeStyle = pinColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          // Draw a 3D projected circle flat at y = -15
          const steps = 36;
          for (let s = 0; s <= steps; s++) {
            const angle = (s / steps) * Math.PI * 2;
            const px = x3d + Math.cos(angle) * (hazardRange * 0.7);
            const pz = z3d + Math.sin(angle) * (hazardRange * 0.7);
            const pCirclePt = project3D(px, -15, pz);
            if (s === 0) ctx.moveTo(pCirclePt.x, pCirclePt.y);
            else ctx.lineTo(pCirclePt.x, pCirclePt.y);
          }
          ctx.stroke();

          // Core shading inside hazard zone
          ctx.fillStyle = 'rgba(59, 130, 246, 0.04)';
          ctx.fill();
        }

        // Pulse radar wave ring
        if (isActive) {
          const pulseScale = (time * 0.001) % 1;
          ctx.strokeStyle = pinColor;
          ctx.lineWidth = 1.5 * (1 - pulseScale);
          ctx.beginPath();
          const steps = 24;
          for (let s = 0; s <= steps; s++) {
            const angle = (s / steps) * Math.PI * 2;
            const radius = 10 + pulseScale * 35;
            const px = x3d + Math.cos(angle) * radius;
            const pz = z3d + Math.sin(angle) * radius;
            const pCirclePt = project3D(px, -15, pz);
            if (s === 0) ctx.moveTo(pCirclePt.x, pCirclePt.y);
            else ctx.lineTo(pCirclePt.x, pCirclePt.y);
          }
          ctx.stroke();
        }

        // Draw glowing 3D threat node sphere
        ctx.fillStyle = pinColor;
        ctx.beginPath();
        const nodeSize = isSelected ? 8 : 5;
        ctx.arc(pNode.x, pNode.y, Math.max(0, nodeSize * pNode.scale), 0, Math.PI * 2);
        ctx.fill();

        // Glowing core aura
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();
      });

      // Update hover node state
      localHoverNode = currentHovered;

      // 6. Cyber Attack parabolic trajectories
      if (showRadarSweep && filteredIncidents.length > 1 && time - lastArcSpawn.current > 4000) {
        lastArcSpawn.current = time;
        // Select random sources & targets to paint a flowing cyber attack trajectory
        const sourceIdx = Math.floor(Math.random() * filteredIncidents.length);
        let targetIdx = Math.floor(Math.random() * filteredIncidents.length);
        if (sourceIdx === targetIdx) targetIdx = (targetIdx + 1) % filteredIncidents.length;

        const sCoords = getIncidentCoords(filteredIncidents[sourceIdx]);
        const tCoords = getIncidentCoords(filteredIncidents[targetIdx]);

        particles.push({
          progress: 0,
          speed: 0.006 + Math.random() * 0.004,
          source: { x: sCoords.x - 400, y: -15, z: sCoords.y - 300 },
          target: { x: tCoords.x - 400, y: -15, z: tCoords.y - 300 },
          color: sourceIdx % 2 === 0 ? 'rgba(6, 182, 212, 0.8)' : 'rgba(244, 63, 94, 0.8)'
        });
      }

      // Animate flowing trajectory arcs
      ctx.lineWidth = 1.2;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        // Render full path arc in 3D
        ctx.beginPath();
        ctx.strokeStyle = p.color;
        const arcSteps = 20;
        for (let j = 0; j <= arcSteps; j++) {
          const ratio = j / arcSteps;
          // Interpolate coordinates
          const x = p.source.x + (p.target.x - p.source.x) * ratio;
          const z = p.source.z + (p.target.z - p.source.z) * ratio;
          // Height offsets (parabola)
          const peakHeight = -80;
          const y = p.source.y - Math.sin(ratio * Math.PI) * peakHeight;

          const pt = project3D(x, y, z);
          if (j === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Draw flowing packet projectile
        const x = p.source.x + (p.target.x - p.source.x) * p.progress;
        const z = p.source.z + (p.target.z - p.source.z) * p.progress;
        const y = p.source.y - Math.sin(p.progress * Math.PI) * -80;
        const packetPt = project3D(x, y, z);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(packetPt.x, packetPt.y, Math.max(0, 4 * packetPt.scale), 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Draw animated drone scanning active sites
      if (filteredIncidents.length > 0) {
        const droneCenter = getIncidentCoords(filteredIncidents[0]);
        const dx = droneCenter.x - 400 + Math.cos(time * 0.001) * 80;
        const dz = droneCenter.y - 300 + Math.sin(time * 0.001) * 80;
        const dy = -60; // fly height

        const pDrone = project3D(dx, dy, dz);
        const pTarget = project3D(droneCenter.x - 400, -15, droneCenter.y - 300);

        // Spotlight beam
        ctx.fillStyle = 'rgba(6, 182, 212, 0.07)';
        ctx.beginPath();
        ctx.moveTo(pDrone.x, pDrone.y);
        ctx.lineTo(pTarget.x - 15 * pTarget.scale, pTarget.y);
        ctx.lineTo(pTarget.x + 15 * pTarget.scale, pTarget.y);
        ctx.closePath();
        ctx.fill();

        // Draw small drone body
        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(pDrone.x, pDrone.y, Math.max(0, 4.5 * pDrone.scale), 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pDrone.x - 8 * pDrone.scale, pDrone.y);
        ctx.lineTo(pDrone.x + 8 * pDrone.scale, pDrone.y);
        ctx.moveTo(pDrone.x, pDrone.y - 4 * pDrone.scale);
        ctx.lineTo(pDrone.x, pDrone.y + 4 * pDrone.scale);
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    // Coordinate handler inside window to prevent component local state flickering
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      (window as any)._mapCanvasMouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      const currentHover = localHoverNode;

      if (currentHover) {
        setHoveredNode(prev => {
          if (prev && prev.name === currentHover.name && prev.x === currentHover.x && prev.y === currentHover.y) {
            return prev;
          }
          return currentHover;
        });
      } else {
        setHoveredNode(prev => {
          if (prev === null) return null;
          return null;
        });
      }
    };

    const handleCanvasClick = () => {
      if (localHoverNode) {
        setSelectedIncident(localHoverNode.incident);
        selectedIncidentRef.current = localHoverNode.incident;
      }
    };

    window.addEventListener('mousemove', handleMouseMoveGlobal);
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 bg-transparent">
      
      {/* 0. Left Tactical Control Sidebar */}
      <div className="xl:col-span-3 lg:col-span-4 flex flex-col gap-5 glass rounded-2xl p-5 shadow-lg border border-blue-900/30 glow-blue relative overflow-hidden shrink-0">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d1527_1px,transparent_1px),linear-gradient(to_bottom,#0d1527_1px,transparent_1px)] bg-[size:30px_30px] opacity-15" />
        
        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div>
            <h4 className="text-xs font-mono text-cyan-500 font-bold uppercase tracking-widest">
              TACTICAL DIRECTORY
            </h4>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">FILTER & FOCUS SYSTEMS</p>
          </div>

          {/* Search bar input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threat title..."
              className="w-full bg-[#020509]/95 border border-blue-950/80 focus:border-cyan-500/50 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-600 font-mono shadow-inner transition-colors"
            />
            <Search className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-500" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs font-bold font-mono cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          {/* CATEGORY FILTER */}
          <div className="space-y-2">
            <span className="text-[9px] text-slate-500 font-mono font-black uppercase tracking-wider block">
              CATEGORY FILTER
            </span>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'all', label: 'ALL INCIDENTS' },
                { id: 'digital_arrest', label: 'DIGITAL ARREST' },
                { id: 'counterfeit_currency', label: 'COUNTERFEIT (FICN)' },
                { id: 'money_mule', label: 'MONEY MULE NETWORKS' },
                { id: 'cyber_fraud', label: 'PHISHING PORTALS' }
              ].map((category) => {
                const isActive = filterType === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setFilterType(category.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/15 border border-blue-500/35 text-blue-300 font-bold shadow-md shadow-blue-950/20 glow-blue'
                        : 'bg-[#020509]/40 border border-slate-900/60 hover:border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <span className="tracking-wide text-[10px] font-mono">{category.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* HIGH RISK STATES (CLICK TO FOCUS) */}
          <div className="space-y-2 pt-2 border-t border-slate-900/60">
            <span className="text-[9px] text-slate-500 font-mono font-black uppercase tracking-wider block">
              HIGH RISK STATES (CLICK TO FOCUS)
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'HARYANA', label: 'HARYANA (MEWAT)' },
                { id: 'DELHI', label: 'DELHI NCR' },
                { id: 'JHARKHAND', label: 'JHARKHAND (JAMTARA)' },
                { id: 'WEST BENGAL', label: 'WEST BENGAL (KOLKATA)', fullWidth: true },
                { id: 'GUJARAT', label: 'GUJARAT (AHMEDABAD)' },
                { id: 'MAHARASHTRA', label: 'MAHARASHTRA (MUMBAI)' },
                { id: 'KARNATAKA', label: 'KARNATAKA (BENGALURU)', fullWidth: true }
              ].map((st) => {
                const isActive = selectedState === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => handleStateSelect(st.id)}
                    className={`px-2.5 py-2.5 rounded-lg text-[9px] border transition-all cursor-pointer font-bold tracking-wider font-mono ${
                      st.fullWidth ? 'col-span-2' : ''
                    } ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow shadow-cyan-950/20 glow-blue font-black'
                        : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-300 hover:border-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
              {selectedState !== 'ALL' && (
                <button
                  onClick={() => handleStateSelect('ALL')}
                  className="col-span-2 px-2.5 py-2 rounded-lg text-[9px] bg-rose-950/20 border border-rose-900/40 hover:border-rose-900 text-rose-400 font-bold tracking-wider font-mono transition-all cursor-pointer mt-1 text-center"
                >
                  RESET VIEW (ALL STATES)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 1. Map Visual Container */}
      <div className="xl:col-span-6 lg:col-span-8 glass rounded-2xl p-5 flex flex-col justify-between min-h-[580px] shadow-lg relative overflow-hidden group glow-blue border border-blue-900/30">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d1527_1px,transparent_1px),linear-gradient(to_bottom,#0d1527_1px,transparent_1px)] bg-[size:40px_40px] opacity-25" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-4 z-10">
          <div>
            <h3 className="text-md font-display font-semibold text-blue-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Geospatial Crime Hotspots Map
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time alert coordination over Indian cybercrime hubs</p>
          </div>

          <div className="text-[10px] bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 font-mono px-2 py-1 rounded font-bold uppercase tracking-wider">
            FOCUS: {selectedState}
          </div>
        </div>

        {/* Dynamic Geospatial Layer Adjustments */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#03070D]/80 border border-blue-900/10 p-3 rounded-xl z-10 my-2 text-[11px] font-mono text-slate-400">
          {/* Heatmap overlay checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="rounded border-slate-800 bg-slate-900 text-blue-500 focus:ring-0"
            />
            <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Thermal Hotspot Grid</span>
          </label>

          {/* Radar scan checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={showRadarSweep}
              onChange={(e) => setShowRadarSweep(e.target.checked)}
              className="rounded border-slate-800 bg-slate-900 text-blue-500 focus:ring-0"
            />
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Satellite Sweep Beam</span>
          </label>

          {/* Dynamic Hazard Radius slider */}
          <div className="flex items-center gap-2">
            <span>Range: {hazardRange}km</span>
            <input 
              type="range" 
              min="50" 
              max="250" 
              value={hazardRange}
              onChange={(e) => setHazardRange(Number(e.target.value))}
              className="flex-1 accent-blue-500 h-1 bg-slate-900 rounded outline-none"
            />
          </div>
        </div>

        {/* Immersive 3D Holographic Canvas Map */}
        <div className="relative w-full aspect-[4/3] max-w-[650px] mx-auto my-3 bg-[#020509]/85 rounded-xl border border-blue-900/20 flex items-center justify-center z-10 shadow-inner overflow-hidden select-none group/canvas">
          <canvas
            ref={canvasRef}
            width={1200}
            height={900}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
          
          {/* Real-time Hover HUD Tooltip billboard */}
          {hoveredNode && (
            <div 
              className="absolute bg-[#020509]/95 border border-cyan-500/30 p-2.5 rounded shadow-xl font-mono text-[10px] space-y-1 text-slate-200 pointer-events-none transition-all duration-100 z-20 glow-blue animate-fade-in"
              style={{
                left: `${hoveredNode.x + 10}px`,
                top: `${hoveredNode.y - 10}px`,
                transform: 'translate(0, -100%)'
              }}
            >
              <div className="text-cyan-400 font-bold border-b border-cyan-900/50 pb-1 flex items-center gap-1.5">
                <Maximize2 className="w-3 h-3 animate-pulse" />
                <span>GEOSPATIAL PROJECTION DETECTED</span>
              </div>
              <div className="font-sans font-semibold text-slate-100">{hoveredNode.name}</div>
              <div className="text-slate-500 text-[9px]">CLICK NODE TO TRIGGER DETAILED DISCRIMINATOR FILE</div>
            </div>
          )}

          {/* Overlay Compass HUD */}
          <div className="absolute bottom-4 left-4 p-2.5 bg-[#020509]/90 border border-blue-500/20 rounded font-mono text-[9px] text-blue-400 pointer-events-none space-y-1">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="font-bold">HUD SYSTEM SENSORS</span>
            </div>
            <div id="map-hud-yaw">YAW_COORD: {Math.round(cameraRef.current.yaw * 180 / Math.PI)}°</div>
            <div id="map-hud-pitch">PITCH_TILT: {Math.round(cameraRef.current.pitch * 180 / Math.PI)}°</div>
            <button 
              onClick={handleResetCamera}
              className="mt-1.5 w-full bg-blue-950/80 hover:bg-blue-900 text-blue-300 font-bold border border-blue-900/30 p-1 rounded cursor-pointer pointer-events-auto text-[8px] transition-all"
            >
              RESET ORIENTATION
            </button>
          </div>
          
          <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-500 pointer-events-none">
            DRAG TO ROTATE • SCROLL TO ZOOM
          </div>
        </div>

        {/* Instructions footer on map */}
        <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-900 z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Click any active radar signal to deploy local sector tactical units</span>
          </div>

          <button
            onClick={() => setShowReportForm(!showReportForm)}
            className="text-xs bg-blue-600 hover:bg-blue-500 active:bg-blue-700 font-bold text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-md shadow-blue-950/20 cursor-pointer transition-all uppercase tracking-wider"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            REPORT ACTIVE THREAT
          </button>
        </div>
      </div>

      {/* 2. Right Pane: Tactical Detail Terminal OR Quick Incident Reporter */}
      <div className="xl:col-span-3 lg:col-span-12 flex flex-col gap-6">
        
        {/* Active Incident Reporter Form Overlay / Panel */}
        {showReportForm && (
          <div className="glass rounded-xl p-5 flex flex-col justify-between shadow-lg glow-red border border-rose-950/30 animate-fade-in">
            <div className="border-b border-rose-900/20 pb-3 mb-4 flex justify-between items-center">
              <h4 className="text-sm font-display font-semibold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Report Threat to National Database
              </h4>
              <button 
                onClick={() => setShowReportForm(false)} 
                className="text-xs text-slate-500 hover:text-slate-300 font-bold cursor-pointer"
              >
                CANCEL
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3.5 text-xs text-slate-300">
              {/* Type Select */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 font-semibold uppercase font-mono tracking-wider">Scam Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full bg-slate-950/80 border border-slate-850 rounded-lg p-2 text-slate-200 outline-none focus:border-rose-500/50"
                >
                  <option value="digital_arrest">Digital Arrest Scam / Phone Ransom</option>
                  <option value="counterfeit_currency">FICN Counterfeit Note Seizure</option>
                  <option value="money_mule">Money Mule Bank Activity</option>
                  <option value="cyber_fraud">Phishing Portal / Fake SMS Trap</option>
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 font-semibold uppercase font-mono tracking-wider">Incident Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FedEx Custody Extortion Call"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-850 rounded-lg p-2 text-slate-200 outline-none focus:border-rose-500/50"
                />
              </div>

              {/* Location Hub */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 font-semibold uppercase font-mono tracking-wider">Identified Origin / Location Hub</label>
                <select
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  required
                  className="w-full bg-slate-950/80 border border-slate-850 rounded-lg p-2 text-slate-200 outline-none focus:border-rose-500/50"
                >
                  <option value="">-- Choose closest hub --</option>
                  <option value="Mewat Sector, Haryana">Mewat Sector, Haryana</option>
                  <option value="Jamtara, Jharkhand">Jamtara, Jharkhand</option>
                  <option value="Kolkata Border, West Bengal">Kolkata Border, West Bengal</option>
                  <option value="Ahmedabad, Gujarat">Ahmedabad, Gujarat</option>
                  <option value="Bengaluru, Karnataka">Bengaluru, Karnataka</option>
                  <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 font-semibold uppercase font-mono tracking-wider">Involved Funds (INR)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹15,50,000"
                  value={reportAmount}
                  onChange={(e) => setReportAmount(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-850 rounded-lg p-2 text-slate-200 outline-none focus:border-rose-500/50"
                />
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 font-semibold uppercase font-mono tracking-wider">Threat Narrative & Indicators</label>
                <textarea
                  placeholder="Provide call signatures, bank account details, spoofing numbers, or currency marks..."
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-850 rounded-lg p-2 text-slate-200 outline-none focus:border-rose-500/50 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20 cursor-pointer transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                FILE TO NATIONAL DATABASE
              </button>
            </form>
          </div>
        )}

        {/* Selected Incident Detail Panel */}
        <div className="glass rounded-2xl p-5 flex flex-col justify-between shadow-lg flex-1 min-h-[350px] glow-blue border border-blue-900/30">
          {selectedIncident ? (
            <div className="space-y-4">
              <div className="border-b border-slate-900 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">
                    Incident ID: {selectedIncident.id}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    selectedIncident.status === 'ACTIVE' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {selectedIncident.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 font-display mt-1.5">
                  {selectedIncident.title}
                </h4>
              </div>

              {/* Core Incident specs */}
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#03060b] p-2 rounded-xl border border-slate-900">
                    <span className="block text-[10px] text-slate-500 font-mono">SEVERITY LEVEL</span>
                    <span className={`font-semibold font-mono ${
                      selectedIncident.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {selectedIncident.severity}
                    </span>
                  </div>
                  <div className="bg-[#03060b] p-2 rounded-xl border border-slate-900">
                    <span className="block text-[10px] text-slate-500 font-mono">TARGET HUB</span>
                    <span className="font-semibold text-slate-300">
                      {selectedIncident.location.split(',')[0]}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#03060b] p-2 rounded-xl border border-slate-900">
                    <span className="block text-[10px] text-slate-500 font-mono">FUNDS EXPENDED</span>
                    <span className="font-semibold text-slate-300 font-mono">{selectedIncident.involvedAmount}</span>
                  </div>
                  <div className="bg-[#03060b] p-2 rounded-xl border border-slate-900">
                    <span className="block text-[10px] text-slate-500 font-mono">TIMESTAMP</span>
                    <span className="font-semibold text-slate-400 text-[11px]">
                      {new Date(selectedIncident.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {selectedIncident.callerNumber && (
                  <div className="bg-[#03060b] p-2.5 rounded-xl border border-slate-900">
                    <span className="block text-[10px] text-slate-500 font-mono">SPOOFED OUTGOING CLI</span>
                    <span className="font-semibold font-mono text-rose-300 text-sm mt-0.5 block">{selectedIncident.callerNumber}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="block text-[10px] text-slate-400 font-mono font-semibold uppercase">INTELLIGENCE SUMMARY</span>
                  <div className="bg-[#03060b] p-3 rounded-xl border border-slate-900 text-slate-300 leading-relaxed font-sans text-[11px] max-h-[140px] overflow-y-auto">
                    {selectedIncident.details}
                  </div>
                </div>

                {selectedIncident.assignedUnit && (
                  <div className="bg-emerald-950/15 p-2.5 rounded-xl border border-emerald-900/30 text-[11px] flex items-center gap-2 text-emerald-400">
                    <Shield className="w-3.5 h-3.5" />
                    <div>
                      <span className="text-[9px] text-slate-500 font-mono block">ASSIGNED DISPATCH</span>
                      <span className="font-semibold">{selectedIncident.assignedUnit}</span>
                    </div>
                  </div>
                )}

                {/* Dispatch Resolve Feedback Action buttons */}
                {selectedIncident.status !== 'RESOLVED' ? (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...selectedIncident, status: 'RESOLVED' as const };
                        setSelectedIncident(updated);
                        if (onUpdateIncident) {
                          onUpdateIncident(updated);
                        }
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all uppercase tracking-wider shadow-md shadow-emerald-950/10"
                    >
                      ✔️ MARK AS RESOLVED
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...selectedIncident, status: 'ACTIVE' as const };
                        setSelectedIncident(updated);
                        if (onUpdateIncident) {
                          onUpdateIncident(updated);
                        }
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all uppercase tracking-wider border border-slate-850"
                    >
                      🚨 RE-OPEN THREAT CASE
                    </button>
                  </div>
                )}
              </div>

              {/* Tactical Action Form (Only shown if ACTIVE status) */}
              {selectedIncident.status === 'ACTIVE' && (
                <form onSubmit={handleDispatchSubmit} className="border-t border-slate-900 pt-3 mt-2 space-y-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-mono font-semibold uppercase">
                      Deploy Tactical Field Unit
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cyber Cell Division Alpha"
                        value={assignedUnitInput}
                        onChange={(e) => setAssignedUnitInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500/50"
                      />
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 uppercase tracking-wider"
                      >
                        <Navigation className="w-3 h-3" />
                        DEPLOY
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-full mb-3 shadow-inner">
                <Shield className="w-8 h-8 text-blue-500/40" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300 font-display">No Incident Selected</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                Highlight any active signal on the threat map to view detailed forensic telemetry data and coordinate sector dispatches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
