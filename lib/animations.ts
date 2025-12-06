/**
 * Shared Animation Constants & Utilities
 *
 * Centralized animation configuration for consistency across the app.
 * Mobile-first, performance-optimized, accessibility-aware.
 */

import type { Variants, Transition } from 'framer-motion'

// =============================================================================
// SPRING CONFIGURATIONS
// =============================================================================

export const springs = {
  /** Snappy, responsive - for buttons, small interactions */
  snappy: { type: 'spring', stiffness: 400, damping: 25 } as Transition,

  /** Smooth, elegant - for panels, modals */
  smooth: { type: 'spring', stiffness: 300, damping: 30 } as Transition,

  /** Gentle, subtle - for fades, reveals */
  gentle: { type: 'spring', stiffness: 200, damping: 25 } as Transition,

  /** Quick, minimal - for micro-interactions */
  quick: { type: 'spring', stiffness: 500, damping: 30 } as Transition,
}

// =============================================================================
// DURATION PRESETS (for non-spring animations)
// =============================================================================

export const durations = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  dramatic: 0.6,
}

// =============================================================================
// STAGGER CONFIGURATIONS
// =============================================================================

export const stagger = {
  /** Fast stagger for lists (50ms between items) */
  fast: 0.05,

  /** Normal stagger (80ms between items) */
  normal: 0.08,

  /** Slow stagger for dramatic reveals (120ms) */
  slow: 0.12,
}

// =============================================================================
// REUSABLE VARIANTS
// =============================================================================

/**
 * Fade in from below - good for cards, list items
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle
  },
}

/**
 * Fade in from left - good for slide-in elements
 */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.gentle
  },
}

/**
 * Scale fade - good for modals, popovers
 */
export const scaleFade: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.smooth
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: durations.fast }
  },
}

/**
 * Stagger container - wrap children that should animate sequentially
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.1,
    },
  },
}

/**
 * Stagger item - use inside staggerContainer
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.snappy
  },
}

// =============================================================================
// GESTURE PRESETS (Mobile-first)
// =============================================================================

/**
 * Button interactions - subtle, tactile feedback
 */
export const buttonGestures = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springs.quick,
}

/**
 * Card interactions - lift effect on hover
 */
export const cardGestures = {
  whileHover: {
    y: -2,
    transition: springs.snappy
  },
  whileTap: { scale: 0.99 },
}

/**
 * Icon interactions - playful bounce
 */
export const iconGestures = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.9 },
  transition: springs.quick,
}

// =============================================================================
// VIEWPORT DETECTION (for whileInView)
// =============================================================================

export const viewport = {
  /** Trigger once when 20% visible */
  once: { once: true, amount: 0.2 },

  /** Trigger once when 50% visible */
  onceHalf: { once: true, amount: 0.5 },

  /** Re-trigger on scroll (for repeating animations) */
  always: { once: false, amount: 0.2 },
}

// =============================================================================
// PANEL ANIMATIONS (Consistent across Journal, Constellation, ThoughtCabinet)
// =============================================================================

export const panelFromRight: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: springs.smooth
  },
  exit: {
    x: '100%',
    transition: { duration: durations.normal }
  },
}

export const panelFromLeft: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: springs.smooth
  },
  exit: {
    x: '-100%',
    transition: { duration: durations.normal }
  },
}

export const panelFromBottom: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: springs.smooth
  },
  exit: {
    y: '100%',
    transition: { duration: durations.normal }
  },
}

export const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

// =============================================================================
// PROGRESS BAR ANIMATION
// =============================================================================

export const progressBar = {
  initial: { scaleX: 0 },
  animate: (progress: number) => ({
    scaleX: progress,
    transition: springs.smooth
  }),
  style: { originX: 0 }, // Scale from left
}

// =============================================================================
// ACCESSIBILITY HELPER
// =============================================================================

/**
 * Returns reduced motion safe transitions
 * Use: transition={prefersReducedMotion ? reducedMotion : springs.smooth}
 */
export const reducedMotion: Transition = {
  duration: 0,
}

/**
 * Check if user prefers reduced motion
 * Note: In components, prefer useReducedMotion() hook from framer-motion
 */
export function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
