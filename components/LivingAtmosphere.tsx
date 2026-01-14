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
    // P5: Subscribe to station atmosphere
    const atmosphere = useStationStore((state) => state.atmosphere)
    const [_visibleAtmosphere, _setVisibleAtmosphere] = React.useState<string | null>(atmosphere)

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

            {/* 5. Vignette (Focus attention) */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    )
}
