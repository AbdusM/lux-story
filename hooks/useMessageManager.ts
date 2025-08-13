import { useState, useCallback, useRef, useEffect } from 'react'

export interface GameMessage {
  speaker: string
  text: string
  type?: 'narration' | 'dialogue' | 'whisper' | 'sensation'
}

/**
 * Custom hook for managing game messages with deduplication and auto-scroll
 * @returns Message state and management functions
 */
export function useMessageManager() {
  const [messages, setMessages] = useState<GameMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Add a message with automatic deduplication
   * Prevents adding duplicate messages with same speaker and text
   */
  const addMessage = useCallback((message: GameMessage) => {
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1]
      
      // Check for duplicate
      if (lastMessage && 
          lastMessage.text === message.text && 
          lastMessage.speaker === message.speaker) {
        return prev // Don't add duplicate
      }
      
      return [...prev, message]
    })
  }, [])

  /**
   * Add multiple messages at once
   */
  const addMessages = useCallback((newMessages: GameMessage[]) => {
    newMessages.forEach(msg => addMessage(msg))
  }, [addMessage])

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  /**
   * Check if a message with specific text already exists
   */
  const hasMessage = useCallback((text: string): boolean => {
    return messages.some(msg => msg.text === text)
  }, [messages])

  return {
    messages,
    messagesEndRef,
    addMessage,
    addMessages,
    clearMessages,
    hasMessage
  }
}