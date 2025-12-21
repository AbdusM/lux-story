/**
 * Session Boundary Announcement Component
 *
 * Displays platform announcements at natural pause points (every 8-12 nodes)
 * Integrated into the narrative flow - no separate card styling
 */

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { SessionAnnouncement } from '@/lib/session-structure'

interface SessionBoundaryAnnouncementProps {
  announcement: SessionAnnouncement
  onDismiss?: () => void
  className?: string
}

export function SessionBoundaryAnnouncement({
  announcement,
  onDismiss,
  className
}: SessionBoundaryAnnouncementProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('space-y-4', className)}
    >
      {/* Atmospheric narrative text - no card styling */}
      <p className="text-slate-600 italic leading-relaxed text-base">
        {announcement.text}
      </p>

      {/* Optional suggestion - subtle styling */}
      {announcement.suggestion && (
        <p className="text-sm text-slate-500 italic">
          {announcement.suggestion}
        </p>
      )}

      {/* Continue as narrative choice */}
      <button
        onClick={onDismiss}
        className={cn(
          'w-full text-left px-4 py-3.5 rounded-xl',
          'text-[17px] leading-relaxed text-slate-900',
          'bg-stone-100/80 hover:bg-stone-200/80',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2'
        )}
      >
        [Continue]
      </button>
    </motion.div>
  )
}
