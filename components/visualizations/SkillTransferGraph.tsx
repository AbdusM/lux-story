"use client"

import React, { useEffect, useRef, useMemo, useState } from 'react'
import * as d3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { buildSkillNetwork, SkillNetworkNode, SkillNetworkEdge, getSkillTransfers } from '@/lib/assessment-derivatives'
import { useGameStore, GameState, GameActions } from '@/lib/game-store'

interface SkillTransferGraphProps {
    className?: string
    width?: number
    height?: number
}

// Extend d3 SimulationNodeDatum to include our properties
interface SimulatedNode extends d3.SimulationNodeDatum, SkillNetworkNode {
    x?: number
    y?: number
}

// Fix: Omit source/target from SkillNetworkEdge to avoid conflict with D3's source/target types
interface SimulatedLink extends d3.SimulationLinkDatum<SimulatedNode>, Omit<SkillNetworkEdge, 'source' | 'target'> {
    source: SimulatedNode | string
    target: SimulatedNode | string
}

export function SkillTransferGraph({ className, width = 600, height = 400 }: SkillTransferGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [hoveredNode, setHoveredNode] = useState<SimulatedNode | null>(null)

    // Get current skill levels from store
    const skills = useGameStore((state: GameState & GameActions) => state.skills)

    // Memoize the network data
    const data = useMemo(() => {
        const rawData = buildSkillNetwork((skills || {}) as unknown as Record<string, number>)
        // Create deep copies for D3 mutation
        const nodes: SimulatedNode[] = rawData.nodes.map(n => ({ ...n }))
        const links: SimulatedLink[] = rawData.edges.map(e => ({ ...e }))
        return { nodes, links }
    }, [skills])

    useEffect(() => {
        if (!svgRef.current || data.nodes.length === 0) return

        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove() // Clear previous render

        // Define colors
        const colors = {
            skill: '#3b82f6', // blue-500
            domain: '#10b981', // emerald-500
            career: '#8b5cf6', // violet-500
            link: 'rgba(148, 163, 184, 0.2)', // slate-400 equivalent
            text: '#e2e8f0' // slate-200
        }

        // Simulation Setup
        const simulation = d3.forceSimulation<SimulatedNode>(data.nodes)
            .force("link", d3.forceLink<SimulatedNode, SimulatedLink>(data.links)
                .id(d => d.id)
                .distance(d => d.weight ? 100 - d.weight * 5 : 80) // Stronger skills = shorter links
            )
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(d => (d as SimulatedNode).size / 2 + 10))

        // Draw Links
        const link = svg.append("g")
            .attr("stroke", colors.link)
            .attr("stroke-width", 1.5)
            .selectAll("line")
            .data(data.links)
            .join("line")

        // Draw Nodes
        const node = svg.append("g")
            .selectAll("g")
            .data(data.nodes)
            .join("g")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .call(drag(simulation) as any)
            .on('mouseover', (event, d) => setHoveredNode(d))
            .on('mouseout', () => setHoveredNode(null))

        // Node Circles
        node.append("circle")
            .attr("r", d => Math.max(d.size / 2, 5)) // Ensure min size
            .attr("fill", d =>
                d.type === 'skill' ? colors.skill :
                    d.type === 'domain' ? colors.domain : colors.career
            )
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("opacity", 0.9)

        // Node Labels
        node.append("text")
            .attr("x", d => d.size / 2 + 5)
            .attr("y", 4)
            .text(d => d.label)
            .attr("font-family", "Inter, sans-serif")
            .attr("font-size", d => d.type === 'domain' ? "12px" : "10px")
            .attr("fill", colors.text)
            .style("pointer-events", "none")
            .attr("font-weight", d => d.type === 'domain' ? "bold" : "normal")

        // Update positions on tick
        simulation.on("tick", () => {
            link
                .attr("x1", d => (d.source as SimulatedNode).x!)
                .attr("y1", d => (d.source as SimulatedNode).y!)
                .attr("x2", d => (d.target as SimulatedNode).x!)
                .attr("y2", d => (d.target as SimulatedNode).y!)

            node
                .attr("transform", d => `translate(${d.x},${d.y})`)
        })

        // Drag Helper
        function drag(simulation: d3.Simulation<SimulatedNode, undefined>) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart()
                event.subject.fx = event.subject.x
                event.subject.fy = event.subject.y
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function dragged(event: any) {
                event.subject.fx = event.x
                event.subject.fy = event.y
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0)
                event.subject.fx = null
                event.subject.fy = null
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
        }

        // Cleanup
        return () => {
            simulation.stop()
        }
    }, [data, width, height, skills])


    // If no skills, show empty state
    if (!skills || Object.keys(skills).length === 0) {
        return (
            <div className={`flex items-center justify-center bg-slate-900/50 rounded-lg border border-slate-800 ${className}`} style={{ width, height }}>
                <p className="text-slate-400">No skill data available to visualize.</p>
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            <svg
                ref={svgRef}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="bg-slate-950 rounded-lg border border-slate-800/50 w-full h-auto"
                style={{ maxWidth: '100%' }}
            />

            {/* Tooltip Overlay */}
            <AnimatePresence>
                {hoveredNode && hoveredNode.type === 'skill' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-4 left-4 z-10"
                    >
                        <Card className="p-3 bg-slate-900/90 backdrop-blur border-blue-500/30 w-64 shadow-xl">
                            <h4 className="font-bold text-blue-400">{hoveredNode.label}</h4>
                            <p className="text-xs text-slate-400 mt-1">
                                Level {(hoveredNode.size / 10).toFixed(1)}
                            </p>
                            {(() => {
                                const transfer = getSkillTransfers(hoveredNode.id)
                                if (!transfer) return null
                                return (
                                    <div className="mt-2 text-xs">
                                        <div className="font-medium text-emerald-400 mb-1">Transferable To:</div>
                                        <ul className="list-disc pl-4 text-slate-300">
                                            {transfer.toDomains.slice(0, 3).map(d => (
                                                <li key={d}>{d}</li>
                                            ))}
                                            {transfer.toDomains.length > 3 && (
                                                <li>+{transfer.toDomains.length - 3} more</li>
                                            )}
                                        </ul>
                                    </div>
                                )
                            })()}
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
