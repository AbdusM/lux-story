"use client"

import { useEffect, useRef } from 'react'
import { getMemoryManager } from '@/lib/memory-manager'

/**
 * Hook for memory cleanup in React components
 * Automatically registers cleanup functions and prevents memory leaks
 */
export function useMemoryCleanup(cleanupFn: () => void, deps: any[] = []) {
  const memoryManager = getMemoryManager()
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Register cleanup function
    memoryManager.registerCleanup(cleanupFn)
    cleanupRef.current = cleanupFn

    // Return cleanup function
    return () => {
      if (cleanupRef.current) {
        // Note: We don't remove from memoryManager here as it handles its own cleanup
        cleanupRef.current = null
      }
    }
  }, deps)

  // Return manual cleanup function
  return cleanupFn
}

/**
 * Hook for managing intervals with automatic cleanup
 */
export function useMemoryInterval(callback: () => void, delay: number | null) {
  const memoryManager = getMemoryManager()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(callback, delay)
      intervalRef.current = interval

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
  }, [callback, delay])

  return intervalRef.current
}

/**
 * Hook for managing timeouts with automatic cleanup
 */
export function useMemoryTimeout(callback: () => void, delay: number | null) {
  const memoryManager = getMemoryManager()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (delay !== null) {
      const timeout = setTimeout(callback, delay)
      timeoutRef.current = timeout

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    }
  }, [callback, delay])

  return timeoutRef.current
}

/**
 * Hook for managing event listeners with automatic cleanup
 */
export function useMemoryEventListener<T extends EventTarget>(
  target: T | null,
  event: string,
  handler: EventListener,
  deps: any[] = []
) {
  const memoryManager = getMemoryManager()

  useEffect(() => {
    if (target) {
      target.addEventListener(event, handler)

      return () => {
        target.removeEventListener(event, handler)
      }
    }
  }, [target, event, handler, ...deps])
}

/**
 * Hook for monitoring memory usage
 */
export function useMemoryMonitor() {
  const memoryManager = getMemoryManager()

  const getMemoryUsage = () => {
    return memoryManager.getMemoryUsage()
  }

  const checkMemoryLeaks = () => {
    return memoryManager.checkMemoryLeaks()
  }

  return {
    getMemoryUsage,
    checkMemoryLeaks
  }
}
