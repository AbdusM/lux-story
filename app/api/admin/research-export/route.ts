/**
 * Admin Research Export API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Exports research data in three explicit modes:
 * - cohort: pseudonymized participant snapshots
 * - individual: identified single-user export (requires stored consent)
 * - longitudinal: participant snapshots plus activity timelines
 *
 * Claim 18: Admin > Research Export
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'
import { auditLog } from '@/lib/audit-logger'
import { logger } from '@/lib/logger'
import {
  buildCohortLongitudinalSummary,
  buildResearchParticipantExport,
  getResearchExportScope,
  hasIndividualResearchConsent,
  hasLongitudinalResearchConsent,
  parseResearchExportMode,
  type ResearchBehavioralProfileRow,
  type ResearchCareerExplorationRow,
  type ResearchConsentRow,
  type ResearchExportMode,
  type ResearchPatternDemonstrationRow,
  type ResearchProfileRow,
  type ResearchSkillDemonstrationRow,
} from '@/lib/research-export'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface QueryResult<T> {
  rows: T[]
  relationMissing: boolean
}

function isRelationMissingError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const code = 'code' in error && typeof error.code === 'string' ? error.code : null
  const message =
    'message' in error && typeof error.message === 'string' ? error.message : ''

  return code === '42P01' || message.toLowerCase().includes('does not exist')
}

async function queryRows<T>(
  supabase: ReturnType<typeof getAdminSupabaseClient>,
  tableName: string,
  selectClause: string,
  filterColumn: string,
  filterValue: string | null,
  options: { optional?: boolean } = {}
): Promise<QueryResult<T>> {
  const query = supabase.from(tableName).select(selectClause)
  const result = filterValue ? await query.eq(filterColumn, filterValue) : await query

  if (result.error) {
    if (options.optional && isRelationMissingError(result.error)) {
      return { rows: [], relationMissing: true }
    }
    throw result.error
  }

  return {
    rows: (result.data ?? []) as T[],
    relationMissing: false,
  }
}

/**
 * GET /api/admin/research-export
 *
 * Query params:
 * - mode=cohort|individual|longitudinal
 * - userId=<uuid> for individual or identified longitudinal export
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const mode = parseResearchExportMode(searchParams.get('mode'), Boolean(userId))
    const scope = getResearchExportScope(mode, userId)
    const includeLongitudinal = mode === 'longitudinal'
    const requiresIdentifiedConsent = scope === 'individual_identified'
    const requiresFullResearchConsent = mode === 'longitudinal' && Boolean(userId)

    if (mode === 'individual' && !userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter for individual research export' },
        { status: 400 }
      )
    }

    logger.debug('GET request', {
      operation: 'admin.research-export',
      mode,
      scope,
      userId: userId ?? 'all',
    })

    const supabase = getAdminSupabaseClient()

    const [
      profilesResult,
      behavioralProfilesResult,
      patternDemonstrationsResult,
      skillDemonstrationsResult,
      careerExplorationsResult,
    ] = await Promise.all([
      queryRows<ResearchProfileRow>(
        supabase,
        'player_profiles',
        'user_id, created_at, updated_at, last_activity, total_demonstrations',
        'user_id',
        userId
      ),
      queryRows<ResearchBehavioralProfileRow>(
        supabase,
        'player_behavioral_profiles',
        'player_id, response_speed, stress_response, social_orientation, problem_approach, communication_style, cultural_alignment, total_choices, avg_response_time_ms, updated_at',
        'player_id',
        userId,
        { optional: true }
      ),
      queryRows<ResearchPatternDemonstrationRow>(
        supabase,
        'pattern_demonstrations',
        'user_id, pattern_name, demonstrated_at, scene_id, character_id, context',
        'user_id',
        userId,
        { optional: true }
      ),
      queryRows<ResearchSkillDemonstrationRow>(
        supabase,
        'skill_demonstrations',
        'user_id, skill_name, scene_id, scene_description, choice_text, context, demonstrated_at',
        'user_id',
        userId
      ),
      queryRows<ResearchCareerExplorationRow>(
        supabase,
        'career_explorations',
        'user_id, career_name, match_score, readiness_level, local_opportunities, education_paths, explored_at',
        'user_id',
        userId
      ),
    ])

    const consentResult = requiresIdentifiedConsent && userId
      ? await queryRows<ResearchConsentRow>(
          supabase,
          'research_participant_consents',
          'user_id, consent_status, consent_scope, guardian_required, guardian_verified, consented_at, revoked_at',
          'user_id',
          userId,
          { optional: true }
        )
      : { rows: [], relationMissing: false }

    if (profilesResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No research participants found for the requested export' },
        { status: 404 }
      )
    }

    const consentRow = consentResult.rows[0] ?? null
    if (requiresIdentifiedConsent && userId) {
      if (consentResult.relationMissing) {
        return NextResponse.json(
          {
            error:
              'Identified research export is disabled until the consent registry migration is applied.',
          },
          { status: 412 }
        )
      }

      const hasRequiredConsent = requiresFullResearchConsent
        ? hasLongitudinalResearchConsent(consentRow)
        : hasIndividualResearchConsent(consentRow)

      if (!hasRequiredConsent) {
        return NextResponse.json(
          {
            error: requiresFullResearchConsent
              ? 'Identified longitudinal export requires granted full research consent and guardian verification when applicable.'
              : 'Identified research export requires granted individual research consent and guardian verification when applicable.',
          },
          { status: 412 }
        )
      }
    }

    const behavioralByUser = new Map(
      behavioralProfilesResult.rows.map((row) => [row.player_id, row] as const)
    )
    const patternsByUser = new Map<string, ResearchPatternDemonstrationRow[]>()
    const skillsByUser = new Map<string, ResearchSkillDemonstrationRow[]>()
    const careersByUser = new Map<string, ResearchCareerExplorationRow[]>()

    for (const row of patternDemonstrationsResult.rows) {
      const current = patternsByUser.get(row.user_id) ?? []
      current.push(row)
      patternsByUser.set(row.user_id, current)
    }

    for (const row of skillDemonstrationsResult.rows) {
      const current = skillsByUser.get(row.user_id) ?? []
      current.push(row)
      skillsByUser.set(row.user_id, current)
    }

    for (const row of careerExplorationsResult.rows) {
      const current = careersByUser.get(row.user_id) ?? []
      current.push(row)
      careersByUser.set(row.user_id, current)
    }

    const data = profilesResult.rows.map((profile) =>
      buildResearchParticipantExport({
        profile,
        behavioralProfile: behavioralByUser.get(profile.user_id),
        patternRows: patternsByUser.get(profile.user_id) ?? [],
        skillRows: skillsByUser.get(profile.user_id) ?? [],
        careerRows: careersByUser.get(profile.user_id) ?? [],
        consent: scope === 'individual_identified' ? consentRow : null,
        scope,
        includeLongitudinal,
      })
    )

    const responseBody = {
      success: true,
      mode,
      scope,
      count: data.length,
      summary: {
        participantCount: data.length,
        exportedAt: new Date().toISOString(),
        totalSkillDemonstrations: skillDemonstrationsResult.rows.length,
        totalCareerExplorations: careerExplorationsResult.rows.length,
        identifiedExportRequiresConsent: true,
      },
      ...(mode === 'longitudinal' && !userId
        ? {
            cohortLongitudinal: buildCohortLongitudinalSummary(
              skillDemonstrationsResult.rows,
              patternDemonstrationsResult.rows,
              careerExplorationsResult.rows
            ),
          }
        : {}),
      data,
    }

    auditLog('export_research_data', 'admin', userId || 'all_students', {
      mode,
      scope,
      exportedRecords: data.length,
    })

    return NextResponse.json(responseBody)
  } catch (error) {
    logger.error('Unexpected error in research export', { error })

    return NextResponse.json(
      { error: 'An error occurred exporting research data' },
      { status: 500 }
    )
  }
}
