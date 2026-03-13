'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Activity, Shield, Zap, TrendingUp, Info, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Posture, SignalLevel } from '@/lib/labor-market/signals'
import { deriveCareerSignals } from '@/lib/labor-market/signals'
import type { MarketSignalMetadata } from '@/lib/labor-market/market-signal-contract'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import {
  trackStudentInsightsRecommendationClicked,
  trackStudentInsightsRecommendationShown,
} from '@/lib/telemetry/student-insights-events'

interface LaborMarketSignalsSectionProps {
  userId: string
  sessionId: string
  profile: SkillProfile
  posture: Posture
  onPostureChange: (next: Posture) => void
}

function levelLabel(level: SignalLevel): string {
  switch (level) {
    case 'low':
      return 'Low'
    case 'medium':
      return 'Medium'
    case 'high':
      return 'High'
    case 'unknown':
      return 'Unknown'
    default: {
      const exhaustive: never = level
      return exhaustive
    }
  }
}

function levelTone(level: SignalLevel): string {
  switch (level) {
    case 'low':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'medium':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'high':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'unknown':
      return 'bg-slate-50 text-slate-600 border-slate-200'
    default: {
      const exhaustive: never = level
      return exhaustive
    }
  }
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

function postureDescription(posture: Posture): string {
  switch (posture) {
    case 'defend':
      return 'Reduce downside: build resilient skills and consider adjacent on-ramps.'
    case 'balance':
      return 'Stay flexible: keep your target lane, but build proof and options in parallel.'
    case 'attack':
      return 'Lean in: differentiate quickly and build AI-native proof artifacts.'
    default: {
      const exhaustive: never = posture
      return exhaustive
    }
  }
}

function postureIcon(posture: Posture) {
  switch (posture) {
    case 'defend':
      return <Shield className="h-4 w-4" />
    case 'balance':
      return <Activity className="h-4 w-4" />
    case 'attack':
      return <Zap className="h-4 w-4" />
    default: {
      const exhaustive: never = posture
      return exhaustive
    }
  }
}

function matchTypeLabel(matchType?: string): string {
  switch (matchType) {
    case 'canonical':
      return 'Canonical lane'
    case 'alias':
      return 'Alias match'
    case 'fallback':
      return 'Fallback'
    default:
      return 'Unknown'
  }
}

function renderSignalMetadata(
  updatedAtIso: string,
  source: string,
  coverage: string,
  version: string,
  matchType?: string,
) {
  return (
    <div className="mt-2 space-y-1 text-xs text-slate-500">
      <p>Match: {matchTypeLabel(matchType)}</p>
      <p>Source: {source}</p>
      <p>Coverage: {coverage}</p>
      <p>Updated: {new Date(updatedAtIso).toLocaleDateString()}</p>
      <p>Version: {version}</p>
    </div>
  )
}

function NowcastingTrustContractDialog(props: {
  observedExposure: MarketSignalMetadata
  entryFriction: MarketSignalMetadata
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="gap-2 bg-white/80">
          <Info className="h-4 w-4" />
          How to Read
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>How to Interpret These Signals</DialogTitle>
          <DialogDescription>
            A trust contract for nowcasting: what we do, what we do not claim, and how to use this safely.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 text-sm text-slate-700">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Trust contract</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>We do not predict individual job loss or replacement timelines.</li>
                <li>We stay explicit about uncertainty and will show “Unknown” instead of inventing a score.</li>
                <li>We optimize for actions you can take in the next 90 days: posture, proof, and adjacent routes.</li>
                <li>You can override guidance if it does not match your reality.</li>
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Observed Exposure</p>
                <p className="mt-1 text-sm text-slate-600">
                  A lane-level signal about whether AI is already showing up in related tasks (observed adoption), not a claim that AI can do the whole job.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Entry Friction</p>
                <p className="mt-1 text-sm text-slate-600">
                  A lane-level signal about first-job gating and early-career barriers. High friction means you may need stronger proof or an adjacent on-ramp.
                </p>
              </div>
            </div>

            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                Observed Exposure: data + methodology
              </summary>
              <p className="mt-2 text-sm text-slate-600">{props.observedExposure.summary}</p>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>Source: {props.observedExposure.source}</p>
                <p>Updated: {new Date(props.observedExposure.updatedAtIso).toLocaleString()}</p>
                <p>Version: {props.observedExposure.version}</p>
                <p>Coverage: {props.observedExposure.coverage}</p>
                <p>Methodology: {props.observedExposure.methodology}</p>
              </div>
            </details>

            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                Entry Friction: data + methodology
              </summary>
              <p className="mt-2 text-sm text-slate-600">{props.entryFriction.summary}</p>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>Source: {props.entryFriction.source}</p>
                <p>Updated: {new Date(props.entryFriction.updatedAtIso).toLocaleString()}</p>
                <p>Version: {props.entryFriction.version}</p>
                <p>Coverage: {props.entryFriction.coverage}</p>
                <p>Methodology: {props.entryFriction.methodology}</p>
              </div>
            </details>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              If this content increases anxiety: pause. The product is designed to help you choose a posture and build proof, not to doomscroll your future.
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function LaborMarketSignalsSection({
  userId,
  sessionId,
  profile,
  posture,
  onPostureChange,
}: LaborMarketSignalsSectionProps) {
  const topCareer = profile.careerMatches[0] ?? null
  const exposureTrackedRef = useRef(false)

  const signals = useMemo(() => {
    if (!topCareer) return null
    return deriveCareerSignals({ career: topCareer, profile })
  }, [profile, topCareer])

  useEffect(() => {
    if (!topCareer || !signals || exposureTrackedRef.current) return

    trackStudentInsightsRecommendationShown({
      userId,
      sessionId,
      recommendationVersion: `${signals.provenance.observedExposure.version}|${signals.provenance.entryFriction.version}`,
      targetCareerId: topCareer.id,
      targetCareerName: topCareer.name,
      recommendedPosture: signals.recommendedPosture,
      observedExposureLevel: signals.observedExposure.level,
      entryFrictionLevel: signals.entryFriction.level,
    })
    exposureTrackedRef.current = true
  }, [sessionId, signals, topCareer, userId])

  if (!topCareer || !signals) {
    return (
      <Card className="border-2 border-slate-200 bg-white/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-slate-500" />
            <CardTitle className="text-xl">Signals & Strategy</CardTitle>
          </div>
          <CardDescription>
            Add a career path to unlock signals and a 90-day plan.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const scrollToPlan = () => {
    trackStudentInsightsRecommendationClicked({
      userId,
      sessionId,
      recommendationVersion: `${signals.provenance.observedExposure.version}|${signals.provenance.entryFriction.version}`,
      targetCareerId: topCareer.id,
      action: 'jump_to_plan',
    })
    const target = document.getElementById('action-plan')
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-sky-50 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-xl">Signals & Strategy</CardTitle>
            </div>
            <CardDescription>
              Early indicators that help you pick a posture, not predict your future.
            </CardDescription>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <NowcastingTrustContractDialog
              observedExposure={signals.provenance.observedExposure}
              entryFriction={signals.provenance.entryFriction}
            />
            <Button type="button" variant="outline" onClick={scrollToPlan} className="gap-2 bg-white/80">
              Jump to Plan
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-indigo-200 bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
              Observed Exposure
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${levelTone(
                  signals.observedExposure.level,
                )}`}
              >
                {levelLabel(signals.observedExposure.level)}
              </span>
              <span className="text-xs text-slate-500">
                Confidence: {signals.observedExposure.confidence}
              </span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {signals.observedExposure.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-indigo-500">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
              Entry Friction
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${levelTone(
                  signals.entryFriction.level,
                )}`}
              >
                {levelLabel(signals.entryFriction.level)}
              </span>
              <span className="text-xs text-slate-500">
                Confidence: {signals.entryFriction.confidence}
              </span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {signals.entryFriction.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-indigo-500">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
              Growth Context
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {signals.growthOutlook.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500">From your current career match.</span>
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                Target lane: <span className="font-medium text-slate-900">{topCareer.name}</span>
              </p>
              <p>
                Readiness: <span className="font-medium text-slate-900">{topCareer.readiness.replace('_', ' ')}</span>
              </p>
              <p>
                Salary range:{' '}
                <span className="font-medium text-slate-900">
                  ${topCareer.salaryRange[0].toLocaleString()}-${topCareer.salaryRange[1].toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-white/80 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
            Choose Your Posture
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {postureDescription(posture)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['defend', 'balance', 'attack'] as const).map((option) => {
              const isActive = posture === option
              return (
                <Button
                  key={option}
                  type="button"
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => onPostureChange(option)}
                  className={isActive ? 'gap-2' : 'gap-2 bg-white/80'}
                >
                  {postureIcon(option)}
                  {postureLabel(option)}
                </Button>
              )
            })}
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 text-slate-500" />
              <div className="space-y-1">
                {signals.disclaimers.map((line, index) => (
                  <p key={index} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-sky-600" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Signal Provenance
            </p>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3">
              <p className="text-xs font-semibold text-slate-700">Observed Exposure</p>
              <p className="mt-1 text-sm text-slate-600">{signals.provenance.observedExposure.summary}</p>
              {renderSignalMetadata(
                signals.provenance.observedExposure.updatedAtIso,
                signals.provenance.observedExposure.source,
                signals.provenance.observedExposure.coverage,
                signals.provenance.observedExposure.version,
                signals.provenance.observedExposure.matchType,
              )}
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3">
              <p className="text-xs font-semibold text-slate-700">Entry Friction</p>
              <p className="mt-1 text-sm text-slate-600">{signals.provenance.entryFriction.summary}</p>
              {renderSignalMetadata(
                signals.provenance.entryFriction.updatedAtIso,
                signals.provenance.entryFriction.source,
                signals.provenance.entryFriction.coverage,
                signals.provenance.entryFriction.version,
                signals.provenance.entryFriction.matchType,
              )}
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3">
              <p className="text-xs font-semibold text-slate-700">Freshness</p>
              <p className="mt-1 text-sm text-slate-600">{signals.provenance.freshness}</p>
              <p className="mt-2 text-xs text-slate-500">
                Updated {new Date(signals.updatedAtIso).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
