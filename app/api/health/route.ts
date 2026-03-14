/**
 * Health Check API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Returns overall application health status
 * Used for monitoring, load balancers, and uptime checks
 */

import { NextResponse } from 'next/server';

import { resolveBuildMetadata } from '@/lib/build-metadata';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const build = resolveBuildMetadata()
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? Math.floor(process.uptime()) : 0,
      environment: process.env.NODE_ENV || 'unknown',
      version: build.version,
      build: {
        version: build.version,
        commitSha: build.commitSha,
        commitShaShort: build.commitShaShort,
      },
      checks: {
        server: true,
        // Other checks are handled by specific endpoints
      }
    };

    return NextResponse.json(health, { status: 200 });
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
