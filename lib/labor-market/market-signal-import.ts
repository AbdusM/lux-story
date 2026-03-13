import marketSignalSourceSnapshot from '@/lib/labor-market/data/market-signal-source-snapshot-v1.json' with { type: 'json' }
import type {
  MarketSignalAuthoringBundle,
  MarketSignalAuthoringRecord,
  MarketSignalSourceDataset,
} from '@/lib/labor-market/market-signal-authoring'
import { z } from 'zod'

const SignalLevelSchema = z.enum(['low', 'medium', 'high', 'unknown'])
const SignalConfidenceSchema = z.enum(['low', 'medium', 'high'])

const MarketSignalSnapshotDefaultsSchema = z.object({
  version: z.string().min(1),
  source: z.string().min(1),
  updatedAtIso: z.string().min(1),
  coverage: z.string().min(1),
})

const MarketSignalSnapshotDescriptorSchema = z.object({
  level: SignalLevelSchema,
  confidence: SignalConfidenceSchema,
  reasons: z.array(z.string()).min(1),
})

const MarketSignalSnapshotSignalSchema = z.object({
  descriptor: MarketSignalSnapshotDescriptorSchema,
  summary: z.string().min(1),
  methodology: z.string().min(1),
  metadataOverrides: z
    .object({
      source: z.string().min(1).optional(),
      updatedAtIso: z.string().min(1).optional(),
      coverage: z.string().min(1).optional(),
      confidence: SignalConfidenceSchema.optional(),
      version: z.string().min(1).optional(),
    })
    .optional(),
})

const MarketSignalSnapshotLaneSchema = z.object({
  careerIds: z.array(z.string()),
  aliases: z.array(z.string()).min(1),
  observedExposure: MarketSignalSnapshotSignalSchema.optional(),
  entryFriction: MarketSignalSnapshotSignalSchema.optional(),
})

const MarketSignalSourceSnapshotSchema = z.object({
  version: z.string().min(1),
  defaults: z.object({
    observedExposure: MarketSignalSnapshotDefaultsSchema,
    entryFriction: MarketSignalSnapshotDefaultsSchema,
  }),
  lanes: z.array(MarketSignalSnapshotLaneSchema).min(1),
})

type MarketSignalSnapshotSignal = z.infer<typeof MarketSignalSnapshotSignalSchema>
type MarketSignalSnapshotLane = z.infer<typeof MarketSignalSnapshotLaneSchema>
export type MarketSignalSourceSnapshot = z.infer<typeof MarketSignalSourceSnapshotSchema>

function toAuthoringRecord(
  lane: MarketSignalSnapshotLane,
  signal: MarketSignalSnapshotSignal,
): MarketSignalAuthoringRecord {
  return {
    careerIds: lane.careerIds,
    aliases: lane.aliases,
    descriptor: signal.descriptor,
    summary: signal.summary,
    methodology: signal.methodology,
    ...(signal.metadataOverrides
      ? { metadataOverrides: signal.metadataOverrides }
      : {}),
  }
}

function buildSourceDataset(
  snapshot: MarketSignalSourceSnapshot,
  key: 'observedExposure' | 'entryFriction',
): MarketSignalSourceDataset {
  return {
    version: snapshot.defaults[key].version,
    defaults: {
      source: snapshot.defaults[key].source,
      updatedAtIso: snapshot.defaults[key].updatedAtIso,
      coverage: snapshot.defaults[key].coverage,
    },
    records: snapshot.lanes
      .filter((lane) => lane[key] !== undefined)
      .map((lane) => toAuthoringRecord(lane, lane[key]!)),
  }
}

export function loadMarketSignalSourceSnapshot(
  value: unknown = marketSignalSourceSnapshot,
): MarketSignalSourceSnapshot {
  return MarketSignalSourceSnapshotSchema.parse(value)
}

export function buildMarketSignalAuthoringBundleFromSnapshot(
  snapshot: MarketSignalSourceSnapshot = loadMarketSignalSourceSnapshot(),
): MarketSignalAuthoringBundle {
  return {
    observedExposure: buildSourceDataset(snapshot, 'observedExposure'),
    entryFriction: buildSourceDataset(snapshot, 'entryFriction'),
  }
}
