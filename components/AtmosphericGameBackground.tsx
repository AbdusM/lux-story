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

export interface AtmosphericGameBackgroundProps {
  /** Current character being spoken to (determines atmosphere color) */
  characterId: CharacterId | null
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
  isProcessing = false,
  children,
  className
}: AtmosphericGameBackgroundProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={cn("relative min-h-screen", className)}>
      {/* Atmospheric Background Layer */}
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

      {/* Processing Pulse Overlay (subtle) */}
      {isProcessing && !prefersReducedMotion && (
        <motion.div
          className="fixed inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.03, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: "radial-gradient(circle at center, var(--pattern-patience, #8b5cf6) 0%, transparent 70%)"
          }}
          aria-hidden="true"
        />
      )}

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
