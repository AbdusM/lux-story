'use client'

import { useCallback } from 'react'
import { useReducedMotion, PanInfo } from 'framer-motion'
import { haptics } from '@/lib/animations'

/**
 * usePullToDismiss - Adds swipe-to-dismiss physics to modals and panels
 *
 * Sprint 2: Pull-to-Dismiss Physics
 * "X button in top-right is hardest touch target - all modals support pull-down to dismiss"
 *
 * Usage:
 * ```tsx
 * const { dragProps, onDragEnd } = usePullToDismiss({
 *   direction: 'down', // or 'left', 'right'
 *   onDismiss: onClose,
 *   threshold: 100
 * })
 *
 * <motion.div
 *   {...dragProps}
 *   onDragEnd={onDragEnd}
 * >
 * ```
 */

export type DismissDirection = 'down' | 'left' | 'right' | 'up'

export interface UsePullToDismissOptions {
  /** Direction to drag for dismiss */
  direction: DismissDirection
  /** Callback when dismissed */
  onDismiss: () => void
  /** Pixel threshold to trigger dismiss (default: 100) */
  threshold?: number
  /** Whether to provide haptic feedback */
  hapticFeedback?: boolean
}

export interface UsePullToDismissReturn {
  /** Props to spread onto the motion element */
  dragProps: {
    drag: 'x' | 'y'
    dragConstraints: { top?: number; bottom?: number; left?: number; right?: number }
    dragElastic: { top?: number; bottom?: number; left?: number; right?: number }
  }
  /** Handler for drag end */
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
}

export function usePullToDismiss({
  direction,
  onDismiss,
  threshold = 100,
  hapticFeedback = true,
}: UsePullToDismissOptions): UsePullToDismissReturn {
  const prefersReducedMotion = useReducedMotion()

  const onDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Skip if reduced motion
      if (prefersReducedMotion) return

      let shouldDismiss = false

      switch (direction) {
        case 'down':
          shouldDismiss = info.offset.y > threshold
          break
        case 'up':
          shouldDismiss = info.offset.y < -threshold
          break
        case 'left':
          shouldDismiss = info.offset.x < -threshold
          break
        case 'right':
          shouldDismiss = info.offset.x > threshold
          break
      }

      if (shouldDismiss) {
        if (hapticFeedback) {
          haptics.lightTap()
        }
        onDismiss()
      }
    },
    [direction, onDismiss, threshold, hapticFeedback, prefersReducedMotion]
  )

  // Build drag constraints based on direction
  const getDragProps = (): UsePullToDismissReturn['dragProps'] => {
    switch (direction) {
      case 'down':
        return {
          drag: 'y',
          dragConstraints: { top: 0, bottom: 0 },
          dragElastic: { top: 0, bottom: 0.5 },
        }
      case 'up':
        return {
          drag: 'y',
          dragConstraints: { top: 0, bottom: 0 },
          dragElastic: { top: 0.5, bottom: 0 },
        }
      case 'left':
        return {
          drag: 'x',
          dragConstraints: { left: 0, right: 0 },
          dragElastic: { left: 0.5, right: 0 },
        }
      case 'right':
        return {
          drag: 'x',
          dragConstraints: { left: 0, right: 0 },
          dragElastic: { left: 0, right: 0.5 },
        }
    }
  }

  return {
    dragProps: prefersReducedMotion
      ? { drag: 'y', dragConstraints: {}, dragElastic: {} } // Disabled when reduced motion
      : getDragProps(),
    onDragEnd,
  }
}

/**
 * Preset configurations for common panel types
 */
export const pullToDismissPresets = {
  /** Bottom sheet - pull down to dismiss */
  bottomSheet: { direction: 'down' as const, threshold: 100 },
  /** Left panel (Journal) - pull left to dismiss */
  leftPanel: { direction: 'left' as const, threshold: 100 },
  /** Right panel - pull right to dismiss */
  rightPanel: { direction: 'right' as const, threshold: 100 },
  /** Modal/overlay - pull down to dismiss */
  modal: { direction: 'down' as const, threshold: 150 },
}
