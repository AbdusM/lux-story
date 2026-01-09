/**
 * Cognitive Domain Calculator
 *
 * Scoring algorithms for cognitive domain assessment based on skill demonstrations.
 * Follows the evidence-first philosophy: levels are derived from demonstrations,
 * not arbitrary numeric scores.
 *
 * Key Principles:
 * 1. Threshold-based levels (not continuous scores)
 * 2. Pattern boost integration (existing game systems)
 * 3. Confidence based on evidence breadth
 * 4. Research-validated engagement thresholds (ISP: 3x/week)
 */

import { PatternType } from './patterns'
import {
  CognitiveDomainId,
  CognitiveDomainScore,
  DomainEvidence,
  DomainLevel,
  EngagementLevel,
  COGNITIVE_DOMAIN_IDS,
  DOMAIN_METADATA,
  DOMAIN_THRESHOLDS,
  determineDomainLevel,
  determineEngagementLevel,
  getPatternBoostForDomain
} from './cognitive-domains'
import { SkillDemonstration } from './skill-tracker'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PatternScores {
  analytical: number
  patience: number
  exploring: number
  helping: number
  building: number
}

export interface CalculationContext {
  patternScores: PatternScores
  trustMomentum?: number // From trust-derivatives
  patternBalance?: number // From pattern-derivatives
}

export interface EngagementMetrics {
  level: EngagementLevel
  activeDaysLast7: number
  totalDemonstrations: number
  averagePerDay: number
  lastActivityTimestamp: number
}

export interface CognitiveDomainState {
  domains: Record<CognitiveDomainId, CognitiveDomainScore>
  engagement: EngagementMetrics
  lastCalculated: number
}

// -----------------------------------------------------------------------------
// Core Calculation Functions
// -----------------------------------------------------------------------------

/**
 * Calculate score for a single cognitive domain
 *
 * Algorithm:
 * 1. Aggregate skill evidence from demonstrations
 * 2. Apply skill weights
 * 3. Calculate pattern boost
 * 4. Apply derivative modifiers
 * 5. Determine threshold-based level
 * 6. Calculate confidence from evidence breadth
 */
export function calculateDomainScore(
  domainId: CognitiveDomainId,
  demonstrations: SkillDemonstration[],
  context: CalculationContext
): CognitiveDomainScore {
  const metadata = DOMAIN_METADATA[domainId]
  const skillMappings = metadata.skills

  // 1. Aggregate skill evidence
  const evidence: DomainEvidence[] = []
  let rawScore = 0

  for (const mapping of skillMappings) {
    // Count demonstrations for this skill
    const demoCount = countSkillDemonstrations(demonstrations, mapping.skillId)

    // Calculate contribution (capped to prevent single-skill dominance)
    const contributionScore = Math.min(demoCount * mapping.weight, 10)
    rawScore += contributionScore

    evidence.push({
      skillId: mapping.skillId,
      demonstrationCount: demoCount,
      weight: mapping.weight,
      contributionScore
    })
  }

  // 2. Calculate pattern boost (0-40% possible)
  const patternBoost = getPatternBoostForDomain(domainId, context.patternScores)

  // 3. Apply derivative modifiers (optional)
  let derivativeModifier = 1.0
  if (context.trustMomentum !== undefined) {
    // Trust momentum ranges from -1 to 1, convert to 0.9-1.1 multiplier
    derivativeModifier *= 1 + (context.trustMomentum * 0.1)
  }
  if (context.patternBalance !== undefined) {
    // Pattern balance ranges from 0-1, higher balance = slight boost
    derivativeModifier *= 1 + (context.patternBalance * 0.05)
  }

  // 4. Compute adjusted score
  const adjustedScore = (rawScore * (1 + patternBoost)) * derivativeModifier

  // 5. Determine level from thresholds
  const level = determineDomainLevel(adjustedScore)

  // 6. Calculate confidence based on evidence breadth
  const confidence = calculateConfidence(evidence, skillMappings.length)

  return {
    domainId,
    name: metadata.name,
    shortName: metadata.shortName,
    level,
    confidence,
    evidence,
    rawScore: adjustedScore,
    lastUpdated: Date.now()
  }
}

/**
 * Calculate all domain scores at once
 */
export function calculateAllDomainScores(
  demonstrations: SkillDemonstration[],
  context: CalculationContext
): Record<CognitiveDomainId, CognitiveDomainScore> {
  const scores: Partial<Record<CognitiveDomainId, CognitiveDomainScore>> = {}

  for (const domainId of COGNITIVE_DOMAIN_IDS) {
    scores[domainId] = calculateDomainScore(domainId, demonstrations, context)
  }

  return scores as Record<CognitiveDomainId, CognitiveDomainScore>
}

/**
 * Count skill demonstrations across all demonstrations
 */
function countSkillDemonstrations(
  demonstrations: SkillDemonstration[],
  skillId: string
): number {
  return demonstrations.filter(d =>
    d.skillsDemonstrated.includes(skillId)
  ).length
}

