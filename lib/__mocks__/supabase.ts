/**
 * Mock Supabase Client
 * Grand Central Terminus - Testing Infrastructure
 *
 * Provides a complete mock of Supabase client for testing
 * Implements all common methods used across the codebase
 */

import { vi } from 'vitest'

// Mock data storage
const mockData = new Map<string, unknown[]>()
const mockErrors = new Map<string, Error>()

// Helper to reset mocks between tests
export function resetSupabaseMock() {
  mockData.clear()
  mockErrors.clear()
}

// Helper to set mock data for a table
export function setMockData(table: string, data: unknown[]) {
  mockData.set(table, data)
}

// Helper to set mock error for a table
export function setMockError(table: string, error: Error) {
  mockErrors.set(table, error)
}

// Mock query builder
class MockQueryBuilder {
  private tableName: string
  private selectFields: string = '*'
  private filters: Array<{ column: string; value: unknown }> = []
  private orderByField?: string
  private orderByAscending: boolean = true
  private isSingle: boolean = false

  constructor(tableName: string) {
    this.tableName = tableName
  }

  select(fields: string = '*') {
    this.selectFields = fields
    return this
  }

  insert(data: unknown) {
    const tableData = mockData.get(this.tableName) || []
    const newData = Array.isArray(data) ? data : [data]
    mockData.set(this.tableName, [...tableData, ...newData])
    return this
  }

  upsert(_data: unknown, _options?: { onConflict?: string; ignoreDuplicates?: boolean }) {
    // For testing, we'll just insert
    // In real tests, you can customize this behavior
    return this.insert(_data)
  }

  eq(column: string, value: unknown) {
    this.filters.push({ column, value })
    return this
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderByField = field
    this.orderByAscending = options?.ascending ?? true
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  async then(resolve: (value: { data: unknown; error: unknown }) => void) {
    // Check for mock error
    const error = mockErrors.get(this.tableName)
    if (error) {
      return resolve({ data: null, error })
    }

    // Get data
    let data = mockData.get(this.tableName) || []

    // Apply filters
    for (const filter of this.filters) {
      data = data.filter((item: any) => item[filter.column] === filter.value)
    }

    // Apply ordering
    if (this.orderByField) {
      data = [...data].sort((a: any, b: any) => {
        const aVal = a[this.orderByField!]
        const bVal = b[this.orderByField!]
        if (aVal < bVal) return this.orderByAscending ? -1 : 1
        if (aVal > bVal) return this.orderByAscending ? 1 : -1
        return 0
      })
    }

    // Return single or array
    if (this.isSingle) {
      if (data.length === 0) {
        return resolve({
          data: null,
          error: { code: 'PGRST116', message: 'No rows returned' }
        })
      }
      return resolve({ data: data[0], error: null })
    }

    return resolve({ data, error: null })
  }
}

// Mock Supabase client
export const supabase = {
  from: (tableName: string) => new MockQueryBuilder(tableName),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signIn: vi.fn().mockResolvedValue({ data: null, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null })
  }
}

// Mock types
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
  key_moments: string[]
}
