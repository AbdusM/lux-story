/**
 * Inline Interaction Tag Parser
 *
 * Parses dialogue text for inline interaction tags like <shake>text</shake>
 * Enables strategic, line-specific animation targeting
 */

export type InteractionType = 'shake' | 'jitter' | 'nod' | 'bloom' | 'ripple' | 'big' | 'small' | 'glitch'

export interface TextSegment {
  type: 'text' | 'interaction'
  content: string
  interaction?: InteractionType
}

// Regex to match inline interaction tags: <shake>text</shake>, <jitter>text</jitter>, etc.
const INTERACTION_REGEX = /<(shake|jitter|nod|bloom|ripple|big|small|glitch)>(.*?)<\/\1>/g

export const interactionAnimations: Record<InteractionType, {
  animate: {
    x?: number[]
    y?: number[]
    scale?: number[]
    opacity?: number[]
    skewX?: number[]
    transition: { duration: number; repeat?: number; repeatType?: "reverse" | "loop" | "mirror" }
  }
}> = {
  shake: {
    animate: {
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5, repeat: 1 }
    }
  },
  glitch: {
    animate: {
      x: [0, -2, 2, -2, 2, 0],
      y: [0, 2, -2, 2, -2, 0],
      skewX: [0, 15, -15, 5, -5, 0],
      opacity: [1, 0.8, 1, 0.9, 1],
      transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" }
    }
  },
  jitter: {
    animate: {
      x: [0, -1, 1, -1, 1, 0],
      y: [0, -1, 1, -1, 1, 0],
      transition: { duration: 0.3, repeat: 2 }
    }
  },
  nod: {
    animate: {
      y: [0, -5, 0, -5, 0],
      transition: { duration: 0.6 }
    }
  },
  bloom: {
    animate: {
      scale: [0.95, 1.05, 1],
      opacity: [0.8, 1, 1],
      transition: { duration: 0.5 }
    }
  },
  ripple: {
    animate: {
      scale: [1, 1.02, 1, 1.02, 1],
      transition: { duration: 0.8, repeat: 1 }
    }
  },
  big: {
    animate: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.4 }
    }
  },
  small: {
    animate: {
      scale: [1, 0.95, 1],
      opacity: [1, 0.9, 1],
      transition: { duration: 0.4 }
    }
  }
}

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
