#!/usr/bin/env node

/**
 * Release smoke checks against a deployed URL.
 *
 * Usage:
 *   BASE_URL="https://preview.example.com" node scripts/ci/release-smoke.mjs
 */

const DEFAULT_BASE_URL = 'https://lux-story.vercel.app'
const baseUrl = (process.env.BASE_URL || DEFAULT_BASE_URL).trim().replace(/\/+$/, '')
const smokeUserId = (process.env.SMOKE_USER_ID || crypto.randomUUID()).trim()
const cookieJar = new Map()

const checks = []

function splitSetCookieHeader(headerValue) {
  if (!headerValue) return []

  const cookies = []
  let current = ''
  let inExpiresAttribute = false

  for (let index = 0; index < headerValue.length; index += 1) {
    const char = headerValue[index]

    if (char === ',') {
      if (!inExpiresAttribute) {
        if (current.trim()) cookies.push(current.trim())
        current = ''
        continue
      }
    }

    current += char

    const lowerCurrent = current.toLowerCase()
    if (lowerCurrent.endsWith('expires=')) {
      inExpiresAttribute = true
      continue
    }

    if (inExpiresAttribute && char === ';') {
      inExpiresAttribute = false
    }
  }

  if (current.trim()) cookies.push(current.trim())
  return cookies
}

function storeCookies(response) {
  const setCookieValues =
    typeof response.headers.getSetCookie === 'function'
      ? response.headers.getSetCookie()
      : splitSetCookieHeader(response.headers.get('set-cookie'))

  for (const entry of setCookieValues) {
    const [pair] = entry.split(';')
    if (!pair) continue
    const separatorIndex = pair.indexOf('=')
    if (separatorIndex <= 0) continue

    const name = pair.slice(0, separatorIndex).trim()
    const value = pair.slice(separatorIndex + 1).trim()
    if (!name || !value) continue
    cookieJar.set(name, value)
  }
}

function getCookieHeader() {
  return Array.from(cookieJar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')
}

async function request(path, init = {}, options = {}) {
  const url = `${baseUrl}${path}`
  const headers = new Headers(init.headers || {})
  if (options.useCookies && cookieJar.size > 0 && !headers.has('Cookie')) {
    headers.set('Cookie', getCookieHeader())
  }

  const response = await fetch(url, {
    ...init,
    headers,
  })

  if (options.captureCookies) {
    storeCookies(response)
  }

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
  console.log(`Smoke user: ${smokeUserId}`)

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

  const sessionCreate = await request('/api/user/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: smokeUserId }),
  }, { captureCookies: true })
  assertStatus('POST /api/user/session', sessionCreate.response.status, 200)
  assertTruthy(
    'user-session.created',
    sessionCreate.json?.success === true && sessionCreate.json?.user_id === smokeUserId,
    `expected session create success for ${smokeUserId}, got ${JSON.stringify(sessionCreate.json)}`
  )
  assertTruthy(
    'user-session.cookie',
    cookieJar.size > 0,
    'expected session cookie to be set'
  )

  const authedUserSession = await request('/api/user/session', {}, { useCookies: true })
  assertStatus('GET /api/user/session (auth)', authedUserSession.response.status, 200)
  assertTruthy(
    'user-session.authenticated',
    authedUserSession.json?.authenticated === true && authedUserSession.json?.user_id === smokeUserId,
    `expected authenticated session for ${smokeUserId}, got ${JSON.stringify(authedUserSession.json)}`
  )

  const profileEnsure = await request('/api/user/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: smokeUserId }),
  }, { useCookies: true })
  assertStatus('POST /api/user/profile', profileEnsure.response.status, 200)
  assertTruthy(
    'profile.ensure',
    profileEnsure.json?.success === true,
    `expected profile ensure success, got ${JSON.stringify(profileEnsure.json)}`
  )

  const platformStatePayload = {
    user_id: smokeUserId,
    current_scene: 'release_smoke_scene',
    global_flags: ['release_smoke_flag'],
    patterns: {
      analytical: 1,
      helping: 0,
      building: 0,
      patience: 0,
      exploring: 0,
    },
  }
  const platformStateWrite = await request('/api/user/platform-state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(platformStatePayload),
  }, { useCookies: true })
  assertStatus('POST /api/user/platform-state', platformStateWrite.response.status, 200)
  assertTruthy(
    'platform-state.write',
    platformStateWrite.json?.success === true,
    `expected platform-state write success, got ${JSON.stringify(platformStateWrite.json)}`
  )

  const platformStateRead = await request(
    `/api/user/platform-state?userId=${encodeURIComponent(smokeUserId)}`,
    {},
    { useCookies: true }
  )
  assertStatus('GET /api/user/platform-state', platformStateRead.response.status, 200)
  assertTruthy(
    'platform-state.read',
    platformStateRead.json?.success === true &&
      platformStateRead.json?.state?.user_id === smokeUserId &&
      platformStateRead.json?.state?.platform_id === 'global' &&
      platformStateRead.json?.state?.current_scene === platformStatePayload.current_scene &&
      Array.isArray(platformStateRead.json?.state?.global_flags) &&
      platformStateRead.json.state.global_flags.includes('release_smoke_flag') &&
      platformStateRead.json?.state?.patterns?.analytical === 1,
    `expected persisted platform-state for ${smokeUserId}, got ${JSON.stringify(platformStateRead.json)}`
  )

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
  const cspDirectives = csp
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((directive) => {
      const [name, ...values] = directive.split(/\s+/)
      return { name, values }
    })
  const unsafeInlineOutsideExplicitException = cspDirectives
    .filter(({ values }) => values.includes("'unsafe-inline'"))
    .filter(({ name }) => name !== 'script-src' && name !== 'style-src')
    .map(({ name }) => name)

  assertTruthy(
    'csp.unsafe-inline-scoped',
    unsafeInlineOutsideExplicitException.length === 0,
    `CSP has unsafe-inline outside script/style directives: ${unsafeInlineOutsideExplicitException.join(', ')}`
  )
  assertTruthy(
    'csp.object-src-none',
    csp.includes("object-src 'none'"),
    `CSP missing object-src 'none': ${csp}`
  )
  assertTruthy(
    'csp.frame-ancestors-none',
    csp.includes("frame-ancestors 'none'"),
    `CSP missing frame-ancestors 'none': ${csp}`
  )
  assertTruthy(
    'csp.base-uri-self',
    csp.includes("base-uri 'self'"),
    `CSP missing base-uri 'self': ${csp}`
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
