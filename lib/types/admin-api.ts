/**
 * Admin API Response Types
 * Type definitions for admin dashboard API responses
 *
 * These types ensure type safety across admin components
 * and eliminate `any` type usage.
 */

// ============================================================================
// Skill-Related Types
// ============================================================================

export interface SkillDemonstration {
  id: string
  user_id: string
  skill_name: string
  scene_id: string
  scene_description: string | null
  choice_text: string
  context: string
  demonstrated_at: string
}

export interface SkillSummary {
  id: string
  user_id: string
  skill_name: string
  demonstration_count: number
  latest_context: string | null
  scenes_involved: string[]
  scene_descriptions: string[]
  updated_at: string
}

export interface SkillEvidence {
  totalDemonstrations: number
  uniqueSkills: number
  skills: Record<string, {
    count: number
    demonstrations: Array<{
      scene: string
      sceneDescription: string
      context: string
      timestamp: string
    }>
  }>
  hasRealData: boolean
}

// ============================================================================
// Career-Related Types
// ============================================================================

export type ReadinessLevel = 'exploratory' | 'emerging' | 'near_ready' | 'ready'

export interface CareerExploration {
  id: string
  user_id: string
  career_name: string
  match_score: number
  readiness_level: ReadinessLevel
  local_opportunities: string[]
  education_paths: string[]
  explored_at: string
}

export interface CareerReadiness {
  careersExplored: number
  topMatch: {
    name: string
    score: number
    readiness: ReadinessLevel
  } | null
  readinessDistribution: {
    exploratory: number
    emerging: number
    near_ready: number
    ready: number
  }
  careers: CareerExploration[]
  hasRealData: boolean
}

// ============================================================================
// Pattern-Related Types
// ============================================================================

export type PatternName = 'helping' | 'analytical' | 'analyzing' | 'building' | 'exploring' | 'patience' | 'rushing'

export interface PatternDemonstration {
  id: string
  user_id: string
  pattern_name: PatternName
  scene_id: string
  context: string
  demonstrated_at: string
}

export interface PatternData {
  pattern_name: PatternName
  pattern_value: number
  demonstration_count: number
}

export interface PatternRecognition {
  patterns: PatternData[]
  dominantPattern: PatternName | null
  consistencyScore: number
  progression: Array<{
    timestamp: string
    patterns: Record<PatternName, number>
  }>
  hasRealData: boolean
}

// ============================================================================
// Relationship-Related Types
// ============================================================================

export type RelationshipStatus = 'stranger' | 'acquaintance' | 'friend' | 'confidant'

export interface RelationshipProgress {
  id: string
  user_id: string
  character_name: string
  trust_level: number
  relationship_status: RelationshipStatus
  last_interaction: string
  interaction_count: number
  key_moments: Array<{
    scene_id: string
    choice_text: string
    context: string
    occurred_at: string
  }>
}

export interface RelationshipFramework {
  totalRelationships: number
  averageTrustLevel: number
  relationships: RelationshipProgress[]
  hasRealData: boolean
}

// ============================================================================
// Player Profile Types
// ============================================================================

export interface PlayerProfile {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  last_activity: string
  current_scene_id: string | null
  current_character_id: string | null
  has_started: boolean
  journey_started_at: string | null
  completion_percentage: number
  total_demonstrations: number
  game_version: string
  platform: string
}

// ============================================================================
// Urgency Types (Glass Box)
// ============================================================================

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical'

export interface UrgencyScore {
  player_id: string
  urgency_score: number
  urgency_level: UrgencyLevel
  disengagement_score: number
  confusion_score: number
  stress_score: number
  isolation_score: number
  urgency_narrative: string
  last_calculated: string
  calculation_reason: string
}

// ============================================================================
// Evidence Framework (6 Frameworks Combined)
// ============================================================================

export interface TimeInvestment {
  totalDays: number
  totalDemonstrations: number
  averagePerDay: number
  timeline: Array<{
    date: string
    count: number
  }>
  hasRealData: boolean
}

export interface BehavioralConsistency {
  topSkills: Array<{
    name: string
    count: number
  }>
  explorationScore: number
  skillsBreadth: number
  totalSkillsAvailable: number
  hasRealData: boolean
}

export interface EvidenceFrameworks {
  skillEvidence: SkillEvidence
  careerReadiness: CareerReadiness
  patternRecognition: PatternRecognition
  relationships: RelationshipFramework
  timeInvestment: TimeInvestment
  behavioralConsistency: BehavioralConsistency
}

// ============================================================================
// API Response Types
// ============================================================================

export interface AdminEvidenceResponse {
  success: boolean
  userId: string
  profile: PlayerProfile | null
  frameworks: EvidenceFrameworks
  fetchedAt: string
}

export interface AdminUserListResponse {
  success: boolean
  users: Array<{
    user_id: string
    last_activity: string
    total_demonstrations: number
    has_started: boolean
  }>
}

export interface AdminUrgencyResponse {
  success: boolean
  urgency: UrgencyScore | null
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface AdminSectionProps {
  userId: string
  profile: PlayerProfile
  adminViewMode: 'educator' | 'researcher' | 'developer'
}

export interface SkillDataPoint {
  name: string
  count: number
  percentage: number
}

export interface CareerMatchDisplay {
  name: string
  score: number
  readiness: ReadinessLevel
  opportunities: string[]
  educationPaths: string[]
}

// ============================================================================
// Chart Data Types
// ============================================================================

export interface ChartDataPoint {
  name: string
  value: number
  fill?: string
}

export interface TimeSeriesPoint {
  date: string
  value: number
  label?: string
}

export interface ProgressionPoint {
  timestamp: string
  [key: string]: string | number
}
