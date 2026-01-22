"use client"

/**
 * CharacterListView - Accessible List Alternative to Constellation Graph
 *
 * Sprint 4.3: Constellation Usability
 * Provides a list view fallback for users who find the graph difficult to navigate.
 *
 * Features:
 * - Grouped by relationship status (met/unmet)
 * - Sortable by trust level
 * - Keyboard navigable
 * - Screen reader friendly
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Users, ChevronRight, Star, Lock, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springs, STAGGER_DELAY } from '@/lib/animations'
import type { CharacterWithState } from '@/hooks/useConstellationData'
import { hapticFeedback } from '@/lib/haptic-feedback'

interface CharacterListViewProps {
  characters: CharacterWithState[]
  onOpenDetail?: (character: CharacterWithState) => void
  onTravel?: (characterId: string) => void
}

type SortMode = 'trust' | 'name' | 'recent'

export function CharacterListView({
  characters,
  onOpenDetail,
  onTravel
}: CharacterListViewProps) {
  const prefersReducedMotion = useReducedMotion()
  const [sortMode, setSortMode] = useState<SortMode>('trust')
  const [showUnmet, setShowUnmet] = useState(false)

  // Separate and sort characters
  const { metCharacters, unmetCharacters } = useMemo(() => {
    const met = characters.filter(c => c.hasMet)
    const unmet = characters.filter(c => !c.hasMet)

    // Sort met characters
    const sortedMet = [...met].sort((a, b) => {
      switch (sortMode) {
        case 'trust':
          return (b.trust || 0) - (a.trust || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'recent':
          // Could be based on last interaction, for now use trust as proxy
          return (b.trust || 0) - (a.trust || 0)
        default:
          return 0
      }
    })

    return { metCharacters: sortedMet, unmetCharacters: unmet }
  }, [characters, sortMode])

  const handleCharacterClick = (char: CharacterWithState) => {
    hapticFeedback.light()
    if (onTravel) {
      onTravel(char.id)
    } else if (onOpenDetail) {
      onOpenDetail(char)
    }
  }

  return (
    <div className="h-full flex flex-col p-3 space-y-4">
      {/* Header with sort controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Users className="w-4 h-4" />
          <span className="uppercase tracking-widest font-bold">
            {metCharacters.length} Connected
          </span>
        </div>

        {/* Sort toggle */}
        <div className="flex items-center gap-1 text-xs">
          {(['trust', 'name'] as SortMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={cn(
                "px-2 py-1 rounded-md transition-colors uppercase tracking-wider",
                sortMode === mode
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Met characters list */}
      <div className="flex-1 overflow-y-auto space-y-2 -mx-1 px-1">
        <AnimatePresence mode="popLayout">
          {metCharacters.map((char, index) => (
            <motion.button
              key={char.id}
              layout
              initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * STAGGER_DELAY.normal, ...springs.gentle }}
              onClick={() => handleCharacterClick(char)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl",
                "bg-slate-800/50 border border-slate-700/50",
                "hover:bg-slate-700/50 hover:border-amber-500/30",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                "text-left"
              )}
            >
              {/* Color indicator */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `var(--${char.color}-500, #64748b)20` }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: `var(--${char.color}-500, #64748b)` }}
                />
              </div>

              {/* Character info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">
                    {char.name}
                  </span>
                  {char.arcComplete && (
                    <span className="text-emerald-400 text-xs">✓</span>
                  )}
                </div>
                <span className="text-xs text-slate-500 truncate block">
                  {char.role}
                </span>
              </div>

              {/* Trust indicator */}
              <div className="flex items-center gap-2">
                {char.trust > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-amber-400 font-mono">
                      {char.trust}
                    </span>
                  </div>
                )}
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {metCharacters.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">
              No connections yet. Start a conversation to meet someone.
            </p>
          </div>
        )}
      </div>

      {/* Unmet characters toggle */}
      {unmetCharacters.length > 0 && (
        <div className="border-t border-slate-800 pt-3">
          <button
            onClick={() => setShowUnmet(!showUnmet)}
            className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            <span className="flex items-center gap-2 uppercase tracking-widest">
              {showUnmet ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {unmetCharacters.length} Undiscovered
            </span>
            <Lock className="w-3 h-3" />
          </button>

          <AnimatePresence>
            {showUnmet && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={springs.smooth}
                className="overflow-hidden mt-2 space-y-1"
              >
                {unmetCharacters.map((char, index) => (
                  <motion.div
                    key={char.id}
                    initial={!prefersReducedMotion ? { opacity: 0, x: -10 } : false}
                    animate={{ opacity: 0.5, x: 0 }}
                    transition={{ delay: index * STAGGER_DELAY.fast }}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600"
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-700" />
                    <span className="font-mono uppercase tracking-wider">
                      {char.name}
                    </span>
                    <span className="text-slate-700">•</span>
                    <span className="italic">{char.role}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default CharacterListView
