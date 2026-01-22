"use client"

/**
 * LivingAtmosphere - ISP Prototype v1
 * 
 * Philosophy: "The air between us is alive."
 * Replaces static background colors with a generative mesh gradient + particulate system.
 * 
 * Tech Stack:
 * - Framer Motion: For gradient blob movement.
 * - Canvas API: For subtle 'dust mote' particulates.
 * - CSS Variables: For character-specific palette injection.
 */

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { CharacterId } from "@/lib/graph-registry"
import { useStationStore } from "@/lib/station-state"
import { useGameSelectors } from "@/lib/game-store"
import { getPatternColor } from "@/lib/patterns"
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation"

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface LivingAtmosphereProps {
    characterId: CharacterId | null
    emotion?: 'fear_awe' | 'anxiety' | 'curiosity' | 'calm' | 'hope'
    className?: string
    children?: React.ReactNode
}

// Character Palette Map (Fallback if CSS vars fail)
// Key: CharacterId, Value: Base Hue (0-360)
const CHAR_HUES: Record<string, number> = {
    samuel: 260, // Deep Purple/Void
    maya: 220,   // Tech Blue
    devon: 150,  // Forest Green
    marcus: 10,  // Warm Red/Brown
    tess: 35,    // Copper/Orange
    jordan: 200, // Cool Slate
    silas: 0,    // Deep Void Black (Saturation 0)
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARTICULATE CANVAS
// ═══════════════════════════════════════════════════════════════════════════════

const ParticulateOverlay = React.memo(() => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const prefersReducedMotion = useReducedMotion()

    React.useEffect(() => {
        if (prefersReducedMotion) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight
        canvas.width = width
        canvas.height = height

        const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = []
        const PARTICLE_COUNT = 60 // Sparse, elegant

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 2,
                alpha: Math.random() * 0.5 + 0.1
            })
        }

        let animationFrameId: number

        const render = () => {
            ctx.clearRect(0, 0, width, height)

            particles.forEach(p => {
                p.x += p.vx
                p.y += p.vy

                // Wrap screen
                if (p.x < 0) p.x = width
                if (p.x > width) p.x = 0
                if (p.y < 0) p.y = height
                if (p.y > height) p.y = 0

                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            })

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }

        window.addEventListener('resize', handleResize)
        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', handleResize)
        }
    }, [prefersReducedMotion])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-30 pointer-events-none mix-blend-screen"
        />
    )
})

