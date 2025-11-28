
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
    color: 'text-amber-900 dark:text-amber-100',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Maya': {
    font: 'font-mono',
    color: 'text-blue-900 dark:text-blue-100',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Devon': {
    font: 'font-mono',
    color: 'text-orange-900 dark:text-orange-100',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Kai': {
    font: 'font-mono',
    color: 'text-purple-900 dark:text-purple-100',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Jordan': {
    font: 'font-mono',
    color: 'text-teal-900 dark:text-teal-100',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Tess': {
    font: 'font-mono',
    color: 'text-rose-900 dark:text-rose-100',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Rohan': {
    font: 'font-mono',
    color: 'text-indigo-900 dark:text-indigo-100',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Silas': {
    font: 'font-mono',
    color: 'text-emerald-900 dark:text-emerald-100',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Yaquin': {
    font: 'font-mono',
    color: 'text-cyan-900 dark:text-cyan-100',
    tracking: 'tracking-normal',
    weight: 'font-normal',
  },
  'Narrator': {
    font: 'font-mono',
    color: 'text-slate-500 dark:text-slate-400',
    tracking: 'tracking-normal',
    style: 'italic',
    border: 'border-l-2 border-slate-300 pl-4',
  },
  'System': {
    font: 'font-mono',
    color: 'text-emerald-600 dark:text-emerald-400',
    tracking: 'tracking-normal',
    weight: 'font-bold',
    background: 'bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded',
  },
  'You': {
    font: 'font-mono',
    color: 'text-slate-700 dark:text-slate-300',
    style: 'italic',
  }
}

export function getVoiceClass(characterName?: string): string {
  if (!characterName) return "font-mono text-slate-800 dark:text-slate-200"
  
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
