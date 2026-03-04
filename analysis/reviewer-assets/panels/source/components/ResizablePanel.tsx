"use client"

/**
 * ResizablePanel Component
 *
 * A reusable component that animates height changes when children change.
 * Solves the classic Framer Motion limitation of animating from height auto to auto.
 *
 * Features:
 * - Smooth measured height animations using useMeasure
 * - Children-based keying (only animates when content actually changes)
 * - Cross-fade transitions with absolute positioning
 * - No animation on initial render
 * - Multiple transition styles (crossFade, fade, slideLeft, slideRight)
 *
 * Based on Sam Selikoff's technique:
 * @see https://github.com/samselikoff/2022-06-09-resizable-panel
 */

import { useMemo } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useMeasure } from '@/hooks/useMeasure'
import { serializeChildren } from '@/lib/ignore-circular-references'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/animations'

// =============================================================================
// TYPES
// =============================================================================

export type TransitionStyle = 'crossFade' | 'fade' | 'slideLeft' | 'slideRight' | 'none'

export interface ResizablePanelProps {
  /** Content to render inside the panel */
  children: React.ReactNode
  /** Additional classes for the outer container */
  className?: string
  /** Additional classes for the inner content wrapper (for padding, etc.) */
  innerClassName?: string
  /** Transition style for content changes */
  transition?: TransitionStyle
  /** Override the automatic key with a custom one */
  customKey?: string
  /** Duration multiplier for animations (default: 1) */
  duration?: number
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const getContentVariants = (style: TransitionStyle): Variants => {
  switch (style) {
    case 'crossFade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    case 'slideLeft':
      return {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
      }
    case 'slideRight':
      return {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
      }
    case 'none':
    default:
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 }
      }
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ResizablePanel({
  children,
  className,
  innerClassName,
  transition = 'crossFade',
  customKey,
  duration = 1
}: ResizablePanelProps) {
  // Measure the content height
  const { ref, bounds } = useMeasure<HTMLDivElement>()

  // Create a stable key from children (only changes when content changes)
  const contentKey = useMemo(
    () => customKey ?? serializeChildren(children),
    [customKey, children]
  )

  // Get animation variants based on transition style
  const contentVariants = useMemo(
    () => getContentVariants(transition),
    [transition]
  )

  // Determine if we've measured yet
  const hasMeasured = bounds.height > 0

  // Animation mode: 'wait' makes old content exit before new enters (for 'fade')
  // 'sync' allows cross-fade (for 'crossFade')
  const animationMode = transition === 'fade' ? 'wait' : 'sync'

  return (
    <motion.div
      className={cn('relative overflow-hidden', className)}
      // Animate height based on measured content
      animate={{
        height: hasMeasured ? bounds.height : 'auto'
      }}
      transition={{
        ...springs.smooth,
        duration: 0.3 * duration
      }}
    >
      <AnimatePresence
        initial={false}
        mode={animationMode}
      >
        <motion.div
          key={contentKey}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            ...springs.smooth,
            duration: 0.3 * duration
          }}
          // Absolute positioning for cross-fade effect
          // Switch to relative before measurement for accurate sizing
          style={{
            position: hasMeasured ? 'absolute' : 'relative',
            width: '100%'
          }}
        >
          <div ref={ref} className={innerClassName}>
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

// =============================================================================
// SIMPLIFIED VARIANT FOR SIMPLE HEIGHT ANIMATIONS
// =============================================================================

export interface SimpleResizablePanelProps {
  /** Content to render inside the panel */
  children: React.ReactNode
  /** Additional classes for the outer container */
  className?: string
}

/**
 * SimpleResizablePanel
 *
 * A simpler version that just animates height without content transitions.
 * Useful when you don't need cross-fade effects, just smooth height changes.
 */
export function SimpleResizablePanel({
  children,
  className
}: SimpleResizablePanelProps) {
  const { ref, bounds } = useMeasure<HTMLDivElement>()
  const hasMeasured = bounds.height > 0

  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      animate={{
        height: hasMeasured ? bounds.height : 'auto'
      }}
      transition={springs.smooth}
    >
      <div ref={ref}>
        {children}
      </div>
    </motion.div>
  )
}

export default ResizablePanel
