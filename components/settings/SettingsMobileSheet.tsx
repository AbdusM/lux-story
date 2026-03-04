'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SettingsMenuContents, type SettingsMenuContentsProps } from '@/components/settings/SettingsMenuContents'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { panelFromBottom, reducedMotion } from '@/lib/animations'
import { SAFE_AREA } from '@/lib/ui-constants'
import { cn } from '@/lib/utils'

export interface SettingsMobileSheetProps extends Omit<SettingsMenuContentsProps, 'onRequestClose'> {
  onClose: () => void
}

/**
 * Host-rendered settings sheet (mobile).
 *
 * This is a "surface wrapper" around SettingsMenuContents:
 * - no backdrops (OverlayHost supplies it)
 * - no global listeners (global shortcuts + overlay-store handle Escape/backdrop deterministically)
 */
export function SettingsMobileSheet({
  onClose,
  onShowReport,
  isMuted,
  onToggleMute,
  volume,
  onVolumeChange,
  playerId,
  onRequestLogin,
}: SettingsMobileSheetProps) {
  const prefersReducedMotion = useReducedMotion()
  const { ref: sheetRef, onKeyDown: handleKeyDown } = useFocusTrap<HTMLDivElement>()

  return (
    <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
      <motion.div
        ref={sheetRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        data-overlay-surface
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : 'hidden'}
        animate="visible"
        variants={prefersReducedMotion ? undefined : panelFromBottom}
        transition={prefersReducedMotion ? reducedMotion : undefined}
        className={cn(
          'w-full max-w-lg',
          'glass-panel-solid !rounded-t-2xl border border-white/10 shadow-2xl',
          'max-h-[85vh] overflow-hidden flex flex-col',
          'pointer-events-auto',
          // Keep the bottom of the sheet clear of notches/home indicators.
          'pb-0'
        )}
        style={{ paddingBottom: SAFE_AREA.bottom }}
      >
        {/* Drag handle hint (no gesture yet; just discoverability) */}
        <div className="flex justify-center py-2" aria-hidden="true">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <SettingsMenuContents
          onRequestClose={onClose}
          onShowReport={onShowReport}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          volume={volume}
          onVolumeChange={onVolumeChange}
          playerId={playerId}
          onRequestLogin={onRequestLogin}
        />
      </motion.div>
    </div>
  )
}
