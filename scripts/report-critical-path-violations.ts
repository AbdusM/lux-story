#!/usr/bin/env node
/* eslint-disable no-console */

import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { GameStateUtils } from '@/lib/character-state'
import { simulateCriticalPath } from '@/lib/validators/critical-path-sim'

type Baseline = {
  version: number
  signatures: string[]
}

type Config = {
  version: number
  fixture: string
  start_node_ids: string[]
  max_steps: number
  max_states: number
  max_unique_states_per_node?: number
}

function signatureFor(startNodeId: string, v: { type: string; node_id: string; character_id: string | null }): string {
  return `${startNodeId}|${v.type}|${v.character_id ?? 'unknown'}|${v.node_id}`
}

const args = new Set(process.argv.slice(2))
const updateBaseline = args.has('--update-baseline')

function readArg(name: string): string | null {
  const ix = process.argv.indexOf(name)
  if (ix < 0) return null
  return process.argv[ix + 1] ?? null
}

function deriveOutPaths(qaDir: string, cfgPath: string): { reportPath: string; baselinePath: string } {
  const cfgBase = cfgPath.split('/').pop() || ''
  // Default (legacy)
  if (cfgBase === 'critical-path-contracts.config.json') {
    return {
      reportPath: join(qaDir, 'critical-path-violations.report.json'),
      baselinePath: join(qaDir, 'critical-path-violations.baseline.json'),
    }
  }

  // Convention: critical-path-contracts.<name>.config.json -> critical-path-violations.<name>.{report,baseline}.json
  const m = cfgBase.match(/^critical-path-contracts\.(.+)\.config\.json$/)
  const tag = m?.[1] || cfgBase.replace(/\.config\.json$/, '').replace(/^critical-path-contracts\./, '')
  return {
    reportPath: join(qaDir, `critical-path-violations.${tag}.report.json`),
    baselinePath: join(qaDir, `critical-path-violations.${tag}.baseline.json`),
  }
}

const qaDir = join(process.cwd(), 'docs', 'qa')
mkdirSync(qaDir, { recursive: true })

const cfgPath = readArg('--config') ?? join(qaDir, 'critical-path-contracts.config.json')
const cfg: Config = JSON.parse(readFileSync(cfgPath, 'utf8'))
const derived = deriveOutPaths(qaDir, cfgPath)
const reportOut = readArg('--report-out') ?? derived.reportPath
const baselineOut = readArg('--baseline-out') ?? derived.baselinePath

const maxSteps = Number(readArg('--max-steps') ?? cfg.max_steps)
const maxStates = Number(readArg('--max-states') ?? cfg.max_states)
const maxUniqueStatesPerNode = Number(readArg('--max-unique-states-per-node') ?? (cfg.max_unique_states_per_node ?? NaN))

const s = GameStateUtils.createNewGameState(cfg.fixture)
const startNodeIds = cfg.start_node_ids

const all = startNodeIds.flatMap((startNodeId) => {
  const { violations } = simulateCriticalPath(s, {
    start_node_id: startNodeId,
    max_steps: Number.isFinite(maxSteps) ? maxSteps : cfg.max_steps,
    max_states: Number.isFinite(maxStates) ? maxStates : cfg.max_states,
    max_unique_states_per_node: Number.isFinite(maxUniqueStatesPerNode) ? maxUniqueStatesPerNode : cfg.max_unique_states_per_node,
  })
  return violations.map(v => ({ startNodeId, v }))
})

const signatures = Array.from(new Set(all.map(({ startNodeId, v }) => signatureFor(startNodeId, v)))).sort()
const report = {
  fixture: cfg.fixture,
  start_node_ids: startNodeIds,
  max_steps: maxSteps,
  max_states: maxStates,
  max_unique_states_per_node: Number.isFinite(maxUniqueStatesPerNode) ? maxUniqueStatesPerNode : (cfg.max_unique_states_per_node ?? null),
  violation_count: all.length,
  violations: all.map(({ startNodeId, v }) => ({ ...v, start_node_id: startNodeId })),
}

writeFileSync(reportOut, JSON.stringify(report, null, 2) + '\n', 'utf8')

console.log(`[critical-path] violations=${all.length}`)
console.log(`[critical-path] report=${reportOut}`)
console.log(`[critical-path] config=${cfgPath}`)

if (updateBaseline) {
  const baseline: Baseline = { version: 2, signatures }
  writeFileSync(baselineOut, JSON.stringify(baseline, null, 2) + '\n', 'utf8')
  console.log(`[critical-path] baseline updated: ${baselineOut}`)
}
