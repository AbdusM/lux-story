import { test, expect } from '../fixtures/auth-fixtures'

const TEST_USER_ID = 'player_action_test'

const skillDataResponse = {
  success: true,
  profile: {
    user_id: TEST_USER_ID,
    total_demonstrations: 5,
    skill_summaries: [
      {
        skill_name: 'criticalThinking',
        demonstration_count: 3,
        latest_context: 'Mapped trade-offs between healthcare pathways.',
        scenes_involved: ['career_station'],
        last_demonstrated: '2026-03-07T12:00:00.000Z',
      },
      {
        skill_name: 'communication',
        demonstration_count: 2,
        latest_context: 'Explained a recommendation clearly.',
        scenes_involved: ['mentor_exchange'],
        last_demonstrated: '2026-03-07T12:05:00.000Z',
      },
    ],
    skill_demonstrations: [
      {
        skill_name: 'criticalThinking',
        scene_id: 'career_station',
        choice_text: 'Compare the options before deciding.',
        context: 'Mapped trade-offs between healthcare pathways.',
        demonstrated_at: '2026-03-07T12:00:00.000Z',
      },
    ],
    career_explorations: [
      {
        id: 'career-health-informatics',
        career_name: 'Health Informatics Specialist',
        match_score: 87,
        readiness_level: 'near_ready',
        local_opportunities: ['UAB', 'Children’s of Alabama'],
        education_paths: ['Certificate', 'Associate degree'],
      },
    ],
  },
}

const guidanceResponse = {
  success: true,
  userId: TEST_USER_ID,
  fetchedAt: '2026-03-07T12:15:00.000Z',
  guidance: {
    experimentVariant: 'adaptive',
    schemaVersion: '2026-03-v1',
    ontologyVersion: '2026-03-v1',
    recommendationVersion: '2026-03-v1',
    updatedAt: '2026-03-07T12:12:00.000Z',
    dimensions: {
      initiative: 74,
      followThrough: 100,
      assistedCompletion: 24,
      independentCompletion: 76,
      recoveryAfterFriction: 62,
    },
    currentRecommendation: {
      taskId: 'review_career_matches',
      title: 'Review Career Matches',
      summary: 'Compare your strongest near-ready options.',
      reason: 'You already showed the prerequisite skill pattern and this creates a proof artifact.',
      ctaLabel: 'Open career matches',
      destination: {
        kind: 'tab',
        tab: 'careers',
      },
      surface: 'careers',
      score: 0.92,
    },
    missedDoors: [],
    reachableTaskCount: 4,
    shadowArtifactCount: 2,
    frictionFlags: ['recovery_loop'],
    stalledTasks: [
      {
        taskId: 'resume_waiting_route',
        title: 'Resume Waiting Route',
        highestProgressState: 'attempted',
        latestAssistMode: 'augmented',
        attemptCount: 2,
        completionCount: 0,
        evidenceCount: 0,
        lastTouchedAt: '2026-03-07T12:08:00.000Z',
        lastCompletedAt: null,
      },
    ],
    completedTasks: [
      {
        taskId: 'review_career_matches',
        title: 'Review Career Matches',
        highestProgressState: 'completed',
        latestAssistMode: 'manual',
        attemptCount: 1,
        completionCount: 1,
        evidenceCount: 0,
        lastTouchedAt: '2026-03-07T12:06:00.000Z',
        lastCompletedAt: '2026-03-07T12:06:00.000Z',
      },
    ],
    eventCounts: {
      recommendationShown: 3,
      recommendationClicked: 2,
      recommendationDismissed: 1,
      taskCompleted: 1,
      artifactExported: 1,
      assistModeSelected: 1,
    },
    recentEvents: [],
  },
}

const guidanceSummaryResponse = {
  success: true,
  fetchedAt: '2026-03-07T12:16:00.000Z',
  summary: {
    generatedAt: '2026-03-07T12:16:00.000Z',
    days: 30,
    userLimit: 200,
    rollout: {
      mode: 'experiment',
      adaptivePercentage: 40,
      controlPercentage: 60,
      isKillSwitchActive: false,
    },
    totals: {
      usersWithGuidance: 12,
      controlUsers: 7,
      adaptiveUsers: 5,
    },
    cohorts: [
      {
        cohort: 'control',
        userCount: 7,
        recommendationShown: 11,
        recommendationClicked: 2,
        recommendationDismissed: 3,
        taskCompleted: 2,
        artifactExported: 0,
        ctr: 18,
        completionRate: 18,
        dismissRate: 27,
        artifactExportRate: 0,
        averageInitiative: 51,
        averageFollowThrough: 47,
        averageRecoveryAfterFriction: 43,
        stalledUserCount: 3,
      },
      {
        cohort: 'adaptive',
        userCount: 5,
        recommendationShown: 14,
        recommendationClicked: 8,
        recommendationDismissed: 2,
        taskCompleted: 6,
        artifactExported: 3,
        ctr: 57,
        completionRate: 43,
        dismissRate: 14,
        artifactExportRate: 21,
        averageInitiative: 68,
        averageFollowThrough: 72,
        averageRecoveryAfterFriction: 61,
        stalledUserCount: 1,
      },
    ],
    metadata: {
      planRowsScanned: 12,
      eventRowsScanned: 42,
      truncated: false,
    },
  },
}

test.describe('Admin Action Guidance Smoke', () => {
  test('renders the rollout summary and adaptive diagnostics on the action page', async ({ page, adminAuth }) => {
    await page.route(`**/api/admin/skill-data?userId=${TEST_USER_ID}`, async (route) => {
      await route.fulfill({ json: skillDataResponse })
    })

    await page.route('**/api/admin/guidance/summary?days=30&limit=200', async (route) => {
      await route.fulfill({ json: guidanceSummaryResponse })
    })

    await page.route(`**/api/admin/guidance/${TEST_USER_ID}`, async (route) => {
      await route.fulfill({ json: guidanceResponse })
    })

    await page.goto(`/admin/${TEST_USER_ID}/action`, { waitUntil: 'networkidle' })

    await expect(page).toHaveURL(new RegExp(`/admin/${TEST_USER_ID}/action$`))
    await expect(page.getByRole('heading', { name: /guidance rollout summary/i })).toBeVisible()
    await expect(page.getByText(/experiment live/i)).toBeVisible()
    await expect(page.getByText(/40% adaptive share/i)).toBeVisible()
    await expect(page.getByText(/12 learners in summary/i)).toBeVisible()
    await expect(page.getByText(/adaptive cohort/i).first()).toBeVisible()

    await expect(page.getByRole('heading', { name: /adaptive guidance diagnostics/i })).toBeVisible()
    await expect(page.getByText(/review career matches/i)).toBeVisible()
    await expect(page.getByText(/current recommendation/i)).toBeVisible()
    await expect(page.getByText(/recovery watchlist/i)).toBeVisible()
    await expect(page.getByText(/2 attempts/i)).toBeVisible()
    await expect(page.getByText(/shadow portfolio exports/i)).toBeVisible()

    await expect(page.getByText(/unable to load adaptive guidance diagnostics/i)).toHaveCount(0)
    await expect(page.getByText(/unable to load guidance cohort summary/i)).toHaveCount(0)
  })
})
