/**
 * Headless Narrative Path Simulation
 *
 * Purpose (AAA-style): explore many short, deterministic playthroughs and fail
 * if we encounter "soft deadlocks" (nodes reachable under their own requiredState
 * but presenting zero visible+enabled choices) or invalid transitions.
 *
 * This is a CI-friendly alternative to relying on Playwright for core correctness.
 */

import { describe, it, expect } from 'vitest'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import { GameState, GameStateUtils } from '@/lib/character-state'
import { DialogueNode, StateConditionEvaluator } from '@/lib/dialogue-graph'
import { SeededRandom } from '@/lib/seeded-random'

const VIRTUAL_NODE_IDS = new Set(['TRAVEL_PENDING', 'SIMULATION_PENDING', 'LOYALTY_PENDING'])

function baseCharacterIdForGraphKey(graphKey: string): string {
  return graphKey.replace(/_revisit$/, '')
}

function isBoundaryNode(node: DialogueNode): boolean {
  return Boolean(
    node.simulation ||
    node.metadata?.sessionBoundary ||
    node.metadata?.experienceId ||
    node.tags?.includes('terminal') ||
    node.tags?.includes('ending') ||
    node.tags?.includes('arc_complete')
  )
}

function ensureRevisitEntryState(graphKey: string, graphStartNode: DialogueNode, state: GameState): void {
  if (!graphKey.endsWith('_revisit')) return

  const baseCharId = baseCharacterIdForGraphKey(graphKey)
  state.globalFlags.add(`${baseCharId}_arc_complete`)

  const charState = state.characters.get(baseCharId)
  if (!charState) return

  // Many revisit entry nodes branch based on one "decision" knowledge flag from the base arc.
  // Seed one representative flag so the graph is traversable in headless simulation.
  const candidateFlags: string[] = []
  for (const ch of graphStartNode.choices ?? []) {
    for (const flag of ch.visibleCondition?.hasKnowledgeFlags ?? []) {
      candidateFlags.push(flag)
    }
  }
  if (candidateFlags.length > 0) {
    charState.knowledgeFlags.add(candidateFlags[0])
  }
}

function applyStateChanges(state: GameState, changes: Array<unknown> | undefined): GameState {
  if (!changes || changes.length === 0) return state
  let next = state
  for (const ch of changes as any[]) {
    next = GameStateUtils.applyStateChange(next, ch)
  }
  return next
}

function simulateOnePath(graphKey: string, maxSteps: number): { deadlocks: string[]; invalidRequiredState: string[] } {
  const graph = (DIALOGUE_GRAPHS as any)[graphKey]
  const baseCharId = baseCharacterIdForGraphKey(graphKey)

  let state = GameStateUtils.createNewGameState('path-sim')
  const startNode = graph.nodes.get(graph.startNodeId) as DialogueNode | undefined
  if (!startNode) {
    return { deadlocks: [`missing_start:${graph.startNodeId}`], invalidRequiredState: [] }
  }

  ensureRevisitEntryState(graphKey, startNode, state)

  let nodeId: string = graph.startNodeId
  const deadlocks: string[] = []
  const invalidRequiredState: string[] = []

  for (let step = 0; step < maxSteps; step++) {
    if (VIRTUAL_NODE_IDS.has(nodeId)) break

    const node: DialogueNode | undefined = graph.nodes.get(nodeId)
    if (!node) break // Cross-graph or external transition: end the simulation path.

    // If we don't meet requiredState for a node we've reached, that's a consistency signal:
    // either incoming choices should enforce the same constraint, or requiredState is stale.
    // Runtime currently does not hard-block on requiredState during navigation.
    if (!StateConditionEvaluator.evaluate(node.requiredState, state, baseCharId, state.skillLevels)) {
      invalidRequiredState.push(node.nodeId)
      break
    }

    state = applyStateChanges(state, node.onEnter)

    if (!node.choices || node.choices.length === 0) {
      if (!isBoundaryNode(node)) {
        deadlocks.push(node.nodeId)
      }
      break
    }

    // Evaluate visible+enabled choices without relying on auto-fallback.
    const visibleEnabled = node.choices.filter(choice => {
      const visible = StateConditionEvaluator.evaluate(choice.visibleCondition, state, baseCharId, state.skillLevels)
      if (!visible) return false
      const enabled = StateConditionEvaluator.evaluate(choice.enabledCondition, state, baseCharId, state.skillLevels)
      return enabled
    })

    if (visibleEnabled.length === 0) {
      deadlocks.push(node.nodeId)
      break
    }

    const picked = visibleEnabled[Math.floor(SeededRandom.random() * visibleEnabled.length)]

    // Apply choice consequence + pattern delta (matches the core gameplay rule).
    if (picked.consequence) {
      state = GameStateUtils.applyStateChange(state, picked.consequence)
    }
    if (picked.pattern) {
      state = GameStateUtils.applyStateChange(state, { patternChanges: { [picked.pattern]: 1 } })
    }

    state = applyStateChanges(state, node.onExit)

    nodeId = picked.nextNodeId
    if (!nodeId) break
    if (VIRTUAL_NODE_IDS.has(nodeId)) break
    if (!graph.nodes.has(nodeId)) break
  }

  return { deadlocks, invalidRequiredState }
}

describe('Narrative Path Simulation (Headless)', () => {
  it('does not encounter deadlocks in short simulated runs', () => {
    const failures: Array<{ graphKey: string; deadlocks: string[] }> = []
    const requiredStateMismatches: Array<{ graphKey: string; nodes: string[] }> = []

    const graphKeys = Object.keys(DIALOGUE_GRAPHS)

    for (const graphKey of graphKeys) {
      // Keep runtime bounded: 10 short runs per graph.
      for (let i = 0; i < 10; i++) {
        SeededRandom.seed(hashSeed(`${graphKey}:${i}`))
        const result = simulateOnePath(graphKey, 80)
        SeededRandom.reset()

        if (result.invalidRequiredState.length > 0) {
          requiredStateMismatches.push({ graphKey, nodes: result.invalidRequiredState })
        }
        if (result.deadlocks.length > 0) {
          failures.push({ graphKey, deadlocks: result.deadlocks })
          break // One failure is enough to surface a broken graph.
        }
      }
    }

    if (failures.length > 0) {
      // Keep output compact; show first few.
      // eslint-disable-next-line no-console
      console.log('\nSimulated-path failures:')
      for (const f of failures.slice(0, 10)) {
        // eslint-disable-next-line no-console
        console.log(
          `- ${f.graphKey}: deadlocks=[${f.deadlocks.join(', ')}]`
        )
      }
      if (failures.length > 10) {
        // eslint-disable-next-line no-console
        console.log(`... and ${failures.length - 10} more`)
      }
    }

    if (requiredStateMismatches.length > 0) {
      // eslint-disable-next-line no-console
      console.log('\nrequiredState mismatches (informational):')
      for (const m of requiredStateMismatches.slice(0, 10)) {
        // eslint-disable-next-line no-console
        console.log(`- ${m.graphKey}: ${m.nodes.join(', ')}`)
      }
      if (requiredStateMismatches.length > 10) {
        // eslint-disable-next-line no-console
        console.log(`... and ${requiredStateMismatches.length - 10} more`)
      }
    }

    expect(failures).toEqual([])
  })
})

function hashSeed(input: string): number {
  // Cheap stable hash -> 32-bit int for seeding.
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
