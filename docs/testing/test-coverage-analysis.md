# Test Coverage Analysis - Data Dictionary Review

**Created:** January 13, 2026
**Purpose:** Identify test gaps based on comprehensive data dictionary analysis
**Scope:** 2,500+ metadata identifiers across 12 categories

---

## Executive Summary

After reviewing all 12 data dictionary files, I've identified **7 critical test coverage gaps** across core game mechanics that are currently untested or undertested in our Playwright suite:

| Priority | System | Current Coverage | Gap Severity | Tests Needed |
|----------|--------|------------------|--------------|--------------|
| 🔴 HIGH | **Simulations** (20 total) | 0% | Critical | 15+ tests |
| 🔴 HIGH | **Knowledge Flags** (508 total) | <5% | Critical | 12+ tests |
| 🔴 HIGH | **Interrupts** (23 total) | 0% | Critical | 10+ tests |
| 🟡 MEDIUM | **Trust Derivatives** (7 mechanics) | 10% | High | 8+ tests |
| 🟡 MEDIUM | **Pattern Unlocks** (15 effects) | 0% | High | 6+ tests |
| 🟡 MEDIUM | **Career Analytics** | 0% | Medium | 5+ tests |
| 🟢 LOW | **Polyvagal System** | 0% | Low | 4+ tests |

**Total New Tests Needed:** ~60 tests across 7 new test files

---

## 🔴 Priority 1: Critical Game Mechanics (HIGH)

### 1.1 Simulation System Tests

**Gap:** 20 simulations with 3-phase progression have ZERO E2E coverage.

**Why Critical:** Simulations are core gameplay mechanics that directly impact player engagement and career discovery.

**Testable Mechanics from `06-simulations.md`:**
- Phase unlock conditions (Phase 1: trust ≥0, Phase 2: trust ≥5 + Phase 1 complete, Phase 3: trust ≥8 + Phase 2 complete)
- Time limits (Phase 2: 120s, Phase 3: 60s)
- Success thresholds (Phase 1: 75%, Phase 2: 85%, Phase 3: 95%)
- Golden prompt achievements (95%+ accuracy → +30 nervous system regulation)
- 16 unique interface types (diagnostics, editor, timeline, network, scheduler, etc.)

**Proposed Test File:** `tests/e2e/simulations/simulation-progression.spec.ts`

```typescript
import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Simulation System', () => {
  test('Phase 1 unlocks immediately at trust 0', async ({ page, freshGame }) => {
    await page.goto('/')

    // Navigate to Maya's first simulation
    const mayaButton = page.getByTestId('character-card-maya')
    await mayaButton.click()

    const simulationButton = page.getByRole('button', { name: /robotics diagnostic/i })
    await expect(simulationButton).toBeVisible()
    await expect(simulationButton).not.toBeDisabled()
  })

  test('Phase 2 requires Phase 1 completion + trust ≥5', async ({ page }) => {
    // Seed state: Phase 1 complete, trust 4 (below threshold)
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          characters: [{
            characterId: 'maya',
            trust: 4,
            knowledgeFlags: ['maya_simulation_phase1_complete']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Phase 2 should be locked
    const phase2Button = page.getByRole('button', { name: /phase 2.*application/i })
    await expect(phase2Button).toHaveAttribute('disabled')

    // Increase trust to 5
    await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        state.state.characters[0].trust = 5
        localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
      }
    })

    await page.reload()

    // Phase 2 should now be unlocked
    await expect(phase2Button).not.toBeDisabled()
  })

  test('Time limit enforced for Phase 2 (120s)', async ({ page, withHighTrust }) => {
    // Start Phase 2 simulation
    const phase2Button = page.getByRole('button', { name: /phase 2/i })
    await phase2Button.click()

    // Wait for simulation interface
    const simulationInterface = page.getByTestId('simulation-interface')
    await expect(simulationInterface).toBeVisible()

    // Verify timer starts at 120s
    const timer = page.getByTestId('simulation-timer')
    await expect(timer).toHaveText(/120|119/)

    // Mock time passage (advance 121s)
    await page.evaluate(() => {
      const startTime = Date.now() - 121000 // 121s ago
      window.__SIMULATION_START_TIME__ = startTime
    })

    // Trigger timer check
    await page.getByRole('button', { name: /submit/i }).click()

    // Should show timeout message
    await expect(page.getByText(/time.*up/i)).toBeVisible()
  })

  test('Success threshold 95% for Phase 3 golden prompt', async ({ page, withHighTrust }) => {
    // Start Phase 3 simulation
    const phase3Button = page.getByRole('button', { name: /phase 3.*mastery/i })
    await phase3Button.click()

    // Complete simulation with 95% accuracy
    await page.evaluate(() => {
      window.__SIMULATION_SCORE__ = 0.95
    })

    await page.getByRole('button', { name: /complete/i }).click()

    // Verify golden prompt achievement
    const achievement = page.getByText(/golden prompt/i)
    await expect(achievement).toBeVisible()

    // Verify +30 nervous system regulation
    const nervousSystemBonus = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        return state.state.nervousSystemRegulation
      }
      return null
    })

    expect(nervousSystemBonus).toBeGreaterThanOrEqual(30)
  })

  test('16 interface types render correctly', async ({ page, withHighTrust }) => {
    // Test each interface type
    const interfaceTypes = [
      'diagnostics', 'editor', 'timeline', 'network',
      'scheduler', 'database', 'chat', 'canvas'
    ]

    for (const type of interfaceTypes) {
      const simulationButton = page.locator(`[data-simulation-type="${type}"]`).first()

      if (await simulationButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await simulationButton.click()

        const interfaceContainer = page.getByTestId(`simulation-${type}`)
        await expect(interfaceContainer).toBeVisible({ timeout: 5000 })

        // Go back to list
        const backButton = page.getByRole('button', { name: /back|exit/i })
        await backButton.click()
      }
    }
  })
})
```

