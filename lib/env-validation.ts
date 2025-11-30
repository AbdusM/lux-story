/**
 * Environment Variable Validation
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Validates all required environment variables on application startup
 * Throws clear errors if configuration is missing
 */

import {
  formatPlaceholderMessage,
  isPlaceholderSupabaseAnonKey,
  isPlaceholderSupabaseServiceKey,
  isPlaceholderSupabaseUrl
} from './env-placeholders'
import { logger } from './logger'

export interface EnvConfig {
  // Next.js
  nodeEnv: string

  // Supabase (Server-side)
  supabaseUrl?: string
  supabaseAnonKey?: string
  supabaseServiceRoleKey?: string

  // Supabase (Client-side)
  publicSupabaseUrl?: string
  publicSupabaseAnonKey?: string

  // API Keys
  anthropicApiKey?: string
  geminiApiKey?: string

  // Admin
  adminApiToken?: string

  // Monitoring
  sentryDsn?: string
  publicSentryDsn?: string

  // Feature Flags
  enableSemanticSimilarity: boolean
  choiceSimilarityThreshold: number
}

/**
 * Required environment variables by context
 */
const REQUIRED_ENV_VARS = {
  server: [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'ANTHROPIC_API_KEY',
    'GEMINI_API_KEY',
    'ADMIN_API_TOKEN',
  ],
  client: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  production: [
    'SENTRY_DSN',
    'NEXT_PUBLIC_SENTRY_DSN',
  ],
}

/**
 * Optional environment variables with defaults
 */
const OPTIONAL_ENV_VARS = {
  CHOICE_SIMILARITY_THRESHOLD: '0.85',
  ENABLE_SEMANTIC_SIMILARITY: 'false',
}

/**
 * Validate environment variable is present
 */
