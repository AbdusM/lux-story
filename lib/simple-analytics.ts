/**
 * Simplified Analytics System
 * 
 * Basic analytics that track essential metrics without over-engineering
 * Focuses on user experience and career exploration insights
 */

export interface SimpleAnalytics {
  // Basic session data
  sessionId: string
  startTime: number
  endTime?: number
  totalChoices: number
  scenesCompleted: number
  
  // Career exploration patterns
  careerInterests: string[]
  birminghamConnections: string[]
  explorationDepth: 'shallow' | 'moderate' | 'deep'
  
  // User experience metrics
  averageResponseTime: number
  engagementLevel: 'low' | 'medium' | 'high'
  completionRate: number
  
  // Birmingham-specific insights
  localOpportunitiesViewed: string[]
  careerPathsDiscovered: string[]
  nextStepsSuggested: string[]
}

export interface ChoiceAnalytics {
  choiceText: string
  pattern: string
  responseTime: number
  timestamp: number
  birminghamRelevance: boolean
}

/**
 * Simple Analytics Engine
 * Replaces complex analytics with essential tracking
 */
export class SimpleAnalyticsEngine {
  private static instance: SimpleAnalyticsEngine | null = null
  private analytics: Map<string, SimpleAnalytics> = new Map()
  private choiceHistory: Map<string, ChoiceAnalytics[]> = new Map()

  static getInstance(): SimpleAnalyticsEngine {
    if (!this.instance) {
      this.instance = new SimpleAnalyticsEngine()
    }
    return this.instance
  }

  /**
   * Initialize analytics for a new session
   */
  initializeSession(playerId: string): SimpleAnalytics {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const analytics: SimpleAnalytics = {
      sessionId,
      startTime: Date.now(),
      totalChoices: 0,
      scenesCompleted: 0,
      careerInterests: [],
      birminghamConnections: [],
      explorationDepth: 'shallow',
      averageResponseTime: 0,
      engagementLevel: 'low',
      completionRate: 0,
      localOpportunitiesViewed: [],
      careerPathsDiscovered: [],
      nextStepsSuggested: []
    }

    this.analytics.set(playerId, analytics)
    this.choiceHistory.set(playerId, [])
    
    return analytics
  }

  /**
   * Track a choice with simplified analytics
   */
  trackChoice(playerId: string, choice: {
    text: string
    consequence: string
    responseTime: number
  }): void {
    const analytics = this.analytics.get(playerId)
    if (!analytics) return

    // Update basic metrics
    analytics.totalChoices++
    analytics.averageResponseTime = 
      (analytics.averageResponseTime * (analytics.totalChoices - 1) + choice.responseTime) / analytics.totalChoices

    // Track choice pattern
    const pattern = this.extractPattern(choice.consequence)
    const choiceAnalytics: ChoiceAnalytics = {
      choiceText: choice.text,
      pattern,
      responseTime: choice.responseTime,
      timestamp: Date.now(),
      birminghamRelevance: this.isBirminghamRelevant(choice.text)
    }

    const history = this.choiceHistory.get(playerId) || []
    history.push(choiceAnalytics)
    this.choiceHistory.set(playerId, history)

    // Update career interests based on patterns
    this.updateCareerInterests(analytics, pattern)
    
    // Update engagement level
    this.updateEngagementLevel(analytics)
    
    // Update exploration depth
    this.updateExplorationDepth(analytics)
  }

  /**
   * Track scene completion
   */
  trackSceneCompletion(playerId: string, sceneId: string): void {
    const analytics = this.analytics.get(playerId)
    if (!analytics) return

    analytics.scenesCompleted++
    
    // Add Birmingham connections if scene contains local references
    if (this.hasBirminghamReference(sceneId)) {
      analytics.birminghamConnections.push(sceneId)
    }
  }

  /**
   * Get current analytics for a player
   */
  getAnalytics(playerId: string): SimpleAnalytics | null {
    return this.analytics.get(playerId) || null
  }

  /**
   * Get career insights based on simple pattern analysis
   */
  getCareerInsights(playerId: string): {
    primaryInterest: string
    confidence: number
    birminghamOpportunities: string[]
    nextSteps: string[]
  } | null {
    const analytics = this.analytics.get(playerId)
    const history = this.choiceHistory.get(playerId)
    
    if (!analytics || !history || history.length === 0) {
      return null
    }

    // Simple pattern analysis
    const patternCounts = this.countPatterns(history)
    const primaryInterest = this.getPrimaryInterest(patternCounts)
    const confidence = Math.min(patternCounts[primaryInterest] / history.length, 1)

    return {
      primaryInterest,
      confidence,
      birminghamOpportunities: this.getBirminghamOpportunities(primaryInterest),
      nextSteps: this.getNextSteps(primaryInterest)
    }
  }

