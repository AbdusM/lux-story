/**
 * D-074: Skill Radar Chart Tests
 */

import { describe, it, expect } from 'vitest'
import {
  SKILL_CATEGORIES,
  SKILL_CATEGORY_METADATA,
  CAREER_PATHS,
  PATTERN_SKILL_WEIGHTS,
  calculateSkillsFromPatterns,
  generateRadarData,
  calculateGapScore,
  analyzeSkillProfile,
  getCareerMatches,
  getTopCareerMatch,
  calculateRadarPoint,
  generateRadarPath,
  generateLevelPaths,
  DEFAULT_RADAR_CONFIG,
  type SkillCategory,
  type SkillProfile
} from '@/lib/skill-radar'

describe('Skill Radar Chart (D-074)', () => {
  describe('SKILL_CATEGORIES', () => {
    it('should have 6 skill categories', () => {
      expect(SKILL_CATEGORIES.length).toBe(6)
    })

    it('should have metadata for all categories', () => {
      SKILL_CATEGORIES.forEach(category => {
        expect(SKILL_CATEGORY_METADATA[category]).toBeDefined()
        expect(SKILL_CATEGORY_METADATA[category].label).toBeDefined()
        expect(SKILL_CATEGORY_METADATA[category].shortLabel).toBeDefined()
        expect(SKILL_CATEGORY_METADATA[category].icon).toBeDefined()
      })
    })
  })

  describe('CAREER_PATHS', () => {
    it('should have at least 6 career paths', () => {
      expect(CAREER_PATHS.length).toBeGreaterThanOrEqual(6)
    })

    it('should have valid skill requirements for all careers', () => {
      CAREER_PATHS.forEach(career => {
        SKILL_CATEGORIES.forEach(category => {
          const requirement = career.requiredSkills[category]
          expect(requirement).toBeGreaterThanOrEqual(0)
          expect(requirement).toBeLessThanOrEqual(10)
        })
      })
    })

    it('should have aligned patterns for all careers', () => {
      CAREER_PATHS.forEach(career => {
        expect(career.alignedPatterns.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('PATTERN_SKILL_WEIGHTS', () => {
    it('should have weights for all patterns', () => {
      const patterns = ['analytical', 'patience', 'exploring', 'helping', 'building']
      patterns.forEach(pattern => {
        expect(PATTERN_SKILL_WEIGHTS[pattern as keyof typeof PATTERN_SKILL_WEIGHTS]).toBeDefined()
      })
    })

    it('should have weights for all skill categories per pattern', () => {
      Object.values(PATTERN_SKILL_WEIGHTS).forEach(weights => {
        SKILL_CATEGORIES.forEach(category => {
          expect(weights[category]).toBeDefined()
          expect(weights[category]).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('calculateSkillsFromPatterns', () => {
    it('should calculate skills from patterns', () => {
      const patterns = {
        analytical: 5,
        patience: 5,
        exploring: 5,
        helping: 5,
        building: 5
      }

      const profile = calculateSkillsFromPatterns(patterns)

      SKILL_CATEGORIES.forEach(category => {
        expect(profile.skills[category]).toBeGreaterThanOrEqual(0)
        expect(profile.skills[category]).toBeLessThanOrEqual(10)
      })
    })

    it('should identify dominant pattern', () => {
      const patterns = {
        analytical: 8,
        patience: 2,
        exploring: 2,
        helping: 2,
        building: 2
      }

      const profile = calculateSkillsFromPatterns(patterns)
      expect(profile.dominantPattern).toBe('analytical')
    })

    it('should not identify dominant if too low', () => {
      const patterns = {
        analytical: 2,
        patience: 2,
        exploring: 2,
        helping: 2,
        building: 2
      }

      const profile = calculateSkillsFromPatterns(patterns)
      expect(profile.dominantPattern).toBeUndefined()
    })
  })

  describe('generateRadarData', () => {
    const mockProfile: SkillProfile = {
      skills: {
        critical_thinking: 7,
        communication: 5,
        collaboration: 6,
        technical: 8,
        creativity: 4,
        adaptability: 6
      }
    }

    it('should generate data for all skill categories', () => {
      const data = generateRadarData(mockProfile)

      expect(data.length).toBe(SKILL_CATEGORIES.length)
      data.forEach(point => {
        expect(SKILL_CATEGORIES).toContain(point.category)
        expect(point.label).toBeDefined()
        expect(point.playerValue).toBeDefined()
      })
    })

    it('should include career values when career path provided', () => {
      const data = generateRadarData(mockProfile, CAREER_PATHS[0])

      data.forEach(point => {
        expect(point.careerValue).toBeDefined()
        expect(point.gap).toBeDefined()
      })
    })

    it('should calculate gap correctly', () => {
      const career = CAREER_PATHS[0]
      const data = generateRadarData(mockProfile, career)

      data.forEach(point => {
        const expectedGap = (point.careerValue || 0) - point.playerValue
        expect(point.gap).toBe(expectedGap)
      })
    })
  })

  describe('calculateGapScore', () => {
    it('should return 0 for perfect match', () => {
      const career = CAREER_PATHS[0]
      const perfectProfile: SkillProfile = {
        skills: { ...career.requiredSkills }
      }

      const gapScore = calculateGapScore(perfectProfile, career)
      expect(gapScore).toBe(0)
    })

    it('should return higher score for larger gaps', () => {
      const career = CAREER_PATHS[0]

      const goodProfile: SkillProfile = {
        skills: {
          critical_thinking: 7,
          communication: 7,
          collaboration: 7,
          technical: 7,
          creativity: 7,
          adaptability: 7
        }
      }

      const poorProfile: SkillProfile = {
        skills: {
          critical_thinking: 2,
          communication: 2,
          collaboration: 2,
          technical: 2,
          creativity: 2,
          adaptability: 2
        }
      }

      const goodGap = calculateGapScore(goodProfile, career)
      const poorGap = calculateGapScore(poorProfile, career)

      expect(poorGap).toBeGreaterThan(goodGap)
    })
  })

  describe('analyzeSkillProfile', () => {
    it('should identify strengths and weaknesses', () => {
      const profile: SkillProfile = {
        skills: {
          critical_thinking: 8,
          communication: 3,
          collaboration: 5,
          technical: 9,
          creativity: 2,
          adaptability: 5
        }
      }

      const analysis = analyzeSkillProfile(profile)

      expect(analysis.strengths).toContain('technical')
      expect(analysis.weaknesses).toContain('creativity')
    })

    it('should detect balanced profile', () => {
      const balanced: SkillProfile = {
        skills: {
          critical_thinking: 5,
          communication: 5,
          collaboration: 5,
          technical: 5,
          creativity: 5,
          adaptability: 5
        }
      }

      const analysis = analyzeSkillProfile(balanced)
      expect(analysis.balanced).toBe(true)
    })

    it('should detect unbalanced profile', () => {
      const unbalanced: SkillProfile = {
        skills: {
          critical_thinking: 9,
          communication: 2,
          collaboration: 5,
          technical: 8,
          creativity: 1,
          adaptability: 5
        }
      }

      const analysis = analyzeSkillProfile(unbalanced)
      expect(analysis.balanced).toBe(false)
    })
  })

  describe('getCareerMatches', () => {
    it('should return matches for all careers', () => {
      const profile: SkillProfile = {
        skills: {
          critical_thinking: 6,
          communication: 6,
          collaboration: 6,
          technical: 6,
          creativity: 6,
          adaptability: 6
        }
      }

      const matches = getCareerMatches(profile)
      expect(matches.length).toBe(CAREER_PATHS.length)
    })

    it('should sort by combined score', () => {
      const profile: SkillProfile = {
        skills: {
          critical_thinking: 6,
          communication: 6,
          collaboration: 6,
          technical: 6,
          creativity: 6,
          adaptability: 6
        }
      }

      const matches = getCareerMatches(profile)

      for (let i = 1; i < matches.length; i++) {
        const prevScore = matches[i - 1].matchScore * 0.7 + matches[i - 1].patternAlignment * 0.3
        const currScore = matches[i].matchScore * 0.7 + matches[i].patternAlignment * 0.3
        expect(prevScore).toBeGreaterThanOrEqual(currScore)
      }
    })

    it('should boost pattern alignment score for matching patterns', () => {
      const profile: SkillProfile = {
        skills: {
          critical_thinking: 6,
          communication: 6,
          collaboration: 6,
          technical: 6,
          creativity: 6,
          adaptability: 6
        },
        dominantPattern: 'analytical'
      }

      const matches = getCareerMatches(profile)
      const analyticalCareer = matches.find(m =>
        m.career.alignedPatterns.includes('analytical')
      )

      expect(analyticalCareer?.patternAlignment).toBeGreaterThan(50)
    })
  })

  describe('getTopCareerMatch', () => {
    it('should return best match', () => {
      const profile: SkillProfile = {
        skills: {
          critical_thinking: 9,
          communication: 6,
          collaboration: 5,
          technical: 9,
          creativity: 7,
          adaptability: 7
        },
        dominantPattern: 'analytical'
      }

      const topMatch = getTopCareerMatch(profile)
      expect(topMatch).not.toBeNull()
      expect(topMatch?.matchScore).toBeGreaterThan(0)
    })
  })

  describe('SVG Path Generation', () => {
    describe('calculateRadarPoint', () => {
      it('should return center for value 0', () => {
        const point = calculateRadarPoint(0, 0)
        expect(point.x).toBeCloseTo(DEFAULT_RADAR_CONFIG.size / 2, 1)
        expect(point.y).toBeCloseTo(DEFAULT_RADAR_CONFIG.size / 2, 1)
      })

      it('should return outer edge for max value', () => {
        const point = calculateRadarPoint(0, DEFAULT_RADAR_CONFIG.maxValue)
        const radius = DEFAULT_RADAR_CONFIG.size / 2 - DEFAULT_RADAR_CONFIG.labelOffset

        // First point is at top (negative y direction from center)
        expect(point.x).toBeCloseTo(DEFAULT_RADAR_CONFIG.size / 2, 1)
        expect(point.y).toBeCloseTo(DEFAULT_RADAR_CONFIG.size / 2 - radius, 1)
      })
    })

    describe('generateRadarPath', () => {
      it('should generate valid SVG path', () => {
        const data = SKILL_CATEGORIES.map((category, i) => ({
          category,
          label: category,
          playerValue: 5,
          careerValue: 5,
          gap: 0
        }))

        const path = generateRadarPath(data, 'playerValue')

        expect(path).toMatch(/^M/)  // Starts with M
        expect(path).toMatch(/Z$/)  // Ends with Z (closed path)
        expect(path).toContain('L') // Has line segments
      })
    })

    describe('generateLevelPaths', () => {
      it('should generate correct number of level rings', () => {
        const paths = generateLevelPaths()
        expect(paths.length).toBe(DEFAULT_RADAR_CONFIG.levels)
      })

      it('should generate closed paths', () => {
        const paths = generateLevelPaths()
        paths.forEach(path => {
          expect(path).toMatch(/Z$/)
        })
      })
    })
  })
})
