/**
 * Database Health Check API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Verifies Supabase database connection and basic operations
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET() {
  const startTime = Date.now();

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Missing Supabase configuration',
          checks: {
            config: false,
            connection: false,
            query: false,
          },
        },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Basic connection
    const { error: connectionError } = await supabase
      .from('player_profiles')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Database connection failed',
          details: connectionError.message,
          checks: {
            config: true,
            connection: false,
            query: false,
          },
        },
        { status: 503 }
      );
    }

    // Test 2: Simple query
    const { data, error: queryError } = await supabase
      .from('player_profiles')
      .select('user_id')
      .limit(1);

    if (queryError) {
      return NextResponse.json(
        {
          status: 'degraded',
          timestamp: new Date().toISOString(),
          error: 'Query failed',
          details: queryError.message,
          checks: {
            config: true,
            connection: true,
            query: false,
          },
        },
        { status: 503 }
      );
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        checks: {
          config: true,
          connection: true,
          query: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        error: error instanceof Error ? error.message : 'Unknown error',
        checks: {
          config: false,
          connection: false,
          query: false,
        },
      },
      { status: 503 }
    );
  }
}
