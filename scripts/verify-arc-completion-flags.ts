#!/usr/bin/env npx tsx
/**
 * Arc Completion Flag Contract
 *
 * AAA purpose: prevent "arc completion" drift that causes downstream gating deadlocks.
 *
 * Contract:
 * - For every character graph (excluding location graphs + Samuel), the base graph must set
 *   `${characterId}_arc_complete` at least once (via node.onEnter or choice.consequence).
 * - If any node is tagged `arc_complete`, then that node MUST set `${characterId}_arc_complete`
 *   in `onEnter` (single truthy point: reaching the completion node).
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'

type Report = {
  generated_at: string
  graphs_checked: number
  missing_arc_complete_flag: Array<{ graphKey: string; expectedFlag: string }>
  tagged_arc_complete_missing_onenter: Array<{ graphKey: string; nodeId: string; expectedFlag: string }>
}

const LOCATION_GRAPH_KEYS = new Set(['station_entry', 'grand_hall', 'market', 'deep_station'])
const SKIP_GRAPH_KEYS = new Set(['samuel'])

function baseCharacterIdForGraphKey(graphKey: string): string {
  return graphKey.replace(/_revisit$/, '')
}

function expectedArcFlag(graphKey: string): string {
  return `${baseCharacterIdForGraphKey(graphKey)}_arc_complete`
}

function changeAddsGlobalFlag(change: any, flag: string): boolean {
  const add = change?.addGlobalFlags
  return Array.isArray(add) && add.includes(flag)
}

function nodeOnEnterAddsFlag(node: any, flag: string): boolean {
  const onEnter = node?.onEnter
  if (!Array.isArray(onEnter)) return false
  return onEnter.some(ch => changeAddsGlobalFlag(ch, flag))
}

function nodeIsTaggedArcComplete(node: any): boolean {
  return Array.isArray(node?.tags) && node.tags.includes('arc_complete')
}

function graphSetsArcFlag(graph: any, flag: string): boolean {
  for (const node of graph.nodes.values()) {
    if (nodeOnEnterAddsFlag(node, flag)) return true
    for (const choice of node.choices ?? []) {
      if (changeAddsGlobalFlag(choice?.consequence, flag)) return true
    }
  }
  return false
}

function writeJson(p: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(payload, null, 2))
}

function main(): void {
  const missing_arc_complete_flag: Report['missing_arc_complete_flag'] = []
  const tagged_arc_complete_missing_onenter: Report['tagged_arc_complete_missing_onenter'] = []

  let graphs_checked = 0

  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    if (graphKey.endsWith('_revisit')) continue
    if (LOCATION_GRAPH_KEYS.has(graphKey)) continue
    if (SKIP_GRAPH_KEYS.has(graphKey)) continue

    graphs_checked++
    const flag = expectedArcFlag(graphKey)

    if (!graphSetsArcFlag(graph, flag)) {
      missing_arc_complete_flag.push({ graphKey, expectedFlag: flag })
    }

    for (const node of graph.nodes.values()) {
      if (!nodeIsTaggedArcComplete(node)) continue
      if (!nodeOnEnterAddsFlag(node, flag)) {
        tagged_arc_complete_missing_onenter.push({ graphKey, nodeId: node.nodeId, expectedFlag: flag })
      }
    }
  }

  const report: Report = {
    generated_at: new Date().toISOString(),
    graphs_checked,
    missing_arc_complete_flag,
    tagged_arc_complete_missing_onenter,
  }

  const outPath = path.join(process.cwd(), 'docs/qa/arc-completion-flags-report.json')
  writeJson(outPath, report)

  if (missing_arc_complete_flag.length === 0 && tagged_arc_complete_missing_onenter.length === 0) {
    console.log(`Arc completion flags OK (graphs_checked=${graphs_checked}).`)
    return
  }

  console.error('\nArc completion flags CONTRACT VIOLATIONS')
  if (missing_arc_complete_flag.length > 0) {
    console.error(`\nMissing arc completion flag setters: ${missing_arc_complete_flag.length}`)
    for (const item of missing_arc_complete_flag.slice(0, 50)) {
      console.error(`- ${item.graphKey}: expected ${item.expectedFlag}`)
    }
    if (missing_arc_complete_flag.length > 50) console.error(`... and ${missing_arc_complete_flag.length - 50} more`)
  }

  if (tagged_arc_complete_missing_onenter.length > 0) {
    console.error(`\nTagged arc_complete nodes missing onEnter flag: ${tagged_arc_complete_missing_onenter.length}`)
    for (const item of tagged_arc_complete_missing_onenter.slice(0, 50)) {
      console.error(`- ${item.graphKey}/${item.nodeId}: expected onEnter addGlobalFlags include ${item.expectedFlag}`)
    }
    if (tagged_arc_complete_missing_onenter.length > 50) {
      console.error(`... and ${tagged_arc_complete_missing_onenter.length - 50} more`)
    }
  }

  console.error(`\nWrote report: ${outPath}`)
  process.exit(1)
}

main()

