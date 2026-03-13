import { test, expect } from '../fixtures/auth-fixtures'

const laborSignalDiagnosticsResponse = {
  success: true,
  fetchedAt: '2026-03-13T04:20:00.000Z',
  report: {
    generatedAt: '2026-03-13T04:20:00.000Z',
    warningThresholdDays: 14,
    totals: {
      totalRows: 17,
      freshRows: 15,
      warningRows: 2,
      staleRows: 0,
      invalidTimestampRows: 0,
    },
    datasets: [
      {
        kind: 'observedExposure',
        totalRows: 9,
        freshRows: 7,
        warningRows: 2,
        staleRows: 0,
        invalidTimestampRows: 0,
        canonicalCoverageCount: 7,
        canonicalCareerCount: 7,
        canonicalCoveragePercent: 100,
        canonicalRecordCount: 7,
        aliasOnlyRecordCount: 2,
        missingCanonicalCareerIds: [],
        nextExpirationDays: 4,
        maxAgeDays: 45,
      },
      {
        kind: 'entryFriction',
        totalRows: 8,
        freshRows: 8,
        warningRows: 0,
        staleRows: 0,
        invalidTimestampRows: 0,
        canonicalCoverageCount: 7,
        canonicalCareerCount: 7,
        canonicalCoveragePercent: 100,
        canonicalRecordCount: 7,
        aliasOnlyRecordCount: 1,
        missingCanonicalCareerIds: [],
        nextExpirationDays: 12,
        maxAgeDays: 30,
      },
    ],
    upcomingExpirations: [
      {
        kind: 'observedExposure',
        summary: 'Curated nowcasting mapping for a high-context data lane with meaningful AI adoption but continued human interpretation demand.',
        source: 'Anthropic labor-market note + Lux canonical career mapping',
        version: 'observed-exposure-v1',
        updatedAtIso: '2026-03-09T00:00:00.000Z',
        coverage: 'Canonical Birmingham career lanes plus compatibility aliases inside the repo-owned nowcasting map.',
        confidence: 'medium',
        ageDays: 41,
        maxAgeDays: 45,
        daysUntilStale: 4,
        status: 'warning',
      },
      {
        kind: 'entryFriction',
        summary: 'Curated medium-friction mapping for regulated healthcare-adjacent work with compliance and trust-heavy entry gates.',
        source: 'Lux nowcasting proxy map + Birmingham opportunity context',
        version: 'entry-friction-v1',
        updatedAtIso: '2026-03-01T00:00:00.000Z',
        coverage: 'Canonical Birmingham career lanes plus selected alias coverage for adjacent role names.',
        confidence: 'medium',
        ageDays: 18,
        maxAgeDays: 30,
        daysUntilStale: 12,
        status: 'fresh',
      },
    ],
    urgentRows: [],
    fallbackRisk: {
      totalMissingCanonicalMatches: 0,
      observedExposureMissingCareerIds: [],
      entryFrictionMissingCareerIds: [],
      aliasOnlyRowCount: 3,
    },
  },
}

test.describe('Admin Labor Market Diagnostics Smoke', () => {
  test('renders labor signal freshness and fallback coverage on the diagnostics page', async ({ page, adminAuth: _adminAuth }) => {
    await page.route('**/api/admin/labor-market-signals', async (route) => {
      await route.fulfill({ json: laborSignalDiagnosticsResponse })
    })

    await page.goto('/admin/diagnostics', { waitUntil: 'networkidle' })

    await expect(page).toHaveURL(/\/admin\/diagnostics$/)
    await expect(page.getByRole('heading', { name: /labor signal diagnostics/i })).toBeVisible()
    await expect(page.getByText(/fresh rows/i)).toBeVisible()
    await expect(page.getByText(/17 total rows/i)).toBeVisible()
    await expect(page.getByText(/warning rows/i)).toBeVisible()
    await expect(page.getByText(/threshold 14 days/i)).toBeVisible()
    await expect(page.getByText('Fallback Risk', { exact: true })).toBeVisible()
    await expect(page.getByText(/3 alias-only rows/i)).toBeVisible()
    await expect(page.getByRole('heading', { name: /upcoming expirations/i })).toBeVisible()
    await expect(page.getByText('Canonical coverage is complete.', { exact: true })).toBeVisible()
    await expect(page.getByText(/observed exposure missing/i)).toBeVisible()
    await expect(page.getByText(/entry friction missing/i)).toBeVisible()
    await expect(page.getByText(/labor signal error/i)).toHaveCount(0)
  })
})
