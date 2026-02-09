#!/usr/bin/env npx tsx
/**
 * Narrative Simulation Verification (baseline + ratchet)
 *
 * Writes a JSON report for headless path exploration, and fails CI only when:
 * - new failures appear (deadlocks/dead-ends/missing start), or
 * - new requiredState mismatches appear (debt-controlled)
 *
 * Deadlocks are already gated by Vitest, but this provides a durable report and
 * ratcheting signal for mismatches/truncations.
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'
import { buildNarrativeSimReport } from '../lib/qa/narrative-sim'

type Baseline = {
  generated_at: string
  failures: Array<{ graphKey: string; nodeId: string; kind: string }>
  required_state_mismatches: Array<{ graphKey: string; nodeId: string }>
  truncated_graphs?: string[]
}

const DEFAULT_BASELINE_PATH = path.join(process.cwd(), 'docs/qa/narrative-sim-baseline.json')
const DEFAULT_REPORT_PATH = path.join(process.cwd(), 'docs/qa/narrative-sim-report.json')

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
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as Baseline
}

function writeJson(p: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(payload, null, 2))
}

function failureKey(x: { graphKey: string; nodeId: string; kind: string }): string {
  return `${x.graphKey}/${x.nodeId}/${x.kind}`
}

function mismatchKey(x: { graphKey: string; nodeId: string }): string {
  return `${x.graphKey}/${x.nodeId}`
}

function main(): void {
  const report = buildNarrativeSimReport(DIALOGUE_GRAPHS)
  writeJson(outputPath, report)

  const truncatedGraphs = Object.entries(report.per_graph)
    .filter(([, g]) => g.truncated)
    .map(([k]) => k)
    .sort()

  if (writeBaseline) {
    const baseline: Baseline = {
      generated_at: report.generated_at,
      failures: report.failures.map(f => ({ graphKey: f.graphKey, nodeId: f.nodeId, kind: f.kind })),
      required_state_mismatches: report.required_state_mismatches,
      truncated_graphs: truncatedGraphs,
    }
    writeJson(baselinePath, baseline)
    console.log(`Wrote baseline: ${baselinePath}`)
    console.log(
      `Failures: ${baseline.failures.length}, requiredState mismatches: ${baseline.required_state_mismatches.length}, truncated graphs: ${truncatedGraphs.length}`,
    )
    return
  }

  const baseline = readBaseline(baselinePath)
  if (!baseline) {
    console.error(`Baseline not found: ${baselinePath}`)
    console.error('Run with --write-baseline to create one.')
    process.exit(1)
  }

  const baselineFailures = new Set(baseline.failures.map(failureKey))
  const currentFailures = new Set(report.failures.map(failureKey))
  const newFailures = [...currentFailures].filter(k => !baselineFailures.has(k)).sort()

  const baselineMismatch = new Set(baseline.required_state_mismatches.map(mismatchKey))
  const currentMismatch = new Set(report.required_state_mismatches.map(mismatchKey))
  const newMismatches = [...currentMismatch].filter(k => !baselineMismatch.has(k)).sort()

  const baselineTruncated = new Set((baseline.truncated_graphs ?? []).slice().sort())
  const currentTruncated = new Set(truncatedGraphs)
  const newTruncations = [...currentTruncated].filter(k => !baselineTruncated.has(k)).sort()

  console.log('\nNarrative Sim Summary')
  console.log(`Failures: ${report.failures.length} (new: ${newFailures.length})`)
  console.log(`requiredState mismatches: ${report.required_state_mismatches.length} (new: ${newMismatches.length})`)
  console.log(`truncated graphs: ${truncatedGraphs.length} (new: ${newTruncations.length})`)

  if (newFailures.length > 0) {
    console.error('\nRegression detected: new narrative sim failures')
    for (const k of newFailures.slice(0, 25)) console.error(`- ${k}`)
    if (newFailures.length > 25) console.error(`... and ${newFailures.length - 25} more`)
    process.exit(1)
  }

  if (newMismatches.length > 0) {
    console.error('\nRegression detected: new requiredState mismatches in narrative sim')
    for (const k of newMismatches.slice(0, 25)) console.error(`- ${k}`)
    if (newMismatches.length > 25) console.error(`... and ${newMismatches.length - 25} more`)
    process.exit(1)
  }

  if (newTruncations.length > 0) {
    console.error('\nRegression detected: narrative sim exploration truncated for new graph(s)')
    for (const k of newTruncations.slice(0, 25)) console.error(`- ${k}`)
    if (newTruncations.length > 25) console.error(`... and ${newTruncations.length - 25} more`)
    process.exit(1)
  }

  console.log('\nNo regressions vs baseline.')
}

main()
