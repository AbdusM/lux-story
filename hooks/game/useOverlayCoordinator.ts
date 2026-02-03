/**
 * Overlay Coordinator Hook
 *
 * Phase 4A: Extracts overlay/modal visibility state from StatefulGameInterface.
 * Manages visibility for JourneySummary, StrategyReport, IdentityCeremony, etc.
 *
 * This is a pure UI state hook - no game state mutations.
 */

import { useState, useCallback } from 'react'
import type { PatternType } from '@/lib/patterns'
import type { JourneyNarrative } from '@/lib/journey-narrative-generator'

export interface OverlayState {
  showJourneySummary: boolean
  showReport: boolean
  showIdentityCeremony: boolean
  showPatternEnding: boolean
  showExperienceSummary: boolean

  /** Data for JourneySummary overlay */
  journeyNarrative: JourneyNarrative | null

  /** Pattern for IdentityCeremony overlay */
  ceremonyPattern: PatternType | null

  /** Pattern for JourneyComplete overlay */
  endingPattern: PatternType | null

  /** Data for experience summary */
  experienceSummaryData: unknown | null
}

export interface OverlayCoordinator {
  /** Current overlay visibility state */
  state: OverlayState

  /** Show JourneySummary with narrative */
  showJourneySummary: (narrative: JourneyNarrative) => void

  /** Hide JourneySummary */
  hideJourneySummary: () => void

  /** Show StrategyReport */
  showReport: () => void

  /** Hide StrategyReport */
  hideReport: () => void

  /** Show IdentityCeremony with pattern */
  showIdentityCeremony: (pattern: PatternType) => void

  /** Hide IdentityCeremony */
  hideIdentityCeremony: () => void

  /** Show PatternEnding with pattern */
  showPatternEnding: (pattern: PatternType) => void

  /** Hide PatternEnding */
  hidePatternEnding: () => void

  /** Show ExperienceSummary with data */
  showExperienceSummary: (data: unknown) => void

  /** Hide ExperienceSummary */
  hideExperienceSummary: () => void

  /** Close all overlays */
  closeAll: () => void

  /** Check if any overlay is open */
  isAnyOverlayOpen: boolean
}

const INITIAL_STATE: OverlayState = {
  showJourneySummary: false,
  showReport: false,
  showIdentityCeremony: false,
  showPatternEnding: false,
  showExperienceSummary: false,
  journeyNarrative: null,
  ceremonyPattern: null,
  endingPattern: null,
  experienceSummaryData: null,
}

/**
 * Manages overlay/modal visibility state for the game interface.
 *
 * @example
 * ```tsx
 * const overlays = useOverlayCoordinator()
 *
 * // In render
 * {overlays.state.showJourneySummary && overlays.state.journeyNarrative && (
 *   <JourneySummary
 *     narrative={overlays.state.journeyNarrative}
 *     onClose={overlays.hideJourneySummary}
 *   />
 * )}
 * ```
 */
export function useOverlayCoordinator(): OverlayCoordinator {
  const [state, setState] = useState<OverlayState>(INITIAL_STATE)

  const showJourneySummaryFn = useCallback((narrative: JourneyNarrative) => {
    setState(prev => ({
      ...prev,
      showJourneySummary: true,
      journeyNarrative: narrative,
    }))
  }, [])

  const hideJourneySummary = useCallback(() => {
    setState(prev => ({
      ...prev,
      showJourneySummary: false,
      journeyNarrative: null,
    }))
  }, [])

  const showReportFn = useCallback(() => {
    setState(prev => ({ ...prev, showReport: true }))
  }, [])

  const hideReport = useCallback(() => {
    setState(prev => ({ ...prev, showReport: false }))
  }, [])

  const showIdentityCeremonyFn = useCallback((pattern: PatternType) => {
    setState(prev => ({
      ...prev,
      showIdentityCeremony: true,
      ceremonyPattern: pattern,
    }))
  }, [])

  const hideIdentityCeremony = useCallback(() => {
    setState(prev => ({
      ...prev,
      showIdentityCeremony: false,
      ceremonyPattern: null,
    }))
  }, [])

  const showPatternEndingFn = useCallback((pattern: PatternType) => {
    setState(prev => ({
      ...prev,
      showPatternEnding: true,
      endingPattern: pattern,
    }))
  }, [])

  const hidePatternEnding = useCallback(() => {
    setState(prev => ({
      ...prev,
      showPatternEnding: false,
      endingPattern: null,
    }))
  }, [])

  const showExperienceSummaryFn = useCallback((data: unknown) => {
    setState(prev => ({
      ...prev,
      showExperienceSummary: true,
      experienceSummaryData: data,
    }))
  }, [])

  const hideExperienceSummary = useCallback(() => {
    setState(prev => ({
      ...prev,
      showExperienceSummary: false,
      experienceSummaryData: null,
    }))
  }, [])

  const closeAll = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  const isAnyOverlayOpen =
    state.showJourneySummary ||
    state.showReport ||
    state.showIdentityCeremony ||
    state.showPatternEnding ||
    state.showExperienceSummary

  return {
    state,
    showJourneySummary: showJourneySummaryFn,
    hideJourneySummary,
    showReport: showReportFn,
    hideReport,
    showIdentityCeremony: showIdentityCeremonyFn,
    hideIdentityCeremony,
    showPatternEnding: showPatternEndingFn,
    hidePatternEnding,
    showExperienceSummary: showExperienceSummaryFn,
    hideExperienceSummary,
    closeAll,
    isAnyOverlayOpen,
  }
}
