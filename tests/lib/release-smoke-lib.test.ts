import { describe, expect, test } from 'vitest'

import {
  commitMatchesExpected,
  normalizeCommitSha,
  readPositiveInteger,
} from '../../scripts/ci/release-smoke-lib.mjs'

describe('release smoke commit helpers', () => {
  test('normalizes valid commit shas', () => {
    expect(normalizeCommitSha(' ABCDEF1234567 ')).toBe('abcdef1234567')
  })

  test('treats prefix matches as equivalent for expected commit checks', () => {
    expect(commitMatchesExpected('abcdef1234567890', 'abcdef1')).toBe(true)
    expect(commitMatchesExpected('abcdef1', 'abcdef1234567890')).toBe(true)
  })

  test('rejects non-matching or invalid commit comparisons', () => {
    expect(commitMatchesExpected('abcdef1234567890', '1234567')).toBe(false)
    expect(commitMatchesExpected('not-a-sha', 'abcdef1')).toBe(false)
  })

  test('reads positive integers with fallback', () => {
    expect(readPositiveInteger('9000', 5)).toBe(9000)
    expect(readPositiveInteger('0', 5)).toBe(5)
    expect(readPositiveInteger(undefined, 5)).toBe(5)
  })
})