ParticulateOverlay.displayName = 'ParticulateOverlay'

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function LivingAtmosphere({
    characterId,
    emotion,
    className,
    children
}: LivingAtmosphereProps) {
    const prefersReducedMotion = useReducedMotion()

    // Phase 2: Parallax stars with gyroscope
    const { normalizedX, normalizedY, isSupported: hasGyroscope } = useDeviceOrientation({
        enabled: !prefersReducedMotion,
        smoothing: 0.08,
        maxTilt: 25,
    })

    // P5: Subscribe to station atmosphere
    const atmosphere = useStationStore((state) => state.atmosphere)
    const [_visibleAtmosphere, _setVisibleAtmosphere] = React.useState<string | null>(atmosphere)

    // Sprint 2: Living Station Frame - Access game state for frame effects
    const coreGameState = useGameSelectors.useCoreGameState()

    // Memoize patterns and characters to prevent dependency warnings
    const patterns = React.useMemo(() =>
        coreGameState?.patterns || { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
        [coreGameState?.patterns]
    )
    const characters = React.useMemo(() =>
        coreGameState?.characters || [],
        [coreGameState?.characters]
    )

    // Calculate dominant pattern for frame color
    const dominantPattern = React.useMemo(() => {
        const entries = Object.entries(patterns) as [string, number][]
        const sorted = entries.sort((a, b) => b[1] - a[1])
        return sorted[0]?.[0] || 'patience'
    }, [patterns])

    // Calculate average trust for frame opacity
    const averageTrust = React.useMemo(() => {
        if (characters.length === 0) return 0
        const total = characters.reduce((sum, char) => sum + (char.trust || 0), 0)
        return total / characters.length
    }, [characters])

    // Calculate total mastery (sum of all pattern levels)
    const totalMastery = React.useMemo(() => {
        return Object.values(patterns).reduce((sum, val) => sum + val, 0)
    }, [patterns])

    // Frame breathing when patience > 7
    const shouldBreathe = patterns.patience > 7 && !prefersReducedMotion

    // Phase 2: Frame dissolves as player masters the system
    // At 0 mastery: frame is solid (opacity 0.9)
    // At 50 mastery: frame starts dissolving (opacity 0.4)
    // Frame opacity also considers trust
    const masteryDissolveFactor = Math.min(totalMastery / 50, 1) // 0 to 1
    const baseFrameOpacity = 0.9 - (masteryDissolveFactor * 0.5) // 0.9 down to 0.4
    const trustBoost = (averageTrust / 10) * 0.2 // Trust adds some opacity back
    const frameOpacity = Math.max(0.2, baseFrameOpacity + trustBoost)

    // Phase 2: Frame reacts to emotional content
    const emotionGlow = React.useMemo(() => {
        switch (emotion) {
            case 'fear_awe': return { color: '#7c3aed', intensity: 0.4 } // Purple
            case 'anxiety': return { color: '#ef4444', intensity: 0.3 } // Red
            case 'hope': return { color: '#22c55e', intensity: 0.3 } // Green
            case 'curiosity': return { color: '#3b82f6', intensity: 0.25 } // Blue
            case 'calm': return { color: '#64748b', intensity: 0.15 } // Slate
            default: return { color: '#64748b', intensity: 0 }
        }
    }, [emotion])

    // Frame border color based on dominant pattern (or emotion if intense)
    const frameBorderColor = emotionGlow.intensity > 0.2
        ? emotionGlow.color
        : getPatternColor(dominantPattern as 'analytical' | 'patience' | 'exploring' | 'helping' | 'building')

    // Resolve base color hue
    const baseHue = React.useMemo(() => {
        if (!characterId) return 240 // Default deep blue
        return CHAR_HUES[characterId] ?? 240
    }, [characterId])

    // Emotion modifiers
    const saturationMod = emotion === 'anxiety' ? 1.5 : emotion === 'fear_awe' ? 0.5 : 1
    const lightnessMod = emotion === 'hope' ? 1.2 : emotion === 'fear_awe' ? 0.6 : 1

    // Mesh Blob Variants
    const blobVariants = {
        animate: {
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
            transition: {
                duration: 20,
                repeat: Infinity,
                repeatType: "mirror" as const,
                ease: "easeInOut" as const
            }
        }
    }

    return (
        <div className={cn("relative min-h-screen overflow-hidden bg-black", className)}>

            {/* 1. Deep Base Layer (Solid) */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={{
                    backgroundColor: `hsl(${baseHue}, ${20 * saturationMod}%, ${5 * lightnessMod}%)`
                }}
                transition={{ duration: 2 }}
            />

            {/* 2. Mesh Gradient Blobs */}
            <div className="absolute inset-0 z-0 opacity-40 blur-3xl">
                {/* Blob 1: Top Left */}
                <motion.div
                    variants={blobVariants}
                    animate="animate"
                    className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full opacity-60"
                    style={{
                        background: `radial-gradient(circle, hsl(${baseHue}, 60%, 20%) 0%, transparent 70%)`
                    }}
                />
                {/* Blob 2: Bottom Right (Complementary-ish shifted) */}
                <motion.div
                    variants={blobVariants}
                    animate={{ ...blobVariants.animate, transition: { duration: 25, delay: 2, repeat: Infinity, repeatType: "mirror" } }}
                    className="absolute -bottom-[20%] -right-[20%] w-[80%] h-[80%] rounded-full opacity-60"
                    style={{
                        background: `radial-gradient(circle, hsl(${baseHue + 40}, 50%, 15%) 0%, transparent 70%)`
                    }}
                />
            </div>

            {/* 3. Noise Texture (Film Grain) */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
            />

            {/* 4. Living Particulates */}
            <ParticulateOverlay />

            {/* 4.5 Parallax Star Field (Gyroscope) */}
            {/* Creates "window into another world" effect when tilting device */}
            {hasGyroscope && !prefersReducedMotion && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
                    style={{
                        transform: `translate(${normalizedX * 20}px, ${normalizedY * 20}px)`,
                        transition: 'transform 0.1s ease-out',
                    }}
                >
                    {/* Star layer 1 (far - moves less) */}
                    <svg
                        className="absolute inset-0 w-full h-full opacity-30"
                        style={{
                            transform: `translate(${normalizedX * 5}px, ${normalizedY * 5}px)`,
                        }}
                    >
                        {Array.from({ length: 30 }).map((_, i) => (
                            <circle
                                key={`star-far-${i}`}
                                cx={`${(i * 37) % 100}%`}
                                cy={`${(i * 53) % 100}%`}
                                r={0.5}
                                fill="white"
                                opacity={0.3 + (i % 5) * 0.1}
                            />
                        ))}
                    </svg>

                    {/* Star layer 2 (mid - moves moderately) */}
                    <svg
                        className="absolute inset-0 w-full h-full opacity-40"
                        style={{
                            transform: `translate(${normalizedX * 12}px, ${normalizedY * 12}px)`,
                        }}
                    >
                        {Array.from({ length: 20 }).map((_, i) => (
                            <circle
                                key={`star-mid-${i}`}
                                cx={`${(i * 47 + 17) % 100}%`}
                                cy={`${(i * 61 + 23) % 100}%`}
                                r={0.8}
                                fill="white"
                                opacity={0.4 + (i % 4) * 0.15}
                            />
                        ))}
                    </svg>

                    {/* Star layer 3 (near - moves most) */}
                    <svg
                        className="absolute inset-0 w-full h-full opacity-50"
                        style={{
                            transform: `translate(${normalizedX * 25}px, ${normalizedY * 25}px)`,
                        }}
                    >
                        {Array.from({ length: 10 }).map((_, i) => (
                            <circle
                                key={`star-near-${i}`}
                                cx={`${(i * 67 + 31) % 100}%`}
                                cy={`${(i * 79 + 41) % 100}%`}
                                r={1.2}
                                fill="white"
                                opacity={0.5 + (i % 3) * 0.2}
                            />
                        ))}
                    </svg>
                </div>
            )}

            {/* 5. Vignette (Focus attention) */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

            {/* 6. Living Station Frame (Sprint 2 + Phase 2) */}
            {/* Frame IS The Station - it reflects game state, dissolves with mastery, reacts to emotion */}
            <motion.div
                className="absolute inset-2 sm:inset-4 z-0 rounded-2xl pointer-events-none"
                style={{
                    border: `1px solid ${frameBorderColor}`,
                    boxShadow: emotionGlow.intensity > 0
                        ? `0 0 ${40 + emotionGlow.intensity * 60}px ${emotionGlow.color}${Math.round(emotionGlow.intensity * 50).toString(16).padStart(2, '0')}, inset 0 0 ${60 + emotionGlow.intensity * 40}px ${emotionGlow.color}${Math.round(emotionGlow.intensity * 30).toString(16).padStart(2, '0')}`
                        : `0 0 30px ${frameBorderColor}20, inset 0 0 60px ${frameBorderColor}10`,
                }}
                animate={shouldBreathe ? {
                    scale: [1, 1.002, 1],
                    opacity: [frameOpacity, frameOpacity * 1.1, frameOpacity],
                } : {
                    opacity: frameOpacity
                }}
                transition={shouldBreathe ? {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                } : {
                    duration: 1,
                    ease: "easeInOut"
                }}
                aria-hidden="true"
            />

            {/* Phase 2: Samuel's Presence Indicator (subtle corner glow when at Samuel) */}
            {characterId === 'samuel' && !prefersReducedMotion && (
                <motion.div
                    className="absolute top-4 left-4 w-8 h-8 rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    )
}
