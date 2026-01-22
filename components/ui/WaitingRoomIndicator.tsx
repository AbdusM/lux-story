'use client'

/**
 * WaitingRoomIndicator
 *
 * Subtle visual cue that "something is happening" when the player lingers.
 * A soft breathing glow that indicates the station is noticing their patience.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface WaitingRoomIndicatorProps {
  /** Whether content is being revealed */
  isActive: boolean
  /** Progress toward next reveal (0-1) */
  progress: number
  /** Whether the breathing animation is active */
  isBreathing: boolean
  /** Additional className */
  className?: string
}

export function WaitingRoomIndicator({
  isActive,
  progress,
  isBreathing,
  className,
}: WaitingRoomIndicatorProps) {
  const prefersReducedMotion = useReducedMotion()

  if (!isActive && !isBreathing) return null

  return (
    <motion.div
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Breathing glow orb */}
      <motion.div
        className="relative w-3 h-3 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, transparent 70%)',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
        }}
        animate={
          !prefersReducedMotion && isBreathing
            ? {
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
              }
            : {
                scale: 1,
                opacity: progress * 0.6 + 0.2,
              }
        }
        transition={
          isBreathing
            ? {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {
                duration: 0.5,
              }
        }
      />

      {/* Progress ring (only when not breathing) */}
      {!isBreathing && progress > 0 && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 12 12"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="6"
            cy="6"
            r="5"
            fill="none"
            stroke="rgba(16, 185, 129, 0.2)"
            strokeWidth="1"
          />
          <motion.circle
            cx="6"
            cy="6"
            r="5"
            fill="none"
            stroke="rgba(16, 185, 129, 0.6)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 0.5 }}
            style={{
              strokeDasharray: '31.4',
              strokeDashoffset: 31.4 * (1 - progress),
            }}
          />
        </svg>
      )}
    </motion.div>
  )
}

/**
 * WaitingRoomRevealToast
 *
 * A subtle toast that appears when patience reveals hidden content.
 */
interface WaitingRoomRevealToastProps {
  text: string
  type: 'ambient' | 'memory' | 'whisper' | 'insight'
  speaker?: string
  onComplete?: () => void
}

export function WaitingRoomRevealToast({
  text,
  type,
  speaker,
  onComplete,
}: WaitingRoomRevealToastProps) {
  const prefersReducedMotion = useReducedMotion()

  const typeStyles = {
    ambient: 'text-slate-400 italic',
    memory: 'text-purple-300 italic',
    whisper: 'text-green-300',
    insight: 'text-amber-300',
  }

  return (
    <motion.div
      className="fixed bottom-32 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-20"
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onAnimationComplete={() => {
        // Auto-dismiss after reading time
        const words = text.split(' ').length
        const readingTime = Math.max(3000, words * 200)
        setTimeout(() => onComplete?.(), readingTime)
      }}
    >
      <div className="glass-panel rounded-xl p-4 border border-green-500/20 shadow-lg">
        {speaker && (
          <p className="text-xs text-green-400 mb-1 font-medium">
            {speaker} notices your patience...
          </p>
        )}
        <p className={cn('text-sm leading-relaxed', typeStyles[type])}>
          {type === 'whisper' ? `"${text}"` : text}
        </p>
        {type === 'insight' && (
          <p className="text-xs text-amber-400/60 mt-2">
            + Patience
          </p>
        )}
      </div>
    </motion.div>
  )
}
