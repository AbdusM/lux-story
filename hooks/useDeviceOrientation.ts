"use client"

/**
 * useDeviceOrientation - Gyroscope/accelerometer hook for parallax effects
 *
 * Sprint 4: Parallax Background
 * Uses DeviceOrientationEvent to create "window into another world" effect.
 *
 * Features:
 * - Smooth interpolation for natural feel
 * - Respects reduced motion preference
 * - Fallback for unsupported devices
 * - iOS 13+ permission handling
 */

import { useState, useEffect, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'

interface DeviceOrientationState {
  /** Rotation around X axis (-90 to 90) */
  beta: number
  /** Rotation around Y axis (-180 to 180) */
  gamma: number
  /** Whether device orientation is supported */
  isSupported: boolean
  /** Whether permission was granted (iOS) */
  hasPermission: boolean
  /** Normalized X offset (-1 to 1) for parallax */
  normalizedX: number
  /** Normalized Y offset (-1 to 1) for parallax */
  normalizedY: number
}

interface UseDeviceOrientationOptions {
  /** Smoothing factor (0-1, higher = smoother but laggier) */
  smoothing?: number
  /** Maximum tilt angle to consider (degrees) */
  maxTilt?: number
  /** Enable the effect */
  enabled?: boolean
}

export function useDeviceOrientation(
  options: UseDeviceOrientationOptions = {}
): DeviceOrientationState & { requestPermission: () => Promise<boolean> } {
  const { smoothing = 0.1, maxTilt = 30, enabled = true } = options
  const prefersReducedMotion = useReducedMotion()

  const [state, setState] = useState<DeviceOrientationState>({
    beta: 0,
    gamma: 0,
    isSupported: false,
    hasPermission: false,
    normalizedX: 0,
    normalizedY: 0,
  })

  // Smooth interpolation values
  const [smoothBeta, setSmoothBeta] = useState(0)
  const [smoothGamma, setSmoothGamma] = useState(0)

  // Check if DeviceOrientationEvent is supported
  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window
    setState(prev => ({ ...prev, isSupported }))
  }, [])

  // Handle device orientation event
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const beta = event.beta ?? 0 // X-axis rotation
    const gamma = event.gamma ?? 0 // Y-axis rotation

    setState(prev => ({
      ...prev,
      beta,
      gamma,
    }))
  }, [])

  // Request permission (required for iOS 13+)
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false

    // Check if we need to request permission (iOS 13+)
    const DeviceOrientationEvent = window.DeviceOrientationEvent as typeof window.DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission()
        const granted = permission === 'granted'
        setState(prev => ({ ...prev, hasPermission: granted }))
        return granted
      } catch {
        return false
      }
    }

    // Non-iOS devices don't need explicit permission
    setState(prev => ({ ...prev, hasPermission: true }))
    return true
  }, [])

  // Set up event listener
  useEffect(() => {
    if (!enabled || prefersReducedMotion || !state.isSupported) return

    // Auto-request permission on mount (will only prompt on iOS)
    requestPermission()

    window.addEventListener('deviceorientation', handleOrientation)
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [enabled, prefersReducedMotion, state.isSupported, handleOrientation, requestPermission])

  // Smooth interpolation
  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      setSmoothBeta(prev => prev + (state.beta - prev) * smoothing)
      setSmoothGamma(prev => prev + (state.gamma - prev) * smoothing)
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [state.beta, state.gamma, smoothing, prefersReducedMotion])

  // Calculate normalized values
  const normalizedX = Math.max(-1, Math.min(1, smoothGamma / maxTilt))
  const normalizedY = Math.max(-1, Math.min(1, smoothBeta / maxTilt))

  return {
    ...state,
    normalizedX: prefersReducedMotion ? 0 : normalizedX,
    normalizedY: prefersReducedMotion ? 0 : normalizedY,
    requestPermission,
  }
}

export default useDeviceOrientation
