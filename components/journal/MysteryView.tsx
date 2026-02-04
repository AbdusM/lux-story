"use client"

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Train, User, Building, Lock, Eye, HelpCircle } from 'lucide-react'
import { useGameSelectors } from '@/lib/game-store'
import { cn } from '@/lib/utils'
import { springs, STAGGER_DELAY } from '@/lib/animations'
import type { MysteryState } from '@/lib/character-state'

/**
 * MysteryView - Displays the player's mystery investigation progress
 *
 * Shows 4 mystery branches from the narrative:
 * - Letter Sender: Who sends the mysterious letters?
 * - Platform Seven: What lies beneath the station?
 * - Samuel's Past: What did Samuel sacrifice?
 * - Station Nature: What is this place really?
 */

interface MysteryConfig {
  id: keyof MysteryState
  label: string
  description: string
  icon: typeof Mail
  color: string
  bgColor: string
  states: Record<string, { label: string; progress: number; hint: string }>
}

const MYSTERY_CONFIGS: MysteryConfig[] = [
  {
    id: 'letterSender',
    label: 'The Letter',
    description: 'Who sends the mysterious letters to the station?',
    icon: Mail,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/20',
    states: {
      unknown: { label: 'Unknown', progress: 0, hint: 'The letters arrive, but from whom?' },
      investigating: { label: 'Investigating', progress: 25, hint: 'Samuel may know more...' },
      trusted: { label: 'Trusted', progress: 50, hint: 'The sender has earned your trust.' },
      rejected: { label: 'Rejected', progress: 50, hint: 'You chose not to trust them.' },
      samuel_knows: { label: 'Samuel Knows', progress: 75, hint: 'Samuel holds the answer.' },
      self_revealed: { label: 'Revealed', progress: 100, hint: 'The truth is known.' }
    }
  },
  {
    id: 'platformSeven',
    label: 'Platform Seven',
    description: 'What lies in the station\'s hidden depths?',
    icon: Train,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    states: {
      stable: { label: 'Stable', progress: 0, hint: 'The station hums normally.' },
      flickering: { label: 'Flickering', progress: 25, hint: 'Something stirs below.' },
      error: { label: 'Error', progress: 50, hint: 'Records have been erased.' },
      denied: { label: 'Access Denied', progress: 50, hint: 'The path is blocked.' },
      revealed: { label: 'Revealed', progress: 100, hint: 'The buffer zone opens.' }
    }
  },
  {
    id: 'samuelsPast',
    label: 'Samuel\'s Past',
    description: 'What did Samuel sacrifice to become the Conductor?',
    icon: User,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    states: {
      hidden: { label: 'Hidden', progress: 0, hint: 'Samuel keeps his past close.' },
      hinted: { label: 'Hinted', progress: 50, hint: 'Glimpses of another life.' },
      revealed: { label: 'Revealed', progress: 100, hint: 'Dorothy. Twenty-eight years.' }
    }
  },
  {
    id: 'stationNature',
    label: 'Station Nature',
    description: 'What is Grand Central Terminus really?',
    icon: Building,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    states: {
      unknown: { label: 'Unknown', progress: 0, hint: 'A train station, or something more?' },
      sensing: { label: 'Sensing', progress: 33, hint: 'The station called to you.' },
      understanding: { label: 'Understanding', progress: 66, hint: 'A mirror, showing who you are.' },
      mastered: { label: 'Mastered', progress: 100, hint: 'A crossroads between who you were and who you\'re becoming.' }
    }
  }
]

export function MysteryView() {
  const prefersReducedMotion = useReducedMotion()
  const gameState = useGameSelectors.useCoreGameStateHydrated()

  const mysteries = useMemo(() => {
    if (!gameState?.mysteries) {
      return null
    }

    return MYSTERY_CONFIGS.map(config => {
      const currentState = gameState.mysteries[config.id]
      const stateInfo = config.states[currentState]
      return {
        ...config,
        currentState,
        stateLabel: stateInfo?.label ?? 'Unknown',
        progress: stateInfo?.progress ?? 0,
        hint: stateInfo?.hint ?? ''
      }
    })
  }, [gameState?.mysteries])

  // Check if player has discovered any mysteries
  const hasDiscoveredMysteries = mysteries?.some(m => m.progress > 0)

  if (!mysteries) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-slate-400">Loading mysteries...</p>
      </div>
    )
  }

  if (!hasDiscoveredMysteries) {
    return (
      <div className="p-4 text-center space-y-3">
        <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
        <p className="text-sm text-slate-400">
          The station holds many secrets. Talk to the passengers and explore to uncover them.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Active mysteries */}
      <div className="space-y-3">
        {mysteries.map((mystery, index) => {
          const Icon = mystery.icon
          const isDiscovered = mystery.progress > 0
          const isComplete = mystery.progress === 100

          return (
            <motion.div
              key={mystery.id}
              className={cn(
                "p-3 rounded-lg border transition-colors",
                isDiscovered
                  ? "bg-white/5 border-white/10"
                  : "bg-white/[0.02] border-white/5 opacity-50"
              )}
              initial={!prefersReducedMotion ? { opacity: 0, x: -10 } : false}
              animate={{ opacity: isDiscovered ? 1 : 0.5, x: 0 }}
              transition={{
                delay: index * STAGGER_DELAY.normal,
                ...springs.gentle
              }}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  isComplete ? mystery.bgColor : "bg-white/5"
                )}>
                  {isDiscovered ? (
                    <Icon className={cn("w-4 h-4", isComplete ? mystery.color : "text-slate-400")} />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={cn(
                      "text-sm font-medium",
                      isComplete ? mystery.color : "text-slate-300"
                    )}>
                      {mystery.label}
                    </h4>
                    {isDiscovered && (
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        isComplete
                          ? cn(mystery.bgColor, mystery.color)
                          : "bg-white/5 text-slate-400"
                      )}>
                        {mystery.stateLabel}
                      </span>
                    )}
                  </div>

                  {isDiscovered && (
                    <>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full rounded-full",
                            mystery.bgColor.replace('/20', '')
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${mystery.progress}%` }}
                          transition={springs.smooth}
                        />
                      </div>

                      {/* Hint */}
                      <p className="mt-1.5 text-[11px] text-slate-500 italic">
                        {isComplete ? (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {mystery.hint}
                          </span>
                        ) : (
                          mystery.hint
                        )}
                      </p>
                    </>
                  )}

                  {!isDiscovered && (
                    <p className="mt-1 text-[11px] text-slate-600">
                      {mystery.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
