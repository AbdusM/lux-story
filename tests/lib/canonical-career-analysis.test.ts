import { describe, expect, it } from 'vitest'
import type { FutureSkills as LiveFutureSkills } from '@/lib/game-store'
import {
  buildCanonicalSkillGapAnalysis,
  buildCanonicalSkillNetwork,
  getCanonicalCareerRecommendations,
} from '@/lib/canonical-career-analysis'

const liveSkills: LiveFutureSkills = {
  criticalThinking: 0.9,
  communication: 0.8,
  collaboration: 0.4,
  creativity: 0.3,
  adaptability: 0.5,
  leadership: 0.2,
  digitalLiteracy: 0.85,
  emotionalIntelligence: 0.4,
  culturalCompetence: 0.7,
  financialLiteracy: 0.1,
  timeManagement: 0.2,
  problemSolving: 0.8,
  activeListening: 0.2,
  attentionToDetail: 0.6,
  contentCreation: 0.1,
  cybersecurity: 0.2,
  dataAnalysis: 0.9,
  dataLiteracy: 0.85,
  ethicalReasoning: 0.7,
  selfMarketing: 0.1,
}

describe('canonical career analysis', () => {
  it('matches live camelCase game-store skills against canonical careers', () => {
    const recommendations = getCanonicalCareerRecommendations(liveSkills, 3)

    expect(recommendations).toHaveLength(3)
    expect(recommendations[0]).toMatchObject({
      id: 'data-analyst-community',
      name: 'Community Data Analyst',
      readiness: 'near_ready',
      confidenceScore: 81,
    })
    expect(recommendations[0].evidenceForMatch).toContain('Strong critical thinking demonstrated')
  })

  it('builds gap analysis from canonical career ids', () => {
    const analysis = buildCanonicalSkillGapAnalysis('data-analyst-community', liveSkills)

    expect(analysis).not.toBeNull()
    expect(analysis).toMatchObject({
      careerId: 'data-analyst-community',
      careerName: 'Community Data Analyst',
      overallReadiness: 81,
    })
    expect(analysis?.gaps[0]).toMatchObject({
      skillId: 'culturalCompetence',
      skillName: 'Cultural Competence',
    })
    expect(analysis?.strengths.map((strength) => strength.skillId)).toContain('criticalThinking')
  })

  it('builds skill networks linking skills to careers and sectors', () => {
    const network = buildCanonicalSkillNetwork(liveSkills)

    expect(network.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'criticalThinking', type: 'skill' }),
        expect.objectContaining({ id: 'career_data-analyst-community', type: 'career' }),
        expect.objectContaining({ id: 'domain_Data & Civic Tech', type: 'domain' }),
      ])
    )

    expect(network.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: 'criticalThinking',
          target: 'career_data-analyst-community',
        }),
        expect.objectContaining({
          source: 'career_data-analyst-community',
          target: 'domain_Data & Civic Tech',
        }),
      ])
    )
  })
})
