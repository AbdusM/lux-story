import { test, expect } from './fixtures/game-state-fixtures'

/**
 * Journey Summary Feature Tests
 * The Journey Summary is exposed from the EndingPanel when:
 * - the current node has no available choices (`isEnding`)
 * - and `isJourneyComplete(gameState)` is true
 */

const createJourneySummaryReadyState = () => ({
  // Force an ending state (node has no choices) so EndingPanel is rendered.
  currentNodeId: 'journey_complete_trigger',
  currentCharacterId: 'samuel',

  // Two completed arcs => `isJourneyComplete` true.
  globalFlags: ['maya_arc_complete', 'devon_arc_complete', 'met_maya', 'met_devon'],

  // Keep patterns low to avoid pattern-unlock choices being injected (which would break `isEnding`).
  patterns: { analytical: 1, building: 0, helping: 2, patience: 0, exploring: 1 },

  characters: [
    {
      characterId: 'samuel',
      trust: 5,
      anxiety: 50,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: [],
      relationshipStatus: 'acquaintance',
      conversationHistory: []
    },
    {
      characterId: 'maya',
      trust: 7,
      anxiety: 50,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: ['maya_goal_discussed'],
      relationshipStatus: 'confidant',
      conversationHistory: []
    },
    {
      characterId: 'devon',
      trust: 6,
      anxiety: 50,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: ['devon_goal_discussed'],
      relationshipStatus: 'acquaintance',
      conversationHistory: []
    }
  ],
})

const createEndingButIncompleteState = () => ({
  currentNodeId: 'journey_complete_trigger',
  currentCharacterId: 'samuel',
  globalFlags: [],
  patterns: { analytical: 0, building: 0, helping: 1, patience: 0, exploring: 0 },
  characters: [
    {
      characterId: 'samuel',
      trust: 2,
      anxiety: 50,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: [],
      relationshipStatus: 'acquaintance',
      conversationHistory: []
    }
  ],
})

