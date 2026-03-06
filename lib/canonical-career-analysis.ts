import {
  BIRMINGHAM_CAREER_PATHS,
  calculateCareerMatchesFromSkills,
  type FutureSkills,
} from './2030-skills-system'

export interface CanonicalCareerRecommendation {
  id: string
  name: string
  sector: string
  matchScore: number
  confidenceScore: number
  readiness: 'near_ready' | 'developing' | 'exploring'
  evidenceForMatch: string[]
  requiredSkills: Record<string, { current: number; required: number; gap: number }>
  salaryRange: [number, number]
  educationPaths: string[]
  localOpportunities: string[]
}

export interface CanonicalSkillGapAnalysis {
  careerId: string
  careerName: string
  overallReadiness: number
  gaps: Array<{
    skillId: string
    skillName: string
    currentLevel: number
    requiredLevel: number
    gapSize: number
  }>
  strengths: Array<{
    skillId: string
    skillName: string
    level: number
  }>
}

export interface CanonicalSkillNetworkNode {
  id: string
  type: 'skill' | 'career' | 'domain'
  label: string
  size: number
}

export interface CanonicalSkillNetworkEdge {
  source: string
  target: string
  weight: number
}

type SkillRecord = Partial<FutureSkills> | Record<string, number>

const CAREER_SECTORS: Record<string, string> = {
  'healthcare-tech': 'Healthcare',
  'sustainable-construction': 'Construction',
  'data-analyst-community': 'Data & Civic Tech',
  'creative-entrepreneur': 'Creative',
  'cybersecurity-specialist': 'Cybersecurity',
  'learning-experience-architect': 'Education & Design',
  'advanced-logistics': 'Logistics & Manufacturing',
}

function getCareerPathByName(name: string) {
  return BIRMINGHAM_CAREER_PATHS.find((career) => career.name === name)
}

export function getCareerSector(careerId: string): string {
  return CAREER_SECTORS[careerId] ?? 'Career Path'
}

export function formatSkillLabel(skillId: string): string {
  return skillId.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim()
}

export function getCanonicalCareerRecommendations(
  skills: SkillRecord,
  limit: number = 6
): CanonicalCareerRecommendation[] {
  return calculateCareerMatchesFromSkills(skills)
    .map((match) => {
      const path = getCareerPathByName(match.name)
      if (!path) return null

      return {
        id: path.id,
        name: path.name,
        sector: getCareerSector(path.id),
        matchScore: match.matchScore,
        confidenceScore: Math.round(match.matchScore * 100),
        readiness: match.readiness,
        evidenceForMatch: match.evidenceForMatch,
        requiredSkills: match.requiredSkills,
        salaryRange: match.salaryRange,
        educationPaths: match.educationPaths,
        localOpportunities: match.localOpportunities,
      }
    })
    .filter((match): match is CanonicalCareerRecommendation => match !== null)
    .slice(0, limit)
}

export function buildCanonicalSkillGapAnalysis(
  careerId: string,
  skills: SkillRecord
): CanonicalSkillGapAnalysis | null {
  const recommendation = getCanonicalCareerRecommendations(
    skills,
    BIRMINGHAM_CAREER_PATHS.length
  ).find((career) => career.id === careerId)

  if (!recommendation) return null

  const entries = Object.entries(recommendation.requiredSkills)

  return {
    careerId,
    careerName: recommendation.name,
    overallReadiness: recommendation.confidenceScore,
    gaps: entries
      .filter(([, values]) => values.gap > 0)
      .map(([skillId, values]) => ({
        skillId,
        skillName: formatSkillLabel(skillId),
        currentLevel: values.current,
        requiredLevel: values.required,
        gapSize: values.gap,
      }))
      .sort((a, b) => b.gapSize - a.gapSize),
    strengths: entries
      .filter(([, values]) => values.current > 0)
      .map(([skillId, values]) => ({
        skillId,
        skillName: formatSkillLabel(skillId),
        level: values.current,
      }))
      .sort((a, b) => b.level - a.level),
  }
}

export function buildCanonicalSkillNetwork(
  skills: SkillRecord
): { nodes: CanonicalSkillNetworkNode[]; edges: CanonicalSkillNetworkEdge[] } {
  const skillsRecord = skills as Record<string, number>
  const nodes: CanonicalSkillNetworkNode[] = []
  const edges: CanonicalSkillNetworkEdge[] = []
  const addedNodes = new Set<string>()

  const recommendations = getCanonicalCareerRecommendations(
    skills,
    BIRMINGHAM_CAREER_PATHS.length
  ).filter((career) => career.matchScore > 0)

  for (const [skillId, level] of Object.entries(skillsRecord)) {
    if (typeof level !== 'number' || level <= 0) continue

    nodes.push({
      id: skillId,
      type: 'skill',
      label: formatSkillLabel(skillId),
      size: 14 + Math.round(level * 18),
    })
    addedNodes.add(skillId)
  }

  for (const recommendation of recommendations) {
    const careerNodeId = `career_${recommendation.id}`
    if (!addedNodes.has(careerNodeId)) {
      nodes.push({
        id: careerNodeId,
        type: 'career',
        label: recommendation.name,
        size: 18 + Math.round(recommendation.matchScore * 20),
      })
      addedNodes.add(careerNodeId)
    }

    const sectorNodeId = `domain_${recommendation.sector}`
    if (!addedNodes.has(sectorNodeId)) {
      nodes.push({
        id: sectorNodeId,
        type: 'domain',
        label: recommendation.sector,
        size: 20,
      })
      addedNodes.add(sectorNodeId)
    }

    edges.push({
      source: careerNodeId,
      target: sectorNodeId,
      weight: recommendation.matchScore,
    })

    for (const skillId of Object.keys(recommendation.requiredSkills)) {
      const level = skillsRecord[skillId] ?? 0
      if (level <= 0) continue
      if (!addedNodes.has(skillId)) {
        nodes.push({
          id: skillId,
          type: 'skill',
          label: formatSkillLabel(skillId),
          size: 14 + Math.round(level * 18),
        })
        addedNodes.add(skillId)
      }
      edges.push({
        source: skillId,
        target: careerNodeId,
        weight: level,
      })
    }
  }

  return { nodes, edges }
}
