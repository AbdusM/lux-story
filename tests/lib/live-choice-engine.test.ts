import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  getLiveChoiceEngine,
  LiveChoiceEngine,
  isLiveChoiceGenerationEnabled,
  type LiveChoiceRequest,
} from '@/lib/live-choice-engine'

const TEST_REQUEST: LiveChoiceRequest = {
  sceneContext: 'A quiet platform at dusk.',
  pattern: 'helping',
  playerPersona: 'Supportive and reflective',
  existingChoices: ['Stay quiet', 'Offer support'],
  sceneId: 'platform_01',
  playerId: 'player_123',
}

describe('live-choice engine', () => {
  const originalEnable = process.env.ENABLE_LIVE_AUGMENTATION
  const originalPublicEnable = process.env.NEXT_PUBLIC_ENABLE_LIVE_AUGMENTATION

  beforeEach(() => {
    LiveChoiceEngine.resetInstance()
    localStorage.clear()
    delete process.env.ENABLE_LIVE_AUGMENTATION
    delete process.env.NEXT_PUBLIC_ENABLE_LIVE_AUGMENTATION
  })

  afterEach(() => {
    vi.restoreAllMocks()
    LiveChoiceEngine.resetInstance()

    if (originalEnable === undefined) {
      delete process.env.ENABLE_LIVE_AUGMENTATION
    } else {
      process.env.ENABLE_LIVE_AUGMENTATION = originalEnable
    }

    if (originalPublicEnable === undefined) {
      delete process.env.NEXT_PUBLIC_ENABLE_LIVE_AUGMENTATION
    } else {
      process.env.NEXT_PUBLIC_ENABLE_LIVE_AUGMENTATION = originalPublicEnable
    }
  })

  test('does not call the experimental route when live generation is disabled', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const engine = getLiveChoiceEngine()

    expect(isLiveChoiceGenerationEnabled()).toBe(false)
    await expect(engine.generateChoice(TEST_REQUEST)).resolves.toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('calls the experimental route when explicitly enabled', async () => {
    process.env.ENABLE_LIVE_AUGMENTATION = 'true'

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          text: 'Step toward the student and ask what support would feel most useful.',
          justification: 'Encourages a high-empathy move.',
          confidenceScore: 0.92,
          generatedAt: Date.now(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    const engine = getLiveChoiceEngine()
    const result = await engine.generateChoice(TEST_REQUEST)

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/live-choices',
      expect.objectContaining({
        method: 'POST',
      }),
    )
    expect(result).toMatchObject({
      text: expect.stringContaining('Step toward the student'),
      confidenceScore: 0.92,
    })
  })
})
