"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as d3 from 'd3-force'
import { cn } from '@/lib/utils'
import type { CharacterWithState } from '@/hooks/useConstellationData'
import { CHARACTER_CONNECTIONS, CHARACTER_COLORS } from '@/lib/constellation/character-positions'

interface ConstellationGraphProps {
    characters: CharacterWithState[]
    onOpenDetail?: (character: CharacterWithState) => void
    width?: number
    height?: number
}

// Force graph node extension
interface SimulationNode extends d3.SimulationNodeDatum {
    id: string
    character: CharacterWithState
    r: number
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
    source: string | SimulationNode
    target: string | SimulationNode
}

export function ConstellationGraph({ characters, onOpenDetail, width = 400, height = 400 }: ConstellationGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [nodes, setNodes] = useState<SimulationNode[]>([])
    const [links, setLinks] = useState<SimulationLink[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    // Initialize simulation data
    useEffect(() => {
        if (!characters.length) return

        // Create nodes only for met characters (or all if desired, but strictly filtered for now)
        const metCharacters = characters.filter(c => c.hasMet)

        const newNodes: SimulationNode[] = metCharacters.map(char => ({
            id: char.id,
            character: char,
            r: char.isMajor ? 25 : 18, // Visual radius
            x: char.position.x * (width / 100), // Initial position from static map
            y: char.position.y * (height / 100)
        }))

        // Create links based on connections between met characters
        const metIds = new Set(metCharacters.map(c => c.id))
        const newLinks: SimulationLink[] = CHARACTER_CONNECTIONS
            .filter(([from, to]) => metIds.has(from) && metIds.has(to))
            .map(([from, to]) => ({
                source: from,
                target: to
            }))

        setNodes(newNodes)
        setLinks(newLinks)
    }, [characters, width, height])

    // D3 Simulation
    useEffect(() => {
        if (!nodes.length || !svgRef.current) return

        const simulation = d3.forceSimulation<SimulationNode>(nodes)
            .force('link', d3.forceLink<SimulationNode, SimulationLink>(links).id(d => d.id).distance(80))
            .force('charge', d3.forceManyBody().strength(-200)) // Repulsion
            .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05)) // Gentle centering
            .force('collide', d3.forceCollide<SimulationNode>().radius(d => d.r * 1.5).iterations(2))

        // Magnetic Cursor Force
        const canvas = svgRef.current
        const handleMouseMove = (event: MouseEvent | TouchEvent) => {
            // Get mouse/touch position relative to SVG
            let clientX, clientY;
            if ('touches' in event) {
                clientX = event.touches[0].clientX
                clientY = event.touches[0].clientY
            } else {
                clientX = (event as MouseEvent).clientX
                clientY = (event as MouseEvent).clientY
            }

            const rect = canvas.getBoundingClientRect()
            const x = clientX - rect.left
            const y = clientY - rect.top

            // Custom simple force: if node is close to mouse, push it away
            simulation.alphaTarget(0.1).restart() // Keep simulation warm

            nodes.forEach(node => {
                if (typeof node.x !== 'number' || typeof node.y !== 'number') return

                const dx = node.x - x
                const dy = node.y - y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const repulsionRadius = 100 // Radius of magnetic effect

                if (distance < repulsionRadius) {
                    const force = (repulsionRadius - distance) / repulsionRadius // 0 to 1
                    const strength = 2 // pixels per tick push
                    // Apply velocity directly for responsiveness
                    node.vx = (node.vx || 0) + (dx / distance) * force * strength
                    node.vy = (node.vy || 0) + (dy / distance) * force * strength
                }
            })
        }

        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('touchmove', handleMouseMove, { passive: false })
        canvas.addEventListener('mouseleave', () => simulation.alphaTarget(0))

        simulation.on('tick', () => {
            setNodes([...nodes])
        })

        // Cleanup
        return () => {
            simulation.stop()
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('touchmove', handleMouseMove)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes.length, links.length, width, height])

    // Interaction Handlers
    const handleNodeClick = (node: SimulationNode) => {
        const isSelected = selectedId === node.id
        setSelectedId(isSelected ? null : node.id)
        if (!isSelected) {
            // Small haptic if available
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(5)
            }
        }
    }

    const handleNodeDoubleClick = (node: SimulationNode) => {
        if (onOpenDetail) onOpenDetail(node.character)
    }

    // Drag behavior (conceptually - simpler to implement with mouse events for now)
    // implementing full d3 drag in React is verbose, using click/hover for "Magnetic" feel first

    const selectedNode = nodes.find(n => n.id === selectedId)

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full max-w-[500px] max-h-[500px] touch-none"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Node Gradients */}
                    <radialGradient id="node-gradient-emerald" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
                    </radialGradient>
                    <radialGradient id="node-gradient-blue" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.4" />
                    </radialGradient>
                    <radialGradient id="node-gradient-amber" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
                    </radialGradient>
                    <radialGradient id="node-gradient-slate" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#475569" stopOpacity="0.4" />
                    </radialGradient>
                </defs>

                {/* Links */}
                <g className="links">
                    {links.map((link) => {
                        const source = link.source as SimulationNode
                        const target = link.target as SimulationNode
                        return (
                            <line
                                key={`${source.id}-${target.id}`}
                                x1={source.x}
                                y1={source.y}
                                x2={target.x}
                                y2={target.y}
                                stroke="rgba(251, 191, 36, 0.2)"
                                strokeWidth="1"
                            />
                        )
                    })}
                </g>

                {/* Nodes */}
                <g className="nodes">
                    {nodes.map(node => {
                        const char = node.character
                        const isSelected = selectedId === node.id
                        const isHovered = hoveredId === node.id
                        const colors = CHARACTER_COLORS[char.color]

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${node.x},${node.y})`}
                                onClick={() => handleNodeClick(node)}
                                onDoubleClick={() => handleNodeDoubleClick(node)}
                                onMouseEnter={() => setHoveredId(node.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="cursor-pointer transition-transform duration-200"
                                style={{ scale: isSelected ? 1.1 : isHovered ? 1.05 : 1 }}
                            >
                                {/* Hit Area */}
                                <circle r={node.r * 1.5} fill="transparent" />

                                {/* Glow Ring */}
                                {(isSelected || char.trustState === 'trusted') && (
                                    <circle
                                        r={node.r + 4}
                                        fill="none"
                                        stroke={colors.ring}
                                        strokeWidth="1"
                                        className={cn(isSelected && "animate-pulse")}
                                        opacity={0.6}
                                    />
                                )}

                                {/* Main Orb */}
                                <circle
                                    r={node.r}
                                    fill={`url(#node-gradient-${colors.bg.replace('bg-', '') === 'slate-500' ? 'slate' : colors.bg.replace('bg-', '').split('-')[0]})`}
                                    className={cn("transition-colors duration-300")}
                                    stroke={colors.ring}
                                    strokeWidth="2"
                                    filter="url(#glow)"
                                />

                                {/* Initial */}
                                <text
                                    dy=".3em"
                                    textAnchor="middle"
                                    className={cn("text-xs font-bold pointer-events-none fill-white")}
                                    style={{ fontSize: node.r * 0.8 }}
                                >
                                    {char.name[0]}
                                </text>

                                {/* Floating Label on Hover/Select */}
                                <AnimatePresence>
                                    {(isHovered || isSelected) && (
                                        <motion.g
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                        >
                                            <text
                                                y={node.r + 15}
                                                textAnchor="middle"
                                                className="text-[10px] fill-white font-medium uppercase tracking-widest pointer-events-none shadow-black drop-shadow-md"
                                            >
                                                {char.name}
                                            </text>
                                        </motion.g>
                                    )}
                                </AnimatePresence>
                            </g>
                        )
                    })}
                </g>
            </svg>

            {/* Interaction Hint */}
            <div className="absolute bottom-4 text-center pointer-events-none opacity-50">
                <p className="text-[10px] text-slate-400">
                    {selectedNode ? "Double-tap to view story" : "Drag to explore • Tap to identify"}
                </p>
            </div>
        </div>
    )
}
