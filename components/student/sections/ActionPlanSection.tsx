'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ClipboardCopy, Loader2, Save, Shield, Sparkles, Target, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ensureUserApiSession } from '@/lib/user-api-session'
import type { Posture } from '@/lib/labor-market/signals'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import {
  trackStudentInsightsAssistModeSelected,
  trackStudentInsightsActionPlanCompleted,
  trackStudentInsightsActionPlanExposed,
  trackStudentInsightsActionPlanStarted,
  trackStudentInsightsArtifactExported,
} from '@/lib/telemetry/student-insights-events'

interface ActionPlanSectionProps {
  userId: string
  sessionId: string
  profile: SkillProfile
  posture?: Posture
  onPostureChange?: (next: Posture) => void
}

type ProofArtifactKind = 'resume_bullets' | 'one_pager' | 'interview_stories'

interface ActionPlanDraft {
  posture: Posture
  thisWeekFocus: string
  nextMonthGoal: string
  supportNeeded: string
  notes: string
  marketMove: string
  skillMove: string
  adjacentRoute: string
  proofKind: ProofArtifactKind
  proofText: string
}

function asPlanRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function readPosture(value: unknown): Posture | null {
  if (value === 'defend' || value === 'balance' || value === 'attack') return value
  return null
}

function readProofKind(value: unknown): ProofArtifactKind | null {
  if (value === 'resume_bullets' || value === 'one_pager' || value === 'interview_stories') return value
  return null
}

function postureLabel(posture: Posture): string {
  switch (posture) {
    case 'defend':
      return 'Defend'
    case 'balance':
      return 'Balance'
    case 'attack':
      return 'Attack'
    default: {
      const exhaustive: never = posture
      return exhaustive
    }
  }
}

