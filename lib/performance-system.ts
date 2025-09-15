import { logger } from '@/lib/logger'
/**
 * Performance System for Lux
 * Tracks and influences gameplay based on the equation:
 * Performance = (Alignment × Consistency) + (Learning × Patience) - (Anxiety × Rushing)
 * 
 * All metrics are invisible to the player
 */

export interface PerformanceMetrics {
  // Positive factors
  alignment: number      // 0-1: How well choices match emerging pattern
  consistency: number    // 0-1: Pattern stability over last 5 choices
  learning: number       // 0-1: Exploration of different paths
  patience: number       // 0-1: Time spent in stillness/reflection
  
  // Negative factors  
  anxiety: number        // 0-1: Rushed choices, seeking quick answers
  rushing: number        // 0-1: Speed without contemplation
  
  // Tracking data
  lastCalculation: number
  performanceHistory: number[]
  choiceTimestamps: number[]
  regionExploration: string[]
  characterInteractions: string[]
}

export class PerformanceSystem {
  private metrics: PerformanceMetrics
  private readonly STORAGE_KEY = 'lux-performance-metrics'
  
  constructor() {
    this.metrics = this.loadMetrics() || this.getInitialMetrics()
  }
  
  private getInitialMetrics(): PerformanceMetrics {
    return {
      alignment: 0.5,
      consistency: 0.5,
      learning: 0.3,
      patience: 0.5,
      anxiety: 0.2,
      rushing: 0.2,
      lastCalculation: Date.now(),
      performanceHistory: [],
      choiceTimestamps: [],
      regionExploration: [],
      characterInteractions: []
    }
  }
  
