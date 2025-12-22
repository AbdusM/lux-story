"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CharacterWithState } from '@/hooks/useConstellationData'
import { CHARACTER_CONNECTIONS, CHARACTER_COLORS, getCharacterById } from '@/lib/constellation/character-positions'

interface ConstellationGraphProps {
    characters: CharacterWithState[]
    onOpenDetail?: (character: CharacterWithState) => void
    width?: number
    height?: number
}

export function ConstellationGraph({ characters, onOpenDetail }: ConstellationGraphProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    // Helper to get character state (since we need to look up connection targets)
    const getCharState = (id: string) => characters.find(c => c.id === id)

    // Interaction Handlers
    const handleNodeClick = (char: CharacterWithState) => {
        if (!char.hasMet) return // Ignore clicks on ghost nodes

        const isSelected = selectedId === char.id
        setSelectedId(isSelected ? null : char.id)
        if (!isSelected) {
            // Small haptic if available
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(5)
            }
        }
    }

    const handleNodeDoubleClick = (char: CharacterWithState) => {
        if (char.hasMet && onOpenDetail) onOpenDetail(char)
    }

    const selectedChar = characters.find(c => c.id === selectedId)

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/0">
            {/* SVG Container - Uses 0-100 coordinate space for easy responsive scaling */}
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full max-w-[600px] max-h-[600px] touch-none select-none"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* Node Gradients */}
                    {Object.entries(CHARACTER_COLORS).map(([name, colors]) => (
                        <radialGradient key={name} id={`grad-${name}`} cx="30%" cy="30%" r="70%">
                            {/* Extract hex colors would be better, but approximating with CSS vars or safe fallbacks */}
                            {/* Since we can't easily map Tailwind classes to SVG stops without a helper, 
                                we'll use a specific set of colors or let the class handles it. 
                                Actually, for "Mass Effect" style, simple geometric fills often look cleaner. 
                                We'll use the 'fill-current' approach with text classes.
                            */}
                        </radialGradient>
                    ))}
                </defs>

                {/* --- CONNECTIONS LAYER (Bottom) --- */}
                <g className="links opacity-80">
                    {CHARACTER_CONNECTIONS.map(([sourceId, targetId]) => {
                        const source = getCharState(sourceId)
                        const target = getCharState(targetId)

                        // If either end doesn't exist in our data (shouldn't happen), skip
                        if (!source || !target) return null

                        // Constellation Logic:
                        // - If both MET: Bright, solid line
                        // - If one MET: Faint, dashed line (hinting at connection)
                        // - If neither MET: Invisible or extremely faint

                        const bothMet = source.hasMet && target.hasMet
                        const oneMet = source.hasMet || target.hasMet

                        if (!oneMet) return null // Hide completely if neither is known

                        return (
                            <motion.line
                                key={`${sourceId}-${targetId}`}
                                x1={source.position.x}
                                y1={source.position.y}
                                x2={target.position.x}
                                y2={target.position.y}
                                stroke="currentColor"
                                strokeWidth={bothMet ? "0.4" : "0.2"}
                                className={cn(
                                    "transition-colors duration-500",
                                    bothMet ? "text-amber-400/60 dark:text-amber-300/60 drop-shadow-sm" : "text-slate-300/20 dark:text-slate-700/30 dashed"
                                )}
                                strokeDasharray={bothMet ? "0" : "2 1"}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        )
                    })}
                </g>

                {/* --- NODES LAYER (Top) --- */}
                <g className="nodes">
                    {characters.map((char) => {
                        const isSelected = selectedId === char.id
                        const isHovered = hoveredId === char.id
                        const colors = CHARACTER_COLORS[char.color]

                        // "Fog of War" styling
                        // Unmet: Grayscale, small, low opacity
                        // Met: Full color, normal size, glowing
                        const radius = char.isMajor ? 4 : 2.5

                        return (
                            <g
                                key={char.id}
                                transform={`translate(${char.position.x},${char.position.y})`}
                                onClick={() => handleNodeClick(char)}
                                onDoubleClick={() => handleNodeDoubleClick(char)}
                                onMouseEnter={() => setHoveredId(char.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={cn(
                                    "transition-all duration-500 ease-out cursor-pointer",
                                    !char.hasMet && "opacity-30 grayscale cursor-not-allowed hover:opacity-40"
                                )}
                                style={{
                                    opacity: char.hasMet ? 1 : 0.2
                                }}
                            >
                                {/* Hit Area (invisible, larger) */}
                                <circle r={8} fill="transparent" />

                                {/* Selection Ring */}
                                {(isSelected || isHovered) && char.hasMet && (
                                    <motion.circle
                                        r={radius + 3}
                                        fill="none"
                                        stroke={colors.ring} // Utilizing tailwind ring color mapped roughly
                                        strokeWidth="0.5"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={cn(isSelected && "animate-pulse")} // Simple pulse
                                    // Since we can't easily use Tailwind colors in SVG stroke without 'currentColor', 
                                    // we relies on the class or inline style if needed. 
                                    // Ideally, pass specific hex. For now, using 'currentColor' with text class on parent group if possible
                                    // actually we can just use the class on the circle if we whitelist them or use style.
                                    />
                                )}

                                {/* Main Star Node */}
                                {/* We use foreignObject or just simplified SVG styling. 
                                    For reliability, let's use direct fill with Tailwind color classes mapped to styles or specific hexes?
                                    Actually, we can use `className={colors.text}` and `fill="currentColor"`
                                */}
                                <circle
                                    r={radius}
                                    fill="currentColor"
                                    className={cn(
                                        "transition-all duration-300",
                                        colors.text, // This sets the currentColor
                                        char.hasMet && "filter drop-shadow-[0_0_8px_currentColor]"
                                    )}
                                />

                                {/* Center Hub Indicator */}
                                {char.id === 'samuel' && char.hasMet && (
                                    <circle r={radius + 6} fill="none" stroke="currentColor" strokeWidth="0.2" className="text-amber-500/30 animate-[spin_10s_linear_infinite]" />
                                )}

                                {/* Label */}
                                <AnimatePresence>
                                    {(isHovered || isSelected || char.isMajor) && char.hasMet && (
                                        <motion.g
                                            initial={{ opacity: 0, y: 2 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 1 }}
                                            className="pointer-events-none"
                                        >
                                            <text
                                                y={radius + 5}
                                                textAnchor="middle"
                                                className="fill-slate-800 dark:fill-slate-200 text-[3px] font-bold uppercase tracking-widest font-sans"
                                                style={{ fontSize: '3px' }} // SVG font size unitless = user units
                                            >
                                                {char.name}
                                            </text>
                                            <text
                                                y={radius + 7.5}
                                                textAnchor="middle"
                                                className="fill-slate-400 text-[2px]"
                                                style={{ fontSize: '2px' }}
                                            >
                                                {char.role}
                                            </text>
                                        </motion.g>
                                    )}
                                </AnimatePresence>

                                {/* Ghost Label (Question Mark) */}
                                {!char.hasMet && isHovered && (
                                    <text
                                        y={0.5}
                                        textAnchor="middle"
                                        className="fill-slate-600 dark:fill-slate-400 text-[3px] font-bold"
                                        style={{ fontSize: '3px' }}
                                    >
                                        ?
                                    </text>
                                )}
                            </g>
                        )
                    })}
                </g>
            </svg>

            {/* Empty State / Hint */}
            <div className="absolute bottom-6 text-center pointer-events-none opacity-40">
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                    {selectedChar ? `Signal Lock: ${selectedChar.name}` : "Scanning Constellation..."}
                </p>
            </div>
        </div>
    )
}
