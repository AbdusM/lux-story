import { STORAGE_KEYS } from './game-constants'

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
   * Reset all progress
   */
  reset(): void {
    this.state = this.getInitialState()
    this.saveState()
  }

  /**
   * Check if state is initialized
   */
  isInitialized(): boolean {
    return this.state !== null
  }
}