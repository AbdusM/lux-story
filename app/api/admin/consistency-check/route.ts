/**
 * Admin Data Consistency Check Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Validates relationships between auth.users ↔ profiles ↔ player_profiles
 * Auto-fixes soft links where possible
 * Prevents data drift and enables early problem detection
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'
import { auditLog } from '@/lib/audit-logger'
import { logger } from '@/lib/logger'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Rate limiter: 10 requests per hour (diagnostic operation)
const consistencyCheckLimiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
})

interface ConsistencyIssue {
  type: 'orphaned_profile' | 'orphaned_player_profile' | 'missing_profile' | 'missing_player_profile' | 'text_fk_mismatch'
  userId: string
  details: string
  autoFixable: boolean
  fixed?: boolean
}

interface ConsistencyReport {
  timestamp: string
  totalUsers: number
  totalProfiles: number
  totalPlayerProfiles: number
  issues: ConsistencyIssue[]
  fixesApplied: number
  healthy: boolean
}

/**
 * GET /api/admin/consistency-check
 * Check database consistency and optionally auto-fix issues
 *
 * Query params:
 * - autoFix: boolean (default: false) - Apply automatic fixes
 */
export async function GET(request: NextRequest) {
  // Authentication check - verify user role
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  // Rate limiting: 10 requests per hour
  const ip = getClientIp(request)
  try {
    await consistencyCheckLimiter.check(ip, 10)
  } catch {
    return NextResponse.json(
      { error: 'Too many consistency check requests. Please try again in an hour.' },
      {
        status: 429,
        headers: {
          'Retry-After': '3600'
        }
      }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const autoFix = searchParams.get('autoFix') === 'true'

  try {
    const supabase = getAdminSupabaseClient()
    const issues: ConsistencyIssue[] = []
    let fixesApplied = 0

    logger.debug('Starting consistency check', {
      operation: 'admin.consistency-check.start',
      autoFix
    })

    // Step 1: Get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      logger.error('Failed to fetch auth users', { operation: 'admin.consistency-check.auth-users' }, authError instanceof Error ? authError : undefined)
      return NextResponse.json(
        { error: 'Failed to fetch auth users' },
        { status: 500 }
      )
    }

    // Step 2: Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      // NOTE: profiles PK is user_id (UUID) per supabase/migrations/001_setup.sql
      .select('user_id, email, role, created_at, updated_at')
      .abortSignal(AbortSignal.timeout(15000))

    if (profilesError) {
      logger.error('Failed to fetch profiles', { operation: 'admin.consistency-check.profiles', code: profilesError.code })
      return NextResponse.json(
        { error: 'Failed to fetch profiles' },
        { status: 500 }
      )
    }

    // Step 3: Get all player_profiles
    const { data: playerProfiles, error: playerProfilesError } = await supabase
      .from('player_profiles')
      .select('user_id, created_at, total_demonstrations, last_activity')
      .abortSignal(AbortSignal.timeout(15000))

    if (playerProfilesError) {
      logger.error('Failed to fetch player_profiles', { operation: 'admin.consistency-check.player-profiles', code: playerProfilesError.code })
      return NextResponse.json(
        { error: 'Failed to fetch player_profiles' },
        { status: 500 }
      )
    }

    // Create lookup maps for efficient checking
    const authUserIds = new Set(authUsers.users.map(u => u.id))
    const profileUserIds = new Set(profiles?.map(p => p.user_id) || [])
    const playerProfileIds = new Set(playerProfiles?.map(p => p.user_id) || [])

    // Check 1: Orphaned profiles (profile exists but no auth.user)
    for (const profile of profiles || []) {
      if (!authUserIds.has(profile.user_id)) {
        issues.push({
          type: 'orphaned_profile',
          userId: profile.user_id,
          details: `Profile exists without corresponding auth.user (email: ${profile.email}, created: ${profile.created_at})`,
          autoFixable: false // Manual intervention required - could be intentional
        })
      }
    }

    // Check 2: Orphaned player_profiles (player_profile exists but no auth.user)
    // Note: TEXT FK allows this intentionally for guest/non-auth users
    for (const playerProfile of playerProfiles || []) {
      if (!authUserIds.has(playerProfile.user_id)) {
        issues.push({
          type: 'text_fk_mismatch',
          userId: playerProfile.user_id,
          details: `Player profile exists without auth.user (TEXT FK allows this - may be intentional for guest users). Last activity: ${playerProfile.last_activity}`,
          autoFixable: false // Intentional design for multi-tenant architecture
        })
      }
    }

    // Check 3: Missing profiles (auth.user exists but no profile)
    for (const authUser of authUsers.users) {
      if (!profileUserIds.has(authUser.id)) {
        issues.push({
          type: 'missing_profile',
          userId: authUser.id,
          details: `Auth user exists without profile (email: ${authUser.email}, created: ${authUser.created_at})`,
          autoFixable: true
        })

        // Auto-fix: Create missing profile
        if (autoFix) {
          try {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                user_id: authUser.id,
                email: authUser.email || 'unknown@example.com',
                full_name: authUser.user_metadata?.full_name || authUser.email || null,
                role: 'student', // Default role
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })

            if (!insertError) {
              issues[issues.length - 1].fixed = true
              fixesApplied++
              logger.debug('Auto-fixed missing profile', {
                operation: 'admin.consistency-check.fix',
                userId: authUser.id
              })
            } else {
              logger.error('Failed to auto-fix missing profile', { operation: 'admin.consistency-check.fix', userId: authUser.id, code: insertError.code })
            }
          } catch (error) {
            logger.error('Exception during auto-fix', { operation: 'admin.consistency-check.fix', userId: authUser.id }, error instanceof Error ? error : undefined)
          }
        }
      }
    }

    // Check 4: Missing player_profiles (auth.user + profile exist, but no player_profile)
    // This is normal - only create player_profile when user starts playing
    // We'll report it as informational only
    for (const authUser of authUsers.users) {
      if (profileUserIds.has(authUser.id) && !playerProfileIds.has(authUser.id)) {
        // This is informational - not an error
        // Player profiles are created on first game interaction
        // Don't add to issues unless they have very old accounts with no progress
        const profile = profiles?.find(p => p.user_id === authUser.id)
        if (profile) {
          const accountAge = Date.now() - new Date(profile.created_at).getTime()
          const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24)

          // Only flag if account is older than 7 days with no game progress
          if (daysSinceCreation > 7) {
            issues.push({
              type: 'missing_player_profile',
              userId: authUser.id,
              details: `Account created ${Math.floor(daysSinceCreation)} days ago but no game progress. User may not have started playing yet.`,
              autoFixable: false // Don't auto-create - wait for user to start game
            })
          }
        }
      }
    }

    // Generate report
    const report: ConsistencyReport = {
      timestamp: new Date().toISOString(),
      totalUsers: authUsers.users.length,
      totalProfiles: profiles?.length || 0,
      totalPlayerProfiles: playerProfiles?.length || 0,
      issues,
      fixesApplied,
      healthy: issues.filter(i => i.type !== 'text_fk_mismatch' && i.type !== 'missing_player_profile').length === 0
    }

    logger.debug('Consistency check complete', {
      operation: 'admin.consistency-check.complete',
      issuesFound: issues.length,
      fixesApplied,
      healthy: report.healthy
    })

    // Audit log
    auditLog('consistency_check', 'admin', undefined, {
      issuesFound: issues.length,
      fixesApplied,
      autoFix
    })

    return NextResponse.json(report)

  } catch (error) {
    logger.error('Unexpected error during consistency check', { operation: 'admin.consistency-check' }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: 'An error occurred during consistency check' },
      { status: 500 }
    )
  }
}
