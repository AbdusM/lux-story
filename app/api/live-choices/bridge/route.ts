/**
 * Bridge Text Generation API Route
 *
 * Generates narrative bridge text that connects user choices
 * to story outcomes for seamless narrative flow
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface BridgeRequest {
  prompt: string;
  userChoice: string;
  nextScene: string;
}

/**
 * POST endpoint for bridge text generation
 */
export async function POST(request: Request) {
  try {
    const body = await request.json() as BridgeRequest;

    // Validate request
    if (!body.prompt || !body.userChoice || !body.nextScene) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, userChoice, or nextScene' },
        { status: 400 }
      );
    }

    // Initialize Gemini model with faster, lighter configuration for bridge text
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      generationConfig: {
        temperature: 0.7, // Slightly lower for more consistent bridges
        maxOutputTokens: 100, // Short output for bridge text
        topP: 0.9,
      },
    });

    console.log('🌉 Generating bridge text...');
    console.log('👤 User choice:', body.userChoice);

    // Generate bridge text
    const result = await model.generateContent(body.prompt);
    const response = await result.response;
    const bridgeText = response.text().trim();

    // Clean up the response (remove quotes, extra formatting)
    const cleanedBridge = bridgeText
      .replace(/^["']|["']$/g, '') // Remove surrounding quotes
      .replace(/^\w+:\s*/, '') // Remove "Bridge:" prefix if present
      .trim();

    console.log('✅ Bridge generated:', cleanedBridge);

    // Return the bridge text
    return NextResponse.json({
      bridgeText: cleanedBridge,
      confidence: 0.95, // High confidence since this is simpler than choice generation
      generatedAt: Date.now()
    });

  } catch (error) {
    console.error('❌ Error in /api/live-choices/bridge:', error);

    // Return a generic bridge as fallback
    return NextResponse.json({
      bridgeText: "A moment later, you notice that",
      confidence: 0.5,
      generatedAt: Date.now()
    });
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'Bridge Text API is running',
    timestamp: new Date().toISOString(),
    model: 'gemini-1.5-flash-latest'
  });
}