test.describe('Journey Summary', () => {
  test('See Your Journey appears only when journey is complete (ending state)', async ({ page, seedState }) => {
    await seedState(createJourneySummaryReadyState())

    // Ending panel should show the journey-complete celebration variant.
    await expect(page.getByText('The Station Knows You Now')).toBeVisible({ timeout: 15000 })

    const seeJourneyButton = page.getByRole('button', { name: 'See Your Journey' })
    await expect(seeJourneyButton).toBeVisible({ timeout: 5000 })
  })

  test('See Your Journey does not appear when ending but journey is incomplete', async ({ page, seedState }) => {
    await seedState(createEndingButIncompleteState())

    await expect(page.getByText('Conversation Complete')).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('button', { name: 'See Your Journey' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Return to Station' })).toBeVisible()
  })

  test('Journey Summary modal opens and closes correctly', async ({ page, seedState }) => {
    await seedState(createJourneySummaryReadyState())

    // Open from EndingPanel.
    await page.getByRole('button', { name: 'See Your Journey' }).click()

    // Modal should appear with Samuel's reflection header
    // Narrative generation + modal mount can be a little slow under load.
    await expect(page.getByText("Samuel's Reflection on Your Journey")).toBeVisible({ timeout: 10000 })

    // Should show "The Beginning" section first
    await expect(page.getByText('The Beginning')).toBeVisible()

    // Close with X button
    const closeButton = page.locator('button').filter({ has: page.locator('.lucide-x') })
    await closeButton.click()

    // Modal should be hidden
    await expect(page.getByText("Samuel's Reflection on Your Journey")).not.toBeVisible()
  })

  test('Journey Summary modal supports keyboard navigation', async ({ page, seedState }) => {
    await seedState(createJourneySummaryReadyState())

    await page.getByRole('button', { name: 'See Your Journey' }).click()

    // Wait for modal
    await expect(page.getByText('The Beginning')).toBeVisible()

    // Press right arrow to go to next section
    await page.keyboard.press('ArrowRight')
    await expect(page.getByText('Your Patterns')).toBeVisible()

    // Press right again
    await page.keyboard.press('ArrowRight')
    await expect(page.getByText('Connections Made')).toBeVisible()

    // Press left to go back
    await page.keyboard.press('ArrowLeft')
    await expect(page.getByText('Your Patterns')).toBeVisible()

    // Press Escape to close
    await page.keyboard.press('Escape')
    await expect(page.getByText("Samuel's Reflection on Your Journey")).not.toBeVisible()
  })

  test('Journey Summary displays all sections with Next/Back navigation', async ({ page, seedState }) => {
    await seedState(createJourneySummaryReadyState())
    await page.getByRole('button', { name: 'See Your Journey' }).click()

    const sections = [
      'The Beginning',
      'Your Patterns',
      'Connections Made',
      'Skills Demonstrated',
      'Career Paths',
      "Samuel's Wisdom"
    ]

    // Navigate through all sections using Next button
    for (let i = 0; i < sections.length; i++) {
      await expect(page.getByRole('heading', { name: sections[i] }).or(page.getByText(sections[i]))).toBeVisible()

      if (i < sections.length - 1) {
        // Click Next button
        const nextButton = page.getByRole('button', { name: 'Next', exact: true })
        await nextButton.click()

        // Wait for next section to appear
        const nextSectionText = sections[i + 1]
        await expect(page.getByRole('heading', { name: nextSectionText }).or(page.getByText(nextSectionText))).toBeVisible({ timeout: 3000 })
      }
    }

    // On last section, should show "Complete Journey" button instead of "Next"
    await expect(page.getByRole('button', { name: 'Complete Journey' })).toBeVisible()
  })

  test('Journey Summary shows journey stats', async ({ page, seedState }) => {
    await seedState(createJourneySummaryReadyState())
    await page.getByRole('button', { name: 'See Your Journey' }).click()

    // First section should show stats preview
    await expect(page.getByText(/2 arcs completed/i).or(page.getByText(/arc.*completed/i))).toBeVisible({ timeout: 3000 })
    await expect(page.getByText(/choices made/i)).toBeVisible()
    // Assert the dominant-pattern badge is rendered (unique, avoids strict-mode collisions).
    await expect(page.getByText('helping pattern')).toBeVisible()
  })

  test('Journey Summary navigation dots work', async ({ page, seedState }) => {
    await seedState(createJourneySummaryReadyState())
    await page.getByRole('button', { name: 'See Your Journey' }).click()

    // Wait for modal
    await expect(page.getByText('The Beginning')).toBeVisible()

    // Click on the third dot (Connections Made section - index 2)
    const dots = page.locator('.flex.justify-center.gap-2 button')
    await dots.nth(2).click()

    // Wait for Connections Made section to appear
    await expect(page.getByText('Connections Made')).toBeVisible({ timeout: 3000 })

    // Click on first dot (The Beginning)
    await dots.nth(0).click()

    // Wait for The Beginning section to reappear
    await expect(page.getByText('The Beginning')).toBeVisible({ timeout: 3000 })
  })

  test('Journey Summary Back button is disabled on first section', async ({ page, seedState }) => {
    await seedState(createJourneySummaryReadyState())
    await page.getByRole('button', { name: 'See Your Journey' }).click()

    // Wait for modal
    await expect(page.getByText('The Beginning')).toBeVisible()

    // Back button should be disabled
    const backButton = page.getByRole('button', { name: 'Back' })
    await expect(backButton).toBeDisabled()
  })

  test('Journey Summary Complete Journey button closes modal', async ({ page, seedState }) => {
    await seedState(createJourneySummaryReadyState())
    await page.getByRole('button', { name: 'See Your Journey' }).click()

    // Navigate to last section
    const sections = [
      'The Beginning',
      'Your Patterns',
      'Connections Made',
      'Skills Demonstrated',
      'Career Paths',
      "Samuel's Wisdom"
    ]

    for (let i = 0; i < sections.length - 1; i++) {
      const nextButton = page.getByRole('button', { name: 'Next', exact: true })
      await nextButton.click()

      // Wait for next section to appear
      await expect(page.getByText(sections[i + 1])).toBeVisible({ timeout: 3000 })
    }

    // Should be on Samuel's Wisdom (last section)
    await expect(page.getByText("Samuel's Wisdom")).toBeVisible()

    // Click Complete Journey
    const completeButton = page.getByRole('button', { name: 'Complete Journey' })
    await completeButton.click()

    // Modal should close
    await expect(page.getByText("Samuel's Reflection on Your Journey")).not.toBeVisible()
  })

  test('Journey Summary shows relationship reflections based on trust', async ({ page, seedState }) => {
    await seedState(createJourneySummaryReadyState())
    await page.getByRole('button', { name: 'See Your Journey' }).click()

    // Navigate to Connections Made section (index 2)
    const dots = page.locator('.flex.justify-center.gap-2 button')
    await dots.nth(2).click()

    // Wait for Connections Made section to appear
    await expect(page.getByText('Connections Made')).toBeVisible({ timeout: 3000 })

    // Should show character names from seeded state
    await expect(page.getByRole('heading', { name: 'Maya Chen' })).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('heading', { name: 'Devon Kumar' })).toBeVisible({ timeout: 3000 })
  })

  test('Journey Summary shows pattern profile', async ({ page, seedState }) => {
    await seedState(createJourneySummaryReadyState())
    await page.getByRole('button', { name: 'See Your Journey' }).click()

    // Navigate to Your Patterns section (index 1)
    const dots = page.locator('.flex.justify-center.gap-2 button')
    await dots.nth(1).click()

    // Wait for Your Patterns section to appear
    await expect(page.getByText('Your Patterns')).toBeVisible({ timeout: 3000 })

    // Should show pattern information (helping is highest in seeded state)
    await expect(page.getByText('Your Pattern Profile')).toBeVisible()
    await expect(page.getByText(/Primary:/i)).toBeVisible()
  })
})
