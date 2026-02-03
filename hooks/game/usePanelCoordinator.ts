/**
 * Panel Coordinator Hook
 *
 * Phase 4A: Extracts panel visibility state from StatefulGameInterface.
 * Manages Journal and Constellation panel open/close states.
 *
 * This is a pure UI state hook - no game state mutations.
 */

import { useState, useCallback } from 'react'

export interface PanelState {
  showJournal: boolean
  showConstellation: boolean
}

export interface PanelCoordinator {
  /** Current panel visibility state */
  state: PanelState

  /** Toggle Journal panel visibility */
  toggleJournal: () => void

  /** Toggle Constellation panel visibility */
  toggleConstellation: () => void

  /** Open Journal panel */
  openJournal: () => void

  /** Close Journal panel */
  closeJournal: () => void

  /** Open Constellation panel */
  openConstellation: () => void

  /** Close Constellation panel */
  closeConstellation: () => void

  /** Close all panels */
  closeAll: () => void

  /** Check if any panel is open */
  isAnyPanelOpen: boolean
}

/**
 * Manages panel visibility state for the game interface.
 *
 * @example
 * ```tsx
 * const panels = usePanelCoordinator()
 *
 * // In render
 * <Journal isOpen={panels.state.showJournal} onClose={panels.closeJournal} />
 * <ConstellationPanel isOpen={panels.state.showConstellation} onClose={panels.closeConstellation} />
 *
 * // In nav
 * <Button onClick={panels.toggleJournal}>Journal</Button>
 * ```
 */
export function usePanelCoordinator(): PanelCoordinator {
  const [state, setState] = useState<PanelState>({
    showJournal: false,
    showConstellation: false,
  })

  const toggleJournal = useCallback(() => {
    setState(prev => ({ ...prev, showJournal: !prev.showJournal }))
  }, [])

  const toggleConstellation = useCallback(() => {
    setState(prev => ({ ...prev, showConstellation: !prev.showConstellation }))
  }, [])

  const openJournal = useCallback(() => {
    setState(prev => ({ ...prev, showJournal: true }))
  }, [])

  const closeJournal = useCallback(() => {
    setState(prev => ({ ...prev, showJournal: false }))
  }, [])

  const openConstellation = useCallback(() => {
    setState(prev => ({ ...prev, showConstellation: true }))
  }, [])

  const closeConstellation = useCallback(() => {
    setState(prev => ({ ...prev, showConstellation: false }))
  }, [])

  const closeAll = useCallback(() => {
    setState({ showJournal: false, showConstellation: false })
  }, [])

  const isAnyPanelOpen = state.showJournal || state.showConstellation

  return {
    state,
    toggleJournal,
    toggleConstellation,
    openJournal,
    closeJournal,
    openConstellation,
    closeConstellation,
    closeAll,
    isAnyPanelOpen,
  }
}
