/**
 * Development Mode Object Freezing
 * TD-002: Enforces immutability in development mode
 *
 * In production, this is a no-op for performance.
 * In development/test, it deep-freezes objects to catch accidental mutations.
 *
 * Usage:
 *   return devFreeze(newState)
 *
 * When mutation is attempted in dev mode, you'll get:
 *   TypeError: Cannot assign to read only property 'trust' of object
 */

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

/**
 * Deep freeze an object in development mode.
 * In production, returns the object unchanged for performance.
 *
 * Handles:
 * - Plain objects (recursively)
 * - Arrays (recursively)
 * - Map and Set (freezes the container, not recursing into values)
 * - Primitives (returns as-is)
 *
 * @param obj - The object to freeze
 * @returns The frozen object (in dev) or original object (in prod)
 */
export function devFreeze<T>(obj: T): T {
  if (!isDev) {
    return obj
  }

  return deepFreeze(obj)
}

/**
 * Deep freeze implementation.
 * Recursively freezes all nested objects and arrays.
 */
function deepFreeze<T>(obj: T, visited = new WeakSet<object>()): T {
  // Handle null/undefined/primitives
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj
  }

  // Prevent circular reference infinite loops
  if (visited.has(obj as object)) {
    return obj
  }
  visited.add(obj as object)

  // Handle Map - freeze the map itself but not recursing into values
  // (Map values are often primitives or already-frozen objects)
  if (obj instanceof Map) {
    Object.freeze(obj)
    return obj
  }

  // Handle Set - freeze the set itself
  if (obj instanceof Set) {
    Object.freeze(obj)
    return obj
  }

  // Handle Date - just freeze it
  if (obj instanceof Date) {
    Object.freeze(obj)
    return obj
  }

  // Handle Arrays - freeze and recurse into elements
  if (Array.isArray(obj)) {
    obj.forEach(item => deepFreeze(item, visited))
    Object.freeze(obj)
    return obj
  }

  // Handle plain objects - freeze and recurse into properties
  const propNames = Object.getOwnPropertyNames(obj)
  for (const name of propNames) {
    const value = (obj as Record<string, unknown>)[name]
    if (value && typeof value === 'object') {
      deepFreeze(value, visited)
    }
  }

  Object.freeze(obj)
  return obj
}

/**
 * Check if we're in development mode (for conditional logic)
 */
export function isDevMode(): boolean {
  return isDev
}

/**
 * Assert that an object is frozen (for tests)
 */
export function assertFrozen(obj: unknown, path = 'root'): void {
  if (!isDev) return

  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return
  }

  if (!Object.isFrozen(obj)) {
    throw new Error(`Object at ${path} is not frozen`)
  }

  if (obj instanceof Map || obj instanceof Set || obj instanceof Date) {
    return // These are frozen at the container level
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => assertFrozen(item, `${path}[${i}]`))
    return
  }

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') {
      assertFrozen(value, `${path}.${key}`)
    }
  }
}
