/**
 * Birmingham Career Opportunities Integration
 *
 * Real Birmingham-area career opportunities, internships, and pathways
 * organized by career platform and accessibility level
 */

export interface BirminghamOpportunity {
  id: string
  name: string
  organization: string
  type: 'internship' | 'program' | 'job_shadow' | 'mentorship' | 'volunteer' | 'course' | 'event'
  description: string
  requirements: string[]
  applicationMethod: string
  website?: string
  contactInfo?: string
  timeCommitment: string
  compensation?: string
  location: string
  tags: string[]
  ageRange: string
  seasonalAvailability?: string
}

export interface OpportunityFilter {
  platforms: string[]
  types: BirminghamOpportunity['type'][]
  timeCommitment: 'minimal' | 'moderate' | 'significant' | 'any'
  compensation: 'paid' | 'unpaid' | 'stipend' | 'any'
  location: 'downtown' | 'uab' | 'southside' | 'remote' | 'any'
}

export interface PersonalizedRecommendation {
  opportunity: BirminghamOpportunity
  matchScore: number
  matchReasons: string[]
  nextSteps: string[]
  platformAlignment: string
}

/**
 * Birmingham Career Opportunities Database
 * Real organizations and programs in Birmingham area
 */
const BIRMINGHAM_OPPORTUNITIES: BirminghamOpportunity[] = [
  // Healthcare Platform Opportunities
  {
    id: 'uab-medical-shadow',
    name: 'Medical Professional Shadowing',
    organization: 'UAB Medical Center',
    type: 'job_shadow',
    description: 'Shadow doctors, nurses, and healthcare professionals in various departments',
    requirements: ['High school student', 'Health screening', 'Application form'],
    applicationMethod: 'UAB Volunteer Services application',
    website: 'https://www.uabmedicine.org/volunteer',
    timeCommitment: '4-8 hours per week',
    location: 'UAB Hospital District',
    tags: ['healthcare', 'medicine', 'direct_care', 'hospital'],
    ageRange: '16-18',
    seasonalAvailability: 'Year-round'
  },
  {
    id: 'childrens-volunteer',
    name: 'Pediatric Care Volunteer',
    organization: 'Children\'s of Alabama',
    type: 'volunteer',
    description: 'Support child patients and families through play therapy and comfort care',
    requirements: ['Age 16+', 'Background check', 'Training completion'],
    applicationMethod: 'Online volunteer application',
    timeCommitment: '3-6 hours per week',
    location: 'Children\'s Hospital',
    tags: ['pediatrics', 'patient_care', 'child_development'],
    ageRange: '16-18'
  },
  {
    id: 'nursing-exploration',
    name: 'Future Nurses Summer Program',
    organization: 'UAB School of Nursing',
    type: 'program',
    description: 'Week-long intensive exploring nursing careers and healthcare pathways',
    requirements: ['Rising junior/senior', 'GPA 3.0+', 'Essay application'],
    applicationMethod: 'School counselor referral',
    timeCommitment: '1 week intensive',
    compensation: 'Stipend provided',
    location: 'UAB Campus',
    tags: ['nursing', 'healthcare_education', 'summer_program'],
    ageRange: '16-17',
    seasonalAvailability: 'Summer only'
  },

  // Engineering/Building Platform Opportunities
  {
    id: 'southern-company-stem',
    name: 'Power Systems Engineering Mentorship',
    organization: 'Southern Company',
    type: 'mentorship',
    description: 'Monthly mentoring with electrical engineers working on power grid modernization',
    requirements: ['Interest in engineering', 'Math/science coursework', 'Commitment to program'],
    applicationMethod: 'School STEM coordinator',
    timeCommitment: '2 hours per month',
    location: 'Downtown Birmingham office',
    tags: ['electrical_engineering', 'power_systems', 'infrastructure'],
    ageRange: '15-18'
  },
  {
    id: 'nucor-manufacturing',
    name: 'Steel Manufacturing Apprentice Program',
    organization: 'Nucor Steel Birmingham',
    type: 'program',
    description: 'Learn modern steel manufacturing, automation, and quality control',
    requirements: ['Age 17+', 'Physical fitness', 'Safety training'],
    applicationMethod: 'Direct application to HR',
    timeCommitment: 'Part-time during school year',
    compensation: 'Paid apprenticeship',
    location: 'Nucor Birmingham facility',
    tags: ['manufacturing', 'steel_production', 'automation', 'skilled_trades'],
    ageRange: '17-18'
  },
  {
    id: 'bbva-field-engineering',
    name: 'Stadium Engineering Behind-the-Scenes',
    organization: 'BBVA Field',
    type: 'job_shadow',
    description: 'See how engineers maintain and operate a modern sports facility',
    requirements: ['Interest in facilities/civil engineering', 'Background check'],
    applicationMethod: 'Contact facility operations',
    timeCommitment: '1 day per month',
    location: 'BBVA Field',
    tags: ['civil_engineering', 'facilities_management', 'sports_engineering'],
    ageRange: '14-18'
  },

  // Technology/Data Platform Opportunities
  {
    id: 'regions-fintech',
    name: 'Banking Technology Innovation Lab',
    organization: 'Regions Bank',
    type: 'internship',
    description: 'Work with fintech developers on mobile banking and digital solutions',
    requirements: ['Coding experience', 'GPA 3.5+', 'Portfolio or GitHub'],
    applicationMethod: 'Online application portal',
    timeCommitment: '20 hours per week (summer)',
    compensation: 'Paid internship',
    location: 'Regions Center downtown',
    tags: ['fintech', 'mobile_development', 'digital_banking', 'software'],
    ageRange: '17-18',
    seasonalAvailability: 'Summer primarily'
  },
  {
    id: 'bbva-innovation',
    name: 'Future Tech Leaders Program',
    organization: 'BBVA Innovation Center',
    type: 'program',
    description: 'Explore emerging technologies: AI, blockchain, digital payments',
    requirements: ['Strong academic record', 'Technology interest', 'Application essay'],
    applicationMethod: 'School technology teacher nomination',
    timeCommitment: '6-week program',
    compensation: 'Stipend and equipment',
    location: 'Innovation Center downtown',
    tags: ['artificial_intelligence', 'blockchain', 'innovation', 'emerging_tech'],
    ageRange: '16-18',
    seasonalAvailability: 'Summer'
  },
  {
    id: 'uab-health-informatics',
    name: 'Medical Technology Data Analysis',
    organization: 'UAB School of Health Professions',
    type: 'course',
    description: 'Learn how data science improves healthcare outcomes and patient care',
    requirements: ['Algebra II completion', 'Interest in healthcare + technology'],
    applicationMethod: 'Dual enrollment application',
    timeCommitment: '3 credit hours',
    location: 'UAB Campus',
    tags: ['health_informatics', 'data_analysis', 'medical_technology'],
    ageRange: '16-18'
  },

  // Sustainability/Environment Platform Opportunities
  {
    id: 'alabama-power-renewable',
    name: 'Clean Energy Future Program',
    organization: 'Alabama Power',
    type: 'program',
    description: 'Explore solar, wind, and grid storage technologies for sustainable energy',
    requirements: ['Science coursework', 'Environmental interest', 'Team project'],
    applicationMethod: 'Teacher or counselor recommendation',
    timeCommitment: '4-week summer program',
    compensation: 'Educational stipend',
    location: 'Multiple renewable sites',
    tags: ['renewable_energy', 'solar_power', 'environmental_science'],
    ageRange: '15-17',
    seasonalAvailability: 'Summer'
  },
  {
    id: 'city-environmental-services',
    name: 'Urban Sustainability Volunteer',
    organization: 'City of Birmingham Environmental Services',
    type: 'volunteer',
    description: 'Water quality testing, air monitoring, and green infrastructure projects',
    requirements: ['Reliable transportation', 'Outdoor work capability'],
    applicationMethod: 'City volunteer coordinator',
    timeCommitment: '4-8 hours per month',
    location: 'Various city locations',
    tags: ['environmental_monitoring', 'water_quality', 'urban_planning'],
    ageRange: '16-18'
  },
  {
    id: 'urban-agriculture',
    name: 'Community Garden Leadership',
    organization: 'Birmingham Urban Agriculture',
    type: 'mentorship',
    description: 'Lead community garden projects and teach sustainable growing practices',
    requirements: ['Gardening experience helpful', 'Leadership interest'],
    applicationMethod: 'Community organization contact',
    timeCommitment: '6 hours per week',
    location: 'Community gardens citywide',
    tags: ['urban_agriculture', 'sustainability', 'community_leadership'],
    ageRange: '15-18'
  },

  // Entrepreneurship/Innovation Opportunities
  {
    id: 'innovation-depot-incubator',
    name: 'Young Entrepreneurs Accelerator',
    organization: 'Innovation Depot',
    type: 'program',
    description: 'Develop business ideas with mentor support and potential funding',
    requirements: ['Business concept', 'Presentation skills', 'Commitment to program'],
    applicationMethod: 'Pitch competition application',
    timeCommitment: '12-week program',
    location: 'Innovation Depot downtown',
    tags: ['entrepreneurship', 'startup_development', 'business_planning'],
    ageRange: '16-18'
  },
  {
    id: 'velocity-accelerator',
    name: 'Tech Startup Exploration',
    organization: 'Velocity Accelerator',
    type: 'job_shadow',
    description: 'Observe startup operations, from product development to customer acquisition',
    requirements: ['Interest in business/technology', 'Professional behavior'],
    applicationMethod: 'Direct contact with accelerator',
    timeCommitment: '2-4 hours per week',
    location: 'Velocity downtown location',
    tags: ['startup_operations', 'product_development', 'business_development'],
    ageRange: '17-18'
  },

  // Creative Arts Platform Opportunities
  {
    id: 'uab-arts-mentorship',
    name: 'Visual Arts Professional Mentorship',
    organization: 'UAB Department of Art and Art History',
    type: 'mentorship',
    description: 'Work with professional artists on portfolio development and career planning',
    requirements: ['Art portfolio', 'Serious commitment to artistic development'],
    applicationMethod: 'Portfolio submission to department',
    timeCommitment: '4 hours per week',
    location: 'UAB Arts buildings',
    tags: ['visual_arts', 'portfolio_development', 'artistic_career'],
    ageRange: '16-18'
  },
  {
    id: 'birmingham-design-week',
    name: 'Design Week Student Ambassador',
    organization: 'Birmingham Design Week',
    type: 'event',
    description: 'Support design events and network with creative professionals',
    requirements: ['Interest in design', 'Communication skills', 'Event availability'],
    applicationMethod: 'Student ambassador application',
    timeCommitment: '1 week intensive',
    location: 'Various Birmingham venues',
    tags: ['graphic_design', 'event_planning', 'creative_networking'],
    ageRange: '16-18',
    seasonalAvailability: 'Annual event'
  },

  // Service/Community Platform Opportunities
  {
    id: 'united-way-leadership',
    name: 'Community Impact Youth Leadership',
    organization: 'United Way of Central Alabama',
    type: 'program',
    description: 'Learn about social issues and develop community solutions',
    requirements: ['Leadership potential', 'Community service interest', 'Application'],
    applicationMethod: 'School counselor nomination',
    timeCommitment: '8-week program',
    location: 'United Way office',
    tags: ['community_service', 'social_issues', 'nonprofit_operations'],
    ageRange: '16-18'
  },
  {
    id: 'civil-rights-institute',
    name: 'Civil Rights Education Docent',
    organization: 'Birmingham Civil Rights Institute',
    type: 'volunteer',
    description: 'Lead tours and educational programs about civil rights history',
    requirements: ['Public speaking skills', 'History knowledge', 'Training completion'],
    applicationMethod: 'Institute volunteer coordinator',
    timeCommitment: '6 hours per month',
    location: 'Civil Rights Institute',
    tags: ['history_education', 'public_speaking', 'civil_rights'],
    ageRange: '16-18'
  }
]

