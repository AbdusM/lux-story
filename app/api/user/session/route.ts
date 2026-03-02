/**
 * User Session API
 *
 * Server-issued, signed session cookie for anonymous players.
 * Required for all /api/user/* endpoints to prevent open service-role ingestion.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { isUuidUserId, validateUserId } from '@/lib/user-id-validation'
import { readJsonBody } from '@/lib/api/request-body'
import {
  getUserIdFromSessionCookie,
  setUserSessionCookie,
  USER_SESSION_COOKIE_MAX_AGE_SECONDS,
} from '@/lib/api/user-session'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_BODY_BYTES = 1_024 // only { user_id }
const sessionLimiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 })

const SessionInitSchema = z.object({
  user_id: z.string().optional(),
  userId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const userId = getUserIdFromSessionCookie(request)
  if (!userId) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, user_id: userId })
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  try {
    await sessionLimiter.check(ip, 60)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  // If a valid session already exists, keep it (idempotent).
  const existingUserId = getUserIdFromSessionCookie(request)
  if (existingUserId) {
    return NextResponse.json({ success: true, user_id: existingUserId })
  }

  const parsed = await readJsonBody(request, { maxBytes: MAX_BODY_BYTES })
  if (!parsed.ok) return parsed.response

  const bodyResult = SessionInitSchema.safeParse(parsed.body)
  if (!bodyResult.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const requestedUserId = bodyResult.data.user_id ?? bodyResult.data.userId
  if (requestedUserId && process.env.NODE_ENV === 'production' && !isUuidUserId(requestedUserId)) {
    return NextResponse.json(
      { error: 'Invalid user_id (production requires UUID)' },
      { status: 400 }
    )
  }

  const userId = requestedUserId || crypto.randomUUID()

  const validation = validateUserId(userId)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const response = NextResponse.json({ success: true, user_id: userId })
  try {
    setUserSessionCookie(response, userId)
  } catch {
    return NextResponse.json({ error: 'Session signing secret not configured' }, { status: 500 })
  }

  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('X-Session-Max-Age', String(USER_SESSION_COOKIE_MAX_AGE_SECONDS))

  return response
}
