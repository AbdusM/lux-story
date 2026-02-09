/**
 * Headless Narrative Path Simulation (Vitest gate)
 *
 * This test is the hard gate for deadlocks. The report/baseline ratchet lives
 * in `scripts/verify-narrative-sim.ts`.
 */

import { describe, it, expect } from 'vitest'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import { buildNarrativeSimReport } from '@/lib/qa/narrative-sim'

describe('Narrative Path Simulation (Headless)', () => {
  it('does not encounter deadlocks under bounded enumerative exploration', () => {
    const report = buildNarrativeSimReport(DIALOGUE_GRAPHS)

    if (report.failures.length > 0) {
      // Keep output compact; show first few.
      // eslint-disable-next-line no-console
      console.log('\nSimulated-path failures:')
      for (const f of report.failures.slice(0, 10)) {
        // eslint-disable-next-line no-console
        console.log(`- ${f.graphKey}: ${f.kind}=${f.nodeId}`)
        if (f.trace.length > 0) {
          // eslint-disable-next-line no-console
          console.log(`  trace: ${f.trace.map(s => `${s.nodeId}/${s.choiceId}→${s.nextNodeId}`).join(' | ')}`)
        }
      }
      if (report.failures.length > 10) {
        // eslint-disable-next-line no-console
        console.log(`... and ${report.failures.length - 10} more`)
      }
    }

    expect(report.failures).toEqual([])
  })
})

// Seed hashing removed: exploration is deterministic by choiceId ordering and state hashing.