/**
 * Birmingham Opportunities Engine
 */
export class BirminghamOpportunitiesEngine {
  private static instance: BirminghamOpportunitiesEngine | null = null
  private opportunities: BirminghamOpportunity[] = BIRMINGHAM_OPPORTUNITIES

  static getInstance(): BirminghamOpportunitiesEngine {
    if (!this.instance) {
      this.instance = new BirminghamOpportunitiesEngine()
    }
    return this.instance
  }

  /**
   * Get opportunities by platform resonance
   */
  getOpportunitiesByPlatform(platformId: string, limit: number = 5): BirminghamOpportunity[] {
    const platformMappings: Record<string, string[]> = {
      'platform-1': ['healthcare', 'medicine', 'direct_care', 'patient_care', 'nursing'],
      'platform-3': ['engineering', 'manufacturing', 'infrastructure', 'construction', 'skilled_trades'],
      'platform-7': ['technology', 'software', 'data_analysis', 'fintech', 'innovation'],
      'platform-9': ['environmental', 'sustainability', 'renewable_energy', 'urban_agriculture'],
      'platform-forgotten': ['community_service', 'social_issues', 'nonprofit_operations'],
      'platform-7-half': ['interdisciplinary', 'innovation', 'creative_problem_solving']
    }

    const relevantTags = platformMappings[platformId] || []

    return this.opportunities
      .filter(opp => opp.tags.some(tag => relevantTags.some(relevant => tag.includes(relevant))))
      .sort((a, b) => {
        // Score by tag relevance
        const scoreA = a.tags.filter(tag => relevantTags.some(rel => tag.includes(rel))).length
        const scoreB = b.tags.filter(tag => relevantTags.some(rel => tag.includes(rel))).length
        return scoreB - scoreA
      })
      .slice(0, limit)
  }

