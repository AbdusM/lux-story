"use client"

/**
 * useCopyToClipboard - Enhanced clipboard copy with haptic feedback
 *
 * Sprint 4: Neural Deck Copy UX
 * Provides one-tap copy with:
 * - Haptic confirmation
 * - Visual feedback state
 * - Auto-reset after delay
 */

import { useState, useCallback } from 'react'
import { hapticFeedback } from '@/lib/haptic-feedback'

interface UseCopyToClipboardOptions {
  /** Delay before resetting copied state (ms) */
  resetDelay?: number
  /** Enable haptic feedback */
  haptic?: boolean
  /** Callback on successful copy */
  onSuccess?: () => void
  /** Callback on copy error */
  onError?: (error: Error) => void
}

interface UseCopyToClipboardReturn {
  /** Whether content was recently copied */
  copied: boolean
  /** Whether copy is in progress */
  copying: boolean
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>
  /** Reset copied state */
  reset: () => void
}

export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
  const {
    resetDelay = 2000,
    haptic = true,
    onSuccess,
    onError,
  } = options

  const [copied, setCopied] = useState(false)
  const [copying, setCopying] = useState(false)

  const reset = useCallback(() => {
    setCopied(false)
    setCopying(false)
  }, [])

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (copying) return false

    setCopying(true)

    try {
      await navigator.clipboard.writeText(text)

      // Haptic feedback on success
      if (haptic) {
        hapticFeedback.success()
      }

      setCopied(true)
      setCopying(false)
      onSuccess?.()

      // Auto-reset after delay
      setTimeout(() => {
        setCopied(false)
      }, resetDelay)

      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)

      // Haptic feedback on error
      if (haptic) {
        hapticFeedback.error()
      }

      setCopying(false)
      onError?.(error as Error)
      return false
    }
  }, [copying, haptic, resetDelay, onSuccess, onError])

  return {
    copied,
    copying,
    copy,
    reset,
  }
}

export default useCopyToClipboard
