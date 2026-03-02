import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.SMOKE_BASE_URL || 'https://lux-story.vercel.app'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60 * 1000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['line']],
  use: {
    baseURL,
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10 * 1000,
  },
  projects: [
    {
      name: 'smoke',
      testMatch: [
        '**/characters/character-smoke.spec.ts',
        '**/user-flows/homepage.spec.ts',
      ],
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'mobile-iphone-14',
      testMatch: ['**/mobile/choice-bottom-sheet.spec.ts'],
      use: {
        ...devices['iPhone 14'],
        headless: true,
      },
    },
  ],
})
