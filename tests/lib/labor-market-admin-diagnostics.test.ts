import { describe, expect, it } from 'vitest'

import { BIRMINGHAM_CAREER_PATHS } from '@/lib/2030-skills-system'
import { buildAdminLaborMarketSignalReport } from '@/lib/labor-market/admin-diagnostics'

describe('buildAdminLaborMarketSignalReport', () => {
  it('summarizes freshness totals and canonical coverage for both signal families', () => {
    const report = buildAdminLaborMarketSignalReport({
      nowIso: '2026-03-13T00:00:00.000Z',
      warningThresholdDays: 14,
    })

    expect(report.datasets).toHaveLength(2)
    expect(report.totals.totalRows).toBeGreaterThan(0)
    expect(report.totals.warningRows).toBe(0)
    expect(report.totals.staleRows).toBe(0)
    expect(report.fallbackRisk.totalMissingCanonicalMatches).toBe(0)

    report.datasets.forEach((dataset) => {
      expect(dataset.canonicalCareerCount).toBe(BIRMINGHAM_CAREER_PATHS.length)
      expect(dataset.canonicalCoverageCount).toBe(BIRMINGHAM_CAREER_PATHS.length)
      expect(dataset.missingCanonicalCareerIds).toEqual([])
      expect(dataset.nextExpirationDays).not.toBeNull()
    })
  })

  it('surfaces upcoming expirations before freshness is breached', () => {
    const report = buildAdminLaborMarketSignalReport({
      nowIso: '2026-04-10T00:00:00.000Z',
      warningThresholdDays: 10,
    })

    expect(report.totals.warningRows).toBe(report.totals.totalRows)
    expect(report.urgentRows).toEqual([])
    expect(report.upcomingExpirations[0]?.status).toBe('warning')
  })
})
