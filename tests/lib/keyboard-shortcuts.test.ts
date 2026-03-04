import { describe, expect, test } from 'vitest'

import { DEFAULT_SHORTCUTS, matchesKeyCombo } from '@/lib/keyboard-shortcuts'

describe('keyboard shortcuts', () => {
  test('default help shortcut is shift+/', () => {
    expect(DEFAULT_SHORTCUTS.openHelp.key).toBe('shift+/')
  })

  test('matches shift+/ when keydown emits ? with shift', () => {
    const event = new KeyboardEvent('keydown', { key: '?', shiftKey: true })
    expect(matchesKeyCombo(event, 'shift+/')).toBe(true)
  })

  test('does not match shift+/ when shift is not pressed', () => {
    const event = new KeyboardEvent('keydown', { key: '/' })
    expect(matchesKeyCombo(event, 'shift+/')).toBe(false)
  })
})
