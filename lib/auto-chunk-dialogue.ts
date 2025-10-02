/**
 * Auto-Chunking Utility for Dense Dialogue
 *
 * TIER 2 Solution: Non-destructive, render-time text chunking
 * Automatically breaks dense paragraphs into digestible chunks
 *
 * Architecture:
 * - Pure function: deterministic, testable
 * - Non-destructive: never modifies source content
 * - Scales to millions: O(n) complexity, no API calls
 * - Respects natural language boundaries
 */

export interface ChunkConfig {
  /** Maximum characters per chunk (default: 120) */
  maxChunkLength?: number
  /** Minimum characters per chunk to avoid fragments (default: 40) */
  minChunkLength?: number
  /** Enable automatic chunking based on length threshold (default: true) */
  enabled?: boolean
  /** Only chunk text longer than this threshold (default: 250) */
  activationThreshold?: number
}

const DEFAULT_CONFIG: Required<ChunkConfig> = {
  maxChunkLength: 120,
  minChunkLength: 40,
  enabled: true,
  activationThreshold: 250,
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
  const sentences = text.match(sentenceRegex) || [text]

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
