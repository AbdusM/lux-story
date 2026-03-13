import type { SignalDescriptor } from '@/lib/labor-market/signals'
import type { MarketSignalMetadata } from '@/lib/labor-market/market-signal-contract'
import { normalizeMarketSignalValue } from '@/lib/labor-market/market-signal-contract'

export interface CuratedEntryFrictionMatch {
  descriptor: SignalDescriptor
  metadata: MarketSignalMetadata
}

interface CuratedEntryFrictionRecord {
  careerIds: string[]
  aliases: string[]
  descriptor: SignalDescriptor
  metadata: MarketSignalMetadata
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
    metadata: {
      summary:
        'Curated medium-friction mapping for regulated healthcare-adjacent work with compliance and trust-heavy entry gates.',
      source: 'Lux nowcasting proxy map + Birmingham opportunity context',
      updatedAtIso: '2026-03-12T00:00:00.000Z',
      coverage: 'Canonical Birmingham career lanes plus selected alias coverage for adjacent role names.',
      confidence: 'medium',
      version: 'entry-friction-v1',
      methodology:
        'Repo-owned market-friction proxy that combines lane semantics with Birmingham-aligned entry conditions.',
    },
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
    metadata: {
      summary:
        'Curated medium-friction mapping for construction-adjacent roles with apprenticeship access but experience-sensitive titles.',
      source: 'Lux nowcasting proxy map + Birmingham opportunity context',
      updatedAtIso: '2026-03-12T00:00:00.000Z',
      coverage: 'Canonical Birmingham career lanes plus selected alias coverage for adjacent role names.',
      confidence: 'medium',
      version: 'entry-friction-v1',
      methodology:
        'Repo-owned market-friction proxy emphasizing apprenticeship availability versus proof-of-execution requirements.',
    },
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
    metadata: {
      summary:
        'Curated high-friction mapping for analytics entry lanes where hiring is proof-heavy and community context matters.',
      source: 'Lux nowcasting proxy map + early-career friction synthesis',
      updatedAtIso: '2026-03-12T00:00:00.000Z',
      coverage: 'Canonical Birmingham career lanes plus selected alias coverage for adjacent role names.',
      confidence: 'medium',
      version: 'entry-friction-v1',
      methodology:
        'Repo-owned market-friction proxy focused on early-career bottlenecks in exposed knowledge-work lanes.',
    },
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
    metadata: {
      summary:
        'Curated high-friction mapping for creative lanes with open entry but unstable paid demand and heavy portfolio competition.',
      source: 'Lux nowcasting proxy map + creative portfolio market read',
      updatedAtIso: '2026-03-12T00:00:00.000Z',
      coverage: 'Canonical Birmingham career lanes plus selected alias coverage for adjacent role names.',
      confidence: 'medium',
      version: 'entry-friction-v1',
      methodology:
        'Repo-owned market-friction proxy emphasizing portfolio competition, client trust, and uneven paid opportunity.',
    },
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
    metadata: {
      summary:
        'Curated high-friction mapping for cybersecurity where trust, proof, and risk containment push junior bars upward.',
      source: 'Lux nowcasting proxy map + cybersecurity hiring gate synthesis',
      updatedAtIso: '2026-03-12T00:00:00.000Z',
      coverage: 'Canonical Birmingham career lanes plus selected alias coverage for adjacent role names.',
      confidence: 'medium',
      version: 'entry-friction-v1',
      methodology:
        'Repo-owned market-friction proxy emphasizing trust-heavy entry gates in security hiring.',
    },
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
    metadata: {
      summary:
        'Curated high-friction mapping for learning-design roles that behave more like mid-level portfolio-based work.',
      source: 'Lux nowcasting proxy map + instructional-design role semantics',
      updatedAtIso: '2026-03-12T00:00:00.000Z',
      coverage: 'Canonical Birmingham career lanes plus selected alias coverage for adjacent role names.',
      confidence: 'medium',
      version: 'entry-friction-v1',
      methodology:
        'Repo-owned market-friction proxy that treats direct entry as tighter than adjacent teaching or content routes.',
    },
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
    metadata: {
      summary:
        'Curated lower-friction mapping for operational logistics lanes with clearer apprenticeship and certification on-ramps.',
      source: 'Lux nowcasting proxy map + Birmingham opportunity context',
      updatedAtIso: '2026-03-12T00:00:00.000Z',
      coverage: 'Canonical Birmingham career lanes plus selected alias coverage for adjacent role names.',
      confidence: 'low',
      version: 'entry-friction-v1',
      methodology:
        'Repo-owned market-friction proxy that lowers confidence when employer requirements vary across local operations.',
    },
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
    metadata: {
      summary:
        'Compatibility mapping for software-role aliases where junior hiring is increasingly proof-driven and expectation-heavy.',
      source: 'Lux nowcasting proxy map + compatibility alias mapping',
      updatedAtIso: '2026-03-12T00:00:00.000Z',
      coverage: 'Alias-only mapping for non-canonical software-role names outside the core Birmingham lane set.',
      confidence: 'medium',
      version: 'entry-friction-v1',
      methodology:
        'Compatibility alias mapping layered on top of the canonical entry-friction dataset for adjacent role names.',
    },
  },
]

export function getCuratedEntryFriction(options: {
  careerId?: string
  careerName: string
}): CuratedEntryFrictionMatch | null {
  const normalizedId = options.careerId ? normalizeMarketSignalValue(options.careerId) : null
  const normalizedName = normalizeMarketSignalValue(options.careerName)

  const match = CURATED_ENTRY_FRICTION.find((entry) => {
    if (
      normalizedId &&
      entry.careerIds.some((careerId) => normalizeMarketSignalValue(careerId) === normalizedId)
    ) {
      return true
    }

    return entry.aliases.some((alias) => normalizedName.includes(normalizeMarketSignalValue(alias)))
  })

  if (!match) return null

  return {
    descriptor: match.descriptor,
    metadata: match.metadata,
  }
}
