
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
   */
  static process(text: string, gameState: GameState): string {
    if (!text) return ''

    // Regex to find {{condition:true_text|false_text}} patterns
    // Captures:
    // 1. Condition (flag name)
    // 2. True Text
    // 3. False Text (optional)
    const pattern = /\{\{([^:}]+):([^|}]*)(?:\|([^}]*))?\}\}/g

    return text.replace(pattern, (match, condition, trueText, falseText) => {
      const isMet = this.evaluateCondition(condition.trim(), gameState)
      return isMet ? trueText : (falseText || '')
    })
  }

  /**
   * Evaluate a single condition string against the game state
   */
  private static evaluateCondition(condition: string, gameState: GameState): boolean {
    // 1. Check Global Flags (e.g. "met_maya")
    if (gameState.globalFlags.has(condition)) {
      return true
    }

    // 2. Check Knowledge Flags for current character (e.g. "knows_secret")
    const currentCharacter = gameState.characters.get(gameState.currentCharacterId)
    if (currentCharacter && currentCharacter.knowledgeFlags.has(condition)) {
      return true
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

    return false
  }
}
