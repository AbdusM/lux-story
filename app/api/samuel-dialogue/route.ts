/**
 * Samuel Dialogue Generation API Route
 *
 * Generates skill-aware, personalized Samuel dialogue using Gemini 1.5 Flash
 * Samuel "notices" player skill patterns through eerily observant wisdom
 *
 * POST /api/samuel-dialogue
 * Body: {
 *   nodeId: string,
 *   playerPersona: PlayerPersona,
 *   gameContext: { platforms: string[], trust: number }
 * }
 * Returns: { dialogue: string, emotion: string, confidence: number }
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { PlayerPersona } from '@/lib/player-persona'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

interface SamuelDialogueRequest {
  nodeId: string
  playerPersona: PlayerPersona
  gameContext: {
    platformsVisited: string[]
    samuelTrust: number
    currentLocation: string
  }
}

interface SamuelDialogueResponse {
  dialogue: string
  emotion: 'warm' | 'knowing' | 'reflective' | 'gentle'
  confidence: number
  generatedAt: number
}

/**
 * Build skill-aware system prompt for Samuel
 */
function buildSamuelSystemPrompt(persona: PlayerPersona, context: any): string {
  // Extract skill context
  const topSkills = persona.topSkills.slice(0, 3)
  const skillContexts = topSkills.map(skill => {
    const demo = persona.skillDemonstrations[skill.skill]
    return {
      skill: skill.skill,
      count: skill.count,
      latestContext: demo?.latestContext || '',
      latestScene: demo?.latestScene || ''
    }
  })

  // Determine dominant pattern tendency
  const dominantPattern = persona.dominantPatterns[0] || 'exploring'
  const helperVsAnalyzer = persona.socialOrientation === 'helper' ? 'Helper' :
                           persona.problemApproach === 'analytical' ? 'Analyzer' : 'Explorer'

  return `You are Samuel Washington, the wise Station Keeper at Grand Central Terminus.

CORE IDENTITY:
- Former Southern Company engineer who chose mentorship over management
- Birmingham native who guides young travelers toward their paths
- You NOTICE patterns in how people approach choices
- Your wisdom comes from OBSERVATION, not mysticism
- You connect skill demonstrations to career paths naturally

PLAYER CONTEXT (What you've observed):
Recent Skills Demonstrated:
${skillContexts.map(s => `  - ${formatSkillName(s.skill)}: ${s.count} times
    Latest: ${s.latestContext}
    Scene: ${s.latestScene}`).join('\n')}

Behavioral Pattern: ${helperVsAnalyzer}
Platforms Explored: ${context.platformsVisited.join(', ') || 'None yet'}
Trust Level: ${context.samuelTrust}/10
Response Style: ${persona.responseSpeed}

YOUR DIALOGUE APPROACH:
1. Never explicitly say "you demonstrated X skill"
2. Show you noticed through specific observation
3. Connect observations to career paths naturally
4. Keep your warm, gentle voice
5. 2-4 sentences maximum
6. Reference their ACTUAL choice contexts when possible

SKILL-AWARE DIALOGUE EXAMPLES:

If critical_thinking + emotional_intelligence demonstrated:
"I watched how you helped Maya see bridges where others see walls. That kind of thinking -
finding integration instead of either/or - it's what makes Platform 7½ appear for some travelers."

If communication + adaptability demonstrated:
"You're seeing what people need before they ask for it. Devon needed confidence in his systems thinking.
Maya needed permission to dream differently. That's rare. Healthcare? Teaching? Both need that."

If creativity + problem_solving demonstrated:
"Five different approaches to the same festival planning challenge. Most travelers pick one path and
stick to it. You're mapping possibilities. Data analysis roles reward that - seeing patterns across
systems most people keep separate."

If leadership + collaboration demonstrated:
"You built that study group without even trying. Just asked questions that made people want to work together.
Birmingham's startup scene - Innovation Depot, Velocity Accelerator - they need organizers who lead by listening."

If adaptability + patience demonstrated:
"Three platforms in one night. Some travelers call that indecision. I call it thorough exploration.
The best career paths often emerge from unexpected combinations. Take your time."

CRITICAL REQUIREMENTS:
- Reference their SPECIFIC skill contexts from above
- Connect to Birmingham opportunities when appropriate
- Maintain Samuel's character: warm, observant, patient
- NO gamification language ("you scored", "you earned", "level up")
- NO explicit skill naming ("your emotional intelligence is high")
- SHOW observation through natural wisdom

Generate dialogue that feels like Samuel noticed something specific about THIS traveler's journey.`
}

/**
 * Build the specific dialogue generation prompt
 */
