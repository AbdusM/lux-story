#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'
import { ConditionalChoice } from '../lib/dialogue-graph'

type TaxonomyClass = 'accept' | 'reject' | 'deflect'
type Strategy = 'ratchet' | 'threshold'

type WaiverEntry = {
  nodeId: string
  reason: string
}

type WaiverFile = {
  generated_at?: string
  notes?: string
  waivers?: WaiverEntry[]
}

type TaxonomyBaseline = {
  generated_at: string
  coverage_percent: number
  non_compliant_nodes: number
  notes?: string
}

type GraphSummary = {
  eligible_nodes: number
  compliant_nodes: number
  waived_nodes: number
  non_compliant_nodes: number
  coverage_percent: number
}

const REPO_ROOT = process.cwd()
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/choice-taxonomy-report.json')
const WAIVER_PATH = path.join(REPO_ROOT, 'docs/qa/choice-taxonomy-waivers.json')
const BASELINE_PATH = path.join(REPO_ROOT, 'docs/qa/choice-taxonomy-baseline.json')

const MODE = process.env.CHOICE_TAXONOMY_VALIDATOR_MODE === 'enforce' ? 'enforce' : 'warn'
const STRATEGY: Strategy = process.env.CHOICE_TAXONOMY_STRATEGY === 'threshold' ? 'threshold' : 'ratchet'
const MIN_COVERAGE = Number(process.env.CHOICE_TAXONOMY_MIN_COVERAGE ?? 0.9)
const MAX_SAMPLES = Number(process.env.CHOICE_TAXONOMY_SAMPLE_LIMIT ?? 60)

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim().toLowerCase()
}

function isContinueChoice(text: string): boolean {
  const t = normalizeWhitespace(text)
  return t === '...' || t === 'continue' || t === '(continue)' || t === '[continue]' || t.startsWith('(continue)') || t.startsWith('[continue]')
}