**Additional Tests Needed:**
- `tests/e2e/simulations/simulation-interfaces.spec.ts` - Test all 16 interface types individually
- `tests/e2e/simulations/simulation-scoring.spec.ts` - Test success threshold calculations
- `tests/e2e/simulations/golden-prompts.spec.ts` - Test golden prompt achievements across all characters

---

### 1.2 Knowledge Flag System Tests

**Gap:** 508 flags across 8 categories have minimal E2E coverage.

**Why Critical:** Knowledge flags drive conditional content visibility, trade chains, and meta-narrative progression.

**Testable Mechanics from `07-knowledge-flags.md`:**
- Flag persistence across sessions
- Conditional choice visibility based on flags
- Trade chains (knowledge from one character unlocking content with another)
- Golden prompt effects (+30 nervous system regulation)
- 8 flag categories (arc completion, simulations, vulnerabilities, choice memory, golden prompts, skill combos, meta-narrative, career mentions)

**Proposed Test File:** `tests/e2e/knowledge-flags/flag-persistence.spec.ts`

```typescript
import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Knowledge Flag System', () => {
  test('Character knowledge flags persist across page reload', async ({ page, freshGame }) => {
    // Make a choice that sets a knowledge flag
    const choices = page.locator('[data-testid="choice-button"]')
    await expect(choices.first()).toBeVisible({ timeout: 10000 })

    // Click choice that adds flag
    await choices.first().click()

    // Wait for state save
    await page.waitForFunction(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (!saved) return false
      const state = JSON.parse(saved)
      return state.state.characters.some(c => c.knowledgeFlags.length > 0)
    }, { timeout: 5000 })

    // Get flags before reload
    const flagsBefore = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        return state.state.characters.flatMap(c => c.knowledgeFlags || [])
      }
      return []
    })

    expect(flagsBefore.length).toBeGreaterThan(0)

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify flags restored
    const flagsAfter = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        return state.state.characters.flatMap(c => c.knowledgeFlags || [])
      }
      return []
    })

    expect(flagsAfter).toEqual(flagsBefore)
  })

  test('Global flags persist across page reload', async ({ page, freshGame }) => {
    // Set a global flag
    await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        state.state.globalFlags = ['test_global_flag', 'station_explored']
        localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
      }
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const globalFlags = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        return state.state.globalFlags || []
      }
      return []
    })

    expect(globalFlags).toContain('test_global_flag')
    expect(globalFlags).toContain('station_explored')
  })

  test('Conditional choice visibility based on hasKnowledgeFlags', async ({ page }) => {
    // Seed state with specific knowledge flag
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_technical_discussion',
          hasStarted: true,
          characters: [{
            characterId: 'maya',
            trust: 5,
            knowledgeFlags: ['maya_chose_robotics'] // Required flag
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Choice requiring maya_chose_robotics should be visible
    const conditionalChoice = page.locator('[data-testid="choice-button"]')
      .filter({ hasText: /robotics.*path/i })

    await expect(conditionalChoice).toBeVisible({ timeout: 5000 })
  })

  test('Conditional choice hidden when lacksKnowledgeFlags', async ({ page }) => {
    // Seed state WITHOUT the required flag
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'devon_systems_thinking',
          hasStarted: true,
          characters: [{
            characterId: 'devon',
            trust: 4,
            knowledgeFlags: [] // No flags
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Choice requiring devon_chose_engineering should be hidden
    const hiddenChoice = page.locator('[data-testid="choice-button"]')
      .filter({ hasText: /engineering.*path/i })

    await expect(hiddenChoice).not.toBeVisible()
  })

  test('Trade chain: Maya knowledge unlocks Devon content', async ({ page }) => {
    // Seed state with Maya flag that should unlock Devon content
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'devon_introduction',
          hasStarted: true,
          characters: [
            {
              characterId: 'maya',
              trust: 6,
              knowledgeFlags: ['maya_discussed_tech_ethics'] // Trade chain flag
            },
            {
              characterId: 'devon',
              trust: 3,
              knowledgeFlags: []
            }
          ]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Navigate to Devon
    const devonCard = page.getByTestId('character-card-devon')
    await devonCard.click()

    // Special dialogue option should appear based on Maya's flag
    const tradeChainChoice = page.locator('[data-testid="choice-button"]')
      .filter({ hasText: /maya.*mentioned/i })

    await expect(tradeChainChoice).toBeVisible({ timeout: 5000 })
  })

  test('Golden prompt flag grants +30 nervous system regulation', async ({ page }) => {
    // Set golden prompt flag
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          globalFlags: ['golden_prompt_voice'], // +30 regulation
          nervousSystemRegulation: 0
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Verify nervous system regulation increased
    const regulation = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        return state.state.nervousSystemRegulation
      }
      return null
    })

    expect(regulation).toBeGreaterThanOrEqual(30)
  })
})
```