  /**
   * Generate personalized recommendations based on player persona
   */
  getPersonalizedRecommendations(
    platformId: string,
    playerPatterns: Record<string, number>,
    ageRange: string = '16-18'
  ): PersonalizedRecommendation[] {
    const opportunities = this.getOpportunitiesByPlatform(platformId)
    const recommendations: PersonalizedRecommendation[] = []

    for (const opportunity of opportunities) {
      // Age filter
      if (!this.ageRangeMatches(opportunity.ageRange, ageRange)) continue

      // Calculate match score
      let matchScore = 0.3 // Base score
      const matchReasons: string[] = []

      // Pattern matching
      if (playerPatterns.helping > 0.3 && opportunity.tags.includes('patient_care')) {
        matchScore += 0.3
        matchReasons.push('Strong helping pattern matches patient care focus')
      }

      if (playerPatterns.building > 0.3 && opportunity.tags.includes('engineering')) {
        matchScore += 0.3
        matchReasons.push('Building pattern aligns with engineering opportunities')
      }

      if (playerPatterns.analyzing > 0.3 && opportunity.tags.includes('data_analysis')) {
        matchScore += 0.3
        matchReasons.push('Analytical thinking matches data-focused work')
      }

      if (playerPatterns.patience > 0.3 && opportunity.tags.includes('environmental')) {
        matchScore += 0.2
        matchReasons.push('Patient approach suits environmental long-term thinking')
      }

      // Opportunity type preferences
      if (opportunity.type === 'internship' || opportunity.type === 'program') {
        matchScore += 0.1
        matchReasons.push('Structured learning opportunity')
      }

      // Compensation factor
      if (opportunity.compensation && opportunity.compensation.includes('Paid')) {
        matchScore += 0.1
        matchReasons.push('Paid opportunity provides professional experience')
      }

      // Generate next steps
      const nextSteps = this.generateNextSteps(opportunity)

      if (matchScore > 0.4) { // Only recommend strong matches
        recommendations.push({
          opportunity,
          matchScore: Math.min(matchScore, 1.0),
          matchReasons,
          nextSteps,
          platformAlignment: platformId
        })
      }
    }

    return recommendations.sort((a, b) => b.matchScore - a.matchScore)
  }

