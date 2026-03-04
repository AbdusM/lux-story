import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { OVERLAY_CONFIG, OVERLAY_INTENT_TIER, type OverlayConfig, type OverlayDismissReason, type OverlayId } from '@/lib/overlay-config'
import { type ShortcutAction } from '@/lib/keyboard-shortcuts'

export interface OverlayEntry {
  id: OverlayId
  openedAt: number
  data?: Record<string, unknown>
}

export interface OverlayState {
  overlayStack: OverlayEntry[]
}

export interface OverlayActions {
  pushOverlay: (id: OverlayId, data?: Record<string, unknown>) => void
  popOverlay: (params: { reason: OverlayDismissReason }) => void
  closeOverlay: (id: OverlayId, params?: { reason?: OverlayDismissReason }) => void
  closeAll: (params?: { reason?: OverlayDismissReason }) => void

  // Selectors (keep in store to avoid duplicating policy logic).
  isOverlayOpen: (id: OverlayId) => boolean
  getTopOverlayId: () => OverlayId | null
  getHasBlockingGameplayInput: () => boolean
  getHasBlockingGlobalShortcuts: () => boolean
  getAllowedShortcutsWhenBlocked: () => ShortcutAction[]
}

function getOverlayConfig(id: OverlayId): OverlayConfig {
  return OVERLAY_CONFIG[id]
}

function canDismiss(config: OverlayConfig, reason: OverlayDismissReason): boolean {
  if (reason === 'escape') return config.dismissOnEscape
  if (reason === 'backdrop') return config.dismissOnBackdrop
  if (reason === 'closeButton') return config.closeAffordance !== 'none'
  return true
}

function getTier(config: OverlayConfig): number {
  return OVERLAY_INTENT_TIER[config.intent]
}

export const useOverlayStore = create<OverlayState & OverlayActions>()(
  devtools(
    (set, get) => ({
      overlayStack: [],

      pushOverlay: (id, data) => {
        const nextEntry: OverlayEntry = { id, openedAt: Date.now(), data }
        const nextConfig = getOverlayConfig(id)
        const nextTier = getTier(nextConfig)

        set((state) => {
          const current = state.overlayStack
          const withoutAutoDismiss = current.filter((entry) => {
            // Never auto-dismiss the overlay we're actively pushing.
            if (entry.id === id) return true
            return !getOverlayConfig(entry.id).autoDismissOnOverlayPush
          })
          const exclusiveGroup = nextConfig.exclusiveGroup
          const filtered = exclusiveGroup
            ? withoutAutoDismiss.filter((entry) => getOverlayConfig(entry.id).exclusiveGroup !== exclusiveGroup)
            : withoutAutoDismiss

          // Keep critical intent overlays always on top.
          if (nextConfig.intent === 'critical') {
            return { overlayStack: [...filtered, nextEntry] }
          }

          // If we’re pushing an overlay with the same tier and no exclusive group, replace the
          // most-recent overlay of that tier. This keeps the stack shallow and avoids multiple
          // modals at the same tier unless we explicitly introduce that behavior later.
          if (!exclusiveGroup) {
            for (let i = filtered.length - 1; i >= 0; i -= 1) {
              const tier = getTier(getOverlayConfig(filtered[i].id))
              if (tier === nextTier) {
                const next = filtered.slice()
                next[i] = nextEntry
                return { overlayStack: next }
              }
              // Stack is tier-ordered; once we hit a lower tier, no earlier entries can match.
              if (tier < nextTier) break
            }
          }

          // Insert under any higher-tier overlays so "tier" remains deterministic regardless
          // of call order (for example, opening a panel while a modal is already open).
          const insertAt = filtered.findIndex((entry) => getTier(getOverlayConfig(entry.id)) > nextTier)
          if (insertAt === -1) return { overlayStack: [...filtered, nextEntry] }

          const next = filtered.slice()
          next.splice(insertAt, 0, nextEntry)
          return { overlayStack: next }
        })
      },

      popOverlay: ({ reason }) => {
        set((state) => {
          if (state.overlayStack.length === 0) return state

          const top = state.overlayStack[state.overlayStack.length - 1]
          const config = getOverlayConfig(top.id)
          if (!canDismiss(config, reason)) return state

          return { overlayStack: state.overlayStack.slice(0, -1) }
        })
      },

      closeOverlay: (id, params) => {
        const reason = params?.reason ?? 'programmatic'
        set((state) => {
          const idx = state.overlayStack.findIndex((entry) => entry.id === id)
          if (idx === -1) return state

          const config = getOverlayConfig(state.overlayStack[idx].id)
          if (!canDismiss(config, reason)) return state

          const next = state.overlayStack.slice()
          next.splice(idx, 1)
          return { overlayStack: next }
        })
      },

      closeAll: (params) => {
        const reason = params?.reason ?? 'programmatic'
        set((state) => {
          if (state.overlayStack.length === 0) return state

          // Callers should use popOverlay() for Escape/backdrop semantics.
          if (reason === 'escape' || reason === 'backdrop') return state

          return { overlayStack: [] }
        })
      },

      isOverlayOpen: (id) => get().overlayStack.some((entry) => entry.id === id),

      getTopOverlayId: () => {
        const stack = get().overlayStack
        return stack.length ? stack[stack.length - 1].id : null
      },

      getHasBlockingGameplayInput: () => {
        const stack = get().overlayStack
        return stack.some((entry) => getOverlayConfig(entry.id).blocksGameplayInput)
      },

      getHasBlockingGlobalShortcuts: () => {
        const stack = get().overlayStack
        return stack.some((entry) => getOverlayConfig(entry.id).blocksGlobalShortcuts)
      },

      getAllowedShortcutsWhenBlocked: () => {
        const stack = get().overlayStack
        let allowed: Set<ShortcutAction> | null = null

        for (const entry of stack) {
          const config = getOverlayConfig(entry.id)
          if (!config.blocksGlobalShortcuts) continue

          const entryAllowed = new Set<ShortcutAction>(config.allowedShortcutsWhenBlocked)
          if (!allowed) {
            allowed = entryAllowed
            continue
          }

          // Intersection so "more restrictive" overlays always win.
          for (const action of Array.from(allowed)) {
            if (!entryAllowed.has(action)) allowed.delete(action)
          }
        }

        return allowed ? Array.from(allowed) : []
      },
    }),
    { name: 'overlay-store' }
  )
)
