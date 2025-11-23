/**
 * Supabase Client Configuration
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Provides singleton Supabase client for database operations
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from './env'

let _supabaseInstance: SupabaseClient | null = null
let _networkFailureDetected = false

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
  const createMockChain = (reason: string = 'not configured'): any => new Proxy({}, {
    get: (target, prop) => {
      if (prop === 'then' || prop === 'catch') {
        // Don't chain for Promise-like behavior
        return undefined
      }
      return (..._args: any[]) => {
        // Return another chainable mock for method chaining
        const result = createMockChain(reason)
        // Also make it awaitable with error
        result.then = (resolve: any) => {
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
  })
  
  // If network failure was detected, use mock client
  if (_networkFailureDetected) {
    const mockClient = createMockChain('network unreachable')
    _supabaseInstance = mockClient as unknown as SupabaseClient
    return _supabaseInstance
  }

  if (!config.isConfigured) {
    console.warn('[Supabase] Missing environment variables. Check .env.local configuration.')
    console.warn('[Supabase] Expected: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.warn('[Supabase] Current config:', { url: !!config.url, anonKey: !!config.anonKey })

    const mockClient = createMockChain('not configured')
    _supabaseInstance = mockClient as unknown as SupabaseClient
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
      const value = (target as any)[prop]
      
      if (typeof value === 'function') {
        return function(...args: any[]) {
          const result = value.apply(target, args)
          
          // If it's a promise-like (query builder result), wrap it
          if (result && typeof result.then === 'function') {
            return result.catch((error: any) => {
              // Detect network errors
              const isNetworkError = 
                error?.message?.includes('Failed to fetch') ||
                error?.message?.includes('ERR_NAME_NOT_RESOLVED') ||
                error?.name === 'TypeError' ||
                (!error?.code && !error?.message) ||
                error?.toString().includes('fetch')
              
              if (isNetworkError && !_networkFailureDetected) {
                _networkFailureDetected = true
                console.warn('[Supabase] Network error detected. Switching to local-only mode.')
                // Reset instance to force mock client creation on next access
                _supabaseInstance = null
              }
              
              // Return error response compatible with Supabase format
              return Promise.resolve({
                data: null,
                error: {
                  message: isNetworkError ? 'Network unreachable. Running in local-only mode.' : error.message,
                  code: isNetworkError ? 'NETWORK_ERROR' : error.code
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
    const value = (client as any)[prop]
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
