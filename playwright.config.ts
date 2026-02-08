import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Local dev machines can end up with a broken global Playwright cache
// (e.g. wrong-arch browser downloads). When set, use repo-local browsers
// installed into `node_modules/playwright-core/.local-browsers`.
const useLocalBrowsers = process.env.E2E_USE_LOCAL_BROWSERS === '1' || process.env.E2E_USE_LOCAL_BROWSERS === 'true'
if (useLocalBrowsers && !process.env.PLAYWRIGHT_BROWSERS_PATH) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = '0'
}

// When browser downloads are flaky locally, allow using a system browser instead.
// Example: `E2E_CHROMIUM_CHANNEL=chrome npm run test:e2e`.
const chromiumChannel = (() => {
  const value = process.env.E2E_CHROMIUM_CHANNEL
  if (!value) return undefined
  const allowed = new Set([
    'chrome',
    'chrome-beta',
    'chrome-dev',
    'chrome-canary',
    'msedge',
    'msedge-beta',
    'msedge-dev',
    'msedge-canary',
  ])
  return allowed.has(value) ? value : undefined
})()
const chromiumUseOverrides = chromiumChannel ? { channel: chromiumChannel } : {}

// Allow forcing iOS device projects to run in Chromium when WebKit is unstable locally.
const iosBrowser = (process.env.E2E_IOS_BROWSER === 'chromium' || process.env.E2E_IOS_BROWSER === 'webkit')
  ? process.env.E2E_IOS_BROWSER
  : 'webkit'
const COMMON_LAUNCH_ARGS = [
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
]

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
    baseURL: 'http://127.0.0.1:3005',

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

    // Reduce headless throttling artifacts that can cause perf + rAF-based flake.
    launchOptions: {
      args: COMMON_LAUNCH_ARGS,
    },
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
        ...chromiumUseOverrides,
        headless: true,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
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
        ...chromiumUseOverrides,
        headless: true,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
      },
    },
    {
      name: 'core-game',
      testMatch: [
        '**/core-game-loop.spec.ts',
        '**/journey-summary.spec.ts'
      ],
      // Keep this project stable: it heavily exercises client hydration and localStorage.
      // Running it serially avoids cold-start flakiness against the Next dev server.
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Chrome'],
        ...chromiumUseOverrides,
        headless: true,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
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
        ...chromiumUseOverrides,
        headless: true,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
      },
    },
    {
      name: 'simulations',
      testDir: './tests/e2e/simulations',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        ...chromiumUseOverrides,
        headless: true,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
      },
    },
    {
      name: 'knowledge-flags',
      testDir: './tests/e2e/knowledge-flags',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        ...chromiumUseOverrides,
        headless: true,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
      },
    },
    {
      name: 'interrupts',
      testDir: './tests/e2e/interrupts',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        ...chromiumUseOverrides,
        headless: true,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
      },
    },
    {
      name: 'trust-derivatives',
      testDir: './tests/e2e/trust',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        ...chromiumUseOverrides,
        headless: true,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
      },
    },
    {
      name: 'pattern-unlocks',
      testDir: './tests/e2e/patterns',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        ...chromiumUseOverrides,
        headless: true,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
      },
    },
    {
      name: 'career-analytics',
      testDir: './tests/e2e/careers',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        ...chromiumUseOverrides,
        headless: true,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
      },
    },
    {
      name: 'visual-validation',
      testDir: './tests/visual',
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Chrome'],
        ...chromiumUseOverrides,
        headless: false, // Use headed mode for visual tests
        launchOptions: { args: COMMON_LAUNCH_ARGS },
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
        browserName: iosBrowser,
        headless: true,
        ...(iosBrowser === 'chromium' ? chromiumUseOverrides : {}),
      },
    },
    {
      name: 'mobile-iphone-14',
      testDir: './tests/e2e/mobile',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['iPhone 14'],
        browserName: iosBrowser,
        headless: true,
        ...(iosBrowser === 'chromium' ? chromiumUseOverrides : {}),
      },
    },
    {
      name: 'mobile-iphone-14-pro-max',
      testDir: './tests/e2e/mobile',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['iPhone 14 Pro Max'],
        browserName: iosBrowser,
        headless: true,
        ...(iosBrowser === 'chromium' ? chromiumUseOverrides : {}),
      },
    },
    {
      name: 'mobile-galaxy-s21',
      testDir: './tests/e2e/mobile',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['Galaxy S21'],
        browserName: 'chromium',
        headless: true,
        ...chromiumUseOverrides,
        launchOptions: { args: COMMON_LAUNCH_ARGS },
      },
    },
    {
      name: 'mobile-ipad',
      testDir: './tests/e2e/mobile',
      fullyParallel: true,
      workers: 2,
      use: {
        ...devices['iPad (gen 7)'],
        browserName: iosBrowser,
        headless: true,
        ...(iosBrowser === 'chromium' ? chromiumUseOverrides : {}),
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

  // Start a server before running tests.
  //
  // We intentionally prefer a production server here (build + start) over
  // `next dev` because `next dev` file watching + E2E artifact writes can cause
  // `.next` manifest churn/flakiness under parallel Playwright workers.
  //
  // Opt-in to dev server via `E2E_USE_DEV_SERVER=true` when iterating locally.
  webServer: {
    // Bind to loopback to avoid sandbox restrictions that can block 0.0.0.0.
    command: process.env.E2E_USE_DEV_SERVER
      ? 'npm run dev -- --hostname 127.0.0.1'
      // Wrap in a shell so `&&` works reliably across environments.
      : 'bash -lc "npm run build && npm run start -- -p 3005 -H 127.0.0.1"',
    // Use a non-redirecting URL for readiness checks (the root route can 307 to /welcome).
    url: 'http://127.0.0.1:3005/api/health',
    reuseExistingServer: !process.env.CI,
    // Allow extra time for a cold `next build` before the server is ready.
    timeout: 180 * 1000,
    env: {
      ...process.env,
      E2E_ADMIN_BYPASS_TOKEN: process.env.E2E_ADMIN_BYPASS_TOKEN || 'e2e-admin-bypass',
      E2E_ADMIN_BYPASS_ENABLED: process.env.E2E_ADMIN_BYPASS_ENABLED || 'true'
    },
  },
})
