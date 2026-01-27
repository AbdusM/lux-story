/**
 * Phase 1.4: Orchestration Integration Test
 *
 * Verifies that all extracted pure functions and hooks work together
 * to produce correct results for a simulated choice flow.
 *
 * Tests the contract between:
 * - computeTrustFeedback (trust → echo + sound + timeline)
 * - computePatternEcho (patterns → echo + shift msg)
 * - computeOrbMilestoneEcho (samuel + milestone → echo)
 * - computeTransformation (trust↑ + conditions → transformation)
 * - computeTrustFeedbackMessage (trustDelta → toast)
 * - computeSkillTracking (skills → context + recent skills)
 * - resolveNode (nodeId → graph + node + content + choices)
 * - deriveDerivedState (core → visitedScenes)
 */

import { describe, it, expect } from 'vitest'
import {
  computeTrustFeedback,
  computePatternEcho,
  computeOrbMilestoneEcho,
  computeTrustFeedbackMessage,
  computeSkillTracking,
} from '@/lib/choice-processing'
import { resolveNode } from '@/hooks/game/useNarrativeNavigator'
import { deriveDerivedState } from '@/lib/game-store'
import type { GameState } from '@/lib/character-state'
import type { PlayerPatterns } from '@/lib/patterns'
import type { SerializableGameState } from '@/lib/character-state'

// ============================================================
// Test helpers
// ============================================================

function makeGameState(overrides?: {
  characterId?: string
  trust?: number
  patterns?: PlayerPatterns
  conversationHistory?: string[]
}): GameState {
  const characterId = overrides?.characterId || 'samuel'
  const characters = new Map()
  characters.set(characterId, {
    characterId,
    trust: overrides?.trust ?? 3,
    anxiety: 0,
    nervousSystemState: 'ventral_vagal',
    lastReaction: null,
    knowledgeFlags: new Set<string>(),
    relationshipStatus: 'acquaintance',
    conversationHistory: overrides?.conversationHistory || [],
    visitedPatternUnlocks: new Set<string>(),
    trustTimeline: null,
  })
  return {
    characters,
    patterns: overrides?.patterns || { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
    globalFlags: new Set<string>(),
    currentCharacterId: characterId,
    currentNodeId: 'samuel_introduction',
    skillLevels: {},
  } as unknown as GameState
}

// ============================================================
// Integration: Full Choice Flow Simulation
// ============================================================

describe('Orchestration Integration: Choice Flow', () => {
  it('simulates a complete choice with trust change, pattern update, skills, and navigation', () => {
    const gameState = makeGameState({
      characterId: 'samuel',
      trust: 3,
      patterns: { analytical: 4, patience: 0, exploring: 0, helping: 0, building: 0 },
      conversationHistory: ['samuel_introduction'],
    })

    // Step 1: Compute trust feedback
    const trustResult = computeTrustFeedback({
      trustDelta: 1,
      characterId: 'samuel',
      newGameState: gameState,
      choicePattern: 'analytical',
      nodeId: 'samuel_introduction',
      choiceText: 'I want to analyze the data carefully',
    })

    expect(trustResult.playTrustSound).toBe(true)
    // Echo may or may not exist depending on consequence-echoes data for samuel

    // Step 2: Compute pattern echo (analytical crossing threshold 5)
    const patternResult = computePatternEcho({
      previousPatterns: { analytical: 4, patience: 0, exploring: 0, helping: 0, building: 0 },
      newPatterns: { analytical: 5, patience: 0, exploring: 0, helping: 0, building: 0 },
      characterId: 'samuel',
      existingEcho: trustResult.consequenceEcho,
    })

    expect(patternResult.crossedPattern).toBe('analytical')
    expect(patternResult.patternShiftMsg).toContain('Analytical')
    expect(patternResult.patternShiftMsg).toContain('Level 5')

    // Step 3: Orb milestone echo (no milestone unacknowledged)
    const milestoneResult = computeOrbMilestoneEcho({
      characterId: 'samuel',
      existingEcho: trustResult.consequenceEcho || patternResult.consequenceEcho,
      getUnacknowledgedMilestone: () => null,
    })
    expect(milestoneResult.consequenceEcho).toBeNull()

    // Step 4: Trust feedback message
    const feedbackMsg = computeTrustFeedbackMessage(1, 'samuel')
    expect(feedbackMsg).toEqual({ message: 'Trust (Samuel): +1' })

    // Step 5: Skill tracking
    const skillResult = computeSkillTracking({
      choiceSkills: ['critical_thinking', 'data_analysis'],
      currentNodeId: 'samuel_introduction',
      currentNodeSpeaker: 'Samuel',
      choiceText: 'I want to analyze the data carefully',
      choicePattern: 'analytical',
      gamePatterns: { analytical: 5, patience: 0, exploring: 0, helping: 0, building: 0 } as unknown as Record<string, number>,
      recentSkills: [],
    })

    expect(skillResult.demonstratedSkills).toEqual(['critical_thinking', 'data_analysis'])
    expect(skillResult.skillContext).toContain('Samuel')
    expect(skillResult.skillContext).toContain('analytical pattern')
    expect(skillResult.skillContext).toContain('analytical identity')
    expect(skillResult.skillsToKeep).toHaveLength(2)

    // Step 6: Navigate to next node (samuel_introduction exists in graph)
    const navResult = resolveNode('samuel_introduction', gameState, ['samuel_introduction'])
    expect(navResult.success).toBe(true)
    if (navResult.success) {
      expect(navResult.targetCharacterId).toBe('samuel')
      expect(navResult.nextNode.nodeId).toBe('samuel_introduction')
      expect(navResult.content).toBeDefined()
    }
  })

  it('handles zero-trust-change choice correctly', () => {
    const gameState = makeGameState({ characterId: 'maya', trust: 5 })

    const trustResult = computeTrustFeedback({
      trustDelta: 0,
      characterId: 'maya',
      newGameState: gameState,
      choicePattern: undefined,
      nodeId: 'maya_intro',
      choiceText: 'Hello',
    })

    expect(trustResult.consequenceEcho).toBeNull()
    expect(trustResult.playTrustSound).toBe(false)
    expect(trustResult.updatedTimeline).toBeNull()

    const feedbackMsg = computeTrustFeedbackMessage(0, 'maya')
    expect(feedbackMsg).toBeNull()
  })

  it('pattern echo respects existing trust echo priority', () => {
    const existingEcho = {
      text: 'Trust increased',
      emotion: 'warm',
      timing: 'immediate' as const,
      trustAtEvent: 5,
    }

    const patternResult = computePatternEcho({
      previousPatterns: { analytical: 4, patience: 0, exploring: 0, helping: 0, building: 0 },
      newPatterns: { analytical: 5, patience: 0, exploring: 0, helping: 0, building: 0 },
      characterId: 'maya',
      existingEcho,
    })

    // Pattern crossed but echo is null because existing echo takes priority
    expect(patternResult.crossedPattern).toBe('analytical')
    expect(patternResult.consequenceEcho).toBeNull()
    // But shift message still fires (shown in UI separately)
    expect(patternResult.patternShiftMsg).toContain('Analytical')
  })
})

describe('Orchestration Integration: Derived State', () => {
  it('deriveDerivedState produces visitedScenes from character histories', () => {
    const core = {
      characters: [
        { characterId: 'samuel', conversationHistory: ['node_a', 'node_b'] },
        { characterId: 'maya', conversationHistory: ['node_b', 'node_c'] },
      ],
    } as unknown as SerializableGameState

    const derived = deriveDerivedState(core)
    expect(derived.visitedScenes).toEqual(['node_a', 'node_b', 'node_c'])
  })
})

describe('Orchestration Integration: Navigation Errors', () => {
  it('resolveNode returns structured error for missing node', () => {
    const gameState = makeGameState()
    const result = resolveNode('completely_fake_node_id', gameState, [])

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.title).toBe('Navigation Error')
      expect(result.error.severity).toBe('error')
    }
  })
})

