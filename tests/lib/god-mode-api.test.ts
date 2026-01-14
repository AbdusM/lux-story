/**
 * God Mode API - Smoke Test
 *
 * Basic tests to verify God Mode API is correctly structured
 */

import { describe, it, expect } from 'vitest'
import { createGodModeAPI } from '@/lib/dev-tools/god-mode-api'
import {
  validateCharacterId,
  validatePattern,
  validateTrust,
  validatePatternLevel
} from '@/lib/dev-tools/god-mode-validators'

describe('God Mode API - Smoke Tests', () => {
  describe('API Structure', () => {
    it('should create God Mode API with all required methods', () => {
      const api = createGodModeAPI()

      // Trust Management
      expect(api.setTrust).toBeDefined()
      expect(api.getTrust).toBeDefined()

      // Pattern Management
      expect(api.setPattern).toBeDefined()
      expect(api.getPattern).toBeDefined()
      expect(api.setAllPatterns).toBeDefined()

      // Navigation
      expect(api.jumpToNode).toBeDefined()
      expect(api.jumpToCharacter).toBeDefined()
      expect(api.listNodes).toBeDefined()
      expect(api.listCharacters).toBeDefined()

      // Simulation Management
      expect(api.unlockAllSimulations).toBeDefined()
      expect(api.unlockSimulation).toBeDefined()
      expect(api.forceGoldenPrompt).toBeDefined()

      // Knowledge Flags
      expect(api.addKnowledgeFlag).toBeDefined()
      expect(api.addGlobalFlag).toBeDefined()
      expect(api.removeGlobalFlag).toBeDefined()
      expect(api.hasGlobalFlag).toBeDefined()
      expect(api.clearAllFlags).toBeDefined()

      // Thought Cabinet
      expect(api.addThought).toBeDefined()
      expect(api.internalizeThought).toBeDefined()

      // Mystery Progression
      expect(api.setMystery).toBeDefined()

      // State Query
      expect(api.getGameState).toBeDefined()
      expect(api.getCharacterState).toBeDefined()
      expect(api.getCurrentNode).toBeDefined()

      // Debug Toggles
      expect(api.showHiddenChoices).toBeDefined()
      expect(api.skipAnimations).toBeDefined()

      // Utility
      expect(api.exportState).toBeDefined()
      expect(api.resetAll).toBeDefined()
    })

    it('should have correct function signatures', () => {
      const api = createGodModeAPI()

      // All methods should be functions
      expect(typeof api.setTrust).toBe('function')
      expect(typeof api.setPattern).toBe('function')
      expect(typeof api.jumpToNode).toBe('function')
      expect(typeof api.getGameState).toBe('function')
    })
  })

  describe('Validators', () => {
    it('should validate character IDs correctly', () => {
      expect(validateCharacterId('maya')).toBe(true)
      expect(validateCharacterId('samuel')).toBe(true)
      expect(validateCharacterId('invalid_char')).toBe(false)
      expect(validateCharacterId('')).toBe(false)
    })

    it('should validate patterns correctly', () => {
      expect(validatePattern('analytical')).toBe(true)
      expect(validatePattern('helping')).toBe(true)
      expect(validatePattern('building')).toBe(true)
      expect(validatePattern('patience')).toBe(true)
      expect(validatePattern('exploring')).toBe(true)
      expect(validatePattern('invalid')).toBe(false)
    })

    it('should clamp trust values to valid range [0, 10]', () => {
      expect(validateTrust(5)).toBe(5)
      expect(validateTrust(0)).toBe(0)
      expect(validateTrust(10)).toBe(10)
      expect(validateTrust(-5)).toBe(0)
      expect(validateTrust(999)).toBe(10)
      expect(validateTrust(10.5)).toBe(10)
    })

    it('should clamp pattern levels to valid range [0, 9]', () => {
      expect(validatePatternLevel(5)).toBe(5)
      expect(validatePatternLevel(0)).toBe(0)
      expect(validatePatternLevel(9)).toBe(9)
      expect(validatePatternLevel(-1)).toBe(0)
      expect(validatePatternLevel(100)).toBe(9)
    })

    it('should handle NaN values gracefully', () => {
      expect(validateTrust(NaN)).toBe(0)
      expect(validatePatternLevel(NaN)).toBe(0)
    })
  })

  describe('List Functions', () => {
    it('should list all characters', () => {
      const api = createGodModeAPI()
      const characters = api.listCharacters()

      expect(Array.isArray(characters)).toBe(true)
      expect(characters.length).toBeGreaterThan(0)
      expect(characters).toContain('maya')
      expect(characters).toContain('samuel')
    })

    it('should list nodes', () => {
      const api = createGodModeAPI()
      const allNodes = api.listNodes()
      const mayaNodes = api.listNodes('maya')

      expect(Array.isArray(allNodes)).toBe(true)
      expect(Array.isArray(mayaNodes)).toBe(true)
      expect(allNodes.length).toBeGreaterThan(mayaNodes.length)
    })
  })
})
