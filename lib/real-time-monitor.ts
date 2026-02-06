/**
 * Real-Time User Activity Monitor
 * Sends critical events to logger for live debugging during demos
 *
 * Usage: Import and call monitor functions throughout the app
 */

import { logger } from './logger'

export interface UserActivity {
  timestamp: number
  userId: string
  activityType: 'choice' | 'scene_enter' | 'skill_demo' | 'sync' | 'error' | 'page_load'
  data: Record<string, unknown>
}

class RealTimeMonitor {
  private activities: UserActivity[] = []
  private maxActivities = 100 // Keep last 100 activities

  /**
   * Log user choice with skills demonstrated
   */
  logChoice(userId: string, choiceId: string, skills: string[], sceneId: string) {
    const activity: UserActivity = {
      timestamp: Date.now(),
      userId,
      activityType: 'choice',
      data: {
        choiceId,
        skills,
        sceneId,
        skillCount: skills.length
      }
    }

    this.addActivity(activity)

    logger.debug('Choice made', {
      operation: 'real-time-monitor.choice',
      userId: this.anonymize(userId),
      choiceId,
      skills: skills.join(', '),
      sceneId,
      timestamp: new Date().toLocaleTimeString()
    })
  }

  /**
   * Log scene transition
   */
  logSceneEnter(userId: string, sceneId: string, context?: string) {
    const activity: UserActivity = {
      timestamp: Date.now(),
      userId,
      activityType: 'scene_enter',
      data: { sceneId, context }
    }

    this.addActivity(activity)

    logger.debug('Scene entered', {
      operation: 'real-time-monitor.scene',
      userId: this.anonymize(userId),
      sceneId,
      context: context?.substring(0, 50),
      timestamp: new Date().toLocaleTimeString()
    })
  }

  /**
   * Log skill demonstration
   */
  logSkillDemo(userId: string, skill: string, count: number, willSync: boolean) {
    const activity: UserActivity = {
      timestamp: Date.now(),
      userId,
      activityType: 'skill_demo',
      data: { skill, count, willSync }
    }

    this.addActivity(activity)

    logger.debug('Skill demonstrated', {
      operation: 'real-time-monitor.skill',
      userId: this.anonymize(userId),
      skill,
      count,
      willSync: willSync ? 'SYNCING TO SUPABASE' : 'Local only',
      timestamp: new Date().toLocaleTimeString()
    })
  }

  /**
   * Log Supabase sync
   */
  logSync(
    userId: string,
    syncType:
      | 'career_analytics'
      | 'skill_summary'
      | 'skill_demonstration'
      | 'career_exploration'
      | 'pattern_demonstration'
      | 'relationship_progress'
      | 'platform_state'
      | 'interaction_event',
    success: boolean,
    error?: string
  ) {
    const activity: UserActivity = {
      timestamp: Date.now(),
      userId,
      activityType: 'sync',
      data: { syncType, success, error }
    }

    this.addActivity(activity)

    logger.debug('Supabase sync', {
      operation: 'real-time-monitor.sync',
      userId: this.anonymize(userId),
      syncType,
      success,
      error: error?.substring(0, 100),
      timestamp: new Date().toLocaleTimeString()
    })
  }

  /**
   * Log errors that affect user
   */
  logError(userId: string, errorType: string, message: string, context?: unknown) {
    const activity: UserActivity = {
      timestamp: Date.now(),
      userId,
      activityType: 'error',
      data: { errorType, message, context }
    }

    this.addActivity(activity)

    console.error('🚨 [USER ACTIVITY] Error:', {
      userId: this.anonymize(userId),
      errorType,
      message,
      context,
      timestamp: new Date().toLocaleTimeString()
    })
  }

  /**
   * Log page load
   */
  logPageLoad(userId: string, page: string, loadTime?: number) {
    const activity: UserActivity = {
      timestamp: Date.now(),
      userId,
      activityType: 'page_load',
      data: { page, loadTime }
    }

    this.addActivity(activity)

    logger.debug('Page loaded', {
      operation: 'real-time-monitor.page-load',
      userId: this.anonymize(userId),
      page,
      loadTime: loadTime ? `${loadTime}ms` : 'N/A',
      timestamp: new Date().toLocaleTimeString()
    })
  }

