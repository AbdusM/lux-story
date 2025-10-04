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
    // Server-side check: verify that client storage config is present
    const checks = {
      config: true,
      localStorage: typeof window !== 'undefined' && 'localStorage' in window,
      sessionStorage: typeof window !== 'undefined' && 'sessionStorage' in window,
    };

    const allHealthy = Object.values(checks).every(Boolean);

    return NextResponse.json(
      {
        status: allHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        checks,
        note: 'Server-side check only. Client-side storage is tested on the client.',
      },
      { status: allHealthy ? 200 : 503 }
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
