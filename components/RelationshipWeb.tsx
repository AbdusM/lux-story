'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as D3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'
import { useRelationshipGraph, GraphNode, GraphLink } from '@/lib/hooks/use-relationship-graph'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { X, Quote } from 'lucide-react'
import { TRUST_STATE_THRESHOLDS } from '@/lib/constants'

// Force Simulation Types
type SimulationNode = D3.SimulationNodeDatum & GraphNode
type SimulationLink = D3.SimulationLinkDatum<SimulationNode> & GraphLink

interface RelationshipWebProps {
    width?: number
    height?: number
    className?: string
}

export function RelationshipWeb({ width = 800, height = 600, className }: RelationshipWebProps) {
    const { nodes, links } = useRelationshipGraph()
    const svgRef = useRef<SVGSVGElement>(null)

    // State for D3 simulation data (mutable for D3)
    const [simNodes, setSimNodes] = useState<SimulationNode[]>([])
    const [simLinks, setSimLinks] = useState<SimulationLink[]>([])
    const [selectedEdge, setSelectedEdge] = useState<SimulationLink | null>(null)

    // Initialize Simulation Data
    useEffect(() => {
        // Deep copy to prevent mutation of hook data during re-renders
        const newNodes: SimulationNode[] = nodes.map(n => ({ ...n }))
        const newLinks: SimulationLink[] = links.map(l => ({ ...l }))

        setSimNodes(newNodes)
        setSimLinks(newLinks)
    }, [nodes, links]) // Re-run only when graph topology changes

    // Run Simulation
    useEffect(() => {
        if (!simNodes.length) return

        const simulation = D3.forceSimulation<SimulationNode>(simNodes)
            .force('link', D3.forceLink<SimulationNode, SimulationLink>(simLinks).id(d => d.id).distance(180))
            .force('charge', D3.forceManyBody().strength(-400))
            .force('center', D3.forceCenter(width / 2, height / 2))
            .force('collide', D3.forceCollide().radius(50))

        simulation.on('tick', () => {
            setSimNodes([...simNodes])
            setSimLinks([...simLinks])
        })

        return () => {
            simulation.stop()
        }
    }, [simNodes, simLinks, width, height])

    // Helper: Get connection color based on type
    const getLinkColor = (type: string) => {
        switch (type) {
            case 'ally': return '#10b981' // emerald-500
            case 'mentor': return '#3b82f6' // blue-500
            case 'protege': return '#8b5cf6' // violet-500
            case 'rival': return '#f59e0b' // amber-500
            case 'parallel': return '#ec4899' // pink-500
            case 'complicated': return '#ef4444' // red-500
            case 'former': return '#94a3b8' // slate-400
            default: return '#64748b' // slate-500
        }
    }

    return (
        <div className={cn("relative w-full h-[600px] bg-slate-950/50 rounded-xl overflow-hidden border border-slate-800", className)}>

            {/* 1. Edges Layer (SVG) */}
            <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${width} ${height}`}
            >
                <AnimatePresence>
                    {simLinks.map((link) => {
                        const source = link.source as unknown as SimulationNode
                        const target = link.target as unknown as SimulationNode

                        if (!source.x || !target.x) return null

                        const isSelected = selectedEdge?.id === link.id

                        return (
                            <motion.g
                                key={link.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedEdge(link)
                                }}
                                className="cursor-pointer group"
                            >
                                {/* Invisible Hit Area */}
                                <line
                                    x1={source.x}
                                    y1={source.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke="transparent"
                                    strokeWidth={30}
                                />
                                {/* Visibile Line */}
                                <line
                                    x1={source.x}
                                    y1={source.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke={getLinkColor(link.type)}
                                    strokeWidth={isSelected ? Math.max(3, link.intensity) : Math.max(1, link.intensity / 2)}
                                    strokeOpacity={isSelected ? 1 : 0.6}
                                    strokeDasharray={link.type === 'parallel' ? '5,5' : 'none'}
                                    className="transition-all duration-300 group-hover:stroke-white group-hover:stroke-opacity-100"
                                />
                            </motion.g>
                        )
                    })}
                </AnimatePresence>
            </svg>

            {/* 2. Nodes Layer (HTML/React) */}
            {simNodes.map((node) => (
                <React.Fragment key={node.id}>
                    {node.x && node.y && (
                        <motion.div
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                            style={{ left: node.x, top: node.y }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setSelectedEdge(null)} // Deselect edge when clicking node
                        >
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <div className="relative group">
                                            {/* Status Ring */}
                                            <div
                                                className="absolute -inset-1 rounded-full opacity-70 group-hover:opacity-100 transition-opacity blur-[2px]"
                                                style={{ backgroundColor: node.trust >= TRUST_STATE_THRESHOLDS.deep ? '#fcd34d' : '#94a3b8' }}
                                            />

                                            <Avatar className="w-12 h-12 border-2 border-slate-900 bg-slate-800">
                                                <AvatarFallback className="bg-slate-700 text-slate-200 text-sm font-bold">
                                                    {node.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* Trust Badge */}
                                            <div className="absolute -bottom-1 -right-1 bg-slate-900 text-2xs text-slate-400 px-1.5 py-0.5 rounded-full border border-slate-700 font-mono">
                                                {node.trust}
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-slate-900 border-slate-800 text-slate-200">
                                        <p className="font-bold">{node.name}</p>
                                        <p className="text-xs text-slate-400 capitalize">{node.relationshipStatus}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </motion.div>
                    )}
                </React.Fragment>
            ))}

            {/* 3. Echo Panel (Detail View) */}
            <AnimatePresence>
                {selectedEdge && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-4 left-4 w-96 bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-xl backdrop-blur-md overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                    <span style={{ color: getLinkColor(selectedEdge.type) }}>●</span>
                                    {selectedEdge.type.toUpperCase()}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    {(selectedEdge.source as unknown as SimulationNode).name} &rarr; {(selectedEdge.target as unknown as SimulationNode).name}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedEdge(null)}
                                className="text-slate-500 hover:text-slate-200 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Intensity Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-2xs text-slate-500 mb-1 uppercase tracking-wider">
                                <span>Intensity</span>
                                <span>{selectedEdge.intensity}/10</span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-slate-200"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${selectedEdge.intensity * 10}%` }}
                                    style={{ backgroundColor: getLinkColor(selectedEdge.type) }}
                                />
                            </div>
                        </div>

                        {/* Echo (Opinion) */}
                        <div className="relative bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                            <Quote size={16} className="absolute top-3 left-3 text-slate-700" />
                            <p className="text-sm text-slate-300 italic pl-6 leading-relaxed">
                                &quot;
                                {(selectedEdge.source as unknown as SimulationNode).trust >= 7
                                    ? selectedEdge.privateOpinion
                                    : selectedEdge.publicOpinion}
                                &quot;
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. Legend (Bottom Right) */}
            <div className="absolute bottom-4 right-4 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 backdrop-blur-sm pointer-events-none">
                <div className="font-bold mb-2 text-slate-300">Connections</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLinkColor('ally') }} /> Ally</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLinkColor('mentor') }} /> Mentor</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLinkColor('rival') }} /> Rival</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLinkColor('parallel') }} /> Parallel</div>
                </div>
            </div>
        </div>
    )
}
