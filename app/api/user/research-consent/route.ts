import { NextRequest, NextResponse } from 'next/server'

import {
  handleApiError,
  supabaseErrorResponse,
} from '@/lib/api/api-utils'
import { readJsonBody } from '@/lib/api/request-body'
import {
  ensureProvidedUserIdMatchesSession,
  requireUserSession,
} from '@/lib/api/user-session'
import { logger } from '@/lib/logger'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import {
  buildResearchConsentUpsert,
  parseResearchConsentScope,
  serializeResearchConsent,
} from '@/lib/research-consent'
import type { ResearchConsentRow } from '@/lib/research-export'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'research-consent.get'
const OPERATION_PUT = 'research-consent.put'
const MAX_BODY_BYTES = 8_192

const readLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 })
const writeLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 })

function isRelationMissingError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const code = 'code' in error && typeof error.code === 'string' ? error.code : null
  const message =
    'message' in error && typeof error.message === 'string' ? error.message : ''

  return code === '42P01' || message.toLowerCase().includes('does not exist')
}

function consentMigrationRequiredResponse(): NextResponse {
  return NextResponse.json(
    {
      error:
        'Research consent is unavailable until the consent registry migration is applied.',
    },
    { status: 412 }
  )
}

async function fetchResearchConsent(
  userId: string
): Promise<{ row: ResearchConsentRow | null; relationMissing: boolean; error: unknown | null }> {
  const supabase = getSupabaseServerClient()
  const result = await supabase
    .from('research_participant_consents')
    .select(
      'user_id, consent_status, consent_scope, guardian_required, guardian_verified, consented_at, revoked_at'
    )
    .eq('user_id', userId)
    .single()

  if (result.error) {
    if (isRelationMissingError(result.error)) {
      return { row: null, relationMissing: true, error: null }
    }

    if ('code' in result.error && result.error.code === 'PGRST116') {
      return { row: null, relationMissing: false, error: null }
    }

    return { row: null, relationMissing: false, error: result.error }
  }

  return {
    row: (result.data ?? null) as ResearchConsentRow | null,
    relationMissing: false,
    error: null,
  }
}

async function ensurePlayerProfileExists(userId: string): Promise<NextResponse | null> {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from('player_profiles')
    .upsert(
      {
        user_id: userId,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
        ignoreDuplicates: false,
      }
    )
    .select()
    .single()

  if (error) {
    return supabaseErrorResponse(
      OPERATION_PUT,
      'code' in error && typeof error.code === 'string' ? error.code : undefined,
      'Failed to initialize player profile for research consent',
      userId
    )
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const ip = getClientIp(request)
    try {
      await readLimiter.check(ip, 60)
    } catch {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')
    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: requestedUserId,
      sessionUserId: session.userId,
      fieldName: 'userId',
    })
    if (mismatch) return mismatch

    const consentResult = await fetchResearchConsent(session.userId)
    if (consentResult.relationMissing) {
      return consentMigrationRequiredResponse()
    }

    if (consentResult.error) {
      const error = consentResult.error
      return supabaseErrorResponse(
        OPERATION_GET,
        error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
          ? error.code
          : undefined,
        'Failed to fetch research consent',
        session.userId
      )
    }

    logger.debug('Retrieved research consent', {
      operation: OPERATION_GET,
      userId: session.userId,
      hasConsent: Boolean(consentResult.row),
    })

    return NextResponse.json({
      success: true,
      consent: serializeResearchConsent(consentResult.row),
    })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const ip = getClientIp(request)
    try {
      await writeLimiter.check(ip, 30)
    } catch {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const parsed = await readJsonBody(request, { maxBytes: MAX_BODY_BYTES })
    if (!parsed.ok) return parsed.response

    const body = parsed.body as {
      user_id?: unknown
      consent_enabled?: unknown
      consent_scope?: unknown
      guardian_required?: unknown
      guardian_verified?: unknown
    }

    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: body.user_id,
      sessionUserId: session.userId,
      fieldName: 'user_id',
    })
    if (mismatch) return mismatch

    if (typeof body.consent_enabled !== 'boolean') {
      return NextResponse.json({ error: 'Invalid consent_enabled' }, { status: 400 })
    }

    const consentScope = parseResearchConsentScope(body.consent_scope)
    if (!consentScope) {
      return NextResponse.json({ error: 'Invalid consent_scope' }, { status: 400 })
    }

    if (typeof body.guardian_required !== 'boolean') {
      return NextResponse.json({ error: 'Invalid guardian_required' }, { status: 400 })
    }

    if (typeof body.guardian_verified !== 'boolean') {
      return NextResponse.json({ error: 'Invalid guardian_verified' }, { status: 400 })
    }

    const existingConsent = await fetchResearchConsent(session.userId)
    if (existingConsent.relationMissing) {
      return consentMigrationRequiredResponse()
    }
    if (existingConsent.error) {
      const error = existingConsent.error
      return supabaseErrorResponse(
        OPERATION_PUT,
        error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
          ? error.code
          : undefined,
        'Failed to read existing research consent',
        session.userId
      )
    }

    const profileError = await ensurePlayerProfileExists(session.userId)
    if (profileError) return profileError

    const upsertRow = buildResearchConsentUpsert({
      userId: session.userId,
      consentEnabled: body.consent_enabled,
      consentScope,
      guardianRequired: body.guardian_required,
      guardianVerified: body.guardian_verified,
      existing: existingConsent.row,
    })

    const supabase = getSupabaseServerClient()
    const result = await supabase
      .from('research_participant_consents')
      .upsert(upsertRow, {
        onConflict: 'user_id',
        ignoreDuplicates: false,
      })
      .select(
        'user_id, consent_status, consent_scope, guardian_required, guardian_verified, consented_at, revoked_at'
      )
      .single()

    if (result.error) {
      if (isRelationMissingError(result.error)) {
        return consentMigrationRequiredResponse()
      }

      return supabaseErrorResponse(
        OPERATION_PUT,
        'code' in result.error && typeof result.error.code === 'string'
          ? result.error.code
          : undefined,
        'Failed to save research consent',
        session.userId
      )
    }

    const savedConsent = result.data as ResearchConsentRow

    logger.debug('Updated research consent', {
      operation: OPERATION_PUT,
      userId: session.userId,
      status: savedConsent.consent_status,
      scope: savedConsent.consent_scope,
    })

    return NextResponse.json({
      success: true,
      consent: serializeResearchConsent(savedConsent),
    })
  } catch (error) {
    return handleApiError(error, OPERATION_PUT, 'POST')
  }
}
