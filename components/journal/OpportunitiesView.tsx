import React, { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, Calendar, Lock, MapPin, Sparkles } from 'lucide-react'

import { AssistModeSelector } from '@/components/guidance/AssistModeSelector'
import { getBirminghamOpportunities, type BirminghamOpportunity as Opportunity } from '@/content/birmingham-opportunities'
import { useAdaptiveGuidance } from '@/hooks/useAdaptiveGuidance'
import { calculateCareerMatchesFromSkills, countSkillDemonstrations, type FutureSkills } from '@/lib/2030-skills-system'
import { GameStateManager } from '@/lib/game-state-manager'
import { useGameSelectors } from '@/lib/game-store'
import { routeToGuidanceDestination } from '@/lib/guidance/navigation'
import { createGuidanceInputFromRuntime } from '@/lib/guidance/runtime'
import type { AssistMode, GuidanceRecommendation } from '@/lib/guidance/contracts'
import { cn } from '@/lib/utils'

const BIRMINGHAM_OPPORTUNITIES = getBirminghamOpportunities().getFilteredOpportunities({})

interface OpportunitiesViewProps {
  onRequestTab?: (tab: 'careers' | 'opportunities') => void
  onClose?: () => void
}

export function OpportunitiesView({ onRequestTab, onClose }: OpportunitiesViewProps) {
  const router = useRouter()
  const patterns = useGameSelectors.usePatterns()
  const skills = useGameSelectors.useSkills() as Partial<FutureSkills> | Record<string, number>
  const coreGameState = useGameSelectors.useCoreGameState()
  const didTrackSurfaceRef = useRef(false)

  const sortedOpportunities = useMemo(() => {
    return [...BIRMINGHAM_OPPORTUNITIES].sort((a, b) => {
      const aUnlocked = patterns[a.unlockCondition.pattern] >= a.unlockCondition.minLevel
      const bUnlocked = patterns[b.unlockCondition.pattern] >= b.unlockCondition.minLevel

      if (aUnlocked && !bUnlocked) return -1
      if (!aUnlocked && bUnlocked) return 1
      return 0
    })
  }, [patterns])

  const unlockedCount = useMemo(() => {
    return BIRMINGHAM_OPPORTUNITIES.filter(
      (opportunity) => patterns[opportunity.unlockCondition.pattern] >= opportunity.unlockCondition.minLevel,
    ).length
  }, [patterns])

  const { careerMatches, totalDemonstrations } = useMemo(() => {
    return {
      careerMatches: calculateCareerMatchesFromSkills(skills),
      totalDemonstrations: countSkillDemonstrations(skills),
    }
  }, [skills])

  const guidanceSeed = useMemo(() => {
    const saveSnapshot = coreGameState ?? GameStateManager.getSaveSnapshot()
    const input = createGuidanceInputFromRuntime({
      playerId: coreGameState?.playerId ?? saveSnapshot?.playerId ?? '',
      skills: skills as Record<string, number>,
      careerMatches,
      totalDemonstrations,
      unlockedOpportunityCountOverride: unlockedCount,
      saveSnapshot,
      taskProgress: {},
    })

    const { taskProgress: _taskProgress, ...options } = input
    return options
  }, [careerMatches, coreGameState, skills, totalDemonstrations, unlockedCount])

  const guidance = useAdaptiveGuidance({
    surface: 'opportunities',
    ...guidanceSeed,
  })

  useEffect(() => {
    if (didTrackSurfaceRef.current) return
    if (!guidance.isReady) return
    if (totalDemonstrations <= 0) return

    didTrackSurfaceRef.current = true
    guidance.trackTaskEvent({
      taskId: 'review_opportunities',
      kind: 'viewed',
      assistMode: 'manual',
    })
  }, [guidance, totalDemonstrations])

  const currentRecommendation = guidance.stableNextBestMove

  const getAssistModeForTask = (taskId: string): AssistMode => {
    return guidance.record.taskProgress[taskId]?.latestAssistMode ?? 'manual'
  }

  const handleGuidanceAction = (recommendation: GuidanceRecommendation) => {
    const assistMode = getAssistModeForTask(recommendation.taskId)
    guidance.trackRecommendationClick(recommendation)

    if (
      recommendation.taskId === 'review_opportunities' ||
      (recommendation.destination.kind === 'tab' && recommendation.destination.tab === 'opportunities')
    ) {
      guidance.trackTaskEvent({
        taskId: recommendation.taskId,
        kind: 'completed',
        assistMode,
      })
      return
    }

    if (recommendation.destination.kind === 'route' && recommendation.destination.href === '/') {
      guidance.trackTaskEvent({
        taskId: recommendation.taskId,
        kind: 'completed',
        assistMode,
      })
      onClose?.()
      return
    }

    guidance.trackTaskEvent({
      taskId: recommendation.taskId,
      kind: 'started',
      assistMode,
    })
    routeToGuidanceDestination({
      destination: recommendation.destination,
      router,
      onRequestTab,
    })
  }

  return (
    <div className="relative min-h-full space-y-8 p-6 pb-20">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[size:30px_30px] opacity-[0.03] pointer-events-none" />

      <header className="relative">
        <div className="mb-2 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-emerald-500" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-500/80">
            Real-World Connection
          </h2>
        </div>
        <h1 className="mb-2 font-serif text-3xl font-bold tracking-tight text-white">
          Opportunities
        </h1>

        <div className="flex items-center gap-4 font-mono text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            AVAILABLE: {unlockedCount}
          </span>
          <span className="flex items-center gap-1.5 opacity-60">
            <div className="h-2 w-2 rounded-full bg-slate-700" />
            LOCKED: {BIRMINGHAM_OPPORTUNITIES.length - unlockedCount}
          </span>
        </div>
      </header>

      {guidance.isAdaptive && guidance.isReady && currentRecommendation && (
        <section className="relative z-10 overflow-hidden rounded-3xl border border-amber-400/20 bg-[linear-gradient(180deg,rgba(120,53,15,0.24),rgba(15,23,42,0.84))] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.38)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_30%)]" />
          <div className="relative space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-amber-100/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  Next Best Move
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{currentRecommendation.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-300">
                    {currentRecommendation.summary}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => guidance.dismissRecommendation(currentRecommendation.taskId)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
              >
                Not now
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Why this
              </p>
              <p className="text-sm text-slate-200">{currentRecommendation.reason}</p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Assist Mode
                </p>
                <AssistModeSelector
                  value={getAssistModeForTask(currentRecommendation.taskId)}
                  onChange={(assistMode) =>
                    guidance.selectAssistMode(currentRecommendation.taskId, assistMode)
                  }
                />
              </div>

              <button
                type="button"
                onClick={() => handleGuidanceAction(currentRecommendation)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/30 bg-amber-300/12 px-4 py-3 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-300/18"
              >
                <span>{currentRecommendation.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {guidance.snapshot.missedDoors.length > 0 && (
              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Missed Doors
                </p>
                <div className="grid gap-3">
                  {guidance.snapshot.missedDoors.map((door) => (
                    <button
                      key={door.taskId}
                      type="button"
                      onClick={() => handleGuidanceAction(door)}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-emerald-400/20 hover:bg-white/[0.06]"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{door.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">{door.reason}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="relative z-10 grid grid-cols-1 gap-4">
        {sortedOpportunities.map((opportunity, index) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            index={index}
            currentLevel={patterns[opportunity.unlockCondition.pattern]}
          />
        ))}
      </div>
    </div>
  )
}

function OpportunityCard({
  opportunity,
  index,
  currentLevel,
}: {
  opportunity: Opportunity
  index: number
  currentLevel: number
}) {
  const isUnlocked = currentLevel >= opportunity.unlockCondition.minLevel
  const progress = Math.min(100, (currentLevel / opportunity.unlockCondition.minLevel) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'relative overflow-hidden rounded-lg border transition-all duration-300',
        isUnlocked
          ? 'bg-slate-900/80 border-slate-700 shadow-sm hover:border-emerald-500/30'
          : 'bg-black/40 border-slate-800/50 opacity-70 grayscale-[0.8]',
      )}
    >
      <div className="flex gap-4 p-4">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border',
            isUnlocked
              ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400'
              : 'bg-slate-950 border-slate-800 text-slate-700',
          )}
        >
          {isUnlocked ? <Building2 className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3
              className={cn(
                'truncate text-sm font-bold',
                isUnlocked ? 'text-white' : 'text-slate-500',
              )}
            >
              {opportunity.name}
            </h3>
            <span className="whitespace-nowrap rounded border border-slate-700/50 bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {opportunity.type}
            </span>
          </div>

          <div className="mb-3 flex items-center gap-3 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {opportunity.organization}
            </span>
            {isUnlocked && (
              <>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {opportunity.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {opportunity.timeCommitment}
                </span>
              </>
            )}
          </div>

          {isUnlocked ? (
            <div className="space-y-3">
              <p className="border-l-2 border-emerald-500/20 pl-3 text-xs leading-relaxed text-slate-400">
                {opportunity.description}
              </p>

              <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-500/70">
                <span className="font-bold uppercase">Unlocked Via:</span>
                <span className="capitalize">
                  {opportunity.unlockCondition.pattern} Pattern (Lvl {opportunity.unlockCondition.minLevel}+)
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[10px] uppercase">Unlock Requirement</span>
                <span className="font-bold text-slate-600">
                  {opportunity.unlockCondition.pattern} Lvl {opportunity.unlockCondition.minLevel}
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-emerald-900 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-1 flex justify-between text-[10px] text-slate-600">
                <span>Current: {currentLevel.toFixed(1)}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <p className="mt-2 text-[10px] italic text-slate-600">
                Make {opportunity.unlockCondition.pattern}-aligned choices to increase this pattern
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
