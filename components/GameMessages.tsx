"use client"

import { memo } from 'react'
import { StoryMessage } from './StoryMessage'

interface GameMessagesProps {
  messages: any[]
}

// Memoized message component
const MessageItem = memo(({ message, index, messages }: {
  message: any
  index: number
  messages: any[]
}) => (
  <div key={message.id} className="apple-message-wrapper">
    <StoryMessage
      speaker={message.speaker}
      text={message.text}
      type={message.type}
      messageWeight={message.messageWeight}
      className={message.className}
      isContinuedSpeaker={index > 0 && messages[index - 1].speaker === message.speaker}
    />
  </div>
))

MessageItem.displayName = 'MessageItem'

/**
 * Game Messages Component
 * Displays all game messages with optimized rendering
 */
export const GameMessages = memo(({ messages }: GameMessagesProps) => {
  return (
    <div className="apple-messages-container">
      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          index={index}
          messages={messages}
        />
      ))}
    </div>
  )
})

GameMessages.displayName = 'GameMessages'