  /**
   * Get opportunities by filter criteria
   */
  getFilteredOpportunities(filter: Partial<OpportunityFilter>): BirminghamOpportunity[] {
    return this.opportunities.filter(opp => {
      // Type filter
      if (filter.types && !filter.types.includes(opp.type)) return false

      // Time commitment filter
      if (filter.timeCommitment && filter.timeCommitment !== 'any') {
        const timeCategory = this.categorizeTimeCommitment(opp.timeCommitment)
        if (timeCategory !== filter.timeCommitment) return false
      }

      // Compensation filter
      if (filter.compensation && filter.compensation !== 'any') {
        const hasCompensation = !!opp.compensation
        const isPaid = opp.compensation?.includes('Paid') || opp.compensation?.includes('stipend')

        if (filter.compensation === 'paid' && !isPaid) return false
        if (filter.compensation === 'unpaid' && hasCompensation && isPaid) return false
        if (filter.compensation === 'stipend' && !opp.compensation?.includes('stipend')) return false
      }

      // Location filter
      if (filter.location && filter.location !== 'any') {
        const locationMatch = this.matchesLocationFilter(opp.location, filter.location)
        if (!locationMatch) return false
      }

      return true
    })
  }

  /**
   * Get opportunity by ID
   */
  getOpportunityById(id: string): BirminghamOpportunity | null {
    return this.opportunities.find(opp => opp.id === id) || null
  }

