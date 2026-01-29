/* eslint-disable react-hooks/exhaustive-deps -- resetIdleTimer deps are carefully managed */
'use client'

import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from 'react'
import type { GameInterfaceState } from '@/lib/game-interface-types'
import type { GameState } from '@/lib/character-state'
import type { CharacterId } from '@/lib/graph-registry'
import type { PatternType } from '@/lib/patterns'
import { PATTERN_TYPES } from '@/lib/patterns'
import { selectAmbientEvent, IDLE_CONFIG } from '@/lib/ambient-events'
import { generativeScore } from '@/lib/audio/generative-score'

interface UseIdleAmbienceParams {
  state: Pick<GameInterfaceState,
    'hasStarted' | 'availableChoices' | 'currentCharacterId' |
    'showJournal' | 'showConstellation' | 'showJourneySummary' | 'currentNode'
  >
  setState: Dispatch<SetStateAction<GameInterfaceState>>
  // TD-001: gameState passed explicitly from Zustand (via useCoreGameStateHydrated)
  gameState: GameState | null
}

export function useIdleAmbience({ state, setState, gameState }: UseIdleAmbienceParams) {
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const idleCountRef = useRef(0)
  const lastChoiceTimeRef = useRef(Date.now())

  // Helper to get dominant pattern
  // TD-001: Use explicit gameState param (from Zustand)
  const getDominantPattern = useCallback((): PatternType | undefined => {
    if (!gameState) return undefined
    const patterns = gameState.patterns
    let maxPattern: PatternType | undefined
    let maxValue = 0
    for (const p of PATTERN_TYPES) {
      const value = patterns[p] || 0
      if (value > maxValue) {
        maxValue = value
        maxPattern = p
      }
    }
    return maxValue >= 3 ? maxPattern : undefined
  }, [gameState])

  // Start/reset idle timer
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }

    idleCountRef.current = 0
    lastChoiceTimeRef.current = Date.now()

    // Clear any showing ambient event
    setState(prev => prev.ambientEvent ? { ...prev, ambientEvent: null } : prev)

    // Don't start timer if game not active or no choices available
    if (!state.hasStarted || state.availableChoices.length === 0) return

    const scheduleAmbientEvent = () => {
      const delay = idleCountRef.current === 0
        ? IDLE_CONFIG.FIRST_IDLE_MS
        : IDLE_CONFIG.SUBSEQUENT_IDLE_MS

      idleTimerRef.current = setTimeout(() => {
        if (idleCountRef.current >= IDLE_CONFIG.MAX_IDLE_EVENTS) return
        if (state.showJournal || state.showConstellation || state.showJourneySummary) return

        const dominantPattern = getDominantPattern()
        const event = selectAmbientEvent(state.currentCharacterId, dominantPattern)

        if (event) {
          idleCountRef.current++
          setState(prev => ({ ...prev, ambientEvent: event }))

          if (idleCountRef.current < IDLE_CONFIG.MAX_IDLE_EVENTS) {
            scheduleAmbientEvent()
          }
        }
      }, delay)
    }

    scheduleAmbientEvent()
  }, [state.hasStarted, state.availableChoices.length, state.currentCharacterId, state.showJournal, state.showConstellation, state.showJourneySummary, getDominantPattern])

  // Reset timer when choices change (player made a choice)
  useEffect(() => {
    resetIdleTimer()

    // ISP: Update Conductor with full state
    // TD-001: Use explicit gameState param (from Zustand)
    if (gameState && state.currentCharacterId) {
      generativeScore.update(gameState, state.currentCharacterId)
    }
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [state.currentNode?.nodeId, resetIdleTimer, gameState, state.currentCharacterId])

  return { resetIdleTimer, lastChoiceTimeRef }
}
