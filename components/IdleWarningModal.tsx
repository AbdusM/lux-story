/**
 * Idle Warning Modal
 *
 * OverlayHost-rendered surface shown after prolonged inactivity.
 * Idle detection lives in `components/idle/IdleWarningController.tsx`.
 */

'use client'

import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AlertTriangle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { springs, transitions } from '@/lib/animations'

const COUNTDOWN_SECONDS = 120 // 2 minutes

interface IdleWarningModalProps {
  /** Called when countdown expires without user action */
  onTimeout?: () => void
  /** Called when user dismisses the warning */
  onContinue?: () => void
}

export function IdleWarningModal({ onTimeout, onContinue }: IdleWarningModalProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const prefersReducedMotion = useReducedMotion()
  const headingId = React.useId()
  const descId = React.useId()
  const { ref: dialogRef, onKeyDown: handleDialogKeyDown } = useFocusTrap<HTMLDivElement>()

  useEffect(() => {
    setCountdown(COUNTDOWN_SECONDS)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeout?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onTimeout])

  const handleContinue = useCallback(() => {
    onContinue?.()
  }, [onContinue])

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = countdown / COUNTDOWN_SECONDS

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descId}
        data-overlay-surface
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={springs.smooth}
        className="w-full max-w-md bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
      >
        <div className="h-1 bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-red-500"
            initial={{ width: '100%' }}
            animate={{ width: `${progress * 100}%` }}
            transition={transitions.linearTick}
          />
        </div>

        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>

          <h2 id={headingId} className="text-xl font-semibold text-white mb-2">
            Still there?
          </h2>

          <p id={descId} className="text-sm text-slate-400 mb-6">
            You&apos;ve been away for a while. Your session will be saved automatically if there&apos;s no activity.
          </p>

          <div className="flex items-center justify-center gap-2 mb-6 text-lg">
            <Clock className="w-5 h-5 text-slate-500" />
            <span className="font-mono text-white tabular-nums">{formatCountdown(countdown)}</span>
            <span className="text-slate-500 text-sm">remaining</span>
          </div>

          <div className="flex gap-3">
            <Button
              autoFocus
              onClick={handleContinue}
              className="flex-1 min-h-[48px] bg-amber-500 hover:bg-amber-400 text-white"
            >
              I&apos;m still here
            </Button>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Your progress is automatically saved. You can return anytime.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
