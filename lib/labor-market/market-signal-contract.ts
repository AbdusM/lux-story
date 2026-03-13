export type MarketSignalConfidence = 'low' | 'medium' | 'high'

export interface MarketSignalMetadata {
  summary: string
  source: string
  updatedAtIso: string
  coverage: string
  confidence: MarketSignalConfidence
  version: string
  methodology: string
}

export function normalizeMarketSignalValue(value: string): string {
  return value.trim().toLowerCase()
}
