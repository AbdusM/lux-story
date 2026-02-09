/**
 * Feature Flags (Typed)
 *
 * - Registry is the single source of truth for valid flags and their types.
 * - Overrides (query/localStorage/global setter) are DEV-only and ignored in production.
 * - Env vars work in any environment.
 *
 * Query param format (DEV only):
 *   ?ff_FLAG_NAME=true
 *   ?ff_FLAG_NAME=beta
 *
 * Env var format:
 *   NEXT_PUBLIC_FF_FLAG_NAME=true   (client/server)
 *   FF_FLAG_NAME=true               (server)
 */

export type FlagValue = boolean | string

type FlagDef<T extends FlagValue> = {
  default: T
  values?: readonly T[]
  description?: string
}

// Keep this list small and intentional. Add flags as needed for safe iteration.
export const FLAG_REGISTRY = {
  // Example release guard for UX iterations.
  RANKING_V2: {
    default: 'control',
    values: ['control', 'beta'] as const,
    description: 'Ranking UI iteration. control|beta',
  },

  // Useful for local debugging (must remain off by default).
  TELEMETRY_DEBUG: {
    default: false,
    description: 'Enable additional telemetry debug logging in dev.',
  },
} as const satisfies Record<string, FlagDef<FlagValue>>

export type FlagName = keyof typeof FLAG_REGISTRY
export type FlagValueFor<N extends FlagName> = (typeof FLAG_REGISTRY)[N] extends FlagDef<infer T> ? T : never

export type FlagResolution = {
  name: FlagName
  value: FlagValue
  source: 'query' | 'localStorage' | 'env' | 'default'
}

const STORAGE_PREFIX = 'ff_'

function isProd(): boolean {
  return process.env.NODE_ENV === 'production'
}

function isDevOverridesAllowed(): boolean {
  return !isProd()
}

function parseBoolean(raw: string): boolean | null {
  const v = raw.trim().toLowerCase()
  if (['1', 'true', 't', 'yes', 'y', 'on'].includes(v)) return true
  if (['0', 'false', 'f', 'no', 'n', 'off'].includes(v)) return false
  return null
}

function parseValue<N extends FlagName>(name: N, raw: string): FlagValueFor<N> | null {
  const def = FLAG_REGISTRY[name] as unknown as FlagDef<FlagValue>

  // Enum-like string union.
  if (def.values && def.values.length > 0) {
    const asString = String(raw)
    return def.values.includes(asString as never) ? (asString as FlagValueFor<N>) : null
  }

  // Boolean.
  if (typeof def.default === 'boolean') {
    const parsed = parseBoolean(raw)
    return parsed === null ? null : (parsed as FlagValueFor<N>)
  }

  // String (no allowlist).
  return String(raw) as FlagValueFor<N>
}

function getEnvOverrideString(name: FlagName): string | null {
  const envKeyPublic = `NEXT_PUBLIC_FF_${name}`
  const envKeyServer = `FF_${name}`
  return process.env[envKeyPublic] ?? process.env[envKeyServer] ?? null
}

function getQueryOverrideString(name: FlagName): string | null {
  if (!isDevOverridesAllowed()) return null
  if (typeof window === 'undefined') return null

  try {
    const params = new URLSearchParams(window.location.search)
    return params.get(`${STORAGE_PREFIX}${name}`)
  } catch {
    return null
  }
}

function getLocalStorageOverrideString(name: FlagName): string | null {
  if (!isDevOverridesAllowed()) return null
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage.getItem(`${STORAGE_PREFIX}${name}`)
  } catch {
    return null
  }
}

function resolveFlag<N extends FlagName>(name: N): FlagResolution {
  // Priority order: query (dev) -> localStorage (dev) -> env -> default
  const rawQuery = getQueryOverrideString(name)
  if (rawQuery !== null) {
    const parsed = parseValue(name, rawQuery)
    if (parsed !== null) return { name, value: parsed, source: 'query' }
  }

  const rawLocal = getLocalStorageOverrideString(name)
  if (rawLocal !== null) {
    const parsed = parseValue(name, rawLocal)
    if (parsed !== null) return { name, value: parsed, source: 'localStorage' }
  }

  const rawEnv = getEnvOverrideString(name)
  if (rawEnv !== null) {
    const parsed = parseValue(name, rawEnv)
    if (parsed !== null) return { name, value: parsed, source: 'env' }
  }

  const def = FLAG_REGISTRY[name] as unknown as FlagDef<FlagValue>
  return { name, value: def.default, source: 'default' }
}

export function getFlag<N extends FlagName>(name: N): FlagValueFor<N> {
  return resolveFlag(name).value as FlagValueFor<N>
}

export function isEnabled(name: FlagName): boolean {
  const res = resolveFlag(name)
  return res.value === true
}

export function listFlags(): Array<{
  name: FlagName
  value: FlagValue
  source: FlagResolution['source']
  default: FlagValue
  description?: string
}> {
  return (Object.keys(FLAG_REGISTRY) as FlagName[]).map((name) => {
    const def = FLAG_REGISTRY[name]
    const res = resolveFlag(name)
    return {
      name,
      value: res.value,
      source: res.source,
      default: def.default,
      description: def.description,
    }
  })
}

/**
 * DEV-only setter via localStorage override.
 *
 * This is intentionally synchronous and side-effecty: it is for debugging.
 */
export function setFlag<N extends FlagName>(name: N, value: FlagValueFor<N>): void {
  if (!isDevOverridesAllowed()) {
    throw new Error(`setFlag(${String(name)}) is disabled in production`)
  }
  if (typeof window === 'undefined') {
    throw new Error(`setFlag(${String(name)}) requires a browser environment`)
  }

  const def = FLAG_REGISTRY[name] as unknown as FlagDef<FlagValue>
  if (def.values && def.values.length > 0) {
    // values is a typed allowlist (string union in practice).
    const ok = def.values.includes(value as never)
    if (!ok) throw new Error(`Invalid value for flag ${String(name)}: ${String(value)}`)
  }

  window.localStorage.setItem(`${STORAGE_PREFIX}${name}`, String(value))
}

export function resetFlag(name: FlagName): void {
  if (!isDevOverridesAllowed()) return
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(`${STORAGE_PREFIX}${name}`)
}

export function resetAllFlags(): void {
  if (!isDevOverridesAllowed()) return
  if (typeof window === 'undefined') return

  for (const name of Object.keys(FLAG_REGISTRY) as FlagName[]) {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${name}`)
  }
}
