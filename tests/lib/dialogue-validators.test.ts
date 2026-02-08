/**
 * Unit tests for dialogue validators
 * Tests gating validation and pattern unlock integrity
 */

import { describe, it, expect } from 'vitest'
import {
  validateDialogueGating,
  validatePatternUnlocks,
  validateDialogueGraph,
  GatingIssue,
  PatternUnlockIssue
} from '@/lib/validators/dialogue-validators'
import { DialogueGraph, DialogueNode, ConditionalChoice } from '@/lib/dialogue-graph'

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function createTestGraph(nodes: DialogueNode[]): DialogueGraph {
  const nodeMap = new Map<string, DialogueNode>()
  for (const node of nodes) {
    nodeMap.set(node.nodeId, node)
  }
  return {
    graphId: 'test_graph',
    characterId: 'test_character',
    nodes: nodeMap,
    startNodeId: nodes[0]?.nodeId ?? 'start'
  }
}

function createTestNode(
  nodeId: string,
  choices: ConditionalChoice[] = []
): DialogueNode {
  return {
    nodeId,
    speaker: 'Test',
    content: [{ text: 'Test content', emotion: 'neutral' }],
    choices
  }
}

function createTestChoice(
  text: string,
  nextNodeId: string,
  visibleCondition?: { trust?: { min?: number } }
): ConditionalChoice {
  return {
    choiceId: `choice_${text.slice(0, 10).replace(/\s/g, '_')}`,
    text,
    nextNodeId,
    visibleCondition
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GATING VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('validateDialogueGating', () => {
  it('returns no issues for well-formed graph', () => {
    const graph = createTestGraph([
      createTestNode('start', [
        createTestChoice('Option A', 'node_a'),
        createTestChoice('Option B', 'node_b')
      ]),
      createTestNode('node_a', [createTestChoice('Continue', 'end')]),
      createTestNode('node_b', [createTestChoice('Continue', 'end')]),
      createTestNode('end', [])
    ])

    const issues = validateDialogueGating(graph, 'test_character')

    // Only the 'end' node has no choices, which is a warning
    const errors = issues.filter(i => i.severity === 'error')
    expect(errors).toHaveLength(0)
  })

  it('detects unreachable next nodes', () => {
    const graph = createTestGraph([
      createTestNode('start', [
        createTestChoice('Go to missing', 'missing_node')
      ])
    ])

    const issues = validateDialogueGating(graph, 'test_character')

    expect(issues.some(i => i.issueType === 'unreachable_next_node')).toBe(true)
    expect(issues.find(i => i.issueType === 'unreachable_next_node')?.details).toContain('missing_node')
  })

  it('detects nodes with no choices (warning)', () => {
    const graph = createTestGraph([
      createTestNode('dead_end', [])
    ])

    const issues = validateDialogueGating(graph, 'test_character')

    expect(issues.some(i => i.issueType === 'no_choices')).toBe(true)
    expect(issues.find(i => i.issueType === 'no_choices')?.severity).toBe('warning')
  })

  it('skips simulation nodes from no_choices warning', () => {
    const node = createTestNode('sim_node', [])
    node.simulation = {
      type: 'system_architecture',
      title: 'Test Sim',
      taskDescription: 'Test',
      successFeedback: 'Done'
    }

    const graph = createTestGraph([node])

    const issues = validateDialogueGating(graph, 'test_character')

    expect(issues.some(i => i.issueType === 'no_choices' && i.nodeId === 'sim_node')).toBe(false)
  })

  it('detects all choices gated off under default state', () => {
    const graph = createTestGraph([
      createTestNode('gated_node', [
        createTestChoice('High trust option', 'next', { trust: { min: 10 } }),
        createTestChoice('Another high trust', 'next', { trust: { min: 8 } })
      ]),
      createTestNode('next', [])
    ])

    const issues = validateDialogueGating(graph, 'test_character')

    expect(issues.some(i => i.issueType === 'all_choices_gated')).toBe(true)
  })

  it('skips nodes whose requiredState is not met under the provided state', () => {
    const gatedByTrust: DialogueNode = {
      nodeId: 'trust_gate',
      speaker: 'Test',
      content: [{ text: 'Gate', emotion: 'neutral', variation_id: 'v1' }],
      requiredState: { trust: { min: 10 } },
      choices: [
        createTestChoice('Option A', 'end')
      ]
    }

    const graph = createTestGraph([
      gatedByTrust,
      createTestNode('end', [])
    ])

    const issues = validateDialogueGating(graph, 'test_character')
    expect(issues.find(i => i.nodeId === 'trust_gate')).toBeUndefined()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN UNLOCK VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('validatePatternUnlocks', () => {
  it('returns no issues for character without pattern unlocks', () => {
    const graph = createTestGraph([createTestNode('start', [])])

    // Use a character ID that doesn't have pattern unlocks defined
    const issues = validatePatternUnlocks('nonexistent_character', graph)

    expect(issues).toHaveLength(0)
  })

  it('detects missing unlocked nodes for maya', () => {
    // Maya has pattern unlocks defined in pattern-affinity.ts
    // Create a graph that's missing the unlock nodes
    const graph = createTestGraph([
      createTestNode('start', [])
    ])

    const issues = validatePatternUnlocks('maya', graph)

    // Maya has unlocks pointing to maya_workshop_invitation, etc.
    expect(issues.some(i => i.issueType === 'missing_node')).toBe(true)
  })

  it('passes when unlocked nodes exist', () => {
    // Create a graph with Maya's expected unlock nodes
    const graph = createTestGraph([
      createTestNode('start', []),
      createTestNode('maya_workshop_invitation', []),
      createTestNode('maya_collaboration_offer', []),
      createTestNode('maya_technical_deep_dive', [])
    ])

    const issues = validatePatternUnlocks('maya', graph)

    // Should have no missing_node issues
    expect(issues.filter(i => i.issueType === 'missing_node')).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// FULL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('validateDialogueGraph', () => {
  it('returns valid=true for clean graph', () => {
    const graph = createTestGraph([
      createTestNode('start', [
        createTestChoice('Continue', 'end')
      ]),
      createTestNode('end', [])
    ])

    const result = validateDialogueGraph(graph, 'test_character')

    // May have warnings but no errors
    expect(result.gatingIssues.filter(i => i.severity === 'error')).toHaveLength(0)
  })

  it('returns valid=false when there are errors', () => {
    const graph = createTestGraph([
      createTestNode('start', [
        createTestChoice('Go to missing', 'missing_node')
      ])
    ])

    const result = validateDialogueGraph(graph, 'test_character')

    expect(result.valid).toBe(false)
    expect(result.gatingIssues.some(i => i.severity === 'error')).toBe(true)
  })

  it('includes summary with counts', () => {
    const graph = createTestGraph([
      createTestNode('start', [
        createTestChoice('Go to missing', 'missing_node')
      ])
    ])

    const result = validateDialogueGraph(graph, 'test_character')

    expect(result.summary).toContain('test_character')
    expect(result.summary).toMatch(/\d+ errors/)
    expect(result.summary).toMatch(/\d+ warnings/)
  })
})
