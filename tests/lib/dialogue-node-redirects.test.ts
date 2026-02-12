import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { DIALOGUE_NODE_REDIRECTS, resolveDialogueNodeRedirect } from '@/lib/dialogue-node-redirects'

const originalRedirects = { ...DIALOGUE_NODE_REDIRECTS }

describe('dialogue node redirects', () => {
  beforeEach(() => {
    for (const key of Object.keys(DIALOGUE_NODE_REDIRECTS)) {
      delete DIALOGUE_NODE_REDIRECTS[key]
    }
  })

  afterEach(() => {
    for (const key of Object.keys(DIALOGUE_NODE_REDIRECTS)) {
      delete DIALOGUE_NODE_REDIRECTS[key]
    }
    Object.assign(DIALOGUE_NODE_REDIRECTS, originalRedirects)
  })

  it('returns original node when no redirect exists', () => {
    const result = resolveDialogueNodeRedirect('node_a')
    expect(result.resolvedNodeId).toBe('node_a')
    expect(result.hops).toBe(0)
    expect(result.cycleDetected).toBe(false)
    expect(result.truncated).toBe(false)
  })

  it('resolves chained redirects', () => {
    DIALOGUE_NODE_REDIRECTS.node_a = {
      toNodeId: 'node_b',
      reason: 'split',
      addedAt: '2026-02-11',
    }
    DIALOGUE_NODE_REDIRECTS.node_b = {
      toNodeId: 'node_c',
      reason: 'merge',
      addedAt: '2026-02-11',
    }

    const result = resolveDialogueNodeRedirect('node_a')
    expect(result.resolvedNodeId).toBe('node_c')
    expect(result.path).toEqual(['node_a', 'node_b', 'node_c'])
    expect(result.hops).toBe(2)
    expect(result.cycleDetected).toBe(false)
    expect(result.truncated).toBe(false)
  })

  it('detects cycles', () => {
    DIALOGUE_NODE_REDIRECTS.node_a = {
      toNodeId: 'node_b',
      reason: 'split',
      addedAt: '2026-02-11',
    }
    DIALOGUE_NODE_REDIRECTS.node_b = {
      toNodeId: 'node_a',
      reason: 'invalid cycle',
      addedAt: '2026-02-11',
    }

    const result = resolveDialogueNodeRedirect('node_a')
    expect(result.cycleDetected).toBe(true)
    expect(result.path).toEqual(['node_a', 'node_b', 'node_a'])
  })
})

