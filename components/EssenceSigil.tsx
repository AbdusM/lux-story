"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useInsights } from "@/hooks/useInsights"
import { PATTERN_METADATA } from "@/lib/patterns"

/**
 * Essence Sigil
 * Replaces the "Style" tab.
 * 
 * Concept: Your Soul has a shape.
 * Implementation: A generative SVG that morphs based on your dominant patterns.
 * - Analytical: Sharp angles, geometric precision.
 * - Patience: Smooth curves, concentric circles.
 * - Helping: Radiating lines, open shapes.
 * - Exploring: Asymmetry, wandering paths.
 * - Building: Solid blocks, constructive foundations.
 */
export function EssenceSigil() {
    const { raw, decisionStyle } = useInsights()
    const patterns = raw.patterns

    // Calculate parameters for the generative art
    const params = useMemo(() => {
        const total = Object.values(patterns).reduce((a, b) => a + b, 0) || 1

        // Normalize weights (0-1)
        return {
            sharpness: (patterns.analytical + patterns.building) / total, // 0 = round, 1 = sharp
            complexity: (patterns.exploring + patterns.analytical) / total, // line density
            radiance: (patterns.helping + patterns.exploring) / total, // outer glow/rays
            stability: (patterns.patience + patterns.building) / total, // rotation speed (inverse)
            color: PATTERN_METADATA[decisionStyle.primaryPattern?.type || 'patience'].color
        }
    }, [patterns, decisionStyle])

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-8 min-h-[400px]">

            {/* The Sigil */}
            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Generative SVG */}
                <motion.svg
                    viewBox="0 0 200 200"
                    className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 60 * (1 - params.stability) + 20, // 20s (unstable) to 80s (stable)
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <defs>
                        <radialGradient id="sigilGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={params.color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={params.color} stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Background Glow */}
                    <circle cx="100" cy="100" r="80" fill="url(#sigilGlow)" />

                    {/* Core Shape - Morphs between Circle (Patience) and Square/Poly (Analytical) */}
                    <motion.path
                        d={generateCorePath(params.sharpness)}
                        fill="none"
                        stroke={params.color}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />

                    {/* Radiating Lines (Helping/Exploring) */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <motion.line
                            key={i}
                            x1="100" y1="100"
                            x2={100 + Math.cos(i * Math.PI / 4) * (50 + params.radiance * 40)}
                            y2={100 + Math.sin(i * Math.PI / 4) * (50 + params.radiance * 40)}
                            stroke={params.color}
                            strokeWidth="1"
                            opacity={params.radiance}
                            strokeDasharray="4 4"
                            animate={{
                                opacity: [0.2, params.radiance, 0.2],
                                strokeDashoffset: [0, 10]
                            }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
                        />
                    ))}

                    {/* Complexity Orbits */}
                    {params.complexity > 0.3 && (
                        <ellipse cx="100" cy="100" rx={40 + params.complexity * 20} ry={40 - params.complexity * 10}
                            stroke={params.color} strokeWidth="0.5" fill="none" opacity="0.5"
                        />
                    )}

                </motion.svg>

                {/* Center Anchor */}
                <div className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_10px_white]" />
            </div>

            {/* Description */}
            <div className="text-center max-w-xs space-y-2">
                <h3 className="font-serif text-xl font-bold" style={{ color: params.color }}>
                    {decisionStyle.primaryPattern?.label || "The Void"}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {decisionStyle.primaryPattern?.description}
                </p>

                {decisionStyle.secondaryPattern && (
                    <p className="text-[10px] text-slate-400 mt-2">
                        Tempered by <span className="font-semibold">{decisionStyle.secondaryPattern.label}</span>
                    </p>
                )}
            </div>

        </div>
    )
}

// Helper to morph shape smoothly
// Reverted to Distinct Geometric Shapes for Craftsmanship
// We want crisp, intentional forms.
function generateCorePath(sharpness: number): string {
    if (sharpness > 0.6) {
        // The Diamond (Sharp, Analytical)
        return "M 100 20 L 180 100 L 100 180 L 20 100 Z"
    } else if (sharpness > 0.3) {
        // The Hexagon (Building, Structured)
        return "M 100 20 L 170 60 L 170 140 L 100 180 L 30 140 L 30 60 Z"
    } else {
        // The Circle (Patience, Flow)
        return "M 100 20 A 80 80 0 1 1 99.9 20 Z"
    }
}
