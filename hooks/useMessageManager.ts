import { useState, useCallback, useRef, useEffect, useSyncExternalStore, useMemo } from 'react'
import { logger } from '@/lib/logger'

// Persistent message store that survives React.StrictMode remounts
class MessageStore {
  private messages: GameMessage[] = []
  private subscribers = new Set<() => void>()
  private messageIdCounter = 0

  getSnapshot = () => {
    return this.messages
  }

  subscribe = (callback: () => void) => {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  addMessage = (message: Omit<GameMessage, 'id'>) => {
    logger.debug('MessageStore.addMessage called:', { 
      speaker: message.speaker, 
      sceneId: message.sceneId, 
      text: message.text.substring(0, 50) + '...' 
    })
    
    const now = Date.now()
    
    // Enhanced deduplication: Check for duplicates in recent messages
    const recentMessages = this.messages.slice(-3) // Check last 3 messages for duplicates
    const isDuplicate = recentMessages.some(existingMessage => 
      existingMessage.text === message.text && 
      existingMessage.speaker === message.speaker &&
      existingMessage.sceneId === message.sceneId &&
      existingMessage.timestamp && 
      (now - existingMessage.timestamp) < 2000 // 2 second window
    )
    
    if (isDuplicate) {
      logger.debug('🔵 Skipping duplicate (same scene, same content, within 2s window)')
      return
    }
    
    // Additional check: Prevent same scene content from being added multiple times
    if (message.sceneId) {
      const sceneMessages = this.messages.filter(msg => msg.sceneId === message.sceneId)
      const hasIdenticalSceneMessage = sceneMessages.some(msg => 
        msg.text === message.text && 
        msg.speaker === message.speaker
      )
      
      if (hasIdenticalSceneMessage) {
        logger.debug('🔵 Skipping scene duplicate (identical content already exists for this scene)')
        return
      }
    }
    
    // Create message with stable ID and timestamp
    const messageWithId: GameMessage = {
      ...message,
      id: `msg-${this.messageIdCounter++}`,
      timestamp: now
    }
    
    this.messages = [...this.messages, messageWithId]
    logger.debug('🔵 MessageStore - New messages count:', { count: this.messages.length, sceneId: message.sceneId })
    
    // Notify all subscribers
    this.subscribers.forEach(callback => callback())
  }

  clearMessages = () => {
    logger.debug('🔴 MessageStore.clearMessages called', { count: this.messages.length })
    this.messages = []
    this.messageIdCounter = 0
    this.subscribers.forEach(callback => callback())
  }

  hasMessage = (text: string): boolean => {
    return this.messages.some(msg => msg.text === text)
  }
}

// Global singleton instance
const messageStore = new MessageStore()

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
  streamingMode?: 'chatbot' | 'traditional' // Streaming style selection
  textChunks?: string[] // For streaming messages: array of text chunks
  isStreamingMessage?: boolean // Flag to identify streaming messages
}

/**
 * Custom hook for managing game messages with deduplication and auto-scroll
 * @returns Message state and management functions
 */
export function useMessageManager() {
  // Memoize the server snapshot function to prevent infinite loops
  const getServerSnapshot = useMemo(() => () => [], [])
  
  // Use persistent store instead of local state
  const messages = useSyncExternalStore(
    messageStore.subscribe, 
    messageStore.getSnapshot,
    getServerSnapshot // Use memoized server snapshot function
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hookInstanceId = useRef(`hook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`) // Debug hook instances
  
  // Debug: Log hook creation
  useEffect(() => {
    logger.debug('🟡 useMessageManager hook created', { hookId: hookInstanceId.current, messageCount: messages.length })
    return () => {
      logger.debug('🟠 useMessageManager hook destroyed', { hookId: hookInstanceId.current })
    }
  }, [])

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Add a message with enhanced scene-aware deduplication
   * Prevents infinite loops while allowing legitimate story repetition
   */
  const addMessage = useCallback((message: Omit<GameMessage, 'id'>) => {
    logger.debug('🔵 addMessage called (hook):', { hookId: hookInstanceId.current, speaker: message.speaker, sceneId: message.sceneId, text: message.text.substring(0, 50) + '...' })
    messageStore.addMessage(message)
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
    messageStore.clearMessages()
  }, [])

  /**
   * Add a streaming message with multiple text chunks
   */
  const addStreamingMessage = useCallback((message: Omit<GameMessage, 'id'> & { textChunks: string[] }) => {
    logger.debug('🔵 addStreamingMessage called:', { speaker: message.speaker, chunks: message.textChunks.length })
    const streamingMessage: Omit<GameMessage, 'id'> = {
      ...message,
      isStreamingMessage: true,
      streamingMode: message.streamingMode || 'chatbot',
      text: message.textChunks.join(' ') // Full text for deduplication
    }
    addMessage(streamingMessage)
  }, [addMessage])

  /**
   * Check if a message with specific text already exists
   */
  const hasMessage = useCallback((text: string): boolean => {
    return messageStore.hasMessage(text)
  }, [])

  return {
    messages,
    messagesEndRef,
    addMessage,
    addMessages,
    addStreamingMessage,
    clearMessages,
    hasMessage
  }
}
