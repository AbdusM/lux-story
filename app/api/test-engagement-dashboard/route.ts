import { NextRequest, NextResponse } from 'next/server'
import { getEngagementMetrics, calculatePlayerEngagement, getPlayerEngagementInsights } from '@/lib/engagement-metrics'

export async function POST(request: NextRequest) {
  try {
    const { playerId = 'engagement-demo', generateMultiple = false } = await request.json()

    const engine = getEngagementMetrics()

    // Single player analysis
    const playerMetrics = calculatePlayerEngagement(playerId)
    const playerInsights = getPlayerEngagementInsights(playerId)

    let dashboardSummary = null
    if (generateMultiple) {
      // Simulate multiple players for dashboard demo
      const testPlayerIds = ['student-1', 'student-2', 'student-3', 'engagement-demo']

      // Generate metrics for each test player
      for (const id of testPlayerIds) {
        engine.calculateEngagementMetrics(id)
      }

      dashboardSummary = engine.generateDashboardSummary(testPlayerIds)
    }

    return NextResponse.json({
      success: true,
      playerAnalysis: {
        playerId: playerMetrics.playerId,
        engagementOverview: {
          totalPlayTime: Math.round(playerMetrics.totalPlayTime / 60000) + ' minutes',
          sessionsCount: playerMetrics.sessionsCount,
          choicesPerSession: Math.round(playerMetrics.choicesPerSession * 10) / 10,
          explorationDepth: playerMetrics.explorationDepth
        },
        careerProgress: {
          careerPathsExplored: playerMetrics.careerPathsExplored,
          strongAffinities: playerMetrics.strongAffinities,
          dominantPattern: playerMetrics.dominantBehaviorPattern,
          careerReadiness: playerMetrics.careerReadiness
        },
        birminghamConnection: {
          localEngagement: Math.round(playerMetrics.localEngagement * 100) + '%',
          opportunitiesViewed: playerMetrics.birminghamOpportunitiesViewed,
          recommendationAlignment: Math.round(playerMetrics.recommendationAlignment * 100) + '%'
        },
        qualityIndicators: {
          meaningfulChoices: playerMetrics.meaningfulChoices,
          patternConsistency: Math.round(playerMetrics.patternConsistency * 100) + '%',
          patternEvolution: playerMetrics.patternEvolution,
          goalOrientation: playerMetrics.goalOrientation
        }
      },
      insights: playerInsights.map(insight => ({
        category: insight.category,
        title: insight.title,
        description: insight.description,
        priority: insight.priority,
        recommendations: insight.recommendations.slice(0, 2) // Limit for readability
      })),
      dashboardSummary: dashboardSummary ? {
        summary: {
          totalPlayers: dashboardSummary.summary.totalPlayers,
          averageEngagement: dashboardSummary.summary.averageEngagement,
          topCareerInterests: dashboardSummary.summary.topCareerInterests.slice(0, 3),
          birminghamAlignment: dashboardSummary.summary.birminghamAlignment,
          readyForAction: dashboardSummary.summary.readyForAction
        },
        playerBreakdown: dashboardSummary.playerBreakdown.map(player => ({
          playerId: player.playerId,
          engagementLevel: player.engagementLevel,
          careerReadiness: player.careerReadiness,
          birminghamConnection: player.birminghamConnection
        }))
      } : null,
      analytics: {
        playerMetrics: {
          ...playerMetrics,
          // Round timestamps for readability
          totalPlayTime: Math.round(playerMetrics.totalPlayTime / 60000),
          averageResponseTime: Math.round(playerMetrics.averageResponseTime / 1000)
        }
      },
      summary: `Generated comprehensive engagement analysis for ${playerId}${generateMultiple ? ' and dashboard overview' : ''}`
    })

  } catch (error) {
    console.error('Engagement dashboard test failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to generate engagement metrics dashboard'
      },
      { status: 500 }
    )
  }
}