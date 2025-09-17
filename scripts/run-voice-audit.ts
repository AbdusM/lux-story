/**
 * Character Voice Consistency Audit using Gemini API
 *
 * Ensures consistent character voices across all dialogue scenes:
 * - Devon Kumar: Analytical, systematic, socially awkward
 * - Maya Chen: Empathetic, driven, conflicted
 * - Samuel Washington: Wise, calming, observational
 * - Jordan Packard: Transformative, searching, experienced
 */

import { GeminiContentFramework } from './gemini-content-framework'
import fs from 'fs'
import path from 'path'

interface CharacterProfile {
  name: string
  speakerVariants: string[] // Different ways the character is labeled
  personality: string
  speechPatterns: string[]
  vocabularyStyle: string
  emotionalRange: string
  socialStyle: string
  commonPhrases?: string[]
  avoidPhrases?: string[]
}

interface DialogueMatch {
  id: string
  speaker: string
  text: string
  fullMatch: string
  startIndex: number
  endIndex: number
  textStartIndex: number
  textEndIndex: number
}

class CharacterVoiceAuditor extends GeminiContentFramework {
  private characters: Map<string, CharacterProfile> = new Map()
  private dialogues: DialogueMatch[] = []
  private filePath: string

  constructor() {
    super()
    this.filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts')
    this.initializeCharacters()
  }

  /**
   * Initialize character profiles
   */
  private initializeCharacters(): void {
    this.characters.set('devon', {
      name: 'Devon Kumar',
      speakerVariants: [
        'Devon Kumar (Engineering Student)',
        'Devon Kumar (UAB Engineering Student)',
        'Devon Kumar'
      ],
      personality: 'Highly analytical, systematic, logical, socially awkward but not mean-spirited',
      speechPatterns: [
        'Technical vocabulary and precise language',
        'Often explains things in terms of systems and data',
        'Sometimes misses social cues',
        'Gets excited about technical details',
        'Can be blunt but not intentionally hurtful'
      ],
      vocabularyStyle: 'Technical, precise, data-oriented',
      emotionalRange: 'Reserved but passionate about technology',
      socialStyle: 'Awkward but trying, more comfortable with systems than people',
      commonPhrases: ['algorithm', 'system', 'data', 'efficient', 'pattern', 'optimize'],
      avoidPhrases: ['feeling', 'vibe', 'intuition', 'gut feeling']
    })

    this.characters.set('maya', {
      name: 'Maya Chen',
      speakerVariants: [
        'Maya Chen (Pre-med Student)',
        'Maya Chen',
        'Maya'
      ],
      personality: 'Empathetic, driven, conflicted between family expectations and personal passion',
      speechPatterns: [
        'Warm and understanding tone',
        'Often references both medicine and robotics',
        'Shows internal conflict in speech',
        'Connects with others emotionally',
        'Sometimes quotes her parents'
      ],
      vocabularyStyle: 'Intelligent but accessible, mixes medical and technical terms',
      emotionalRange: 'Wide range - from anxious to passionate to conflicted',
      socialStyle: 'Naturally empathetic, good listener, builds connections',
      commonPhrases: ['understand', 'feels like', 'my parents', 'MCAT', 'robots', 'dreams'],
      avoidPhrases: ['whatever', "don't care", 'easy choice']
    })

    this.characters.set('samuel', {
      name: 'Samuel Washington',
      speakerVariants: [
        'Samuel Washington (Station Keeper)',
        'Samuel Washington',
        'Samuel',
        'Station Keeper'
      ],
      personality: 'Wise, calming, observational, former traveler who chose to guide',
      speechPatterns: [
        'Speaks in gentle metaphors',
        'Often references time and patience',
        'Shares wisdom through stories',
        'Never judgmental or prescriptive',
        'Uses sensory descriptions'
      ],
      vocabularyStyle: 'Poetic, contemplative, uses railroad and journey metaphors',
      emotionalRange: 'Consistently calm and warm',
      socialStyle: 'Patient listener, asks thoughtful questions, creates safe space',
      commonPhrases: ['time', 'journey', 'platform', 'train', 'path', 'young traveler'],
      avoidPhrases: ['hurry', 'must', 'should', 'wrong choice']
    })

    this.characters.set('jordan', {
      name: 'Jordan Packard',
      speakerVariants: [
        'Jordan Packard (Multi-Path Mentor)',
        'Jordan Packard',
        'Jordan'
      ],
      personality: 'Experienced career-changer, still searching, wise about non-linear paths',
      speechPatterns: [
        'Honest about struggles and uncertainties',
        'References multiple career attempts',
        'Encourages exploration over commitment',
        'Self-deprecating humor',
        'Philosophical about failure'
      ],
      vocabularyStyle: 'Casual, honest, uses career-switching terminology',
      emotionalRange: 'Reflective, sometimes frustrated, ultimately hopeful',
      socialStyle: 'Open about failures, relates through shared struggle',
      commonPhrases: ['tried', 'pivot', 'explore', 'no waste', 'transfer', 'learn'],
      avoidPhrases: ['perfect path', 'destined', 'calling', 'meant to be']
    })
  }

