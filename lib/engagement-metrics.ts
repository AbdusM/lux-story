/**
 * Engagement Metrics Dashboard
 *
 * Comprehensive analytics system for tracking player engagement,
 * career exploration progress, and Birmingham opportunity alignment
 */

import { getPersonaTracker } from './player-persona'
import { getCareerAnalytics, type CareerInsight } from './career-analytics'
import { getPlatformResonance } from './platform-resonance'

export interface EngagementMetrics {
  playerId: string
  sessionId: string

  // Core engagement data
  totalPlayTime: number // milliseconds
  sessionsCount: number
  choicesPerSession: number
  averageResponseTime: number

  // Progress tracking
  scenesVisited: number
  platformsDiscovered: number
  platformsResonant: number

  // Career exploration depth
  careerPathsExplored: number
  strongAffinities: number // Above 50% confidence
  birminghamOpportunitiesViewed: number

  // Behavioral patterns
  dominantBehaviorPattern: string
  patternConsistency: number // 0-1 scale
  explorationDepth: 'surface' | 'moderate' | 'deep'

  // Birmingham-specific metrics
  localEngagement: number // Interest in Birmingham opportunities
  careerReadiness: 'exploring' | 'focused' | 'ready' | 'committed'
  recommendationAlignment: number // How well recommendations match behavior

  // Quality indicators
  meaningfulChoices: number // Choices that led to insights
  patternEvolution: boolean // Has behavior changed over time
  goalOrientation: 'discovery' | 'validation' | 'planning' | 'action'

  // Timestamps
  firstSession: number
  lastSession: number
  peakEngagementTime: number
}

export interface SessionSummary {
  sessionId: string
  startTime: number
  endTime: number
  choicesMade: number
  platformsExplored: string[]
  newInsights: number
  engagementLevel: 'low' | 'moderate' | 'high'
  keyMoments: string[]
}

export interface EngagementTrend {
  timestamp: number
  metric: 'choices' | 'resonance' | 'exploration' | 'focus'
  value: number
  context: string
}

export interface EngagementInsight {
  category: 'progress' | 'concern' | 'opportunity' | 'achievement'
  title: string
  description: string
  actionable: boolean
  recommendations: string[]
  priority: 'low' | 'medium' | 'high'
}

/**
 * Engagement Metrics Engine
 */
export class EngagementMetricsEngine {
  private static instance: EngagementMetricsEngine | null = null
  private playerMetrics: Map<string, EngagementMetrics> = new Map()
  private sessionSummaries: Map<string, SessionSummary[]> = new Map()
  private engagementTrends: Map<string, EngagementTrend[]> = new Map()

  static getInstance(): EngagementMetricsEngine {
    if (!this.instance) {
      this.instance = new EngagementMetricsEngine()
    }
    return this.instance
  }

  /**
   * Calculate comprehensive engagement metrics for a player
   */
  calculateEngagementMetrics(playerId: string, sessionId: string = 'current'): EngagementMetrics {
    const persona = getPersonaTracker().getPersona(playerId)
    const careerAnalytics = getCareerAnalytics()
    const platformResonance = getPlatformResonance()

    // Get career insights and platform data
    const careerInsights = careerAnalytics.generateCareerInsights(playerId)
    const platforms = platformResonance.getPlayerPlatforms(playerId)
    const resonantPlatforms = Array.from(platforms.values()).filter(p => p.accessibility === 'resonant')

    // Calculate core metrics
    const totalChoices = persona.totalChoices || 0
    const strongAffinities = careerInsights.filter(insight => insight.confidence > 50).length
    const platformsDiscovered = Array.from(platforms.values()).filter(p => p.accessibility !== 'locked').length

    // Calculate behavioral consistency
    const patternValues = Object.values(persona.patternPercentages)
    const patternConsistency = this.calculatePatternConsistency(patternValues)

    // Determine exploration depth
    const explorationDepth = this.determineExplorationDepth(totalChoices, platformsDiscovered, careerInsights.length)

    // Calculate Birmingham engagement
    const localEngagement = this.calculateLocalEngagement(careerInsights, persona)

    // Determine career readiness
    const careerReadiness = this.determineCareerReadiness(strongAffinities, localEngagement, totalChoices)

    // Calculate recommendation alignment
    const recommendationAlignment = this.calculateRecommendationAlignment(persona, careerInsights)

    const metrics: EngagementMetrics = {
      playerId,
      sessionId,

      // Core engagement (simulated - would come from actual session tracking)
      totalPlayTime: totalChoices * 30000, // Estimate 30 seconds per choice
      sessionsCount: Math.max(1, Math.floor(totalChoices / 8)), // Estimate 8 choices per session
      choicesPerSession: totalChoices > 0 ? totalChoices / Math.max(1, Math.floor(totalChoices / 8)) : 0,
      averageResponseTime: this.estimateResponseTime(persona.responseSpeed),

      // Progress tracking
      scenesVisited: totalChoices, // Each choice roughly equals a scene
      platformsDiscovered,
      platformsResonant: resonantPlatforms.length,

      // Career exploration
      careerPathsExplored: careerInsights.length,
      strongAffinities,
      birminghamOpportunitiesViewed: careerInsights.reduce((sum, insight) =>
        sum + (insight.personalizedOpportunities?.length || 0), 0),

      // Behavioral patterns
      dominantBehaviorPattern: persona.dominantPatterns[0] || 'emerging',
      patternConsistency,
      explorationDepth,

      // Birmingham-specific
      localEngagement,
      careerReadiness,
      recommendationAlignment,

      // Quality indicators
      meaningfulChoices: this.calculateMeaningfulChoices(totalChoices, careerInsights.length),
      patternEvolution: this.detectPatternEvolution(persona),
      goalOrientation: this.determineGoalOrientation(persona, careerInsights),

      // Timestamps
      firstSession: persona.lastUpdated - (totalChoices * 30000), // Estimate start time
      lastSession: persona.lastUpdated,
      peakEngagementTime: persona.lastUpdated
    }

    this.playerMetrics.set(playerId, metrics)
    return metrics
  }

