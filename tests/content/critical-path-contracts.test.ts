import { describe, expect, it } from 'vitest'
import { GameStateUtils } from '@/lib/character-state'
import { simulateCriticalPath } from '@/lib/validators/critical-path-sim'
import { readFileSync, readdirSync } from 'fs'
import { join, basename } from 'path'

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
  it('does not introduce new strict requiredState violations or soft-deadlocks under fixture baselines (debt-controlled)', () => {
    const qaDir = join(process.cwd(), 'docs', 'qa')
    const cfgFiles = readdirSync(qaDir)
      .filter((f) => /^critical-path-contracts(\..+)?\.config\.json$/.test(f))
      .sort()

    expect(cfgFiles.length).toBeGreaterThan(0)

    const failures: string[] = []

    for (const cfgFile of cfgFiles) {
      const cfgPath = join(qaDir, cfgFile)
      const cfg: Config = JSON.parse(readFileSync(cfgPath, 'utf8'))

      const tag = cfgFile === 'critical-path-contracts.config.json'
        ? null
        : cfgFile.replace(/^critical-path-contracts\./, '').replace(/\.config\.json$/, '')

      const baselinePath = tag
        ? join(qaDir, `critical-path-violations.${tag}.baseline.json`)
        : join(qaDir, 'critical-path-violations.baseline.json')

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

      if (newOnes.length > 0) {
        failures.push(
          [
            `config=${basename(cfgPath)}`,
            `baseline=${basename(baselinePath)}`,
            `fixture=${cfg.fixture}`,
            `new_violations=${newOnes.length}`,
            ...newOnes.slice(0, 50).map((s) => `  ${s}`),
            newOnes.length > 50 ? `  ... (${newOnes.length - 50} more)` : null,
          ].filter(Boolean).join('\n')
        )
      }
    }

    // Fail only on regression (AAA debt-controlled gate).
    expect(failures).toEqual([])
  }, 30_000)
})
