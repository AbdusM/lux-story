/**
 * Zod Schema Exports
 *
 * Centralized exports for all runtime validation schemas.
 * Use these to validate data from localStorage, API responses, etc.
 */

// Player data schemas
export {
  // Primitive schemas
  ResponseSpeedSchema,
  StressResponseSchema,
  SocialOrientationSchema,
  ProblemApproachSchema,
  CommunicationStyleSchema,
  ReadinessLevelSchema,
  RelationshipStatusSchema,
  MilestoneTypeSchema,
  PatternNameSchema,

  // Compound schemas
  BehavioralProfileSchema,
  SkillDemonstrationItemSchema,
  CareerExplorationItemSchema,
  KeyMomentSchema,
  RelationshipSchema,
  ChoiceHistoryItemSchema,
  PatternValueSchema,
  MilestoneItemSchema,
  LocalPlayerDataSchema,

  // Validation helpers
  parseLocalPlayerData,
  validateLocalPlayerData,

  // Types
  type ResponseSpeed,
  type StressResponse,
  type SocialOrientation,
  type ProblemApproach,
  type CommunicationStyle,
  type ReadinessLevel,
  type RelationshipStatus,
  type MilestoneType,
  type PatternName,
  type BehavioralProfile,
  type SkillDemonstrationItem,
  type CareerExplorationItem,
  type KeyMoment,
  type Relationship,
  type ChoiceHistoryItem,
  type PatternValue,
  type MilestoneItem,
  type LocalPlayerData
} from './player-data'

// Queued action schemas
export {
  // Action type schemas
  ActionTypeSchema,

  // Data schemas
  CareerAnalyticsDataSchema,
  SkillSummaryDataSchema,
  SkillDemonstrationDataSchema,
  CareerExplorationDataSchema,
  PatternDemonstrationDataSchema,
  RelationshipProgressDataSchema,
  PlatformStateDataSchema,
  InteractionEventDataSchema,

  // Action schemas
  QueuedActionBaseSchema,
  QueuedActionSchema,
  TypedQueuedActionSchema,
  SyncQueueSchema,

  // Result schemas
  SyncResultSchema,
  QueueStatsSchema,

  // Validation helpers
  parseSyncQueue,
  validateQueuedAction,
  validateTypedQueuedAction,

  // Types
  type ActionType,
  type CareerAnalyticsData,
  type SkillSummaryData,
  type SkillDemonstrationData,
  type CareerExplorationData,
  type PatternDemonstrationData,
  type RelationshipProgressData,
  type PlatformStateData,
  type InteractionEventData,
  type QueuedAction,
  type TypedQueuedAction,
  type SyncResult,
  type QueueStats
} from './queued-action'
