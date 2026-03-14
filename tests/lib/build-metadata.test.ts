import { describe, expect, test } from 'vitest'

import { normalizeCommitSha, resolveBuildMetadata } from '@/lib/build-metadata'

describe('build metadata', () => {
  test('normalizes valid commit shas', () => {
    expect(normalizeCommitSha('ABCDEF1234567')).toBe('abcdef1234567')
    expect(normalizeCommitSha('  abcdef1  ')).toBe('abcdef1')
  })

  test('rejects invalid commit shas', () => {
    expect(normalizeCommitSha('')).toBeNull()
    expect(normalizeCommitSha('release-123')).toBeNull()
    expect(normalizeCommitSha('abc123')).toBeNull()
  })

  test('resolves build metadata from environment-like input', () => {
    const metadata = resolveBuildMetadata({
      VERCEL_GIT_COMMIT_SHA: 'ABCDEF1234567890',
      VERCEL_URL: 'lux-story-preview.vercel.app',
    })

    expect(metadata.version).toBeDefined()
    expect(metadata.commitSha).toBe('abcdef1234567890')
    expect(metadata.commitShaShort).toBe('abcdef1')
    expect(metadata.deploymentUrl).toBe('https://lux-story-preview.vercel.app')
  })

  test('falls back to nulls when commit or deployment data are not usable', () => {
    const metadata = resolveBuildMetadata({
      VERCEL_GIT_COMMIT_SHA: 'not-a-sha',
      VERCEL_URL: '',
    })

    expect(metadata.commitSha).toBeNull()
    expect(metadata.commitShaShort).toBeNull()
    expect(metadata.deploymentUrl).toBeNull()
  })
})
