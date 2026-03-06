import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      const { whileHover, whileTap, initial, animate, exit, variants, transition, layoutId, ...rest } = props
      return <div {...(rest as any)}>{children}</div>
    },
    button: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      const { whileHover, whileTap, initial, animate, exit, variants, transition, layoutId, ...rest } = props
      return <button {...(rest as any)}>{children}</button>
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import { SimulationRenderer } from '@/components/game/SimulationRenderer'

describe('SimulationRenderer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // JSDOM doesn't reliably implement scrollIntoView; SecureTerminal calls it in an effect.
    if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = () => undefined
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('times out and calls onComplete with timedOut=true', () => {
    const onComplete = vi.fn()

    render(
      <SimulationRenderer
        simulation={{
          type: 'secure_terminal',
          title: 'Timeout Test',
          taskDescription: 'A test simulation that never succeeds.',
          initialContext: {},
          timeLimit: 1,
        }}
        onComplete={onComplete}
      />
    )

    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete.mock.calls[0]?.[0]).toMatchObject({ success: false, timedOut: true })
  })

  it('uses the Lux Story shared shell instead of the old dashboard chrome', () => {
    const onComplete = vi.fn()
    const onExit = vi.fn()

    render(
      <SimulationRenderer
        simulation={{
          type: 'secure_terminal',
          title: 'Archive Review',
          taskDescription: 'Trace the record that matters before the window closes.',
          initialContext: {
            label: 'ARCHIVE',
            content: 'LOG ENTRY 01',
          },
          onExit,
        }}
        onComplete={onComplete}
      />
    )

    expect(screen.getByTestId('simulation-shell-header')).toBeInTheDocument()
    expect(screen.getByTestId('simulation-frame-title')).toHaveTextContent('Archive Review')
    expect(screen.getByTestId('simulation-frame-brief')).toHaveTextContent('Trace the record that matters before the window closes.')
    expect(screen.getByRole('button', { name: /step back/i })).toBeInTheDocument()
    expect(screen.queryByText(/secure terminal/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/SIMULATION_CORE/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /abort simulation/i })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /step back/i }))
    expect(onExit).toHaveBeenCalledTimes(1)
  })
})
