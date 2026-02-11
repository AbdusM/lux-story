/**
 * Supabase Client for Browser
 * Uses @supabase/ssr for Next.js App Router compatibility
 */

import { createBrowserClient } from '@supabase/ssr'

type BrowserSupabaseClient = ReturnType<typeof createBrowserClient>

function isBrowserSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return false
  if (url.includes('placeholder')) return false
  if (key.includes('placeholder')) return false
  return true
}

function createDisabledClient(): BrowserSupabaseClient {
  const err = new Error('Supabase not configured')

  const auth = {
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: (_cb: (event: string, session: unknown) => void) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signOut: async () => ({ data: null, error: err }),
    signInWithOAuth: async (_args: unknown) => ({ data: null, error: err }),
    signInWithPassword: async (_args: unknown) => ({ data: null, error: err }),
    signUp: async (_args: unknown) => ({ data: null, error: err }),
    resend: async (_args: unknown) => ({ data: null, error: err }),
    updateUser: async (_args: unknown) => ({ data: null, error: err }),
  }

  const makeBuilder = (): unknown => {
    const handler: ProxyHandler<Record<string, unknown>> = {
      get(_t, prop: string | symbol) {
        // Make the builder awaitable (Supabase builders are thenable).
        if (prop === 'then') {
          return (onFulfilled: unknown, onRejected: unknown) =>
            Promise.resolve({ data: null, error: err }).then(onFulfilled as never, onRejected as never)
        }
        if (prop === 'catch') {
          return (onRejected: unknown) => Promise.resolve({ data: null, error: err }).catch(onRejected as never)
        }
        if (prop === 'finally') {
          return (onFinally: unknown) => Promise.resolve({ data: null, error: err }).finally(onFinally as never)
        }

        if (prop === 'single' || prop === 'maybeSingle') {
          return async (): Promise<{ data: null; error: Error }> => ({ data: null, error: err })
        }

        // Any query modifier just returns the same builder for chaining.
        return (..._args: readonly unknown[]) => proxy
      },
    }
    const proxy = new Proxy({} as Record<string, unknown>, handler)
    return proxy
  }

  const disabled = {
    auth,
    from: (_table: string) => makeBuilder(),
  }

  // Keep the exported `createClient()` type stable so call sites don't see a union
  // when Supabase isn't configured.
  return disabled as unknown as BrowserSupabaseClient
}

export function createClient(): BrowserSupabaseClient {
  if (!isBrowserSupabaseConfigured()) return createDisabledClient()

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
