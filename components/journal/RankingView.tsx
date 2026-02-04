'use client'

/**
 * RankingView - Journal tab showing unified ranking dashboard
 *
 * Displays all ranking systems in the anime-inspired presentation layer.
 * Uses the useRanking hook to compute state from game data.
 */

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useGameStore, useGameSelectors } from '@/lib/game-store'
import { useOrbs } from '@/hooks/useOrbs'
import { useRanking, createEmptyRankingInput, type UseRankingInput } from '@/hooks/useRanking'
import { RankingDashboard, CompactRankingOverview } from '@/components/ranking/RankingDashboard'
import { springs } from '@/lib/animations'
import { cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════════════
// GAME STATE TO RANKING INPUT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Transform game store state into ranking input format
 */
function useRankingInput(): UseRankingInput {
  const patterns = useGameSelectors.usePatterns()
  const skills = useGameSelectors.useSkills()
  const visitedScenes = useGameSelectors.useVisitedScenes()
  const choiceHistory = useGameSelectors.useChoiceHistory()
  const { balance } = useOrbs()

  // Get character states from core game state
  const coreGameState = useGameStore(state => state.coreGameState)

  return useMemo(() => {
    // Handle null state
    if (!coreGameState) {
      return createEmptyRankingInput()
    }

    // Transform character data
    const characterStates = coreGameState.characters.map(char => ({
      characterId: char.characterId,
      trust: char.trust,
      // No completedArcs in state - derive from conversation history length as proxy
      arcsCompleted: char.conversationHistory.length > 10 ? 1 : 0
    }))

    // Get demonstrated skills
    const demonstratedSkills = Object.entries(skills)
      .filter(([_, level]) => level > 0)
      .map(([skillId]) => skillId)

    // Session count (approximate from choice history diversity)
    const sessionsPlayed = Math.max(1, Math.floor(choiceHistory.length / 10))

    // Use sessionStartTime as proxy for account creation (first session start)
    const createdAt = coreGameState.sessionStartTime || Date.now() - 86400000

    return {
      patterns: {
        analytical: patterns.analytical ?? 0,
        patience: patterns.patience ?? 0,
        exploring: patterns.exploring ?? 0,
        helping: patterns.helping ?? 0,
        building: patterns.building ?? 0
      },
      totalOrbs: balance.totalEarned,
      characterStates,
      demonstratedSkills,
      visitedScenes: visitedScenes.length,
      choicesMade: choiceHistory.length,
      sessionsPlayed,
      createdAt
    }
  }, [patterns, skills, visitedScenes, choiceHistory, balance, coreGameState])
}

// ═══════════════════════════════════════════════════════════════════════════
// QUALITATIVE STANDING DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get display text for cohort standing
 */
function getStandingText(standing: string): string {
  switch (standing) {
    case 'leading': return 'leading the way'
    case 'ahead': return 'ahead of peers'
    case 'with_peers': return 'on pace with peers'
    case 'developing': return 'finding your path'
    case 'new': return 'just beginning'
    default: return 'progressing'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function RankingView() {
  const prefersReducedMotion = useReducedMotion()
  const rankingInput = useRankingInput()
  const ranking = useRanking(rankingInput)

  return (
    <motion.div
      className="p-4 space-y-6"
      initial={!prefersReducedMotion ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={springs.gentle}
    >
      {/* Header with compact overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Station Ranks</h3>
          <span className="text-xs text-slate-400">
            {ranking.overallProgression}% Journey
          </span>
        </div>

        {/* Compact badge row */}
        <CompactRankingOverview
          state={ranking.dashboardState}
          className="justify-center"
        />
      </div>

      {/* Resonance indicator (if active) */}
      {ranking.activeResonanceCount > 0 && (
        <motion.div
          className={cn(
            "p-3 rounded-xl border",
            "bg-gradient-to-r from-purple-900/20 to-amber-900/20",
            "border-purple-500/30"
          )}
          initial={!prefersReducedMotion ? { scale: 0.95, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={springs.gentle}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-sm text-purple-300">
              {ranking.activeResonanceCount} Resonance{ranking.activeResonanceCount > 1 ? 's' : ''} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Your ranking systems are amplifying each other
          </p>
        </motion.div>
      )}

      {/* Pending ceremony notification */}
      {ranking.hasPendingCeremony && ranking.pendingCeremony && (
        <motion.div
          className={cn(
            "p-4 rounded-xl border",
            "bg-gradient-to-r from-amber-900/30 to-slate-900/30",
            "border-amber-500/40"
          )}
          initial={!prefersReducedMotion ? { y: -10, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={springs.gentle}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <span className="text-lg">🎖️</span>
            </div>
            <div>
              <h4 className="font-medium text-amber-300">
                {ranking.pendingCeremony.name}
              </h4>
              <p className="text-sm text-slate-400 mt-0.5">
                Samuel wishes to speak with you
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Full dashboard */}
      <RankingDashboard
        state={ranking.dashboardState}
        layout="list"
        showSections={{
          patternMastery: true,
          careerExpertise: true,
          challengeRating: true,
          stationStanding: true,
          skillStars: true,
          eliteStatus: ranking.hasEliteStatus
        }}
      />

      {/* Cohort standing */}
      <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
        <h4 className="text-sm font-medium text-white mb-2">Cohort Standing</h4>
        <p className="text-xs text-slate-400">
          Among travelers who started around the same time, you are{' '}
          <span className="text-amber-400 font-medium">
            {getStandingText(ranking.cohort.qualitativeStanding)}
          </span>
        </p>
      </div>
    </motion.div>
  )
}

export default RankingView
