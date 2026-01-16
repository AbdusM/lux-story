import React, { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, Zap, Lock, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ComboCard } from './ComboCard'
import { getAllComboProgress, getComboSummary, type ComboProgress } from '@/lib/skill-combo-detector'
import { useGameSelectors } from '@/lib/game-store'

/**
 * SkillCombosView - Layer 5 of Progressive Skill Revelation
 *
 * Displays skill combinations players can work toward, with progress tracking
 * and rewards for achieving synergistic skill development.
 */
export function SkillCombosView() {
  const prefersReducedMotion = useReducedMotion()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'in_progress'>('all')

  // Get skill levels from game state (FutureSkills in 0-1 scale)
  const skills = useGameSelectors.useSkills()
  const skillLevels = skills as unknown as Record<string, number>

  // Get combo progress and summary
  const { comboProgress, summary } = useMemo(() => {
    const progress = getAllComboProgress(skillLevels || {})
    const sum = getComboSummary(skillLevels || {})
    return { comboProgress: progress, summary: sum }
  }, [skillLevels])

  // Filter combos based on selection
  const filteredProgress = useMemo(() => {
    switch (filter) {
      case 'unlocked':
        return comboProgress.filter((cp: ComboProgress) => cp.isUnlocked)
      case 'in_progress':
        return comboProgress.filter((cp: ComboProgress) => !cp.isUnlocked && cp.overall > 0)
      default:
        return comboProgress
    }
  }, [comboProgress, filter])

  return (
    <div className="relative p-6 pb-20 space-y-6 min-h-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/grid-pattern.svg')] bg-[size:30px_30px]" />

      {/* Header */}
      <header className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-xs font-bold text-amber-500/80 uppercase tracking-[0.2em] font-mono">
            Skill Synergies
          </h2>
        </div>
        <h1 className="text-3xl font-bold text-white font-serif tracking-tight mb-2">
          Skill Combos
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
          Combine skills to unlock powerful synergies, new career paths, and exclusive dialogue with characters.
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Trophy className="w-4 h-4" />
            {summary.unlockedCount} Unlocked
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-4 h-4" />
            {summary.inProgressCount} In Progress
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <Lock className="w-4 h-4" />
            {summary.totalCombos - summary.unlockedCount - summary.inProgressCount} Locked
          </span>
        </div>
      </header>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all' as const, label: 'All', count: summary.totalCombos },
          { id: 'unlocked' as const, label: 'Unlocked', count: summary.unlockedCount },
          { id: 'in_progress' as const, label: 'In Progress', count: summary.inProgressCount }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
              filter === tab.id
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-slate-400 hover:text-slate-300 border border-transparent"
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-3">
        {filteredProgress.length === 0 ? (
          // Empty state
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center">
              <Zap className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {filter === 'unlocked' ? 'No Combos Unlocked Yet' :
               filter === 'in_progress' ? 'No Combos In Progress' :
               'Discover Skill Combos'}
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              {filter === 'unlocked'
                ? 'Keep developing your skills to unlock powerful combinations.'
                : filter === 'in_progress'
                ? 'Start building skills to see your combo progress.'
                : 'Combine skills you develop to unlock special rewards and new career paths.'
              }
            </p>
          </motion.div>
        ) : (
          // Combo cards
          <>
            {filteredProgress.map((progress: ComboProgress, index: number) => (
              <ComboCard
                key={progress.combo.id}
                progress={progress}
                isExpanded={expandedIndex === index}
                onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              />
            ))}
          </>
        )}
      </div>

      {/* Next suggestion */}
      {summary.nextCombo && !summary.nextCombo.isUnlocked && filter === 'all' && (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-purple-950/30 border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Closest to Unlock
            </span>
          </div>
          <div className="text-sm text-white font-medium">
            {summary.nextCombo.combo.name}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">
              {summary.nextCombo.overall}% complete
            </span>
            <span className="text-xs text-slate-500">
              Develop with: {summary.nextCombo.combo.characterHint}
            </span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full"
              initial={prefersReducedMotion ? { width: `${summary.nextCombo.overall}%` } : { width: 0 }}
              animate={{ width: `${summary.nextCombo.overall}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
