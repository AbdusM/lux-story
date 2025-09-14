"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getDataNormalizer, DataNormalizer, CharacterRelationship, PlatformRelationship, ChoicePattern, SkillDevelopment, GameSession } from '@/lib/data-schemas'

/**
 * Hook for managing normalized game data
 * Provides reactive access to normalized data store
 */
export function useNormalizedData() {
  const [normalizer] = useState<DataNormalizer>(() => getDataNormalizer())
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  // Force re-render when data changes
  const triggerUpdate = useCallback(() => {
    setLastUpdated(Date.now())
  }, [])

  // Character relationships
  const updateCharacterRelationship = useCallback((characterId: string, updates: Partial<CharacterRelationship>) => {
    const result = normalizer.updateCharacterRelationship(characterId, updates)
    triggerUpdate()
    return result
  }, [normalizer, triggerUpdate])

  const getCharacterRelationship = useCallback((characterId: string) => {
    return normalizer.getCharacterRelationship(characterId)
  }, [normalizer])

  const getCharacterRelationships = useCallback(() => {
    return normalizer.getRelationshipsByType('character') as CharacterRelationship[]
  }, [normalizer])

  // Platform relationships
  const updatePlatformRelationship = useCallback((platformId: string, updates: Partial<PlatformRelationship>) => {
    const result = normalizer.updatePlatformRelationship(platformId, updates)
    triggerUpdate()
    return result
  }, [normalizer, triggerUpdate])

  const getPlatformRelationship = useCallback((platformId: string) => {
    return normalizer.getPlatformRelationship(platformId)
  }, [normalizer])

  const getPlatformRelationships = useCallback(() => {
    return normalizer.getRelationshipsByType('platform') as PlatformRelationship[]
  }, [normalizer])

  // Patterns
  const updatePattern = useCallback((patternId: string, updates: Partial<ChoicePattern>) => {
    const result = normalizer.updatePattern(patternId, updates)
    triggerUpdate()
    return result
  }, [normalizer, triggerUpdate])

  const getPattern = useCallback((patternId: string) => {
    return normalizer.getPattern(patternId)
  }, [normalizer])

  const getPatternsByType = useCallback((type: ChoicePattern['patternType']) => {
    return normalizer.getPatternsByType(type)
  }, [normalizer])

  // Skills
  const updateSkillDevelopment = useCallback((skillId: string, updates: Partial<SkillDevelopment>) => {
    const result = normalizer.updateSkillDevelopment(skillId, updates)
    triggerUpdate()
    return result
  }, [normalizer, triggerUpdate])

  const getSkillDevelopment = useCallback((skillId: string) => {
    return normalizer.getSkillDevelopment(skillId)
  }, [normalizer])

  // Sessions
  const startSession = useCallback((sessionId: string) => {
    const result = normalizer.startSession(sessionId)
    triggerUpdate()
    return result
  }, [normalizer, triggerUpdate])

  const endSession = useCallback((sessionId: string, updates: Partial<GameSession>) => {
    const result = normalizer.endSession(sessionId, updates)
    triggerUpdate()
    return result
  }, [normalizer, triggerUpdate])

  const getActiveSession = useCallback(() => {
    return normalizer.getActiveSession()
  }, [normalizer])

  // Computed values
  const characterRelationships = useMemo(() => {
    return getCharacterRelationships()
  }, [getCharacterRelationships, lastUpdated])

  const platformRelationships = useMemo(() => {
    return getPlatformRelationships()
  }, [getPlatformRelationships, lastUpdated])

  const allPatterns = useMemo(() => {
    return Object.values(normalizer.exportData().patterns)
  }, [normalizer, lastUpdated])

  const activeSession = useMemo(() => {
    return getActiveSession()
  }, [getActiveSession, lastUpdated])

  // Cleanup
  useEffect(() => {
    return () => {
      // Cleanup old data on unmount
      normalizer.cleanupOldData()
    }
  }, [normalizer])

  return {
    // Character relationships
    updateCharacterRelationship,
    getCharacterRelationship,
    characterRelationships,
    
    // Platform relationships
    updatePlatformRelationship,
    getPlatformRelationship,
    platformRelationships,
    
    // Patterns
    updatePattern,
    getPattern,
    getPatternsByType,
    allPatterns,
    
    // Skills
    updateSkillDevelopment,
    getSkillDevelopment,
    
    // Sessions
    startSession,
    endSession,
    getActiveSession,
    activeSession,
    
    // Utilities
    exportData: () => normalizer.exportData(),
    importData: (data: any) => {
      normalizer.importData(data)
      triggerUpdate()
    },
    cleanupOldData: () => {
      normalizer.cleanupOldData()
      triggerUpdate()
    }
  }
}

