"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
// ...


import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Clock, Users, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGameStore } from '@/lib/game-store'
import {
  generateSessionSummary,
  setupPlayTimeTracking,
  recordPlayTime,
  type SessionSummary as SessionSummaryType
} from '@/lib/session-tracker'
import { PATTERN_METADATA } from '@/lib/patterns'

interface SessionSummaryProps {
  onDismiss?: () => void
}

export function SessionSummary({ onDismiss }: SessionSummaryProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [summary, setSummary] = useState<SessionSummaryType | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const coreGameState = useGameStore(state => state.coreGameState)

  // Setup play time tracking
  useEffect(() => {
    const cleanup = setupPlayTimeTracking()
    return cleanup
  }, [])

  // Generate summary on mount
  useEffect(() => {
    const sessionSummary = generateSessionSummary(coreGameState)
    if (sessionSummary) {
      setSummary(sessionSummary)
      setIsVisible(true)
      // Record play time immediately so we don't show again on refresh
      recordPlayTime()
    }
  }, [coreGameState])

  const handleDismiss = useCallback(() => {
    setIsVisible(false)
    onDismiss?.()
  }, [onDismiss])

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, handleDismiss])

  const patternColor = useMemo(() => {
    if (!summary?.dominantPattern) return '#f59e0b' // Default amber
    return PATTERN_METADATA[summary.dominantPattern as keyof typeof PATTERN_METADATA]?.color || '#f59e0b'
  }, [summary?.dominantPattern])

  return (
    <AnimatePresence>
      {isVisible && summary && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 left-4 right-4 z-[100] max-w-md mx-auto"
        >
          <div
            className={cn(
              "relative rounded-xl border border-white/10 shadow-2xl overflow-hidden",
              "bg-slate-900/95 backdrop-blur-md"
            )}
          >
            {/* Subtle pattern gradient at top */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(90deg, ${patternColor}60, transparent)` }}
            />

            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500/80" />
                  <span className="text-sm font-medium text-slate-200">
                    Welcome back
                  </span>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Time away */}
              <p className="text-xs text-slate-400">
                It's been {summary.timeAway} since your last visit.
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-xs">
                {summary.charactersWithTrust > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-300">
                      {summary.charactersWithTrust} connection{summary.charactersWithTrust !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {summary.dominantPatternLabel && (
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" style={{ color: patternColor }} />
                    <span className="text-slate-300">
                      {summary.dominantPatternLabel} path
                    </span>
                  </div>
                )}
              </div>

              {/* Recent characters */}
              {summary.recentCharacters.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {summary.recentCharacters.map(name => (
                    <span
                      key={name}
                      className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}

              {/* Suggestion */}
              <p className="text-xs text-amber-400/80 font-medium">
                {summary.suggestion}
              </p>
            </div>

            {/* Progress bar for auto-dismiss */}
            {!prefersReducedMotion && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-amber-500/40"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 8, ease: 'linear' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
