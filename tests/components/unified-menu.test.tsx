import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Keep animation semantics out of unit tests.
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const routerPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
}))

// Next's Link can rely on Next runtime; for unit tests treat it as an anchor.
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('@/components/auth/LoginModal', () => ({
  LoginModal: () => null,
}))

const pushNow = vi.fn().mockResolvedValue(undefined)
vi.mock('@/hooks/useSettingsSync', () => ({
  useSettingsSync: () => ({ pushNow }),
}))

const setTextSize = vi.fn()
vi.mock('@/hooks/useLargeTextMode', () => ({
  useLargeTextMode: () => ({ textSize: 'default', setTextSize }),
}))

const setColorBlindMode = vi.fn()
vi.mock('@/hooks/useColorBlindMode', () => ({
  useColorBlindMode: () => (['default', setColorBlindMode] as const),
}))

vi.mock('@/hooks/useUserRole', () => ({
  useUserRole: () => ({ user: null, role: 'anonymous', loading: false }),
}))

const signOut = vi.fn().mockResolvedValue(undefined)
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { signOut } }),
}))

import { UnifiedMenu } from '@/components/UnifiedMenu'

describe('UnifiedMenu', () => {
  beforeEach(() => {
    routerPush.mockClear()
    pushNow.mockClear()
    setTextSize.mockClear()
    setColorBlindMode.mockClear()
    signOut.mockClear()
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('opens/closes, shows unavailable states, and toggles reduce motion', async () => {
    const user = userEvent.setup()
    const onToggleMute = vi.fn()
    const onVolumeChange = vi.fn()

    render(
      <UnifiedMenu
        isMuted={false}
        onToggleMute={onToggleMute}
        volume={50}
        onVolumeChange={onVolumeChange}
        // no onShowReport, no playerId -> unavailable UI should render
      />
    )

    await user.click(screen.getByRole('button', { name: /settings menu/i }))
    expect(screen.getByRole('dialog', { name: /settings/i })).toBeInTheDocument()

    expect(screen.getByText(/career profile \(unavailable\)/i)).toBeInTheDocument()
    expect(screen.getByText(/clinical audit \(start game first\)/i)).toBeInTheDocument()

    // Audio controls
    fireEvent.change(screen.getByLabelText(/volume level/i), { target: { value: '80' } })
    expect(onVolumeChange).toHaveBeenCalledWith(80)

    await user.click(screen.getByRole('switch', { name: /mute audio/i }))
    expect(onToggleMute).toHaveBeenCalledTimes(1)

    // Expand Accessibility section
    await user.click(screen.getByRole('button', { name: /accessibility/i }))
    const reduceMotion = screen.getByRole('switch', { name: /reduce motion animations/i })
    expect(reduceMotion).toHaveAttribute('aria-checked', 'false')

    await user.click(reduceMotion)
    expect(screen.getByRole('switch', { name: /reduce motion animations/i })).toHaveAttribute('aria-checked', 'true')
    expect(localStorage.getItem('lux_reduced_motion')).toBe('true')
    expect(document.documentElement.classList.contains('reduce-motion')).toBe(true)

    // Close via Escape (backdrop has aria-hidden).
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: /settings/i })).not.toBeInTheDocument()
  })

  it('navigates to profile settings when selecting All Settings', async () => {
    const user = userEvent.setup()

    render(<UnifiedMenu />)
    await user.click(screen.getByRole('button', { name: /settings menu/i }))

    await user.click(screen.getByRole('button', { name: /all settings/i }))
    expect(routerPush).toHaveBeenCalledWith('/profile')
  })
})
