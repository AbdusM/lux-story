/**
 * Admin Pattern Profile API Endpoint
 *
 * Admin-only access to a student's pattern analytics.
 * Mirrors /api/user/pattern-profile but requires admin auth.
 */

import { NextRequest, NextResponse } from 'next/server'

import { requireAdminAuth } from '@/lib/admin-supabase-client'
import { getPatternProfile, getPatternSummaryQuick } from '@/lib/pattern-profile-adapter'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'admin.pattern-profile.get'
const readLimiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 })

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  const ip = getClientIp(request)
  try {
    await readLimiter.check(ip, 30)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const mode = searchParams.get('mode') || 'full'

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 })
  }

  logger.debug('Pattern profile admin GET request', { operation: OPERATION_GET, userId, mode })

  try {
    if (mode === 'quick') {
      const summary = await getPatternSummaryQuick(userId)
      return NextResponse.json({ success: true, mode: 'quick', summary })
    }

    const profile = await getPatternProfile(userId)
    return NextResponse.json({ success: true, mode: 'full', profile })
  } catch (error) {
    logger.error('Unexpected error in admin pattern profile GET', { operation: OPERATION_GET, userId }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