function proofKindLabel(kind: ProofArtifactKind): string {
  switch (kind) {
    case 'resume_bullets':
      return 'Resume Bullets'
    case 'one_pager':
      return 'Portfolio One-Pager'
    case 'interview_stories':
      return 'Interview Stories'
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

function buildProofArtifact(options: {
  profile: SkillProfile
  posture: Posture
  proofKind: ProofArtifactKind
}): string {
  const topCareer = options.profile.careerMatches[0]
  const topGap = options.profile.skillGaps[0]
  const moments = options.profile.keySkillMoments.slice(0, 2)

  if (options.proofKind === 'resume_bullets') {
    const lines: string[] = []
    if (topCareer) {
      lines.push(`Target lane: ${topCareer.name}`)
    }
    moments.forEach((moment) => {
      const skills = moment.skillsDemonstrated.length ? moment.skillsDemonstrated.join(', ') : 'core skills'
      lines.push(`- Demonstrated ${skills} in scenario-based simulations by: ${moment.insight}`)
    })
    if (topGap) {
      lines.push(`- Building ${topGap.skill} next: ${topGap.developmentPath}`)
    }
    if (options.posture === 'attack') {
      lines.push('- Using AI tools to speed up drafts, then verifying output quality before sharing.')
    } else if (options.posture === 'defend') {
      lines.push('- Focusing on durable skills (judgment, communication, follow-through) and adjacent on-ramps.')
    } else {
      lines.push('- Building proof and options in parallel while staying open to adjacent routes.')
    }
    return lines.join('\n')
  }

  if (options.proofKind === 'one_pager') {
    const header = topCareer ? `Portfolio One-Pager: ${topCareer.name}` : 'Portfolio One-Pager'
    const strengths = moments.length
      ? moments.map((moment) => `- ${moment.insight}`).join('\n')
      : '- (Add 1-2 moments of proof from your route.)'
    const nextStep = topGap ? `- Close the ${topGap.skill} gap: ${topGap.developmentPath}` : '- Pick one gap to close next.'

    return [
      header,
      '',
      'What I can prove today:',
      strengths,
      '',
      'What I am building next (90 days):',
      nextStep,
      '',
      'How I work with AI:',
      options.posture === 'attack'
        ? '- I use AI to accelerate drafts and analysis, then validate outputs and ship finished work.'
        : options.posture === 'defend'
          ? '- I use AI for support, but I prioritize judgment, verification, and human context.'
          : '- I use AI selectively while I build proof and options in parallel.',
    ].join('\n')
  }

  const prompts: string[] = []
  prompts.push('Interview Story Bank (use STAR: Situation, Task, Action, Result)')
  moments.forEach((moment) => {
    prompts.push('')
    prompts.push(`Story prompt (${moment.skillsDemonstrated.join(', ') || 'skills'}):`)
    prompts.push(`- Situation: (What was happening?)`)
    prompts.push(`- Task: (What did you need to do?)`)
    prompts.push(`- Action: ${moment.insight}`)
    prompts.push(`- Result: (What changed? What did you learn?)`)
  })
  if (topGap) {
    prompts.push('')
    prompts.push(`Growth story to prepare: How you are building ${topGap.skill} next.`)
  }

  return prompts.join('\n')
}

function extractDraft(plan: Record<string, unknown> | null): ActionPlanDraft {
  const posture = readPosture(plan?.posture) ?? 'balance'
  return {
    posture,
    thisWeekFocus: readString(plan?.thisWeekFocus),
    nextMonthGoal: readString(plan?.nextMonthGoal),
    supportNeeded: readString(plan?.supportNeeded),
    notes: readString(plan?.notes),
    marketMove: readString(plan?.marketMove),
    skillMove: readString(plan?.skillMove),
    adjacentRoute: readString(plan?.adjacentRoute),
    proofKind: readProofKind(plan?.proofKind) ?? 'resume_bullets',
    proofText: readString(plan?.proofText),
  }
}

export function ActionPlanSection({
  userId,
  sessionId,
  profile,
  posture: postureProp,
  onPostureChange,
}: ActionPlanSectionProps) {
  const [rawPlan, setRawPlan] = useState<Record<string, unknown> | null>(null)
  const [draft, setDraft] = useState<ActionPlanDraft>({
    posture: postureProp ?? 'balance',
    thisWeekFocus: '',
    nextMonthGoal: '',
    supportNeeded: '',
    notes: '',
    marketMove: '',
    skillMove: '',
    adjacentRoute: '',
    proofKind: 'resume_bullets',
    proofText: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const exposedTrackedRef = useRef(false)

  const suggestedDraft = useMemo<ActionPlanDraft>(() => {
    const topCareer = profile.careerMatches[0]
    const topGap = profile.skillGaps[0]
    const recentMoment = profile.keySkillMoments[0]
    const posture = postureProp ?? draft.posture

    const baseThisWeekFocus = topCareer
      ? `Take one concrete step toward ${topCareer.name}, such as reviewing a local opportunity or asking for an introduction.`
      : 'Return to the station and complete one route that gives you fresh evidence.'
    const baseSupportNeeded = topCareer
      ? `I want help finding Birmingham-based options connected to ${topCareer.name}.`
      : 'I want help narrowing which route is most worth pursuing next.'

    const marketMove = topCareer?.localOpportunities?.[0]
      ? `Reach out about ${topCareer.localOpportunities[0]} or find one similar option and schedule a first conversation.`
      : 'Make a short target list (3 roles, 3 organizations) and take one outreach step.'

    const skillMove = topGap
      ? topGap.developmentPath
      : 'Pick one skill you want to grow and find one practice loop you can repeat weekly.'

    const adjacentRoute = topCareer
      ? `One adjacent on-ramp: a role adjacent to ${topCareer.name} that builds similar skills (e.g., coordinator, assistant, apprentice).`
      : 'One adjacent on-ramp: a related role that lets you build proof while you explore.'

    const proofKind: ProofArtifactKind = 'resume_bullets'

    const nextMonthGoal = topGap
      ? `Build ${topGap.skill} through one team, project, or volunteer experience that you can point to later.`
      : 'Collect enough new route evidence to turn one interest into a clearer next step.'

    return {
      posture,
      thisWeekFocus:
        posture === 'attack'
          ? `${baseThisWeekFocus} Also draft one proof artifact you could send to a mentor for feedback.`
          : baseThisWeekFocus,
      nextMonthGoal:
        posture === 'defend'
          ? `${nextMonthGoal} Keep one adjacent on-ramp open as a backup route.`
          : nextMonthGoal,
      supportNeeded: baseSupportNeeded,
      notes: recentMoment
        ? `Recent proof worth keeping: ${recentMoment.insight}`
        : 'Keep track of the moments that felt most natural or energizing.',
      marketMove,
      skillMove,
      adjacentRoute,
      proofKind,
      proofText: buildProofArtifact({
        profile,
        posture,
        proofKind,
      }),
    }
  }, [draft.posture, postureProp, profile])

  useEffect(() => {
    let cancelled = false

    const loadPlan = async () => {
      setLoading(true)
      setError(null)

      const sessionReady = await ensureUserApiSession(userId)
      if (!sessionReady) {
        if (!cancelled) {
          setError('Action plan sync is unavailable right now. Your journey data is still safe on this device.')
          setLoading(false)
        }
        return
      }

      try {
        const response = await fetch(`/api/user/action-plan?userId=${encodeURIComponent(userId)}`, {
          credentials: 'include',
        })
        const body = await response.json()

        if (!response.ok) {
          throw new Error(typeof body?.error === 'string' ? body.error : 'Unable to load action plan.')
        }

        if (cancelled) return

        const nextPlan = asPlanRecord(body.plan)
        const loadedPosture = readPosture(nextPlan?.posture)
        setRawPlan(nextPlan)
        setDraft(extractDraft(nextPlan))
        setSavedAt(readString(nextPlan?.updatedAt) || null)

        if (loadedPosture && onPostureChange) {
          onPostureChange(loadedPosture)
        }
      } catch (loadError) {
        if (cancelled) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load action plan.')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPlan()

    return () => {
      cancelled = true
    }
  }, [onPostureChange, userId])

  useEffect(() => {
    if (!postureProp) return
    setDraft((current) => {
      if (current.posture === postureProp) return current

      const currentGenerated = buildProofArtifact({
        profile,
        posture: current.posture,
        proofKind: current.proofKind,
      })
      const nextGenerated = buildProofArtifact({
        profile,
        posture: postureProp,
        proofKind: current.proofKind,
      })
      const shouldReplace = !current.proofText || current.proofText === currentGenerated
      return {
        ...current,
        posture: postureProp,
        proofText: shouldReplace ? nextGenerated : current.proofText,
      }
    })
  }, [postureProp, profile])

  useEffect(() => {
    if (loading || exposedTrackedRef.current) return

    trackStudentInsightsActionPlanExposed({
      userId,
      sessionId,
      targetCareerId: profile.careerMatches[0]?.id ?? null,
      posture: draft.posture,
    })
    exposedTrackedRef.current = true
  }, [draft.posture, loading, profile, sessionId, userId])

  const hasSavedPlan =
    Boolean(draft.thisWeekFocus) ||
    Boolean(draft.nextMonthGoal) ||
    Boolean(draft.supportNeeded) ||
    Boolean(draft.notes) ||
    Boolean(draft.marketMove) ||
    Boolean(draft.skillMove) ||
    Boolean(draft.adjacentRoute) ||
    Boolean(draft.proofText)

  const updateField = <K extends keyof ActionPlanDraft>(field: K, value: ActionPlanDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  const applySuggestedDraft = () => {
    setDraft(suggestedDraft)
    trackStudentInsightsAssistModeSelected({
      userId,
      sessionId,
      posture: suggestedDraft.posture,
      proofKind: suggestedDraft.proofKind,
      assistMode: 'augmented',
    })
    trackStudentInsightsActionPlanStarted({
      userId,
      sessionId,
      posture: suggestedDraft.posture,
      proofKind: suggestedDraft.proofKind,
      action: 'use_suggested_draft',
    })
  }

  const setPosture = (next: Posture) => {
    setDraft((current) => {
      const currentGenerated = buildProofArtifact({
        profile,
        posture: current.posture,
        proofKind: current.proofKind,
      })
      const nextGenerated = buildProofArtifact({
        profile,
        posture: next,
        proofKind: current.proofKind,
      })
      const shouldReplace = !current.proofText || current.proofText === currentGenerated
      return {
        ...current,
        posture: next,
        proofText: shouldReplace ? nextGenerated : current.proofText,
      }
    })
    onPostureChange?.(next)
  }

  const regenerateProof = () => {
    const proofText = buildProofArtifact({
      profile,
      posture: draft.posture,
      proofKind: draft.proofKind,
    })
    setDraft((current) => ({ ...current, proofText }))
  }

  const handleCopyProof = async () => {
    try {
      await navigator.clipboard.writeText(draft.proofText)
      trackStudentInsightsArtifactExported({
        userId,
        sessionId,
        posture: draft.posture,
        proofKind: draft.proofKind,
      })
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setError('Copy failed. Try selecting the text and copying manually.')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const nextPlan = {
        ...(rawPlan ?? {}),
        version: 1,
        updatedAt: new Date().toISOString(),
        ...draft,
      }

      const response = await fetch('/api/user/action-plan', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          plan: nextPlan,
        }),
      })
      const body = await response.json()

      if (!response.ok) {
        throw new Error(typeof body?.error === 'string' ? body.error : 'Unable to save action plan.')
      }

      const persistedPlan = asPlanRecord(body.plan) ?? nextPlan
      setRawPlan(persistedPlan)
      setDraft(extractDraft(persistedPlan))
      setSavedAt(readString(persistedPlan.updatedAt) || nextPlan.updatedAt)
      trackStudentInsightsActionPlanCompleted({
        userId,
        sessionId,
        posture: draft.posture,
        proofKind: draft.proofKind,
        completedFieldCount: [
          draft.thisWeekFocus,
          draft.nextMonthGoal,
          draft.supportNeeded,
          draft.notes,
          draft.marketMove,
          draft.skillMove,
          draft.adjacentRoute,
          draft.proofText,
        ].filter((value) => value.trim().length > 0).length,
        hasProofText: draft.proofText.trim().length > 0,
      })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save action plan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card
      id="action-plan"
      className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md"
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-xl">Action Plan</CardTitle>
            </div>
            <CardDescription>
              Turn your route into a short plan you can revisit and update.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={applySuggestedDraft}
              className="gap-2 border-emerald-200 bg-white/80"
            >
              <Sparkles className="h-4 w-4" />
              Use Suggested Draft
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading ? (
          <div className="flex items-center gap-3 rounded-xl bg-white/70 p-4 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading saved plan…</span>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-emerald-200 bg-white/70 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Your Posture
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Pick a strategy. This is not permanent, and you can change it anytime.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={draft.posture === 'defend' ? 'default' : 'outline'}
                  onClick={() => setPosture('defend')}
                  className={draft.posture === 'defend' ? 'gap-2' : 'gap-2 bg-white/80'}
                >
                  <Shield className="h-4 w-4" />
                  {postureLabel('defend')}
                </Button>
                <Button
                  type="button"
                  variant={draft.posture === 'balance' ? 'default' : 'outline'}
                  onClick={() => setPosture('balance')}
                  className={draft.posture === 'balance' ? 'gap-2' : 'gap-2 bg-white/80'}
                >
                  <Target className="h-4 w-4" />
                  {postureLabel('balance')}
                </Button>
                <Button
                  type="button"
                  variant={draft.posture === 'attack' ? 'default' : 'outline'}
                  onClick={() => setPosture('attack')}
                  className={draft.posture === 'attack' ? 'gap-2' : 'gap-2 bg-white/80'}
                >
                  <Zap className="h-4 w-4" />
                  {postureLabel('attack')}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">This Week</span>
                <textarea
                  value={draft.thisWeekFocus}
                  onChange={(event) => updateField('thisWeekFocus', event.target.value)}
                  placeholder={suggestedDraft.thisWeekFocus}
                  className="min-h-[120px] w-full rounded-xl border border-emerald-200 bg-white/90 p-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Next Month</span>
                <textarea
                  value={draft.nextMonthGoal}
                  onChange={(event) => updateField('nextMonthGoal', event.target.value)}
                  placeholder={suggestedDraft.nextMonthGoal}
                  className="min-h-[120px] w-full rounded-xl border border-emerald-200 bg-white/90 p-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Support I Need</span>
                <textarea
                  value={draft.supportNeeded}
                  onChange={(event) => updateField('supportNeeded', event.target.value)}
                  placeholder={suggestedDraft.supportNeeded}
                  className="min-h-[110px] w-full rounded-xl border border-emerald-200 bg-white/90 p-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Notes</span>
                <textarea
                  value={draft.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                  placeholder={suggestedDraft.notes}
                  className="min-h-[110px] w-full rounded-xl border border-emerald-200 bg-white/90 p-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white/70 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                90-Day Moves
              </p>
              <p className="mt-2 text-sm text-slate-600">
                One market move, one skill move, and one adjacent on-ramp you can keep open.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-medium">Market Move</span>
                  <textarea
                    value={draft.marketMove}
                    onChange={(event) => updateField('marketMove', event.target.value)}
                    placeholder={suggestedDraft.marketMove}
                    className="min-h-[110px] w-full rounded-xl border border-emerald-200 bg-white/90 p-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-medium">Skill Move</span>
                  <textarea
                    value={draft.skillMove}
                    onChange={(event) => updateField('skillMove', event.target.value)}
                    placeholder={suggestedDraft.skillMove}
                    className="min-h-[110px] w-full rounded-xl border border-emerald-200 bg-white/90 p-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-medium">Adjacent Route</span>
                  <textarea
                    value={draft.adjacentRoute}
                    onChange={(event) => updateField('adjacentRoute', event.target.value)}
                    placeholder={suggestedDraft.adjacentRoute}
                    className="min-h-[110px] w-full rounded-xl border border-emerald-200 bg-white/90 p-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white/70 p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Proof Artifact
                  </p>
                  <p className="text-sm text-slate-600">
                    Turn your route into something you can share with a mentor, counselor, or employer.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button type="button" variant="outline" onClick={regenerateProof} className="gap-2 bg-white/80">
                    <Sparkles className="h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyProof}
                    disabled={!draft.proofText}
                    className="gap-2 bg-white/80"
                  >
                    <ClipboardCopy className="h-4 w-4" />
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-1">
                  <p className="text-sm font-medium text-slate-700">Format</p>
                  <Select
                    value={draft.proofKind}
                    onValueChange={(value) => {
                      const nextKind = readProofKind(value) ?? 'resume_bullets'
                      setDraft((current) => {
                        if (current.proofKind === nextKind) return current

                        const currentGenerated = buildProofArtifact({
                          profile,
                          posture: current.posture,
                          proofKind: current.proofKind,
                        })
                        const nextGenerated = buildProofArtifact({
                          profile,
                          posture: current.posture,
                          proofKind: nextKind,
                        })
                        const shouldReplace = !current.proofText || current.proofText === currentGenerated
                        return {
                          ...current,
                          proofKind: nextKind,
                          proofText: shouldReplace ? nextGenerated : current.proofText,
                        }
                      })
                    }}
                  >
                    <SelectTrigger className="border-emerald-200 bg-white/90">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resume_bullets">{proofKindLabel('resume_bullets')}</SelectItem>
                      <SelectItem value="one_pager">{proofKindLabel('one_pager')}</SelectItem>
                      <SelectItem value="interview_stories">{proofKindLabel('interview_stories')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Save the plan after changing format to persist the artifact.
                  </p>
                </div>

                <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                  <span className="font-medium">Draft</span>
                  <textarea
                    value={draft.proofText}
                    onChange={(event) => updateField('proofText', event.target.value)}
                    placeholder={suggestedDraft.proofText}
                    className="min-h-[180px] w-full rounded-xl border border-emerald-200 bg-white/90 p-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                {savedAt ? (
                  <span>Last saved {new Date(savedAt).toLocaleString()}</span>
                ) : hasSavedPlan ? (
                  <span>Save this draft to keep it alongside your guidance state.</span>
                ) : (
                  <span>Nothing saved yet. Use the suggested draft or write your own next steps.</span>
                )}
              </div>

              <Button type="button" onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Plan
              </Button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
