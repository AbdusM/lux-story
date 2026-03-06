import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { test, expect } from '../fixtures/game-state-fixtures'

const OUTPUT_DIR =
  process.env.VISUAL_REVIEW_OUTPUT_DIR ||
  'analysis/reviewer-assets/panels/evidence/visual-review-2026-03-06/screenshots'

const PROFILE_PLAYER_ID = '11111111-1111-1111-1111-111111111111'

function ensureOutputDir() {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function capture(page: import('@playwright/test').Page, name: string, fullPage = false) {
  ensureOutputDir()
  await page.waitForTimeout(300)
  await page.screenshot({
    path: join(OUTPUT_DIR, `${name}.png`),
    fullPage,
    animations: 'disabled',
    caret: 'hide',
    timeout: 30_000,
  })
}

async function primeProfileSession(page: import('@playwright/test').Page) {
  await page.goto('about:blank')
  await page.addInitScript((playerId) => {
    localStorage.setItem('lux-player-id', playerId)
    localStorage.setItem('playerId', playerId)
    localStorage.setItem('gameUserId', playerId)
  }, PROFILE_PLAYER_ID)
}

test.describe.configure({ mode: 'serial' })

test.describe('Visual Review Capture', () => {
  test('capture review surfaces', async ({ page, seedState }, testInfo) => {
    const project = testInfo.project.name
    const isDesktop = project === 'visual-desktop-1440'
    const isIPhone14 = project === 'visual-mobile-iphone-14'
    const isIPhoneSE = project === 'visual-mobile-iphone-se'

    await test.step('Landing', async () => {
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await expect(page.getByRole('button', { name: /begin your journey|enter station/i })).toBeVisible({
        timeout: 15000,
      })
      await capture(page, `${project}-home`)
    })

    await test.step('Gameplay shell', async () => {
      await seedState({ currentCharacterId: 'samuel', currentNodeId: 'samuel_introduction' })
      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })
      await expect(page.getByTestId('dialogue-card')).toBeVisible({ timeout: 10000 })
      await capture(page, `${project}-gameplay-shell`)
    })

    await test.step('Return hook variant', async () => {
      const eightHoursAgo = Date.now() - (8 * 60 * 60 * 1000)
      await seedState({
        currentCharacterId: 'samuel',
        currentNodeId: 'samuel_introduction',
        lastSaved: eightHoursAgo,
        pendingCheckIns: [{ characterId: 'maya', sessionsRemaining: 0, dialogueNodeId: 'maya_intro' }],
        characterTrust: { maya: 4 },
        characterConversationHistory: { maya: ['maya_intro'] },
        characterLastInteractionTimestamp: { maya: eightHoursAgo },
      })
      await expect(page.getByTestId('return-hook')).toBeVisible({ timeout: 10000 })
      await capture(page, `${project}-return-hook`)
    })

    await test.step('Simulation shell', async () => {
      await seedState({
        currentCharacterId: 'dante',
        currentNodeId: 'dante_simulation_phase2',
        characterTrust: { dante: 5 },
        characterConversationHistory: { dante: ['dante_simulation_phase2'] },
      })
      await expect(page.getByTestId('simulation-interface')).toBeVisible({ timeout: 10000 })
      await capture(page, `${project}-simulation-shell`)
    })

    if (isDesktop || isIPhone14) {
      await test.step('Settings surface', async () => {
        await seedState({ currentCharacterId: 'samuel', currentNodeId: 'samuel_introduction' })
        await expect(page.getByRole('button', { name: /settings menu/i })).toBeVisible({ timeout: 10000 })
        await page.getByRole('button', { name: /settings menu/i }).click()

        const settingsDialog = page.getByRole('dialog', { name: /settings/i })
        await expect(settingsDialog).toBeVisible({ timeout: 10000 })
        await capture(page, `${project}-settings`)
      })
    }

    if (isIPhone14 || isIPhoneSE) {
      await test.step('Choice sheet', async () => {
        await seedState({ currentCharacterId: 'marcus', currentNodeId: 'marcus_intro' })
        const trigger = page.getByTestId('choice-sheet-trigger')
        await expect(trigger).toBeVisible({ timeout: 15000 })
        await trigger.click()
        const sheet = page.getByRole('dialog', { name: /choose a response/i })
        await expect(sheet).toBeVisible({ timeout: 10000 })
        await capture(page, `${project}-choice-sheet`)
      })
    }

    if (isDesktop || isIPhone14) {
      await test.step('Profile and research settings', async () => {
        await primeProfileSession(page)
        await page.goto('/profile', { waitUntil: 'domcontentloaded' })
        await expect(page.getByRole('heading', { name: /profile & settings/i })).toBeVisible({
          timeout: 15000,
        })
        await capture(page, `${project}-profile`)

        const researchHeading = page.getByRole('heading', { name: /research participation/i })
        await expect(researchHeading).toBeVisible({ timeout: 10000 })
        await researchHeading.scrollIntoViewIfNeeded()
        await page.waitForTimeout(500)
        await capture(page, `${project}-profile-research`)
      })
    }
  })
})
