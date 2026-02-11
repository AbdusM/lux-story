import type { GameState } from '@/lib/character-state'
import { GameStateUtils } from '@/lib/character-state'
import { StateConditionEvaluator } from '@/lib/dialogue-graph'
import { findCharacterForNode } from '@/lib/graph-registry'

export type ReachabilitySimOptions = {
  start_node_id: string
  max_steps: number
  max_states: number
  strategy?: 'bfs' | 'dfs'
  max_unique_states_per_node?: number
}

export type ReachabilitySimResult = {
  expanded_states: number
  hit_max_states: boolean
  visited_node_ids: string[]
  visited_by_character: Record<string, number>
}

function fnv1a32(str: string, hash = 0x811c9dc5): number {
  let h = hash >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

function hashSortedStrings(values: string[]): string {
  let h = 0x811c9dc5
  for (const v of values) {
    h = fnv1a32(v, h)
    h = fnv1a32('\0', h)
  }
  return (h >>> 0).toString(16)
}

function summarizeStateKey(nodeId: string, state: GameState, characterId: string | null): string {
  const patterns = state.patterns
  const patternKey = `${patterns.analytical},${patterns.helping},${patterns.building},${patterns.patience},${patterns.exploring}`
  const flags = Array.from(state.globalFlags).sort()
  const flagsKey = `${flags.length}:${hashSortedStrings(flags)}`
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

function getEnabledChoiceIds(node: { choices?: any[] }, state: GameState, characterId: string): string[] {
  const orbFillLevels = getOrbFillLevels(state)
  const snaps = (node.choices || []).map((c) => {
    const visible = StateConditionEvaluator.evaluate(c.visibleCondition, state, characterId, state.skillLevels)
    const enabledByCondition = visible && StateConditionEvaluator.evaluate(c.enabledCondition, state, characterId, state.skillLevels)
    const orbLocked = visible && enabledByCondition ? isOrbLocked(c, orbFillLevels) : false
    return { choice_id: c.choiceId as string, visible, enabled: enabledByCondition, orb_locked: orbLocked }
  })

  // Mercy unlock: if *all visible+enabled* choices are orb-locked, allow the easiest one.
  const candidates = snaps.filter(r => r.visible && r.enabled)
  const allLocked = candidates.length > 0 && candidates.every(r => r.orb_locked)
  if (allLocked) {
    let bestChoiceId: string | null = null
    let bestThreshold = Infinity
    for (const r of candidates) {
      const c = (node.choices || []).find(x => x.choiceId === r.choice_id)
      const thr = c?.requiredOrbFill?.threshold ?? 0
      if (thr < bestThreshold) {
        bestThreshold = thr
        bestChoiceId = r.choice_id
      }
    }
    return candidates.map(r => (r.choice_id === bestChoiceId ? { ...r, orb_locked: false } : r))
      .filter(s => s.visible && s.enabled && !s.orb_locked)
      .map(s => s.choice_id)
  }

  return snaps.filter(s => s.visible && s.enabled && !s.orb_locked).map(s => s.choice_id)
}

function applyChoice(state: GameState, node: any, choiceId: string): GameState | null {
  const choice = (node.choices || []).find((c: any) => c.choiceId === choiceId)
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
    const b = s.orbs?.balance
    const pattern = String(choice.pattern)
    if (b && isOrbKey(pattern)) {
      const prev = b[pattern]
      const next = Math.min(100, prev + 1)
      s = {
        ...s,
        orbs: {
          ...s.orbs,
          balance: {
            ...b,
            [pattern]: next,
            totalEarned: (b.totalEarned ?? 0) + 1,
          },
        },
      }
    }
  }

  return { ...s, currentNodeId: choice.nextNodeId }
}

function applyOnEnter(state: GameState, node: any): GameState {
  let s: GameState = state
  if (node.onEnter) {
    for (const change of node.onEnter) {
      s = GameStateUtils.applyStateChange(s, change)
    }
  }
  return s
}

function ensureCharacterState(state: GameState, characterId: string): GameState {
  if (state.characters.has(characterId)) return state
  const next = new Map(state.characters)
  next.set(characterId, GameStateUtils.createCharacterState(characterId))
  return { ...state, characters: next }
}

/**
 * Bounded, deterministic BFS/DFS that returns the visited node set.
 * This complements static ORPHAN_NODE detection with behavioral reachability.
 */
export function simulateReachability(
  initialState: GameState,
  options: ReachabilitySimOptions,
): ReachabilitySimResult {
  const strategy = options.strategy ?? 'bfs'
  const maxUniqueStatesPerNode = options.max_unique_states_per_node ?? 25

  const queue: Array<{ nodeId: string; state: GameState; depth: number }> = [
    { nodeId: options.start_node_id, state: initialState, depth: 0 }
  ]
  let queueHead = 0

  const visitedStateKeys = new Set<string>()
  const visitedNodeIds = new Set<string>()
  const visitedByCharacter: Record<string, number> = {}
  const uniqueStatesPerNode = new Map<string, number>()
  let expanded = 0
  let hitMaxStates = false

  while (strategy === 'dfs' ? queue.length > 0 : queueHead < queue.length) {
    const item = (strategy === 'dfs' ? queue.pop() : queue[queueHead++])!
    if (item.depth > options.max_steps) continue
    if (expanded >= options.max_states) {
      hitMaxStates = true
      break
    }

    const search = findCharacterForNode(item.nodeId, item.state)
    if (!search) continue

    const characterId = search.characterId
    const node = search.graph.nodes.get(item.nodeId)
    if (!node) continue

    const healedState = ensureCharacterState(item.state, characterId)

    const key = summarizeStateKey(item.nodeId, healedState, characterId)
    if (visitedStateKeys.has(key)) continue
    visitedStateKeys.add(key)
    expanded++

    const nodeBucket = `${characterId}:${item.nodeId}`
    const bucketCount = uniqueStatesPerNode.get(nodeBucket) ?? 0
    if (bucketCount >= maxUniqueStatesPerNode) continue
    uniqueStatesPerNode.set(nodeBucket, bucketCount + 1)

    visitedNodeIds.add(item.nodeId)
    visitedByCharacter[characterId] = (visitedByCharacter[characterId] ?? 0) + 1

    // Apply onEnter state mutations before evaluating choices.
    const enteredState = applyOnEnter(healedState, node)

    const enabledChoiceIds = getEnabledChoiceIds(node, enteredState, characterId)
    for (const choiceId of enabledChoiceIds) {
      const nextState = applyChoice(enteredState, node, choiceId)
      if (!nextState) continue
      const nextNodeId = node.choices.find((c: any) => c.choiceId === choiceId)!.nextNodeId
      queue.push({ nodeId: nextNodeId, state: nextState, depth: item.depth + 1 })
    }
  }

  return {
    expanded_states: expanded,
    hit_max_states: hitMaxStates,
    visited_node_ids: Array.from(visitedNodeIds).sort(),
    visited_by_character: visitedByCharacter,
  }
}
