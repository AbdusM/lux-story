#!/usr/bin/env npx tsx
/**
 * Unreferenced Dialogue Nodes Verification
 *
 * Purpose (AAA content-as-code gate):
 * - Identify nodes that have *zero* incoming references across all graphs (choices + interrupts),
 *   excluding known entry nodes (mounted by routing) and graph start nodes.
 * - Compare against a baseline and fail CI only on regressions (new unreferenced nodes).
 *
 * This is intentionally narrow: it does not attempt full reachability analysis (which is state/gating dependent).
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'
import { CHARACTER_PATTERN_AFFINITIES } from '../lib/pattern-affinity'

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

type UnreferencedNode = {
  graphKey: string
  nodeId: string
}

type Report = {
  generated_at: string
  totals: {
    graphs: number
    nodes: number
    unreferenced: number
  }
  by_graph: Record<string, { nodes: number; unreferenced: number }>
  unreferenced: UnreferencedNode[]
}

const DEFAULT_BASELINE_PATH = path.join(process.cwd(), 'docs/qa/unreferenced-dialogue-nodes-baseline.json')
const DEFAULT_REPORT_PATH = path.join(process.cwd(), 'docs/qa/unreferenced-dialogue-nodes-report.json')

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

const PATTERN_UNLOCK_NODE_IDS = new Set<string>(
  Object.values(CHARACTER_PATTERN_AFFINITIES)
    .flatMap((a: any) => (a?.patternUnlocks ?? []).map((u: any) => u.unlockedNodeId))
    .filter(Boolean)
)

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

function collectReferencedNodeIds(): Set<string> {
  const referenced = new Set<string>()
  for (const graph of Object.values(DIALOGUE_GRAPHS)) {
    for (const node of graph.nodes.values()) {
      for (const choice of node.choices ?? []) {
        if (choice.nextNodeId) referenced.add(choice.nextNodeId)
      }

      for (const content of node.content ?? []) {
        const interrupt = (content as any).interrupt
        if (interrupt?.targetNodeId) referenced.add(interrupt.targetNodeId)
        if (interrupt?.missedNodeId) referenced.add(interrupt.missedNodeId)
      }
    }
  }
  return referenced
}

function buildReport(): Report {
  const referenced = collectReferencedNodeIds()
  const startNodeIds = new Set(Object.values(DIALOGUE_GRAPHS).map(g => g.startNodeId))

  const byGraph: Record<string, { nodes: number; unreferenced: number }> = {}
  const unreferenced: UnreferencedNode[] = []

  let totalNodes = 0

  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    let graphNodes = 0
    let graphUnref = 0

    for (const node of graph.nodes.values()) {
      graphNodes++
      totalNodes++

      if (startNodeIds.has(node.nodeId)) continue
      if (KNOWN_ENTRY_NODE_IDS.has(node.nodeId)) continue
      if (PATTERN_UNLOCK_NODE_IDS.has(node.nodeId)) continue
      if ((node as any)?.simulation) continue

      if (!referenced.has(node.nodeId)) {
        graphUnref++
        unreferenced.push({ graphKey, nodeId: node.nodeId })
      }
    }

    byGraph[graphKey] = { nodes: graphNodes, unreferenced: graphUnref }
  }

  unreferenced.sort((a, b) => toKey(a.graphKey, a.nodeId).localeCompare(toKey(b.graphKey, b.nodeId)))

  return {
    generated_at: new Date().toISOString(),
    totals: {
      graphs: Object.keys(DIALOGUE_GRAPHS).length,
      nodes: totalNodes,
      unreferenced: unreferenced.length,
    },
    by_graph: byGraph,
    unreferenced,
  }
}

function compareToBaseline(current: Report, baseline: Baseline): { newOnes: string[] } {
  const baselineSet = new Set(baseline.nodes.map(n => toKey(n.graphKey, n.nodeId)))
  const currentSet = new Set(current.unreferenced.map(n => toKey(n.graphKey, n.nodeId)))
  const newOnes = [...currentSet].filter(k => !baselineSet.has(k))
  return { newOnes }
}

function main(): void {
  const report = buildReport()
  writeJson(outputPath, report)

  if (writeBaseline) {
    const baseline: Baseline = {
      generated_at: report.generated_at,
      nodes: report.unreferenced.map(n => ({ graphKey: n.graphKey, nodeId: n.nodeId })),
    }
    writeJson(baselinePath, baseline)
    console.log(`Wrote baseline: ${baselinePath}`)
    console.log(`Unreferenced nodes: ${report.totals.unreferenced}`)
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
    console.error('\nUnreferenced Dialogue Nodes Regression')
    console.error(`New unreferenced nodes: ${newOnes.length}`)
    for (const k of newOnes.slice(0, 20)) {
      console.error(`- ${k}`)
    }
    if (newOnes.length > 20) {
      console.error(`... and ${newOnes.length - 20} more`)
    }
    process.exit(1)
  }

  console.log(`Unreferenced dialogue nodes OK (count=${report.totals.unreferenced}, no regressions).`)
}

main()
