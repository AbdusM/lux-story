/**
 * Tests for Pattern Unlock Choices
 */

import { describe, it, expect } from 'vitest'
import { getPatternUnlockChoices, hasAvailablePatternUnlocks, getNextPatternUnlockProgress } from '@/lib/pattern-unlock-choices'
import { PatternType } from '@/lib/patterns'
import type { DialogueGraph, DialogueNode } from '@/lib/dialogue-graph'

// Create a minimal mock graph for testing
function createMockGraph(nodeIds: string[]): DialogueGraph {
  const nodes = new Map<string, DialogueNode>()
  for (const nodeId of nodeIds) {
    nodes.set(nodeId, {
      nodeId,
      speaker: 'Test Character',
      content: [{ text: 'Test content', emotion: 'neutral' }],
      choices: []
    })
  }
  return {
    nodes,
    startNodeId: nodeIds[0] || 'start',
    metadata: { title: 'Test Graph', version: '1.0' }
  }
}

describe('getPatternUnlockChoices', () => {
  it('returns empty array for character without pattern unlocks', () => {
    const patterns: Record<PatternType, number> = {
      analytical: 5,
      patience: 5,
      exploring: 5,
      helping: 5,
      building: 5
    }
    const graph = createMockGraph(['test_node'])

    // Samuel has no pattern unlocks configured
    const choices = getPatternUnlockChoices('samuel', patterns, graph)
    expect(choices).toHaveLength(0)
  })

  it('returns unlock choices when pattern threshold is met', () => {
    const patterns: Record<PatternType, number> = {
      analytical: 5,
      patience: 5,
      exploring: 5,
      helping: 5,
      building: 5 // 5 * 10 = 50% which exceeds Maya's 40% threshold
    }
    // Create graph with Maya's unlock nodes
    const graph = createMockGraph([
      'maya_workshop_invitation',
      'maya_technical_deep_dive',
      'maya_collaboration_offer'
    ])

    const choices = getPatternUnlockChoices('maya', patterns, graph)

    // Should have the workshop invitation (building >= 40)
    expect(choices.length).toBeGreaterThan(0)
    expect(choices.some(c => c.choice.nextNodeId === 'maya_workshop_invitation')).toBe(true)
    expect(choices.every(c => c.isPatternUnlock)).toBe(true)
    expect(choices.every(c => c.visible && c.enabled)).toBe(true)
  })

  it('filters out already visited unlocks', () => {
    const patterns: Record<PatternType, number> = {
      analytical: 5,
      patience: 5,
      exploring: 5,
      helping: 5,
      building: 5
    }
    const graph = createMockGraph([
      'maya_workshop_invitation',
      'maya_technical_deep_dive'
    ])
    const visitedUnlocks = new Set(['maya_workshop_invitation'])

    const choices = getPatternUnlockChoices('maya', patterns, graph, visitedUnlocks)

    // Workshop should be filtered out since it's visited
    expect(choices.some(c => c.choice.nextNodeId === 'maya_workshop_invitation')).toBe(false)
  })

  it('does not return choices for nodes not in graph', () => {
    const patterns: Record<PatternType, number> = {
      analytical: 5,
      patience: 5,
      exploring: 5,
      helping: 5,
      building: 5
    }
    // Empty graph - nodes don't exist
    const graph = createMockGraph([])

    const choices = getPatternUnlockChoices('maya', patterns, graph)
    expect(choices).toHaveLength(0)
  })
})

describe('hasAvailablePatternUnlocks', () => {
  it('returns false for character without unlocks', () => {
    const patterns: Record<PatternType, number> = {
      analytical: 10,
      patience: 10,
      exploring: 10,
      helping: 10,
      building: 10
    }

    // Samuel has no pattern unlocks
    expect(hasAvailablePatternUnlocks('samuel', patterns)).toBe(false)
  })

  it('returns true when threshold is met', () => {
    const patterns: Record<PatternType, number> = {
      analytical: 5,
      patience: 5,
      exploring: 5,
      helping: 5,
      building: 5 // 50% meets Maya's 40% threshold
    }

    expect(hasAvailablePatternUnlocks('maya', patterns)).toBe(true)
  })

  it('returns false when all unlocks are visited', () => {
    const patterns: Record<PatternType, number> = {
      analytical: 5,
      patience: 5,
      exploring: 5,
      helping: 5,
      building: 5
    }
    // Mark all Maya's unlocks as visited
    const visitedUnlocks = new Set([
      'maya_workshop_invitation',
      'maya_collaboration_offer',
      'maya_technical_deep_dive'
    ])

    expect(hasAvailablePatternUnlocks('maya', patterns, visitedUnlocks)).toBe(false)
  })
})

describe('getNextPatternUnlockProgress', () => {
  it('returns null for character without unlocks', () => {
    const patterns: Record<PatternType, number> = {
      analytical: 5,
      patience: 5,
      exploring: 5,
      helping: 5,
      building: 5
    }

    expect(getNextPatternUnlockProgress('samuel', patterns)).toBeNull()
  })

  it('returns next unlock progress for Maya', () => {
    const patterns: Record<PatternType, number> = {
      analytical: 2, // 20% - below Maya's 50% analytical threshold
      patience: 2,
      exploring: 2,
      helping: 2,
      building: 2 // 20% - below Maya's 40% building threshold
    }

    const progress = getNextPatternUnlockProgress('maya', patterns)

    expect(progress).not.toBeNull()
    expect(progress?.pattern).toBeDefined()
    expect(progress?.current).toBeDefined()
    expect(progress?.threshold).toBeDefined()
    expect(progress?.description).toBeDefined()
  })

  it('returns null when all thresholds are met', () => {
    const patterns: Record<PatternType, number> = {
      analytical: 10, // 100% - all thresholds met
      patience: 10,
      exploring: 10,
      helping: 10,
      building: 10
    }

    expect(getNextPatternUnlockProgress('maya', patterns)).toBeNull()
  })
})
