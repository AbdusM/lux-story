import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('ensureUserApiSession', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('backs off repeated failures for the same user during cooldown', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000)
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })
    vi.stubGlobal('fetch', fetchMock)

    const { ensureUserApiSession } = await import('@/lib/user-api-session')

    await expect(ensureUserApiSession('11111111-1111-1111-1111-111111111111')).resolves.toBe(false)
    await expect(ensureUserApiSession('11111111-1111-1111-1111-111111111111')).resolves.toBe(false)

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('retries after cooldown expiry and clears failure state on success', async () => {
    const nowSpy = vi.spyOn(Date, 'now')
    nowSpy.mockReturnValue(1_000)

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      })
    vi.stubGlobal('fetch', fetchMock)

    const { ensureUserApiSession } = await import('@/lib/user-api-session')
    const userId = '11111111-1111-1111-1111-111111111111'

    await expect(ensureUserApiSession(userId)).resolves.toBe(false)

    nowSpy.mockReturnValue(62_500)
    await expect(ensureUserApiSession(userId)).resolves.toBe(true)
    await expect(ensureUserApiSession(userId)).resolves.toBe(true)

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('tracks cooldown per user instead of globally', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000)
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      })
    vi.stubGlobal('fetch', fetchMock)

    const { ensureUserApiSession } = await import('@/lib/user-api-session')

    await expect(ensureUserApiSession('11111111-1111-1111-1111-111111111111')).resolves.toBe(false)
    await expect(ensureUserApiSession('22222222-2222-2222-2222-222222222222')).resolves.toBe(true)

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
