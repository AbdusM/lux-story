import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('guidance rollout', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_MODE
    delete process.env.FF_ADAPTIVE_GUIDANCE_V1_MODE
    delete process.env.NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_ROLLOUT
    delete process.env.FF_ADAPTIVE_GUIDANCE_V1_ROLLOUT
    vi.resetModules()
  })

  it('defaults to a 10/90 experiment rollout', async () => {
    const rollout = await import('@/lib/guidance/rollout')

    expect(rollout.getAdaptiveGuidanceRolloutConfig()).toMatchObject({
      mode: 'experiment',
      adaptivePercentage: 10,
      controlPercentage: 90,
      forcedVariant: null,
      isKillSwitchActive: false,
      weights: [90, 10],
    })
  })

  it('forces control when the kill switch is active', async () => {
    process.env.NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_MODE = 'off'

    const rollout = await import('@/lib/guidance/rollout')
    const config = rollout.getAdaptiveGuidanceRolloutConfig()

    expect(config).toMatchObject({
      mode: 'off',
      adaptivePercentage: 0,
      controlPercentage: 100,
      forcedVariant: 'control',
      isKillSwitchActive: true,
    })
    expect(rollout.resolveAdaptiveGuidanceVariant('adaptive', config)).toBe('control')
  })

  it('respects an env-configured adaptive percentage during experiment mode', async () => {
    process.env.NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_MODE = 'experiment'
    process.env.NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_ROLLOUT = '25'

    const rollout = await import('@/lib/guidance/rollout')

    expect(rollout.getAdaptiveGuidanceRolloutConfig()).toMatchObject({
      mode: 'experiment',
      adaptivePercentage: 25,
      controlPercentage: 75,
      weights: [75, 25],
    })
  })
})