  /**
   * Get activity summary for user
   */
  getUserSummary(userId: string): {
    totalActivities: number
    choicesMade: number
    skillsDemonstrated: number
    syncOperations: number
    errors: number
    lastActivity: Date | null
  } {
    const userActivities = this.activities.filter(a => a.userId === userId)

    return {
      totalActivities: userActivities.length,
      choicesMade: userActivities.filter(a => a.activityType === 'choice').length,
      skillsDemonstrated: userActivities.filter(a => a.activityType === 'skill_demo').length,
      syncOperations: userActivities.filter(a => a.activityType === 'sync').length,
      errors: userActivities.filter(a => a.activityType === 'error').length,
      lastActivity: userActivities.length > 0
        ? new Date(userActivities[userActivities.length - 1].timestamp)
        : null
    }
  }

  /**
   * Get all recent activities (for debugging)
   */
  getRecentActivities(limit: number = 20): UserActivity[] {
    return this.activities.slice(-limit)
  }

  /**
   * Print real-time dashboard to console
   */
  printDashboard() {
    const users = [...new Set(this.activities.map(a => a.userId))]

    logger.debug('Real-time user activity dashboard', {
      operation: 'real-time-monitor.dashboard',
      activeUsers: users.length,
      totalActivities: this.activities.length,
      userSummaries: users.map(userId => {
        const summary = this.getUserSummary(userId)
        return {
          userId: this.anonymize(userId),
          choices: summary.choicesMade,
          skills: summary.skillsDemonstrated,
          syncs: summary.syncOperations,
          errors: summary.errors,
          lastActivity: summary.lastActivity?.toLocaleTimeString() || 'N/A'
        }
      })
    })
  }

  /**
   * Clear old activities
   */
  private addActivity(activity: UserActivity) {
    this.activities.push(activity)

    // Keep only last N activities
    if (this.activities.length > this.maxActivities) {
      this.activities = this.activities.slice(-this.maxActivities)
    }
  }

  /**
   * Anonymize user ID for console logs (show last 4 chars)
   */
  private anonymize(userId: string): string {
    if (userId.length <= 8) return userId
    return `...${userId.slice(-6)}`
  }

  /**
   * Clear all activities (for testing)
   */
  clear() {
    this.activities = []
    logger.debug('Activity log cleared', { operation: 'real-time-monitor.clear' })
  }
}

// Singleton instance
const monitor = new RealTimeMonitor()

// Export singleton and helper functions
export default monitor

export const logChoice = (userId: string, choiceId: string, skills: string[], sceneId: string) =>
  monitor.logChoice(userId, choiceId, skills, sceneId)

export const logSceneEnter = (userId: string, sceneId: string, context?: string) =>
  monitor.logSceneEnter(userId, sceneId, context)

export const logSkillDemo = (userId: string, skill: string, count: number, willSync: boolean) =>
  monitor.logSkillDemo(userId, skill, count, willSync)

export const logSync = (
  userId: string,
  syncType:
    | 'career_analytics'
    | 'skill_summary'
    | 'skill_demonstration'
    | 'career_exploration'
    | 'pattern_demonstration'
    | 'relationship_progress'
    | 'platform_state'
    | 'interaction_event',
  success: boolean,
  error?: string
) =>
  monitor.logSync(userId, syncType, success, error)

export const logError = (userId: string, errorType: string, message: string, context?: unknown) =>
  monitor.logError(userId, errorType, message, context)

export const logPageLoad = (userId: string, page: string, loadTime?: number) =>
  monitor.logPageLoad(userId, page, loadTime)

export const printDashboard = () => monitor.printDashboard()

export const getUserSummary = (userId: string) => monitor.getUserSummary(userId)

export const getRecentActivities = (limit?: number) => monitor.getRecentActivities(limit)

// Make dashboard available globally for console debugging (types from lib/types/browser-augmentation.d.ts)
if (typeof window !== 'undefined') {
  window.userMonitor = {
    dashboard: printDashboard,
    summary: getUserSummary,
    recent: getRecentActivities,
    clear: () => monitor.clear()
  }

  // Tip available via userMonitor.dashboard() in console
}