/**
 * Calculate confidence score based on evidence breadth
 *
 * Confidence is higher when:
 * - More skills in the domain have been demonstrated
 * - More demonstrations exist overall
 */
function calculateConfidence(
  evidence: DomainEvidence[],
  totalSkillsInDomain: number
): number {
  if (totalSkillsInDomain === 0) return 0

  // Breadth: how many skills have at least one demonstration
  const skillsWithEvidence = evidence.filter(e => e.demonstrationCount > 0).length
  const breadth = skillsWithEvidence / totalSkillsInDomain

  // Depth: average demonstration count per skill (capped)
  const totalDemos = evidence.reduce((sum, e) => sum + e.demonstrationCount, 0)
  const averageDemos = totalDemos / totalSkillsInDomain
  const depth = Math.min(averageDemos / 5, 1) // Cap at 5 demos average for full depth

  // Combined confidence: weighted average of breadth and depth
  const confidence = (breadth * 0.6) + (depth * 0.4)

  return Math.round(confidence * 100) / 100 // Round to 2 decimal places
}

// -----------------------------------------------------------------------------
// Engagement Metrics
// -----------------------------------------------------------------------------

/**
 * Calculate engagement metrics from demonstrations
 * Based on ISP research: 3x/week minimum for cognitive benefits
 */
export function calculateEngagementMetrics(
  demonstrations: SkillDemonstration[]
): EngagementMetrics {
  if (demonstrations.length === 0) {
    return {
      level: 'INACTIVE',
      activeDaysLast7: 0,
      totalDemonstrations: 0,
      averagePerDay: 0,
      lastActivityTimestamp: 0
    }
  }

  // Get last 7 days window
  const now = Date.now()
  const windowStart = now - (7 * 24 * 60 * 60 * 1000)

  // Count unique active days in the last 7 days
  const recentDemos = demonstrations.filter(d => d.timestamp >= windowStart)
  const uniqueDays = new Set(
    recentDemos.map(d => new Date(d.timestamp).toDateString())
  )
  const activeDaysLast7 = uniqueDays.size

  // Calculate average per day (last 7 days)
  const averagePerDay = recentDemos.length / 7

  // Get last activity timestamp
  const lastActivityTimestamp = Math.max(...demonstrations.map(d => d.timestamp))

  return {
    level: determineEngagementLevel(activeDaysLast7),
    activeDaysLast7,
    totalDemonstrations: demonstrations.length,
    averagePerDay: Math.round(averagePerDay * 10) / 10,
    lastActivityTimestamp
  }
}

// -----------------------------------------------------------------------------
// Full State Calculation
// -----------------------------------------------------------------------------

/**
 * Calculate complete cognitive domain state
 */
export function calculateCognitiveDomainState(
  demonstrations: SkillDemonstration[],
  context: CalculationContext
): CognitiveDomainState {
  return {
    domains: calculateAllDomainScores(demonstrations, context),
    engagement: calculateEngagementMetrics(demonstrations),
    lastCalculated: Date.now()
  }
}

// -----------------------------------------------------------------------------
// Incremental Update Functions
// -----------------------------------------------------------------------------

/**
 * Get domains affected by a set of skills
 * Used for efficient incremental updates
 */
export function getAffectedDomains(skills: string[]): CognitiveDomainId[] {
  const affected = new Set<CognitiveDomainId>()

  for (const skill of skills) {
    for (const domainId of COGNITIVE_DOMAIN_IDS) {
      const domainSkills = DOMAIN_METADATA[domainId].skills
      if (domainSkills.some(s => s.skillId === skill)) {
        affected.add(domainId)
      }
    }
  }

  return Array.from(affected)
}

/**
 * Update specific domains after new demonstrations
 * More efficient than recalculating all domains
 */
export function updateAffectedDomains(
  currentState: Record<CognitiveDomainId, CognitiveDomainScore>,
  demonstrations: SkillDemonstration[],
  context: CalculationContext,
  affectedDomainIds: CognitiveDomainId[]
): Record<CognitiveDomainId, CognitiveDomainScore> {
  const newState = { ...currentState }

  for (const domainId of affectedDomainIds) {
    newState[domainId] = calculateDomainScore(domainId, demonstrations, context)
  }

  return newState
}

// -----------------------------------------------------------------------------
// Analysis & Insights
// -----------------------------------------------------------------------------

/**
 * Get top N strongest domains
 */
export function getStrongestDomains(
  domains: Record<CognitiveDomainId, CognitiveDomainScore>,
  n: number = 3
): CognitiveDomainScore[] {
  return Object.values(domains)
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, n)
}

/**
 * Get domains that need development (lowest scores)
 */
export function getDevelopmentAreas(
  domains: Record<CognitiveDomainId, CognitiveDomainScore>,
  n: number = 3
): CognitiveDomainScore[] {
  return Object.values(domains)
    .sort((a, b) => a.rawScore - b.rawScore)
    .slice(0, n)
}

/**
 * Get domains close to next level threshold
 */
