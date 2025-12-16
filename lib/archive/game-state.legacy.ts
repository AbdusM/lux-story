/**
 * @deprecated ARCHIVED - Legacy Game State System from Sprint 1
 *
 * HISTORY:
 * This was the original state management system using a scene-based approach.
 *
 * REPLACED BY:
 * - lib/character-state.ts (current canonical state system)
 * - lib/game-store.ts (Zustand store for persistence)
 *
 * PRESERVED FOR:
 * - Historical reference
 * - PatternTracker class design (may be useful for analytics)
 * - Understanding early architecture decisions
 *
 * DO NOT IMPORT THIS FILE.
 */

import { STORAGE_KEYS } from '../game-constants'

import { logger } from '@/lib/logger'
// Shared pattern tracker instance
let patternTrackerInstance: PatternTracker | null = null

/**
 * Simplified game state - just story progress
 */
export interface GameState {
  /** Current scene ID (e.g., '2-3' for chapter 2, scene 3) */
  currentScene: string
  /** History of player choices */
  choices: ChoiceRecord[]
  /** Number of completed meditations (for migration) */
  meditationCount: number
}

/**
 * Record of a player's choice in the story
 */
export interface ChoiceRecord {
  /** Scene where the choice was made */
  sceneId: string
  /** Text of the chosen option */
  choice: string
  /** Consequence tag for the choice */
  consequence: string
}

/**
 * Pattern tracking data - invisible to player
 * For Birmingham career exploration grant demo
 */
export interface PatternData {
  /** Choice themes selected by player */
  choiceThemes: string[]
  /** Last update timestamp */
  lastUpdate: number
}

/**
 * Invisible pattern tracker for career exploration analysis
 * Never displays metrics or progress to the user
 */
export class PatternTracker {
  private patterns: PatternData

  constructor() {
    this.patterns = this.loadPatterns() || this.getInitialPatterns()
  }

  private getInitialPatterns(): PatternData {
    return {
      choiceThemes: [],
      lastUpdate: Date.now()
    }
  }

  /**
   * Load pattern data from localStorage
   */
  private loadPatterns(): PatternData | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null
      }
      
      const saved = localStorage.getItem(STORAGE_KEYS.PATTERNS)
      if (!saved) return null
      
      return JSON.parse(saved)
    } catch (error) {
      logger.warn('Failed to load pattern data:', { error })
      return null
    }
  }

  /**
   * Save pattern data to localStorage
   */
  private savePatterns(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        this.patterns.lastUpdate = Date.now()
        localStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(this.patterns))
      }
    } catch (error) {
      logger.warn('Failed to save pattern data:', { error })
    }
  }


  /**
   * Record a choice theme (invisible to player)
   */
  recordChoiceTheme(theme: string): void {
    this.patterns.choiceThemes.push(theme)
    this.savePatterns()
  }

  /**
   * Get dominant patterns for internal analysis (never shown to user)
   * Returns career-relevant insights for the Birmingham demo
   */
  private analyzePatternsInternal(): {
    primaryChoiceThemes: string[]
    dominantTheme: string | null
  } {
    // Find primary choice themes (top 3 most common)
    const themeCounts: Record<string, number> = {}
    this.patterns.choiceThemes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1
    })
    
    const sortedThemes = Object.entries(themeCounts)
      .sort(([, a], [, b]) => b - a)
    
    const primaryChoiceThemes = sortedThemes
      .slice(0, 3)
      .map(([theme]) => theme)
    
    const dominantTheme = sortedThemes.length > 0 ? sortedThemes[0][0] : null

    return {
      primaryChoiceThemes,
      dominantTheme
    }
  }

  /**
   * Check if user shows strong preference patterns
   * Used internally for career pathway suggestions (never displayed)
   */
  hasStrongPatterns(): boolean {
    const analysis = this.analyzePatternsInternal()
    
    // Consider patterns "strong" if:
    // - Has made at least 5 thematic choices
    // - Has a clear dominant theme
    return this.patterns.choiceThemes.length >= 5 && 
           analysis.dominantTheme !== null
  }

  /**
   * Reset all pattern data
   */
  reset(): void {
    this.patterns = this.getInitialPatterns()
    this.savePatterns()
  }

  /**
   * Get raw pattern data (for development/debugging only)
   */
  getPatternData(): PatternData {
    return { ...this.patterns }
  }
}

/**
 * Get shared pattern tracker instance
 * 
 * Usage examples:
 * 
 * // Track choice themes (when player makes thematic choices)
 * gameStateManager.recordChoiceWithTheme(sceneId, choiceText, consequence, 'helping')
 * 
 * // Check for patterns (for internal career analysis)
 * const hasPatterns = getPatternTracker().hasStrongPatterns()
 */
export function getPatternTracker(): PatternTracker {
  if (!patternTrackerInstance) {
    patternTrackerInstance = new PatternTracker()
  }
  return patternTrackerInstance
}

/**
 * Simple game state manager - no gamification
 */
export class GameStateManager {
  private state: GameState

  constructor() {
    this.state = this.loadState() || this.getInitialState()
  }

  private getInitialState(): GameState {
    return {
      currentScene: '1-1',
      choices: [],
      meditationCount: 0
    }
  }

  /**
   * Load game state from localStorage
   */
  private loadState(): GameState | null {
    try {
      // Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        return null
      }
      
      const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATE)
      if (!saved) return null
      
      const parsed = JSON.parse(saved)
      
      // Migrate old state format
      if (parsed.currentChapter && !parsed.currentScene.includes('-')) {
        parsed.currentScene = `${parsed.currentChapter}-1`
      }
      
      return {
        currentScene: parsed.currentScene || '1-1',
        choices: parsed.choices || [],
        meditationCount: parsed.meditationCount || 0
      }
    } catch (error) {
      logger.warn('Failed to load game state:', { error })
      return null
    }
  }

  /**
   * Save current state to localStorage
   */
  private saveState(): void {
    try {
      // Check if localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(this.state))
      }
    } catch (error) {
      logger.warn('Failed to save game state:', { error })
    }
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return { ...this.state }
  }

  /**
   * Set current scene
   */
  setScene(sceneId: string): void {
    this.state.currentScene = sceneId
    this.saveState()
  }

  /**
   * Record a player choice
   */
  recordChoice(sceneId: string, choiceText: string, consequence: string): void {
    this.state.choices.push({
      sceneId,
      choice: choiceText,
      consequence
    })
    this.saveState()
  }

  /**
   * Record a player choice with theme tracking (for pattern analysis)
   */
  recordChoiceWithTheme(sceneId: string, choiceText: string, consequence: string, theme?: string): void {
    this.recordChoice(sceneId, choiceText, consequence)
    
    // If a theme is provided, track it invisibly
    if (theme) {
      getPatternTracker().recordChoiceTheme(theme)
    }
  }

  /**
   * Reset all progress
   */
  reset(): void {
    this.state = this.getInitialState()
    this.saveState()
    
    // Also reset pattern tracking
    getPatternTracker().reset()
  }

  /**
   * Check if state is initialized
   */
  isInitialized(): boolean {
    return this.state !== null
  }
}