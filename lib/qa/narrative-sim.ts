/**
 * Headless Narrative Path Simulation (shared core)
 *
 * AAA intent:
 * - Deterministic, CI-friendly exploration of dialogue graphs without Playwright.
 * - Catch "menus work / choices work" class regressions as data/logic invariants.
 *
 * Detected issues:
 * - soft_deadlock: node has choices but none are visible+enabled under current state.
 * - hard_dead_end: node has no choices and is not an allowed boundary/terminal.
 * - missing_start: graph.startNodeId doesn't exist.
 *
 * Also tracked (debt-controlled):
 * - required_state_mismatch: we reached a node but its requiredState wasn't satisfied.
 *   This is usually a contract issue or a sim-state seeding gap.
 */

import type { DialogueGraph, DialogueNode } from '../dialogue-graph'
import { StateConditionEvaluator } from '../dialogue-graph'
import type { GameState } from '../character-state'
import type { StateChange } from '../character-state'
import { GameStateUtils } from '../character-state'

const VIRTUAL_NODE_IDS = new Set(['TRAVEL_PENDING', 'SIMULATION_PENDING', 'LOYALTY_PENDING'])

export type TraceStep = { nodeId: string; choiceId: string; nextNodeId: string }

export type SimFailureKind = 'missing_start' | 'soft_deadlock' | 'hard_dead_end'

export type SimFailure = {
  graphKey: string
  nodeId: string
  kind: SimFailureKind
  trace: TraceStep[]
}

export type NarrativeSimOptions = {
  max_steps_per_path: number
  max_expansions: number
  max_states_per_node: number
}

export type NarrativeSimReport = {
  generated_at: string
  options: NarrativeSimOptions
  totals: {
    graphs: number
    expansions: number
    visited_state_pairs: number
    failures: number
    required_state_mismatches: number
  }
  per_graph: Record<
    string,
    {
      expansions: number
      visited_state_pairs: number
      failures: number
      required_state_mismatches: number
      truncated: boolean
    }
  >
  failures: SimFailure[]
  required_state_mismatches: Array<{ graphKey: string; nodeId: string }>
}

export type DialogueGraphsIndex = Record<string, DialogueGraph>

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
      node.tags?.includes('arc_complete'),
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
  for (const ch of changes as unknown[]) {
    next = GameStateUtils.applyStateChange(next, ch as StateChange)
  }
  return next
}

