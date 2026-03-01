import { NextResponse } from 'next/server'

export type ReadJsonBodyResult<T> =
  | { ok: true; body: T }
  | { ok: false; response: NextResponse }

export async function readJsonBody<T = unknown>(
  request: Request,
  options: { maxBytes: number }
): Promise<ReadJsonBodyResult<T>> {
  const { maxBytes } = options

  const contentLength = request.headers.get('content-length')
  if (contentLength && Number(contentLength) > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Payload too large' }, { status: 413 }),
    }
  }

  const raw = await request.text()
  if (Buffer.byteLength(raw, 'utf8') > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Payload too large' }, { status: 413 }),
    }
  }

  if (!raw.trim()) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Missing JSON body' }, { status: 400 }),
    }
  }

  try {
    const parsed = JSON.parse(raw) as T
    return { ok: true, body: parsed }
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }),
    }
  }
}

