/**
 * Zod Schema for Game State Serialization
 *
 * Phase 3C: Validates serialized game state from localStorage.
 * Provides graceful recovery for corrupted or outdated saves.
 *
 * USAGE:
 *   const result = SerializedGameStateSchema.safeParse(jsonData)
 *   if (!result.success) {
 *     console.error('Save corrupted:', result.error)
 *     return null  // Triggers fresh game state
 *   }
 *   return GameStateUtils.deserialize(result.data)
 */

import { z } from 'zod'

// Character ID union (matches lib/graph-registry.ts CharacterId)
const CharacterIdSchema = z.enum([
  'samuel', 'maya', 'devon', 'jordan', 'marcus', 'tess', 'yaquin', 'kai',
  'alex', 'rohan', 'silas', 'elena', 'grace', 'asha', 'lira', 'zara',
  'quinn', 'dante', 'nadia', 'isaiah',
  'station_entry', 'grand_hall', 'market', 'deep_station'
])

// Nervous system state (polyvagal theory states)
const NervousSystemStateSchema = z.enum([
  'ventral_vagal',  // Safe, Social, Connected (Low Anxiety)
  'sympathetic',    // Mobilized, Anxious, Flight/Fight (High Anxiety)
  'dorsal_vagal'    // Shutdown, Disconnected, Numb (Overwhelmed)
])

// Chemical reaction (optional)
const ChemicalReactionSchema = z.object({
  cortisol: z.number(),
  dopamine: z.number(),
  oxytocin: z.number()
}).nullable()

// Relationship status
const RelationshipStatusSchema = z.enum(['stranger', 'acquaintance', 'confidant'])

// Trust timeline point (D-039)
const TrustTimelinePointSchema = z.object({
  timestamp: z.number(),
  trust: z.number(),
  event: z.string(),
  nodeId: z.string(),
  delta: z.number()
})

// Character state in serialized form
// Lenient schema that accepts partial data and provides defaults
const SerializedCharacterSchema = z.object({
  characterId: z.string(),
  trust: z.number().default(0),
  anxiety: z.number().default(0),
  nervousSystemState: NervousSystemStateSchema.optional().default('ventral_vagal'),
  lastReaction: ChemicalReactionSchema.optional().default(null),
  knowledgeFlags: z.array(z.string()).optional().default([]),
  relationshipStatus: RelationshipStatusSchema.optional().default('stranger'),
  conversationHistory: z.array(z.string()).optional().default([]),
  trustTimeline: z.object({
    characterId: z.string(),
    points: z.array(TrustTimelinePointSchema).default([]),
    peakTrust: z.number().default(0),
    peakTimestamp: z.number().default(0),
    lowestTrust: z.number().default(10),
    lowestTimestamp: z.number().default(0),
    currentStreak: z.number().default(0)
  }).optional()
})

// Player patterns
const PlayerPatternsSchema = z.object({
  analytical: z.number().default(0),
  patience: z.number().default(0),
  exploring: z.number().default(0),
  helping: z.number().default(0),
  building: z.number().default(0)
})

// Active thought
const ActiveThoughtSchema = z.object({
  id: z.string(),
  isInternalized: z.boolean().default(false)
})

// Platform state
const PlatformStateSchema = z.object({
  visited: z.boolean().default(false),
  explored: z.number().default(0),
  unlocked: z.boolean().default(false)
})

// Career values
const CareerValuesSchema = z.object({
  money: z.number().default(50),
  prestige: z.number().default(50),
  security: z.number().default(50),
  creativity: z.number().default(50),
  impact: z.number().default(50)
})

// Mystery state
const MysteryStateSchema = z.object({
  stationOrigin: z.number().default(0),
  playerPurpose: z.number().default(0),
  characterSecrets: z.record(z.string(), z.number()).default({})
})

// Time state
const TimeStateSchema = z.object({
  totalMinutes: z.number().default(0),
  currentMoment: z.string().default('dawn')
})

// Quiet hour state
const QuietHourStateSchema = z.object({
  available: z.boolean().default(false),
  lastTriggered: z.number().nullable().default(null)
})

// Items state
const ItemsStateSchema = z.object({
  letter: z.enum(['kept', 'torn', 'shown', 'burned']).default('kept'),
  safeSpot: z.string().optional(),
  discoveredPaths: z.array(z.string()).default([])
})

// Pending check-in
const PendingCheckInSchema = z.object({
  characterId: z.string(),
  scheduledTime: z.number(),
  reason: z.string()
})

// Archivist state
const ArchivistStateSchema = z.object({
  collectedRecords: z.array(z.string()).default([]),
  verifiedLore: z.array(z.string()).default([]),
  sensoryCalibration: z.record(z.string(), z.number()).default({})
})

// Iceberg mention
const IcebergMentionSchema = z.object({
  characterId: z.string(),
  nodeId: z.string(),
  mentionText: z.string(),
  timestamp: z.number()
})

