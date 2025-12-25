"use client"

import { motion, useSpring, useTransform } from "framer-motion"
import { usePatternUnlocks, type OrbState } from "@/hooks/usePatternUnlocks"
import { playPatternSound } from "@/lib/audio-feedback"
import { Microscope, Brain, Compass, Heart, Hammer } from "lucide-react"

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

export function HarmonicsView() {
    const { orbs: patternOrbs } = usePatternUnlocks()

    // Null guard: show loading state if orbs not yet available
    if (!patternOrbs || patternOrbs.length === 0) {
        return (
            <div className="p-4 space-y-8 min-h-[500px] flex flex-col items-center justify-center">
                <p className="text-xs text-slate-500 animate-pulse">Patterns forming...</p>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-8 min-h-[500px] flex flex-col items-center">
            {/* Header */}
            <div className="text-center space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    Resonance Field
                </h3>
                <p className="text-[10px] text-slate-500">
                    Your patterns echoing in the void
                </p>
            </div>

            {/* The Totem - Vertical Stacking for Mobile (gap accounts for labels) */}
            <div className="flex-1 flex flex-col items-center justify-center gap-12 w-full max-w-[280px]">
                {patternOrbs.map((orb, index) => (
                    <HarmonicOrb key={orb.pattern} orb={orb} index={index} />
                ))}
            </div>

            <p className="text-[9px] text-slate-500 font-mono text-center">
                Tap orbs to listen • Tilt device to disturb
            </p>
        </div>
    )
}

function HarmonicOrb({ orb, index }: { orb: OrbState; index: number }) {
    // Physics-light: Spring animations for "floating" feel
    const x = useSpring(0, { stiffness: 100, damping: 10 })
    const y = useSpring(0, { stiffness: 100, damping: 10 })

    // Size based on fill
    const baseSize = 60 + (orb.fillPercent * 0.4) // 60px -> 100px
    const fillSpring = useSpring(orb.fillPercent, { stiffness: 50, damping: 20 })

    const handleInteraction = () => {
        // Trigger Sound
        playPatternSound(orb.pattern)

        // Trigger Haptic
        triggerHaptic('light')

        // Visual Jolt - Spring Physics
        // We set a target, then quickly release it to let spring dampen it
        const joltX = (Math.random() - 0.5) * 40
        const joltY = (Math.random() - 0.5) * 40

        x.set(joltX) // Instant displacement (plucking the string)
        y.set(joltY)

        // The spring hook naturally wants to go to '0' (passed in hook)
        // actually useSpring(0) sets the *goal* to 0. 
        // .set() forcefully updates the *current value*.
        // So setting it to 20 means "I am now at 20, go to 0".
        // This creates a perfect organic recoil.
    }

    return (
        <motion.button
            className="relative rounded-full flex items-center justify-center group outline-none touch-manipulation"
            style={{
                width: baseSize,
                height: baseSize,
                x,
                y,
                backgroundColor: `${orb.color}10`, // Very subtle tint background
                border: `1px solid ${orb.color}40`,
                boxShadow: `0 0 20px ${orb.color}10`,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInteraction}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
        >
            {/* Core - The "Pupil" representing the pattern code */}
            <div
                className="absolute inset-2 rounded-full opacity-80"
                style={{ border: `1px dashed ${orb.color}` }}
            />

            {/* Liquid Fill */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 bg-current transition-colors"
                style={{
                    height: useTransform(fillSpring, v => `${v}%`),
                    backgroundColor: orb.color,
                    opacity: 0.2,
                    borderRadius: '0 0 999px 999px' // Clipped to circle approx (overflow hidden on parent better)
                }}
            />

            {/* Symbol */}
            <PatternIcon pattern={orb.pattern} className="w-6 h-6" style={{ color: orb.color }} />

            {/* Label (Always visible below orb) */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none whitespace-nowrap">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {orb.label}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">
                    {orb.fillPercent}%
                </p>
            </div>

        </motion.button>
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
