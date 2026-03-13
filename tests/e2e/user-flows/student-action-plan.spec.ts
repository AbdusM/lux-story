import { expect, test, type Page } from '@playwright/test'

const USER_ONE_ID = 'player_123'
const USER_TWO_ID = 'player_456'

function buildSkillProfile(options: {
  userId: string
  readiness: 'near_ready' | 'skill_gaps' | 'exploratory'
  growthProjection: 'high' | 'medium' | 'stable'
}) {
  return {
    userId: options.userId,
    userName: options.userId === USER_TWO_ID ? 'Alex' : 'Jordan',
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
        id: options.userId === USER_TWO_ID ? 'advanced-logistics' : 'data-analyst-community',
        name: options.userId === USER_TWO_ID ? 'Advanced Logistics & Manufacturing' : 'Community Data Analyst',
        matchScore: 0.84,
        requiredSkills: {
          empathy: { current: 0.8, required: 0.6, gap: 0 },
          communication: { current: 0.7, required: 0.6, gap: 0 },
          leadership: { current: 0.4, required: 0.7, gap: 0.3 },
        },
        salaryRange: [45000, 65000] as [number, number],
        educationPaths: ['UAB Data Science'],
        localOpportunities: ['UAB Innovation Lab'],
        birminghamRelevance: 0.92,
        growthProjection: options.growthProjection,
        readiness: options.readiness,
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
    skillGaps:
      options.readiness === 'near_ready'
        ? []
        : [
            {
              skill: 'leadership',
              currentLevel: 0.4,
              targetForTopCareers: 0.7,
              gap: 0.3,
              priority: 'high' as const,
              developmentPath: 'Lead one small group effort this month.',
            },
          ],
    totalDemonstrations: 4,
    milestones: ['Completed your first route'],
  }
}

