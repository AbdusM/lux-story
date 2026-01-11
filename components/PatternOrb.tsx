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
import { type PatternType, getPatternColor } from "@/lib/patterns"
import { springs } from "@/lib/animations"

export interface PatternOrbProps {
  /** Dominant pattern type */
  pattern: PatternType | null
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Trigger celebration animation */
  celebrate?: boolean
  /** Pattern Level (0-5) to determine visual state (Flickering -> Blazing) */
  intensity?: number
  /** Additional class names */
  className?: string
}

// Size configurations
const SIZE_MAP = {
  sm: { outer: 40, inner: 32 },
  md: { outer: 48, inner: 40 },
  lg: { outer: 60, inner: 48 },
}

/**
 * Get visual state config based on intensity (0-5)
 */
function getVisualState(level: number) {
  if (level < 2) return { label: 'Flickering', opacity: 0.4, scale: 0.9, pulse: 5 }
  if (level < 4) return { label: 'Glowing', opacity: 0.6, scale: 1.0, pulse: 4 }
  if (level < 5) return { label: 'Radiant', opacity: 0.8, scale: 1.15, pulse: 3 }
  return { label: 'Blazing', opacity: 0.9, scale: 1.3, pulse: 2 } // Level 5
}

/**
 * PatternOrb Component
 *
 * Ambient indicator that breathes in rhythm with the story.
 * Now reflects intensity via "Visual State Labels".
 */
export function PatternOrb({
  pattern,
  size = "md",
  celebrate = false,
  intensity = 3, // Default to Glowing
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

  // Get color from canonical source (lib/patterns.ts)
  const orbColor = pattern ? getPatternColor(pattern) : "#64748b" // Default slate
  const dimensions = SIZE_MAP[size]
  const visualState = getVisualState(intensity)

  const labelText = pattern
    ? `${visualState.label} ${pattern.charAt(0).toUpperCase() + pattern.slice(1)}`
    : 'Dormant Pattern'

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
      title={labelText} // Native tooltip
    >
      {/* Outer glow ring - Modulated by Visual State */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${orbColor}30 0%, transparent 70%)`,
        }}
        animate={
          prefersReducedMotion
            ? { opacity: visualState.opacity }
            : {
              scale: [1, visualState.scale, 1], // Higher intensity = larger breath
              opacity: [visualState.opacity * 0.6, visualState.opacity, visualState.opacity * 0.6],
            }
        }
        transition={{
          duration: visualState.pulse, // Higher intensity = faster pulse
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
          boxShadow: `0 0 ${20 * visualState.scale}px ${orbColor}50, inset 0 0 10px rgba(255,255,255,0.2)`,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
              scale: [1, 1.05, 1],
            }
        }
        transition={{
          duration: visualState.pulse,
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
          duration: visualState.pulse,
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
  const orbColor = pattern ? getPatternColor(pattern) : "#64748b"

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
