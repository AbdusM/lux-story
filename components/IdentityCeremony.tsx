/**
 * Identity Ceremony Component
 *
 * Visual ceremony when player internalizes an identity pattern.
 * Follows Zelda "Item Get" philosophy - moment of significance.
 *
 * 5-7 second sequence:
 * 1. Screen dims
 * 2. Pattern orb glows and pulses
 * 3. Pattern name reveals
 * 4. Bonus text appears
 * 5. Fade back to game
 */

'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PatternType } from '@/lib/patterns'
import { formatIdentityName } from '@/lib/identity-system'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { cinematicFade, cinematicReveal, durations } from '@/lib/animations'

interface IdentityCeremonyProps {
  pattern: PatternType | null
  onComplete: () => void
}

const PATTERN_COLORS: Record<PatternType, string> = {
  analytical: '#6366f1', // Indigo
  patience: '#8b5cf6',   // Violet
  exploring: '#f59e0b',  // Amber
  helping: '#ef4444',    // Red
  building: '#22c55e'    // Green
}

const PATTERN_ICONS: Record<PatternType, string> = {
  analytical: '◈',
  patience: '◎',
  exploring: '✦',
  helping: '♥',
  building: '⬢'
}

export function IdentityCeremony({ pattern, onComplete }: IdentityCeremonyProps) {
  const [show, setShow] = useState(true)
  const titleId = useId()
  const hintId = useId()
  const { ref: dialogRef, onKeyDown: handleDialogKeyDown } = useFocusTrap<HTMLDivElement>()

  const handleDismiss = useCallback(() => setShow(false), [])

  useEffect(() => {
    // If the ceremony is ever reused with a different pattern without unmounting,
    // ensure it re-opens.
    setShow(true)
  }, [pattern])

  if (!pattern) return null

  const color = PATTERN_COLORS[pattern]
  const icon = PATTERN_ICONS[pattern]
  const name = formatIdentityName(pattern)

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          onKeyDown={handleDialogKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={hintId}
          data-overlay-surface
          className="absolute inset-0 flex items-center justify-center cursor-pointer pointer-events-auto focus:outline-none"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={cinematicFade}
          onClick={handleDismiss}  // Tap to dismiss (exit anim -> onExitComplete)
        >
          {/* Screen-reader + keyboard dismissal (visual design remains tap-to-continue). */}
          <button type="button" onClick={handleDismiss} className="sr-only">
            Continue
          </button>

          {/* Dim overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.slow }}
          />

          {/* Ceremony content */}
          <motion.div
            className="relative flex flex-col items-center gap-6 text-center pointer-events-none"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cinematicReveal}
          >
            {/* Glowing orb */}
            <motion.div
              className="text-8xl"
              style={{ color, textShadow: `0 0 60px ${color}, 0 0 120px ${color}` }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{
                duration: durations.dramatic * 3.33,
                repeat: 2,
                ease: 'easeInOut'
              }}
            >
              {icon}
            </motion.div>

            {/* Identity name */}
            <motion.h2
              className="text-3xl font-serif text-white"
              id={titleId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.slow, delay: durations.dramatic + durations.quick }}
            >
              {name}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-lg text-slate-300 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: durations.slow, delay: durations.dramatic * 2 }}
            >
              Identity Claimed
            </motion.p>

            {/* Bonus text */}
            <motion.div
              className="mt-4 px-4 py-2 rounded-full border"
              style={{ borderColor: color, color }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: durations.slow, delay: durations.dramatic * 2 + durations.quick }}
            >
              +20% {pattern.charAt(0).toUpperCase() + pattern.slice(1)} gains
            </motion.div>

            {/* Continue hint */}
            <motion.p
              className="text-sm text-slate-400 mt-8"
              id={hintId}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: durations.dramatic * 3.33, delay: durations.dramatic * 5 }}
            >
              Tap to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
