import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UnifiedMenu } from '@/components/UnifiedMenu'
import { STORAGE_KEYS } from '@/lib/persistence/storage-keys'

// Keep animation semantics out of unit tests.
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layoutId: _layoutId, ...props }: { children: React.ReactNode; layoutId?: string }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}))

vi.mock('@/hooks/useUserRole', () => ({
  useUserRole: () => ({ user: null, role: null, loading: false }),
}))

vi.mock('@/hooks/useLargeTextMode', () => ({
  useLargeTextMode: () => ({ textSize: 'default', setTextSize: vi.fn() }),
}))

vi.mock('@/hooks/useColorBlindMode', () => ({
  useColorBlindMode: () => ['default', vi.fn()],
}))

vi.mock('@/hooks/useSettingsSync', () => ({
  useSettingsSync: () => ({ pushNow: vi.fn().mockResolvedValue(undefined) }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { signOut: vi.fn().mockResolvedValue(undefined) } }),
}))

describe('UnifiedMenu', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('reduce-motion')
  })

  it('opens and closes via trigger and close button', async () => {
    const user = userEvent.setup()
    render(<UnifiedMenu />)

    const trigger = screen.getByRole('button', { name: /settings menu/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog', { name: /settings/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /close settings/i }))
    expect(screen.queryByRole('dialog', { name: /settings/i })).toBeNull()
  })

  it('renders unavailable states when game has not started', async () => {
    const user = userEvent.setup()
    render(<UnifiedMenu />)

    await user.click(screen.getByRole('button', { name: /settings menu/i }))
    expect(screen.getByText(/career profile \(unavailable\)/i)).toBeInTheDocument()
    expect(screen.getByText(/clinical audit \(start game first\)/i)).toBeInTheDocument()
  })

  it('toggles reduce motion (switch ARIA + storage + root class)', async () => {
    const user = userEvent.setup()
    render(<UnifiedMenu />)

    await user.click(screen.getByRole('button', { name: /settings menu/i }))
    await user.click(screen.getByRole('button', { name: /accessibility/i }))

    const reduceMotion = screen.getByRole('switch', { name: /reduce motion animations/i })
    expect(reduceMotion).toHaveAttribute('aria-checked', 'false')

    await user.click(reduceMotion)
    expect(reduceMotion).toHaveAttribute('aria-checked', 'true')
    expect(localStorage.getItem(STORAGE_KEYS.REDUCED_MOTION)).toBe('true')
    expect(document.documentElement.classList.contains('reduce-motion')).toBe(true)
  })
})
