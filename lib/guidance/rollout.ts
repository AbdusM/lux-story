import { getFlag } from '@/lib/feature-flags'
import { GUIDANCE_EXPERIMENT_ID } from '@/lib/guidance/contracts'

export const GUIDANCE_ASSIGNMENT_VERSION = '2026-03-v2-control'

export type GuidanceExperimentVariant = 'control' | 'adaptive'
export type GuidanceRolloutMode = 'off' | 'experiment' | 'adaptive_only'
export type GuidanceRolloutPercentage = 0 | 10 | 25 | 50 | 100

export type GuidanceRolloutConfig = {
  experimentId: typeof GUIDANCE_EXPERIMENT_ID
  assignmentVersion: typeof GUIDANCE_ASSIGNMENT_VERSION
  mode: GuidanceRolloutMode
  adaptivePercentage: GuidanceRolloutPercentage
  controlPercentage: GuidanceRolloutPercentage
  weights: readonly [number, number]
  forcedVariant: GuidanceExperimentVariant | null
  isKillSwitchActive: boolean
}

function parseAdaptivePercentage(raw: string): GuidanceRolloutPercentage {
  switch (raw) {
    case '0':
      return 0
    case '10':
      return 10
    case '25':
      return 25
    case '50':
      return 50
    case '100':
      return 100
    default:
      return 50
  }
}

export function getAdaptiveGuidanceRolloutConfig(): GuidanceRolloutConfig {
  const mode = getFlag('ADAPTIVE_GUIDANCE_V1_MODE') as GuidanceRolloutMode
  const adaptivePercentage = parseAdaptivePercentage(
    getFlag('ADAPTIVE_GUIDANCE_V1_ROLLOUT') as string,
  )

  if (mode === 'off') {
    return {
      experimentId: GUIDANCE_EXPERIMENT_ID,
      assignmentVersion: GUIDANCE_ASSIGNMENT_VERSION,
      mode,
      adaptivePercentage: 0,
      controlPercentage: 100,
      weights: [100, 0] as const,
      forcedVariant: 'control',
      isKillSwitchActive: true,
    }
  }

  if (mode === 'adaptive_only') {
    return {
      experimentId: GUIDANCE_EXPERIMENT_ID,
      assignmentVersion: GUIDANCE_ASSIGNMENT_VERSION,
      mode,
      adaptivePercentage: 100,
      controlPercentage: 0,
      weights: [0, 100] as const,
      forcedVariant: 'adaptive',
      isKillSwitchActive: false,
    }
  }

  return {
    experimentId: GUIDANCE_EXPERIMENT_ID,
    assignmentVersion: GUIDANCE_ASSIGNMENT_VERSION,
    mode,
    adaptivePercentage,
    controlPercentage: (100 - adaptivePercentage) as GuidanceRolloutPercentage,
    weights: [100 - adaptivePercentage, adaptivePercentage] as const,
    forcedVariant: null,
    isKillSwitchActive: false,
  }
}

export function resolveAdaptiveGuidanceVariant(
  assignedVariant: GuidanceExperimentVariant,
  config: GuidanceRolloutConfig = getAdaptiveGuidanceRolloutConfig(),
): GuidanceExperimentVariant {
  return config.forcedVariant ?? assignedVariant
}
