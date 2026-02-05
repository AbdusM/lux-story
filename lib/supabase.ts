/**
 * Supabase Client Configuration
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Provides singleton Supabase client for database operations
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from './env'

/**
 * Mock response type for offline/unconfigured mode
 * Returns null data with descriptive error
 */
interface MockErrorResponse {
  data: null
  error: { message: string; code: string }
}

/**
 * Mock client that mimics SupabaseClient's chainable API
 * Used when Supabase is not configured or network is unreachable
 * Uses a Proxy to dynamically return chainable methods that resolve to errors
 */

let _supabaseInstance: SupabaseClient | null = null
let _networkFailureDetected = false
let _configWarningLogged = false

/**
 * Lazy-initialized Supabase client singleton
 * Allows environment variables to be loaded before client creation
 */
function getSupabaseClient(): SupabaseClient {
  if (_supabaseInstance) {
    return _supabaseInstance
  }

  const config = getSupabaseConfig()

  // Return mock client that prevents crashes and supports chaining
  // Uses Proxy to create a deeply chainable mock that returns error responses
  const createMockChain = (reason: string = 'not configured'): SupabaseClient => {
    type ChainableResult = {
      then?: (resolve: (value: MockErrorResponse) => void) => Promise<void>
      [key: string]: unknown
    }

    const handler: ProxyHandler<ChainableResult> = {
      get: (_target, prop) => {
        if (prop === 'then' || prop === 'catch') {
          // Don't chain for Promise-like behavior - return undefined
          return undefined
        }
        return (..._args: unknown[]) => {
          // Return another chainable mock for method chaining
          const result = new Proxy({} as ChainableResult, handler)
          // Also make it awaitable with error
          result.then = (resolve) => {
            resolve({
              data: null,
              error: {
                message: `Supabase ${reason}. Running in local-only mode.`,
                code: 'NETWORK_ERROR'
              }
            })
            return Promise.resolve()
          }
          return result
        }
      }
    }
    // Cast to SupabaseClient at the boundary - the Proxy handles all method calls
    return new Proxy({} as ChainableResult, handler) as unknown as SupabaseClient
  }

  // If network failure was detected, use mock client
  if (_networkFailureDetected) {
    _supabaseInstance = createMockChain('network unreachable')
    return _supabaseInstance
  }

  if (!config.isConfigured) {
    // Only log warning once to prevent console spam
    if (!_configWarningLogged) {
      _configWarningLogged = true
      console.warn('[Supabase] Missing environment variables. Running in local-only mode.')
    }

    _supabaseInstance = createMockChain('not configured')
    return _supabaseInstance
  }

  _supabaseInstance = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false // We handle our own session management
    }
  })

  // Wrap the client to detect network errors
  _supabaseInstance = wrapWithNetworkErrorDetection(_supabaseInstance)
  return _supabaseInstance
}

/**
 * Wrap Supabase client to detect network errors and switch to mock mode
 */
function wrapWithNetworkErrorDetection(client: SupabaseClient): SupabaseClient {
  return new Proxy(client, {
    get(target, prop) {
      const value = (target as unknown as Record<string, unknown>)[prop as string]
      
      if (typeof value === 'function') {
        return function(...args: unknown[]) {
          const result = value.apply(target, args)
          
          // If it's a promise-like (query builder result), wrap it
          if (result && typeof result.then === 'function') {
            return result.catch((error: unknown) => {
              // Detect network errors
              const errorObj = error instanceof Error ? error : { message: String(error), name: 'UnknownError' }
              const isNetworkError = 
                errorObj.message?.includes('Failed to fetch') ||
                errorObj.message?.includes('ERR_NAME_NOT_RESOLVED') ||
                errorObj.name === 'TypeError' ||
                (typeof error === 'object' && error !== null && !('code' in error) && !('message' in error)) ||
                String(error).includes('fetch')
              
              if (isNetworkError && !_networkFailureDetected) {
                _networkFailureDetected = true
                console.warn('[Supabase] Network error detected. Switching to local-only mode.')
                // Reset instance to force mock client creation on next access
                _supabaseInstance = null
              }
              
              // Return error response compatible with Supabase format
              const errorCode = (error && typeof error === 'object' && 'code' in error) ? String(error.code) : 'UNKNOWN_ERROR'
              return Promise.resolve({
                data: null,
                error: {
                  message: isNetworkError ? 'Network unreachable. Running in local-only mode.' : errorObj.message || 'Unknown error',
                  code: isNetworkError ? 'NETWORK_ERROR' : errorCode
                }
              })
            })
          }
          
          return result
        }
      }
      
      return value
    }
  })
}

/**
 * Supabase client singleton
 * Use this for all database operations
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = (client as unknown as Record<string, unknown>)[prop as string]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

/**
 * Check if Supabase is properly configured
 * Useful for showing UI warnings in development/preview
 */
export const isSupabaseConfigured = () => {
  const config = getSupabaseConfig()
  return config.isConfigured
}

/**
 * Database Schema Types
 * Auto-generated types will go here once schema is created
 */
export interface PlayerProfile {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  current_scene: string
  total_demonstrations: number
  last_activity: string
}

export interface SkillDemonstration {
  id: string
  user_id: string
  skill_name: string
  scene_id: string
  choice_text: string
  context: string
  demonstrated_at: string
}

export interface CareerExploration {
  id: string
  user_id: string
  career_name: string
  match_score: number
  explored_at: string
  readiness_level: string
}

export interface RelationshipProgress {
  id: string
  user_id: string
  character_name: string
  trust_level: number
  last_interaction: string
  key_moments: string[] // JSON array
}
