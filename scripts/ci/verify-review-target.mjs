#!/usr/bin/env node

/**
 * Review-target preflight.
 *
 * Fails fast if a candidate review URL cannot mint an anonymous user session.
 * This prevents external visual review from running against a deployment that
 * is missing USER_API_SESSION_SECRET or otherwise cannot sustain the normal
 * player-facing surface.
 *
 * Usage:
 *   BASE_URL="https://lux-story.vercel.app" node scripts/ci/verify-review-target.mjs
 */

const baseUrl = (process.env.BASE_URL || '').trim().replace(/\/+$/, '')
const reviewUserId = process.env.REVIEW_USER_ID || '11111111-1111-1111-1111-111111111111'

if (!baseUrl) {
  console.error('Missing BASE_URL. Example: BASE_URL="https://lux-story.vercel.app" node scripts/ci/verify-review-target.mjs')
  process.exit(1)
}

async function request(path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, init)
  const text = await response.text()

  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    // Some review targets may return HTML for route failures.
  }

  return { response, text, json }
}

function fail(message) {
  console.error(`FAIL: ${message}`)
  process.exit(1)
}

async function main() {
  console.log(`Review target: ${baseUrl}`)

  const home = await request('/')
  if (home.response.status !== 200) {
    fail(`GET / expected 200, got ${home.response.status}`)
  }
  console.log('PASS: GET / -> 200')

  const sessionInit = await request('/api/user/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: reviewUserId }),
  })

  if (sessionInit.response.status !== 200) {
    fail(
      `POST /api/user/session expected 200, got ${sessionInit.response.status} body=${sessionInit.text}`
    )
  }

  const cookieHeader = sessionInit.response.headers.get('set-cookie') || ''
  if (!cookieHeader.includes('lux_user_session=')) {
    fail('POST /api/user/session returned 200 but did not set lux_user_session cookie')
  }

  if (sessionInit.json?.success !== true || sessionInit.json?.user_id !== reviewUserId) {
    fail(`POST /api/user/session returned unexpected payload: ${JSON.stringify(sessionInit.json)}`)
  }

  console.log('PASS: POST /api/user/session -> 200 + signed session cookie')
  console.log('Review target is valid for visual inspection.')
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error))
})
