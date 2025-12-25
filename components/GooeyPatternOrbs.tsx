"use client"

/**
 * GooeyPatternOrbs - Organic Pattern Visualization
 *
 * Creates a cluster of floating orbs that morph and blend together
 * using SVG gooey filter. Shows when patterns are balanced.
 *
 * Effect: Multiple orbs drift and merge organically when patterns
 * are similar in strength, visualizing harmony.
 *
 * Mobile-safe: GPU-accelerated SVG filters run at 60fps.
 * Respects prefers-reduced-motion.
 */

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { type PatternType, getPatternColor, PATTERN_METADATA } from "@/lib/patterns"
import { GOOEY_FILTER_ID, GooeyFilterDef } from "@/lib/svg-filters"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PatternWeight {
  pattern: PatternType
  weight: number // 0-1, percentage of total
}

export interface GooeyPatternOrbsProps {
  /** Array of patterns with their relative weights */
  patterns: PatternWeight[]
  /** Container size (all orbs fit within) */
  size?: "sm" | "md" | "lg" | "xl"
  /** Show gooey merge effect (requires balanced patterns) */
  enableGooey?: boolean
  /** Additional class names */
  className?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const SIZE_MAP = {
  sm: { container: 80, orbBase: 20 },
  md: { container: 120, orbBase: 28 },
  lg: { container: 160, orbBase: 36 },
  xl: { container: 200, orbBase: 44 },
}

// Orbit positions for up to 5 patterns (circular arrangement)
const ORBIT_POSITIONS = [
  { x: 0, y: 0 },      // Center
  { x: 0.35, y: 0 },   // Right
  { x: -0.35, y: 0 },  // Left
  { x: 0, y: 0.35 },   // Bottom
  { x: 0, y: -0.35 },  // Top
]

// Animation durations for organic movement
const FLOAT_DURATIONS = [4.2, 5.1, 3.8, 4.7, 5.5]
const FLOAT_DELAYS = [0, 0.5, 1.0, 1.5, 2.0]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GooeyPatternOrbs - Morphing pattern visualization
 *
 * @example
 * ```tsx
 * <GooeyPatternOrbs
 *   patterns={[
 *     { pattern: 'analytical', weight: 0.3 },
 *     { pattern: 'exploring', weight: 0.25 },
 *     { pattern: 'helping', weight: 0.25 },
 *     { pattern: 'building', weight: 0.2 },
 *   ]}
 *   enableGooey={true}
 * />
 * ```
 */
export function GooeyPatternOrbs({
  patterns,
  size = "md",
  enableGooey = true,
  className,
}: GooeyPatternOrbsProps) {
  const prefersReducedMotion = useReducedMotion()
  const dimensions = SIZE_MAP[size]

  // Sort patterns by weight (highest first) and take top 5
  const sortedPatterns = [...patterns]
    .filter(p => p.weight > 0.05) // Ignore very small weights
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)

  // Check if patterns are "balanced" (no single dominant pattern)
  // Balanced = largest pattern is less than 35% of total
  const isBalanced = sortedPatterns.length > 1 &&
    (sortedPatterns[0]?.weight || 0) < 0.35

  // Apply gooey filter only when enabled, balanced, and not reduced motion
  const useGooeyEffect = enableGooey && isBalanced && !prefersReducedMotion

  if (sortedPatterns.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
      style={{
        width: dimensions.container,
        height: dimensions.container,
      }}
      role="presentation"
      aria-hidden="true"
    >
      {/* Inject gooey filter definition */}
      <GooeyFilterDef blur={10} contrast={18} alphaOffset={-8} />

      {/* Orb container with optional gooey filter */}
      <div
        className="absolute inset-0"
        style={{
          filter: useGooeyEffect ? `url(#${GOOEY_FILTER_ID})` : undefined,
        }}
      >
        {sortedPatterns.map((item, index) => (
          <FloatingOrb
            key={item.pattern}
            pattern={item.pattern}
            weight={item.weight}
            index={index}
            containerSize={dimensions.container}
            orbBase={dimensions.orbBase}
            animate={!prefersReducedMotion}
            position={ORBIT_POSITIONS[index] || { x: 0, y: 0 }}
          />
        ))}
      </div>

      {/* Balance indicator glow (shows when gooey is active) */}
      {useGooeyEffect && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)",
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLOATING ORB SUBCOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface FloatingOrbProps {
  pattern: PatternType
  weight: number
  index: number
  containerSize: number
  orbBase: number
  animate: boolean
  position: { x: number; y: number }
}

function FloatingOrb({
  pattern,
  weight,
  index,
  containerSize,
  orbBase,
  animate,
  position,
}: FloatingOrbProps) {
  const color = getPatternColor(pattern)

  // Size based on weight (larger weight = larger orb)
  const orbSize = orbBase * (0.6 + weight * 0.8)

  // Center position (container center + offset)
  const centerX = containerSize / 2
  const centerY = containerSize / 2
  const offsetX = position.x * containerSize * 0.35
  const offsetY = position.y * containerSize * 0.35

  // Float animation parameters
  const floatDuration = FLOAT_DURATIONS[index] || 4
  const floatDelay = FLOAT_DELAYS[index] || 0
  const floatRange = containerSize * 0.08 // Subtle float range

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: orbSize,
        height: orbSize,
        left: centerX + offsetX - orbSize / 2,
        top: centerY + offsetY - orbSize / 2,
        background: `radial-gradient(circle at 30% 30%, ${color}ee, ${color}88)`,
        boxShadow: `0 0 ${orbSize * 0.5}px ${color}40, inset 0 0 ${orbSize * 0.2}px rgba(255,255,255,0.3)`,
      }}
      animate={
        animate
          ? {
              x: [0, floatRange, -floatRange / 2, floatRange / 2, 0],
              y: [0, -floatRange / 2, floatRange, -floatRange / 2, 0],
              scale: [1, 1.05, 0.98, 1.03, 1],
            }
          : {}
      }
      transition={{
        duration: floatDuration,
        delay: floatDelay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      title={PATTERN_METADATA[pattern].label}
    >
      {/* Inner highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: orbSize * 0.25,
          height: orbSize * 0.25,
          top: orbSize * 0.15,
          left: orbSize * 0.2,
          background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Helper to convert pattern scores to weights
 */
export function patternScoresToWeights(
  scores: Record<PatternType, number>
): PatternWeight[] {
  const total = Object.values(scores).reduce((sum, v) => sum + v, 0)
  if (total === 0) return []

  return Object.entries(scores).map(([pattern, score]) => ({
    pattern: pattern as PatternType,
    weight: score / total,
  }))
}

/**
 * Compact variant for smaller spaces (e.g., header indicators)
 */
export function GooeyPatternOrbsCompact({
  patterns,
  className,
}: {
  patterns: PatternWeight[]
  className?: string
}) {
  return (
    <GooeyPatternOrbs
      patterns={patterns}
      size="sm"
      enableGooey={true}
      className={className}
    />
  )
}

export default GooeyPatternOrbs
