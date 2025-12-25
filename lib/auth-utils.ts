/**
 * Authentication Utilities
 * Secure password handling and session management
 *
 * SECURITY FIX (Dec 25, 2025):
 * - Constant-time comparison to prevent timing attacks
 * - Session token generation (don't store password in cookie)
 * - Shorter session lifetime (4 hours instead of 7 days)
 */

import { createHash, randomBytes, timingSafeEqual } from 'crypto'

/**
 * Session duration in seconds (4 hours)
 * Reduced from 7 days for security
 */
export const SESSION_DURATION_SECONDS = 4 * 60 * 60

/**
 * Constant-time string comparison to prevent timing attacks
 * @param a First string to compare
 * @param b Second string to compare
 * @returns true if strings are equal
 */
export function secureCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8')
    const bufB = Buffer.from(b, 'utf8')

    // If lengths differ, still do comparison to maintain constant time
    if (bufA.length !== bufB.length) {
      // Create same-length buffer to compare (prevents length timing leak)
      const dummyBuf = Buffer.alloc(bufA.length)
      timingSafeEqual(bufA, dummyBuf)
      return false
    }

    return timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

/**
 * Generate a secure random session token
 * @returns 32-byte hex-encoded token
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Hash a session token for storage/comparison
 * @param token The session token to hash
 * @returns SHA-256 hash of the token
 */
export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * In-memory session store (for single-instance deployments)
 * For production with multiple instances, use Redis or database
 *
 * Structure: Map<hashedToken, { userId, expiresAt }>
 */
const sessionStore = new Map<string, { userId: string; expiresAt: number }>()

/**
 * Create a new session
 * @param userId The user ID for this session
 * @returns The raw session token (store in cookie)
 */
export function createSession(userId: string): string {
  const token = generateSessionToken()
  const hashedToken = hashSessionToken(token)
  const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000

  // Clean up expired sessions periodically
  cleanExpiredSessions()

  sessionStore.set(hashedToken, { userId, expiresAt })
  return token
}

/**
 * Validate a session token
 * @param token The raw session token from cookie
 * @returns The userId if valid, null otherwise
 */
export function validateSession(token: string): string | null {
  if (!token) return null

  const hashedToken = hashSessionToken(token)
  const session = sessionStore.get(hashedToken)

  if (!session) return null

  // Check expiration
  if (Date.now() > session.expiresAt) {
    sessionStore.delete(hashedToken)
    return null
  }

  return session.userId
}

/**
 * Invalidate a session (logout)
 * @param token The raw session token from cookie
 */
export function invalidateSession(token: string): void {
  if (!token) return
  const hashedToken = hashSessionToken(token)
  sessionStore.delete(hashedToken)
}

/**
 * Clean up expired sessions
 * Called periodically to prevent memory growth
 */
function cleanExpiredSessions(): void {
  const now = Date.now()
  for (const [hash, session] of sessionStore.entries()) {
    if (now > session.expiresAt) {
      sessionStore.delete(hash)
    }
  }
}

/**
 * Verify admin password
 * Uses constant-time comparison to prevent timing attacks
 *
 * @param providedPassword The password to verify
 * @returns true if password matches ADMIN_API_TOKEN
 */
export function verifyAdminPassword(providedPassword: string): boolean {
  const expectedPassword = process.env.ADMIN_API_TOKEN

  if (!expectedPassword) {
    console.error('[Auth] ADMIN_API_TOKEN not configured')
    return false
  }

  return secureCompare(providedPassword, expectedPassword)
}
