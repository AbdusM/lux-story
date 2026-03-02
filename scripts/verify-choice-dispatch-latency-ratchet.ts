#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'

type Baseline = {
  generated_at: string
  notes: string
  budget_ms: number
  min_samples: number
  sample_count: number
  p50_ms: number
  p95_ms: number
  max_ms: number
}

type RatchetReport = {
  generated_at: string
  budget_ms: number
  min_samples: number
  samples_path: string
  baseline_path: string
  report_path: string
  current: {
    sample_count: number
    p50_ms: number
    p95_ms: number
    max_ms: number
  }
  baseline: {
    sample_count: number
    p50_ms: number
    p95_ms: number
    max_ms: number
  }
  regressions: Array<{
    metric: 'p95_ms' | 'max_ms'
    baseline: number
    current: number
    delta: number
  }>
}

const REPO_ROOT = process.cwd()
const BUDGET_MS = Number(process.env.CHOICE_DISPATCH_P95_BUDGET_MS || 260)
const MIN_SAMPLES = Number(process.env.CHOICE_DISPATCH_MIN_SAMPLES || 20)

const SAMPLES_PATH = path.join(REPO_ROOT, 'docs/qa/choice-dispatch-latency-samples.json')
const BASELINE_PATH = path.join(REPO_ROOT, 'docs/qa/choice-dispatch-latency-baseline.json')
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/choice-dispatch-latency-report.json')

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`\n[verify-choice-dispatch-latency] ${message}\n`)
  process.exit(1)
}

function writeJson(filePath: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = Math.floor(sorted.length * p)
  return sorted[Math.min(Math.max(idx, 0), sorted.length - 1)]
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function extractDispatchTimes(payload: unknown): number[] {
  if (Array.isArray(payload)) {
    return payload
      .map((row) => (typeof row === 'number' ? row : null))
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0)
  }

  const root = payload as Record<string, unknown>
  const samples = Array.isArray(root.samples) ? root.samples : []
  const events = Array.isArray(root.events) ? root.events : []

  const fromSamples = samples
    .map((row) => {
      if (typeof row === 'number') return row
      if (row && typeof row === 'object') {
        const r = row as Record<string, unknown>
        if (typeof r.click_to_dispatch_ms === 'number') return r.click_to_dispatch_ms
        if (typeof r.clickToDispatchMs === 'number') return r.clickToDispatchMs
      }
      return null
    })
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0)

  const fromEvents = events
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const r = row as Record<string, unknown>
      const eventType = String(r.event_type || '')
      if (eventType && eventType !== 'choice_selected_result') return null
      const payloadObj = r.payload && typeof r.payload === 'object' ? (r.payload as Record<string, unknown>) : null
      const dispatchTime = payloadObj?.click_to_dispatch_ms
      return typeof dispatchTime === 'number' ? dispatchTime : null
    })
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0)

  return [...fromSamples, ...fromEvents]
}

function computeStats(times: number[]) {
  const sorted = [...times].sort((a, b) => a - b)
  const p50 = percentile(sorted, 0.5)
  const p95 = percentile(sorted, 0.95)
  return {
    sample_count: sorted.length,
    p50_ms: round2(p50),
    p95_ms: round2(p95),
    max_ms: round2(sorted[sorted.length - 1] ?? 0),
  }
}

function main(): void {
  const args = new Set(process.argv.slice(2))
  const writeBaseline = args.has('--write-baseline') || args.has('--write')

  if (!fs.existsSync(SAMPLES_PATH)) {
    fail(`Missing samples file: ${path.relative(REPO_ROOT, SAMPLES_PATH)}`)
  }

  const sourcePayload = readJson<unknown>(SAMPLES_PATH)
  const dispatchTimes = extractDispatchTimes(sourcePayload)
  if (dispatchTimes.length < MIN_SAMPLES) {
    fail(
      `Insufficient latency samples: required >= ${MIN_SAMPLES}, got ${dispatchTimes.length}. ` +
      `Populate ${path.relative(REPO_ROOT, SAMPLES_PATH)} with choice_selected_result.click_to_dispatch_ms samples.`,
    )
  }

  const current = computeStats(dispatchTimes)

  if (writeBaseline) {
    const baseline: Baseline = {
      generated_at: new Date().toISOString(),
      notes: 'Baseline for choice dispatch latency p95 gate (regression-only + hard budget).',
      budget_ms: BUDGET_MS,
      min_samples: MIN_SAMPLES,
      sample_count: current.sample_count,
      p50_ms: current.p50_ms,
      p95_ms: current.p95_ms,
      max_ms: current.max_ms,
    }
    writeJson(BASELINE_PATH, baseline)
    // eslint-disable-next-line no-console
    console.log(`[verify-choice-dispatch-latency] baseline written: ${path.relative(REPO_ROOT, BASELINE_PATH)}`)
    return
  }

  if (!fs.existsSync(BASELINE_PATH)) {
    fail(`Missing baseline: ${path.relative(REPO_ROOT, BASELINE_PATH)}. Run with --write-baseline after review.`)
  }

  const baseline = readJson<Baseline>(BASELINE_PATH)
  const regressions: RatchetReport['regressions'] = []
  if (current.p95_ms > baseline.p95_ms) {
    regressions.push({
      metric: 'p95_ms',
      baseline: baseline.p95_ms,
      current: current.p95_ms,
      delta: round2(current.p95_ms - baseline.p95_ms),
    })
  }
  if (current.max_ms > baseline.max_ms) {
    regressions.push({
      metric: 'max_ms',
      baseline: baseline.max_ms,
      current: current.max_ms,
      delta: round2(current.max_ms - baseline.max_ms),
    })
  }

  const report: RatchetReport = {
    generated_at: new Date().toISOString(),
    budget_ms: BUDGET_MS,
    min_samples: MIN_SAMPLES,
    samples_path: path.relative(REPO_ROOT, SAMPLES_PATH),
    baseline_path: path.relative(REPO_ROOT, BASELINE_PATH),
    report_path: path.relative(REPO_ROOT, REPORT_PATH),
    current,
    baseline: {
      sample_count: baseline.sample_count,
      p50_ms: baseline.p50_ms,
      p95_ms: baseline.p95_ms,
      max_ms: baseline.max_ms,
    },
    regressions,
  }

  writeJson(REPORT_PATH, report)

  if (current.p95_ms > BUDGET_MS) {
    fail(
      `p95 budget breached: p95_ms=${current.p95_ms} > budget_ms=${BUDGET_MS}. ` +
      `Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`,
    )
  }

  if (regressions.length > 0) {
    fail(
      `Latency regressions detected:\n${regressions
        .map((r) => `- ${r.metric}: baseline=${r.baseline}, current=${r.current}, delta=${r.delta}`)
        .join('\n')}\nReport: ${path.relative(REPO_ROOT, REPORT_PATH)}`,
    )
  }

  // eslint-disable-next-line no-console
  console.log(
    `[verify-choice-dispatch-latency] OK: samples=${current.sample_count}, p95=${current.p95_ms}ms, budget=${BUDGET_MS}ms. ` +
    `Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`,
  )
}

main()

