"use client"

import { useMemo } from "react"
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion"
import { usePatternUnlocks, type OrbState } from "@/hooks/usePatternUnlocks"
import { playPatternSound } from "@/lib/audio-feedback"
import { Microscope, Brain, Compass, Heart, Hammer, Briefcase } from "lucide-react"
import { PatternType } from "@/lib/patterns"
import { getTopCareerForPattern, type PatternCareerMatch } from "@/lib/pattern-combos"
import { useGameSelectors } from "@/lib/game-store"

interface HarmonicsViewProps {
    onOrbSelect?: (pattern: PatternType) => void
}

/**
 * Mobile Haptic helper
 */
const triggerHaptic = (style: 'light' | 'medium' | 'heavy') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        if (style === 'light') navigator.vibrate(5)
        if (style === 'medium') navigator.vibrate(10)
        if (style === 'heavy') navigator.vibrate(20)
    }
}

export function HarmonicsView({ onOrbSelect }: HarmonicsViewProps) {
    const { orbs: patternOrbs } = usePatternUnlocks()
    const coreGameState = useGameSelectors.useCoreGameState()

    // Compute career matches for each pattern
    const careerMatches = useMemo((): Record<PatternType, PatternCareerMatch | null> => {
        if (!coreGameState?.patterns) {
            return {
                analytical: null,
                patience: null,
                exploring: null,
                helping: null,
                building: null
            }
        }

        return {
            analytical: getTopCareerForPattern('analytical', coreGameState.patterns),
            patience: getTopCareerForPattern('patience', coreGameState.patterns),
            exploring: getTopCareerForPattern('exploring', coreGameState.patterns),
            helping: getTopCareerForPattern('helping', coreGameState.patterns),
            building: getTopCareerForPattern('building', coreGameState.patterns)
        }
    }, [coreGameState?.patterns])

    // Null guard: show loading state if orbs not yet available
    if (!patternOrbs || patternOrbs.length === 0) {
        return (
            <div className="p-4 space-y-4 min-h-[500px] flex flex-col items-center justify-center text-center">
                <Compass className="w-8 h-8 text-slate-600 animate-pulse" />
                <div className="space-y-1">
                    <p className="text-sm text-slate-400">Your patterns are waiting to emerge</p>
                    <p className="text-xs text-slate-500">Make choices in conversations to reveal them</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative p-4 space-y-8 min-h-[500px] flex flex-col items-center">
            {/* RESONANCE FIELD: Background Animation */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <svg viewBox="0 0 400 600" className="w-full h-full opacity-20">
                    <defs>
                        <radialGradient id="field-grad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#000" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="200" cy="300" r="150" fill="url(#field-grad)" className="animate-[pulse_8s_ease-in-out_infinite]" />
                    {[1, 2, 3].map(i => (
                        <circle
                            key={i}
                            cx="200" cy="300"
                            r={100 + i * 40}
                            fill="none"
                            stroke="white"
                            strokeWidth="0.5"
                            strokeOpacity={0.1 - (i * 0.02)}
                            className="animate-[spin_60s_linear_infinite]"
                            style={{ animationDuration: `${60 - i * 10}s`, animationDirection: i % 2 === 0 ? 'normal' : 'reverse' }}
                        />
                    ))}
                </svg>
            </div>

            {/* Header */}
            <div className="relative z-10 text-center space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                    Resonance Field
                </h3>
                <p className="text-xs text-slate-400">
                    Your patterns echoing in the void
                </p>
            </div>

            {/* The Totem - Vertical Stacking for Mobile */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-[280px] pb-12 relative z-10">
                {patternOrbs.map((orb, index) => (
                    <HarmonicOrb
                        key={orb.pattern}
                        orb={orb}
                        index={index}
                        onSelect={onOrbSelect}
                        careerMatch={careerMatches[orb.pattern as PatternType] || null}
                    />
                ))}
            </div>

            <p className="relative z-10 text-xs text-slate-500 font-mono text-center">
                Tap orbs to inspect • Tilt device to disturb
            </p>
        </div>
    )
}

function HarmonicOrb({ orb, index, onSelect, careerMatch }: {
    orb: OrbState
    index: number
    onSelect?: (p: PatternType) => void
    careerMatch: PatternCareerMatch | null
}) {
    // Accessibility
    const prefersReducedMotion = useReducedMotion()

    // Physics-light: Spring animations for "floating" feel
    const x = useSpring(0, { stiffness: 100, damping: 10 })
    const y = useSpring(0, { stiffness: 100, damping: 10 })

    // Size based on fill
    const baseSize = 60 + (orb.fillPercent * 0.4) // 60px -> 100px
    const fillSpring = useSpring(orb.fillPercent, { stiffness: 50, damping: 20 })

    // Breathing animation for dormant orbs - shows life/potential (respects reduced motion)
    const isDormant = orb.fillPercent === 0 && !prefersReducedMotion

    const handleInteraction = () => {
        // Trigger Sound
        playPatternSound(orb.pattern)

        // Trigger Haptic
        triggerHaptic('light')

        // Visual Jolt - Spring Physics
        const joltX = (Math.random() - 0.5) * 16
        const joltY = (Math.random() - 0.5) * 16

        x.set(joltX)
        y.set(joltY)

        // Output Selection
        if (onSelect) {
            onSelect(orb.pattern)
        }
    }

    return (
        <div className="flex flex-col items-center gap-3 z-10">
            <motion.button
                className="relative rounded-full flex items-center justify-center group outline-none touch-manipulation backdrop-blur-sm"
                style={{
                    width: baseSize,
                    height: baseSize,
                    x,
                    y,
                    backgroundColor: `${orb.color}15`, // Increased opacity slightly for glass feel
                    border: `1px solid ${orb.color}30`,
                    boxShadow: `0 0 30px ${orb.color}10`, // Larger subtle glow
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInteraction}
                initial={{ opacity: 0, scale: 0 }}
                animate={isDormant
                    ? { opacity: [0.6, 0.85, 0.6], scale: [1, 1.03, 1] }
                    : { opacity: 1, scale: 1 }
                }
                transition={isDormant
                    ? {
                        delay: index * 0.1,
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                    : { delay: index * 0.1, type: "spring" }
                }
            >
                {/* Core - The "Pupil" */}
                <div
                    className="absolute inset-2 rounded-full opacity-60"
                    style={{ border: `1px dashed ${orb.color}` }}
                />

                {/* Liquid Fill */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-current transition-colors"
                    style={{
                        height: useTransform(fillSpring, v => `${v}%`),
                        backgroundColor: orb.color,
                        opacity: 0.25,
                        borderRadius: '0 0 999px 999px'
                    }}
                />

                {/* Symbol */}
                <PatternIcon pattern={orb.pattern} className="w-6 h-6 z-10" style={{ color: orb.color }} />
            </motion.button>

            {/* Label - Flow Layout */}
            <div className="text-center w-44 flex flex-col items-center">
                <p className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    {orb.label}
                </p>

                {/* Progress Bar with integrated percentage */}
                <div className="mt-2 w-full max-w-[120px]">
                    <div className="h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: orb.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${orb.fillPercent}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                        {orb.fillPercent}% resonance
                    </p>
                </div>

                {/* Career Match Overlay */}
                {careerMatch && careerMatch.progress > 0 && (
                    <div className="mt-2 flex items-center justify-center gap-1.5 bg-slate-900/40 px-2 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                        <Briefcase className="w-3.5 h-3.5 text-amber-500/80" />
                        <span className={`text-xs truncate max-w-[100px] ${careerMatch.isUnlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                            {careerMatch.careerHint}
                        </span>
                    </div>
                )}

                {/* Next unlock progress (smaller, subtle) */}
                {orb.nextUnlock && orb.progressToNext > 0 && (
                    <div className="mt-2 w-full max-w-[100px]">
                        <div className="h-0.5 bg-slate-700/30 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full opacity-60"
                                style={{ backgroundColor: orb.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${orb.progressToNext}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function PatternIcon({ pattern, className, style }: { pattern: string; className?: string; style?: React.CSSProperties }) {
    switch (pattern) {
        case 'analytical': return <Microscope className={className} style={style} />
        case 'patience': return <Brain className={className} style={style} />
        case 'exploring': return <Compass className={className} style={style} />
        case 'helping': return <Heart className={className} style={style} />
        case 'building': return <Hammer className={className} style={style} />
        default: return <Compass className={className} style={style} />
    }
}