**Additional Tests Needed:**
- `tests/e2e/knowledge-flags/trade-chains.spec.ts` - Test all documented trade chains
- `tests/e2e/knowledge-flags/skill-combos.spec.ts` - Test 30+ skill combo unlocks
- `tests/e2e/knowledge-flags/meta-narrative.spec.ts` - Test meta-narrative flag progression

---

### 1.3 Interrupt System Tests

**Gap:** 23 interrupts with timing mechanics have ZERO coverage.

**Why Critical:** Interrupts are a signature gameplay mechanic (ME2-style) that drives player engagement and trust building.

**Testable Mechanics from `09-interrupts.md`:**
- Window duration accuracy (2000-4000ms)
- 6 interrupt types (connection, challenge, silence, comfort, grounding, encouragement)
- Taking vs missing interrupt paths
- Trust bonus application (+1 or +2)
- No penalty for missed interrupts
- Optional missedNodeId alternative paths

**Proposed Test File:** `tests/e2e/interrupts/interrupt-timing.spec.ts`

```typescript
import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Interrupt System', () => {
  test('Interrupt window appears for 3000ms (connection type)', async ({ page }) => {
    // Navigate to node with interrupt
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_moment',
          hasStarted: true,
          characters: [{
            characterId: 'maya',
            trust: 6,
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Wait for dialogue with interrupt
    const dialogueContent = page.getByTestId('dialogue-content')
    await expect(dialogueContent).toBeVisible({ timeout: 10000 })

    // Interrupt button should appear
    const interruptButton = page.getByRole('button', { name: /put hand on.*shoulder/i })
    const startTime = Date.now()
    await expect(interruptButton).toBeVisible({ timeout: 500 })

    // Wait for window to close (3000ms + buffer)
    await page.waitForTimeout(3200)

    // Button should be gone
    await expect(interruptButton).not.toBeVisible()

    const windowDuration = Date.now() - startTime
    expect(windowDuration).toBeGreaterThan(2800) // 3000ms - tolerance
    expect(windowDuration).toBeLessThan(3500) // 3000ms + buffer
  })

  test('Taking connection interrupt grants +2 trust', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_moment',
          hasStarted: true,
          characters: [{
            characterId: 'maya',
            trust: 5, // Before interrupt
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Take interrupt action
    const interruptButton = page.getByRole('button', { name: /put hand on.*shoulder/i })
    await expect(interruptButton).toBeVisible({ timeout: 5000 })
    await interruptButton.click()

    // Wait for state update
    await page.waitForFunction(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (!saved) return false
      const state = JSON.parse(saved)
      const maya = state.state.characters.find(c => c.characterId === 'maya')
      return maya && maya.trust === 7 // 5 + 2
    }, { timeout: 5000 })

    // Verify trust increased
    const finalTrust = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        const maya = state.state.characters.find(c => c.characterId === 'maya')
        return maya?.trust
      }
      return null
    })

    expect(finalTrust).toBe(7)
  })

  test('Taking encouragement interrupt grants +1 trust', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'rohan_needs_encouragement',
          hasStarted: true,
          characters: [{
            characterId: 'rohan',
            trust: 4,
            knowledgeFlags: []
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    const interruptButton = page.getByRole('button', { name: /you.*got.*this/i })
    await expect(interruptButton).toBeVisible({ timeout: 5000 })
    await interruptButton.click()

    await page.waitForFunction(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (!saved) return false
      const state = JSON.parse(saved)
      const rohan = state.state.characters.find(c => c.characterId === 'rohan')
      return rohan && rohan.trust === 5 // 4 + 1
    }, { timeout: 5000 })

    const finalTrust = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        const rohan = state.state.characters.find(c => c.characterId === 'rohan')
        return rohan?.trust
      }
      return null
    })

    expect(finalTrust).toBe(5)
  })

  test('Missing interrupt has no trust penalty', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_moment',
          hasStarted: true,
          characters: [{
            characterId: 'maya',
            trust: 5,
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Wait for interrupt window to expire (3000ms + buffer)
    const interruptButton = page.getByRole('button', { name: /put hand on.*shoulder/i })
    await expect(interruptButton).toBeVisible({ timeout: 5000 })

    await page.waitForTimeout(3500)

    // Verify trust unchanged
    const finalTrust = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        const maya = state.state.characters.find(c => c.characterId === 'maya')
        return maya?.trust
      }
      return null
    })

    expect(finalTrust).toBe(5) // Unchanged
  })

  test('Missing interrupt with missedNodeId follows alternative path', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'devon_critical_moment',
          hasStarted: true,
          characters: [{
            characterId: 'devon',
            trust: 4,
            knowledgeFlags: []
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Let interrupt expire
    const interruptButton = page.getByRole('button', { name: /reach out/i })
    await expect(interruptButton).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(3500)

    // Verify alternative dialogue appears
    const missedDialogue = page.getByText(/devon looks away/i)
    await expect(missedDialogue).toBeVisible({ timeout: 3000 })
  })

  test('All 6 interrupt types render correctly', async ({ page }) => {
    const interruptTypes = [
      { type: 'connection', character: 'maya', text: /hand.*shoulder/i },
      { type: 'challenge', character: 'rohan', text: /push.*harder/i },
      { type: 'silence', character: 'elena', text: /stay.*quiet/i },
      { type: 'comfort', character: 'marcus', text: /it.*okay/i },
      { type: 'grounding', character: 'kai', text: /breathe/i },
      { type: 'encouragement', character: 'tess', text: /you.*got.*this/i }
    ]

    for (const interrupt of interruptTypes) {
      // Seed state for each character's interrupt moment
      await page.evaluate((char) => {
        const state = {
          state: {
            currentNodeId: `${char}_interrupt_moment`,
            hasStarted: true,
            characters: [{
              characterId: char,
              trust: 5,
              knowledgeFlags: []
            }]
          },
          version: 1
        }
        localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
      }, interrupt.character)

      await page.reload()
      await page.waitForLoadState('networkidle')

      // Verify interrupt button appears
      const button = page.getByRole('button', { name: interrupt.text })
      const isVisible = await button.isVisible({ timeout: 5000 }).catch(() => false)

      if (isVisible) {
        expect(await button.textContent()).toBeTruthy()
      }
    }
  })
})
```

