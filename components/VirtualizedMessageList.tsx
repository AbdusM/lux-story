"use client"

import { memo, useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { StoryMessage } from './StoryMessage'

interface VirtualizedMessageListProps {
  messages: any[]
  height?: number
  itemHeight?: number
  overscan?: number
}

/**
 * Virtualized Message List Component
 * Implements virtual scrolling for long message lists to improve performance
 */
export const VirtualizedMessageList = memo(({ 
  messages, 
  height = 400, 
  itemHeight = 80, 
  overscan = 5 
}: VirtualizedMessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(height)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      messages.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    return { startIndex, endIndex }
  }, [scrollTop, containerHeight, itemHeight, messages.length, overscan])

  // Get visible messages
  const visibleMessages = useMemo(() => {
    return messages.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [messages, visibleRange])

  // Calculate total height
  const totalHeight = messages.length * itemHeight

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages.length])

  return (
    <div
      ref={containerRef}
      className="apple-messages-container"
      style={{
        height: `${height}px`,
        overflowY: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      {/* Spacer for items before visible range */}
      <div style={{ height: `${visibleRange.startIndex * itemHeight}px` }} />
      
      {/* Visible messages */}
      {visibleMessages.map((message, index) => {
        const actualIndex = visibleRange.startIndex + index
        return (
          <div
            key={message.id}
            className="apple-message-wrapper"
            style={{
              height: `${itemHeight}px`,
              position: 'relative'
            }}
          >
            <StoryMessage
              speaker={message.speaker}
              text={message.text}
              type={message.type}
              messageWeight={message.messageWeight}
              className={message.className}
              isContinuedSpeaker={actualIndex > 0 && messages[actualIndex - 1].speaker === message.speaker}
            />
          </div>
        )
      })}
      
      {/* Spacer for items after visible range */}
      <div style={{ height: `${(messages.length - visibleRange.endIndex - 1) * itemHeight}px` }} />
    </div>
  )
})

VirtualizedMessageList.displayName = 'VirtualizedMessageList'
