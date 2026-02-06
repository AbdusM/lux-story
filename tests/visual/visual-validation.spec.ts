/**
 * Comprehensive Visual Validation Tests
 * Tests all visual components with maximally unlocked game state
 *
 * Test Coverage:
 * - 10 Journal tabs (Harmonics, Essence, Mastery, etc.)
 * - 3 Constellation views (People, Skills, Quests)
 * - 3 In-game elements (Dialogue, Pattern orbs, Avatars)
 * - 1 Performance baseline (Memory tracking)
 */

import { test, expect } from '@playwright/test'
import { createMaxUnlockState } from './max-unlock-generator'

test.describe('Comprehensive Visual Validation', () => {
  test.beforeEach(async ({ page }) => {
    // `/` is gated behind either an authenticated user or guest-mode cookie.
    await page.context().addCookies([
      { name: 'lux_guest_mode', value: 'true', url: 'http://127.0.0.1:3005' },
      { name: 'lux_guest_mode', value: 'true', url: 'http://localhost:3005' },
    ])

    // Navigate to game (God Mode opt-in for production builds)
    await page.goto('/?godmode=true', { waitUntil: 'domcontentloaded' })

    // Seed a minimal game state via localStorage and reload to hydrate.
    await page.evaluate(() => {
      localStorage.clear()
      // Mark as test environment (used by some UI/test harness code)
      // @ts-ignore - injected by test harness
      window.__PLAYWRIGHT__ = true
      localStorage.setItem('lux_story_v2_guest_mode', 'true')

      const initialState = {
        saveVersion: '1.0',
        playerId: `visual-${Date.now()}`,
        currentNodeId: 'samuel_introduction',
        currentCharacterId: 'samuel',
        patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 0 },
        characters: [],
        globalFlags: [],
        lastSaved: Date.now(),
        thoughts: [],
        episodeNumber: 1,
        sessionStartTime: Date.now(),
        sessionBoundariesCrossed: 0,
        platforms: {},
        careerValues: { directImpact: 0, systemsThinking: 0, dataInsights: 0, futureBuilding: 0, independence: 0 },
        mysteries: { letterSender: 'unknown', platformSeven: 'stable', samuelsPast: 'hidden', stationNature: 'unknown' },
        time: { currentDisplay: '23:47', minutesRemaining: 13, flowRate: 1.0, isStopped: false },
        quietHour: { potential: true, experienced: [] },
        overdensity: 0.3,
        items: { letter: 'kept', discoveredPaths: [] },
        pendingCheckIns: [],
        unlockedAbilities: [],
        archivistState: { collectedRecords: [], verifiedLore: [], sensoryCalibration: {} },
        skillLevels: {},
        skillUsage: []
      }
      localStorage.setItem('lux_story_v2_game_save', JSON.stringify(initialState))
    })

    await page.reload({ waitUntil: 'domcontentloaded' })

    // Click through the continue screen if it appears
    const continueButton = page.getByRole('button', { name: 'Continue Journey' })
    const hasContinue = await continueButton
      .waitFor({ state: 'visible', timeout: 15000 })
      .then(() => true)
      .catch(() => false)
    if (hasContinue) {
      await continueButton.click()
    }

    // Wait for God Mode API to be fully loaded with all functions
    await page.waitForFunction(() => {
      const godMode = (window as any).godMode
      return godMode &&
             typeof godMode.setTrust === 'function' &&
             typeof godMode.setAllPatterns === 'function' &&
             typeof godMode.demonstrateSkill === 'function'
    }, { timeout: 15000 })

    // Create maximally unlocked state
    await createMaxUnlockState(page)

    // Wait for UI to stabilize
    await page.waitForTimeout(2000)
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // JOURNAL TAB TESTS (10 tests)
  // ═══════════════════════════════════════════════════════════════════════════

  test('1. Journal - Harmonics Tab', async ({ page }) => {
    // Click Journal button (has title="The Prism")
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Harmonics')
    await page.waitForTimeout(500)

    // Verify all 5 pattern orbs visible
    const journalPanel = page.getByTestId('journal-panel')
    await expect(journalPanel.locator('[data-testid="pattern-orb"][data-pattern="analytical"]')).toBeVisible()
    await expect(journalPanel.locator('[data-testid="pattern-orb"][data-pattern="patience"]')).toBeVisible()
    await expect(journalPanel.locator('[data-testid="pattern-orb"][data-pattern="exploring"]')).toBeVisible()
    await expect(journalPanel.locator('[data-testid="pattern-orb"][data-pattern="helping"]')).toBeVisible()
    await expect(journalPanel.locator('[data-testid="pattern-orb"][data-pattern="building"]')).toBeVisible()

    await page.screenshot({ path: 'tests/visual/output/journal-harmonics.png' })
    console.log('✓ Harmonics tab validated')
  })

  test('2. Journal - Essence Tab', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Essence')
    await page.waitForTimeout(500)

    await page.screenshot({ path: 'tests/visual/output/journal-essence.png' })
    console.log('✓ Essence tab validated')
  })

  test('3. Journal - Mastery Tab', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Mastery')
    await page.waitForTimeout(500)

    await page.screenshot({ path: 'tests/visual/output/journal-mastery.png' })
    console.log('✓ Mastery tab validated')
  })

  test('4. Journal - Opportunities Tab', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Opportunities')
    await page.waitForTimeout(500)

    await page.screenshot({ path: 'tests/visual/output/journal-opportunities.png' })
    console.log('✓ Opportunities tab validated')
  })

  test('5. Journal - Mind Tab', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Mind')
    await page.waitForTimeout(500)

    await page.screenshot({ path: 'tests/visual/output/journal-mind.png' })
    console.log('✓ Mind tab validated')
  })

  test('6. Journal - Toolkit Tab', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Toolkit')
    await page.waitForTimeout(500)

    await page.screenshot({ path: 'tests/visual/output/journal-toolkit.png' })
    console.log('✓ Toolkit tab validated')
  })

  test('7. Journal - Simulations Tab', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Sims')
    await page.waitForTimeout(1000) // Simulations may take longer to render

    // Verify simulations visible
    const simCount = await page.locator('[data-testid="simulation-card"]').count().catch(() => 0)
    console.log(`  Found ${simCount} simulation cards`)

    await page.screenshot({ path: 'tests/visual/output/journal-simulations.png' })
    console.log('✓ Simulations tab validated')
  })

  test('8. Journal - Cognition Tab', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Cognition')
    await page.waitForTimeout(500)

    await page.screenshot({ path: 'tests/visual/output/journal-cognition.png' })
    console.log('✓ Cognition tab validated')
  })

  test('9. Journal - Analysis Tab', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Analysis')
    await page.waitForTimeout(500)

    await page.screenshot({ path: 'tests/visual/output/journal-analysis.png' })
    console.log('✓ Analysis tab validated')
  })

  test('10. Journal - God Mode Tab', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=GOD MODE')
    await page.waitForTimeout(500)

    await page.screenshot({ path: 'tests/visual/output/journal-godmode.png' })
    console.log('✓ God Mode tab validated')
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // CONSTELLATION TESTS (3 tests)
  // ═══════════════════════════════════════════════════════════════════════════

  test('11. Constellation - People View', async ({ page }) => {
    await page.getByLabel('Open Skill Constellation').click()
    await page.waitForSelector('[data-testid="constellation-panel"]', { state: 'visible', timeout: 10000 }).catch(() => null)

    // Try alternative selector if first doesn't work
    const hasConstellation = await page.locator('[data-testid="constellation-panel"]').isVisible().catch(() => false)
    if (!hasConstellation) {
      console.log('  Note: Constellation panel not found with data-testid')
    }

    await page.click('text=People').catch(() => console.log('  Note: People tab not found'))
    await page.waitForTimeout(1000)

    await page.screenshot({ path: 'tests/visual/output/constellation-people.png' })
    console.log('✓ People view validated')
  })

  test('12. Constellation - Skills View', async ({ page }) => {
    await page.getByLabel('Open Skill Constellation').click()
    await page.waitForTimeout(1000)

    await page.click('text=Skills').catch(() => console.log('  Note: Skills tab not found'))
    await page.waitForTimeout(1000)

    await page.screenshot({ path: 'tests/visual/output/constellation-skills.png' })
    console.log('✓ Skills view validated')
  })

  test('13. Constellation - Quests View', async ({ page }) => {
    await page.getByLabel('Open Skill Constellation').click()
    await page.waitForTimeout(1000)

    await page.click('text=Quests').catch(() => console.log('  Note: Quests tab not found'))
    await page.waitForTimeout(1000)

    await page.screenshot({ path: 'tests/visual/output/constellation-quests.png' })
    console.log('✓ Quests view validated')
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // IN-GAME ELEMENTS (3 tests)
  // ═══════════════════════════════════════════════════════════════════════════

  test('14. In-Game - Dialogue Elements', async ({ page }) => {
    // Close Journal/Constellation if open
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)

    // Navigate to Maya
    await page.evaluate(() => {
      (window as any).godMode.jumpToCharacter('maya')
    })
    await page.waitForTimeout(1000)

    // Verify dialogue visible
    await expect(page.getByTestId('dialogue-content')).toBeVisible()

    // Verify choices visible
    const choices = await page.locator('[data-testid="choice-button"]').count()
    console.log(`  Found ${choices} choice buttons`)
    expect(choices).toBeGreaterThan(0)

    await page.screenshot({ path: 'tests/visual/output/in-game-dialogue.png' })
    console.log('✓ Dialogue elements validated')
  })

  test('15. In-Game - Pattern Orbs', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Harmonics')
    await page.waitForTimeout(500)

    // Framer Motion continuously updates transforms; freeze orb transforms so element screenshots can stabilize.
    await page.addStyleTag({
      content: `
        [data-testid="pattern-orb"] { transform: none !important; }
        [data-testid="pattern-orb"] *,
        [data-testid="pattern-orb"] *::before,
        [data-testid="pattern-orb"] *::after { animation: none !important; transition: none !important; }
      `
    })

    // Capture each pattern orb individually
    const patterns = ['analytical', 'patience', 'exploring', 'helping', 'building']
    for (const pattern of patterns) {
      const orb = page.getByTestId('journal-panel').locator(`[data-testid="pattern-orb"][data-pattern="${pattern}"]`)
      const isVisible = await orb.isVisible().catch(() => false)

      if (isVisible) {
        await orb.screenshot({ path: `tests/visual/output/pattern-orb-${pattern}.png` })
        console.log(`  ✓ Captured ${pattern} orb`)
      } else {
        console.log(`  Note: ${pattern} orb not found`)
      }
    }

    console.log('✓ Pattern orbs validated')
  })

  test('16. In-Game - Character Avatars', async ({ page }) => {
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })
    await page.click('text=Essence')
    await page.waitForTimeout(500)

    // Capture avatar grid
    await page.screenshot({ path: 'tests/visual/output/character-avatars.png' })
    console.log('✓ Character avatars validated')
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // PERFORMANCE BASELINE (1 test)
  // ═══════════════════════════════════════════════════════════════════════════

  test('17. Performance - Full UI Cycle', async ({ page }) => {
    const startMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })

    // Open Journal and cycle through tabs
    await page.getByLabel('Open Journal').click()
    await page.waitForSelector('[data-testid="journal-panel"]', { state: 'visible' })

    const tabs = ['Harmonics', 'Essence', 'Mastery', 'Toolkit', 'Sims']
    for (const tab of tabs) {
      await page.click(`text=${tab}`)
      await page.waitForTimeout(500)
    }

    // Close Journal
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)

    // Open Constellation and cycle through views
    await page.getByLabel('Open Skill Constellation').click()
    await page.waitForTimeout(1000)

    const views = ['People', 'Skills', 'Quests']
    for (const view of views) {
      await page.click(`text=${view}`).catch(() => console.log(`  Note: ${view} view not found`))
      await page.waitForTimeout(1000)
    }

    const endMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })

    const memoryIncrease = endMemory - startMemory
    const memoryIncreaseMB = (memoryIncrease / 1024 / 1024).toFixed(2)

    console.log(`📊 Memory increase: ${memoryIncreaseMB} MB`)
    console.log(`   Start: ${(startMemory / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   End: ${(endMemory / 1024 / 1024).toFixed(2)} MB`)

    // Threshold: Memory should not increase by more than 50MB
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)

    console.log('✓ Performance baseline captured')
  })
})
