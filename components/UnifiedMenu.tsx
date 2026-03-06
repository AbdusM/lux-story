/**
 * Unified Menu Component
 * Consolidates GameMenu, InGameSettings, and UserMenu into single entry point
 *
 * Sections:
 * 1. Audio (Volume, Mute)
 * 2. Accessibility (Text Size, Color Mode, Reduce Motion)
 * 3. Profile (Profile & Preferences, Research Participation)
 * 4. Account (User info, Sign Out / Sign In)
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SettingsMenuContents } from '@/components/settings/SettingsMenuContents'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useUserRole } from '@/hooks/useUserRole'
import { cn } from '@/lib/utils'
import { backdrop, panelDropDown } from '@/lib/animations'
import { Z_INDEX } from '@/lib/ui-constants'

type UnifiedMenuCloseReason = 'backdrop' | 'closeButton' | 'programmatic'

interface UnifiedMenuProps {
  isMuted?: boolean
  onToggleMute?: () => void
  volume?: number
  onVolumeChange?: (volume: number) => void
  onRequestLogin?: () => void
  open?: boolean
  onOpenChange?: (open: boolean, meta?: { reason?: UnifiedMenuCloseReason }) => void
}

export function UnifiedMenu({
  isMuted = false,
  onToggleMute,
  volume = 50,
  onVolumeChange,
  onRequestLogin,
  open,
  onOpenChange,
}: UnifiedMenuProps) {
  // Default to desktop behavior when matchMedia isn't available (tests/SSR).
  const isDesktop = useMediaQuery('(min-width: 640px)', true)

  const triggerRef = React.useRef<HTMLButtonElement>(null)

  // State (controlled/uncontrolled)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isOpen = open ?? uncontrolledOpen
  const setOpen = React.useCallback((next: boolean, meta?: { reason?: UnifiedMenuCloseReason }) => {
    if (open === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next, meta)
  }, [open, onOpenChange])

  // User auth (used for trigger badge only).
  const { user, role } = useUserRole()

  const shouldRenderAnchoredPanel = isOpen && isDesktop
  const { ref: panelRef, onKeyDown: handlePanelKeyDown } = useFocusTrap<HTMLDivElement>({
    enabled: shouldRenderAnchoredPanel,
  })

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!isOpen, isOpen ? { reason: 'programmatic' } : undefined)}
        className={cn(
          "relative text-slate-400 transition-colors",
          isOpen
            ? "bg-white/10 text-white ring-1 ring-white/15"
            : "hover:bg-white/5 hover:text-white"
        )}
        aria-label="Settings menu"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Settings className="w-5 h-5" />
        {/* Badge for logged-in educators/admins */}
        {user && (role === 'educator' || role === 'admin') && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400" />
        )}
      </Button>

      {/* Menu Panel (desktop anchored). Mobile uses OverlayHost (settings renderMode: host). */}
      {shouldRenderAnchoredPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={backdrop}
            className="fixed inset-0 bg-black/20"
            style={{ zIndex: Z_INDEX.panelBackdrop }}
            onClick={() => setOpen(false, { reason: 'backdrop' })}
            aria-hidden="true"
          />

          {/* Menu */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            onKeyDown={handlePanelKeyDown}
            initial="hidden"
            animate="visible"
            variants={panelDropDown}
            className={cn(
              'absolute right-0 top-full mt-2 w-[22rem] sm:w-[24rem]',
              'glass-panel-solid !rounded-[24px] border border-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.42)]',
              'overflow-hidden flex flex-col max-h-[70vh]'
            )}
            style={{ zIndex: Z_INDEX.panel }}
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
            data-overlay-surface
            data-menu-panel
          >
            <SettingsMenuContents
              onRequestClose={() => setOpen(false, { reason: 'closeButton' })}
              isMuted={isMuted}
              onToggleMute={onToggleMute}
              volume={volume}
              onVolumeChange={onVolumeChange}
              onRequestLogin={onRequestLogin}
            />
          </motion.div>
        </>
      )}
    </div>
  )
}
