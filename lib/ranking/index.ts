/**
 * Ranking System Module
 *
 * Anime-inspired ranking presentation layer for Lux Story.
 * Wraps existing progression systems with narrative display.
 *
 * @module lib/ranking
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type {
  // Core types
  RankCategory,
  RankTier,
  PlayerRank,
  RankChangeEvent,
  RankingState,
  RankPromotion,

  // Pattern Mastery (Phase 1)
  PatternMasteryDisplay,
  PatternProgressView,
  PatternMasteryState,

  // Career Expertise (Phase 2)
  CareerDomain,
  ExpertiseEvidence,
  DomainExpertise,
  CareerExpertiseState,

  // Challenge Rating (Phase 3)
  ChallengeGrade,
  ReadinessMatch,
  PlayerReadiness,

  // Station Standing (Phase 4)
  StationStandingTier,
  MeritBreakdown,
  BillboardEntry,
  BillboardState,

  // Skill Stars (Phase 5)
  StarLevel,
  StarType,
  SkillStar,
  SkillStarsState,

  // Elite Status (Phase 7)
  EliteDesignation,
  EliteStatusState,

  // Ceremonies (Phase 10)
  CeremonyType,
  CeremonyRecord,
  CeremonyState,

  // Unified Dashboard (Phase 11)
  UnifiedDashboardState
} from './types'

// Constants
export {
  RANK_CATEGORIES,
  CAREER_DOMAINS,
  isRankCategory,
  isCareerDomain
} from './types'

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

export {
  RANK_REGISTRY,
  getTierForPoints,
  getTierById,
  calculateProgress,
  getTiersForCategory,
  getNextTier,
  wouldPromote,
  validateRegistry
} from './registry'

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN MASTERY DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

export {
  PATTERN_MASTERY_DISPLAY,
  SAMUEL_PROMOTION_MESSAGES,
  SAMUEL_PATTERN_MESSAGES,
  getPatternMasteryDisplayName,
  getPatternMasteryDisplayInfo,
  getRankTierIdForOrbTier,
  getSamuelPromotionMessage,
  getSamuelPatternMessage,
  calculatePatternMasteryState,
  checkPatternPromotions
} from './pattern-mastery-display'

// ═══════════════════════════════════════════════════════════════════════════
// CAREER EXPERTISE (Phase 2)
// ═══════════════════════════════════════════════════════════════════════════

export {
  CHARACTER_DOMAIN_MAP,
  EXCLUDED_CHARACTERS,
  DOMAIN_DISPLAY,
  EXPERTISE_TIER_NAMES,
  SAMUEL_EXPERTISE_MESSAGES,
  getCharactersForDomain,
  getDomainForCharacter,
  calculateDomainPoints,
  calculateCareerExpertiseState,
  getDomainTierName,
  isChampionInDomain,
  getSamuelExpertiseMessage
} from './career-expertise'

export type { DomainDisplayInfo, CareerExpertiseInput } from './career-expertise'

// ═══════════════════════════════════════════════════════════════════════════
// CHALLENGE RATING (Phase 3)
// ═══════════════════════════════════════════════════════════════════════════

export {
  GRADE_DISPLAY,
  GRADES,
  MATCH_DISPLAY,
  SAMUEL_GRADE_MESSAGES,
  SAMUEL_MATCH_MESSAGES,
  calculateReadinessScore,
  getGradeForScore,
  getGradeIndex,
  calculatePlayerReadiness,
  getReadinessMatch,
  getSamuelGradeMessage,
  getSamuelMatchMessage,
  getRecommendedGrades,
  filterContentByReadiness
} from './challenge-rating'

export type { ChallengeRatingInput, GradeDisplayInfo, MatchDisplayInfo } from './challenge-rating'

// ═══════════════════════════════════════════════════════════════════════════
// STATION BILLBOARD (Phase 4)
// ═══════════════════════════════════════════════════════════════════════════

export {
  STANDING_DISPLAY,
  STANDING_TIERS,
  MERIT_CATEGORIES,
  SAMUEL_STANDING_MESSAGES,
  calculateMeritBreakdown,
  getStandingForMerit,
  generateHighlights,
  calculateBillboardState,
  getSamuelStandingMessage,
  getMeritPercentages
} from './station-billboard'

export type { BillboardInput, StandingDisplayInfo, MeritCategoryDisplay } from './station-billboard'

// ═══════════════════════════════════════════════════════════════════════════
// SKILL STARS (Phase 5)
// ═══════════════════════════════════════════════════════════════════════════

export {
  STAR_TYPES,
  STAR_TYPE_DISPLAY,
  STAR_LEVEL_DISPLAY,
  CONSTELLATION_NAMES,
  SAMUEL_STAR_MESSAGES,
  SAMUEL_CONSTELLATION_MESSAGES,
  calculateStar,
  calculateSkillStarsState,
  getConstellationName,
  getSamuelStarMessage,
  getSamuelConstellationMessage,
  getStarsAtLevel,
  getNextUpgradeOpportunity,
  hasUpgradeReady
} from './skill-stars'

export type { SkillStarsInput, StarTypeDisplay, StarLevelDisplay } from './skill-stars'

// ═══════════════════════════════════════════════════════════════════════════
// ELITE STATUS (Phase 7)
// ═══════════════════════════════════════════════════════════════════════════

export {
  ELITE_DESIGNATIONS,
  DESIGNATION_DISPLAY,
  SAMUEL_DESIGNATION_MESSAGES,
  SAMUEL_ELITE_TIER_MESSAGES,
  isDesignationUnlocked,
  getDesignationProgress,
  calculateEliteStatusState,
  getEliteTier,
  getSamuelDesignationMessage,
  getSamuelEliteTierMessage,
  getNearestDesignation,
  hasDesignationNearUnlock,
  getPrimaryTitle,
  getAllTitles
} from './elite-status'

export type { EliteStatusInput, DesignationDisplayInfo } from './elite-status'

// ═══════════════════════════════════════════════════════════════════════════
// COHORTS (Phase 9)
// ═══════════════════════════════════════════════════════════════════════════

export {
  SPECIAL_COHORT_NAMES,
  SAMUEL_COHORT_MESSAGES,
  getCohortId,
  getCohortName,
  getCohortDates,
  createCohort,
  getQualitativeStanding,
  getStandingDescription,
  getStandingLabel,
  calculateLocalCohortComparison,
  getSamuelCohortMessage,
  getCohortDisplayInfo,
  formatPercentileDisplay
} from './cohorts'

export type {
  Cohort,
  QualitativeStanding,
  PlayerCohortMetrics,
  CohortComparison,
  CohortStatistics,
  LocalCohortInput,
  CohortDisplayInfo
} from './cohorts'

// ═══════════════════════════════════════════════════════════════════════════
// CEREMONIES (Phase 10)
// ═══════════════════════════════════════════════════════════════════════════

export {
  CEREMONY_REGISTRY,
  CEREMONY_COOLDOWN,
  getCeremonyById,
  getCeremoniesByType,
  getCeremonyByTriggerId,
  createDefaultCeremonyState,
  isCeremonyCompleted,
  completeCeremony,
  setPendingCeremony,
  isCeremonyCooldownActive,
  findEligibleCeremonies,
  getNextCeremony,
  getBackdropClasses,
  getLightingClasses,
  getCeremonyTypeName
} from './ceremonies'

export type {
  CeremonyBackdrop,
  CeremonyLighting,
  CeremonyResponse,
  CeremonyDialogue,
  CeremonyPresentation,
  Ceremony
} from './ceremonies'

// ═══════════════════════════════════════════════════════════════════════════
// CROSS-SYSTEM RESONANCE (Phase 11)
// ═══════════════════════════════════════════════════════════════════════════

export {
  RESONANCE_TYPES,
  RESONANCE_BONUSES,
  RESONANCE_EVENTS,
  SAMUEL_RESONANCE_MESSAGES,
  isResonanceActive,
  getActiveResonances,
  getResonanceMultiplier,
  getAllResonanceMultipliers,
  checkResonanceEvents,
  getResonanceEventById,
  calculateResonanceState,
  getResonanceDisplayInfo,
  getSamuelResonanceMessage,
  createDefaultResonanceInput
} from './resonance'

export type {
  ResonanceType,
  ResonanceBonus,
  ResonanceEvent,
  ResonanceEventReward,
  ResonanceInput,
  ResonanceState,
  ResonanceDisplayInfo
} from './resonance'

// ═══════════════════════════════════════════════════════════════════════════
// ASSESSMENT ARC (Phase 6)
// ═══════════════════════════════════════════════════════════════════════════

export {
  ASSESSMENT_PHASES,
  PHASE_DISPLAY,
  SAMUEL_ASSESSMENT_MESSAGES,
  getSamuelAssessmentStartMessage,
  getSamuelPhaseCompleteMessage,
  getSamuelAssessmentResultMessage,
  createDefaultAssessmentState
} from './assessment-arc'

export type {
  AssessmentPhase,
  AssessmentQuestionType,
  EvaluationType,
  AssessmentOption,
  AssessmentQuestion,
  AssessmentPhaseConfig,
  AssessmentUnlockCondition,
  AssessmentReward,
  AssessmentArc,
  PhaseResult,
  CurrentAssessmentProgress,
  AssessmentResult,
  AssessmentState,
  PhaseDisplayInfo
} from './assessment-arc'

export {
  ASSESSMENT_ARCS,
  getAssessmentById,
  getPhaseConfig,
  getNextPhase,
  isAssessmentUnlocked,
  getAvailableAssessments,
  calculatePhaseScore,
  calculateAssessmentScore,
  startAssessment,
  completePhase,
  abandonAssessment,
  updateAvailableAssessments,
  hasCompletedAssessment,
  getLatestAssessmentResult,
  isAssessmentCompleted,
  getAssessmentProgress
} from './assessment-registry'

export type { UnlockCheckInput } from './assessment-registry'

export {
  FIRST_CROSSING_WRITTEN,
  FIRST_CROSSING_PRACTICAL,
  FIRST_CROSSING_FINALS,
  CROSSROADS_TRIAL_WRITTEN,
  CROSSROADS_TRIAL_PRACTICAL,
  CROSSROADS_TRIAL_FINALS,
  MASTERS_CHALLENGE_WRITTEN,
  MASTERS_CHALLENGE_PRACTICAL,
  MASTERS_CHALLENGE_FINALS
} from './assessment-questions'

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED DASHBOARD (Phase 12)
// ═══════════════════════════════════════════════════════════════════════════

export {
  calculateUnifiedDashboard,
  createDefaultDashboardInput
} from './unified-dashboard'

export type {
  UnifiedDashboardInput
} from './unified-dashboard'
