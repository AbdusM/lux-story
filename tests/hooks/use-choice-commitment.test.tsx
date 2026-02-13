import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'

let reducedMotionEnabled = false

vi.mock('framer-motion', () => ({
  useReducedMotion: () => reducedMotionEnabled,
}))

import { useChoiceCommitment } from '@/hooks/useChoiceCommitment'

describe('useChoiceCommitment', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    reducedMotionEnabled = false
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('dispatches the choice callback early during the animation sequence', async () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useChoiceCommitment())

    let animationPromise: Promise<void>
    act(() => {
      animationPromise = result.current.commitChoice('choice_1', onComplete)
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(170)
    })
    expect(onComplete).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(40)
    })
    expect(onComplete).toHaveBeenCalledTimes(1)

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    await animationPromise!
  })

  it('calls the callback immediately when reduced motion is enabled', async () => {
    reducedMotionEnabled = true
    const onComplete = vi.fn()
    const { result } = renderHook(() => useChoiceCommitment())

    await act(async () => {
      await result.current.commitChoice('choice_2', onComplete)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(result.current.animationState).toBe('idle')
  })
})
