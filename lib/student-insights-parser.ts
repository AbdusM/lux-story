/**
 * Student Insights Parser
 * Transforms raw SkillProfile data into human-readable insights
 */

import type { SkillProfile } from './skill-profile-adapter'
import type {
  ChoicePatternInsight,
  CharacterInsight,
  BreakthroughMoment,
  CareerInsight,
  StudentInsights
} from './types/student-insights'

/**
 * Extract choice patterns from skill demonstrations
 */
export function parseChoicePatterns(profile: SkillProfile): ChoicePatternInsight {
  const patterns = {
    helping: 0,
    analytical: 0,
    patience: 0,
    exploring: 0,
    building: 0
  }

  // Count skill demonstrations by type
  const skillDemonstrations = profile.skillDemonstrations || {}
  Object.entries(skillDemonstrations).forEach(([skillKey, demonstrations]) => {
    const count = demonstrations.length
    
    // Map skill types to choice patterns
    if (skillKey.toLowerCase().includes('empathy') || skillKey.toLowerCase().includes('listening')) {
      patterns.helping += count
    } else if (skillKey.toLowerCase().includes('critical') || skillKey.toLowerCase().includes('problem')) {
      patterns.analytical += count
    } else if (skillKey.toLowerCase().includes('patience') || skillKey.toLowerCase().includes('resilience')) {
      patterns.patience += count
    } else if (skillKey.toLowerCase().includes('curiosity') || skillKey.toLowerCase().includes('learning')) {
      patterns.exploring += count
    } else if (skillKey.toLowerCase().includes('creative') || skillKey.toLowerCase().includes('initiative')) {
      patterns.building += count
    }
  })

  const totalChoices = Object.values(patterns).reduce((sum, count) => sum + count, 0)

  // Calculate percentages
  const percentages = {
    helping: totalChoices > 0 ? Math.round((patterns.helping / totalChoices) * 100) : 0,
    analytical: totalChoices > 0 ? Math.round((patterns.analytical / totalChoices) * 100) : 0,
    patience: totalChoices > 0 ? Math.round((patterns.patience / totalChoices) * 100) : 0,
    exploring: totalChoices > 0 ? Math.round((patterns.exploring / totalChoices) * 100) : 0,
    building: totalChoices > 0 ? Math.round((patterns.building / totalChoices) * 100) : 0
  }

  // Determine dominant pattern
  const sortedPatterns = Object.entries(percentages).sort(([, a], [, b]) => b - a)
  const dominantPattern = sortedPatterns[0][0]
  const dominantPercentage = sortedPatterns[0][1]

  // Determine consistency
  let consistency: 'consistent' | 'varied' | 'random'
  if (dominantPercentage >= 50) {
    consistency = 'consistent'
  } else if (dominantPercentage >= 30) {
    consistency = 'varied'
  } else {
    consistency = 'random'
  }

  return {
    ...percentages,
    dominantPattern,
    consistency,
    totalChoices
  }
}

/**
 * Extract character relationships and trust levels
 */
export function parseCharacterRelationships(profile: SkillProfile): CharacterInsight[] {
  const characters: CharacterInsight[] = [
    {
      characterName: 'Maya Chen',
      trustLevel: 0,
      met: false,
      currentStatus: 'Not yet met'
    },
    {
      characterName: 'Devon Kumar',
      trustLevel: 0,
      met: false,
      currentStatus: 'Not yet met'
    },
    {
      characterName: 'Jordan Packard',
      trustLevel: 0,
      met: false,
      currentStatus: 'Not yet met'
    }
  ]

  // Parse skill demonstrations for character interactions
  const skillDemonstrations = profile.skillDemonstrations || {}
  Object.entries(skillDemonstrations).forEach(([, demonstrations]) => {
    demonstrations.forEach(demo => {
      const scene = demo.scene.toLowerCase()
      
      // Maya interactions
      if (scene.includes('maya')) {
        const mayaIndex = characters.findIndex(c => c.characterName === 'Maya Chen')
        characters[mayaIndex].met = true
        characters[mayaIndex].trustLevel = Math.min(10, characters[mayaIndex].trustLevel + 1)
        
        if (scene.includes('robotics')) {
          characters[mayaIndex].vulnerabilityShared = "I... I build robots"
          characters[mayaIndex].currentStatus = 'Discussing robotics passion'
        }
        if (scene.includes('parent') || scene.includes('family')) {
          characters[mayaIndex].studentHelped = 'Navigate family expectations'
        }
      }
      
      // Devon interactions
      if (scene.includes('devon')) {
        const devonIndex = characters.findIndex(c => c.characterName === 'Devon Kumar')
        characters[devonIndex].met = true
        characters[devonIndex].trustLevel = Math.min(10, characters[devonIndex].trustLevel + 1)
        
        if (scene.includes('flowchart') || scene.includes('dad') || scene.includes('father')) {
          characters[devonIndex].vulnerabilityShared = "Decision tree for Dad"
          characters[devonIndex].currentStatus = 'Working through grief and logic'
        }
      }
      
      // Jordan interactions
      if (scene.includes('jordan')) {
        const jordanIndex = characters.findIndex(c => c.characterName === 'Jordan Packard')
        characters[jordanIndex].met = true
        characters[jordanIndex].trustLevel = Math.min(10, characters[jordanIndex].trustLevel + 1)
        
        if (scene.includes('impostor') || scene.includes('job')) {
          characters[jordanIndex].vulnerabilityShared = "Seven jobs in four years"
          characters[jordanIndex].currentStatus = 'Confronting impostor syndrome'
        }
      }
    })
  })

  return characters
}

