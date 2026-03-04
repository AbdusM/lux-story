#!/usr/bin/env node

/**
 * Release smoke checks against a deployed URL.
 *
 * Usage:
 *   BASE_URL="https://preview.example.com" node scripts/ci/release-smoke.mjs
 */

const baseUrl = (process.env.BASE_URL || '').trim().replace(/\/+$/, '')

if (!baseUrl) {
  console.error('Missing BASE_URL. Example: BASE_URL="https://preview.example.com" node scripts/ci/release-smoke.mjs')
  process.exit(1)
}

const checks = []

async function request(path, init = {}) {
  const url = `${baseUrl}${path}`
  const response = await fetch(url, init)
  const text = await response.text()
  let json = null

  try {
    json = JSON.parse(text)
  } catch {
    // Non-JSON response is expected for HTML routes.
  }

  return { url, response, text, json }
}

function pass(name, details) {
  checks.push({ name, ok: true, details })
}

function fail(name, details) {
  checks.push({ name, ok: false, details })
}

function assertStatus(name, actual, expected) {
  if (actual === expected) {
    pass(name, `status=${actual}`)
  } else {
    fail(name, `expected status=${expected}, got status=${actual}`)
  }
}

function assertStatusIn(name, actual, expectedStatuses) {
  if (expectedStatuses.includes(actual)) {
    pass(name, `status=${actual}`)
  } else {
    fail(name, `expected status in [${expectedStatuses.join(', ')}], got status=${actual}`)
  }
}

function assertTruthy(name, condition, detailsIfFail, detailsIfPass = 'ok') {
  if (condition) {
    pass(name, detailsIfPass)
  } else {
    fail(name, detailsIfFail)
  }
}

async function run() {
  console.log(`Release smoke target: ${baseUrl}`)

  const home = await request('/')
  assertStatus('GET /', home.response.status, 200)

  const health = await request('/api/health')
  assertStatus('GET /api/health', health.response.status, 200)
  assertTruthy(
    'health.status',
    health.json?.status === 'healthy',
    `expected health.status=healthy, got ${JSON.stringify(health.json)}`
  )

  const storage = await request('/api/health/storage')
  assertStatus('GET /api/health/storage', storage.response.status, 200)
  assertTruthy(
    'storage.status',
    storage.json?.status === 'healthy',
    `expected storage.status=healthy, got ${JSON.stringify(storage.json)}`
  )

  const db = await request('/api/health/db')
  assertStatus('GET /api/health/db', db.response.status, 200)
  assertTruthy(
    'db.status',
    typeof db.json?.status === 'string',
    `expected db.status string, got ${JSON.stringify(db.json)}`
  )

  const userSession = await request('/api/user/session')
  assertStatus('GET /api/user/session (unauth)', userSession.response.status, 401)

  const advisor = await request('/api/advisor-briefing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerProfile: { userId: 'smoke-user' },
      skillEvidence: {},
    }),
  })
  assertStatusIn('POST /api/advisor-briefing (unauth)', advisor.response.status, [401, 403])

  const csp = home.response.headers.get('content-security-policy') || ''
  assertTruthy(
    'csp.present',
    Boolean(csp),
    'missing Content-Security-Policy header'
  )
  assertTruthy(
    'csp.no-unsafe-eval',
    !csp.includes("'unsafe-eval'"),
    `CSP includes 'unsafe-eval': ${csp}`
  )

  const failed = checks.filter((check) => !check.ok)
  const passed = checks.filter((check) => check.ok)

  for (const check of checks) {
    const prefix = check.ok ? 'PASS' : 'FAIL'
    console.log(`${prefix}: ${check.name} -> ${check.details}`)
  }

  console.log(`\nSummary: ${passed.length} passed, ${failed.length} failed`)

  if (failed.length > 0) {
    process.exit(1)
  }
}

run().catch((error) => {
  console.error('Release smoke script crashed:', error instanceof Error ? error.message : error)
  process.exit(1)
})