  /**
   * Extract all dialogue scenes from the game file
   */
  async extractDialogues(): Promise<void> {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8')

    // Pattern to match dialogue scenes
    const scenePattern = /'([^']+)':\s*\{[^}]*text:\s*"([^"\\]*(?:\\.[^"\\]*)*)",[^}]*speaker:\s*'([^']+)'/g

    let match
    while ((match = scenePattern.exec(fileContent)) !== null) {
      const sceneId = match[1]
      const sceneText = match[2]
      const speaker = match[3]

      // Find exact text position for precise replacement
      const textStartInMatch = match[0].indexOf('text: "') + 'text: "'
      const textStartIndex = match.index + textStartInMatch.length
      const textEndIndex = textStartIndex + sceneText.length

      this.dialogues.push({
        id: sceneId,
        speaker,
        text: sceneText,
        fullMatch: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        textStartIndex,
        textEndIndex
      })
    }

    console.log(`📚 Found ${this.dialogues.length} dialogue scenes to audit`)
  }

  /**
   * Find character profile for a speaker
   */
  private findCharacterProfile(speaker: string): CharacterProfile | null {
    for (const [key, profile] of this.characters) {
      if (profile.speakerVariants.some(variant => speaker.includes(variant))) {
        return profile
      }
    }
    return null
  }

  /**
   * Generate voice audit prompt for a character
   */
  private getVoiceAuditPrompt(dialogue: DialogueMatch, profile: CharacterProfile): string {
    return `You are a script editor for Lux Story, auditing dialogue for character voice consistency.

CHARACTER PROFILE: ${profile.name}
Personality: ${profile.personality}
Speech Patterns:
${profile.speechPatterns.map(p => `- ${p}`).join('\n')}
Vocabulary Style: ${profile.vocabularyStyle}
Emotional Range: ${profile.emotionalRange}
Social Style: ${profile.socialStyle}
Common Phrases: ${profile.commonPhrases?.join(', ') || 'None specified'}
Avoid Phrases: ${profile.avoidPhrases?.join(', ') || 'None specified'}

CURRENT DIALOGUE:
Scene ID: ${dialogue.id}
Speaker: ${dialogue.speaker}
Text: "${dialogue.text}"

ANALYSIS REQUIRED:
1. Does this dialogue perfectly match ${profile.name}'s character profile?
2. Is the vocabulary and tone consistent with their personality?
3. Are the speech patterns authentic to this character?

If the dialogue is already perfectly in character, return "APPROVED".
If it needs adjustment, rewrite ONLY the dialogue text to better match the character's voice.
Maintain the same meaning and information, only adjust the delivery and word choice.
Return ONLY the improved text, no commentary or explanation.`
  }

  /**
   * Audit a single dialogue
   */
  async auditDialogue(dialogue: DialogueMatch): Promise<string | null> {
    const profile = this.findCharacterProfile(dialogue.speaker)

    if (!profile) {
      // Not a main character, skip
      return null
    }

    // Skip very short dialogues
    if (dialogue.text.length < 50) {
      console.log(`  ⏭️  Skipping ${dialogue.id} (too short for meaningful audit)`)
      return null
    }

    console.log(`  🎭 Auditing ${profile.name} in ${dialogue.id}`)

    // Validation rules for voice consistency
    const validationRules = [
      (text: string) => {
        // Check if improved text maintains similar length
        const lengthRatio = text.length / dialogue.text.length
        return {
          valid: lengthRatio > 0.7 && lengthRatio < 1.5,
          reason: 'Text length changed too much'
        }
      },
      (text: string) => {
        // Check for character-specific vocabulary
        if (profile.commonPhrases) {
          const hasCharacterVocab = profile.commonPhrases.some(phrase =>
            text.toLowerCase().includes(phrase)
          )
          return {
            valid: true, // Not required but good to have
            reason: ''
          }
        }
        return { valid: true, reason: '' }
      },
      (text: string) => {
        // Check for avoided phrases
        if (profile.avoidPhrases) {
          const hasAvoidedPhrase = profile.avoidPhrases.some(phrase =>
            text.toLowerCase().includes(phrase)
          )
          return {
            valid: !hasAvoidedPhrase,
            reason: hasAvoidedPhrase ? 'Contains out-of-character phrases' : ''
          }
        }
        return { valid: true, reason: '' }
      }
    ]

    const result = await this.improveContent(
      dialogue.text,
      this.getVoiceAuditPrompt(dialogue, profile),
      validationRules
    )

    if (result.improved === 'APPROVED') {
      console.log(`  ✅ ${dialogue.id} voice is consistent`)
      return null
    }

    if (result.confidence < 0.7) {
      console.log(`  ⚠️  Low confidence (${result.confidence}) for ${dialogue.id}`)
      return null
    }

    // Check if the change is meaningful
    const similarity = this.calculateSimilarity(dialogue.text, result.improved)
    if (similarity > 0.95) {
      console.log(`  ✅ ${dialogue.id} needs minimal adjustment`)
      return null
    }

    return result.improved
  }

  /**
   * Calculate text similarity (simple version)
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/)
    const words2 = text2.toLowerCase().split(/\s+/)

    const set1 = new Set(words1)
    const set2 = new Set(words2)

    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])

    return intersection.size / union.size
  }

  /**
   * Generate character voice report
   */
  private generateCharacterReport(): string {
    const characterStats: Map<string, number> = new Map()

    // Count dialogues per character
    for (const dialogue of this.dialogues) {
      for (const [key, profile] of this.characters) {
        if (profile.speakerVariants.some(v => dialogue.speaker.includes(v))) {
          characterStats.set(key, (characterStats.get(key) || 0) + 1)
          break
        }
      }
    }

    let report = '## Character Dialogue Distribution\n\n'
    for (const [key, count] of characterStats) {
      const profile = this.characters.get(key)!
      report += `- **${profile.name}**: ${count} scenes\n`
    }

    return report
  }

  /**
   * Run the full voice audit
   */
  async run(): Promise<void> {
    console.log('🎭 Starting Character Voice Consistency Audit...\n')

    // Extract all dialogues
    await this.extractDialogues()

    // Group dialogues by character for organized processing
    const characterGroups: Map<string, DialogueMatch[]> = new Map()

    for (const dialogue of this.dialogues) {
      const profile = this.findCharacterProfile(dialogue.speaker)
      if (profile) {
        const key = profile.name
        if (!characterGroups.has(key)) {
          characterGroups.set(key, [])
        }
        characterGroups.get(key)!.push(dialogue)
      }
    }

    // Process each character's dialogues
    const improvements: Array<{
      dialogue: DialogueMatch
      improved: string
      character: string
    }> = []

    for (const [character, dialogues] of characterGroups) {
      console.log(`\n📖 Auditing ${character} (${dialogues.length} scenes)`)

      const results = await this.batchProcess(
        dialogues,
        async (dialogue) => {
          const improved = await this.auditDialogue(dialogue)
          if (improved) {
            return { dialogue, improved, character }
          }
          return null
        },
        {
          batchSize: 3,
          delayMs: 2000,
          onProgress: (current, total) => {
            if (current % 5 === 0) {
              console.log(`   Progress: ${current}/${total}`)
            }
          }
        }
      )

      results.forEach(r => {
        if (r) improvements.push(r)
      })
    }

    console.log(`\n✅ Found ${improvements.length} dialogues needing voice adjustment\n`)

    if (improvements.length === 0) {
      console.log('🎉 All character voices are consistent!')
      return
    }

    // Apply improvements
    const stats = await this.applyImprovements(
      this.filePath,
      improvements.map(imp => ({
        match: {
          id: imp.dialogue.id,
          content: imp.dialogue.text,
          metadata: { character: imp.character },
          startIndex: imp.dialogue.textStartIndex,
          endIndex: imp.dialogue.textEndIndex
        },
        result: {
          original: imp.dialogue.text,
          improved: imp.improved,
          confidence: 0.9,
          issues: []
        }
      })),
      {
        minConfidence: 0.7,
        createBackup: true
      }
    )

    // Generate detailed report
    const report = `# Character Voice Consistency Audit Report

Generated: ${new Date().toISOString()}

## Summary
- Total Dialogues Analyzed: ${this.dialogues.length}
- Dialogues Improved: ${stats.applied}
- Dialogues Skipped: ${stats.skipped}

${this.generateCharacterReport()}

## Improvements Made

${improvements.slice(0, 10).map(imp =>
`### ${imp.character} - ${imp.dialogue.id}
**Original:** "${imp.dialogue.text.substring(0, 100)}..."
**Improved:** "${imp.improved.substring(0, 100)}..."
`).join('\n')}

## Voice Consistency Guidelines Applied

### Devon Kumar
- Ensured technical vocabulary and systematic thinking
- Removed overly emotional or intuitive language
- Maintained social awkwardness without meanness

### Maya Chen
- Balanced medical knowledge with robotics passion
- Preserved internal conflict and family references
- Maintained empathetic and warm tone

### Samuel Washington
- Enhanced metaphorical and contemplative language
- Removed prescriptive or judgmental phrases
- Strengthened calming presence

### Jordan Packard
- Emphasized career-switching experience
- Maintained honest, self-aware tone
- Preserved encouragement without false certainty

## Issues Encountered
${stats.errors.length > 0 ? stats.errors.join('\n') : 'None'}

## Next Steps
1. Review the changes in the game to ensure voice consistency
2. Test dialogue flow with the improved character voices
3. Consider creating a style guide for future content
`

    fs.writeFileSync('voice-audit-report.md', report, 'utf-8')
    console.log('\n📄 Report saved to voice-audit-report.md')
    console.log('🎭 Character voice audit complete!')
  }
}

// Run if called directly
async function main() {
  try {
    const auditor = new CharacterVoiceAuditor()
    await auditor.run()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()

export { CharacterVoiceAuditor }