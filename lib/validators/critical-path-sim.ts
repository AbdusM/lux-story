import type { GameState } from '@/lib/character-state'
import { GameStateUtils } from '@/lib/character-state'
import type { DialogueNode } from '@/lib/dialogue-graph'
import { StateConditionEvaluator } from '@/lib/dialogue-graph'
import { findCharacterForNode } from '@/lib/graph-registry'

export type SimViolationType = 'required_state_violation' | 'soft_deadlock' | 'missing_node'

export type SimViolation = {
  type: SimViolationType
  node_id: string
  character_id: string | null
  details: string
  trace: Array<{ node_id: string; choice_id?: string }>
}

export type CriticalPathSimOptions = {
  start_node_id: string
  max_steps: number
  max_states: number
}

function summarizeStateKey(nodeId: string, state: GameState, characterId: string | null): string {
  const patterns = state.patterns
  const patternKey = `${patterns.analytical},${patterns.helping},${patterns.building},${patterns.patience},${patterns.exploring}`
  const flags = Array.from(state.globalFlags).sort()
  const flagsKey = flags.join('|')

  let charKey = ''
  if (characterId) {
    const cs = state.characters.get(characterId)
    if (cs) {
      charKey = `t${cs.trust}|r${cs.relationshipStatus}|k${cs.knowledgeFlags.size}`
    } else {
      charKey = 'missing_char'
    }
  }

  return `${nodeId}|${characterId ?? 'unknown'}|${patternKey}|${flagsKey}|${charKey}`
}

function isTerminalLike(node: DialogueNode): boolean {
  if (node.simulation) return true
  if (node.metadata?.sessionBoundary) return true
  const tags = node.tags || []
  if (tags.includes('terminal')) return true
  return false
}

function getEnabledChoiceIds(node: DialogueNode, state: GameState, characterId: string): string[] {
  const out: string[] = []
  for (const c of node.choices || []) {
    const visible = StateConditionEvaluator.evaluate(c.visibleCondition, state, characterId, state.skillLevels)
    if (!visible) continue
    const enabled = StateConditionEvaluator.evaluate(c.enabledCondition, state, characterId, state.skillLevels)
    if (enabled) out.push(c.choiceId)
  }
  return out
}

function applyChoice(state: GameState, node: DialogueNode, choiceId: string): GameState | null {
  const choice = node.choices.find(c => c.choiceId === choiceId)
  if (!choice) return null

  let s: GameState = state
  if (choice.consequence) {
    s = GameStateUtils.applyStateChange(s, choice.consequence)
  }
  if (choice.pattern) {
    s = GameStateUtils.applyStateChange(s, { patternChanges: { [choice.pattern]: 1 } })
  }

  // Keep these in sync for better diagnostics; condition evaluation doesn't depend on them.
  s.currentNodeId = choice.nextNodeId
  return s
}

function applyOnEnter(state: GameState, node: DialogueNode): GameState {
  let s: GameState = state
  if (node.onEnter) {
    for (const change of node.onEnter) {
      s = GameStateUtils.applyStateChange(s, change)
    }
  }
  return s
}

/**
 * Bounded, deterministic BFS. Designed for CI: catches early-game flow breakers
 * without Playwright by simulating enabled choices and state mutations.
 */
export function simulateCriticalPath(
  initialState: GameState,
  options: CriticalPathSimOptions,
): { violations: SimViolation[] } {
  const violations: SimViolation[] = []

  const queue: Array<{
    nodeId: string
    state: GameState
    trace: Array<{ node_id: string; choice_id?: string }>
    depth: number
  }> = [{ nodeId: options.start_node_id, state: initialState, trace: [{ node_id: options.start_node_id }], depth: 0 }]

  const visited = new Set<string>()
  let expanded = 0

  while (queue.length > 0) {
    const item = queue.shift()!
    if (item.depth > options.max_steps) continue
    if (expanded >= options.max_states) break

    const search = findCharacterForNode(item.nodeId, item.state)
    if (!search) {
      violations.push({
        type: 'missing_node',
        node_id: item.nodeId,
        character_id: null,
        details: `Could not find node "${item.nodeId}" in any graph.`,
        trace: item.trace,
      })
      continue
    }

    const characterId = search.characterId
    const node = search.graph.nodes.get(item.nodeId)
    if (!node) {
      violations.push({
        type: 'missing_node',
        node_id: item.nodeId,
        character_id: characterId,
        details: `Node "${item.nodeId}" not found in ${characterId} graph.`,
        trace: item.trace,
      })
      continue
    }

    const key = summarizeStateKey(item.nodeId, item.state, characterId)
    if (visited.has(key)) continue
    visited.add(key)
    expanded++

    // Strict-mode check: requiredState must hold at the point of entry (pre-onEnter).
    if (node.requiredState) {
      const ok = StateConditionEvaluator.evaluate(node.requiredState, item.state, characterId, item.state.skillLevels)
      if (!ok) {
        violations.push({
          type: 'required_state_violation',
          node_id: node.nodeId,
          character_id: characterId,
          details: 'requiredState not satisfied at entry (strict-mode).',
          trace: item.trace,
        })
        // Still continue exploring in permissive mode so we can collect more issues in one run.
      }
    }

    const enteredState = applyOnEnter(item.state, node)

    if (node.choices && node.choices.length > 0) {
      const enabledChoiceIds = getEnabledChoiceIds(node, enteredState, characterId)
      if (enabledChoiceIds.length === 0 && !isTerminalLike(node)) {
        violations.push({
          type: 'soft_deadlock',
          node_id: node.nodeId,
          character_id: characterId,
          details: `Node has ${node.choices.length} choice(s), but none are visible+enabled under simulated state.`,
          trace: item.trace,
        })
      }

      for (const choiceId of enabledChoiceIds) {
        const nextState = applyChoice(enteredState, node, choiceId)
        if (!nextState) continue
        const nextNodeId = node.choices.find(c => c.choiceId === choiceId)!.nextNodeId

        queue.push({
          nodeId: nextNodeId,
          state: nextState,
          trace: [...item.trace, { node_id: nextNodeId, choice_id: choiceId }],
          depth: item.depth + 1,
        })
      }
    }
  }

  return { violations }
}

