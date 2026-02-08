#!/usr/bin/env npx tsx
/**
 * Required State Strict Verification
 *
 * Purpose (AAA-style two-lane rollout):
 * - Production runtime currently does not hard-enforce `requiredState` during navigation.
 * - This script simulates navigation and reports where we *arrive* at a node whose
 *   `requiredState` is not satisfied ("strict-mode violation").
 *
 * CI behavior: compares against a baseline and fails only on regressions (new violations).
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS, type CharacterId } from '../lib/graph-registry'
import { GameStateUtils, type GameState } from '../lib/character-state'
import { type DialogueNode, StateConditionEvaluator } from '../lib/dialogue-graph'
import { isComboUnlocked as isPatternComboUnlocked } from '../lib/pattern-combos'

const DEFAULT_BASELINE_PATH = path.join(process.cwd(), 'docs/qa/required-state-strict-baseline.json')
const DEFAULT_REPORT_PATH = path.join(process.cwd(), 'docs/qa/required-state-strict-report.json')

const VIRTUAL_NODE_IDS = new Set(['TRAVEL_PENDING', 'SIMULATION_PENDING', 'LOYALTY_PENDING'])

const args = new Set(process.argv.slice(2))
const baselinePath = getArgValue('--baseline') ?? DEFAULT_BASELINE_PATH
const outputPath = getArgValue('--output') ?? DEFAULT_REPORT_PATH
const writeBaseline = args.has('--write-baseline') || args.has('--write')

// Keep runtime bounded.
const MAX_STEPS_PER_PATH = 120
const MAX_EXPANSIONS_PER_GRAPH = 6000
const MAX_STATES_PER_NODE = 40

type Baseline = {
  generated_at: string
  nodes: Array<{ graphKey: string; nodeId: string }>
}

type Violation = {
  graphKey: string
  nodeId: string
  targetCharacterId: string
  requiredState: unknown
  missing: Record<string, unknown>
  exampleTrace: Array<{ nodeId: string; choiceId: string; nextNodeId: string }>
}

type Report = {
  generated_at: string
  totals: {
    graphs: number
    violations: number
  }
  violations: Violation[]
}

function getArgValue(flag: string): string | null {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return null
  return process.argv[idx + 1] ?? null
}

function baseCharacterIdForGraphKey(graphKey: string): string {
  return graphKey.replace(/_revisit$/, '')
}

function ensureRevisitEntryState(graphKey: string, graphStartNode: DialogueNode, state: GameState): void {
  if (!graphKey.endsWith('_revisit')) return

  const baseCharId = baseCharacterIdForGraphKey(graphKey)
  state.globalFlags.add(`${baseCharId}_arc_complete`)

  const charState = state.characters.get(baseCharId)
  if (!charState) return

  // Seed one representative knowledge flag used by the entry node so the graph is traversable.
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

  // Cheap stable hash of a stable JSON string.
  const s = JSON.stringify(payload)
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

function describeMissingRequiredState(
  requiredState: DialogueNode['requiredState'] | undefined,
  gameState: GameState,
  characterId: string,
): Record<string, unknown> {
  const required = requiredState ?? {}
  const charState = gameState.characters.get(characterId)

  const missing: Record<string, unknown> = {}

  if (required.trust) {
    const currentTrust = charState?.trust ?? 0
    const min = required.trust.min
    const max = required.trust.max
    if ((min !== undefined && currentTrust < min) || (max !== undefined && currentTrust > max)) {
      missing.trust = { current: currentTrust, required: required.trust }
    }
  }

  if (required.hasGlobalFlags?.length) {
    const absent = required.hasGlobalFlags.filter(f => !gameState.globalFlags.has(f))
    if (absent.length) missing.hasGlobalFlags = absent
  }
  if (required.lacksGlobalFlags?.length) {
    const present = required.lacksGlobalFlags.filter(f => gameState.globalFlags.has(f))
    if (present.length) missing.lacksGlobalFlags = present
  }

  if (required.hasKnowledgeFlags?.length) {
    const absent = required.hasKnowledgeFlags.filter(f => !charState?.knowledgeFlags?.has(f))
    if (absent.length) missing.hasKnowledgeFlags = absent
  }
  if (required.lacksKnowledgeFlags?.length) {
    const present = required.lacksKnowledgeFlags.filter(f => charState?.knowledgeFlags?.has(f))
    if (present.length) missing.lacksKnowledgeFlags = present
  }

  if (required.patterns) {
    const unmet: Record<string, unknown> = {}
    for (const [pattern, range] of Object.entries(required.patterns)) {
      const current = gameState.patterns[pattern as keyof typeof gameState.patterns]
      if (!range) continue
      if (range.min !== undefined && current < range.min) {
        unmet[pattern] = { current, required: range }
      } else if (range.max !== undefined && current > range.max) {
        unmet[pattern] = { current, required: range }
      }
    }
    if (Object.keys(unmet).length) missing.patterns = unmet
  }

  if (required.mysteries) {
    const unmet: Record<string, unknown> = {}
    for (const [key, requiredValue] of Object.entries(required.mysteries)) {
      const current = gameState.mysteries[key as keyof typeof gameState.mysteries]
      if (current !== requiredValue) {
        unmet[key] = { current, required: requiredValue }
      }
    }
    if (Object.keys(unmet).length) missing.mysteries = unmet
  }

  if (required.requiredCombos?.length) {
    const absent = required.requiredCombos.filter(comboId => !isPatternComboUnlocked(comboId, gameState.patterns))
    if (absent.length) missing.requiredCombos = absent
  }

  return missing
}

function toKey(graphKey: string, nodeId: string): string {
  return `${graphKey}/${nodeId}`
}

function readBaseline(p: string): Baseline | null {
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as Baseline
}

function writeJson(p: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(payload, null, 2))
}

function compareToBaseline(current: Report, baseline: Baseline): { newOnes: string[] } {
  const baselineSet = new Set(baseline.nodes.map(n => toKey(n.graphKey, n.nodeId)))
  const currentSet = new Set(current.violations.map(v => toKey(v.graphKey, v.nodeId)))
  const newOnes = [...currentSet].filter(k => !baselineSet.has(k))
  return { newOnes }
}

function buildReport(): Report {
  const violations = new Map<string, Violation>()

  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    const baseCharId = baseCharacterIdForGraphKey(graphKey)

    let state = GameStateUtils.createNewGameState('required-state-strict')
    const startNode = graph.nodes.get(graph.startNodeId) as DialogueNode | undefined
    if (!startNode) continue

    ensureRevisitEntryState(graphKey, startNode, state)

    type QItem = {
      nodeId: string
      state: GameState
      trace: Array<{ nodeId: string; choiceId: string; nextNodeId: string }>
      steps: number
    }

    const queue: QItem[] = [{ nodeId: graph.startNodeId, state, trace: [], steps: 0 }]

    const visited = new Set<string>()
    const perNodeStateCount = new Map<string, number>()

    let expansions = 0

    while (queue.length > 0) {
      const item = queue.shift()!
      if (item.steps > MAX_STEPS_PER_PATH) continue
      if (VIRTUAL_NODE_IDS.has(item.nodeId)) continue

      const node = graph.nodes.get(item.nodeId) as DialogueNode | undefined
      if (!node) continue

      const requiredOk = StateConditionEvaluator.evaluate(node.requiredState, item.state, baseCharId, item.state.skillLevels)
      if (!requiredOk) {
        const k = toKey(graphKey, node.nodeId)
        if (!violations.has(k)) {
          violations.set(k, {
            graphKey,
            nodeId: node.nodeId,
            targetCharacterId: baseCharId,
            requiredState: node.requiredState ?? {},
            missing: describeMissingRequiredState(node.requiredState, item.state, baseCharId),
            exampleTrace: item.trace,
          })
        }
        continue
      }

      let nextState = applyStateChanges(item.state, node.onEnter)

      // Evaluate visible+enabled choices without relying on auto-fallback.
      const choices = (node.choices ?? [])
        .filter(choice => {
          const visible = StateConditionEvaluator.evaluate(choice.visibleCondition, nextState, baseCharId, nextState.skillLevels)
          if (!visible) return false
          const enabled = StateConditionEvaluator.evaluate(choice.enabledCondition, nextState, baseCharId, nextState.skillLevels)
          return enabled
        })
        .slice()
        .sort((a, b) => a.choiceId.localeCompare(b.choiceId))

      for (const choice of choices) {
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

        if (++expansions > MAX_EXPANSIONS_PER_GRAPH) break
      }

      if (expansions > MAX_EXPANSIONS_PER_GRAPH) break
    }
  }

  const violationList = [...violations.values()].sort((a, b) => {
    const ak = toKey(a.graphKey, a.nodeId)
    const bk = toKey(b.graphKey, b.nodeId)
    return ak.localeCompare(bk)
  })

  return {
    generated_at: new Date().toISOString(),
    totals: {
      graphs: Object.keys(DIALOGUE_GRAPHS).length,
      violations: violationList.length,
    },
    violations: violationList,
  }
}

function main(): void {
  const report = buildReport()
  writeJson(outputPath, report)

  if (writeBaseline) {
    const baseline: Baseline = {
      generated_at: report.generated_at,
      nodes: report.violations.map(v => ({ graphKey: v.graphKey, nodeId: v.nodeId })),
    }
    writeJson(baselinePath, baseline)
    console.log(`Wrote baseline: ${baselinePath}`)
    console.log(`Violations: ${report.totals.violations}`)
    return
  }

  const baseline = readBaseline(baselinePath)
  if (!baseline) {
    console.error(`Missing baseline: ${baselinePath}`)
    console.error('Run with --write-baseline to establish the current debt snapshot.')
    process.exit(2)
  }

  const { newOnes } = compareToBaseline(report, baseline)
  if (newOnes.length > 0) {
    console.error('\nRequiredState Strict Regression')
    console.error(`New violations: ${newOnes.length}`)
    for (const k of newOnes.slice(0, 20)) {
      console.error(`- ${k}`)
    }
    if (newOnes.length > 20) {
      console.error(`... and ${newOnes.length - 20} more`)
    }
    process.exit(1)
  }

  console.log(`RequiredState strict check OK (violations=${report.totals.violations}, no regressions).`)
}

main()