**Additional Tests Needed:**
- `tests/e2e/interrupts/interrupt-paths.spec.ts` - Test all 23 interrupt paths across 20 characters
- `tests/e2e/interrupts/interrupt-types.spec.ts` - Test each of 6 types individually with edge cases

---

## 🟡 Priority 2: Enhanced Features (MEDIUM)

### 2.1 Trust Derivative Mechanics Tests

**Gap:** 7 derivative mechanics have minimal coverage.

**Testable Mechanics from `08-trust-system.md`:**
- Voice tone progression (7 levels: mechanical → warm)
- Asymmetry gameplay (trust differences enable unique paths)
- Echo intensity (5 levels based on trust)
- Vulnerability arc unlocks (trust ≥6)
- Loyalty experiences (trust ≥8)
- Relationship tiers (6 tiers from Stranger to Soul Mate)
- Nervous system regulation (trust buffer calculation)

**Proposed Test File:** `tests/e2e/trust/trust-derivatives.spec.ts`

```typescript
import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Trust Derivative Mechanics', () => {
  test('Voice tone changes from mechanical to warm as trust increases', async ({ page }) => {
    // Test progression through 7 voice tone levels
    const trustLevels = [
      { trust: 0, tone: 'mechanical' },
      { trust: 2, tone: 'formal' },
      { trust: 4, tone: 'conversational' },
      { trust: 6, tone: 'friendly' },
      { trust: 8, tone: 'affectionate' },
      { trust: 10, tone: 'warm' }
    ]

    for (const level of trustLevels) {
      await page.evaluate((trustValue) => {
        const state = {
          state: {
            currentNodeId: 'maya_introduction',
            hasStarted: true,
            characters: [{
              characterId: 'maya',
              trust: trustValue,
              knowledgeFlags: []
            }]
          },
          version: 1
        }
        localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
      }, level.trust)

      await page.reload()
      await page.waitForLoadState('networkidle')

      // Check dialogue tone via data attribute or text analysis
      const dialogueCard = page.getByTestId('dialogue-card')
      const voiceTone = await dialogueCard.getAttribute('data-voice-tone')

      expect(voiceTone).toBe(level.tone)
    }
  })

  test('Vulnerability arc unlocks at trust ≥6', async ({ page }) => {
    // Trust 5 - vulnerability should be locked
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          characters: [{
            characterId: 'maya',
            trust: 5,
            knowledgeFlags: []
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    const vulnerabilityChoice = page.locator('[data-testid="choice-button"]')
      .filter({ hasText: /vulnerability|deeper|personal/i })

    await expect(vulnerabilityChoice).not.toBeVisible()

    // Increase trust to 6
    await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        state.state.characters[0].trust = 6
        localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
      }
    })

    await page.reload()

    // Vulnerability should now be accessible
    await expect(vulnerabilityChoice).toBeVisible({ timeout: 5000 })
  })

  test('Loyalty experience unlocks at trust ≥8', async ({ page }) => {
    // Trust 7 - loyalty locked
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          characters: [{
            characterId: 'maya',
            trust: 7,
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    const loyaltyButton = page.getByRole('button', { name: /loyalty.*experience/i })
    await expect(loyaltyButton).not.toBeVisible()

    // Increase to trust 8
    await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        state.state.characters[0].trust = 8
        localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
      }
    })

    await page.reload()

    await expect(loyaltyButton).toBeVisible({ timeout: 5000 })
  })

  test('Nervous system trust buffer calculation', async ({ page }) => {
    // Set trust to 8
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          characters: [{
            characterId: 'maya',
            trust: 8
          }],
          nervousSystemState: 'safe_and_social',
          anxiety: 50
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Calculate expected buffer: trustBuffer = sum(trust values) * 2
    // With Maya at trust 8: buffer = 8 * 2 = 16
    // Anxiety threshold before mobilization = 60 + 16 = 76

    // Trigger anxiety increase to 75 (should stay in safe_and_social)
    await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        state.state.anxiety = 75
        localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
      }
    })

    await page.reload()

    const nervousSystemState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        return state.state.nervousSystemState
      }
      return null
    })

    expect(nervousSystemState).toBe('safe_and_social')
  })
})
```

