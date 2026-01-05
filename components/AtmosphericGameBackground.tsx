"use client"

/**
 * AtmosphericGameBackground - Character-Reactive Full-Screen Background
 *
 * Philosophy: "The UI IS the game state"
 * Inspired by JARVIS Sentient Glass design
 *
 * Features:
 * - Background color shifts based on current character
 * - Subtle grid overlay for depth
 * - Vignette effect for focus
 * - Processing state visual feedback
 * - Respects prefers-reduced-motion
 */

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { CharacterId } from "@/lib/graph-registry"
import { useStationStore } from "@/lib/station-state"

export interface AtmosphericGameBackgroundProps {
  /** Current character being spoken to (determines atmosphere color) */
  characterId: CharacterId | null
  /** Current active emotion (determines visual hue/pulse) */
  emotion?: 'fear_awe' | 'anxiety' | 'curiosity' | 'calm' | 'hope'
  /** Whether the game is processing (thinking indicator) */
  isProcessing?: boolean
  /** Children to render on top of the background */
  children: React.ReactNode
  /** Additional class names */
  className?: string
}

/**
 * AtmosphericGameBackground
 *
 * Renders a full-screen atmospheric background that shifts color
 * based on the current character. Creates immersive atmosphere
 * without distracting from dialogue.
 */
export function AtmosphericGameBackground({
  characterId,
  emotion, // Added missing prop
  isProcessing: _isProcessing = false,
  children,
  className
}: AtmosphericGameBackgroundProps) {
  const _prefersReducedMotion = useReducedMotion()

  // P5: Subscribe to station atmosphere
  const atmosphere = useStationStore((state) => state.atmosphere)

  return (
    <div className={cn("relative min-h-screen transition-colors duration-[2000ms]", className)}>
      {/* Atmospheric Background Layer - DYNAMIC SHADER */}
      <motion.div
        className="atmosphere absolute inset-0 w-full h-full -z-10"
        data-character={characterId}
        data-atmosphere={atmosphere}
        data-emotion={emotion} // Triggers CSS variables for color
        initial={false}
        animate={{
          filter: emotion === 'fear_awe' ? 'hue-rotate(240deg) saturate(0.5)' :
            emotion === 'anxiety' ? 'hue-rotate(-20deg) saturate(1.2)' :
              emotion === 'curiosity' ? 'hue-rotate(180deg) saturate(0.8)' :
                'hue-rotate(0deg) saturate(1)'
        }}
        transition={{ duration: 3, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      {/* Processing Pulse REMOVED - was distracting */}

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}


/**
 * Standalone Atmosphere - For use without children wrapper
 * Can be placed at the root of a page
 */
export function Atmosphere({
  characterId,
  isProcessing = false
}: Omit<AtmosphericGameBackgroundProps, "children" | "className">) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="atmosphere"
      data-character={characterId}
      data-processing={isProcessing ? "true" : undefined}
      initial={false}
      animate={{
        opacity: isProcessing ? 0.95 : 1
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: "easeInOut"
      }}
      aria-hidden="true"
    />
  )
}

export default AtmosphericGameBackground
