import { getCuratedEntryFrictionRecords } from '@/lib/labor-market/entry-friction-dataset'
import { getCuratedObservedExposureRecords } from '@/lib/labor-market/observed-exposure-dataset'
import {
  getMarketSignalAgeDays,
  isMarketSignalStale,
  MARKET_SIGNAL_MAX_AGE_DAYS,
  type MarketSignalConfidence,
  type MarketSignalKind,
  type MarketSignalMetadata,
} from '@/lib/labor-market/market-signal-contract'

export type MarketSignalFreshnessStatus = 'fresh' | 'warning' | 'stale' | 'invalid_timestamp'

export interface MarketSignalFreshnessRow {
  kind: MarketSignalKind
  summary: string
  source: string
  version: string
  updatedAtIso: string
  coverage: string
  confidence: MarketSignalConfidence
  ageDays: number | null
  maxAgeDays: number
  daysUntilStale: number | null
  status: MarketSignalFreshnessStatus
}

export interface MarketSignalFreshnessReport {
  generatedAtIso: string
  warningThresholdDays: number
  summary: {
    totalRows: number
    freshRows: number
    warningRows: number
    staleRows: number
    invalidTimestampRows: number
  }
  rows: MarketSignalFreshnessRow[]
}

function buildFreshnessRow(options: {
  kind: MarketSignalKind
  metadata: MarketSignalMetadata
  nowIso: string
  warningThresholdDays: number
}): MarketSignalFreshnessRow {
  const { kind, metadata, nowIso, warningThresholdDays } = options
  const maxAgeDays = MARKET_SIGNAL_MAX_AGE_DAYS[kind]
  const ageDays = getMarketSignalAgeDays(metadata, nowIso)
  const stale = isMarketSignalStale(metadata, kind, nowIso)
  const daysUntilStale = ageDays === null ? null : Math.max(maxAgeDays - ageDays, 0)

  let status: MarketSignalFreshnessStatus = 'fresh'
  if (ageDays === null) {
    status = 'invalid_timestamp'
  } else if (stale) {
    status = 'stale'
  } else if (daysUntilStale !== null && daysUntilStale <= warningThresholdDays) {
    status = 'warning'
  }

  return {
    kind,
    summary: metadata.summary,
    source: metadata.source,
    version: metadata.version,
    updatedAtIso: metadata.updatedAtIso,
    coverage: metadata.coverage,
    confidence: metadata.confidence,
    ageDays,
    maxAgeDays,
    daysUntilStale,
    status,
  }
}

function sortByOperationalPriority(
  left: MarketSignalFreshnessRow,
  right: MarketSignalFreshnessRow,
): number {
  const statusRank: Record<MarketSignalFreshnessStatus, number> = {
    stale: 0,
    invalid_timestamp: 1,
    warning: 2,
    fresh: 3,
  }

  const rankDelta = statusRank[left.status] - statusRank[right.status]
  if (rankDelta !== 0) return rankDelta

  const daysDelta = (left.daysUntilStale ?? Number.POSITIVE_INFINITY) - (right.daysUntilStale ?? Number.POSITIVE_INFINITY)
  if (daysDelta !== 0) return daysDelta

  const kindDelta = left.kind.localeCompare(right.kind)
  if (kindDelta !== 0) return kindDelta

  return left.summary.localeCompare(right.summary)
}

export function buildMarketSignalFreshnessReport(options: {
  nowIso?: string
  warningThresholdDays?: number
} = {}): MarketSignalFreshnessReport {
  const nowIso = options.nowIso ?? new Date().toISOString()
  const warningThresholdDays = options.warningThresholdDays ?? 14

  const rows = [
    ...getCuratedObservedExposureRecords().map((record) =>
      buildFreshnessRow({
        kind: 'observedExposure',
        metadata: record.metadata,
        nowIso,
        warningThresholdDays,
      }),
    ),
    ...getCuratedEntryFrictionRecords().map((record) =>
      buildFreshnessRow({
        kind: 'entryFriction',
        metadata: record.metadata,
        nowIso,
        warningThresholdDays,
      }),
    ),
  ].sort(sortByOperationalPriority)

  return {
    generatedAtIso: nowIso,
    warningThresholdDays,
    summary: {
      totalRows: rows.length,
      freshRows: rows.filter((row) => row.status === 'fresh').length,
      warningRows: rows.filter((row) => row.status === 'warning').length,
      staleRows: rows.filter((row) => row.status === 'stale').length,
      invalidTimestampRows: rows.filter((row) => row.status === 'invalid_timestamp').length,
    },
    rows,
  }
}
