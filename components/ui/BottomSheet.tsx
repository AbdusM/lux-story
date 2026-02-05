'use client'

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion, PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/animations'
import { hapticFeedback } from '@/lib/haptic-feedback'

/**
 * BottomSheet Component
 *
 * TICKET-002: Handle >3 choices without nested scroll
 *
 * Specs:
 * - Max height: 60% viewport
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
}

export function BottomSheet({
  open,
  onClose,
  title = 'Options',
  children,
  className,
  dragCloseThreshold = 100,
}: BottomSheetProps) {
  const prefersReducedMotion = useReducedMotion()
  const sheetRef = React.useRef<HTMLDivElement>(null)

  // Focus trap: focus sheet when opened
  React.useEffect(() => {
    if (open && sheetRef.current) {
      // Small delay to ensure animation has started
      const timer = setTimeout(() => {
        sheetRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Prevent body scroll when sheet is open
  React.useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [open])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Close if dragged down past threshold
    if (info.offset.y > dragCloseThreshold) {
      hapticFeedback.light()
      onClose()
    }
  }

  const handleBackdropClick = () => {
    hapticFeedback.light()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'max-h-[60vh] overflow-hidden',
              'rounded-t-2xl',
              'bg-slate-950/95 backdrop-blur-xl',
              'border-t border-white/10',
              'shadow-[0_-10px_40px_rgba(0,0,0,0.5)]',
              'focus:outline-none',
              // Safe area padding for iOS
              'pb-[max(16px,env(safe-area-inset-bottom))]',
              className
            )}
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
            <div className="px-6 pb-3 border-b border-white/5">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                {title}
              </h2>
            </div>

            {/* Content - scrollable if needed */}
            <div
              className="overflow-y-auto overscroll-contain"
              style={{
                maxHeight: 'calc(60vh - 80px)', // Account for handle + header
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {children}
            </div>
          </motion.div>
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
  const handleClick = React.useCallback(() => {
    hapticFeedback.light()
    onClick?.()
  }, [onClick])

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-full min-h-[52px] px-6 py-3',
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
