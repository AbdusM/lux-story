/**
 * Keyboard Shortcuts System
 * Global keyboard navigation and action shortcuts
 *
 * Key Binding Format: "Modifier+Key" (e.g., "ctrl+k", "shift+j")
 * Modifiers: ctrl, alt, shift, meta (cmd on Mac)
 */

export type ShortcutAction =
  | 'toggleJournal'
  | 'toggleConstellation'
  | 'toggleReport'
  | 'toggleMute'
  | 'openSettings'
  | 'openHelp'
  | 'selectChoice1'
  | 'selectChoice2'
  | 'selectChoice3'
  | 'selectChoice4'
  | 'focusChoices'
  | 'escape'

export interface KeyboardShortcut {
  action: ShortcutAction
  key: string
  description: string
  category: 'navigation' | 'actions' | 'choices' | 'general'
  customizable: boolean
}

export const DEFAULT_SHORTCUTS: Record<ShortcutAction, KeyboardShortcut> = {
  // Navigation
  toggleJournal: {
    action: 'toggleJournal',
    key: 'j',
    description: 'Toggle Journal',
    category: 'navigation',
    customizable: true,
  },
  toggleConstellation: {
    action: 'toggleConstellation',
    key: 'c',
    description: 'Toggle Constellation',
    category: 'navigation',
    customizable: true,
  },
  toggleReport: {
    action: 'toggleReport',
    key: 'r',
    description: 'Toggle Career Report',
    category: 'navigation',
    customizable: true,
  },

  // Actions
  toggleMute: {
    action: 'toggleMute',
    key: 'm',
    description: 'Toggle Audio Mute',
    category: 'actions',
    customizable: true,
  },
  openSettings: {
    action: 'openSettings',
    key: ',',
    description: 'Open Settings',
    category: 'actions',
    customizable: true,
  },
  openHelp: {
    action: 'openHelp',
    key: '?',
    description: 'Show Keyboard Shortcuts',
    category: 'general',
    customizable: false,
  },

  // Choice Selection
  selectChoice1: {
    action: 'selectChoice1',
    key: '1',
    description: 'Select Choice 1',
    category: 'choices',
    customizable: true,
  },
  selectChoice2: {
    action: 'selectChoice2',
    key: '2',
    description: 'Select Choice 2',
    category: 'choices',
    customizable: true,
  },
  selectChoice3: {
    action: 'selectChoice3',
    key: '3',
    description: 'Select Choice 3',
    category: 'choices',
    customizable: true,
  },
  selectChoice4: {
    action: 'selectChoice4',
    key: '4',
    description: 'Select Choice 4',
    category: 'choices',
    customizable: true,
  },
  focusChoices: {
    action: 'focusChoices',
    key: 'tab',
    description: 'Focus Choice Buttons',
    category: 'choices',
    customizable: false,
  },

  // General
  escape: {
    action: 'escape',
    key: 'escape',
    description: 'Close Modals/Panels',
    category: 'general',
    customizable: false,
  },
}

export const CATEGORY_LABELS: Record<KeyboardShortcut['category'], string> = {
  navigation: 'Navigation',
  actions: 'Actions',
  choices: 'Dialogue Choices',
  general: 'General',
}

/**
 * Parse key combination string (e.g., "ctrl+shift+k")
 */
export function parseKeyCombo(combo: string): {
  key: string
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
} {
  const parts = combo.toLowerCase().split('+')
  const key = parts[parts.length - 1]

  return {
    key,
    ctrl: parts.includes('ctrl'),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
    meta: parts.includes('meta') || parts.includes('cmd'),
  }
}

/**
 * Check if keyboard event matches key combo
 */
export function matchesKeyCombo(event: KeyboardEvent, combo: string): boolean {
  const parsed = parseKeyCombo(combo)

  // Normalize key names
  const eventKey = event.key.toLowerCase()
  const targetKey = parsed.key.toLowerCase()

  // Special key mappings
  const keyMatch = eventKey === targetKey ||
    (targetKey === 'escape' && eventKey === 'escape') ||
    (targetKey === 'tab' && eventKey === 'tab')

  if (!keyMatch) return false

  // Check modifiers
  return (
    event.ctrlKey === parsed.ctrl &&
    event.altKey === parsed.alt &&
    event.shiftKey === parsed.shift &&
    event.metaKey === parsed.meta
  )
}

/**
 * Format key combo for display (e.g., "Ctrl+K")
 */
export function formatKeyCombo(combo: string): string {
  const parts = combo.split('+')
  return parts
    .map((part) => {
      const lower = part.toLowerCase()
      if (lower === 'ctrl') return '⌃'
      if (lower === 'alt') return '⌥'
      if (lower === 'shift') return '⇧'
      if (lower === 'meta' || lower === 'cmd') return '⌘'
      if (lower === 'escape') return 'Esc'
      if (lower === 'tab') return 'Tab'
      return part.toUpperCase()
    })
    .join('')
}

/**
 * Load custom shortcuts from localStorage
 */
export function loadCustomShortcuts(): Partial<Record<ShortcutAction, string>> {
  if (typeof window === 'undefined') return {}

  const stored = localStorage.getItem('lux_keyboard_shortcuts')
  if (!stored) return {}

  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

/**
 * Save custom shortcuts to localStorage
 */
export function saveCustomShortcuts(shortcuts: Partial<Record<ShortcutAction, string>>): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('lux_keyboard_shortcuts', JSON.stringify(shortcuts))
}

/**
 * Get effective shortcuts (defaults + custom overrides)
 */
export function getEffectiveShortcuts(): Record<ShortcutAction, KeyboardShortcut> {
  const custom = loadCustomShortcuts()
  const effective = { ...DEFAULT_SHORTCUTS }

  // Apply custom overrides
  Object.entries(custom).forEach(([action, key]) => {
    if (effective[action as ShortcutAction]) {
      effective[action as ShortcutAction] = {
        ...effective[action as ShortcutAction],
        key,
      }
    }
  })

  return effective
}

/**
 * Reset shortcuts to defaults
 */
export function resetShortcuts(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('lux_keyboard_shortcuts')
}