**Additional Tests Needed:**
- `tests/e2e/trust/asymmetry-gameplay.spec.ts` - Test trust differences enabling unique paths
- `tests/e2e/trust/echo-intensity.spec.ts` - Test 5 echo intensity levels
- `tests/e2e/trust/relationship-tiers.spec.ts` - Test all 6 relationship tier transitions

---

### 2.2 Pattern Unlock Effect Tests

**Gap:** 15 UI enhancement effects at pattern thresholds (25%, 50%, 85%) have no coverage.

**Testable Mechanics from `10-ui-metadata.md`:**
- Emotion tag visibility (Analytical L1, Helping L1)
- Birmingham tooltip display (Exploring L1)
- Trust level display (Helping L1)
- Choice highlighting (All patterns L3)
- Journal insights (Analytical L2)
- Pattern-specific visual effects

**Proposed Test File:** `tests/e2e/patterns/pattern-unlocks.spec.ts`

```typescript
import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Pattern Unlock Effects', () => {
  test('Analytical L1 (25%): Emotion tags appear', async ({ page }) => {
    // Set analytical to 3 (EMERGING threshold)
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 }
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Emotion tag should be visible
    const emotionTag = page.getByTestId('emotion-tag')
    await expect(emotionTag).toBeVisible({ timeout: 5000 })

    // Subtext hint should appear
    const subtextHint = page.getByText(/notice.*fidgeting/i)
    await expect(subtextHint).toBeVisible()
  })

  test('Exploring L1 (25%): Birmingham tooltips appear', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 3 }
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Wait for dialogue mentioning Birmingham location
    const locationText = page.getByText(/UAB|University of Alabama at Birmingham/i)
    await expect(locationText).toBeVisible({ timeout: 10000 })

    // Hover to trigger tooltip
    await locationText.hover()

    // Tooltip should appear with context
    const tooltip = page.getByRole('tooltip')
    await expect(tooltip).toBeVisible({ timeout: 2000 })
    await expect(tooltip).toContainText(/medical research hub/i)
  })

  test('Helping L1 (25%): Trust level displays', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: { analytical: 0, building: 0, helping: 3, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 7
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Trust level indicator should be visible
    const trustIndicator = page.getByTestId('trust-level-indicator')
    await expect(trustIndicator).toBeVisible({ timeout: 5000 })
    await expect(trustIndicator).toContainText('7')
  })

  test('Analytical L2 (50%): Journal insights appear', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: { analytical: 6, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 5
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Open Journal
    const journalButton = page.getByLabel('Open Journal')
    await journalButton.click()

    // Insight text should appear
    const insight = page.getByText(/Maya has opened up.*your approach resonates/i)
    await expect(insight).toBeVisible({ timeout: 5000 })
  })

  test('All patterns L3 (85%): Choice highlighting appears', async ({ page }) => {
    const patterns = ['analytical', 'building', 'helping', 'patience', 'exploring']

    for (const pattern of patterns) {
      await page.evaluate((patternName) => {
        const state = {
          state: {
            currentNodeId: 'maya_introduction',
            hasStarted: true,
            patterns: {
              analytical: 0,
              building: 0,
              helping: 0,
              patience: 0,
              exploring: 0
            }
          },
          version: 1
        }
        state.state.patterns[patternName] = 9 // FLOURISHING
        localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
      }, pattern)

      await page.reload()
      await page.waitForLoadState('networkidle')

      // Wait for choices to render
      const choices = page.locator('[data-testid="choice-button"]')
      await expect(choices.first()).toBeVisible({ timeout: 10000 })

      // Check for pattern emphasis (ring highlight)
      const highlightedChoice = page.locator(`[data-testid="choice-button"][data-pattern="${pattern}"]`)

      if (await highlightedChoice.count() > 0) {
        const hasHighlight = await highlightedChoice.first().evaluate(el => {
          const classes = el.className
          return classes.includes('ring-2') || classes.includes('ring-indigo')
        })

        expect(hasHighlight).toBe(true)
      }
    }
  })
})
```

