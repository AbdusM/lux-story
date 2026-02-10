import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('feature-flags', () => {
  const ORIGINAL_NODE_ENV = process.env.NODE_ENV
  const ORIGINAL_PUBLIC_ENV = process.env.NEXT_PUBLIC_FF_RANKING_V2

  const setNodeEnv = (value: string | undefined) => {
    // Some TS env typings mark NODE_ENV as readonly; tests still need to flip it.
    if (value === undefined) delete (process.env as any).NODE_ENV
    else (process.env as any).NODE_ENV = value
  }

  beforeEach(() => {
    vi.resetModules()
    window.localStorage.clear()
    window.history.replaceState({}, '', '/')
    setNodeEnv('test')
    delete process.env.NEXT_PUBLIC_FF_RANKING_V2
  })

  afterEach(() => {
    setNodeEnv(ORIGINAL_NODE_ENV)
    if (ORIGINAL_PUBLIC_ENV === undefined) delete process.env.NEXT_PUBLIC_FF_RANKING_V2
    else process.env.NEXT_PUBLIC_FF_RANKING_V2 = ORIGINAL_PUBLIC_ENV
  })

  it('applies precedence: query (dev) > localStorage (dev) > env > default', async () => {
    // env says beta
    process.env.NEXT_PUBLIC_FF_RANKING_V2 = 'beta'

    const ff1 = await import('@/lib/feature-flags')
    expect(ff1.getFlag('RANKING_V2')).toBe('beta')

    // localStorage overrides env in dev/test
    ff1.setFlag('RANKING_V2', 'control')
    expect(ff1.getFlag('RANKING_V2')).toBe('control')

    // query overrides localStorage in dev/test
    window.history.replaceState({}, '', '/?ff_RANKING_V2=beta')
    expect(ff1.getFlag('RANKING_V2')).toBe('beta')
  })

  it('parses boolean flags from query/localStorage/env and falls back to default on invalid values', async () => {
    const ff = await import('@/lib/feature-flags')

    expect(ff.getFlag('ENFORCE_REQUIRED_STATE')).toBe(false)

    window.history.replaceState({}, '', '/?ff_ENFORCE_REQUIRED_STATE=true')
    expect(ff.getFlag('ENFORCE_REQUIRED_STATE')).toBe(true)

    window.history.replaceState({}, '', '/?ff_ENFORCE_REQUIRED_STATE=not-a-bool')
    expect(ff.getFlag('ENFORCE_REQUIRED_STATE')).toBe(false)
  })

  it('ignores query/localStorage overrides in production builds and setFlag throws', async () => {
    setNodeEnv('production')

    const ff = await import('@/lib/feature-flags')

    // Even with query + localStorage, production ignores overrides.
    window.history.replaceState({}, '', '/?ff_RANKING_V2=beta')
    window.localStorage.setItem('ff_RANKING_V2', 'beta')
    expect(ff.getFlag('RANKING_V2')).toBe('control')

    expect(() => ff.setFlag('RANKING_V2', 'beta')).toThrow(/disabled in production/i)
  })
})
