
/**
 * Verification Script: Character System Coverage
 * 
 * "Simple Made Easy" - We define the specification first.
 * This script verifies that every character has the required "Essential Complexity"
 * to function in the Lux Story 2.0 system.
 * 
 * Requirements per Character:
 * 1. Consequence Echoes: At least 3 templates (Trust Up/Down)
 * 2. Pattern Voices: At least 2 triggers specific to them
 * 3. Vulnerability: At least 1 defined vulnerability arc
 */

import { CHARACTER_ECHOES } from '../lib/consequence-echoes'
import { PATTERN_VOICE_LIBRARY } from '../content/pattern-voice-library'
import { CHARACTER_DEPTH } from '../content/character-depth'

// The Full Cast List
const EXPECTED_CHARACTERS = [
    'samuel', 'maya', 'devon', // The Core
    'kai', 'rohan', 'tess', 'marcus', 'yaquin', // The Extended Core
    'elena', 'grace', 'alex', 'asha', 'silas', 'lira', 'zara' // The Missing 7
]

function verifyCoverage() {
    console.log('🔍 Verifying System Coverage for ' + EXPECTED_CHARACTERS.length + ' Characters...\n')

    let totalErrors = 0

    EXPECTED_CHARACTERS.forEach(charId => {
        const errors: string[] = []

        // 1. Verify Echoes
        const echoes = CHARACTER_ECHOES[charId]
        if (!echoes) {
            errors.push('❌ Missing Consequence Echoes')
        } else {
            const trustUpCount = Object.values(echoes.trustUp || {}).flat().length
            const trustDownCount = Object.values(echoes.trustDown || {}).flat().length
            if (trustUpCount < 3) errors.push(`⚠️ Low Echo Count (TrustUp: ${trustUpCount})`)
        }

        // 2. Verify Voices
        const specificVoices = PATTERN_VOICE_LIBRARY.filter(v =>
            v.condition?.characterId === charId
        )
        if (specificVoices.length < 2) {
            errors.push(`❌ Low Voice Triggers (${specificVoices.length}/2)`)
        }

        // 3. Verify Depth (Vulnerabilities)
        const depth = CHARACTER_DEPTH[charId]
        if (!depth) {
            errors.push('❌ Missing Depth Profile')
        } else if (depth.vulnerabilities.length < 1) {
            errors.push('❌ No Vulnerabilities Defined')
        }

        // Report
        if (errors.length > 0) {
            console.log(`FAILED: ${charId.toUpperCase()}`)
            errors.forEach(e => console.log(`  ${e}`))
            totalErrors++
        } else {
            console.log(`✅ ${charId.toUpperCase()}: Full Coverage`)
        }
    })

    console.log('\n----------------------------------------')
    if (totalErrors > 0) {
        console.log(`❌ Verification FAILED with ${totalErrors} incomplete characters.`)
        process.exit(1)
    } else {
        console.log('✅ Verification PASSED. System is complete.')
        process.exit(0)
    }
}

verifyCoverage()
