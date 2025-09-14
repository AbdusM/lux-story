"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'

interface VirtualScrollingConfig {
  itemHeight: number
  containerHeight: number
  overscan: number
  threshold: number // Minimum items to enable virtualization
}

interface VirtualScrollingState {
  scrollTop: number
  containerHeight: number
  isVirtualized: boolean
  visibleRange: { startIndex: number; endIndex: number }
  totalHeight: number
}

/**
 * Hook for virtual scrolling configuration and state management
 */
export function useVirtualScrolling(
  itemCount: number,
  config: VirtualScrollingConfig
): VirtualScrollingState & {
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void
  updateContainerHeight: (height: number) => void
} {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(config.containerHeight)

  // Determine if virtualization should be enabled
  const isVirtualized = useMemo(() => {
    return itemCount > config.threshold
  }, [itemCount, config.threshold])

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (!isVirtualized) {
      return { startIndex: 0, endIndex: itemCount - 1 }
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / config.itemHeight) - config.overscan)
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + containerHeight) / config.itemHeight) + config.overscan
    )
    return { startIndex, endIndex }
  }, [scrollTop, containerHeight, config.itemHeight, config.overscan, itemCount, isVirtualized])

  // Calculate total height
  const totalHeight = useMemo(() => {
    return isVirtualized ? itemCount * config.itemHeight : 'auto'
  }, [itemCount, config.itemHeight, isVirtualized])

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Update container height
  const updateContainerHeight = useCallback((height: number) => {
    setContainerHeight(height)
  }, [])

  // Auto-update container height on resize
  useEffect(() => {
    const handleResize = () => {
      // This will be called by the component when it mounts or resizes
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    scrollTop,
    containerHeight,
    isVirtualized,
    visibleRange,
    totalHeight: typeof totalHeight === 'number' ? totalHeight : 0,
    handleScroll,
    updateContainerHeight
  }
}

/**
 * Hook for message list virtualization with automatic configuration
 */
export function useMessageListVirtualization(messages: any[]) {
  const config: VirtualScrollingConfig = {
    itemHeight: 80, // Average message height
    containerHeight: 400, // Default container height
    overscan: 5, // Extra items to render outside visible area
    threshold: 20 // Enable virtualization for 20+ messages
  }

  const virtualState = useVirtualScrolling(messages.length, config)

  // Calculate visible messages
  const visibleMessages = useMemo(() => {
    if (!virtualState.isVirtualized) {
      return messages
    }

    return messages.slice(
      virtualState.visibleRange.startIndex,
      virtualState.visibleRange.endIndex + 1
    )
  }, [messages, virtualState.isVirtualized, virtualState.visibleRange])

  return {
    ...virtualState,
    visibleMessages,
    config
  }
}
