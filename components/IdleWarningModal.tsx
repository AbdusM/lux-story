/**
 * Idle Warning Modal
 * Warns users after prolonged inactivity to prevent unexpected session loss
 *
 * Features:
 * - 5-minute idle detection (configurable)
 * - 2-minute countdown before action
 * - "Still there?" friendly prompt
 * - Option to continue or save & exit
 * - Tracks mouse, keyboard, touch activity
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { AlertTriangle, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { springs } from '@/lib/animations'

// Configuration
const IDLE_WARNING_MS = 5 * 60 * 1000  // 5 minutes
const COUNTDOWN_SECONDS = 120           // 2 minutes

interface IdleWarningModalProps {
  /** Called when countdown expires without user action */
  onTimeout?: () => void
  /** Called when user dismisses the warning */
  onContinue?: () => void
  /** Disable the idle detection (e.g., during certain states) */
  disabled?: boolean
}

export function IdleWarningModal({
  onTimeout,
  onContinue,
  disabled = false,
}: IdleWarningModalProps) {
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const prefersReducedMotion = useReducedMotion()

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  // Reset the idle timer
  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now()

    // Clear existing timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }

    // If warning is showing, dismiss it
    if (showWarning) {
      setShowWarning(false)
      setCountdown(COUNTDOWN_SECONDS)
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
        countdownIntervalRef.current = null
      }
    }

    // Don't set new timer if disabled
    if (disabled) return

    // Set new idle timer
    idleTimerRef.current = setTimeout(() => {
      setShowWarning(true)
    }, IDLE_WARNING_MS)
  }, [disabled, showWarning])

  // Handle user activity
  const handleActivity = useCallback(() => {
    // Only reset if not showing warning (activity on modal counts as interaction)
    if (!showWarning) {
      resetIdleTimer()
    }
  }, [resetIdleTimer, showWarning])

  // Start countdown when warning appears
  useEffect(() => {
    if (showWarning) {
      setCountdown(COUNTDOWN_SECONDS)

      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Countdown expired
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current)
            }
            onTimeout?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
      }
    }
  }, [showWarning, onTimeout])

  // Set up activity listeners
  useEffect(() => {
    if (disabled) return

    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'wheel']

    // Debounce the handler to avoid excessive calls
    let activityTimeout: ReturnType<typeof setTimeout> | null = null
    const debouncedHandler = () => {
      if (activityTimeout) return
      activityTimeout = setTimeout(() => {
        handleActivity()
        activityTimeout = null
      }, 1000)
    }

    events.forEach(event => {
      window.addEventListener(event, debouncedHandler, { passive: true })
    })

    // Initial timer setup
    resetIdleTimer()

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, debouncedHandler)
      })
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
      if (activityTimeout) {
        clearTimeout(activityTimeout)
      }
    }
  }, [disabled, handleActivity, resetIdleTimer])

  // Handle continue button
  const handleContinue = useCallback(() => {
    setShowWarning(false)
    setCountdown(COUNTDOWN_SECONDS)
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
    resetIdleTimer()
    onContinue?.()
  }, [resetIdleTimer, onContinue])

  // Format countdown for display
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress for visual countdown
  const progress = countdown / COUNTDOWN_SECONDS

  return (
    <AnimatePresence>
      {showWarning && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="alertdialog"
            aria-labelledby="idle-warning-title"
            aria-describedby="idle-warning-description"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={springs.smooth}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Progress bar */}
              <div className="h-1 bg-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                  initial={{ width: '100%' }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>

              <div className="p-6 text-center">
                {/* Icon */}
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                </div>

                {/* Title */}
                <h2
                  id="idle-warning-title"
                  className="text-xl font-semibold text-white mb-2"
                >
                  Still there?
                </h2>

                {/* Description */}
                <p
                  id="idle-warning-description"
                  className="text-sm text-slate-400 mb-6"
                >
                  You've been away for a while. Your session will be saved automatically if there's no activity.
                </p>

                {/* Countdown display */}
                <div className="flex items-center justify-center gap-2 mb-6 text-lg">
                  <Clock className="w-5 h-5 text-slate-500" />
                  <span className="font-mono text-white tabular-nums">
                    {formatCountdown(countdown)}
                  </span>
                  <span className="text-slate-500 text-sm">remaining</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleContinue}
                    className="flex-1 min-h-[48px] bg-amber-500 hover:bg-amber-400 text-white"
                  >
                    I'm still here
                  </Button>
                </div>

                {/* Helper text */}
                <p className="mt-4 text-xs text-slate-500">
                  Your progress is automatically saved. You can return anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
