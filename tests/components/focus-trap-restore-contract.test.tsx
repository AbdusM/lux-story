import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFocusTrap } from '@/hooks/useFocusTrap'

function TestOverlay({
  label,
  onClose,
  children,
}: {
  label: string
  onClose: () => void
  children?: React.ReactNode
}) {
  const { ref, onKeyDown } = useFocusTrap<HTMLDivElement>()

  return (
    <div
      ref={ref}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-overlay-surface
    >
      <button type="button" onClick={onClose}>
        Close {label}
      </button>
      {children}
      <button type="button">Secondary</button>
    </div>
  )
}

function FocusTrapHarness() {
  const [aOpen, setAOpen] = React.useState(false)
  const [bOpen, setBOpen] = React.useState(false)

  return (
    <div>
      <button type="button" aria-label="Trigger" onClick={() => setAOpen(true)}>
        Trigger
      </button>

      {aOpen && (
        <TestOverlay label="Overlay A" onClose={() => setAOpen(false)}>
          <button type="button" onClick={() => setBOpen(true)}>
            Open Overlay B
          </button>
        </TestOverlay>
      )}
      {bOpen && <TestOverlay label="Overlay B" onClose={() => setBOpen(false)} />}
    </div>
  )
}

describe('useFocusTrap contract', () => {
  it('restores focus to the prior element, but only into remaining overlay surfaces', async () => {
    const user = userEvent.setup()
    render(<FocusTrapHarness />)

    const trigger = screen.getByRole('button', { name: /trigger/i })
    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    await user.click(trigger)
    const aClose = screen.getByRole('button', { name: /close overlay a/i })
    await waitFor(() => expect(document.activeElement).toBe(aClose))

    const openBFromA = screen.getByRole('button', { name: /open overlay b/i })
    await user.click(openBFromA)
    const bClose = screen.getByRole('button', { name: /close overlay b/i })
    await waitFor(() => expect(document.activeElement).toBe(bClose))

    await user.click(bClose)
    await waitFor(() => expect(document.activeElement).toBe(openBFromA))

    await user.click(aClose)
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  })
})
