/**
 * Auto-Chunking Utility for Chat-Paced Dialogue
 *
 * CHAT PACING: Transform novel-length text into message-sized bubbles
 * Inspired by Netflix Timed Text Style Guide for optimal readability
 *
 * Architecture:
 * - Pure function: deterministic, testable
 * - Non-destructive: never modifies source content
 * - Netflix-compliant: respects 7-second max read time (~180 chars)
 * - Smart breaking: after punctuation, before conjunctions
 * - Chat rhythm: 60 char chunks = natural conversation flow
 */

export interface ChunkConfig {
  /** Maximum characters per chunk (default: 60 for chat pacing) */
  maxChunkLength?: number
  /** Minimum characters per chunk to avoid fragments (default: 20) */
  minChunkLength?: number
  /** Enable automatic chunking based on length threshold (default: true) */
  enabled?: boolean
  /** Only chunk text longer than this threshold (default: 120) */
  activationThreshold?: number
}

const DEFAULT_CONFIG: Required<ChunkConfig> = {
  maxChunkLength: 100,  // Allow complete sentences (increased from 60)
  minChunkLength: 30,   // Prevent tiny fragments (increased from 20)
  enabled: true,
  activationThreshold: 150,  // Only chunk longer paragraphs (increased from 120)
}

/**
 * Automatically chunks dense dialogue text at natural boundaries
 *
 * Algorithm:
 * 1. Skip if text is below activation threshold (short texts stay intact)
 * 2. Split at sentence boundaries (periods, exclamation marks, questions)
 * 3. Group sentences into chunks respecting maxChunkLength
 * 4. Preserve natural flow by keeping related sentences together
 *
 * @param text - The raw dialogue text
 * @param config - Optional configuration overrides
 * @returns Text with ` | ` separators inserted at optimal break points
 *
 * @example
 * ```ts
 * const dense = "I've been thinking about what you said. Honestly, it's made me question everything I thought I knew. Now I'm not sure what to do next."
 * const chunked = autoChunkDialogue(dense)
 * // Result: "I've been thinking about what you said. | Honestly, it's made me question everything I thought I knew. | Now I'm not sure what to do next."
 * ```
 */
export function autoChunkDialogue(
  text: string,
  config: ChunkConfig = {}
): string {
  const cfg = { ...DEFAULT_CONFIG, ...config }

  // Safety: handle edge cases
  if (!text || typeof text !== 'string') return ''
  if (!cfg.enabled) return text

  // Optimization: skip short texts
  if (text.length < cfg.activationThreshold) return text

  // Already manually chunked? Respect it
  if (text.includes(' | ')) return text

  // Split into sentences at natural boundaries
  // Regex: Match sentence-ending punctuation followed by space or end-of-string
  const sentenceRegex = /([^.!?]+[.!?]+(?:\s|$))/g
  let sentences = text.match(sentenceRegex) || [text]
  
  // IMPROVED: Further split long sentences at natural breaks
  // Priority: Complete sentences > natural clause boundaries > avoid mid-phrase breaks
  const smartBreakSentences: string[] = []
  
  for (const sentence of sentences) {
    if (sentence.length <= cfg.maxChunkLength) {
      // Sentence is short enough, keep it whole
      smartBreakSentences.push(sentence)
    } else if (sentence.length <= cfg.maxChunkLength * 1.5) {
      // Sentence is moderately long - try to split at commas before conjunctions
      const conjunctionPattern = /,\s+(and|but|or|so|yet|for|nor)\s+/gi
      const parts = sentence.split(conjunctionPattern)
      
      if (parts.length > 1) {
        let currentFragment = ''
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i]
          const nextPart = parts[i + 1]
          
          // Reconstruct with conjunction if it was captured
          const fragment = nextPart && /^(and|but|or|so|yet|for|nor)$/i.test(part) 
            ? `, ${part} ` 
            : part
          
          if (currentFragment.length + fragment.length <= cfg.maxChunkLength) {
            currentFragment += fragment
          } else {
            if (currentFragment.trim().length >= cfg.minChunkLength) {
              smartBreakSentences.push(currentFragment.trim())
            }
            currentFragment = fragment
          }
        }
        if (currentFragment.trim().length >= cfg.minChunkLength) {
          smartBreakSentences.push(currentFragment.trim())
        }
      } else {
        // No good conjunction break points, keep sentence whole
        smartBreakSentences.push(sentence)
      }
    } else {
      // Very long sentence - split at any comma/semicolon, ensuring minimum lengths
      const clauseSplit = sentence.split(/([,;]\s+)/)
      let currentFragment = ''
      
      for (let i = 0; i < clauseSplit.length; i++) {
        const part = clauseSplit[i]
        const proposedLength = currentFragment.length + part.length
        
        // Only break if both fragments would be substantial
        if (proposedLength <= cfg.maxChunkLength || currentFragment.length < cfg.minChunkLength) {
          currentFragment += part
        } else {
          if (currentFragment.trim().length >= cfg.minChunkLength) {
            smartBreakSentences.push(currentFragment.trim())
          }
          currentFragment = part
        }
      }
      if (currentFragment.trim().length >= cfg.minChunkLength) {
        smartBreakSentences.push(currentFragment.trim())
      }
    }
  }
  sentences = smartBreakSentences

  // Handle case where text has no sentence-ending punctuation
  if (sentences.length === 0) {
    // Fallback: split at commas for extremely dense text
    if (text.length > cfg.maxChunkLength * 2) {
      return text
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .join(', | ')
    }
    return text
  }

  // Group sentences into optimal chunks
  const chunks: string[] = []
  let currentChunk = ''

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim()
    if (!trimmedSentence) continue

    // If adding this sentence stays under max, combine them
    if (currentChunk.length === 0) {
      // First sentence in chunk
      currentChunk = trimmedSentence
    } else if (currentChunk.length + trimmedSentence.length + 1 <= cfg.maxChunkLength) {
      // Combine with current chunk (within limit)
      currentChunk = currentChunk + ' ' + trimmedSentence
    } else {
      // Would exceed limit, save current chunk and start new one
      if (currentChunk.length >= cfg.minChunkLength) {
        chunks.push(currentChunk)
      }
      currentChunk = trimmedSentence
    }
  }

  // Add final chunk if it meets minimum length
  if (currentChunk.trim().length >= cfg.minChunkLength) {
    chunks.push(currentChunk.trim())
  }

  // Edge case: if chunking resulted in only 1 chunk, return original
  // (no point adding separators)
  if (chunks.length <= 1) return text

  // Join chunks with pipe separator
  return chunks.join(' | ')
}

/**
 * Parse text that already contains pipe separators into an array
 * Useful for progressive display or animation
 *
 * @param text - Text with ` | ` separators
 * @returns Array of text chunks
 *
 * @example
 * ```ts
 * const text = "First thought. | Second thought. | Third thought."
 * const chunks = parseChunks(text)
 * // Result: ["First thought.", "Second thought.", "Third thought."]
 * ```
 */
export function parseChunks(text: string): string[] {
  if (!text || typeof text !== 'string') return []
  return text
    .split(' | ')
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0)
}

/**
 * Determine if text would benefit from auto-chunking
 * Useful for conditional rendering logic
 *
 * @param text - The text to analyze
 * @param config - Optional configuration
 * @returns True if text exceeds activation threshold and lacks manual chunks
 */
export function shouldAutoChunk(
  text: string,
  config: ChunkConfig = {}
): boolean {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  if (!cfg.enabled || !text) return false
  if (text.includes(' | ')) return false // Already chunked
  return text.length >= cfg.activationThreshold
}
