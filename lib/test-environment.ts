import type { SerializableGameState } from './character-state'

/**
 * Test Environment Detection
 *
 * Detects if running in Playwright E2E test environment
 * Used to disable background sync and other production-only features during testing
 */

/**
 * Detects if running in Playwright E2E test environment
 *
 * @returns true if running in test environment, false otherwise
 */
export function isTestEnvironment(): boolean {
  if (typeof window === 'undefined') return false

  // Check for Playwright marker (set by test fixtures)
  if (window.__PLAYWRIGHT__) return true

  // Check for navigator.webdriver (Playwright sets this)
  if (navigator.webdriver === true) return true

  return false
}

declare global {
  interface Window {
    __PLAYWRIGHT__?: boolean
    __LUX_E2E_SEED__?: SerializableGameState
    __LUX_E2E_SIM_TIME_SCALE__?: number
  }
}
