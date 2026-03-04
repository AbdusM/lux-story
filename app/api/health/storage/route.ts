/**
 * Storage Health Check API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Server-side health signal for storage subsystem.
 * Client storage capability must be verified in browser runtime.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const checks = {
      runtime: runtime === 'nodejs',
      config: true,
      clientStorage: 'deferred-to-client',
    };

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks,
        note: 'Server route is healthy. Browser storage is validated client-side.',
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