function classifyChoice(choice: ConditionalChoice): TaxonomyClass | null {
  if (choice.taxonomyClass) return choice.taxonomyClass

  const choiceId = choice.choiceId.toLowerCase()
  const text = normalizeWhitespace(choice.text)
  const compactText = text.replace(/^["'(]+/, '')

  if (
    /\baccept\b/.test(choiceId) ||
    /^accept\b/.test(compactText) ||
    /^accept[.\s:]/.test(text)
  ) return 'accept'

  if (
    /\breject\b/.test(choiceId) ||
    /^reject\b/.test(compactText) ||
    /^reject[.\s:]/.test(text)
  ) return 'reject'

  if (
    /\bdeflect\b/.test(choiceId) ||
    /^deflect\b/.test(compactText) ||
    /^deflect[.\s:]/.test(text)
  ) return 'deflect'

  return null
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function readWaivers(): WaiverFile {
  try {
    const raw = fs.readFileSync(WAIVER_PATH, 'utf8')
    return JSON.parse(raw) as WaiverFile
  } catch {
    return { waivers: [] }
  }
}

function readBaseline(): TaxonomyBaseline | null {
  try {
    const raw = fs.readFileSync(BASELINE_PATH, 'utf8')
    return JSON.parse(raw) as TaxonomyBaseline
  } catch {
    return null
  }
}

function writeBaseline(baseline: TaxonomyBaseline): void {
  fs.mkdirSync(path.dirname(BASELINE_PATH), { recursive: true })
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8')
}

function main(): void {
  const args = new Set(process.argv.slice(2))
  const writeBaselineFlag = args.has('--write-baseline')

  const waiverFile = readWaivers()
  const waivers = waiverFile.waivers ?? []
  const waiverMap = new Map(waivers.map((entry) => [entry.nodeId, entry.reason]))

  let eligibleNodes = 0
  let compliantNodes = 0
  let waivedNodes = 0
  let nonCompliantNodes = 0

  const byGraph: Record<string, GraphSummary> = {}
  const nonCompliantSample: Array<{
    graphKey: string
    nodeId: string
    choiceCount: number
    categorizedChoices: Record<TaxonomyClass, string[]>
    uncategorizedChoiceIds: string[]
    waived: boolean
    waiverReason?: string
  }> = []
  const seenEligibleNodeIds = new Set<string>()

  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    let graphEligible = 0
    let graphCompliant = 0
    let graphWaived = 0
    let graphNonCompliant = 0

    for (const node of graph.nodes.values()) {
      const taxonomyChoices = node.choices.filter((choice) => !isContinueChoice(choice.text))
      if (taxonomyChoices.length < 3) continue

      seenEligibleNodeIds.add(node.nodeId)
      graphEligible += 1

      const categorized: Record<TaxonomyClass, string[]> = {
        accept: [],
        reject: [],
        deflect: [],
      }
      const uncategorizedChoiceIds: string[] = []

      for (const choice of taxonomyChoices) {
        const cls = classifyChoice(choice)
        if (cls) categorized[cls].push(choice.choiceId)
        else uncategorizedChoiceIds.push(choice.choiceId)
      }

      const isCompliant = categorized.accept.length > 0 && categorized.reject.length > 0 && categorized.deflect.length > 0
      const waiverReason = waiverMap.get(node.nodeId)

      eligibleNodes += 1
      if (isCompliant) {
        compliantNodes += 1
        graphCompliant += 1
      } else if (waiverReason) {
        waivedNodes += 1
        graphWaived += 1
      } else {
        nonCompliantNodes += 1
        graphNonCompliant += 1
      }

      if (!isCompliant && nonCompliantSample.length < MAX_SAMPLES) {
        nonCompliantSample.push({
          graphKey,
          nodeId: node.nodeId,
          choiceCount: taxonomyChoices.length,
          categorizedChoices: categorized,
          uncategorizedChoiceIds,
          waived: Boolean(waiverReason),
          waiverReason,
        })
      }
    }

    if (graphEligible > 0) {
      byGraph[graphKey] = {
        eligible_nodes: graphEligible,
        compliant_nodes: graphCompliant,
        waived_nodes: graphWaived,
        non_compliant_nodes: graphNonCompliant,
        coverage_percent: round2(((graphCompliant + graphWaived) / graphEligible) * 100),
      }
    }
  }

  const unknownWaiverNodeIds = waivers
    .map((entry) => entry.nodeId)
    .filter((nodeId) => !seenEligibleNodeIds.has(nodeId))

  const coverage = eligibleNodes > 0 ? (compliantNodes + waivedNodes) / eligibleNodes : 1
  const coveragePercent = round2(coverage * 100)

  if (writeBaselineFlag) {
    writeBaseline({
      generated_at: new Date().toISOString(),
      coverage_percent: coveragePercent,
      non_compliant_nodes: nonCompliantNodes,
      notes: 'Choice taxonomy baseline. Ratchet strategy blocks regressions while legacy nodes are migrated.',
    })
  }

  const baseline = readBaseline()

  const regressions: string[] = []
  if (baseline) {
    if (coveragePercent < baseline.coverage_percent) {
      regressions.push(`coverage regression: baseline=${baseline.coverage_percent} current=${coveragePercent}`)
    }
    if (nonCompliantNodes > baseline.non_compliant_nodes) {
      regressions.push(`non_compliant_nodes regression: baseline=${baseline.non_compliant_nodes} current=${nonCompliantNodes}`)
    }
  }
  if (unknownWaiverNodeIds.length > 0) {
    regressions.push(`unknown waiver references: ${unknownWaiverNodeIds.length}`)
  }

  const hasCoverageFailure = coverage < MIN_COVERAGE
  const thresholdFailure = hasCoverageFailure || unknownWaiverNodeIds.length > 0
  const ratchetFailure = !baseline || regressions.length > 0

  const report = {
    generated_at: new Date().toISOString(),
    mode: MODE,
    strategy: STRATEGY,
    thresholds: {
      min_coverage: MIN_COVERAGE,
    },
    summary: {
      eligible_nodes: eligibleNodes,
      compliant_nodes: compliantNodes,
      waived_nodes: waivedNodes,
      non_compliant_nodes: nonCompliantNodes,
      coverage_percent: coveragePercent,
    },
    baseline: baseline ?? null,
    waiver_stats: {
      total_waivers: waivers.length,
      unknown_node_ids: unknownWaiverNodeIds,
    },
    regressions,
    by_graph: byGraph,
    non_compliant_sample: nonCompliantSample,
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  const shouldFail = MODE === 'enforce' && (STRATEGY === 'threshold' ? thresholdFailure : ratchetFailure)

  if (shouldFail) {
    console.error('[verify-choice-taxonomy] FAILED')
    if (STRATEGY === 'threshold') {
      if (hasCoverageFailure) {
        console.error(`- Coverage ${coveragePercent}% is below min ${(MIN_COVERAGE * 100).toFixed(2)}%`)
      }
      if (unknownWaiverNodeIds.length > 0) {
        console.error(`- Waivers reference ineligible/unknown nodes (${unknownWaiverNodeIds.length})`)
      }
    } else {
      if (!baseline) {
        console.error(`- Missing baseline: ${path.relative(REPO_ROOT, BASELINE_PATH)}`)
        console.error(`- Initialize baseline: node --loader ./scripts/ts-loader.mjs scripts/verify-choice-taxonomy.ts --write-baseline`)
      }
      for (const regression of regressions) {
        console.error(`- ${regression}`)
      }
    }
    console.error(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
    process.exit(1)
  }

  if (MODE === 'warn') {
    const warn = STRATEGY === 'threshold' ? thresholdFailure : ratchetFailure
    if (warn) {
      console.warn('[verify-choice-taxonomy] WARN')
      if (STRATEGY === 'threshold') {
        if (hasCoverageFailure) {
          console.warn(`- Coverage ${coveragePercent}% is below min ${(MIN_COVERAGE * 100).toFixed(2)}%`)
        }
        if (unknownWaiverNodeIds.length > 0) {
          console.warn(`- Waivers reference ineligible/unknown nodes (${unknownWaiverNodeIds.length})`)
        }
      } else {
        if (!baseline) {
          console.warn(`- Missing baseline: ${path.relative(REPO_ROOT, BASELINE_PATH)}`)
        }
        for (const regression of regressions) {
          console.warn(`- ${regression}`)
        }
      }
    }
  }

  console.log('[verify-choice-taxonomy] OK')
  console.log(`- Mode: ${MODE}`)
  console.log(`- Strategy: ${STRATEGY}`)
  console.log(`- Eligible nodes: ${eligibleNodes}`)
  console.log(`- Coverage: ${coveragePercent}%`)
  console.log(`- Non-compliant nodes (unwaived): ${nonCompliantNodes}`)
  console.log(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
}

main()
