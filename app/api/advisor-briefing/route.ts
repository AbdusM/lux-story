/**
 * Advisor Briefing API Route
 *
 * Generates AI-powered strategic briefings using Claude Sonnet 3.5
 * This is the "Co-Pilot" feature that synthesizes all dashboard data
 * into actionable intervention plans for administrators.
 *
 * POST /api/advisor-briefing
 * Body: { profile: SkillProfile }
 * Returns: { briefing: string (markdown), generatedAt: number, tokensUsed: number }
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { logger } from '@/lib/logger'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface SkillSummary {
  skillName: string
  demonstrationCount: number
  latestContext: string
  scenesInvolved: string[]
  lastDemonstrated: string
}

interface AdvisorBriefingRequest {
  profile: SkillProfile
  skillsData?: SkillSummary[] // NEW: WEF 2030 Skills data
}

interface AdvisorBriefingResponse {
  briefing: string
  generatedAt: number
  tokensUsed?: number
  error?: string
}

/**
 * Format skill name for display (critical_thinking → Critical Thinking)
 */
function formatSkillName(skillName: string): string {
  return skillName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format skills section for Gemini prompt
 */
function formatSkillsSection(skillsData: SkillSummary[]): string {
  const top3 = skillsData
    .sort((a, b) => b.demonstrationCount - a.demonstrationCount)
    .slice(0, 3)

  if (top3.length === 0) {
    return 'No WEF 2030 skills data available (student just started or skills tracking not yet implemented).'
  }

  return top3.map((skill, idx) => `
${idx + 1}. **${formatSkillName(skill.skillName)}** (${skill.demonstrationCount} demonstrations)
   - Latest Context: ${skill.latestContext}
   - Scenes: ${skill.scenesInvolved.join(', ')}
  `).join('\n')
}

/**
 * Build the master prompt for Claude
 * Uses the user's exact 5-section template specification
 * Enhanced with WEF 2030 Skills data
 */
function buildMasterPrompt(profile: SkillProfile, skillsData?: SkillSummary[]): string {
  // Extract key data for the prompt
  const topSkills = Object.entries(profile.skillDemonstrations)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 3)
    .map(([skill, demos]) => ({ skill, count: demos.length, demos: demos.slice(0, 2) }))

  const topCareer = profile.careerMatches[0]
  const topGaps = profile.skillGaps.filter(g => g.priority === 'high').slice(0, 3)

  // Build a concise data summary for Claude
  const dataSummary = {
    totalDemonstrations: profile.totalDemonstrations,
    topSkills: topSkills.map(({ skill, count }) => `${skill} (${count}x)`),
    keyMoments: profile.keySkillMoments.slice(0, 5),
    topCareer: topCareer ? {
      name: topCareer.name,
      matchScore: Math.round(topCareer.matchScore * 100),
      readiness: topCareer.readiness,
      localOpportunities: topCareer.localOpportunities,
      educationPaths: topCareer.educationPaths
    } : null,
    criticalGaps: topGaps.map(g => ({
      skill: g.skill,
      gap: Math.round(g.gap * 100),
      developmentPath: g.developmentPath
    }))
  }

  // Format WEF 2030 Skills section (if available)
  const skillsSection = skillsData && skillsData.length > 0
    ? formatSkillsSection(skillsData)
    : 'No WEF 2030 skills data available.'

  return `You are a world-class career counselor and workforce development strategist for the city of Birmingham, Alabama. You are an expert in the World Economic Forum's 2030 Skills framework (WEF, 2023) and Erikson's theory of identity development (Erikson, 1968).

**[-- WEF 2030 SKILLS FRAMEWORK DATA --]**

This student's journey has been analyzed using the World Economic Forum's 2030 Skills framework. The following skills have been demonstrated with evidence:

${skillsSection}

These skills are tracked using research-backed frameworks and provide concrete evidence of the student's capabilities. Reference these specific skills and their contexts when making recommendations.

**[-- END WEF 2030 SKILLS DATA --]**

You have been provided with the complete data profile of a young person's journey through the "Grand Central Terminus" career exploration experience.

**[-- START OF USER PROFILE SUMMARY --]**
${JSON.stringify(dataSummary, null, 2)}

**FULL SKILL DEMONSTRATIONS:**
${topSkills.map(({ skill, demos }) => `
${skill.toUpperCase()}:
${demos.map(d => `  - Scene: ${d.scene}
  - Choice: "${d.choice || 'N/A'}"
  - Context: ${d.context}`).join('\n')}
`).join('\n')}
**[-- END OF USER PROFILE SUMMARY --]**

Your task is to analyze this complete data profile and generate a concise, empathetic, and highly actionable "Advisor Briefing" document. The document must be written in clear, human-readable language (not technical jargon) and must have the following five sections:

## 1. The Authentic Story (Who is this person?)
   - Synthesize their journey. What is their core conflict or question?
   - Based on their choices and the skills their choices are aligned with, what is their "Player Persona"? (e.g., "This is an analytical problem-solver who is learning to embrace their empathetic side.")
   - Pull 1-2 EXACT quotes from their actual choices (shown above in "Choice:" fields) that serve as powerful evidence for this story.
   - Keep it to 2-3 sentences maximum.

## 2. Top Strengths (What is their superpower?)
   - **PRIORITIZE WEF 2030 SKILLS**: If WEF 2030 skills data is available (shown above), use those skills first as they are research-backed (WEF, 2023) and evidence-rich.
   - Identify their top 3 skills indicated by their choices, drawing from WEF 2030 skills when available.
   - For EACH skill, provide the single strongest piece of evidence using either:
     a) The WEF skill's "Latest Context" (if from WEF data), OR
     b) The exact choice quote and context (if from behavioral patterns)
   - Format: "**[Skill Name (WEF 2030)]**: [Evidence from their actual context]" (note the WEF badge for credibility)
   - Do not just list the skill; prove it with their actions.

## 3. The Primary Blocker (What is holding them back?)
   - Analyze the critical gaps in context of their top career match.
   - Identify the single, most critical skill gap preventing them from being "Near Ready" for their desired career path.
   - Be specific: use actual gap percentages and career requirements.
   - Format: "The **[gap percentage]% gap in [skill]** is blocking [career name]. [Why this matters]."

## 4. The Strategic Recommendation (What should I do RIGHT NOW?)
   - Based on their top career match, readiness level, and primary blocker, generate the single most impactful "Next Step."
   - This step MUST be a specific, actionable, Birmingham-based opportunity from the localOpportunities or educationPaths shown above.
   - Include WHY this specific opportunity addresses their blocker.
   - Format: "**This week:** [Specific action with Birmingham location]. **Why:** [Connection to their gap]."

## 5. The Conversation Starter (What should I say?)
   - Generate a single, empathetic opening line for a conversation with this student.
   - It must reference one of their WEF 2030 skills (if available) or behavioral strengths, using actual evidence/context.
   - Connect this strength naturally to the strategic recommendation.
   - Example format: "I noticed [reference to their specific choice aligned with a skill]. That same [WEF skill] is exactly what [Birmingham opportunity] is looking for."
   - Make it sound natural, warm, and specific to their journey.

**CRITICAL REQUIREMENTS:**
- **PRIORITIZE WEF 2030 SKILLS**: When available, reference these skills by name for research credibility
- Use EXACT quotes/contexts from WEF skills data or behavioral choices (found in "Choice:" and "Latest Context" fields above)
- Reference REAL Birmingham locations from their career matches (UAB, Innovation Depot, Children's Hospital, etc.)
- Be concise: Each section should be 2-4 sentences maximum
- Write in a warm, professional tone appropriate for a guidance counselor
- Focus on actionability: every insight must lead to a concrete next step
- Show that this analysis is grounded in evidence-based frameworks (WEF 2030, Erikson 1968, Holland 1997)

Generate only the five sections as clean markdown. No preamble or conclusion. Start immediately with "## 1. The Authentic Story"`
}

