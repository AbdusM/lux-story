/**
 * Required State Guarding Report
 *
 * Purpose: identify nodes that declare `requiredState` but are reachable via
 * incoming choices that do not enforce those requirements. This is informational
 * and does not fail CI, but it surfaces drift between intent and actual gating.
 */

import { describe, it, expect } from 'vitest'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import type { DialogueNode, ConditionalChoice } from '@/lib/dialogue-graph'
import type { StateCondition } from '@/lib/character-state'

type IncomingEdge = {
  fromGraph: string
  fromNodeId: string
  choiceId: string
  visibleCondition?: StateCondition
}

function collectIncomingEdges(): Map<string, IncomingEdge[]> {
  const incoming = new Map<string, IncomingEdge[]>()
  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    for (const node of graph.nodes.values()) {
      for (const choice of node.choices ?? []) {
        const edge: IncomingEdge = {
          fromGraph: graphKey,
          fromNodeId: node.nodeId,
          choiceId: choice.choiceId,
          visibleCondition: choice.visibleCondition,
        }
        const list = incoming.get(choice.nextNodeId) ?? []
        list.push(edge)
        incoming.set(choice.nextNodeId, list)
      }
    }
  }
  return incoming
}

function conditionGuards(required: StateCondition, visible?: StateCondition): boolean {
  if (!visible) return false

  if (required.trust) {
    const v = visible.trust
    if (!v) return false
    if (required.trust.min !== undefined && (v.min === undefined || v.min < required.trust.min)) return false
    if (required.trust.max !== undefined && (v.max === undefined || v.max > required.trust.max)) return false
  }

  if (required.hasGlobalFlags) {
    const v = visible.hasGlobalFlags
    if (!v) return false
    for (const flag of required.hasGlobalFlags) {
      if (!v.includes(flag)) return false
    }
  }

  if (required.lacksGlobalFlags) {
    const v = visible.lacksGlobalFlags
    if (!v) return false
    for (const flag of required.lacksGlobalFlags) {
      if (!v.includes(flag)) return false
    }
  }

  if (required.hasKnowledgeFlags) {
    const v = visible.hasKnowledgeFlags
    if (!v) return false
    for (const flag of required.hasKnowledgeFlags) {
      if (!v.includes(flag)) return false
    }
  }

  if (required.lacksKnowledgeFlags) {
    const v = visible.lacksKnowledgeFlags
    if (!v) return false
    for (const flag of required.lacksKnowledgeFlags) {
      if (!v.includes(flag)) return false
    }
  }

  if (required.patterns) {
    const v = visible.patterns
    if (!v) return false
    for (const [pattern, range] of Object.entries(required.patterns)) {
      const vr = v[pattern as keyof typeof v]
      if (!vr) return false
      if (range?.min !== undefined && (vr.min === undefined || vr.min < range.min)) return false
      if (range?.max !== undefined && (vr.max === undefined || vr.max > range.max)) return false
    }
  }

  if (required.mysteries) {
    const v = visible.mysteries
    if (!v) return false
    for (const [key, value] of Object.entries(required.mysteries)) {
      if (v[key as keyof typeof v] !== value) return false
    }
  }

  if (required.requiredCombos) {
    const v = visible.requiredCombos
    if (!v) return false
    for (const combo of required.requiredCombos) {
      if (!v.includes(combo)) return false
    }
  }

  return true
}

function hasRequiredState(node: DialogueNode): node is DialogueNode & { requiredState: StateCondition } {
  return Boolean(node.requiredState && Object.keys(node.requiredState).length > 0)
}

describe('Required State Guarding', () => {
  it('reports nodes whose requiredState is not enforced by any incoming choice (informational)', () => {
    const incoming = collectIncomingEdges()
    const startNodeIds = new Set(
      Object.values(DIALOGUE_GRAPHS).map(g => g.startNodeId)
    )

    const unguarded: Array<{
      graphKey: string
      nodeId: string
      requiredState: StateCondition
      unguardedEdges: IncomingEdge[]
    }> = []

    for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
      for (const node of graph.nodes.values()) {
        if (!hasRequiredState(node)) continue
        if (startNodeIds.has(node.nodeId)) continue

        const edges = incoming.get(node.nodeId) ?? []
        if (edges.length === 0) continue // likely orphan or entrypoint via non-choice routing

        const unguardedEdges = edges.filter(edge => !conditionGuards(node.requiredState, edge.visibleCondition))
        if (unguardedEdges.length > 0) {
          unguarded.push({
            graphKey,
            nodeId: node.nodeId,
            requiredState: node.requiredState,
            unguardedEdges,
          })
        }
      }
    }

    if (unguarded.length > 0) {
      // eslint-disable-next-line no-console
      console.log('\nRequiredState Guarding Report')
      // eslint-disable-next-line no-console
      console.log(`Unguarded nodes: ${unguarded.length}`)
      for (const item of unguarded.slice(0, 15)) {
        // eslint-disable-next-line no-console
        console.log(`- ${item.graphKey}/${item.nodeId}`)
        // eslint-disable-next-line no-console
        console.log(`  requiredState: ${JSON.stringify(item.requiredState)}`)
        // eslint-disable-next-line no-console
        console.log(`  unguarded incoming edges: ${item.unguardedEdges.length}`)
        // eslint-disable-next-line no-console
        console.log(`  example edge: ${item.unguardedEdges[0].fromGraph}/${item.unguardedEdges[0].fromNodeId}/${item.unguardedEdges[0].choiceId}`)
      }
      if (unguarded.length > 15) {
        // eslint-disable-next-line no-console
        console.log(`... and ${unguarded.length - 15} more`)
      }
    }

    // Informational only.
    expect(unguarded).toBeDefined()
  })
})

