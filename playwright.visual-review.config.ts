import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.VISUAL_REVIEW_BASE_URL || 'https://lux-story.vercel.app'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90 * 1000,
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
      name: 'visual-desktop-1440',
      testMatch: ['**/user-flows/visual-review-capture.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        headless: true,
      },
    },
    {
      name: 'visual-mobile-iphone-14',
      testMatch: ['**/user-flows/visual-review-capture.spec.ts'],
      use: {
        ...devices['iPhone 14'],
        headless: true,
      },
    },
    {
      name: 'visual-mobile-iphone-se',
      testMatch: ['**/user-flows/visual-review-capture.spec.ts'],
      use: {
        ...devices['iPhone SE'],
        headless: true,
      },
    },
  ],
})
