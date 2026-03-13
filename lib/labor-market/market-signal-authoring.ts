import marketSignalAuthoringBundle from '@/lib/labor-market/data/market-signal-authoring-v1.json' with { type: 'json' }
import type { MarketSignalDatasetRecord } from '@/lib/labor-market/market-signal-loader'
import { z } from 'zod'

const SignalLevelSchema = z.enum(['low', 'medium', 'high', 'unknown'])
const SignalConfidenceSchema = z.enum(['low', 'medium', 'high'])

const MarketSignalAuthoringRecordSchema = z.object({
  careerIds: z.array(z.string()),
  aliases: z.array(z.string()).min(1),
  descriptor: z.object({
    level: SignalLevelSchema,
    confidence: SignalConfidenceSchema,
    reasons: z.array(z.string()).min(1),
  }),
  summary: z.string().min(1),
  methodology: z.string().min(1),
  metadataOverrides: z.object({
    source: z.string().min(1).optional(),
    updatedAtIso: z.string().min(1).optional(),
    coverage: z.string().min(1).optional(),
    confidence: SignalConfidenceSchema.optional(),
    version: z.string().min(1).optional(),
  }).optional(),
})

const MarketSignalSourceDatasetSchema = z.object({
  version: z.string().min(1),
  defaults: z.object({
    source: z.string().min(1),
    updatedAtIso: z.string().min(1),
    coverage: z.string().min(1),
  }),
  records: z.array(MarketSignalAuthoringRecordSchema).min(1),
})

const MarketSignalAuthoringBundleSchema = z.object({
  observedExposure: MarketSignalSourceDatasetSchema,
  entryFriction: MarketSignalSourceDatasetSchema,
})

export type MarketSignalAuthoringRecord = z.infer<typeof MarketSignalAuthoringRecordSchema>
export type MarketSignalSourceDataset = z.infer<typeof MarketSignalSourceDatasetSchema>
export type MarketSignalAuthoringBundle = z.infer<typeof MarketSignalAuthoringBundleSchema>

export interface MarketSignalDatasetArtifacts {
  observedExposure: MarketSignalDatasetRecord[]
  entryFriction: MarketSignalDatasetRecord[]
}

function materializeDataset(
  definition: MarketSignalSourceDataset,
): MarketSignalDatasetRecord[] {
  return definition.records.map((record) => ({
    careerIds: record.careerIds,
    aliases: record.aliases,
    descriptor: record.descriptor,
    metadata: {
      summary: record.summary,
      source: record.metadataOverrides?.source ?? definition.defaults.source,
      updatedAtIso: record.metadataOverrides?.updatedAtIso ?? definition.defaults.updatedAtIso,
      coverage: record.metadataOverrides?.coverage ?? definition.defaults.coverage,
      confidence: record.metadataOverrides?.confidence ?? record.descriptor.confidence,
      version: record.metadataOverrides?.version ?? definition.version,
      methodology: record.methodology,
    },
  }))
}

export function loadMarketSignalAuthoringBundle(
  value: unknown = marketSignalAuthoringBundle,
): MarketSignalAuthoringBundle {
  return MarketSignalAuthoringBundleSchema.parse(value)
}

export function buildMarketSignalDatasetArtifacts(
  bundle: MarketSignalAuthoringBundle = loadMarketSignalAuthoringBundle(),
): MarketSignalDatasetArtifacts {
  return {
    observedExposure: materializeDataset(bundle.observedExposure),
    entryFriction: materializeDataset(bundle.entryFriction),
  }
}
