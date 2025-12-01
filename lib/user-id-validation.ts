/**
 * User ID Validation Utility
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Validates user IDs to prevent injection attacks and ensure data integrity.
 * User IDs should be UUIDs or follow a specific format.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const PLAYER_ID_REGEX = /^player[-_]\d+[-_][a-z0-9]+$/i  // Matches: player-{timestamp}-{random} or player_{timestamp}_{random}
const PLAYER_ID_LEGACY_REGEX = /^player_\d+$/  // Legacy format: player_1234567890

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate user ID format
 * Accepts UUIDs or player_ prefixed IDs (e.g., player_1234567890)
 */
export function validateUserId(userId: string | null | undefined): ValidationResult {
  if (!userId) {
    return { valid: false, error: 'userId is required' }
  }

  // Trim whitespace
  const trimmed = userId.trim()

  if (trimmed.length === 0) {
    return { valid: false, error: 'userId cannot be empty' }
  }

  // Check for UUID format
  if (UUID_REGEX.test(trimmed)) {
    return { valid: true }
  }

  // Check for player-{timestamp}-{random} format (current format from generateUserId)
  if (PLAYER_ID_REGEX.test(trimmed)) {
    return { valid: true }
  }

  // Check for legacy player_{number} format
  if (PLAYER_ID_LEGACY_REGEX.test(trimmed)) {
    return { valid: true }
  }

  // Reject invalid formats
  return { 
    valid: false, 
    error: 'Invalid userId format. Must be a UUID, player-{timestamp}-{random}, or player_{number} format.' 
  }
}

/**
 * Sanitize user ID by trimming and validating
 * Returns null if invalid
 */
export function sanitizeUserId(userId: string | null | undefined): string | null {
  const validation = validateUserId(userId)
  if (!validation.valid) {
    return null
  }
  return userId?.trim() || null
}

