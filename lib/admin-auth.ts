import type { SupabaseClient } from '@supabase/supabase-js'

export type AdminRole = 'admin' | 'educator'

export function isE2EAdminBypassEnabled(): boolean {
  // E2E bypass is an explicit opt-in so it can't be enabled accidentally.
  // We allow it in production mode as well because Playwright runs a
  // production build via `next start` for stability.
  return process.env.E2E_ADMIN_BYPASS_ENABLED === 'true'
}

export function isTestAdminBypass(headerValue?: string | null): boolean {
  const token = process.env.E2E_ADMIN_BYPASS_TOKEN
  if (!token) return false
  if (!isE2EAdminBypassEnabled()) return false
  if (!headerValue) return false
  return headerValue === token
}

export interface AdminAuthResult {
  authorized: boolean
  status: 200 | 401 | 403
  role?: string | null
  userId?: string | null
  reason?: 'unauthorized' | 'profile_not_found' | 'forbidden'
}

/**
 * Single source of truth for admin role checks (Supabase-based).
 */
export async function getAdminAuthStatus(
  supabase: SupabaseClient
): Promise<AdminAuthResult> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { authorized: false, status: 401, reason: 'unauthorized' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile) {
    return {
      authorized: false,
      status: 401,
      reason: 'profile_not_found',
      userId: user.id
    }
  }

  const role = profile.role as string | null
  const authorized = role === 'admin' || role === 'educator'

  return {
    authorized,
    status: authorized ? 200 : 403,
    role,
    userId: user.id,
    reason: authorized ? undefined : 'forbidden'
  }
}
