/**
 * Test Environment API Route
 * Returns environment configuration status
 */

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const envCheck = {
    nodeEnv: process.env.NODE_ENV,
    nextPublicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    nextPublicSupabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
  }

  return Response.json(envCheck)
}
