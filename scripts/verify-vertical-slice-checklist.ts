#!/usr/bin/env npx tsx

import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { NARRATIVE_RUNTIME_POLICY } from '../lib/narrative-policy'

type SimulationContractReport = {
  valid?: boolean
  summary?: {
    contractEntries?: number
    graphVariants?: number
    docEntries?: number
  }
}

type IcebergReport = {
  thresholds?: {
    min_tags?: number
    min_characters?: number
  }
  summary?: {
    total_tags?: number
    tagged_characters?: number
  }
  issues?: string[]
}

type NarrativeSimReport = {
  totals?: {
    failures?: number
    required_state_mismatches?: number
  }
}

type RequiredStateStrictReport = {
  totals?: {
    violations?: number
  }
}

type TaxonomyReport = {
  strategy?: 'ratchet' | 'threshold'
  summary?: {
    coverage_percent?: number
  }
  baseline?: {
    coverage_percent?: number
    non_compliant_nodes?: number
  } | null
  regressions?: string[]
}

type ExternalDebtReport = {
  regressions?: Array<{ metric?: string; baseline?: number; current?: number }>
  baseline_exists?: boolean
}

type WorldCanonReport = {
  valid?: boolean
}

type CheckResult = {
  id: string
  passed: boolean
  details: string
}

const REPO_ROOT = process.cwd()
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/vertical-slice-checklist-report.json')
const MODE = process.env.VERTICAL_SLICE_GATE_MODE === 'enforce' ? 'enforce' : 'warn'

const SIM_CONTRACT_REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/simulation-phase-contract-report.json')
const ICEBERG_REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/iceberg-tag-report.json')
const NARRATIVE_SIM_REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/narrative-sim-report.json')
const REQUIRED_STATE_STRICT_REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/required-state-strict-report.json')
const CHOICE_TAXONOMY_REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/choice-taxonomy-report.json')
const EXTERNAL_DEBT_REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/dialogue-external-debt-report.json')
const WORLD_CANON_REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/world-canon-contract-report.json')
const GAME_INTERFACE_PATH = path.join(REPO_ROOT, 'components/StatefulGameInterface.tsx')

const TAXONOMY_MIN_COVERAGE = Number(process.env.CHOICE_TAXONOMY_MIN_COVERAGE ?? 90)

async function readJsonIfExists<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function runVerifier(scriptPath: string, envOverrides: Record<string, string> = {}): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ['--loader', './scripts/ts-loader.mjs', scriptPath],
      {
        cwd: REPO_ROOT,
        stdio: 'inherit',
        env: { ...process.env, ...envOverrides },
      },
    )
    child.on('close', (code) => resolve(code ?? 1))
  })
}

