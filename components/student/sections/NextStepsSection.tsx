'use client'

import { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Lightbulb, Target } from 'lucide-react'

import { AssistModeSelector } from '@/components/guidance/AssistModeSelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdaptiveGuidance } from '@/hooks/useAdaptiveGuidance'
import type { AssistMode } from '@/lib/guidance/contracts'
import { routeToGuidanceDestination } from '@/lib/guidance/navigation'
import { createGuidanceInputFromRuntime } from '@/lib/guidance/runtime'
import { GameStateManager } from '@/lib/game-state-manager'
import { formatSkillName } from '@/lib/admin-dashboard-helpers'
import type { SkillProfile } from '@/lib/skill-profile-adapter'

interface NextStepsSectionProps {
  profile: SkillProfile
}

export function NextStepsSection({ profile }: NextStepsSectionProps) {
  const router = useRouter()
  const didTrackSurfaceRef = useRef(false)
  const skillGaps = profile.skillGaps || []
  const topGaps = skillGaps.slice(0, 2)
  const keyMoments = profile.keySkillMoments || []
  const recentMoment = keyMoments[0]

  const guidanceSeed = useMemo(() => {
    const saveSnapshot = typeof window === 'undefined' ? null : GameStateManager.getSaveSnapshot()
    const input = createGuidanceInputFromRuntime({
      playerId: profile.userId,
      careerMatches: profile.careerMatches.map((career) => ({
        readiness: career.readiness === 'near_ready' ? 'near_ready' : career.readiness,
      })),
      totalDemonstrations: profile.totalDemonstrations,
      skillCountOverride: Object.keys(profile.skillDemonstrations || {}).length,
      saveSnapshot,
      taskProgress: {},
    })

    const { taskProgress: _taskProgress, ...options } = input
    return options
  }, [profile.careerMatches, profile.skillDemonstrations, profile.totalDemonstrations, profile.userId])

  const guidance = useAdaptiveGuidance({
    surface: 'insights',
    ...guidanceSeed,
  })

  useEffect(() => {
    if (didTrackSurfaceRef.current) return
    if (!guidance.isReady) return

    didTrackSurfaceRef.current = true
    guidance.trackTaskEvent({
      taskId: 'visit_student_insights',
      kind: 'viewed',
      assistMode: 'manual',
    })
  }, [guidance])

  const currentRecommendation = guidance.stableNextBestMove
  const featuredArtifact = guidance.snapshot.shadowArtifacts[0] ?? null

  const getAssistModeForTask = (taskId: string): AssistMode => {
    return guidance.record.taskProgress[taskId]?.latestAssistMode ?? 'manual'
  }

  const handleGuidanceAction = () => {
    if (!currentRecommendation) {
      router.push('/')
      return
    }

    const assistMode = getAssistModeForTask(currentRecommendation.taskId)
    guidance.trackRecommendationClick(currentRecommendation)

    if (
      currentRecommendation.taskId === 'visit_student_insights' ||
      (currentRecommendation.destination.kind === 'route' &&
        currentRecommendation.destination.href === '/student/insights')
    ) {
      guidance.trackTaskEvent({
        taskId: currentRecommendation.taskId,
        kind: 'completed',
        assistMode,
      })
      return
    }

    guidance.trackTaskEvent({
      taskId: currentRecommendation.taskId,
      kind: 'started',
      assistMode,
    })
    routeToGuidanceDestination({
      destination: currentRecommendation.destination,
      router,
    })
  }

  return (
    <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-xl">Your Next Steps</CardTitle>
        </div>
        <CardDescription>
          A bounded guidance layer on top of what you&apos;ve already shown
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentRecommendation && guidance.isAdaptive && guidance.isReady && (
          <div className="space-y-4 rounded-2xl border border-amber-200 bg-white/80 p-4 shadow-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Next Best Move
              </p>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{currentRecommendation.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {currentRecommendation.reason}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Assist Mode
              </p>
              <AssistModeSelector
                value={getAssistModeForTask(currentRecommendation.taskId)}
                onChange={(assistMode) =>
                  guidance.selectAssistMode(currentRecommendation.taskId, assistMode)
                }
                tone="light"
              />
            </div>
          </div>
        )}

        {recentMoment && (
          <div className="rounded-lg border-l-4 border-blue-400 bg-white/60 p-4">
            <p className="mb-2 text-sm font-medium text-gray-900">Recent Insight</p>
            <p className="text-sm italic text-gray-700">
              &quot;{recentMoment.insight}&quot;
            </p>
          </div>
        )}

        {topGaps.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Areas to Explore</h3>
            </div>
            <div className="space-y-2">
              {topGaps.map((gap, index) => (
                <div key={index} className="rounded-lg bg-white/60 p-3">
                  <p className="mb-1 text-sm font-medium text-gray-900">
                    {gap.skill ? formatSkillName(gap.skill) : `Skill ${index + 1}`}
                  </p>
                  <p className="text-xs text-gray-600">
                    {gap.developmentPath ||
                      (gap.priority === 'high'
                        ? 'High priority - focus on this skill'
                        : gap.priority === 'medium'
                          ? 'Good area to explore further'
                          : 'Something to consider')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 rounded-lg bg-white/60 p-4">
          <h3 className="font-semibold text-gray-900">What You Can Do Now</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {currentRecommendation ? (
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>{currentRecommendation.summary}</span>
              </li>
            ) : (
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Return to the story lane and keep building fresh evidence.</span>
              </li>
            )}
            {guidance.snapshot.missedDoors[0] && (
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Revisit: {guidance.snapshot.missedDoors[0].title}</span>
              </li>
            )}
            {featuredArtifact ? (
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Keep your latest proof artifact nearby for future applications or conversations.</span>
              </li>
            ) : (
              <li className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>Turn one finished action into proof you can point to later.</span>
              </li>
            )}
          </ul>
        </div>

        {featuredArtifact && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Proof You Already Built
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-900">{featuredArtifact.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{featuredArtifact.description}</p>
            <div className="mt-3">
              <Button variant="outline" asChild>
                <Link href="/profile">Open Shadow Portfolio</Link>
              </Button>
            </div>
          </div>
        )}

        <Button className="w-full" size="lg" onClick={handleGuidanceAction}>
          <span>{currentRecommendation?.ctaLabel || 'Continue Your Journey'}</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
