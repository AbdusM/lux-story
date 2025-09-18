import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filePath = searchParams.get('path')

    if (!filePath) {
      return NextResponse.json({ error: 'Path parameter required' }, { status: 400 })
    }

    const fullPath = path.join(process.cwd(), 'public', filePath)

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const mimeType = filePath.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to serve file: ${error.message}` }, { status: 500 })
  }
}