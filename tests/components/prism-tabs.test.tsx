import React, { useState } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Users, Zap, Crown } from 'lucide-react'

// Keep animation semantics out of unit tests.
// PrismTabs uses motion.div for the active indicator + badges.
import { vi } from 'vitest'
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layoutId: _layoutId, ...props }: { children?: React.ReactNode; layoutId?: string }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

import { PrismTabs } from '@/components/journal/PrismTabs'

type TabId = 'harmonics' | 'essence' | 'mastery'

function Harness() {
  const [active, setActive] = useState<TabId>('harmonics')

  return (
    <div>
      <PrismTabs<TabId>
        tabs={[
          { id: 'harmonics', label: 'Harmonics', icon: Zap },
          { id: 'essence', label: 'Essence', icon: Users },
          { id: 'mastery', label: 'Mastery', icon: Crown },
        ]}
        activeTab={active}
        onSelect={setActive}
        tabBadges={{}}
        prefersReducedMotion={true}
        variant="top"
        ariaLabel="Prism sections"
      />

      {/* Minimal panel to validate aria-controls wiring + tab switching */}
      <div role="tabpanel" id={`prism-panel-${active}`} aria-labelledby={`prism-tab-top-${active}`}>
        Active: {active}
      </div>
    </div>
  )
}

describe('PrismTabs', () => {
  it('renders expected tabs with ARIA roles and switches active tab', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.getByRole('tablist', { name: /prism sections/i })).toBeInTheDocument()

    const harmonics = screen.getByRole('tab', { name: 'Harmonics' })
    const essence = screen.getByRole('tab', { name: 'Essence' })
    const mastery = screen.getByRole('tab', { name: 'Mastery' })

    expect(harmonics).toHaveAttribute('aria-selected', 'true')
    expect(essence).toHaveAttribute('aria-selected', 'false')
    expect(mastery).toHaveAttribute('aria-selected', 'false')

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Active: harmonics')

    await user.click(essence)
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Active: essence')
    expect(screen.getByRole('tab', { name: 'Essence' })).toHaveAttribute('aria-selected', 'true')

    await user.click(mastery)
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Active: mastery')
    expect(screen.getByRole('tab', { name: 'Mastery' })).toHaveAttribute('aria-selected', 'true')
  })
})
