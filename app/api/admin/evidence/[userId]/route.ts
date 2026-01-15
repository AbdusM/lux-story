import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'
import { auditLog } from '@/lib/audit-logger'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { createTimer } from '@/lib/api-timing'

/**
 * Admin Evidence API
 * Aggregates real Supabase data for Evidence Tab frameworks
 *
 * Optimizations:
 * - Column projection (only fetch needed fields)
 * - Pre-indexed skill data maps for O(1) lookups
 * - Response caching with 30s TTL
 */

// Simple in-memory cache with TTL
const evidenceCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL_MS = 30 * 1000 // 30 seconds

// Rate limiter: 10 requests per minute (multiple parallel queries per request)
const evidenceLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  // Authentication check - verify user role
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  // Rate limiting: 10 requests per minute (multiple queries per request)
  const ip = getClientIp(request)
  try {
    await evidenceLimiter.check(ip, 10)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '60'
        }
      }
    )
  }

  const { userId } = await params

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  // Check cache first
  const cacheKey = `evidence:${userId}`
  const cached = evidenceCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    logger.debug('Evidence cache hit', { operation: 'admin.evidence', userId })
    return NextResponse.json(cached.data, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'private, max-age=30' }
    })
  }

  try {
    const supabase = getAdminSupabaseClient()
    const queryTimer = createTimer('admin.evidence.queries', { userId })

    // Parallel queries with column projection (only fetch needed fields)
    let profileResult, skillDemosResult, skillSummariesResult, careerExplorationsResult, relationshipsResult, platformStatesResult
    try {
      [
        profileResult,
        skillDemosResult,
        skillSummariesResult,
        careerExplorationsResult,
        relationshipsResult,
        platformStatesResult
      ] = await Promise.all([
        // Player profile - only needed fields
        supabase
          .from('player_profiles')
          .select('user_id, created_at, updated_at, last_activity')
          .eq('user_id', userId)
          .abortSignal(AbortSignal.timeout(10000))
          .single(),

        // Skill demonstrations - only needed fields
        supabase
          .from('skill_demonstrations')
          .select('skill_name, scene_id, scene_description, demonstrated_at')
          .eq('user_id', userId)
          .order('demonstrated_at', { ascending: true })
          .abortSignal(AbortSignal.timeout(10000)),

        // Skill summaries - only needed fields
        supabase
          .from('skill_summaries')
          .select('skill_name, latest_context, scenes_involved, scene_descriptions')
          .eq('user_id', userId)
          .abortSignal(AbortSignal.timeout(10000)),

        // Career explorations - only needed fields
        supabase
          .from('career_explorations')
          .select('career_name, match_score, readiness_level, local_opportunities')
          .eq('user_id', userId)
          .order('match_score', { ascending: false })
          .abortSignal(AbortSignal.timeout(10000)),

        // Relationships - only needed fields
        supabase
          .from('relationship_progress')
          .select('character_name, trust_level, last_interaction, key_moments')
          .eq('user_id', userId)
          .abortSignal(AbortSignal.timeout(10000)),

        // Platform states - only needed field
        supabase
          .from('platform_states')
          .select('warmth')
          .eq('user_id', userId)
          .abortSignal(AbortSignal.timeout(10000))
      ])
    } catch (err) {
      // Check if timeout error
      if (err instanceof Error && err.name === 'AbortError') {
        logger.error('Query timeout', { operation: 'admin.evidence', userId })
        return NextResponse.json(
          {
            error: 'Request timed out. The database may be under heavy load. Please try again.',
            userId
          },
          { status: 504 } // Gateway Timeout
        )
      }
      throw err // Re-throw non-timeout errors
    }

    const queryTiming = queryTimer.stop()

    const profile = profileResult.data
    const skillDemos = skillDemosResult.data || []
    const skillSummaries = skillSummariesResult.data || []
    const careers = careerExplorationsResult.data || []
    const relationships = relationshipsResult.data || []
    const platforms = platformStatesResult.data || []

    // Pre-index data for O(1) lookups (avoids O(n²) in skillBreakdown)
    const demosBySkill = new Map<string, typeof skillDemos>()
    const skillCounts = new Map<string, number>()
    for (const demo of skillDemos) {
      const skill = demo.skill_name
      if (!demosBySkill.has(skill)) {
        demosBySkill.set(skill, [])
      }
      demosBySkill.get(skill)!.push(demo)
      skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1)
    }

    const summaryBySkill = new Map<string, typeof skillSummaries[0]>()
    for (const summary of skillSummaries) {
      summaryBySkill.set(summary.skill_name, summary)
    }

    // Framework 1: Skill Evidence (optimized with pre-indexed maps)
    const skillBreakdown = Array.from(skillCounts.entries()).map(([skill, count]) => {
      const summary = summaryBySkill.get(skill)
      const skillSpecificDemos = demosBySkill.get(skill) || []
      // Get unique scene descriptions for this skill
      const sceneDescriptions = Array.from(new Set(
        skillSpecificDemos
          .map(d => d.scene_description)
          .filter(Boolean)
      ))
      return {
        skill,
        demonstrations: count,
        lastContext: summary?.latest_context || 'No context available',
        scenes: summary?.scenes_involved || [],
        sceneDescriptions: sceneDescriptions.length > 0
          ? sceneDescriptions
          : (summary?.scene_descriptions || [])
      }
    })

    const skillEvidence = {
      hasRealData: skillDemos.length >= 10,
      totalDemonstrations: skillDemos.length,
      uniqueSkills: skillCounts.size,
      skillBreakdown
    }

    // Framework 2: Career Readiness
    const careerReadiness = {
      hasRealData: careers.length > 0,
      exploredCareers: careers.length,
      topMatch: careers[0] || null,
      readinessDistribution: careers.reduce((acc, career) => {
        const level = career.readiness_level || 'exploratory'
        acc[level] = (acc[level] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      birminghamOpportunities: careers.flatMap(c => c.local_opportunities || [])
    }

    // Framework 3: Pattern Recognition
    const patternRecognition = {
      hasRealData: skillDemos.length >= 15,
      totalChoices: skillDemos.length,
      patternConsistency: calculatePatternConsistency(skillDemos),
      skillProgression: analyzeSkillProgression(skillDemos),
      behavioralTrends: analyzeBehavioralTrends(skillDemos)
    }

    // Framework 4: Relationship Framework
    const relationshipFramework = {
      hasRealData: relationships.length > 0,
      totalRelationships: relationships.length,
      averageTrust: relationships.length > 0
        ? relationships.reduce((sum, r) => sum + (r.trust_level || 0), 0) / relationships.length
        : 0,
      relationshipDetails: relationships.map(r => ({
        character: r.character_name,
        trust: r.trust_level,
        lastInteraction: r.last_interaction,
        keyMoments: r.key_moments || []
      }))
    }

    // Framework 5: Time Investment
    const timeInvestment = {
      hasRealData: skillDemos.length >= 10,
      firstActivity: skillDemos[0]?.demonstrated_at || profile?.created_at,
      lastActivity: skillDemos[skillDemos.length - 1]?.demonstrated_at || profile?.last_activity,
      totalDays: calculateDaysBetween(
        skillDemos[0]?.demonstrated_at || profile?.created_at,
        skillDemos[skillDemos.length - 1]?.demonstrated_at || profile?.last_activity
      ),
      averageDemosPerDay: calculateAverageDemosPerDay(skillDemos),
      consistencyScore: calculateConsistencyScore(skillDemos)
    }

    // Framework 6: Behavioral Consistency (uses pre-computed skillCounts)
    const behavioralConsistency = {
      hasRealData: skillDemos.length >= 20,
      topThreeSkills: Array.from(skillCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([skill, count]) => ({ skill, count })),
      focusScore: calculateFocusScoreFromMap(skillCounts, skillDemos.length),
      explorationScore: calculateExplorationScore(skillDemos),
      platformAlignment: platforms.filter(p => (p.warmth || 0) > 50).length
    }

    // Audit log: Admin accessed student evidence data
    auditLog('view_evidence_data', 'admin', userId)

    const responseData = {
      userId,
      frameworks: {
        skillEvidence,
        careerReadiness,
        patternRecognition,
        relationshipFramework,
        timeInvestment,
        behavioralConsistency
      },
      metadata: {
        profileExists: !!profile,
        dataQuality: calculateDataQuality(skillDemos, careers, relationships),
        lastUpdated: profile?.updated_at || new Date().toISOString(),
        queryTimeMs: queryTiming.durationMs
      }
    }

    // Cache the response
    evidenceCache.set(cacheKey, { data: responseData, timestamp: Date.now() })

    // Cleanup old cache entries (keep cache size bounded)
    if (evidenceCache.size > 100) {
      const cutoff = Date.now() - CACHE_TTL_MS
      for (const [key, entry] of evidenceCache.entries()) {
        if (entry.timestamp < cutoff) {
          evidenceCache.delete(key)
        }
      }
    }

    return NextResponse.json(responseData, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'private, max-age=30' }
    })
  } catch (error) {
    logger.error('Unexpected error in evidence endpoint', { operation: 'admin.evidence', userId }, error instanceof Error ? error : undefined)

    // Return generic error to client (don't expose details)
    return NextResponse.json(
      { error: 'An error occurred fetching evidence data' },
      { status: 500 }
    )
  }
}

