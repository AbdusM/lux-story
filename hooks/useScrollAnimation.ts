"use client"

/**
 * useScrollAnimation - CSS Scroll-Driven Animation Hook with Fallback
 *
 * Uses native CSS scroll-driven animations when supported (Chrome 115+, Safari 17+, Firefox 125+)
 * Falls back to Intersection Observer + class toggle for older browsers.
 *
 * Performance: Native scroll animations run off main thread at 60fps.
 */

import { useEffect, useState, useRef, RefObject, useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

let _isScrollTimelineSupported: boolean | null = null

/**
 * Check if CSS scroll-driven animations are supported
 * Cached after first check for performance
 */
export function isScrollTimelineSupported(): boolean {
  if (_isScrollTimelineSupported !== null) {
    return _isScrollTimelineSupported
  }

  if (typeof CSS === 'undefined' || !CSS.supports) {
    _isScrollTimelineSupported = false
    return false
  }

  // Check for animation-timeline support
  _isScrollTimelineSupported =
    CSS.supports('animation-timeline', 'scroll()') ||
    CSS.supports('animation-timeline', 'view()')

  return _isScrollTimelineSupported
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATION HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export type ScrollAnimationType =
  | 'reveal'      // Fade in + slide up when entering view
  | 'parallax'    // Move at different rate than scroll
  | 'progress'    // Width/scale tied to scroll progress

interface UseScrollAnimationOptions {
  /** Type of scroll animation */
  type: ScrollAnimationType
  /** Intersection threshold for fallback (0-1, default: 0.2) */
  threshold?: number
  /** Whether animation should only play once (default: true) */
  once?: boolean
  /** Custom CSS class to apply when supported */
  customClass?: string
}

interface UseScrollAnimationReturn {
  /** Ref to attach to the animated element */
  ref: RefObject<HTMLElement>
  /** Class name to apply - handles both native and fallback */
  className: string
  /** Whether element is in view (for fallback) */
  isInView: boolean
  /** Whether native scroll animations are supported */
  isNativeSupported: boolean
  /** Style overrides for fallback mode */
  style: React.CSSProperties
}

/**
 * Hook for scroll-driven animations with progressive fallback
 *
 * @example
 * ```tsx
 * function FadeInMessage({ children }) {
 *   const { ref, className, style } = useScrollAnimation({ type: 'reveal' })
 *
 *   return (
 *     <div ref={ref} className={className} style={style}>
 *       {children}
 *     </div>
 *   )
 * }
 * ```
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions
): UseScrollAnimationReturn {
  const { type, threshold = 0.2, once = true, customClass } = options

  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Check for native support (memoized)
  const isNativeSupported = useMemo(() => isScrollTimelineSupported(), [])

  // Intersection Observer fallback for older browsers
  useEffect(() => {
    // Skip if native supported, reduced motion, or already animated (if once)
    if (isNativeSupported || prefersReducedMotion || !ref.current) return
    if (once && hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) {
            setHasAnimated(true)
            observer.disconnect()
          }
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isNativeSupported, threshold, once, hasAnimated, prefersReducedMotion])

  // Build class name based on support and state
  const className = useMemo(() => {
    if (prefersReducedMotion) return ''

    // Native CSS class (animation defined in scroll-animations.css)
    if (isNativeSupported) {
      return customClass || `scroll-${type}`
    }

    // Fallback class for Intersection Observer mode
    const baseClass = `scroll-${type}-fallback`
    const stateClass = isInView ? `${baseClass}-visible` : `${baseClass}-hidden`
    return `${baseClass} ${stateClass}`
  }, [type, isNativeSupported, isInView, prefersReducedMotion, customClass])

  // Fallback styles (only applied when native not supported)
  const style: React.CSSProperties = useMemo(() => {
    if (isNativeSupported || prefersReducedMotion) return {}

    // Base styles for fallback animations
    switch (type) {
      case 'reveal':
        return {
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        }
      case 'parallax':
        // Parallax needs scroll position - simplified fallback
        return {}
      case 'progress':
        // Progress needs scroll position - simplified fallback
        return {}
      default:
        return {}
    }
  }, [type, isInView, isNativeSupported, prefersReducedMotion])

  return {
    ref: ref as RefObject<HTMLElement>,
    className,
    isInView,
    isNativeSupported,
    style,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS HOOK
// ═══════════════════════════════════════════════════════════════════════════════

interface UseScrollProgressOptions {
  /** Scroll container ref (defaults to document) */
  container?: RefObject<HTMLElement>
}

/**
 * Hook that tracks scroll progress as a 0-1 value
 * Useful for progress indicators and parallax effects
 *
 * @example
 * ```tsx
 * function ProgressBar() {
 *   const progress = useScrollProgress()
 *   return <div style={{ width: `${progress * 100}%` }} />
 * }
 * ```
 */
export function useScrollProgress(options: UseScrollProgressOptions = {}): number {
  const { container } = options
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = container?.current || document.documentElement

    const handleScroll = () => {
      const scrollTop = container?.current
        ? container.current.scrollTop
        : window.scrollY
      const scrollHeight = container?.current
        ? container.current.scrollHeight - container.current.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight

      const newProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0
      setProgress(Math.max(0, Math.min(1, newProgress)))
    }

    const target = container?.current || window
    target.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial value

    return () => target.removeEventListener('scroll', handleScroll)
  }, [container])

  return progress
}
