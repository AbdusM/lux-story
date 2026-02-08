#!/usr/bin/env npx tsx
/**
 * Unreachable Dialogue Nodes Verification
 *
 * Purpose (AAA content-as-code gate):
 * - Identify nodes that are structurally unreachable within their own graph,
 *   when starting from:
 *   - graph.startNodeId
 *   - any known entry nodes that exist in that graph (mounted by routing)
 *
 * Edges considered:
 * - choice.nextNodeId (in-graph)
 * - content.interrupt.targetNodeId / missedNodeId (in-graph)
 *
 * CI behavior: compares against a baseline and fails only on regressions (new unreachable nodes).
 *
 * Note: This is structural reachability only (ignores requiredState/conditions).
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'

import { samuelEntryPoints } from '../content/samuel-dialogue-graph'
import { samuelWaitingEntryPoints } from '../content/samuel-waiting-dialogue'
import { mayaEntryPoints } from '../content/maya-dialogue-graph'
import { devonEntryPoints } from '../content/devon-dialogue-graph'
import { jordanEntryPoints } from '../content/jordan-dialogue-graph'
import { kaiEntryPoints } from '../content/kai-dialogue-graph'
import { silasEntryPoints } from '../content/silas-dialogue-graph'
import { marcusEntryPoints } from '../content/marcus-dialogue-graph'
import { tessEntryPoints } from '../content/tess-dialogue-graph'
import { rohanEntryPoints } from '../content/rohan-dialogue-graph'
import { yaquinEntryPoints } from '../content/yaquin-dialogue-graph'
import { alexEntryPoints } from '../content/alex-dialogue-graph'
import { graceEntryPoints } from '../content/grace-dialogue-graph'
import { elenaEntryPoints } from '../content/elena-dialogue-graph'
import { zaraEntryPoints } from '../content/zara-dialogue-graph'
import { ashaEntryPoints } from '../content/asha-dialogue-graph'
import { liraEntryPoints } from '../content/lira-dialogue-graph'
import { quinnEntryPoints } from '../content/quinn-dialogue-graph'
import { danteEntryPoints } from '../content/dante-dialogue-graph'
import { nadiaEntryPoints } from '../content/nadia-dialogue-graph'
import { isaiahEntryPoints } from '../content/isaiah-dialogue-graph'

import { mayaRevisitEntryPoints } from '../content/maya-revisit-graph'
import { yaquinRevisitEntryPoints } from '../content/yaquin-revisit-graph'
import { devonRevisitEntryPoints } from '../content/devon-revisit-graph'
import { graceRevisitEntryPoints } from '../content/grace-revisit-graph'

type Baseline = {
  generated_at: string
  nodes: Array<{ graphKey: string; nodeId: string }>
}

type UnreachableNode = {
  graphKey: string
  nodeId: string
}

type Report = {
  generated_at: string
  totals: {
    graphs: number
    nodes: number
    unreachable: number
  }
  by_graph: Record<string, { nodes: number; roots: number; reachable: number; unreachable: number }>
  unreachable: UnreachableNode[]
}

const DEFAULT_BASELINE_PATH = path.join(process.cwd(), 'docs/qa/unreachable-dialogue-nodes-baseline.json')
const DEFAULT_REPORT_PATH = path.join(process.cwd(), 'docs/qa/unreachable-dialogue-nodes-report.json')

const args = new Set(process.argv.slice(2))
const baselinePath = getArgValue('--baseline') ?? DEFAULT_BASELINE_PATH
const outputPath = getArgValue('--output') ?? DEFAULT_REPORT_PATH
const writeBaseline = args.has('--write-baseline') || args.has('--write')

function getArgValue(flag: string): string | null {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return null
  return process.argv[idx + 1] ?? null
}

const KNOWN_ENTRY_NODE_IDS = new Set<string>([
  ...Object.values(samuelEntryPoints),
  ...Object.values(samuelWaitingEntryPoints),
  ...Object.values(mayaEntryPoints),
  ...Object.values(mayaRevisitEntryPoints),
  ...Object.values(devonEntryPoints),
  ...Object.values(devonRevisitEntryPoints),
  ...Object.values(jordanEntryPoints),
  ...Object.values(marcusEntryPoints),
  ...Object.values(tessEntryPoints),
  ...Object.values(yaquinEntryPoints),
  ...Object.values(yaquinRevisitEntryPoints),
  ...Object.values(kaiEntryPoints),
  ...Object.values(rohanEntryPoints),
  ...Object.values(silasEntryPoints),
  ...Object.values(alexEntryPoints),
  ...Object.values(elenaEntryPoints),
  ...Object.values(graceEntryPoints),
  ...Object.values(graceRevisitEntryPoints),
  ...Object.values(ashaEntryPoints),
  ...Object.values(liraEntryPoints),
  ...Object.values(zaraEntryPoints),
  ...Object.values(quinnEntryPoints),
  ...Object.values(danteEntryPoints),
  ...Object.values(nadiaEntryPoints),
  ...Object.values(isaiahEntryPoints),
])

function toKey(graphKey: string, nodeId: string): string {
  return `${graphKey}/${nodeId}`
}

function writeJson(p: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(payload, null, 2))
}

function readBaseline(p: string): Baseline | null {
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as Baseline
}

function inGraphRoots(graphKey: string, graph: any): string[] {
  const roots: string[] = []
  if (graph.startNodeId && graph.nodes.has(graph.startNodeId)) roots.push(graph.startNodeId)
  for (const entryId of KNOWN_ENTRY_NODE_IDS) {
    if (graph.nodes.has(entryId)) roots.push(entryId)
  }
  // Deduplicate but keep stable-ish ordering.
  return Array.from(new Set(roots))
}

function bfsReachable(graph: any, roots: string[]): Set<string> {
  const reachable = new Set<string>()
  const queue = [...roots]

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    if (reachable.has(nodeId)) continue

    const node = graph.nodes.get(nodeId)
    if (!node) continue

    reachable.add(nodeId)

    for (const choice of node.choices ?? []) {
      const next = choice.nextNodeId
      if (!next) continue
      if (graph.nodes.has(next) && !reachable.has(next)) queue.push(next)
    }

    for (const content of node.content ?? []) {
      const interrupt = (content as any).interrupt
      if (interrupt?.targetNodeId && graph.nodes.has(interrupt.targetNodeId) && !reachable.has(interrupt.targetNodeId)) {
        queue.push(interrupt.targetNodeId)
      }
      if (interrupt?.missedNodeId && graph.nodes.has(interrupt.missedNodeId) && !reachable.has(interrupt.missedNodeId)) {
        queue.push(interrupt.missedNodeId)
      }
    }
  }

  return reachable
}

function buildReport(): Report {
  const byGraph: Record<string, { nodes: number; roots: number; reachable: number; unreachable: number }> = {}
  const unreachable: UnreachableNode[] = []

  let totalNodes = 0

  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS as any)) {
    const roots = inGraphRoots(graphKey, graph)
    const reachable = bfsReachable(graph, roots)

    const graphNodes = graph.nodes.size
    totalNodes += graphNodes

    let graphUnreachable = 0
    for (const nodeId of graph.nodes.keys()) {
      if (roots.includes(nodeId)) continue
      if (!reachable.has(nodeId)) {
        graphUnreachable++
        unreachable.push({ graphKey, nodeId })
      }
    }

    byGraph[graphKey] = {
      nodes: graphNodes,
      roots: roots.length,
      reachable: reachable.size,
      unreachable: graphUnreachable,
    }
  }

  unreachable.sort((a, b) => toKey(a.graphKey, a.nodeId).localeCompare(toKey(b.graphKey, b.nodeId)))

  return {
    generated_at: new Date().toISOString(),
    totals: {
      graphs: Object.keys(DIALOGUE_GRAPHS).length,
      nodes: totalNodes,
      unreachable: unreachable.length,
    },
    by_graph: byGraph,
    unreachable,
  }
}

function compareToBaseline(current: Report, baseline: Baseline): { newOnes: string[] } {
  const baselineSet = new Set(baseline.nodes.map(n => toKey(n.graphKey, n.nodeId)))
  const currentSet = new Set(current.unreachable.map(n => toKey(n.graphKey, n.nodeId)))
  const newOnes = [...currentSet].filter(k => !baselineSet.has(k))
  return { newOnes }
}

function main(): void {
  const report = buildReport()
  writeJson(outputPath, report)

  if (writeBaseline) {
    const baseline: Baseline = {
      generated_at: report.generated_at,
      nodes: report.unreachable.map(n => ({ graphKey: n.graphKey, nodeId: n.nodeId })),
    }
    writeJson(baselinePath, baseline)
    console.log(`Wrote baseline: ${baselinePath}`)
    console.log(`Unreachable nodes: ${report.totals.unreachable}`)
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
    console.error('\nUnreachable Dialogue Nodes Regression')
    console.error(`New unreachable nodes: ${newOnes.length}`)
    for (const k of newOnes.slice(0, 20)) {
      console.error(`- ${k}`)
    }
    if (newOnes.length > 20) {
      console.error(`... and ${newOnes.length - 20} more`)
    }
    process.exit(1)
  }

  console.log(`Unreachable dialogue nodes OK (count=${report.totals.unreachable}, no regressions).`)
}

main()

