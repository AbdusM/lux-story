/**
 * Environment Variable Validation Script
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Run this script to verify all required environment variables are set
 * Usage: npm run validate-env
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { printEnvStatus, validateEnv, isEnvConfigured } from '../lib/env-validation'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

console.log('═'.repeat(60))
console.log('🔍 ENVIRONMENT VARIABLE VALIDATION')
console.log('═'.repeat(60))
console.log('')

try {
  // Print current status
  printEnvStatus()
  console.log('')

  // Validate server-side configuration
  console.log('Validating server-side configuration...')
  const serverConfig = validateEnv('server')
  console.log('✅ Server-side configuration is valid!')
  console.log('')

  // Validate client-side configuration
  console.log('Validating client-side configuration...')
  const clientConfig = validateEnv('client')
  console.log('✅ Client-side configuration is valid!')
  console.log('')

  console.log('═'.repeat(60))
  console.log('✅ ALL ENVIRONMENT VARIABLES ARE VALID')
  console.log('═'.repeat(60))
  console.log('')

  // Provide deployment readiness summary
  const productionReady =
    serverConfig.sentryDsn &&
    serverConfig.publicSentryDsn &&
    serverConfig.supabaseServiceRoleKey

  if (process.env.NODE_ENV === 'production' || productionReady) {
    console.log('📦 Production Readiness:')
    console.log(`   ${serverConfig.sentryDsn ? '✅' : '⚠️ '} Sentry DSN configured`)
    console.log(`   ${serverConfig.publicSentryDsn ? '✅' : '⚠️ '} Public Sentry DSN configured`)
    console.log(`   ${serverConfig.supabaseServiceRoleKey ? '✅' : '⚠️ '} Service role key set`)
    console.log('')
  }

  console.log('Next steps:')
  console.log('  1. Ensure .env.local is added to .gitignore (NEVER commit it!)')
  console.log('  2. Set production environment variables in your hosting platform')
  console.log('  3. Review docs/DEPLOYMENT_CHECKLIST.md before deploying')
  console.log('')

  process.exit(0)

} catch (error) {
  console.error('')
  console.error('═'.repeat(60))
  console.error('❌ ENVIRONMENT VALIDATION FAILED')
  console.error('═'.repeat(60))
  console.error('')
  console.error(error instanceof Error ? error.message : String(error))
  console.error('')
  console.error('Please check .env.example for required variables and ensure')
  console.error('your .env.local file has all necessary configuration.')
  console.error('')
  process.exit(1)
}
