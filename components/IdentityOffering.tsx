/**
 * Identity Offering (V1)
 *
 * Optional accept/reject moment for identity formation.
 * Kept short, deterministic, and tap-safe.
 */

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { PatternType } from '@/lib/patterns'
import { formatIdentityName } from '@/lib/identity-system'
import { cn } from '@/lib/utils'

interface IdentityOfferingProps {
  pattern: PatternType | null
  isVisible: boolean
  onAccept: () => void
  onReject: () => void
}

export function IdentityOffering({ pattern, isVisible, onAccept, onReject }: IdentityOfferingProps) {
  if (!pattern) return null

  const name = formatIdentityName(pattern)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          data-testid="identity-offering"
        >
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.82 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />

          <motion.div
            className={cn(
              'relative w-[min(560px,92vw)] rounded-2xl border border-white/10',
              'bg-gradient-to-b from-slate-950/80 to-slate-900/50 backdrop-blur-md',
              'shadow-[0_18px_60px_rgba(0,0,0,0.5)] p-5'
            )}
            initial={{ scale: 0.92, y: 14, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-300">
              Identity Offering
            </div>
            <div className="mt-2 text-2xl font-serif text-slate-100">
              {name}
            </div>
            <div className="mt-2 text-sm text-slate-300">
              This identity is forming in you. Do you accept it?
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-amber-500/25 bg-amber-500/10 hover:bg-amber-500/15 text-slate-100 text-sm font-semibold py-2.5 transition-colors"
                onClick={onAccept}
                data-testid="identity-offering-accept"
              >
                Accept
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-semibold py-2.5 transition-colors"
                onClick={onReject}
                data-testid="identity-offering-reject"
              >
                Resist
              </button>
            </div>

            <div className="mt-3 text-[11px] text-slate-400">
              This is an optional moment. Your story continues either way.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

