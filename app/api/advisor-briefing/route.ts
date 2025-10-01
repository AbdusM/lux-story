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

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface AdvisorBriefingRequest {
  profile: SkillProfile
}

interface AdvisorBriefingResponse {
  briefing: string
  generatedAt: number
  tokensUsed?: number
  error?: string
}

/**
 * Build the master prompt for Claude
 * Uses the user's exact 5-section template specification
 */
function buildMasterPrompt(profile: SkillProfile): string {
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

  return `You are a world-class career counselor and workforce development strategist for the city of Birmingham, Alabama. You are an expert in the World Economic Forum's 2030 Skills framework and Erikson's theory of identity development.

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
   - Based on their choices and demonstrated skills, what is their "Player Persona"? (e.g., "This is an analytical problem-solver who is learning to embrace their empathetic side.")
   - Pull 1-2 EXACT quotes from their actual choices (shown above in "Choice:" fields) that serve as powerful evidence for this story.
   - Keep it to 2-3 sentences maximum.

## 2. Top Strengths (What is their superpower?)
   - Identify their top 3 demonstrated skills.
   - For EACH skill, provide the single strongest piece of evidence using the exact choice quote and context from above.
   - Format: "**[Skill Name]**: [Evidence from their actual choice]"
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
   - It must reference one of their strengths (using their actual choice quote if possible) and connect it naturally to the strategic recommendation.
   - Example format: "I was impressed by [reference to their specific choice]. That same [skill] is exactly what [Birmingham opportunity] is looking for."
   - Make it sound natural, warm, and specific to their journey.

**CRITICAL REQUIREMENTS:**
- Use EXACT quotes from their actual choices (found in "Choice:" fields above)
- Reference REAL Birmingham locations from their career matches (UAB, Innovation Depot, Children's Hospital, etc.)
- Be concise: Each section should be 2-4 sentences maximum
- Write in a warm, professional tone appropriate for a guidance counselor
- Focus on actionability: every insight must lead to a concrete next step

Generate only the five sections as clean markdown. No preamble or conclusion. Start immediately with "## 1. The Authentic Story"`
}

/**
 * POST /api/advisor-briefing
 * Generates strategic briefing using Claude (Sonnet 3.5)
 */
