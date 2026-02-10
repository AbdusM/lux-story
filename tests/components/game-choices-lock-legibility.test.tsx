import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameChoices } from '@/components/GameChoices'

describe('GameChoices (Locked Choice Legibility)', () => {
  it('renders a locked orb-gated choice with why/how and progress', () => {
    render(
      <GameChoices
        choices={[
          {
            id: 'c_mercy',
            text: 'Ask the hard question.',
            requiredOrbFill: { pattern: 'analytical', threshold: 50 },
          },
          {
            id: 'c_locked',
            text: 'Demand proof.',
            requiredOrbFill: { pattern: 'analytical', threshold: 80 },
          },
        ]}
        isProcessing={false}
        onChoice={() => {}}
        orbFillLevels={{
          analytical: 10,
          building: 0,
          helping: 0,
          patience: 0,
          exploring: 0,
        }}
        glass={true}
      />
    )

    expect(screen.getByTestId('choice-button-locked')).toBeInTheDocument()
    expect(screen.getByText('Requires The Weaver resonance (80%)')).toBeInTheDocument()
    expect(screen.getByText(/To unlock:/)).toBeInTheDocument()
    expect(screen.getByText('10/80')).toBeInTheDocument()
  })
})
