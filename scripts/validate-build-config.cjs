#!/usr/bin/env node
/**
 * Build Configuration Validator
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Prevents common deployment issues by validating build configuration:
 * 1. Ensures static export is NOT enabled if API routes exist
 * 2. Validates required environment variables for production
 *
 * Run: node scripts/validate-build-config.js
 * Called automatically during: npm run build
 */

const fs = require('fs')
const path = require('path')

const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'

let hasErrors = false
let hasWarnings = false

function error(message) {
  console.error(`${RED}ERROR:${RESET} ${message}`)
  hasErrors = true
}

function warn(message) {
  console.warn(`${YELLOW}WARNING:${RESET} ${message}`)
  hasWarnings = true
}

function success(message) {
  console.log(`${GREEN}OK:${RESET} ${message}`)
}

// Check 1: Ensure static export is not enabled if API routes exist
function checkStaticExportWithApiRoutes() {
  console.log('\n--- Checking Static Export Configuration ---')

  // Read next.config.js
  const configPath = path.join(process.cwd(), 'next.config.js')
  if (!fs.existsSync(configPath)) {
    warn('next.config.js not found')
    return
  }

  const configContent = fs.readFileSync(configPath, 'utf-8')

  // Check if output: 'export' is enabled (not commented out)
  const exportMatch = configContent.match(/^\s*output\s*:\s*['"]export['"]/m)
  const commentedExportMatch = configContent.match(/\/\/.*output.*export/i)

  const isStaticExportEnabled = exportMatch && !commentedExportMatch

  // Check if API routes exist
  const apiDir = path.join(process.cwd(), 'app', 'api')
  const hasApiRoutes = fs.existsSync(apiDir) && fs.readdirSync(apiDir).length > 0

  if (isStaticExportEnabled && hasApiRoutes) {
    error(`Static export (output: 'export') is enabled but API routes exist in app/api/`)
    error('API routes do not work with static export - they will return 405 Method Not Allowed')
    error('Solution: Remove "output: \'export\'" from next.config.js')
  } else if (isStaticExportEnabled) {
    warn('Static export is enabled. API routes will not be available.')
  } else {
    success('Static export is disabled - API routes will work correctly')
  }
}

// Check 2: Validate environment variables for production
function checkEnvironmentVariables() {
  console.log('\n--- Checking Environment Variables ---')

  const isProduction = process.env.NODE_ENV === 'production'
  const isVercel = process.env.VERCEL === '1'

  // Required for API routes to function
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    if (isProduction) {
      warn('SUPABASE_URL is not configured - database operations will be skipped')
    } else {
      success('SUPABASE_URL not set (OK for local development)')
    }
  } else {
    success('SUPABASE_URL is configured')
  }

  if (!supabaseServiceKey || supabaseServiceKey.includes('placeholder')) {
    if (isProduction && isVercel) {
      warn('SUPABASE_SERVICE_ROLE_KEY is not configured on Vercel')
      warn('Add it in Vercel Dashboard > Project Settings > Environment Variables')
    } else if (isProduction) {
      warn('SUPABASE_SERVICE_ROLE_KEY is not configured for production')
    } else {
      success('SUPABASE_SERVICE_ROLE_KEY not set (OK for local development)')
    }
  } else {
    success('SUPABASE_SERVICE_ROLE_KEY is configured')
  }

  if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
    if (isProduction) {
      warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured - client-side DB disabled')
    } else {
      success('NEXT_PUBLIC_SUPABASE_ANON_KEY not set (OK for local development)')
    }
  } else {
    success('NEXT_PUBLIC_SUPABASE_ANON_KEY is configured')
  }
}

// Check 3: Verify Vercel project configuration
function checkVercelConfig() {
  console.log('\n--- Checking Vercel Configuration ---')

  const vercelConfigPath = path.join(process.cwd(), 'vercel.json')
  if (!fs.existsSync(vercelConfigPath)) {
    success('No vercel.json found (using defaults)')
    return
  }

  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'))

    // Check for any conflicting settings
    if (vercelConfig.builds) {
      warn('vercel.json has custom "builds" configuration - may override Next.js defaults')
    }

    if (vercelConfig.rewrites || vercelConfig.redirects) {
      success('Custom rewrites/redirects configured')
    }

    if (vercelConfig.functions) {
      success('Custom function configuration found')
    }

    success('vercel.json is valid')
  } catch (e) {
    error(`Invalid vercel.json: ${e.message}`)
  }
}

// Run all checks
console.log('='.repeat(50))
console.log('Build Configuration Validator')
console.log('='.repeat(50))

checkStaticExportWithApiRoutes()
checkEnvironmentVariables()
checkVercelConfig()

console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log(`${RED}BUILD BLOCKED:${RESET} Fix errors above before deploying`)
  process.exit(1)
} else if (hasWarnings) {
  console.log(`${YELLOW}BUILD CONTINUES:${RESET} Review warnings above`)
  process.exit(0)
} else {
  console.log(`${GREEN}ALL CHECKS PASSED${RESET}`)
  process.exit(0)
}
