/**
 * Secure Password Utilities
 *
 * Provides timing-safe password comparison and session token generation
 * to prevent timing attacks and credential exposure.
 */

import { randomBytes, timingSafeEqual, createHash } from 'crypto'

/**
 * Compare two strings in constant time to prevent timing attacks.
 * Returns true if strings match, false otherwise.
 */
export function secureCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false
  }

  // Hash both values to ensure equal length comparison
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()

  try {
    return timingSafeEqual(hashA, hashB)
  } catch {
    // timingSafeEqual throws if lengths differ (shouldn't happen with hashes)
    return false
  }
}

/**
 * Generate a cryptographically secure random session token.
 * This token is stored in cookie instead of the raw password.
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Create a hash of the session token for storage/verification.
 * The raw token goes to the client cookie, the hash is stored server-side.
 */
export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Verify a session token against its stored hash.
 */
export function verifySessionToken(token: string, storedHash: string): boolean {
  const tokenHash = hashSessionToken(token)
  return secureCompare(tokenHash, storedHash)
}
