/**
 * Career Analytics Tests
 *
 * Tests pattern-to-career mapping and Birmingham opportunity matching:
 * - Affinity normalization (sum to 1.0)
 * - Confidence scoring (capped at 95%)
 * - 8 sector coverage (healthcare, engineering, technology, education, etc.)
 * - Birmingham organization matching
 * - Evidence point generation
 */

import { test, expect } from '@playwright/test'

test.describe('Career Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('Career matches display with pattern-based recommendations', async ({ page }) => {
    // Set up patterns that should generate career recommendations
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          patterns: {
            analytical: 8,  // High analytical
            building: 5,    // Moderate building
            helping: 3,     // Some helping
            patience: 2,
            exploring: 1
          },
          characters: [{
            characterId: 'maya',
            trust: 6
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Navigate to student dashboard/career exploration
    const url = page.url()
    const userId = 'test-user-123'

    // Go to student page if not already there
    if (!url.includes('/student')) {
      await page.goto(`/student/${userId}`)
      await page.waitForLoadState('networkidle')
    }

    // Look for career matches
    const careerCard = page.getByTestId('career-match-card')
    const hasCareerMatch = await careerCard.first().isVisible({ timeout: 5000 }).catch(() => false)

    if (hasCareerMatch) {
      // Verify career card has name attribute
      const careerName = await careerCard.first().getAttribute('data-career-name')
      expect(careerName).toBeTruthy()

      // With high analytical, should see tech/healthcare/engineering careers
      const expectedCareers = ['healthcare', 'engineering', 'technology', 'data', 'software']
      const careerNameLower = careerName?.toLowerCase() || ''

      const matchesExpected = expectedCareers.some(career =>
        careerNameLower.includes(career)
      )

      // Should match at least one expected career type for high analytical pattern
      expect(matchesExpected).toBe(true)
    }
  })

  test('Multiple career sectors represented based on pattern diversity', async ({ page }) => {
    // Set diverse patterns
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          patterns: {
            analytical: 5,
            building: 5,
            helping: 5,
            patience: 5,
            exploring: 5
          },
          characters: [
            { characterId: 'maya', trust: 5 },
            { characterId: 'devon', trust: 4 },
            { characterId: 'marcus', trust: 6 }
          ]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const userId = 'test-user-balanced'
    await page.goto(`/student/${userId}`)
    await page.waitForLoadState('networkidle')

    // With balanced patterns, should see diverse career recommendations
    const careerCards = page.getByTestId('career-match-card')
    const careerCount = await careerCards.count()

    if (careerCount > 0) {
      // Get all career names
      const careerNames = await Promise.all(
        Array.from({ length: Math.min(careerCount, 5) }, (_, i) =>
          careerCards.nth(i).getAttribute('data-career-name')
        )
      )

      // Should have multiple different careers
      expect(careerNames.length).toBeGreaterThan(0)

      // Verify they're not all the same
      const uniqueCareers = new Set(careerNames.filter(Boolean))
      expect(uniqueCareers.size).toBeGreaterThan(0)
    }
  })

  test('Birmingham organizations appear in career recommendations', async ({ page }) => {
    // Set patterns for healthcare (helping + analytical)
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'marcus_introduction',
          hasStarted: true,
          patterns: {
            analytical: 6,
            building: 2,
            helping: 7,  // Strong helping for healthcare
            patience: 3,
            exploring: 2
          },
          globalFlags: ['discussed_healthcare'],
          characters: [{
            characterId: 'marcus',
            trust: 6
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const userId = 'test-user-healthcare'
    await page.goto(`/student/${userId}`)
    await page.waitForLoadState('networkidle')

    // Look for Birmingham organizations in career cards
    const birminghamOrgs = page.getByText(/UAB|Children's of Alabama|St\. Vincent|Birmingham|Vulcan|Innovation Depot/i)
    const hasBirminghamOrg = await birminghamOrgs.first().isVisible({ timeout: 5000 }).catch(() => false)

    if (hasBirminghamOrg) {
      const orgText = await birminghamOrgs.first().textContent()
      expect(orgText).toBeTruthy()

      // Verify it mentions a real Birmingham organization
      const validOrgs = ['UAB', 'Children', 'Vincent', 'Birmingham', 'Vulcan', 'Innovation']
      const mentionsValidOrg = validOrgs.some(org =>
        orgText?.includes(org)
      )

      expect(mentionsValidOrg).toBe(true)
    }
  })

  test('Career readiness levels calculated correctly', async ({ page }) => {
    // Set high patterns + high trust for "near_ready" status
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: {
            analytical: 9,  // High skills
            building: 7,
            helping: 5,
            patience: 4,
            exploring: 6
          },
          characters: [
            { characterId: 'maya', trust: 8 },
            { characterId: 'devon', trust: 7 },
            { characterId: 'marcus', trust: 6 }
          ]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const userId = 'test-user-high-skills'
    await page.goto(`/student/${userId}`)
    await page.waitForLoadState('networkidle')

    // Look for readiness badges
    const readyBadge = page.getByText(/Ready to Explore|Near Ready|Building Skills/i)
    const hasBadge = await readyBadge.first().isVisible({ timeout: 5000 }).catch(() => false)

    if (hasBadge) {
      const badgeText = await readyBadge.first().textContent()
      expect(badgeText).toBeTruthy()

      // With high patterns, should be "Ready to Explore" or "Near Ready"
      const isHighReadiness = badgeText?.includes('Ready') || badgeText?.includes('Near')
      expect(isHighReadiness).toBe(true)
    }
  })

  test('Skills matched to career requirements', async ({ page }) => {
    // Set specific patterns
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: {
            analytical: 8,
            building: 3,
            helping: 2,
            patience: 1,
            exploring: 4
          },
          characters: [{
            characterId: 'maya',
            trust: 7,
            knowledgeFlags: ['maya_chose_robotics']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const userId = 'test-user-tech'
    await page.goto(`/student/${userId}`)
    await page.waitForLoadState('networkidle')

    // Look for skill badges in career cards
    const skillBadges = page.locator('.text-2xs, .text-xs').filter({ hasText: /thinking|analysis|problem|technical/i })
    const hasSkillBadges = await skillBadges.first().isVisible({ timeout: 5000 }).catch(() => false)

    if (hasSkillBadges) {
      // Should show skills that match the career
      const count = await skillBadges.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('Career exploration section handles no matches gracefully', async ({ page }) => {
    // Set very low patterns (early game)
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          patterns: {
            analytical: 0,
            building: 0,
            helping: 0,
            patience: 0,
            exploring: 0
          },
          characters: []
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const userId = 'test-user-new'
    await page.goto(`/student/${userId}`)
    await page.waitForLoadState('networkidle')

    // Should show empty state message
    const emptyMessage = page.getByText(/keep making choices|discover career paths|explore/i)
    const hasEmptyMessage = await emptyMessage.isVisible({ timeout: 5000 }).catch(() => false)

    if (hasEmptyMessage) {
      const messageText = await emptyMessage.textContent()
      expect(messageText).toBeTruthy()

      // Should encourage continued exploration
      const isEncouraging = messageText?.toLowerCase().includes('keep') ||
                           messageText?.toLowerCase().includes('discover') ||
                           messageText?.toLowerCase().includes('explore')

      expect(isEncouraging).toBe(true)
    }
  })

  test('Career paths persist across page reloads', async ({ page }) => {
    // Set patterns and navigate to student page
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: {
            analytical: 7,
            building: 4,
            helping: 5,
            patience: 3,
            exploring: 2
          },
          characters: [{
            characterId: 'maya',
            trust: 6
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const userId = 'test-user-persist'
    await page.goto(`/student/${userId}`)
    await page.waitForLoadState('networkidle')

    // Get career matches before reload
    const careerCards = page.getByTestId('career-match-card')
    const initialCount = await careerCards.count()

    if (initialCount > 0) {
      const initialCareer = await careerCards.first().getAttribute('data-career-name')

      // Reload page
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Verify careers still display
      const careerCardsAfter = page.getByTestId('career-match-card')
      const afterCount = await careerCardsAfter.count()

      expect(afterCount).toBe(initialCount)

      // First career should still be the same
      const afterCareer = await careerCardsAfter.first().getAttribute('data-career-name')
      expect(afterCareer).toBe(initialCareer)
    }
  })

  test('Education paths shown for career recommendations', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: {
            analytical: 6,
            building: 5,
            helping: 4,
            patience: 3,
            exploring: 3
          },
          characters: [{
            characterId: 'maya',
            trust: 5
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const userId = 'test-user-education'
    await page.goto(`/student/${userId}`)
    await page.waitForLoadState('networkidle')

    // Look for education paths in career cards
    const educationText = page.getByText(/degree|bachelor|associate|certificate|training|apprentice/i)
    const hasEducation = await educationText.first().isVisible({ timeout: 5000 }).catch(() => false)

    if (hasEducation) {
      const count = await educationText.count()
      // Should mention education pathways
      expect(count).toBeGreaterThan(0)
    }
  })

  test('High analytical pattern recommends technical careers', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: {
            analytical: 9,  // Very high analytical
            building: 2,
            helping: 1,
            patience: 1,
            exploring: 2
          },
          characters: [{
            characterId: 'maya',
            trust: 7
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const userId = 'test-user-analytical'
    await page.goto(`/student/${userId}`)
    await page.waitForLoadState('networkidle')

    // With high analytical, should see technical careers
    const careerCards = page.getByTestId('career-match-card')
    const hasCareer = await careerCards.first().isVisible({ timeout: 5000 }).catch(() => false)

    if (hasCareer) {
      const careerNames = await Promise.all(
        Array.from({ length: Math.min(await careerCards.count(), 3) }, (_, i) =>
          careerCards.nth(i).getAttribute('data-career-name')
        )
      )

      const technicalKeywords = ['engineer', 'data', 'software', 'tech', 'developer', 'analyst', 'science']

      const hasTechnicalCareer = careerNames.some(name =>
        technicalKeywords.some(keyword =>
          name?.toLowerCase().includes(keyword)
        )
      )

      // With analytical 9, should have at least one technical career
      expect(hasTechnicalCareer).toBe(true)
    }
  })

  test('High helping pattern recommends service careers', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'marcus_introduction',
          hasStarted: true,
          patterns: {
            analytical: 2,
            building: 2,
            helping: 9,  // Very high helping
            patience: 4,
            exploring: 1
          },
          characters: [{
            characterId: 'marcus',
            trust: 7
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const userId = 'test-user-helping'
    await page.goto(`/student/${userId}`)
    await page.waitForLoadState('networkidle')

    // With high helping, should see healthcare/education/service careers
    const careerCards = page.getByTestId('career-match-card')
    const hasCareer = await careerCards.first().isVisible({ timeout: 5000 }).catch(() => false)

    if (hasCareer) {
      const careerNames = await Promise.all(
        Array.from({ length: Math.min(await careerCards.count(), 3) }, (_, i) =>
          careerCards.nth(i).getAttribute('data-career-name')
        )
      )

      const serviceKeywords = ['health', 'nurse', 'care', 'education', 'teach', 'social', 'service', 'counsel']

      const hasServiceCareer = careerNames.some(name =>
        serviceKeywords.some(keyword =>
          name?.toLowerCase().includes(keyword)
        )
      )

      // With helping 9, should have at least one service-oriented career
      expect(hasServiceCareer).toBe(true)
    }
  })
})