function buildDialoguePrompt(nodeId: string, persona: PlayerPersona, context: any): string {
  const topSkill = persona.topSkills[0]
  const secondSkill = persona.topSkills[1]
  const skillContext = persona.skillDemonstrations[topSkill?.skill]?.latestContext || ''

  // Node-specific guidance
  const nodeGuidance: Record<string, string> = {
    'samuel_hub_initial': `This is a general check-in. Notice their recent skill pattern and gently guide them toward relevant platforms.`,
    'samuel_wisdom_validation': `They're feeling uncertain. Reference their demonstrated ${topSkill?.skill || 'strengths'} to build confidence.`,
    'samuel_backstory_intro': `They're asking about your past. Connect your engineering→mentorship journey to their ${topSkill?.skill || 'pattern'}.`,
    'samuel_career_bridge': `Help them see how their skills (especially ${topSkill?.skill || 'their strengths'}) connect to career paths.`,
    'samuel_platform_guidance': `Guide them toward platforms that match their ${topSkill?.skill || 'demonstrated skills'}.`
  }

  const guidance = nodeGuidance[nodeId] || 'Provide general wisdom based on their demonstrated skills.'

  return `CURRENT MOMENT:
Node: ${nodeId}
Context: ${guidance}

THEIR LATEST DEMONSTRATION:
"${skillContext}"

GENERATE SAMUEL'S RESPONSE:
- 2-4 sentences
- Reference their specific skill demonstration naturally
- Connect to career paths or platforms when appropriate
- Maintain warm, observant tone
- NO explicit skill naming

Samuel's dialogue:`
}

/**
 * Format skill name from camelCase to Title Case
 */
function formatSkillName(skill: string): string {
  return skill
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * POST /api/samuel-dialogue
 * Generates skill-aware Samuel dialogue
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Validate API key
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured in .env.local' },
        { status: 500 }
      )
    }

    // 2. Parse request
    const body: SamuelDialogueRequest = await request.json()
    const { nodeId, playerPersona, gameContext } = body

    if (!nodeId || !playerPersona) {
      return NextResponse.json(
        { error: 'Missing required fields: nodeId, playerPersona' },
        { status: 400 }
      )
    }

    // 3. Validate persona has skill data
    if (!playerPersona.topSkills || playerPersona.topSkills.length === 0) {
      // Return generic Samuel dialogue for new players
      return NextResponse.json({
        dialogue: "Every traveler starts somewhere. Take your time exploring the platforms. The right path reveals itself through experience, not overthinking.",
        emotion: 'warm' as const,
        confidence: 1.0,
        generatedAt: Date.now(),
        note: 'Generic dialogue - no skill demonstrations yet'
      })
    }

    // 4. Build prompts
    const systemPrompt = buildSamuelSystemPrompt(playerPersona, gameContext)
    const dialoguePrompt = buildDialoguePrompt(nodeId, playerPersona, gameContext)

    console.log('[SamuelDialogue] Generating for node:', nodeId)
    console.log('[SamuelDialogue] Top skill:', playerPersona.topSkills[0]?.skill)
    console.log('[SamuelDialogue] Demonstrations:', playerPersona.topSkills[0]?.count)

    // 5. Call Gemini API
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8, // Slightly creative for natural variation
        maxOutputTokens: 150, // Keep Samuel concise
        topP: 0.9,
      }
    })

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: systemPrompt + '\n\n' + dialoguePrompt
        }]
      }]
    })

    const response = result.response
    const dialogue = response.text().trim()

    // 6. Validate response quality
    if (!dialogue || dialogue.length < 20) {
      throw new Error('Generated dialogue too short')
    }

    if (dialogue.length > 500) {
      throw new Error('Generated dialogue too long (Samuel should be concise)')
    }

    // Check for forbidden patterns
    const forbiddenPatterns = [
      /you demonstrated/i,
      /you scored/i,
      /level up/i,
      /points/i,
      /your.*skill.*is/i
    ]

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(dialogue)) {
        console.warn('[SamuelDialogue] Warning: Dialogue contains forbidden pattern:', pattern)
      }
    }

    // 7. Determine emotion from content
    const emotion = determineEmotion(dialogue)

    console.log('[SamuelDialogue] Success:', dialogue.substring(0, 50) + '...')

    // 8. Return response
    const responseData: SamuelDialogueResponse = {
      dialogue,
      emotion,
      confidence: 0.95,
      generatedAt: Date.now()
    }

    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error('[SamuelDialogue] Error:', error)

    // Fallback to generic Samuel wisdom
    return NextResponse.json({
      dialogue: "Time moves differently for those who know why they're here. Keep exploring, keep connecting with the travelers you meet. Your path will reveal itself.",
      emotion: 'reflective' as const,
      confidence: 0.5,
      generatedAt: Date.now(),
      error: 'Generated fallback due to error',
      originalError: error.message
    })
  }
}

/**
 * Determine Samuel's emotion from dialogue content
 */
function determineEmotion(dialogue: string): 'warm' | 'knowing' | 'reflective' | 'gentle' {
  const lowerDialogue = dialogue.toLowerCase()

  if (lowerDialogue.includes('noticed') || lowerDialogue.includes('watching') || lowerDialogue.includes('observed')) {
    return 'knowing'
  }

  if (lowerDialogue.includes('time') || lowerDialogue.includes('journey') || lowerDialogue.includes('path')) {
    return 'reflective'
  }

  if (lowerDialogue.includes('take your time') || lowerDialogue.includes('no rush') || lowerDialogue.includes('it\'s okay')) {
    return 'gentle'
  }

  return 'warm'
}
