import React, { useState } from 'react';
import {
  Network,
  Activity,
  Layers,
  Info,
  Maximize2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Coffee,
  Pill,
  HeartPulse,
  Box,
} from 'lucide-react';
import { KNOWLEDGE_GRAPH_NODES, KNOWLEDGE_GRAPH_EDGES } from '../data/mockClinicalData';
import { KnowledgeNode, KnowledgeEdge, RiskLevel } from '../types/medication';
import { Network3DCanvas } from './Network3DCanvas';

export const InteractionGraph: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('warfarin');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'medicine' | 'food' | 'condition' | 'side-effect'>('all');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  const activeNodeId = hoveredNodeId || selectedNodeId;
  const activeNode = KNOWLEDGE_GRAPH_NODES.find((n) => n.id === activeNodeId);

  // Find connected edge IDs
  const connectedEdges = KNOWLEDGE_GRAPH_EDGES.filter(
    (e) => e.source === activeNodeId || e.target === activeNodeId
  );

  const connectedNodeIds = new Set<string>();
  if (activeNodeId) {
    connectedNodeIds.add(activeNodeId);
    connectedEdges.forEach((e) => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });
  }

  // Filter nodes according to current filter
  const displayedNodes = KNOWLEDGE_GRAPH_NODES.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getNodeColor = (type: KnowledgeNode['type']) => {
    switch (type) {
      case 'medicine':
        return {
          bg: '#17352F',
          border: '#285C50',
          text: '#FFFFFF',
          accent: '#D89A28',
          label: 'Pharmaceutical',
        };
      case 'food':
        return {
          bg: '#C9792B',
          border: '#D89A28',
          text: '#FFFFFF',
          accent: '#F7F5EF',
          label: 'Dietary Factor',
        };
      case 'condition':
        return {
          bg: '#285C50',
          border: '#3F8068',
          text: '#FFFFFF',
          accent: '#FFFFFF',
          label: 'Pathway / Condition',
        };
      case 'side-effect':
      default:
        return {
          bg: '#B6423A',
          border: '#8F2821',
          text: '#FFFFFF',
          accent: '#FFFFFF',
          label: 'Adverse Outcome',
        };
    }
  };

  return (
    <section id="knowledge-graph" className="py-16 md:py-24 border-b border-[#D9E0DC]/60">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-[720px] space-y-2">
            <div className="inline-flex items-center gap-2">
              <Network className="w-4 h-4 text-[#285C50]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#285C50] font-heading">
                Pharmacological Topology
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#17352F] tracking-tight">
              Medication Intelligence Graph
            </h2>
            <p className="text-base text-[#5E6863]">
              Interactive mapping of pharmacokinetic interactions, CYP enzyme competitive pathways, dietary contraindications, and clinical outcomes.
            </p>
          </div>

          {/* View Mode Toggle & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 3D vs 2D Switcher */}
            <div className="flex items-center p-1 bg-[#EEF3EF] border border-[#D9E0DC] rounded-[8px]">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1.5 text-xs font-bold rounded-[6px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-[#17352F] text-[#F7F5EF] shadow-sm'
                    : 'text-[#5E6863] hover:text-[#17352F]'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Spatial Network</span>
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`px-3 py-1.5 text-xs font-bold rounded-[6px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === '2d'
                    ? 'bg-[#17352F] text-[#F7F5EF] shadow-sm'
                    : 'text-[#5E6863] hover:text-[#17352F]'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>2D Schematic</span>
              </button>
            </div>

            {/* Node Category Filter Bar */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#FFFFFF] border border-[#D9E0DC] rounded-[8px] shadow-sm">
              {[
                { id: 'all', label: 'All' },
                { id: 'medicine', label: 'Medicines' },
                { id: 'food', label: 'Dietary' },
                { id: 'condition', label: 'Pathways' },
                { id: 'side-effect', label: 'Adverse' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-[5px] transition-colors cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-[#285C50] text-[#FFFFFF] shadow-sm'
                      : 'text-[#5E6863] hover:text-[#17352F] hover:bg-[#EEF3EF]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Graph Arena Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Visual Graph Arena (3D Canvas or 2D SVG) */}
          <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#D9E0DC] rounded-[18px] p-4 sm:p-6 shadow-[0_8px_24px_rgba(23,53,47,0.08)] relative overflow-hidden min-h-[480px]">
            
            {/* Top Toolbar overlay */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E0DC]/70 text-xs text-[#5E6863]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3F8068] animate-pulse" />
                <span className="font-mono text-[11px] font-semibold text-[#17352F]">
                  {viewMode === '3d'
                    ? '3D Spatial Graph • Drag to rotate camera • Click node to inspect details'
                    : '2D Schematic Topology • Hover or tap nodes to trace biochemical flow'}
                </span>
              </div>
              <span className="text-[11px] font-mono">
                {displayedNodes.length} Entities • {KNOWLEDGE_GRAPH_EDGES.length} Pathways
              </span>
            </div>

            {/* View Mode Switch Rendering */}
            {viewMode === '3d' ? (
              <Network3DCanvas
                activeNodeId={activeNodeId}
                onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
                filterType={activeFilter}
              />
            ) : (
              /* SVG Interactive 2D Canvas */
              <div className="relative w-full h-[420px] overflow-hidden my-2">
                <svg
                  viewBox="0 0 640 480"
                  className="w-full h-full select-none"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(23,53,47,0.04))' }}
                >
                  <defs>
                    <marker
                      id="arrow-high"
                      viewBox="0 0 10 10"
                      refX="22"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#B6423A" />
                    </marker>
                    <marker
                      id="arrow-mod"
                      viewBox="0 0 10 10"
                      refX="22"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9792B" />
                    </marker>
                  </defs>

                  {/* Connecting Edges */}
                  {KNOWLEDGE_GRAPH_EDGES.map((edge) => {
                    const src = KNOWLEDGE_GRAPH_NODES.find((n) => n.id === edge.source);
                    const tgt = KNOWLEDGE_GRAPH_NODES.find((n) => n.id === edge.target);
                    if (!src || !tgt) return null;

                    const isConnectedToActive =
                      edge.source === activeNodeId || edge.target === activeNodeId;
                    const isDimmed = activeNodeId && !isConnectedToActive;

                    const strokeColor =
                      edge.severity === 'high'
                        ? '#B6423A'
                        : edge.severity === 'moderate'
                        ? '#C9792B'
                        : '#285C50';

                    return (
                      <g key={edge.id} className="transition-all duration-300">
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={tgt.x}
                          y2={tgt.y}
                          stroke={strokeColor}
                          strokeWidth={isConnectedToActive ? 2.75 : 1.5}
                          strokeDasharray={isConnectedToActive ? 'none' : '4 3'}
                          strokeOpacity={isDimmed ? 0.15 : isConnectedToActive ? 1 : 0.45}
                          markerEnd={
                            edge.severity === 'high'
                              ? 'url(#arrow-high)'
                              : 'url(#arrow-mod)'
                          }
                        />
                        {isConnectedToActive && (
                          <text
                            x={(src.x + tgt.x) / 2}
                            y={(src.y + tgt.y) / 2 - 6}
                            fontSize="9"
                            fill="#17352F"
                            fontWeight="bold"
                            textAnchor="middle"
                            className="bg-white px-1 font-mono"
                          >
                            {edge.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {displayedNodes.map((node) => {
                    const isSelected = node.id === activeNodeId;
                    const isNeighbor = connectedNodeIds.has(node.id);
                    const isDimmed = activeNodeId && !isNeighbor;
                    const colors = getNodeColor(node.type);

                    return (
                      <g
                        key={node.id}
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onClick={() => setSelectedNodeId(node.id)}
                      >
                        {isSelected && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={28}
                            fill={colors.accent}
                            fillOpacity={0.2}
                            className="animate-ping"
                          />
                        )}

                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isSelected ? 20 : 16}
                          fill={colors.bg}
                          stroke={isSelected ? '#D89A28' : colors.border}
                          strokeWidth={isSelected ? 3 : 1.5}
                          opacity={isDimmed ? 0.25 : 1}
                          className="transition-all duration-200 hover:scale-110"
                        />

                        <text
                          x={node.x}
                          y={node.y + 4}
                          fontSize={isSelected ? '11' : '10'}
                          fontWeight="bold"
                          fill={colors.text}
                          textAnchor="middle"
                          pointerEvents="none"
                          opacity={isDimmed ? 0.25 : 1}
                        >
                          {node.type === 'medicine'
                            ? 'Rx'
                            : node.type === 'food'
                            ? 'Diet'
                            : node.type === 'side-effect'
                            ? 'Risk'
                            : 'CYP'}
                        </text>

                        <text
                          x={node.x}
                          y={node.y + (isSelected ? 32 : 27)}
                          fontSize="11"
                          fontWeight={isSelected ? '800' : '600'}
                          fill="#17201D"
                          textAnchor="middle"
                          pointerEvents="none"
                          opacity={isDimmed ? 0.3 : 1}
                          fontFamily="var(--font-heading)"
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Bottom Legend */}
            <div className="pt-3 border-t border-[#D9E0DC]/70 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5E6863]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#17352F]" />
                  <span>Medicine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#C9792B]" />
                  <span>Dietary Factor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#285C50]" />
                  <span>CYP Pathway</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#B6423A]" />
                  <span>Adverse Risk</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#285C50]">
                {viewMode === '3d' ? '3D Spatial projection enabled' : 'Click any node to inspect'}
              </div>
            </div>
          </div>

          {/* Right Inspector Detail Panel */}
          <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#D9E0DC] rounded-[18px] p-6 shadow-[0_8px_24px_rgba(23,53,47,0.08)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E0DC]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#285C50]" />
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#285C50]">
                  Entity Inspector
                </span>
              </div>
              {activeNode && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-[4px] bg-[#EEF3EF] text-[#17352F]">
                  {activeNode.category}
                </span>
              )}
            </div>

            {activeNode ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-extrabold text-xl text-[#17352F]">
                    {activeNode.label}
                  </h3>
                  <div className="text-xs font-semibold text-[#285C50] mt-0.5 capitalize">
                    Classification: {activeNode.type.replace('-', ' ')}
                  </div>
                </div>

                <div className="p-3.5 bg-[#EEF3EF] rounded-[10px] text-xs text-[#17201D] leading-relaxed">
                  {activeNode.details}
                </div>

                {/* Direct Pharmacological Connections List */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#5E6863] font-heading">
                    Active Pathways ({connectedEdges.length})
                  </div>

                  {connectedEdges.length > 0 ? (
                    <div className="space-y-2">
                      {connectedEdges.map((edge) => {
                        const otherNodeId =
                          edge.source === activeNodeId ? edge.target : edge.source;
                        const otherNode = KNOWLEDGE_GRAPH_NODES.find((n) => n.id === otherNodeId);

                        return (
                          <div
                            key={edge.id}
                            onClick={() => setSelectedNodeId(otherNodeId)}
                            className="p-3 bg-[#FFFFFF] hover:bg-[#F7F5EF] border border-[#D9E0DC] rounded-[8px] cursor-pointer transition-colors space-y-1"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#17352F]">
                                ➔ {otherNode?.label}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                  edge.severity === 'high'
                                    ? 'bg-[#B6423A]/10 text-[#B6423A]'
                                    : 'bg-[#C9792B]/10 text-[#C9792B]'
                                }`}
                              >
                                {edge.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#5E6863]">
                              {edge.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-[#5E6863] p-3 bg-[#EEF3EF] rounded-[8px]">
                      No outgoing edges under this selection filter.
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#D9E0DC] text-[11px] text-[#5E6863]">
                  Clinical Topology powered by WebSafe Pharmacological Knowledge Engine.
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-[#5E6863]">
                Hover or select a node in the graph to view clinical pathways.
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

