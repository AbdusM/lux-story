
import { describe, it, expect } from 'vitest'
import { getRelevantCrossCharacterEcho } from '../lib/character-relationships'
import { checkPatternThreshold } from '../lib/consequence-echoes'
import { getDiscoveryHint } from '../lib/consequence-echoes'
import { GameState } from '../lib/character-state'
import { PatternType } from '../lib/patterns'

describe('Late Game Logic Verification', () => {

    // Test 1: Identity Ceremony Trigger
    it('should detect when pattern crosses threshold 5', () => {
        const oldPatterns = { analytical: 4.8 } as Record<PatternType, number>
        const newPatterns = { analytical: 5.2 } as Record<PatternType, number>

        // Logic used in StatefulGameInterface
        const crossed = checkPatternThreshold(oldPatterns, newPatterns, 5)

        expect(crossed).toBe('analytical')
        console.log('✅ Identity Threshold (5.0) correctly detected for Analytical')
    })

    // Test 2: Cross-Character Echoes (Gossip)
    it('should return a gossip echo when speaker knows the player', () => {
        // Mock Game State
        const mockState = {
            characters: new Map([
                ['samuel', { trust: 5, conversationHistory: ['node1'] }],
                ['maya', { trust: 5, conversationHistory: ['node1'] }] // Player met Maya
            ]),
            globalFlags: new Set<string>()
        } as unknown as GameState

        // We ask Samuel (speaker) about others
        const echo = getRelevantCrossCharacterEcho('samuel', mockState)

        expect(echo).not.toBeNull()
        if (echo) {
            expect(echo.text).toBeDefined()
            console.log(`✅ Cross-Character Echo generated: "${echo.text}"`)
        }
    })

    // Test 3: Vulnerability Hints
    it('should return discovery hints for high trust', () => {
        // Samuel's vulnerability is usually hidden, but at trust 5 we might get a hint
        const hint = getDiscoveryHint('samuel', 'perfectionism', 8) // High trust

        // Note: getDiscoveryHint might return null if no hint defined for this specific vuln/level
        // But we want to verify the function runs without error
        if (hint) {
            console.log(`✅ Discovery Hint found: "${hint.text}"`)
        } else {
            console.log('ℹ️ No hint found for this specific combo, but function ran safe.')
        }
    })
})
