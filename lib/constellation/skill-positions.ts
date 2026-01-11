/**
 * Pre-computed skill positions for the Skills constellation view
 * Skills are organized in 6 organic clusters based on how they're demonstrated together
 */

export type SkillCluster = 'mind' | 'heart' | 'voice' | 'hands' | 'compass' | 'craft' | 'center'

export interface SkillNodeData {
  id: string
  name: string
  position: { x: number; y: number }
  cluster: SkillCluster
  color: string // Hex color for SVG
}

// Cluster definitions with display info
export const SKILL_CLUSTERS: Record<SkillCluster, { name: string; description: string; color: string }> = {
  mind: { name: 'Mind', description: 'Analytical & Technical', color: '#3B82F6' }, // blue-500
  heart: { name: 'Heart', description: 'Relational & Empathetic', color: '#EC4899' }, // pink-500
  voice: { name: 'Voice', description: 'Creative & Expressive', color: '#8B5CF6' }, // violet-500
  hands: { name: 'Hands', description: 'Action & Leadership', color: '#F97316' }, // orange-500
  compass: { name: 'Compass', description: 'Values & Adaptability', color: '#10B981' }, // emerald-500
  craft: { name: 'Craft', description: 'Mastery & Focus', color: '#6366F1' }, // indigo-500
  center: { name: 'Hub', description: 'Core Skill', color: '#FBBF24' } // amber-400
}

// 40 skills positioned in constellation layout (expanded from initial 26)
export const SKILL_NODES: SkillNodeData[] = [
  // CENTER HUB - Communication connects all clusters
  { id: 'communication', name: 'Communication', position: { x: 50, y: 45 }, cluster: 'center', color: '#FBBF24' },

  // MIND CLUSTER (top-center, 10-2 o'clock) - 7 skills
  { id: 'critical_thinking', name: 'Critical Thinking', position: { x: 50, y: 12 }, cluster: 'mind', color: '#3B82F6' },
  { id: 'problem_solving', name: 'Problem Solving', position: { x: 62, y: 18 }, cluster: 'mind', color: '#3B82F6' },
  { id: 'systems_thinking', name: 'Systems Thinking', position: { x: 38, y: 18 }, cluster: 'mind', color: '#3B82F6' },
  { id: 'digital_literacy', name: 'Digital Literacy', position: { x: 58, y: 28 }, cluster: 'mind', color: '#3B82F6' },
  { id: 'technical_literacy', name: 'Technical Literacy', position: { x: 42, y: 28 }, cluster: 'mind', color: '#3B82F6' },
  { id: 'information_literacy', name: 'Information Literacy', position: { x: 50, y: 22 }, cluster: 'mind', color: '#3B82F6' },
  { id: 'strategic_thinking', name: 'Strategic Thinking', position: { x: 68, y: 25 }, cluster: 'mind', color: '#3B82F6' },

  // HEART CLUSTER (left, 8-10 o'clock) - 7 skills
  { id: 'emotional_intelligence', name: 'Emotional Intelligence', position: { x: 18, y: 32 }, cluster: 'heart', color: '#EC4899' },
  { id: 'empathy', name: 'Empathy', position: { x: 12, y: 42 }, cluster: 'heart', color: '#EC4899' },
  { id: 'patience', name: 'Patience', position: { x: 18, y: 52 }, cluster: 'heart', color: '#EC4899' },
  { id: 'cultural_competence', name: 'Cultural Competence', position: { x: 28, y: 38 }, cluster: 'heart', color: '#EC4899' },
  { id: 'mentorship', name: 'Mentorship', position: { x: 8, y: 52 }, cluster: 'heart', color: '#EC4899' },
  { id: 'encouragement', name: 'Encouragement', position: { x: 25, y: 48 }, cluster: 'heart', color: '#EC4899' },
  { id: 'respect', name: 'Respect', position: { x: 22, y: 28 }, cluster: 'heart', color: '#EC4899' },

  // VOICE CLUSTER (right, 2-4 o'clock) - 7 skills
  { id: 'creativity', name: 'Creativity', position: { x: 82, y: 32 }, cluster: 'voice', color: '#8B5CF6' },
  { id: 'marketing', name: 'Marketing', position: { x: 88, y: 42 }, cluster: 'voice', color: '#8B5CF6' },
  { id: 'curriculum_design', name: 'Curriculum Design', position: { x: 82, y: 52 }, cluster: 'voice', color: '#8B5CF6' },
  { id: 'collaboration', name: 'Collaboration', position: { x: 72, y: 38 }, cluster: 'voice', color: '#8B5CF6' },
  { id: 'wisdom', name: 'Wisdom', position: { x: 92, y: 52 }, cluster: 'voice', color: '#8B5CF6' },
  { id: 'curiosity', name: 'Curiosity', position: { x: 78, y: 28 }, cluster: 'voice', color: '#8B5CF6' },
  { id: 'observation', name: 'Observation', position: { x: 75, y: 48 }, cluster: 'voice', color: '#8B5CF6' },

  // HANDS CLUSTER (bottom-left, 6-8 o'clock) - 8 skills
  { id: 'leadership', name: 'Leadership', position: { x: 22, y: 65 }, cluster: 'hands', color: '#F97316' },
  { id: 'crisis_management', name: 'Crisis Management', position: { x: 15, y: 75 }, cluster: 'hands', color: '#F97316' },
  { id: 'triage', name: 'Triage', position: { x: 28, y: 78 }, cluster: 'hands', color: '#F97316' },
  { id: 'courage', name: 'Courage', position: { x: 35, y: 68 }, cluster: 'hands', color: '#F97316' },
  { id: 'resilience', name: 'Resilience', position: { x: 22, y: 85 }, cluster: 'hands', color: '#F97316' },
  { id: 'action_orientation', name: 'Action Orientation', position: { x: 10, y: 68 }, cluster: 'hands', color: '#F97316' },
  { id: 'risk_management', name: 'Risk Management', position: { x: 35, y: 82 }, cluster: 'hands', color: '#F97316' },
  { id: 'urgency', name: 'Urgency', position: { x: 8, y: 82 }, cluster: 'hands', color: '#F97316' },

  // COMPASS CLUSTER (bottom-right, 4-6 o'clock) - 7 skills
  { id: 'adaptability', name: 'Adaptability', position: { x: 78, y: 65 }, cluster: 'compass', color: '#10B981' },
  { id: 'learning_agility', name: 'Learning Agility', position: { x: 85, y: 75 }, cluster: 'compass', color: '#10B981' },
  { id: 'humility', name: 'Humility', position: { x: 72, y: 78 }, cluster: 'compass', color: '#10B981' },
  { id: 'fairness', name: 'Fairness', position: { x: 65, y: 68 }, cluster: 'compass', color: '#10B981' },
  { id: 'pragmatism', name: 'Pragmatism', position: { x: 78, y: 85 }, cluster: 'compass', color: '#10B981' },
  { id: 'integrity', name: 'Integrity', position: { x: 90, y: 68 }, cluster: 'compass', color: '#10B981' },
  { id: 'accountability', name: 'Accountability', position: { x: 65, y: 82 }, cluster: 'compass', color: '#10B981' },

  // CRAFT CLUSTER (bottom-center) - 3 skills
  { id: 'deep_work', name: 'Deep Work', position: { x: 42, y: 92 }, cluster: 'craft', color: '#6366F1' },
  { id: 'time_management', name: 'Time Management', position: { x: 58, y: 92 }, cluster: 'craft', color: '#6366F1' },
  { id: 'financial_literacy', name: 'Financial Literacy', position: { x: 50, y: 88 }, cluster: 'craft', color: '#6366F1' }
]