  /**
   * Generate engagement insights and recommendations
   */
  generateEngagementInsights(playerId: string): EngagementInsight[] {
    const metrics = this.calculateEngagementMetrics(playerId)
    const insights: EngagementInsight[] = []

    // Progress achievements
    if (metrics.strongAffinities >= 2) {
      insights.push({
        category: 'achievement',
        title: 'Clear Career Interests Emerging',
        description: `You've developed strong affinities in ${metrics.strongAffinities} career areas`,
        actionable: true,
        recommendations: [
          'Explore Birmingham opportunities in your top career areas',
          'Connect with professionals in these fields',
          'Consider informational interviews'
        ],
        priority: 'high'
      })
    }

    // Exploration depth
    if (metrics.explorationDepth === 'surface') {
      insights.push({
        category: 'opportunity',
        title: 'Ready for Deeper Exploration',
        description: 'Your initial exploration shows promise - time to dig deeper',
        actionable: true,
        recommendations: [
          'Spend more time with scenarios that interest you',
          'Explore the details of Birmingham opportunities',
          'Consider what aspects of each career appeal to you'
        ],
        priority: 'medium'
      })
    }

    // Birmingham connection
    if (metrics.localEngagement > 0.7) {
      insights.push({
        category: 'achievement',
        title: 'Strong Birmingham Connection',
        description: 'You show high interest in local career opportunities',
        actionable: true,
        recommendations: [
          'Visit specific Birmingham organizations that interest you',
          'Attend local career events and job fairs',
          'Connect with Birmingham professionals on LinkedIn'
        ],
        priority: 'high'
      })
    } else if (metrics.localEngagement < 0.3) {
      insights.push({
        category: 'opportunity',
        title: 'Discover Birmingham Connections',
        description: 'Birmingham has many opportunities that align with your interests',
        actionable: true,
        recommendations: [
          'Learn about Birmingham\'s growing industries',
          'Explore local internship and mentorship programs',
          'Consider how your interests connect to the local economy'
        ],
        priority: 'medium'
      })
    }

    // Pattern consistency
    if (metrics.patternConsistency < 0.3) {
      insights.push({
        category: 'concern',
        title: 'Exploring Diverse Interests',
        description: 'You\'re exploring many different directions - this is normal!',
        actionable: false,
        recommendations: [
          'Continue exploring to find what resonates',
          'Don\'t pressure yourself to choose too quickly',
          'Pay attention to what feels most natural'
        ],
        priority: 'low'
      })
    }

    // Career readiness progression
    if (metrics.careerReadiness === 'ready') {
      insights.push({
        category: 'achievement',
        title: 'Ready for Action',
        description: 'You have clear direction and are ready for concrete steps',
        actionable: true,
        recommendations: [
          'Apply for relevant internships or programs',
          'Schedule informational interviews',
          'Create an action plan with specific deadlines'
        ],
        priority: 'high'
      })
    }

    // Engagement quality
    if (metrics.meaningfulChoices / Math.max(1, metrics.choicesPerSession) > 0.6) {
      insights.push({
        category: 'achievement',
        title: 'High-Quality Exploration',
        description: 'Your choices are leading to valuable insights',
        actionable: false,
        recommendations: [
          'Continue your thoughtful approach',
          'Document insights that resonate with you',
          'Share your discoveries with trusted mentors'
        ],
        priority: 'medium'
      })
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  /**
   * Create dashboard summary for administrators/educators
   */
  generateDashboardSummary(playerIds?: string[]): {
    summary: {
      totalPlayers: number
      averageEngagement: number
      topCareerInterests: Array<{ career: string; count: number }>
      birminghamAlignment: number
      readyForAction: number
    }
    playerBreakdown: Array<{
      playerId: string
      engagementLevel: 'low' | 'moderate' | 'high'
      careerReadiness: EngagementMetrics['careerReadiness']
      topCareer: string
      birminghamConnection: number
    }>
  } {
    const allPlayerIds = playerIds || Array.from(this.playerMetrics.keys())
    const playerMetrics = allPlayerIds.map(id => this.calculateEngagementMetrics(id))

    // Calculate summary statistics
    const averageEngagement = this.calculateAverageEngagement(playerMetrics)
    const careerInterestCounts = this.aggregateCareerInterests(allPlayerIds)
    const avgBirminghamAlignment = playerMetrics.reduce((sum, m) => sum + m.localEngagement, 0) / playerMetrics.length
    const readyCount = playerMetrics.filter(m => m.careerReadiness === 'ready' || m.careerReadiness === 'committed').length

    const playerBreakdown = playerMetrics.map(metrics => ({
      playerId: metrics.playerId,
      engagementLevel: this.categorizeEngagementLevel(metrics),
      careerReadiness: metrics.careerReadiness,
      topCareer: metrics.dominantBehaviorPattern,
      birminghamConnection: Math.round(metrics.localEngagement * 100) / 100
    }))

    return {
      summary: {
        totalPlayers: playerMetrics.length,
        averageEngagement: Math.round(averageEngagement * 100) / 100,
        topCareerInterests: careerInterestCounts.slice(0, 5),
        birminghamAlignment: Math.round(avgBirminghamAlignment * 100) / 100,
        readyForAction: readyCount
      },
      playerBreakdown
    }
  }

  /**
   * Export comprehensive analytics data
   */
  exportAnalyticsData(playerId?: string): Record<string, unknown> {
    if (playerId) {
      const metrics = this.calculateEngagementMetrics(playerId)
      const insights = this.generateEngagementInsights(playerId)

      return {
        playerId,
        metrics,
        insights,
        exportedAt: new Date().toISOString()
      }
    }

    // Export all player data
    const allPlayers = Array.from(this.playerMetrics.keys())
    const dashboard = this.generateDashboardSummary(allPlayers)

    return {
      dashboard,
      individualPlayers: allPlayers.map(id => ({
        playerId: id,
        metrics: this.calculateEngagementMetrics(id),
        insights: this.generateEngagementInsights(id)
      })),
      exportedAt: new Date().toISOString()
    }
  }

  /**
   * Helper: Calculate pattern consistency
   */
  private calculatePatternConsistency(patternValues: number[]): number {
    if (patternValues.length === 0) return 0

    const max = Math.max(...patternValues)
    const sum = patternValues.reduce((a, b) => a + b, 0)

    return sum > 0 ? max / sum : 0
  }

  /**
   * Helper: Determine exploration depth
   */
  private determineExplorationDepth(choices: number, platforms: number, insights: number): 'surface' | 'moderate' | 'deep' {
    const depthScore = (choices * 0.4) + (platforms * 2) + (insights * 3)

    if (depthScore < 10) return 'surface'
    if (depthScore < 25) return 'moderate'
    return 'deep'
  }

  /**
   * Helper: Calculate local engagement
   */
  private calculateLocalEngagement(insights: unknown[], _persona: unknown): number {
    let engagement = 0.5 // Base score

    // Birmingham opportunities interest
    const birminghamOpps = insights.reduce((sum: number, insight: unknown) => {
      if (typeof insight !== 'object' || insight === null) return sum
      const insightObj = insight as Record<string, unknown>
      const opps = Array.isArray(insightObj.personalizedOpportunities) ? insightObj.personalizedOpportunities.length : 0
      return sum + opps
    }, 0)

    if (birminghamOpps > 0) engagement += 0.3
    if (birminghamOpps > 3) engagement += 0.2

    return Math.min(1, engagement)
  }

  /**
   * Helper: Determine career readiness
   */
  private determineCareerReadiness(affinities: number, localEngagement: number, choices: number): EngagementMetrics['careerReadiness'] {
    const readinessScore = (affinities * 3) + (localEngagement * 2) + (choices * 0.1)

    if (readinessScore < 5) return 'exploring'
    if (readinessScore < 10) return 'focused'
    if (readinessScore < 15) return 'ready'
    return 'committed'
  }

  /**
   * Helper: Calculate recommendation alignment
   */
  private calculateRecommendationAlignment(persona: unknown, insights: unknown[]): number {
    if (insights.length === 0) return 0.5

    const strongInsights = insights.filter((i: unknown) => {
      if (typeof i !== 'object' || i === null) return false
      const insightObj = i as Record<string, unknown>
      return typeof insightObj.confidence === 'number' && insightObj.confidence > 60
    })
    return Math.min(1, strongInsights.length / insights.length)
  }

  /**
   * Helper: Estimate response time based on persona
   */
  private estimateResponseTime(responseSpeed: string): number {
    const speedMap = {
      'impulsive': 2000,
      'quick': 5000,
      'moderate': 8000,
      'deliberate': 12000
    }
    return speedMap[responseSpeed as keyof typeof speedMap] || 8000
  }

  /**
   * Helper: Calculate meaningful choices
   */
  private calculateMeaningfulChoices(totalChoices: number, insights: number): number {
    return Math.min(totalChoices, insights * 3) // Estimate 3 choices per insight
  }

  /**
   * Helper: Detect pattern evolution
   */
  private detectPatternEvolution(persona: unknown): boolean {
    // Simple heuristic - if dominant patterns are diverse, suggests evolution
    if (typeof persona !== 'object' || persona === null) return false
    const personaObj = persona as Record<string, unknown>
    const patterns = Array.isArray(personaObj.dominantPatterns) ? personaObj.dominantPatterns : []
    return patterns.length > 2
  }

  /**
   * Helper: Determine goal orientation
   */
  private determineGoalOrientation(persona: unknown, insights: CareerInsight[]): 'discovery' | 'validation' | 'planning' | 'action' {
    const choiceCount = (persona as { totalChoices: number }).totalChoices || 0
    const insightStrength = insights.reduce((sum, i) => sum + (i.confidence || 0), 0) / insights.length || 0

    if (choiceCount < 10) return 'discovery'
    if (insightStrength < 50) return 'validation'
    if (insightStrength < 70) return 'planning'
    return 'action'
  }

  /**
   * Helper: Calculate average engagement across players
   */
  private calculateAverageEngagement(metrics: EngagementMetrics[]): number {
    if (metrics.length === 0) return 0

    const totalEngagement = metrics.reduce((sum, m) => {
      return sum + (m.choicesPerSession * 0.3) + (m.strongAffinities * 0.4) + (m.localEngagement * 0.3)
    }, 0)

    return totalEngagement / metrics.length
  }

  /**
   * Helper: Aggregate career interests across players
   */
  private aggregateCareerInterests(playerIds: string[]): Array<{ career: string; count: number }> {
    const careerCounts: Record<string, number> = {}

    for (const playerId of playerIds) {
      const persona = getPersonaTracker().getPersona(playerId)
      for (const pattern of persona.dominantPatterns) {
        careerCounts[pattern] = (careerCounts[pattern] || 0) + 1
      }
    }

    return Object.entries(careerCounts)
      .map(([career, count]) => ({ career, count }))
      .sort((a, b) => b.count - a.count)
  }

  /**
   * Helper: Categorize engagement level
   */
  private categorizeEngagementLevel(metrics: EngagementMetrics): 'low' | 'moderate' | 'high' {
    const engagementScore = (metrics.choicesPerSession * 0.2) +
                           (metrics.strongAffinities * 0.3) +
                           (metrics.localEngagement * 0.3) +
                           (metrics.patternConsistency * 0.2)

    if (engagementScore < 0.4) return 'low'
    if (engagementScore < 0.7) return 'moderate'
    return 'high'
  }
}

/**
 * Get global engagement metrics engine
 */
export function getEngagementMetrics(): EngagementMetricsEngine {
  return EngagementMetricsEngine.getInstance()
}

/**
 * Calculate engagement metrics for player (convenience function)
 */
export function calculatePlayerEngagement(playerId: string): EngagementMetrics {
  return getEngagementMetrics().calculateEngagementMetrics(playerId)
}

/**
 * Generate engagement insights (convenience function)
 */
export function getPlayerEngagementInsights(playerId: string): EngagementInsight[] {
  return getEngagementMetrics().generateEngagementInsights(playerId)
}