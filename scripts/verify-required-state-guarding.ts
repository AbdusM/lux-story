#!/usr/bin/env npx tsx
/**
 * Required State Guarding Verification
 *
 * Produces a JSON report of nodes with requiredState that are not guarded
 * by any incoming choice conditions (or derived state implications).
 *
 * AAA contract: baseline + ratchet.
 * - Writes report always
 * - Fails CI only on regressions (new unguarded nodes vs baseline)
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'
import { buildRequiredStateGuardingReport } from '../lib/qa/required-state-guarding'

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

function readBaseline(p: string): Baseline | null {
  if (!fs.existsSync(p)) return null
  const raw = fs.readFileSync(p, 'utf-8')
  return JSON.parse(raw) as Baseline
}

function writeJson(p: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(payload, null, 2))
}

function toKey(graphKey: string, nodeId: string): string {
  return `${graphKey}/${nodeId}`
}

function compareToBaseline(
  current: { unguarded: Array<{ graphKey: string; nodeId: string }> },
  baseline: Baseline,
): { newOnes: string[] } {
  const baselineSet = new Set(baseline.nodes.map(n => toKey(n.graphKey, n.nodeId)))
  const currentSet = new Set(current.unguarded.map(n => toKey(n.graphKey, n.nodeId)))
  const newOnes = [...currentSet].filter(k => !baselineSet.has(k))
  return { newOnes }
}

function summarizeTop(unguarded: Array<{ graphKey: string; nodeId: string; unguardedIncomingCount: number; exampleIncoming: { fromGraph: string; fromNodeId: string; choiceId: string } | null }>): void {
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

function main(): void {
  const report = buildRequiredStateGuardingReport(DIALOGUE_GRAPHS)
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

