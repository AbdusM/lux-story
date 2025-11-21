/**
 * Game State Manager
 * Handles persistence, loading, and migration of game state
 *
 * CRITICAL: Save/load must be PERFECT from day one
 * This is not a feature - it's the foundation
 */

import {
  GameState,
  SerializableGameState,
  GameStateUtils,
  StateValidation
} from './character-state'

const STORAGE_KEY = 'grand-central-terminus-save'
const BACKUP_STORAGE_KEY = 'grand-central-terminus-save-backup'

/**
 * Manages all game state persistence operations
 * Handles save, load, backup, and migration
 */
export class GameStateManager {
  /**
   * Save game state to localStorage with backup
   * Returns true on success, false on failure
   */
  static saveGameState(state: GameState): boolean {
    try {
      // Validate state before saving
      if (!StateValidation.isValidGameState(state)) {
        console.error('Invalid game state, refusing to save')
        return false
      }

      // Update last saved timestamp
      state.lastSaved = Date.now()

      // Convert to serializable format
      const serializable = GameStateUtils.serialize(state)

      // Create backup of previous save
      const currentSave = localStorage.getItem(STORAGE_KEY)
      if (currentSave) {
        localStorage.setItem(BACKUP_STORAGE_KEY, currentSave)
      }

      // Save new state
      const json = JSON.stringify(serializable)
      localStorage.setItem(STORAGE_KEY, json)

      // Verify save was successful
      const verification = localStorage.getItem(STORAGE_KEY)
      if (verification !== json) {
        console.error('Save verification failed')
        this.restoreFromBackup()
        return false
      }

      console.log(`Game saved successfully (${json.length} bytes)`)
      return true

    } catch (error) {
      console.error('Failed to save game state:', error)

      // Check if we hit quota
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded')
        // Could implement cleanup of old saves here
      }

      return false
    }
  }

  /**
   * Load game state from localStorage
   * Returns null if no save exists or load fails
   */
  static loadGameState(): GameState | null {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (!json) {
        console.log('No save file found')
        return null
      }

      const parsed = JSON.parse(json)

      // Validate the loaded data
      if (!StateValidation.isValidSerializableGameState(parsed)) {
        console.error('Save file is corrupted or invalid')

        // Try backup
        const backup = this.loadBackupState()
        if (backup) {
          console.log('Restored from backup')
          return backup
        }

        return null
      }

      // Check if migration is needed
      const migrated = this.migrateIfNeeded(parsed)

      // Convert to GameState
      const gameState = GameStateUtils.deserialize(migrated)

      // Final validation
      if (!StateValidation.isValidGameState(gameState)) {
        console.error('Deserialized state is invalid')
        return null
      }

      console.log(`Game loaded successfully (v${gameState.saveVersion})`)
      return gameState

    } catch (error) {
      console.error('Failed to load game state:', error)

      // Try backup
      const backup = this.loadBackupState()
      if (backup) {
        console.log('Main save corrupted, restored from backup')
        return backup
      }

      return null
    }
  }

  /**
   * Load backup save state
   */
  private static loadBackupState(): GameState | null {
    try {
      const json = localStorage.getItem(BACKUP_STORAGE_KEY)
      if (!json) return null

      const parsed = JSON.parse(json)
      if (!StateValidation.isValidSerializableGameState(parsed)) {
        return null
      }

      const migrated = this.migrateIfNeeded(parsed)
      return GameStateUtils.deserialize(migrated)

    } catch {
      return null
    }
  }

  /**
   * Restore main save from backup
   */
  private static restoreFromBackup(): boolean {
    try {
      const backup = localStorage.getItem(BACKUP_STORAGE_KEY)
      if (!backup) return false

      localStorage.setItem(STORAGE_KEY, backup)
      return true

    } catch {
      return false
    }
  }

  /**
   * Check if save needs migration and migrate if necessary
   */
  private static migrateIfNeeded(save: SerializableGameState): SerializableGameState {
    const currentVersion = '1.0.0'

    if (save.saveVersion === currentVersion) {
      return save // No migration needed
    }

    console.log(`Migrating save from v${save.saveVersion} to v${currentVersion}`)

    // Future migration logic goes here
    // For now, we'll just update the version
    // In the future, this would handle structural changes

    return {
      ...save,
      saveVersion: currentVersion
    }
  }

  /**
   * Reset conversation position while preserving relationships
   * (Characters remember you, but conversation starts fresh at Samuel's hub)
   */
  static resetConversationPosition(state: GameState): GameState {
    return {
      ...state,
      currentNodeId: 'marcus_introduction', // Reset to Marcus for testing
      currentCharacterId: 'marcus',
      lastSaved: Date.now()
    }
  }

  /**
   * DANGER ZONE: Delete all save data and backups
   * This wipes ALL progress including relationships
   * Only use when player explicitly wants to start completely over
   */
  static nuclearReset(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(BACKUP_STORAGE_KEY)
      console.log('⚠️ NUCLEAR RESET: All save data deleted')
    } catch (error) {
      console.error('Failed to reset game state:', error)
    }
  }

  /**
   * Check if a save file exists
   */
  static hasSaveFile(): boolean {
    if (typeof window === 'undefined') return false // SSR compatibility
    return localStorage.getItem(STORAGE_KEY) !== null
  }

  /**
   * Get save file metadata without loading full state
   */
  static getSaveMetadata(): {
    exists: boolean
    version?: string
    lastSaved?: Date
    playerId?: string
  } | null {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (!json) {
        return { exists: false }
      }

      const parsed = JSON.parse(json)
      return {
        exists: true,
        version: parsed.saveVersion,
        lastSaved: new Date(parsed.lastSaved),
        playerId: parsed.playerId
      }

    } catch {
      return { exists: false }
    }
  }

  /**
   * Export save as JSON string for manual backup
   */
  static exportSave(): string | null {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (!json) return null

      // Validate before exporting
      const parsed = JSON.parse(json)
      if (!StateValidation.isValidSerializableGameState(parsed)) {
        console.error('Save file is invalid, cannot export')
        return null
      }

      return json

    } catch (error) {
      console.error('Failed to export save:', error)
      return null
    }
  }

  /**
   * Import save from JSON string
   */
  static importSave(json: string): boolean {
    try {
      const parsed = JSON.parse(json)

      // Validate imported data
      if (!StateValidation.isValidSerializableGameState(parsed)) {
        console.error('Imported save is invalid')
        return false
      }

      // Backup current save
      const currentSave = localStorage.getItem(STORAGE_KEY)
      if (currentSave) {
        localStorage.setItem(BACKUP_STORAGE_KEY, currentSave)
      }

      // Import new save
      localStorage.setItem(STORAGE_KEY, json)

      console.log('Save imported successfully')
      return true

    } catch (error) {
      console.error('Failed to import save:', error)
      return false
    }
  }

  /**
   * Autosave helper - saves with throttling
   */
  private static lastAutosave = 0
  private static readonly AUTOSAVE_INTERVAL = 30000 // 30 seconds

  static autosave(state: GameState): void {
    const now = Date.now()
    if (now - this.lastAutosave > this.AUTOSAVE_INTERVAL) {
      this.saveGameState(state)
      this.lastAutosave = now
    }
  }

  /**
   * Debug helper - log current save state
   */
  static debugSaveState(): void {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (!json) {
        console.log('No save file exists')
        return
      }

      const parsed = JSON.parse(json)
      console.log('Current save state:', parsed)
      console.log('Save size:', json.length, 'bytes')

      // Check backup
      const backup = localStorage.getItem(BACKUP_STORAGE_KEY)
      if (backup) {
        console.log('Backup size:', backup.length, 'bytes')
      }

    } catch (error) {
      console.error('Failed to debug save state:', error)
    }
  }
}