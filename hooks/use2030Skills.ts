"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getFutureSkillsSystem, FutureSkills, CareerPath2030, SkillContext } from '@/lib/2030-skills-system'

/**
 * Hook for 2030 skills development and future career path matching
 * Integrates with all existing systems for comprehensive skill tracking
 */
export function use2030Skills() {
  const [skills, setSkills] = useState<FutureSkills>({
    criticalThinking: 0.5,
    communication: 0.5,
    collaboration: 0.5,
    creativity: 0.5,
    adaptability: 0.5,
    leadership: 0.5,
    digitalLiteracy: 0.5,
    emotionalIntelligence: 0.5,
    culturalCompetence: 0.5,
    financialLiteracy: 0.5,
    timeManagement: 0.5,
    problemSolving: 0.5
  })

  const [skillContexts, setSkillContexts] = useState<SkillContext[]>([])
  const [matchingCareerPaths, setMatchingCareerPaths] = useState<CareerPath2030[]>([])

  const futureSkillsSystem = useMemo(() => getFutureSkillsSystem(), [])

  // Track choice for 2030 skills development
  const trackChoice = useCallback((choiceText: string, sceneContext: string) => {
    const newSkillContexts = futureSkillsSystem.analyzeChoiceForSkills(choiceText, sceneContext)
    
    if (newSkillContexts.length > 0) {
      setSkillContexts(prev => [...prev, ...newSkillContexts])
      
      // Update skills from the system
      const updatedSkills = futureSkillsSystem.getSkills()
      setSkills(updatedSkills)
      
      // Update matching career paths
      const newMatchingPaths = futureSkillsSystem.getMatchingCareerPaths()
      setMatchingCareerPaths(newMatchingPaths)
    }
  }, [futureSkillsSystem])

  // Get skill development prompt
  const getSkillPrompt = useCallback((skillType: keyof FutureSkills) => {
    return futureSkillsSystem.getSkillPrompt(skillType)
  }, [futureSkillsSystem])

  // Get skills summary
  const getSkillsSummary = useCallback(() => {
    return futureSkillsSystem.getSkillsSummary()
  }, [futureSkillsSystem])

  // Get matching career paths
  const getMatchingCareerPaths = useCallback(() => {
    return futureSkillsSystem.getMatchingCareerPaths()
  }, [futureSkillsSystem])

  // Get skill development suggestions
  const getSkillDevelopmentSuggestions = useCallback(() => {
    const skillsSummary = futureSkillsSystem.getSkillsSummary()
    const suggestions: string[] = []

    // Suggest development for low skills
    skillsSummary.developingSkills.forEach((skill: any) => {
      suggestions.push(`Consider developing your ${skill.skill} skills - they're important for many careers.`)
    })

    // Suggest career paths for high skills
    const topSkills = skillsSummary.topSkills.slice(0, 3)
    if (topSkills.length > 0) {
      const skillNames = topSkills.map((s: any) => s.skill).join(', ')
      suggestions.push(`Your strong ${skillNames} skills open up many career opportunities.`)
    }

    return suggestions
  }, [futureSkillsSystem])

  // Get contextual skill feedback
  const getContextualSkillFeedback = useCallback((choiceText: string) => {
    const recentContexts = skillContexts.slice(-5) // Last 5 skill contexts
    const relevantContexts = recentContexts.filter(context => 
      context.choiceText.toLowerCase().includes(choiceText.toLowerCase().split(' ')[0])
    )

    if (relevantContexts.length === 0) return null

    const topContext = relevantContexts[0]
    return {
      skill: topContext.skillType,
      explanation: topContext.explanation,
      value: topContext.skillValue
    }
  }, [skillContexts])

  // Reset skills
  const resetSkills = useCallback(() => {
    futureSkillsSystem.reset()
    setSkills({
      criticalThinking: 0.5,
      communication: 0.5,
      collaboration: 0.5,
      creativity: 0.5,
      adaptability: 0.5,
      leadership: 0.5,
      digitalLiteracy: 0.5,
      emotionalIntelligence: 0.5,
      culturalCompetence: 0.5,
      financialLiteracy: 0.5,
      timeManagement: 0.5,
      problemSolving: 0.5
    })
    setSkillContexts([])
    setMatchingCareerPaths([])
  }, [futureSkillsSystem])

  // Auto-update career paths when skills change
  useEffect(() => {
    const newMatchingPaths = futureSkillsSystem.getMatchingCareerPaths()
    setMatchingCareerPaths(newMatchingPaths)
  }, [skills, futureSkillsSystem])

  return {
    skills,
    skillContexts,
    matchingCareerPaths,
    trackChoice,
    getSkillPrompt,
    getSkillsSummary,
    getMatchingCareerPaths,
    getSkillDevelopmentSuggestions,
    getContextualSkillFeedback,
    resetSkills
  }
}
