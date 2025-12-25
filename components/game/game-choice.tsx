"use client"

/**
 * GameChoice - Glass Morphism Choice Button
 *
 * Philosophy: "Less is More" (JARVIS Commandment #10)
 * - Removed chevron icons (visual noise)
 * - Glass morphism styling with subtle glow
 * - Pattern-aligned choices have subtle glow feedback
 */

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { LoadingDots } from "@/components/ui/loading-dots"
import { cn } from "@/lib/utils"
import { springs, STAGGER_DELAY } from "@/lib/animations"
import { type PatternType, getPatternColor } from "@/lib/patterns"

/**
 * Convert hex color to rgba with opacity
 * Matches lib/patterns.ts canonical colors
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Get pattern glow shadow for hover effect
 * Uses canonical colors from lib/patterns.ts
 */
function getPatternGlowShadow(pattern: PatternType): string {
  const color = getPatternColor(pattern)
  return `0 0 20px ${hexToRgba(color, 0.2)}`
}

export interface GameChoiceProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  choice: {
    text: string
    subtext?: string
    next?: string
    consequence?: string
    pattern?: PatternType
  }
  onSelect?: () => void
  isSelected?: boolean
  loading?: boolean
  index?: number
  animated?: boolean
  /** Use glass morphism styling */
  glass?: boolean
}

const GameChoice = React.forwardRef<HTMLButtonElement, GameChoiceProps>(
  ({
    className,
    choice,
    onSelect,
    isSelected,
    loading = false,
    index = 0,
    animated = true,
    glass = false, // Default to standard styling for backwards compatibility
    disabled,
    ...props
  }, ref) => {
    const prefersReducedMotion = useReducedMotion()

    // Get pattern glow shadow using canonical colors from lib/patterns.ts
    const patternGlowShadow = glass && choice.pattern
      ? getPatternGlowShadow(choice.pattern)
      : undefined

    // Animation variants - spring from bottom
    const variants = {
      hidden: { opacity: 0, y: 12 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: prefersReducedMotion ? 0 : index * STAGGER_DELAY.normal,
          ...springs.gentle
        }
      }
    }

    return (
      <motion.button
        ref={ref}
        onClick={onSelect}
        disabled={disabled || loading || isSelected}
        initial={animated && !prefersReducedMotion ? "hidden" : false}
        animate="visible"
        variants={variants}
        whileHover={patternGlowShadow ? { boxShadow: patternGlowShadow } : undefined}
        className={cn(
          // Base styles - clean and minimal
          "w-full text-left",
          "px-4 py-3.5",
          "rounded-xl",
          "transition-all duration-200 ease-out",

          // Touch target - Apple HIG minimum
          "min-h-[44px]",

          // Glass morphism styling (dark theme, when enabled)
          glass && [
            "bg-white/5",
            "border border-white/10",
            "backdrop-blur-sm",
            "hover:bg-white/10",
            "hover:border-white/15",
            "active:bg-white/15",
            "text-slate-100",
          ],

          // Standard styling (light theme, default)
          !glass && [
            "hover:bg-slate-50 dark:hover:bg-slate-800",
            "active:bg-slate-100 dark:active:bg-slate-700",
            "text-slate-900 dark:text-slate-100",
          ],

          // Typography - optimal readability
          "text-[17px] leading-relaxed",
          "font-normal",

          // Focus state - accessible
          "focus-visible:outline-none focus-visible:ring-2",
          glass
            ? "focus-visible:ring-violet-400/50 focus-visible:ring-offset-transparent"
            : "focus-visible:ring-slate-400 focus-visible:ring-offset-2",

          // Selected state
          isSelected && (glass
            ? "bg-white/15 border-white/20"
            : "bg-slate-100 dark:bg-slate-800"
          ),

          // Disabled/Loading state
          (disabled || loading || isSelected) && "cursor-not-allowed",
          loading && "opacity-60",

          className
        )}
        data-pattern={choice.pattern}
        {...props}
      >
        <div className="flex-1">
          <div>{choice.text}</div>
          {choice.subtext && (
            <div className="text-[15px] text-slate-400 mt-0.5">
              {choice.subtext}
            </div>
          )}
        </div>

        {loading && (
          <LoadingDots size="sm" className="ml-2" />
        )}
      </motion.button>
    )
  }
)

GameChoice.displayName = "GameChoice"

// Container component for choices - minimal spacing
export const GameChoiceGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-3", className)}
      role="group"
      aria-label="Story choices"
      {...props}
    >
      {children}
    </div>
  )
})

GameChoiceGroup.displayName = "GameChoiceGroup"

export { GameChoice }