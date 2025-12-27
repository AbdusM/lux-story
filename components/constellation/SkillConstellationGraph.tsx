"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { SkillWithState } from '@/hooks/useConstellationData'
import { SKILL_CONNECTIONS } from '@/lib/constellation/skill-positions'

interface SkillConstellationGraphProps {
    skills: SkillWithState[]
    onOpenDetail?: (skill: SkillWithState) => void
}

export function SkillConstellationGraph({ skills, onOpenDetail }: SkillConstellationGraphProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    // Helper to get skill state
    const getSkillState = (id: string) => skills.find(s => s.id === id)

    // Interaction Handlers
    const handleNodeClick = (skill: SkillWithState) => {
        const isSelected = selectedId === skill.id

        if (!isSelected) {
            // First click: Select (Show Label)
            setSelectedId(skill.id)
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(5)
            }
        } else {
            // Second click (while selected): Open Detail
            if (onOpenDetail) onOpenDetail(skill)
        }
    }

    const _selectedSkill = skills.find(s => s.id === selectedId)

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/0">
            {/* SVG Container - 0-100 coordinate space */}
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full max-w-[600px] max-h-[600px] touch-none select-none"
                style={{ overflow: 'visible' }}
            >
                {/* --- CONNECTIONS LAYER --- */}
                <g className="links opacity-60">
                    {SKILL_CONNECTIONS.map(([sourceId, targetId]) => {
                        const source = getSkillState(sourceId)
                        const target = getSkillState(targetId)

                        if (!source || !target) return null

                        // Show connection if EITHER node is awakened
                        const isVisible = source.state !== 'dormant' || target.state !== 'dormant'
                        const isStrong = source.state !== 'dormant' && target.state !== 'dormant'

                        if (!isVisible) return null

                        return (
                            <motion.line
                                key={`${sourceId}-${targetId}`}
                                x1={source.position.x}
                                y1={source.position.y}
                                x2={target.position.x}
                                y2={target.position.y}
                                stroke={source.color} // Use source cluster color
                                strokeWidth={isStrong ? "0.3" : "0.1"}
                                className={cn(
                                    "transition-all duration-500",
                                    isStrong ? "opacity-60" : "opacity-20 dashed"
                                )}
                                strokeDasharray={isStrong ? "0" : "1 1"}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: isStrong ? 0.6 : 0.2 }}
                            />
                        )
                    })}
                </g>

                {/* --- NODES LAYER --- */}
                <g className="nodes">
                    {skills.map((skill) => {
                        const isSelected = selectedId === skill.id
                        const isHovered = hoveredId === skill.id
                        const isUnlocked = skill.state !== 'dormant'

                        // Size based on mastery
                        const baseRadius = skill.cluster === 'center' ? 4 : 2.5
                        const masteryBonus = skill.demonstrationCount > 5 ? 1 : 0
                        const radius = baseRadius + masteryBonus

                        return (
                            <g
                                key={skill.id}
                                transform={`translate(${skill.position.x},${skill.position.y})`}
                                onClick={() => handleNodeClick(skill)}
                                onMouseEnter={() => setHoveredId(skill.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={cn(
                                    "transition-all duration-500 ease-out cursor-pointer group",
                                    !isUnlocked && "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                                )}
                            >
                                {/* Hit Area */}
                                <circle r={6} fill="transparent" />

                                {/* Selection/Hover Ring */}
                                {(isSelected || isHovered) && (
                                    <motion.circle
                                        r={radius + 3}
                                        fill="none"
                                        stroke={skill.color}
                                        strokeWidth="0.5"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={cn(isSelected && "animate-pulse")}
                                    />
                                )}

                                {/* Main Node */}
                                <circle
                                    r={radius}
                                    fill={isUnlocked ? skill.color : "#94a3b8"} // Color or Slate-400
                                    className={cn(
                                        "transition-all duration-300",
                                        isUnlocked && "filter drop-shadow-[0_0_4px_currentColor]"
                                    )}
                                    style={{ color: skill.color }} // For currentColor context if needed
                                />

                                {/* Label */}
                                <AnimatePresence>
                                    {(isHovered || isSelected || skill.cluster === 'center') && (
                                        <motion.g
                                            initial={{ opacity: 0, y: 2 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 1 }}
                                            className="pointer-events-none"
                                        >
                                            <text
                                                y={radius + 5}
                                                textAnchor="middle"
                                                className="fill-slate-800 dark:fill-slate-200 text-[2.5px] font-bold uppercase tracking-widest font-sans"
                                                style={{ fontSize: '2.5px' }}
                                            >
                                                {skill.name}
                                            </text>

                                            {isUnlocked && (
                                                <text
                                                    y={radius + 7}
                                                    textAnchor="middle"
                                                    className="fill-slate-400 text-[1.5px]"
                                                    style={{ fontSize: '1.5px' }}
                                                >
                                                    Lvl {skill.demonstrationCount}
                                                </text>
                                            )}
                                        </motion.g>
                                    )}
                                </AnimatePresence>
                            </g>
                        )
                    })}
                </g>
            </svg>
        </div>
    )
}
