/**
 * Learning Objectives Definitions
 * Maps dialogue nodes and choices to specific learning objectives
 * Used for tracking engagement and evidence-based assessment
 */

import type { LearningObjective } from './learning-objectives-tracker'

/**
 * Learning objectives for each character arc
 */
export const LEARNING_OBJECTIVES: Record<string, LearningObjective> = {
  // ============= MAYA ARC OBJECTIVES =============
  'maya_cultural_competence': {
    id: 'maya_cultural_competence',
    title: 'Understand Cultural Dynamics in Career Decisions',
    description: 'Recognize how family values and cultural expectations influence career choices',
    category: 'identity',
    relatedSkills: ['culturalCompetence', 'emotionalIntelligence', 'communication'],
    relatedPatterns: ['helping', 'patience'],
    nodeId: 'maya_family_pressure'
  },
  'maya_identity_exploration': {
    id: 'maya_identity_exploration',
    title: 'Explore Personal vs. Family Expectations',
    description: 'Navigate the tension between personal dreams and family expectations',
    category: 'identity',
    relatedSkills: ['emotionalIntelligence', 'criticalThinking', 'communication'],
    relatedPatterns: ['helping', 'analytical'],
    nodeId: 'maya_robotics_passion'
  },
  'maya_boundary_setting': {
    id: 'maya_boundary_setting',
    title: 'Support Healthy Boundary Setting',
    description: 'Help someone set boundaries while honoring family values',
    category: 'relationship',
    relatedSkills: ['emotionalIntelligence', 'communication', 'leadership'],
    relatedPatterns: ['helping', 'building'],
    nodeId: 'maya_crossroads'
  },

  // ============= DEVON ARC OBJECTIVES =============
  'devon_emotional_logic_integration': {
    id: 'devon_emotional_logic_integration',
    title: 'Integrate Logic and Emotion',
    description: 'Understand how systematic thinking and emotional intelligence work together',
    category: 'decision',
    relatedSkills: ['criticalThinking', 'emotionalIntelligence', 'problemSolving'],
    relatedPatterns: ['analytical', 'helping'],
    nodeId: 'devon_father_relationship'
  },
  'devon_grief_processing': {
    id: 'devon_grief_processing',
    title: 'Navigate Grief and Loss',
    description: 'Support someone processing grief through practical and emotional approaches',
    category: 'relationship',
    relatedSkills: ['emotionalIntelligence', 'communication', 'adaptability'],
    relatedPatterns: ['helping', 'patience'],
    nodeId: 'devon_grief_reveal'
  },
  'devon_systematic_communication': {
    id: 'devon_systematic_communication',
    title: 'Use Structured Approaches for Difficult Conversations',
    description: 'Create systematic tools (like flowcharts) for emotional situations',
    category: 'skill',
    relatedSkills: ['problemSolving', 'communication', 'creativity'],
    relatedPatterns: ['analytical', 'building'],
    nodeId: 'devon_flowchart_conversation'
  },

  // ============= JORDAN ARC OBJECTIVES =============
  'jordan_impostor_syndrome': {
    id: 'jordan_impostor_syndrome',
    title: 'Recognize and Address Impostor Syndrome',
    description: 'Help someone recognize their own value and overcome self-doubt',
    category: 'identity',
    relatedSkills: ['emotionalIntelligence', 'communication', 'leadership'],
    relatedPatterns: ['helping', 'building'],
    nodeId: 'jordan_impostor_reveal'
  },
  'jordan_trade_value': {
    id: 'jordan_trade_value',
    title: 'Value Hands-On Skills and Trade Knowledge',
    description: 'Recognize the value of practical skills alongside academic paths',
    category: 'career',
    relatedSkills: ['criticalThinking', 'culturalCompetence', 'communication'],
    relatedPatterns: ['analytical', 'helping'],
    nodeId: 'jordan_trade_pride'
  },
  'jordan_leadership_potential': {
    id: 'jordan_leadership_potential',
    title: 'Identify Leadership Potential',
    description: 'Help someone recognize their leadership abilities in practical fields',
    category: 'career',
    relatedSkills: ['leadership', 'communication', 'problemSolving'],
    relatedPatterns: ['building', 'helping'],
    nodeId: 'jordan_leadership_path'
  },

  // ============= SAMUEL ARC OBJECTIVES (Meta-Learning) =============
  'samuel_reflective_observation': {
    id: 'samuel_reflective_observation',
    title: 'Reflective Observation',
    description: 'Reflect on the mentorship experience and the impact of your choices on others',
    category: 'meta',
    relatedSkills: ['emotionalIntelligence', 'criticalThinking', 'communication'],
    relatedPatterns: ['patience', 'analytical'],
    nodeId: 'samuel_reflect_on_influence'
  },
  'samuel_abstract_conceptualization': {
    id: 'samuel_abstract_conceptualization',
    title: 'Abstract Conceptualization',
    description: 'Understand underlying patterns of agency, influence, and career development',
    category: 'meta',
    relatedSkills: ['criticalThinking', 'leadership', 'problemSolving'],
    relatedPatterns: ['analytical', 'building'],
    nodeId: 'samuel_reflect_on_agency'
  },
  'samuel_active_experimentation': {
    id: 'samuel_active_experimentation',
    title: 'Active Experimentation',
    description: 'Apply mentorship wisdom to your own future choices and identity',
    category: 'meta',
    relatedSkills: ['adaptability', 'leadership', 'creativity'],
    relatedPatterns: ['exploring', 'building'],
    nodeId: 'samuel_your_pattern_emerges'
  }
}

/**
 * Get learning objectives for a specific node
 */
export function getLearningObjectivesForNode(nodeId: string): LearningObjective[] {
  return Object.values(LEARNING_OBJECTIVES).filter(obj => obj.nodeId === nodeId)
}

/**
 * Get learning objective by ID
 */
export function getLearningObjectiveById(id: string): LearningObjective | undefined {
  return LEARNING_OBJECTIVES[id]
}

/**
 * Get all learning objectives for a character arc
 */
export function getLearningObjectivesForArc(arc: 'maya' | 'devon' | 'jordan'): LearningObjective[] {
  return Object.values(LEARNING_OBJECTIVES).filter(obj => obj.nodeId.startsWith(arc))
}

