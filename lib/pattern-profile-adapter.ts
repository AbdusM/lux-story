/**
 * Pattern Profile Adapter
 * Aggregates and analyzes user decision-making patterns from Supabase
 *
 * Purpose: Transform pattern_demonstrations table data into actionable insights:
 * - Decision style classification (Analytical Thinker, Curious Explorer, etc.)
 * - Pattern evolution over time (are they becoming more analytical?)
 * - Pattern-skill correlations (analytical → critical thinking)
 * - Pattern diversity metrics (encourage trying different approaches)
 *
 * Data Sources:
 * - pattern_demonstrations table (raw data)
 * - pattern_summaries view (aggregated counts)
 * - pattern_evolution view (time-series)
 * - user_decision_styles view (auto-classification)
 */

import { createClient } from '@supabase/supabase-js'
import {
  type PatternType,
  PATTERN_SKILL_MAP,
  formatPatternName,
  getPatternDescription
} from './patterns'

// Server-side Supabase client with service role (bypasses RLS)
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    const missing = []
    if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL')
    if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}`)
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export interface PatternDemonstration {
  id: string
  patternName: PatternType
  choiceId: string
  choiceText: string
  sceneId: string
  characterId: string
  context: string
  demonstratedAt: string
}

export interface PatternSummary {
  patternName: PatternType
  demonstrationCount: number
  percentage: number
  lastDemonstrated: string | null
  firstDemonstrated: string | null
  scenesInvolved: string[]
  charactersInvolved: string[]
}

export interface PatternEvolutionPoint {
  weekStart: string
  patternName: PatternType
  weeklyCount: number
}

export interface DecisionStyle {
  dominantPattern: PatternType
  dominantPercentage: number
  secondaryPattern: PatternType | null
  secondaryPercentage: number | null
  styleName: string // e.g. "Analytical Thinker" or "Curious Explorer & Patient Listener"
  description: string
}

export interface PatternSkillCorrelation {
  patternName: PatternType
  topSkills: string[] // Skills most frequently demonstrated with this pattern
  skillCount: number
}

export interface PatternDiversityScore {
  score: number // 0-100, higher = more diverse
  totalPatterns: number // How many of 5 patterns used
  entropy: number // Statistical diversity measure
  recommendation: string | null // e.g. "Try exploring pattern for new perspectives"
}

export interface PatternProfile {
  userId: string
  summaries: PatternSummary[]
  evolution: PatternEvolutionPoint[]
  decisionStyle: DecisionStyle | null
  skillCorrelations: PatternSkillCorrelation[]
  diversityScore: PatternDiversityScore
  totalDemonstrations: number
  recentDemonstrations: PatternDemonstration[]
}


/**
 * Fetch all pattern demonstrations for a user from Supabase
 */
async function fetchPatternDemonstrations(userId: string): Promise<PatternDemonstration[]> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('pattern_demonstrations')
    .select('*')
    .eq('user_id', userId)
    .order('demonstrated_at', { ascending: false })

  if (error) {
    console.error('[PatternProfile] Error fetching pattern demonstrations:', error)
    return []
  }

  if (!data) return []

  return data.map(row => ({
    id: row.id,
    patternName: row.pattern_name as PatternType,
    choiceId: row.choice_id,
    choiceText: row.choice_text || '',
    sceneId: row.scene_id || '',
    characterId: row.character_id || '',
    context: row.context || '',
    demonstratedAt: row.demonstrated_at
  }))
}

/**
 * Fetch pattern summaries from Supabase view
 */
async function fetchPatternSummaries(userId: string): Promise<PatternSummary[]> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('pattern_summaries')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('[PatternProfile] Error fetching pattern summaries:', error)
    return []
  }

  if (!data) return []

  // Calculate total for percentages
  const total = data.reduce((sum: number, row: any) => sum + (row.demonstration_count || 0), 0)

  return data.map((row: any) => ({
    patternName: row.pattern_name as PatternType,
    demonstrationCount: row.demonstration_count || 0,
    percentage: total > 0 ? ((row.demonstration_count || 0) / total) * 100 : 0,
    lastDemonstrated: row.last_demonstrated,
    firstDemonstrated: row.first_demonstrated,
    scenesInvolved: row.scenes_involved || [],
    charactersInvolved: row.characters_involved || []
  })).sort((a: PatternSummary, b: PatternSummary) => b.demonstrationCount - a.demonstrationCount)
}

/**
 * Fetch pattern evolution (time-series) from Supabase view
 */
async function fetchPatternEvolution(userId: string): Promise<PatternEvolutionPoint[]> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('pattern_evolution')
    .select('*')
    .eq('user_id', userId)
    .order('week_start', { ascending: true })

  if (error) {
    console.error('[PatternProfile] Error fetching pattern evolution:', error)
    return []
  }

  if (!data) return []

  return data.map((row: any) => ({
    weekStart: row.week_start,
    patternName: row.pattern_name as PatternType,
    weeklyCount: row.weekly_count || 0
  }))
}

/**
 * Fetch decision style from Supabase view
 */
async function fetchDecisionStyle(userId: string): Promise<DecisionStyle | null> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('user_decision_styles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('[PatternProfile] Error fetching decision style:', error)
    return null
  }

  if (!data || !data.dominant_pattern) return null

  const dominantPattern = data.dominant_pattern as PatternType
  const secondaryPattern = data.secondary_pattern as PatternType | null

  return {
    dominantPattern,
    dominantPercentage: data.dominant_percentage || 0,
    secondaryPattern,
    secondaryPercentage: data.secondary_percentage || null,
    styleName: data.decision_style || formatPatternName(dominantPattern),
    description: getPatternDescription(dominantPattern)
  }
}

/**
 * Calculate pattern-skill correlations based on pattern-skill map
 */
function calculatePatternSkillCorrelations(summaries: PatternSummary[]): PatternSkillCorrelation[] {
  return summaries
    .filter(summary => summary.demonstrationCount > 0)
    .map(summary => ({
      patternName: summary.patternName,
      topSkills: PATTERN_SKILL_MAP[summary.patternName],
      skillCount: summary.demonstrationCount
    }))
    .sort((a, b) => b.skillCount - a.skillCount)
}

/**
 * Calculate pattern diversity score (encourages trying different approaches)
 */
function calculatePatternDiversityScore(summaries: PatternSummary[]): PatternDiversityScore {
  const totalPatterns = summaries.filter(s => s.demonstrationCount > 0).length
  const totalDemonstrations = summaries.reduce((sum, s) => sum + s.demonstrationCount, 0)

  if (totalDemonstrations === 0) {
    return {
      score: 0,
      totalPatterns: 0,
      entropy: 0,
      recommendation: null
    }
  }

  // Calculate Shannon entropy (measure of diversity)
  let entropy = 0
  summaries.forEach(summary => {
    if (summary.demonstrationCount > 0) {
      const p = summary.demonstrationCount / totalDemonstrations
      entropy -= p * Math.log2(p)
    }
  })

  // Normalize entropy to 0-100 scale (max entropy for 5 patterns is log2(5) ≈ 2.32)
  const maxEntropy = Math.log2(5)
  const score = (entropy / maxEntropy) * 100

  // Generate recommendation if diversity is low
  let recommendation: string | null = null
  if (score < 50 && totalPatterns < 4) {
    // Find least-used patterns
    const unusedPatterns = (['analytical', 'patience', 'exploring', 'helping', 'building'] as PatternType[])
      .filter(pattern => !summaries.find(s => s.patternName === pattern && s.demonstrationCount > 0))

    if (unusedPatterns.length > 0) {
      const suggestedPattern = unusedPatterns[0]
      recommendation = `Try choosing "${formatPatternName(suggestedPattern)}" options to explore different perspectives`
    } else {
      // All patterns used, but some underutilized
      const leastUsed = summaries
        .filter(s => s.demonstrationCount > 0)
        .sort((a, b) => a.demonstrationCount - b.demonstrationCount)[0]

      if (leastUsed && leastUsed.percentage < 10) {
        recommendation = `Try more "${formatPatternName(leastUsed.patternName)}" approaches for balanced decision-making`
      }
    }
  }

  return {
    score: Math.round(score),
    totalPatterns,
    entropy: Math.round(entropy * 100) / 100,
    recommendation
  }
}

/**
 * Get comprehensive pattern profile for a user
 * Main export function - call this from admin dashboard or student insights
 */
export async function getPatternProfile(userId: string): Promise<PatternProfile> {
  // Fetch all data in parallel
  const [demonstrations, summaries, evolution, decisionStyle] = await Promise.all([
    fetchPatternDemonstrations(userId),
    fetchPatternSummaries(userId),
    fetchPatternEvolution(userId),
    fetchDecisionStyle(userId)
  ])

  // Calculate derived metrics
  const skillCorrelations = calculatePatternSkillCorrelations(summaries)
  const diversityScore = calculatePatternDiversityScore(summaries)

  return {
    userId,
    summaries,
    evolution,
    decisionStyle,
    skillCorrelations,
    diversityScore,
    totalDemonstrations: demonstrations.length,
    recentDemonstrations: demonstrations.slice(0, 10) // Last 10
  }
}

/**
 * Get pattern summary for quick display (without full profile)
 */
export async function getPatternSummaryQuick(userId: string): Promise<{
  totalDemonstrations: number
  decisionStyle: string | null
  topPattern: PatternType | null
}> {
  const decisionStyle = await fetchDecisionStyle(userId)
  const summaries = await fetchPatternSummaries(userId)

  return {
    totalDemonstrations: summaries.reduce((sum, s) => sum + s.demonstrationCount, 0),
    decisionStyle: decisionStyle?.styleName || null,
    topPattern: summaries[0]?.patternName || null
  }
}
