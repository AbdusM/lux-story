'use client'

import { useEffect, useMemo, useState } from 'react'
import { ClipboardCopy, Loader2, NotebookPen } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Posture = 'defend' | 'balance' | 'attack'
type ProofArtifactKind = 'resume_bullets' | 'one_pager' | 'interview_stories'

type AdminActionPlanResponse =
  | { success: true; userId: string; plan: unknown }
  | { error: string }

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
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
      return 'Resume bullets'
    case 'one_pager':
      return 'Portfolio one-pager'
    case 'interview_stories':
      return 'Interview stories'
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

export function NowcastingActionPlanSection(props: {
  userId: string
  adminViewMode: 'family' | 'research'
}) {
  const { userId, adminViewMode } = props
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<Record<string, unknown> | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/admin/action-plan?userId=${encodeURIComponent(userId)}`, {
          credentials: 'include',
        })
        const body = (await response.json()) as AdminActionPlanResponse

        if (!response.ok) {
          throw new Error('error' in body && typeof body.error === 'string' ? body.error : 'Unable to load action plan')
        }

        if (cancelled) return
        setPlan(isPlainObject('plan' in body ? body.plan : null) ? (body as { plan: Record<string, unknown> }).plan : null)
      } catch (loadError) {
        if (cancelled) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load action plan')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [userId])

  const draft = useMemo(() => {
    const posture = readPosture(plan?.posture) ?? null
    const proofKind = readProofKind(plan?.proofKind) ?? null
    const updatedAt = readString(plan?.updatedAt)

    return {
      posture,
      updatedAt,
      thisWeekFocus: readString(plan?.thisWeekFocus),
      nextMonthGoal: readString(plan?.nextMonthGoal),
      marketMove: readString(plan?.marketMove),
      skillMove: readString(plan?.skillMove),
      adjacentRoute: readString(plan?.adjacentRoute),
      supportNeeded: readString(plan?.supportNeeded),
      notes: readString(plan?.notes),
      proofKind,
      proofText: readString(plan?.proofText),
    }
  }, [plan])

  const handleCopyProof = async () => {
    if (!draft.proofText) return

    try {
      await navigator.clipboard.writeText(draft.proofText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setError('Copy failed. Try selecting the text and copying manually.')
    }
  }

  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-teal-50/60">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <NotebookPen className="h-5 w-5 text-emerald-700" />
              Learner Action Plan
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {adminViewMode === 'family'
                ? 'What the learner saved as their next-week and 90-day plan, plus the proof artifact they can export.'
                : 'Stored action plan fields and proof artifact text (lane posture, 90-day moves, export content).'}
            </CardDescription>
          </div>

          {draft.proofText ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyProof}
              className="gap-2 bg-white/80 border-emerald-200"
            >
              <ClipboardCopy className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy Proof'}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-3 rounded-lg bg-white/70 p-4 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading saved plan…</span>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : !plan ? (
          <div className="rounded-lg border border-emerald-200 bg-white/70 p-4 text-sm text-slate-700">
            No saved action plan found for this learner yet.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                Posture: {draft.posture ? postureLabel(draft.posture) : 'Unknown'}
              </Badge>
              <Badge variant="outline">
                Proof: {draft.proofKind ? proofKindLabel(draft.proofKind) : 'Unknown'}
              </Badge>
              {draft.updatedAt ? (
                <Badge variant="outline">Updated: {new Date(draft.updatedAt).toLocaleString()}</Badge>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  This Week
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {draft.thisWeekFocus || '—'}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Next Month
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {draft.nextMonthGoal || '—'}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Market Move
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {draft.marketMove || '—'}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Skill Move
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {draft.skillMove || '—'}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-white/70 p-4 md:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Adjacent Route
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {draft.adjacentRoute || '—'}
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Support Needed
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {draft.supportNeeded || '—'}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {draft.notes || '—'}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Proof Artifact Text
              </p>
              <pre className="mt-2 max-h-[340px] overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-xs text-slate-800">
                {draft.proofText || '—'}
              </pre>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

