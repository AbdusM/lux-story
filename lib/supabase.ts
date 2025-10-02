/**
 * Supabase Client Configuration
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Provides singleton Supabase client for database operations
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabaseInstance: SupabaseClient | null = null

/**
 * Lazy-initialized Supabase client singleton
 * Allows environment variables to be loaded before client creation
 */
function getSupabaseClient(): SupabaseClient {
  if (_supabaseInstance) {
    return _supabaseInstance
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Missing environment variables. Using mock client for development.')

    // Return mock client that prevents crashes
    const mockClient = new Proxy({} as any, {
      get: (target, prop) => {
        console.warn(`[Supabase Mock] Attempted to call: ${String(prop)}`)
        return () => {
          return {
            data: null,
            error: { message: 'Supabase not configured. Check environment variables.' },
            status: 503
          }
        }
      }
    })

    _supabaseInstance = mockClient as unknown as SupabaseClient
    return _supabaseInstance
  }

  _supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
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