async function refreshReportsIfRequested(refresh: boolean): Promise<void> {
  if (!refresh) return

  const runs: Array<{ script: string; env?: Record<string, string> }> = [
    { script: 'scripts/verify-world-canon-contract.ts' },
    { script: 'scripts/verify-simulation-phase-contract.ts' },
    { script: 'scripts/verify-choice-taxonomy.ts' },
    { script: 'scripts/verify-dialogue-external-debt.ts' },
    { script: 'scripts/verify-required-state-strict.ts' },
    { script: 'scripts/verify-narrative-sim.ts' },
  ]

  if (NARRATIVE_RUNTIME_POLICY.icebergActivation === 'required') {
    runs.push({
      script: 'scripts/verify-iceberg-tags.ts',
      env: { ICEBERG_VALIDATOR_MODE: 'enforce' },
    })
  }

  for (const run of runs) {
    const code = await runVerifier(run.script, run.env)
    if (code !== 0) {
      throw new Error(`Refresh step failed: ${run.script} (exit ${code})`)
    }
  }
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const refresh = args.has('--refresh')

  const startedAt = Date.now()
  await refreshReportsIfRequested(refresh)

  const checks: CheckResult[] = []

  const validPatternPolicy = ['off', 'minimal', 'on'].includes(NARRATIVE_RUNTIME_POLICY.patternVoicePolicy)
  const validIcebergPolicy = ['required', 'optional', 'defer'].includes(NARRATIVE_RUNTIME_POLICY.icebergActivation)
  checks.push({
    id: 'policy-explicit',
    passed: validPatternPolicy && validIcebergPolicy,
    details: `patternVoicePolicy=${NARRATIVE_RUNTIME_POLICY.patternVoicePolicy}, icebergActivation=${NARRATIVE_RUNTIME_POLICY.icebergActivation}`,
  })

  const interfaceSource = await fs.readFile(GAME_INTERFACE_PATH, 'utf8')
  const hasPatternVoiceRenderPath = interfaceSource.includes('<PatternVoice')
  const expectsPatternVoiceRender = NARRATIVE_RUNTIME_POLICY.patternVoicePolicy !== 'off'
  checks.push({
    id: 'pattern-voice-render-path',
    passed: expectsPatternVoiceRender ? hasPatternVoiceRenderPath : true,
    details: expectsPatternVoiceRender
      ? `PatternVoice render path ${hasPatternVoiceRenderPath ? 'found' : 'missing'} in StatefulGameInterface`
      : 'Pattern voice policy is off (render path optional)',
  })

  const simulationContract = await readJsonIfExists<SimulationContractReport>(SIM_CONTRACT_REPORT_PATH)
  checks.push({
    id: 'simulation-phase-contract',
    passed: Boolean(simulationContract?.valid),
    details: simulationContract
      ? `valid=${Boolean(simulationContract.valid)} entries=${simulationContract.summary?.contractEntries ?? 0}`
      : `missing report: ${path.relative(REPO_ROOT, SIM_CONTRACT_REPORT_PATH)}`,
  })

  const worldCanon = await readJsonIfExists<WorldCanonReport>(WORLD_CANON_REPORT_PATH)
  checks.push({
    id: 'world-canon-contract',
    passed: Boolean(worldCanon?.valid),
    details: worldCanon
      ? `valid=${Boolean(worldCanon.valid)}`
      : `missing report: ${path.relative(REPO_ROOT, WORLD_CANON_REPORT_PATH)}`,
  })

  const narrativeSim = await readJsonIfExists<NarrativeSimReport>(NARRATIVE_SIM_REPORT_PATH)
  const simFailures = Number(narrativeSim?.totals?.failures ?? Number.NaN)
  const simMismatches = Number(narrativeSim?.totals?.required_state_mismatches ?? Number.NaN)
  checks.push({
    id: 'narrative-sim-integrity',
    passed: Number.isFinite(simFailures) && Number.isFinite(simMismatches) && simFailures === 0 && simMismatches === 0,
    details: `failures=${Number.isFinite(simFailures) ? simFailures : 'n/a'}, required_state_mismatches=${Number.isFinite(simMismatches) ? simMismatches : 'n/a'}`,
  })

  const strictReport = await readJsonIfExists<RequiredStateStrictReport>(REQUIRED_STATE_STRICT_REPORT_PATH)
  const strictViolations = Number(strictReport?.totals?.violations ?? Number.NaN)
  checks.push({
    id: 'required-state-strict',
    passed: Number.isFinite(strictViolations) && strictViolations === 0,
    details: `violations=${Number.isFinite(strictViolations) ? strictViolations : 'n/a'}`,
  })

  if (NARRATIVE_RUNTIME_POLICY.icebergActivation === 'required') {
    const iceberg = await readJsonIfExists<IcebergReport>(ICEBERG_REPORT_PATH)
    const minTags = Number(iceberg?.thresholds?.min_tags ?? Number.NaN)
    const minCharacters = Number(iceberg?.thresholds?.min_characters ?? Number.NaN)
    const totalTags = Number(iceberg?.summary?.total_tags ?? Number.NaN)
    const taggedCharacters = Number(iceberg?.summary?.tagged_characters ?? Number.NaN)
    const issues = iceberg?.issues ?? []
    const hasThresholds = Number.isFinite(minTags) && Number.isFinite(minCharacters)
    const pass = hasThresholds &&
      Number.isFinite(totalTags) &&
      Number.isFinite(taggedCharacters) &&
      totalTags >= minTags &&
      taggedCharacters >= minCharacters &&
      issues.length === 0

    checks.push({
      id: 'iceberg-activation',
      passed: pass,
      details: hasThresholds
        ? `total_tags=${Number.isFinite(totalTags) ? totalTags : 'n/a'} (min ${minTags}), tagged_characters=${Number.isFinite(taggedCharacters) ? taggedCharacters : 'n/a'} (min ${minCharacters}), issues=${issues.length}`
        : `missing/invalid report: ${path.relative(REPO_ROOT, ICEBERG_REPORT_PATH)}`,
    })
  }

  const taxonomy = await readJsonIfExists<TaxonomyReport>(CHOICE_TAXONOMY_REPORT_PATH)
  const taxonomyCoverage = Number(taxonomy?.summary?.coverage_percent ?? Number.NaN)
  const taxonomyStrategy = taxonomy?.strategy ?? 'threshold'
  const taxonomyRegressions = taxonomy?.regressions ?? []
  const taxonomyBaselineExists = taxonomy?.baseline != null
  const taxonomyPass = taxonomyStrategy === 'ratchet'
    ? taxonomyBaselineExists && taxonomyRegressions.length === 0
    : Number.isFinite(taxonomyCoverage) && taxonomyCoverage >= TAXONOMY_MIN_COVERAGE

  checks.push({
    id: 'choice-taxonomy-coverage',
    passed: taxonomyPass,
    details: taxonomyStrategy === 'ratchet'
      ? `strategy=ratchet baseline=${taxonomyBaselineExists} regressions=${taxonomyRegressions.length} coverage=${Number.isFinite(taxonomyCoverage) ? taxonomyCoverage : 'n/a'}%`
      : `strategy=threshold coverage=${Number.isFinite(taxonomyCoverage) ? taxonomyCoverage : 'n/a'}% (min ${TAXONOMY_MIN_COVERAGE}%)`,
  })

  const externalDebt = await readJsonIfExists<ExternalDebtReport>(EXTERNAL_DEBT_REPORT_PATH)
  const regressions = externalDebt?.regressions ?? []
  checks.push({
    id: 'external-debt-lane',
    passed: Boolean(externalDebt?.baseline_exists) && regressions.length === 0,
    details: externalDebt
      ? `baseline_exists=${Boolean(externalDebt.baseline_exists)}, regressions=${regressions.length}`
      : `missing report: ${path.relative(REPO_ROOT, EXTERNAL_DEBT_REPORT_PATH)}`,
  })

  const failedChecks = checks.filter((check) => !check.passed)
  const report = {
    generated_at: new Date().toISOString(),
    mode: MODE,
    duration_ms: Date.now() - startedAt,
    policy: NARRATIVE_RUNTIME_POLICY,
    checks,
    summary: {
      total_checks: checks.length,
      failed_checks: failedChecks.length,
      passed: failedChecks.length === 0,
    },
  }

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true })
  await fs.writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  const shouldFail = MODE === 'enforce' && failedChecks.length > 0
  if (shouldFail) {
    console.error('[verify-vertical-slice-checklist] FAILED')
    for (const failed of failedChecks) {
      console.error(`- ${failed.id}: ${failed.details}`)
    }
    console.error(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
    process.exit(1)
  }

  if (failedChecks.length > 0) {
    console.warn('[verify-vertical-slice-checklist] WARN')
    for (const failed of failedChecks) {
      console.warn(`- ${failed.id}: ${failed.details}`)
    }
  }

  console.log('[verify-vertical-slice-checklist] OK')
  console.log(`- Mode: ${MODE}`)
  console.log(`- Failed checks: ${failedChecks.length}`)
  console.log(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
}

main().catch((err) => {
  console.error('[verify-vertical-slice-checklist] ERROR', err)
  process.exit(1)
})
