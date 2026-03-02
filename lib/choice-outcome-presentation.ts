export type ChoiceOutcomePresentationMode = 'inline' | 'card'

export type ChoiceOutcomeCard = {
  summary: string
  rewards: string[]
  hiddenCount: number
  nextLabel: string
}

export type ChoiceOutcomePresentation = {
  mode: ChoiceOutcomePresentationMode
  rewardCount: number
  hiddenCount: number
  card: ChoiceOutcomeCard | null
}

export type BuildChoiceOutcomePresentationInput = {
  outcome: string
  trustDelta: number | null
  earnedPattern: string | null
  unlockCount: number
  nextSpeaker?: string | null
  maxVisibleRewards?: number
}

function toTitleCase(value: string): string {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function buildChoiceOutcomePresentation({
  outcome,
  trustDelta,
  earnedPattern,
  unlockCount,
  nextSpeaker,
  maxVisibleRewards = 2,
}: BuildChoiceOutcomePresentationInput): ChoiceOutcomePresentation {
  if (outcome !== 'resolved') {
    return {
      mode: 'inline',
      rewardCount: 0,
      hiddenCount: 0,
      card: null,
    }
  }

  const rewardCandidates: string[] = []
  if (typeof trustDelta === 'number' && trustDelta !== 0) {
    const sign = trustDelta > 0 ? '+' : ''
    rewardCandidates.push(`Trust ${sign}${trustDelta}`)
  }
  if (earnedPattern) {
    rewardCandidates.push(`${toTitleCase(earnedPattern)} resonance +1`)
  }
  if (unlockCount > 0) {
    rewardCandidates.push(unlockCount === 1 ? '1 unlock available' : `${unlockCount} unlocks available`)
  }

  const rewards = rewardCandidates.slice(0, maxVisibleRewards)
  const hiddenCount = Math.max(0, rewardCandidates.length - rewards.length)
  const summary = rewardCandidates.length > 0 ? 'Progress recorded.' : 'Story progressed.'

  return {
    mode: 'card',
    rewardCount: rewards.length,
    hiddenCount,
    card: {
      summary,
      rewards,
      hiddenCount,
      nextLabel: nextSpeaker ? `Next: ${nextSpeaker}` : 'Next moment ready',
    },
  }
}
