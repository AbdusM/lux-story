"use client"

import { useMemo } from 'react'
import { useGameSelectors } from '@/lib/game-store'
import { determineNervousSystemState, NervousSystemState, ChemicalReaction } from '@/lib/emotions'
import { calculateReaction } from '@/lib/chemistry'

interface BiologyState {
  nervousState: NervousSystemState
  lastReaction: ChemicalReaction | null
  isLoading: boolean
}

/**
 * Hook to access the player's biological/nervous system state
 *
 * Computes:
 * - Nervous system state (ventral_vagal/sympathetic/dorsal_vagal)
 * - Last chemical reaction (if any)
 *
 * Based on polyvagal theory + chemistry engine
 */
export function useBiology(): BiologyState {
  const gameState = useGameSelectors.useCoreGameStateHydrated()

  return useMemo(() => {
    if (!gameState) {
      return {
        nervousState: 'ventral_vagal' as NervousSystemState,
        lastReaction: null,
        isLoading: true
      }
    }

    // Get current character trust (use highest trust character or default)
    // Note: characters is a Map<string, CharacterState>
    const currentCharacter = gameState.currentCharacterId
      ? gameState.characters?.get(gameState.currentCharacterId)
      : undefined
    const trust = currentCharacter?.trust ?? 5

    // Compute anxiety from patterns (inverse of patience/helping)
    // Higher patience/helping = lower anxiety
    const patterns = gameState.patterns || {
      analytical: 0,
      building: 0,
      helping: 0,
      patience: 0,
      exploring: 0
    }

    // Simple anxiety model: base anxiety reduced by calming patterns
    const baseAnxiety = 50 // Neutral starting point
    const calmingEffect = (patterns.patience + patterns.helping) * 2
    const anxiety = Math.max(0, baseAnxiety - calmingEffect)

    // Convert patterns to skill-like values for chemistry engine
    const skills: Record<string, number> = {
      analytical: patterns.analytical,
      helping: patterns.helping,
      patience: patterns.patience,
      building: patterns.building,
      exploring: patterns.exploring,
      resilience: Math.min(10, (patterns.patience + patterns.helping) / 2)
    }

    // Get knowledge flags for regulation effects
    const flags = gameState.globalFlags || []

    // Compute nervous system state
    const nervousState = determineNervousSystemState(anxiety, trust, skills, flags)

    // Compute chemical reaction
    const lastReaction = calculateReaction(nervousState, skills, trust)

    return {
      nervousState,
      lastReaction,
      isLoading: false
    }
  }, [gameState])
}
