/**
 * Ignore Circular References Utility
 *
 * Creates a JSON replacer function that safely handles circular references
 * and React internal properties. Used for creating stable keys from React
 * children for animation triggering.
 *
 * Based on Sam Selikoff's ResizablePanel technique.
 *
 * @see https://github.com/samselikoff/2022-06-09-resizable-panel
 */

/**
 * Creates a replacer function for JSON.stringify that:
 * 1. Skips React internal properties (keys starting with '_')
 * 2. Tracks seen objects to prevent circular reference errors
 *
 * @returns A replacer function compatible with JSON.stringify
 */
export function ignoreCircularReferences(): (key: string, value: unknown) => unknown {
  const seen = new WeakSet()

  return (key: string, value: unknown) => {
    // Skip React internal properties (like _owner, _store, etc.)
    if (key.startsWith('_')) {
      return undefined
    }

    // Handle objects to prevent circular references
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined // Already seen this object, skip to prevent circular ref
      }
      seen.add(value)
    }

    return value
  }
}

/**
 * Serializes React children to a stable string for use as an animation key.
 * Only triggers re-animation when the actual content changes, not on every re-render.
 *
 * @param children - React children to serialize
 * @returns A stable string representation of the children
 */
export function serializeChildren(children: React.ReactNode): string {
  try {
    return JSON.stringify(children, ignoreCircularReferences())
  } catch {
    // Fallback to a random key if serialization fails
    // This means animations will trigger on every render for complex children
    return String(Date.now())
  }
}

export default ignoreCircularReferences
