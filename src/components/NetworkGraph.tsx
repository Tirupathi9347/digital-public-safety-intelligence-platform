import React, { useState, useEffect, useRef } from 'react';
import { Node, Link } from '../types';
import { 
  Network, 
  FileSymlink, 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  RotateCw, 
  Sliders, 
  Layers, 
  Cpu, 
  Compass, 
  Activity,
  Maximize2
} from 'lucide-react';

interface NetworkGraphProps {
  onDraftIntelPackage: (nodeId: string, notes: string) => Promise<{ nodeId: string; nodeLabel: string; intelPackage: string; draftedAt: string }>;
  loading: boolean;
}

export default function NetworkGraph({ onDraftIntelPackage, loading }: NetworkGraphProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [userNotes, setUserNotes] = useState('');
  const [intelPackage, setIntelPackage] = useState<string | null>(null);
  const [draftedInfo, setDraftedInfo] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 3D Orbital States
  const [yaw, setYaw] = useState<number>(30); // angle around Y axis
  const [pitch, setPitch] = useState<number>(-15); // angle around X axis
  const [roll, setRoll] = useState<number>(0); // angle around Z axis
  const [zoom, setZoom] = useState<number>(2.2);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1); // Speed multiplier
  const [activeFocusLayer, setActiveFocusLayer] = useState<string>('all');

  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Orbit rotation and drag interactions
  const isDraggingRef = useRef(false);
  const startMouseRef = useRef({ x: 0, y: 0 });
  const draggedCameraRef = useRef(false);

  // Pre-configured nodes with 3D coordinate space attributes (X, Y, Z coordinates centered at 0,0,0)
  const graphNodes: Node[] = [
    { id: "V1", label: "Victim: Dr. Mehta", type: "victim", val: 14, details: { location: "Mumbai", flagged: false } },
    { id: "V2", label: "Victim: Priya S.", type: "victim", val: 14, details: { location: "Delhi", flagged: false } },
    { id: "P1", label: "+91 98712 34212 (CBI Spoofed Call)", type: "phone_num", val: 18, details: { operator: "VoIP Spoofed Gateway", location: "Mewat Hub", flagged: true } },
    { id: "M1", label: "Mule L1: Gramin Rural A/C", type: "mule_l1", val: 19, details: { holder: "Ramesh Kumar", bank: "State Co-op Bank", location: "Jamtara, JH", balance: "₹14,20,000", flagged: true } },
    { id: "M2", label: "Mule L1: Urban Saving A/C", type: "mule_l1", val: 19, details: { holder: "Anil Patel", bank: "National Bank", location: "Ahmedabad, GJ", balance: "₹28,50,000", flagged: true } },
    { id: "M3", label: "Mule L2: Layered Shell Account", type: "mule_l2", val: 17, details: { holder: "Apex Imports Ltd", bank: "Private Commercial Bank", location: "Kolkata, WB", balance: "₹75,00,000", flagged: true } },
    { id: "E1", label: "Crypto Gateway (P2P USDT Wallet)", type: "exchange", val: 22, details: { ip: "103.88.22.14", balance: "18,480 USDT", location: "Offshore Gateway", flagged: true } },
    { id: "IP1", label: "Tor Proxy IP: 185.220.101.44", type: "scammer_ip", val: 15, details: { ip: "185.220.101.44 (VPN Exit Node)", location: "Scam Compound Border", flagged: true } }
  ];

  // Base 3D Coordinates relative to an imaginary bounding volume of 400x300x300
  // Spaced out from Left to Right (Pipeline Flow): Ingress -> Victims -> Mule L1 -> Mule L2 -> Exfil
  const base3DCoords: Record<string, { x: number; y: number; z: number; layer: string }> = {
    "IP1": { x: -260, y: -95, z: -30, layer: "ingress" },
    "P1": { x: -260, y: 65, z: 30, layer: "ingress" },
    "V1": { x: -100, y: -60, z: -20, layer: "victims" },
    "V2": { x: -100, y: 80, z: 20, layer: "victims" },
    "M1": { x: 60, y: -50, z: -40, layer: "mules" },
    "M2": { x: 60, y: 70, z: 40, layer: "mules" },
    "M3": { x: 200, y: 10, z: 0, layer: "mules" },
    "E1": { x: 320, y: -25, z: 10, layer: "exfil" }
  };

  const graphLinks: Link[] = [
    { source: "V1", target: "M1", amount: "₹45,00,000", type: "transfer" },
    { source: "V2", target: "M2", amount: "₹37,00,000", type: "transfer" },
    { source: "P1", target: "V1", amount: "7 calls", type: "call" },
    { source: "P1", target: "V2", amount: "4 calls", type: "call" },
    { source: "M1", target: "M3", amount: "₹14,00,000", type: "transfer" },
    { source: "M2", target: "M3", amount: "₹28,00,000", type: "transfer" },
    { source: "M3", target: "E1", amount: "₹42,00,000", type: "transfer" },
    { source: "IP1", target: "P1", amount: "SIP Control", type: "ip_resolve" },
    { source: "IP1", target: "E1", amount: "Gateway Command", type: "ip_resolve" }
  ];

  // Physics particles state
  const physicsNodesRef = useRef<Array<{
    id: string;
    label: string;
    type: string;
    val: number;
    details: any;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    layer: string;
  }>>([]);

  // Initialize simulated physics variables once
  if (physicsNodesRef.current.length === 0) {
    physicsNodesRef.current = graphNodes.map(node => {
      const coords = base3DCoords[node.id] || { x: 0, y: 0, z: 0, layer: 'all' };
      return {
        ...node,
        x: coords.x,
        y: coords.y,
        z: coords.z,
        vx: 0,
        vy: 0,
        vz: 0,
        layer: coords.layer
      };
    });
  }

  // Force-directed graph simulation tick calculations
  const updatePhysics = () => {
    const nodes = physicsNodesRef.current;
    
    // 1. Gentle repulsion between node charges to prevent collision
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dz = n2.z - n1.z;
        const dist = Math.hypot(dx, dy, dz) || 1;
        
        if (dist < 140) {
          const force = 160 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          const fz = (dz / dist) * force;
          
          n1.vx -= fx;
          n1.vy -= fy;
          n1.vz -= fz;
          
          n2.vx += fx;
          n2.vy += fy;
          n2.vz += fz;
        }
      }
    }

    // 2. Balanced spring attraction along links
    graphLinks.forEach(link => {
      const n1 = nodes.find(n => n.id === link.source);
      const n2 = nodes.find(n => n.id === link.target);
      if (!n1 || !n2) return;
      
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dz = n2.z - n1.z;
      const dist = Math.hypot(dx, dy, dz) || 1;
      
      const targetLength = 110;
      const force = (dist - targetLength) * 0.004;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      const fz = (dz / dist) * force;
      
      n1.vx += fx;
      n1.vy += fy;
      n1.vz += fz;
      
      n2.vx -= fx;
      n2.vy -= fy;
      n2.vz -= fz;
    });

    // 3. Anchor springs pulling nodes gently to their pipeline coordinate lanes + damping
    nodes.forEach(n => {
      const base = base3DCoords[n.id] || { x: 0, y: 0, z: 0 };
      
      // Gentle spring attraction keeps them organized in pipeline columns while bobbing dynamically
      n.vx += (base.x - n.x) * 0.015;
      n.vy += (base.y - n.y) * 0.015;
      n.vz += (base.z - n.z) * 0.015;
      
      // Perfect friction damping for smooth organic movement
      n.vx *= 0.75;
      n.vy *= 0.75;
      n.vz *= 0.75;
      
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;
    });
  };

  // State to hold hovered node info
  const [hoveredNode, setHoveredNode] = useState<{ name: string; x: number; y: number; id: string } | null>(null);

  // Combined physics & rendering canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localHoverNode: any = null;

    const animate = (time: number) => {
      // 1. Run physics simulation tick
      updatePhysics();

      // 2. Orbit Camera auto rotation
      if (autoRotate) {
        const delta = lastTimeRef.current ? time - lastTimeRef.current : 0;
        setYaw(prev => (prev + (0.015 * rotationSpeed * (delta || 16.6))) % 360);
      }
      lastTimeRef.current = time;

      // 3. Canvas Resizing
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * 2 || canvas.height !== rect.height * 2) {
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Trigonometric camera projections
      const radYaw = (yaw * Math.PI) / 180;
      const radPitch = (pitch * Math.PI) / 180;
      const radRoll = (roll * Math.PI) / 180;

      const cx = w / 2;
      const cy = h / 2;
      const viewDistance = 450;

      // Projection mapping Helper
      const project3D = (vx: number, vy: number, vz: number) => {
        // Roll (Z)
        const cosR = Math.cos(radRoll);
        const sinR = Math.sin(radRoll);
        let x1 = vx * cosR - vy * sinR;
        let y1 = vx * sinR + vy * cosR;
        let z1 = vz;

        // Yaw (Y)
        const cosY = Math.cos(radYaw);
        const sinY = Math.sin(radYaw);
        let x2 = x1 * cosY + z1 * sinY;
        let y2 = y1;
        let z2 = -x1 * sinY + z1 * cosY;

        // Pitch (X)
        const cosP = Math.cos(radPitch);
        const sinP = Math.sin(radPitch);
        let x3 = x2;
        let y3 = y2 * cosP - z2 * sinP;
        let z3 = y2 * sinP + z2 * cosP;

        // Scale factors
        const sx = x3 * zoom;
        const sy = y3 * zoom;
        const sz = z3 * zoom;

        const denominator = viewDistance + sz;
        const scaleFactor = denominator > 20 ? viewDistance / denominator : 0;
        const screenX = cx + sx * scaleFactor;
        const screenY = cy + sy * scaleFactor;

        return { x: screenX, y: screenY, depth: sz, scale: scaleFactor };
      };

      // Draw horizontal coordinate mesh disk representing HUD orbit boundaries
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const compassRadius = 180;
      const compassSteps = 32;
      for (let s = 0; s <= compassSteps; s++) {
        const angle = (s / compassSteps) * Math.PI * 2;
        const pt = project3D(Math.cos(angle) * compassRadius, 0, Math.sin(angle) * compassRadius);
        if (s === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Draw concentric inner HUD grid ring
      ctx.beginPath();
      for (let s = 0; s <= compassSteps; s++) {
        const angle = (s / compassSteps) * Math.PI * 2;
        const pt = project3D(Math.cos(angle) * (compassRadius * 0.6), 0, Math.sin(angle) * (compassRadius * 0.6));
        if (s === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Project Nodes
      const projectedList = physicsNodesRef.current.map(n => {
        const p = project3D(n.x, n.y, n.z);
        const isSearchMatched = !searchTerm.trim() || 
          n.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
          n.id.toLowerCase().includes(searchTerm.toLowerCase());
        const isDimmed = (activeFocusLayer !== 'all' && n.layer !== activeFocusLayer) || !isSearchMatched;
        return { ...n, px: p.x, py: p.y, scale: p.scale, depth: p.depth, isDimmed };
      });

      // Render links first (behind nodes)
      projectedList.forEach(node => {
        graphLinks.forEach(link => {
          if (link.source !== node.id) return;
          const targetNode = projectedList.find(n => n.id === link.target);
          if (!targetNode) return;

          // Compute dimming status
          const isLinkDimmed = node.isDimmed || targetNode.isDimmed;
          const linkOpacity = isLinkDimmed ? 0.05 : 0.6;
          const isSelectedLink = selectedNode?.id === node.id || selectedNode?.id === targetNode.id;

          // Determine line type colors
          let strokeStyle = 'rgba(71, 85, 105, 0.5)';
          let pulseStyle = 'rgba(148, 163, 184, 0.65)';
          if (link.type === 'call') {
            strokeStyle = 'rgba(245, 158, 11, 0.45)';
            pulseStyle = '#f59e0b';
          } else if (link.type === 'ip_resolve') {
            strokeStyle = 'rgba(244, 63, 94, 0.45)';
            pulseStyle = '#f43f5e';
          } else if (node.type === 'mule_l1' || node.type === 'mule_l2') {
            strokeStyle = 'rgba(99, 102, 241, 0.45)';
            pulseStyle = '#6366f1';
          } else {
            strokeStyle = 'rgba(59, 130, 246, 0.45)';
            pulseStyle = '#3b82f6';
          }

          ctx.strokeStyle = strokeStyle;
          ctx.lineWidth = isSelectedLink ? 3.5 : 1.8;
          ctx.beginPath();
          ctx.moveTo(node.px, node.py);
          ctx.lineTo(targetNode.px, targetNode.py);
          ctx.stroke();

          // Flowing transactional financial packet pulses
          if (!isLinkDimmed) {
            const pulseProgress = (time * 0.001 * (link.frequency || 1)) % 1;
            const px = node.px + (targetNode.px - node.px) * pulseProgress;
            const py = node.py + (targetNode.py - node.py) * pulseProgress;
            ctx.fillStyle = pulseStyle;
            ctx.beginPath();
            ctx.arc(px, py, 3.5 * node.scale, 0, Math.PI * 2);
            ctx.fill();

            // Link metric amounts text billboard at midpoints
            if (link.amount && isSelectedLink) {
              ctx.fillStyle = '#94a3b8';
              ctx.font = 'bold 15px Fira Code, monospace';
              ctx.textAlign = 'center';
              ctx.fillText(link.amount, (node.px + targetNode.px) / 2, (node.py + targetNode.py) / 2 - 6);
            }
          }
        });
      });

      // Depth-sort nodes (render back-to-front for realistic perspective overlap)
      const sortedList = [...projectedList].sort((a, b) => b.depth - a.depth);

      // Track Hover node
      let currentHovered: any = null;
      let minDistance = 24;

      // Track mouse position normalized
      const mouseEventRef = (window as any)._networkCanvasMouse || { x: -9999, y: -9999 };
      const mx = mouseEventRef.x * (canvas.width / rect.width);
      const my = mouseEventRef.y * (canvas.height / rect.height);

      sortedList.forEach(node => {
        const radius = Math.max(12, node.val * node.scale * 1.3);
        const nodeOpacity = node.isDimmed ? 0.15 : 1.0;
        const isSelected = selectedNode?.id === node.id;

        // Check hover
        const dist = Math.hypot(node.px - mx, node.py - my);
        if (dist < minDistance && !node.isDimmed) {
          minDistance = dist;
          currentHovered = {
            id: node.id,
            name: node.label,
            x: node.px / 2,
            y: node.py / 2,
            node
          };
        }

        // Color mapping
        let nodeFillColor = '#64748b';
        if (node.type === 'victim') nodeFillColor = '#3b82f6';
        else if (node.type === 'mule_l1') nodeFillColor = '#6366f1';
        else if (node.type === 'mule_l2') nodeFillColor = '#a855f7';
        else if (node.type === 'exchange') nodeFillColor = '#10b981';
        else if (node.type === 'scammer_ip') nodeFillColor = '#f43f5e';
        else if (node.type === 'phone_num') nodeFillColor = '#f59e0b';

        ctx.globalAlpha = nodeOpacity;

        // Dynamic glowing radar ring
        if (isSelected) {
          ctx.strokeStyle = nodeFillColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(node.px, node.py, radius + 7, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw node base circle
        ctx.fillStyle = nodeFillColor;
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(15, 23, 42, 0.8)';
        ctx.lineWidth = isSelected ? 2 : 1.5;
        ctx.stroke();

        // Node dark center
        ctx.fillStyle = '#03060c';
        ctx.beginPath();
        ctx.arc(node.px, node.py, 3.5 * node.scale, 0, Math.PI * 2);
        ctx.fill();

        // Helper to parse complex node labels into pristine, clean main + category labels
        const parseNodeLabel = (rawLabel: string, nodeType: string) => {
          if (rawLabel.startsWith("Victim:")) {
            return { main: rawLabel.replace("Victim:", "").trim(), sub: "VICTIM" };
          }
          if (rawLabel.startsWith("Mule L1:")) {
            return { main: rawLabel.replace("Mule L1:", "").trim(), sub: "MULE TIER 1" };
          }
          if (rawLabel.startsWith("Mule L2:")) {
            return { main: rawLabel.replace("Mule L2:", "").trim(), sub: "MULE TIER 2" };
          }
          if (rawLabel.startsWith("Tor Proxy IP:")) {
            return { main: rawLabel.replace("Tor Proxy IP:", "").trim(), sub: "TOR PROXY" };
          }
          if (rawLabel.includes("CBI Spoofed Call")) {
            return { main: "+91 98712 34212", sub: "CBI SPOOF CALL" };
          }
          if (rawLabel.startsWith("Crypto Gateway")) {
            return { main: "USDT Gateway", sub: "CRYPTO OUTFLOW" };
          }
          return { main: rawLabel, sub: nodeType.toUpperCase() };
        };

        const { main, sub } = parseNodeLabel(node.label, node.type);

        // Render elegant high-contrast capsule box behind label text for 100% clarity and 0% messiness
        ctx.font = 'bold 11px "Fira Code", monospace';
        const subW = ctx.measureText(sub).width;
        ctx.font = '13px "Inter", sans-serif';
        const mainW = ctx.measureText(main).width;
        const boxW = Math.max(subW, mainW) + 24;
        const boxH = 42;
        const boxX = node.px - boxW / 2;
        const boxY = node.py + radius + 8;

        // Draw rounded rectangle
        ctx.beginPath();
        const drawRadius = 6;
        ctx.moveTo(boxX + drawRadius, boxY);
        ctx.lineTo(boxX + boxW - drawRadius, boxY);
        ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + drawRadius);
        ctx.lineTo(boxX + boxW, boxY + boxH - drawRadius);
        ctx.quadraticCurveTo(boxX + boxW, boxY + boxH, boxX + boxW - drawRadius, boxY + boxH);
        ctx.lineTo(boxX + drawRadius, boxY + boxH);
        ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - drawRadius);
        ctx.lineTo(boxX, boxY + drawRadius);
        ctx.quadraticCurveTo(boxX, boxY, boxX + drawRadius, boxY);
        ctx.closePath();

        ctx.fillStyle = isSelected ? 'rgba(3, 8, 20, 0.95)' : 'rgba(2, 5, 9, 0.92)';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#22d3ee' : 'rgba(30, 41, 59, 0.85)';
        ctx.lineWidth = isSelected ? 2 : 1.2;
        ctx.stroke();

        // Draw text elements inside the capsule
        ctx.fillStyle = isSelected ? '#22d3ee' : '#94a3b8';
        ctx.font = 'bold 10px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(sub, node.px, boxY + 14);

        ctx.fillStyle = isSelected ? '#ffffff' : '#cbd5e1';
        ctx.font = isSelected ? 'bold 12px "Inter", sans-serif' : '11px "Inter", sans-serif';
        ctx.fillText(main, node.px, boxY + 31);

        ctx.globalAlpha = 1.0;
      });

      localHoverNode = currentHovered;

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    // Track mouse events globally
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      (window as any)._networkCanvasMouse = { x: mx, y: my };

      const currentHover = localHoverNode;
      if (currentHover) {
        setHoveredNode(currentHover);
      } else {
        setHoveredNode(null);
      }
    };

    const handleCanvasClick = () => {
      if (localHoverNode && !draggedCameraRef.current) {
        setSelectedNode(localHoverNode.node);
        setIntelPackage(null);
        setDraftedInfo(null);
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
  }, [yaw, pitch, roll, zoom, activeFocusLayer, selectedNode, autoRotate, rotationSpeed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    draggedCameraRef.current = false;
    startMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startMouseRef.current.x;
    const deltaY = e.clientY - startMouseRef.current.y;

    if (Math.hypot(deltaX, deltaY) > 4) {
      draggedCameraRef.current = true;
    }

    setYaw(prev => (prev - deltaX * 0.4 + 360) % 360);
    setPitch(prev => Math.min(75, Math.max(-75, prev + deltaY * 0.4)));
    setAutoRotate(false);

    startMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleCanvasWheel = (e: React.WheelEvent) => {
    setZoom(prev => Math.min(2.5, Math.max(0.4, prev - e.deltaY * 0.0015)));
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setIntelPackage(null);
    setDraftedInfo(null);
  };

  const handleGenerateIntelPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode) return;
    try {
      const result = await onDraftIntelPackage(selectedNode.id, userNotes);
      setIntelPackage(result.intelPackage);
      setDraftedInfo(result);
    } catch (err) {
      console.error("Failed to generate intelligence package:", err);
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'victim': return { fill: '#3b82f6', text: 'VICTIM', border: 'border-blue-500/30' }; 
      case 'mule_l1': return { fill: '#6366f1', text: 'MULE L1', border: 'border-indigo-500/30' }; 
      case 'mule_l2': return { fill: '#a855f7', text: 'MULE L2', border: 'border-purple-500/30' }; 
      case 'exchange': return { fill: '#10b981', text: 'OFFSHORE', border: 'border-emerald-500/30' }; 
      case 'scammer_ip': return { fill: '#f43f5e', text: 'PROXY IP', border: 'border-rose-500/30' }; 
      case 'phone_num': return { fill: '#f59e0b', text: 'VoIP CALLER', border: 'border-amber-500/30' }; 
      default: return { fill: '#64748b', text: 'NODE', border: 'border-slate-800' };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 bg-transparent">
      
      {/* 1. Transaction Path Graph Visualizer (Left Col - 7 Span) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* Interactive Neural 3D Controls */}
        <div className="glass rounded-xl p-4 border border-blue-900/10 bg-slate-950/25 flex flex-col gap-3.5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-mono font-bold text-slate-300 uppercase">Interactive 3D Neural Viewport Specs</span>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-mono text-slate-400 select-none">
                <input 
                  type="checkbox" 
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-0 cursor-pointer"
                />
                <RotateCw className={`w-3.5 h-3.5 text-blue-400 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: autoRotate ? `${4 / rotationSpeed}s` : '0s' }} />
                <span>Auto-Orbit Matrix</span>
              </label>

              {autoRotate && (
                <select
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-900 text-[9px] font-mono rounded px-1.5 py-0.5 text-slate-300 outline-none cursor-pointer"
                >
                  <option value={0.4}>Slow Orbit</option>
                  <option value={1}>Med Orbit</option>
                  <option value={2.5}>Fast Orbit</option>
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-mono text-slate-400">
            {/* Yaw controller */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Yaw (Y-Rotation):</span>
                <span className="text-blue-400 font-bold">{Math.round(yaw)}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="360" 
                value={yaw}
                onChange={(e) => { setYaw(Number(e.target.value)); setAutoRotate(false); }}
                className="w-full accent-blue-500 h-1 bg-slate-900 rounded outline-none cursor-pointer"
              />
            </div>

            {/* Pitch controller */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Pitch (X-Rotation):</span>
                <span className="text-blue-400 font-bold">{Math.round(pitch)}°</span>
              </div>
              <input 
                type="range" 
                min="-75" 
                max="75" 
                value={pitch}
                onChange={(e) => { setPitch(Number(e.target.value)); setAutoRotate(false); }}
                className="w-full accent-blue-500 h-1 bg-slate-900 rounded outline-none cursor-pointer"
              />
            </div>

            {/* Roll controller */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Roll (Z-Rotation):</span>
                <span className="text-blue-400 font-bold">{Math.round(roll)}°</span>
              </div>
              <input 
                type="range" 
                min="-60" 
                max="60" 
                value={roll}
                onChange={(e) => { setRoll(Number(e.target.value)); setAutoRotate(false); }}
                className="w-full accent-blue-500 h-1 bg-slate-900 rounded outline-none cursor-pointer"
              />
            </div>

            {/* Zoom controller */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Viewport Depth:</span>
                <span className="text-blue-400 font-bold">{Math.round(zoom * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.4" 
                max="3.0" 
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-blue-500 h-1 bg-slate-900 rounded outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>
 
        {/* Core 3D Interactive Visualization Canvas */}
        <div className="glass rounded-xl p-5 flex flex-col justify-between min-h-[660px] shadow-lg relative overflow-hidden border border-blue-900/30 glow-blue select-none">
          {/* Background Space Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d1527_1px,transparent_1px),linear-gradient(to_bottom,#0d1527_1px,transparent_1px)] bg-[size:40px_40px] opacity-25" />
 
          {/* Combined responsive control bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#020509]/80 border border-blue-900/15 p-3 rounded-xl z-20 relative">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-xs font-display font-bold text-slate-100">
                  3D Neural Fraud Network AI
                </h3>
                <p className="text-[9px] text-slate-500 font-mono">PERSPECTIVE MAP-OCCLUSION PROJECTION</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Entity/Pattern Search Input Field */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search entity or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyan-500/50 text-[10px] font-mono text-slate-200 px-3 py-1.5 rounded-lg outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-cyan-500/10 w-44 sm:w-56"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-[11px] font-bold font-mono cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[9px] bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-400">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>ISOLATE:</span>
                <select
                  value={activeFocusLayer}
                  onChange={(e) => {
                    setActiveFocusLayer(e.target.value);
                    setSelectedNode(null);
                  }}
                  className="bg-transparent border-none text-slate-300 text-[9px] cursor-pointer outline-none font-bold"
                >
                  <option value="all">ALL STAGES</option>
                  <option value="ingress">VOIP INGRESS</option>
                  <option value="victims">VICTIMS</option>
                  <option value="mules">MULES</option>
                  <option value="exfil">EXFILTRATION</option>
                </select>
              </div>
            </div>
          </div>
 
          {/* Holographic Physics Canvas */}
          <div className="relative w-full bg-[#020509]/85 rounded-xl border border-blue-900/20 p-2 h-[620px] flex items-center justify-center z-10 shadow-inner mt-4 mb-3 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleCanvasWheel}
            />
 
            {/* Floating Camera Quick Actions */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 z-20">
              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(3.0, prev + 0.2))}
                className="bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded text-[9px] font-mono cursor-pointer transition-all uppercase font-bold"
              >
                In +
              </button>
              <button
                type="button"
                onClick={() => setZoom(prev => Math.max(0.4, prev - 0.2))}
                className="bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded text-[9px] font-mono cursor-pointer transition-all uppercase font-bold"
              >
                Out -
              </button>
              <button
                type="button"
                onClick={() => {
                  setYaw(30);
                  setPitch(-15);
                  setRoll(0);
                  setZoom(1.4);
                  setAutoRotate(true);
                }}
                className="bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded text-[9px] font-mono cursor-pointer transition-all uppercase font-bold"
              >
                Reset
              </button>
            </div>
 
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
                  <span>NODE IDENTIFICATION PIN</span>
                </div>
                <div className="font-sans font-semibold text-slate-100">{hoveredNode.name}</div>
                <div className="text-slate-500 text-[9px]">DRAG SPACE TO ROTATE • CLICK TO QUERY FILE</div>
              </div>
            )}
 
            <div className="absolute bottom-4 right-4 text-[9px] font-mono text-slate-500 pointer-events-none">
              DRAG ON CANVAS TO SPIN CAMERA
            </div>
          </div>

          {/* Multi-tier explanation of visual representation */}
          <div className="flex flex-wrap justify-between gap-3 bg-slate-950/60 p-3.5 rounded-lg border border-slate-900 z-10 text-[9px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" /> Target Victim</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" /> Mule Tier 1</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" /> Mule Layer 2</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Offshore Wallet</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> TOR Node IP</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" /> VoIP Trunk Line</div>
          </div>
        </div>

      </div>

      {/* 2. Suspect Node File & Intelligence Generator (Right Col - 5 Span) */}
      <div className="lg:col-span-5 flex flex-col justify-between glass rounded-2xl p-5 shadow-lg border border-blue-900/30 glow-blue">
        {selectedNode ? (
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div>
              {/* Suspect specs file */}
              <div className="border-b border-slate-900 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">
                    SUSPECT FILE PROFILE (AI AUDITED)
                  </span>
                  {selectedNode.details.flagged && (
                    <span className="text-[10px] font-mono font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> FLAGGED CRITICAL
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-slate-100 font-display mt-1.5">
                  {selectedNode.label}
                </h4>
              </div>

              {/* Node specifications */}
              <div className="bg-[#03060b] p-3.5 rounded-xl border border-slate-900 text-xs text-slate-300 space-y-2 font-mono shadow-inner">
                {selectedNode.details.holder && (
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500">ACCOUNT HOLDER:</span>
                    <span className="font-semibold text-slate-200">{selectedNode.details.holder}</span>
                  </div>
                )}
                {selectedNode.details.bank && (
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500">ASSOCIATED BANK:</span>
                    <span className="font-semibold text-slate-200">{selectedNode.details.bank}</span>
                  </div>
                )}
                {selectedNode.details.location && (
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500">OPERATIONAL HUB:</span>
                    <span className="font-semibold text-slate-200">{selectedNode.details.location}</span>
                  </div>
                )}
                {selectedNode.details.ip && (
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500">PROXY RESOLVE IP:</span>
                    <span className="font-semibold text-rose-400">{selectedNode.details.ip}</span>
                  </div>
                )}
                {selectedNode.details.operator && (
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500">VoIP OPERATOR:</span>
                    <span className="font-semibold text-amber-400">{selectedNode.details.operator}</span>
                  </div>
                )}
                {selectedNode.details.balance && (
                  <div className="flex justify-between pt-0.5">
                    <span className="text-slate-500">CURRENT BALANCE:</span>
                    <span className="font-semibold text-emerald-400">{selectedNode.details.balance}</span>
                  </div>
                )}
              </div>

              {/* Intelligence Generation Result (If drafted) */}
              {intelPackage ? (
                <div className="space-y-2 mt-4 animate-fade-in">
                  <span className="text-[10px] text-blue-400 font-mono font-semibold uppercase flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    Court-Admissible Brief (Draft Completed)
                  </span>
                  <div className="bg-[#03060b] border border-slate-900 p-3.5 rounded-xl text-[10px] font-mono text-slate-300 leading-relaxed max-h-[180px] overflow-y-auto whitespace-pre-wrap select-all shadow-inner">
                    {intelPackage}
                  </div>
                </div>
              ) : (
                /* Action Box to trigger Intel Package */
                <form onSubmit={handleGenerateIntelPackage} className="space-y-3 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono font-semibold uppercase block">
                      Case Investigator Notes (Optional)
                    </label>
                    <textarea
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      placeholder="Add specific bank statements tracking, IP resolve dates, or local cyber cell leads..."
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-blue-500/50 font-sans text-[11px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs shadow-lg shadow-blue-950/20 cursor-pointer transition-all uppercase tracking-wider"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        CREATING REPORT...
                      </>
                    ) : (
                      <>
                        <FileSymlink className="w-3.5 h-3.5" />
                        📋 DOWNLOAD INVESTIGATIVE REPORT
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="text-[10px] text-slate-500 font-mono border-t border-slate-900/60 pt-3 mt-4 text-center">
              Adhering to Indian IT Act Section 65B metadata evidence preservation requirements.
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between h-full min-h-[580px]">
            <div className="space-y-4">
              <div className="border-b border-slate-900/60 pb-2 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Suspect Node Directory
                  </h4>
                  <p className="text-[10px] text-slate-500">Directly query suspect files and active laundering wallets</p>
                </div>
                <Network className="w-4 h-4 text-blue-500/50" />
              </div>

              {/* Search input field */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Search suspect name, ID, operator, IP, or bank..."
                  className="w-full bg-slate-950 border border-slate-900 focus:border-blue-500/50 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none font-sans"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-2 text-slate-500 hover:text-slate-300 text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-[420px] overflow-y-auto pr-1">
                {graphNodes
                  .filter(node => 
                    !searchTerm.trim() || 
                    node.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    node.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (node.details?.bank && node.details.bank.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (node.details?.holder && node.details.holder.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (node.details?.ip && node.details.ip.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (node.details?.location && node.details.location.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(node => {
                    const colors = getNodeColor(node.type);
                    return (
                      <button
                        key={node.id}
                        onClick={() => handleNodeClick(node)}
                        className="w-full text-left bg-slate-950/40 hover:bg-slate-900/60 border border-slate-900/80 hover:border-slate-800 p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between gap-3 group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span 
                            className="w-2 h-2 rounded-full shrink-0 group-hover:scale-125 transition-transform" 
                            style={{ backgroundColor: colors.fill }}
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors line-clamp-1">
                              {node.label}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                              ID: {node.id} • Hub: {node.details.location || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded border ${colors.border} bg-[#020509]/80`} style={{ color: colors.fill }}>
                          {colors.text}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="bg-[#03060b]/60 p-3.5 rounded-xl border border-slate-900 text-center space-y-1.5 mt-4">
              <div className="text-[8.5px] font-mono text-cyan-500/80 tracking-widest uppercase">
                Interactive Graph Guide
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Use your mouse to **drag & spin** the 3D graph cluster. Use the **scroll wheel** or bottom-left action buttons to zoom. Highlight any node to load case records.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
