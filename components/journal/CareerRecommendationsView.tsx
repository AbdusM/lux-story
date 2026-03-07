import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, Compass, Sparkles, Target, TrendingUp } from 'lucide-react'

import { AssistModeSelector } from '@/components/guidance/AssistModeSelector'
import { useAdaptiveGuidance } from '@/hooks/useAdaptiveGuidance'
import { calculateCareerMatchesFromSkills, countSkillDemonstrations, type FutureSkills } from '@/lib/2030-skills-system'
import { GameStateManager } from '@/lib/game-state-manager'
import { useGameSelectors } from '@/lib/game-store'
import type { AssistMode, GuidanceRecommendation } from '@/lib/guidance/contracts'
import { routeToGuidanceDestination } from '@/lib/guidance/navigation'
import { createGuidanceInputFromRuntime } from '@/lib/guidance/runtime'

import { CareerCard } from './CareerCard'

interface CareerRecommendationsViewProps {
  onRequestTab?: (tab: 'careers' | 'opportunities') => void
  onClose?: () => void
}

/**
 * CareerRecommendationsView - Layer 4 of Progressive Skill Revelation
 *
 * Shows players how their demonstrated skills map to Birmingham career pathways
 * with evidence-based recommendations using GAME STORE SKILLS DIRECTLY.
 */
