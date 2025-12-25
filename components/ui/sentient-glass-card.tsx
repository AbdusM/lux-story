"use client"

/**
 * SentientGlassCard - Glass Morphism Card Component
 *
 * Philosophy: "The UI IS the game state"
 * Inspired by JARVIS clinical interface principles
 *
 * Features:
 * - Glass morphism with backdrop blur
 * - Spring physics entrance animations
 * - Pattern-based glow effects
 * - Graceful fallback for low-end devices
 * - Respects prefers-reduced-motion
 */

import * as React from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { springs } from "@/lib/animations"
import { type PatternType, getPatternColor } from "@/lib/patterns"

export interface SentientGlassCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Entrance animation direction */
  entrance?: "bottom" | "left" | "right" | "scale" | "none"
  /** Pattern glow effect */
  pattern?: PatternType
  /** Animation delay in seconds */
  delay?: number
  /** Use solid background instead of blur (for low-end devices) */
  solid?: boolean
  /** Custom glow color (overrides pattern) */
  glowColor?: string
  /** Children content */
  children: React.ReactNode
}

const entranceVariants: Record<string, Variants> = {
  bottom: {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.98 }
  },
  left: {
    hidden: { opacity: 0, x: -30, scale: 0.98 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -15, scale: 0.98 }
  },
  right: {
    hidden: { opacity: 0, x: 30, scale: 0.98 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 15, scale: 0.98 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  },
  none: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
    exit: { opacity: 1 }
  }
}

/**
 * Convert hex color to rgba with opacity
 * Uses canonical colors from lib/patterns.ts
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Get pattern glow color with opacity
 * Derives from canonical pattern colors
 */
function getPatternGlowColor(pattern: PatternType): string {
  const color = getPatternColor(pattern)
  return hexToRgba(color, 0.15)
}

const SentientGlassCard = React.forwardRef<HTMLDivElement, SentientGlassCardProps>(
  ({
    className,
    entrance = "bottom",
    pattern,
    delay = 0,
    solid = false,
    glowColor,
    children,
    ...props
  }, ref) => {
    const prefersReducedMotion = useReducedMotion()

    // Determine glow effect from canonical pattern colors
    const patternGlow = pattern ? getPatternGlowColor(pattern) : undefined
    const effectiveGlow = glowColor || patternGlow

    // Build box-shadow with optional glow
    const boxShadow = effectiveGlow
      ? `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px ${effectiveGlow}`
      : "0 8px 32px rgba(0, 0, 0, 0.3)"

    // Styles for glass effect
    const glassStyles: React.CSSProperties = solid
      ? {
          background: "rgba(10, 12, 16, 0.92)",
          boxShadow
        }
      : {
          background: "rgba(10, 12, 16, 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow
        }

    return (
      <motion.div
        ref={ref}
        initial={prefersReducedMotion || entrance === "none" ? "visible" : "hidden"}
        animate="visible"
        exit="exit"
        variants={entranceVariants[entrance]}
        transition={{
          delay: prefersReducedMotion ? 0 : delay,
          ...springs.smooth
        }}
        className={cn(
          // Base glass styling
          "border border-white/8 rounded-2xl",
          // Hover state
          "transition-[border-color] duration-200 ease-out",
          "hover:border-white/12",
          className
        )}
        style={glassStyles}
        data-pattern={pattern}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

SentientGlassCard.displayName = "SentientGlassCard"

/**
 * Glass Card Content - Provides consistent padding
 */
const SentientGlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 sm:p-5", className)}
    {...props}
  />
))

SentientGlassCardContent.displayName = "SentientGlassCardContent"

/**
 * Glass Card Header - For dialogue/choice headers
 */
const SentientGlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-4 sm:px-5 py-3",
      "border-b border-white/5",
      "flex items-center gap-3",
      className
    )}
    {...props}
  />
))

SentientGlassCardHeader.displayName = "SentientGlassCardHeader"

export {
  SentientGlassCard,
  SentientGlassCardContent,
  SentientGlassCardHeader
}
