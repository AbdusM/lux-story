"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useConstellationData } from "@/hooks/useConstellationData"
import { SKILL_CLUSTERS, type SkillCluster } from "@/lib/constellation/skill-positions"

/**
 * Essence Sigil (The Soul Radar)
 * Visualizes the user's capability profile across the 6 dimensions.
 * 
 * Geometry: Hexagon
 * Vertices:
 * - Top: Mind (-90°)
 * - Top-Right: Voice (-30°)
 * - Bottom-Right: Compass (30°)
 * - Bottom: Craft (90°)
 * - Bottom-Left: Hands (150°)
 * - Top-Left: Heart (210°)
 */

const ORDERED_CLUSTERS: SkillCluster[] = ['mind', 'voice', 'compass', 'craft', 'hands', 'heart']

const CENTER = { x: 150, y: 150 }
const RADIUS = 100

export function EssenceSigil() {
    const { skills } = useConstellationData()

    // Calculate scores per cluster (0 to 1) - must be before any early returns (React hooks rules)
    const clusterScores = useMemo(() => {
        // Handle null/empty skills case
        if (!skills || skills.length === 0) {
            const scores: Record<string, number> = {}
            ORDERED_CLUSTERS.forEach(cluster => {
                scores[cluster] = 0.1 // Base presence for loading state
            })
            return scores
        }

        const scores: Record<string, number> = {}

        ORDERED_CLUSTERS.forEach(cluster => {
            const clusterSkills = skills.filter(s => s.cluster === cluster)
            if (clusterSkills.length === 0) {
                scores[cluster] = 0.1 // Base presence
                return
            }
            // Count "awakened" skills (demonstrationCount > 0)
            const unlocked = clusterSkills.filter(s => s.state !== 'dormant').length
            const total = clusterSkills.length
            // Base score: % of skills unlocked.
            // Show true 0% for dormant clusters - let the shape collapse to show growth potential
            scores[cluster] = unlocked / total
        })
        return scores
    }, [skills])

    // Null guard: show loading state if skills not yet available
    if (!skills || skills.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 space-y-6 min-h-[400px]">
                <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-600 animate-pulse" />
                </div>
                <p className="text-xs text-slate-500 animate-pulse">Essence forming...</p>
            </div>
        )
    }

    // Generate Path Data
    const generatePath = (scaleFunction: (cluster: string) => number) => {
        return ORDERED_CLUSTERS.map((cluster, i) => {
            const angleDeg = -90 + (i * 60)
            const angleRad = (angleDeg * Math.PI) / 180
            const r = RADIUS * scaleFunction(cluster)
            const x = CENTER.x + r * Math.cos(angleRad)
            const y = CENTER.y + r * Math.sin(angleRad)
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
        }).join(" ") + " Z"
    }

    const _fullHexagonPath = generatePath(() => 1) // Full potential (radius 100%) - reserved for future use
    const soulPath = generatePath((c) => clusterScores[c]) // Actual capability

    // Calculate total progress for label
    const totalUnlocked = skills.filter(s => s.state !== 'dormant').length
    const totalSkills = skills.length
    const _resonanceLevel = Math.round((totalUnlocked / totalSkills) * 100) // Reserved for future use

    return (
        <div className="flex flex-col items-center justify-center py-8 space-y-6 min-h-[400px]">

            {/* The Radar */}
            <div className="relative w-[300px] h-[300px]">
                <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                    <defs>
                        <radialGradient id="soulGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" /> {/* Violet Center */}
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" /> {/* Blue Edge */}
                        </radialGradient>
                    </defs>

                    {/* 1. Background Grid (Web) */}
                    {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                        <path
                            key={i}
                            d={generatePath(() => scale)}
                            fill="none"
                            stroke="currentColor"
                            strokeOpacity={i === 3 ? 0.3 : 0.1}
                            className="text-slate-300 dark:text-slate-600"
                        />
                    ))}

                    {/* 2. Axis Lines */}
                    {ORDERED_CLUSTERS.map((_, i) => {
                        const angleDeg = -90 + (i * 60)
                        const angleRad = (angleDeg * Math.PI) / 180
                        const x = CENTER.x + RADIUS * Math.cos(angleRad)
                        const y = CENTER.y + RADIUS * Math.sin(angleRad)
                        return (
                            <line
                                key={i}
                                x1={CENTER.x} y1={CENTER.y}
                                x2={x} y2={y}
                                stroke="currentColor"
                                strokeOpacity="0.1"
                                className="text-slate-300 dark:text-slate-600"
                            />
                        )
                    })}

                    {/* 3. The Soul Shape (Dynamic) */}
                    <motion.path
                        d={soulPath}
                        fill="url(#soulGradient)"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                        initial={{ d: generatePath(() => 0.1) }}
                        animate={{ d: soulPath }}
                        transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
                        className="drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                    />

                    {/* 4. Vertices (Dots) */}
                    {ORDERED_CLUSTERS.map((cluster, i) => {
                        const score = clusterScores[cluster]
                        const angleDeg = -90 + (i * 60)
                        const angleRad = (angleDeg * Math.PI) / 180
                        const r = RADIUS * score
                        const x = CENTER.x + r * Math.cos(angleRad)
                        const y = CENTER.y + r * Math.sin(angleRad)

                        // Label Position (pushed out slightly)
                        const labelR = RADIUS + 25
                        const labelX = CENTER.x + labelR * Math.cos(angleRad)
                        const labelY = CENTER.y + labelR * Math.sin(angleRad)

                        return (
                            <g key={cluster}>
                                {/* Data Dot */}
                                <motion.circle
                                    cx={x} cy={y}
                                    r={4}
                                    fill={SKILL_CLUSTERS[cluster].color}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, cx: x, cy: y }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                />

                                {/* Label Group */}
                                <g transform={`translate(${labelX}, ${labelY})`}>
                                    <text
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-[10px] font-bold uppercase tracking-widest fill-slate-500 dark:fill-slate-400 font-sans"
                                    >
                                        {SKILL_CLUSTERS[cluster].name}
                                    </text>
                                    <text
                                        y={12}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-[8px] fill-slate-400 dark:fill-slate-500 font-mono"
                                    >
                                        {Math.round(score * 100)}%
                                    </text>
                                </g>
                            </g>
                        )
                    })}
                </svg>
            </div>

            {/* Status Footer */}
            <div className="text-center space-y-2">
                <h3 className="text-sm font-serif italic text-slate-500 dark:text-slate-400">
                    "The shape of your resonance."
                </h3>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300">
                        Skills Unlocked: {totalUnlocked}/{totalSkills}
                    </span>
                </div>
            </div>
        </div>
    )
}
