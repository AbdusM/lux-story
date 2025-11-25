/**
 * Feature Flags for gradual shadcn migration
 * Control which components use the new shadcn implementation
 */

// Check environment variable or localStorage for override
const getFeatureFlag = (flag: string, defaultValue: boolean = false): boolean => {
  // Server-side: use environment variable
  if (typeof window === 'undefined') {
    return process.env[`NEXT_PUBLIC_FF_${flag}`] === 'true' || defaultValue
  }

  // Client-side: check localStorage for override, then env, then default
  try {
    const localOverride = localStorage.getItem(`ff_${flag}`)
    if (localOverride !== null) {
      return localOverride === 'true'
    }
  } catch (_e) {
    // localStorage not available
  }

  // Check environment variable
  const envValue = process.env[`NEXT_PUBLIC_FF_${flag}`]
  if (envValue !== undefined) {
    return envValue === 'true'
  }

  return defaultValue
}

// Feature flag definitions
export const featureFlags = {
  // Component-level flags
  useShadcnTypography: () => getFeatureFlag('SHADCN_TYPOGRAPHY', false),
  useShadcnGameCard: () => getFeatureFlag('SHADCN_GAME_CARD', false),
  useShadcnGameChoice: () => getFeatureFlag('SHADCN_GAME_CHOICE', false),
  useShadcnGameMessage: () => getFeatureFlag('SHADCN_GAME_MESSAGE', false),

  // Page-level flags
  useShadcnGameInterface: () => getFeatureFlag('SHADCN_GAME_INTERFACE', false),

  // Global flag to enable all shadcn components
  useShadcnGlobal: () => getFeatureFlag('SHADCN_GLOBAL', false),

  // Content feature flags - gate new content behind flags
  // Use these when adding new dialogue nodes, character arcs, or narrative paths
  useNewMayaContent: () => getFeatureFlag('CONTENT_MAYA_V2', false),
  useNewDevonContent: () => getFeatureFlag('CONTENT_DEVON_V2', false),
  useNewJordanContent: () => getFeatureFlag('CONTENT_JORDAN_V2', false),
  usePatternBranching: () => getFeatureFlag('CONTENT_PATTERN_BRANCHING', false),
  useBirminghamDetails: () => getFeatureFlag('CONTENT_BIRMINGHAM_DETAILS', false),
}

// Helper to check if any shadcn component is enabled
export const isAnyShadcnEnabled = (): boolean => {
  return featureFlags.useShadcnGlobal() ||
    featureFlags.useShadcnTypography() ||
    featureFlags.useShadcnGameCard() ||
    featureFlags.useShadcnGameChoice() ||
    featureFlags.useShadcnGameMessage() ||
    featureFlags.useShadcnGameInterface()
}

// Helper to enable/disable flags from console for testing
if (typeof window !== 'undefined') {
  (window as any).featureFlags = {
    enable: (flag: string) => {
      localStorage.setItem(`ff_${flag}`, 'true')
      console.log(`✅ Enabled flag: ${flag}. Refresh page to see changes.`)
    },
    disable: (flag: string) => {
      localStorage.setItem(`ff_${flag}`, 'false')
      console.log(`❌ Disabled flag: ${flag}. Refresh page to see changes.`)
    },
    reset: (flag: string) => {
      localStorage.removeItem(`ff_${flag}`)
      console.log(`🔄 Reset flag: ${flag} to default. Refresh page to see changes.`)
    },
    resetAll: () => {
      const flags = Object.keys(localStorage).filter(k => k.startsWith('ff_'))
      flags.forEach(flag => localStorage.removeItem(flag))
      console.log(`🔄 Reset all ${flags.length} flags to defaults. Refresh page to see changes.`)
    },
    list: () => {
      console.log('📋 Feature Flags:')
      console.log('\n  UI Components:')
      console.log('    Typography:', featureFlags.useShadcnTypography())
      console.log('    GameCard:', featureFlags.useShadcnGameCard())
      console.log('    GameChoice:', featureFlags.useShadcnGameChoice())
      console.log('    GameMessage:', featureFlags.useShadcnGameMessage())
      console.log('    GameInterface:', featureFlags.useShadcnGameInterface())
      console.log('    Global:', featureFlags.useShadcnGlobal())
      console.log('\n  Content Flags:')
      console.log('    MayaV2:', featureFlags.useNewMayaContent())
      console.log('    DevonV2:', featureFlags.useNewDevonContent())
      console.log('    JordanV2:', featureFlags.useNewJordanContent())
      console.log('    PatternBranching:', featureFlags.usePatternBranching())
      console.log('    BirminghamDetails:', featureFlags.useBirminghamDetails())
      console.log('\nUsage:')
      console.log('  featureFlags.enable("CONTENT_MAYA_V2")')
      console.log('  featureFlags.disable("CONTENT_MAYA_V2")')
      console.log('  featureFlags.reset("CONTENT_MAYA_V2")')
    }
  }

  console.log('🚀 Feature flags loaded. Type featureFlags.list() to see status.')
}