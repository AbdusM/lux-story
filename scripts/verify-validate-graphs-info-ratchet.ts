/**
 * Validate-Graphs "Info Count" Ratchet
 *
 * AAA intent:
 * - `npm run validate-graphs` is a rich static analysis pass, but it emits "info items"
 *   that represent content/system debt.
 * - We want "no new debt" without breaking existing work: fail CI only when the
 *   info item count increases vs a committed baseline.
 *
 * Implementation strategy:
 * - Run the existing validator script as a child process (single source of truth).
 * - Parse the final `ℹ️  N info item(s)` line.
 * - Compare to baseline JSON in docs/qa.
 * - Write a report JSON every run (actionable artifacts).
 */

import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

const REPO_ROOT = process.cwd()
const BASELINE_PATH = path.join(REPO_ROOT, 'docs/qa/validate-graphs-info-baseline.json')
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/validate-graphs-info-report.json')

type Baseline = {
  generated_at: string
  info_items: number
  notes?: string
}

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

function runValidateGraphs(): Promise<{ code: number; output: string }> {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ['--import', 'tsx', 'scripts/validate-dialogue-graphs.ts'],
      {
        cwd: REPO_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: process.env,
      },
    )

    const chunks: Buffer[] = []
    child.stdout.on('data', (d) => chunks.push(Buffer.from(d)))
    child.stderr.on('data', (d) => chunks.push(Buffer.from(d)))

    child.on('close', (code) => {
      resolve({ code: code ?? 1, output: Buffer.concat(chunks).toString('utf8') })
    })
  })
}

function parseInfoItems(output: string): number | null {
  // Example: "ℹ️  50 info item(s)"
  // Don't key off the emoji; different terminals can render it differently.
  const matches = [...output.matchAll(/(\d+)\s+info item\(s\)/g)]
  const last = matches.at(-1)
  if (!last?.[1]) return null
  const n = Number(last[1])
  return Number.isFinite(n) ? n : null
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const writeBaseline = args.has('--write-baseline')

  const baseline = await readJsonIfExists<Baseline>(BASELINE_PATH)
  if (!baseline && !writeBaseline) {
    console.error('[verify-validate-graphs-info] FAILED')
    console.error(`- Missing baseline: ${path.relative(REPO_ROOT, BASELINE_PATH)}`)
    console.error(`- Run: node --import tsx scripts/verify-validate-graphs-info-ratchet.ts --write-baseline`)
    process.exit(1)
  }

  const startedAt = Date.now()
  const result = await runValidateGraphs()
  if (result.code !== 0) {
    console.error('[verify-validate-graphs-info] FAILED')
    console.error(`- validate-graphs exited with code ${result.code}`)
    process.exit(1)
  }

  const infoItems = parseInfoItems(result.output)
  if (infoItems === null) {
    console.error('[verify-validate-graphs-info] FAILED')
    console.error(`- Could not parse info item count from validate-graphs output`)
    process.exit(1)
  }

  if (writeBaseline) {
    const nextBaseline: Baseline = {
      generated_at: nowIso(),
      info_items: infoItems,
      notes: 'Baseline for validate-graphs info item ratchet (fail only on regressions).',
    }
    await writeJson(BASELINE_PATH, nextBaseline)
  }

  const resolvedBaseline = (await readJsonIfExists<Baseline>(BASELINE_PATH))!

  const report = {
    generated_at: nowIso(),
    duration_ms: Date.now() - startedAt,
    baseline: resolvedBaseline,
    current: { info_items: infoItems },
    delta: { info_items: infoItems - resolvedBaseline.info_items },
  }
  await writeJson(REPORT_PATH, report)

  if (infoItems > resolvedBaseline.info_items) {
    console.error('[verify-validate-graphs-info] FAILED')
    console.error(`- Info items increased: baseline=${resolvedBaseline.info_items}, current=${infoItems}`)
    console.error(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
    process.exit(1)
  }

  console.log('[verify-validate-graphs-info] OK')
  console.log(`- Baseline: ${resolvedBaseline.info_items}`)
  console.log(`- Current: ${infoItems}`)
  console.log(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
}

main().catch((err) => {
  console.error('[verify-validate-graphs-info] ERROR', err)
  process.exit(1)
})
