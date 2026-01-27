/**
 * Interrupt visibility logic
 *
 * D-009: Filter interrupt visibility based on player's developed patterns.
 * Only see interrupts aligned with patterns at EMERGING threshold (2+).
 */

import type { InterruptWindow } from '@/lib/dialogue-graph'
import { INTERRUPT_PATTERN_ALIGNMENT } from '@/lib/interrupt-derivatives'

export const EMERGING_THRESHOLD = 2 // Matches PATTERN_THRESHOLDS.EMERGING

export function shouldShowInterrupt(
  interrupt: InterruptWindow | null | undefined,
  patterns: { analytical: number; patience: number; exploring: number; helping: number; building: number }
): InterruptWindow | null {
  if (!interrupt) return null

  // Get patterns aligned with this interrupt type
  const alignedPatterns = INTERRUPT_PATTERN_ALIGNMENT[interrupt.type]
  if (!alignedPatterns) return interrupt // Unknown type — show by default

  // Check if any aligned pattern is at EMERGING threshold
  const hasAlignedPattern = alignedPatterns.some(
    patternKey => patterns[patternKey] >= EMERGING_THRESHOLD
  )

  // If no aligned pattern developed, hide the interrupt
  return hasAlignedPattern ? interrupt : null
}
