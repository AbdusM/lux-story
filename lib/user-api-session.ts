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
const FAILURE_COOLDOWN_MS = 60_000

let lastFailure:
  | {
      userId: string
      status: number | 'network'
      until: number
    }
  | null = null

export async function ensureUserApiSession(userId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (lastEnsuredUserId === userId) return true
  if (lastFailure && lastFailure.userId === userId && lastFailure.until > Date.now()) {
    return false
  }

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
        lastFailure = {
          userId,
          status: response.status,
          until: Date.now() + FAILURE_COOLDOWN_MS,
        }

        logger.warn('Failed to ensure user API session', {
          operation: 'user-api-session.ensure.failed',
          status: response.status,
          cooldownMs: FAILURE_COOLDOWN_MS,
        })
        return false
      }

      lastEnsuredUserId = userId
      lastFailure = null
      return true
    } catch (error) {
      lastFailure = {
        userId,
        status: 'network',
        until: Date.now() + FAILURE_COOLDOWN_MS,
      }
      logger.warn('Failed to ensure user API session (network)', {
        operation: 'user-api-session.ensure.network-error',
        error: error instanceof Error ? error.message : String(error),
        cooldownMs: FAILURE_COOLDOWN_MS,
      })
      return false
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}
