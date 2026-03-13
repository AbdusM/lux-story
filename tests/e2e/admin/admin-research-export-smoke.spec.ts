import { expect } from '@playwright/test'

import { test } from '../fixtures/auth-fixtures'

const TEST_USER_ID = 'player_123'

const ADMIN_SKILL_DATA_RESPONSE = {
  success: true,
  profile: {
    user_id: TEST_USER_ID,
    total_demonstrations: 4,
    skill_summaries: [
      {
        skill_name: 'empathy',
        demonstration_count: 2,
        latest_context: 'Validated another character before responding.',
        scenes_involved: ['maya_intro'],
        last_demonstrated: '2026-03-10T12:00:00.000Z',
      },
      {
        skill_name: 'communication',
        demonstration_count: 2,
        latest_context: 'Asked a clear next-step question.',
        scenes_involved: ['devon_intro'],
        last_demonstrated: '2026-03-11T12:00:00.000Z',
      },
    ],
    skill_demonstrations: [],
    career_explorations: [
      {
        id: 'career_1',
        career_name: 'Community Data Analyst',
        match_score: 0.84,
        readiness_level: 'skill_gaps',
        local_opportunities: ['UAB Innovation Lab'],
        education_paths: ['UAB Data Science'],
      },
    ],
  },
}

test.describe('Admin Research Export smoke', () => {
  test('surfaces research export on the learner dashboard and issues the expected request', async ({
    page,
    adminAuth,
  }) => {
    void adminAuth

    let lastExportUrl: string | null = null

    await page.addInitScript(() => {
      window.URL.createObjectURL = () => 'blob:lux-test-download'
      window.URL.revokeObjectURL = () => undefined
      HTMLAnchorElement.prototype.click = function click() {
        return undefined
      }
    })

    await page.route('**/api/admin/skill-data?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ADMIN_SKILL_DATA_RESPONSE),
      })
    })

    await page.route('**/api/admin/research-export?*', async (route) => {
      lastExportUrl = route.request().url()

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          mode: 'individual',
          scope: 'individual_identified',
          count: 1,
          data: [{ participantId: TEST_USER_ID }],
        }),
      })
    })

    await page.goto(`/admin/${TEST_USER_ID}/skills`)

    await expect(page.getByRole('button', { name: 'Research Export' })).toBeVisible()
    await page.getByRole('button', { name: 'Research Export' }).click()

    await expect(page.getByRole('dialog', { name: 'Research Export' })).toBeVisible()
    await page.getByRole('button', { name: 'Identified Export' }).click()

    await expect.poll(() => lastExportUrl !== null).toBe(true)
    expect(lastExportUrl).toContain(
      `/api/admin/research-export?mode=individual&userId=${TEST_USER_ID}`,
    )
    await expect(page.getByRole('dialog', { name: 'Research Export' })).toHaveCount(0)
  })
})
