import { describe, it, expect } from 'vitest'
import { devFreeze, assertFrozen, isDevMode } from '@/lib/dev-freeze'

describe('devFreeze', () => {
  // Note: These tests run in test environment where isDev is true

  it('freezes plain objects', () => {
    const obj = { a: 1, b: 2 }
    const frozen = devFreeze(obj)

    expect(Object.isFrozen(frozen)).toBe(true)
  })

  it('freezes nested objects', () => {
    const obj = {
      level1: {
        level2: {
          value: 'deep'
        }
      }
    }
    const frozen = devFreeze(obj)

    expect(Object.isFrozen(frozen)).toBe(true)
    expect(Object.isFrozen(frozen.level1)).toBe(true)
    expect(Object.isFrozen(frozen.level1.level2)).toBe(true)
  })

  it('freezes arrays', () => {
    const arr = [1, 2, { nested: true }]
    const frozen = devFreeze(arr)

    expect(Object.isFrozen(frozen)).toBe(true)
    expect(Object.isFrozen(frozen[2])).toBe(true)
  })

  it('freezes Maps', () => {
    const map = new Map([['key', 'value']])
    const frozen = devFreeze(map)

    expect(Object.isFrozen(frozen)).toBe(true)
  })

  it('freezes Sets', () => {
    const set = new Set([1, 2, 3])
    const frozen = devFreeze(set)

    expect(Object.isFrozen(frozen)).toBe(true)
  })

  it('handles null and undefined', () => {
    expect(devFreeze(null)).toBe(null)
    expect(devFreeze(undefined)).toBe(undefined)
  })

  it('handles primitives', () => {
    expect(devFreeze(42)).toBe(42)
    expect(devFreeze('string')).toBe('string')
    expect(devFreeze(true)).toBe(true)
  })

  it('handles circular references', () => {
    const obj: Record<string, unknown> = { name: 'circular' }
    obj.self = obj

    // Should not throw due to infinite loop
    const frozen = devFreeze(obj)
    expect(Object.isFrozen(frozen)).toBe(true)
  })

  it('prevents mutations on frozen objects', () => {
    const obj = devFreeze({ value: 1 })

    expect(() => {
      // @ts-expect-error - intentionally testing mutation prevention
      obj.value = 2
    }).toThrow()
  })

  it('prevents array mutations', () => {
    const arr = devFreeze([1, 2, 3])

    expect(() => {
      arr.push(4)
    }).toThrow()
  })
})

describe('assertFrozen', () => {
  it('passes for frozen objects', () => {
    const obj = devFreeze({ a: 1 })
    expect(() => assertFrozen(obj)).not.toThrow()
  })

  it('throws for unfrozen objects in dev mode', () => {
    const obj = { a: 1 }
    expect(() => assertFrozen(obj)).toThrow('Object at root is not frozen')
  })

  it('throws with path for nested unfrozen objects', () => {
    const obj = Object.freeze({
      nested: { value: 1 } // nested is not frozen
    })

    expect(() => assertFrozen(obj)).toThrow('Object at root.nested is not frozen')
  })
})

describe('isDevMode', () => {
  it('returns true in test environment', () => {
    expect(isDevMode()).toBe(true)
  })
})
