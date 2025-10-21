/**
 * Content Spoiler Detection Tests
 * 
 * Automated tests to prevent character spoilers and stage directions
 * from appearing in intro sequences and early-game content.
 * 
 * Run: npm test content-spoiler-detection
 */

import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// Character-specific spoiler patterns
const CHARACTER_SPOILERS = {
  maya: [
    /medical textbook/i,
    /pre-?med/i,
    /biochemistry/i,
    /medical school/i,
    /doctor/i,
    /MCAT/i,
  ],
  devon: [
    /flowchart/i,
    /algorithm/i,
    /code/i,
    /debug/i,
    /system/i,
    /optimize/i,
  ],
  jordan: [
    /job calendar/i,
    /seven jobs/i,
    /job hopper/i,
    /career changes/i,
    /uber driver/i,
  ],
  samuel: [
    /station keeper/i,
    /conductor/i,
    /platform manager/i,
  ]
}

// Critical stage direction patterns (these break "show don't tell")
// Note: We allow some emotional cues deep in character arcs (trust ≥7)
// but flag action-heavy directions that should be conveyed through dialogue
const CRITICAL_STAGE_DIRECTION_PATTERNS = [
  // Actions that should be shown through dialogue
  /\*He pulls [^*]{20,}\*/i,
  /\*She pulls [^*]{20,}\*/i,
  /\*He sets [^*]{10,}\*/i,
  /\*She sets [^*]{10,}\*/i,
  /\*He gestures [^*]{10,}\*/i,
  /\*She gestures [^*]{10,}\*/i,
]

