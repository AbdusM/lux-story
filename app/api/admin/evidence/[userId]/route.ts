import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'

/**
 * Admin Evidence API
 * Aggregates real Supabase data for Evidence Tab frameworks
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  // Authentication check - verify admin cookie
  const authError = requireAdminAuth(request)
  if (authError) return authError

  const { userId } = await params

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  try {
    const supabase = getAdminSupabaseClient()

    // Parallel queries for all framework data
    const [
      profileResult,
      skillDemosResult,
      skillSummariesResult,
      careerExplorationsResult,
      relationshipsResult,
      platformStatesResult
    ] = await Promise.all([
      // Player profile
      supabase
        .from('player_profiles')
        .select('*')
        .eq('user_id', userId)
        .single(),

      // Skill demonstrations (with temporal data)
      supabase
        .from('skill_demonstrations')
        .select('*')
        .eq('user_id', userId)
        .order('demonstrated_at', { ascending: true }),

      // Skill summaries (rich context)
      supabase
        .from('skill_summaries')
        .select('*')
        .eq('user_id', userId),

      // Career explorations
      supabase
        .from('career_explorations')
        .select('*')
        .eq('user_id', userId)
        .order('match_score', { ascending: false }),

      // Relationships
      supabase
        .from('relationship_progress')
        .select('*')
        .eq('user_id', userId),

      // Platform states
      supabase
        .from('platform_states')
        .select('*')
        .eq('user_id', userId)
    ])

    const profile = profileResult.data
    const skillDemos = skillDemosResult.data || []
    const skillSummaries = skillSummariesResult.data || []
    const careers = careerExplorationsResult.data || []
    const relationships = relationshipsResult.data || []
    const platforms = platformStatesResult.data || []

    // Framework 1: Skill Evidence
    const skillEvidence = {
      hasRealData: skillDemos.length >= 10,
      totalDemonstrations: skillDemos.length,
      uniqueSkills: new Set(skillDemos.map(d => d.skill_name)).size,
      skillBreakdown: Object.entries(
        skillDemos.reduce((acc, demo) => {
          acc[demo.skill_name] = (acc[demo.skill_name] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).map(([skill, count]) => ({
        skill,
        demonstrations: count,
        lastContext: skillSummaries.find(s => s.skill_name === skill)?.latest_context || 'No context available',
        scenes: skillSummaries.find(s => s.skill_name === skill)?.scenes_involved || []
      }))
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

    // Framework 6: Behavioral Consistency
    const behavioralConsistency = {
      hasRealData: skillDemos.length >= 20,
      topThreeSkills: Object.entries(
        skillDemos.reduce((acc, demo) => {
          acc[demo.skill_name] = (acc[demo.skill_name] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      )
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([skill, count]) => ({ skill, count })),
      focusScore: calculateFocusScore(skillDemos),
      explorationScore: calculateExplorationScore(skillDemos),
      platformAlignment: platforms.filter(p => (p.warmth || 0) > 50).length
    }

    return NextResponse.json({
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
        lastUpdated: profile?.updated_at || new Date().toISOString()
      }
    })
  } catch (error) {
    // Log detailed error server-side
    console.error('[Admin:Evidence] Unexpected error:', error)

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

function calculateFocusScore(skillDemos: SkillDemo[]): number {
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
