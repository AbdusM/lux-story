import { safeStorage } from '@/lib/safe-storage'

type FlagType = 'boolean' | 'enum'

export type FeatureFlagLane = 'prod' | 'pilot' | 'dev_only' | 'test_only'

type FlagMeta = {
  // AAA lifecycle metadata (prevents "flags live forever" drift).
  lane: FeatureFlagLane
  owner: string
  created_at: string // YYYY-MM-DD
  sunset_by: string // YYYY-MM-DD
  description: string
}

type FlagDef =
  | ({ type: 'boolean'; default: boolean } & { meta: FlagMeta })
  | ({ type: 'enum'; values: readonly string[]; default: string } & { meta: FlagMeta })

export const FEATURE_FLAGS = {
  // Example enum flag used in ranking rollout docs.
  RANKING_V2: {
    type: 'enum',
    values: ['control', 'beta'] as const,
    default: 'control',
    meta: {
      lane: 'pilot',
      owner: 'ranking',
      created_at: '2026-02-10',
      sunset_by: '2026-04-30',
      description: 'Ranking algorithm selection for staged rollout.',
    },
  },

  // Runtime enforcement remains opt-in; this flag is for safe staged rollouts.
  ENFORCE_REQUIRED_STATE: {
    type: 'boolean',
    default: false,
    meta: {
      lane: 'pilot',
      owner: 'core-content-contracts',
      created_at: '2026-02-10',
      sunset_by: '2026-04-30',
      description: 'Strictly enforce requiredState in dev/test and staged rollouts (opt-in).',
    },
  },

  // Player-facing: reduce overwhelm when many choices are available.
  CHOICE_COMPACT_MODE: {
    type: 'boolean',
    default: false,
    meta: {
      lane: 'pilot',
      owner: 'ux',
      created_at: '2026-02-10',
      sunset_by: '2026-04-30',
      description: 'Compact choice list to reduce cognitive overload when many choices exist.',
    },
  },

  // Systems: opt-in scarcity economy experiments (Persona-like cost).
  SCARCITY_MODE_V1: {
    type: 'boolean',
    default: false,
    meta: {
      lane: 'pilot',
      owner: 'systems',
      created_at: '2026-02-10',
      sunset_by: '2026-04-30',
      description: 'Enable scarcity economy (focus points) to shape tradeoffs and pacing.',
    },
  },

  // UX: optional accept/reject moment for identity formation (behind a flag).
  IDENTITY_OFFERING_V1: {
    type: 'boolean',
    default: false,
    meta: {
      lane: 'pilot',
      owner: 'identity',
      created_at: '2026-02-10',
      sunset_by: '2026-04-30',
      description: 'Identity offering UX (accept/reject) for staged onboarding improvements.',
    },
  },

  // Systems: opt-in procedural gossip propagation (in addition to arc-complete echoes).
  GOSSIP_PROPAGATION_V1: {
    type: 'boolean',
    default: false,
    meta: {
      lane: 'pilot',
      owner: 'narrative-systems',
      created_at: '2026-02-10',
      sunset_by: '2026-04-30',
      description: 'Procedural gossip propagation processor (adds cross-character memory echoes).',
    },
  },
} as const satisfies Record<string, FlagDef>

export type FeatureFlagName = keyof typeof FEATURE_FLAGS
export type FeatureFlagValue<N extends FeatureFlagName> =
  (typeof FEATURE_FLAGS)[N] extends { type: 'boolean' } ? boolean :
  (typeof FEATURE_FLAGS)[N] extends { type: 'enum'; values: readonly (infer V)[] } ? V :
  never

const LS_PREFIX = 'ff_'

function isDevBuild(): boolean {
  return process.env.NODE_ENV !== 'production'
}

function storageKey(name: FeatureFlagName): string {
  return `${LS_PREFIX}${String(name)}`
}

function readQueryOverride(name: FeatureFlagName): string | null {
  if (!isDevBuild()) return null
  if (typeof window === 'undefined') return null

  const key = `ff_${String(name)}`
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get(key)
  } catch {
    return null
  }
}

function readLocalStorageOverride(name: FeatureFlagName): string | null {
  if (!isDevBuild()) return null
  return safeStorage.getItem(storageKey(name))
}

function readEnvOverride(name: FeatureFlagName): string | null {
  const envKey = `FF_${String(name)}`
  const publicEnvKey = `NEXT_PUBLIC_${envKey}`

  // Client bundles only have NEXT_PUBLIC_ vars; server can see both.
  return process.env[publicEnvKey] ?? process.env[envKey] ?? null
}

function parseFlagValue(def: FlagDef, raw: string | null): boolean | string | null {
  if (raw == null) return null

  if (def.type === 'boolean') {
    const v = raw.trim().toLowerCase()
    if (['1', 'true', 't', 'yes', 'y', 'on'].includes(v)) return true
    if (['0', 'false', 'f', 'no', 'n', 'off'].includes(v)) return false
    return null
  }

  const v = raw.trim()
  return def.values.includes(v) ? v : null
}

export function listFlags(): Array<{
  name: FeatureFlagName
  type: FlagType
  default: boolean | string
  values?: readonly string[]
  meta: FlagMeta
}> {
  return (Object.keys(FEATURE_FLAGS) as FeatureFlagName[]).map((name) => {
    const def = FEATURE_FLAGS[name]
    return def.type === 'boolean'
      ? { name, type: 'boolean', default: def.default, meta: def.meta }
      : { name, type: 'enum', default: def.default, values: def.values, meta: def.meta }
  })
}

export function getFlag<N extends FeatureFlagName>(name: N): FeatureFlagValue<N> {
  const def = FEATURE_FLAGS[name]

  // Priority: query (dev) > localStorage (dev) > env > default.
  const fromQuery = parseFlagValue(def, readQueryOverride(name))
  if (fromQuery != null) return fromQuery as FeatureFlagValue<N>

  const fromLocal = parseFlagValue(def, readLocalStorageOverride(name))
  if (fromLocal != null) return fromLocal as FeatureFlagValue<N>

  const fromEnv = parseFlagValue(def, readEnvOverride(name))
  if (fromEnv != null) return fromEnv as FeatureFlagValue<N>

  return def.default as FeatureFlagValue<N>
}

export function isEnabled(name: FeatureFlagName): boolean {
  const def = FEATURE_FLAGS[name]
  if (def.type !== 'boolean') {
    throw new Error(`isEnabled() only supports boolean flags. "${String(name)}" is "${def.type}".`)
  }
  return getFlag(name as never) as boolean
}

export function setFlag<N extends FeatureFlagName>(name: N, value: FeatureFlagValue<N>): void {
  if (!isDevBuild()) {
    throw new Error('feature flag overrides are disabled in production builds')
  }

  const def = FEATURE_FLAGS[name]
  const raw = def.type === 'boolean' ? (value ? 'true' : 'false') : String(value)
  safeStorage.setItem(storageKey(name), raw)
}

export function resetFlags(): void {
  if (!isDevBuild()) return
  for (const name of Object.keys(FEATURE_FLAGS) as FeatureFlagName[]) {
    safeStorage.removeItem(storageKey(name))
  }
}
