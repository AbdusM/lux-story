/**
 * Admin Research Export API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Exports comprehensive engagement and career analytics for research analysis.
 * Claim 18: Admin > Research Export
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'
import { auditLog } from '@/lib/audit-logger'
import { logger } from '@/lib/logger'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/research-export
 * Export full dataset for research analysis
 * Optional: ?userId=X for single student
 */
export async function GET(request: NextRequest) {
    // Authentication check - verify admin cookie
    const authError = await requireAdminAuth(request)
    if (authError) return authError

    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        logger.debug('GET request', { operation: 'admin.research-export', userId: userId || 'all' })

        const supabase = getAdminSupabaseClient()

        // Query 1: Fetch Profiles (Base Persona Data)
        let query = supabase
            .from('player_profiles')
            .select(`
        user_id,
        dominant_patterns,
        pattern_data,
        response_speed,
        stress_response,
        social_orientation,
        problem_approach,
        cultural_alignment,
        total_choices,
        last_updated
      `)

        if (userId) query = query.eq('user_id', userId)

        const { data: profiles, error: profileError } = await query

        if (profileError) throw profileError

        // Query 2: Fetch Career Explorations
        let careerQuery = supabase.from('career_explorations').select('*')
        if (userId) careerQuery = careerQuery.eq('user_id', userId)
        const { data: careers, error: careerError } = await careerQuery

        if (careerError) throw careerError

        // Transform Data for Export
        // We reconstruct the Engagement Metrics structure using DB data
        const exportData = profiles?.map(profile => {
            const playerCareers = careers?.filter(c => c.user_id === profile.user_id) || []

            return {
                playerId: profile.user_id,
                metrics: {
                    totalChoices: profile.total_choices,
                    // Reconstruct metrics from DB columns
                    strongAffinities: playerCareers.filter((c: { match_score: number }) => c.match_score > 50).length,
                    dominantPattern: profile.dominant_patterns?.[0] || 'emerging',
                    engagementLevel: calculateLevelFromDb(profile), // Helper
                    lastSession: profile.last_updated
                },
                // Raw data for researchers
                raw: {
                    patterns: profile.pattern_data,
                    psychometrics: {
                        speed: profile.response_speed,
                        stress: profile.stress_response,
                        social: profile.social_orientation,
                        approach: profile.problem_approach
                    },
                    career_matches: playerCareers.map((c: { career_field: string; match_score: number }) => ({
                        field: c.career_field,
                        score: c.match_score
                    }))
                }
            }
        })

        // Audit log: Admin exported research data
        auditLog('export_research_data', 'admin', userId || 'all_students')

        return NextResponse.json({
            success: true,
            count: exportData?.length || 0,
            data: exportData
        })
    } catch (error) {
        logger.error('Unexpected error in research export', { error })

        return NextResponse.json(
            { error: 'An error occurred exporting research data' },
            { status: 500 }
        )
    }
}

// Helper to replicate the logic from engagement-metrics.ts but using DB fields
function calculateLevelFromDb(profile: { total_choices?: number }): 'low' | 'moderate' | 'high' {
    const choices = profile.total_choices || 0
    if (choices > 40) return 'high'
    if (choices > 15) return 'moderate'
    return 'low'
}
