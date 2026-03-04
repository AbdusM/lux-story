'use client'

import * as React from 'react'

/**
 * Body scroll lock with scroll position preservation.
 *
 * This is intentionally small and predictable; overlays should prefer using this
 * via OverlayHost rather than re-implementing per component.
 */
export function useBodyScrollLock(enabled: boolean): void {
  React.useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    const scrollY = window.scrollY || 0
    const body = document.body

    const original = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'

    return () => {
      body.style.overflow = original.overflow
      body.style.position = original.position
      body.style.top = original.top
      body.style.width = original.width
      body.style.paddingRight = original.paddingRight
      if (typeof window.scrollTo === 'function') {
        window.scrollTo(0, scrollY)
      }
    }
  }, [enabled])
}