function buildPatternProfile(userId: string) {
  return {
    userId,
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
}

async function stubInsightsApis(page: Page) {
  const persistedPlans = new Map<string, Record<string, unknown>>()
  const interactionEvents: Array<{ event_type?: string; payload?: Record<string, unknown> }> = []
  const profiles = {
    [USER_ONE_ID]: buildSkillProfile({
      userId: USER_ONE_ID,
      readiness: 'skill_gaps',
      growthProjection: 'high',
    }),
    [USER_TWO_ID]: buildSkillProfile({
      userId: USER_TWO_ID,
      readiness: 'near_ready',
      growthProjection: 'high',
    }),
  }

  await page.route('**/api/user/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  await page.route('**/api/user/skill-profile?*', async (route) => {
    const userId = new URL(route.request().url()).searchParams.get('userId') ?? USER_ONE_ID
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, profile: profiles[userId as keyof typeof profiles] ?? profiles[USER_ONE_ID] }),
    })
  })

  await page.route('**/api/user/pattern-profile?*', async (route) => {
    const userId = new URL(route.request().url()).searchParams.get('userId') ?? USER_ONE_ID
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, profile: buildPatternProfile(userId) }),
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
    const request = route.request()

    if (request.method() === 'POST') {
      const payload = request.postDataJSON() as {
        userId?: string
        plan?: Record<string, unknown>
      }
      const userId = payload.userId ?? USER_ONE_ID
      const nextPlan = payload.plan ?? persistedPlans.get(userId) ?? {}
      persistedPlans.set(userId, nextPlan)

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, plan: nextPlan }),
      })
      return
    }

    const userId = new URL(request.url()).searchParams.get('userId') ?? USER_ONE_ID
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, plan: persistedPlans.get(userId) ?? {} }),
    })
  })

  await page.route('**/api/user/interaction-events', async (route) => {
    interactionEvents.push(route.request().postDataJSON() as { event_type?: string; payload?: Record<string, unknown> })
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  return { interactionEvents }
}

async function stubSingleUserInsightsApis(page: Page) {
  let persistedPlan: Record<string, unknown> = {
    thisWeekFocus: '',
    nextMonthGoal: '',
    supportNeeded: '',
    notes: '',
    updatedAt: '',
  }
  const interactionEvents: Array<{ event_type?: string; payload?: Record<string, unknown> }> = []

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
      body: JSON.stringify({
        success: true,
        profile: buildSkillProfile({
          userId: USER_ONE_ID,
          readiness: 'skill_gaps',
          growthProjection: 'high',
        }),
      }),
    })
  })

  await page.route('**/api/user/pattern-profile?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, profile: buildPatternProfile(USER_ONE_ID) }),
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

  await page.route('**/api/user/interaction-events', async (route) => {
    interactionEvents.push(route.request().postDataJSON() as { event_type?: string; payload?: Record<string, unknown> })
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  return { interactionEvents }
}

async function seedLocalStorage(page: Page, entries: Record<string, string>) {
  await page.goto('/test-env')
  await page.evaluate((nextEntries) => {
    Object.entries(nextEntries).forEach(([key, value]) => {
      window.localStorage.setItem(key, value)
    })
  }, entries)
}

test('student insights action plan saves and reloads persisted state', async ({ page }) => {
  await stubSingleUserInsightsApis(page)
  await seedLocalStorage(page, { 'lux-player-id': USER_ONE_ID })
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

test('legacy posture migrates once and scoped posture stays isolated per user', async ({ page }) => {
  await stubInsightsApis(page)
  await seedLocalStorage(page, {
    'lux-player-id': USER_ONE_ID,
    'lux-posture': 'attack',
  })
  await page.goto('/student/insights')

  await expect(page.getByRole('heading', { name: 'Signals & Strategy' })).toBeVisible()
  await expect
    .poll(() =>
      page.evaluate(() => ({
        scoped: window.localStorage.getItem('lux-posture:player_123'),
        legacy: window.localStorage.getItem('lux-posture'),
      })),
    )
    .toEqual({ scoped: 'attack', legacy: null })

  await page.getByRole('button', { name: 'Defend' }).first().click()
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem('lux-posture:player_123')))
    .toBe('defend')

  await page.evaluate((userId) => {
    window.localStorage.setItem('lux-player-id', userId)
  }, USER_TWO_ID)
  await page.goto('/student/insights')

  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem('lux-posture:player_456')))
    .toBe('attack')
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem('lux-posture:player_123')))
    .toBe('defend')
})

test('manual proof edits survive posture and format changes', async ({ page }) => {
  await stubInsightsApis(page)
  await seedLocalStorage(page, { 'lux-player-id': USER_ONE_ID })
  await page.goto('/student/insights')

  const draftField = page.getByLabel('Draft')
  const customDraft = 'Custom proof text that should survive automatic regeneration.'

  await draftField.fill(customDraft)

  await page.getByRole('button', { name: 'Attack' }).first().click()
  await expect(draftField).toHaveValue(customDraft)

  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: 'Interview Stories' }).click()
  await expect(draftField).toHaveValue(customDraft)
})

test('student insights emits labor-signal and action-plan telemetry', async ({ page }) => {
  const { interactionEvents } = await stubSingleUserInsightsApis(page)
  await seedLocalStorage(page, { 'lux-player-id': USER_ONE_ID })
  await page.goto('/student/insights')

  await expect(page.getByRole('heading', { name: 'Signals & Strategy' })).toBeVisible()
  await expect
    .poll(() => interactionEvents.some((event) => event.event_type === 'recommendation_shown'))
    .toBe(true)
  await expect
    .poll(() => interactionEvents.some((event) => event.event_type === 'task_exposed'))
    .toBe(true)

  await page.getByRole('button', { name: 'Jump to Plan' }).click()
  await page.getByRole('button', { name: 'Use Suggested Draft' }).click()
  await page.getByRole('button', { name: 'Save Plan' }).click()

  await expect
    .poll(() =>
      interactionEvents
        .filter((event) => event.event_type != null)
        .map((event) => event.event_type)
        .sort(),
    )
    .toEqual([
      'recommendation_clicked',
      'recommendation_shown',
      'task_completed',
      'task_exposed',
      'task_started',
    ])
})
