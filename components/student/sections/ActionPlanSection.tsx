'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, Save, Sparkles, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ensureUserApiSession } from '@/lib/user-api-session'
import type { SkillProfile } from '@/lib/skill-profile-adapter'

interface ActionPlanSectionProps {
  userId: string
  profile: SkillProfile
}

interface ActionPlanDraft {
  thisWeekFocus: string
  nextMonthGoal: string
  supportNeeded: string
  notes: string
}

function asPlanRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function extractDraft(plan: Record<string, unknown> | null): ActionPlanDraft {
  return {
    thisWeekFocus: readString(plan?.thisWeekFocus),
    nextMonthGoal: readString(plan?.nextMonthGoal),
    supportNeeded: readString(plan?.supportNeeded),
    notes: readString(plan?.notes),
  }
}

export function ActionPlanSection({ userId, profile }: ActionPlanSectionProps) {
  const [rawPlan, setRawPlan] = useState<Record<string, unknown> | null>(null)
  const [draft, setDraft] = useState<ActionPlanDraft>({
    thisWeekFocus: '',
    nextMonthGoal: '',
    supportNeeded: '',
    notes: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const suggestedDraft = useMemo<ActionPlanDraft>(() => {
    const topCareer = profile.careerMatches[0]
    const topGap = profile.skillGaps[0]
    const recentMoment = profile.keySkillMoments[0]

    return {
      thisWeekFocus: topCareer
        ? `Take one concrete step toward ${topCareer.name}, such as reviewing a local opportunity or asking for an introduction.`
        : 'Return to the station and complete one route that gives you fresh evidence.',
      nextMonthGoal: topGap
        ? `Build ${topGap.skill} through one team, project, or volunteer experience that you can point to later.`
        : 'Collect enough new route evidence to turn one interest into a clearer next step.',
      supportNeeded: topCareer
        ? `I want help finding Birmingham-based options connected to ${topCareer.name}.`
        : 'I want help narrowing which route is most worth pursuing next.',
      notes: recentMoment
        ? `Recent proof worth keeping: ${recentMoment.insight}`
        : 'Keep track of the moments that felt most natural or energizing.',
    }
  }, [profile.careerMatches, profile.keySkillMoments, profile.skillGaps])

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
        setRawPlan(nextPlan)
        setDraft(extractDraft(nextPlan))
        setSavedAt(readString(nextPlan?.updatedAt) || null)
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
  }, [userId])

  const hasSavedPlan =
    Boolean(draft.thisWeekFocus) ||
    Boolean(draft.nextMonthGoal) ||
    Boolean(draft.supportNeeded) ||
    Boolean(draft.notes)

  const updateField = (field: keyof ActionPlanDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  const applySuggestedDraft = () => {
    setDraft(suggestedDraft)
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
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save action plan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md">
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
      </CardHeader>
      <CardContent className="space-y-5">
        {loading ? (
          <div className="flex items-center gap-3 rounded-xl bg-white/70 p-4 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading saved plan…</span>
          </div>
        ) : (
          <>
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
