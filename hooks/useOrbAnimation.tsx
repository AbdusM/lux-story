'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { haptics } from '@/lib/animations'

/**
 * useOrbAnimation - Orbs physically fly from counter to skill slot
 *
 * Sprint 3: Orb Spending Animation
 *
 * When player spends orbs:
 * 1. Spawn orb particles at counter position
 * 2. Animate along bezier curve to skill position
 * 3. Play haptic on arrival
 * 4. Then update counter
 *
 * Usage:
 * ```tsx
 * const { triggerOrbFly, OrbAnimationLayer } = useOrbAnimation()
 *
 * const handleSpendOrbs = (count: number) => {
 *   triggerOrbFly({
 *     count,
 *     fromRef: orbCounterRef,
 *     toRef: skillSlotRef,
 *     color: '#fbbf24', // amber
 *     onComplete: () => actuallySpendOrbs(count)
 *   })
 * }
 *
 * return (
 *   <>
 *     <OrbAnimationLayer />
 *     ...
 *   </>
 * )
 * ```
 */

export interface OrbParticle {
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
  color: string
  delay: number
}

export interface TriggerOrbFlyOptions {
  /** Number of orbs to animate */
  count: number
  /** Ref to the source element (orb counter) */
  fromRef: React.RefObject<HTMLElement>
  /** Ref to the target element (skill slot) */
  toRef: React.RefObject<HTMLElement>
  /** Orb color (hex) */
  color?: string
  /** Callback when animation completes */
  onComplete?: () => void
}

export function useOrbAnimation() {
  const prefersReducedMotion = useReducedMotion()
  const [particles, setParticles] = useState<OrbParticle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const completionCallbackRef = useRef<(() => void) | null>(null)

  const triggerOrbFly = useCallback((options: TriggerOrbFlyOptions) => {
    const { count, fromRef, toRef, color = '#fbbf24', onComplete } = options

    // If reduced motion, skip animation and call immediately
    if (prefersReducedMotion) {
      onComplete?.()
      return
    }

    // Get positions
    const fromRect = fromRef.current?.getBoundingClientRect()
    const toRect = toRef.current?.getBoundingClientRect()

    if (!fromRect || !toRect) {
      onComplete?.()
      return
    }

    // Create particles with staggered delays
    const newParticles: OrbParticle[] = []
    const orbCount = Math.min(count, 5) // Cap at 5 for performance

    for (let i = 0; i < orbCount; i++) {
      newParticles.push({
        id: `orb-${Date.now()}-${i}`,
        startX: fromRect.left + fromRect.width / 2,
        startY: fromRect.top + fromRect.height / 2,
        endX: toRect.left + toRect.width / 2,
        endY: toRect.top + toRect.height / 2,
        color,
        delay: i * 0.08, // 80ms stagger
      })
    }

    setParticles(newParticles)
    setIsAnimating(true)
    completionCallbackRef.current = onComplete || null

    // Light haptic at start
    haptics.lightTap()
  }, [prefersReducedMotion])

  // Handle animation completion
  useEffect(() => {
    if (particles.length === 0) return

    // Calculate total animation time (last particle delay + animation duration)
    const lastDelay = particles[particles.length - 1]?.delay || 0
    const animationDuration = 0.5 // 500ms flight time
    const totalTime = (lastDelay + animationDuration) * 1000 + 100 // +100ms buffer

    const timer = setTimeout(() => {
      // Heavy haptic on arrival
      haptics.heavyThud()

      // Clear particles
      setParticles([])
      setIsAnimating(false)

      // Call completion callback
      completionCallbackRef.current?.()
      completionCallbackRef.current = null
    }, totalTime)

    return () => clearTimeout(timer)
  }, [particles])

  // Animation Layer Component
  const OrbAnimationLayer = () => {
    if (particles.length === 0) return null

    return (
      <div
        className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {particles.map((particle) => (
          <OrbParticleElement key={particle.id} particle={particle} />
        ))}
      </div>
    )
  }

  return {
    triggerOrbFly,
    OrbAnimationLayer,
    isAnimating,
  }
}

/**
 * Individual orb particle element with CSS animation
 */
function OrbParticleElement({ particle }: { particle: OrbParticle }) {
  const { startX, startY, endX, endY, color, delay } = particle

  // Calculate control points for bezier curve (arc upward)
  const midX = (startX + endX) / 2
  const midY = Math.min(startY, endY) - 100 // Arc 100px above

  return (
    <div
      className="absolute w-4 h-4 rounded-full animate-orb-fly"
      style={{
        left: startX - 8, // Center the 16px orb
        top: startY - 8,
        backgroundColor: color,
        boxShadow: `0 0 12px ${color}, 0 0 24px ${color}50`,
        animationDelay: `${delay}s`,
        // CSS custom properties for the animation
        '--orb-start-x': '0px',
        '--orb-start-y': '0px',
        '--orb-mid-x': `${midX - startX}px`,
        '--orb-mid-y': `${midY - startY}px`,
        '--orb-end-x': `${endX - startX}px`,
        '--orb-end-y': `${endY - startY}px`,
      } as React.CSSProperties}
    />
  )
}

export default useOrbAnimation