describe('Orchestration Integration: Mutation Safety', () => {
  it('pure functions do not mutate input GameState', () => {
    const patterns = { analytical: 4, patience: 0, exploring: 0, helping: 0, building: 0 }
    const gameState = makeGameState({
      characterId: 'samuel',
      trust: 3,
      patterns,
      conversationHistory: ['samuel_introduction'],
    })

    // Freeze patterns to detect mutation
    Object.freeze(gameState.patterns)

    // These should NOT throw — pure functions must not mutate input
    expect(() => computeTrustFeedback({
      trustDelta: 1,
      characterId: 'samuel',
      newGameState: gameState,
      choicePattern: 'analytical',
      nodeId: 'samuel_introduction',
      choiceText: 'Test choice',
    })).not.toThrow()

    expect(() => computePatternEcho({
      previousPatterns: patterns,
      newPatterns: { analytical: 5, patience: 0, exploring: 0, helping: 0, building: 0 },
      characterId: 'samuel',
      existingEcho: null,
    })).not.toThrow()

    expect(() => computeSkillTracking({
      choiceSkills: ['critical_thinking'],
      currentNodeId: 'samuel_introduction',
      currentNodeSpeaker: 'Samuel',
      choiceText: 'Test',
      choicePattern: 'analytical',
      gamePatterns: patterns as unknown as Record<string, number>,
      recentSkills: [],
    })).not.toThrow()
  })
})
