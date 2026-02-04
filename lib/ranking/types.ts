/**
 * Ranking System Types
 *
 * Core type definitions for the anime-inspired ranking presentation layer.
 * These types WRAP existing systems - they don't replace them.
 *
 * @module lib/ranking/types
 */

import type { OrbTier } from '@/lib/orbs'
import type { PatternType } from '@/lib/patterns'

// ═══════════════════════════════════════════════════════════════════════════
// RANK CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All ranking system categories
 * Each maps to an anime inspiration and existing game system
 */
export type RankCategory =
  | 'pattern_mastery'    // Claymore-inspired: visible pattern progression
  | 'career_expertise'   // Demon Slayer-inspired: domain mastery levels
  | 'challenge_rating'   // JJK-inspired: difficulty matching
  | 'station_standing'   // OPM-inspired: public recognition
  | 'skill_stars'        // HxH-inspired: contribution honors
  | 'elite_status'       // Bleach-inspired: special designations

/**
 * All rank categories as array for iteration
 */
export const RANK_CATEGORIES: RankCategory[] = [
  'pattern_mastery',
  'career_expertise',
  'challenge_rating',
  'station_standing',
  'skill_stars',
  'elite_status'
]

// ═══════════════════════════════════════════════════════════════════════════
// RANK TIERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generic rank tier structure
 * Reused across all rank categories
 */
