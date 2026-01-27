'use client'

import { useEffect } from 'react'
import { useUserRole } from '@/hooks/useUserRole'

/**
 * God Mode Bootstrap
 *
 * Lazy-loads God Mode API based on user role:
 * - Development: Always enabled
 * - Production: Educator/admin roles only
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
    const shouldLoadGodMode =
      process.env.NODE_ENV === 'development' ||
      isEducator

    if (!shouldLoadGodMode) {
      return
    }

    // Lazy load God Mode API to avoid bloating production bundle
    import('@/lib/dev-tools').then(({ createGodModeAPI }) => {
      // Set authorization flag for production educator access
      if (isEducator) {
        window.__GOD_MODE_AUTHORIZED = true
      }

      // Expose to window
      window.godMode = createGodModeAPI()

      // Log welcome message
      const accessMode = process.env.NODE_ENV === 'development'
        ? 'Development Mode'
        : 'Educator Access'

      console.warn(`⚠️ God Mode enabled (${accessMode}). Use window.godMode.* for testing.`)
      console.log('%c🎮 Available God Mode Commands:', 'font-weight: bold; font-size: 14px;')
      console.log(Object.keys(window.godMode!).sort().join(', '))
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
