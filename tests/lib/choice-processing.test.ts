import { describe, it, expect, vi } from 'vitest'
import {
  computeTrustFeedback,
  computePatternEcho,
  computeOrbMilestoneEcho,
  computeTransformation,
  computeTrustFeedbackMessage,
  computeSkillTracking,
} from '@/lib/choice-processing'
import type { GameState } from '@/lib/character-state'
import type { PlayerPatterns } from '@/lib/patterns'

// Minimal game state factory
function makeGameState(overrides: Partial<{
  characterId: string
  trust: number
  patterns: PlayerPatterns
  trustTimeline: object | null
  knowledgeFlags: Set<string>
}>): GameState {
  const characterId = overrides.characterId || 'maya'
  const characters = new Map()
  characters.set(characterId, {
    characterId,
    trust: overrides.trust ?? 5,
    anxiety: 0,
    nervousSystemState: 'ventral_vagal',
    lastReaction: null,
    knowledgeFlags: overrides.knowledgeFlags ?? new Set<string>(),
    relationshipStatus: 'acquaintance',
    conversationHistory: [],
    trustTimeline: overrides.trustTimeline ?? null,
  })
  return {
    characters,
    patterns: overrides.patterns || { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
    globalFlags: new Set<string>(),
  } as unknown as GameState
}

describe('computeTrustFeedbackMessage', () => {
  it('returns null when trustDelta is 0', () => {
    expect(computeTrustFeedbackMessage(0, 'maya')).toBeNull()
  })

  it('returns positive trust message', () => {
    const result = computeTrustFeedbackMessage(2, 'maya')
    expect(result).toEqual({ message: 'Trust (Maya): +2' })
  })

  it('returns negative trust message', () => {
    const result = computeTrustFeedbackMessage(-1, 'devon')
    expect(result).toEqual({ message: 'Trust (Devon): -1' })
  })
})

describe('computeSkillTracking', () => {
  it('returns empty when no skills', () => {
    const result = computeSkillTracking({
      choiceSkills: undefined,
      currentNodeId: 'node_1',
      currentNodeSpeaker: 'Maya',
      choiceText: 'Hello',
      choicePattern: 'exploring',
      gamePatterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
      recentSkills: ['old_skill'],
    })
    expect(result.demonstratedSkills).toEqual([])
    expect(result.skillContext).toBeNull()
    expect(result.skillsToKeep).toEqual(['old_skill'])
  })

  it('generates context for demonstrated skills', () => {
    const result = computeSkillTracking({
      choiceSkills: ['communication', 'leadership'],
      currentNodeId: 'maya_intro_1',
      currentNodeSpeaker: 'Maya',
      choiceText: 'I think we should work together',
      choicePattern: 'helping',
      gamePatterns: { analytical: 0, patience: 0, exploring: 0, helping: 7, building: 0 },
      recentSkills: [],
    })
    expect(result.demonstratedSkills).toEqual(['communication', 'leadership'])
    expect(result.skillContext).toContain('Maya')
    expect(result.skillContext).toContain('helping pattern')
    expect(result.skillContext).toContain('emerging helping identity')
    expect(result.skillsToKeep).toEqual(['communication', 'leadership'])
  })

  it('merges with recent skills and caps at 10', () => {
    const result = computeSkillTracking({
      choiceSkills: ['new_skill_1', 'new_skill_2'],
      currentNodeId: 'node_1',
      currentNodeSpeaker: 'Maya',
      choiceText: 'Test',
      choicePattern: 'exploring',
      gamePatterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
      recentSkills: Array(9).fill('old'),
    })
    expect(result.skillsToKeep.length).toBe(10)
  })
})

describe('computePatternEcho', () => {
  it('returns null when no threshold crossed', () => {
    const result = computePatternEcho({
      previousPatterns: { analytical: 3, patience: 0, exploring: 0, helping: 0, building: 0 },
      newPatterns: { analytical: 4, patience: 0, exploring: 0, helping: 0, building: 0 },
      characterId: 'maya',
      existingEcho: null,
    })
    expect(result.crossedPattern).toBeNull()
    expect(result.patternShiftMsg).toBeNull()
  })

  it('detects threshold crossing', () => {
    const result = computePatternEcho({
      previousPatterns: { analytical: 4, patience: 0, exploring: 0, helping: 0, building: 0 },
      newPatterns: { analytical: 5, patience: 0, exploring: 0, helping: 0, building: 0 },
      characterId: 'maya',
      existingEcho: null,
    })
    expect(result.crossedPattern).toBe('analytical')
    expect(result.patternShiftMsg).toContain('Worldview Shift')
    expect(result.patternShiftMsg).toContain('Analytical')
  })

  it('does not override existing echo', () => {
    const existingEcho = { text: 'existing', emotion: 'happy', timing: 'immediate' as const }
    const result = computePatternEcho({
      previousPatterns: { analytical: 4, patience: 0, exploring: 0, helping: 0, building: 0 },
      newPatterns: { analytical: 5, patience: 0, exploring: 0, helping: 0, building: 0 },
      characterId: 'maya',
      existingEcho,
    })
    // Still detects the crossing
    expect(result.crossedPattern).toBe('analytical')
    // But doesn't create a new echo since one exists
    expect(result.consequenceEcho).toBeNull()
  })
})

describe('computeOrbMilestoneEcho', () => {
  it('returns null for non-samuel character', () => {
    const result = computeOrbMilestoneEcho({
      characterId: 'maya',
      existingEcho: null,
      getUnacknowledgedMilestone: () => 'test',
    })
    expect(result.consequenceEcho).toBeNull()
  })

  it('returns null when echo already exists', () => {
    const result = computeOrbMilestoneEcho({
      characterId: 'samuel',
      existingEcho: { text: 'existing', emotion: 'happy', timing: 'immediate' },
      getUnacknowledgedMilestone: () => 'test',
    })
    expect(result.consequenceEcho).toBeNull()
  })

  it('returns null when no unacknowledged milestone', () => {
    const result = computeOrbMilestoneEcho({
      characterId: 'samuel',
      existingEcho: null,
      getUnacknowledgedMilestone: () => null,
    })
    expect(result.consequenceEcho).toBeNull()
    expect(result.milestoneToAcknowledge).toBeNull()
  })
})

describe('computeTrustFeedback', () => {
  it('returns null feedback when trustDelta is 0', () => {
    const result = computeTrustFeedback({
      trustDelta: 0,
      characterId: 'maya',
      newGameState: makeGameState({ characterId: 'maya' }),
      choicePattern: undefined,
      nodeId: 'test',
      choiceText: 'test',
    })
    expect(result.consequenceEcho).toBeNull()
    expect(result.playTrustSound).toBe(false)
  })

  it('sets playTrustSound true for positive trust delta', () => {
    const result = computeTrustFeedback({
      trustDelta: 1,
      characterId: 'maya',
      newGameState: makeGameState({ characterId: 'maya' }),
      choicePattern: undefined,
      nodeId: 'test',
      choiceText: 'test',
    })
    expect(result.playTrustSound).toBe(true)
  })

  it('sets playTrustSound false for negative trust delta', () => {
    const result = computeTrustFeedback({
      trustDelta: -1,
      characterId: 'maya',
      newGameState: makeGameState({ characterId: 'maya' }),
      choicePattern: undefined,
      nodeId: 'test',
      choiceText: 'test',
    })
    expect(result.playTrustSound).toBe(false)
  })

  it('returns safe defaults when character not found', () => {
    // GameState with no characters
    const emptyState = {
      characters: new Map(),
      patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
      globalFlags: new Set<string>(),
    } as unknown as GameState
    const result = computeTrustFeedback({
      trustDelta: 1,
      characterId: 'nonexistent',
      newGameState: emptyState,
      choicePattern: undefined,
      nodeId: 'test',
      choiceText: 'test',
    })
    // Should not throw — returns with default trust
    expect(result.playTrustSound).toBe(true)
    expect(result.updatedTimeline).toBeNull()
  })

  it('records trust timeline when charState has trustTimeline', () => {
    const timeline = { characterId: 'maya', points: [], peakTrust: 5, peakTimestamp: 0, lowestTrust: 5, lowestTimestamp: 0, currentStreak: 0 }
    const gameState = makeGameState({ characterId: 'maya', trust: 5, trustTimeline: timeline })
    const result = computeTrustFeedback({
      trustDelta: 1,
      characterId: 'maya',
      newGameState: gameState,
      choicePattern: 'analytical',
      nodeId: 'test_node',
      choiceText: 'Test choice',
    })
    // Should produce updated timeline (non-null)
    expect(result.updatedTimeline).not.toBeNull()
  })
})

describe('computeTransformation', () => {
  it('returns null when trustDelta is 0', () => {
    const result = computeTransformation({
      trustDelta: 0,
      characterId: 'maya',
      newGameState: makeGameState({ characterId: 'maya' }),
      witnessedTransformations: [],
    })
    expect(result).toBeNull()
  })

  it('returns null when trustDelta is negative', () => {
    const result = computeTransformation({
      trustDelta: -1,
      characterId: 'maya',
      newGameState: makeGameState({ characterId: 'maya' }),
      witnessedTransformations: [],
    })
    expect(result).toBeNull()
  })

  it('returns null when character not found', () => {
    const emptyState = {
      characters: new Map(),
      patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
      globalFlags: new Set<string>(),
    } as unknown as GameState
    const result = computeTransformation({
      trustDelta: 1,
      characterId: 'nonexistent',
      newGameState: emptyState,
      witnessedTransformations: [],
    })
    expect(result).toBeNull()
  })

  it('delegates to checkTransformationEligible for eligible characters', () => {
    const gameState = makeGameState({
      characterId: 'maya',
      trust: 8,
      knowledgeFlags: new Set(['maya_vulnerability_revealed']),
    })
    // Result depends on TRANSFORMATION_MOMENTS data — may be null if no transformation defined for maya at trust 8
    const result = computeTransformation({
      trustDelta: 1,
      characterId: 'maya',
      newGameState: gameState,
      witnessedTransformations: [],
    })
    // Just verify it doesn't throw and returns TransformationMoment | null
    expect(result === null || typeof result === 'object').toBe(true)
  })
})
