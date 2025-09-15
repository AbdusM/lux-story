/**
 * Simplified Career Analytics
 * Preserves core functionality with 90% less complexity
 */

// Essential interfaces only
export interface SimpleCareerMetrics {
  sectionsViewed: string[]
  careerInterests: string[]
  birminghamOpportunities: string[]
  timeSpent: number
  choicesMade: number
  platformsExplored: string[]
}

export interface SimpleBirminghamOpportunity {
  id: string
  name: string
  organization: string
  type: 'internship' | 'job_shadow' | 'career_program' | 'volunteer'
  careerArea: string
  link?: string
}

// Core Birmingham opportunities (simplified from 26 to essential ones)
export const BIRMINGHAM_OPPORTUNITIES: SimpleBirminghamOpportunity[] = [
  // Healthcare
  { id: 'uab-medical', name: 'Medical Shadowing', organization: 'UAB Medical Center', type: 'job_shadow', careerArea: 'healthcare' },
  { id: 'childrens-volunteer', name: 'Youth Volunteer Program', organization: "Children's of Alabama", type: 'volunteer', careerArea: 'healthcare' },

  // Technology
  { id: 'regions-it', name: 'IT Internship', organization: 'Regions Bank', type: 'internship', careerArea: 'technology' },
  { id: 'shipt-tech', name: 'Tech Program', organization: 'Shipt', type: 'career_program', careerArea: 'technology' },

  // Engineering
  { id: 'southern-energy', name: 'Engineering Program', organization: 'Southern Company', type: 'career_program', careerArea: 'engineering' },
  { id: 'acipco-manufacturing', name: 'Manufacturing Tour', organization: 'ACIPCO', type: 'job_shadow', careerArea: 'engineering' },

  // Education
  { id: 'bcs-teaching', name: 'Teaching Assistant', organization: 'Birmingham City Schools', type: 'volunteer', careerArea: 'education' },

  // Creative/Media
  { id: 'abc-media', name: 'Media Internship', organization: 'ABC 33/40', type: 'internship', careerArea: 'creative' }
]

// Simple analytics engine (replaces 1,935 lines with ~100)
export class SimpleCareerAnalytics {
  private metrics: Map<string, SimpleCareerMetrics> = new Map()

  trackChoice(userId: string, choice: any) {
    const userMetrics = this.getUserMetrics(userId)
    userMetrics.choicesMade++

    // Simple interest detection based on choice text
    const choiceText = choice.text?.toLowerCase() || ''
    if (choiceText.includes('help') || choiceText.includes('care')) {
      this.addInterest(userId, 'healthcare')
    }
    if (choiceText.includes('build') || choiceText.includes('create')) {
      this.addInterest(userId, 'engineering')
    }
    if (choiceText.includes('tech') || choiceText.includes('computer')) {
      this.addInterest(userId, 'technology')
    }
    if (choiceText.includes('teach') || choiceText.includes('learn')) {
      this.addInterest(userId, 'education')
    }
  }

  trackPlatformVisit(userId: string, platformId: string) {
    const userMetrics = this.getUserMetrics(userId)
    if (!userMetrics.platformsExplored.includes(platformId)) {
      userMetrics.platformsExplored.push(platformId)
    }
  }

  trackTimeSpent(userId: string, seconds: number) {
    const userMetrics = this.getUserMetrics(userId)
    userMetrics.timeSpent += seconds
  }

  addInterest(userId: string, careerArea: string) {
    const userMetrics = this.getUserMetrics(userId)
    if (!userMetrics.careerInterests.includes(careerArea)) {
      userMetrics.careerInterests.push(careerArea)
    }
  }

  getBirminghamOpportunities(userId: string): SimpleBirminghamOpportunity[] {
    const userMetrics = this.getUserMetrics(userId)

    // Simple matching: return opportunities for user's interests
    if (userMetrics.careerInterests.length === 0) {
      return BIRMINGHAM_OPPORTUNITIES.slice(0, 3) // Show first 3 by default
    }

    return BIRMINGHAM_OPPORTUNITIES.filter(opp =>
      userMetrics.careerInterests.includes(opp.careerArea)
    )
  }

  getSimpleInsights(userId: string) {
    const userMetrics = this.getUserMetrics(userId)

    return {
      primaryInterest: userMetrics.careerInterests[0] || 'exploring',
      platformsCount: userMetrics.platformsExplored.length,
      engagementLevel: this.calculateEngagement(userMetrics),
      birminghamMatches: this.getBirminghamOpportunities(userId).length,
      nextSteps: this.getNextSteps(userMetrics)
    }
  }

  private getUserMetrics(userId: string): SimpleCareerMetrics {
    if (!this.metrics.has(userId)) {
      this.metrics.set(userId, {
        sectionsViewed: [],
        careerInterests: [],
        birminghamOpportunities: [],
        timeSpent: 0,
        choicesMade: 0,
        platformsExplored: []
      })
    }
    return this.metrics.get(userId)!
  }

  private calculateEngagement(metrics: SimpleCareerMetrics): string {
    const score = metrics.choicesMade + (metrics.timeSpent / 60) + metrics.platformsExplored.length

    if (score > 15) return 'high'
    if (score > 7) return 'medium'
    return 'low'
  }

  private getNextSteps(metrics: SimpleCareerMetrics): string[] {
    const steps: string[] = []

    if (metrics.careerInterests.length === 0) {
      steps.push('Continue exploring different career areas')
    }

    if (metrics.platformsExplored.length < 3) {
      steps.push('Visit more career exploration platforms')
    }

    if (metrics.careerInterests.length > 0) {
      steps.push(`Explore Birmingham opportunities in ${metrics.careerInterests[0]}`)
    }

    return steps
  }
}

// Singleton instance
let analyticsInstance: SimpleCareerAnalytics | null = null

export function getSimpleAnalytics(): SimpleCareerAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new SimpleCareerAnalytics()
  }
  return analyticsInstance
}

// Helper functions for easy integration
export function trackUserChoice(userId: string, choice: any) {
  getSimpleAnalytics().trackChoice(userId, choice)
}

export function trackPlatformVisit(userId: string, platformId: string) {
  getSimpleAnalytics().trackPlatformVisit(userId, platformId)
}

export function getUserInsights(userId: string) {
  return getSimpleAnalytics().getSimpleInsights(userId)
}

export function getBirminghamMatches(userId: string) {
  return getSimpleAnalytics().getBirminghamOpportunities(userId)
}