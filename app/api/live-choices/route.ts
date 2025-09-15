/**
 * Next.js API Route for Live Choice Generation
 *
 * This server-side endpoint handles Gemini API calls securely,
 * eliminating CORS issues and protecting the API key.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google AI SDK with server-side environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define the expected request body structure for type safety
interface LiveChoiceRequest {
  sceneContext: string;
  pattern: string;
  playerPersona: string;
  existingChoices: string[];
  sceneId: string;
  playerId?: string;
}

// Define the response structure
interface LiveChoiceResponse {
  text: string;
  justification: string;
  confidenceScore: number;
  generatedAt: number;
}

/**
 * Master prompt for Birmingham youth career exploration choices
 */
function getMasterPrompt(data: LiveChoiceRequest): string {
  return `You are a master narrative designer creating authentic choices for Birmingham youth exploring career paths.

**CORE MISSION:** Generate ONE choice that feels natural for a Birmingham teenager making career decisions.

**Scene Context:** "${data.sceneContext}"

**Pattern to Capture:** "${data.pattern}"
- exploring: Curiosity-driven, discovery-focused
- helping: Community-oriented, service-minded
- building: Creation-focused, hands-on approach
- analyzing: Thoughtful, research-oriented
- patience: Deliberate, considered approach

**Player Persona Analysis:** ${data.playerPersona}

**Existing Choices (DO NOT REPEAT):** ${data.existingChoices.join(', ')}

**BIRMINGHAM TEEN VOICE REQUIREMENTS:**
- Use natural Birmingham teen language (not overly formal)
- Reference local context when appropriate (UAB, downtown, local culture)
- Reflect genuine career concerns of 16-19 year olds
- Avoid corporate jargon or adult business speak
- Include personal agency and authentic decision-making

**OUTPUT FORMAT (JSON only):**
{
  "text": "The choice text in natural Birmingham teen voice",
  "justification": "Why this choice captures the ${data.pattern} pattern and fits the scene",
  "confidenceScore": 0.85
}

**QUALITY STANDARDS:**
- Choice text: 8-15 words maximum
- Must feel authentic to Birmingham youth
- Should advance career exploration meaningfully
- Confidence score: 0.75+ (only high-quality choices)
- Must be distinctly different from existing choices

Generate the JSON response:`;
}

/**
 * POST endpoint for live choice generation
 */
export async function POST(request: Request) {
  try {
    // Parse and validate the incoming request
    const body = await request.json() as LiveChoiceRequest;

    // Basic validation
    if (!body.sceneContext || !body.pattern || !body.playerPersona) {
      return NextResponse.json(
        { error: 'Missing required fields: sceneContext, pattern, or playerPersona' },
        { status: 400 }
      );
    }

    if (!body.existingChoices || !Array.isArray(body.existingChoices)) {
      return NextResponse.json(
        { error: 'existingChoices must be an array' },
        { status: 400 }
      );
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      generationConfig: {
        temperature: 0.8, // Balanced creativity
        maxOutputTokens: 1000,
        topP: 0.9,
      },
    });

    // Generate the master prompt
    const prompt = getMasterPrompt(body);

    console.log('🚀 Generating choice with Gemini API...');
    console.log('📝 Pattern:', body.pattern);
    console.log('🎭 Scene:', body.sceneId);

    // Call Gemini API from server (no CORS issues)
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('📥 Raw Gemini response:', text);

    // Parse the AI's JSON response
    let generatedData: LiveChoiceResponse;
    try {
      // Clean the response text (remove markdown code blocks if present)
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      generatedData = JSON.parse(cleanedText);

      // Add timestamp
      generatedData.generatedAt = Date.now();

      // Validate confidence score
      if (typeof generatedData.confidenceScore !== 'number' ||
          generatedData.confidenceScore < 0 ||
          generatedData.confidenceScore > 1) {
        throw new Error('Invalid confidence score');
      }

      console.log('✨ Generated choice:', generatedData.text);
      console.log('🎯 Confidence:', generatedData.confidenceScore);

    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response:', parseError);
      console.error('Raw response:', text);

      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Quality gate: Only return high-confidence choices
    if (generatedData.confidenceScore < 0.75) {
      console.log('⚠️ Low confidence choice rejected:', generatedData.confidenceScore);
      return NextResponse.json(
        { error: 'Generated choice did not meet quality threshold' },
        { status: 422 }
      );
    }

    // Return the validated response
    return NextResponse.json(generatedData);

  } catch (error) {
    console.error('❌ Error in /api/live-choices:', error);

    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API configuration error' },
          { status: 500 }
        );
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded' },
          { status: 429 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to generate choice' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'Live Choice API is running',
    timestamp: new Date().toISOString(),
    model: 'gemini-1.5-flash-latest'
  });
}