import { useState, useCallback, useRef, useEffect } from 'react'

export interface GameMessage {
  id: string // Stable ID for React keys
  speaker: string
  text: string
  type?: 'narration' | 'dialogue' | 'whisper' | 'sensation'
  messageWeight?: 'primary' | 'aside' | 'critical' // Visual hierarchy for cinematic information staging
  typewriter?: boolean // Enable Pokemon-style typewriter effect
  buttonText?: string // Custom button text: "Open Letter" vs "Continue" vs "Look Closer"
  className?: string // Additional CSS classes for semantic styling
  sceneId?: string // Scene context for deduplication
  timestamp?: number // Timestamp for timing-based deduplication
}

/**
 * Custom hook for managing game messages with deduplication and auto-scroll
 * @returns Message state and management functions
 */
export function useMessageManager() {
  const [messages, setMessages] = useState<GameMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageIdCounter = useRef(0) // Stable ID counter

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Add a message with scene-aware deduplication and stable ID assignment
   * Prevents infinite loops while allowing legitimate story repetition
   */
  const addMessage = useCallback((message: Omit<GameMessage, 'id'>) => {
    console.log('🔵 addMessage called:', { speaker: message.speaker, sceneId: message.sceneId, text: message.text.substring(0, 50) + '...' })
    setMessages(prev => {
      console.log('🔵 Previous messages count:', prev.length)
      const lastMessage = prev[prev.length - 1]
      const now = Date.now()
      
      // Scene-aware deduplication: Only block if same scene AND same content AND within short timeframe
      if (lastMessage && 
          lastMessage.text === message.text && 
          lastMessage.speaker === message.speaker &&
          lastMessage.sceneId === message.sceneId &&
          lastMessage.timestamp && 
          (now - lastMessage.timestamp) < 500) { // 500ms window for rapid system loops
        console.log('🔵 Skipping rapid duplicate (same scene, same content, <500ms)')
        return prev // Don't add rapid duplicate
      }
      
      // Create message with stable ID and timestamp
      const messageWithId: GameMessage = {
        ...message,
        id: `msg-${messageIdCounter.current++}`,
        timestamp: now
      }
      
      const newMessages = [...prev, messageWithId]
      console.log('🔵 New messages count:', newMessages.length, 'Scene:', message.sceneId)
      return newMessages
    })
  }, [])

  /**
   * Add multiple messages at once
   */
  const addMessages = useCallback((newMessages: Omit<GameMessage, 'id'>[]) => {
    newMessages.forEach(msg => addMessage(msg))
  }, [addMessage])

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    console.log('🔴 clearMessages called - clearing all messages')
    setMessages(prev => {
      console.log('🔴 Clearing', prev.length, 'messages')
      return []
    })
    messageIdCounter.current = 0 // Reset counter for fresh start
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