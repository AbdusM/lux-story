/**
 * Keyboard Shortcuts Hook
 * Manages global keyboard shortcuts and action handlers
 *
 * Usage:
 * const { registerHandler, shortcuts } = useKeyboardShortcuts()
 * registerHandler('toggleJournal', () => setShowJournal(true))
 */

'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import {
  ShortcutAction,
  getEffectiveShortcuts,
  matchesKeyCombo,
  saveCustomShortcuts,
  loadCustomShortcuts,
  resetShortcuts as resetShortcutsLib,
} from '@/lib/keyboard-shortcuts'

type ShortcutHandler = () => void

interface KeyboardShortcutsOptions {
  /**
   * Return true when global shortcuts should be blocked (for example, while an
   * overlay/modal is open).
   *
   * Prefer this over per-component window listeners for determinism.
   */
  getIsBlocked?: () => boolean
  /**
   * Actions allowed while blocked. Default is Escape only (if a handler exists).
   */
  allowedActionsWhenBlocked?: ShortcutAction[]
  /**
   * Dynamic allowlist while blocked (for example, from overlay metadata).
   *
   * Escape is always allowlisted; dismissal is still governed by overlay policy.
   */
  getAllowedActionsWhenBlocked?: () => ShortcutAction[]
}

function isEditableTarget(target: HTMLElement | null): boolean {
  if (!target) return false

  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true

  // ARIA roles used by some custom components.
  const role = target.getAttribute('role')
  if (role === 'textbox' || role === 'combobox' || role === 'searchbox') return true

  return false
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const [shortcuts, setShortcuts] = useState(getEffectiveShortcuts())
  const [handlers, setHandlers] = useState<Map<ShortcutAction, ShortcutHandler>>(new Map())
  const optionsRef = useRef(options)
  optionsRef.current = options

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
      if (event.defaultPrevented) return
      if (event.isComposing || event.keyCode === 229) return

      const { getIsBlocked, allowedActionsWhenBlocked, getAllowedActionsWhenBlocked } = optionsRef.current
      const isBlocked = getIsBlocked?.() ?? false
      const allowed = isBlocked
        ? new Set<ShortcutAction>([
            'escape',
            ...(allowedActionsWhenBlocked ?? []),
            ...(getAllowedActionsWhenBlocked?.() ?? []),
          ])
        : null

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (isEditableTarget(target)) {
        // Exception: Allow Escape to work in inputs
        if (event.key !== 'Escape') return
      }

      // Check each shortcut
      Object.entries(shortcuts).forEach(([action, shortcut]) => {
        if (isBlocked && allowed && !allowed.has(action as ShortcutAction)) return
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
