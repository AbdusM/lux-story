import { expect, test } from '@playwright/test'

const TEST_USER_ID = 'player_123'

const SKILL_PROFILE = {
  userId: TEST_USER_ID,
  userName: 'Jordan',
  skillDemonstrations: {
    empathy: [
      {
        scene: 'maya_intro',
        context: 'Validated another character before responding.',
        value: 1,
      },
    ],
    communication: [
      {
        scene: 'devon_intro',
        context: 'Asked a clear next-step question.',
        value: 1,
      },
    ],
  },
  careerMatches: [
    {
      id: 'career_1',
      name: 'Community Data Analyst',
      matchScore: 0.84,
      requiredSkills: {
        empathy: { current: 0.8, required: 0.6, gap: 0 },
        communication: { current: 0.7, required: 0.6, gap: 0 },
        leadership: { current: 0.4, required: 0.7, gap: 0.3 },
      },
      salaryRange: [45000, 65000],
      educationPaths: ['UAB Data Science'],
      localOpportunities: ['UAB Innovation Lab'],
      birminghamRelevance: 0.92,
      growthProjection: 'high',
      readiness: 'skill_gaps',
    },
  ],
  skillEvolution: [
    { checkpoint: 'Start', totalDemonstrations: 0, timestamp: 1700000000000 },
    { checkpoint: 'Current', totalDemonstrations: 4, timestamp: 1700003600000 },
  ],
  keySkillMoments: [
    {
      scene: 'maya_intro',
      choice: 'Offer support',
      skillsDemonstrated: ['empathy'],
      insight: 'You slowed down and made room for someone else.',
    },
  ],
  skillGaps: [
    {
      skill: 'leadership',
      currentLevel: 0.4,
      targetForTopCareers: 0.7,
      gap: 0.3,
      priority: 'high',
      developmentPath: 'Lead one small group effort this month.',
    },
  ],
  totalDemonstrations: 4,
  milestones: ['Completed your first route'],
}

const PATTERN_PROFILE = {
  userId: TEST_USER_ID,
  summaries: [
    {
      patternName: 'helping',
      demonstrationCount: 3,
      percentage: 75,
      lastDemonstrated: '2026-03-10T12:00:00.000Z',
      firstDemonstrated: '2026-03-01T12:00:00.000Z',
      scenesInvolved: ['maya_intro'],
      charactersInvolved: ['maya'],
    },
  ],
  evolution: [
    {
      weekStart: '2026-03-03T00:00:00.000Z',
      patternName: 'helping',
      weeklyCount: 3,
    },
  ],
  decisionStyle: {
    dominantPattern: 'helping',
    dominantPercentage: 75,
    secondaryPattern: 'exploring',
    secondaryPercentage: 25,
    styleName: 'Supportive Guide',
    description: 'You tend to lead with empathy and relationship awareness.',
  },
  skillCorrelations: [
    {
      patternName: 'helping',
      topSkills: ['empathy', 'communication'],
      skillCount: 2,
    },
  ],
  diversityScore: {
    score: 68,
    totalPatterns: 2,
    entropy: 0.7,
    recommendation: 'Try one analytical choice next.',
  },
  totalDemonstrations: 4,
  recentDemonstrations: [],
}

test('student insights action plan saves and reloads persisted state', async ({ page }) => {
  let persistedPlan: Record<string, unknown> = {
    thisWeekFocus: '',
    nextMonthGoal: '',
    supportNeeded: '',
    notes: '',
    updatedAt: '',
  }

  await page.addInitScript((userId) => {
    window.localStorage.setItem('lux-player-id', userId)
  }, TEST_USER_ID)

  await page.route('**/api/user/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  await page.route('**/api/user/skill-profile?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, profile: SKILL_PROFILE }),
    })
  })

  await page.route('**/api/user/pattern-profile?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, profile: PATTERN_PROFILE }),
    })
  })

  await page.route('**/api/user/career-explorations?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, careerExplorations: [] }),
    })
  })

  await page.route('**/api/user/action-plan*', async (route) => {
    if (route.request().method() === 'POST') {
      const payload = route.request().postDataJSON() as {
        plan?: Record<string, unknown>
      }
      persistedPlan = payload.plan ?? persistedPlan

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, plan: persistedPlan }),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, plan: persistedPlan }),
    })
  })

  await page.goto('/student/insights')

  await expect(page.getByRole('heading', { name: 'Action Plan' })).toBeVisible()

  await page.getByLabel('This Week').fill('Email one mentor about a Birmingham data project.')
  await page.getByLabel('Support I Need').fill('A warm introduction to someone in civic tech.')
  await page.getByLabel('Notes').fill('Remember how natural the community-focused choices felt.')

  await page.getByRole('button', { name: 'Save Plan' }).click()

  await expect(page.getByText(/Last saved/i)).toBeVisible()

  await page.reload()

  await expect(page.getByRole('heading', { name: 'Action Plan' })).toBeVisible()
  await expect(page.getByLabel('This Week')).toHaveValue(
    'Email one mentor about a Birmingham data project.',
  )
  await expect(page.getByLabel('Support I Need')).toHaveValue(
    'A warm introduction to someone in civic tech.',
  )
  await expect(page.getByLabel('Notes')).toHaveValue(
    'Remember how natural the community-focused choices felt.',
  )
})
