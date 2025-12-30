/**
 * Hook for aggregating constellation data from game state
 * Combines characterTrust and skill demonstrations for both views
 */

import { useMemo } from 'react'
import { useGameStore } from '@/lib/game-store'
import { CHARACTER_NODES, type CharacterId, type CharacterNodeData } from '@/lib/constellation/character-positions'
import { SKILL_NODES, getSkillState, type SkillState, type SkillNodeData } from '@/lib/constellation/skill-positions'
import { CHARACTER_RELATIONSHIP_WEB } from '@/lib/character-relationships'

export interface CharacterWithState extends CharacterNodeData {
  trust: number
  hasMet: boolean
  trustState: 'unmet' | 'met' | 'connected' | 'trusted'
}

export interface SkillWithState extends SkillNodeData {
  demonstrationCount: number
  state: SkillState
}

export interface RelationshipStats {
  relationshipsRevealed: number
  totalRelationships: number
  percentRevealed: number
}

export interface ConstellationData {
  characters: CharacterWithState[]
  skills: SkillWithState[]
  metCharacterIds: CharacterId[]
  demonstratedSkillIds: string[]
  relationshipStats: RelationshipStats
}

// Get trust state based on trust value
function getTrustState(trust: number): CharacterWithState['trustState'] {
  if (trust === 0) return 'unmet'
  if (trust <= 3) return 'met'
  if (trust <= 7) return 'connected'
  return 'trusted'
}

export function useConstellationData(): ConstellationData {
  // Derive all data from coreGameState (single source of truth)
  const coreGameState = useGameStore(state => state.coreGameState)
  const skills = useGameStore(state => state.skills)
  // Fallback to legacy characterTrust only if coreGameState not available
  const legacyCharacterTrust = useGameStore(state => state.characterTrust)

  const characters = useMemo<CharacterWithState[]>(() => {
    // Build maps from coreGameState for trust and conversation history
    const characterTrustMap = new Map<string, number>()
    const characterConversations = new Map<string, number>()

    if (coreGameState) {
      for (const char of coreGameState.characters) {
        characterTrustMap.set(char.characterId, char.trust)
        characterConversations.set(char.characterId, char.conversationHistory.length)
      }
    }

    return CHARACTER_NODES.map(node => {
      // Prefer coreGameState trust, fallback to legacy
      const trust = characterTrustMap.get(node.id) ?? legacyCharacterTrust[node.id] ?? 0
      const conversationCount = characterConversations.get(node.id) || 0

      // Character is "met" if they have trust > 0 OR if they have conversation history OR if the explicit flag exists
      // This ensures characters appear in the constellation after any interaction, even if trust is still 0
      const flagId = `met_${node.id}`
      const hasMetFlag = coreGameState?.globalFlags.includes(flagId) || false
      const hasMet = trust > 0 || conversationCount > 0 || hasMetFlag

      return {
        ...node,
        trust,
        hasMet,
        trustState: getTrustState(trust)
      }
    })
  }, [coreGameState, legacyCharacterTrust])

  const skillsWithState = useMemo<SkillWithState[]>(() => {
    return SKILL_NODES.map(node => {
      // Skills are stored as 0-1 values, convert to demonstration count approximation
      // 0 = 0 demos, 0.1 = 1 demo, 0.5 = 5 demos, 1.0 = 10+ demos
      const rawValue = (skills as unknown as Record<string, number>)[node.id] || 0
      const demonstrationCount = Math.round(rawValue * 10)

      return {
        ...node,
        demonstrationCount,
        state: getSkillState(demonstrationCount)
      }
    })
  }, [skills])

  const metCharacterIds = useMemo(() => {
    return characters.filter(c => c.hasMet).map(c => c.id)
  }, [characters])

  const demonstratedSkillIds = useMemo(() => {
    return skillsWithState.filter(s => s.state !== 'dormant').map(s => s.id)
  }, [skillsWithState])

  // Calculate relationship stats
  const relationshipStats = useMemo<RelationshipStats>(() => {
    // Total relationships (excluding self-referential Samuel hub spokes for counting)
    // We count inter-character relationships where neither is Samuel
    const nonSamuelEdges = CHARACTER_RELATIONSHIP_WEB.filter(
      edge => edge.fromCharacterId !== 'samuel' && edge.toCharacterId !== 'samuel'
    )
    const totalRelationships = nonSamuelEdges.length

    // Revealed = both characters have been met by player
    const metSet = new Set(metCharacterIds)
    const relationshipsRevealed = nonSamuelEdges.filter(
      edge => metSet.has(edge.fromCharacterId as CharacterId) && metSet.has(edge.toCharacterId as CharacterId)
    ).length

    const percentRevealed = totalRelationships > 0
      ? Math.round((relationshipsRevealed / totalRelationships) * 100)
      : 0

    return {
      relationshipsRevealed,
      totalRelationships,
      percentRevealed
    }
  }, [metCharacterIds])

  return {
    characters,
    skills: skillsWithState,
    metCharacterIds,
    demonstratedSkillIds,
    relationshipStats
  }
}

// Selector for individual character
export function useCharacterTrust(characterId: CharacterId): number {
  return useGameStore(state => state.characterTrust[characterId] || 0)
}

// Selector for individual skill
export function useSkillDemonstrations(skillId: string): number {
  const skills = useGameStore(state => state.skills)
  const rawValue = (skills as unknown as Record<string, number>)[skillId] || 0
  return Math.round(rawValue * 10)
}
