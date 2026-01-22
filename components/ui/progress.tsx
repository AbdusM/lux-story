"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion, useReducedMotion, useInView } from "framer-motion"

import { cn } from "@/lib/utils"
import { springs } from "@/lib/animations"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

/**
 * AnimatedProgress - Sprint 3: Progress bars animate from 0 to current on screen entry
 *
 * Uses width instead of scaleX to prevent rendering artifacts (per UI Best Practices)
 */
interface AnimatedProgressProps {
  /** Progress value 0-100 */
  value: number
  /** Additional class for the container */
  className?: string
  /** Additional class for the indicator bar */
  indicatorClassName?: string
  /** Height of the progress bar (default: h-2) */
  height?: string
  /** Animation delay in seconds */
  delay?: number
  /** Whether to animate (default: true) */
  animate?: boolean
}

const AnimatedProgress = React.forwardRef<HTMLDivElement, AnimatedProgressProps>(
  ({ value, className, indicatorClassName, height = "h-2", delay = 0, animate = true }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.5 })
    const prefersReducedMotion = useReducedMotion()

    // Don't animate if reduced motion or animate=false
    const shouldAnimate = animate && !prefersReducedMotion && isInView

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-slate-800/50",
          height,
          className
        )}
      >
        <div ref={containerRef} className="absolute inset-0">
          <motion.div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400",
              indicatorClassName
            )}
            initial={{ width: 0 }}
            animate={{ width: shouldAnimate ? `${Math.min(100, Math.max(0, value))}%` : 0 }}
            transition={
              shouldAnimate
                ? { delay, ...springs.smooth }
                : { duration: 0 }
            }
          />
        </div>
      </div>
    )
  }
)
AnimatedProgress.displayName = "AnimatedProgress"

/**
 * PatternProgress - Animated progress bar with pattern-specific colors
 */
interface PatternProgressProps extends Omit<AnimatedProgressProps, 'indicatorClassName'> {
  /** Pattern type for color */
  pattern?: 'analytical' | 'patience' | 'exploring' | 'helping' | 'building'
}

const PATTERN_PROGRESS_COLORS: Record<string, string> = {
  analytical: 'bg-gradient-to-r from-blue-500 to-blue-400',
  patience: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
  exploring: 'bg-gradient-to-r from-purple-500 to-purple-400',
  helping: 'bg-gradient-to-r from-pink-500 to-pink-400',
  building: 'bg-gradient-to-r from-amber-500 to-amber-400',
}

const PatternProgress = React.forwardRef<HTMLDivElement, PatternProgressProps>(
  ({ pattern = 'building', ...props }, ref) => {
    const colorClass = PATTERN_PROGRESS_COLORS[pattern] || PATTERN_PROGRESS_COLORS.building
    return <AnimatedProgress ref={ref} indicatorClassName={colorClass} {...props} />
  }
)
PatternProgress.displayName = "PatternProgress"

export { Progress, AnimatedProgress, PatternProgress }