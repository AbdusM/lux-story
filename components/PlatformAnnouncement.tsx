'use client'

/**
 * Platform Announcement Component for Session Boundaries
 *
 * Displays atmospheric announcements at session boundaries.
 * Provides Continue/Pause actions with auto-save functionality.
 * Mobile-optimized for natural pause points.
 */

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Save } from 'lucide-react'

export interface PlatformAnnouncementProps {
  /** The announcement text to display */
  announcement: string
  /** Current session number */
  sessionNumber: number
  /** Estimated duration to next boundary (minutes) */
  estimatedDuration: number
  /** Called when user chooses to continue */
  onContinue: () => void
  /** Called when user chooses to pause */
  onPause: () => void
  /** Optional: Show loading state during save */
  isSaving?: boolean
}

/**
 * PlatformAnnouncement Component
 *
 * Appears at session boundaries to provide natural pause points.
 * Automatically saves progress when displayed.
 */
export function PlatformAnnouncement({
  announcement,
  sessionNumber,
  estimatedDuration,
  onContinue,
  onPause,
  isSaving = false
}: PlatformAnnouncementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <Card className="w-full max-w-lg border-2 border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
        <CardContent className="pt-8 pb-6 px-6">
          {/* Session indicator */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="text-xs font-medium tracking-wider text-amber-400/80 uppercase">
              Session {sessionNumber}
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
          </motion.div>

          {/* Platform announcement text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center mb-8"
          >
            <p className="text-lg md:text-xl leading-relaxed text-slate-200 font-light italic">
              {announcement}
            </p>
          </motion.div>

          {/* Duration estimate */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-6"
          >
            <Clock className="w-4 h-4" />
            <span>
              {estimatedDuration > 0
                ? `~${estimatedDuration} min to next pause`
                : 'Continue when ready'}
            </span>
          </motion.div>

          {/* Save indicator */}
          {isSaving ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 text-xs text-emerald-400 mb-4"
            >
              <Save className="w-3 h-3 animate-pulse" />
              <span>Saving progress...</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2 text-xs text-emerald-400/70 mb-4"
            >
              <Save className="w-3 h-3" />
              <span>Progress saved</span>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 px-6 pb-6">
          {/* Pause button */}
          <Button
            onClick={onPause}
            disabled={isSaving}
            variant="outline"
            className="flex-1 border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-300 transition-all"
          >
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Pause Journey
            </motion.span>
          </Button>

          {/* Continue button */}
          <Button
            onClick={onContinue}
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium shadow-lg shadow-amber-500/20 transition-all"
          >
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue
            </motion.span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

/**
 * Compact variant for mobile (alternative design if needed)
 */
export function PlatformAnnouncementCompact({
  announcement,
  sessionNumber,
  onContinue,
  onPause,
  isSaving = false
}: Omit<PlatformAnnouncementProps, 'estimatedDuration'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
    >
      <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
        <CardContent className="pt-4 pb-3 px-4">
          {/* Session indicator */}
          <div className="text-center mb-3">
            <span className="text-xs font-medium tracking-wider text-amber-400/80 uppercase">
              Session {sessionNumber}
            </span>
          </div>

          {/* Announcement */}
          <p className="text-sm leading-relaxed text-slate-200 font-light italic text-center mb-3">
            {announcement}
          </p>

          {/* Save indicator */}
          {isSaving ? (
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 mb-3">
              <Save className="w-3 h-3 animate-pulse" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400/70 mb-3">
              <Save className="w-3 h-3" />
              <span>Saved</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={onPause}
              disabled={isSaving}
              variant="outline"
              size="sm"
              className="flex-1 border-slate-600 hover:border-slate-500 text-slate-300"
            >
              Pause
            </Button>
            <Button
              onClick={onContinue}
              disabled={isSaving}
              size="sm"
              className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
