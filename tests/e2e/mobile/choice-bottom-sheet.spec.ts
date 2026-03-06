import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Choice Bottom Sheet', () => {
  test('4+ choices use a bottom sheet without reflow or overflow', async ({ page, seedState }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile-iphone-14',
      'Run only on iPhone 14 width (390px) for a deterministic overflow/reflow gate.'
    )

    await seedState({ currentCharacterId: 'marcus', currentNodeId: 'marcus_intro' })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    const trigger = page.getByTestId('choice-sheet-trigger')
    await expect(trigger).toBeVisible({ timeout: 15000 })
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox?.height ?? 0).toBeGreaterThanOrEqual(56)

    const getDialogueStageTopWithinMain = async () => {
      return await page.evaluate(() => {
        const main = document.querySelector('[data-testid=\"game-interface\"]')
        const stage = document.querySelector('[data-testid=\"dialogue-stage\"]')
        if (!main || !stage) return null
        return stage.getBoundingClientRect().top - main.getBoundingClientRect().top
      })
    }

    const beforeTop = await getDialogueStageTopWithinMain()
    expect(beforeTop).not.toBeNull()
    if (beforeTop === null) return

    const dialogueCard = page.getByTestId('dialogue-card')
    const nodeIdBefore = await dialogueCard.getAttribute('data-node-id')

    await trigger.click()

    const sheet = page.getByRole('dialog', { name: /choose a response/i })
    await expect(sheet).toBeVisible({ timeout: 10000 })

    const horizontalOverflowPx = await page.evaluate(() => {
      return Math.max(0, document.documentElement.scrollWidth - window.innerWidth)
    })
    expect(horizontalOverflowPx).toBeLessThanOrEqual(1)

    const coffeeChoice = sheet.getByRole('button', { name: /drink some coffee/i })
    await expect(coffeeChoice).toBeVisible({ timeout: 10000 })
    await coffeeChoice.click()

    await expect(sheet).not.toBeVisible({ timeout: 10000 })

    if (nodeIdBefore) {
      await page.waitForFunction(
        (prev) => {
          const el = document.querySelector('[data-testid="dialogue-card"]')
          const next = el?.getAttribute('data-node-id')
          return !!next && next !== prev
        },
        nodeIdBefore,
        { timeout: 15000 }
      )
    }

    const afterTop = await getDialogueStageTopWithinMain()
    expect(afterTop).not.toBeNull()
    if (afterTop === null) return

    expect(Math.abs(afterTop - beforeTop)).toBeLessThanOrEqual(12)
  })

  test('small mobile keeps bottom-sheet choices clear of the safe area', async ({ page, seedState }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile-iphone-se',
      'Run only on iPhone SE width for the tightest safe-area and padding contract.'
    )

    await seedState({ currentCharacterId: 'marcus', currentNodeId: 'marcus_intro' })
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    const trigger = page.getByTestId('choice-sheet-trigger')
    await expect(trigger).toBeVisible({ timeout: 15000 })
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox?.height ?? 0).toBeGreaterThanOrEqual(56)

    await trigger.click()

    const sheet = page.getByRole('dialog', { name: /choose a response/i })
    await expect(sheet).toBeVisible({ timeout: 10000 })

    const lastChoice = sheet.getByTestId('choice-button').last()
    await lastChoice.scrollIntoViewIfNeeded()

    const bottomGap = await page.evaluate(() => {
      const sheetEl = document.querySelector('[role="dialog"][aria-label*="Choose a response"]')
      const buttons = Array.from(document.querySelectorAll('[data-testid="choice-button"]'))
      const lastButton = buttons[buttons.length - 1]
      if (!sheetEl || !lastButton) return null
      const sheetBox = sheetEl.getBoundingClientRect()
      const buttonBox = lastButton.getBoundingClientRect()
      return sheetBox.bottom - buttonBox.bottom
    })

    expect(bottomGap).not.toBeNull()
    expect(bottomGap ?? 0).toBeGreaterThanOrEqual(12)
  })
})