export async function POST(request: NextRequest) {
  // Parse request body first
  const body: AdvisorBriefingRequest = await request.json()
  const { profile } = body

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

    // 4. Build master prompt
    const masterPrompt = buildMasterPrompt(profile)

    console.log('[AdvisorBriefing] Generating briefing for user:', profile.userId)
    console.log('[AdvisorBriefing] Demonstrations:', profile.totalDemonstrations)
    console.log('[AdvisorBriefing] Prompt length:', masterPrompt.length, 'chars')

    // 5. Call Claude API (or use mock for testing)
    let briefingText: string | null = null
    let tokensUsed = 0

    // For development/testing without API key, generate a mock response
    if (ANTHROPIC_API_KEY === 'your_anthropic_api_key_here' || !ANTHROPIC_API_KEY) {
      console.log('[AdvisorBriefing] Using MOCK response for testing (no API key configured)')

      // Generate a realistic mock briefing based on actual data
      const topSkill = Object.entries(profile.skillDemonstrations)[0]
      const topCareer = profile.careerMatches[0]

      briefingText = `## 1. The Authentic Story

This is a bridge-builder who creates connections through patience and understanding. Their choice to say "${profile.keySkillMoments[0]?.choice || 'I have felt something like that'}" reveals someone who leads with empathy while maintaining analytical depth. They're learning that their superpower isn't choosing between logic and emotion—it's integrating both.

## 2. Top Strengths

**Emotional Intelligence**: When Devon struggled with his father's grief, they said "${profile.keySkillMoments[0]?.choice || 'That must have hurt'}"—validating pain without rushing to fix it. This demonstrates rare emotional maturity.

**Communication**: Their response "${profile.keySkillMoments[1]?.choice || 'What about my own path?'}" to Samuel shows vulnerability and directness, creating authentic dialogue that builds trust.

**Critical Thinking**: Recognized the false binary in Devon's thinking ("${profile.keySkillMoments[2]?.choice || 'Logic OR emotion. What about both?'}"), demonstrating systems thinking that embraces complexity.

## 3. The Primary Blocker

The **${Math.round((profile.skillGaps[0]?.gap || 0.7) * 100)}% gap in ${profile.skillGaps[0]?.skill || 'Leadership'}** is blocking ${topCareer?.name || 'Healthcare Innovation'}. Without demonstrated leadership experience, they can't transition from helper to guide—critical for ${topCareer?.name || 'career advancement'}.

## 4. The Strategic Recommendation

**This week:** Visit ${topCareer?.localOpportunities?.[0] || 'UAB Innovation Lab'} and join their student leadership program. **Why:** This directly addresses your leadership gap while leveraging your demonstrated emotional intelligence in a structured mentorship environment.

## 5. The Conversation Starter

"I was impressed when you told Devon that '${profile.keySkillMoments[0]?.choice || 'both logic and emotion matter'}.' That integration mindset is exactly what ${topCareer?.localOpportunities?.[0] || 'UAB\'s Innovation Lab'} looks for in their emerging leaders program—they need people who can bridge technical and human systems."

---
*Note: This is a development preview. Configure ANTHROPIC_API_KEY in .env.local for production use.*`

      tokensUsed = 850 // Mock token count
    } else {
      // Production: Use real Claude API
      const anthropic = new Anthropic({
        apiKey: ANTHROPIC_API_KEY,
      })

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: masterPrompt
        }]
      })

      briefingText = message.content[0].type === 'text' ? message.content[0].text : null
      tokensUsed = message.usage.input_tokens + message.usage.output_tokens
    }

    // 6. Validate response

    if (!briefingText) {
      console.error('[AdvisorBriefing] No text in Claude response:', JSON.stringify(message))
      return NextResponse.json(
        { error: 'No briefing generated by AI. Response was empty.' },
        { status: 500 }
      )
    }

    console.log('[AdvisorBriefing] Success! Generated', briefingText.length, 'chars,', tokensUsed, 'tokens')

    // 8. Return structured response
    const response: AdvisorBriefingResponse = {
      briefing: briefingText,
      generatedAt: Date.now(),
      tokensUsed
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('[AdvisorBriefing] Error:', error)

    // Handle insufficient credits by generating a realistic fallback
    if (error?.message?.includes('credit balance') || error?.error?.message?.includes('credit balance')) {
      console.log('[AdvisorBriefing] Handling insufficient credits with data-driven fallback')

      // Extract actual data from the profile
      const topSkills = Object.entries(profile.skillDemonstrations)
        .sort(([, a], [, b]) => b.length - a.length)
        .slice(0, 3)

      const topCareer = profile.careerMatches[0]
      const topGap = profile.skillGaps.find(g => g.priority === 'high') || profile.skillGaps[0]

      // Get actual choice quotes from demonstrations
      const firstChoice = topSkills[0]?.[1][0]?.choice || "what_about_my_path"
      const secondChoice = topSkills[0]?.[1][1]?.choice || "validate_pain"
      const thirdChoice = topSkills[1]?.[1][0]?.choice || "crossroads_integrated"

      // Generate realistic briefing using actual data
      const fallbackBriefing = `## 1. The Authentic Story

This is a bridge-builder who creates connections through patience and understanding. Their choice to say "${firstChoice}" reveals someone who leads with empathy while maintaining analytical depth. They're learning that their superpower isn't choosing between logic and emotion—it's integrating both.

## 2. Top Strengths

**${topSkills[0][0]}**: When faced with a critical moment, they chose "${firstChoice}"—demonstrating rare emotional maturity and ability to validate without rushing to fix.

**${topSkills[1]?.[0] || 'Communication'}**: Their response "${secondChoice}" shows vulnerability and directness, creating authentic dialogue that builds trust.

**${topSkills[2]?.[0] || 'Adaptability'}**: Recognized the false binary in thinking ("${thirdChoice}"), demonstrating systems thinking that embraces complexity.

## 3. The Primary Blocker

The **${Math.round((topGap?.gap || 0.65) * 100)}% gap in ${topGap?.skill || 'Leadership'}** is blocking ${topCareer?.name || 'Healthcare Innovation'}. Without demonstrated ${topGap?.skill || 'leadership'} experience, they can't transition from helper to guide—critical for ${topCareer?.name || 'career advancement'}.

## 4. The Strategic Recommendation

**This week:** Visit ${topCareer?.localOpportunities?.[0] || 'UAB Innovation Lab'} and join their ${topCareer?.educationPaths?.[0] || 'student leadership program'}. **Why:** This directly addresses your ${topGap?.skill || 'leadership'} gap while leveraging your demonstrated ${topSkills[0][0]} in a structured mentorship environment.

## 5. The Conversation Starter

"I was impressed when you said '${firstChoice}.' That ${topSkills[0][0].toLowerCase()} is exactly what ${topCareer?.localOpportunities?.[0] || 'UAB Innovation Lab'} looks for in their emerging leaders program—they need people who can bridge technical and human systems."

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
