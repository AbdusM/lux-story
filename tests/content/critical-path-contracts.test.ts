import { describe, expect, it } from 'vitest'
import { GameStateUtils } from '@/lib/character-state'
import { simulateCriticalPath } from '@/lib/validators/critical-path-sim'
import { readFileSync } from 'fs'
import { join } from 'path'

type Baseline = {
  version: number
  signatures: string[]
}

function signatureFor(v: { type: string; node_id: string; character_id: string | null }): string {
  return `${v.type}|${v.character_id ?? 'unknown'}|${v.node_id}`
}

describe('Critical Path Contracts (AAA)', () => {
  it('does not introduce new strict requiredState violations or early soft-deadlocks (baseline early game)', () => {
    const baselinePath = join(process.cwd(), 'docs', 'qa', 'critical-path-violations.baseline.json')
    const baseline: Baseline = JSON.parse(readFileSync(baselinePath, 'utf8'))

    const s = GameStateUtils.createNewGameState('baseline_early_game_v1')
    const { violations } = simulateCriticalPath(s, {
      start_node_id: s.currentNodeId,
      max_steps: 70,
      max_states: 6000,
    })

    const sigs = violations.map(signatureFor)
    const baselineSigs = new Set(baseline.signatures)
    const newOnes = sigs.filter(sig => !baselineSigs.has(sig))

    // Fail only on regression (AAA debt-controlled gate).
    expect(newOnes).toEqual([])
  })
})
