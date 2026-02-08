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

function stableStateHash(state: GameState, characterId: string): string {
  const char = state.characters.get(characterId)
  const payload = {
    trust: char?.trust ?? 0,
    knowledgeFlags: char ? [...char.knowledgeFlags].sort() : [],
    globalFlags: [...state.globalFlags].sort(),
    patterns: state.patterns,
    mysteries: state.mysteries,
  }

  const s = JSON.stringify(payload)
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

type TraceStep = { nodeId: string; choiceId: string; nextNodeId: string }

function exploreForDeadlocks(graphKey: string): { deadlocks: Array<{ nodeId: string; trace: TraceStep[] }>; requiredStateMismatches: string[] } {
  const graph = (DIALOGUE_GRAPHS as any)[graphKey]
  const baseCharId = baseCharacterIdForGraphKey(graphKey)

  const startNode = graph.nodes.get(graph.startNodeId) as DialogueNode | undefined
  if (!startNode) {
    return { deadlocks: [{ nodeId: `missing_start:${graph.startNodeId}`, trace: [] }], requiredStateMismatches: [] }
  }

  let state = GameStateUtils.createNewGameState('path-sim-enum')
  ensureRevisitEntryState(graphKey, startNode, state)

  type QItem = { nodeId: string; state: GameState; trace: TraceStep[]; steps: number }
  const queue: QItem[] = [{ nodeId: graph.startNodeId, state, trace: [], steps: 0 }]

  const visited = new Set<string>()
  const perNodeStateCount = new Map<string, number>()

  const deadlocks: Array<{ nodeId: string; trace: TraceStep[] }> = []
  const requiredStateMismatches: string[] = []

  const MAX_STEPS_PER_PATH = 120
  const MAX_EXPANSIONS = 6000
  const MAX_STATES_PER_NODE = 40
  let expansions = 0

  while (queue.length > 0) {
    const item = queue.shift()!
    if (item.steps > MAX_STEPS_PER_PATH) continue
    if (VIRTUAL_NODE_IDS.has(item.nodeId)) continue

    const node: DialogueNode | undefined = graph.nodes.get(item.nodeId)
    if (!node) continue

    // If requiredState isn't met, this path is "invalid" under the content contract.
    // Don't treat it as a deadlock; track it informationally.
    if (!StateConditionEvaluator.evaluate(node.requiredState, item.state, baseCharId, item.state.skillLevels)) {
      requiredStateMismatches.push(node.nodeId)
      continue
    }

    let nextState = applyStateChanges(item.state, node.onEnter)

    if (!node.choices || node.choices.length === 0) {
      if (!isBoundaryNode(node)) {
        deadlocks.push({ nodeId: node.nodeId, trace: item.trace })
        break
      }
      continue
    }

    const visibleEnabled = node.choices
      .filter(choice => {
        const visible = StateConditionEvaluator.evaluate(choice.visibleCondition, nextState, baseCharId, nextState.skillLevels)
        if (!visible) return false
        const enabled = StateConditionEvaluator.evaluate(choice.enabledCondition, nextState, baseCharId, nextState.skillLevels)
        return enabled
      })
      .slice()
      .sort((a, b) => a.choiceId.localeCompare(b.choiceId))

    if (visibleEnabled.length === 0) {
      deadlocks.push({ nodeId: node.nodeId, trace: item.trace })
      break
    }

    for (const choice of visibleEnabled) {
      const nextNodeId = choice.nextNodeId
      if (!nextNodeId) continue
      if (VIRTUAL_NODE_IDS.has(nextNodeId)) continue
      if (!graph.nodes.has(nextNodeId)) continue // cross-graph: stop expansion

      let branched = nextState
      if (choice.consequence) {
        branched = GameStateUtils.applyStateChange(branched, choice.consequence as any)
      }
      if (choice.pattern) {
        branched = GameStateUtils.applyStateChange(branched, { patternChanges: { [choice.pattern]: 1 } } as any)
      }
      branched = applyStateChanges(branched, node.onExit)

      const stateHash = stableStateHash(branched, baseCharId)
      const visitKey = `${nextNodeId}|${stateHash}`
      if (visited.has(visitKey)) continue

      const count = (perNodeStateCount.get(nextNodeId) ?? 0) + 1
      if (count > MAX_STATES_PER_NODE) continue
      perNodeStateCount.set(nextNodeId, count)

      visited.add(visitKey)
      queue.push({
        nodeId: nextNodeId,
        state: branched,
        trace: [...item.trace, { nodeId: node.nodeId, choiceId: choice.choiceId, nextNodeId }],
        steps: item.steps + 1,
      })

      if (++expansions > MAX_EXPANSIONS) break
    }

    if (expansions > MAX_EXPANSIONS) break
  }

  return { deadlocks, requiredStateMismatches }
}

describe('Narrative Path Simulation (Headless)', () => {
  it('does not encounter deadlocks under bounded enumerative exploration', () => {
    const failures: Array<{ graphKey: string; nodeId: string; trace: TraceStep[] }> = []
    const requiredStateMismatches: Array<{ graphKey: string; nodes: string[] }> = []

    for (const graphKey of Object.keys(DIALOGUE_GRAPHS)) {
      const result = exploreForDeadlocks(graphKey)
      if (result.deadlocks.length > 0) {
        const first = result.deadlocks[0]
        failures.push({ graphKey, nodeId: first.nodeId, trace: first.trace })
      }
      if (result.requiredStateMismatches.length > 0) {
        requiredStateMismatches.push({ graphKey, nodes: [...new Set(result.requiredStateMismatches)].slice(0, 5) })
      }
    }

    if (failures.length > 0) {
      // Keep output compact; show first few.
      // eslint-disable-next-line no-console
      console.log('\nSimulated-path failures:')
      for (const f of failures.slice(0, 10)) {
        // eslint-disable-next-line no-console
        console.log(`- ${f.graphKey}: deadlock=${f.nodeId}`)
        if (f.trace.length > 0) {
          // eslint-disable-next-line no-console
          console.log(`  trace: ${f.trace.map(s => `${s.nodeId}/${s.choiceId}→${s.nextNodeId}`).join(' | ')}`)
        }
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

// Seed hashing removed: exploration is deterministic by choiceId ordering and state hashing.
