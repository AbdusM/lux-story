/**
 * Simplified Career Analytics
 * Preserves core functionality with 90% less complexity
 *
 * Supabase-primary architecture:
 * - On app mount: Hydrate from Supabase (source of truth)
 * - On updates: Write to localStorage + queue sync to Supabase
 */

import { queueCareerAnalyticsSync } from './sync-queue'
import { safeStorage } from './safe-storage'
import { logger } from './logger'

// Essential interfaces only
export interface SimpleCareerMetrics {
  sectionsViewed: string[]
  careerInterests: string[]
  birminghamOpportunities: string[]
  timeSpent: number
  choicesMade: number
  platformsExplored: string[]
  localAffinity: number // New: Birmingham connectivity score
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
  private hydrationPromises: Map<string, Promise<void>> = new Map()
  private syncCounter: Map<string, number> = new Map() // Track updates per user

  /**
   * Hydrate user metrics from Supabase (source of truth)
   * Called on app mount
   */
  async hydrateFromSupabase(userId: string): Promise<boolean> {
    // Return existing hydration promise if already in progress
    if (this.hydrationPromises.has(userId)) {
      await this.hydrationPromises.get(userId)
      return this.metrics.has(userId)
    }

    // Create new hydration promise
    const hydrationPromise = this._performHydration(userId)
    this.hydrationPromises.set(userId, hydrationPromise)

    try {
      await hydrationPromise
      return this.metrics.has(userId)
    } finally {
      this.hydrationPromises.delete(userId)
    }
  }

  private async _performHydration(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/user/career-analytics?userId=${userId}`)

      if (!response.ok) {
        console.warn('[SimpleCareerAnalytics] Failed to fetch from Supabase, falling back to localStorage')
        this.loadFromLocalStorage(userId)
        return
      }

      const result = await response.json()

      if (result.exists && result.analytics) {
        // Supabase is source of truth
        this.metrics.set(userId, {
          platformsExplored: result.analytics.platformsExplored || [],
          careerInterests: result.analytics.careerInterests || [],
          choicesMade: result.analytics.choicesMade || 0,
          timeSpent: result.analytics.timeSpent || 0,
          sectionsViewed: result.analytics.sectionsViewed || [],
          birminghamOpportunities: result.analytics.birminghamOpportunities || [],
          localAffinity: result.analytics.localAffinity || 0
        })

        // Also save to localStorage for offline access
        this.saveToLocalStorage(userId)

        logger.debug('Hydrated from Supabase', { operation: 'simple-career-analytics.hydrate', userId })
      } else {
        // No Supabase data, try localStorage
        this.loadFromLocalStorage(userId)

        // If localStorage has data, push to Supabase to establish truth
        if (this.metrics.has(userId)) {
          this.queueSync(userId)
        }
      }
    } catch (error) {
      console.error('[SimpleCareerAnalytics] Hydration error:', error)
      this.loadFromLocalStorage(userId)
    }
  }

  /**
   * Load metrics from localStorage (fallback)
   */
  private loadFromLocalStorage(userId: string): void {
    const key = `career_analytics_${userId}`
    const stored = safeStorage.getItem(key)

    if (stored) {
      try {
        const data = JSON.parse(stored)
        this.metrics.set(userId, data)
        logger.debug('Loaded from localStorage', { operation: 'simple-career-analytics.load', userId })
      } catch (error) {
        console.error('[SimpleCareerAnalytics] Failed to parse localStorage data:', error)
      }
    }
  }

  /**
   * Save metrics to localStorage
   */
  private saveToLocalStorage(userId: string): void {
    const key = `career_analytics_${userId}`
    const metrics = this.metrics.get(userId)

    if (metrics) {
      safeStorage.setItem(key, JSON.stringify(metrics))
    }
  }

  /**
   * Queue sync to Supabase (background, eventual consistency)
   * Syncs every 5 updates to reduce API load
   */
  private queueSync(userId: string): void {
    const metrics = this.metrics.get(userId)
    if (!metrics) return

    // Increment sync counter
    const counter = (this.syncCounter.get(userId) || 0) + 1
    this.syncCounter.set(userId, counter)

    // Sync every 5 updates
    if (counter % 5 === 0) {
      queueCareerAnalyticsSync({
        user_id: userId,
        platforms_explored: metrics.platformsExplored,
        career_interests: metrics.careerInterests,
        choices_made: metrics.choicesMade,
        time_spent_seconds: metrics.timeSpent,
        sections_viewed: metrics.sectionsViewed,
        birmingham_opportunities: metrics.birminghamOpportunities
      })

      logger.debug('Queued sync', { operation: 'simple-career-analytics.queue-sync', userId, updateNumber: counter })
    }
  }

  trackChoice(userId: string, choice: Record<string, unknown> & { text?: string }) {
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

    // New: Local Affinity Scoring (Pattern 4)
    const localKeywords = ['birmingham', 'uab', 'depot', 'railroad', 'magic city', 'bessemer', 'homewood', 'local']
    if (localKeywords.some(keyword => choiceText.includes(keyword))) {
      userMetrics.localAffinity = (userMetrics.localAffinity || 0) + 1
      logger.debug('Local Affinity Increased', { operation: 'simple-career-analytics.local-affinity', userId, affinity: userMetrics.localAffinity })
    }

    // Persist and sync
    this.saveToLocalStorage(userId)
    this.queueSync(userId)
  }

  trackPlatformVisit(userId: string, platformId: string) {
    const userMetrics = this.getUserMetrics(userId)
    if (!userMetrics.platformsExplored.includes(platformId)) {
      userMetrics.platformsExplored.push(platformId)

      // Persist and sync
      this.saveToLocalStorage(userId)
      this.queueSync(userId)
    }
  }

  trackTimeSpent(userId: string, seconds: number) {
    const userMetrics = this.getUserMetrics(userId)
    userMetrics.timeSpent += seconds

    // Persist and sync
    this.saveToLocalStorage(userId)
    this.queueSync(userId)
  }

  addInterest(userId: string, careerArea: string) {
    const userMetrics = this.getUserMetrics(userId)
    if (!userMetrics.careerInterests.includes(careerArea)) {
      userMetrics.careerInterests.push(careerArea)

      // Persist and sync
      this.saveToLocalStorage(userId)
      this.queueSync(userId)
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
      localAffinity: userMetrics.localAffinity || 0,
      nextSteps: this.getNextSteps(userMetrics)
    }
  }

  public getUserMetrics(userId: string): SimpleCareerMetrics {
    if (!this.metrics.has(userId)) {
      this.metrics.set(userId, {
        sectionsViewed: [],
        careerInterests: [],
        birminghamOpportunities: [],
        timeSpent: 0,
        choicesMade: 0,
        platformsExplored: [],
        localAffinity: 0
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
export function trackUserChoice(userId: string, choice: Record<string, unknown> & { text?: string }) {
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