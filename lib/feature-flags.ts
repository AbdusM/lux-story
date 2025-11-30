/**
 * Feature Flags for gradual shadcn migration
 * Control which components use the new shadcn implementation
 */

import { logger } from './logger'

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
  (window as unknown as { featureFlags: unknown }).featureFlags = {
    enable: (flag: string) => {
      localStorage.setItem(`ff_${flag}`, 'true')
      logger.debug(`Enabled flag: ${flag}`, { operation: 'feature-flags', flag })
    },
    disable: (flag: string) => {
      localStorage.setItem(`ff_${flag}`, 'false')
      logger.debug(`Disabled flag: ${flag}`, { operation: 'feature-flags', flag })
    },
    reset: (flag: string) => {
      localStorage.removeItem(`ff_${flag}`)
      logger.debug(`Reset flag: ${flag} to default`, { operation: 'feature-flags', flag })
    },
    resetAll: () => {
      const flags = Object.keys(localStorage).filter(k => k.startsWith('ff_'))
      flags.forEach(flag => localStorage.removeItem(flag))
      logger.debug(`Reset all ${flags.length} flags to defaults`, { operation: 'feature-flags', count: flags.length })
    },
    list: () => {
      logger.debug('Feature Flags', {
        operation: 'feature-flags.list',
        uiComponents: {
          typography: featureFlags.useShadcnTypography(),
          gameCard: featureFlags.useShadcnGameCard(),
          gameChoice: featureFlags.useShadcnGameChoice(),
          gameMessage: featureFlags.useShadcnGameMessage(),
          gameInterface: featureFlags.useShadcnGameInterface(),
          global: featureFlags.useShadcnGlobal()
        },
        contentFlags: {
          mayaV2: featureFlags.useNewMayaContent(),
          devonV2: featureFlags.useNewDevonContent(),
          jordanV2: featureFlags.useNewJordanContent(),
          patternBranching: featureFlags.usePatternBranching(),
          birminghamDetails: featureFlags.useBirminghamDetails()
        },
        usage: 'featureFlags.enable/disable/reset("FLAG_NAME")'
      })
    }
  }

  logger.debug('Feature flags loaded', { operation: 'feature-flags.init' })
}