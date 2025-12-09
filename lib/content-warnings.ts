/**
 * Content Warning System
 * Provides trauma-informed content warnings before heavy narrative arcs
 *
 * Based on accessibility audit findings (Dec 7, 2025)
 */

export type ContentWarningTopic =
  | 'medical_emergency'
  | 'patient_death'
  | 'financial_distress'
  | 'housing_instability'
  | 'family_rejection'
  | 'grief'
  | 'family_conflict'
  | 'cultural_expectations'
  | 'career_anxiety'
  | 'identity_crisis'

export interface ContentWarning {
  topic: ContentWarningTopic
  label: string
  description: string
}

/**
 * Human-readable labels and descriptions for each warning topic
 */
export const contentWarningLabels: Record<ContentWarningTopic, ContentWarning> = {
  medical_emergency: {
    topic: 'medical_emergency',
    label: 'Medical Emergency',
    description: 'This story involves a medical emergency situation with life-or-death stakes.'
  },
  patient_death: {
    topic: 'patient_death',
    label: 'Discussion of Death',
    description: 'This story discusses patient death in a medical context.'
  },
  financial_distress: {
    topic: 'financial_distress',
    label: 'Financial Hardship',
    description: 'This story involves significant financial loss and economic anxiety.'
  },
  housing_instability: {
    topic: 'housing_instability',
    label: 'Housing Instability',
    description: 'This story discusses potential loss of home or housing security.'
  },
  family_rejection: {
    topic: 'family_rejection',
    label: 'Family Conflict',
    description: 'This story involves family rejection or strained relationships.'
  },
  grief: {
    topic: 'grief',
    label: 'Grief & Loss',
    description: 'This story explores themes of grief and processing loss.'
  },
  family_conflict: {
    topic: 'family_conflict',
    label: 'Family Tension',
    description: 'This story involves family disagreements and difficult conversations.'
  },
  cultural_expectations: {
    topic: 'cultural_expectations',
    label: 'Cultural Pressure',
    description: 'This story explores pressure from cultural or family expectations.'
  },
  career_anxiety: {
    topic: 'career_anxiety',
    label: 'Career Uncertainty',
    description: 'This story involves anxiety about career direction and life choices.'
  },
  identity_crisis: {
    topic: 'identity_crisis',
    label: 'Identity Questions',
    description: 'This story explores questions of identity and self-discovery.'
  }
}

/**
 * Content warnings by character arc
 * These are shown before entering a character's primary narrative
 */
export const arcContentWarnings: Record<string, ContentWarningTopic[]> = {
  // Marcus - ECMO simulation, patient death scenario
  marcus: ['medical_emergency', 'patient_death'],

  // Silas - Farm crisis, financial collapse
  silas: ['financial_distress', 'housing_instability'],

  // Devon - Father relationship, grief processing
  devon: ['family_rejection', 'grief'],

  // Maya - Family expectations, identity conflict
  maya: ['family_conflict', 'cultural_expectations', 'identity_crisis'],

  // Jordan - Career uncertainty, identity questions
  jordan: ['career_anxiety', 'identity_crisis'],

  // Kai - Team dynamics (lower intensity)
  kai: [],

  // Tess - Strategic challenges (lower intensity)
  tess: [],

  // Yaquin - Dreams and possibility (lower intensity)
  yaquin: [],

  // Rohan - Philosophy and meaning
  rohan: ['identity_crisis'],

  // Samuel - Mentor (lower intensity, but touches on all themes)
  samuel: []
}

/**
 * Get content warnings for a character arc
 */
export function getArcWarnings(characterId: string): ContentWarning[] {
  const topics = arcContentWarnings[characterId.toLowerCase()] || []
  return topics.map(topic => contentWarningLabels[topic])
}

/**
 * Check if a character arc has content warnings
 */
export function hasContentWarnings(characterId: string): boolean {
  const topics = arcContentWarnings[characterId.toLowerCase()] || []
  return topics.length > 0
}

/**
 * Get a summary warning message for a character
 */
export function getWarningsSummary(characterId: string): string | null {
  const warnings = getArcWarnings(characterId)
  if (warnings.length === 0) return null

  const labels = warnings.map(w => w.label).join(', ')
  return `This story touches on: ${labels}`
}
