import { describe, expect, it } from 'vitest'
import { GameStateUtils } from '@/lib/character-state'
import { simulateCriticalPath } from '@/lib/validators/critical-path-sim'
import { readFileSync } from 'fs'
import { join } from 'path'

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
}

function signatureFor(startNodeId: string, v: { type: string; node_id: string; character_id: string | null }): string {
  return `${startNodeId}|${v.type}|${v.character_id ?? 'unknown'}|${v.node_id}`
}

describe('Critical Path Contracts (AAA)', () => {
  it('does not introduce new strict requiredState violations or early soft-deadlocks (baseline early game)', () => {
    const cfgPath = join(process.cwd(), 'docs', 'qa', 'critical-path-contracts.config.json')
    const cfg: Config = JSON.parse(readFileSync(cfgPath, 'utf8'))

    const baselinePath = join(process.cwd(), 'docs', 'qa', 'critical-path-violations.baseline.json')
    const baseline: Baseline = JSON.parse(readFileSync(baselinePath, 'utf8'))

    const s = GameStateUtils.createNewGameState(cfg.fixture)
    const violations = cfg.start_node_ids.flatMap((startNodeId) => {
      return simulateCriticalPath(s, {
        start_node_id: startNodeId,
        max_steps: cfg.max_steps,
        max_states: cfg.max_states,
      }).violations.map(v => ({ startNodeId, v }))
    })

    const sigs = violations.map(({ startNodeId, v }) => signatureFor(startNodeId, v))
    const baselineSigs = new Set(baseline.signatures)
    const newOnes = sigs.filter(sig => !baselineSigs.has(sig))

    // Fail only on regression (AAA debt-controlled gate).
    expect(newOnes).toEqual([])
  })
})
