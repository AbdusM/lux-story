'use client'

import { useEffect } from 'react'
import { listFlags, resetAllFlags, resetFlag, setFlag } from '@/lib/feature-flags'

type FeatureFlagsDevApi = {
  list: typeof listFlags
  set: (name: string, value: unknown) => void
  reset: (name: string) => void
  resetAll: () => void
}

/**
 * Dev-only global feature flag controls.
 *
 * Usage in the browser console (DEV only):
 * - featureFlags.list()
 * - featureFlags.set('RANKING_V2', 'beta')
 * - featureFlags.reset('RANKING_V2')
 * - featureFlags.resetAll()
 */
export function DevFeatureFlagsGlobal(): null {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return

    const g = globalThis as typeof globalThis & { featureFlags?: FeatureFlagsDevApi }
    g.featureFlags = {
      list: () => listFlags(),
      set: (name: string, value: unknown) => setFlag(name as never, value as never),
      reset: (name: string) => resetFlag(name as never),
      resetAll: () => resetAllFlags(),
    }
  }, [])

  return null
}
