/* eslint-disable no-console */
'use client'

import { useEffect } from 'react'
import { listFlags, setFlag, resetFlags } from '@/lib/feature-flags'

declare global {
  // eslint-disable-next-line no-var
  var featureFlags: undefined | {
    list: typeof listFlags
    set: typeof setFlag
    reset: typeof resetFlags
  }
}

export function FeatureFlagsBootstrap() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return

    // Dev-only console controls. This is intentionally global because
    // we want a zero-friction debugging loop without shipping UI.
    globalThis.featureFlags = {
      list: listFlags,
      set: setFlag as unknown as typeof setFlag,
      reset: resetFlags,
    }
  }, [])

  return null
}

