import { BIRMINGHAM_CAREER_PATHS } from '@/lib/2030-skills-system'
import { getCuratedEntryFrictionRecords } from '@/lib/labor-market/entry-friction-dataset'
import {
  type MarketSignalFreshnessRow,
  buildMarketSignalFreshnessReport,
} from '@/lib/labor-market/market-signal-freshness-report'
import {
  MARKET_SIGNAL_MAX_AGE_DAYS,
  normalizeMarketSignalValue,
  type MarketSignalKind,
} from '@/lib/labor-market/market-signal-contract'
import { getCuratedObservedExposureRecords } from '@/lib/labor-market/observed-exposure-dataset'
import type {
  AdminLaborMarketSignalDatasetSummary,
  AdminLaborMarketSignalReport,
  AdminLaborMarketSignalRowSummary,
} from '@/lib/types/admin-api'

function toRowSummary(row: MarketSignalFreshnessRow): AdminLaborMarketSignalRowSummary {
  return {
    kind: row.kind,
    summary: row.summary,
    source: row.source,
    version: row.version,
    updatedAtIso: row.updatedAtIso,
    coverage: row.coverage,
    confidence: row.confidence,
    ageDays: row.ageDays,
    maxAgeDays: row.maxAgeDays,
    daysUntilStale: row.daysUntilStale,
    status: row.status,
  }
}

function countRowsByStatus(
  rows: MarketSignalFreshnessRow[],
  status: MarketSignalFreshnessRow['status'],
): number {
  return rows.filter((row) => row.status === status).length
}

function summarizeDataset(options: {
  kind: MarketSignalKind
  rows: MarketSignalFreshnessRow[]
  recordCareerIds: string[][]
  canonicalCareerIds: string[]
}): AdminLaborMarketSignalDatasetSummary {
  const normalizedCanonicalCareerIds = options.canonicalCareerIds.map(normalizeMarketSignalValue)
  const coveredCareerIds = new Set(
    options.recordCareerIds.flatMap((careerIds) => careerIds.map(normalizeMarketSignalValue)),
  )
  const missingCanonicalCareerIds = normalizedCanonicalCareerIds.filter(
    (careerId) => !coveredCareerIds.has(careerId),
  )
  const nextExpirationDays = options.rows.reduce<number | null>((closest, row) => {
    if (row.daysUntilStale === null) return closest
    if (closest === null) return row.daysUntilStale
    return Math.min(closest, row.daysUntilStale)
  }, null)
  const canonicalRecordCount = options.recordCareerIds.filter((careerIds) => careerIds.length > 0).length
  const aliasOnlyRecordCount = options.recordCareerIds.filter((careerIds) => careerIds.length === 0).length
  const canonicalCoverageCount = options.canonicalCareerIds.length - missingCanonicalCareerIds.length

  return {
    kind: options.kind,
    totalRows: options.rows.length,
    freshRows: countRowsByStatus(options.rows, 'fresh'),
    warningRows: countRowsByStatus(options.rows, 'warning'),
    staleRows: countRowsByStatus(options.rows, 'stale'),
    invalidTimestampRows: countRowsByStatus(options.rows, 'invalid_timestamp'),
    canonicalCoverageCount,
    canonicalCareerCount: options.canonicalCareerIds.length,
    canonicalCoveragePercent:
      options.canonicalCareerIds.length === 0
        ? 0
        : Math.round((canonicalCoverageCount / options.canonicalCareerIds.length) * 100),
    canonicalRecordCount,
    aliasOnlyRecordCount,
    missingCanonicalCareerIds,
    nextExpirationDays,
    maxAgeDays: MARKET_SIGNAL_MAX_AGE_DAYS[options.kind],
  }
}

export function buildAdminLaborMarketSignalReport(options: {
  nowIso?: string
  warningThresholdDays?: number
} = {}): AdminLaborMarketSignalReport {
  const canonicalCareerIds = BIRMINGHAM_CAREER_PATHS.map((career) => career.id)
  const freshnessReport = buildMarketSignalFreshnessReport(options)
  const observedRecords = getCuratedObservedExposureRecords()
  const entryRecords = getCuratedEntryFrictionRecords()
  const observedRows = freshnessReport.rows.filter((row) => row.kind === 'observedExposure')
  const entryRows = freshnessReport.rows.filter((row) => row.kind === 'entryFriction')

  const observedSummary = summarizeDataset({
    kind: 'observedExposure',
    rows: observedRows,
    recordCareerIds: observedRecords.map((record) => record.careerIds),
    canonicalCareerIds,
  })
  const entrySummary = summarizeDataset({
    kind: 'entryFriction',
    rows: entryRows,
    recordCareerIds: entryRecords.map((record) => record.careerIds),
    canonicalCareerIds,
  })

  return {
    generatedAt: freshnessReport.generatedAtIso,
    warningThresholdDays: freshnessReport.warningThresholdDays,
    totals: { ...freshnessReport.summary },
    datasets: [observedSummary, entrySummary],
    upcomingExpirations: freshnessReport.rows
      .filter((row) => row.status === 'fresh' || row.status === 'warning')
      .slice(0, 6)
      .map(toRowSummary),
    urgentRows: freshnessReport.rows
      .filter((row) => row.status === 'stale' || row.status === 'invalid_timestamp')
      .map(toRowSummary),
    fallbackRisk: {
      totalMissingCanonicalMatches:
        observedSummary.missingCanonicalCareerIds.length + entrySummary.missingCanonicalCareerIds.length,
      observedExposureMissingCareerIds: observedSummary.missingCanonicalCareerIds,
      entryFrictionMissingCareerIds: entrySummary.missingCanonicalCareerIds,
      aliasOnlyRowCount: observedSummary.aliasOnlyRecordCount + entrySummary.aliasOnlyRecordCount,
    },
  }
}
