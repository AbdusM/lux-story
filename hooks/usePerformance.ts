/**
 * usePerformance - GPU & Device Capability Detection
 *
 * Detects device capabilities to enable graceful degradation
 * for GPU-intensive features like backdrop-filter.
 *
 * Usage:
 *   const { canUseBlur, isLowEndDevice } = usePerformance()
 *   <SentientGlassCard solid={!canUseBlur}>
 */

import { useState, useEffect } from 'react'

export interface PerformanceCapabilities {
  /** Whether the device can handle backdrop-filter without major performance issues */
  canUseBlur: boolean
  /** Whether this appears to be a low-end device */
  isLowEndDevice: boolean
  /** Number of logical CPU cores (undefined if not available) */
  hardwareConcurrency: number | undefined
  /** Device memory in GB (undefined if not available) */
  deviceMemory: number | undefined
}

/**
 * Hook to detect device performance capabilities
 *
 * Uses multiple heuristics:
 * - navigator.hardwareConcurrency (CPU cores)
 * - navigator.deviceMemory (RAM in GB)
 * - saveData preference
 * - Reduced motion preference (as proxy for user wanting lighter experience)
 */
export function usePerformance(): PerformanceCapabilities {
  const [capabilities, setCapabilities] = useState<PerformanceCapabilities>({
    canUseBlur: true, // Optimistic default
    isLowEndDevice: false,
    hardwareConcurrency: undefined,
    deviceMemory: undefined,
  })

  useEffect(() => {
    // Skip on server
    if (typeof window === 'undefined') return

    // Get hardware info
    const cores = navigator.hardwareConcurrency
    // @ts-expect-error - deviceMemory is non-standard
    const memory = navigator.deviceMemory as number | undefined

    // Check for data saver mode
    // @ts-expect-error - connection is non-standard
    const connection = navigator.connection as { saveData?: boolean } | undefined
    const saveData = connection?.saveData ?? false

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Heuristics for low-end device
    const lowCores = cores !== undefined && cores <= 2
    const lowMemory = memory !== undefined && memory <= 2
    const isLowEndDevice = lowCores || lowMemory || saveData

    // backdrop-filter is GPU-intensive
    // Disable on low-end devices or when user prefers reduced motion
    const canUseBlur = !isLowEndDevice && !prefersReducedMotion && !saveData

    setCapabilities({
      canUseBlur,
      isLowEndDevice,
      hardwareConcurrency: cores,
      deviceMemory: memory,
    })
  }, [])

  return capabilities
}

/**
 * Simple check for blur support (non-hook version)
 * Use this in static contexts where hooks aren't available
 */
export function canUseBackdropFilter(): boolean {
  if (typeof window === 'undefined') return true

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }

  // Check for data saver
  // @ts-expect-error - connection is non-standard
  const connection = navigator.connection as { saveData?: boolean } | undefined
  if (connection?.saveData) {
    return false
  }

  // Check hardware
  const cores = navigator.hardwareConcurrency
  if (cores !== undefined && cores <= 2) {
    return false
  }

  return true
}

export default usePerformance
