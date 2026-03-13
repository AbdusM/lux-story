import type { MarketSignalMetadata } from '@/lib/labor-market/market-signal-contract'

type RawSignalLevel = 'low' | 'medium' | 'high' | 'unknown'
type RawSignalConfidence = 'low' | 'medium' | 'high'

export interface MarketSignalDatasetRecord {
  careerIds: string[]
  aliases: string[]
  descriptor: {
    level: RawSignalLevel
    confidence: RawSignalConfidence
    reasons: string[]
  }
  metadata: MarketSignalMetadata
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function isMarketSignalMetadata(value: unknown): value is MarketSignalMetadata {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.summary === 'string' &&
    typeof candidate.source === 'string' &&
    typeof candidate.updatedAtIso === 'string' &&
    typeof candidate.coverage === 'string' &&
    typeof candidate.confidence === 'string' &&
    typeof candidate.version === 'string' &&
    typeof candidate.methodology === 'string'
  )
}

function isMarketSignalDatasetRecord(value: unknown): value is MarketSignalDatasetRecord {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Record<string, unknown>
  const descriptor = candidate.descriptor as Record<string, unknown> | undefined

  return (
    isStringArray(candidate.careerIds) &&
    isStringArray(candidate.aliases) &&
    !!descriptor &&
    (descriptor.level === 'low' ||
      descriptor.level === 'medium' ||
      descriptor.level === 'high' ||
      descriptor.level === 'unknown') &&
    (descriptor.confidence === 'low' ||
      descriptor.confidence === 'medium' ||
      descriptor.confidence === 'high') &&
    isStringArray(descriptor.reasons) &&
    isMarketSignalMetadata(candidate.metadata)
  )
}

export function loadMarketSignalDataset(
  datasetName: string,
  value: unknown,
): MarketSignalDatasetRecord[] {
  if (!Array.isArray(value)) {
    throw new Error(`${datasetName} must be an array of market-signal records.`)
  }

  value.forEach((record, index) => {
    if (!isMarketSignalDatasetRecord(record)) {
      throw new Error(`${datasetName} contains an invalid record at index ${index}.`)
    }
  })

  return value
}
