import { safeStorage } from '@/lib/safe-storage'

type FlagValue = boolean | string

type BooleanFlagDef = {
  type: 'boolean'
  default: boolean
}

type EnumFlagDef<TVariants extends readonly string[]> = {
  type: 'enum'
  default: TVariants[number]
  variants: TVariants
}

type FlagDef = BooleanFlagDef | EnumFlagDef<readonly string[]>

export const FEATURE_FLAG_DEFS = {
  // Example enum flag (matches PRD example `?ff_RANKING_V2=beta`)
  RANKING_V2: {
    type: 'enum',
    variants: ['control', 'beta'] as const,
    default: 'control',
  },
  // Example boolean flag
  EXPERIMENTS_ENABLED: {
    type: 'boolean',
    default: true,
  },
} as const satisfies Record<string, FlagDef>

export type FeatureFlagName = keyof typeof FEATURE_FLAG_DEFS

export type FeatureFlagValue<Name extends FeatureFlagName> =
  (typeof FEATURE_FLAG_DEFS)[Name] extends BooleanFlagDef
    ? boolean
    : (typeof FEATURE_FLAG_DEFS)[Name] extends EnumFlagDef<infer V>
      ? V[number]
      : never

type FlagSource = 'query' | 'localStorage' | 'env' | 'default'

const LS_PREFIX = 'ff_'
const QS_PREFIX = 'ff_'
const ENV_PREFIX_PUBLIC = 'NEXT_PUBLIC_FF_'
const ENV_PREFIX_PRIVATE = 'FF_'

function isDev(): boolean {
  // Treat tests as dev for ergonomics; treat production as locked-down.
  return process.env.NODE_ENV !== 'production'
}

function parseBoolean(v: unknown): boolean | null {
  if (typeof v === 'boolean') return v
  if (typeof v !== 'string') return null
  const s = v.trim().toLowerCase()
  if (['1', 'true', 'yes', 'on'].includes(s)) return true
  if (['0', 'false', 'no', 'off'].includes(s)) return false
  return null
}

function readQueryOverride(flag: FeatureFlagName): string | null {
  if (!isDev()) return null
  if (typeof window === 'undefined') return null
  try {
    const params = new URLSearchParams(window.location.search)
    const v = params.get(`${QS_PREFIX}${String(flag)}`)
    return v
  } catch {
    return null
  }
}

function readLocalStorageOverride(flag: FeatureFlagName): string | null {
  if (!isDev()) return null
  return safeStorage.getItem(`${LS_PREFIX}${String(flag)}`)
}

function readEnvOverride(flag: FeatureFlagName): string | null {
  // Next.js only inlines NEXT_PUBLIC_* into the browser bundle.
  // Also allow FF_* on the server.
  const kPublic = `${ENV_PREFIX_PUBLIC}${String(flag)}`
  const kPrivate = `${ENV_PREFIX_PRIVATE}${String(flag)}`
  return process.env[kPublic] ?? process.env[kPrivate] ?? null
}

function coerceValue<Name extends FeatureFlagName>(
  name: Name,
  raw: unknown
): FeatureFlagValue<Name> | null {
  const def = FEATURE_FLAG_DEFS[name]
  if (def.type === 'boolean') {
    return parseBoolean(raw) as FeatureFlagValue<Name> | null
  }
  if (def.type === 'enum') {
    if (typeof raw !== 'string') return null
    const s = raw.trim()
    if ((def.variants as readonly string[]).includes(s)) {
      return s as FeatureFlagValue<Name>
    }
    return null
  }
  return null
}

export function getFlag<Name extends FeatureFlagName>(name: Name): FeatureFlagValue<Name> {
  const def = FEATURE_FLAG_DEFS[name]

  const q = readQueryOverride(name)
  const qv = coerceValue(name, q)
  if (qv !== null) return qv

  const ls = readLocalStorageOverride(name)
  const lsv = coerceValue(name, ls)
  if (lsv !== null) return lsv

  const env = readEnvOverride(name)
  const envv = coerceValue(name, env)
  if (envv !== null) return envv

  return def.default as FeatureFlagValue<Name>
}

export function isEnabled(name: FeatureFlagName): boolean {
  const def = FEATURE_FLAG_DEFS[name]
  if (def.type !== 'boolean') {
    throw new Error(`isEnabled() only supports boolean flags. Flag "${String(name)}" is ${def.type}.`)
  }
  return getFlag(name) === true
}

export function setFlag<Name extends FeatureFlagName>(name: Name, value: FeatureFlagValue<Name>): void {
  if (!isDev()) {
    throw new Error('setFlag() is dev-only and is disabled in production builds.')
  }
  safeStorage.setItem(`${LS_PREFIX}${String(name)}`, String(value))
}

export function resetFlags(): void {
  if (!isDev()) return
  for (const name of Object.keys(FEATURE_FLAG_DEFS) as FeatureFlagName[]) {
    safeStorage.removeItem(`${LS_PREFIX}${String(name)}`)
  }
}

export function listFlags(): Array<{
  name: FeatureFlagName
  type: (typeof FEATURE_FLAG_DEFS)[FeatureFlagName]['type']
  value: FlagValue
  source: FlagSource
  defaultValue: FlagValue
  variants?: readonly string[]
}> {
  const out: Array<{
    name: FeatureFlagName
    type: (typeof FEATURE_FLAG_DEFS)[FeatureFlagName]['type']
    value: FlagValue
    source: FlagSource
    defaultValue: FlagValue
    variants?: readonly string[]
  }> = []

  for (const name of Object.keys(FEATURE_FLAG_DEFS) as FeatureFlagName[]) {
    const def = FEATURE_FLAG_DEFS[name]

    const q = readQueryOverride(name)
    const qv = coerceValue(name, q)
    if (qv !== null) {
      out.push({
        name,
        type: def.type,
        value: qv,
        source: 'query',
        defaultValue: def.default,
        variants: def.type === 'enum' ? def.variants : undefined,
      })
      continue
    }

    const ls = readLocalStorageOverride(name)
    const lsv = coerceValue(name, ls)
    if (lsv !== null) {
      out.push({
        name,
        type: def.type,
        value: lsv,
        source: 'localStorage',
        defaultValue: def.default,
        variants: def.type === 'enum' ? def.variants : undefined,
      })
      continue
    }

    const env = readEnvOverride(name)
    const envv = coerceValue(name, env)
    if (envv !== null) {
      out.push({
        name,
        type: def.type,
        value: envv,
        source: 'env',
        defaultValue: def.default,
        variants: def.type === 'enum' ? def.variants : undefined,
      })
      continue
    }

    out.push({
      name,
      type: def.type,
      value: def.default,
      source: 'default',
      defaultValue: def.default,
      variants: def.type === 'enum' ? def.variants : undefined,
    })
  }

  return out
}

