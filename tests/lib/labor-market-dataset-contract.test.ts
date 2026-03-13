import { describe, expect, it } from 'vitest'

import { BIRMINGHAM_CAREER_PATHS } from '@/lib/2030-skills-system'
import { getCuratedEntryFrictionRecords } from '@/lib/labor-market/entry-friction-dataset'
import { isMarketSignalStale, MARKET_SIGNAL_MAX_AGE_DAYS } from '@/lib/labor-market/market-signal-contract'
import { getCuratedObservedExposureRecords } from '@/lib/labor-market/observed-exposure-dataset'

function canonicalCareerIds(): string[] {
  return BIRMINGHAM_CAREER_PATHS.map((career) => career.id).sort()
}

function coveredCareerIds(records: { careerIds: string[] }[]): string[] {
  return Array.from(new Set(records.flatMap((record) => record.careerIds))).sort()
}

describe('labor market dataset contracts', () => {
  it('covers every canonical Birmingham lane in observed exposure', () => {
    expect(coveredCareerIds(getCuratedObservedExposureRecords())).toEqual(canonicalCareerIds())
  })

  it('covers every canonical Birmingham lane in entry friction', () => {
    expect(coveredCareerIds(getCuratedEntryFrictionRecords())).toEqual(canonicalCareerIds())
  })

  it('ships complete metadata for every dataset record', () => {
    const records = [
      ...getCuratedObservedExposureRecords(),
      ...getCuratedEntryFrictionRecords(),
    ]

    records.forEach((record) => {
      expect(record.aliases.length).toBeGreaterThan(0)
      expect(record.metadata.summary.length).toBeGreaterThan(0)
      expect(record.metadata.source.length).toBeGreaterThan(0)
      expect(record.metadata.coverage.length).toBeGreaterThan(0)
      expect(record.metadata.methodology.length).toBeGreaterThan(0)
      expect(record.metadata.version.length).toBeGreaterThan(0)
      expect(Number.isNaN(Date.parse(record.metadata.updatedAtIso))).toBe(false)
      expect(record.descriptor.reasons.length).toBeGreaterThan(0)
    })
  })

  it('keeps all dataset timestamps within freshness policy', () => {
    const nowIso = new Date().toISOString()

    getCuratedObservedExposureRecords().forEach((record) => {
      expect(
        isMarketSignalStale(record.metadata, 'observedExposure', nowIso),
        `Observed exposure record is stale beyond ${MARKET_SIGNAL_MAX_AGE_DAYS.observedExposure} days: ${record.metadata.summary}`,
      ).toBe(false)
    })

    getCuratedEntryFrictionRecords().forEach((record) => {
      expect(
        isMarketSignalStale(record.metadata, 'entryFriction', nowIso),
        `Entry friction record is stale beyond ${MARKET_SIGNAL_MAX_AGE_DAYS.entryFriction} days: ${record.metadata.summary}`,
      ).toBe(false)
    })
  })
})
