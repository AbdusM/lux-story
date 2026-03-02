/**
 * Anonymous player session bootstrap for /api/user/* endpoints.
 *
 * - Binds the browser's local playerId to a signed, HttpOnly cookie.
 * - Prevents unauthenticated public writes to service-role backed endpoints.
 */

import { validateUserId } from '@/lib/user-id-validation'
import { logger } from '@/lib/logger'

let inFlight: Promise<boolean> | null = null
let lastEnsuredUserId: string | null = null

export async function ensureUserApiSession(userId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (lastEnsuredUserId === userId) return true

  const validation = validateUserId(userId)
  if (!validation.valid) {
    logger.warn('Invalid userId provided to ensureUserApiSession', {
      operation: 'user-api-session.ensure.invalid-user-id',
      userId,
      reason: validation.error,
    })
    return false
  }

  if (inFlight) return inFlight

  inFlight = (async () => {
    try {
      const response = await fetch('/api/user/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId }),
      })

      if (!response.ok) {
        logger.warn('Failed to ensure user API session', {
          operation: 'user-api-session.ensure.failed',
          status: response.status,
        })
        return false
      }

      lastEnsuredUserId = userId
      return true
    } catch (error) {
      logger.warn('Failed to ensure user API session (network)', {
        operation: 'user-api-session.ensure.network-error',
        error: error instanceof Error ? error.message : String(error),
      })
      return false
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}
