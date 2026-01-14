/**
 * Interrupt Button Component
 *
 * ME2-style quick-time event during NPC speech.
 * Creates emotional resonance by letting players act in charged moments.
 *
 * Features:
 * - Animated countdown timer (progress bar)
 * - Visual styling based on interrupt type
 * - Keyboard accessible (Space/Enter to trigger)
 * - Respects prefers-reduced-motion
 * - Auto-dismiss on timeout
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Heart, Swords, Volume2 } from 'lucide-react'
import { springs } from '@/lib/animations'
import type { InterruptWindow } from '@/lib/dialogue-graph'

interface InterruptButtonProps {
  interrupt: InterruptWindow
  onTrigger: () => void
  onTimeout: () => void
}

const INTERRUPT_STYLES = {
  connection: {
    icon: Heart,
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-200',
    progressColor: 'bg-amber-400',
    glowColor: 'shadow-amber-500/30',
    label: 'Connect'
  },
  challenge: {
    icon: Swords,
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-200',
    progressColor: 'bg-red-400',
    glowColor: 'shadow-red-500/30',
    label: 'Challenge'
  },
  silence: {
    icon: Volume2,
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-200',
    progressColor: 'bg-blue-400',
    glowColor: 'shadow-blue-500/30',
    label: 'Wait'
  },
  comfort: {
    icon: Heart,
    bgColor: 'bg-rose-500/20',
    borderColor: 'border-rose-500/50',
    textColor: 'text-rose-200',
    progressColor: 'bg-rose-400',
    glowColor: 'shadow-rose-500/30',
    label: 'Comfort'
  },
  grounding: {
    icon: Heart,
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/50',
    textColor: 'text-emerald-200',
    progressColor: 'bg-emerald-400',
    glowColor: 'shadow-emerald-500/30',
    label: 'Ground'
  },
  encouragement: {
    icon: Heart,
    bgColor: 'bg-violet-500/20',
    borderColor: 'border-violet-500/50',
    textColor: 'text-violet-200',
    progressColor: 'bg-violet-400',
    glowColor: 'shadow-violet-500/30',
    label: 'Encourage'
  }
}

export function InterruptButton({ interrupt, onTrigger, onTimeout }: InterruptButtonProps) {
  const [progress, setProgress] = useState(1)
  const [isVisible, setIsVisible] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const startTimeRef = useRef<number>(Date.now())
  const animationFrameRef = useRef<number | undefined>(undefined)

  const style = INTERRUPT_STYLES[interrupt.type]
  const Icon = style.icon

  const handleTrigger = useCallback(() => {
    if (!isVisible) return
    setIsVisible(false)
    onTrigger()
  }, [isVisible, onTrigger])

  const handleTimeout = useCallback(() => {
    if (!isVisible) return
    setIsVisible(false)
    onTimeout()
  }, [isVisible, onTimeout])

  // Animate progress bar
  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animation, just set timeout
      const timeout = setTimeout(handleTimeout, interrupt.duration)
      return () => clearTimeout(timeout)
    }

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = 1 - elapsed / interrupt.duration

      if (remaining <= 0) {
        setProgress(0)
        handleTimeout()
        return
      }

      setProgress(remaining)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [interrupt.duration, prefersReducedMotion, handleTimeout])

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleTrigger()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleTrigger])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          data-testid="interrupt-button"
          data-interrupt-type={interrupt.type}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={prefersReducedMotion ? { duration: 0 } : springs.snappy}
          onClick={handleTrigger}
          className={`
            relative group cursor-pointer
            flex items-center gap-3 px-4 py-3
            ${style.bgColor} ${style.borderColor} ${style.textColor}
            border rounded-lg
            shadow-lg ${style.glowColor}
            backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-white/30
            transition-colors hover:bg-opacity-30
          `}
          role="button"
          aria-label={`${style.label}: ${interrupt.action}`}
        >
          {/* Icon with pulse animation */}
          <motion.div
            animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="flex-shrink-0"
          >
            <Icon className="w-5 h-5" />
          </motion.div>

          {/* Action text */}
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wider opacity-70">
              {style.label}
            </span>
            <span className="text-sm font-medium">
              {interrupt.action}
            </span>
          </div>

          {/* Keyboard hint */}
          <div className="ml-auto flex-shrink-0 opacity-50 text-xs">
            [Space]
          </div>

          {/* Progress bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-lg overflow-hidden">
            <motion.div
              className={`h-full ${style.progressColor}`}
              style={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default InterruptButton
