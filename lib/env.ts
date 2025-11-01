/**
 * Environment Configuration
 * Centralized runtime environment variables for client and server
 * 
 * Next.js requires NEXT_PUBLIC_ variables to be referenced directly in code
 * for them to be available in the browser bundle.
 */

import {
  formatPlaceholderMessage,
  isPlaceholderSupabaseAnonKey,
  isPlaceholderSupabaseServiceKey,
  isPlaceholderSupabaseUrl
} from './env-placeholders'

/**
 * Get Supabase configuration for client-side use
 * Prioritizes NEXT_PUBLIC_ variables for browser compatibility
 * 
 * NOTE: This function reads environment variables directly to avoid caching issues.
 * Next.js inlines NEXT_PUBLIC_ variables at build time into the client bundle.
 */
export function getSupabaseConfig() {
  // Read directly from process.env to get the inlined values
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

  if (url && isPlaceholderSupabaseUrl(url)) {
    console.warn('[Supabase] Ignoring placeholder NEXT_PUBLIC_SUPABASE_URL value.')
    console.warn(formatPlaceholderMessage('NEXT_PUBLIC_SUPABASE_URL'))
    url = ''
  }

  if (anonKey && isPlaceholderSupabaseAnonKey(anonKey)) {
    console.warn('[Supabase] Ignoring placeholder NEXT_PUBLIC_SUPABASE_ANON_KEY value.')
    console.warn(formatPlaceholderMessage('NEXT_PUBLIC_SUPABASE_ANON_KEY'))
    anonKey = ''
  }

  return {
    url,
    anonKey,
    isConfigured: !!(url && anonKey),
  }
}

/**
 * Get Supabase admin configuration (server-side only)
 * SECURITY: Only use non-public environment variables for admin operations
 */
export function getSupabaseAdminConfig() {
  // IMPORTANT: Do NOT use NEXT_PUBLIC_ variables for server-side admin operations
  // Service role key should NEVER be exposed to client
  let url = process.env.SUPABASE_URL || ''
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (url && isPlaceholderSupabaseUrl(url)) {
    console.warn('[Security] Ignoring placeholder SUPABASE_URL value for admin configuration.')
    console.warn(formatPlaceholderMessage('SUPABASE_URL'))
    url = ''
  }

  if (serviceRoleKey && isPlaceholderSupabaseServiceKey(serviceRoleKey)) {
    console.warn('[Security] Ignoring placeholder SUPABASE_SERVICE_ROLE_KEY value for admin configuration.')
    console.warn(formatPlaceholderMessage('SUPABASE_SERVICE_ROLE_KEY'))
    serviceRoleKey = ''
  }

  if (!url || !serviceRoleKey) {
    console.warn('[Security] Server-side Supabase config incomplete. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }

  return {
    url,
    serviceRoleKey,
    isConfigured: !!(url && serviceRoleKey),
  }
}

