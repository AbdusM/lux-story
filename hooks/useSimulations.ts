/**
 * useSimulations Hook
 * Tracks simulation completion status from game state
 */

import { useMemo } from 'react'
import { useGameSelectors } from '@/lib/game-store'
import { SIMULATION_REGISTRY, SimulationMeta } from '@/lib/simulation-registry'
import { CharacterId, isValidCharacterId } from '@/lib/graph-registry'
import { getCharacterName } from '@/lib/character-names'

export interface SimulationWithStatus extends SimulationMeta {
  isCompleted: boolean
  isAvailable: boolean // Has met the character
  characterName: string
}

export interface SimulationsData {
  simulations: SimulationWithStatus[]
  completedCount: number
  availableCount: number
  totalCount: number
}

// getCharacterName now imported from @/lib/character-names

export function useSimulations(): SimulationsData {
  const coreGameState = useGameSelectors.useCoreGameState()

  return useMemo(() => {
    if (!coreGameState) {
      return {
        simulations: [],
        completedCount: 0,
        availableCount: 0,
        totalCount: SIMULATION_REGISTRY.length
      }
    }

    const globalFlags = new Set(coreGameState.globalFlags || [])

    // Collect all knowledge flags across characters
    const allKnowledgeFlags = new Set<string>()
    coreGameState.characters?.forEach(char => {
      char.knowledgeFlags?.forEach(flag => allKnowledgeFlags.add(flag))
    })

    // Check which characters have been met (based on conversation history)
    const metCharacters = new Set<CharacterId>()
    coreGameState.characters?.forEach(char => {
      if (isValidCharacterId(char.characterId) && char.conversationHistory?.length > 0) {
        metCharacters.add(char.characterId)
      }
    })

    // Samuel is always available
    metCharacters.add('samuel')

    const simulations: SimulationWithStatus[] = SIMULATION_REGISTRY.map(sim => {
      // Check completion based on flag type
      let isCompleted = false
      switch (sim.completionFlag.type) {
        case 'global':
          isCompleted = globalFlags.has(sim.completionFlag.flag)
          break
        case 'knowledge':
          isCompleted = allKnowledgeFlags.has(sim.completionFlag.flag)
          break
        case 'tag':
          // Tags are stored differently - check global flags as fallback
          // Many simulations with tags also set arc_complete flags
          isCompleted = globalFlags.has(`${sim.characterId}_arc_complete`) ||
                       globalFlags.has(sim.completionFlag.flag)
          break
      }

      return {
        ...sim,
        isCompleted,
        isAvailable: metCharacters.has(sim.characterId),
        characterName: getCharacterName(sim.characterId)
      }
    })

    // Sort: Completed first, then available, then locked
    simulations.sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return -1
      if (!a.isCompleted && b.isCompleted) return 1
      if (a.isAvailable && !b.isAvailable) return -1
      if (!a.isAvailable && b.isAvailable) return 1
      return 0
    })

    return {
      simulations,
      completedCount: simulations.filter(s => s.isCompleted).length,
      availableCount: simulations.filter(s => s.isAvailable && !s.isCompleted).length,
      totalCount: SIMULATION_REGISTRY.length
    }
  }, [coreGameState])
}