export function getDomainsNearThreshold(
  domains: Record<CognitiveDomainId, CognitiveDomainScore>,
  percentWithin: number = 0.2
): CognitiveDomainScore[] {
  const thresholds = [
    DOMAIN_THRESHOLDS.EMERGING,
    DOMAIN_THRESHOLDS.DEVELOPING,
    DOMAIN_THRESHOLDS.FLOURISHING,
    DOMAIN_THRESHOLDS.MASTERY
  ]

  return Object.values(domains).filter(domain => {
    for (const threshold of thresholds) {
      if (domain.rawScore < threshold) {
        const distanceToThreshold = threshold - domain.rawScore
        const thresholdPercent = distanceToThreshold / threshold
        return thresholdPercent <= percentWithin
      }
    }
    return false
  })
}

/**
 * Calculate overall cognitive profile summary
 */
export function getCognitiveProfileSummary(
  domains: Record<CognitiveDomainId, CognitiveDomainScore>
): {
  averageLevel: DomainLevel
  dominantCategory: 'core' | 'advanced' | 'balanced'
  overallConfidence: number
  levelDistribution: Record<DomainLevel, number>
} {
  const domainValues = Object.values(domains)

  // Calculate average raw score
  const averageScore = domainValues.reduce((sum, d) => sum + d.rawScore, 0) / domainValues.length
  const averageLevel = determineDomainLevel(averageScore)

  // Calculate core vs advanced strength
  const coreDomains = domainValues.filter(d => DOMAIN_METADATA[d.domainId].category === 'core')
  const advancedDomains = domainValues.filter(d => DOMAIN_METADATA[d.domainId].category === 'advanced')

  const coreAverage = coreDomains.reduce((sum, d) => sum + d.rawScore, 0) / coreDomains.length
  const advancedAverage = advancedDomains.reduce((sum, d) => sum + d.rawScore, 0) / advancedDomains.length

  let dominantCategory: 'core' | 'advanced' | 'balanced'
  const categoryDiff = Math.abs(coreAverage - advancedAverage)
  if (categoryDiff < 2) {
    dominantCategory = 'balanced'
  } else if (coreAverage > advancedAverage) {
    dominantCategory = 'core'
  } else {
    dominantCategory = 'advanced'
  }

  // Calculate overall confidence
  const overallConfidence = domainValues.reduce((sum, d) => sum + d.confidence, 0) / domainValues.length

  // Count level distribution
  const levelDistribution: Record<DomainLevel, number> = {
    dormant: 0,
    emerging: 0,
    developing: 0,
    flourishing: 0,
    mastery: 0
  }
  for (const domain of domainValues) {
    levelDistribution[domain.level]++
  }

  return {
    averageLevel,
    dominantCategory,
    overallConfidence: Math.round(overallConfidence * 100) / 100,
    levelDistribution
  }
}

// -----------------------------------------------------------------------------
// Research Export
// -----------------------------------------------------------------------------

/**
 * Export cognitive domain data for research/admin dashboard
 * Includes all numeric data for analysis
 */
export interface CognitiveResearchExport {
  userId: string
  timestamp: number
  domains: {
    domainId: string
    name: string
    category: 'core' | 'advanced'
    level: DomainLevel
    rawScore: number
    confidence: number
    evidenceCount: number
    skillBreakdown: Record<string, number>
  }[]
  engagement: EngagementMetrics
  profile: ReturnType<typeof getCognitiveProfileSummary>
  patternCorrelations: Record<PatternType, Record<CognitiveDomainId, number>>
}

export function createResearchExport(
  userId: string,
  state: CognitiveDomainState,
  patternScores: PatternScores
): CognitiveResearchExport {
  const domains = Object.values(state.domains).map(domain => ({
    domainId: domain.domainId,
    name: domain.name,
    category: DOMAIN_METADATA[domain.domainId].category,
    level: domain.level,
    rawScore: Math.round(domain.rawScore * 100) / 100,
    confidence: domain.confidence,
    evidenceCount: domain.evidence.reduce((sum, e) => sum + e.demonstrationCount, 0),
    skillBreakdown: domain.evidence.reduce((acc, e) => {
      acc[e.skillId] = e.demonstrationCount
      return acc
    }, {} as Record<string, number>)
  }))

  // Calculate pattern correlations
  const patternCorrelations: Record<PatternType, Record<CognitiveDomainId, number>> = {
    analytical: {},
    patience: {},
    exploring: {},
    helping: {},
    building: {}
  } as Record<PatternType, Record<CognitiveDomainId, number>>

  for (const pattern of Object.keys(patternScores) as PatternType[]) {
    for (const domainId of COGNITIVE_DOMAIN_IDS) {
      // Create a full PatternScores object with just this pattern active
      const singlePatternScores: PatternScores = {
        analytical: 0,
        patience: 0,
        exploring: 0,
        helping: 0,
        building: 0,
        [pattern]: patternScores[pattern]
      }
      patternCorrelations[pattern][domainId] = getPatternBoostForDomain(
        domainId,
        singlePatternScores
      )
    }
  }

  return {
    userId,
    timestamp: Date.now(),
    domains,
    engagement: state.engagement,
    profile: getCognitiveProfileSummary(state.domains),
    patternCorrelations
  }
}