export interface RankTier {
  /** Unique identifier (e.g., 'pm_traveler') */
  id: string
  /** Which category this tier belongs to */
  category: RankCategory
  /** 0-indexed level within category */
  level: number
  /** Display name (e.g., "Traveler") */
  name: string
  /** Points required to reach this tier */
  threshold: number
  /** Flavor text for UI */
  description: string
  /** Optional icon variant name */
  iconVariant?: string
  /** Tailwind color token */
  colorToken?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// PLAYER RANK STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Player's rank state for a single category
 *
 * DESIGN PRINCIPLE: Computed view, not stored state.
 * - Points are computed from GameState (patterns, orbs, skills, trust)
 * - Do NOT persist points separately - they will drift from source of truth
 */
export interface PlayerRank {
  /** Which category */
  category: RankCategory
  /** Current tier ID */
  currentTierId: string
  /** Current numeric level (0-indexed) */
  currentLevel: number
  /** Computed: points needed for next tier */
  pointsToNext: number
  /** Computed: 0-100 progress percentage */
  percentToNext: number
  /** Optional: recent rank changes (max 10) */
  history?: RankChangeEvent[]
}

/**
 * Rank change event for history tracking
 */
export interface RankChangeEvent {
  /** When the change occurred */
  timestamp: number
  /** Previous tier ID */
  previousTierId: string
  /** New tier ID */
  newTierId: string
  /** Points change that triggered this */
  pointsDelta: number
  /** Human-readable cause */
  reason: string
  /** Optional scene context */
  sceneId?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL RANKING STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Full ranking state for a player
 * Computed from GameState, not stored separately
 */
export interface RankingState {
  /** Schema version for migrations */
  version: string
  /** Player identifier */
  playerId: string
  /** Ranks by category */
  ranks: Record<RankCategory, PlayerRank>
  /** Unlocked rank-related achievements */
  achievements: string[]
  /** Completed recognition ceremonies */
  ceremonies: string[]
  /** When this state was calculated */
  lastCalculated: number
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN MASTERY (Phase 1)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Station-themed display names for OrbTier values
 * Maps existing orb tiers to narrative presentation
 */
export interface PatternMasteryDisplay {
  /** Station-themed name (e.g., "Traveler") */
  displayName: string
  /** Narrative description */
  description: string
  /** Icon variant for visual display */
  iconVariant: string
}

/**
 * Per-pattern progress view
 */
export interface PatternProgressView {
  /** Pattern type */
  pattern: PatternType
  /** Current point value */
  points: number
  /** Threshold level: 'nascent' | 'emerging' | 'developing' | 'flourishing' */
  thresholdLevel: string
  /** Number of unlocks earned (0-3 at 10%, 50%, 85%) */
  unlocksEarned: number
}

/**
 * Full pattern mastery state
 */
export interface PatternMasteryState {
  /** Overall orb tier */
  overallOrbTier: OrbTier
  /** Station-themed display name */
  overallDisplayName: string
  /** Per-pattern breakdown */
  perPattern: Record<PatternType, PatternProgressView>
  /** Dominant pattern (if any) */
  dominant: PatternType | null
  /** True if all patterns within 2 of each other */
  balanced: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// CAREER EXPERTISE (Phase 2)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Career domains map to character clusters
 */
export type CareerDomain =
  | 'technology'
  | 'healthcare'
  | 'business'
  | 'creative'
  | 'social_impact'

/**
 * All career domains as array
 */
export const CAREER_DOMAINS: CareerDomain[] = [
  'technology',
  'healthcare',
  'business',
  'creative',
  'social_impact'
]

/**
 * Evidence of expertise
 */
export interface ExpertiseEvidence {
  type: 'skill_demonstrated' | 'character_met' | 'arc_completed' | 'trust_built'
  description: string
  timestamp: number
}

/**
 * Per-domain expertise state
 */
export interface DomainExpertise {
  domain: CareerDomain
  tierId: string
  tierName: string
  level: number
  points: number
  percentToNext: number
  isChampion: boolean
  evidence: ExpertiseEvidence[]
}

/**
 * Full career expertise state
 */
export interface CareerExpertiseState {
  domains: Record<CareerDomain, DomainExpertise>
  primaryDomain: CareerDomain | null
  championDomains: CareerDomain[]
  breadth: 'narrow' | 'moderate' | 'broad'
}

// ═══════════════════════════════════════════════════════════════════════════
// CHALLENGE RATING (Phase 3)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Challenge grades for content difficulty
 */
export type ChallengeGrade = 'D' | 'C' | 'B' | 'A' | 'S'

/**
 * Content-player readiness match types
 */
export type ReadinessMatch =
  | 'perfect'     // Grade matches readiness
  | 'comfortable' // Grade is 1 below readiness
  | 'challenging' // Grade is 1 above readiness
  | 'overreach'   // Grade is 2+ above readiness
  | 'trivial'     // Grade is 2+ below readiness

/**
 * Player readiness state
 */
export interface PlayerReadiness {
  grade: ChallengeGrade
  gradeName: string
  percentToNext: number
  dimensions: {
    patternMastery: number    // 0-100
    careerExpertise: number   // 0-100
    relationshipDepth: number // 0-100
    skillBreadth: number      // 0-100
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STATION STANDING (Phase 4)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Station standing tiers
 */
export type StationStandingTier =
  | 'newcomer'
  | 'regular'
  | 'notable'
  | 'distinguished'

/**
 * Merit point breakdown
 */
export interface MeritBreakdown {
  patterns: number
  relationships: number
  discoveries: number
  contributions: number
  total: number
}

/**
 * Billboard entry for highlights
 */
export interface BillboardEntry {
  category: string
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'stable'
}

/**
 * Full billboard state
 */
export interface BillboardState {
  standing: StationStandingTier
  standingName: string
  meritPoints: number
  meritBreakdown: MeritBreakdown
  highlights: BillboardEntry[]
  lastUpdated: number
}

// ═══════════════════════════════════════════════════════════════════════════
// SKILL STARS (Phase 5)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Star levels
 */
export type StarLevel = 0 | 1 | 2 | 3

/**
 * Star types mapped to existing systems
 */
export type StarType =
  | 'mastery'     // Pattern depth
  | 'synthesis'   // Skill combos
  | 'discovery'   // Info tiers found
  | 'connection'  // Relationship depth
  | 'growth'      // Overall progression
  | 'resilience'  // Challenge completion

/**
 * Individual star state
 */
export interface SkillStar {
  type: StarType
  level: StarLevel
  name: string
  description: string
  progress: number // 0-100 to next level
}

/**
 * Full skill stars state
 */
export interface SkillStarsState {
  stars: Record<StarType, SkillStar>
  totalStars: number // Sum of all star levels
  constellation: string // Visual pattern name
}

// ═══════════════════════════════════════════════════════════════════════════
// ELITE STATUS (Phase 7)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Elite designation types
 */
export type EliteDesignation =
  | 'pathfinder'      // First to complete certain content
  | 'bridge_builder'  // Deep multi-domain expertise
  | 'mentor_heart'    // High trust with many characters
  | 'pattern_sage'    // All patterns at threshold
  | 'station_pillar'  // Maximum standing

/**
 * Elite status state
 */
export interface EliteStatusState {
  unlockedDesignations: EliteDesignation[]
  pendingDesignations: EliteDesignation[]
  progress: Record<EliteDesignation, number> // 0-100
}

// ═══════════════════════════════════════════════════════════════════════════
// CEREMONIES (Phase 10)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Ceremony types
 */
export type CeremonyType =
  | 'rank_promotion'
  | 'champion_recognition'
  | 'elite_induction'
  | 'milestone_celebration'
  | 'resonance_event'

/**
 * Ceremony record
 */
export interface CeremonyRecord {
  ceremonyId: string
  type: CeremonyType
  completedAt: number
  playerResponseId?: string
}

/**
 * Ceremony state
 */
export interface CeremonyState {
  completedCeremonies: string[]
  pendingCeremony: string | null
  ceremonyHistory: CeremonyRecord[]
  lastCeremonyAt: number | null
}

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE (Phase 11)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cross-system resonance types
 */
// NOTE: Resonance types (ResonanceType, ResonanceBonus, ResonanceEvent)
// are defined in ./resonance.ts for implementation cohesion.
// Import from there: import type { ResonanceType } from './resonance'

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED DASHBOARD (Phase 11)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Unified progression dashboard state
 */
export interface UnifiedDashboardState {
  // Individual system states
  patternMastery: PatternMasteryState
  careerExpertise: CareerExpertiseState
  challengeRating: PlayerReadiness
  stationStanding: BillboardState
  skillStars: SkillStarsState
  eliteStatus: EliteStatusState

  // Cohort comparison
  cohort: import('./cohorts').CohortComparison

  // Resonance state
  resonance: import('./resonance').ResonanceState

  // Ceremonies
  pendingCeremony: import('./ceremonies').Ceremony | null
  ceremonyHistory: CeremonyRecord[]

  // Meta
  lastUpdated: number
  overallProgression: number // 0-100
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Rank promotion event
 */
export interface RankPromotion {
  category: RankCategory
  previousTierId: string
  newTierId: string
  pattern?: PatternType
  domain?: CareerDomain
  message: string
  isOverall: boolean
}

/**
 * Type guard for RankCategory
 */
export function isRankCategory(value: string): value is RankCategory {
  return RANK_CATEGORIES.includes(value as RankCategory)
}

/**
 * Type guard for CareerDomain
 */
export function isCareerDomain(value: string): value is CareerDomain {
  return CAREER_DOMAINS.includes(value as CareerDomain)
}