/**
 * Hook for character relationship management
 */
export function useCharacterRelationships() {
  const {
    updateCharacterRelationship,
    getCharacterRelationship,
    characterRelationships
  } = useNormalizedData()

  const getCharacterTrust = useCallback((characterId: string) => {
    const relationship = getCharacterRelationship(characterId)
    return relationship?.trust || 0
  }, [getCharacterRelationship])

  const getCharacterRespect = useCallback((characterId: string) => {
    const relationship = getCharacterRelationship(characterId)
    return relationship?.respect || 0
  }, [getCharacterRelationship])

  const getCharacterAffinity = useCallback((characterId: string) => {
    const relationship = getCharacterRelationship(characterId)
    return relationship?.affinity || 0
  }, [getCharacterRelationship])

  const updateCharacterTrust = useCallback((characterId: string, trust: number) => {
    return updateCharacterRelationship(characterId, { trust })
  }, [updateCharacterRelationship])

  const updateCharacterRespect = useCallback((characterId: string, respect: number) => {
    return updateCharacterRelationship(characterId, { respect })
  }, [updateCharacterRelationship])

  const updateCharacterAffinity = useCallback((characterId: string, affinity: number) => {
    return updateCharacterRelationship(characterId, { affinity })
  }, [updateCharacterRelationship])

  return {
    characterRelationships,
    getCharacterTrust,
    getCharacterRespect,
    getCharacterAffinity,
    updateCharacterTrust,
    updateCharacterRespect,
    updateCharacterAffinity,
    updateCharacterRelationship
  }
}

/**
 * Hook for platform relationship management
 */
export function usePlatformRelationships() {
  const {
    updatePlatformRelationship,
    getPlatformRelationship,
    platformRelationships
  } = useNormalizedData()

  const getPlatformWarmth = useCallback((platformId: string) => {
    const relationship = getPlatformRelationship(platformId)
    return relationship?.warmth || 0
  }, [getPlatformRelationship])

  const getPlatformAccessibility = useCallback((platformId: string) => {
    const relationship = getPlatformRelationship(platformId)
    return relationship?.accessibility || 0
  }, [getPlatformRelationship])

  const updatePlatformWarmth = useCallback((platformId: string, warmth: number) => {
    return updatePlatformRelationship(platformId, { warmth })
  }, [updatePlatformRelationship])

  const updatePlatformAccessibility = useCallback((platformId: string, accessibility: number) => {
    return updatePlatformRelationship(platformId, { accessibility })
  }, [updatePlatformRelationship])

  return {
    platformRelationships,
    getPlatformWarmth,
    getPlatformAccessibility,
    updatePlatformWarmth,
    updatePlatformAccessibility,
    updatePlatformRelationship
  }
}

/**
 * Hook for pattern analysis
 */
export function usePatternAnalysis() {
  const {
    updatePattern,
    getPattern,
    getPatternsByType,
    allPatterns
  } = useNormalizedData()

  const getPatternStrength = useCallback((patternId: string) => {
    const pattern = getPattern(patternId)
    return pattern?.strength || 0
  }, [getPattern])

  const getPatternFrequency = useCallback((patternId: string) => {
    const pattern = getPattern(patternId)
    return pattern?.frequency || 0
  }, [getPattern])

  const updatePatternStrength = useCallback((patternId: string, strength: number) => {
    return updatePattern(patternId, { strength })
  }, [updatePattern])

  const updatePatternFrequency = useCallback((patternId: string, frequency: number) => {
    return updatePattern(patternId, { frequency })
  }, [updatePattern])

  const getTopPatterns = useCallback((limit: number = 5) => {
    return allPatterns
      .sort((a, b) => b.strength - a.strength)
      .slice(0, limit)
  }, [allPatterns])

  return {
    allPatterns,
    getPatternStrength,
    getPatternFrequency,
    updatePatternStrength,
    updatePatternFrequency,
    getTopPatterns,
    getPatternsByType
  }
}
