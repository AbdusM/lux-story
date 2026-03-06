import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { act, render } from '@testing-library/react'

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
})
