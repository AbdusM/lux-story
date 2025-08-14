import { STORAGE_KEYS } from './game-constants'

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
  /** Time spent in each forest region (in seconds) */
  regionVisits: Record<string, number>
  /** Time spent with each character (in seconds) */
  characterTime: Record<string, number>
  /** Choice themes selected by player */
  choiceThemes: string[]
  /** Session start time for current tracking */
  sessionStart: number
  /** Last update timestamp */
  lastUpdate: number
}

/**
 * Invisible pattern tracker for career exploration analysis
 * Never displays metrics or progress to the user
 */
export class PatternTracker {
  private patterns: PatternData
  private currentRegion: string | null = null
  private currentCharacter: string | null = null
  private regionStartTime: number = 0
  private characterStartTime: number = 0

  constructor() {
    this.patterns = this.loadPatterns() || this.getInitialPatterns()
  }

  private getInitialPatterns(): PatternData {
    const now = Date.now()
    return {
      regionVisits: {},
      characterTime: {},
      choiceThemes: [],
      sessionStart: now,
      lastUpdate: now
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
      console.warn('Failed to load pattern data:', error)
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
      console.warn('Failed to save pattern data:', error)
    }
  }

  /**
   * Start tracking time in a region
   */
  enterRegion(regionId: string): void {
    // End previous region tracking
    this.exitCurrentRegion()
    
    this.currentRegion = regionId
    this.regionStartTime = Date.now()
  }

  /**
   * Stop tracking current region
   */
  exitCurrentRegion(): void {
    if (this.currentRegion && this.regionStartTime > 0) {
      const timeSpent = Math.round((Date.now() - this.regionStartTime) / 1000)
      
      if (!this.patterns.regionVisits[this.currentRegion]) {
        this.patterns.regionVisits[this.currentRegion] = 0
      }
      this.patterns.regionVisits[this.currentRegion] += timeSpent
      
      this.savePatterns()
    }
    
    this.currentRegion = null
    this.regionStartTime = 0
  }

  /**
   * Start tracking time with a character
   */
  interactWithCharacter(characterId: string): void {
    // End previous character tracking
    this.exitCurrentCharacter()
    
    this.currentCharacter = characterId
    this.characterStartTime = Date.now()
  }

  /**
   * Stop tracking current character interaction
   */
  exitCurrentCharacter(): void {
    if (this.currentCharacter && this.characterStartTime > 0) {
      const timeSpent = Math.round((Date.now() - this.characterStartTime) / 1000)
      
      if (!this.patterns.characterTime[this.currentCharacter]) {
        this.patterns.characterTime[this.currentCharacter] = 0
      }
      this.patterns.characterTime[this.currentCharacter] += timeSpent
      
      this.savePatterns()
    }
    
    this.currentCharacter = null
    this.characterStartTime = 0
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
    dominantRegion: string | null
    preferredCharacterType: string | null
    primaryChoiceThemes: string[]
    totalEngagementTime: number
  } {
    // Find most visited region
    let dominantRegion: string | null = null
    let maxRegionTime = 0
    for (const [region, time] of Object.entries(this.patterns.regionVisits)) {
      if (time > maxRegionTime) {
        maxRegionTime = time
        dominantRegion = region
      }
    }

    // Find preferred character type
    let preferredCharacterType: string | null = null
    let maxCharacterTime = 0
    for (const [character, time] of Object.entries(this.patterns.characterTime)) {
      if (time > maxCharacterTime) {
        maxCharacterTime = time
        preferredCharacterType = character
      }
    }

    // Find primary choice themes (top 3 most common)
    const themeCounts: Record<string, number> = {}
    this.patterns.choiceThemes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1
    })
    
    const primaryChoiceThemes = Object.entries(themeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([theme]) => theme)

    // Calculate total engagement time
    const totalEngagementTime = Object.values(this.patterns.regionVisits)
      .reduce((sum, time) => sum + time, 0) +
      Object.values(this.patterns.characterTime)
        .reduce((sum, time) => sum + time, 0)

    return {
      dominantRegion,
      preferredCharacterType,
      primaryChoiceThemes,
      totalEngagementTime
    }
  }

  /**
   * Check if user shows strong preference patterns
   * Used internally for career pathway suggestions (never displayed)
   */
  hasStrongPatterns(): boolean {
    const analysis = this.analyzePatternsInternal()
    
    // Consider patterns "strong" if:
    // - Total engagement > 5 minutes
    // - Has made at least 3 thematic choices
    // - Spent significant time in one region or with one character
    return analysis.totalEngagementTime > 300 && 
           this.patterns.choiceThemes.length >= 3 &&
           (analysis.dominantRegion !== null || analysis.preferredCharacterType !== null)
  }

  /**
   * Reset all pattern data
   */
  reset(): void {
    this.exitCurrentRegion()
    this.exitCurrentCharacter()
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
 * // Track region visits (when user enters/exits forest areas)
 * getPatternTracker().enterRegion('enchanted-grove')
 * getPatternTracker().exitCurrentRegion()
 * 
 * // Track character interactions (when talking to NPCs)
 * getPatternTracker().interactWithCharacter('wise-owl')
 * getPatternTracker().exitCurrentCharacter()
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
      console.warn('Failed to load game state:', error)
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
      console.warn('Failed to save game state:', error)
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