  private loadMetrics(): PerformanceMetrics | null {
    if (typeof window === 'undefined') return null
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      if (!saved) return null
      const parsed = JSON.parse(saved)
      // Ensure arrays are properly initialized
      parsed.regionExploration = parsed.regionExploration || []
      parsed.characterInteractions = parsed.characterInteractions || []
      return parsed
    } catch {
      return null
    }
  }
  
  private saveMetrics(): void {
    if (typeof window === 'undefined') return
    try {
      const toSave = {
        ...this.metrics,
        // Convert Sets to arrays for storage
        regionExploration: this.metrics.regionExploration,
        characterInteractions: this.metrics.characterInteractions
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave))
    } catch (error) {
      logger.warn('Failed to save performance metrics:', error)
    }
  }
  
  /**
   * Update metrics based on a choice made
   */
  updateFromChoice(
    choiceTheme: string,
    timeToChoose: number,
    currentScene: string,
    character?: string
  ): void {
    const now = Date.now()
    this.metrics.choiceTimestamps.push(now)
    
    // Update patience (time spent contemplating)
    const avgTimeToChoose = 15000 // 15 seconds is patient
    const patienceScore = Math.min(1, timeToChoose / avgTimeToChoose)
    this.metrics.patience = this.metrics.patience * 0.7 + patienceScore * 0.3
    
    // Update rushing (inverse of patience)
    const rushScore = timeToChoose < 3000 ? 1 : Math.max(0, 1 - (timeToChoose / 10000))
    this.metrics.rushing = this.metrics.rushing * 0.7 + rushScore * 0.3
    
    // Update anxiety (choosing quickly, especially "planning" or "questioning" repeatedly)
    const anxiousThemes = ['questioning', 'planning', 'seeking', 'curiosity']
    const isAnxiousChoice = anxiousThemes.includes(choiceTheme) && timeToChoose < 5000
    const anxietyScore = isAnxiousChoice ? 0.8 : 0.2
    this.metrics.anxiety = this.metrics.anxiety * 0.8 + anxietyScore * 0.2
    
    // Track exploration for learning metric
    if (currentScene.includes('grove') && !this.metrics.regionExploration.includes('grove')) {
      this.metrics.regionExploration.push('grove')
    }
    if (currentScene.includes('pattern') && !this.metrics.regionExploration.includes('pattern')) {
      this.metrics.regionExploration.push('pattern')
    }
    if (currentScene.includes('shape') && !this.metrics.regionExploration.includes('shape')) {
      this.metrics.regionExploration.push('shape')
    }
    if (currentScene.includes('growing') && !this.metrics.regionExploration.includes('growing')) {
      this.metrics.regionExploration.push('growing')
    }
    if (currentScene.includes('rhythm') && !this.metrics.regionExploration.includes('rhythm')) {
      this.metrics.regionExploration.push('rhythm')
    }
    
    if (character && !this.metrics.characterInteractions.includes(character)) {
      this.metrics.characterInteractions.push(character)
    }
    
    // Update learning based on exploration
    const explorationScore = Math.min(1, this.metrics.regionExploration.length / 3)
    const interactionScore = Math.min(1, this.metrics.characterInteractions.length / 4)
    this.metrics.learning = (explorationScore + interactionScore) / 2
    
    this.saveMetrics()
  }
  
  /**
   * Update alignment and consistency based on choice patterns
   */
  updateFromPatterns(recentThemes: string[]): void {
    if (recentThemes.length < 3) return
    
    // Calculate consistency (how similar are recent choices)
    const last5 = recentThemes.slice(-5)
    const themeCounts: Record<string, number> = {}
    last5.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1
    })
    
    const maxCount = Math.max(...Object.values(themeCounts))
    this.metrics.consistency = maxCount / last5.length
    
    // Calculate alignment (how well choices match dominant pattern)
    const allThemeCounts: Record<string, number> = {}
    recentThemes.forEach(theme => {
      allThemeCounts[theme] = (allThemeCounts[theme] || 0) + 1
    })
    
    const dominantTheme = Object.entries(allThemeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0]
    
    if (dominantTheme && last5.length > 0) {
      const alignmentScore = last5.filter(t => t === dominantTheme).length / last5.length
      this.metrics.alignment = this.metrics.alignment * 0.5 + alignmentScore * 0.5
    }
    
    this.saveMetrics()
  }
  
  /**
   * Calculate current performance score
   */
  calculatePerformance(): number {
    const positive = (this.metrics.alignment * this.metrics.consistency) + 
                    (this.metrics.learning * this.metrics.patience)
    const negative = (this.metrics.anxiety * this.metrics.rushing)
    
    const performance = Math.max(0, Math.min(1, positive - negative))
    
    // Track history
    this.metrics.performanceHistory.push(performance)
    if (this.metrics.performanceHistory.length > 20) {
      this.metrics.performanceHistory.shift()
    }
    
    this.metrics.lastCalculation = Date.now()
    this.saveMetrics()
    
    return performance
  }
  
  /**
   * Get performance level for game adjustments
   */
  getPerformanceLevel(): 'struggling' | 'exploring' | 'flowing' | 'mastering' {
    const performance = this.calculatePerformance()
    
    if (performance < 0.3) return 'struggling'
    if (performance < 0.5) return 'exploring'
    if (performance < 0.7) return 'flowing'
    return 'mastering'
  }
  
  /**
   * Get specific guidance based on current metrics
   */
  getGuidance(): string | null {
    // High anxiety
    if (this.metrics.anxiety > 0.7) {
      return "The forest whispers: 'Questions need not be answered quickly.'"
    }
    
    // High rushing
    if (this.metrics.rushing > 0.7) {
      return "Lux blinks slowly. There's wisdom in the pause."
    }
    
    // Low patience
    if (this.metrics.patience < 0.3) {
      return "The trees have been here for centuries. They're in no hurry."
    }
    
    // Low consistency but high exploration
    if (this.metrics.consistency < 0.3 && this.metrics.learning > 0.6) {
      return "Your curiosity maps many paths. Each has its own rhythm."
    }
    
    // High alignment and consistency
    if (this.metrics.alignment > 0.7 && this.metrics.consistency > 0.7) {
      return "Your path becomes clearer with each step."
    }
    
    return null
  }
  
  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = this.getInitialMetrics()
    this.saveMetrics()
  }
  
  /**
   * Get current metrics (for debugging only)
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }
}

// Singleton instance
let performanceInstance: PerformanceSystem | null = null

export function getPerformanceSystem(): PerformanceSystem {
  if (!performanceInstance) {
    performanceInstance = new PerformanceSystem()
  }
  return performanceInstance
}