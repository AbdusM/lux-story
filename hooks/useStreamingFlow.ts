import { useCallback } from 'react'

/**
 * Hook for managing chatbot-style streaming text flow
 * Provides utilities for converting traditional scene text into streaming chunks
 */
export function useStreamingFlow() {
  
  /**
   * Analyze text to determine if it should use streaming mode
   */
  const shouldUseStreaming = useCallback((text: string, speaker: string, type: string): boolean => {
    // Use streaming for longer narrative content (>100 chars)
    if (text.length > 100 && type === 'narration' && speaker === 'narrator') {
      return true
    }
    
    // Use streaming for character dialogue that contains multiple sentences
    if (type === 'dialogue' && text.includes('.') && text.split('.').length > 2) {
      return true
    }
    
    // Skip streaming for choices, short messages, or user messages
    if (speaker === 'You' || text.length < 50) {
      return false
    }
    
    return false
  }, [])
  
  /**
   * Split text into semantic chunks for streaming
   * Based on natural sentence breaks and narrative flow
   */
  const createTextChunks = useCallback((text: string): string[] => {
    // First, split by sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    if (sentences.length <= 1) {
      return [text] // Single chunk if no clear breaks
    }
    
    const chunks: string[] = []
    let currentChunk = ''
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim()
      if (!sentence) continue
      
      // Add period back (except for last sentence which might have different punctuation)
      const sentenceWithPunc = i < sentences.length - 1 ? sentence + '.' : sentence + '.'
      
      // Start new chunk or continue current one
      if (currentChunk === '') {
        currentChunk = sentenceWithPunc
      } else if (currentChunk.length + sentenceWithPunc.length < 120) {
        // Combine short sentences into one chunk (max ~120 chars)
        currentChunk += ' ' + sentenceWithPunc
      } else {
        // Current chunk is full, start new one
        chunks.push(currentChunk.trim())
        currentChunk = sentenceWithPunc
      }
    }
    
    // Add final chunk
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }
    
    return chunks.length > 0 ? chunks : [text]
  }, [])
  
  /**
   * Calculate delays between chunks based on content type and priority
   */
  const calculateChunkDelays = useCallback((chunks: string[], speaker: string): number[] => {
    const delays: number[] = [0] // First chunk always immediate
    
    for (let i = 1; i < chunks.length; i++) {
      const chunk = chunks[i]
      let delay = 800 // Base delay
      
      // Shorter delays for dialogue
      if (speaker !== 'narrator') {
        delay = 600
      }
      
      // Longer delays for dramatic content
      if (chunk.includes('***') || chunk.includes('!') || chunk.toLowerCase().includes('time')) {
        delay = 1200
      }
      
      // Shorter delays for atmospheric details
      if (chunk.length < 50) {
        delay = 400
      }
      
      delays.push(delay)
    }
    
    return delays
  }, [])
  
  /**
   * Process scene text for optimal streaming experience
   */
  const processSceneForStreaming = useCallback((text: string, speaker: string, type: string) => {
    const shouldStream = shouldUseStreaming(text, speaker, type)
    
    if (!shouldStream) {
      return {
        useStreaming: false,
        chunks: [text],
        delays: [0],
        streamingMode: 'traditional' as const
      }
    }
    
    const chunks = createTextChunks(text)
    const delays = calculateChunkDelays(chunks, speaker)
    
    return {
      useStreaming: true,
      chunks,
      delays,
      streamingMode: 'chatbot' as const
    }
  }, [shouldUseStreaming, createTextChunks, calculateChunkDelays])
  
  return {
    shouldUseStreaming,
    createTextChunks,
    calculateChunkDelays,
    processSceneForStreaming
  }
}