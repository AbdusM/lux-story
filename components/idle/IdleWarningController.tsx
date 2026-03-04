'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useOverlayStore } from '@/lib/overlay-store'

// Keep behavior aligned with the legacy IdleWarningModal (5 min idle -> show warning).
const IDLE_WARNING_MS = 5 * 60 * 1000

interface IdleWarningControllerProps {
  /**
   * Disable idle detection (for example, while loading).
   *
   * Default: false (enabled)
   */
  disabled?: boolean
}

/**
 * IdleWarningController
 *
 * Non-visual controller that triggers `overlay-store: idleWarning` after
 * prolonged inactivity. The actual modal UI is rendered via OverlayHost.
 */
export function IdleWarningController({ disabled = false }: IdleWarningControllerProps) {
  const isIdleWarningOpen = useOverlayStore((s) => s.isOverlayOpen('idleWarning'))

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const disabledRef = useRef(disabled)
  disabledRef.current = disabled

  const isIdleWarningOpenRef = useRef(isIdleWarningOpen)
  isIdleWarningOpenRef.current = isIdleWarningOpen

  const clearIdleTimer = useCallback(() => {
    if (!idleTimerRef.current) return
    clearTimeout(idleTimerRef.current)
    idleTimerRef.current = null
  }, [])

  const resetIdleTimer = useCallback(() => {
    clearIdleTimer()

    if (disabledRef.current) return
    if (isIdleWarningOpenRef.current) return

    idleTimerRef.current = setTimeout(() => {
      const overlay = useOverlayStore.getState()
      // Never let a low-priority idle warning replace a real error.
      if (overlay.isOverlayOpen('error')) return
      if (overlay.isOverlayOpen('idleWarning')) return
      overlay.pushOverlay('idleWarning')
    }, IDLE_WARNING_MS)
  }, [clearIdleTimer])

  // Reset when idle warning closes; stop timers while open.
  const wasOpenRef = useRef(false)
  useEffect(() => {
    if (isIdleWarningOpen) {
      clearIdleTimer()
      wasOpenRef.current = true
      return
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false
      resetIdleTimer()
    }
  }, [clearIdleTimer, isIdleWarningOpen, resetIdleTimer])

  // Activity listeners.
  useEffect(() => {
    if (disabled) {
      clearIdleTimer()
      return
    }

    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'wheel'] as const

    let activityTimeout: ReturnType<typeof setTimeout> | null = null
    const debouncedHandler = () => {
      if (activityTimeout) return
      activityTimeout = setTimeout(() => {
        resetIdleTimer()
        activityTimeout = null
      }, 1000)
    }

    events.forEach((event) => {
      window.addEventListener(event, debouncedHandler, { passive: true })
    })

    resetIdleTimer()

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, debouncedHandler)
      })
      if (activityTimeout) clearTimeout(activityTimeout)
      clearIdleTimer()
    }
  }, [clearIdleTimer, disabled, resetIdleTimer])

  return null
}

