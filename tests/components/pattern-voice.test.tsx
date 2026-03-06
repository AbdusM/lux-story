import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <div {...(props as any)}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

import { PatternVoice } from '@/components/game/PatternVoice'

describe('PatternVoice', () => {
  it('keeps the inner voice fiction-facing without visible taxonomy labels or dismiss hints', () => {
    render(
      <PatternVoice
        pattern="analytical"
        style="observation"
        text="Something in this pattern still feels unfinished."
      />
    )

    expect(screen.getByText('Something in this pattern still feels unfinished.')).toBeInTheDocument()
    expect(screen.queryByText(/\[analytical\]/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/click to dismiss/i)).not.toBeInTheDocument()
  })
})