// Helper types for database records
interface SkillDemo {
  skill_name: string
  demonstrated_at: string
}

interface SkillTimeline {
  skill: string
  timestamp: number
}

interface QuartileResult {
  period: string
  topSkill: string
  demonstrations: number
}

// Helper functions
function calculatePatternConsistency(skillDemos: SkillDemo[]): number {
  if (skillDemos.length < 10) return 0

  const skillCounts = skillDemos.reduce((acc, demo) => {
    acc[demo.skill_name] = (acc[demo.skill_name] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const counts = Object.values(skillCounts) as number[]
  const avg = counts.reduce((sum, count) => sum + count, 0) / counts.length
  const variance = counts.reduce((sum, count) => sum + Math.pow(count - avg, 2), 0) / counts.length
  const stdDev = Math.sqrt(variance)

  // Lower stdDev = more consistent pattern (normalize to 0-1)
  return Math.max(0, 1 - (stdDev / avg))
}

function analyzeSkillProgression(skillDemos: SkillDemo[]): QuartileResult[] {
  const skillTimeline: SkillTimeline[] = skillDemos.map(demo => ({
    skill: demo.skill_name,
    timestamp: new Date(demo.demonstrated_at).getTime()
  }))

  const sortedByTime = skillTimeline.sort((a, b) => a.timestamp - b.timestamp)

  // Group into quartiles
  const quartileSize = Math.floor(sortedByTime.length / 4)
  const quartiles = [
    sortedByTime.slice(0, quartileSize),
    sortedByTime.slice(quartileSize, quartileSize * 2),
    sortedByTime.slice(quartileSize * 2, quartileSize * 3),
    sortedByTime.slice(quartileSize * 3)
  ]

  return quartiles.map((q, i) => {
    const skillCounts = q.reduce((acc, item) => {
      acc[item.skill] = (acc[item.skill] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topSkill = Object.entries(skillCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0]

    return {
      period: `Q${i + 1}`,
      topSkill: topSkill ? topSkill[0] : 'N/A',
      demonstrations: q.length
    }
  })
}

function analyzeBehavioralTrends(skillDemos: SkillDemo[]): string[] {
  if (skillDemos.length < 10) return []

  const trends: string[] = []
  const recentDemos = skillDemos.slice(-10)
  const earlierDemos = skillDemos.slice(0, 10)

  const recentSkills = new Set(recentDemos.map(d => d.skill_name))
  const earlierSkills = new Set(earlierDemos.map(d => d.skill_name))

  const newSkills = Array.from(recentSkills).filter(s => !earlierSkills.has(s))
  if (newSkills.length > 3) {
    trends.push('Increasing exploration of new skills')
  }

  const repeatedSkills = Array.from(recentSkills).filter(s => earlierSkills.has(s))
  if (repeatedSkills.length / recentSkills.size > 0.7) {
    trends.push('Strong pattern consistency and focus')
  }

  return trends
}

function calculateDaysBetween(start: string | undefined, end: string | undefined): number {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
}

function calculateAverageDemosPerDay(skillDemos: SkillDemo[]): number {
  if (skillDemos.length < 2) return 0

  const days = calculateDaysBetween(
    skillDemos[0]?.demonstrated_at,
    skillDemos[skillDemos.length - 1]?.demonstrated_at
  )

  return days > 0 ? skillDemos.length / days : 0
}

function calculateConsistencyScore(skillDemos: SkillDemo[]): number {
  if (skillDemos.length < 10) return 0

  // Calculate time gaps between demonstrations
  const timestamps = skillDemos.map(d => new Date(d.demonstrated_at).getTime())
  const gaps = []
  for (let i = 1; i < timestamps.length; i++) {
    gaps.push(timestamps[i] - timestamps[i - 1])
  }

  const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length
  const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length
  const stdDev = Math.sqrt(variance)

  // Lower stdDev = more consistent timing (normalize to 0-1)
  return Math.max(0, 1 - (stdDev / avgGap))
}

function _calculateFocusScore(skillDemos: SkillDemo[]): number {
  const skillCounts = skillDemos.reduce((acc, demo) => {
    acc[demo.skill_name] = (acc[demo.skill_name] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topThreeCount = (Object.values(skillCounts) as number[])
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, count) => sum + count, 0)

  return topThreeCount / skillDemos.length
}

// Optimized version using pre-computed skillCounts Map (O(k) instead of O(n))
function calculateFocusScoreFromMap(skillCounts: Map<string, number>, totalDemos: number): number {
  if (totalDemos === 0) return 0

  const topThreeCount = Array.from(skillCounts.values())
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, count) => sum + count, 0)

  return topThreeCount / totalDemos
}

function calculateExplorationScore(skillDemos: SkillDemo[]): number {
  const uniqueSkills = new Set(skillDemos.map(d => d.skill_name)).size
  const totalSkillsPossible = 12 // WEF 2030 Skills Framework

  return uniqueSkills / totalSkillsPossible
}

interface CareerRecord {
  length: number
}

interface RelationshipRecord {
  length: number
}

function calculateDataQuality(
  skillDemos: SkillDemo[],
  careers: CareerRecord,
  relationships: RelationshipRecord
): 'excellent' | 'good' | 'fair' | 'poor' {
  const score = (
    (skillDemos.length >= 20 ? 3 : skillDemos.length >= 10 ? 2 : skillDemos.length >= 5 ? 1 : 0) +
    (careers.length >= 3 ? 2 : careers.length >= 1 ? 1 : 0) +
    (relationships.length >= 2 ? 2 : relationships.length >= 1 ? 1 : 0)
  )

  if (score >= 6) return 'excellent'
  if (score >= 4) return 'good'
  if (score >= 2) return 'fair'
  return 'poor'
}
