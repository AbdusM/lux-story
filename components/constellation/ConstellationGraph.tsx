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
        <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
            {/* Clean Radial Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80" />

            {/* SVG Container */}
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full max-w-[600px] max-h-[600px] touch-none select-none relative z-10"
                style={{ overflow: 'visible' }}
            >
                {/* --- DEFINITIONS (Reusable Gradients) --- */}
                <defs>
                    {/* Sphere Highlight (Top-Left Shine) */}
                    <radialGradient id="sphere-shine" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                        <stop offset="20%" stopColor="white" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>

                    {/* Sphere Shadow (Bottom-Right/Edge Depth) */}
                    <radialGradient id="sphere-shadow" cx="50%" cy="50%" r="50%">
                        <stop offset="70%" stopColor="black" stopOpacity="0" />
                        <stop offset="100%" stopColor="black" stopOpacity="0.6" />
                    </radialGradient>
                </defs>

                {/* --- CONNECTIONS LAYER (Clean Lines) --- */}
                <g className="links">
                    {CHARACTER_CONNECTIONS.map(([sourceId, targetId]) => {
                        const source = getCharState(sourceId)
                        const target = getCharState(targetId)
                        if (!source || !target) return null

                        const bothMet = source.hasMet && target.hasMet

                        // "Brass" Connection Lines (Warm, Dark, Ancient)
                        return (
                            <line
                                key={`${sourceId}-${targetId}`}
                                x1={source.position.x}
                                y1={source.position.y}
                                x2={target.position.x}
                                y2={target.position.y}
                                stroke={bothMet ? "#78350f" : "#475569"} // Amber-900 (Met) vs Slate-600 (Ghost)
                                strokeWidth={bothMet ? "0.3" : "0.1"}
                                className={cn(
                                    "transition-all duration-700",
                                    bothMet ? "opacity-60" : "opacity-20"
                                )}
                            />
                        )
                    })}
                </g>

                {/* --- NODES LAYER (3D Orbs) --- */}
                <g className="nodes">
                    {characters.map((char) => {
                        const isSelected = selectedId === char.id
                        const isHovered = hoveredId === char.id
                        const colors = CHARACTER_COLORS[char.color]

                        // Geometric Purity: Just circles. No blurs.
                        const radius = char.isMajor ? 4 : 3 // Slightly larger for 3D effect
                        const isCenter = char.id === 'samuel'

                        // "Brass" Rim Color (Unified Golden Look)
                        const rimColor = "#d97706" // Amber-600

                        return (
                            <g
                                key={char.id}
                                transform={`translate(${char.position.x},${char.position.y})`}
                                onClick={() => handleNodeClick(char)}
                                onDoubleClick={() => handleNodeDoubleClick(char)}
                                onMouseEnter={() => setHoveredId(char.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={cn(
                                    "transition-all duration-500 ease-out cursor-pointer"
                                )}
                                style={{
                                    opacity: char.hasMet ? 1 : 0.5 // Increased from 0.4 for visibility
                                }}
                            >
                                {/* Hit Area */}
                                <circle r={12} fill="transparent" />

                                {/* Outer Ring (Persistent BRASS/GOLD Rim) */}
                                {(char.hasMet || isHovered) && (
                                    <circle
                                        r={radius + 1.2}
                                        fill="none"
                                        stroke={rimColor}
                                        strokeWidth={isSelected || isHovered ? "0.6" : "0.4"} // Thicker, substantial rim
                                        className={cn(
                                            "transition-all duration-300",
                                            isSelected || isHovered ? "opacity-100" : "opacity-80"
                                        )}
                                    />
                                )}

                                {/* MARQUIS: Scanning Ring (Unmet or Hovered) */}
                                {(!char.hasMet || isHovered) && (
                                    <circle
                                        r={radius + 3.5}
                                        fill="none"
                                        stroke={rimColor}
                                        strokeWidth="0.1"
                                        strokeDasharray="1 3"
                                        className="animate-[spin_10s_linear_infinite] opacity-30"
                                    />
                                )}

                                {/* 1. Base Color Orb */}
                                <circle
                                    r={radius}
                                    className={cn(
                                        "transition-colors duration-300",
                                        colors.text // Applies the text color as fill via currentColor context if set, but we use fill explicit below
                                    )}
                                    fill="currentColor"
                                />

                                {/* 2. Inner Shadow (Depth) */}
                                <circle
                                    r={radius}
                                    fill="url(#sphere-shadow)"
                                    className="pointer-events-none"
                                />

                                {/* 3. Top Shine (Gloss) */}
                                <circle
                                    r={radius}
                                    fill="url(#sphere-shine)"
                                    className="pointer-events-none mix-blend-overlay"
                                />

                                {/* Center Hub Indicator (Minimal) */}
                                {isCenter && (
                                    <circle r={radius + 5} fill="none" stroke="currentColor" strokeWidth="0.1" className="text-amber-500/50" />
                                )}

                                {/* Label (Visible for ALL, just dimmer if unmet) */}
                                {(isHovered || isSelected || char.isMajor || !char.hasMet) && (
                                    <g className={cn("transition-opacity duration-300", !isHovered && !isSelected && !char.isMajor ? "opacity-60" : "opacity-100")}>
                                        <text
                                            y={radius + 5}
                                            textAnchor="middle"
                                            className={cn(
                                                "text-[3px] font-bold uppercase tracking-widest font-sans",
                                                char.hasMet ? "fill-slate-200" : "fill-slate-500"
                                            )}
                                            style={{ fontSize: '3px' }}
                                        >
                                            {char.name}
                                        </text>
                                        {char.hasMet && (
                                            <text
                                                y={radius + 7.5}
                                                textAnchor="middle"
                                                className="fill-slate-500 text-[2px]"
                                                style={{ fontSize: '2px' }}
                                            >
                                                {char.role}
                                            </text>
                                        )}
                                    </g>
                                )}
                            </g>
                        )
                    })}
                </g>
            </svg>

            {/* Scanning Text (Retro) */}
            <div className="absolute bottom-6 text-center pointer-events-none opacity-30">
                <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">
                    {selectedChar ? `Target: ${selectedChar.name}` : "Scanning Constellation..."}
                </p>
            </div>
        </div>
    )
}
