'use client'

/**
 * ConsequenceEchoDisplay
 *
 * Renders consequence echoes — dialogue-based feedback for state changes.
 * Instead of silent stat changes, NPCs respond through brief narrative text.
 *
 * Appears below the main dialogue as an italicized reaction line.
 * Auto-fades after a reading period.
 */

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'

interface ConsequenceEchoDisplayProps {
  echo: ConsequenceEcho | null
}

export function ConsequenceEchoDisplay({ echo }: ConsequenceEchoDisplayProps) {
  const prefersReducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [currentEcho, setCurrentEcho] = useState<ConsequenceEcho | null>(null)

  useEffect(() => {
    if (echo && echo.timing === 'immediate') {
      setCurrentEcho(echo)
      setVisible(true)

      // Auto-dismiss after reading time
      const words = echo.text.split(' ').length
      const readingTime = Math.max(4000, words * 250)

      const timer = setTimeout(() => {
        setVisible(false)
      }, readingTime)

      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [echo])

  return (
    <AnimatePresence>
      {visible && currentEcho && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 px-1"
        >
          <p className="text-sm italic text-amber-200/60 leading-relaxed font-serif">
            {currentEcho.text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