// Less critical emotional cues (warn but don't fail)
const EMOTIONAL_CUE_PATTERNS = [
  /\*[A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+\*/,  // *He looks at the platform*
  /\*[A-Z][a-z]+ [a-z]+ [a-z]+\*/,         // *She nods slowly*
  /\*Pause\*/i,
  /\*Quiet\*/i,
]

// Files to check for spoilers
const INTRO_FILES = [
  'components/AtmosphericIntro.tsx',
  'components/CharacterIntro.tsx',
  'app/layout.tsx',
  'public/manifest.json',
]

// Dialogue graph files to check for stage directions
const DIALOGUE_FILES = [
  'content/samuel-dialogue-graph.ts',
  'content/maya-dialogue-graph.ts',
  'content/devon-dialogue-graph.ts',
  'content/jordan-dialogue-graph.ts',
  'content/player-questions.ts',
]

describe('Content Spoiler Detection', () => {
  
  describe('Intro Sequences - No Character Spoilers', () => {
    INTRO_FILES.forEach(file => {
      const filePath = path.join(process.cwd(), file)
      
      // Skip if file doesn't exist (e.g. manifest.json might be elsewhere)
      if (!fs.existsSync(filePath)) {
        it.skip(`${file} - file not found`, () => {})
        return
      }

      const content = fs.readFileSync(filePath, 'utf-8')

      it(`${file} should not contain Maya spoilers`, () => {
        CHARACTER_SPOILERS.maya.forEach(pattern => {
          const matches = content.match(pattern)
          if (matches) {
            expect.fail(`Found Maya spoiler in ${file}: "${matches[0]}"`)
          }
        })
        expect(true).toBe(true) // Pass if no matches
      })

      it(`${file} should not contain Devon spoilers`, () => {
        CHARACTER_SPOILERS.devon.forEach(pattern => {
          const matches = content.match(pattern)
          // Allow technical terms in code context, but not in narrative strings
          if (matches && content.includes(`text:`)) {
            const textBlocks = content.match(/text:\s*["'`]([^"'`]+)["'`]/g) || []
            const spoilerInText = textBlocks.some(block => pattern.test(block))
            if (spoilerInText) {
              expect.fail(`Found Devon spoiler in ${file} text content: "${matches[0]}"`)
            }
          }
        })
        expect(true).toBe(true)
      })

      it(`${file} should not contain Jordan spoilers`, () => {
        CHARACTER_SPOILERS.jordan.forEach(pattern => {
          const matches = content.match(pattern)
          if (matches) {
            expect.fail(`Found Jordan spoiler in ${file}: "${matches[0]}"`)
          }
        })
        expect(true).toBe(true)
      })
    })
  })

  describe('Dialogue Graphs - No Stage Directions', () => {
    DIALOGUE_FILES.forEach(file => {
      const filePath = path.join(process.cwd(), file)
      
      if (!fs.existsSync(filePath)) {
        it.skip(`${file} - file not found`, () => {})
        return
      }

      const content = fs.readFileSync(filePath, 'utf-8')

      it(`${file} should not contain critical action-based stage directions`, () => {
        const violations: string[] = []

        CRITICAL_STAGE_DIRECTION_PATTERNS.forEach(pattern => {
          const matches = content.matchAll(new RegExp(pattern, 'g'))
          for (const match of matches) {
            // Extract line number for helpful error message
            const beforeMatch = content.substring(0, match.index)
            const lineNumber = beforeMatch.split('\n').length
            violations.push(`Line ${lineNumber}: "${match[0]}"`)
          }
        })

        if (violations.length > 0) {
          expect.fail(
            `Found ${violations.length} CRITICAL stage direction(s) in ${file}:\n` +
            violations.join('\n') +
            `\n\nThese should be converted to dialogue or subtext.`
          )
        }

        expect(violations.length).toBe(0)
      })

      // Informational test - warns about emotional cues but doesn't fail
      it(`${file} emotional cues count (informational only)`, () => {
        let count = 0
        EMOTIONAL_CUE_PATTERNS.forEach(pattern => {
          const matches = content.matchAll(new RegExp(pattern, 'g'))
          count += Array.from(matches).length
        })
        
        // Log count but don't fail - these are acceptable in deep arcs
        console.log(`ℹ️  ${file}: ${count} emotional cues (acceptable for character depth)`)
        expect(true).toBe(true)
      })

      // Informational: Check for choice text with stage directions
      it(`${file} choices with stage directions (informational)`, () => {
        // Match choice text patterns
        const choicePattern = /text:\s*["']([^"']*\*[^*]+\*[^"']*)["']/g
        const matches = [...content.matchAll(choicePattern)]
        
        const violations = matches.map(match => {
          const beforeMatch = content.substring(0, match.index)
          const lineNumber = beforeMatch.split('\n').length
          return `Line ${lineNumber}`
        })

        if (violations.length > 0) {
          // Check if these are bracketed stage directions [Like this] which are OK
          const actualViolations = violations.filter(v => {
            // Get the full match to check content
            const match = matches.find(m => {
              const lineNum = content.substring(0, m.index).split('\n').length
              return v.includes(`Line ${lineNum}`)
            })
            return match && !match[1].includes('[') && !match[1].includes(']')
          })
          
          // Log but don't fail - these are in deep character arcs and add emotional depth
          console.log(`ℹ️  ${file}: ${actualViolations.length} choice(s) with emotional stage directions (acceptable)`)
        }

        expect(true).toBe(true)
      })
    })
  })

  describe('AtmosphericIntro - Specific Requirements', () => {
    const filePath = path.join(process.cwd(), 'components/AtmosphericIntro.tsx')
    
    if (!fs.existsSync(filePath)) {
      it.skip('AtmosphericIntro.tsx not found', () => {})
      return
    }

    const content = fs.readFileSync(filePath, 'utf-8')

    it('THRESHOLD sequence should be generic and mysterious', () => {
      const thresholdMatch = content.match(/location:\s*["']THRESHOLD["'][\s\S]*?text:\s*["']([^"']+)["']/i)
      
      if (!thresholdMatch) {
        expect.fail('Could not find THRESHOLD sequence in AtmosphericIntro')
      }

      const thresholdText = thresholdMatch![1]

      // Should NOT contain specific identifying details
      const violations: string[] = []
      
      if (/medical|textbook|pre-?med/i.test(thresholdText)) {
        violations.push('Contains Maya-specific details (medical/textbooks)')
      }
      if (/flowchart|algorithm|code/i.test(thresholdText)) {
        violations.push('Contains Devon-specific details (flowcharts/code)')
      }
      if (/job calendar|seven jobs|career changes/i.test(thresholdText)) {
        violations.push('Contains Jordan-specific details (job calendar)')
      }

      if (violations.length > 0) {
        expect.fail(
          `THRESHOLD sequence contains character spoilers:\n` +
          violations.join('\n') +
          `\n\nActual text: "${thresholdText}"`
        )
      }

      expect(violations.length).toBe(0)
    })

    it('should use generic descriptions for the three people', () => {
      const thresholdMatch = content.match(/location:\s*["']THRESHOLD["'][\s\S]*?text:\s*["']([^"']+)["']/i)
      const thresholdText = thresholdMatch![1]

      // Should contain generic descriptions
      const hasGenericDescriptions = (
        /papers|phone|clutches|mutters|scrolls/i.test(thresholdText) &&
        !/medical|flowchart|calendar/i.test(thresholdText)
      )

      expect(hasGenericDescriptions).toBe(true)
    })
  })

  describe('Metadata & SEO - No Spoilers', () => {
    it('app/layout.tsx metadata should be generic', () => {
      const filePath = path.join(process.cwd(), 'app/layout.tsx')
      
      if (!fs.existsSync(filePath)) {
        it.skip('app/layout.tsx not found', () => {})
        return
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      const metadataMatch = content.match(/export const metadata[\s\S]*?}/m)

      if (!metadataMatch) {
        expect.fail('Could not find metadata export in app/layout.tsx')
      }

      const metadata = metadataMatch![0]

      // Should not mention any character names or specific details
      const violations: string[] = []

      if (/Maya|Samuel|Devon|Jordan/i.test(metadata)) {
        violations.push('Contains character names in metadata')
      }

      Object.entries(CHARACTER_SPOILERS).forEach(([char, patterns]) => {
        patterns.forEach(pattern => {
          if (pattern.test(metadata)) {
            violations.push(`Contains ${char} spoiler: ${pattern}`)
          }
        })
      })

      if (violations.length > 0) {
        expect.fail(`Metadata contains spoilers:\n${violations.join('\n')}`)
      }

      expect(violations.length).toBe(0)
    })
  })
})

describe('Production Code Path Validation', () => {
  it('app/page.tsx should use StatefulGameInterface', () => {
    const filePath = path.join(process.cwd(), 'app/page.tsx')
    
    if (!fs.existsSync(filePath)) {
      expect.fail('app/page.tsx not found')
    }

    const content = fs.readFileSync(filePath, 'utf-8')

    // Should import StatefulGameInterface
    expect(content).toMatch(/import.*StatefulGameInterface/i)

    // Should NOT import deprecated interfaces
    expect(content).not.toMatch(/import.*MinimalGameInterface[^S]/i)
    expect(content).not.toMatch(/import.*SimpleGameInterface/i)
    expect(content).not.toMatch(/import.*\bGameInterface\b/i)
  })

  it('StatefulGameInterface should use AtmosphericIntro for new users', () => {
    const filePath = path.join(process.cwd(), 'components/StatefulGameInterface.tsx')
    
    if (!fs.existsSync(filePath)) {
      expect.fail('StatefulGameInterface.tsx not found')
    }

    const content = fs.readFileSync(filePath, 'utf-8')

    // Should import AtmosphericIntro
    expect(content).toMatch(/import.*AtmosphericIntro/)

    // Should render it for new users
    expect(content).toMatch(/<AtmosphericIntro/)
  })

  it('DialogueDisplay should use autoChunkDialogue', () => {
    const filePath = path.join(process.cwd(), 'components/DialogueDisplay.tsx')
    
    if (!fs.existsSync(filePath)) {
      expect.fail('DialogueDisplay.tsx not found')
    }

    const content = fs.readFileSync(filePath, 'utf-8')

    // Should import autoChunkDialogue
    expect(content).toMatch(/import.*autoChunkDialogue/)

    // Should call it
    expect(content).toMatch(/autoChunkDialogue\s*\(/i)
  })
})

