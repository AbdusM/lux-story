/**
 * Memory Management Utility
 * Prevents memory leaks and manages singleton lifecycle
 */

interface MemoryManager {
  cleanup: () => void
  registerCleanup: (cleanupFn: () => void) => void
  isRegistered: (cleanupFn: () => void) => boolean
  clearAll: () => void
  getMemoryUsage: () => { used: number; total: number; percentage: number }
  checkMemoryLeaks: () => { isLeaking: boolean; details: string }
  registerInterval: (interval: NodeJS.Timeout) => void
  registerTimeout: (timeout: NodeJS.Timeout) => void
  registerEventListener: (target: EventTarget, event: string, handler: EventListener) => void
}

class MemoryManagerImpl implements MemoryManager {
  private cleanupFunctions: Set<() => void> = new Set()
  private intervals: Set<NodeJS.Timeout> = new Set()
  private timeouts: Set<NodeJS.Timeout> = new Set()
  private eventListeners: Map<EventTarget, Array<{ event: string; handler: EventListener }>> = new Map()

  registerCleanup(cleanupFn: () => void): void {
    this.cleanupFunctions.add(cleanupFn)
  }

  isRegistered(cleanupFn: () => void): boolean {
    return this.cleanupFunctions.has(cleanupFn)
  }

  registerInterval(interval: NodeJS.Timeout): void {
    this.intervals.add(interval)
  }

  registerTimeout(timeout: NodeJS.Timeout): void {
    this.timeouts.add(timeout)
  }

  registerEventListener(target: EventTarget, event: string, handler: EventListener): void {
    if (!this.eventListeners.has(target)) {
      this.eventListeners.set(target, [])
    }
    this.eventListeners.get(target)!.push({ event, handler })
  }

  cleanup(): void {
    // Execute all registered cleanup functions
    this.cleanupFunctions.forEach(cleanupFn => {
      try {
        cleanupFn()
      } catch (error) {
        console.warn('Error during cleanup:', error)
      }
    })

    // Clear all intervals
    this.intervals.forEach(interval => {
      clearInterval(interval)
    })
    this.intervals.clear()

    // Clear all timeouts
    this.timeouts.forEach(timeout => {
      clearTimeout(timeout)
    })
    this.timeouts.clear()

    // Remove all event listeners
    this.eventListeners.forEach((listeners, target) => {
      listeners.forEach(({ event, handler }) => {
        target.removeEventListener(event, handler)
      })
    })
    this.eventListeners.clear()

    // Clear cleanup functions
    this.cleanupFunctions.clear()
  }

  clearAll(): void {
    this.cleanup()
  }

  // Memory usage monitoring
  getMemoryUsage(): { used: number; total: number; percentage: number } {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      }
    }
    return { used: 0, total: 0, percentage: 0 }
  }

  // Check for memory leaks
  checkMemoryLeaks(): { isLeaking: boolean; details: string } {
    const memory = this.getMemoryUsage()
    const isLeaking = memory.percentage > 80 // Consider leaking if over 80% usage
    
    return {
      isLeaking,
      details: `Memory usage: ${memory.percentage.toFixed(2)}% (${(memory.used / 1024 / 1024).toFixed(2)}MB / ${(memory.total / 1024 / 1024).toFixed(2)}MB)`
    }
  }
}

// Singleton instance
let memoryManager: MemoryManager | null = null

export function getMemoryManager(): MemoryManager {
  if (!memoryManager) {
    memoryManager = new MemoryManagerImpl()
    
    // Register global cleanup on page unload
    if (typeof window !== 'undefined') {
      const cleanup = () => {
        memoryManager?.cleanup()
        memoryManager = null
      }
      
      window.addEventListener('beforeunload', cleanup)
      window.addEventListener('pagehide', cleanup)
      
      // Register cleanup for the cleanup itself
      memoryManager.registerCleanup(() => {
        window.removeEventListener('beforeunload', cleanup)
        window.removeEventListener('pagehide', cleanup)
      })
    }
  }
  
  return memoryManager
}

// Cleanup utility for React components
export function useMemoryCleanup(cleanupFn: () => void, deps: any[] = []) {
  const memoryManager = getMemoryManager()
  
  // Register cleanup function
  memoryManager.registerCleanup(cleanupFn)
  
  // Return cleanup function for manual use
  return () => {
    memoryManager.registerCleanup(cleanupFn)
  }
}

// Debounced localStorage operations to prevent excessive writes
export function createDebouncedStorage(key: string, delay: number = 1000) {
  let timeout: NodeJS.Timeout | null = null
  const memoryManager = getMemoryManager()
  
  return {
    set: (value: any) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      
      timeout = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
          console.warn('Failed to save to localStorage:', error)
        }
        timeout = null
      }, delay)
      
      // Register timeout for cleanup
      if (timeout) {
        memoryManager.registerTimeout(timeout)
      }
    },
    
    get: () => {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      } catch (error) {
        console.warn('Failed to read from localStorage:', error)
        return null
      }
    },
    
    clear: () => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.warn('Failed to clear localStorage:', error)
      }
    }
  }
}

// Memory-efficient data compression
export function compressData(data: any): string {
  try {
    return JSON.stringify(data)
  } catch (error) {
    console.warn('Failed to compress data:', error)
    return ''
  }
}

export function decompressData(compressed: string): any {
  try {
    return JSON.parse(compressed)
  } catch (error) {
    console.warn('Failed to decompress data:', error)
    return null
  }
}
