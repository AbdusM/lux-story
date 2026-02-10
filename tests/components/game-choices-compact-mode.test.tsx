import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameChoices } from '@/components/GameChoices'

describe('GameChoices (Compact Mode)', () => {
  it('shows a subset first, and expands to show all choices', async () => {
    const choices = Array.from({ length: 7 }, (_, i) => ({
      id: `c${i + 1}`,
      text: `Option ${i + 1}`,
    }))

    render(
      <GameChoices
        choices={choices}
        isProcessing={false}
        onChoice={() => {}}
        glass={true}
        compactMaxShown={4}
      />
    )

    expect(screen.getAllByRole('option')).toHaveLength(4)
    expect(screen.getByTestId('choice-compact-toggle')).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByTestId('choice-compact-toggle'))
    expect(screen.getAllByRole('option')).toHaveLength(7)

    await user.click(screen.getByTestId('choice-compact-toggle'))
    expect(screen.getAllByRole('option')).toHaveLength(4)
  })
})

