/**
 * Server-Side Supabase Client
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Provides a service-role Supabase client for server-side operations.
 * This client bypasses Row-Level Security (RLS) - use with care.
 *
 * Usage:
 * ```typescript
 * import { getSupabaseServerClient } from '@/lib/supabase-server'
 *
 * const supabase = getSupabaseServerClient()
 * const { data, error } = await supabase.from('table').select('*')
 * ```
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Cache the client to avoid recreating on every request
let cachedClient: SupabaseClient | null = null

/**
 * Get a server-side Supabase client with service role key.
 *
 * IMPORTANT: This client bypasses all RLS policies.
 * Only use in trusted server-side code (API routes).
 *
 * @throws Error if Supabase environment variables are missing
 * @returns Supabase client configured for server-side use
 */
export function getSupabaseServerClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    const missing: string[] = []
    if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL')
    if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    // IMPORTANT: Throw a deterministic error message so API routes can
    // gracefully degrade via lib/api/api-utils.ts handleApiError().
    throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}`)
  }

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return cachedClient
}

/**
 * Check if Supabase is configured (has required env vars).
 * Use this to gracefully handle missing configuration.
 */
export function isSupabaseServerConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return !!(supabaseUrl && serviceRoleKey)
}

/**
 * Get Supabase client or null if not configured.
 * Useful for optional database operations.
 */
export function getSupabaseServerClientOrNull(): SupabaseClient | null {
  try {
    return getSupabaseServerClient()
  } catch {
    return null
  }
}
