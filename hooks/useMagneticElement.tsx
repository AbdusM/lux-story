"use client"

/**
 * useMagneticElement - Magnetic Cursor Effect Hook
 *
 * Creates a subtle magnetic attraction effect where elements
 * move toward the cursor on hover, with elastic snap-back.
 *
 * IMPORTANT: Desktop-only effect - automatically disabled on touch devices.
 *
 * Performance: Uses transform only (GPU-composited, no layout thrashing)
 */

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

interface MagneticConfig {
  /** Strength of magnetic pull (0-1, default: 0.3) */
  strength?: number
  /** Maximum pixel distance element can move (default: 15) */
  maxDistance?: number
  /** Duration of snap-back animation in ms (default: 400) */
  snapBackDuration?: number
}

interface MagneticState {
  x: number
  y: number
  isHovering: boolean
}

interface MagneticReturn<T extends HTMLElement> {
  /** Ref to attach to the element */
  ref: React.RefObject<T | null>
  /** Style object with transform - spread onto element */
  style: React.CSSProperties
  /** Whether cursor is currently hovering */
  isHovering: boolean
  /** Whether the effect is active (false on touch devices) */
  isActive: boolean
}

/**
 * Hook that adds magnetic cursor attraction to an element
 *
 * @example
 * ```tsx
 * function MagneticButton({ children }) {
 *   const { ref, style, isHovering } = useMagneticElement<HTMLButtonElement>({
 *     strength: 0.25,
 *     maxDistance: 10
 *   })
 *
 *   return (
 *     <button ref={ref} style={style}>
 *       {children}
 *     </button>
 *   )
 * }
 * ```
 */
export function useMagneticElement<T extends HTMLElement>(
  config: MagneticConfig = {}
): MagneticReturn<T> {
  const {
    strength = 0.3,
    maxDistance = 15,
    snapBackDuration = 400
  } = config

  const ref = useRef<T>(null)
  const prefersReducedMotion = useReducedMotion()

  // Check for coarse pointer (touch devices) - start with true (disabled) for SSR
  const [isCoarsePointer, setIsCoarsePointer] = useState(true)

  // Detect pointer type on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(pointer: coarse)')
      setIsCoarsePointer(mq.matches)

      const handler = (e: MediaQueryListEvent) => setIsCoarsePointer(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [])

  const [state, setState] = useState<MagneticState>({
    x: 0,
    y: 0,
    isHovering: false
  })

  // Effect is disabled on touch devices or when user prefers reduced motion
  const isDisabled = isCoarsePointer || prefersReducedMotion

  // Handle mouse movement - calculate attraction
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || isDisabled) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Distance from cursor to element center
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    const distance = Math.sqrt(distX * distX + distY * distY)

    // Only activate when cursor is within element bounds + small buffer
    const maxActivationRadius = Math.max(rect.width, rect.height) * 0.7

    if (distance < maxActivationRadius) {
      // Calculate pull with strength factor and clamp to max distance
      const pullX = Math.max(-maxDistance, Math.min(maxDistance, distX * strength))
      const pullY = Math.max(-maxDistance, Math.min(maxDistance, distY * strength))
      setState({ x: pullX, y: pullY, isHovering: true })
    }
  }, [isDisabled, strength, maxDistance])

  // Handle mouse leave - snap back to origin
  const handleMouseLeave = useCallback(() => {
    setState({ x: 0, y: 0, isHovering: false })
  }, [])

  // Attach event listeners
  useEffect(() => {
    const element = ref.current
    if (!element || isDisabled) return

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave, isDisabled])

  // Build style object - only apply transform when not disabled
  const style: React.CSSProperties = isDisabled
    ? {}
    : {
        transform: `translate(${state.x}px, ${state.y}px)`,
        transition: state.isHovering
          ? 'transform 0.1s ease-out'
          : `transform ${snapBackDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`, // Elastic ease
        willChange: state.isHovering ? 'transform' : undefined,
      }

  return {
    ref,
    style,
    isHovering: state.isHovering,
    isActive: !isDisabled
  }
}

// MagneticWrapper removed - use the hook directly for better type safety
// Example: const { ref, style } = useMagneticElement<HTMLDivElement>()