function validateRequired(name: string, value: string | undefined, context: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Context: ${context}\n` +
      `Please set this variable in your .env.local file or deployment environment.`
    )
  }
  return value
}

function ensureNotPlaceholder(name: string, value: string): void {
  let isPlaceholder = false

  switch (name) {
    case 'SUPABASE_URL':
    case 'NEXT_PUBLIC_SUPABASE_URL':
      isPlaceholder = isPlaceholderSupabaseUrl(value)
      break
    case 'SUPABASE_ANON_KEY':
    case 'NEXT_PUBLIC_SUPABASE_ANON_KEY':
      isPlaceholder = isPlaceholderSupabaseAnonKey(value)
      break
    case 'SUPABASE_SERVICE_ROLE_KEY':
      isPlaceholder = isPlaceholderSupabaseServiceKey(value)
      break
    default:
      isPlaceholder = false
  }

  if (isPlaceholder) {
    throw new Error(formatPlaceholderMessage(name))
  }
}

/**
 * Validate environment configuration
 */
export function validateEnv(context: 'server' | 'client' = 'server'): EnvConfig {
  const errors: string[] = []

  // Determine which variables are required
  const requiredVars = context === 'server'
    ? [...REQUIRED_ENV_VARS.server, ...REQUIRED_ENV_VARS.client]
    : REQUIRED_ENV_VARS.client

  // Add production requirements
  if (process.env.NODE_ENV === 'production') {
    requiredVars.push(...REQUIRED_ENV_VARS.production)
  }

  // Validate each required variable
  const config: Partial<EnvConfig> = {
    nodeEnv: process.env.NODE_ENV || 'development',
  }

  // Server-side variables
  if (context === 'server') {
    try {
      const supabaseUrl = validateRequired(
        'SUPABASE_URL',
        process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
        'Server-side Supabase configuration'
      )
      ensureNotPlaceholder('SUPABASE_URL', supabaseUrl)
      config.supabaseUrl = supabaseUrl
    } catch (e) {
      errors.push((e as Error).message)
    }

    try {
      const supabaseAnonKey = validateRequired(
        'SUPABASE_ANON_KEY',
        process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Server-side Supabase configuration'
      )
      ensureNotPlaceholder('SUPABASE_ANON_KEY', supabaseAnonKey)
      config.supabaseAnonKey = supabaseAnonKey
    } catch (e) {
      errors.push((e as Error).message)
    }

    try {
      config.anthropicApiKey = validateRequired(
        'ANTHROPIC_API_KEY',
        process.env.ANTHROPIC_API_KEY,
        'Live choice generation (Claude API)'
      )
    } catch (e) {
      errors.push((e as Error).message)
    }

    try {
      config.geminiApiKey = validateRequired(
        'GEMINI_API_KEY',
        process.env.GEMINI_API_KEY,
        'Skill-aware dialogue (Gemini API)'
      )
    } catch (e) {
      errors.push((e as Error).message)
    }

    try {
      config.adminApiToken = validateRequired(
        'ADMIN_API_TOKEN',
        process.env.ADMIN_API_TOKEN,
        'Admin dashboard authentication'
      )
    } catch (e) {
      errors.push((e as Error).message)
    }

    // Service role key (optional in development)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceRoleKey) {
      if (isPlaceholderSupabaseServiceKey(serviceRoleKey)) {
        errors.push(formatPlaceholderMessage('SUPABASE_SERVICE_ROLE_KEY'))
      } else {
        config.supabaseServiceRoleKey = serviceRoleKey
      }
    }

    if (process.env.NODE_ENV === 'production' && !config.supabaseServiceRoleKey) {
      errors.push('Missing SUPABASE_SERVICE_ROLE_KEY (required in production for migrations)')
    }
  }

  // Client-side variables
  try {
    const publicSupabaseUrl = validateRequired(
      'NEXT_PUBLIC_SUPABASE_URL',
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      'Client-side Supabase configuration'
    )
    ensureNotPlaceholder('NEXT_PUBLIC_SUPABASE_URL', publicSupabaseUrl)
    config.publicSupabaseUrl = publicSupabaseUrl
  } catch (e) {
    errors.push((e as Error).message)
  }

  try {
    const publicSupabaseAnonKey = validateRequired(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'Client-side Supabase configuration'
    )
    ensureNotPlaceholder('NEXT_PUBLIC_SUPABASE_ANON_KEY', publicSupabaseAnonKey)
    config.publicSupabaseAnonKey = publicSupabaseAnonKey
  } catch (e) {
    errors.push((e as Error).message)
  }

  // Production monitoring
  if (process.env.NODE_ENV === 'production') {
    config.sentryDsn = process.env.SENTRY_DSN
    config.publicSentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN

    if (!config.sentryDsn) {
      errors.push('Missing SENTRY_DSN (recommended for production error tracking)')
    }
    if (!config.publicSentryDsn) {
      errors.push('Missing NEXT_PUBLIC_SENTRY_DSN (recommended for production error tracking)')
    }
  }

  // Optional variables with defaults
  config.enableSemanticSimilarity =
    (process.env.ENABLE_SEMANTIC_SIMILARITY || OPTIONAL_ENV_VARS.ENABLE_SEMANTIC_SIMILARITY) === 'true'

  config.choiceSimilarityThreshold = parseFloat(
    process.env.CHOICE_SIMILARITY_THRESHOLD || OPTIONAL_ENV_VARS.CHOICE_SIMILARITY_THRESHOLD
  )

  // Throw all errors at once
  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n\n${errors.join('\n\n')}\n\n` +
      `See .env.example for all required variables.`
    )
  }

  return config as EnvConfig
}

/**
 * Get validated environment config
 * Memoized to avoid repeated validation
 */
let cachedConfig: EnvConfig | null = null

export function getEnvConfig(context: 'server' | 'client' = 'server'): EnvConfig {
  if (!cachedConfig) {
    cachedConfig = validateEnv(context)
  }
  return cachedConfig
}

/**
 * Check if all required environment variables are set
 * Returns boolean instead of throwing
 */
export function isEnvConfigured(context: 'server' | 'client' = 'server'): boolean {
  try {
    validateEnv(context)
    return true
  } catch {
    return false
  }
}

/**
 * Print environment configuration status
 * Useful for debugging and deployment verification
 */
export function printEnvStatus(): void {
  const checks = [
    { name: 'Supabase URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL },
    { name: 'Supabase Anon Key', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { name: 'Anthropic API Key', value: process.env.ANTHROPIC_API_KEY },
    { name: 'Gemini API Key', value: process.env.GEMINI_API_KEY },
    { name: 'Admin API Token', value: process.env.ADMIN_API_TOKEN },
    { name: 'Supabase Service Role', value: process.env.SUPABASE_SERVICE_ROLE_KEY },
    { name: 'Sentry DSN', value: process.env.SENTRY_DSN },
  ]

  const statusMap: Record<string, boolean> = {}
  checks.forEach(({ name, value }) => {
    statusMap[name] = !!value
  })

  logger.debug('Environment Configuration Status', {
    operation: 'env-validation.status',
    nodeEnv: process.env.NODE_ENV || 'development',
    checks: statusMap
  })
}
