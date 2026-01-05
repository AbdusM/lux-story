/**
 * Session Boundary Announcement Component
 *
 * Displays platform announcements at natural pause points (every 8-12 nodes)
 * Compact, non-obstructive design with dismiss action
 */

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, Clock } from 'lucide-react'
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
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'relative group',
        className
      )}
    >
      <div className={cn(
        'flex items-start gap-3 p-3 pl-4 rounded-lg border',
        'bg-indigo-950/40 border-indigo-500/20 shadow-sm',
        'backdrop-blur-md'
      )}>
        {/* Icon */}
        <div className="mt-0.5 flex-shrink-0 text-indigo-400">
          <Clock className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-medium text-indigo-100 leading-snug">
            {announcement.text}
          </p>
          {announcement.suggestion && (
            <p className="text-xs text-indigo-400/80 mt-1">
              {announcement.suggestion}
            </p>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 p-1.5 -mr-1 -mt-1 rounded-md',
            'text-indigo-400/60 hover:text-indigo-200 hover:bg-white/5',
            'transition-colors duration-200'
          )}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
