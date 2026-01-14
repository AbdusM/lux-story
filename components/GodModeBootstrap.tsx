'use client'

import { useEffect } from 'react'

/**
 * God Mode Bootstrap
 *
 * Lazy-loads God Mode API in development and exposes it to window.godMode
 * Client component wrapper for Next.js server component layout
 */
export function GodModeBootstrap() {
  useEffect(() => {
    // Only load in development mode
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    // Lazy load God Mode API to avoid bloating production bundle
    import('@/lib/dev-tools').then(({ createGodModeAPI }) => {
      // Expose to window
      (window as any).godMode = createGodModeAPI()

      // Log welcome message
      console.warn('⚠️ God Mode enabled. Use window.godMode.* for testing.')
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
  }, [])

  // No visual render - this is just for side effects
  return null
}
