import { describe, expect, it } from 'vitest'

import { buildMarketSignalFreshnessReport } from '@/lib/labor-market/market-signal-freshness-report'
import {
  getCuratedEntryFrictionRecords,
} from '@/lib/labor-market/entry-friction-dataset'
import {
  getCuratedObservedExposureRecords,
} from '@/lib/labor-market/observed-exposure-dataset'

describe('market signal freshness report', () => {
  it('includes every curated dataset row in the report summary', () => {
    const expectedRowCount =
      getCuratedObservedExposureRecords().length + getCuratedEntryFrictionRecords().length

    const report = buildMarketSignalFreshnessReport({
      nowIso: '2026-03-12T00:00:00.000Z',
      warningThresholdDays: 14,
    })

    expect(report.summary.totalRows).toBe(expectedRowCount)
    expect(report.summary.freshRows).toBe(expectedRowCount)
    expect(report.summary.warningRows).toBe(0)
    expect(report.summary.staleRows).toBe(0)
    expect(report.summary.invalidTimestampRows).toBe(0)
  })

  it('surfaces warning rows before freshness policy is breached', () => {
    const report = buildMarketSignalFreshnessReport({
      nowIso: '2026-04-10T00:00:00.000Z',
      warningThresholdDays: 10,
    })

    expect(report.summary.warningRows).toBe(report.summary.totalRows)
    expect(report.summary.staleRows).toBe(0)
    expect(report.rows[0]?.status).toBe('warning')
  })

  it('marks rows as stale once they exceed the max-age policy', () => {
    const report = buildMarketSignalFreshnessReport({
      nowIso: '2026-04-20T00:00:00.000Z',
      warningThresholdDays: 10,
    })

    expect(report.summary.staleRows).toBe(report.summary.totalRows)
    expect(report.summary.warningRows).toBe(0)
    expect(report.rows.every((row) => row.status === 'stale')).toBe(true)
  })
})
