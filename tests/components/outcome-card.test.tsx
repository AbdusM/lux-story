import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OutcomeCard } from '@/components/game/OutcomeCard'
import type { OutcomeCardData } from '@/lib/outcome-card'

describe('OutcomeCard', () => {
  it('renders items and supports deep links into Prism tabs', async () => {
    const onDismiss = vi.fn()
    const onOpenPrismTab = vi.fn()

    const card: OutcomeCardData = {
      id: 't1',
      items: [
        { kind: 'trust', title: 'Trust (Samuel)', detail: '+1' },
        { kind: 'orb', title: 'Orb gained', detail: 'The Weaver', prismTab: 'harmonics' },
        { kind: 'unlock', title: 'Mastery Unlocked', detail: 'Pattern Sight', prismTab: 'mastery' },
      ],
      nextAction: { label: 'Next: Review objective (Test)', prismTab: 'careers' },
    }

    render(
      <OutcomeCard
        card={card}
        onDismiss={onDismiss}
        onOpenPrismTab={onOpenPrismTab}
      />
    )

    expect(screen.getByTestId('outcome-card')).toBeInTheDocument()
    expect(screen.getByText('Trust (Samuel)')).toBeInTheDocument()
    expect(screen.getByText('Orb gained')).toBeInTheDocument()
    expect(screen.getByText('Mastery Unlocked')).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByTestId('outcome-deeplink-harmonics'))
    expect(onOpenPrismTab).toHaveBeenCalledWith('harmonics')

    await user.click(screen.getByTestId('outcome-deeplink-mastery'))
    expect(onOpenPrismTab).toHaveBeenCalledWith('mastery')

    await user.click(screen.getByTestId('outcome-next-action'))
    expect(onOpenPrismTab).toHaveBeenCalledWith('careers')
  })

  it('renders a minimal fallback row when there are no visible deltas', () => {
    const card: OutcomeCardData = { id: 't_empty', items: [] }
    render(<OutcomeCard card={card} onDismiss={vi.fn()} onOpenPrismTab={vi.fn()} />)
    expect(screen.getByText(/Story progressed/i)).toBeInTheDocument()
    expect(screen.getByText(/No visible changes yet/i)).toBeInTheDocument()
  })

  it('never renders a deep link to god_mode', () => {
    render(
      <OutcomeCard
        card={{
          id: 't_god',
          items: [
            { kind: 'info', title: 'Debug', detail: 'x', prismTab: 'god_mode' },
          ],
        }}
        onDismiss={vi.fn()}
        onOpenPrismTab={vi.fn()}
      />
    )

    expect(screen.queryByTestId('outcome-deeplink-god_mode')).toBeNull()
  })
})