/**
 * Extract breakthrough moments from key skill moments
 */
export function parseBreakthroughMoments(profile: SkillProfile): BreakthroughMoment[] {
  const moments: BreakthroughMoment[] = []

  const keyMoments = profile.keySkillMoments || []
  keyMoments.forEach(moment => {
    const scene = moment.scene.toLowerCase()
    let type: BreakthroughMoment['type'] = 'decision'
    let characterName: string | undefined

    // Determine type and character
    if (scene.includes('maya')) {
      characterName = 'Maya Chen'
      if (scene.includes('robotics') || scene.includes('passion')) {
        type = 'vulnerability'
      } else if (scene.includes('choice') || scene.includes('decide')) {
        type = 'decision'
      } else if (scene.includes('mutual') || scene.includes('recognition')) {
        type = 'mutual_recognition'
      }
    } else if (scene.includes('devon')) {
      characterName = 'Devon Kumar'
      if (scene.includes('flowchart') || scene.includes('dad')) {
        type = 'vulnerability'
      } else if (scene.includes('call') || scene.includes('father')) {
        type = 'decision'
      }
    } else if (scene.includes('jordan')) {
      characterName = 'Jordan Packard'
      if (scene.includes('impostor') || scene.includes('job')) {
        type = 'vulnerability'
      } else if (scene.includes('speech') || scene.includes('teach')) {
        type = 'decision'
      }
    }

    moments.push({
      type,
      characterName,
      quote: moment.choice || moment.insight,
      scene: moment.scene,
      timestamp: Date.now() // Placeholder - would need actual timestamp from data
    })
  })

  return moments.slice(0, 10) // Limit to 10 most recent
}

/**
 * Extract career discovery insights
 */
export function parseCareerDiscovery(profile: SkillProfile): CareerInsight {
  // Safely access career matches with null checks
  const careerMatches = profile.careerMatches || []
  const topMatch = careerMatches[0]
  const secondMatch = careerMatches[1]

  // Extract Birmingham opportunities
  const birminghamOpportunities: string[] = []
  careerMatches.forEach(career => {
    if (career && career.localOpportunities) {
      birminghamOpportunities.push(...career.localOpportunities)
    }
  })

  // Determine decision style based on patterns
  let decisionStyle = 'Exploring options'
  const patterns = parseChoicePatterns(profile)
  if (patterns.helping > 40) {
    decisionStyle = 'Values-driven and people-focused'
  } else if (patterns.analytical > 40) {
    decisionStyle = 'Analytical and data-driven'
  } else if (patterns.patience > 30) {
    decisionStyle = 'Thoughtful and deliberate'
  } else if (patterns.exploring > 30) {
    decisionStyle = 'Open to new experiences'
  }

  return {
    topMatch: topMatch ? {
      name: topMatch.name,
      confidence: Math.round(topMatch.matchScore * 100)
    } : { name: 'Still exploring', confidence: 0 },
    secondMatch: secondMatch ? {
      name: secondMatch.name,
      confidence: Math.round(secondMatch.matchScore * 100)
    } : undefined,
    birminghamOpportunities: birminghamOpportunities.slice(0, 3), // Top 3
    decisionStyle
  }
}

/**
 * Parse complete student insights from profile
 */
export function parseStudentInsights(profile: SkillProfile): StudentInsights {
  const keyMoments = profile.keySkillMoments || []
  return {
    userId: profile.userId,
    lastActive: Date.now(), // Placeholder - would need actual last activity timestamp
    currentScene: keyMoments.length > 0 
      ? keyMoments[keyMoments.length - 1].scene 
      : 'Starting journey',
    choicePatterns: parseChoicePatterns(profile),
    characterRelationships: parseCharacterRelationships(profile),
    breakthroughMoments: parseBreakthroughMoments(profile),
    careerDiscovery: parseCareerDiscovery(profile)
  }
}

