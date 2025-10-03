/**
 * Environment Configuration
 * Centralized runtime environment variables for client and server
 * 
 * Next.js requires NEXT_PUBLIC_ variables to be referenced directly in code
 * for them to be available in the browser bundle.
 */

/**
 * Get Supabase configuration for client-side use
 * Prioritizes NEXT_PUBLIC_ variables for browser compatibility
 * 
 * NOTE: This function reads environment variables directly to avoid caching issues.
 * Next.js inlines NEXT_PUBLIC_ variables at build time into the client bundle.
 */
export function getSupabaseConfig() {
  // Read directly from process.env to get the inlined values
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

  return {
    url,
    anonKey,
    isConfigured: !!(url && anonKey),
  }
}

/**
 * Get Supabase admin configuration (server-side only)
 */
export function getSupabaseAdminConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  return {
    url,
    serviceRoleKey,
    isConfigured: !!(url && serviceRoleKey),
  }
}

