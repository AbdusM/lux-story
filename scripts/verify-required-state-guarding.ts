#!/usr/bin/env npx tsx
/**
 * Required State Guarding Verification
 *
 * Produces a JSON report of nodes with requiredState that are not guarded
 * by any incoming choice conditions. Compares against a baseline and fails
 * only on regressions (new unguarded nodes).
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'
import type { DialogueNode } from '../lib/dialogue-graph'
import type { StateCondition } from '../lib/character-state'

type IncomingEdge = {
  fromGraph: string
  fromNodeId: string
  choiceId: string
  visibleCondition?: StateCondition
}

type UnguardedNode = {
  graphKey: string
  nodeId: string
  requiredState: StateCondition
  unguardedIncomingCount: number
  exampleIncoming: IncomingEdge | null
}

type Report = {
  generated_at: string
  totals: {
    graphs: number
    nodes_with_required_state: number
    unguarded_nodes: number
  }
  by_graph: Record<string, { required_state_nodes: number; unguarded_nodes: number }>
  unguarded: UnguardedNode[]
}

type Baseline = {
  generated_at: string
  nodes: Array<{ graphKey: string; nodeId: string }>
}

const DEFAULT_BASELINE_PATH = path.join(process.cwd(), 'docs/qa/required-state-guarding-baseline.json')
const DEFAULT_REPORT_PATH = path.join(process.cwd(), 'docs/qa/required-state-guarding-report.json')

const args = new Set(process.argv.slice(2))
const baselinePath = getArgValue('--baseline') ?? DEFAULT_BASELINE_PATH
const outputPath = getArgValue('--output') ?? DEFAULT_REPORT_PATH
const writeBaseline = args.has('--write-baseline') || args.has('--write')

function getArgValue(flag: string): string | null {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return null
  return process.argv[idx + 1] ?? null
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

function buildReport(): Report {
  const incoming = collectIncomingEdges()
  const startNodeIds = new Set(Object.values(DIALOGUE_GRAPHS).map(g => g.startNodeId))

  const byGraph: Record<string, { required_state_nodes: number; unguarded_nodes: number }> = {}
  const unguarded: UnguardedNode[] = []
  let totalRequired = 0

  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    let graphRequired = 0
    let graphUnguarded = 0

    for (const node of graph.nodes.values()) {
      if (!hasRequiredState(node)) continue
      if (startNodeIds.has(node.nodeId)) continue
      graphRequired++
      totalRequired++

      const edges = incoming.get(node.nodeId) ?? []
      if (edges.length === 0) continue

      const unguardedEdges = edges.filter(edge => !conditionGuards(node.requiredState, edge.visibleCondition))
      if (unguardedEdges.length > 0) {
        graphUnguarded++
        unguarded.push({
          graphKey,
          nodeId: node.nodeId,
          requiredState: node.requiredState,
          unguardedIncomingCount: unguardedEdges.length,
          exampleIncoming: unguardedEdges[0] ?? null,
        })
      }
    }

    byGraph[graphKey] = {
      required_state_nodes: graphRequired,
      unguarded_nodes: graphUnguarded,
    }
  }

  return {
    generated_at: new Date().toISOString(),
    totals: {
      graphs: Object.keys(DIALOGUE_GRAPHS).length,
      nodes_with_required_state: totalRequired,
      unguarded_nodes: unguarded.length,
    },
    by_graph: byGraph,
    unguarded,
  }
}

function readBaseline(p: string): Baseline | null {
  if (!fs.existsSync(p)) return null
  const raw = fs.readFileSync(p, 'utf-8')
  return JSON.parse(raw) as Baseline
}

function writeJson(p: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(payload, null, 2))
}

function summarizeTop(unguarded: UnguardedNode[]): void {
  const top = [...unguarded]
    .sort((a, b) => b.unguardedIncomingCount - a.unguardedIncomingCount)
    .slice(0, 10)

  console.log('\nRequiredState Guarding Summary')
  console.log(`Unguarded nodes: ${unguarded.length}`)
  for (const item of top) {
    console.log(`- ${item.graphKey}/${item.nodeId} (${item.unguardedIncomingCount} incoming)`)
    if (item.exampleIncoming) {
      console.log(`  example: ${item.exampleIncoming.fromGraph}/${item.exampleIncoming.fromNodeId}/${item.exampleIncoming.choiceId}`)
    }
  }
}

function toKey(graphKey: string, nodeId: string): string {
  return `${graphKey}/${nodeId}`
}

function compareToBaseline(current: Report, baseline: Baseline): { newOnes: string[] } {
  const baselineSet = new Set(baseline.nodes.map(n => toKey(n.graphKey, n.nodeId)))
  const currentSet = new Set(current.unguarded.map(n => toKey(n.graphKey, n.nodeId)))
  const newOnes = [...currentSet].filter(k => !baselineSet.has(k))
  return { newOnes }
}

function main(): void {
  const report = buildReport()
  writeJson(outputPath, report)

  if (writeBaseline) {
    const baseline: Baseline = {
      generated_at: report.generated_at,
      nodes: report.unguarded.map(u => ({ graphKey: u.graphKey, nodeId: u.nodeId })),
    }
    writeJson(baselinePath, baseline)
    console.log(`Wrote baseline: ${baselinePath}`)
    summarizeTop(report.unguarded)
    return
  }

  const baseline = readBaseline(baselinePath)
  if (!baseline) {
    console.error(`Baseline not found: ${baselinePath}`)
    console.error('Run with --write-baseline to create one.')
    process.exit(1)
  }

  const { newOnes } = compareToBaseline(report, baseline)
  summarizeTop(report.unguarded)

  if (newOnes.length > 0) {
    console.error('\nRegression detected: new unguarded requiredState nodes')
    for (const k of newOnes.slice(0, 25)) {
      console.error(`- ${k}`)
    }
    if (newOnes.length > 25) {
      console.error(`... and ${newOnes.length - 25} more`)
    }
    process.exit(1)
  }

  console.log('\nNo regressions vs baseline.')
}

main()

