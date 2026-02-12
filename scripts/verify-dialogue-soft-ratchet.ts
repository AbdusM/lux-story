#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

type GraphSoftMetrics = {
  softContentIssues: number
  softMonologueChains: number
}

type Baseline = {
  generated_at: string
  notes: string
  target_graphs: string[]
  by_graph: Record<string, GraphSoftMetrics>
}

type RatchetReport = {
  generated_at: string
  baseline_path: string
  report_path: string
  target_graphs: string[]
  regressions: Array<{
    graph: string
    metric: keyof GraphSoftMetrics
    baseline: number
    current: number
    delta: number
  }>
  current: Record<string, GraphSoftMetrics>
}

const REPO_ROOT = process.cwd()
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/dialogue-guidelines-report.json')
const BASELINE_PATH = path.join(REPO_ROOT, 'docs/qa/dialogue-soft-ratchet-baseline.json')
const RATCHET_REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/dialogue-soft-ratchet-report.json')

const TARGET_GRAPHS = ['maya_revisit', 'quinn', 'alex', 'rohan', 'devon_revisit', 'yaquin'] as const

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`\n[verify-dialogue-soft-ratchet] ${message}\n`)
  process.exit(1)
}

function runDialogueGuidelinesReport(): void {
  const result = spawnSync(
    process.execPath,
    ['--loader', './scripts/ts-loader.mjs', 'scripts/report-dialogue-guidelines.ts'],
    { cwd: REPO_ROOT, stdio: 'inherit' },
  )
  if (result.status !== 0) {
    fail(`report-dialogue-guidelines exited with code ${result.status ?? 'unknown'}`)
  }
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

function writeJson(filePath: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2))
}

function getCurrentMetrics(report: any, graph: string): GraphSoftMetrics {
  const graphRow = report?.byGraph?.[graph]
  return {
    softContentIssues: Number(graphRow?.softContentIssues ?? 0),
    softMonologueChains: Number(graphRow?.softMonologueChains ?? 0),
  }
}

function main(): void {
  const writeBaseline = process.argv.slice(2).includes('--write-baseline') || process.argv.slice(2).includes('--write')

  runDialogueGuidelinesReport()
  if (!fs.existsSync(REPORT_PATH)) fail(`Missing report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)

  const report = readJson<any>(REPORT_PATH)

  const current: Record<string, GraphSoftMetrics> = {}
  for (const graph of TARGET_GRAPHS) {
    current[graph] = getCurrentMetrics(report, graph)
  }

  if (writeBaseline) {
    const baseline: Baseline = {
      generated_at: new Date().toISOString(),
      notes: 'Soft dialogue ratchet baseline for top-offender graphs (regression-only gate).',
      target_graphs: [...TARGET_GRAPHS],
      by_graph: current,
    }
    writeJson(BASELINE_PATH, baseline)
    // eslint-disable-next-line no-console
    console.log(`[verify-dialogue-soft-ratchet] baseline written: ${path.relative(REPO_ROOT, BASELINE_PATH)}`)
    return
  }

  if (!fs.existsSync(BASELINE_PATH)) {
    fail(
      `Missing baseline at ${path.relative(
        REPO_ROOT,
        BASELINE_PATH,
      )}. Run once with --write-baseline after review.`,
    )
  }

  const baseline = readJson<Baseline>(BASELINE_PATH)

  const regressions: RatchetReport['regressions'] = []
  for (const graph of TARGET_GRAPHS) {
    const base = baseline.by_graph[graph] ?? { softContentIssues: 0, softMonologueChains: 0 }
    const now = current[graph]
    ;(['softContentIssues', 'softMonologueChains'] as const).forEach((metric) => {
      if (now[metric] > base[metric]) {
        regressions.push({
          graph,
          metric,
          baseline: base[metric],
          current: now[metric],
          delta: now[metric] - base[metric],
        })
      }
    })
  }

  const ratchetReport: RatchetReport = {
    generated_at: new Date().toISOString(),
    baseline_path: path.relative(REPO_ROOT, BASELINE_PATH),
    report_path: path.relative(REPO_ROOT, REPORT_PATH),
    target_graphs: [...TARGET_GRAPHS],
    regressions,
    current,
  }
  writeJson(RATCHET_REPORT_PATH, ratchetReport)

  if (regressions.length > 0) {
    fail(
      `Soft dialogue regressions detected in target graphs:\n${regressions
        .map((r) => `- ${r.graph}.${r.metric}: baseline=${r.baseline}, current=${r.current}`)
        .join('\n')}\nReport: ${path.relative(REPO_ROOT, RATCHET_REPORT_PATH)}`,
    )
  }

  // eslint-disable-next-line no-console
  console.log(
    `[verify-dialogue-soft-ratchet] OK for ${TARGET_GRAPHS.length} graphs. Report: ${path.relative(
      REPO_ROOT,
      RATCHET_REPORT_PATH,
    )}`,
  )
}

main()

