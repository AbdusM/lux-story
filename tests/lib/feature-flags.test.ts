import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getFlag, isEnabled, listFlags, resetFlags, setFlag } from '@/lib/feature-flags'

describe('Feature Flags', () => {
  const originalNodeEnv = process.env.NODE_ENV

  const setNodeEnv = (v: string | undefined) => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: v,
      configurable: true,
      writable: true,
      enumerable: true,
    })
  }

  beforeEach(() => {
    setNodeEnv('test')
    localStorage.clear()
    window.history.pushState({}, '', '/')
    delete process.env.NEXT_PUBLIC_FF_RANKING_V2
    delete process.env.NEXT_PUBLIC_FF_EXPERIMENTS_ENABLED
    delete process.env.FF_RANKING_V2
    delete process.env.FF_EXPERIMENTS_ENABLED
  })

  afterEach(() => {
    setNodeEnv(originalNodeEnv)
    localStorage.clear()
    window.history.pushState({}, '', '/')
  })

  it('resolves precedence: query > localStorage > env > default', () => {
    process.env.NEXT_PUBLIC_FF_RANKING_V2 = 'control'
    setFlag('RANKING_V2', 'beta')
    window.history.pushState({}, '', '/?ff_RANKING_V2=control')
    expect(getFlag('RANKING_V2')).toBe('control')

    window.history.pushState({}, '', '/')
    expect(getFlag('RANKING_V2')).toBe('beta')

    resetFlags()
    expect(getFlag('RANKING_V2')).toBe('control')
  })

  it('parses boolean flags (set/get + isEnabled)', () => {
    expect(isEnabled('EXPERIMENTS_ENABLED')).toBe(true)
    setFlag('EXPERIMENTS_ENABLED', false)
    expect(getFlag('EXPERIMENTS_ENABLED')).toBe(false)
    expect(isEnabled('EXPERIMENTS_ENABLED')).toBe(false)
  })

  it('ignores dev overrides in production and disallows setFlag()', () => {
    setNodeEnv('production')
    process.env.NEXT_PUBLIC_FF_RANKING_V2 = 'beta'
    localStorage.setItem('ff_RANKING_V2', 'control')
    window.history.pushState({}, '', '/?ff_RANKING_V2=control')

    // Query + localStorage ignored in prod; env still applies.
    expect(getFlag('RANKING_V2')).toBe('beta')

    expect(() => setFlag('RANKING_V2', 'control')).toThrow(/dev-only/i)
  })

  it('listFlags() includes source attribution', () => {
    process.env.NEXT_PUBLIC_FF_RANKING_V2 = 'beta'
    const flags = listFlags()
    const ranking = flags.find(f => f.name === 'RANKING_V2')
    expect(ranking?.value).toBe('beta')
    expect(ranking?.source).toBe('env')
  })
})
