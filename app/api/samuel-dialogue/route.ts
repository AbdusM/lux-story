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
import { logger } from '@/lib/logger'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Rate limiter: 20 requests per hour (prevents Gemini API abuse)
const samuelDialogueLimiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
})

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

interface DialogueContext {
  trustLevel?: number
  lastInteraction?: string
  platformsVisited?: string[]
  samuelTrust?: number
  [key: string]: unknown
}

/**
 * Build skill-aware system prompt for Samuel
 */
function buildSamuelSystemPrompt(persona: PlayerPersona, context: DialogueContext): string {
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

  // Determine helper vs analyzer tendency
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
Platforms Explored: ${(context.platformsVisited ?? []).join(', ') || 'None yet'}
Trust Level: ${context.samuelTrust ?? 0}/10
Response Style: ${persona.responseSpeed}

YOUR DIALOGUE APPROACH:
1. **BE CONCISE:** 1-2 sentences maximum. (Max 150 characters preferred).
2. **BE DIRECT:** Do NOT use phrases like "I noticed", "I observed", "It seems", "I see". Just say the insight.
3. **ACTIVE VOICE:** "You built connection" instead of "I saw you building connection".
4. **NO FLUFF:** No greetings, no "Ah,", no "Hmm,". Start directly with the substance.
5. Reference their ACTUAL choice contexts when possible.

SKILL-AWARE DIALOGUE EXAMPLES:

If critical_thinking + emotional_intelligence demonstrated:
"You found a bridge for Maya where others only saw walls. That talent for integration is exactly what reveals Platform 7½."

If communication + adaptability demonstrated:
"You're seeing what people need before they ask. Devon needed confidence; Maya needed permission. Healthcare and teaching both thrive on that instinct."

If creativity + problem_solving demonstrated:
"Five approaches to one festival challenge. Most pick one path; you mapped the whole territory. Data analysis rewards that kind of systems thinking."

If leadership + collaboration demonstrated:
"You didn't just join the group; you built it by asking the right questions. Birmingham's startup scene needs organizers who lead by listening."

If adaptability + patience demonstrated:
"Three platforms in one night isn't indecision—it's thoroughness. The best career paths often emerge from unexpected combinations."

CRITICAL REQUIREMENTS:
- Reference their SPECIFIC skill contexts from above
- Connect to Birmingham opportunities when appropriate
- Maintain Samuel's character: warm, observant, patient
- NO gamification language ("you scored", "you earned", "level up")
- NO explicit skill naming ("your emotional intelligence is high")
- NO meta-commentary ("I am noticing...")

Generate dialogue that feels like a direct, punchy insight from a wise mentor.`
}

/**
 * Build the specific dialogue generation prompt
 */
function buildDialoguePrompt(nodeId: string, persona: PlayerPersona, _context: DialogueContext): string {
  const topSkill = persona.topSkills[0]
  const skillContext = persona.skillDemonstrations[topSkill?.skill]?.latestContext || ''

  // Node-specific guidance
  const nodeGuidance: Record<string, string> = {
    'samuel_hub_initial': `General check-in. Guide them toward relevant platforms based on their patterns.`,
    'samuel_wisdom_validation': `Matches their uncertainty with confidence. Reference their demonstrated strengths.`,
    'samuel_backstory_intro': `Connect your engineering background to their current pattern.`,
    'samuel_career_bridge': `Bridge their demonstrated skills to a real-world career path.`,
    'samuel_platform_guidance': `Direct them to a platform that suits their skills.`
  }

  const guidance = nodeGuidance[nodeId] || 'Provide specific wisdom based on their actions.'

  return `CURRENT MOMENT:
Node: ${nodeId}
Context: ${guidance}

THEIR LATEST DEMONSTRATION:
"${skillContext}"

GENERATE SAMUEL'S RESPONSE:
- 1-2 sentences MAX
- Reference the specific action
- NO "I noticed" / "I see"
- Direct, warm, punchy

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
  const startTime = Date.now()

  logger.debug('Request received', { operation: 'api.samuel-dialogue', timestamp: new Date().toISOString() })

  // Rate limiting: 20 requests per hour
  const ip = getClientIp(request)
  try {
    await samuelDialogueLimiter.check(ip, 20)
  } catch {
    return NextResponse.json(
      { error: 'Too many dialogue generation requests. Please try again in an hour.' },
      {
        status: 429,
        headers: {
          'Retry-After': '3600' // 1 hour in seconds
        }
      }
    )
  }

  try {
    // 1. Validate API key
    if (!GEMINI_API_KEY) {
      console.error('❌ [API:SamuelDialogue] GEMINI_API_KEY not configured')
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured in .env.local' },
        { status: 500 }
      )
    }

    // 2. Parse request
    const body: SamuelDialogueRequest = await request.json()
    const { nodeId, playerPersona, gameContext } = body

    logger.debug('Request body', {
      operation: 'api.samuel-dialogue.request',
      nodeId,
      hasPersona: !!playerPersona,
      topSkills: playerPersona?.topSkills?.slice(0, 3).map(s => `${s.skill}:${s.count}`),
      samuelTrust: gameContext?.samuelTrust,
      platformsVisited: gameContext?.platformsVisited?.length || 0
    })

    if (!nodeId || !playerPersona) {
      console.error('❌ [API:SamuelDialogue] Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: nodeId, playerPersona' },
        { status: 400 }
      )
    }

    // 3. Validate persona has skill data
    if (!playerPersona.topSkills || playerPersona.topSkills.length === 0) {
      logger.debug('No skill demonstrations yet, using generic dialogue', { operation: 'api.samuel-dialogue.generic' })
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

    logger.debug('Calling Gemini', {
      operation: 'api.samuel-dialogue.gemini-call',
      model: 'gemini-1.5-flash',
      promptLength: systemPrompt.length + dialoguePrompt.length,
      temperature: 0.8
    })

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
    const generationTime = Date.now() - startTime

    logger.debug('Gemini response', {
      operation: 'api.samuel-dialogue.gemini-response',
      dialogueLength: dialogue.length,
      generationTimeMs: generationTime,
      preview: dialogue.substring(0, 50) + '...'
    })

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

    let hasForbiddenPatterns = false
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(dialogue)) {
        console.warn('⚠️ [API:SamuelDialogue] Gamification detected:', { pattern: pattern.toString() })
        hasForbiddenPatterns = true
      }
    }

    // 7. Determine emotion from content
    const emotion = determineEmotion(dialogue)

    // 8. Return response
    const responseData: SamuelDialogueResponse = {
      dialogue,
      emotion,
      confidence: 0.95,
      generatedAt: Date.now()
    }

    logger.debug('Sending response', {
      operation: 'api.samuel-dialogue.response',
      success: true,
      emotion,
      confidence: responseData.confidence,
      generationTimeMs: generationTime,
      hasForbiddenPatterns
    })

    return NextResponse.json(responseData)

  } catch (error: unknown) {
    const errorTime = Date.now() - startTime
    const err = error as { message?: string }
    console.error('❌ [API:SamuelDialogue] Error:', {
      error: err.message,
      timeMs: errorTime
    })

    // Fallback to generic Samuel wisdom
    return NextResponse.json({
      dialogue: "Time moves differently for those who know why they're here. Keep exploring, keep connecting with the travelers you meet. Your path will reveal itself.",
      emotion: 'reflective' as const,
      confidence: 0.5,
      generatedAt: Date.now(),
      error: 'Generated fallback due to error',
      originalError: err.message
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
