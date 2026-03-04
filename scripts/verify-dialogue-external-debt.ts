#!/usr/bin/env npx tsx

import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

type ExternalReviewReport = {
  scope?: {
    excludedFromPrimaryScoring?: {
      detachedDialogueTotals?: {
        nodes?: number
        softContentIssues?: number
      }
      dormantDialogueTotals?: {
        nodes?: number
        softContentIssues?: number
      }
      nonGraphExperienceTotals?: {
        choices?: number
        softContentIssues?: number
      }
    }
  }
}

type DebtBaseline = {
  generated_at: string
  detached_nodes: number
  detached_soft_issues: number
  dormant_nodes: number
  dormant_soft_issues: number
  non_graph_experience_choices: number
  non_graph_experience_soft_issues: number
  notes?: string
}

type DebtMetrics = Omit<DebtBaseline, 'generated_at' | 'notes'>

const REPO_ROOT = process.cwd()
const SOURCE_REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/dialogue-external-review-report.json')
const BASELINE_PATH = path.join(REPO_ROOT, 'docs/qa/dialogue-external-debt-baseline.json')
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/dialogue-external-debt-report.json')
const MODE = process.env.DIALOGUE_EXTERNAL_DEBT_MODE === 'enforce' ? 'enforce' : 'warn'

function nowIso(): string {
  return new Date().toISOString()
}

async function readJsonIfExists<T>(p: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(p, 'utf8')
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function writeJson(p: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(p), { recursive: true })
  await fs.writeFile(p, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function runExternalReviewReport(): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ['--loader', './scripts/ts-loader.mjs', 'scripts/report-dialogue-external-review.ts'],
      {
        cwd: REPO_ROOT,
        stdio: 'inherit',
        env: process.env,
      },
    )
    child.on('close', (code) => resolve(code ?? 1))
  })
}

function extractMetrics(report: ExternalReviewReport | null): DebtMetrics | null {
  const excluded = report?.scope?.excludedFromPrimaryScoring
  if (!excluded) return null

  const detached = excluded.detachedDialogueTotals ?? {}
  const dormant = excluded.dormantDialogueTotals ?? {}
  const nonGraphExperience = excluded.nonGraphExperienceTotals ?? {}

  const metrics: DebtMetrics = {
    detached_nodes: Number(detached.nodes ?? 0),
    detached_soft_issues: Number(detached.softContentIssues ?? 0),
    dormant_nodes: Number(dormant.nodes ?? 0),
    dormant_soft_issues: Number(dormant.softContentIssues ?? 0),
    non_graph_experience_choices: Number(nonGraphExperience.choices ?? 0),
    non_graph_experience_soft_issues: Number(nonGraphExperience.softContentIssues ?? 0),
  }

  for (const value of Object.values(metrics)) {
    if (!Number.isFinite(value)) return null
  }

  return metrics
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const writeBaseline = args.has('--write-baseline')
  const skipRefresh = args.has('--skip-refresh')

  const startedAt = Date.now()
  if (!skipRefresh) {
    const refreshCode = await runExternalReviewReport()
    if (refreshCode !== 0) {
      console.error('[verify-dialogue-external-debt] FAILED')
      console.error(`- report-dialogue-external-review exited with code ${refreshCode}`)
      process.exit(1)
    }
  }

  const sourceReport = await readJsonIfExists<ExternalReviewReport>(SOURCE_REPORT_PATH)
  const current = extractMetrics(sourceReport)
  if (!current) {
    console.error('[verify-dialogue-external-debt] FAILED')
    console.error(`- Could not parse debt metrics from ${path.relative(REPO_ROOT, SOURCE_REPORT_PATH)}`)
    process.exit(1)
  }

  if (writeBaseline) {
    const nextBaseline: DebtBaseline = {
      generated_at: nowIso(),
      ...current,
      notes: 'Ratchet baseline for detached/dormant/non-graph debt outside primary scoring lane.',
    }
    await writeJson(BASELINE_PATH, nextBaseline)
  }

  const baseline = await readJsonIfExists<DebtBaseline>(BASELINE_PATH)

  const deltas: Partial<Record<keyof DebtMetrics, number>> = {}
  const regressions: Array<{ metric: keyof DebtMetrics; baseline: number; current: number }> = []

  if (baseline) {
    const keys = Object.keys(current) as Array<keyof DebtMetrics>
    for (const key of keys) {
      const delta = current[key] - baseline[key]
      deltas[key] = delta
      if (delta > 0) {
        regressions.push({
          metric: key,
          baseline: baseline[key],
          current: current[key],
        })
      }
    }
  }

  const report = {
    generated_at: nowIso(),
    mode: MODE,
    duration_ms: Date.now() - startedAt,
    baseline_exists: Boolean(baseline),
    baseline: baseline ?? null,
    current,
    delta: baseline ? deltas : null,
    regressions,
  }
  await writeJson(REPORT_PATH, report)

  const baselineMissing = !baseline
  const shouldFail = MODE === 'enforce' && (baselineMissing || regressions.length > 0)

  if (shouldFail) {
    console.error('[verify-dialogue-external-debt] FAILED')
    if (baselineMissing) {
      console.error(`- Missing baseline: ${path.relative(REPO_ROOT, BASELINE_PATH)}`)
      console.error(`- Initialize once: node --loader ./scripts/ts-loader.mjs scripts/verify-dialogue-external-debt.ts --write-baseline`)
    }
    if (regressions.length > 0) {
      console.error('- Debt regressions detected:')
      for (const regression of regressions) {
        console.error(`  - ${regression.metric}: baseline=${regression.baseline}, current=${regression.current}`)
      }
    }
    console.error(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
    process.exit(1)
  }

  if (baselineMissing) {
    console.warn('[verify-dialogue-external-debt] WARN')
    console.warn(`- Baseline missing: ${path.relative(REPO_ROOT, BASELINE_PATH)}`)
    console.warn(`- Initialize once: node --loader ./scripts/ts-loader.mjs scripts/verify-dialogue-external-debt.ts --write-baseline`)
  } else if (regressions.length > 0) {
    console.warn('[verify-dialogue-external-debt] WARN')
    console.warn(`- Debt regressions detected (${regressions.length}); mode=${MODE}`)
    for (const regression of regressions.slice(0, 20)) {
      console.warn(`  - ${regression.metric}: baseline=${regression.baseline}, current=${regression.current}`)
    }
  }

  console.log('[verify-dialogue-external-debt] OK')
  console.log(`- Mode: ${MODE}`)
  console.log(`- Detached nodes: ${current.detached_nodes}`)
  console.log(`- Dormant nodes: ${current.dormant_nodes}`)
  console.log(`- Non-graph experience choices: ${current.non_graph_experience_choices}`)
  console.log(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
}

main().catch((err) => {
  console.error('[verify-dialogue-external-debt] ERROR', err)
  process.exit(1)
})
