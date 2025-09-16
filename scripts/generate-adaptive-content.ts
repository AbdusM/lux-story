/**
 * Adaptive Content Generator using Gemini API
 *
 * Creates a library of calming, anxiety-reducing narrative snippets
 * that respond to different player psychological states.
 *
 * States supported:
 * - Anxious: Player showing signs of overwhelm
 * - Exploring: Player actively discovering paths
 * - Confident: Player making decisive choices
 * - Struggling: Player needs encouragement
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

interface AdaptiveSnippet {
  id: string
  state: 'anxious' | 'exploring' | 'confident' | 'struggling'
  context: string
  content: string
  sensory?: string // Optional sensory detail
  character?: 'samuel' | 'station' | 'environment'
  tags: string[]
}

interface SnippetLibrary {
  snippets: AdaptiveSnippet[]
  metadata: {
    generated: string
    version: string
    totalSnippets: number
  }
}

class AdaptiveContentGenerator {
  private genAI: GoogleGenerativeAI
  private model: any
  private snippetLibrary: SnippetLibrary

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in .env.local')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    this.snippetLibrary = {
      snippets: [],
      metadata: {
        generated: new Date().toISOString(),
        version: '1.0.0',
        totalSnippets: 0
      }
    }
  }

  /**
   * System prompt for generating adaptive content
   */
  private getSystemPrompt(): string {
    return `You are a writer for Lux Story, a contemplative career exploration game designed to reduce anxiety in youth.

SETTING: Grand Central Terminus - a magical train station in Birmingham where career paths manifest as platforms.

TONE: Gentle, affirming, observational, contemplative. Never preachy or prescriptive.

CHARACTERS:
- Samuel Washington: The wise station keeper, former traveler, source of calm wisdom
- The Station: Has its own subtle consciousness, responds to emotions
- Environment: Platforms pulse with different colors, time flows differently

SENSORY PALETTE:
- Visual: Soft light, golden glow, purple shimmer, blue-grey shadows
- Auditory: Distant train whistles, echoing footsteps, gentle hum
- Tactile: Worn bench wood, cool metal rails, warm air currents
- Temporal: Time slowing, moments stretching, quiet pauses

YOUR TASK:
Generate short, calming narrative snippets (2-3 lines max) that can be shown to players based on their emotional state.
Each snippet should:
1. Acknowledge the feeling without judgment
2. Offer a moment of peace or insight
3. Include at least one sensory detail
4. Feel organic to the Grand Central Terminus setting
5. Be specific to Birmingham when relevant (UAB, Red Mountain, Railroad Park references)

Format each snippet as a JSON object with these fields:
- content: The main text (2-3 lines)
- sensory: A specific sensory detail
- tags: Array of relevant tags

Return ONLY valid JSON, no commentary.`
  }

  /**
   * Generate snippets for a specific emotional state and theme
   */
  async generateSnippets(
    state: 'anxious' | 'exploring' | 'confident' | 'struggling',
    theme: string,
    context: string,
    count: number = 5
  ): Promise<AdaptiveSnippet[]> {
    const prompt = `${this.getSystemPrompt()}

EMOTIONAL STATE: ${state}
THEME: ${theme}
CONTEXT: ${context}

Generate ${count} distinct snippets for this situation. Each should offer a different perspective or moment of comfort.

Example format:
[
  {
    "content": "The station's old clock ticks slower when you breathe deeper. Samuel once said time only rushes those who rush themselves.",
    "sensory": "The rhythmic tick-tock echoes like a heartbeat through the platform",
    "tags": ["time", "breathing", "samuel", "wisdom"]
  }
]`

    try {
      const result = await this.model.generateContent(prompt)
      const responseText = result.response.text()

      // Extract JSON from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        console.error('No valid JSON found in response')
        return []
      }

      const snippets = JSON.parse(jsonMatch[0])

      // Transform and validate snippets
      return snippets.map((snippet: any, index: number) => ({
        id: `${state}-${theme.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        state,
        context,
        content: snippet.content || '',
        sensory: snippet.sensory || undefined,
        character: this.detectCharacter(snippet.content),
        tags: snippet.tags || []
      }))
    } catch (error: any) {
      console.error(`Error generating snippets for ${state}/${theme}:`, error.message)
      return []
    }
  }

  /**
   * Detect which character is referenced in the content
   */
  private detectCharacter(content: string): 'samuel' | 'station' | 'environment' | undefined {
    const lowerContent = content.toLowerCase()
    if (lowerContent.includes('samuel') || lowerContent.includes('station keeper')) {
      return 'samuel'
    }
    if (lowerContent.includes('station') || lowerContent.includes('platform')) {
      return 'station'
    }
    if (lowerContent.includes('light') || lowerContent.includes('air') || lowerContent.includes('sound')) {
      return 'environment'
    }
    return undefined
  }

  /**
   * Generate comprehensive snippet library
   */
  async generateFullLibrary(): Promise<void> {
    console.log('🚀 Generating Adaptive Content Library...\n')

    const configurations = [
      // Anxious states
      {
        state: 'anxious' as const,
        theme: 'Feeling Lost',
        context: 'Player has been exploring platforms without making choices'
      },
      {
        state: 'anxious' as const,
        theme: 'Time Pressure',
        context: 'Player is worried about the midnight deadline'
      },
      {
        state: 'anxious' as const,
        theme: 'Too Many Options',
        context: 'Player is overwhelmed by career choices'
      },
      {
        state: 'anxious' as const,
        theme: 'Family Expectations',
        context: 'Player struggling with parent pressure'
      },

      // Exploring states
      {
        state: 'exploring' as const,
        theme: 'Discovery',
        context: 'Player finding new platforms and paths'
      },
      {
        state: 'exploring' as const,
        theme: 'Connection',
        context: 'Player building relationships with characters'
      },
      {
        state: 'exploring' as const,
        theme: 'Birmingham Pride',
        context: 'Player discovering local opportunities'
      },

      // Confident states
      {
        state: 'confident' as const,
        theme: 'Pattern Recognition',
        context: 'Player understanding their strengths'
      },
      {
        state: 'confident' as const,
        theme: 'Clear Direction',
        context: 'Player making aligned choices'
      },

      // Struggling states
      {
        state: 'struggling' as const,
        theme: 'Need Encouragement',
        context: 'Player has made choices they regret'
      },
      {
        state: 'struggling' as const,
        theme: 'Feeling Stuck',
        context: 'Player not seeing progress'
      },
      {
        state: 'struggling' as const,
        theme: 'Self Doubt',
        context: 'Player questioning their abilities'
      }
    ]

    // Generate snippets for each configuration
    for (const config of configurations) {
      console.log(`📝 Generating ${config.state} snippets: ${config.theme}`)

      const snippets = await this.generateSnippets(
        config.state,
        config.theme,
        config.context,
        5
      )

      this.snippetLibrary.snippets.push(...snippets)

      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Update metadata
    this.snippetLibrary.metadata.totalSnippets = this.snippetLibrary.snippets.length

    console.log(`\n✅ Generated ${this.snippetLibrary.snippets.length} adaptive snippets`)
  }

  /**
   * Generate Birmingham-specific affirmations
   */
  async generateBirminghamAffirmations(): Promise<void> {
    console.log('\n🏙️ Generating Birmingham-specific affirmations...')

    const birminghamThemes = [
      {
        theme: 'Innovation City',
        context: 'Birmingham as hub for healthcare and tech innovation'
      },
      {
        theme: 'Magic City Rising',
        context: 'Birmingham\'s transformation and growth opportunities'
      },
      {
        theme: 'Community Strength',
        context: 'Birmingham\'s collaborative spirit and support networks'
      }
    ]

    for (const theme of birminghamThemes) {
      const snippets = await this.generateSnippets(
        'confident',
        theme.theme,
        theme.context,
        3
      )

      // Tag these specifically as Birmingham content
      snippets.forEach(s => s.tags.push('birmingham'))

      this.snippetLibrary.snippets.push(...snippets)

      await new Promise(resolve => setTimeout(resolve, 1500))
    }
  }

  /**
   * Save the library to file
   */
  saveLibrary(): void {
    const dataDir = path.join(process.cwd(), 'data')

    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const filePath = path.join(dataDir, 'adaptive-snippets.json')

    // Pretty print the JSON
    fs.writeFileSync(
      filePath,
      JSON.stringify(this.snippetLibrary, null, 2),
      'utf-8'
    )

    console.log(`\n💾 Library saved to ${filePath}`)

    // Also generate a markdown report
    this.generateReport()
  }

  /**
   * Generate a human-readable report
   */
  private generateReport(): void {
    const stateGroups = {
      anxious: this.snippetLibrary.snippets.filter(s => s.state === 'anxious'),
      exploring: this.snippetLibrary.snippets.filter(s => s.state === 'exploring'),
      confident: this.snippetLibrary.snippets.filter(s => s.state === 'confident'),
      struggling: this.snippetLibrary.snippets.filter(s => s.state === 'struggling')
    }

    const report = `# Adaptive Content Library Report

Generated: ${this.snippetLibrary.metadata.generated}
Total Snippets: ${this.snippetLibrary.metadata.totalSnippets}

## Distribution by Emotional State

- Anxious: ${stateGroups.anxious.length} snippets
- Exploring: ${stateGroups.exploring.length} snippets
- Confident: ${stateGroups.confident.length} snippets
- Struggling: ${stateGroups.struggling.length} snippets

## Sample Snippets

### Anxious State
${stateGroups.anxious.slice(0, 2).map(s => `- "${s.content}"`).join('\n')}

### Exploring State
${stateGroups.exploring.slice(0, 2).map(s => `- "${s.content}"`).join('\n')}

### Confident State
${stateGroups.confident.slice(0, 2).map(s => `- "${s.content}"`).join('\n')}

### Struggling State
${stateGroups.struggling.slice(0, 2).map(s => `- "${s.content}"`).join('\n')}

## Birmingham-Specific Content
${this.snippetLibrary.snippets
  .filter(s => s.tags.includes('birmingham'))
  .slice(0, 3)
  .map(s => `- "${s.content}"`)
  .join('\n')}

## Integration Instructions

These snippets can be integrated into the game using the following pattern:

\`\`\`typescript
// In useSimpleGame.ts or similar
function getAdaptiveSnippet(playerState: string): string {
  const snippets = adaptiveSnippets.filter(s => s.state === playerState)
  return snippets[Math.floor(Math.random() * snippets.length)].content
}
\`\`\`

The snippets are designed to:
1. Reduce anxiety through acknowledgment and normalization
2. Provide moments of contemplation and peace
3. Reinforce the magical realist atmosphere
4. Connect players to Birmingham opportunities
5. Support the core mission of career exploration without pressure
`

    fs.writeFileSync('adaptive-content-report.md', report, 'utf-8')
    console.log('📄 Report saved to adaptive-content-report.md')
  }

  /**
   * Run the full generation process
   */
  async run(): Promise<void> {
    try {
      await this.generateFullLibrary()
      await this.generateBirminghamAffirmations()
      this.saveLibrary()

      console.log('\n🎉 Adaptive content generation complete!')
      console.log(`   Generated ${this.snippetLibrary.metadata.totalSnippets} snippets`)
      console.log('   Ready for integration into the game')
    } catch (error) {
      console.error('❌ Error during generation:', error)
      // Save what we have even if there was an error
      if (this.snippetLibrary.snippets.length > 0) {
        this.saveLibrary()
        console.log('⚠️  Partial library saved despite errors')
      }
    }
  }
}

// Run if called directly
async function main() {
  const generator = new AdaptiveContentGenerator()
  await generator.run()
}

if (require.main === module) {
  main().catch(console.error)
}

export { AdaptiveContentGenerator }