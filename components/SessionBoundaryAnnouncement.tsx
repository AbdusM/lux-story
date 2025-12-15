/**
 * Session Boundary Announcement Component
 *
 * Displays platform announcements at natural pause points (every 8-12 nodes)
 * Fits the train station metaphor and provides mobile-friendly break points
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'relative rounded-xl border-2 p-6 sm:p-8',
        'bg-gradient-to-br from-slate-50 to-slate-100/50',
        'border-slate-300/50 shadow-lg',
        className
      )}
    >
      {/* Platform Speaker Icon */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/70">
          <span className="text-xl" role="img" aria-label="Platform announcement">
            🔔
          </span>
        </div>
        <div className="text-sm font-medium uppercase tracking-wide text-slate-600">
          Platform Announcement
        </div>
      </div>

      {/* Main announcement text */}
      <p className="mb-4 text-lg leading-relaxed text-slate-800">
        {announcement.text}
      </p>

      {/* Optional suggestion */}
      {announcement.suggestion && (
        <p className="mb-6 text-sm italic text-slate-600 border-l-2 border-slate-300 pl-4">
          {announcement.suggestion}
        </p>
      )}

      {/* Dismiss button */}
      <div className="flex justify-end">
        <button
          onClick={onDismiss}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            'bg-slate-200 text-slate-700 hover:bg-slate-300',
            'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2'
          )}
        >
          Continue
        </button>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 h-20 w-20 overflow-hidden rounded-tr-xl opacity-10">
        <div className="h-full w-full bg-gradient-to-br from-slate-400 to-transparent" />
      </div>
    </motion.div>
  )
}
