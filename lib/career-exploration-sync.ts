/**
 * Career Exploration Sync
 * Converts career analytics data into career_explorations records
 * 
 * This bridges the gap between the game's career tracking and the admin dashboard
 */

import { queueCareerAnalyticsSync } from './sync-queue'

// Map career interests to specific career names with match scores
const CAREER_MAPPING = {
  'healthcare': [
    { name: 'Healthcare Professional', matchScore: 0.85, readinessLevel: 'near_ready' },
    { name: 'Nurse', matchScore: 0.80, readinessLevel: 'emerging' },
    { name: 'Medical Assistant', matchScore: 0.75, readinessLevel: 'exploratory' }
  ],
  'technology': [
    { name: 'Software Developer', matchScore: 0.85, readinessLevel: 'near_ready' },
    { name: 'IT Support Specialist', matchScore: 0.80, readinessLevel: 'emerging' },
    { name: 'Data Analyst', matchScore: 0.75, readinessLevel: 'exploratory' }
  ],
  'engineering': [
    { name: 'Mechanical Engineer', matchScore: 0.85, readinessLevel: 'near_ready' },
    { name: 'Civil Engineer', matchScore: 0.80, readinessLevel: 'emerging' },
    { name: 'Engineering Technician', matchScore: 0.75, readinessLevel: 'exploratory' }
  ],
  'education': [
    { name: 'Teacher', matchScore: 0.85, readinessLevel: 'near_ready' },
    { name: 'Educational Assistant', matchScore: 0.80, readinessLevel: 'emerging' },
    { name: 'Tutor', matchScore: 0.75, readinessLevel: 'exploratory' }
  ],
  'creative': [
    { name: 'Graphic Designer', matchScore: 0.85, readinessLevel: 'near_ready' },
    { name: 'Marketing Specialist', matchScore: 0.80, readinessLevel: 'emerging' },
    { name: 'Content Creator', matchScore: 0.75, readinessLevel: 'exploratory' }
  ]
}

// Birmingham-specific opportunities and education paths
const BIRMINGHAM_CAREER_DATA = {
  'Healthcare Professional': {
    localOpportunities: ['UAB Hospital', 'Children\'s of Alabama', 'Birmingham VA Medical Center'],
    educationPaths: ['UAB School of Medicine', 'UAB School of Nursing', 'Jefferson State Nursing Program']
  },
  'Software Developer': {
    localOpportunities: ['Shipt (Birmingham HQ)', 'Regions Bank Technology', 'UAB IT Department'],
    educationPaths: ['UAB Computer Science', 'Jefferson State Community College', 'Birmingham Coding Bootcamp']
  },
  'Mechanical Engineer': {
    localOpportunities: ['Southern Company', 'ACIPCO', 'Birmingham Engineering Firms'],
    educationPaths: ['UAB School of Engineering', 'Jefferson State Engineering Program']
  },
  'Teacher': {
    localOpportunities: ['Birmingham City Schools', 'Jefferson County Schools', 'Private Schools'],
    educationPaths: ['UAB School of Education', 'Samford University Education Program']
  },
  'Graphic Designer': {
    localOpportunities: ['Birmingham Marketing Agencies', 'Local Design Studios', 'Freelance Opportunities'],
    educationPaths: ['UAB Department of Art and Art History', 'Birmingham School of Fine Arts']
  }
}

/**
 * Convert career interests to career explorations
 */
export function convertCareerInterestsToExplorations(
  userId: string,
  careerInterests: string[],
  platformsExplored: string[],
  choicesMade: number
): Array<{
  user_id: string
  career_name: string
  match_score: number
  readiness_level: string
  local_opportunities: string[]
  education_paths: string[]
}> {
  const explorations = []
  
  // Convert each career interest to career explorations
  for (const interest of careerInterests) {
    const careers = CAREER_MAPPING[interest as keyof typeof CAREER_MAPPING] || []
    
    for (const career of careers) {
      const birminghamData = BIRMINGHAM_CAREER_DATA[career.name as keyof typeof BIRMINGHAM_CAREER_DATA] || {
        localOpportunities: ['Local Birmingham Opportunities'],
        educationPaths: ['Birmingham Education Programs']
      }
      
      // Adjust match score based on engagement
      let adjustedMatchScore = career.matchScore
      if (choicesMade > 10) adjustedMatchScore += 0.05
      if (platformsExplored.length > 2) adjustedMatchScore += 0.05
      adjustedMatchScore = Math.min(1.0, adjustedMatchScore)
      
      explorations.push({
        user_id: userId,
        career_name: career.name,
        match_score: adjustedMatchScore,
        readiness_level: career.readinessLevel,
        local_opportunities: birminghamData.localOpportunities,
        education_paths: birminghamData.educationPaths
      })
    }
  }
  
  return explorations
}

/**
 * Queue career explorations for sync to database
 */
export function queueCareerExplorations(
  userId: string,
  careerInterests: string[],
  platformsExplored: string[],
  choicesMade: number
): void {
  const explorations = convertCareerInterestsToExplorations(
    userId,
    careerInterests,
    platformsExplored,
    choicesMade
  )
  
  // Queue each career exploration for sync
  for (const exploration of explorations) {
    // Use the existing career_analytics sync mechanism
    // We'll need to extend it to handle career_explorations
    queueCareerAnalyticsSync({
      user_id: userId,
      career_exploration: exploration,
      platforms_explored: platformsExplored,
      career_interests: careerInterests,
      choices_made: choicesMade,
      time_spent_seconds: 0,
      sections_viewed: [],
      birmingham_opportunities: []
    })
  }
  
  console.log(`[CareerExplorationSync] Queued ${explorations.length} career explorations for ${userId}`)
}

/**
 * Check if user has enough data to generate career explorations
 */
export function shouldGenerateCareerExplorations(
  careerInterests: string[],
  choicesMade: number,
  platformsExplored: string[]
): boolean {
  // Generate career explorations if:
  // 1. User has at least one career interest, OR
  // 2. User has made at least 5 choices and explored at least 2 platforms
  return careerInterests.length > 0 || (choicesMade >= 5 && platformsExplored.length >= 2)
}
