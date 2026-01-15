"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { CharacterWithState } from '@/hooks/useConstellationData'
import { CHARACTER_CONNECTIONS, CHARACTER_COLORS } from '@/lib/constellation/character-positions'
import { CHARACTER_RELATIONSHIP_WEB } from '@/lib/character-relationships'

interface ConstellationGraphProps {
    characters: CharacterWithState[]
    onOpenDetail?: (character: CharacterWithState) => void
    onTravel?: (characterId: string) => void
    width?: number
    height?: number
}

export function ConstellationGraph({ characters, onOpenDetail, onTravel }: ConstellationGraphProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [focusedIndex, setFocusedIndex] = useState<number>(0)
    const nodeRefs = useRef<Map<string, SVGGElement>>(new Map())

    // Helper to get character state (since we need to look up connection targets)
    const getCharState = (id: string) => characters.find(c => c.id === id)

    // Filter inter-character relationships to only show when both characters are met
    // Exclude Samuel connections since those are already shown as hub spokes
    const visibleRelationships = useMemo(() => {
        return CHARACTER_RELATIONSHIP_WEB.filter(edge => {
            // Skip Samuel relationships (those are hub spokes)
            if (edge.fromCharacterId === 'samuel' || edge.toCharacterId === 'samuel') {
                return false
            }
            // Only show if both characters have been met
            const from = characters.find(c => c.id === edge.fromCharacterId)
            const to = characters.find(c => c.id === edge.toCharacterId)
            return from?.hasMet && to?.hasMet
        })
    }, [characters])

    // Interaction Handlers
    const handleNodeClick = (char: CharacterWithState) => {
        // ALLOW CLICKING UNMET CHARACTERS (Star Walking allows discovery)
        // if (!char.hasMet) return // REMOVED

        const isSelected = selectedId === char.id

        // If already selected and we have a travel handler, travel there (Double Tap behavior)
        if (isSelected && onTravel) {
            onTravel(char.id)
            return
        }

        setSelectedId(isSelected ? null : char.id)
        if (!isSelected) {
            // Small haptic if available
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(5)
            }
        }
    }

    const handleNodeDoubleClick = (char: CharacterWithState) => {
        // Double click acts as direct travel if enabled, otherwise open detail
        // ALLOW DOUBLE CLICK ON UNMET CHARACTERS
        if (onTravel) {
            onTravel(char.id)
        } else if (onOpenDetail) {
            onOpenDetail(char)
        }
    }

    const handleTravelClick = (e: React.MouseEvent, charId: string) => {
        e.stopPropagation()
        if (onTravel) onTravel(charId)
    }

    const handleDetailClick = (e: React.MouseEvent, char: CharacterWithState) => {
        e.stopPropagation()
        if (onOpenDetail) onOpenDetail(char)
    }

    // Keyboard Navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const visibleChars = characters.filter(c => c.position?.x !== undefined)
        if (visibleChars.length === 0) return

        const currentChar = visibleChars[focusedIndex]

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault()
                setFocusedIndex((prev) => (prev + 1) % visibleChars.length)
                break
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault()
                setFocusedIndex((prev) => (prev - 1 + visibleChars.length) % visibleChars.length)
                break
            case 'Enter':
            case ' ':
                e.preventDefault()
                if (currentChar) {
                    if (selectedId === currentChar.id && onTravel) {
                        // Double-select behavior: travel
                        onTravel(currentChar.id)
                    } else {
                        // First select
                        setSelectedId(currentChar.id)
                    }
                }
                break
            case 'i':
            case 'I':
                e.preventDefault()
                if (currentChar && onOpenDetail) {
                    onOpenDetail(currentChar)
                }
                break
            case 't':
            case 'T':
                e.preventDefault()
                if (currentChar && onTravel) {
                    onTravel(currentChar.id)
                }
                break
        }
    }, [characters, focusedIndex, selectedId, onTravel, onOpenDetail])

    // Keyboard navigation setup
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    // Focus management - focus the current node
    useEffect(() => {
        const visibleChars = characters.filter(c => c.position?.x !== undefined)
        const currentChar = visibleChars[focusedIndex]
        if (currentChar) {
            const node = nodeRefs.current.get(currentChar.id)
            if (node) {
                node.focus()
            }
        }
    }, [focusedIndex, characters])

    const selectedChar = characters.find(c => c.id === selectedId)
    const visibleCharacters = characters.filter(c => c.position?.x !== undefined)
    const focusedChar = visibleCharacters[focusedIndex]

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden rounded-xl border border-white/10 shadow-inner">
            {/* Clean Radial Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80" />

            {/* Grid overlay for 'Holographic' feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* SVG Container */}
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full max-w-[600px] max-h-[600px] touch-none select-none relative z-10"
                style={{ overflow: 'visible' }}
                role="img"
                aria-label="Character relationship network graph"
            >
                <title>Character Constellation</title>
                <desc>
                    Interactive network showing {characters.length} characters and their relationships.
                    {focusedChar && ` Currently focused: ${focusedChar.name}, ${focusedChar.role}.`}
                    Use arrow keys to navigate, Enter or Space to select, I for info, T to travel.
                </desc>

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
                    {/* Hub spokes (Samuel to each character) */}
                    {CHARACTER_CONNECTIONS.map(([sourceId, targetId]) => {
                        const source = getCharState(sourceId)
                        const target = getCharState(targetId)
                        if (!source || !target) return null
                        // Skip if positions undefined (defensive guard)
                        if (source.position?.x === undefined || target.position?.x === undefined) return null

                        const bothMet = source.hasMet && target.hasMet

                        // Interaction Logic
                        const isConnectedToHover = hoveredId === sourceId || hoveredId === targetId
                        const isDimmed = hoveredId !== null && !isConnectedToHover

                        // "Brass" Connection Lines (Warm, Dark, Ancient)
                        return (
                            <line
                                key={`hub-${sourceId}-${targetId}`}
                                x1={source.position.x}
                                y1={source.position.y}
                                x2={target.position.x}
                                y2={target.position.y}
                                stroke={bothMet ? "#78350f" : "#475569"} // Amber-900 (Met) vs Slate-600 (Ghost)
                                strokeWidth={bothMet ? (isConnectedToHover ? "0.4" : "0.3") : "0.1"}
                                className={cn(
                                    "transition-all duration-700",
                                    bothMet
                                        ? (isDimmed ? "opacity-10" : isConnectedToHover ? "opacity-100" : "opacity-60")
                                        : "opacity-20"
                                )}
                            />
                        )
                    })}

                    {/* Inter-character relationship edges (not hub spokes) */}
                    {visibleRelationships.map((edge) => {
                        const from = getCharState(edge.fromCharacterId)
                        const to = getCharState(edge.toCharacterId)
                        if (!from || !to) return null
                        // Skip if positions undefined (defensive guard)
                        if (from.position?.x === undefined || to.position?.x === undefined) return null

                        // Interaction Logic
                        const isConnectedToHover = hoveredId === edge.fromCharacterId || hoveredId === edge.toCharacterId
                        const isDimmed = hoveredId !== null && !isConnectedToHover

                        // Color based on relationship sentiment
                        const strokeColor = edge.opinions.sentiment === 'positive' ? '#059669' // Emerald-600
                            : edge.opinions.sentiment === 'negative' ? '#dc2626' // Red-600
                                : edge.opinions.sentiment === 'conflicted' ? '#d97706' // Amber-600
                                    : '#64748b' // Slate-500 for neutral

                        return (
                            <line
                                key={`rel-${edge.fromCharacterId}-${edge.toCharacterId}`}
                                x1={from.position.x}
                                y1={from.position.y}
                                x2={to.position.x}
                                y2={to.position.y}
                                stroke={strokeColor}
                                strokeWidth={isConnectedToHover ? "0.3" : "0.2"}
                                strokeDasharray="1 1.5"
                                className={cn(
                                    "transition-all duration-500",
                                    isDimmed ? "opacity-10" : isConnectedToHover ? "opacity-100" : "opacity-40"
                                )}
                            />
                        )
                    })}
                </g>

                {/* --- NODES LAYER (3D Orbs) --- */}
                <g className="nodes">
                    {characters.map((char, _index) => {
                        // Skip characters without valid positions (defensive guard)
                        if (char.position?.x === undefined || char.position?.y === undefined) return null

                        const isSelected = selectedId === char.id
                        const isHovered = hoveredId === char.id
                        const isFocused = focusedChar?.id === char.id
                        const colors = CHARACTER_COLORS[char.color]

                        // Geometric Purity: Just circles. No blurs.
                        const radius = char.isMajor ? 4 : 3 // Slightly larger for 3D effect
                        const isCenter = char.id === 'samuel'

                        // "Brass" Rim Color (Unified Golden Look)
                        const rimColor = "#d97706" // Amber-600

                        // Accessibility label
                        const ariaLabel = `${char.name}, ${char.role}. ${char.hasMet ? `Trust level ${char.trust} out of 10.` : 'Not yet met.'} ${char.arcComplete ? 'Story complete.' : ''} Press Enter to select, I for info, T to travel.`

                        return (
                            <g
                                key={char.id}
                                ref={(el) => {
                                    if (el) {
                                        nodeRefs.current.set(char.id, el)
                                    }
                                }}
                                transform={`translate(${char.position.x},${char.position.y})`}
                                onClick={() => handleNodeClick(char)}
                                onDoubleClick={() => handleNodeDoubleClick(char)}
                                onMouseEnter={() => setHoveredId(char.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onFocus={() => {
                                    const visibleChars = characters.filter(c => c.position?.x !== undefined)
                                    const charIndex = visibleChars.findIndex(c => c.id === char.id)
                                    if (charIndex !== -1) {
                                        setFocusedIndex(charIndex)
                                    }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={ariaLabel}
                                className={cn(
                                    "transition-all duration-500 ease-out cursor-pointer focus:outline-none"
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

                                {/* Keyboard Focus Ring */}
                                {isFocused && (
                                    <circle
                                        r={radius + 3.8}
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="0.4"
                                        strokeDasharray="0.8 0.8"
                                        className="opacity-90 animate-pulse"
                                        aria-hidden="true"
                                    />
                                )}

                                {/* Trust Progress Arc (only for met characters with trust > 0) */}
                                {char.hasMet && char.trust > 0 && (
                                    <circle
                                        r={radius + 2.5}
                                        fill="none"
                                        stroke="#f59e0b"
                                        strokeWidth="0.4"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(char.trust / 10) * 2 * Math.PI * (radius + 2.5)} ${2 * Math.PI * (radius + 2.5)}`}
                                        transform="rotate(-90)"
                                        className="opacity-60"
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

                                {/* Arc Complete Indicator */}
                                {char.hasMet && char.arcComplete && (
                                    <g className="arc-complete-badge">
                                        <circle
                                            r={radius + 1.8}
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="0.5"
                                            strokeDasharray="2 1"
                                            className="opacity-80"
                                        />
                                        <text
                                            x={radius + 2}
                                            y={-radius - 1}
                                            textAnchor="middle"
                                            className="fill-emerald-400 text-[2.5px]"
                                            style={{ fontSize: '2.5px' }}
                                        >
                                            ✓
                                        </text>
                                    </g>
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
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                {selectedChar ? (
                    <div className="flex flex-col items-center gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <span className="text-xs text-amber-500 font-mono tracking-[0.2em] uppercase font-bold drop-shadow-md">
                            {selectedChar.name}
                        </span>

                        {/* Trust Progress Indicator */}
                        {selectedChar.hasMet && (
                            <div className="flex flex-col items-center gap-1 mt-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500/80 rounded-full transition-all duration-500"
                                            style={{ width: `${selectedChar.trust * 10}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        {selectedChar.trust}/10
                                    </span>
                                </div>
                                <span className="text-[9px] text-slate-500">
                                    {selectedChar.trust < 6
                                        ? `${6 - selectedChar.trust} to deeper connection`
                                        : selectedChar.trust < 8
                                            ? `${8 - selectedChar.trust} to loyalty`
                                            : 'Trusted ally'}
                                </span>
                            </div>
                        )}

                        {/* Action Buttons for Selection */}
                        <div
                            className="flex gap-2 mt-1 pointer-events-auto"
                            onPointerDown={(e) => e.stopPropagation()} // FIX: Prevent parent drag from swallowing taps
                        >
                            {onTravel && (
                                <button
                                    onClick={(e) => handleTravelClick(e, selectedChar.id)}
                                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/50 rounded-md text-[11px] uppercase text-amber-200 tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.2)] touch-manipulation"
                                >
                                    Travel
                                </button>
                            )}
                            {onOpenDetail && (
                                <button
                                    onClick={(e) => handleDetailClick(e, selectedChar)}
                                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-md text-[11px] uppercase text-slate-300 tracking-widest transition-all hover:scale-105 active:scale-95 touch-manipulation"
                                >
                                    Target Info
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-slate-600 font-mono tracking-[0.2em] uppercase opacity-60">
                        System Online
                    </p>
                )}
            </div>

            {/* Screen Reader Announcements - Hidden visually but available to screen readers */}
            <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {focusedChar && (
                    <span>
                        Focused on {focusedChar.name}, {focusedChar.role}.
                        {focusedChar.hasMet ? ` Trust level ${focusedChar.trust} out of 10.` : ' Not yet met.'}
                        {focusedChar.arcComplete ? ' Story complete.' : ''}
                        {' '}Use arrow keys to navigate. Press Enter or Space to select. Press I for info, T to travel.
                    </span>
                )}
            </div>

            {/* Keyboard Navigation Instructions - Visible for all users */}
            <div className="absolute top-2 right-2 text-[9px] text-slate-500 font-mono bg-slate-900/80 px-2 py-1 rounded border border-white/5">
                <p className="whitespace-nowrap">
                    ← → ↑ ↓ Navigate | ↵ Select | I Info | T Travel
                </p>
            </div>
        </div>
    )
}
