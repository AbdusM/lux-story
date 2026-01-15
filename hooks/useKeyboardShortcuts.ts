/**
 * Keyboard Shortcuts Hook
 * Manages global keyboard shortcuts and action handlers
 *
 * Usage:
 * const { registerHandler, shortcuts } = useKeyboardShortcuts()
 * registerHandler('toggleJournal', () => setShowJournal(true))
 */

'use client'

import { useEffect, useCallback, useState } from 'react'
import {
  ShortcutAction,
  getEffectiveShortcuts,
  matchesKeyCombo,
  saveCustomShortcuts,
  loadCustomShortcuts,
  resetShortcuts as resetShortcutsLib,
} from '@/lib/keyboard-shortcuts'

type ShortcutHandler = () => void

export function useKeyboardShortcuts() {
  const [shortcuts, setShortcuts] = useState(getEffectiveShortcuts())
  const [handlers, setHandlers] = useState<Map<ShortcutAction, ShortcutHandler>>(new Map())

  /**
   * Register a handler for a specific action
   */
  const registerHandler = useCallback((action: ShortcutAction, handler: ShortcutHandler) => {
    setHandlers((prev) => {
      const next = new Map(prev)
      next.set(action, handler)
      return next
    })
  }, [])

  /**
   * Unregister a handler
   */
  const unregisterHandler = useCallback((action: ShortcutAction) => {
    setHandlers((prev) => {
      const next = new Map(prev)
      next.delete(action)
      return next
    })
  }, [])

  /**
   * Update a shortcut key binding
   */
  const updateShortcut = useCallback((action: ShortcutAction, newKey: string) => {
    const custom = loadCustomShortcuts()
    custom[action] = newKey
    saveCustomShortcuts(custom)
    setShortcuts(getEffectiveShortcuts())
  }, [])

  /**
   * Reset all shortcuts to defaults
   */
  const resetShortcuts = useCallback(() => {
    resetShortcutsLib()
    setShortcuts(getEffectiveShortcuts())
  }, [])

  /**
   * Global keyboard event listener
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Exception: Allow Escape to work in inputs
        if (event.key !== 'Escape') {
          return
        }
      }

      // Check each shortcut
      Object.entries(shortcuts).forEach(([action, shortcut]) => {
        if (matchesKeyCombo(event, shortcut.key)) {
          const handler = handlers.get(action as ShortcutAction)
          if (handler) {
            event.preventDefault()
            handler()
          }
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, handlers])

  return {
    shortcuts,
    registerHandler,
    unregisterHandler,
    updateShortcut,
    resetShortcuts,
  }
}
