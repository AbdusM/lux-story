export type MarketSignalConfidence = 'low' | 'medium' | 'high'
export type MarketSignalKind = 'observedExposure' | 'entryFriction'

export interface MarketSignalMetadata {
  summary: string
  source: string
  updatedAtIso: string
  coverage: string
  confidence: MarketSignalConfidence
  version: string
  methodology: string
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export const MARKET_SIGNAL_MAX_AGE_DAYS: Record<MarketSignalKind, number> = {
  observedExposure: 45,
  entryFriction: 30,
}

export function normalizeMarketSignalValue(value: string): string {
  return value.trim().toLowerCase()
}

export function getMarketSignalAgeDays(
  metadata: MarketSignalMetadata,
  nowIso: string = new Date().toISOString(),
): number | null {
  const updatedAt = Date.parse(metadata.updatedAtIso)
  const now = Date.parse(nowIso)

  if (Number.isNaN(updatedAt) || Number.isNaN(now)) return null
  if (updatedAt > now) return 0

  return Math.floor((now - updatedAt) / MS_PER_DAY)
}

export function isMarketSignalStale(
  metadata: MarketSignalMetadata,
  kind: MarketSignalKind,
  nowIso: string = new Date().toISOString(),
): boolean {
  const ageDays = getMarketSignalAgeDays(metadata, nowIso)
  if (ageDays === null) return true

  return ageDays > MARKET_SIGNAL_MAX_AGE_DAYS[kind]
}

export function describeMarketSignalFreshness(
  metadata: MarketSignalMetadata,
  kind: MarketSignalKind,
  nowIso: string = new Date().toISOString(),
): string {
  const ageDays = getMarketSignalAgeDays(metadata, nowIso)
  if (ageDays === null) {
    return 'Freshness could not be verified because the signal timestamp is invalid.'
  }

  const maxAgeDays = MARKET_SIGNAL_MAX_AGE_DAYS[kind]
  if (ageDays > maxAgeDays) {
    return `Signal is stale: updated ${ageDays} days ago (policy target: ${maxAgeDays} days or less).`
  }

  return `Signal is within freshness policy: updated ${ageDays} days ago (policy target: ${maxAgeDays} days or less).`
}
