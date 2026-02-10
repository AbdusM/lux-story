import { describe, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

type Baseline = {
  version: number
  tracked_codes: string[]
  total_tracked: number
  counts_by_code: Record<string, number>
  warning_ids: string[]
}

function runValidatorJson(): any {
  const dir = mkdtempSync(join(tmpdir(), 'lux-graph-warnings-'))
  const outPath = join(dir, `dialogue-graph-warnings.${process.pid}.${Date.now()}.json`)
  try {
    execFileSync(
      'node',
      ['--import', 'tsx', 'scripts/validate-dialogue-graphs.ts', '--json', '--out', outPath],
      { stdio: 'ignore' }
    )
    return JSON.parse(readFileSync(outPath, 'utf8'))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

describe('Dialogue Graph Warnings (Debt-Controlled)', () => {
  it('does not introduce new tracked warnings vs baseline', () => {
    const baselinePath = 'docs/qa/dialogue-graph-warnings.baseline.json'
    const baseline: Baseline = JSON.parse(readFileSync(baselinePath, 'utf8'))

    const report = runValidatorJson()
    const tracked = new Set(baseline.tracked_codes)
    const currentIds = new Set<string>()
    const currentCounts: Record<string, number> = {}

    for (const w of report.warnings || []) {
      const code = w.code as string | undefined
      const id = w.warning_id as string | undefined
      if (!code || !id) continue
      if (!tracked.has(code)) continue
      currentIds.add(id)
      currentCounts[code] = (currentCounts[code] || 0) + 1
    }

    const baselineIds = new Set(baseline.warning_ids)
    const newIds = Array.from(currentIds).filter((id) => !baselineIds.has(id)).sort()

    const currentTotal = Array.from(currentIds).length
    const baselineTotal = baseline.total_tracked

    const countRegressions: string[] = []
    for (const code of baseline.tracked_codes) {
      const b = baseline.counts_by_code[code] || 0
      const c = currentCounts[code] || 0
      if (c > b) countRegressions.push(`${code}: ${c} > ${b}`)
    }

    const failures: string[] = []
    if (newIds.length > 0) failures.push(`New warning_ids: ${newIds.slice(0, 50).join(', ')}${newIds.length > 50 ? ` (+${newIds.length - 50} more)` : ''}`)
    if (currentTotal > baselineTotal) failures.push(`Total tracked warnings increased: ${currentTotal} > ${baselineTotal}`)
    if (countRegressions.length > 0) failures.push(`Counts increased: ${countRegressions.join(', ')}`)

    if (failures.length > 0) {
      throw new Error(`Dialogue graph warning regression detected.\n- ${failures.join('\n- ')}\nBaseline: ${baselinePath}`)
    }
  })
})
