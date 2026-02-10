import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { GameState } from '@/lib/character-state'
import { GameStateUtils } from '@/lib/character-state'
import { GameFooter } from '@/components/game/GameFooter'

function renderFooterWithState(gameState: GameState | null) {
  const onOpenPrismTab = vi.fn()

  render(
    <GameFooter
      isEnding={false}
      availableChoices={[]}
      currentNode={null}
      gameState={gameState}
      isProcessing={false}
      outcomeCard={null}
      rewardFeed={[]}
      onDismissOutcome={() => {}}
      onDismissRewardItem={() => {}}
      onOpenPrismTab={onOpenPrismTab}
      orbFillLevels={{
        analytical: 0,
        helping: 0,
        building: 0,
        patience: 0,
        exploring: 0,
      }}
      cognitiveLoad="normal"
      onChoice={() => {}}
    />
  )

  return { onOpenPrismTab }
}

describe('Objective Pin', () => {
  it('does not render when no quests are unlocked', () => {
    const s = GameStateUtils.createNewGameState('fresh')
    renderFooterWithState(s)
    expect(screen.queryByTestId('objective-pin')).toBeNull()
  })

  it('renders and opens the correct prism tab when quests are unlocked', () => {
    const s = GameStateUtils.createNewGameState('baseline_midgame_v1')
    const { onOpenPrismTab } = renderFooterWithState(s)

    const pin = screen.getByTestId('objective-pin')
    expect(pin).toBeTruthy()
    expect(pin.textContent || '').toMatch(/Objective/i)

    const view = screen.getByTestId('objective-view')
    view.click()
    expect(onOpenPrismTab).toHaveBeenCalledTimes(1)
    // Midgame fixture unlocks character arcs; those map to Essence.
    expect(onOpenPrismTab).toHaveBeenCalledWith('essence')
  })
})
