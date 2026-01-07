/**
 * Pattern Voice Component
 *
 * Disco Elysium-inspired inner monologue display.
 * When patterns reach threshold, they "speak" with distinct personality.
 *
 * Features:
 * - Styled container with pattern color
 * - Fade in animation
 * - Pattern label prefix: [ANALYTICAL]
 * - Auto-dismisses or dismisses on click
 * - Respects prefers-reduced-motion
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { springs } from '@/lib/animations'
import type { PatternType } from '@/lib/patterns'
import type { PatternVoiceStyle } from '@/lib/pattern-voices'
import { getPatternDisplayInfo } from '@/lib/pattern-voices'

interface PatternVoiceProps {
  pattern: PatternType
  text: string
  style: PatternVoiceStyle
  /** D-003: Trust-derived intensity 0-1 */
  intensity?: number
  onDismiss?: () => void
  autoDismissMs?: number
}

/**
 * D-003: Style classes include trust-derived tones (speak, command)
 */
const STYLE_CLASSES: Record<PatternVoiceStyle, string> = {
  whisper: 'opacity-60 italic text-sm',           // Low trust - uncertain, quiet
  speak: 'opacity-75',                             // Medium trust - normal
  urge: 'opacity-90 font-medium',                  // High trust - insistent
  command: 'opacity-100 font-semibold uppercase',  // Max trust - confident assertion
  observation: 'opacity-80'                        // Neutral observation
}

export function PatternVoice({
  pattern,
  text,
  style,
  onDismiss,
  autoDismissMs = 8000
}: PatternVoiceProps) {
  const [isVisible, setIsVisible] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const patternInfo = getPatternDisplayInfo(pattern)

  // Auto-dismiss after timeout
  useEffect(() => {
    if (autoDismissMs > 0) {
      const timeout = setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, autoDismissMs)
      return () => clearTimeout(timeout)
    }
  }, [autoDismissMs, onDismiss])

  const handleClick = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={prefersReducedMotion ? { duration: 0 } : springs.gentle}
          onClick={handleClick}
          className="cursor-pointer group"
          role="note"
          aria-label={`${patternInfo.label} inner voice: ${text}`}
        >
          <div className={`
            relative pl-4 py-3 pr-3
            border-l-2 ${patternInfo.color.replace('text-', 'border-')}
            bg-black/20 backdrop-blur-sm
            rounded-r-lg
            ${STYLE_CLASSES[style]}
            transition-opacity hover:opacity-100
          `}>
            {/* Pattern label */}
            <div className={`
              text-xs font-mono uppercase tracking-widest mb-1
              ${patternInfo.color}
            `}>
              [{patternInfo.label}]
            </div>

            {/* Voice text */}
            <p className={`
              text-sm leading-relaxed
              ${patternInfo.color.replace('-400', '-200')}
            `}>
              {text}
            </p>

            {/* Dismiss hint */}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-50 text-xs text-white/50 transition-opacity">
              click to dismiss
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PatternVoice
