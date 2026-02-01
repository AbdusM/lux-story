import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Playwright E2E Testing Configuration
 * Sprint 1.2: User flows, database integration, state persistence
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Phase 5: Increased workers for parallelization (4 local, 2 CI)
  workers: process.env.CI ? 2 : 4,

  // Reporter configuration
  reporter: [
    ['html'],
    ['list'],
    process.env.CI ? ['github'] : ['line']
  ],

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:3005',

    // Force headless mode (no visual windows, prevents window jumping)
    headless: true,

    // Collect trace when retrying failed tests
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video recording
    video: 'retain-on-failure',

    // Action timeout
    actionTimeout: 10 * 1000,
  },

  // Global setup for authentication (runs once before all tests)
  // Note: globalSetup file doesn't exist yet - will be created when needed
  // globalSetup: resolve(__dirname, './tests/e2e/global-setup'),

  // Configure projects for feature-based parallelization
  projects: [
    // ═══════════════════════════════════════════════════════════════════════════
    // SMOKE TESTS - Fast CI gate (run first, fail fast)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      name: 'smoke',
      testMatch: [
        '**/characters/character-smoke.spec.ts',
        '**/simulations/simulation-smoke.spec.ts',
        '**/user-flows/homepage.spec.ts'
      ],
      fullyParallel: true,
      workers: process.env.CI ? 1 : 2,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DESKTOP PROJECTS (feature-based)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      name: 'auth',
      testDir: './tests/e2e/admin',
      fullyParallel: false, // Serial (shares auth state)
      workers: 1,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'core-game',
      testMatch: [
        '**/core-game-loop.spec.ts',
        '**/journey-summary.spec.ts'
      ],
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'ui-components',
      testMatch: [
        '**/constellation/constellation-mobile.spec.ts',
        '**/user-flows/homepage.spec.ts'
      ],
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'simulations',
      testDir: './tests/e2e/simulations',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'knowledge-flags',
      testDir: './tests/e2e/knowledge-flags',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'interrupts',
      testDir: './tests/e2e/interrupts',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'trust-derivatives',
      testDir: './tests/e2e/trust',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'pattern-unlocks',
      testDir: './tests/e2e/patterns',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'career-analytics',
      testDir: './tests/e2e/careers',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'visual-validation',
      testDir: './tests/visual',
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Chrome'],
        headless: false, // Use headed mode for visual tests
      },
    },

    // Mobile projects (device-specific)
    {
      name: 'mobile-iphone-se',
      testDir: './tests/e2e/mobile',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['iPhone SE'],
        headless: true,
      },
    },
    {
      name: 'mobile-iphone-14',
      testDir: './tests/e2e/mobile',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['iPhone 14'],
        headless: true,
      },
    },
    {
      name: 'mobile-iphone-14-pro-max',
      testDir: './tests/e2e/mobile',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['iPhone 14 Pro Max'],
        headless: true,
      },
    },
    {
      name: 'mobile-galaxy-s21',
      testDir: './tests/e2e/mobile',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Galaxy S21'],
        headless: true,
      },
    },
    {
      name: 'mobile-ipad',
      testDir: './tests/e2e/mobile',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['iPad (gen 7)'],
        headless: true,
      },
    },

    // Uncomment for cross-browser testing in CI
    // {
    //   name: 'firefox',
    //   testMatch: '**/core-game-loop.spec.ts',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   testMatch: '**/core-game-loop.spec.ts',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3005',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      ...process.env,
      E2E_ADMIN_BYPASS_TOKEN: process.env.E2E_ADMIN_BYPASS_TOKEN || 'e2e-admin-bypass',
      E2E_ADMIN_BYPASS_ENABLED: process.env.E2E_ADMIN_BYPASS_ENABLED || 'true'
    },
  },
})
