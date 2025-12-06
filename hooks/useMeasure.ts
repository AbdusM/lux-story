/**
 * useMeasure Hook
 *
 * Measures DOM element dimensions using ResizeObserver.
 * Returns a ref to attach to the element and current bounds.
 *
 * Uses @react-hook/resize-observer for robust cross-browser support
 * and proper cleanup/SSR handling.
 */

import { useRef, useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'

export interface Bounds {
  width: number
  height: number
}

export function useMeasure<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [bounds, setBounds] = useState<Bounds>({ width: 0, height: 0 })

  // Using the robust @react-hook/resize-observer package
  // Handles cleanup, SSR, and edge cases automatically
  useResizeObserver(ref, (entry) => {
    // Use requestAnimationFrame to batch updates and avoid layout thrashing
    requestAnimationFrame(() => {
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      })
    })
  })

  return { ref, bounds }
}

export default useMeasure
