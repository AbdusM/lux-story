/**
 * Shared helper functions for admin dashboard pages
 */

import type { SkillProfile } from './skill-profile-adapter'

export function getTopSkills(profile: SkillProfile): string[] {
  if (!profile.skillDemonstrations) return []
  return Object.entries(profile.skillDemonstrations)
    .map(([skill, demos]) => ({
      skill,
      count: Array.isArray(demos) ? demos.length : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(item => item.skill.replace(/([A-Z])/g, ' $1').trim())
}

export function getReadinessPercentage(profile: SkillProfile): number | null {
  if (!profile.careerMatches || profile.careerMatches.length === 0) return null
  const topCareer = profile.careerMatches[0]
  if (!topCareer.requiredSkills) return null
  
  const skills = Object.values(topCareer.requiredSkills)
  const avgGap = skills.reduce((sum, skill) => sum + skill.gap, 0) / skills.length
  return Math.max(0, Math.min(100, Math.round((1 - avgGap) * 100)))
}

export function formatSkillName(skill: string): string {
  return skill
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

export function getReadinessDisplay(readiness: string): { text: string; variant: 'default' | 'secondary' | 'outline' } {
  switch (readiness) {
    case 'near_ready':
      return { text: 'Near Ready', variant: 'default' }
    case 'skill_gaps':
      return { text: 'Skill Gaps', variant: 'secondary' }
    case 'exploratory':
      return { text: 'Exploratory', variant: 'outline' }
    default:
      return { text: 'Unknown', variant: 'outline' }
  }
}

export function getCareersUsingSkill(profile: SkillProfile, skillName: string) {
  if (!profile.careerMatches) return []
  return profile.careerMatches.filter(career =>
    Object.keys(career.requiredSkills).some(reqSkill =>
      reqSkill.toLowerCase() === skillName.toLowerCase()
    )
  ).slice(0, 3)
}

export function getRecencyIndicator(timestamp?: number): { color: string; label: string; familyLabel: string; researchLabel: string } {
  if (!timestamp) return {
    color: 'bg-gray-400',
    label: 'Unknown',
    familyLabel: '',
    researchLabel: ''
  }

  const now = Date.now()
  const daysSince = (now - timestamp) / (1000 * 60 * 60 * 24)

  if (daysSince < 3) {
    return {
      color: 'bg-green-500',
      label: 'Recent (<3 days)',
      familyLabel: 'New!',
      researchLabel: '<3 days'
    }
  }
  if (daysSince < 7) {
    return {
      color: 'bg-yellow-500',
      label: 'This week',
      familyLabel: 'This week',
      researchLabel: '3-7 days'
    }
  }
  return {
    color: 'bg-gray-400',
    label: `${Math.floor(daysSince)} days ago`,
    familyLabel: '',
    researchLabel: `>${Math.floor(daysSince)} days`
  }
}

export function getSkillColor(count: number, maxCount: number): string {
  if (maxCount === 0) return 'bg-gray-300'
  const ratio = count / maxCount
  if (ratio > 0.7) return 'bg-orange-500'
  if (ratio > 0.4) return 'bg-yellow-500'
  return 'bg-blue-500'
}

export function getBirminghamConnectionsForSkill(skillName: string): string[] {
  const skillToCareerMap: Record<string, string[]> = {
    'critical_thinking': ['Healthcare Tech', 'Engineering (Southern Company)', 'Data Analytics'],
    'communication': ['Healthcare (UAB)', 'Education (Birmingham Schools)', 'Social Work'],
    'collaboration': ['Healthcare Teams', 'Community Organizations', 'Tech Startups'],
    'creativity': ['Innovation Depot', 'Creative Industries', 'Marketing'],
    'adaptability': ['All Professional Paths', 'Healthcare', 'Tech'],
    'leadership': ['Management Roles', 'Community Leadership', 'Healthcare Administration'],
    'digital_literacy': ['Tech Roles', 'Healthcare Informatics', 'Data Analytics'],
    'emotional_intelligence': ['Healthcare', 'Education', 'Social Work', 'Counseling'],
    'cultural_competence': ['Community Health', 'Education', 'Social Services'],
    'financial_literacy': ['Regions Bank', 'Local Credit Unions', 'Financial Planning'],
    'time_management': ['All Professional Paths', 'Project Management', 'Operations'],
    'problem_solving': ['Engineering (Southern Company)', 'Healthcare Tech', 'Data Analytics']
  }

  return skillToCareerMap[skillName.toLowerCase()] || ['Various Birmingham Career Paths']
}
