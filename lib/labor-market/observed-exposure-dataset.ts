import observedExposureDataset from '@/lib/labor-market/data/observed-exposure-v1.json'
import { loadMarketSignalDataset, type MarketSignalDatasetRecord } from '@/lib/labor-market/market-signal-loader'
import type { MarketSignalMetadata } from '@/lib/labor-market/market-signal-contract'
import { normalizeMarketSignalValue } from '@/lib/labor-market/market-signal-contract'
import type { SignalDescriptor } from '@/lib/labor-market/signals'

export interface CuratedObservedExposureMatch {
  descriptor: SignalDescriptor
  metadata: MarketSignalMetadata
}

const CURATED_OBSERVED_EXPOSURE = loadMarketSignalDataset(
  'observed-exposure-v1',
  observedExposureDataset,
) satisfies MarketSignalDatasetRecord[]

export function getCuratedObservedExposureRecords(): MarketSignalDatasetRecord[] {
  return CURATED_OBSERVED_EXPOSURE
}

export function getCuratedObservedExposure(options: {
  careerId?: string
  careerName: string
}): CuratedObservedExposureMatch | null {
  const normalizedId = options.careerId ? normalizeMarketSignalValue(options.careerId) : null
  const normalizedName = normalizeMarketSignalValue(options.careerName)

  const match = CURATED_OBSERVED_EXPOSURE.find((entry) => {
    if (
      normalizedId &&
      entry.careerIds.some((careerId) => normalizeMarketSignalValue(careerId) === normalizedId)
    ) {
      return true
    }

    return entry.aliases.some((alias) => normalizedName.includes(normalizeMarketSignalValue(alias)))
  })

  if (!match) return null

  return {
    descriptor: match.descriptor,
    metadata: match.metadata,
  }
}
