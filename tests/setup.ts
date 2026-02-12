import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Stable localStorage mock for JSDOM tests.
const storage = new Map<string, string>()
const localStorageMock = {
  getItem: (key: string) => storage.get(String(key)) ?? null,
  setItem: (key: string, value: string) => {
    storage.set(String(key), String(value))
  },
  removeItem: (key: string) => {
    storage.delete(String(key))
  },
  clear: () => {
    storage.clear()
  },
  key: (index: number) => {
    const keys = Array.from(storage.keys())
    return keys[index] ?? null
  },
  get length() {
    return storage.size
  },
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})