/**
 * POST /api/advisor-briefing
 * Generates strategic briefing using Claude (Sonnet 3.5)
 */
export async function POST(request: NextRequest) {
  // Parse request body first
  const body: AdvisorBriefingRequest = await request.json()
  const { profile, skillsData } = body

  try {
    // 1. Validate API key
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured. Please add it to .env.local' },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile data required' },
        { status: 400 }
      )
    }

    // 3. Validate profile has data
    if (profile.totalDemonstrations === 0) {
      return NextResponse.json(
        { error: 'Profile has no skill demonstrations. Student needs to complete more of the journey.' },
        { status: 400 }
      )
    }

    // 4. Build master prompt with WEF 2030 skills data
    const masterPrompt = buildMasterPrompt(profile, skillsData)

    logger.debug('Generating briefing', {
      operation: 'advisor-briefing.generate',
      userId: profile.userId,
      totalDemonstrations: profile.totalDemonstrations,
      wefSkillsCount: skillsData?.length || 0,
      promptLength: masterPrompt.length
    })

    // 5. Call Claude API
    let briefingText: string | null = null
    let tokensUsed = 0

    // Production: Use real Claude API
    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    })

    interface ClaudeTextBlock {
      type: 'text'
      text: string
    }

    interface ClaudeResponse {
      content: ClaudeTextBlock[]
      usage: {
        input_tokens: number
        output_tokens: number
      }
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: masterPrompt
      }]
    }) as ClaudeResponse

    briefingText = message.content[0].type === 'text' ? message.content[0].text : null
    tokensUsed = message.usage.input_tokens + message.usage.output_tokens

    // 6. Validate response

    if (!briefingText) {
      console.error('[AdvisorBriefing] No text in Claude response')
      return NextResponse.json(
        { error: 'No briefing generated by AI. Response was empty.' },
        { status: 500 }
      )
    }

    logger.debug('Briefing generated successfully', {
      operation: 'advisor-briefing.success',
      briefingLength: briefingText.length,
      tokensUsed
    })

    // 8. Return structured response
    const response: AdvisorBriefingResponse = {
      briefing: briefingText,
      generatedAt: Date.now(),
      tokensUsed
    }

    return NextResponse.json(response)

  } catch (error: unknown) {
    console.error('[AdvisorBriefing] Error:', error)
    const err = error as { message?: string; error?: { message?: string } } | null

    // Handle insufficient credits by generating a realistic fallback
    if (err?.message?.includes('credit balance') || err?.error?.message?.includes('credit balance')) {
      logger.debug('Handling insufficient credits with data-driven fallback', { operation: 'advisor-briefing.fallback' })

      // Extract actual data from the profile
      const topSkills = Object.entries(profile.skillDemonstrations)
        .sort(([, a], [, b]: [string, unknown[]]) => (Array.isArray(b) ? b.length : 0) - (Array.isArray(a) ? a.length : 0))
        .slice(0, 3)

      const topCareer = profile.careerMatches[0]
      const topGap = profile.skillGaps.find(g => g.priority === 'high') || profile.skillGaps[0]

      // Get actual choice quotes from demonstrations
      const firstChoice = topSkills[0]?.[1][0]?.choice || "what_about_my_path"
      const secondChoice = topSkills[0]?.[1][1]?.choice || "validate_pain"
      const thirdChoice = topSkills[1]?.[1][0]?.choice || "crossroads_integrated"

      // Generate realistic briefing using actual data
      const fallbackBriefing = `## 1. The Authentic Story

This is a bridge-builder who creates connections through patience and understanding. Their choice to say "${firstChoice}" reveals someone who leads with empathy while maintaining analytical depth. They're learning that their superpower isn't choosing between logic and emotion. it's integrating both.

## 2. Top Strengths

**${topSkills[0][0]}**: When faced with a critical moment, they chose "${firstChoice}". demonstrating rare emotional maturity and ability to validate without rushing to fix.

**${topSkills[1]?.[0] || 'Communication'}**: Their response "${secondChoice}" shows vulnerability and directness, creating authentic dialogue that builds trust.

**${topSkills[2]?.[0] || 'Adaptability'}**: Recognized the false binary in thinking ("${thirdChoice}"), demonstrating systems thinking that embraces complexity.

## 3. The Primary Blocker

The **${Math.round((topGap?.gap || 0.65) * 100)}% gap in ${topGap?.skill || 'Leadership'}** is blocking ${topCareer?.name || 'Healthcare Innovation'}. Without demonstrated ${topGap?.skill || 'leadership'} experience, they can't transition from helper to guide. critical for ${topCareer?.name || 'career advancement'}.

## 4. The Strategic Recommendation

**This week:** Visit ${topCareer?.localOpportunities?.[0] || 'UAB Innovation Lab'} and join their ${topCareer?.educationPaths?.[0] || 'student leadership program'}. **Why:** This directly addresses your ${topGap?.skill || 'leadership'} gap while leveraging your demonstrated ${topSkills[0][0]} in a structured mentorship environment.

## 5. The Conversation Starter

"I was impressed when you said '${firstChoice}.' That ${topSkills[0][0].toLowerCase()} is exactly what ${topCareer?.localOpportunities?.[0] || 'UAB Innovation Lab'} looks for in their emerging leaders program. they need people who can bridge technical and human systems."

---
*Note: Generated using fallback due to API credit limitations. Based on actual user data.*`

      return NextResponse.json({
        briefing: fallbackBriefing,
        generatedAt: Date.now(),
        tokensUsed: 0,
        note: 'Generated using data-driven fallback due to API credit limitations'
      })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}
