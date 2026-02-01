/**
 * useUserRole Hook
 * Fetches and caches user role from Supabase profiles table
 */

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isTestEnvironment } from '@/lib/test-environment'

export type UserRole = 'student' | 'educator' | 'admin'

interface UserRoleData {
  role: UserRole
  loading: boolean
  isEducator: boolean
  isAdmin: boolean
  user: any | null
}

export function useUserRole(): UserRoleData {
  const [role, setRole] = useState<UserRole>('student')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any | null>(null)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function fetchRole() {
      try {
        if (isTestEnvironment()) {
          if (window.__E2E_ADMIN__ === true || document.cookie.includes('e2e_admin_bypass=')) {
            setRole('admin')
            setUser({ id: 'e2e-admin' })
            setLoading(false)
            return
          }
        }

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
          setRole('student') // Fallback
        } else {
          setRole(profile?.role || 'student')
        }
      } catch (error) {
        setRole('student') // Fallback
      } finally {
        setLoading(false)
      }
    }

    fetchRole()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
