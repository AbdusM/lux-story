/**
 * Browser API Type Augmentations
 *
 * Provides TypeScript declarations for non-standard browser APIs
 * and custom window properties used in the application.
 *
 * This eliminates the need for @ts-expect-error comments when accessing:
 * - navigator.deviceMemory (non-standard, Chrome/Edge only)
 * - navigator.connection (Network Information API, non-standard)
 * - window.godMode (development-only testing API)
 * - window.userMonitor (development-only monitoring API)
 */

import type { GodModeAPI } from '@/lib/dev-tools/god-mode-api'

/**
 * Network Information API (non-standard)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */
interface NetworkInformation {
  /** Whether the user has requested reduced data usage */
  saveData?: boolean
  /** Connection type (e.g., 'wifi', '4g', '3g') */
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g'
  /** Estimated round-trip time in milliseconds */
  rtt?: number
  /** Estimated downlink speed in Mbps */
  downlink?: number
}

/**
 * User Monitor API (development debugging)
 */
interface UserMonitorAPI {
  dashboard: () => void
  summary: (userId: string) => unknown
  recent: (limit?: number) => unknown[]
  clear: () => void
}

declare global {
  interface Navigator {
    /**
     * Device memory in gigabytes (non-standard)
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory
     */
    deviceMemory?: number

    /**
     * Network Information API (non-standard)
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
     */
    connection?: NetworkInformation
  }

  interface Window {
    /**
     * God Mode API - Development-only testing utilities
     * Only available in development mode
     */
    godMode?: GodModeAPI

    /**
     * User Monitor API - Development-only user tracking dashboard
     * Only available in development mode
     */
    userMonitor?: UserMonitorAPI

    /**
     * Flag to prevent sync queue hammering during bulk God Mode operations
     */
    __GOD_MODE_ACTIVE?: boolean

    /**
     * Flag set by GodModeBootstrap when educator role is verified
     * Required for createGodModeAPI() to function in production
     */
    __GOD_MODE_AUTHORIZED?: boolean
  }
}

export {}
