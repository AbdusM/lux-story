import type { CareerMatch, SkillProfile } from '@/lib/skill-profile-adapter'
import { getCuratedEntryFriction } from '@/lib/labor-market/entry-friction-dataset'
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
    observedExposure: string
    entryFriction: string
    freshness: string
  }
  disclaimers: string[]
}

function clampReasons(reasons: string[], max: number = 3): string[] {
  return reasons.filter(Boolean).slice(0, max)
}

function deriveObservedExposure(career: CareerMatch): {
  descriptor: SignalDescriptor
  provenance: string
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
      provenance: curated.provenance,
    }
  }

  return {
    descriptor: {
      level: 'unknown',
      confidence: 'low',
      reasons: ['No repo-owned nowcasting mapping exists yet for this lane.'],
    },
    provenance:
      'No curated observed-exposure record is attached to this career yet, so the UI stays explicitly unknown.',
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
): {
  descriptor: SignalDescriptor
  provenance: string
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
      provenance: `${curated.provenance} Supporting readiness context is appended from the student profile at page load.`,
    }
  }

  if (career.readiness === 'near_ready') {
    return {
      descriptor: { level: 'low', confidence: 'medium', reasons: clampReasons(contextReasons) },
      provenance:
        'No curated entry-friction record exists yet for this lane, so the estimate falls back to readiness and skill-gap evidence from the current profile.',
    }
  }

  if (career.readiness === 'exploratory') {
    return {
      descriptor: { level: 'high', confidence: 'medium', reasons: clampReasons(contextReasons) },
      provenance:
        'No curated entry-friction record exists yet for this lane, so the estimate falls back to readiness and skill-gap evidence from the current profile.',
    }
  }

  const topGap = profile.skillGaps[0]
  const level: SignalLevel = topGap?.priority === 'high' ? 'high' : 'medium'
  return {
    descriptor: { level, confidence: 'medium', reasons: clampReasons(contextReasons) },
    provenance:
      'No curated entry-friction record exists yet for this lane, so the estimate falls back to readiness and skill-gap evidence from the current profile.',
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
  const entryFriction = deriveEntryFriction(options.career, options.profile)
  const growthOutlook = options.career.growthProjection

  return {
    observedExposure: observedExposure.descriptor,
    entryFriction: entryFriction.descriptor,
    growthOutlook,
    recommendedPosture: deriveRecommendedPosture(entryFriction.descriptor, growthOutlook),
    updatedAtIso: nowIso,
    provenance: {
      observedExposure: observedExposure.provenance,
      entryFriction: entryFriction.provenance,
      freshness: 'Generated at page load from the latest stored profile snapshot.',
    },
    disclaimers: [
      'These signals are early indicators, not predictions.',
      'You can override guidance if it does not match your reality.',
    ],
  }
}
