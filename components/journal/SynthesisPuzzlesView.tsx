'use client'

/**
 * SynthesisPuzzlesView — Journal tab for synthesis puzzles (D-083)
 *
 * Shows puzzle progress based on knowledge flags the player has collected.
 * Puzzles require combining information from multiple characters to unlock mysteries.
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Puzzle, Lock, Lightbulb, Check, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGameSelectors } from '@/lib/game-store'
import { SYNTHESIS_PUZZLES, type SynthesisPuzzle } from '@/content/synthesis-puzzles'
import { springs, STAGGER_DELAY } from '@/lib/animations'

interface PuzzleProgress {
  puzzle: SynthesisPuzzle
  collected: string[]
  total: number
  percentage: number
  showHint: boolean
  solved: boolean
}

export function SynthesisPuzzlesView() {
  const globalFlags = useGameSelectors.useGlobalFlags()

  const puzzleProgress: PuzzleProgress[] = useMemo(() => {
    const flagSet = new Set(globalFlags || [])

    return SYNTHESIS_PUZZLES.map(puzzle => {
      const collected = puzzle.requiredKnowledge.filter(k => flagSet.has(k))
      const total = puzzle.requiredKnowledge.length
      const percentage = Math.round((collected.length / total) * 100)
      const showHint = percentage >= 50
      const solved = puzzle.reward.unlockFlag ? flagSet.has(puzzle.reward.unlockFlag) : percentage === 100

      return { puzzle, collected, total, percentage, showHint, solved }
    })
  }, [globalFlags])

  const solvedCount = puzzleProgress.filter(p => p.solved).length
  const discoveredCount = puzzleProgress.filter(p => p.percentage > 0).length

  return (
    <div className="relative p-6 pb-20 space-y-8 min-h-full">
      <header className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Puzzle className="w-5 h-5 text-violet-500" />
          <h2 className="text-xs font-bold text-violet-500/80 uppercase tracking-[0.2em] font-mono">
            Station Mysteries
          </h2>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Piece together knowledge from different characters to uncover the station&apos;s secrets.
        </p>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          {solvedCount}/{SYNTHESIS_PUZZLES.length} solved · {discoveredCount} discovered
        </p>
      </header>

      <div className="space-y-4">
        {puzzleProgress.map((progress, index) => (
          <PuzzleCard key={progress.puzzle.id} progress={progress} index={index} />
        ))}
      </div>
    </div>
  )
}

function PuzzleCard({ progress, index }: { progress: PuzzleProgress; index: number }) {
  const { puzzle, collected, total, percentage, showHint, solved } = progress

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * STAGGER_DELAY.normal, ...springs.gentle }}
      className={cn(
        'rounded-xl border p-4 transition-colors',
        solved
          ? 'bg-violet-950/30 border-violet-500/30'
          : percentage > 0
            ? 'bg-slate-900/50 border-white/10'
            : 'bg-slate-950/30 border-white/5'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          solved ? 'bg-violet-500/20 text-violet-400' :
          percentage > 0 ? 'bg-amber-500/20 text-amber-400' :
          'bg-slate-800 text-slate-500'
        )}>
          {solved ? <Check className="w-4 h-4" /> :
           percentage > 0 ? <Eye className="w-4 h-4" /> :
           <Lock className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'text-sm font-semibold',
            solved ? 'text-violet-300' : percentage > 0 ? 'text-slate-200' : 'text-slate-400'
          )}>
            {puzzle.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {solved ? puzzle.solution : puzzle.description}
          </p>

          {/* Progress bar */}
          {!solved && percentage > 0 && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-500 font-mono">
                  {collected.length}/{total} clues
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {percentage}%
                </span>
              </div>
              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-amber-500/60"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={springs.smooth}
                />
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint && !solved && (
            <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-300/70 italic leading-relaxed">
                {puzzle.hint}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