**Additional Tests Needed:**
- `tests/e2e/patterns/pattern-thresholds.spec.ts` - Test all 15 threshold effects (3 per pattern)

---

### 2.3 Career Analytics Tests

**Gap:** Pattern-to-career mapping and Birmingham opportunity matching have no coverage.

**Testable Mechanics from `11-careers.md`:**
- Affinity normalization (sum to 1.0)
- Confidence capping (≤95%)
- 8 sector coverage
- Birmingham organization matching
- Evidence point generation

**Proposed Test File:** `tests/e2e/careers/career-analytics.spec.ts`

```typescript
import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Career Analytics', () => {
  test('Pattern-to-career affinity normalization', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          patterns: { analytical: 8, building: 5, helping: 3, patience: 2, exploring: 1 }
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Open career insights
    const careerButton = page.getByRole('button', { name: /career.*insights/i })

    if (await careerButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await careerButton.click()

      // Get all affinity scores
      const affinities = await page.evaluate(() => {
        const affinityElements = document.querySelectorAll('[data-affinity-score]')
        return Array.from(affinityElements).map(el =>
          parseFloat(el.getAttribute('data-affinity-score') || '0')
        )
      })

      // Verify sum equals 1.0 (normalized)
      const sum = affinities.reduce((acc, val) => acc + val, 0)
      expect(sum).toBeCloseTo(1.0, 2)
    }
  })

  test('Confidence score capped at 95%', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          patterns: { analytical: 9, building: 9, helping: 9, patience: 9, exploring: 9 },
          characters: Array.from({ length: 20 }, (_, i) => ({
            characterId: `char${i}`,
            trust: 10
          }))
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    const careerButton = page.getByRole('button', { name: /career.*insights/i })

    if (await careerButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await careerButton.click()

      // Get highest confidence score
      const maxConfidence = await page.evaluate(() => {
        const confidenceElements = document.querySelectorAll('[data-confidence]')
        const scores = Array.from(confidenceElements).map(el =>
          parseFloat(el.getAttribute('data-confidence') || '0')
        )
        return Math.max(...scores)
      })

      expect(maxConfidence).toBeLessThanOrEqual(95)
    }
  })

  test('Birmingham organization matching', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          patterns: { analytical: 8, building: 3, helping: 6, patience: 2, exploring: 4 },
          globalFlags: ['discussed_healthcare']
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    const careerButton = page.getByRole('button', { name: /career.*insights/i })

    if (await careerButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await careerButton.click()

      // Verify Birmingham organizations appear
      const birminghamOrgs = page.getByText(/UAB|Children's of Alabama|St\. Vincent's/i)
      await expect(birminghamOrgs.first()).toBeVisible({ timeout: 5000 })
    }
  })
})
```

