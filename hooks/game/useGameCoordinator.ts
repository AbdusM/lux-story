/**
 * Game Coordinator Hook
 *
 * Phase 4A: Unified coordinator that composes all UI state management.
 * This is the single entry point for StatefulGameInterface to manage:
 * - Panel visibility (Journal, Constellation)
 * - Overlay visibility (JourneySummary, Report, Ceremony, etc.)
 *
 * ARCHITECTURE RULE: Coordinators may READ store/selectors,
 * but only StatefulGameInterface (or commitGameState) writes game state.
 *
 * @example
 * ```tsx
 * function StatefulGameInterface() {
 *   const { panels, overlays } = useGameCoordinator()
 *
 *   return (
 *     <>
 *       <Journal isOpen={panels.state.showJournal} onClose={panels.closeJournal} />
 *       <ConstellationPanel isOpen={panels.state.showConstellation} onClose={panels.closeConstellation} />
 *       {overlays.state.showJourneySummary && <JourneySummary ... />}
 *     </>
 *   )
 * }
 * ```
 */

import { usePanelCoordinator, type PanelCoordinator } from './usePanelCoordinator'
import { useOverlayCoordinator, type OverlayCoordinator } from './useOverlayCoordinator'

export interface GameCoordinator {
  /** Panel visibility management (Journal, Constellation) */
  panels: PanelCoordinator

  /** Overlay/modal visibility management */
  overlays: OverlayCoordinator

  /** Check if any panel or overlay is currently open */
  isAnyUIOpen: boolean

  /** Close all panels and overlays */
  closeAllUI: () => void
}

/**
 * Unified coordinator for game UI state.
 * Composes panel and overlay coordinators into a single interface.
 */
export function useGameCoordinator(): GameCoordinator {
  const panels = usePanelCoordinator()
  const overlays = useOverlayCoordinator()

  const isAnyUIOpen = panels.isAnyPanelOpen || overlays.isAnyOverlayOpen

  const closeAllUI = () => {
    panels.closeAll()
    overlays.closeAll()
  }

  return {
    panels,
    overlays,
    isAnyUIOpen,
    closeAllUI,
  }
}

// Re-export types for convenience
export type { PanelCoordinator, PanelState } from './usePanelCoordinator'
export type { OverlayCoordinator, OverlayState } from './useOverlayCoordinator'
