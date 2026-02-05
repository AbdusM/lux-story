/**
 * TD-005: Unified localStorage Key Registry
 *
 * All localStorage keys should be defined here and accessed via STORAGE_KEYS.
 * This centralizes key management and enables:
 * - Consistent naming (lux_story_v2_* prefix)
 * - Migration from legacy keys
 * - Easy auditing of storage usage
 *
 * Key categories:
 * - Core: Game state and Zustand store
 * - Settings: Audio, accessibility, UI preferences
 * - Identity: Player ID
 * - Dev: God mode settings (separate namespace)
 */

export const STORAGE_PREFIX = 'lux_story_v2_'

/**
 * Canonical storage keys for the application.
 * All new code should use these constants.
 */
export const STORAGE_KEYS = {
  // ═══════════════════════════════════════════════════════════════════════════
  // CORE GAME STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Zustand store persistence (includes game state) */
  GAME_STORE: `${STORAGE_PREFIX}game_store`,

  /** Explicit game save (GameStateManager) */
  GAME_SAVE: `${STORAGE_PREFIX}game_save`,

  /** Backup of game save */
  GAME_SAVE_BACKUP: `${STORAGE_PREFIX}game_save_backup`,

  /** Multi-tab synchronization tracking */
  ACTIVE_TABS: `${STORAGE_PREFIX}active_tabs`,

  // ═══════════════════════════════════════════════════════════════════════════
  // USER SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Audio muted state (boolean as string) */
  AUDIO_MUTED: `${STORAGE_PREFIX}audio_muted`,

  /** Audio volume level (0-100 as string) */
  AUDIO_VOLUME: `${STORAGE_PREFIX}audio_volume`,

  /** Reduced motion preference (boolean as string) */
  REDUCED_MOTION: `${STORAGE_PREFIX}reduced_motion`,

  /** Accessibility profile */
  ACCESSIBILITY_PROFILE: `${STORAGE_PREFIX}accessibility_profile`,

  /** Text size preference */
  TEXT_SIZE: `${STORAGE_PREFIX}text_size`,

  /** Color blind mode */
  COLOR_BLIND_MODE: `${STORAGE_PREFIX}color_blind_mode`,

  /** Cognitive load level */
  COGNITIVE_LOAD_LEVEL: `${STORAGE_PREFIX}cognitive_load_level`,

  /** Keyboard shortcuts customization */
  KEYBOARD_SHORTCUTS: `${STORAGE_PREFIX}keyboard_shortcuts`,

  // ═══════════════════════════════════════════════════════════════════════════
  // UI STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Guest mode flag */
  GUEST_MODE: `${STORAGE_PREFIX}guest_mode`,

  /** Local mode notice seen */
  LOCAL_MODE_SEEN: `${STORAGE_PREFIX}local_mode_seen`,

  /** Keyboard hint shown */
  KEYBOARD_HINT_SHOWN: `${STORAGE_PREFIX}keyboard_hint_shown`,

  /** Settings panel discovered */
  SETTINGS_DISCOVERED: `${STORAGE_PREFIX}settings_discovered`,

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER IDENTITY
  // ═══════════════════════════════════════════════════════════════════════════

  /** Primary player ID */
  PLAYER_ID: `${STORAGE_PREFIX}player_id`,

  /** Player personas (research/analytics) */
  PLAYER_PERSONAS: `${STORAGE_PREFIX}player_personas`,

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════════════════════════════════════════

  /** Admin dashboard view mode preference */
  ADMIN_VIEW_MODE: `${STORAGE_PREFIX}admin_view_mode`,

  // ═══════════════════════════════════════════════════════════════════════════
  // ERROR RECOVERY
  // ═══════════════════════════════════════════════════════════════════════════

  /** Current scene ID for error boundary recovery */
  CURRENT_SCENE_ID: `${STORAGE_PREFIX}current_scene_id`,

  /** Last known scene ID for error recovery */
  LAST_KNOWN_SCENE_ID: `${STORAGE_PREFIX}last_known_scene_id`,
} as const

/**
 * Dev tools keys (keep separate namespace - not migrated)
 * These are only used in development and don't need migration.
 */
export const DEV_STORAGE_KEYS = {
  SHOW_HIDDEN_CHOICES: 'godMode_showHiddenChoices',
  SKIP_ANIMATIONS: 'godMode_skipAnimations',
} as const

/**
 * Legacy key to new key mapping for migration.
 * Keys not in this map are either:
 * - Already using new format
 * - Dev-only (not migrated)
 * - Test-only (not migrated)
 */
export const LEGACY_KEY_MAP: Record<string, keyof typeof STORAGE_KEYS> = {
  // Core game state
  'grand-central-game-store': 'GAME_STORE',
  'grand-central-terminus-save': 'GAME_SAVE',
  'grand-central-terminus-save-backup': 'GAME_SAVE_BACKUP',
  'lux-active-tabs': 'ACTIVE_TABS',

  // Audio settings
  'lux_audio_muted': 'AUDIO_MUTED',
  'lux_audio_volume': 'AUDIO_VOLUME',

  // Accessibility
  'lux_reduced_motion': 'REDUCED_MOTION',
  'lux_accessibility_profile': 'ACCESSIBILITY_PROFILE',
  'lux_text_size': 'TEXT_SIZE',
  'lux_color_blind_mode': 'COLOR_BLIND_MODE',
  'lux_cognitive_load_level': 'COGNITIVE_LOAD_LEVEL',
  'lux_keyboard_shortcuts': 'KEYBOARD_SHORTCUTS',

  // UI state
  'lux_guest_mode': 'GUEST_MODE',
  'lux-local-mode-seen': 'LOCAL_MODE_SEEN',
  'lux_keyboard_hint_shown': 'KEYBOARD_HINT_SHOWN',
  'lux_settings_discovered': 'SETTINGS_DISCOVERED',

  // Player identity (multiple legacy keys map to same new key)
  'lux-player-id': 'PLAYER_ID',
  'playerId': 'PLAYER_ID',
  'gameUserId': 'PLAYER_ID',
  'lux-story-player-personas': 'PLAYER_PERSONAS',

  // Admin
  'admin_view_preference': 'ADMIN_VIEW_MODE',

  // Error recovery
  'currentSceneId': 'CURRENT_SCENE_ID',
  'lastKnownSceneId': 'LAST_KNOWN_SCENE_ID',
}

/**
 * Type helper for storage key names
 */
export type StorageKey = keyof typeof STORAGE_KEYS
