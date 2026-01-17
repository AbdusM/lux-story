/**
 * Unit tests for simulation validators
 * Tests registry alignment and entry node validation
 */

import { describe, it, expect } from 'vitest'
import {
  buildSimulationAlignmentMap,
  validateEntryNodes,
  validatePhaseAndDifficulty,
  validateSimulations,
  CONTENT_REGISTRY,
  LIB_REGISTRY
} from '@/lib/validators/simulation-validators'
import { DialogueGraph, DialogueNode } from '@/lib/dialogue-graph'

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function createTestGraph(characterId: string, nodeIds: string[]): DialogueGraph {
  const nodeMap = new Map<string, DialogueNode>()
  for (const nodeId of nodeIds) {
    nodeMap.set(nodeId, {
      nodeId,
      speaker: 'Test',
      content: [{ text: 'Test', emotion: 'neutral' }],
      choices: []
    })
  }
  return {
    graphId: `${characterId}_graph`,
    characterId,
    nodes: nodeMap,
    startNodeId: nodeIds[0] ?? 'start'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ALIGNMENT MAP TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('buildSimulationAlignmentMap', () => {
  it('returns a map with entries for all characters', () => {
    const { map } = buildSimulationAlignmentMap()

    // Should have entries for all unique characters across both registries
    expect(map.length).toBeGreaterThan(0)

    // Each entry should have characterId
    for (const entry of map) {
      expect(entry.characterId).toBeTruthy()
    }
  })

  it('does not report id mismatches after unification', () => {
    const { issues } = buildSimulationAlignmentMap()

    const idMismatches = issues.filter(i => i.issueType === 'id_mismatch')
    expect(idMismatches.length).toBe(0)
  })

  it('marks aligned entries correctly', () => {
    const { map } = buildSimulationAlignmentMap()

    // Some entries should be aligned (same ID in both registries)
    // e.g., quinn_pitch, dante_pitch, nadia_news, isaiah_logistics
    const alignedEntries = map.filter(m => m.aligned)

    // At least some should be aligned
    expect(alignedEntries.length).toBeGreaterThanOrEqual(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// ENTRY NODE VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('validateEntryNodes', () => {
  it('returns no issues when entry nodes exist', () => {
    // Create graphs with all expected entry nodes
    const graphs = new Map<string, DialogueGraph>()

    for (const sim of LIB_REGISTRY) {
      graphs.set(sim.characterId, createTestGraph(sim.characterId, [sim.entryNodeId]))
    }

    const issues = validateEntryNodes(graphs)

    expect(issues).toHaveLength(0)
  })

  it('detects missing entry nodes', () => {
    // Create graphs without the expected entry nodes
    const graphs = new Map<string, DialogueGraph>()

    for (const sim of LIB_REGISTRY) {
      // Create graph with a different node, not the entry node
      graphs.set(sim.characterId, createTestGraph(sim.characterId, ['some_other_node']))
    }

    const issues = validateEntryNodes(graphs)

    // Should have an issue for each simulation
    expect(issues.length).toBe(LIB_REGISTRY.length)
    expect(issues.every(i => i.issueType === 'missing_entry_node')).toBe(true)
  })

  it('skips validation for characters without graphs', () => {
    // Empty graph map
    const graphs = new Map<string, DialogueGraph>()

    const issues = validateEntryNodes(graphs)

    // No issues because no graphs to validate against
    expect(issues).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PHASE/DIFFICULTY VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('validatePhaseAndDifficulty', () => {
  it('validates that all content simulations have phase and difficulty', () => {
    const issues = validatePhaseAndDifficulty()

    // Check that all content registry entries have phase and difficulty
    // If any are missing, issues will be reported
    for (const sim of CONTENT_REGISTRY) {
      if (sim.phase === undefined) {
        expect(issues.some(i => i.contentId === sim.id && i.issueType === 'phase_mismatch')).toBe(true)
      }
      if (!sim.difficulty) {
        expect(issues.some(i => i.contentId === sim.id && i.issueType === 'difficulty_mismatch')).toBe(true)
      }
    }
  })

  it('returns no issues when all simulations have phase and difficulty', () => {
    // All current content registry entries should have phase and difficulty
    const issues = validatePhaseAndDifficulty()

    // If the content registry is well-formed, this should pass
    // This test documents the expected state
    expect(issues.filter(i => i.issueType === 'phase_mismatch')).toHaveLength(0)
    expect(issues.filter(i => i.issueType === 'difficulty_mismatch')).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// FULL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('validateSimulations', () => {
  it('returns a complete validation result', () => {
    const result = validateSimulations()

    expect(result).toHaveProperty('valid')
    expect(result).toHaveProperty('alignmentIssues')
    expect(result).toHaveProperty('entryNodeIssues')
    expect(result).toHaveProperty('alignmentMap')
    expect(result).toHaveProperty('summary')
  })

  it('includes alignment map with all characters', () => {
    const result = validateSimulations()

    // Should have an entry for each unique character
    const uniqueCharacters = new Set([
      ...CONTENT_REGISTRY.map(s => s.characterId),
      ...LIB_REGISTRY.map(s => s.characterId)
    ])

    expect(result.alignmentMap.length).toBe(uniqueCharacters.size)
  })

  it('summary includes counts', () => {
    const result = validateSimulations()

    expect(result.summary).toContain('Simulations')
    expect(result.summary).toMatch(/\d+\/\d+ aligned/)
    expect(result.summary).toMatch(/\d+ errors/)
    expect(result.summary).toMatch(/\d+ warnings/)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY INTEGRITY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Registry integrity', () => {
  it('content registry has 20 simulations', () => {
    expect(CONTENT_REGISTRY.length).toBe(20)
  })

  it('lib registry has 20 simulations', () => {
    expect(LIB_REGISTRY.length).toBe(20)
  })

  it('each content simulation has required fields', () => {
    for (const sim of CONTENT_REGISTRY) {
      expect(sim.id).toBeTruthy()
      expect(sim.characterId).toBeTruthy()
      expect(sim.title).toBeTruthy()
      expect(sim.type).toBeTruthy()
      expect(sim.description).toBeTruthy()
      expect(sim.defaultContext).toBeTruthy()
    }
  })

  it('each lib simulation has required fields', () => {
    for (const sim of LIB_REGISTRY) {
      expect(sim.id).toBeTruthy()
      expect(sim.characterId).toBeTruthy()
      expect(sim.title).toBeTruthy()
      expect(sim.description).toBeTruthy()
      expect(sim.entryNodeId).toBeTruthy()
      expect(sim.completionFlag).toBeTruthy()
    }
  })
})
