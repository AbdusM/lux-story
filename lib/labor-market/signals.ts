import type { CareerMatch, SkillProfile } from '@/lib/skill-profile-adapter'
import { getCuratedEntryFriction } from '@/lib/labor-market/entry-friction-dataset'
import { describeMarketSignalFreshness } from '@/lib/labor-market/market-signal-contract'
import type { MarketSignalMetadata } from '@/lib/labor-market/market-signal-contract'
import { getCuratedObservedExposure } from '@/lib/labor-market/observed-exposure-dataset'

export type Posture = 'defend' | 'balance' | 'attack'

export type SignalLevel = 'low' | 'medium' | 'high' | 'unknown'
export type SignalConfidence = 'low' | 'medium' | 'high'

export type GrowthOutlook = 'high' | 'medium' | 'stable'

export interface SignalDescriptor {
  level: SignalLevel
  confidence: SignalConfidence
  reasons: string[]
}

export interface CareerSignals {
  observedExposure: SignalDescriptor
  entryFriction: SignalDescriptor
  growthOutlook: GrowthOutlook
  recommendedPosture: Posture
  updatedAtIso: string
  provenance: {
    observedExposure: MarketSignalMetadata
    entryFriction: MarketSignalMetadata
    freshness: string
  }
  disclaimers: string[]
}

function clampReasons(reasons: string[], max: number = 3): string[] {
  return reasons.filter(Boolean).slice(0, max)
}

function deriveObservedExposure(career: CareerMatch): {
  descriptor: SignalDescriptor
  metadata: MarketSignalMetadata
} {
  const curated = getCuratedObservedExposure({
    careerId: career.id,
    careerName: career.name,
  })

  if (curated) {
    return {
      descriptor: {
        ...curated.descriptor,
        reasons: clampReasons(curated.descriptor.reasons),
      },
      metadata: curated.metadata,
    }
  }

  return {
    descriptor: {
      level: 'unknown',
      confidence: 'low',
      reasons: ['No repo-owned nowcasting mapping exists yet for this lane.'],
    },
    metadata: {
      summary: 'No curated observed-exposure mapping exists for this lane yet.',
      source: 'Lux fallback: unmapped lane',
      updatedAtIso: '2026-03-13T00:00:00.000Z',
      coverage: 'Only canonical and alias lanes already added to the repo-owned mapping are covered.',
      confidence: 'low',
      version: 'observed-exposure-v1',
      methodology:
        'If no repo-owned observed-exposure record exists, the system stays explicitly unknown rather than inventing a score.',
    },
  }
}

function buildReadinessContextReasons(career: CareerMatch, profile: SkillProfile): string[] {
  const reasons: string[] = []

  if (career.readiness === 'near_ready') {
    reasons.push('You appear near-ready for this lane based on your current evidence.')
    return reasons
  }

  if (career.readiness === 'exploratory') {
    reasons.push('This lane is still exploratory; the fastest path is usually to gather more evidence and narrow options.')
    return reasons
  }

  const topGap = profile.skillGaps[0]
  if (topGap) {
    reasons.push(`Top gap to close: ${topGap.skill} (${topGap.priority} priority).`)
  } else {
    reasons.push('Skill gaps exist for this lane, but the highest-priority gap is not yet clear.')
  }

  return reasons
}

function deriveEntryFriction(
  career: CareerMatch,
  profile: SkillProfile,
  nowIso: string,
): {
  descriptor: SignalDescriptor
  metadata: MarketSignalMetadata
} {
  const contextReasons = buildReadinessContextReasons(career, profile)
  const curated = getCuratedEntryFriction({
    careerId: career.id,
    careerName: career.name,
  })

  if (curated) {
    return {
      descriptor: {
        ...curated.descriptor,
        reasons: clampReasons([...curated.descriptor.reasons, ...contextReasons]),
      },
      metadata: {
        ...curated.metadata,
        summary: `${curated.metadata.summary} Supporting readiness context from the current student profile is appended at page load.`,
      },
    }
  }

  if (career.readiness === 'near_ready') {
    return {
      descriptor: { level: 'low', confidence: 'medium', reasons: clampReasons(contextReasons) },
      metadata: {
        summary:
          'No curated entry-friction mapping exists for this lane yet, so the estimate falls back to readiness evidence.',
        source: 'Lux fallback: student profile readiness',
        updatedAtIso: nowIso,
        coverage: 'Current student profile only; no external lane mapping is attached yet.',
        confidence: 'medium',
        version: 'entry-friction-v1',
        methodology:
          'Fallback path uses readiness and skill-gap evidence from the current profile until a lane mapping is added.',
      },
    }
  }

  if (career.readiness === 'exploratory') {
    return {
      descriptor: { level: 'high', confidence: 'medium', reasons: clampReasons(contextReasons) },
      metadata: {
        summary:
          'No curated entry-friction mapping exists for this lane yet, so the estimate falls back to exploratory readiness evidence.',
        source: 'Lux fallback: student profile readiness',
        updatedAtIso: nowIso,
        coverage: 'Current student profile only; no external lane mapping is attached yet.',
        confidence: 'medium',
        version: 'entry-friction-v1',
        methodology:
          'Fallback path uses readiness and skill-gap evidence from the current profile until a lane mapping is added.',
      },
    }
  }

  const topGap = profile.skillGaps[0]
  const level: SignalLevel = topGap?.priority === 'high' ? 'high' : 'medium'
  return {
    descriptor: { level, confidence: 'medium', reasons: clampReasons(contextReasons) },
    metadata: {
      summary:
        'No curated entry-friction mapping exists for this lane yet, so the estimate falls back to skill-gap evidence.',
      source: 'Lux fallback: student profile readiness',
      updatedAtIso: nowIso,
      coverage: 'Current student profile only; no external lane mapping is attached yet.',
      confidence: 'medium',
      version: 'entry-friction-v1',
      methodology:
        'Fallback path uses readiness and skill-gap evidence from the current profile until a lane mapping is added.',
    },
  }
}

function deriveRecommendedPosture(
  entryFriction: SignalDescriptor,
  growthOutlook: GrowthOutlook,
): Posture {
  if (entryFriction.level === 'high') return 'defend'
  if (entryFriction.level === 'low' && growthOutlook === 'high') return 'attack'
  return 'balance'
}

export function deriveCareerSignals(options: {
  career: CareerMatch
  profile: SkillProfile
  nowIso?: string
}): CareerSignals {
  const nowIso = options.nowIso ?? new Date().toISOString()
  const observedExposure = deriveObservedExposure(options.career)
  const entryFriction = deriveEntryFriction(options.career, options.profile, nowIso)
  const growthOutlook = options.career.growthProjection

  return {
    observedExposure: observedExposure.descriptor,
    entryFriction: entryFriction.descriptor,
    growthOutlook,
    recommendedPosture: deriveRecommendedPosture(entryFriction.descriptor, growthOutlook),
    updatedAtIso: nowIso,
    provenance: {
      observedExposure: observedExposure.metadata,
      entryFriction: entryFriction.metadata,
      freshness: [
        describeMarketSignalFreshness(observedExposure.metadata, 'observedExposure', nowIso),
        describeMarketSignalFreshness(entryFriction.metadata, 'entryFriction', nowIso),
        'Signals were generated at page load from the latest stored profile snapshot.',
      ].join(' '),
    },
    disclaimers: [
      'These signals are early indicators, not predictions.',
      'You can override guidance if it does not match your reality.',
    ],
  }
}
