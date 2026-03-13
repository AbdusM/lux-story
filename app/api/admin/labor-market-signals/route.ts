import { NextRequest, NextResponse } from 'next/server'

import { getAdminSupabaseClient, requireAdminAuth } from '@/lib/admin-supabase-client'
import { auditLog } from '@/lib/audit-logger'
import { buildAdminLaborMarketSignalReport } from '@/lib/labor-market/admin-diagnostics'
import { logger } from '@/lib/logger'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import type { AdminLaborMarketSignalsResponse } from '@/lib/types/admin-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const laborSignalLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

function clampInteger(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(Math.max(parsed, min), max)
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<AdminLaborMarketSignalsResponse | { error: string }>> {
  const authError = await requireAdminAuth(request)
  if (authError) {
    return authError as NextResponse<AdminLaborMarketSignalsResponse | { error: string }>
  }

  const ip = getClientIp(request)
  try {
    await laborSignalLimiter.check(ip, 20)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': '60' },
      },
    )
  }

  const warningThresholdDays = clampInteger(
    request.nextUrl.searchParams.get('warningThresholdDays'),
    14,
    0,
    45,
  )

  try {
    // Keep the admin route aligned with the rest of the admin surface.
    getAdminSupabaseClient()

    const report = buildAdminLaborMarketSignalReport({
      nowIso: new Date().toISOString(),
      warningThresholdDays,
    })

    const responseData: AdminLaborMarketSignalsResponse = {
      success: true,
      report,
      fetchedAt: new Date().toISOString(),
    }

    auditLog('view_action_data', 'admin', undefined, {
      laborMarketSignals: true,
      warningThresholdDays,
      staleRows: report.totals.staleRows,
      invalidTimestampRows: report.totals.invalidTimestampRows,
      missingCanonicalMatches: report.fallbackRisk.totalMissingCanonicalMatches,
    })

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'private, max-age=30',
      },
    })
  } catch (error) {
    logger.error(
      'Failed to build labor market diagnostics',
      { operation: 'admin.labor-market-signals', warningThresholdDays },
      error instanceof Error ? error : undefined,
    )
    return NextResponse.json(
      { error: 'Unable to load labor market diagnostics' },
      { status: 500 },
    )
  }
}
