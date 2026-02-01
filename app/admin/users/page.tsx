/**
 * Admin Users Page
 * Read-only user list with links to per-user urgency view.
 */

'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/hooks/useUserRole'
import { useRouter } from 'next/navigation'
import { isTestEnvironment } from '@/lib/test-environment'

interface UserProfile {
  user_id: string
  email: string
  full_name: string | null
  role: 'student' | 'educator' | 'admin'
  created_at: string
}

export default function AdminUsersPage() {
  const PAGE_SIZE = 100
  const PERF_WARN_MS = 400
  const { isAdmin, loading: roleLoading } = useUserRole()
  const router = useRouter()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadedIdsRef = useRef<Set<string>>(new Set())
  const activeRequestRef = useRef<AbortController | null>(null)
  const requestSeqRef = useRef(0)

  const supabase = useMemo(() => createClient(), [])
  const testAdminBypass = isTestEnvironment() && typeof document !== 'undefined' && document.cookie.includes('e2e_admin_bypass=')
  const effectiveIsAdmin = isAdmin || testAdminBypass

  const logPerf = (label: string, durationMs: number, meta: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'production') return
    const payload = { ...meta, durationMs: Math.round(durationMs) }
    if (durationMs >= PERF_WARN_MS) {
      console.warn(`[Perf] ${label}`, payload)
    } else {
      console.info(`[Perf] ${label}`, payload)
    }
  }

  const fetchUsersPage = useCallback(async (currentPage: number, mode: 'initial' | 'more') => {
    if (!effectiveIsAdmin) return

    const from = currentPage * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const startedAt = performance.now()

    if (activeRequestRef.current) {
      activeRequestRef.current.abort()
    }

    const controller = new AbortController()
    activeRequestRef.current = controller
    const requestId = ++requestSeqRef.current

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name, role, created_at')
        .order('created_at', { ascending: false })
        .range(from, to)
        .abortSignal(controller.signal)

      if (controller.signal.aborted || requestId !== requestSeqRef.current) return
      if (fetchError) throw fetchError

      const rawUsers = data || []
      const nextUsers = rawUsers.filter(user => {
        if (loadedIdsRef.current.has(user.user_id)) return false
        loadedIdsRef.current.add(user.user_id)
        return true
      })

      setUsers(prev => (mode === 'initial' ? nextUsers : [...prev, ...nextUsers]))
      setHasMore(rawUsers.length === PAGE_SIZE)
      logPerf('admin_users_page_fetch', performance.now() - startedAt, {
        page: currentPage,
        mode,
        pageSize: PAGE_SIZE,
        returned: rawUsers.length
      })
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error('[Admin] Error fetching users:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch users')
      }
    } finally {
      if (mode === 'initial') {
        setLoading(false)
      } else {
        setLoadingMore(false)
      }
    }
  }, [effectiveIsAdmin, supabase])

  // Redirect non-admins
  useEffect(() => {
    if (!roleLoading && !effectiveIsAdmin) {
      router.push('/')
    }
  }, [effectiveIsAdmin, roleLoading, router])

  // Fetch users
  useEffect(() => {
    if (!roleLoading) {
      setLoading(true)
      setLoadingMore(false)
      setPage(0)
      setHasMore(true)
      loadedIdsRef.current = new Set()
      fetchUsersPage(0, 'initial')
    }
  }, [effectiveIsAdmin, roleLoading, fetchUsersPage, supabase])

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return
    const nextPage = page + 1
    setLoadingMore(true)
    setPage(nextPage)
    fetchUsersPage(nextPage, 'more')
  }

  if (roleLoading || (loading && effectiveIsAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  if (!effectiveIsAdmin) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-slate-500">Admin</p>
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="text-sm text-slate-400">User list</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr className="border-b border-white/10">
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Email</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Name</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Role</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id} className="border-b border-white/5">
                    <td className="p-3 text-sm text-white">{user.email}</td>
                    <td className="p-3 text-sm text-slate-300">{user.full_name || '—'}</td>
                    <td className="p-3 text-sm text-slate-300 capitalize">{user.role}</td>
                    <td className="p-3">
                      <button
                        onClick={() => router.push(`/admin/${encodeURIComponent(user.user_id)}`)}
                        className="rounded bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loading && (
            <div className="p-12 text-center text-slate-500">
              No users found
            </div>
          )}

          {users.length > 0 && hasMore && (
            <div className="flex justify-center border-t border-white/10 p-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded bg-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
