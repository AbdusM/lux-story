import type { SignalDescriptor } from '@/lib/labor-market/signals'

export interface CuratedObservedExposureMatch {
  descriptor: SignalDescriptor
  provenance: string
}

interface CuratedObservedExposureRecord {
  careerIds: string[]
  aliases: string[]
  descriptor: SignalDescriptor
  provenance: string
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

const CURATED_OBSERVED_EXPOSURE: CuratedObservedExposureRecord[] = [
  {
    careerIds: ['data-analyst-community'],
    aliases: ['community data analyst', 'data analyst', 'data journalist / analyst'],
    descriptor: {
      level: 'medium',
      confidence: 'medium',
      reasons: [
        'Data-heavy knowledge work is seeing meaningful AI adoption, especially for analysis and drafting support.',
        'Community-facing interpretation and local context still require human judgment and communication.',
      ],
    },
    provenance:
      'Curated nowcasting mapping reviewed on March 5, 2026 using the repo canonical career taxonomy and the observed-exposure framing from the Anthropic labor-market note.',
  },
  {
    careerIds: ['healthcare-tech'],
    aliases: ['healthcare technology specialist', 'health informatics', 'healthcare support'],
    descriptor: {
      level: 'low',
      confidence: 'medium',
      reasons: [
        'Healthcare technology work includes regulated workflows and human coordination that slow direct automation.',
        'AI adoption may still change tooling, but patient safety and operational oversight constrain full task replacement.',
      ],
    },
    provenance:
      'Curated nowcasting mapping reviewed on March 5, 2026 using repo career IDs and a conservative interpretation of regulated-work adoption.',
  },
  {
    careerIds: ['sustainable-construction'],
    aliases: ['sustainable construction manager', 'construction manager'],
    descriptor: {
      level: 'low',
      confidence: 'medium',
      reasons: [
        'Construction and field coordination remain anchored in physical-world execution and on-site decision-making.',
        'AI may assist planning and documentation, but observed exposure is currently lower than desk-based digital work.',
      ],
    },
    provenance:
      'Curated nowcasting mapping reviewed on March 5, 2026 with emphasis on physical-world execution work remaining less exposed.',
  },
  {
    careerIds: ['creative-entrepreneur'],
    aliases: ['creative entrepreneur', 'digital creative director'],
    descriptor: {
      level: 'medium',
      confidence: 'medium',
      reasons: [
        'Creative production is seeing active AI adoption in drafting, ideation, and asset generation.',
        'Client trust, taste, direction, and brand judgment still create human leverage in the lane.',
      ],
    },
    provenance:
      'Curated nowcasting mapping reviewed on March 5, 2026 using the report’s augmentation-vs-automation framing for creative work.',
  },
  {
    careerIds: ['cybersecurity-specialist'],
    aliases: ['cybersecurity specialist'],
    descriptor: {
      level: 'medium',
      confidence: 'medium',
      reasons: [
        'Security work is adopting AI for triage and analysis, but verification and risk ownership remain human-heavy.',
        'Exposure is meaningful, though current adoption often augments analysts more than it replaces them.',
      ],
    },
    provenance:
      'Curated nowcasting mapping reviewed on March 5, 2026 using the report’s observed-adoption lens for high-skill digital work.',
  },
  {
    careerIds: ['learning-experience-architect'],
    aliases: ['learning experience architect', 'technical educator / content creator'],
    descriptor: {
      level: 'medium',
      confidence: 'medium',
      reasons: [
        'Learning design and content work is adopting AI for drafting, adaptation, and asset generation.',
        'Instructional sequencing, audience fit, and facilitation still depend on human judgment.',
      ],
    },
    provenance:
      'Curated nowcasting mapping reviewed on March 5, 2026 using the report’s observed-adoption framing for knowledge work.',
  },
  {
    careerIds: ['advanced-logistics'],
    aliases: ['advanced logistics & manufacturing', 'logistics manager'],
    descriptor: {
      level: 'medium',
      confidence: 'low',
      reasons: [
        'Logistics planning and operational analysis are becoming more software- and AI-assisted.',
        'Observed adoption varies widely between planning, warehouse, and field roles, so confidence stays low.',
      ],
    },
    provenance:
      'Curated nowcasting mapping reviewed on March 5, 2026; confidence remains low because adoption differs across sub-roles.',
  },
  {
    careerIds: [],
    aliases: ['software developer', 'developer', 'programmer'],
    descriptor: {
      level: 'high',
      confidence: 'medium',
      reasons: [
        'Software development is one of the clearest lanes where AI tools are already changing day-to-day workflows.',
        'High exposure here means workflows are shifting quickly, not that individual outcomes are predetermined.',
      ],
    },
    provenance:
      'Curated compatibility mapping reviewed on March 5, 2026 for non-canonical software-role names that still appear in tests and adjacent flows.',
  },
  {
    careerIds: [],
    aliases: ['customer service', 'data entry'],
    descriptor: {
      level: 'high',
      confidence: 'medium',
      reasons: [
        'These lanes include repeatable digital tasks where current AI adoption is already visible.',
        'Observed exposure is elevated even though local job conditions can still differ by employer and workflow.',
      ],
    },
    provenance:
      'Curated compatibility mapping reviewed on March 5, 2026 for common exposed role names outside the core Birmingham career taxonomy.',
  },
]

export function getCuratedObservedExposure(options: {
  careerId?: string
  careerName: string
}): CuratedObservedExposureMatch | null {
  const normalizedId = options.careerId ? normalize(options.careerId) : null
  const normalizedName = normalize(options.careerName)

  const match = CURATED_OBSERVED_EXPOSURE.find((entry) => {
    if (normalizedId && entry.careerIds.some((careerId) => normalize(careerId) === normalizedId)) {
      return true
    }

    return entry.aliases.some((alias) => normalizedName.includes(normalize(alias)))
  })

  if (!match) return null

  return {
    descriptor: match.descriptor,
    provenance: match.provenance,
  }
}
