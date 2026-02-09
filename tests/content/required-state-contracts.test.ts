/**
 * Required State Guarding Report (informational)
 *
 * NOTE: This uses the same shared report core as the CI verifier script:
 * `scripts/verify-required-state-guarding.ts`.
 *
 * That prevents drift where the test prints noisy false positives while the
 * actual contract gate stays green.
 */

import { describe, it, expect } from 'vitest'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import { buildRequiredStateGuardingReport } from '@/lib/qa/required-state-guarding'

describe('Required State Guarding', () => {
  it('reports nodes whose requiredState is not enforced by any incoming choice (informational)', () => {
    const report = buildRequiredStateGuardingReport(DIALOGUE_GRAPHS)

    if (report.unguarded.length > 0) {
      // eslint-disable-next-line no-console
      console.log('\nRequiredState Guarding Report')
      // eslint-disable-next-line no-console
      console.log(`Unguarded nodes: ${report.unguarded.length}`)
      for (const item of report.unguarded.slice(0, 15)) {
        // eslint-disable-next-line no-console
        console.log(`- ${item.graphKey}/${item.nodeId}`)
        // eslint-disable-next-line no-console
        console.log(`  requiredState: ${JSON.stringify(item.requiredState)}`)
        // eslint-disable-next-line no-console
        console.log(`  unguarded incoming edges: ${item.unguardedIncomingCount}`)
        if (item.exampleIncoming) {
          // eslint-disable-next-line no-console
          console.log(`  example edge: ${item.exampleIncoming.fromGraph}/${item.exampleIncoming.fromNodeId}/${item.exampleIncoming.choiceId}`)
        }
      }
      if (report.unguarded.length > 15) {
        // eslint-disable-next-line no-console
        console.log(`... and ${report.unguarded.length - 15} more`)
      }
    }

    // Informational only.
    expect(report.totals.graphs).toBeGreaterThan(0)
  })
})
