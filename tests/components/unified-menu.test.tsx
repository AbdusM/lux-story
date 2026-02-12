import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
  LoginModal: ({ isOpen }: { isOpen: boolean }) => (
    isOpen ? <div data-testid="login-modal">Login Modal</div> : null
  ),
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

const mockUserRole = {
  user: null as { email?: string | null } | null,
  role: 'anonymous',
  loading: false,
}
vi.mock('@/hooks/useUserRole', () => ({
  useUserRole: () => mockUserRole,
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
    signOut.mockReset()
    signOut.mockResolvedValue(undefined)
    mockUserRole.user = null
    mockUserRole.role = 'anonymous'
    mockUserRole.loading = false
    if (typeof localStorage !== 'undefined' && typeof localStorage.clear === 'function') {
      localStorage.clear()
    }
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

  it('renders authenticated account state and signs out', async () => {
    mockUserRole.user = { email: 'admin@example.com' }
    mockUserRole.role = 'admin'

    const user = userEvent.setup()
    render(<UnifiedMenu />)
    await user.click(screen.getByRole('button', { name: /settings menu/i }))

    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /sign out/i }))
    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1))
  })

  it('opens login modal from guest account branch', async () => {
    const user = userEvent.setup()
    render(<UnifiedMenu />)

    await user.click(screen.getByRole('button', { name: /settings menu/i }))
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByTestId('login-modal')).toBeInTheDocument()
  })

  it('renders active profile/admin branches and applies text/color settings', async () => {
    const user = userEvent.setup()
    const onShowReport = vi.fn()

    render(<UnifiedMenu onShowReport={onShowReport} playerId="player_123" />)
    await user.click(screen.getByRole('button', { name: /settings menu/i }))

    const clinicalAuditLink = screen.getByRole('link', { name: /clinical audit/i })
    expect(clinicalAuditLink).toHaveAttribute('href', '/admin/player_123')

    await user.click(screen.getByRole('button', { name: /accessibility/i }))
    await user.click(screen.getByRole('button', { name: 'Large' }))
    await user.click(screen.getByRole('button', { name: 'Protanopia' }))

    await waitFor(() => {
      expect(setTextSize).toHaveBeenCalledWith('large')
      expect(setColorBlindMode).toHaveBeenCalledWith('protanopia')
    })
    expect(pushNow).toHaveBeenCalledTimes(2)

    await user.click(screen.getByRole('button', { name: /career profile/i }))
    expect(onShowReport).toHaveBeenCalledTimes(1)
  })

  it('keeps menu stable when sign out fails', async () => {
    mockUserRole.user = { email: 'user@example.com' }
    mockUserRole.role = 'user'
    signOut.mockRejectedValueOnce(new Error('network'))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const user = userEvent.setup()
    render(<UnifiedMenu />)
    await user.click(screen.getByRole('button', { name: /settings menu/i }))
    await user.click(screen.getByRole('button', { name: /sign out/i }))

    await waitFor(() => expect(errorSpy).toHaveBeenCalled())
    expect(screen.getByRole('dialog', { name: /settings/i })).toBeInTheDocument()

    errorSpy.mockRestore()
  })
})
