#!/usr/bin/env npx tsx

import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

type DialogueGuidelinesReport = {
  summary?: {
    hardContentIssues?: number
    hardMonologueChains?: number
  }
}

type Baseline = {
  generated_at: string
  hard_content_issues: number
  hard_monologue_chains: number
  notes?: string
}

const REPO_ROOT = process.cwd()
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/dialogue-guidelines-report.json')
const BASELINE_PATH = path.join(REPO_ROOT, 'docs/qa/dialogue-guidelines-baseline.json')
const RATCHET_REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/dialogue-guidelines-ratchet-report.json')

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

function runDialogueGuidelineReport(): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ['--loader', './scripts/ts-loader.mjs', 'scripts/report-dialogue-guidelines.ts'],
      {
        cwd: REPO_ROOT,
        stdio: 'inherit',
        env: process.env,
      },
    )
    child.on('close', (code) => resolve(code ?? 1))
  })
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const writeBaseline = args.has('--write-baseline')

  const existingBaseline = await readJsonIfExists<Baseline>(BASELINE_PATH)
  if (!existingBaseline && !writeBaseline) {
    console.error('[verify-dialogue-guidelines] FAILED')
    console.error(`- Missing baseline: ${path.relative(REPO_ROOT, BASELINE_PATH)}`)
    console.error(`- Run once: node --loader ./scripts/ts-loader.mjs scripts/verify-dialogue-guidelines-ratchet.ts --write-baseline`)
    process.exit(1)
  }

  const startedAt = Date.now()
  const reportExitCode = await runDialogueGuidelineReport()
  if (reportExitCode !== 0) {
    console.error('[verify-dialogue-guidelines] FAILED')
    console.error(`- report-dialogue-guidelines exited with code ${reportExitCode}`)
    process.exit(1)
  }

  const report = await readJsonIfExists<DialogueGuidelinesReport>(REPORT_PATH)
  const hardContentIssues = report?.summary?.hardContentIssues
  const hardMonologueChains = report?.summary?.hardMonologueChains
  if (
    hardContentIssues === undefined ||
    hardMonologueChains === undefined ||
    Number.isNaN(hardContentIssues) ||
    Number.isNaN(hardMonologueChains)
  ) {
    console.error('[verify-dialogue-guidelines] FAILED')
    console.error(`- Could not read hard issue metrics from ${path.relative(REPO_ROOT, REPORT_PATH)}`)
    process.exit(1)
  }

  if (writeBaseline) {
    const nextBaseline: Baseline = {
      generated_at: nowIso(),
      hard_content_issues: hardContentIssues,
      hard_monologue_chains: hardMonologueChains,
      notes: 'Dialogue guideline ratchet baseline (fail only on hard metric regressions).',
    }
    await writeJson(BASELINE_PATH, nextBaseline)
  }

  const baseline = (await readJsonIfExists<Baseline>(BASELINE_PATH))!

  const ratchetReport = {
    generated_at: nowIso(),
    duration_ms: Date.now() - startedAt,
    baseline,
    current: {
      hard_content_issues: hardContentIssues,
      hard_monologue_chains: hardMonologueChains,
    },
    delta: {
      hard_content_issues: hardContentIssues - baseline.hard_content_issues,
      hard_monologue_chains: hardMonologueChains - baseline.hard_monologue_chains,
    },
  }
  await writeJson(RATCHET_REPORT_PATH, ratchetReport)

  const contentRegression = hardContentIssues > baseline.hard_content_issues
  const chainRegression = hardMonologueChains > baseline.hard_monologue_chains

  if (contentRegression || chainRegression) {
    console.error('[verify-dialogue-guidelines] FAILED')
    if (contentRegression) {
      console.error(`- Hard content issues increased: baseline=${baseline.hard_content_issues}, current=${hardContentIssues}`)
    }
    if (chainRegression) {
      console.error(`- Hard monologue chains increased: baseline=${baseline.hard_monologue_chains}, current=${hardMonologueChains}`)
    }
    console.error(`- Report: ${path.relative(REPO_ROOT, RATCHET_REPORT_PATH)}`)
    process.exit(1)
  }

  console.log('[verify-dialogue-guidelines] OK')
  console.log(`- Hard content issues: baseline=${baseline.hard_content_issues}, current=${hardContentIssues}`)
  console.log(`- Hard monologue chains: baseline=${baseline.hard_monologue_chains}, current=${hardMonologueChains}`)
  console.log(`- Report: ${path.relative(REPO_ROOT, RATCHET_REPORT_PATH)}`)
}

main().catch((err) => {
  console.error('[verify-dialogue-guidelines] ERROR', err)
  process.exit(1)
})
