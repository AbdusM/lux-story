/**
 * User Profile Service
 * Centralized service for user profile creation and management
 * Consolidates profile logic from ensure-user-profile, comprehensive-user-tracker, and sync-queue
 */

import { supabase } from './supabase'

export interface UserProfileData {
  user_id: string
  current_scene?: string
  total_demonstrations?: number
  last_activity?: string
}

export class UserProfileService {
  private static profileCache = new Map<string, { created: boolean; timestamp: number }>()
  private static CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Ensures a player profile exists for the given user_id.
   * Idempotent: safe to call multiple times for the same user.
   * Uses proper update-if-exists pattern (no ignoreDuplicates hack)
   *
   * @param userId - The user ID to ensure exists in player_profiles table
   * @param initialData - Optional initial data (uses defaults if not provided)
   * @returns true if profile exists/created successfully, false otherwise
   */
  static async ensureProfile(
    userId: string,
    initialData?: Partial<UserProfileData>
  ): Promise<boolean> {
    if (!userId || userId.trim() === '') {
      console.error('[UserProfileService] Invalid userId provided:', userId)
      return false
    }

    // Check cache first
    const cached = this.profileCache.get(userId)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL && cached.created) {
      return true
    }

    try {
      // Use upsert with onConflict to properly handle existing records
      const { data, error } = await supabase
        .from('player_profiles')
        .upsert({
          user_id: userId,
          current_scene: initialData?.current_scene || 'intro',
          total_demonstrations: initialData?.total_demonstrations || 0,
          last_activity: initialData?.last_activity || new Date().toISOString(),
          // updated_at will be set automatically by database trigger
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false // CRITICAL FIX: Update existing records with newer data
        })
        .select()
        .single()

      if (error) {
        console.error(`[UserProfileService] Failed to create profile for ${userId}:`, {
          code: error.code,
          message: error.message,
          details: error.details
        })
        this.profileCache.set(userId, { created: false, timestamp: Date.now() })
        return false
      }

      console.log(`[UserProfileService] ✅ Profile ensured for ${userId}`)
      this.profileCache.set(userId, { created: true, timestamp: Date.now() })
      return true
    } catch (error) {
      console.error(`[UserProfileService] Unexpected error for ${userId}:`, error)
      this.profileCache.set(userId, { created: false, timestamp: Date.now() })
      return false
    }
  }

  /**
   * Batch ensure multiple user profiles exist.
   * Useful for backfilling or bulk operations.
   *
   * @param userIds - Array of user IDs to ensure exist
   * @returns Object with success/failed counts and failed user IDs
   */
  static async ensureProfilesBatch(
    userIds: string[]
  ): Promise<{ success: number; failed: number; failedUserIds: string[] }> {
    const results = {
      success: 0,
      failed: 0,
      failedUserIds: [] as string[]
    }

    console.log(`[UserProfileService] Batch processing ${userIds.length} user profiles...`)

    // Process in parallel with Promise.all for better performance
    const promises = userIds.map(async (userId) => {
      const success = await this.ensureProfile(userId)
      return { userId, success }
    })

    const batchResults = await Promise.all(promises)

    batchResults.forEach(({ userId, success }) => {
      if (success) {
        results.success++
      } else {
        results.failed++
        results.failedUserIds.push(userId)
      }
    })

    console.log(`[UserProfileService] Batch complete:`, {
      total: userIds.length,
      success: results.success,
      failed: results.failed
    })

    return results
  }

  /**
   * Check if a user profile exists without creating it.
   *
   * @param userId - The user ID to check
   * @returns true if profile exists, false otherwise
   */
  static async profileExists(userId: string): Promise<boolean> {
    if (!userId || userId.trim() === '') {
      return false
    }

    // Check cache first
    const cached = this.profileCache.get(userId)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.created
    }

    try {
      const { data, error } = await supabase
        .from('player_profiles')
        .select('user_id')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error(`[UserProfileService] Error checking profile for ${userId}:`, error)
        return false
      }

      const exists = !!data
      this.profileCache.set(userId, { created: exists, timestamp: Date.now() })
      return exists
    } catch (error) {
      console.error(`[UserProfileService] Unexpected error checking ${userId}:`, error)
      return false
    }
  }

  /**
   * Update user profile with new data
   *
   * @param userId - The user ID to update
   * @param updates - Partial profile data to update
   * @returns true if update successful, false otherwise
   */
  static async updateProfile(
    userId: string,
    updates: Partial<Omit<UserProfileData, 'user_id'>>
  ): Promise<boolean> {
    if (!userId || userId.trim() === '') {
      console.error('[UserProfileService] Invalid userId for update:', userId)
      return false
    }

    try {
      const { error } = await supabase
        .from('player_profiles')
        .update({
          ...updates,
          last_activity: new Date().toISOString() // Always update last_activity
        })
        .eq('user_id', userId)

      if (error) {
        console.error(`[UserProfileService] Failed to update profile for ${userId}:`, error)
        return false
      }

      console.log(`[UserProfileService] Profile updated for ${userId}`)
      return true
    } catch (error) {
      console.error(`[UserProfileService] Unexpected update error for ${userId}:`, error)
      return false
    }
  }

  /**
   * Clear the profile cache (useful for testing or manual refresh)
   */
  static clearCache(): void {
    this.profileCache.clear()
    console.log('[UserProfileService] Cache cleared')
  }

  /**
   * Get cache statistics (useful for monitoring)
   */
  static getCacheStats(): { size: number; entries: Array<{ userId: string; created: boolean; age: number }> } {
    const now = Date.now()
    const entries = Array.from(this.profileCache.entries()).map(([userId, data]) => ({
      userId,
      created: data.created,
      age: now - data.timestamp
    }))

    return {
      size: this.profileCache.size,
      entries
    }
  }
}
