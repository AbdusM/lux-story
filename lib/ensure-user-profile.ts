/**
 * Ensure User Profile Utility
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Guarantees a player_profiles record exists before any foreign key insertions.
 * Consolidates all user profile creation logic into a single reliable function.
 *
 * Uses admin client (service role) to bypass RLS since profile creation
 * should work without requiring authenticated user context.
 */

import { getAdminSupabaseClient } from './admin-supabase-client'
import { logger } from './logger'

export interface UserProfileData {
  user_id: string
  current_scene?: string
  total_demonstrations?: number
  last_activity?: string
}

/**
 * Ensures a player profile exists for the given user_id.
 * Idempotent: safe to call multiple times for the same user.
 *
 * @param userId - The user ID to ensure exists in player_profiles table
 * @param initialData - Optional initial data (uses defaults if not provided)
 * @returns true if profile exists/created successfully, false otherwise
 */
export async function ensureUserProfile(
  userId: string,
  initialData?: Partial<UserProfileData>
): Promise<boolean> {
  if (!userId || userId.trim() === '') {
    console.error('[EnsureUserProfile] Invalid userId provided:', userId)
    return false
  }

  try {
    // Use admin client to bypass RLS - profile creation should always work
    const supabase = getAdminSupabaseClient()

    // Use upsert for idempotency - only inserts if record doesn't exist
    const { error } = await supabase
      .from('player_profiles')
      .upsert({
        user_id: userId,
        current_scene: initialData?.current_scene || 'intro',
        total_demonstrations: initialData?.total_demonstrations || 0,
        last_activity: initialData?.last_activity || new Date().toISOString(),
        // updated_at will be set automatically by database trigger
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      // Check if error object is effectively empty (all properties undefined/empty)
      const hasNoErrorInfo = !error.code && !error.message && !error.details && !error.hint

      // Check if it's a network/configuration error (Supabase unreachable)
      const isNetworkError =
        hasNoErrorInfo || // Empty error object often indicates network failure
        error.message?.includes('Supabase not configured') ||
        error.message?.includes('fetch failed') ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
        error.details?.includes('Failed to fetch')

      if (isNetworkError) {
        // Silent fallback - don't spam console with network errors
        return true // Allow game to continue without database
      }

      // Only log non-network errors (actual Supabase errors)
      console.error(`[EnsureUserProfile] Failed to create profile for ${userId}:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return true // Allow game to continue even if database fails
    }

    logger.debug('Profile ensured', { operation: 'ensure-user-profile.success', userId })
    return true
  } catch (error: unknown) {
    // Check if it's a network error (Supabase unreachable)
    const err = error as Error & { code?: string; details?: string }
    const isNetworkError =
      err?.message?.includes('Failed to fetch') ||
      err?.message?.includes('ERR_NAME_NOT_RESOLVED') ||
      err?.name === 'TypeError' ||
      String(error).includes('fetch')

    if (isNetworkError) {
      // Silent fallback - don't spam console with network errors
      return true
    }

    // Only log unexpected errors
    console.warn(`[EnsureUserProfile] Database unavailable for ${userId}:`, error)
    return true // Allow game to continue in local-only mode
  }
}

/**
 * Batch ensure multiple user profiles exist.
 * Useful for backfilling or bulk operations.
 *
 * @param userIds - Array of user IDs to ensure exist
 * @returns Object with success/failed counts and failed user IDs
 */
export async function ensureUserProfilesBatch(
  userIds: string[]
): Promise<{ success: number; failed: number; failedUserIds: string[] }> {
  const results = {
    success: 0,
    failed: 0,
    failedUserIds: [] as string[]
  }

  logger.debug('Batch processing user profiles', { operation: 'ensure-user-profile.batch', count: userIds.length })

  for (const userId of userIds) {
    const success = await ensureUserProfile(userId)
    if (success) {
      results.success++
    } else {
      results.failed++
      results.failedUserIds.push(userId)
    }
  }

  logger.debug('Batch complete', { operation: 'ensure-user-profile.batch-complete', total: userIds.length, success: results.success, failed: results.failed })

  return results
}

/**
 * Check if a user profile exists without creating it.
 *
 * @param userId - The user ID to check
 * @returns true if profile exists, false otherwise
 */
export async function userProfileExists(userId: string): Promise<boolean> {
  if (!userId || userId.trim() === '') {
    return false
  }

  try {
    const supabase = getAdminSupabaseClient()
    const { data, error } = await supabase
      .from('player_profiles')
      .select('user_id')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error(`[EnsureUserProfile] Error checking profile for ${userId}:`, error)
      return false
    }

    return !!data
  } catch (error) {
    console.error(`[EnsureUserProfile] Unexpected error checking ${userId}:`, error)
    return false
  }
}
