
import { cn } from "@/lib/utils"

/**
 * Voice Styling Utilities
 * 
 * Maps character identities to specific typographic voices.
 * Used by DialogueDisplay and StoryMessage to ensure consistent personality.
 */

export type VoiceStyle = {
  font: string
  color: string
  tracking: string
  weight: string
  style: string
  border?: string
  background?: string
}

/**
 * Unified Typography: Space Mono for all characters
 *
 * Rationale:
 * - Text-game heritage (Zork, A Dark Room) - signals "input expected"
 * - iA Writer effect - predictable character tracking reduces eye strain
 * - Field notes aesthetic - fits Birmingham career exploration theme
 * - Mechanical advantages - aligned choices, predictable wrapping
 *
 * Character differentiation now via color only (subtle, not jarring)
 */
export const CHARACTER_VOICES: Record<string, Partial<VoiceStyle>> = {
  'Samuel': {
    font: 'font-mono',
    color: 'text-stone-800 dark:text-stone-200',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Maya': {
    font: 'font-mono',
    color: 'text-stone-800 dark:text-stone-200',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Devon': {
    font: 'font-mono',
    color: 'text-stone-800 dark:text-stone-200',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Kai': {
    font: 'font-mono',
    color: 'text-stone-800 dark:text-stone-200',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Jordan': {
    font: 'font-mono',
    color: 'text-stone-800 dark:text-stone-200',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Tess': {
    font: 'font-mono',
    color: 'text-stone-800 dark:text-stone-200',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Rohan': {
    font: 'font-mono',
    color: 'text-stone-800 dark:text-stone-200',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Silas': {
    font: 'font-mono',
    color: 'text-stone-800 dark:text-stone-200',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Marcus': {
    font: 'font-mono',
    color: 'text-stone-800 dark:text-stone-200',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Yaquin': {
    font: 'font-mono',
    color: 'text-stone-800 dark:text-stone-200',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Narrator': {
    font: 'font-mono',
    color: 'text-stone-600 dark:text-stone-400',
    tracking: 'tracking-normal',
    style: 'italic',
    border: 'border-l-2 border-stone-300 pl-4',
  },
  'System': {
    font: 'font-mono',
    color: 'text-emerald-700 dark:text-emerald-400',
    tracking: 'tracking-normal',
    weight: 'font-bold',
    background: 'bg-stone-100/50 dark:bg-stone-900/50 p-2 rounded',
  },
  'You': {
    font: 'font-mono',
    color: 'text-stone-500 dark:text-stone-400',
    style: 'italic',
    tracking: 'tracking-tight',
  },
  // Internal monologue - player's inner thoughts, distinct from choices
  'Internal': {
    font: 'font-mono',
    color: 'text-stone-500 dark:text-stone-400',
    style: 'italic text-[0.95em]',
    tracking: 'tracking-tight',
  },
  // Pattern sensation - brief atmospheric feedback after pattern choices
  'Sensation': {
    font: 'font-serif',
    color: 'text-amber-600/80 dark:text-amber-400/80',
    style: 'italic text-sm',
    tracking: 'tracking-normal',
  },
  // Ambient event - station atmosphere, 3rd person limited
  'Ambient': {
    font: 'font-serif',
    color: 'text-stone-500/90 dark:text-stone-400/90',
    style: 'italic text-sm',
    tracking: 'tracking-normal',
  }
}

export function getVoiceClass(characterName?: string): string {
  if (!characterName) return "font-mono text-stone-800 dark:text-stone-200"
  
  // Normalize
  const lower = characterName.toLowerCase()
  const key = Object.keys(CHARACTER_VOICES).find(k => lower.includes(k.toLowerCase()))
  
  const style = key ? CHARACTER_VOICES[key] : null
  
  if (!style) return "font-sans text-slate-800 dark:text-slate-200"
  
  return cn(
    style.font,
    style.color,
    style.tracking,
    style.weight,
    style.style,
    style.border,
    style.background
  )
}
