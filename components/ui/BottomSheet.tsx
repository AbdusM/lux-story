'use client'

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion, PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'
import { backdrop as backdropVariants, reducedMotion, springs } from '@/lib/animations'
import { Z_INDEX } from '@/lib/ui-constants'

/**
 * BottomSheet Component
 *
 * TICKET-002: Handle >3 choices without nested scroll
 *
 * Specs:
 * - Max height: ~70% mobile / ~50% desktop
 * - Backdrop: Blur + 50% opacity
 * - Close triggers: Swipe down, tap backdrop, select choice
 * - Tap target: 52-60px height minimum
 * - Accessibility: Focus trap, aria labels
 * - Respects prefers-reduced-motion
 */

export interface BottomSheetProps {
  /** Whether the sheet is open */
  open: boolean
  /** Callback when sheet should close */
  onClose: () => void
  /** Sheet title for accessibility */
  title?: string
  /** Sheet content */
  children: React.ReactNode
  /** Additional className for the sheet container */
  className?: string
  /** Threshold in pixels to trigger close on drag (default: 100) */
  dragCloseThreshold?: number
  /**
   * Rendering mode:
   * - `standalone`: BottomSheet renders its own backdrop + scroll-lock (legacy behavior).
   * - `host`: BottomSheet is rendered inside OverlayHost (no backdrop, no global listeners, no scroll-lock).
   */
  mode?: 'standalone' | 'host'
}

export function BottomSheet({
  open,
  onClose,
  title = 'Options',
  children,
  className,
  dragCloseThreshold = 100,
  mode = 'standalone',
}: BottomSheetProps) {
  const prefersReducedMotion = useReducedMotion()
  const sheetRef = React.useRef<HTMLDivElement>(null)

  // Focus trap: focus sheet when opened
  React.useEffect(() => {
    if (open && sheetRef.current) {
      // Small delay to ensure animation has started
      const timer = setTimeout(() => {
        sheetRef.current?.focus()
      }, mode === 'standalone' ? 100 : 0)
      return () => clearTimeout(timer)
    }
  }, [open, mode])

  const getFocusable = React.useCallback(() => {
    const sheet = sheetRef.current
    if (!sheet) return []
    return Array.from(
      sheet.querySelectorAll<HTMLElement>(
        [
          'a[href]',
          'button:not([disabled])',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
        ].join(',')
      )
    ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
  }, [])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const focusable = getFocusable()
    if (focusable.length === 0) {
      e.preventDefault()
      sheetRef.current?.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (!active || !sheetRef.current?.contains(active)) {
      e.preventDefault()
      ;(e.shiftKey ? last : first).focus()
      return
    }

    if (e.shiftKey) {
      if (active === first) {
        e.preventDefault()
        last.focus()
      }
      return
    }

    if (active === last) {
      e.preventDefault()
      first.focus()
    }
  }, [getFocusable])

  // Close on Escape key (standalone only; OverlayHost + global shortcuts own it in host mode)
  React.useEffect(() => {
    if (mode !== 'standalone') return
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mode, open, onClose])

  // Prevent body scroll when sheet is open (standalone only; OverlayHost owns it in host mode)
  React.useEffect(() => {
    if (mode !== 'standalone') return
    if (open) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [mode, open])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Close if dragged down past threshold
    if (info.offset.y > dragCloseThreshold) {
      onClose()
    }
  }

  const sheet = (
    <motion.div
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      data-overlay-surface
      className={cn(
        mode === 'standalone' ? 'fixed bottom-0 left-0 right-0' : 'absolute bottom-0 left-0 right-0',
        'max-h-[76dvh] sm:max-h-[50dvh] overflow-hidden',
        'rounded-t-2xl',
        'bg-slate-950/95 backdrop-blur-xl',
        'border-t border-white/10',
        'shadow-[0_-10px_40px_rgba(0,0,0,0.5)]',
        'focus:outline-none pointer-events-auto',
        // Safe area padding for iOS
        'pb-[calc(max(24px,env(safe-area-inset-bottom))+8px)]',
        className
      )}
      style={mode === 'standalone' ? { zIndex: Z_INDEX.panel } : undefined}
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { y: '100%', opacity: 0 }
      }
      animate={
        prefersReducedMotion
          ? { opacity: 1 }
          : { y: 0, opacity: 1 }
      }
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : { y: '100%', opacity: 0 }
      }
      transition={springs.smooth}
      drag={prefersReducedMotion ? false : 'y'}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.5 }}
      onDragEnd={handleDragEnd}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div
          className="w-10 h-1 rounded-full bg-white/30"
          aria-hidden="true"
        />
      </div>

      {/* Header */}
      <div className="px-5 pb-3 border-b border-white/5 sm:px-6">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest">
          {title}
        </h2>
      </div>

      {/* Content - scrollable if needed */}
      <div
        className="overflow-y-auto overscroll-contain max-h-[calc(76dvh-80px)] sm:max-h-[calc(50dvh-80px)]"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </motion.div>
  )

  if (mode === 'host') {
    if (!open) return null
    return <div className="absolute inset-0 flex items-end justify-center pointer-events-none">{sheet}</div>
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: Z_INDEX.panelBackdrop }}
            initial={prefersReducedMotion ? { opacity: 1 } : 'hidden'}
            animate="visible"
            exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
            variants={prefersReducedMotion ? undefined : backdropVariants}
            transition={prefersReducedMotion ? reducedMotion : undefined}
            onClick={onClose}
            aria-hidden="true"
          />
          {sheet}
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * BottomSheetItem - A selectable item in the bottom sheet
 *
 * Ensures 52-60px touch target height per Apple HIG
 */
export interface BottomSheetItemProps {
  /** Item label */
  children: React.ReactNode
  /** Click handler */
  onClick?: () => void
  /** Whether this item is disabled */
  disabled?: boolean
  /** Additional className */
  className?: string
  /** Icon to display before label */
  icon?: React.ReactNode
}

export function BottomSheetItem({
  children,
  onClick,
  disabled = false,
  className,
  icon,
}: BottomSheetItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full min-h-[56px] px-5 py-4',
        'flex items-center gap-3',
        'text-left text-base text-white/90',
        'transition-colors duration-150',
        'hover:bg-white/5 active:bg-white/10',
        'focus:outline-none focus:bg-white/5',
        'disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
    >
      {icon && <span className="flex-shrink-0 text-white/60">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  )
}

export default BottomSheet
