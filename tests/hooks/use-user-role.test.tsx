import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

const getUserMock = vi.fn()
const onAuthStateChangeMock = vi.fn()
const unsubscribeMock = vi.fn()
const createClientMock = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => createClientMock(),
}))

import { useUserRole } from '@/hooks/useUserRole'

describe('useUserRole', () => {
  beforeEach(() => {
    getUserMock.mockReset()
    onAuthStateChangeMock.mockReset()
    unsubscribeMock.mockReset()
    createClientMock.mockReset()

    createClientMock.mockReturnValue({
      auth: {
        getUser: getUserMock,
        onAuthStateChange: onAuthStateChangeMock,
      },
    })

    onAuthStateChangeMock.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: unsubscribeMock,
        },
      },
    })
  })

  it('stays quiet on the unauthenticated path and reuses one client across rerenders', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: null,
      },
    })

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const { result, rerender } = renderHook(() => useUserRole())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.role).toBe('student')
    expect(result.current.user).toBeNull()
    expect(createClientMock).toHaveBeenCalledTimes(1)
    expect(logSpy).not.toHaveBeenCalled()

    rerender()
    expect(createClientMock).toHaveBeenCalledTimes(1)

    logSpy.mockRestore()
  })
})
