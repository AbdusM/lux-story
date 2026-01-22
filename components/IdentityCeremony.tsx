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

import { motion, AnimatePresence } from 'framer-motion'
import { PatternType, getPatternColor } from '@/lib/patterns'
import { formatIdentityName } from '@/lib/identity-system'

interface IdentityCeremonyProps {
  pattern: PatternType | null
  isVisible: boolean
  onComplete: () => void
}

const PATTERN_ICONS: Record<PatternType, string> = {
  analytical: '◈',
  patience: '◎',
  exploring: '✦',
  helping: '♥',
  building: '⬢'
}

export function IdentityCeremony({ pattern, isVisible, onComplete }: IdentityCeremonyProps) {
  if (!pattern) return null

  const color = getPatternColor(pattern)
  const icon = PATTERN_ICONS[pattern]
  const name = formatIdentityName(pattern)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onComplete}  // Tap to dismiss
        >
          {/* Dim overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Ceremony content */}
          <motion.div
            className="relative flex flex-col items-center gap-6 text-center pointer-events-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
                duration: 2,
                repeat: 2,
                ease: 'easeInOut'
              }}
            >
              {icon}
            </motion.div>

            {/* Identity name */}
            <motion.h2
              className="text-3xl font-serif text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {name}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-lg text-slate-300 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              Identity Claimed
            </motion.p>

            {/* Bonus text */}
            <motion.div
              className="mt-4 px-4 py-2 rounded-full border"
              style={{ borderColor: color, color }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
            >
              +20% {pattern.charAt(0).toUpperCase() + pattern.slice(1)} gains
            </motion.div>

            {/* Continue hint */}
            <motion.p
              className="text-sm text-slate-400 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 2, delay: 3 }}
            >
              Tap to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