  /**
   * Get all unique organizations
   */
  getOrganizations(): string[] {
    return [...new Set(this.opportunities.map(opp => opp.organization))].sort()
  }

  /**
   * Get opportunities by organization
   */
  getOpportunitiesByOrganization(organization: string): BirminghamOpportunity[] {
    return this.opportunities.filter(opp => opp.organization === organization)
  }

  /**
   * Helper: Check if age range matches
   */
  private ageRangeMatches(opportunityRange: string, playerAge: string): boolean {
    // Simple check - can be made more sophisticated
    return opportunityRange.includes(playerAge.split('-')[0])
  }

  /**
   * Helper: Categorize time commitment
   */
  private categorizeTimeCommitment(timeCommitment: string): 'minimal' | 'moderate' | 'significant' {
    const time = timeCommitment.toLowerCase()
    if (time.includes('1-3') || time.includes('2 hours') || time.includes('1 day')) return 'minimal'
    if (time.includes('4-8') || time.includes('week') || time.includes('6 hours')) return 'moderate'
    return 'significant'
  }

  /**
   * Helper: Check location filter match
   */
  private matchesLocationFilter(location: string, filter: string): boolean {
    const loc = location.toLowerCase()
    switch (filter) {
      case 'downtown': return loc.includes('downtown') || loc.includes('center')
      case 'uab': return loc.includes('uab') || loc.includes('campus')
      case 'southside': return loc.includes('southside')
      case 'remote': return loc.includes('remote') || loc.includes('online')
      default: return true
    }
  }

  /**
   * Helper: Generate contextual next steps
   */
  private generateNextSteps(opportunity: BirminghamOpportunity): string[] {
    const steps: string[] = []

    switch (opportunity.applicationMethod) {
      case 'School counselor referral':
      case 'School STEM coordinator':
      case 'Teacher or counselor recommendation':
        steps.push('Talk to your school counselor about this opportunity')
        break
      case 'Online application portal':
      case 'Direct application to HR':
        steps.push('Visit their website to start the application process')
        break
      case 'Portfolio submission to department':
        steps.push('Prepare your portfolio for submission')
        break
      default:
        steps.push('Contact the organization directly')
    }

    if (opportunity.requirements.some(req => req.includes('GPA'))) {
      steps.push('Ensure your GPA meets the requirements')
    }

    if (opportunity.requirements.some(req => req.includes('portfolio'))) {
      steps.push('Prepare a strong portfolio showcasing your work')
    }

    if (opportunity.type === 'volunteer') {
      steps.push('Complete any required background checks or training')
    }

    steps.push(`Learn more about ${opportunity.organization} and their mission`)

    return steps.slice(0, 4) // Limit to 4 steps
  }
}

/**
 * Get global Birmingham opportunities engine
 */
export function getBirminghamOpportunities(): BirminghamOpportunitiesEngine {
  return BirminghamOpportunitiesEngine.getInstance()
}

/**
 * Get opportunities for a platform (convenience function)
 */
export function getOpportunitiesForPlatform(platformId: string, limit?: number): BirminghamOpportunity[] {
  return getBirminghamOpportunities().getOpportunitiesByPlatform(platformId, limit)
}

/**
 * Get personalized recommendations (convenience function)
 */
export function getPersonalizedOpportunities(
  platformId: string,
  playerPatterns: Record<string, number>,
  ageRange?: string
): PersonalizedRecommendation[] {
  return getBirminghamOpportunities().getPersonalizedRecommendations(platformId, playerPatterns, ageRange)
}