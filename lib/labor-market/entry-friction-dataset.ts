import entryFrictionDataset from '@/lib/labor-market/data/entry-friction-v1.json'
import type { MarketSignalMetadata } from '@/lib/labor-market/market-signal-contract'
import { normalizeMarketSignalValue } from '@/lib/labor-market/market-signal-contract'
import { loadMarketSignalDataset, type MarketSignalDatasetRecord } from '@/lib/labor-market/market-signal-loader'
import type { SignalDescriptor } from '@/lib/labor-market/signals'

export interface CuratedEntryFrictionMatch {
  descriptor: SignalDescriptor
  metadata: MarketSignalMetadata
}

const CURATED_ENTRY_FRICTION = loadMarketSignalDataset(
  'entry-friction-v1',
  entryFrictionDataset,
) satisfies MarketSignalDatasetRecord[]

export function getCuratedEntryFrictionRecords(): MarketSignalDatasetRecord[] {
  return CURATED_ENTRY_FRICTION
}

export function getCuratedEntryFriction(options: {
  careerId?: string
  careerName: string
}): CuratedEntryFrictionMatch | null {
  const normalizedId = options.careerId ? normalizeMarketSignalValue(options.careerId) : null
  const normalizedName = normalizeMarketSignalValue(options.careerName)

  const match = CURATED_ENTRY_FRICTION.find((entry) => {
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
