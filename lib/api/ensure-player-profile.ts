/**
 * Shared Player Profile Utility
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Ensures player profile exists before inserting related records.
 * Prevents foreign key violations (error 23503).
 *
 * Used by:
 * - /api/user/skill-summaries
 * - /api/user/career-explorations
 * - /api/user/pattern-demonstrations
 */

import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'

/**
 * Ensure player profile exists before inserting related records
 * Prevents foreign key violations (error 23503)
 *
 * @param userId - The user ID to ensure profile for
 * @param operation - Operation name for logging (e.g., 'skill-summaries.post')
 */
export async function ensurePlayerProfile(userId: string, operation: string): Promise<void> {
  try {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('player_profiles')
      .upsert({
        user_id: userId,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: true
      })

    if (error) {
      logger.warn('Failed to ensure player profile', {
        operation: `${operation}.ensure-profile`,
        userId,
        error: error instanceof Error ? error.message : String(error)
      })
    } else {
      logger.debug('Player profile ensured', {
        operation: `${operation}.ensure-profile`,
        userId
      })
    }
  } catch (error) {
    logger.error('ensurePlayerProfile error', {
      operation: `${operation}.ensure-profile`
    }, error instanceof Error ? error : undefined)
  }
}
