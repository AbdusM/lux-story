/**
 * Keyboard Shortcuts Help Modal
 * Shows all available shortcuts and allows customization
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard, RotateCcw } from 'lucide-react'
import {
  KeyboardShortcut,
  ShortcutAction,
  CATEGORY_LABELS,
  formatKeyCombo,
} from '@/lib/keyboard-shortcuts'
import { springs } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
  shortcuts: Record<ShortcutAction, KeyboardShortcut>
  onUpdateShortcut?: (action: ShortcutAction, newKey: string) => void
  onResetShortcuts?: () => void
}

export function KeyboardShortcutsHelp({
  isOpen,
  onClose,
  shortcuts,
  onUpdateShortcut,
  onResetShortcuts,
}: KeyboardShortcutsHelpProps) {
  const [editingAction, setEditingAction] = useState<ShortcutAction | null>(null)
  const [recordingKey, setRecordingKey] = useState(false)

  // Group shortcuts by category
  const groupedShortcuts = Object.values(shortcuts).reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<KeyboardShortcut['category'], KeyboardShortcut[]>)

  const handleStartRecording = (action: ShortcutAction) => {
    setEditingAction(action)
    setRecordingKey(true)
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!recordingKey || !editingAction) return

    event.preventDefault()

    // Build key combo string
    const parts: string[] = []
    if (event.ctrlKey) parts.push('ctrl')
    if (event.altKey) parts.push('alt')
    if (event.shiftKey) parts.push('shift')
    if (event.metaKey) parts.push('meta')

    // Add the actual key
    const key = event.key.toLowerCase()
    if (key !== 'control' && key !== 'alt' && key !== 'shift' && key !== 'meta') {
      parts.push(key)
    }

    if (parts.length > 0 && parts[parts.length - 1] !== parts[0]) {
      const combo = parts.join('+')
      onUpdateShortcut?.(editingAction, combo)
      setRecordingKey(false)
      setEditingAction(null)
    }
  }

  useState(() => {
    if (recordingKey) {
      window.addEventListener('keydown', handleKeyPress as EventListener)
      return () => window.removeEventListener('keydown', handleKeyPress as EventListener)
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto glass-panel-solid !rounded-2xl border border-white/10 shadow-2xl z-[101] p-6 max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={springs.smooth}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Keyboard className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-white">
                  Keyboard Shortcuts
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {onResetShortcuts && (
                  <button
                    onClick={onResetShortcuts}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Shortcuts by Category */}
            <div className="space-y-6">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {CATEGORY_LABELS[category as KeyboardShortcut['category']]}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut) => (
                      <div
                        key={shortcut.action}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="text-white">{shortcut.description}</span>

                        {shortcut.customizable && onUpdateShortcut ? (
                          <button
                            onClick={() => handleStartRecording(shortcut.action)}
                            className={cn(
                              'px-3 py-1.5 rounded-md font-mono text-sm transition-all',
                              editingAction === shortcut.action && recordingKey
                                ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50 animate-pulse'
                                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'
                            )}
                          >
                            {editingAction === shortcut.action && recordingKey
                              ? 'Press key...'
                              : formatKeyCombo(shortcut.key)}
                          </button>
                        ) : (
                          <kbd className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md font-mono text-sm border border-slate-600">
                            {formatKeyCombo(shortcut.key)}
                          </kbd>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Hint */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-slate-500 text-center">
                Press <kbd className="px-2 py-1 bg-slate-700/50 rounded text-slate-400">?</kbd> anytime to show this help
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
