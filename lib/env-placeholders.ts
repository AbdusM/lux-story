/**
 * Environment placeholder detection helpers
 * Ensures we never treat documentation sample values as real credentials
 */

const SUPABASE_URL_PLACEHOLDER_PATTERNS = [
  /your[-_]?project[-_]?ref/i,
  /your[-_]?project/i,
  /your[-_]?supabase[-_]?project/i,
  /your[-_]?supabase[-_]?url/i,
  /your[-_]?supabase[-_]?instance/i,
  /your[-_]?supabase[-_]?ref/i,
  /your[-_]?project\.?supabase\.co/i,
  /your_supabase_project_url/i,
  /YOUR_SUPABASE_URL/i,
  /YOUR_PROJECT_REF/i,
  /localhost:54321/i
]

const SUPABASE_KEY_PLACEHOLDER_PATTERNS = [
  /your[-_ ]?supabase[-_ ]?anon[-_ ]?key/i,
  /your[-_ ]?anon[-_ ]?key/i,
  /your[-_ ]?service[-_ ]?role[-_ ]?key/i,
  /replace[-_ ]?with[-_ ]?anon[-_ ]?key/i,
  /replace[-_ ]?with[-_ ]?service[-_ ]?role/i,
  /public[-_ ]?anon[-_ ]?key/i,
  /SUPABASE_ANON_KEY_PLACEHOLDER/i,
  /SUPABASE_SERVICE_ROLE_KEY_PLACEHOLDER/i
]

export function isPlaceholderSupabaseUrl(value?: string | null): boolean {
  if (!value) return false
  return SUPABASE_URL_PLACEHOLDER_PATTERNS.some(pattern => pattern.test(value))
}

export function isPlaceholderSupabaseAnonKey(value?: string | null): boolean {
  if (!value) return false
  return SUPABASE_KEY_PLACEHOLDER_PATTERNS.some(pattern => pattern.test(value))
}

export function isPlaceholderSupabaseServiceKey(value?: string | null): boolean {
  if (!value) return false
  return SUPABASE_KEY_PLACEHOLDER_PATTERNS.some(pattern => pattern.test(value))
}

export function formatPlaceholderMessage(name: string): string {
  return [
    `Environment variable ${name} is still using a documentation placeholder.`,
    'Visit Supabase → Project Settings → API to copy the real value and update your .env.local file.'
  ].join('\n')
}


