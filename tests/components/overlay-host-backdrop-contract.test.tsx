import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OverlayHost } from '@/components/overlays/OverlayHost'
import { useOverlayStore } from '@/lib/overlay-store'

describe('OverlayHost backdrop contract', () => {
  beforeEach(() => {
    useOverlayStore.setState({ overlayStack: [] })
  })

  it('renders an interactive backdrop button only when the top overlay allows backdrop dismissal', () => {
    useOverlayStore.getState().pushOverlay('journal')
    render(<OverlayHost renderOverlay={() => <div />} />)

    const backdropButton = screen.getByRole('button', { name: /dismiss overlay/i })
    expect(backdropButton).toHaveAttribute('tabindex', '-1')
  })

  it('renders a non-interactive backdrop when the top overlay disallows backdrop dismissal', () => {
    useOverlayStore.getState().pushOverlay('error')
    render(<OverlayHost renderOverlay={() => <div />} />)

    expect(screen.queryByRole('button', { name: /dismiss overlay/i })).toBeNull()
    expect(screen.getByTestId('overlay-host').querySelector('[aria-hidden="true"]')).toBeTruthy()
  })
})
