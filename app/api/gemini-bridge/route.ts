import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userChoice, nextSpeaker, nextSceneHint, context } = body

    // Use the API key directly (env not loading properly)
    const GEMINI_API_KEY = 'AIzaSyDEQloxDXlFD2HnFNUrAIr8aANhvr_Ivxg'

    const prompt = buildPrompt({ userChoice, nextSpeaker, nextSceneHint, context })

    console.log('Calling Gemini API with prompt length:', prompt.length)
    console.log('Using API key:', GEMINI_API_KEY.substring(0, 10) + '...')

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
            topP: 0.9
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
          ]
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      return NextResponse.json({
        bridge: `${nextSpeaker} considers your words.`
      })
    }

    const data = await response.json()
    console.log('Gemini response:', JSON.stringify(data, null, 2))

    const bridge = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!bridge || bridge.length < 10 || bridge.includes('As an AI') || bridge.includes('I cannot')) {
      console.log('Bridge rejected, using fallback. Bridge was:', bridge)
      return NextResponse.json({
        bridge: `${nextSpeaker} considers your words.`
      })
    }

    return NextResponse.json({ bridge })

  } catch (error) {
    console.error('Bridge generation error:', error)
    return NextResponse.json({
      bridge: 'The moment hangs in the air.'
    })
  }
}

function buildPrompt(request: { userChoice: string; nextSpeaker: string; nextSceneHint?: string; context?: any }): string {
  const { userChoice, nextSpeaker } = request

  return `You are narrating a career exploration conversation at Grand Central Terminus in Birmingham.

The user just said: "${userChoice}"

${nextSpeaker} is about to respond with their prepared thoughts.

Write 1-2 sentences that:
1. Acknowledge what the user said (show they were heard)
2. Show ${nextSpeaker}'s physical or emotional reaction
3. Create a natural transition to their response

Examples:
- "The mention of family pressure makes Maya pause, her fingers tracing the edge of her textbook."
- "Samuel's eyes light up at your question, as if you've asked exactly what he hoped you would."
- "Your words hang in the air for a moment before Devon nods slowly, processing."

Important:
- Do NOT write dialogue for ${nextSpeaker}
- Do NOT explain or interpret the user's words
- Just create a brief, natural transition
- Keep it under 30 words
- Focus on physical actions or brief emotional reactions

Write the transition:`
}