export function CareerRecommendationsView({
  onRequestTab,
  onClose,
}: CareerRecommendationsViewProps) {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const didTrackSurfaceRef = useRef(false)
  const skills = useGameSelectors.useSkills() as Partial<FutureSkills> | Record<string, number>
  const coreGameState = useGameSelectors.useCoreGameState()

  const { careerMatches, totalDemonstrations } = useMemo(() => {
    return {
      careerMatches: calculateCareerMatchesFromSkills(skills),
      totalDemonstrations: countSkillDemonstrations(skills),
    }
  }, [skills])

  const readinessCounts = useMemo(() => {
    const counts = { near_ready: 0, developing: 0, exploring: 0 }
    careerMatches.forEach((career) => {
      counts[career.readiness]++
    })
    return counts
  }, [careerMatches])

  const guidanceSeed = useMemo(() => {
    const saveSnapshot = coreGameState ?? GameStateManager.getSaveSnapshot()
    const input = createGuidanceInputFromRuntime({
      playerId: coreGameState?.playerId ?? saveSnapshot?.playerId ?? '',
      skills: skills as Record<string, number>,
      careerMatches,
      totalDemonstrations,
      saveSnapshot,
      taskProgress: {},
    })

    const { taskProgress: _taskProgress, ...options } = input
    return options
  }, [careerMatches, coreGameState, skills, totalDemonstrations])

  const guidance = useAdaptiveGuidance({
    surface: 'careers',
    ...guidanceSeed,
  })

  useEffect(() => {
    if (didTrackSurfaceRef.current) return
    if (!guidance.isReady) return
    if (totalDemonstrations <= 0) return

    didTrackSurfaceRef.current = true
    guidance.trackTaskEvent({
      taskId: 'review_career_matches',
      kind: 'viewed',
      assistMode: 'manual',
    })
  }, [guidance, totalDemonstrations])

  const hasData = totalDemonstrations > 0
  const currentRecommendation = guidance.stableNextBestMove

  const getAssistModeForTask = (taskId: string): AssistMode => {
    return guidance.record.taskProgress[taskId]?.latestAssistMode ?? 'manual'
  }

  const handleExpandCareer = (index: number) => {
    const nextExpanded = expandedIndex === index ? null : index
    setExpandedIndex(nextExpanded)

    if (nextExpanded === null) return

    guidance.trackTaskEvent({
      taskId: 'inspect_top_career_match',
      kind: 'completed',
      assistMode: getAssistModeForTask('inspect_top_career_match'),
    })
  }

  const handleGuidanceAction = (recommendation: GuidanceRecommendation) => {
    const assistMode = getAssistModeForTask(recommendation.taskId)
    guidance.trackRecommendationClick(recommendation)

    if (recommendation.taskId === 'inspect_top_career_match' && careerMatches.length > 0) {
      guidance.trackTaskEvent({
        taskId: recommendation.taskId,
        kind: 'started',
        assistMode,
      })
      setExpandedIndex(0)
      guidance.trackTaskEvent({
        taskId: recommendation.taskId,
        kind: 'completed',
        assistMode,
      })
      return
    }

    if (
      recommendation.taskId === 'review_career_matches' ||
      (recommendation.destination.kind === 'tab' && recommendation.destination.tab === 'careers')
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
    <div className="relative min-h-full space-y-6 p-6 pb-20">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[size:30px_30px] opacity-[0.03] pointer-events-none" />

      <header className="relative">
        <div className="mb-2 flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-500" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-purple-500/80">
            Career Mapping
          </h2>
        </div>
        <h1 className="mb-2 font-serif text-3xl font-bold tracking-tight text-white">
          Career Matches
        </h1>

        <p className="max-w-sm text-sm leading-relaxed text-slate-400">
          Based on the skills you&apos;ve demonstrated in your journey, these Birmingham career pathways align with your strengths.
        </p>

        <div className="mt-4 flex items-center gap-4 font-mono text-xs">
          {readinessCounts.near_ready > 0 && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              {readinessCounts.near_ready} Near Ready
            </span>
          )}
          {readinessCounts.developing > 0 && (
            <span className="flex items-center gap-1.5 text-amber-400">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              {readinessCounts.developing} Developing
            </span>
          )}
          {readinessCounts.exploring > 0 && (
            <span className="flex items-center gap-1.5 text-blue-400/70">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              {readinessCounts.exploring} Exploring
            </span>
          )}
        </div>
      </header>

      {guidance.isAdaptive && guidance.isReady && currentRecommendation && (
        <section className="relative z-10 overflow-hidden rounded-3xl border border-purple-500/20 bg-[linear-gradient(180deg,rgba(88,28,135,0.18),rgba(15,23,42,0.84))] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.38)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_34%)]" />
          <div className="relative space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-purple-100/80">
                <Sparkles className="h-3.5 w-3.5" />
                Trajectory Signal
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{currentRecommendation.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">
                  {currentRecommendation.reason}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <AssistModeSelector
                value={getAssistModeForTask(currentRecommendation.taskId)}
                onChange={(assistMode) =>
                  guidance.selectAssistMode(currentRecommendation.taskId, assistMode)
                }
              />
              <button
                type="button"
                onClick={() => handleGuidanceAction(currentRecommendation)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-300/30 bg-purple-300/12 px-4 py-3 text-sm font-medium text-purple-100 transition-colors hover:bg-purple-300/18"
              >
                <span>{currentRecommendation.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="relative z-10 space-y-4">
        {!hasData ? (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50">
              <Compass className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Your Journey Awaits</h3>
            <p className="mx-auto max-w-xs text-sm text-slate-400">
              Make choices in conversations to reveal which career paths match your skills and decision-making style.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-4 w-4" />
              <span>Career matches update as you explore</span>
            </div>
          </motion.div>
        ) : careerMatches.length === 0 ? (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-purple-500/20 bg-purple-950/30">
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Building Your Profile</h3>
            <p className="mx-auto max-w-xs text-sm text-slate-400">
              You&apos;ve made {totalDemonstrations} skill demonstrations. Keep exploring to unlock personalized career recommendations.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="space-y-3">
              {careerMatches.map((career, index) => (
                <CareerCard
                  key={career.name}
                  career={career}
                  rank={index + 1}
                  isExpanded={expandedIndex === index}
                  onToggle={() => handleExpandCareer(index)}
                />
              ))}
            </div>

            <div className="pt-4 text-center">
              <p className="font-mono text-xs text-slate-500">
                Based on {totalDemonstrations} skill demonstration{totalDemonstrations !== 1 ? 's' : ''} across your journey
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
