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

            {/* The Totem - Vertical Stacking for Mobile */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-[280px]">
                {patternOrbs.map((orb, index) => (
                    <HarmonicOrb key={orb.pattern} orb={orb} index={index} />
                ))}
            </div>

            <p className="text-[9px] text-slate-300 dark:text-slate-600 font-mono text-center">
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

        // Visual Jolt
        x.set(Math.random() * 20 - 10)
        y.set(Math.random() * 20 - 10)

        // Recover quickly
        setTimeout(() => {
            x.set(0)
            y.set(0)
        }, 100)
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
            <PatternIcon pattern={orb.pattern} className="w-6 h-6" />

            {/* Label (Floating outside) */}
            <div className="absolute -right-24 text-left w-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {orb.label}
                </p>
                <p className="text-[9px] text-slate-400">
                    {orb.fillPercent}%
                </p>
            </div>

        </motion.button>
    )
}

function PatternIcon({ pattern, className }: { pattern: string; className?: string }) {
    switch (pattern) {
        case 'analytical': return <Microscope className={className} />
        case 'patience': return <Brain className={className} />
        case 'exploring': return <Compass className={className} />
        case 'helping': return <Heart className={className} />
        case 'building': return <Hammer className={className} />
        default: return <Compass className={className} />
    }
}
