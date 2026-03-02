import { describe, expect, it } from 'vitest'

import { buildChoiceOutcomePresentation } from '@/lib/choice-outcome-presentation'

describe('buildChoiceOutcomePresentation', () => {
  it('uses inline presentation for non-resolved outcomes', () => {
    const presentation = buildChoiceOutcomePresentation({
      outcome: 'navigation_error',
      trustDelta: 1,
      earnedPattern: 'exploring',
      unlockCount: 1,
      nextSpeaker: 'Samuel',
    })

    expect(presentation.mode).toBe('inline')
    expect(presentation.rewardCount).toBe(0)
    expect(presentation.hiddenCount).toBe(0)
    expect(presentation.card).toBeNull()
  })

  it('builds a capped outcome card with telemetry counts', () => {
    const presentation = buildChoiceOutcomePresentation({
      outcome: 'resolved',
      trustDelta: 2,
      earnedPattern: 'helping',
      unlockCount: 2,
      nextSpeaker: 'Maya',
      maxVisibleRewards: 2,
    })

    expect(presentation.mode).toBe('card')
    expect(presentation.rewardCount).toBe(2)
    expect(presentation.hiddenCount).toBe(1)
    expect(presentation.card).not.toBeNull()
    expect(presentation.card?.summary).toBe('Progress recorded.')
    expect(presentation.card?.nextLabel).toBe('Next: Maya')
  })

  it('uses a fallback summary when no explicit rewards were produced', () => {
    const presentation = buildChoiceOutcomePresentation({
      outcome: 'resolved',
      trustDelta: 0,
      earnedPattern: null,
      unlockCount: 0,
      nextSpeaker: null,
    })

    expect(presentation.mode).toBe('card')
    expect(presentation.rewardCount).toBe(0)
    expect(presentation.hiddenCount).toBe(0)
    expect(presentation.card?.summary).toBe('Story progressed.')
  })
})
