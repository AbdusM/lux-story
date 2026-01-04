
import { GameState } from './character-state'

/**
 * TextProcessor - Dynamic Narrative Injection Engine
 * 
 * Allows for inline conditionals within dialogue text.
 * Syntax: {{flag_name:Text If True|Text If False}}
 * 
 * Example:
 * "I heard {{met_maya:you helped Maya|you're new here}}."
 * 
 * Advanced Syntax (Future):
 * {{trust>5:You're a good friend|I don't know you well}}
 */

export class TextProcessor {
  /**
   * Process text and inject dynamic content based on game state
   * Supports nested conditionals by processing inside-out
   */
  static process(text: string, gameState: GameState): string {
    if (!text) return ''

    // 0. Variable Interpolation (Pre-process)
    // Inject Player ID for recursive loop narrative
    if (text.includes('{{playerId}}')) {
      // Simple string replacement for specific allowed variables
      text = text.replace(/\{\{playerId\}\}/g, gameState.playerId)
    }

    // Process from innermost conditionals outward
    // Use a non-greedy pattern that matches the innermost {{...}} first
    // Pattern matches {{condition:trueText}} or {{condition:trueText|falseText}}
    // where trueText and falseText cannot contain {{ or }}
    const pattern = /\{\{([^:{}]+):([^{}|]*)(?:\|([^{}]*))?\}\}/g

    let result = text
    let iterations = 0
    const maxIterations = 10 // Prevent infinite loops

    // Keep processing until no more conditionals are found
    while (pattern.test(result) && iterations < maxIterations) {
      pattern.lastIndex = 0 // Reset regex state
      result = result.replace(pattern, (match, condition, trueText, falseText) => {
        const isMet = this.evaluateCondition(condition.trim(), gameState)
        return isMet ? trueText : (falseText || '')
      })
      iterations++
    }

    return result
  }

  /**
   * Evaluate a single condition string against the game state
   */
  private static evaluateCondition(condition: string, gameState: GameState): boolean {
    // 1. Check Global Flags (e.g. "met_maya")
    if (gameState.globalFlags.has(condition)) {
      return true
    }

    // 2. Check Knowledge Flags for current character first (e.g. "knows_secret")
    const currentCharacter = gameState.characters.get(gameState.currentCharacterId)
    if (currentCharacter && currentCharacter.knowledgeFlags.has(condition)) {
      return true
    }

    // 2b. Check Knowledge Flags for ALL characters (for revisit callbacks)
    // This ensures flags set on a character are accessible when revisiting them
    for (const [, character] of gameState.characters) {
      if (character.knowledgeFlags.has(condition)) {
        return true
      }
    }

    // 3. Check Trust (e.g. "trust>5")
    if (condition.startsWith('trust')) {
      const operator = condition.match(/([><=]+)/)?.[0]
      const value = parseInt(condition.match(/(\d+)/)?.[0] || '0', 10)

      if (currentCharacter && operator && !isNaN(value)) {
        switch (operator) {
          case '>': return currentCharacter.trust > value
          case '>=': return currentCharacter.trust >= value
          case '<': return currentCharacter.trust < value
          case '<=': return currentCharacter.trust <= value
          case '=':
          case '==': return currentCharacter.trust === value
        }
      }
    }

    // 4. Check Pattern Values (e.g. "analytical>5", "helping>=3")
    // Pattern Voice Activation - lets dominant patterns "speak" at threshold moments
    const patternNames = ['analytical', 'helping', 'building', 'patience', 'exploring']
    for (const patternName of patternNames) {
      if (condition.startsWith(patternName)) {
        const operator = condition.match(/([><=]+)/)?.[0]
        const value = parseInt(condition.match(/(\d+)/)?.[0] || '0', 10)
        const patternValue = gameState.patterns[patternName as keyof typeof gameState.patterns] || 0

        if (operator && !isNaN(value)) {
          switch (operator) {
            case '>': return patternValue > value
            case '>=': return patternValue >= value
            case '<': return patternValue < value
            case '<=': return patternValue <= value
            case '=':
            case '==': return patternValue === value
          }
        }
      }
    }

    // 5. Check dominant pattern (e.g. "dominant_analytical", "dominant_helping")
    if (condition.startsWith('dominant_')) {
      const patternName = condition.replace('dominant_', '')

      // Find the highest pattern value
      let maxPattern = ''
      let maxValue = 0
      for (const [key, val] of Object.entries(gameState.patterns)) {
        if (val > maxValue) {
          maxValue = val
          maxPattern = key
        }
      }

      return maxPattern === patternName && maxValue > 0
    }

    return false
  }
}
