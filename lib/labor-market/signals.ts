import type { CareerMatch, SkillProfile } from '@/lib/skill-profile-adapter'

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
  disclaimers: string[]
}

function clampReasons(reasons: string[], max: number = 3): string[] {
  return reasons.filter(Boolean).slice(0, max)
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase()
}

function deriveObservedExposure(careerName: string): SignalDescriptor {
  const name = normalizeText(careerName)

  // Phase 1 intentionally stays conservative: we do not have task-level adoption
  // data wired in yet. This is a low-confidence heuristic for a few obvious lanes
  // to make the UI feel alive without implying precision.
  const highExposureHints = [
    'software',
    'developer',
    'programmer',
    'customer service',
    'data entry',
  ]

  if (highExposureHints.some((hint) => name.includes(hint))) {
    return {
      level: 'high',
      confidence: 'low',
      reasons: clampReasons([
        'This lane commonly includes tasks where AI tools are being adopted quickly (beta heuristic based on role name).',
        'This is not a prediction of job loss; it is an early signal that workflows may change.',
      ]),
    }
  }

  return {
    level: 'unknown',
    confidence: 'low',
    reasons: ['Task-level adoption data is not connected yet for this lane.'],
  }
}

function deriveEntryFriction(
  career: CareerMatch,
  profile: SkillProfile,
): SignalDescriptor {
  const reasons: string[] = []

  if (career.readiness === 'near_ready') {
    reasons.push('You appear near-ready for this lane based on your current evidence.')
    return { level: 'low', confidence: 'medium', reasons: clampReasons(reasons) }
  }

  if (career.readiness === 'exploratory') {
    reasons.push('This lane is still exploratory; the fastest path is usually to gather more evidence and narrow options.')
    return { level: 'high', confidence: 'medium', reasons: clampReasons(reasons) }
  }

  const topGap = profile.skillGaps[0]
  if (topGap) {
    reasons.push(`Top gap to close: ${topGap.skill} (${topGap.priority} priority).`)
  } else {
    reasons.push('Skill gaps exist for this lane, but the highest-priority gap is not yet clear.')
  }

  const level: SignalLevel = topGap?.priority === 'high' ? 'high' : 'medium'
  return { level, confidence: 'medium', reasons: clampReasons(reasons) }
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
  const observedExposure = deriveObservedExposure(options.career.name)
  const entryFriction = deriveEntryFriction(options.career, options.profile)
  const growthOutlook = options.career.growthProjection

  return {
    observedExposure,
    entryFriction,
    growthOutlook,
    recommendedPosture: deriveRecommendedPosture(entryFriction, growthOutlook),
    updatedAtIso: nowIso,
    disclaimers: [
      'These signals are early indicators, not predictions.',
      'You can override guidance if it does not match your reality.',
    ],
  }
}