// Connection lines within clusters (for visual effect)
export const SKILL_CONNECTIONS: [string, string][] = [
  // Mind cluster connections
  ['critical_thinking', 'problem_solving'],
  ['critical_thinking', 'systems_thinking'],
  ['systems_thinking', 'technical_literacy'],
  ['problem_solving', 'digital_literacy'],
  ['critical_thinking', 'information_literacy'],
  ['problem_solving', 'strategic_thinking'],
  ['information_literacy', 'digital_literacy'],

  // Heart cluster connections
  ['emotional_intelligence', 'empathy'],
  ['empathy', 'patience'],
  ['emotional_intelligence', 'cultural_competence'],
  ['empathy', 'mentorship'],
  ['patience', 'encouragement'],
  ['cultural_competence', 'respect'],

  // Voice cluster connections
  ['creativity', 'collaboration'],
  ['creativity', 'marketing'],
  ['marketing', 'curriculum_design'],
  ['collaboration', 'observation'],
  ['curriculum_design', 'wisdom'],
  ['creativity', 'curiosity'],

  // Hands cluster connections
  ['leadership', 'courage'],
  ['leadership', 'crisis_management'],
  ['crisis_management', 'triage'],
  ['courage', 'resilience'],
  ['crisis_management', 'urgency'],
  ['leadership', 'action_orientation'],
  ['triage', 'risk_management'],

  // Compass cluster connections
  ['adaptability', 'learning_agility'],
  ['adaptability', 'fairness'],
  ['learning_agility', 'humility'],
  ['fairness', 'pragmatism'],
  ['fairness', 'integrity'],
  ['humility', 'accountability'],
  ['pragmatism', 'accountability'],

  // Craft cluster connections
  ['deep_work', 'time_management'],
  ['time_management', 'financial_literacy'],

  // Cross-cluster connections through communication hub
  ['communication', 'emotional_intelligence'],
  ['communication', 'collaboration'],
  ['communication', 'leadership'],
  ['communication', 'adaptability'],
  ['communication', 'critical_thinking']
]

// Skill state based on demonstration count
export type SkillState = 'dormant' | 'awakening' | 'developing' | 'strong' | 'mastered'

export function getSkillState(demonstrationCount: number): SkillState {
  if (demonstrationCount === 0) return 'dormant'
  if (demonstrationCount === 1) return 'awakening'
  if (demonstrationCount < 5) return 'developing'
  if (demonstrationCount < 10) return 'strong'
  return 'mastered'
}

// Helper to get skill by ID
export function getSkillById(id: string): SkillNodeData | undefined {
  return SKILL_NODES.find(s => s.id === id)
}

// Get all skills in a cluster
export function getSkillsByCluster(cluster: SkillCluster): SkillNodeData[] {
  return SKILL_NODES.filter(s => s.cluster === cluster)
}
