import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCw, RotateCcw, Play, Pause, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { KNOWLEDGE_GRAPH_NODES, KNOWLEDGE_GRAPH_EDGES } from '../data/mockClinicalData';
import { KnowledgeNode, RiskLevel } from '../types/medication';

interface Node3D {
  id: string;
  label: string;
  type: KnowledgeNode['type'];
  category?: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  details: string;
}

interface Edge3D {
  id: string;
  source: string;
  target: string;
  label: string;
  severity: RiskLevel;
  mechanism: string;
}

interface Network3DCanvasProps {
  activeNodeId: string;
  onSelectNode: (nodeId: string) => void;
  filterType: 'all' | 'medicine' | 'food' | 'condition' | 'side-effect';
}

export const Network3DCanvas: React.FC<Network3DCanvasProps> = ({
  activeNodeId,
  onSelectNode,
  filterType,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Rotation angles in radians
  const rotRef = useRef({ yaw: 0.35, pitch: 0.25 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const hoveredNodeIdRef = useRef<string | null>(null);

  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<Node3D | null>(null);

  // Initial 3D Spatial Layout
  const initialNodes: Node3D[] = [
    {
      id: 'warfarin',
      label: 'Warfarin 5mg',
      type: 'medicine',
      category: 'Anticoagulant',
      x: -130,
      y: -70,
      z: 70,
      radius: 17,
      details: 'Vitamin K antagonist oral anticoagulant. Substrate of CYP2C9, CYP3A4, CYP1A2.',
    },
    {
      id: 'ibuprofen',
      label: 'Ibuprofen 400mg',
      type: 'medicine',
      category: 'NSAID',
      x: 120,
      y: -80,
      z: -40,
      radius: 17,
      details: 'Nonsteroidal anti-inflammatory drug inhibiting COX-1/COX-2. Platelet inhibitor.',
    },
    {
      id: 'clopidogrel',
      label: 'Clopidogrel 75mg',
      type: 'medicine',
      category: 'Antiplatelet',
      x: -120,
      y: 90,
      z: -70,
      radius: 17,
      details: 'P2Y12 platelet inhibitor prodrug requiring hepatic CYP2C19 bioactivation.',
    },
    {
      id: 'omeprazole',
      label: 'Omeprazole 20mg',
      type: 'medicine',
      category: 'Proton Pump Inhibitor',
      x: 130,
      y: 80,
      z: 60,
      radius: 17,
      details: 'Gastric acid proton pump inhibitor. Moderate-to-potent inhibitor of CYP2C19.',
    },
    {
      id: 'gi_bleed',
      label: 'Severe GI Bleed',
      type: 'side-effect',
      category: 'Adverse Outcome',
      x: 0,
      y: -20,
      z: 110,
      radius: 15,
      details: 'Critical clinical outcome caused by combined anti-clotting and mucosal erosion.',
    },
    {
      id: 'cyp2c19_block',
      label: 'CYP2C19 Blockade',
      type: 'condition',
      category: 'Metabolic Pathway',
      x: 0,
      y: 110,
      z: 0,
      radius: 15,
      details: 'Enzyme competitive inhibition preventing prodrug active metabolite synthesis.',
    },
    {
      id: 'stent_thrombosis',
      label: 'Coronary Thrombosis',
      type: 'side-effect',
      category: 'Adverse Outcome',
      x: -80,
      y: 150,
      z: -90,
      radius: 15,
      details: 'Inadequate antiplatelet protection increasing acute coronary stent occlusion danger.',
    },
    {
      id: 'leafy_greens',
      label: 'Dietary Vitamin K',
      type: 'food',
      category: 'Dietary Factor',
      x: -180,
      y: -130,
      z: -30,
      radius: 14,
      details: 'Dietary intake of greens directly counteracts the therapeutic efficacy of Warfarin.',
    },
    {
      id: 'grapefruit',
      label: 'Grapefruit Factors',
      type: 'food',
      category: 'Dietary Factor',
      x: 180,
      y: 120,
      z: -70,
      radius: 14,
      details: 'Compounds that irreversibly downregulate gut CYP3A4 enzymes, raising statin bioavailability.',
    },
    {
      id: 'peptic_ulcer',
      label: 'Peptic Ulcer Risk',
      type: 'condition',
      category: 'Pathology',
      x: 160,
      y: -30,
      z: 90,
      radius: 14,
      details: 'Gastric mucosal vulnerability exacerbated by COX-1 prostaglandin suppression.',
    },
  ];

  const edges: Edge3D[] = KNOWLEDGE_GRAPH_EDGES.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    severity: e.severity,
    mechanism: e.mechanism,
  }));

  // Helper colors
  const getNodeColor = (type: KnowledgeNode['type']) => {
    switch (type) {
      case 'medicine':
        return { fill: '#17352F', stroke: '#285C50', text: '#FFFFFF', glow: '#285C50' };
      case 'food':
        return { fill: '#C9792B', stroke: '#D89A28', text: '#FFFFFF', glow: '#D89A28' };
      case 'condition':
        return { fill: '#285C50', stroke: '#3F8068', text: '#FFFFFF', glow: '#3F8068' };
      case 'side-effect':
      default:
        return { fill: '#B6423A', stroke: '#8F2821', text: '#FFFFFF', glow: '#B6423A' };
    }
  };

  const getEdgeColor = (severity: RiskLevel) => {
    switch (severity) {
      case 'high':
        return { stroke: '#B6423A', alpha: 0.85, width: 2.5 };
      case 'moderate':
        return { stroke: '#C9792B', alpha: 0.75, width: 2 };
      default:
        return { stroke: '#285C50', alpha: 0.5, width: 1.5 };
    }
  };

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const fov = 380;
    const cameraDistance = 340;

    const render = () => {
      // Auto-rotation when enabled
      if (isAutoRotating && !isDraggingRef.current) {
        rotRef.current.yaw += 0.0035;
      }

      const { yaw, pitch } = rotRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle background spatial grid / clinical depth rings
      ctx.save();
      ctx.strokeStyle = '#D9E0DC';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 260, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Project all nodes
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      interface ProjectedNode extends Node3D {
        projX: number;
        projY: number;
        projZ: number;
        scale: number;
      }

      const projectedNodes: ProjectedNode[] = initialNodes
        .filter((n) => filterType === 'all' || n.type === filterType)
        .map((node) => {
          // Rotate around Y axis (yaw)
          const x1 = node.x * cosY - node.z * sinY;
          const z1 = node.x * sinY + node.z * cosY;

          // Rotate around X axis (pitch)
          const y2 = node.y * cosP - z1 * sinP;
          const z2 = node.y * sinP + z1 * cosP;

          const distZ = z2 + cameraDistance;
          const scale = fov / Math.max(80, distZ);

          return {
            ...node,
            projX: cx + x1 * scale,
            projY: cy + y2 * scale,
            projZ: z2,
            scale,
          };
        });

      // Sort by depth (painters algorithm: back to front)
      projectedNodes.sort((a, b) => b.projZ - a.projZ);

      // Create lookup map
      const projMap = new Map<string, ProjectedNode>();
      projectedNodes.forEach((pn) => projMap.set(pn.id, pn));

      const currentHighlightId = hoveredNodeIdRef.current || activeNodeId;

      // 1. Render Edges in 3D
      edges.forEach((edge) => {
        const src = projMap.get(edge.source);
        const tgt = projMap.get(edge.target);
        if (!src || !tgt) return;

        const isConnectedToActive =
          currentHighlightId && (edge.source === currentHighlightId || edge.target === currentHighlightId);
        const isDimmed = currentHighlightId && !isConnectedToActive;

        const edgeStyle = getEdgeColor(edge.severity);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(src.projX, src.projY);
        ctx.lineTo(tgt.projX, tgt.projY);

        if (isDimmed) {
          ctx.strokeStyle = '#D9E0DC';
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
        } else if (isConnectedToActive) {
          ctx.strokeStyle = edgeStyle.stroke;
          ctx.globalAlpha = 1;
          ctx.lineWidth = edgeStyle.width * 1.5;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = edgeStyle.stroke;
          ctx.globalAlpha = Math.max(0.2, (src.scale + tgt.scale) / 2 * edgeStyle.alpha);
          ctx.lineWidth = edgeStyle.width;
          ctx.setLineDash([4, 3]);
        }

        ctx.stroke();

        // If active edge, draw animated midpoint particle
        if (isConnectedToActive) {
          const t = (Date.now() % 2000) / 2000;
          const midX = src.projX + (tgt.projX - src.projX) * t;
          const midY = src.projY + (tgt.projY - src.projY) * t;
          ctx.fillStyle = edgeStyle.stroke;
          ctx.beginPath();
          ctx.arc(midX, midY, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 2. Render Nodes in 3D
      projectedNodes.forEach((node) => {
        const isSelected = node.id === currentHighlightId;
        const isConnectedToSelected = edges.some(
          (e) =>
            (e.source === currentHighlightId && e.target === node.id) ||
            (e.target === currentHighlightId && e.source === node.id)
        );
        const isDimmed = currentHighlightId && !isSelected && !isConnectedToSelected;

        const colors = getNodeColor(node.type);
        const r = Math.max(8, node.radius * node.scale);

        ctx.save();

        // Alpha based on depth
        const depthAlpha = Math.min(1, Math.max(0.4, (node.scale - 0.5) / 1.5));
        ctx.globalAlpha = isDimmed ? 0.25 : depthAlpha;

        // Selected halo
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(node.projX, node.projY, r + 8, 0, Math.PI * 2);
          ctx.fillStyle = colors.glow;
          ctx.globalAlpha = 0.2;
          ctx.fill();
        }

        // Main Node Body
        ctx.beginPath();
        ctx.arc(node.projX, node.projY, r, 0, Math.PI * 2);
        ctx.fillStyle = colors.fill;
        ctx.fill();

        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = isSelected ? '#D89A28' : colors.stroke;
        ctx.stroke();

        // Entity Type Icon / Abbreviation
        ctx.fillStyle = colors.text;
        ctx.font = `bold ${Math.max(9, Math.round(10 * node.scale))}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const abbr = node.type === 'medicine' ? 'Rx' : node.type === 'food' ? 'Diet' : node.type === 'side-effect' ? 'Risk' : 'CYP';
        ctx.fillText(abbr, node.projX, node.projY);

        // Label underneath (only if not deeply dimmed)
        if (!isDimmed) {
          ctx.fillStyle = '#17201D';
          ctx.font = `${isSelected ? 'bold' : '600'} ${Math.max(10, Math.round(11 * node.scale))}px "Manrope", sans-serif`;
          ctx.fillText(node.label, node.projX, node.projY + r + 13);
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating, activeNodeId, filterType]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = 420 * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `420px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse / Touch Interaction for 3D rotation & node selection
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMouseRef.current.x;
      const deltaY = e.clientY - lastMouseRef.current.y;
      rotRef.current.yaw += deltaX * 0.008;
      rotRef.current.pitch = Math.max(-0.9, Math.min(0.9, rotRef.current.pitch + deltaY * 0.008));
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    }

    // Hit test nodes for hover
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const fov = 380;
    const cameraDistance = 340;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const cosY = Math.cos(rotRef.current.yaw);
    const sinY = Math.sin(rotRef.current.yaw);
    const cosP = Math.cos(rotRef.current.pitch);
    const sinP = Math.sin(rotRef.current.pitch);

    let closestNode: Node3D | null = null;
    let closestDist = 24; // hit tolerance radius

    initialNodes.forEach((node) => {
      const x1 = node.x * cosY - node.z * sinY;
      const z1 = node.x * sinY + node.z * cosY;
      const y2 = node.y * cosP - z1 * sinP;
      const z2 = node.y * sinP + z1 * cosP;
      const distZ = z2 + cameraDistance;
      const scale = fov / Math.max(80, distZ);
      const projX = cx + x1 * scale;
      const projY = cy + y2 * scale;

      const d = Math.hypot(mouseX - projX, mouseY - projY);
      if (d < closestDist) {
        closestDist = d;
        closestNode = node;
      }
    });

    hoveredNodeIdRef.current = closestNode ? (closestNode as Node3D).id : null;
    setHoveredNode(closestNode);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = () => {
    if (hoveredNodeIdRef.current) {
      onSelectNode(hoveredNodeIdRef.current);
    }
  };

  const handleResetOrientation = () => {
    rotRef.current = { yaw: 0.35, pitch: 0.25 };
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        className="w-full cursor-grab active:cursor-grabbing block"
        style={{ height: '420px' }}
      />

      {/* Floating 3D Controls overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 p-1 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#D9E0DC] rounded-[8px] shadow-sm z-10 text-xs">
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`px-2 py-1 rounded-[6px] font-semibold flex items-center gap-1 transition-colors ${
            isAutoRotating
              ? 'bg-[#17352F] text-[#F7F5EF]'
              : 'text-[#5E6863] hover:text-[#17352F] hover:bg-[#EEF3EF]'
          }`}
          title={isAutoRotating ? 'Pause 3D rotation' : 'Start 3D rotation'}
        >
          {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isAutoRotating ? 'Rotating' : 'Paused'}</span>
        </button>

        <button
          onClick={handleResetOrientation}
          className="p-1 text-[#5E6863] hover:text-[#17352F] hover:bg-[#EEF3EF] rounded-[6px] transition-colors"
          title="Reset 3D camera orientation"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3D Interaction Tip indicator */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] font-mono text-[#5E6863] bg-[#FFFFFF]/80 backdrop-blur-sm px-2.5 py-1 rounded-[6px] border border-[#D9E0DC]">
        <RotateCw className="w-3 h-3 text-[#285C50]" />
        <span>Click & drag to rotate 3D network • Click node to inspect</span>
      </div>

      {/* Tooltip if hovering node */}
      {hoveredNode && (
        <div className="absolute bottom-3 right-3 bg-[#17352F] text-[#F7F5EF] p-2.5 rounded-[8px] text-xs shadow-md border border-[#285C50] max-w-xs animate-fadeIn pointer-events-none">
          <div className="font-bold flex items-center justify-between gap-2">
            <span>{hoveredNode.label}</span>
            <span className="text-[10px] text-[#D89A28] uppercase">{hoveredNode.category}</span>
          </div>
          <p className="text-[11px] text-[#F7F5EF]/80 mt-0.5 line-clamp-2">
            {hoveredNode.details}
          </p>
        </div>
      )}
    </div>
  );
};