function stableStateHash(state: GameState, characterId: string): string {
  const char = state.characters.get(characterId)
  const knowledgeFlags = char ? [...char.knowledgeFlags].sort().join(',') : ''
  const globalFlags = [...state.globalFlags].sort().join(',')

  // Patterns/mysteries are small fixed-key objects in this project; stringify is stable enough.
  const payload = `t=${char?.trust ?? 0}|k=${knowledgeFlags}|g=${globalFlags}|p=${JSON.stringify(
    state.patterns,
  )}|m=${JSON.stringify(state.mysteries)}`

  // FNV-1a 32-bit.
  let h = 2166136261
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

function simulateGraph(
  dialogueGraphs: DialogueGraphsIndex,
  graphKey: string,
  opts: NarrativeSimOptions,
): {
  expansions: number
  visited_state_pairs: number
  failures: SimFailure[]
  required_state_mismatches: string[]
  truncated: boolean
} {
  const graph = dialogueGraphs[graphKey]
  const baseCharId = baseCharacterIdForGraphKey(graphKey)

  const startNode = graph.nodes.get(graph.startNodeId) as DialogueNode | undefined
  if (!startNode) {
    return {
      expansions: 0,
      visited_state_pairs: 0,
      failures: [{ graphKey, nodeId: `missing_start:${graph.startNodeId}`, kind: 'missing_start', trace: [] }],
      required_state_mismatches: [],
      truncated: false,
    }
  }

  const state = GameStateUtils.createNewGameState('narrative-sim-enum')
  ensureRevisitEntryState(graphKey, startNode, state)

  type QItem = { nodeId: string; state: GameState; trace: TraceStep[]; steps: number }
  const queue: QItem[] = [{ nodeId: graph.startNodeId, state, trace: [], steps: 0 }]

  const visited = new Set<string>()
  const perNodeStateCount = new Map<string, number>()

  const failures: SimFailure[] = []
  const requiredStateMismatches: string[] = []

  let expansions = 0
  let truncated = false

  while (queue.length > 0) {
    const item = queue.shift()!
    if (item.steps > opts.max_steps_per_path) continue
    if (VIRTUAL_NODE_IDS.has(item.nodeId)) continue

    const node: DialogueNode | undefined = graph.nodes.get(item.nodeId)
    if (!node) continue

    if (!StateConditionEvaluator.evaluate(node.requiredState, item.state, baseCharId, item.state.skillLevels)) {
      requiredStateMismatches.push(node.nodeId)
      continue
    }

    const nextState = applyStateChanges(item.state, node.onEnter)

    if (!node.choices || node.choices.length === 0) {
      if (!isBoundaryNode(node)) {
        failures.push({ graphKey, nodeId: node.nodeId, kind: 'hard_dead_end', trace: item.trace })
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
      failures.push({ graphKey, nodeId: node.nodeId, kind: 'soft_deadlock', trace: item.trace })
      break
    }

    for (const choice of visibleEnabled) {
      const nextNodeId = choice.nextNodeId
      if (!nextNodeId) continue
      if (VIRTUAL_NODE_IDS.has(nextNodeId)) continue
      if (!graph.nodes.has(nextNodeId)) continue // cross-graph: stop expansion

      let branched = nextState
      if (choice.consequence) {
        branched = GameStateUtils.applyStateChange(branched, choice.consequence)
      }
      if (choice.pattern) {
        branched = GameStateUtils.applyStateChange(branched, {
          patternChanges: { [choice.pattern]: 1 },
        } as StateChange)
      }
      branched = applyStateChanges(branched, node.onExit)

      const stateHash = stableStateHash(branched, baseCharId)
      const visitKey = `${nextNodeId}|${stateHash}`
      if (visited.has(visitKey)) continue

      const count = (perNodeStateCount.get(nextNodeId) ?? 0) + 1
      if (count > opts.max_states_per_node) continue
      perNodeStateCount.set(nextNodeId, count)

      visited.add(visitKey)
      queue.push({
        nodeId: nextNodeId,
        state: branched,
        trace: [...item.trace, { nodeId: node.nodeId, choiceId: choice.choiceId, nextNodeId }],
        steps: item.steps + 1,
      })

      if (++expansions > opts.max_expansions) {
        truncated = true
        break
      }
    }

    if (truncated) break
  }

  return {
    expansions,
    visited_state_pairs: visited.size,
    failures,
    required_state_mismatches: [...new Set(requiredStateMismatches)].sort(),
    truncated,
  }
}

export function buildNarrativeSimReport(
  dialogueGraphs: DialogueGraphsIndex,
  opts: Partial<NarrativeSimOptions> = {},
): NarrativeSimReport {
  const options: NarrativeSimOptions = {
    max_steps_per_path: opts.max_steps_per_path ?? 120,
    max_expansions: opts.max_expansions ?? 6000,
    max_states_per_node: opts.max_states_per_node ?? 40,
  }

  const failures: SimFailure[] = []
  const required_state_mismatches: Array<{ graphKey: string; nodeId: string }> = []
  const per_graph: NarrativeSimReport['per_graph'] = {}

  let totalExpansions = 0
  let totalVisited = 0

  for (const graphKey of Object.keys(dialogueGraphs).sort()) {
    const r = simulateGraph(dialogueGraphs, graphKey, options)
    totalExpansions += r.expansions
    totalVisited += r.visited_state_pairs

    for (const f of r.failures) failures.push(f)
    for (const nodeId of r.required_state_mismatches) required_state_mismatches.push({ graphKey, nodeId })

    per_graph[graphKey] = {
      expansions: r.expansions,
      visited_state_pairs: r.visited_state_pairs,
      failures: r.failures.length,
      required_state_mismatches: r.required_state_mismatches.length,
      truncated: r.truncated,
    }
  }

  failures.sort((a, b) => `${a.graphKey}/${a.nodeId}/${a.kind}`.localeCompare(`${b.graphKey}/${b.nodeId}/${b.kind}`))
  required_state_mismatches.sort((a, b) => `${a.graphKey}/${a.nodeId}`.localeCompare(`${b.graphKey}/${b.nodeId}`))

  return {
    generated_at: new Date().toISOString(),
    options,
    totals: {
      graphs: Object.keys(dialogueGraphs).length,
      expansions: totalExpansions,
      visited_state_pairs: totalVisited,
      failures: failures.length,
      required_state_mismatches: required_state_mismatches.length,
    },
    per_graph,
    failures,
    required_state_mismatches,
  }
}
