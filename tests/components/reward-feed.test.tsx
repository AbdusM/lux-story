import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RewardFeed } from '@/components/game/RewardFeed'

describe('RewardFeed', () => {
  it('renders items, supports deep links, and dismisses', async () => {
    const onDismissItem = vi.fn()
    const onOpenPrismTab = vi.fn()

    render(
      <RewardFeed
        items={[
          { id: 'r1', ts_ms: 1, kind: 'info', title: 'Story progressed', detail: 'No visible changes.' },
          { id: 'r2', ts_ms: 2, kind: 'info', title: 'New Echo', detail: '...', prismTab: 'mind' },
        ]}
        onDismissItem={onDismissItem}
        onOpenPrismTab={onOpenPrismTab}
      />
    )

    expect(screen.getByTestId('reward-feed')).toBeInTheDocument()
    expect(screen.getAllByTestId('reward-feed-item')).toHaveLength(2)

    const user = userEvent.setup()
    await user.click(screen.getByTestId('reward-feed-open-mind'))
    expect(onOpenPrismTab).toHaveBeenCalledWith('mind')

    await user.click(screen.getAllByTestId('reward-feed-dismiss')[0])
    expect(onDismissItem).toHaveBeenCalled()
  })
})

