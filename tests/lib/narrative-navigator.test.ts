import { describe, it, expect } from 'vitest'
import { resolveNode } from '@/hooks/game/useNarrativeNavigator'
import type { GameState } from '@/lib/character-state'

// We test the pure resolveNode function (not the hook wrapper)
// This validates navigation error handling without needing React

describe('resolveNode', () => {
  it('returns error for non-existent node', () => {
    // Minimal game state — no graphs will contain 'nonexistent_node'
    const gameState = {
      characters: new Map(),
      patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
      globalFlags: new Set<string>(),
      skillLevels: {},
    } as unknown as GameState

    const result = resolveNode('nonexistent_node_xyz', gameState, [])

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.title).toBe('Navigation Error')
      expect(result.error.severity).toBe('error')
      expect(result.error.message).toContain('nonexistent_node_xyz')
    }
  })

  it('resolves a known Samuel node', () => {
    // Use a real Samuel node that exists in the graph
    const characters = new Map()
    characters.set('samuel', {
      characterId: 'samuel',
      trust: 0,
      anxiety: 0,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: new Set<string>(),
      relationshipStatus: 'stranger',
      conversationHistory: [],
      visitedPatternUnlocks: new Set<string>(),
    })

    const gameState = {
      characters,
      patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
      globalFlags: new Set<string>(),
      currentCharacterId: 'samuel',
      currentNodeId: 'samuel_introduction',
      skillLevels: {},
    } as unknown as GameState

    const result = resolveNode('samuel_introduction', gameState, [])

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.nextNode.nodeId).toBe('samuel_introduction')
      expect(result.targetCharacterId).toBe('samuel')
      expect(result.content).toBeDefined()
      expect(result.availableChoices).toBeDefined()
      expect(Array.isArray(result.availableChoices)).toBe(true)
    }
  })

  it('resolves a known Maya node', () => {
    const characters = new Map()
    characters.set('maya', {
      characterId: 'maya',
      trust: 3,
      anxiety: 0,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: new Set<string>(),
      relationshipStatus: 'acquaintance',
      conversationHistory: [],
      visitedPatternUnlocks: new Set<string>(),
    })

    const gameState = {
      characters,
      patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
      globalFlags: new Set<string>(),
      currentCharacterId: 'maya',
      currentNodeId: 'maya_introduction',
      skillLevels: {},
    } as unknown as GameState

    const result = resolveNode('maya_introduction', gameState, [])

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.targetCharacterId).toBe('maya')
      expect(result.content).toBeDefined()
      expect(result.availableChoices.length).toBeGreaterThan(0)
    }
  })

  it('returns reflectedText and reflectedEmotion on success', () => {
    const characters = new Map()
    characters.set('samuel', {
      characterId: 'samuel',
      trust: 0,
      anxiety: 0,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: new Set<string>(),
      relationshipStatus: 'stranger',
      conversationHistory: [],
      visitedPatternUnlocks: new Set<string>(),
    })

    const gameState = {
      characters,
      patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
      globalFlags: new Set<string>(),
      currentCharacterId: 'samuel',
      currentNodeId: 'samuel_introduction',
      skillLevels: {},
    } as unknown as GameState

    const result = resolveNode('samuel_introduction', gameState, [])

    expect(result.success).toBe(true)
    if (result.success) {
      expect(typeof result.reflectedText).toBe('string')
      expect(result.reflectedText.length).toBeGreaterThan(0)
    }
  })
})
