import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('feature-flags', () => {
  beforeEach(() => {
    // Reset URL and localStorage between tests (use relative URLs; jsdom blocks cross-origin replaceState).
    window.history.replaceState({}, '', '/')
    window.localStorage.clear()
    vi.resetModules()
  })

  it('resolves default when no overrides exist', async () => {
    const ff = await import('@/lib/feature-flags')
    expect(ff.getFlag('RANKING_V2')).toBe('control')
    expect(ff.getFlag('TELEMETRY_DEBUG')).toBe(false)
  })

  it('query param overrides localStorage overrides (dev only)', async () => {
    const ff = await import('@/lib/feature-flags')

    window.localStorage.setItem('ff_RANKING_V2', 'beta')
    window.history.replaceState({}, '', '/?ff_RANKING_V2=control')

    expect(ff.getFlag('RANKING_V2')).toBe('control')
  })

  it('localStorage overrides env overrides (dev only)', async () => {
    const prev = process.env.NEXT_PUBLIC_FF_RANKING_V2
    process.env.NEXT_PUBLIC_FF_RANKING_V2 = 'beta'

    const ff = await import('@/lib/feature-flags')

    window.localStorage.setItem('ff_RANKING_V2', 'control')
    expect(ff.getFlag('RANKING_V2')).toBe('control')

    process.env.NEXT_PUBLIC_FF_RANKING_V2 = prev
  })

  it('parses boolean flags from query/localStorage', async () => {
    const ff = await import('@/lib/feature-flags')

    window.history.replaceState({}, '', '/?ff_TELEMETRY_DEBUG=true')
    expect(ff.getFlag('TELEMETRY_DEBUG')).toBe(true)

    window.history.replaceState({}, '', '/')
    window.localStorage.setItem('ff_TELEMETRY_DEBUG', '0')
    expect(ff.getFlag('TELEMETRY_DEBUG')).toBe(false)
  })

  it('setFlag throws in production', async () => {
    const prev = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'production'

    const ff = await import('@/lib/feature-flags')
    expect(() => ff.setFlag('RANKING_V2', 'beta')).toThrow(/disabled in production/i)

    ;(process.env as any).NODE_ENV = prev
  })
})
