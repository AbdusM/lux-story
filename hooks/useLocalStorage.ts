"use client"

/**
 * useLocalStorage - Persist state to localStorage with SSR safety
 * Updated to use SafeStorage manager for versioning and error handling
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { SafeStorage } from '@/lib/persistence/storage-manager'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Ref to capture initial value once (avoids infinite loop from object references)
  const initialValueRef = useRef(initialValue)

  // State to store our value
  // We initialize with initialValue to match server render, then hydrate
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from SafeStorage on mount (only depends on key, not initialValue)
  useEffect(() => {
    // SafeStorage.get handles validation, version check, and fallback
    const value = SafeStorage.get<T>(key, initialValueRef.current)
    setStoredValue(value)
    setIsHydrated(true)
  }, [key]) // Removed initialValue - use ref instead to avoid infinite loop

  // Save to SafeStorage when value changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value

      // SafeStorage.set handles serialization and Quota errors
      SafeStorage.set(key, valueToStore)

      return valueToStore
    })
  }, [key])

  // Return initial value during SSR, stored value after hydration
  return [isHydrated ? storedValue : initialValue, setValue]
}
