/**
 * Admin User Management Page
 * Allows admins to view all users and assign educator/admin roles
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users as UsersIcon, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/hooks/useUserRole'
import { useRouter } from 'next/navigation'
import { AdminUtilityNav } from '@/components/admin/AdminUtilityNav'

interface UserProfile {
  user_id: string
  email: string
  full_name: string | null
  role: 'student' | 'educator' | 'admin'
  created_at: string
}

interface ProfileCheckState {
  loading: boolean
  exists?: boolean
  currentScene?: string | null
  totalDemonstrations?: number
  error?: string
}

export default function AdminUsersPage() {
  const { isAdmin, loading: roleLoading } = useUserRole()
  const router = useRouter()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [profileChecks, setProfileChecks] = useState<Record<string, ProfileCheckState>>({})

  const supabase = createClient()

  // Redirect non-admins
  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, roleLoading, router])

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      if (!isAdmin) return

      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('user_id, email, full_name, role, created_at')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setUsers(data || [])
      } catch (err) {
        console.error('[Admin] Error fetching users:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    if (!roleLoading) {
      fetchUsers()
    }
  }, [isAdmin, roleLoading, supabase])

  const handleRoleUpdate = async (userId: string, newRole: 'student' | 'educator' | 'admin') => {
    setUpdatingUserId(userId)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId)

      if (updateError) throw updateError

      // Update local state
      setUsers(prev =>
        prev.map(user =>
          user.user_id === userId ? { ...user, role: newRole } : user
        )
      )
    } catch (err) {
      console.error('[Admin] Error updating role:', err)
      setError(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleCheckProfile = async (userId: string) => {
    setProfileChecks(prev => ({
      ...prev,
      [userId]: { loading: true }
    }))

    try {
      const response = await fetch(`/api/admin/check-profile?userId=${encodeURIComponent(userId)}`, {
        credentials: 'include'
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(typeof body?.error === 'string' ? body.error : 'Failed to check profile')
      }

      setProfileChecks(prev => ({
        ...prev,
        [userId]: {
          loading: false,
          exists: Boolean(body?.exists),
          currentScene: typeof body?.profile?.current_scene === 'string' ? body.profile.current_scene : null,
          totalDemonstrations:
            typeof body?.profile?.total_demonstrations === 'number' ? body.profile.total_demonstrations : 0,
        }
      }))
    } catch (checkError) {
      setProfileChecks(prev => ({
        ...prev,
        [userId]: {
          loading: false,
          error: checkError instanceof Error ? checkError.message : 'Failed to check profile'
        }
      }))
    }
  }

  if (roleLoading || (loading && isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-purple-600 font-serif">
              User Management
            </h1>
          </div>
          <p className="text-slate-400">Manage user roles and permissions</p>
        </motion.div>

        <AdminUtilityNav tone="dark" className="mb-6" />

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-400">{error}</span>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <UsersIcon className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-2xl font-bold text-white">{users.length}</div>
                <div className="text-xs text-slate-400">Total Users</div>
              </div>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'educator').length}
                </div>
                <div className="text-xs text-slate-400">Educators</div>
              </div>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-xs text-slate-400">Admins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Current Role</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Journey Profile</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const profileCheck = profileChecks[user.user_id]

                  return (
                  <tr key={user.user_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-white">{user.email}</td>
                    <td className="p-4 text-sm text-slate-300">{user.full_name || '—'}</td>
                    <td className="p-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-400'
                            : user.role === 'educator'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {(user.role === 'educator' || user.role === 'admin') && (
                          <Shield className="w-3 h-3" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex min-w-[220px] flex-col gap-2">
                        {profileCheck?.loading ? (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Checking profile…</span>
                          </div>
                        ) : profileCheck?.error ? (
                          <div className="rounded border border-red-500/20 bg-red-500/10 px-2.5 py-2 text-xs text-red-300">
                            {profileCheck.error}
                          </div>
                        ) : profileCheck ? (
                          <div className="rounded border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-slate-300">
                            <div className="mb-1">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 font-medium ${
                                  profileCheck.exists
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {profileCheck.exists ? 'Profile exists' : 'No profile yet'}
                              </span>
                            </div>
                            {profileCheck.exists && (
                              <div className="space-y-1">
                                <div>Scene: {profileCheck.currentScene || 'Unknown'}</div>
                                <div>Demonstrations: {profileCheck.totalDemonstrations || 0}</div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500">
                            Run a diagnostic check for this user&apos;s gameplay profile.
                          </div>
                        )}

                        <button
                          onClick={() => handleCheckProfile(user.user_id)}
                          className="w-fit rounded border border-slate-600 px-3 py-1 text-xs text-slate-200 transition-colors hover:border-amber-400 hover:text-white"
                        >
                          {profileCheck ? 'Refresh Profile Check' : 'Check Profile'}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      {updatingUserId === user.user_id ? (
                        <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                      ) : (
                        <div className="flex gap-2">
                          {user.role !== 'educator' && (
                            <button
                              onClick={() => handleRoleUpdate(user.user_id, 'educator')}
                              className="px-3 py-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded transition-colors"
                            >
                              Make Educator
                            </button>
                          )}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleRoleUpdate(user.user_id, 'admin')}
                              className="px-3 py-1 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded transition-colors"
                            >
                              Make Admin
                            </button>
                          )}
                          {user.role !== 'student' && (
                            <button
                              onClick={() => handleRoleUpdate(user.user_id, 'student')}
                              className="px-3 py-1 text-xs bg-slate-500/20 hover:bg-slate-500/30 text-slate-400 rounded transition-colors"
                            >
                              Make Student
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loading && (
            <div className="p-12 text-center text-slate-500">
              No users found
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
