import type { SignalDescriptor } from '@/lib/labor-market/signals'

export interface CuratedEntryFrictionMatch {
  descriptor: SignalDescriptor
  provenance: string
}

interface CuratedEntryFrictionRecord {
  careerIds: string[]
  aliases: string[]
  descriptor: SignalDescriptor
  provenance: string
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

const CURATED_ENTRY_FRICTION: CuratedEntryFrictionRecord[] = [
  {
    careerIds: ['healthcare-tech'],
    aliases: ['healthcare technology specialist', 'health informatics', 'healthcare support'],
    descriptor: {
      level: 'medium',
      confidence: 'medium',
      reasons: [
        'Healthcare hiring often includes compliance, trust, and workflow-specific onboarding that slows entry.',
        'The lane remains viable, but breaking in usually requires evidence of reliability in regulated settings.',
      ],
    },
    provenance:
      'Curated entry-friction proxy reviewed on March 12, 2026 using repo career taxonomy, Birmingham opportunity context, and a conservative read of regulated-work hiring gates.',
  },
  {
    careerIds: ['sustainable-construction'],
    aliases: ['sustainable construction manager', 'construction manager'],
    descriptor: {
      level: 'medium',
      confidence: 'medium',
      reasons: [
        'Construction-adjacent roles can have accessible on-ramps, but leadership-oriented titles still reward hands-on experience.',
        'Entry friction is moderated by apprenticeship pathways, yet employer trust is still earned through proof of execution.',
      ],
    },
    provenance:
      'Curated entry-friction proxy reviewed on March 12, 2026 with emphasis on apprenticeship access versus experience requirements in construction hiring.',
  },
  {
    careerIds: ['data-analyst-community'],
    aliases: ['community data analyst', 'data analyst', 'data journalist / analyst'],
    descriptor: {
      level: 'high',
      confidence: 'medium',
      reasons: [
        'Entry-level analytics hiring is tightening in many markets, with employers asking for proof beyond coursework alone.',
        'Community-facing data roles also expect communication and domain context, not just tool familiarity.',
      ],
    },
    provenance:
      'Curated entry-friction proxy reviewed on March 12, 2026 using the nowcasting memo focus on early-career bottlenecks in exposed knowledge-work lanes.',
  },
  {
    careerIds: ['creative-entrepreneur'],
    aliases: ['creative entrepreneur', 'digital creative director'],
    descriptor: {
      level: 'high',
      confidence: 'medium',
      reasons: [
        'Creative lanes can be entered quickly, but stable paid opportunity is uneven and portfolio competition is intense.',
        'Proof of taste, client trust, and repeatable outcomes matters more than generic output volume.',
      ],
    },
    provenance:
      'Curated entry-friction proxy reviewed on March 12, 2026 using portfolio- and network-heavy entry dynamics for creative work.',
  },
  {
    careerIds: ['cybersecurity-specialist'],
    aliases: ['cybersecurity specialist'],
    descriptor: {
      level: 'high',
      confidence: 'medium',
      reasons: [
        'Cybersecurity roles often gate entry through trust, hands-on proof, and sometimes certifications or prior technical experience.',
        'The lane is growing, but employer downside risk keeps junior hiring bars relatively high.',
      ],
    },
    provenance:
      'Curated entry-friction proxy reviewed on March 12, 2026 using repo taxonomy and the common trust-heavy entry gates in security hiring.',
  },
  {
    careerIds: ['learning-experience-architect'],
    aliases: ['learning experience architect', 'technical educator / content creator'],
    descriptor: {
      level: 'high',
      confidence: 'medium',
      reasons: [
        'This title often behaves like a mid-level role, expecting facilitation judgment, systems thinking, and portfolio proof.',
        'Entry is possible through adjacent teaching or content paths, but direct first-role access is usually tighter.',
      ],
    },
    provenance:
      'Curated entry-friction proxy reviewed on March 12, 2026 using repo career semantics and the portfolio-heavy entry pattern for instructional design work.',
  },
  {
    careerIds: ['advanced-logistics'],
    aliases: ['advanced logistics & manufacturing', 'logistics manager'],
    descriptor: {
      level: 'low',
      confidence: 'low',
      reasons: [
        'Regional logistics and manufacturing lanes often have clearer operational on-ramps than desk-only knowledge roles.',
        'Friction can stay lower when apprenticeships, certifications, or shift-based entry paths exist locally.',
      ],
    },
    provenance:
      'Curated entry-friction proxy reviewed on March 12, 2026 using Birmingham-aligned operational pathways; confidence remains low because local employer requirements vary.',
  },
  {
    careerIds: [],
    aliases: ['software developer', 'developer', 'programmer'],
    descriptor: {
      level: 'high',
      confidence: 'medium',
      reasons: [
        'Junior software hiring is increasingly proof-driven, with AI changing expectations for speed and breadth.',
        'Entry remains possible, but employers often want stronger evidence than coursework or tutorials alone.',
      ],
    },
    provenance:
      'Curated compatibility mapping reviewed on March 12, 2026 for common software-role names outside the core Birmingham career taxonomy.',
  },
]

export function getCuratedEntryFriction(options: {
  careerId?: string
  careerName: string
}): CuratedEntryFrictionMatch | null {
  const normalizedId = options.careerId ? normalize(options.careerId) : null
  const normalizedName = normalize(options.careerName)

  const match = CURATED_ENTRY_FRICTION.find((entry) => {
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
