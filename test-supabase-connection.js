import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

console.log('=== Supabase Connection Test ===')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  try {
    console.log('\n=== Testing Supabase Connection ===')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('player_profiles')
      .select('user_id')
      .limit(5)
    
    if (error) {
      console.error('❌ Supabase query error:', error)
      return
    }
    
    console.log('✅ Supabase connection successful')
    console.log('📊 Found', data.length, 'users in player_profiles table')
    console.log('👥 User IDs:', data.map(p => p.user_id))
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
  }
}

testConnection()