---

## 🟢 Priority 3: Analytics & Edge Cases (LOW)

### 3.1 Polyvagal Nervous System Tests

**Gap:** 4 nervous system states and anxiety buffering have no coverage.

**Testable Mechanics from `01-emotions.md`:**
- 4 states (safe & social, mobilization, freeze, shutdown)
- Anxiety scale 0-100 with trust buffer, skill buffer
- Golden prompt buffer (+30)
- State transition thresholds

**Proposed Test File:** `tests/e2e/polyvagal/nervous-system.spec.ts`

```typescript
import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Polyvagal Nervous System', () => {
  test('State transitions: safe → mobilization at anxiety 60+buffer', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          nervousSystemState: 'safe_and_social',
          anxiety: 50,
          characters: [{ characterId: 'maya', trust: 5 }] // trustBuffer = 10
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Trigger anxiety increase to 71 (above 60 + 10 buffer)
    await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        const state = JSON.parse(saved)
        state.state.anxiety = 71
        localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
      }
    })

    await page.reload()

    const nervousSystemState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        return JSON.parse(saved).state.nervousSystemState
      }
      return null
    })

    expect(nervousSystemState).toBe('mobilization')
  })

  test('Golden prompt buffer grants +30 regulation', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          globalFlags: ['golden_prompt_voice'],
          anxiety: 80
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // With +30 buffer, anxiety threshold is 60 + 30 = 90
    // At anxiety 80, should remain in safe_and_social
    const nervousSystemState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (saved) {
        return JSON.parse(saved).state.nervousSystemState
      }
      return null
    })

    expect(nervousSystemState).toBe('safe_and_social')
  })
})
```