// Iceberg reference
const IcebergReferenceSchema = z.object({
  id: z.string(),
  topic: z.string(),
  description: z.string(),
  mentionThreshold: z.number(),
  investigationNodeId: z.string(),
  mentions: z.array(IcebergMentionSchema).default([])
})

// Iceberg state (D-019)
const IcebergStateSchema = z.object({
  references: z.array(IcebergReferenceSchema).default([]),
  investigatedTopics: z.array(z.string()).default([])
}).optional()

// Pattern evolution entry (D-040)
const PatternEvolutionEntrySchema = z.object({
  nodeId: z.string(),
  characterId: z.string(),
  pattern: z.string(),
  delta: z.number(),
  totalAfter: z.number(),
  timestamp: z.number(),
  choicePreview: z.string().optional()
})

// Pattern evolution history (D-040)
const PatternEvolutionHistorySchema = z.object({
  entries: z.array(PatternEvolutionEntrySchema).default([]),
  patternTotals: z.record(z.string(), z.number()).default({})
}).optional()

// Story arc state (D-061)
const StoryArcStateSchema = z.object({
  activeArcs: z.array(z.string()).default([]),
  completedArcs: z.array(z.string()).default([]),
  chapterProgress: z.array(z.tuple([z.string(), z.number()])).default([]),
  completedChapters: z.array(z.string()).default([])
}).optional()

// Skill usage record
const SkillUsageRecordSchema = z.object({
  count: z.number().default(0),
  lastUsed: z.number().optional(),
  contexts: z.array(z.string()).default([])
})

// Skill usage entry
const SkillUsageEntrySchema = z.object({
  key: z.string(),
  value: SkillUsageRecordSchema
})

/**
 * Main serialized game state schema
 * This validates the JSON structure loaded from localStorage
 */
export const SerializedGameStateSchema = z.object({
  saveVersion: z.string().default('1.0.0'),
  playerId: z.string(),
  characters: z.array(SerializedCharacterSchema).default([]),
  globalFlags: z.array(z.string()).default([]),
  patterns: PlayerPatternsSchema.default({
    analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0
  }),
  lastSaved: z.number().default(Date.now()),
  currentNodeId: z.string().default('station_arrival'),
  currentCharacterId: CharacterIdSchema.default('samuel'),
  thoughts: z.array(ActiveThoughtSchema).default([]),
  episodeNumber: z.number().default(1),
  sessionStartTime: z.number().default(Date.now()),
  sessionBoundariesCrossed: z.number().default(0),
  platforms: z.record(z.string(), PlatformStateSchema).default({}),
  careerValues: CareerValuesSchema.default({
    money: 50, prestige: 50, security: 50, creativity: 50, impact: 50
  }),
  mysteries: MysteryStateSchema.default({
    stationOrigin: 0, playerPurpose: 0, characterSecrets: {}
  }),
  time: TimeStateSchema.default({ totalMinutes: 0, currentMoment: 'dawn' }),
  quietHour: QuietHourStateSchema.default({ available: false, lastTriggered: null }),
  overdensity: z.number().default(0.3),
  items: ItemsStateSchema.default({ letter: 'kept', discoveredPaths: [] }),
  pendingCheckIns: z.array(PendingCheckInSchema).default([]),
  unlockedAbilities: z.array(z.string()).default([]),
  archivistState: ArchivistStateSchema.default({
    collectedRecords: [], verifiedLore: [], sensoryCalibration: {}
  }),
  icebergState: IcebergStateSchema,
  patternEvolutionHistory: PatternEvolutionHistorySchema,
  storyArcState: StoryArcStateSchema,
  skillLevels: z.record(z.string(), z.number()).default({}),
  skillUsage: z.array(SkillUsageEntrySchema).default([])
})

// Type inference from schema
export type ValidatedSerializedGameState = z.infer<typeof SerializedGameStateSchema>

/**
 * Safely parse and validate serialized game state
 * Returns null for corrupted/invalid data instead of throwing
 */
export function safeParseGameState(data: unknown): ValidatedSerializedGameState | null {
  const result = SerializedGameStateSchema.safeParse(data)

  if (!result.success) {
    // Log the validation errors for debugging
    // Zod v4 uses 'issues' not 'errors'
    const issues = result.error?.issues ?? []
    console.error('[GameStateSchema] Validation failed:', {
      errors: issues.slice(0, 5).map(e => ({
        path: e.path?.map(String).join('.') ?? 'unknown',
        message: e.message ?? 'unknown error',
        code: e.code ?? 'unknown'
      }))
    })
    return null
  }

  return result.data
}

/**
 * Check if serialized data is valid without parsing
 * Useful for quick validation before full deserialization
 */
export function isValidGameState(data: unknown): data is ValidatedSerializedGameState {
  return SerializedGameStateSchema.safeParse(data).success
}
