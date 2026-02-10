#!/usr/bin/env node
/* eslint-disable no-console */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { GameStateUtils } from '@/lib/character-state'
import { simulateCriticalPath } from '@/lib/validators/critical-path-sim'

type Baseline = {
  version: number
  signatures: string[]
}

function signatureFor(v: { type: string; node_id: string; character_id: string | null }): string {
  return `${v.type}|${v.character_id ?? 'unknown'}|${v.node_id}`
}

const args = new Set(process.argv.slice(2))
const updateBaseline = args.has('--update-baseline')

function readArg(name: string): string | null {
  const ix = process.argv.indexOf(name)
  if (ix < 0) return null
  return process.argv[ix + 1] ?? null
}

const s = GameStateUtils.createNewGameState('baseline_early_game_v1')
const startNodeId = readArg('--start-node') ?? s.currentNodeId
const maxSteps = Number(readArg('--max-steps') ?? 18)
const maxStates = Number(readArg('--max-states') ?? 600)

const { violations } = simulateCriticalPath(s, {
  start_node_id: startNodeId,
  max_steps: Number.isFinite(maxSteps) ? maxSteps : 18,
  max_states: Number.isFinite(maxStates) ? maxStates : 600,
})

const signatures = Array.from(new Set(violations.map(signatureFor))).sort()
const report = {
  fixture: 'baseline_early_game_v1',
  start_node_id: startNodeId,
  max_steps: maxSteps,
  max_states: maxStates,
  violation_count: violations.length,
  violations,
}

const qaDir = join(process.cwd(), 'docs', 'qa')
mkdirSync(qaDir, { recursive: true })

const reportPath = join(qaDir, 'critical-path-violations.report.json')
writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8')

console.log(`[critical-path] violations=${violations.length}`)
console.log(`[critical-path] report=${reportPath}`)

if (updateBaseline) {
  const baseline: Baseline = { version: 1, signatures }
  const baselinePath = join(qaDir, 'critical-path-violations.baseline.json')
  writeFileSync(baselinePath, JSON.stringify(baseline, null, 2) + '\n', 'utf8')
  console.log(`[critical-path] baseline updated: ${baselinePath}`)
}
