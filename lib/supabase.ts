/**
 * Supabase Client Configuration
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Provides singleton Supabase client for database operations
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from './env'

let _supabaseInstance: SupabaseClient | null = null

/**
 * Lazy-initialized Supabase client singleton
 * Allows environment variables to be loaded before client creation
 */
function getSupabaseClient(): SupabaseClient {
  if (_supabaseInstance) {
    return _supabaseInstance
  }

  const config = getSupabaseConfig()

  if (!config.isConfigured) {
    console.warn('[Supabase] Missing environment variables. Check .env.local configuration.')
    console.warn('[Supabase] Expected: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.warn('[Supabase] Current config:', { url: !!config.url, anonKey: !!config.anonKey })

    // Return mock client that prevents crashes and supports chaining
    const createMockChain = (): any => new Proxy({}, {
      get: (target, prop) => {
        console.warn(`[Supabase Mock] Attempted to call: ${String(prop)}`)
        if (prop === 'then' || prop === 'catch') {
          // Don't chain for Promise-like behavior
          return undefined
        }
        return (...args: any[]) => {
          // Return another chainable mock for method chaining
          const result = createMockChain()
          // Also make it awaitable with error
          result.then = (resolve: any) => {
            resolve({ 
              data: null, 
              error: { message: 'Supabase not configured. Check environment variables.' } 
            })
            return Promise.resolve()
          }
          return result
        }
      }
    })
    
    const mockClient = createMockChain()

    _supabaseInstance = mockClient as unknown as SupabaseClient
    return _supabaseInstance
  }

  _supabaseInstance = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false // We handle our own session management
    }
  })

  return _supabaseInstance
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
