'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Lightbulb,
  MousePointerClick,
  RefreshCw,
  Route,
  Shield,
  SlidersHorizontal,
  Users2,
} from 'lucide-react'
import type { SkillProfile, KeySkillMoment } from '@/lib/skill-profile-adapter'
import type {
  AdminGuidanceCohortMetrics,
  AdminGuidanceSummaryResponse,
  AdminGuidanceResponse,
} from '@/lib/types/admin-api'
import { NowcastingActionPlanSection } from '@/components/admin/sections/NowcastingActionPlanSection'

interface ActionSectionProps {
  userId: string
  profile: SkillProfile
  adminViewMode: 'family' | 'research'
}

export function ActionSection({ userId, profile, adminViewMode }: ActionSectionProps) {
  const user = profile // Alias for consistency with original code
  const [guidanceData, setGuidanceData] = useState<AdminGuidanceResponse | null>(null)
  const [guidanceLoading, setGuidanceLoading] = useState(false)
  const [guidanceError, setGuidanceError] = useState<string | null>(null)
  const [guidanceSummaryData, setGuidanceSummaryData] = useState<AdminGuidanceSummaryResponse | null>(null)
  const [guidanceSummaryLoading, setGuidanceSummaryLoading] = useState(false)
  const [guidanceSummaryError, setGuidanceSummaryError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchGuidanceData = async () => {
      setGuidanceLoading(true)
      setGuidanceError(null)

      try {
        const response = await fetch(`/api/admin/guidance/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch guidance diagnostics')
        }

        const data = (await response.json()) as AdminGuidanceResponse
        if (cancelled) return
        setGuidanceData(data)
      } catch (error) {
        if (cancelled) return
        console.error('Error fetching guidance diagnostics:', error)
        setGuidanceError('Unable to load adaptive guidance diagnostics')
      } finally {
        if (!cancelled) {
          setGuidanceLoading(false)
        }
      }
    }

    if (userId) {
      fetchGuidanceData()
    }

    return () => {
      cancelled = true
    }
  }, [userId])

  const guidance = guidanceData?.guidance ?? null
  const guidanceSummary = guidanceSummaryData?.summary ?? null
  const cohortMetricsById = new Map(
    guidanceSummary?.cohorts.map((cohort) => [cohort.cohort, cohort]) ?? [],
  )
  const controlCohort = cohortMetricsById.get('control') ?? null
  const adaptiveCohort = cohortMetricsById.get('adaptive') ?? null

  useEffect(() => {
    let cancelled = false

    const fetchGuidanceSummary = async () => {
      setGuidanceSummaryLoading(true)
      setGuidanceSummaryError(null)

      try {
        const response = await fetch('/api/admin/guidance/summary?days=30&limit=200')
        if (!response.ok) {
          throw new Error('Failed to fetch guidance cohort summary')
        }

        const data = (await response.json()) as AdminGuidanceSummaryResponse
        if (cancelled) return
        setGuidanceSummaryData(data)
      } catch (error) {
        if (cancelled) return
        console.error('Error fetching guidance cohort summary:', error)
        setGuidanceSummaryError('Unable to load guidance cohort summary')
      } finally {
        if (!cancelled) {
          setGuidanceSummaryLoading(false)
        }
      }
    }

    fetchGuidanceSummary()

    return () => {
      cancelled = true
    }
  }, [])

  const formatRate = (value: number) => `${value}%`

  const renderCohortCard = (
    cohort: AdminGuidanceCohortMetrics | null,
    label: string,
    tone: 'control' | 'adaptive',
  ) => {
    const toneClasses = tone === 'adaptive'
      ? 'border-blue-200 bg-blue-50/70'
      : 'border-slate-200 bg-slate-50/80'

    if (!cohort) {
      return (
        <div className={`rounded-xl border p-4 ${toneClasses}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <Badge variant="outline">0 learners</Badge>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            No stored guidance records for this cohort in the current summary window.
          </p>
        </div>
      )
    }

    return (
      <div className={`rounded-xl border p-4 ${toneClasses}`}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <Badge variant={tone === 'adaptive' ? 'default' : 'secondary'}>
            {cohort.userCount} learner{cohort.userCount === 1 ? '' : 's'}
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-white/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Funnel
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {cohort.recommendationShown} shown · {cohort.recommendationClicked} clicked · {cohort.taskCompleted} completed
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {cohort.recommendationDismissed} dismissed · {cohort.artifactExported} exports
            </p>
          </div>
          <div className="rounded-lg bg-white/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Rates
            </p>
            <p className="mt-2 text-sm text-slate-700">
              CTR {formatRate(cohort.ctr)} · Completion {formatRate(cohort.completionRate)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Dismiss {formatRate(cohort.dismissRate)} · Export {formatRate(cohort.artifactExportRate)}
            </p>
          </div>
          <div className="rounded-lg bg-white/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Trajectory Averages
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Initiative {cohort.averageInitiative ?? '—'} · Follow-through {cohort.averageFollowThrough ?? '—'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Recovery {cohort.averageRecoveryAfterFriction ?? '—'}
            </p>
          </div>
          <div className="rounded-lg bg-white/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Friction
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {cohort.stalledUserCount} learner{cohort.stalledUserCount === 1 ? '' : 's'} currently stalled
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* NARRATIVE BRIDGE: Gaps → Action */}
      {user.skillGaps && user.skillGaps.length > 0 && user.careerMatches && user.careerMatches.length > 0 && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 sm:p-6 rounded-r">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {adminViewMode === 'family' ? (
              <>Ready to bridge those gaps? Here are concrete next steps with Birmingham resources.</>
            ) : (
              <>Development pathways with evidence-based interventions and regional partnership resources.</>
            )}
          </p>
        </div>
      )}

      <NowcastingActionPlanSection userId={userId} adminViewMode={adminViewMode} />

      <Card className="border-slate-200 bg-slate-50/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Shield className="h-5 w-5 text-slate-700" />
            Guidance Rollout Summary
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {adminViewMode === 'family'
              ? 'A live operator view of the adaptive-guidance rollout, with holdout coverage and cohort-level outcomes.'
              : 'Rollout mode, adaptive share, and cohort-level recommendation outcomes across the current guidance window.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {guidanceSummaryLoading ? (
            <div className="flex items-center gap-3 rounded-lg bg-white/70 p-4 text-sm text-gray-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading rollout summary…</span>
            </div>
          ) : guidanceSummaryError ? (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{guidanceSummaryError}</span>
            </div>
          ) : guidanceSummary ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={guidanceSummary.rollout.isKillSwitchActive ? 'destructive' : 'secondary'}>
                  {guidanceSummary.rollout.isKillSwitchActive
                    ? 'Kill Switch Active'
                    : guidanceSummary.rollout.mode === 'adaptive_only'
                      ? 'Adaptive Forced'
                      : 'Experiment Live'}
                </Badge>
                <Badge variant="outline">
                  <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
                  {guidanceSummary.rollout.adaptivePercentage}% adaptive share
                </Badge>
                <Badge variant="outline">
                  <Users2 className="mr-1 h-3.5 w-3.5" />
                  {guidanceSummary.totals.usersWithGuidance} learners in summary
                </Badge>
                <Badge variant="outline">
                  <BarChart3 className="mr-1 h-3.5 w-3.5" />
                  {guidanceSummary.days}-day window
                </Badge>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
                <p className="text-sm leading-relaxed text-slate-700">
                  {guidanceSummary.rollout.isKillSwitchActive
                    ? 'Adaptive guidance is currently forced to control for all learners. Passive measurement stays on, but the next-move overlay is suppressed.'
                    : guidanceSummary.rollout.mode === 'adaptive_only'
                      ? 'Adaptive guidance is forced on for all learners. Use this only for tightly scoped internal validation.'
                      : `New sticky assignments are currently split ${guidanceSummary.rollout.controlPercentage}% control / ${guidanceSummary.rollout.adaptivePercentage}% adaptive.`}
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {renderCohortCard(controlCohort, 'Control Holdout', 'control')}
                {renderCohortCard(adaptiveCohort, 'Adaptive Cohort', 'adaptive')}
              </div>

              {guidanceSummary.metadata.truncated && (
                <p className="text-xs text-slate-500">
                  Summary hit the current scan cap ({guidanceSummary.metadata.planRowsScanned} plan rows / {guidanceSummary.metadata.eventRowsScanned} events). Increase the route limit only if you need a broader cohort readout.
                </p>
              )}
            </>
          ) : (
            <div className="rounded-lg bg-white/70 p-4 text-sm text-gray-600">
              Cohort summary will appear once guidance records exist in the current window.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Route className="w-5 h-5 text-amber-700" />
            Adaptive Guidance Diagnostics
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {adminViewMode === 'family'
              ? 'A bounded view of the next-move layer, with holdout safety and one-step explanations.'
              : 'Control/adaptive recommendation diagnostics with guidance telemetry and stalled-task signals.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {guidanceLoading ? (
            <div className="flex items-center gap-3 rounded-lg bg-white/70 p-4 text-sm text-gray-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading adaptive guidance diagnostics…</span>
            </div>
          ) : guidanceError ? (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{guidanceError}</span>
            </div>
          ) : guidance ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={guidance.experimentVariant === 'adaptive' ? 'default' : 'secondary'}>
                  {guidance.experimentVariant === 'adaptive' ? 'Adaptive Cohort' : 'Control Holdout'}
                </Badge>
                <Badge variant="outline">{guidance.eventCounts.recommendationShown} shown</Badge>
                <Badge variant="outline">{guidance.eventCounts.recommendationClicked} clicked</Badge>
                <Badge variant="outline">{guidance.eventCounts.recommendationDismissed} dismissed</Badge>
                <Badge variant="outline">{guidance.eventCounts.taskCompleted} completed</Badge>
              </div>

              <div className="rounded-xl border border-amber-200 bg-white/80 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Current Recommendation
                </p>
                {guidance.currentRecommendation ? (
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-slate-900">
                      {guidance.currentRecommendation.title}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {guidance.currentRecommendation.reason}
                    </p>
                    <p className="text-xs text-slate-500">
                      Surface: {guidance.currentRecommendation.surface} · Reachable tasks: {guidance.reachableTaskCount}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-600">
                    {guidance.experimentVariant === 'control'
                      ? 'This learner is in the static holdout path. Guidance telemetry is still collected, but no adaptive next move is surfaced.'
                      : 'No active recommendation is pinned right now.'}
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Recommendation CTR
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <MousePointerClick className="h-4 w-4 text-blue-600" />
                    <p className="text-2xl font-semibold text-slate-900">
                      {guidance.eventCounts.recommendationShown > 0
                        ? `${Math.round((guidance.eventCounts.recommendationClicked / guidance.eventCounts.recommendationShown) * 100)}%`
                        : '0%'}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Shadow Portfolio Exports
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {guidance.eventCounts.artifactExported}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {guidance.shadowArtifactCount} artifact candidates currently visible
                  </p>
                </div>
                <div className="rounded-lg bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Friction Flags
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {guidance.frictionFlags.length}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {guidance.stalledTasks.length} stalled task{guidance.stalledTasks.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              {guidance.stalledTasks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">Recovery Watchlist</p>
                  <div className="space-y-2">
                    {guidance.stalledTasks.slice(0, 3).map((task) => (
                      <div key={task.taskId} className="rounded-lg border border-red-100 bg-white/80 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-slate-900">{task.title}</p>
                          <Badge variant="outline">
                            {task.attemptCount} attempt{task.attemptCount === 1 ? '' : 's'}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          State: {task.highestProgressState.replace('_', ' ')} · Last touched {new Date(task.lastTouchedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg bg-white/70 p-4 text-sm text-gray-600">
              Guidance diagnostics will appear once this learner has a stored guidance record.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Briefcase className="w-5 h-5" />
            Your Action Plan
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">Concrete next steps for your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Conversation starters */}
          <div>
            <p className="font-medium text-sm sm:text-base mb-3">Questions to Consider:</p>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="leading-relaxed">"I showed strong emotional intelligence and problem-solving skills.
                Have I thought about healthcare technology roles that use both?"</p>
              </div>
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="leading-relaxed">
                  {adminViewMode === 'family'
                    ? `"My critical thinking is strong (${Math.max(0, Math.min(100, 82))}%) but collaboration is still growing (${Math.max(0, Math.min(100, 58))}%). Would I be interested in experiences that build team skills?"`
                    : `"Critical thinking advanced (${Math.max(0, Math.min(100, 82))}% proficiency) vs collaboration developing (${Math.max(0, Math.min(100, 58))}% proficiency). Consider team-based skill development opportunities."`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Show action plan only if user has data */}
          {user.skillGaps && user.skillGaps.length > 0 && (
            <>

          {/* Immediate actions */}
          <div>
            <p className="font-medium text-sm sm:text-base mb-3">This Week - Your Actions:</p>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  {adminViewMode === 'family'
                    ? `Schedule UAB Health Informatics tour (${Math.max(0, Math.min(100, 87))}% match - you're nearly ready)`
                    : `Schedule UAB Health Informatics tour (${Math.max(0, Math.min(100, 87))}% career match score, near_ready status)`
                  }
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  {adminViewMode === 'family'
                    ? `Explore digital literacy development options (need ${Math.max(0, Math.min(100, 12))}% more to reach target)`
                    : `Explore digital literacy development options (${Math.max(0, Math.min(100, 12))}% proficiency gap vs career requirements)`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Next month */}
          <div>
            <p className="font-medium text-sm sm:text-base mb-3">Next Month - Your Goals:</p>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">Connect with UAB Hospital or Children's Hospital for shadowing</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">Explore group projects or team activities (your collaboration skill gap)</p>
              </div>
            </div>
          </div>

          {/* What to avoid */}
          <div className="border-t pt-4">
            <p className="font-medium text-sm sm:text-base mb-3 text-red-600">Be Mindful Of:</p>
            <div className="space-y-2 text-sm sm:text-base text-muted-foreground">
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="leading-relaxed">• Rushing into immediate career commitment (you're still exploring)</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="leading-relaxed">• Ignoring skill gaps (your collaboration needs work for Community Health path)</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="leading-relaxed">
                  {adminViewMode === 'family'
                    ? `• Overlooking time management needs (${Math.max(0, Math.min(100, 42))}% - may struggle with structured programs)`
                    : `• Overlooking time management weakness (${Math.max(0, Math.min(100, 42))}% proficiency - risk factor for structured programs)`
                  }
                </p>
              </div>
            </div>
          </div>
            </>
          )}

          {/* Show empty state if no skill gaps */}
          {(!user.skillGaps || user.skillGaps.length === 0) && (
            <div className="text-center py-12">
              {adminViewMode === 'family' ? (
                <div className="space-y-3">
                  <p className="text-2xl">👍</p>
                  <p className="text-lg font-medium text-gray-700">
                    All set!
                  </p>
                  <p className="text-sm text-gray-600">
                    No immediate actions needed. Check back weekly for updates.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    No evidence-based interventions required at this time
                  </p>
                  <p className="text-xs text-gray-600">
                    Scheduled review: weekly cadence.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key insights */}
      <Card className="border-2 border-blue-600">
        <CardHeader>
          <div className="flex items-baseline gap-3 mb-2">
            <CardTitle className="text-lg sm:text-xl">Your Key Insights</CardTitle>
            {user.keySkillMoments && user.keySkillMoments.length > 0 && (
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                {user.keySkillMoments.length}
              </span>
            )}
          </div>
          <CardDescription className="text-sm sm:text-base">
            Breakthrough moments from your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm sm:text-base">
          {user.keySkillMoments && user.keySkillMoments.length > 0 ? (
            <>
              {user.keySkillMoments.slice(0, 5).map((moment: KeySkillMoment, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 text-lg font-bold">#{idx + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium leading-relaxed">"{moment.choice || 'Your choice'}"</p>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">{moment.insight || 'Key insight from your journey'}</p>
                    {moment.skillsDemonstrated && moment.skillsDemonstrated.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {moment.skillsDemonstrated.slice(0, 3).map((skill: string, sidx: number) => (
                          <Badge key={sidx} variant="secondary" className="text-xs">
                            {skill.replace(/([A-Z])/g, ' $1').trim()}
                          </Badge>
                        ))}
                        {moment.skillsDemonstrated.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{moment.skillsDemonstrated.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {user.keySkillMoments.length > 5 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    + {user.keySkillMoments.length - 5} more insights
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              {adminViewMode === 'family' ? (
                <div className="space-y-3">
                  <p className="text-2xl">💡</p>
                  <p className="text-lg font-medium text-gray-700">
                    Key insights coming soon!
                  </p>
                  <p className="text-sm text-gray-600">
                    Your most meaningful moments will appear here as you explore different story paths.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Insight extraction pending
                  </p>
                  <p className="text-xs text-gray-600">
                    Key skill moments identified through narrative choice analysis will populate after threshold interactions.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* NARRATIVE BRIDGE: Action → Evidence */}
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 sm:p-6 rounded-r mt-6">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {adminViewMode === 'family' ? (
            <>Want to see the data behind these recommendations? Evidence tab shows the research.</>
          ) : (
            <>Supporting frameworks and research-backed evidence for above recommendations.</>
          )}
        </p>
      </div>
    </div>
  )
}
