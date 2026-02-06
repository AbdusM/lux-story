/**
 * Storage Health Check API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Verifies localStorage accessibility
 * Note: This is a server-side check for client-side storage availability
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const checks = {
      config: true,
      // This endpoint runs server-side (Node.js). Browser storage is inherently client-only.
      localStorage: 'client-only',
      sessionStorage: 'client-only',
    };

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks,
        note: 'Browser storage is client-only. This endpoint reports server availability and documents client-only checks.',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
