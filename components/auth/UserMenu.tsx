/**
 * User Menu Component
 * Displays user authentication status and provides login/logout options
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, Shield, Loader2, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/hooks/useUserRole'
import { createClient } from '@/lib/supabase/client'
import { LoginModal } from './LoginModal'

export function UserMenu() {
  const router = useRouter()
  const { user, role, loading } = useUserRole()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const supabase = createClient()

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await supabase.auth.signOut()
      setShowMenu(false)
    } catch (error) {
      console.error('[UserMenu] Sign out error:', error)
    } finally {
      setSigningOut(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowLoginModal(true)}
          className="relative h-9 w-9 p-0 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-md flex items-center justify-center"
          title="Sign In"
        >
          <User className="h-4 w-4" />
        </button>

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="relative h-9 w-9 p-0 hover:bg-white/10 transition-all duration-300 rounded-md flex items-center justify-center"
        title={`${user.email} (${role})`}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
          {user.email?.[0]?.toUpperCase() || 'U'}
        </div>
        {(role === 'educator' || role === 'admin') && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border border-slate-900" title="Educator/Admin">
            <Shield className="w-2 h-2 text-slate-900" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[90]"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 glass-panel-solid !rounded-lg border border-white/10 shadow-xl z-[91] overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {(role === 'educator' || role === 'admin') && (
                        <Shield className="w-3 h-3 text-amber-400" />
                      )}
                      <span className="text-xs text-slate-400 capitalize">{role}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    router.push('/profile')
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
