'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { OVERLAY_CONFIG, type OverlayRenderMode, type OverlayRenderModeConfig } from '@/lib/overlay-config'
import { useOverlayStore, type OverlayEntry } from '@/lib/overlay-store'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { backdrop as backdropVariants, reducedMotion } from '@/lib/animations'
import { Z_INDEX } from '@/lib/ui-constants'

export type OverlayRenderer = (entry: OverlayEntry) => React.ReactNode

function resolveRenderMode(config: OverlayRenderModeConfig, isDesktop: boolean): OverlayRenderMode {
  if (typeof config === 'string') return config
  return isDesktop ? config.desktop : config.mobile
}

function shouldLockBodyScroll(lock: 'never' | 'mobile' | 'always', isDesktop: boolean): boolean {
  if (lock === 'always') return true
  if (lock === 'never') return false
  return !isDesktop
}

interface OverlayHostProps {
  renderOverlay: OverlayRenderer
}

/**
 * OverlayHost
 *
 * Single host-rendered stacking context for modal/panel/sheet overlays.
 * Anchored overlays (for example Settings on desktop) should render near their
 * triggers but still use the overlay store for open/close + blocking flags.
 */
export function OverlayHost({ renderOverlay }: OverlayHostProps) {
  const prefersReducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const overlayStack = useOverlayStore((s) => s.overlayStack)
  const popOverlay = useOverlayStore((s) => s.popOverlay)
  const [isExiting, setIsExiting] = React.useState(false)
  const prevHostCountRef = React.useRef(0)
  const lastTopHostEntryRef = React.useRef<OverlayEntry | null>(null)

  const hostEntries = React.useMemo(() => {
    return overlayStack.filter((entry) => {
      const config = OVERLAY_CONFIG[entry.id]
      return resolveRenderMode(config.renderMode, isDesktop) === 'host'
    })
  }, [overlayStack, isDesktop])

  const topHostEntry = hostEntries.length ? hostEntries[hostEntries.length - 1] : null
  React.useEffect(() => {
    if (topHostEntry) {
      lastTopHostEntryRef.current = topHostEntry
    }
  }, [topHostEntry])

  React.useEffect(() => {
    const prev = prevHostCountRef.current
    const next = hostEntries.length
    if (prev > 0 && next === 0) setIsExiting(true)
    if (next > 0) setIsExiting(false)
    prevHostCountRef.current = next
  }, [hostEntries.length])

  const topHostConfig = React.useMemo(() => {
    if (!topHostEntry) return null
    return OVERLAY_CONFIG[topHostEntry.id]
  }, [topHostEntry])
  const shouldShowBackdrop = hostEntries.length > 0
  const shouldRenderHost = shouldShowBackdrop || isExiting

  const lockScroll = React.useMemo(() => {
    const entry = topHostEntry ?? (isExiting ? lastTopHostEntryRef.current : null)
    if (!entry) return false
    const cfg = OVERLAY_CONFIG[entry.id]
    return shouldLockBodyScroll(cfg.lockBodyScroll, isDesktop)
  }, [topHostEntry, isDesktop, isExiting])
  useBodyScrollLock(lockScroll)

  if (!shouldRenderHost) return null

  return (
    <div
      className="fixed inset-0"
      data-testid="overlay-host"
    >
      <AnimatePresence onExitComplete={() => setIsExiting(false)}>
        {shouldShowBackdrop &&
          (topHostConfig?.dismissOnBackdrop ? (
            <motion.button
              key="overlay-backdrop"
              type="button"
              aria-label="Dismiss overlay"
              tabIndex={-1}
              className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm"
              style={{ zIndex: Z_INDEX.modalBackdrop }}
              initial={prefersReducedMotion ? { opacity: 1 } : 'hidden'}
              animate="visible"
              exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
              variants={prefersReducedMotion ? undefined : backdropVariants}
              transition={prefersReducedMotion ? reducedMotion : undefined}
              onClick={() => popOverlay({ reason: 'backdrop' })}
            />
          ) : (
            <motion.div
              key="overlay-backdrop"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm"
              style={{ zIndex: Z_INDEX.modalBackdrop }}
              initial={prefersReducedMotion ? { opacity: 1 } : 'hidden'}
              animate="visible"
              exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
              variants={prefersReducedMotion ? undefined : backdropVariants}
              transition={prefersReducedMotion ? reducedMotion : undefined}
            />
          ))}
      </AnimatePresence>

      {/* Render host-managed overlays in stack order above the backdrop. */}
      {hostEntries.map((entry, idx) => (
        <div
          key={`${entry.id}-${entry.openedAt}`}
          className="absolute inset-0 pointer-events-none"
          // Ensure any fixed-position overlay surfaces are contained within this entry's stacking context.
          style={{ zIndex: Z_INDEX.modal + idx * 2, transform: 'translateZ(0)' }}
          data-overlay-id={entry.id}
        >
          {renderOverlay(entry)}
        </div>
      ))}
    </div>
  )
}
