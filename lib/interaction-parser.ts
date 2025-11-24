/**
 * Inline Interaction Tag Parser
 *
 * Parses dialogue text for inline interaction tags like <shake>text</shake>
 * Enables strategic, line-specific animation targeting
 */

export type InteractionType = 'shake' | 'jitter' | 'nod' | 'bloom' | 'ripple' | 'big' | 'small'

export interface TextSegment {
  type: 'text' | 'interaction'
  content: string
  interaction?: InteractionType
}

const INTERACTION_REGEX = /<(shake|jitter|nod|bloom|ripple|big|small)>(.*?)<\/\1>/g

/**
 * Parse text for inline interaction tags
 *
 * Example:
 * Input: "Setup text|<shake>ALARM!</shake>|More text"
 * Output: [
 *   { type: 'text', content: 'Setup text|' },
 *   { type: 'interaction', content: 'ALARM!', interaction: 'shake' },
 *   { type: 'text', content: '|More text' }
 * ]
 */
export function parseInlineInteractions(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  // Reset regex state
  INTERACTION_REGEX.lastIndex = 0

  while ((match = INTERACTION_REGEX.exec(text)) !== null) {
    const [fullMatch, interaction, content] = match
    const offset = match.index

    // Add text before this interaction tag
    if (offset > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, offset)
      })
    }

    // Add interaction segment
    segments.push({
      type: 'interaction',
      content,
      interaction: interaction as InteractionType
    })

    lastIndex = offset + fullMatch.length
  }

  // Add remaining text after last tag
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex)
    })
  }

  // If no interactions found, return single text segment
  if (segments.length === 0) {
    segments.push({
      type: 'text',
      content: text
    })
  }

  return segments
}

/**
 * Check if text contains inline interaction tags
 */
export function hasInlineInteractions(text: string): boolean {
  INTERACTION_REGEX.lastIndex = 0
  return INTERACTION_REGEX.test(text)
}

/**
 * Strip interaction tags from text (for plain text rendering)
 */
export function stripInteractionTags(text: string): string {
  return text.replace(INTERACTION_REGEX, '$2')
}
