'use client'

import { Bot, Hand, Wand2 } from 'lucide-react'

import type { AssistMode } from '@/lib/guidance/contracts'
import { cn } from '@/lib/utils'

const ASSIST_MODE_OPTIONS: Array<{
  id: AssistMode
  label: string
  icon: typeof Hand
}> = [
  { id: 'manual', label: 'Manual', icon: Hand },
  { id: 'augmented', label: 'With AI', icon: Wand2 },
  { id: 'delegated', label: 'Delegate', icon: Bot },
]

interface AssistModeSelectorProps {
  value: AssistMode
  onChange: (mode: AssistMode) => void
  tone?: 'dark' | 'light'
}

export function AssistModeSelector({
  value,
  onChange,
  tone = 'dark',
}: AssistModeSelectorProps) {
  return (
    <div
      className={cn(
        'inline-flex flex-wrap items-center gap-2 rounded-full border p-1',
        tone === 'dark'
          ? 'border-white/10 bg-white/[0.04]'
          : 'border-amber-200 bg-white/70',
      )}
      role="radiogroup"
      aria-label="Assist mode"
    >
      {ASSIST_MODE_OPTIONS.map((option) => {
        const Icon = option.icon
        const selected = option.id === value

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              selected
                ? tone === 'dark'
                  ? 'bg-amber-400/20 text-amber-100'
                  : 'bg-amber-100 text-amber-900'
                : tone === 'dark'
                  ? 'text-slate-400 hover:bg-white/8 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
