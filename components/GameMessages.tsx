"use client"

import { memo, useRef, useEffect } from 'react'
import { StoryMessage } from './StoryMessage'
import { useMessageListVirtualization } from '@/hooks/useVirtualScrolling'

interface GameMessage {
  id: string
  text: string
  speaker: string
  type: string
  messageWeight?: string
  className?: string
}

interface GameMessagesProps {
  messages: GameMessage[]
}

// Memoized message component
const MessageItem = memo(({ message, messages, actualIndex }: {
  message: GameMessage
  messages: GameMessage[]
  actualIndex: number
}) => {
  // Map game message types to StoryMessage types
  const getStoryMessageType = (type: string): 'narration' | 'dialogue' | 'whisper' | 'sensation' | undefined => {
    const typeMap: Record<string, 'narration' | 'dialogue' | 'whisper' | 'sensation'> = {
      'narration': 'narration',
      'dialogue': 'dialogue',
      'choice': 'dialogue',
      'consequence': 'narration',
      'whisper': 'whisper',
      'sensation': 'sensation'
    }
    return typeMap[type]
  }

  // Map game message weights to StoryMessage weights
  const getStoryMessageWeight = (weight?: string): 'primary' | 'aside' | 'critical' | undefined => {
    if (!weight) return undefined
    const weightMap: Record<string, 'primary' | 'aside' | 'critical'> = {
      'light': 'aside',
      'medium': 'primary',
      'heavy': 'critical',
      'primary': 'primary',
      'aside': 'aside',
      'critical': 'critical'
    }
    return weightMap[weight]
  }

  return (
    <div key={message.id} className="apple-message-wrapper">
      <StoryMessage
        speaker={message.speaker}
        text={message.text}
        type={getStoryMessageType(message.type)}
        messageWeight={getStoryMessageWeight(message.messageWeight)}
        className={message.className}
        isContinuedSpeaker={actualIndex > 0 && messages[actualIndex - 1].speaker === message.speaker}
      />
    </div>
  )
})

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
