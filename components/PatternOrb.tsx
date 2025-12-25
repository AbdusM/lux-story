"use client"

/**
 * PatternOrb - The Station's Soul
 *
 * Philosophy: "Ambient Presence" (JARVIS Commandment #3)
 * Small orb that reflects player's dominant pattern.
 * Not interactive - purely ambient feedback.
 *
 * Features:
 * - Breathing animation (4s cycle)
 * - Color reflects dominant pattern
 * - Milestone celebration pulse
 * - Respects prefers-reduced-motion
 */

import * as React from "react"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { PatternType } from "@/lib/patterns"
import { springs } from "@/lib/animations"

export interface PatternOrbProps {
  /** Dominant pattern type */
  pattern: PatternType | null
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Trigger celebration animation */
  celebrate?: boolean
  /** Additional class names */
  className?: string
}

// Pattern colors matching CSS variables
const PATTERN_COLORS: Record<PatternType, string> = {
  analytical: "#6366f1", // Indigo
  helping: "#10b981",    // Emerald
  building: "#eab308",   // Gold
  patience: "#8b5cf6",   // Violet
  exploring: "#f59e0b",  // Amber
}

// Size configurations
const SIZE_MAP = {
  sm: { outer: 40, inner: 32 },
  md: { outer: 48, inner: 40 },
  lg: { outer: 60, inner: 48 },
}

/**
 * PatternOrb Component
 *
 * Ambient indicator that breathes in rhythm with the story.
 * Positioned in corner of game interface.
 */
export function PatternOrb({
  pattern,
  size = "md",
  celebrate = false,
  className
}: PatternOrbProps) {
  const prefersReducedMotion = useReducedMotion()
  const [showCelebration, setShowCelebration] = React.useState(false)

  // Handle celebration trigger
  React.useEffect(() => {
    if (celebrate) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [celebrate])

  // Get color for current pattern
  const orbColor = pattern ? PATTERN_COLORS[pattern] : "#64748b" // Default slate
  const dimensions = SIZE_MAP[size]

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
      style={{
        width: dimensions.outer,
        height: dimensions.outer
      }}
      role="presentation"
      aria-hidden="true"
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${orbColor}30 0%, transparent 70%)`,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.15, 1],
                opacity: [0.5, 0.8, 0.5],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Core orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: dimensions.inner,
          height: dimensions.inner,
          background: `radial-gradient(circle at 30% 30%, ${orbColor}dd, ${orbColor}88)`,
          boxShadow: `0 0 20px ${orbColor}50, inset 0 0 10px rgba(255,255,255,0.2)`,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.05, 1],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Celebration ring burst */}
      <AnimatePresence>
        {showCelebration && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: orbColor,
            }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          />
        )}
      </AnimatePresence>

      {/* Celebration second ring (delayed) */}
      <AnimatePresence>
        {showCelebration && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: orbColor,
            }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: "easeOut",
            }}
          />
        )}
      </AnimatePresence>

      {/* Inner shine */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: dimensions.inner * 0.3,
          height: dimensions.inner * 0.3,
          top: dimensions.inner * 0.15,
          left: dimensions.inner * 0.25,
          background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                opacity: [0.6, 0.9, 0.6],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

/**
 * PatternOrbIndicator - Pattern orb with label
 * For use in UI where pattern context is needed
 */
export function PatternOrbIndicator({
  pattern,
  label,
  size = "sm",
  className
}: {
  pattern: PatternType | null
  label?: string
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const orbColor = pattern ? PATTERN_COLORS[pattern] : "#64748b"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <PatternOrb pattern={pattern} size={size} />
      {label && (
        <motion.span
          className="text-sm font-medium"
          style={{ color: orbColor }}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.gentle}
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}

export default PatternOrb
