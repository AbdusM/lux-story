import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

import { isUuidUserId, validateUserId } from '@/lib/user-id-validation'

const TOKEN_VERSION = 1
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export const USER_SESSION_COOKIE_NAME = 'lux_user_session'
export const USER_SESSION_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60 // 30 days

type UserSessionPayload = {
  v: number
  user_id: string
  iat_ms: number
}

export type RequireUserSessionResult =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse }

function base64UrlEncode(data: Buffer): string {
  return data
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function base64UrlDecodeToBuffer(data: string): Buffer {
  const normalized = data.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return Buffer.from(padded, 'base64')
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, Buffer.alloc(bufA.length))
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

function getUserSessionSigningSecret(): string | null {
  const explicit = process.env.USER_API_SESSION_SECRET
  if (explicit) return explicit

  // Local/test fallback: keeps dev flows working when Supabase isn't configured.
  if (process.env.NODE_ENV !== 'production') {
    return 'dev-insecure-user-session-secret'
  }

  return null
}

function signPayload(payloadB64: string, secret: string): string {
  const digest = createHmac('sha256', secret).update(payloadB64).digest()
  return base64UrlEncode(digest)
}

export function createUserSessionToken(userId: string, issuedAtMs: number = Date.now()): string {
  const payload: UserSessionPayload = {
    v: TOKEN_VERSION,
    user_id: userId,
    iat_ms: issuedAtMs,
  }

  const secret = getUserSessionSigningSecret()
  if (!secret) {
    throw new Error('USER_API_SESSION_SECRET not configured')
  }

  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload), 'utf8'))
  const signature = signPayload(payloadB64, secret)
  return `${payloadB64}.${signature}`
}

function parseAndVerifyToken(token: string): UserSessionPayload | null {
  const secret = getUserSessionSigningSecret()
  if (!secret) return null

  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadB64, signature] = parts
  if (!payloadB64 || !signature) return null

  const expected = signPayload(payloadB64, secret)
  if (!safeEqual(signature, expected)) return null

  let payload: UserSessionPayload
  try {
    payload = JSON.parse(base64UrlDecodeToBuffer(payloadB64).toString('utf8')) as UserSessionPayload
  } catch {
    return null
  }

  if (!payload || payload.v !== TOKEN_VERSION) return null
  if (typeof payload.user_id !== 'string' || typeof payload.iat_ms !== 'number') return null

  const idValidation = validateUserId(payload.user_id)
  if (!idValidation.valid) return null

  // Production hardening: only accept UUID-backed sessions.
  // This prevents minting sessions for guessable legacy player IDs.
  if (process.env.NODE_ENV === 'production' && !isUuidUserId(payload.user_id)) return null

  const ageMs = Date.now() - payload.iat_ms
  if (ageMs < 0 || ageMs > SESSION_MAX_AGE_MS) return null

  return payload
}

export function getUserIdFromSessionCookie(request: NextRequest): string | null {
  const token = request.cookies.get(USER_SESSION_COOKIE_NAME)?.value
  if (!token) return null
  const payload = parseAndVerifyToken(token)
  return payload?.user_id ?? null
}

export function requireUserSession(request: NextRequest): RequireUserSessionResult {
  const userId = getUserIdFromSessionCookie(request)
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { ok: true, userId }
}

export function setUserSessionCookie(response: NextResponse, userId: string): void {
  const token = createUserSessionToken(userId)
  response.cookies.set(USER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: USER_SESSION_COOKIE_MAX_AGE_SECONDS,
    path: '/',
  })
}

export function ensureProvidedUserIdMatchesSession(options: {
  provided: unknown
  sessionUserId: string
  fieldName: string
}): NextResponse | null {
  const { provided, sessionUserId, fieldName } = options

  if (provided === undefined || provided === null) return null
  if (typeof provided !== 'string') {
    return NextResponse.json({ error: `Invalid ${fieldName}` }, { status: 400 })
  }
  if (provided !== sessionUserId) {
    return NextResponse.json({ error: `Forbidden (${fieldName} mismatch)` }, { status: 403 })
  }
  return null
}
