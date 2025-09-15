import { NextRequest, NextResponse } from 'next/server'
import { getPlatformResonance } from '@/lib/platform-resonance'

export async function POST(request: NextRequest) {
  try {
    const { playerId = 'test-player' } = await request.json()

    // Test choices that should trigger different platform resonances
    const testChoices = [
      {
        text: "I want to help people feel better",
        consequence: "helping_pattern_strong",
        nextScene: "test"
      },
      {
        text: "Let me build something useful",
        consequence: "building_creation_focus",
        nextScene: "test"
      },
      {
        text: "I need to analyze this data carefully",
        consequence: "analyzing_research_deep",
        nextScene: "test"
      },
      {
        text: "I'll take time to grow this properly",
        consequence: "environmental_patience_growth",
        nextScene: "test"
      }
    ]

    const engine = getPlatformResonance()
    const results = []

    // Process each test choice
    for (const choice of testChoices) {
      const events = engine.updatePlatformResonance(playerId, choice)
      results.push({
        choice: choice.text,
        events: events.map(event => ({
          platform: event.platformId,
          type: event.type,
          intensity: event.intensity,
          reason: event.reason
        }))
      })
    }

    // Get final platform states
    const platforms = engine.getPlayerPlatforms(playerId)
    const platformStates = Object.fromEntries(
      Array.from(platforms.entries()).map(([id, platform]) => [
        id,
        {
          name: platform.name,
          warmth: Math.round(platform.warmth * 100) / 100,
          resonance: Math.round(platform.resonance * 100) / 100,
          accessibility: platform.accessibility
        }
      ])
    )

    // Get recommendation
    const recommendation = engine.getRecommendation(playerId)

    return NextResponse.json({
      success: true,
      results,
      platformStates,
      recommendation,
      summary: `Processed ${testChoices.length} test choices for platform resonance analysis`
    })

  } catch (error) {
    console.error('Platform resonance test failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to test platform resonance system'
      },
      { status: 500 }
    )
  }
}