import { describe, expect, it } from 'vitest'
import type { Quest } from '@/lib/quest-system'
import { getQuestPrismTab } from '@/lib/quest-system'

describe('Quest prism tab mapping', () => {
  it('maps character arcs to essence', () => {
    const q: Quest = {
      id: 't_arc',
      title: 'T',
      description: 'd',
      type: 'character_arc',
      characterId: 'maya',
      status: 'active',
      unlockCondition: {},
      completeCondition: {},
    }
    expect(getQuestPrismTab(q)).toBe('essence')
  })

  it('maps pattern mastery to mastery', () => {
    const q: Quest = {
      id: 'pattern_mastery',
      title: 'T',
      description: 'd',
      type: 'discovery',
      status: 'active',
      unlockCondition: {},
      completeCondition: {},
    }
    expect(getQuestPrismTab(q)).toBe('mastery')
  })

  it('maps other discovery quests to mysteries', () => {
    const q: Quest = {
      id: 'station_secrets',
      title: 'T',
      description: 'd',
      type: 'discovery',
      status: 'active',
      unlockCondition: {},
      completeCondition: {},
    }
    expect(getQuestPrismTab(q)).toBe('mysteries')
  })
})

