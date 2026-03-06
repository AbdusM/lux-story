/**
 * useUserRole Hook
 * Fetches and caches user role from Supabase profiles table
 */

import { useEffect, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

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
  const [supabase] = useState(() => createClient())

  useEffect(() => {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
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
