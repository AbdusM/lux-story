"use client"

import { memo, useRef, useEffect } from 'react'
import { StoryMessage } from './StoryMessage'
import { useMessageListVirtualization } from '@/hooks/useVirtualScrolling'

interface GameMessagesProps {
  messages: any[]
}

// Memoized message component
const MessageItem = memo(({ message, index, messages, actualIndex }: {
  message: any
  index: number
  messages: any[]
  actualIndex: number
}) => (
  <div key={message.id} className="apple-message-wrapper">
    <StoryMessage
      speaker={message.speaker}
      text={message.text}
      type={message.type}
      messageWeight={message.messageWeight}
      className={message.className}
      isContinuedSpeaker={actualIndex > 0 && messages[actualIndex - 1].speaker === message.speaker}
    />
  </div>
))

MessageItem.displayName = 'MessageItem'

/**
 * Game Messages Component
 * Displays all game messages with virtual scrolling for performance
 */
export const GameMessages = memo(({ messages }: GameMessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    isVirtualized,
    visibleRange,
    totalHeight,
    handleScroll,
    visibleMessages,
    config
  } = useMessageListVirtualization(messages)

  // Update container height when component mounts
  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight
      if (height > 0) {
        // Container height will be set by CSS, we just need to track it
      }
    }
  }, [])

  // Scroll to bottom when new messages are added (only if user is near bottom)
  useEffect(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      if (isNearBottom) {
        containerRef.current.scrollTop = scrollHeight
      }
    }
  }, [messages.length])

  if (!isVirtualized) {
    // Render all messages normally for small lists
    return (
      <div className="apple-messages-container">
        {messages.map((message, index) => (
          <MessageItem
            key={message.id}
            message={message}
            index={index}
            messages={messages}
            actualIndex={index}
          />
        ))}
      </div>
    )
  }

  // Render virtualized list for large lists
  return (
    <div
      ref={containerRef}
      className="apple-messages-container"
      style={{
        height: `${config.containerHeight}px`,
        overflowY: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      {/* Spacer for items before visible range */}
      <div style={{ height: `${visibleRange.startIndex * config.itemHeight}px` }} />
      
      {/* Visible messages */}
      {visibleMessages.map((message, index) => {
        const actualIndex = visibleRange.startIndex + index
        return (
          <MessageItem
            key={message.id}
            message={message}
            index={index}
            messages={messages}
            actualIndex={actualIndex}
          />
        )
      })}
      
      {/* Spacer for items after visible range */}
      <div style={{ height: `${(messages.length - visibleRange.endIndex - 1) * config.itemHeight}px` }} />
    </div>
  )
})

GameMessages.displayName = 'GameMessages'
