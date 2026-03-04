'use client'

import * as React from 'react'

type FocusTarget = HTMLElement | null

export interface UseFocusTrapOptions {
  /**
   * Enable focus management/trapping. For host-rendered overlays this should
   * generally be `true` while mounted.
   */
  enabled?: boolean
  /**
   * When true, attempts to move focus into the container on enable/mount.
   * This will NOT steal focus if focus is already inside the container.
   */
  autoFocus?: boolean
  /**
   * When true, restores focus to the element active when the trap was enabled.
   * Restoration is guarded so we don't focus behind another overlay.
   */
  restoreFocus?: boolean
}

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter((el) => {
    if (el.hasAttribute('disabled')) return false
    if (el.getAttribute('aria-hidden') === 'true') return false
    if (el.getAttribute('tabindex') === '-1') return false
    return true
  })
}

function focusElement(el: HTMLElement | null): void {
  if (!el) return
  try {
    el.focus({ preventScroll: true })
  } catch {
    el.focus()
  }
}

function isWithinAnyOverlaySurface(el: HTMLElement): boolean {
  const surfaces = Array.from(document.querySelectorAll<HTMLElement>('[data-overlay-surface]'))
  if (surfaces.length === 0) return true
  return surfaces.some((surface) => surface.contains(el))
}

/**
 * Lightweight focus trap + focus restore for overlays.
 *
 * Notes:
 * - Attach `ref` + `onKeyDown` to your overlay surface (the element with role="dialog").
 * - Ensure the surface is focusable (`tabIndex={-1}`) and set `data-overlay-surface`.
 * - Restoration is skipped if the previously-focused element is NOT inside any remaining
 *   overlay surface, which prevents focusing behind a newly-pushed replacement overlay.
 */
export function useFocusTrap<T extends HTMLElement>(options: UseFocusTrapOptions = {}) {
  const { enabled = true, autoFocus = true, restoreFocus = true } = options

  const ref = React.useRef<T>(null)
  const previousFocusRef = React.useRef<FocusTarget>(null)

  React.useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    if (!autoFocus) return

    const t = window.setTimeout(() => {
      const container = ref.current
      if (!container) return

      const active = document.activeElement instanceof HTMLElement ? document.activeElement : null
      if (active && container.contains(active)) return

      const focusables = getFocusable(container)
      if (focusables.length > 0) {
        focusElement(focusables[0])
        return
      }

      focusElement(container)
    }, 0)

    return () => window.clearTimeout(t)
  }, [enabled, autoFocus])

  React.useEffect(() => {
    if (!enabled) return
    return () => {
      if (!restoreFocus) return

      const previous = previousFocusRef.current
      previousFocusRef.current = null
      if (!previous) return
      if (!previous.isConnected) return

      // Guard: don't restore focus behind an overlay that remains open.
      if (!isWithinAnyOverlaySurface(previous)) return

      focusElement(previous)
    }
  }, [enabled, restoreFocus])

  const onKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (!enabled) return
    if (e.key !== 'Tab') return

    const container = ref.current
    if (!container) return

    const focusables = getFocusable(container)
    if (focusables.length === 0) {
      e.preventDefault()
      focusElement(container)
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null

    if (!active || !container.contains(active)) {
      e.preventDefault()
      focusElement(e.shiftKey ? last : first)
      return
    }

    if (e.shiftKey) {
      if (active === first) {
        e.preventDefault()
        focusElement(last)
      }
      return
    }

    if (active === last) {
      e.preventDefault()
      focusElement(first)
    }
  }, [enabled])

  return { ref, onKeyDown }
}
