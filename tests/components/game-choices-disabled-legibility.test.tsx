import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameChoices } from '@/components/GameChoices'

describe('GameChoices (Disabled Choice Legibility)', () => {
  it('renders a disabled choice with a visible reason', () => {
    render(
      <GameChoices
        choices={[
          {
            id: 'c1',
            text: 'Ask about the missing shipment.',
            enabled: false,
            disabledReason: 'Need 3 trust (have 0)',
          },
        ]}
        isProcessing={false}
        onChoice={() => {}}
        glass={true}
      />
    )

    expect(screen.getByTestId('choice-button-disabled')).toBeInTheDocument()
    expect(screen.getByText(/Unavailable: Need 3 trust/)).toBeInTheDocument()
  })
})