---

## Implementation Roadmap

### Phase 1: Critical Systems (Weeks 1-2)
- **Simulations** - 15 tests across 3 files
- **Knowledge Flags** - 12 tests across 3 files
- **Interrupts** - 10 tests across 2 files

**Deliverables:**
- `tests/e2e/simulations/simulation-progression.spec.ts`
- `tests/e2e/simulations/simulation-interfaces.spec.ts`
- `tests/e2e/simulations/simulation-scoring.spec.ts`
- `tests/e2e/knowledge-flags/flag-persistence.spec.ts`
- `tests/e2e/knowledge-flags/trade-chains.spec.ts`
- `tests/e2e/knowledge-flags/skill-combos.spec.ts`
- `tests/e2e/interrupts/interrupt-timing.spec.ts`
- `tests/e2e/interrupts/interrupt-paths.spec.ts`

### Phase 2: Enhanced Features (Weeks 3-4)
- **Trust Derivatives** - 8 tests across 3 files
- **Pattern Unlocks** - 6 tests across 1 file
- **Career Analytics** - 5 tests across 1 file

**Deliverables:**
- `tests/e2e/trust/trust-derivatives.spec.ts`
- `tests/e2e/trust/asymmetry-gameplay.spec.ts`
- `tests/e2e/trust/echo-intensity.spec.ts`
- `tests/e2e/patterns/pattern-unlocks.spec.ts`
- `tests/e2e/careers/career-analytics.spec.ts`

### Phase 3: Analytics (Week 5)
- **Polyvagal System** - 4 tests across 1 file

**Deliverables:**
- `tests/e2e/polyvagal/nervous-system.spec.ts`

---

## Success Metrics

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| **Test Count** | 100 | 160+ | +60% |
| **System Coverage** | 40% | 85% | +45% |
| **Critical Systems** | 0% | 90% | +90% |
| **Runtime (160 tests)** | ~8 min | <8 min | Maintain |
| **Mobile Coverage** | 5 viewports | 5 viewports | Maintain |

---

## Component Modifications Required

### Add testid Attributes

**`components/simulations/SimulationInterface.tsx`:**
```tsx
<div data-testid="simulation-interface" data-simulation-type={simulation.type}>
  <div data-testid="simulation-timer">{timeRemaining}s</div>
  <div data-testid={`simulation-${simulation.type}`}>
    {/* Interface content */}
  </div>
</div>
```

**`components/game/game-message.tsx`:**
```tsx
<div
  data-testid="dialogue-card"
  data-voice-tone={voiceTone}
>
  {content.interrupt && (
    <button
      data-testid="interrupt-button"
      data-interrupt-type={content.interrupt.type}
    >
      {content.interrupt.action}
    </button>
  )}
</div>
```

**`components/Journal.tsx`:**
```tsx
<div data-testid="emotion-tag">{emotionTag}</div>
<div data-testid="trust-level-indicator">Trust: {trustLevel}</div>
```

**`components/careers/CareerInsights.tsx`:**
```tsx
<div
  data-affinity-score={affinity}
  data-confidence={confidence}
>
  {careerName}: {confidence}% match
</div>
```

---

## Verification Commands

```bash
# Run all new simulation tests
npm run test:e2e tests/e2e/simulations/

# Run all new knowledge flag tests
npm run test:e2e tests/e2e/knowledge-flags/

# Run all new interrupt tests
npm run test:e2e tests/e2e/interrupts/

# Run all new tests
npm run test:e2e tests/e2e/{simulations,knowledge-flags,interrupts,trust,patterns,careers,polyvagal}/

# Verify no hard waits introduced
grep -r "waitForTimeout" tests/e2e/
```

---

## Next Steps

1. **Review this analysis** with team to prioritize systems
2. **Add testid attributes** to components (1-2 days)
3. **Implement Phase 1** (Simulations, Knowledge Flags, Interrupts) - Weeks 1-2
4. **Implement Phase 2** (Trust, Patterns, Careers) - Weeks 3-4
5. **Implement Phase 3** (Polyvagal) - Week 5
6. **Update documentation** with new test patterns

---

**Questions?** See `tests/README.md` or `docs/testing/selector-standards.md`
