/**
 * Ability Unlock Ceremony
 *
 * Diegetic-ish full-screen moment when a mastery ability unlocks.
 * Kept short and tap-to-dismiss to avoid flow disruption.
 */

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { ABILITIES, type AbilityId } from '@/lib/abilities'
import { cn } from '@/lib/utils'

interface AbilityUnlockCeremonyProps {
  abilityId: AbilityId | null
  isVisible: boolean
  onComplete: () => void
}

export function AbilityUnlockCeremony({ abilityId, isVisible, onComplete }: AbilityUnlockCeremonyProps) {
  if (!abilityId) return null

  const ability = ABILITIES[abilityId]
  if (!ability) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onComplete}
          data-testid="ability-unlock-ceremony"
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
              'relative w-[min(520px,92vw)] rounded-2xl border border-amber-500/20',
              'bg-gradient-to-b from-slate-950/80 to-slate-900/50 backdrop-blur-md',
              'shadow-[0_18px_60px_rgba(0,0,0,0.5)] p-5 text-center pointer-events-none'
            )}
            initial={{ scale: 0.92, y: 14, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-amber-200/90">
              <Crown className="h-4 w-4 text-amber-300" aria-hidden="true" />
              <span>Mastery Unlocked</span>
            </div>

            <div className="mt-4 text-2xl font-serif text-slate-100">
              {ability.name}
            </div>

            <div className="mt-2 text-sm text-slate-300">
              {ability.description}
            </div>

            <div className="mt-5 text-[11px] text-slate-400">
              Tap to continue
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

