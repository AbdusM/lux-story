import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={String(href)} {...rest}>{children}</a>
  ),
}))

vi.mock('framer-motion', () => {
  const React = require('react')
  const motionProxy = new Proxy({}, {
    get: () => (props: any) => React.createElement('div', props, props.children),
  })
  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
  }
})

vi.mock('@/hooks/useUserRole', () => ({
  useUserRole: () => ({ user: null, role: 'player', loading: false }),
}))

vi.mock('@/hooks/useLargeTextMode', () => ({
  useLargeTextMode: () => ({ textSize: 'default', setTextSize: vi.fn() }),
}))

vi.mock('@/hooks/useColorBlindMode', () => ({
  useColorBlindMode: () => (['default', vi.fn()] as const),
}))

vi.mock('@/hooks/useSettingsSync', () => ({
  useSettingsSync: () => ({ pushNow: vi.fn(async () => {}) }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { signOut: vi.fn(async () => {}) } }),
}))

import { UnifiedMenu } from '@/components/UnifiedMenu'

describe('UnifiedMenu', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.className = ''
  })

  it('opens and closes, and renders unavailable states when playerId/onShowReport are missing', async () => {
    render(<UnifiedMenu />)

    const trigger = screen.getByRole('button', { name: /settings menu/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    expect(screen.getByRole('dialog', { name: /settings/i })).toBeInTheDocument()
    expect(screen.getByText(/career profile \(unavailable\)/i)).toBeInTheDocument()
    expect(screen.getByText(/clinical audit \(start game first\)/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /close settings/i }))
    expect(screen.queryByRole('dialog', { name: /settings/i })).toBeNull()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('supports escape-to-close and reduce motion toggle has ARIA switch', async () => {
    render(<UnifiedMenu />)

    const trigger = screen.getByRole('button', { name: /settings menu/i })
    fireEvent.click(trigger)

    fireEvent.click(screen.getByRole('button', { name: /accessibility/i }))

    const reduce = screen.getByRole('switch', { name: /reduce motion animations/i })
    expect(reduce).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(reduce)
    await waitFor(() => {
      expect(screen.getByRole('switch', { name: /reduce motion animations/i })).toHaveAttribute('aria-checked', 'true')
    })
    expect(document.documentElement.classList.contains('reduce-motion')).toBe(true)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: /settings/i })).toBeNull()
  })
})