  /**
   * Export analytics data
   */
  exportAnalytics(playerId?: string): any {
    if (playerId) {
      return {
        analytics: this.analytics.get(playerId),
        choiceHistory: this.choiceHistory.get(playerId),
        insights: this.getCareerInsights(playerId)
      }
    }

    // Export all data
    const allData: any = {}
    for (const [id, analytics] of this.analytics) {
      allData[id] = {
        analytics,
        choiceHistory: this.choiceHistory.get(id),
        insights: this.getCareerInsights(id)
      }
    }
    return allData
  }

  // Private helper methods

  private extractPattern(consequence: string): string {
    const patterns = {
      'helping': ['helping', 'caring', 'supporting'],
      'building': ['building', 'creating', 'designing'],
      'analyzing': ['analyzing', 'researching', 'investigating'],
      'exploring': ['exploring', 'discovering', 'investigating'],
      'patience': ['patience', 'waiting', 'careful']
    }

    for (const [pattern, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => consequence.toLowerCase().includes(keyword))) {
        return pattern
      }
    }

    return 'exploring' // Default pattern
  }

  private isBirminghamRelevant(text: string): boolean {
    const birminghamKeywords = [
      'birmingham', 'uab', 'downtown', 'alabama', 'magic city',
      'innovation depot', 'regions', 'southern company', 'alabama power'
    ]
    
    return birminghamKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    )
  }

  private hasBirminghamReference(sceneId: string): boolean {
    // Simple check - in real implementation, you'd check scene content
    return sceneId.includes('birmingham') || sceneId.includes('uab')
  }

  private updateCareerInterests(analytics: SimpleAnalytics, pattern: string): void {
    const careerMapping = {
      'helping': 'Healthcare & Education',
      'building': 'Engineering & Construction',
      'analyzing': 'Technology & Research',
      'exploring': 'Innovation & Discovery',
      'patience': 'Counseling & Support'
    }

    const career = careerMapping[pattern as keyof typeof careerMapping]
    if (career && !analytics.careerInterests.includes(career)) {
      analytics.careerInterests.push(career)
    }
  }

  private updateEngagementLevel(analytics: SimpleAnalytics): void {
    const { totalChoices, averageResponseTime } = analytics
    
    if (totalChoices > 10 && averageResponseTime > 5000) {
      analytics.engagementLevel = 'high'
    } else if (totalChoices > 5 && averageResponseTime > 2000) {
      analytics.engagementLevel = 'medium'
    } else {
      analytics.engagementLevel = 'low'
    }
  }

  private updateExplorationDepth(analytics: SimpleAnalytics): void {
    const { careerInterests, totalChoices } = analytics
    
    if (careerInterests.length > 3 && totalChoices > 15) {
      analytics.explorationDepth = 'deep'
    } else if (careerInterests.length > 1 && totalChoices > 8) {
      analytics.explorationDepth = 'moderate'
    } else {
      analytics.explorationDepth = 'shallow'
    }
  }

  private countPatterns(history: ChoiceAnalytics[]): Record<string, number> {
    const counts: Record<string, number> = {}
    
    for (const choice of history) {
      counts[choice.pattern] = (counts[choice.pattern] || 0) + 1
    }
    
    return counts
  }

  private getPrimaryInterest(patternCounts: Record<string, number>): string {
    const entries = Object.entries(patternCounts)
    if (entries.length === 0) return 'exploring'
    
    return entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    )[0]
  }

  private getBirminghamOpportunities(interest: string): string[] {
    const opportunities = {
      'helping': [
        'UAB Medical Center - Healthcare Programs',
        'Birmingham City Schools - Teaching Opportunities',
        'United Way of Central Alabama - Community Service'
      ],
      'building': [
        'Southern Company - Engineering Programs',
        'Nucor Steel - Manufacturing Careers',
        'Alabama Power - Infrastructure Development'
      ],
      'analyzing': [
        'Regions Bank - Fintech Development',
        'BBVA Innovation Center - Banking Technology',
        'UAB Informatics - Health Technology'
      ],
      'exploring': [
        'Innovation Depot - Startup Incubator',
        'Velocity Accelerator - Business Development',
        'REV Birmingham - Economic Development'
      ],
      'patience': [
        'Birmingham Counseling Services',
        'Community Support Programs',
        'Mental Health Organizations'
      ]
    }

    return opportunities[interest as keyof typeof opportunities] || opportunities.exploring
  }

  private getNextSteps(interest: string): string[] {
    return [
      `Research ${interest} careers in Birmingham`,
      'Connect with local professionals in this field',
      'Explore education requirements and pathways',
      'Consider internship or volunteer opportunities'
    ]
  }
}

/**
 * Get the global analytics engine instance
 */
export function getSimpleAnalytics(): SimpleAnalyticsEngine {
  return SimpleAnalyticsEngine.getInstance()
}

/**
 * Track choice with simplified analytics (convenience function)
 */
export function trackChoice(playerId: string, choice: {
  text: string
  consequence: string
  responseTime: number
}): void {
  getSimpleAnalytics().trackChoice(playerId, choice)
}

/**
 * Get career insights (convenience function)
 */
export function getCareerInsights(playerId: string) {
  return getSimpleAnalytics().getCareerInsights(playerId)
}
