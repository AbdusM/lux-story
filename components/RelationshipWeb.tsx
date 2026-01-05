'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as D3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'
import { useRelationshipGraph, GraphNode, GraphLink } from '@/lib/hooks/use-relationship-graph'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

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

    // Hover state


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
            .force('link', D3.forceLink<SimulationNode, SimulationLink>(simLinks).id(d => d.id).distance(150))
            .force('charge', D3.forceManyBody().strength(-400))
            .force('center', D3.forceCenter(width / 2, height / 2))
            .force('collide', D3.forceCollide().radius(40))

        // Update state on tick to trigger React render
        // Note: For large graphs, direct DOM manipulation is faster. 
        // For <50 nodes, React state update is fine and easier to maintain.
        simulation.on('tick', () => {
            setSimNodes([...simNodes]) // Trigger re-render
            setSimLinks([...simLinks])
        })

        return () => {
            simulation.stop()
        }
    }, [simNodes, simLinks, width, height])

    // Drag Behavior (Optional - simplified for now to just click/hover)
    // ...

    // Helper: Get connection color based on type
    const getLinkColor = (type: string) => {
        switch (type) {
            case 'ally': return '#10b981' // emerald-500
            case 'mentor': return '#3b82f6' // blue-500
            case 'protege': return '#8b5cf6' // violet-500
            case 'rival': return '#f59e0b' // amber-500
            case 'parallel': return '#ec4899' // pink-500
            case 'complicated': return '#ef4444' // red-500
            default: return '#64748b' // slate-500
        }
    }

    return (
        <div className={cn("relative w-full h-[600px] bg-slate-950/50 rounded-xl overflow-hidden border border-slate-800", className)}>

            {/* 1. Edges Layer (SVG) */}
            <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 ${width} ${height}`}
            >
                <defs>
                    <marker id="arrow" viewBox="0 -5 10 10" refX="25" refY="0" markerWidth="6" markerHeight="6" orient="auto" fill="#475569">
                        <path d="M0,-5L10,0L0,5" />
                    </marker>
                </defs>
                <AnimatePresence>
                    {simLinks.map((link) => {
                        const source = link.source as unknown as SimulationNode // D3 replaces ID with object
                        const target = link.target as unknown as SimulationNode

                        if (!source.x || !target.x) return null

                        // const isSelected = selectedEdge?.id === link.id

                        return (
                            <motion.g
                                key={link.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <line
                                    x1={source.x}
                                    y1={source.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke={getLinkColor(link.type)}
                                    strokeWidth={link.intensity / 2}
                                    strokeOpacity={0.6}
                                    strokeDasharray={link.type === 'parallel' ? '5,5' : 'none'}
                                // pointerEvents="auto" // Enable clicking on lines
                                // onClick={() => setSelectedEdge(link)}
                                // className="cursor-pointer hover:stroke-white transition-colors"
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
                        >
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <div className="relative group">
                                            {/* Status Ring */}
                                            <div
                                                className="absolute -inset-1 rounded-full opacity-70 group-hover:opacity-100 transition-opacity blur-[2px]"
                                                style={{ backgroundColor: node.trust >= 8 ? '#fcd34d' : '#94a3b8' }} // Gold trigger for high trust
                                            />

                                            <Avatar className="w-12 h-12 border-2 border-slate-900 bg-slate-800">
                                                {/* Placeholder generic images or initials */}
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

            {/* 3. Empty State (if no relationships) */}
            {simNodes.length <= 1 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-slate-500 italic max-w-xs text-center">
                        The web is silent. Meet others to reveal connections.
                    </p>
                </div>
            )}

            {/* 4. Legend (Bottom Right) */}
            <div className="absolute bottom-4 right-4 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 backdrop-blur-sm">
                <div className="font-bold mb-2 text-slate-300">Connections</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Ally</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Mentor</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Rival</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500" /> Parallel</div>
                </div>
            </div>

        </div>
    )
}
