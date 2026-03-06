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

describe('SimulationRenderer (data_analysis)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = () => undefined
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('committing a wrong option yields success=false', () => {
    const onComplete = vi.fn()

    render(
      <SimulationRenderer
        simulation={{
          type: 'data_analysis',
          title: 'Ethical Decision Test',
          taskDescription: 'Pick the best balance of utility and justice.',
          timeLimit: 60,
          initialContext: {
            label: 'FRAMEWORK',
            displayStyle: 'text',
            content: `OPTIONS:\nA) Deploy immediately\nB) Hold back until bias fixed`,
          },
          successFeedback: '✓ ETHICAL FRAMEWORK: Option B - Hold back until bias fixed.',
        }}
        onComplete={onComplete}
      />
    )

    expect(screen.getByText('Case File')).toBeInTheDocument()
    expect(screen.getAllByText('Working Brief')).toHaveLength(2)
    expect(screen.getByText('Choose your response')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /lock in your response/i })).toBeInTheDocument()
    expect(screen.queryByText(/^FRAMEWORK$/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /option a/i }))
    fireEvent.click(screen.getByRole('button', { name: /lock in your response/i }))

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete.mock.calls[0]?.[0]).toMatchObject({
      success: false,
      data: { selectedOption: 'A', correctOptions: ['B'] },
    })
  })

  it('committing the correct option yields success=true', () => {
    const onComplete = vi.fn()

    render(
      <SimulationRenderer
        simulation={{
          type: 'data_analysis',
          title: 'Ethical Decision Test',
          taskDescription: 'Pick the best balance of utility and justice.',
          timeLimit: 60,
          initialContext: {
            label: 'FRAMEWORK',
            displayStyle: 'text',
            content: `OPTIONS:\nA) Deploy immediately\nB) Hold back until bias fixed`,
          },
          successFeedback: '✓ ETHICAL FRAMEWORK: Option B - Hold back until bias fixed.',
        }}
        onComplete={onComplete}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /option b/i }))
    fireEvent.click(screen.getByRole('button', { name: /lock in your response/i }))

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete.mock.calls[0]?.[0]).toMatchObject({
      success: true,
      data: { selectedOption: 'B', correctOptions: ['B'] },
    })
  })
})
