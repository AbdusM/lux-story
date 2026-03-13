import observedExposureDataset from '@/lib/labor-market/data/observed-exposure-v1.json' with { type: 'json' }
import { loadMarketSignalDataset, type MarketSignalDatasetRecord } from '@/lib/labor-market/market-signal-loader'
import type { MarketSignalMetadata } from '@/lib/labor-market/market-signal-contract'
import { normalizeMarketSignalValue } from '@/lib/labor-market/market-signal-contract'
import type { SignalDescriptor } from '@/lib/labor-market/signals'

export interface CuratedObservedExposureMatch {
  descriptor: SignalDescriptor
  metadata: MarketSignalMetadata
  matchType: 'canonical' | 'alias'
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

  const canonicalMatch =
    normalizedId
      ? CURATED_OBSERVED_EXPOSURE.find((entry) =>
          entry.careerIds.some((careerId) => normalizeMarketSignalValue(careerId) === normalizedId),
        )
      : null

  if (canonicalMatch) {
    return {
      descriptor: canonicalMatch.descriptor,
      metadata: canonicalMatch.metadata,
      matchType: 'canonical',
    }
  }

  const aliasMatch = CURATED_OBSERVED_EXPOSURE.find((entry) =>
    entry.aliases.some((alias) => normalizedName.includes(normalizeMarketSignalValue(alias))),
  )

  if (!aliasMatch) return null

  return {
    descriptor: aliasMatch.descriptor,
    metadata: aliasMatch.metadata,
    matchType: 'alias',
  }
}
