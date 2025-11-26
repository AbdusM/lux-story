/**
 * Admin Session Management
 *
 * NOTE: This file is no longer used - keeping for reference only.
 * We simplified back to direct password comparison in admin auth.
 */

// Session duration: 7 days
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

// In-memory session store
// Maps session token to expiration timestamp
const sessionStore = new Map<string, { expires: number }>()

/**
 * Create a new session for the given token
 */
export function createSession(token: string): void {
  const expires = Date.now() + SESSION_DURATION_MS
  sessionStore.set(token, { expires })

  // Clean expired sessions periodically
  cleanExpiredSessions()
}

/**
 * Validate a session token
 * Returns true if token exists and is not expired
 */
export function isValidSession(token: string | undefined): boolean {
  if (!token) return false

  const session = sessionStore.get(token)
  if (!session) return false

  // Check expiration
  if (session.expires < Date.now()) {
    sessionStore.delete(token)
    return false
  }

  return true
}

/**
 * Invalidate/delete a session
 */
export function deleteSession(token: string | undefined): void {
  if (token) {
    sessionStore.delete(token)
  }
}

/**
 * Clean expired sessions from memory
 */
function cleanExpiredSessions(): void {
  const now = Date.now()
  for (const [token, session] of sessionStore.entries()) {
    if (session.expires < now) {
      sessionStore.delete(token)
    }
  }
}

/**
 * Get session count (for debugging/monitoring)
 */
export function getActiveSessionCount(): number {
  cleanExpiredSessions()
  return sessionStore.size
}
