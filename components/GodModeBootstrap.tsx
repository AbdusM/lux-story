'use client'

import { useEffect } from 'react'
import { useUserRole } from '@/hooks/useUserRole'

/**
 * God Mode Bootstrap
 *
 * Lazy-loads God Mode API based on user role:
 * - Development: Always enabled
 * - Production: Only for educator/admin roles
 * - Fallback: URL parameter ?godmode=true (for non-authenticated educators)
 *
 * Client component wrapper for Next.js server component layout
 */
export function GodModeBootstrap() {
  const { isEducator, loading } = useUserRole()

  useEffect(() => {
    if (loading) return

    // Load God Mode if:
    // 1. Development mode (always)
    // 2. Production with educator/admin role (authenticated)
    // 3. Production with ?godmode=true URL parameter (fallback for non-authenticated educators)
    const hasGodModeParam = typeof window !== 'undefined' && window.location.search.includes('godmode=true')
    const shouldLoadGodMode =
      process.env.NODE_ENV === 'development' ||
      isEducator ||
      hasGodModeParam

    if (!shouldLoadGodMode) {
      return
    }

    // Lazy load God Mode API to avoid bloating production bundle
    import('@/lib/dev-tools').then(({ createGodModeAPI }) => {
      // Expose to window
      (window as any).godMode = createGodModeAPI()

      // Log welcome message
      const accessMode = process.env.NODE_ENV === 'development'
        ? 'Development Mode'
        : isEducator
        ? 'Educator Access'
        : 'URL Parameter'

      console.warn(`⚠️ God Mode enabled (${accessMode}). Use window.godMode.* for testing.`)
      console.log('%c🎮 Available God Mode Commands:', 'font-weight: bold; font-size: 14px;')
      console.log(Object.keys((window as any).godMode).sort().join(', '))
      console.log('\n%cExamples:', 'font-weight: bold;')
      console.log('  window.godMode.setTrust("maya", 10)')
      console.log('  window.godMode.setPattern("analytical", 9)')
      console.log('  window.godMode.jumpToNode("maya_vulnerability_arc")')
      console.log('  window.godMode.unlockAllSimulations()')
      console.log('\n%cType window.godMode for full API', 'color: #10B981;')
    }).catch(err => {
      console.error('[God Mode] Failed to load:', err)
    })
  }, [isEducator, loading])

  // No visual render - this is just for side effects
  return null
}
