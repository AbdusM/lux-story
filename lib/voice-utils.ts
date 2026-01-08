
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
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Maya': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Devon': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Kai': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Jordan': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Tess': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Rohan': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Silas': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Marcus': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Yaquin': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Elena': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Grace': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)]',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Narrator': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)] opacity-80',
    tracking: 'tracking-normal',
    style: 'italic',
    border: 'border-l-2 border-white/20 pl-4',
  },
  'System': {
    font: 'font-mono',
    color: 'text-emerald-400',
    tracking: 'tracking-normal',
    weight: 'font-bold',
    background: 'bg-black/40 p-2 rounded',
  },
  'You': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)] opacity-70',
    style: 'italic',
    tracking: 'tracking-tight',
  },
  // Internal monologue - player's inner thoughts, distinct from choices
  'Internal': {
    font: 'font-mono',
    color: 'text-[color:var(--text-dialogue)] opacity-60',
    style: 'italic text-[0.95em]',
    tracking: 'tracking-tight',
  },
  // Pattern sensation - brief atmospheric feedback after pattern choices
  'Sensation': {
    font: 'font-serif',
    color: 'text-amber-400/90',
    style: 'italic text-sm',
    tracking: 'tracking-normal',
  },
  // Ambient event - station atmosphere, 3rd person limited
  'Ambient': {
    font: 'font-serif',
    color: 'text-[color:var(--text-dialogue)] opacity-60',
    style: 'italic text-sm',
    tracking: 'tracking-normal',
  }
}

export function getVoiceClass(characterName?: string): string {
  if (!characterName) return "font-mono text-[color:var(--text-dialogue)]"

  // Normalize
  const lower = characterName.toLowerCase()
  const key = Object.keys(CHARACTER_VOICES).find(k => lower.includes(k.toLowerCase()))

  const style = key ? CHARACTER_VOICES[key] : null

  if (!style) return "font-sans text-[color:var(--text-dialogue)]"

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
