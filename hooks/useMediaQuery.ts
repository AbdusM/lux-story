'use client'

import * as React from 'react'

/**
 * Minimal media-query hook.
 *
 * Note: Prefer CSS for styling; use this only when behavior must change
 * (e.g., choosing host vs anchored overlay render mode).
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = React.useState(defaultValue)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof window.matchMedia !== 'function') return

    const mq = window.matchMedia(query)

    const update = () => setMatches(mq.matches)
    update()

    // Safari < 14 uses addListener/removeListener
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update)
      return () => mq.removeEventListener('change', update)
    }

    mq.addListener(update)
    return () => mq.removeListener(update)
  }, [query])

  return matches
}
