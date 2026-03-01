import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getClientIp, rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const MAX_BODY_BYTES = 32_768 // 32KB
const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 })

const ClientErrorSchema = z.object({
  message: z.string().min(1).max(2_000),
  context: z.record(z.string(), z.unknown()).optional(),
  stack: z.string().max(16_000).optional(),
})

function sanitize(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(sanitize)

  const obj = value as Record<string, unknown>
  const out: Record<string, unknown> = {}
  const sensitiveKeys = ['password', 'token', 'apikey', 'secret', 'authorization', 'cookie']

  for (const [key, raw] of Object.entries(obj)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      out[key] = '[REDACTED]'
      continue
    }
    out[key] = sanitize(raw)
  }

  return out
}

export async function POST(request: Request) {
  // This endpoint is intended for local/dev-only remote log capture.
  // In production, rely on Sentry and server-side logging, not a public error ingest.
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false }, { status: 404 })
  }

  const ip = getClientIp(request)
  try {
    await limiter.check(ip, 30)
  } catch {
    return NextResponse.json(
      { success: false, error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const contentLength = request.headers.get('content-length')
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, error: 'Payload too large' },
      { status: 413 }
    )
  }

  try {
    const raw = await request.text()
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Payload too large' },
        { status: 413 }
      )
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    const body = ClientErrorSchema.safeParse(parsed)
    if (!body.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload' },
        { status: 400 }
      )
    }

    const { message, context, stack } = body.data

    // Print to server terminal with distinct formatting
    console.error('\n\x1b[31m[CLIENT ERROR REPORT]\x1b[0m')
    console.error('Message:', message)
    if (context) console.error('Context:', JSON.stringify(sanitize(context), null, 2).slice(0, 12_000))
    if (stack) console.error('Stack:', stack.slice(0, 16_000))
    console.error('\x1b[31m[END REPORT]\x1b[0m\n')

    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
