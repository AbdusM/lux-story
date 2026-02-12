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
import { getGraphForCharacter, findCharacterForNode, getSafeStart, type CharacterId } from './graph-registry'
import { resolveDialogueNodeRedirect } from './dialogue-node-redirects'
import { generateUserId } from './safe-storage'
import { logger } from './logger'

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

      logger.debug('Game saved successfully', { operation: 'game-state-manager.save', bytes: json.length })
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
        // Use verbose to avoid log spam - this is called frequently
        logger.verbose('No save file found', { operation: 'game-state-manager.load' })
        return null
      }

      const parsed = JSON.parse(json)

      // Validate the loaded data
      if (!StateValidation.isValidSerializableGameState(parsed)) {
        console.error('Save file is corrupted or invalid')

        // Try backup
        const backup = this.loadBackupState()
        if (backup) {
          logger.debug('Restored from backup', { operation: 'game-state-manager.load-backup' })
          return backup
        }

        return null
      }

      // Check if migration is needed
      const migrated = this.migrateIfNeeded(parsed)

      // Convert to GameState
      const gameState = GameStateUtils.deserialize(migrated)

      // Session determinism: each load starts a fresh session window.
      // Without this, returning-player detection can remain "stuck" to an old session.
      gameState.sessionStartTime = Date.now()

      // Final validation
      if (!StateValidation.isValidGameState(gameState)) {
        console.error('Deserialized state is invalid')
        return null
      }

      // Topology compatibility: resolve migrated node IDs before graph lookup.
      const redirect = resolveDialogueNodeRedirect(gameState.currentNodeId)
      if (redirect.cycleDetected) {
        logger.warn('Dialogue node redirect cycle detected; falling back to recovery', {
          operation: 'game-state-manager.node-redirect-cycle',
          nodeId: gameState.currentNodeId,
          path: redirect.path,
        })
      } else if (redirect.truncated) {
        logger.warn('Dialogue node redirect exceeded max hops; continuing with best-effort node', {
          operation: 'game-state-manager.node-redirect-truncated',
          nodeId: gameState.currentNodeId,
          path: redirect.path,
        })
      } else if (redirect.resolvedNodeId !== gameState.currentNodeId) {
        const oldNodeId = gameState.currentNodeId
        gameState.currentNodeId = redirect.resolvedNodeId
        const relocated = findCharacterForNode(redirect.resolvedNodeId, gameState)
        if (relocated) {
          gameState.currentCharacterId = relocated.characterId
        }
        logger.info('Migrated saved node via redirect map', {
          operation: 'game-state-manager.node-redirect',
          fromNodeId: oldNodeId,
          toNodeId: redirect.resolvedNodeId,
          hops: redirect.hops,
        })
      }

      // Verify currentNodeId exists in the graph
      try {
        const graph = getGraphForCharacter(
          gameState.currentCharacterId as CharacterId,
          gameState
        )
        if (!graph.nodes.has(gameState.currentNodeId)) {
          // ATTEMPT RECOVERY instead of returning null
          const recovered = this.recoverMissingNode(gameState)
          if (recovered) {
            logger.info('Recovered from missing node', {
              operation: 'game-state-manager.recovery',
              oldNode: gameState.currentNodeId,
              newNode: recovered.currentNodeId,
              character: recovered.currentCharacterId
            })
            return recovered
          }
          // Only reset if recovery impossible
          logger.warn('Node missing, resetting to hub', {
            operation: 'game-state-manager.reset-to-hub',
            nodeId: gameState.currentNodeId
          })
          return this.resetToHub(gameState) // Preserves trust/flags/patterns
        }
      } catch (error) {
        console.error('Failed to verify node exists:', error)
        // Attempt recovery even on error
        const recovered = this.recoverMissingNode(gameState)
        if (recovered) {
          return recovered
        }
        return this.resetToHub(gameState)
      }

      // Use verbose to avoid log spam - this is called frequently
      logger.verbose('Game loaded successfully', { operation: 'game-state-manager.load', version: gameState.saveVersion })
      return gameState

    } catch (error) {
      console.error('Failed to load game state:', error)

      // Try backup
      const backup = this.loadBackupState()
      if (backup) {
        logger.warn('Main save corrupted, restored from backup', { operation: 'game-state-manager.load-backup-fallback' })
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
      const restored = GameStateUtils.deserialize(migrated)
      restored.sessionStartTime = Date.now()
      return restored

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

    logger.debug('Migrating save', { operation: 'game-state-manager.migrate', fromVersion: save.saveVersion, toVersion: currentVersion })

    // Future migration logic goes here
    // For now, we'll just update the version
    // In the future, this would handle structural changes

    // Fix invalid UUIDs (legacy IDs)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(save.playerId)) {
      // Use the authoritative ID from safe-storage (which is now guaranteed to be a UUID)
      // or generate a new one if that fails
      const newId = generateUserId()
      logger.info('Migrating legacy player ID to UUID', { oldId: save.playerId, newId })
      save.playerId = newId
      // Also update the version to ensure this sticks
      save.saveVersion = currentVersion
    }

    return {
      ...save,
      saveVersion: currentVersion
    }
  }

  /**
   * Attempt to recover from a missing node by finding an equivalent location
   * Recovery strategies (in order):
   * 1. Check if node moved to different character graph
   * 2. Find character's hub node (e.g., samuel_hub_initial)
   * 3. Fallback to Samuel introduction (preserves all state)
   */
  private static recoverMissingNode(gameState: GameState): GameState | null {
    const missingNodeId = gameState.currentNodeId
    const currentCharacterId = gameState.currentCharacterId

    // Strategy 0: explicit redirect map (safe topology migrations).
    const redirect = resolveDialogueNodeRedirect(missingNodeId)
    if (!redirect.cycleDetected && redirect.resolvedNodeId !== missingNodeId) {
      const redirectedSearch = findCharacterForNode(redirect.resolvedNodeId, gameState)
      if (redirectedSearch && redirectedSearch.graph.nodes.has(redirect.resolvedNodeId)) {
        return {
          ...gameState,
          currentCharacterId: redirectedSearch.characterId,
          currentNodeId: redirect.resolvedNodeId,
          lastSaved: Date.now(),
        }
      }
    }

    // Strategy 1: Check if node moved to different character graph
    const searchResult = findCharacterForNode(missingNodeId, gameState)
    if (searchResult && searchResult.graph.nodes.has(missingNodeId)) {
      // Node found in a different graph - update character and continue
      return {
        ...gameState,
        currentCharacterId: searchResult.characterId,
        currentNodeId: missingNodeId,
        lastSaved: Date.now()
      }
    }

    // Strategy 2: Try to find character's hub node
    const characterGraph = getGraphForCharacter(currentCharacterId, gameState)

    // For Samuel, try common hub nodes
    if (currentCharacterId === 'samuel') {
      const hubNodes = ['samuel_hub_initial', 'samuel_hub_after_maya', 'samuel_hub_after_devon', 'samuel_comprehensive_hub']
      for (const hubNodeId of hubNodes) {
        if (characterGraph.nodes.has(hubNodeId)) {
          return {
            ...gameState,
            currentNodeId: hubNodeId,
            currentCharacterId: 'samuel',
            lastSaved: Date.now()
          }
        }
      }
    }

    // Strategy 3: Fallback to safe start (Samuel introduction)
    // This preserves all state (trust, flags, patterns)
    const safeStart = getSafeStart()
    const safeNodeId = safeStart.graph.startNodeId || 'samuel_introduction'

    if (safeStart.graph.nodes.has(safeNodeId)) {
      return {
        ...gameState,
        currentNodeId: safeNodeId,
        currentCharacterId: safeStart.characterId,
        lastSaved: Date.now()
      }
    }

    // Recovery failed
    return null
  }

  /**
   * Reset to hub while preserving all player progress
   * Preserves: trust levels, flags, patterns, character relationships
   * Only resets: current node position
   */
  private static resetToHub(gameState: GameState): GameState {
    const safeStart = getSafeStart()
    const safeNodeId = safeStart.graph.startNodeId || 'samuel_introduction'

    return {
      ...gameState,
      currentNodeId: safeNodeId,
      currentCharacterId: safeStart.characterId,
      lastSaved: Date.now()
    }
  }

  /**
   * Reset conversation position while preserving relationships
   * (Characters remember you, but conversation starts fresh at Samuel's hub)
   */
  static resetConversationPosition(state: GameState): GameState {
    return {
      ...state,
      currentNodeId: 'samuel_introduction', // Reset to Samuel
      currentCharacterId: 'samuel',
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
      localStorage.removeItem('grand-central-game-store') // Clear Zustand store

      // Clear Skill Tracker data (find all keys starting with skill_tracker_)
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('skill_tracker_')) {
          localStorage.removeItem(key)
        }
      })

      logger.warn('NUCLEAR RESET: All save data deleted', { operation: 'game-state-manager.nuclear-reset' })
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

      logger.debug('Save imported successfully', { operation: 'game-state-manager.import' })
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
  /**
   * Debug helper - log current save state
   */
  static debugSaveState(): void {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (!json) {
        // eslint-disable-next-line no-console
        console.log('No save file exists')
        return
      }

      const parsed = JSON.parse(json)
      // eslint-disable-next-line no-console
      console.log('Current save state:', parsed)
      // eslint-disable-next-line no-console
      console.log('Save size:', json.length, 'bytes')

      // Check backup
      const backup = localStorage.getItem(BACKUP_STORAGE_KEY)
      if (backup) {
        // eslint-disable-next-line no-console
        console.log('Backup size:', backup.length, 'bytes')
      }

    } catch (error) {
      console.error('Failed to debug save state:', error)
    }
  }
}
