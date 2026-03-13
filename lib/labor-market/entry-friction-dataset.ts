import entryFrictionDataset from '@/lib/labor-market/data/entry-friction-v1.json'
import type { MarketSignalMetadata } from '@/lib/labor-market/market-signal-contract'
import { normalizeMarketSignalValue } from '@/lib/labor-market/market-signal-contract'
import { loadMarketSignalDataset, type MarketSignalDatasetRecord } from '@/lib/labor-market/market-signal-loader'
import type { SignalDescriptor } from '@/lib/labor-market/signals'

export interface CuratedEntryFrictionMatch {
  descriptor: SignalDescriptor
  metadata: MarketSignalMetadata
  matchType: 'canonical' | 'alias'
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

  const canonicalMatch =
    normalizedId
      ? CURATED_ENTRY_FRICTION.find((entry) =>
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

  const aliasMatch = CURATED_ENTRY_FRICTION.find((entry) =>
    entry.aliases.some((alias) => normalizedName.includes(normalizeMarketSignalValue(alias))),
  )

  if (!aliasMatch) return null

  return {
    descriptor: aliasMatch.descriptor,
    metadata: aliasMatch.metadata,
    matchType: 'alias',
  }
}
