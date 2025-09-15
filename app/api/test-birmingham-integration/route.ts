import { NextRequest, NextResponse } from 'next/server'
import { getCareerAnalytics } from '@/lib/career-analytics'
import { getBirminghamOpportunities, getPersonalizedOpportunities } from '@/lib/birmingham-opportunities'

export async function POST(request: NextRequest) {
  try {
    const { playerId = 'birmingham-test' } = await request.json()

    // Simulate player with strong helping pattern
    const testPersona = {
      playerId,
      dominantPatterns: ['helping', 'caring', 'patience'],
      patternCounts: {
        helping: 8,
        caring: 6,
        patience: 4,
        building: 2
      },
      patternPercentages: {
        helping: 0.4,
        caring: 0.3,
        patience: 0.2,
        building: 0.1
      },
      responseSpeed: 'deliberate' as const,
      stressResponse: 'calm' as const,
      socialOrientation: 'helper' as const,
      problemApproach: 'intuitive' as const,
      culturalAlignment: 0.8,
      localReferences: [],
      communicationStyle: 'thoughtful' as const,
      summaryText: 'Test player with strong helping orientation',
      lastUpdated: Date.now(),
      totalChoices: 20
    }

    // Mock the persona tracker (since localStorage isn't available server-side)
    const analytics = getCareerAnalytics()

    // Test career insights generation
    const insights = analytics.generateCareerInsights(playerId)

    // Test Birmingham opportunities engine directly
    const birminghamEngine = getBirminghamOpportunities()

    // Get opportunities for healthcare platform (aligned with helping pattern)
    const healthcareOpportunities = birminghamEngine.getOpportunitiesByPlatform('platform-1', 5)

    // Get personalized recommendations
    const personalizedRecs = getPersonalizedOpportunities(
      'platform-1',
      testPersona.patternCounts,
      '16-18'
    )

    // Get opportunities by organization
    const uabOpportunities = birminghamEngine.getOpportunitiesByOrganization('UAB Medical Center')

    // Get all organizations
    const organizations = birminghamEngine.getOrganizations()

    return NextResponse.json({
      success: true,
      testPersona: {
        playerId: testPersona.playerId,
        dominantPatterns: testPersona.dominantPatterns,
        socialOrientation: testPersona.socialOrientation,
        patternCounts: testPersona.patternCounts
      },
      careerInsights: insights.map(insight => ({
        careerPath: insight.careerPath,
        confidence: insight.confidence,
        evidencePoints: insight.evidencePoints,
        birminghamOpportunities: insight.birminghamOpportunities,
        personalizedOpportunities: insight.personalizedOpportunities?.slice(0, 2) // Limit for readability
      })),
      healthcareOpportunities: healthcareOpportunities.map(opp => ({
        name: opp.name,
        organization: opp.organization,
        type: opp.type,
        description: opp.description.slice(0, 100) + '...'
      })),
      personalizedRecommendations: personalizedRecs.slice(0, 3).map(rec => ({
        opportunity: {
          name: rec.opportunity.name,
          organization: rec.opportunity.organization,
          type: rec.opportunity.type
        },
        matchScore: Math.round(rec.matchScore * 100) / 100,
        matchReasons: rec.matchReasons,
        nextSteps: rec.nextSteps.slice(0, 2)
      })),
      uabOpportunities: uabOpportunities.map(opp => ({
        name: opp.name,
        type: opp.type,
        description: opp.description.slice(0, 80) + '...'
      })),
      birminghamOrganizations: organizations.slice(0, 10), // Show first 10
      summary: `Generated career insights and Birmingham opportunities for ${playerId}`
    })

  } catch (error) {
    console.error('Birmingham integration test failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to test Birmingham opportunities integration'
      },
      { status: 500 }
    )
  }
}