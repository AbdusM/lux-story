import type { GameState } from '@/lib/character-state'
import { GameStateUtils } from '@/lib/character-state'
import type { DialogueNode } from '@/lib/dialogue-graph'
import { StateConditionEvaluator } from '@/lib/dialogue-graph'
import { deriveDisabledReason } from '@/lib/disabled-reasons'
import { findCharacterForNode } from '@/lib/graph-registry'

export type SimViolationType = 'required_state_violation' | 'soft_deadlock' | 'missing_node'

export type SimChoiceSnapshot = {
  choice_id: string
  next_node_id: string
  text: string
  visible: boolean
  enabled: boolean
  orb_locked: boolean
  disabled_reason_code?: string
  disabled_reason?: string
  hidden_reason_code?: string
  hidden_reason?: string
}

export type SimViolation = {
  type: SimViolationType
  node_id: string
  character_id: string | null
  details: string
  trace: Array<{ node_id: string; choice_id?: string }>
  choice_snapshot?: SimChoiceSnapshot[]
  required_state?: unknown
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
  const orbs = state.orbs?.balance
  const orbKey = orbs
    ? `${orbs.analytical},${orbs.helping},${orbs.building},${orbs.patience},${orbs.exploring},t${orbs.totalEarned}`
    : 'no_orbs'

  let charKey = ''
  if (characterId) {
    const cs = state.characters.get(characterId)
    if (cs) {
      charKey = `t${cs.trust}|r${cs.relationshipStatus}|k${cs.knowledgeFlags.size}`
    } else {
      charKey = 'missing_char'
    }
  }

  return `${nodeId}|${characterId ?? 'unknown'}|${patternKey}|${flagsKey}|${orbKey}|${charKey}`
}

function isTerminalLike(node: DialogueNode): boolean {
  if (node.simulation) return true
  if (node.metadata?.sessionBoundary) return true
  const tags = node.tags || []
  if (tags.includes('terminal')) return true
  return false
}

function getOrbFillLevels(state: GameState): Record<string, number> {
  const MAX_ORB_COUNT = 100
  const b = state.orbs?.balance
  if (!b) return {}
  return {
    analytical: Math.min(100, Math.round((b.analytical / MAX_ORB_COUNT) * 100)),
    patience: Math.min(100, Math.round((b.patience / MAX_ORB_COUNT) * 100)),
    exploring: Math.min(100, Math.round((b.exploring / MAX_ORB_COUNT) * 100)),
    helping: Math.min(100, Math.round((b.helping / MAX_ORB_COUNT) * 100)),
    building: Math.min(100, Math.round((b.building / MAX_ORB_COUNT) * 100)),
  }
}

function isOrbLocked(choice: { requiredOrbFill?: { pattern: string; threshold: number } }, orbFillLevels: Record<string, number>): boolean {
  const req = choice.requiredOrbFill
  if (!req) return false
  const current = orbFillLevels[req.pattern] ?? 0
  return current < req.threshold
}

function snapshotChoices(node: DialogueNode, state: GameState, characterId: string): SimChoiceSnapshot[] {
  const orbFillLevels = getOrbFillLevels(state)
  const raw = (node.choices || []).map((c) => {
    const visible = StateConditionEvaluator.evaluate(c.visibleCondition, state, characterId, state.skillLevels)
    const enabledByCondition = visible && StateConditionEvaluator.evaluate(c.enabledCondition, state, characterId, state.skillLevels)
    const orbLocked = visible && enabledByCondition ? isOrbLocked(c, orbFillLevels) : false

    const snap: SimChoiceSnapshot = {
      choice_id: c.choiceId,
      next_node_id: c.nextNodeId,
      text: c.text,
      visible,
      enabled: enabledByCondition,
      orb_locked: orbLocked,
    }

    if (visible && !enabledByCondition) {
      const d = deriveDisabledReason(c.enabledCondition, state, characterId)
      snap.disabled_reason_code = d.code
      snap.disabled_reason = d.message
    }
    if (!visible) {
      const d = deriveDisabledReason(c.visibleCondition, state, characterId)
      snap.hidden_reason_code = d.code
      snap.hidden_reason = d.message
    }

    return snap
  })

  // Mercy unlock: if *all visible+enabled* choices are orb-locked, allow the easiest one.
  const candidates = raw.filter(r => r.visible && r.enabled)
  const allLocked = candidates.length > 0 && candidates.every(r => r.orb_locked)
  if (allLocked) {
    // Choose the smallest threshold among requiredOrbFill.
    let best: SimChoiceSnapshot | null = null
    for (const r of candidates) {
      const choice = node.choices.find(c => c.choiceId === r.choice_id)
      const thr = choice?.requiredOrbFill?.threshold ?? 0
      if (!best) {
        best = r
        continue
      }
      const bestChoice = node.choices.find(c => c.choiceId === best!.choice_id)
      const bestThr = bestChoice?.requiredOrbFill?.threshold ?? 0
      if (thr < bestThr) best = r
    }
    if (best) best.orb_locked = false
  }

  return raw
}

function getEnabledChoiceIds(node: DialogueNode, state: GameState, characterId: string): string[] {
  const snaps = snapshotChoices(node, state, characterId)
  return snaps.filter(s => s.visible && s.enabled && !s.orb_locked).map(s => s.choice_id)
}

function applyChoice(state: GameState, node: DialogueNode, choiceId: string): GameState | null {
  const choice = node.choices.find(c => c.choiceId === choiceId)
  if (!choice) return null

  const ORB_KEYS = ['analytical', 'helping', 'building', 'patience', 'exploring'] as const
  type OrbKey = typeof ORB_KEYS[number]
  const isOrbKey = (p: string): p is OrbKey => (ORB_KEYS as readonly string[]).includes(p)

  let s: GameState = state
  if (choice.consequence) {
    s = GameStateUtils.applyStateChange(s, choice.consequence)
  }
  if (choice.pattern) {
    s = GameStateUtils.applyStateChange(s, { patternChanges: { [choice.pattern]: 1 } })

    // Approximate orb economy: pattern-aligned choices typically award an orb.
    // This keeps simulations aligned with orb-gated UI locks.
    const b = s.orbs?.balance
    if (b && isOrbKey(choice.pattern)) {
      const prev = b[choice.pattern]
      const next = Math.min(100, prev + 1)
      s = {
        ...s,
        orbs: {
          ...s.orbs,
          balance: {
            ...b,
            [choice.pattern]: next,
            totalEarned: (b.totalEarned ?? 0) + 1,
          },
        },
      }
    }
  }

  // Keep these in sync for better diagnostics; condition evaluation doesn't depend on them.
  return { ...s, currentNodeId: choice.nextNodeId }
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
          required_state: node.requiredState,
        })
        // Still continue exploring in permissive mode so we can collect more issues in one run.
      }
    }

    const enteredState = applyOnEnter(item.state, node)

    if (node.choices && node.choices.length > 0) {
      const enabledChoiceIds = getEnabledChoiceIds(node, enteredState, characterId)
      if (enabledChoiceIds.length === 0 && !isTerminalLike(node)) {
        const snap = snapshotChoices(node, enteredState, characterId)
        violations.push({
          type: 'soft_deadlock',
          node_id: node.nodeId,
          character_id: characterId,
          details: `Node has ${node.choices.length} choice(s), but none are visible+enabled under simulated state.`,
          trace: item.trace,
          choice_snapshot: snap,
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
