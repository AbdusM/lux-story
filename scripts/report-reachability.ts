#!/usr/bin/env node
/* eslint-disable no-console */

import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { GameStateUtils } from '@/lib/character-state'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import { simulateReachability } from '@/lib/validators/reachability-sim'

type Warning = {
  warning_id: string
  code: string
  graph?: string
  nodeId?: string
  message?: string
}

type ReportGraphRow = {
  graph: string
  start_node_id: string
  total_nodes: number
  structural_orphan_node_ids: string[]
  fixtures: Array<{
    fixture: string
    max_steps: number
    max_states: number
    max_unique_states_per_node: number
    expanded_states: number
    hit_max_states: boolean
    reachable_count: number
    behavioral_unreachable_with_inbound_count: number
    behavioral_unreachable_with_inbound_sample: string[]
  }>
}

function readArg(name: string): string | null {
  const ix = process.argv.indexOf(name)
  if (ix < 0) return null
  return process.argv[ix + 1] ?? null
}

const qaDir = join(process.cwd(), 'docs', 'qa')
mkdirSync(qaDir, { recursive: true })

const outPath = readArg('--out') ?? join(qaDir, 'reachability.report.json')
const warningsPath = readArg('--warnings') ?? join(qaDir, 'dialogue-graph-warnings.report.json')

const fixtures = (readArg('--fixtures')?.split(',') ?? ['baseline_early_game_v1', 'baseline_midgame_v1']).filter(Boolean)
const maxSteps = Number(readArg('--max-steps') ?? 30)
const maxStates = Number(readArg('--max-states') ?? 8000)
const maxUniqueStatesPerNode = Number(readArg('--max-unique-states-per-node') ?? 25)

const warnings: Warning[] = (() => {
  try {
    const parsed = JSON.parse(readFileSync(warningsPath, 'utf8'))
    return Array.isArray(parsed?.warnings) ? parsed.warnings : []
  } catch {
    return []
  }
})()

const structuralOrphansByGraph = new Map<string, string[]>()
for (const w of warnings) {
  if (w.code !== 'ORPHAN_NODE') continue
  const g = w.graph
  const nodeId = w.nodeId
  if (!g || !nodeId) continue
  const arr = structuralOrphansByGraph.get(g) ?? []
  arr.push(nodeId)
  structuralOrphansByGraph.set(g, arr)
}
for (const [g, arr] of structuralOrphansByGraph.entries()) {
  structuralOrphansByGraph.set(g, Array.from(new Set(arr)).sort())
}

function inboundCountsForGraph(graphKey: string): Map<string, number> {
  const graph = (DIALOGUE_GRAPHS as any)[graphKey]
  const inb = new Map<string, number>()
  if (!graph) return inb

  for (const node of graph.nodes.values()) {
    for (const c of node.choices || []) {
      const next = c.nextNodeId
      if (typeof next === 'string') {
        inb.set(next, (inb.get(next) ?? 0) + 1)
      }
    }
    for (const content of node.content || []) {
      const next = content?.interrupt?.targetNodeId
      if (typeof next === 'string') {
        inb.set(next, (inb.get(next) ?? 0) + 1)
      }
    }
  }
  return inb
}

const rows: ReportGraphRow[] = []

for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
  // Skip non-production/variant keys that aren’t useful for reachability paydown.
  if (graphKey.endsWith('_revisit')) continue

  const inbound = inboundCountsForGraph(graphKey)
  const totalNodes = graph.nodes.size
  const structuralOrphans = structuralOrphansByGraph.get(graphKey) ?? []

  const perFixture = fixtures.map((fixture) => {
    const s = GameStateUtils.createNewGameState(fixture)
    const result = simulateReachability(s, {
      start_node_id: graph.startNodeId,
      max_steps: maxSteps,
      max_states: maxStates,
      max_unique_states_per_node: maxUniqueStatesPerNode,
    })

    const reachable = new Set(result.visited_node_ids.filter((id) => graph.nodes.has(id)))
    const behavioralUnreachableWithInbound = Array.from(graph.nodes.keys())
      .filter((id) => !reachable.has(id))
      .filter((id) => (inbound.get(id) ?? 0) > 0)
      .sort()

    return {
      fixture,
      max_steps: maxSteps,
      max_states: maxStates,
      max_unique_states_per_node: maxUniqueStatesPerNode,
      expanded_states: result.expanded_states,
      hit_max_states: result.hit_max_states,
      reachable_count: reachable.size,
      behavioral_unreachable_with_inbound_count: behavioralUnreachableWithInbound.length,
      behavioral_unreachable_with_inbound_sample: behavioralUnreachableWithInbound.slice(0, 50),
    }
  })

  rows.push({
    graph: graphKey,
    start_node_id: graph.startNodeId,
    total_nodes: totalNodes,
    structural_orphan_node_ids: structuralOrphans,
    fixtures: perFixture,
  })
}

rows.sort((a, b) => {
  const aAny = a.fixtures.reduce((m, f) => Math.max(m, f.behavioral_unreachable_with_inbound_count), 0)
  const bAny = b.fixtures.reduce((m, f) => Math.max(m, f.behavioral_unreachable_with_inbound_count), 0)
  return bAny - aAny
})

const report = {
  version: 1,
  generated_at: new Date().toISOString(),
  warnings_source: warningsPath,
  fixtures,
  graphs: rows,
}

writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n', 'utf8')

const worst = rows.slice(0, 5).map((r) => {
  const maxUn = r.fixtures.reduce((m, f) => Math.max(m, f.behavioral_unreachable_with_inbound_count), 0)
  return `${r.graph}:${maxUn}`
}).join(', ')

console.log(`[reachability] graphs=${rows.length}`)
console.log(`[reachability] out=${outPath}`)
console.log(`[reachability] worst=${worst}`)
