/**
 * Test Supabase Connection
 * Validates that Supabase client is properly configured
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local explicitly for standalone script execution
config({ path: resolve(process.cwd(), '.env.local') })

async function testConnection() {
  console.log('[Supabase Test] Testing connection...')

  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables')
    console.error('   SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
    console.error('   SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗')
    process.exit(1)
  }

  console.log('✅ Environment variables loaded')
  console.log('   URL:', supabaseUrl)
  console.log('   Key:', supabaseKey.substring(0, 20) + '...')

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey)
  console.log('✅ Supabase client initialized')

  // Test 2: Query existing tables
  try {
    const { data, error } = await supabase
      .from('player_profiles')
      .select('count')
      .limit(0)

    if (error) {
      console.log('⚠️  Table query error (expected if migration not run yet):', error.message)
      console.log('\n📋 Next step: Run the migration in Supabase SQL Editor')
      console.log('   File: supabase/migrations/001_setup.sql')
    } else {
      console.log('✅ Successfully queried player_profiles table')
      console.log('   Data:', data)
    }
  } catch (err: any) {
    console.error('❌ Connection error:', err.message)
    process.exit(1)
  }

  console.log('\n✅ Supabase connection test complete')
}

testConnection()
