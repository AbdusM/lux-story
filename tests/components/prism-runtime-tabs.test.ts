import { describe, expect, it } from 'vitest'

import { PRISM_BASE_TABS, PRISM_GOD_MODE_TAB, getPrismRuntimeTabs } from '@/lib/prism-tabs-config'

describe('Prism runtime tab config', () => {
  it('matches current runtime base tab matrix and excludes legacy Ranks', () => {
    const labels = PRISM_BASE_TABS.map((t) => t.label)
    const ids = PRISM_BASE_TABS.map((t) => t.id)

    expect(labels).toEqual([
      'Harmonics',
      'Essence',
      'Mastery',
      'Careers',
      'Combos',
      'Opportunities',
      'Mind',
      'Toolkit',
      'Sims',
      'Cognition',
      'Analysis',
    ])
    expect(labels).not.toContain('Ranks')
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('adds GOD MODE tab only when enabled and keeps it last', () => {
    const withoutGodMode = getPrismRuntimeTabs(false)
    const withGodMode = getPrismRuntimeTabs(true)

    expect(withoutGodMode.some((t) => t.id === 'god_mode')).toBe(false)
    expect(withGodMode[withGodMode.length - 1]).toEqual(PRISM_GOD_MODE_TAB)
  })
})

