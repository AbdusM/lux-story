import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAdaptiveGuidance } from '@/hooks/useAdaptiveGuidance'

const {
  mockAssignVariant,
  mockEnsureUserApiSession,
  mockQueueInteractionEventSync,
} = vi.hoisted(() => ({
  mockAssignVariant: vi.fn(() => 'adaptive'),
  mockEnsureUserApiSession: vi.fn(async () => false),
  mockQueueInteractionEventSync: vi.fn(),
}))

vi.mock('@/lib/experiments', () => ({
  ACTIVE_TESTS: {},
  assignVariant: mockAssignVariant,
}))

vi.mock('@/lib/sync-queue', () => ({
  queueInteractionEventSync: mockQueueInteractionEventSync,
}))

vi.mock('@/lib/user-api-session', () => ({
  ensureUserApiSession: mockEnsureUserApiSession,
}))

function createOptions(overrides: Partial<Parameters<typeof useAdaptiveGuidance>[0]> = {}) {
  return {
    playerId: 'player_123',
    surface: 'careers' as const,
    totalDemonstrations: 8,
    skillCount: 4,
    careerMatchCount: 3,
    nearReadyCareerCount: 1,
    unlockedOpportunityCount: 0,
    openReturnsCount: 0,
    hasJourneySave: false,
    currentCharacterLabel: 'Maya',
    dominantPatternLabel: 'Helping',
    nowIso: '2026-03-07T12:00:00.000Z',
    ...overrides,
  }
}

describe('useAdaptiveGuidance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
    window.sessionStorage.clear()
    mockAssignVariant.mockReturnValue('adaptive')
  })

  it('pins one recommendation per session across surfaces', async () => {
    const { result, unmount } = renderHook((props) => useAdaptiveGuidance(props), {
      initialProps: createOptions({ surface: 'careers' }),
    })

    await waitFor(() => expect(result.current.isReady).toBe(true))
    await waitFor(() =>
      expect(result.current.stableNextBestMove?.taskId).toBe('review_career_matches'),
    )

    unmount()

    const { result: secondResult } = renderHook((props) => useAdaptiveGuidance(props), {
      initialProps: createOptions({
        surface: 'opportunities',
        hasJourneySave: true,
        openReturnsCount: 1,
        unlockedOpportunityCount: 2,
      }),
    })

    await waitFor(() => expect(secondResult.current.isReady).toBe(true))
    expect(secondResult.current.snapshot.nextBestMove?.taskId).toBe('resume_waiting_route')
    expect(secondResult.current.stableNextBestMove?.taskId).toBe('review_career_matches')
  })

  it('suppresses new recommendations for the rest of the session after dismiss', async () => {
    const { result, unmount } = renderHook((props) => useAdaptiveGuidance(props), {
      initialProps: createOptions({ surface: 'careers' }),
    })

    await waitFor(() => expect(result.current.isReady).toBe(true))
    await waitFor(() => expect(result.current.stableNextBestMove).not.toBeNull())

    const pinnedTaskId = result.current.stableNextBestMove?.taskId
    expect(pinnedTaskId).toBeTruthy()

    act(() => {
      result.current.dismissRecommendation(pinnedTaskId!)
    })

    expect(result.current.stableNextBestMove).toBeNull()

    unmount()

    const { result: secondResult } = renderHook((props) => useAdaptiveGuidance(props), {
      initialProps: createOptions({ surface: 'profile' }),
    })

    await waitFor(() => expect(secondResult.current.isReady).toBe(true))
    expect(secondResult.current.stableNextBestMove).toBeNull()
  })
})
