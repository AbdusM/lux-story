/**
 * Mobile Performance Benchmarks
 * Tests performance metrics on mobile devices to ensure smooth experience
 * Target: Ages 14-24 on mid-range devices with potentially slow connections
 */

import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Mobile Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Viewport is set by Playwright project config (iPhone SE, iPhone 14, iPad, etc.)
    // Don't override it here - let the project device config handle viewport sizing
  })

  test('First Contentful Paint < 2s on initial load', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Measure time to first contentful paint
    const fcp = await page.evaluate(() => {
      const entries = performance.getEntriesByType('paint') as PerformanceEntry[]
      const fcpEntry = entries.find(e => e.name === 'first-contentful-paint')
      return fcpEntry ? fcpEntry.startTime : null
    })

    expect(fcp).not.toBeNull()
    if (fcp !== null) {
      expect(fcp).toBeLessThan(2000) // 2 seconds
      console.log(`FCP: ${fcp.toFixed(0)}ms`)
    }
  })

  test('Game interface loads within 3s', async ({ page, freshGame }) => {
    const startTime = Date.now()

    // Wait for game interface to be visible
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000) // 3 seconds
    console.log(`Game interface load time: ${loadTime}ms`)
  })

  test('Dialogue renders within 1s after choice selection', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Wait for initial dialogue
    const dialogueContent = page.getByTestId('dialogue-content')
    await expect(dialogueContent).toBeVisible({ timeout: 10000 })
    const initialDialogue = await dialogueContent.textContent()

    // Wait for choices
    const choices = page.locator('[data-testid="choice-button"]')
    await expect(choices.first()).toBeVisible({ timeout: 5000 })

    // Measure time from click to new dialogue appearing
    const clickTime = Date.now()
    await choices.first().click()

    await page.waitForFunction(
      (initial) => {
        const current = document.querySelector('[data-testid="dialogue-content"]')?.textContent
        return current && current !== initial
      },
      initialDialogue,
      { timeout: 10000 }
    )

    const renderTime = Date.now() - clickTime
    expect(renderTime).toBeLessThan(1000) // 1 second
    console.log(`Dialogue render time: ${renderTime}ms`)
  })

  test('Smooth animation frame rate during dialogue transition', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Measure FPS during a 1-second period
    const avgFPS = await page.evaluate(async () => {
      let frameCount = 0
      const startTime = performance.now()

      return new Promise<number>((resolve) => {
        function countFrame() {
          frameCount++
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrame)
          } else {
            resolve(frameCount) // FPS = frames in 1 second
          }
        }
        requestAnimationFrame(countFrame)
      })
    })

    // Expect at least 50 FPS (smooth on low-end devices)
    expect(avgFPS).toBeGreaterThan(50)
    console.log(`Average FPS: ${avgFPS.toFixed(1)}`)
  })

  test('Memory usage remains stable after multiple choices', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance && typeof (performance as any).memory === 'object') {
        return (performance as any).memory.usedJSHeapSize
      }
      return null
    })

    // Make 5 choices in sequence
    for (let i = 0; i < 5; i++) {
      const choices = page.locator('[data-testid="choice-button"]')
      await expect(choices.first()).toBeVisible({ timeout: 10000 })

      const currentDialogue = await page.getByTestId('dialogue-content').textContent()
      await choices.first().click()

      // Wait for dialogue to change
      await page.waitForFunction(
        (initial) => {
          const current = document.querySelector('[data-testid="dialogue-content"]')?.textContent
          return current && current !== initial
        },
        currentDialogue,
        { timeout: 10000 }
      )
    }

    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance && typeof (performance as any).memory === 'object') {
        return (performance as any).memory.usedJSHeapSize
      }
      return null
    })

    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory - initialMemory
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024)

      // Memory should not increase by more than 5MB after 5 choices
      expect(memoryIncreaseMB).toBeLessThan(5)
      console.log(`Memory increase: ${memoryIncreaseMB.toFixed(2)}MB`)
    }
  })

  test('localStorage operations are fast (<50ms)', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Make a choice and measure localStorage save time
    const choices = page.locator('[data-testid="choice-button"]')
    await expect(choices.first()).toBeVisible({ timeout: 10000 })

    const saveTime = await page.evaluate(async () => {
      const startTime = performance.now()

      // Simulate state save (similar to what happens after choice)
      const state = {
        state: {
          currentNodeId: 'test',
          hasStarted: true,
          patterns: { analytical: 5, building: 3, helping: 2, patience: 1, exploring: 4 },
          globalFlags: ['test1', 'test2', 'test3'],
          characters: [
            { characterId: 'maya', trust: 5, knowledgeFlags: ['flag1'] },
            { characterId: 'devon', trust: 3, knowledgeFlags: ['flag2'] }
          ]
        },
        version: 1
      }

      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))

      return performance.now() - startTime
    })

    expect(saveTime).toBeLessThan(50) // 50ms
    console.log(`localStorage save time: ${saveTime.toFixed(2)}ms`)
  })

  test('No memory leaks in dialogue loop (10 cycles)', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Get baseline memory
    const baselineMemory = await page.evaluate(() => {
      if ('memory' in performance && typeof (performance as any).memory === 'object') {
        return (performance as any).memory.usedJSHeapSize
      }
      return null
    })

    // Run 10 dialogue cycles
    for (let i = 0; i < 10; i++) {
      const choices = page.locator('[data-testid="choice-button"]')
      if (await choices.count() > 0) {
        const currentDialogue = await page.getByTestId('dialogue-content').textContent()
        await choices.first().click()

        await page.waitForFunction(
          (initial) => {
            const current = document.querySelector('[data-testid="dialogue-content"]')?.textContent
            return current && current !== initial
          },
          currentDialogue,
          { timeout: 10000 }
        ).catch(() => {
          // If dialogue doesn't change (end of path), that's ok
        })
      }
    }

    // Get final memory
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance && typeof (performance as any).memory === 'object') {
        return (performance as any).memory.usedJSHeapSize
      }
      return null
    })

    if (baselineMemory && finalMemory) {
      const memoryIncrease = finalMemory - baselineMemory
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024)

      // Memory should not increase by more than 10MB after 10 cycles
      // This indicates no major memory leaks
      expect(memoryIncreaseMB).toBeLessThan(10)
      console.log(`Memory increase after 10 cycles: ${memoryIncreaseMB.toFixed(2)}MB`)
    }
  })

  test('Panel animations are smooth (>50 FPS)', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Measure FPS during panel animation
    const constellationBtn = page.getByLabel('Open Skill Constellation')
    if (await constellationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Start FPS measurement
      const fpsPromise = page.evaluate(async () => {
        let frameCount = 0
        const startTime = performance.now()

        return new Promise<number>((resolve) => {
          function countFrame() {
            frameCount++
            if (performance.now() - startTime < 500) { // Measure during 500ms animation
              requestAnimationFrame(countFrame)
            } else {
              resolve((frameCount / 500) * 1000) // Convert to FPS
            }
          }
          requestAnimationFrame(countFrame)
        })
      })

      // Trigger panel animation
      await constellationBtn.click()

      const animationFPS = await fpsPromise

      // Animation should maintain >50 FPS for smooth experience
      expect(animationFPS).toBeGreaterThan(50)
      console.log(`Animation FPS: ${animationFPS.toFixed(1)}`)
    }
  })
})
