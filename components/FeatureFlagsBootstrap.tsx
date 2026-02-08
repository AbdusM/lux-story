'use client'

import { useEffect } from 'react'
import { listFlags, resetFlags, setFlag } from '@/lib/feature-flags'

type FeatureFlagsDevAPI = {
  list: typeof listFlags
  set: typeof setFlag
  reset: typeof resetFlags
}

/**
 * Feature Flags Bootstrap (dev-only)
 *
 * Exposes a minimal console API:
 * - `featureFlags.list()`
 * - `featureFlags.set('FLAG', value)`
 * - `featureFlags.reset()`
 */
export function FeatureFlagsBootstrap() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return

    const api: FeatureFlagsDevAPI = {
      list: listFlags,
      set: setFlag as unknown as typeof setFlag,
      reset: resetFlags,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).featureFlags = api
  }, [])

  return null
}

