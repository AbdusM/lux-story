/**
 * useUserRole Hook
 * Fetches and caches user role from Supabase profiles table
 */

import { useEffect, useState } from 'react'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export type UserRole = 'student' | 'educator' | 'admin'
const PLAYWRIGHT_ADMIN_BYPASS_COOKIE = 'lux-playwright-admin-bypass'

interface UserRoleData {
  role: UserRole
  loading: boolean
  isEducator: boolean
  isAdmin: boolean
  user: User | null
}

function hasPlaywrightAdminBypass(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  if (process.env.NODE_ENV === 'production') return false

  const isPlaywrightRuntime = (window as Window & { __PLAYWRIGHT__?: boolean }).__PLAYWRIGHT__ === true
  if (!isPlaywrightRuntime) return false

  return document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .some(cookie => cookie === `${PLAYWRIGHT_ADMIN_BYPASS_COOKIE}=1`)
}

export function useUserRole(): UserRoleData {
  const [role, setRole] = useState<UserRole>('student')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    if (hasPlaywrightAdminBypass()) {
      setRole('admin')
      setUser({
        id: 'playwright-admin-bypass',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date(0).toISOString(),
      } as User)
      setLoading(false)
      return
    }

    async function fetchRole() {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()

        if (!currentUser) {
          setRole('student')
          setUser(null)
          setLoading(false)
          return
        }

        setUser(currentUser)

        // Fetch profile with role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', currentUser.id)
          .single()

        if (error) {
          console.error('[useUserRole] Error fetching profile:', error)
          setRole('student') // Fallback
        } else {
          setRole(profile?.role || 'student')
        }
      } catch (error) {
        console.error('[useUserRole] Unexpected error:', error)
        setRole('student') // Fallback
      } finally {
        setLoading(false)
      }
    }

    fetchRole()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (!session?.user) {
        setRole('student')
        setUser(null)
        setLoading(false)
      } else {
        // Re-fetch role when auth state changes
        setLoading(true)
        fetchRole()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return {
    role,
    loading,
    isEducator: role === 'educator' || role === 'admin',
    isAdmin: role === 'admin',
    user,
  }
}
