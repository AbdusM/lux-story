'use client'

/**
 * useWaitingRoom Hook
 *
 * IDEA 005: The Waiting Room (Patience Mechanic)
 *
 * Tracks how long a player lingers at a location and triggers
 * hidden content reveals at timed thresholds.
 *
 * Philosophy: Stillness has power. Rewards patience organically.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  WaitingRoomReveal,
  getRevealsForTime,
  hasWaitingRoomContent,
} from '@/lib/waiting-room-content'
import { useGameStore } from '@/lib/game-store'

/** Waiting room reveal thresholds in seconds */
const WAITING_ROOM_THRESHOLDS = [30, 60, 120] as const

interface UseWaitingRoomOptions {
  /** The character/location ID to track */
  characterId: string | null
  /** Whether the waiting room is enabled */
  enabled?: boolean
  /** Callback when new content is revealed */
  onReveal?: (reveal: WaitingRoomReveal) => void
}

interface WaitingRoomState {
  /** Seconds elapsed at current location */
  elapsedSeconds: number
  /** Content that has been revealed */
  revealedContent: WaitingRoomReveal[]
  /** IDs of content already revealed (persists across location changes) */
  revealedIds: Set<string>
  /** Whether more content is available */
  hasMoreContent: boolean
  /** Progress toward next reveal (0-1) */
  progressToNext: number
  /** Seconds until next reveal */
  secondsToNext: number | null
  /** Visual state for breathing indicator */
  isBreathing: boolean
}

export function useWaitingRoom({
  characterId,
  enabled = true,
  onReveal,
}: UseWaitingRoomOptions): WaitingRoomState & {
  resetTimer: () => void
} {
  const prefersReducedMotion = useReducedMotion()
  const applyCoreStateChange = useGameStore(state => state.applyCoreStateChange)

  // Track revealed IDs across the session
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())

  // Current location state
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [revealedContent, setRevealedContent] = useState<WaitingRoomReveal[]>([])
  const [isBreathing, setIsBreathing] = useState(false)

  // Refs for timer management
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lastCharacterRef = useRef<string | null>(null)

  // Reset timer when character changes
  useEffect(() => {
    if (characterId !== lastCharacterRef.current) {
      lastCharacterRef.current = characterId
      setElapsedSeconds(0)
      setRevealedContent([])
    }
  }, [characterId])

  // Main timer loop
  useEffect(() => {
    if (!enabled || !characterId || !hasWaitingRoomContent(characterId)) {
      return
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => {
        const newTime = prev + 1

        // Check for new reveals
        const newReveals = getRevealsForTime(characterId, newTime, revealedIds)

        if (newReveals.length > 0) {
          // Process each reveal
          newReveals.forEach(reveal => {
            // Add to revealed IDs
            setRevealedIds(prev => new Set([...prev, reveal.id]))

            // Add to revealed content
            setRevealedContent(prev => [...prev, reveal])

            // Apply pattern reward via core state (Phase 2.1: atomic sync)
            if (reveal.patternReward) {
              applyCoreStateChange({
                patternChanges: {
                  [reveal.patternReward.pattern]: reveal.patternReward.amount,
                }
              })
            }

            // Trigger callback
            onReveal?.(reveal)

            // Log in development
            if (process.env.NODE_ENV === 'development') {
              console.log('[WaitingRoom] Reveal:', reveal.id, reveal.content.text.slice(0, 50))
            }
          })
        }

        return newTime
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [enabled, characterId, revealedIds, applyCoreStateChange, onReveal])

  // Breathing animation for anticipation
  useEffect(() => {
    if (prefersReducedMotion || !enabled || !characterId) {
      setIsBreathing(false)
      return
    }

    // Start breathing when approaching a threshold
    const nearThreshold = WAITING_ROOM_THRESHOLDS.some(t =>
      elapsedSeconds >= t - 10 &&
      elapsedSeconds < t &&
      !revealedIds.has(`${characterId}_${t}s`)
    )

    setIsBreathing(nearThreshold)
  }, [elapsedSeconds, characterId, revealedIds, prefersReducedMotion, enabled])

  // Calculate progress to next reveal
  const calculateProgress = useCallback(() => {
    if (!characterId) return { progress: 0, secondsToNext: null }

    const unrevealed = WAITING_ROOM_THRESHOLDS.filter(t => {
      // Check if this threshold's content hasn't been revealed yet
      const content = getRevealsForTime(characterId, t, revealedIds)
      return content.length > 0 || !revealedIds.has(`${characterId}_${t}s`)
    })

    if (unrevealed.length === 0) {
      return { progress: 1, secondsToNext: null }
    }

    const nextThreshold = Math.min(...unrevealed.filter(t => t > elapsedSeconds))
    if (!isFinite(nextThreshold)) {
      return { progress: 1, secondsToNext: null }
    }

    const prevThreshold = Math.max(0, ...unrevealed.filter(t => t <= elapsedSeconds))
    const range = nextThreshold - prevThreshold
    const progress = range > 0 ? (elapsedSeconds - prevThreshold) / range : 0

    return {
      progress: Math.min(1, Math.max(0, progress)),
      secondsToNext: nextThreshold - elapsedSeconds,
    }
  }, [characterId, elapsedSeconds, revealedIds])

  const { progress: progressToNext, secondsToNext } = calculateProgress()

  // Check if more content is available
  const hasMoreContent = characterId
    ? getRevealsForTime(characterId, 999, revealedIds).length > revealedContent.length
    : false

  const resetTimer = useCallback(() => {
    setElapsedSeconds(0)
    setRevealedContent([])
  }, [])

  return {
    elapsedSeconds,
    revealedContent,
    revealedIds,
    hasMoreContent,
    progressToNext,
    secondsToNext,
    isBreathing,
    resetTimer,
  }
}

export default useWaitingRoom
