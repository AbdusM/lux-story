import { createHash } from 'node:crypto'
import {
  calculateCognitiveDomainState,
  createResearchExport,
  type PatternScores,
} from './cognitive-domain-calculator'
import type { EngagementLevel } from './cognitive-domains'
import type { SkillDemonstration } from './skill-tracker'

export const RESEARCH_EXPORT_MODES = ['cohort', 'individual', 'longitudinal'] as const
export const RESEARCH_CONSENT_STATUSES = ['pending', 'granted', 'revoked'] as const
export const RESEARCH_CONSENT_SCOPES = [
  'cohort_only',
  'individual_research',
  'full_research',
] as const

export type ResearchExportMode = (typeof RESEARCH_EXPORT_MODES)[number]
export type ResearchExportScope = 'cohort_anonymized' | 'individual_identified'
export type ResearchConsentStatus = (typeof RESEARCH_CONSENT_STATUSES)[number]
export type ResearchConsentScope = (typeof RESEARCH_CONSENT_SCOPES)[number]
export type ResearchPatternName = keyof PatternScores

export interface ResearchProfileRow {
  user_id: string
  created_at?: string | null
  updated_at?: string | null
  last_activity?: string | null
  total_demonstrations?: number | null
}

export interface ResearchBehavioralProfileRow {
  player_id: string
  response_speed?: string | null
  stress_response?: string | null
  social_orientation?: string | null
  problem_approach?: string | null
  communication_style?: string | null
  cultural_alignment?: number | null
  total_choices?: number | null
  avg_response_time_ms?: number | null
  updated_at?: string | null
}

export interface ResearchPatternDemonstrationRow {
  user_id: string
  pattern_name: string
  demonstrated_at: string
  scene_id?: string | null
  character_id?: string | null
  context?: string | null
}

export interface ResearchSkillDemonstrationRow {
  user_id: string
  skill_name: string
  scene_id: string
  scene_description?: string | null
  choice_text?: string | null
  context?: string | null
  demonstrated_at: string
}

export interface ResearchCareerExplorationRow {
  user_id: string
  career_name: string
  match_score: number
  readiness_level?: string | null
  explored_at?: string | null
  local_opportunities?: unknown
  education_paths?: unknown
}

export interface ResearchConsentRow {
  user_id: string
  consent_status: ResearchConsentStatus
  consent_scope: ResearchConsentScope
  guardian_required: boolean
  guardian_verified: boolean
  consented_at: string | null
  revoked_at: string | null
}

export interface ResearchPatternSummary {
  patternName: ResearchPatternName
  demonstrationCount: number
  percentage: number
  firstDemonstrated: string | null
  lastDemonstrated: string | null
}

export interface ResearchCareerMatch {
  careerName: string
  score: number
  readiness: string | null
  exploredAt: string | null
  localOpportunities: string[]
  educationPaths: string[]
}

export interface ResearchLongitudinalRecord {
  firstActivityAt: string | null
  lastActivityAt: string | null
  activeDays: number
  activityByDay: Array<{
    date: string
    skillDemonstrations: number
    uniqueSkills: number
  }>
  patternEvolution: Array<{
    date: string
    patterns: Partial<Record<ResearchPatternName, number>>
  }>
  careerTimeline: Array<{
    exploredAt: string | null
    careerName: string
    score: number
    readiness: string | null
  }>
}

export interface CohortLongitudinalSummary {
  activityByDay: Array<{
    date: string
    participants: number
    skillDemonstrations: number
  }>
  patternEvolution: Array<{
    date: string
    patterns: Partial<Record<ResearchPatternName, number>>
  }>
  careerExplorationsByDay: Array<{
    date: string
    careerExplorations: number
  }>
}

export interface ResearchParticipantExport {
  participantId: string
  playerId: string
  identifierType: 'participant_id' | 'user_id'
  consent?: {
    status: ResearchConsentStatus
    scope: ResearchConsentScope
    guardianVerified: boolean
    consentedAt: string | null
  }
  metrics: {
    totalChoices: number
    totalSkillDemonstrations: number
    dominantPattern: ResearchPatternName | 'emerging'
    engagementLevel: EngagementLevel
    lastSession: string | null
    strongAffinities: number
    topCareer: {
      name: string
      score: number
      readiness: string | null
    } | null
  }
  behavioralProfile: {
    responseSpeed: string | null
    stressResponse: string | null
    socialOrientation: string | null
    problemApproach: string | null
    communicationStyle: string | null
    culturalAlignment: number | null
    averageResponseTimeMs: number | null
  }
  patternSummary: ResearchPatternSummary[]
  cognitiveResearch: ReturnType<typeof createResearchExport>
  careers: ResearchCareerMatch[]
  longitudinal?: ResearchLongitudinalRecord
}

interface BuildParticipantExportParams {
  profile: ResearchProfileRow
  behavioralProfile?: ResearchBehavioralProfileRow
  patternRows: ResearchPatternDemonstrationRow[]
  skillRows: ResearchSkillDemonstrationRow[]
  careerRows: ResearchCareerExplorationRow[]
  consent?: ResearchConsentRow | null
  scope: ResearchExportScope
  includeLongitudinal: boolean
}

function parseDate(value?: string | null): number | null {
  if (!value) return null
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? null : timestamp
}

function normalizeMatchScore(score: number): number {
  if (!Number.isFinite(score)) return 0
  if (score > 1) return score / 100
  if (score < 0) return 0
  return score
}

function scoreToPercent(score: number): number {
  return Math.round(normalizeMatchScore(score) * 100)
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string')
  }
  return []
}

function toResearchPatternName(name: string): ResearchPatternName | null {
  if (name === 'analytical') return 'analytical'
  if (name === 'patience') return 'patience'
  if (name === 'exploring') return 'exploring'
  if (name === 'helping') return 'helping'
  if (name === 'building') return 'building'
  return null
}

function buildPatternSummary(
  patternRows: ResearchPatternDemonstrationRow[]
): ResearchPatternSummary[] {
  const aggregates = new Map<
    ResearchPatternName,
    { count: number; first: string | null; last: string | null }
  >()

  for (const row of patternRows) {
    const patternName = toResearchPatternName(row.pattern_name)
    if (!patternName) continue

    const current = aggregates.get(patternName) ?? {
      count: 0,
      first: null,
      last: null,
    }

    current.count += 1
    if (!current.first || (row.demonstrated_at && row.demonstrated_at < current.first)) {
      current.first = row.demonstrated_at
    }
    if (!current.last || (row.demonstrated_at && row.demonstrated_at > current.last)) {
      current.last = row.demonstrated_at
    }

    aggregates.set(patternName, current)
  }

  const total = [...aggregates.values()].reduce((sum, item) => sum + item.count, 0)

  return [...aggregates.entries()]
    .map(([patternName, aggregate]) => ({
      patternName,
      demonstrationCount: aggregate.count,
      percentage: total > 0 ? Math.round((aggregate.count / total) * 1000) / 10 : 0,
      firstDemonstrated: aggregate.first,
      lastDemonstrated: aggregate.last,
    }))
    .sort((a, b) => b.demonstrationCount - a.demonstrationCount)
}

function buildPatternScores(summary: ResearchPatternSummary[]): PatternScores {
  const scores: PatternScores = {
    analytical: 0,
    patience: 0,
    exploring: 0,
    helping: 0,
    building: 0,
  }

  for (const item of summary) {
    scores[item.patternName] = Math.round((item.percentage / 10) * 100) / 100
  }

  return scores
}

function toSkillDemonstrations(
  skillRows: ResearchSkillDemonstrationRow[]
): SkillDemonstration[] {
  return [...skillRows]
    .sort((a, b) => (parseDate(a.demonstrated_at) ?? 0) - (parseDate(b.demonstrated_at) ?? 0))
    .map((row) => ({
      scene: row.scene_id,
      sceneDescription: row.scene_description ?? row.scene_id,
      choice: row.choice_text ?? '',
      skillsDemonstrated: [row.skill_name],
      context: row.context ?? '',
      timestamp: parseDate(row.demonstrated_at) ?? 0,
    }))
}

function buildCareerMatches(
  careerRows: ResearchCareerExplorationRow[]
): ResearchCareerMatch[] {
  return [...careerRows]
    .sort((a, b) => (parseDate(a.explored_at) ?? 0) - (parseDate(b.explored_at) ?? 0))
    .map((row) => ({
      careerName: row.career_name,
      score: scoreToPercent(row.match_score),
      readiness: row.readiness_level ?? null,
      exploredAt: row.explored_at ?? null,
      localOpportunities: normalizeStringArray(row.local_opportunities),
      educationPaths: normalizeStringArray(row.education_paths),
    }))
}

function pickLatestTimestamp(...timestamps: Array<string | null | undefined>): string | null {
  const parsed = timestamps
    .map((value) => ({ value, timestamp: parseDate(value) }))
    .filter((entry): entry is { value: string; timestamp: number } => entry.value !== null && entry.value !== undefined && entry.timestamp !== null)
    .sort((a, b) => b.timestamp - a.timestamp)

  return parsed[0]?.value ?? null
}

function pickFirstTimestamp(...timestamps: Array<string | null | undefined>): string | null {
  const parsed = timestamps
    .map((value) => ({ value, timestamp: parseDate(value) }))
    .filter((entry): entry is { value: string; timestamp: number } => entry.value !== null && entry.value !== undefined && entry.timestamp !== null)
    .sort((a, b) => a.timestamp - b.timestamp)

  return parsed[0]?.value ?? null
}

function buildLongitudinalRecord(
  skillRows: ResearchSkillDemonstrationRow[],
  patternRows: ResearchPatternDemonstrationRow[],
  careerRows: ResearchCareerExplorationRow[],
  profile: ResearchProfileRow,
  behavioralProfile?: ResearchBehavioralProfileRow
): ResearchLongitudinalRecord {
  const activityByDay = new Map<string, { skillDemonstrations: number; uniqueSkills: Set<string> }>()
  for (const row of skillRows) {
    const date = row.demonstrated_at.slice(0, 10)
    const current = activityByDay.get(date) ?? {
      skillDemonstrations: 0,
      uniqueSkills: new Set<string>(),
    }
    current.skillDemonstrations += 1
    current.uniqueSkills.add(row.skill_name)
    activityByDay.set(date, current)
  }

  const patternEvolution = new Map<string, Partial<Record<ResearchPatternName, number>>>()
  for (const row of patternRows) {
    const patternName = toResearchPatternName(row.pattern_name)
    if (!patternName) continue
    const date = row.demonstrated_at.slice(0, 10)
    const current = patternEvolution.get(date) ?? {}
    current[patternName] = (current[patternName] ?? 0) + 1
    patternEvolution.set(date, current)
  }

  const careerTimeline = buildCareerMatches(careerRows).map((career) => ({
    exploredAt: career.exploredAt,
    careerName: career.careerName,
    score: career.score,
    readiness: career.readiness,
  }))

  const firstActivityAt = pickFirstTimestamp(
    profile.created_at,
    ...skillRows.map((row) => row.demonstrated_at),
    ...patternRows.map((row) => row.demonstrated_at),
    ...careerRows.map((row) => row.explored_at ?? null)
  )

  const lastActivityAt = pickLatestTimestamp(
    profile.last_activity,
    profile.updated_at,
    behavioralProfile?.updated_at ?? null,
    ...skillRows.map((row) => row.demonstrated_at),
    ...patternRows.map((row) => row.demonstrated_at),
    ...careerRows.map((row) => row.explored_at ?? null)
  )

  return {
    firstActivityAt,
    lastActivityAt,
    activeDays: activityByDay.size,
    activityByDay: [...activityByDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, current]) => ({
        date,
        skillDemonstrations: current.skillDemonstrations,
        uniqueSkills: current.uniqueSkills.size,
      })),
    patternEvolution: [...patternEvolution.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, patterns]) => ({
        date,
        patterns,
      })),
    careerTimeline,
  }
}

export function buildCohortLongitudinalSummary(
  skillRows: ResearchSkillDemonstrationRow[],
  patternRows: ResearchPatternDemonstrationRow[],
  careerRows: ResearchCareerExplorationRow[]
): CohortLongitudinalSummary {
  const activityByDay = new Map<string, { participants: Set<string>; skillDemonstrations: number }>()
  for (const row of skillRows) {
    const date = row.demonstrated_at.slice(0, 10)
    const current = activityByDay.get(date) ?? {
      participants: new Set<string>(),
      skillDemonstrations: 0,
    }
    current.participants.add(row.user_id)
    current.skillDemonstrations += 1
    activityByDay.set(date, current)
  }

  const patternEvolution = new Map<string, Partial<Record<ResearchPatternName, number>>>()
  for (const row of patternRows) {
    const patternName = toResearchPatternName(row.pattern_name)
    if (!patternName) continue
    const date = row.demonstrated_at.slice(0, 10)
    const current = patternEvolution.get(date) ?? {}
    current[patternName] = (current[patternName] ?? 0) + 1
    patternEvolution.set(date, current)
  }

  const careerExplorationsByDay = new Map<string, number>()
  for (const row of careerRows) {
    const date = row.explored_at?.slice(0, 10)
    if (!date) continue
    careerExplorationsByDay.set(date, (careerExplorationsByDay.get(date) ?? 0) + 1)
  }

  return {
    activityByDay: [...activityByDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, current]) => ({
        date,
        participants: current.participants.size,
        skillDemonstrations: current.skillDemonstrations,
      })),
    patternEvolution: [...patternEvolution.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, patterns]) => ({
        date,
        patterns,
      })),
    careerExplorationsByDay: [...careerExplorationsByDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, careerExplorations]) => ({
        date,
        careerExplorations,
      })),
  }
}

export function buildResearchParticipantId(userId: string): string {
  return `participant_${createHash('sha256').update(userId).digest('hex').slice(0, 16)}`
}

export function parseResearchExportMode(
  rawMode: string | null,
  hasUserId: boolean
): ResearchExportMode {
  if (rawMode && RESEARCH_EXPORT_MODES.includes(rawMode as ResearchExportMode)) {
    return rawMode as ResearchExportMode
  }
  return hasUserId ? 'individual' : 'cohort'
}

export function getResearchExportScope(
  mode: ResearchExportMode,
  userId: string | null
): ResearchExportScope {
  if (mode === 'individual') return 'individual_identified'
  if (mode === 'longitudinal' && userId) return 'individual_identified'
  return 'cohort_anonymized'
}

export function hasIndividualResearchConsent(
  consent: ResearchConsentRow | null | undefined
): boolean {
  if (!consent) return false
  if (consent.consent_status !== 'granted') return false
  if (consent.consent_scope !== 'individual_research' && consent.consent_scope !== 'full_research') {
    return false
  }
  if (consent.guardian_required && !consent.guardian_verified) return false
  return true
}

export function hasLongitudinalResearchConsent(
  consent: ResearchConsentRow | null | undefined
): boolean {
  if (!consent) return false
  if (consent.consent_status !== 'granted') return false
  if (consent.consent_scope !== 'full_research') return false
  if (consent.guardian_required && !consent.guardian_verified) return false
  return true
}

export function buildResearchParticipantExport({
  profile,
  behavioralProfile,
  patternRows,
  skillRows,
  careerRows,
  consent,
  scope,
  includeLongitudinal,
}: BuildParticipantExportParams): ResearchParticipantExport {
  const participantId = buildResearchParticipantId(profile.user_id)
  const exportedId = scope === 'individual_identified' ? profile.user_id : participantId
  const patternSummary = buildPatternSummary(patternRows)
  const patternScores = buildPatternScores(patternSummary)
  const demonstrations = toSkillDemonstrations(skillRows)
  const cognitiveState = calculateCognitiveDomainState(demonstrations, { patternScores })
  const cognitiveResearch = createResearchExport(exportedId, cognitiveState, patternScores)
  const careers = buildCareerMatches(careerRows)
  const topCareer = [...careers].sort((a, b) => b.score - a.score)[0] ?? null

  const lastSession = pickLatestTimestamp(
    profile.last_activity,
    profile.updated_at,
    behavioralProfile?.updated_at ?? null,
    ...skillRows.map((row) => row.demonstrated_at),
    ...patternRows.map((row) => row.demonstrated_at),
    ...careerRows.map((row) => row.explored_at ?? null)
  )

  return {
    participantId,
    playerId: exportedId,
    identifierType: scope === 'individual_identified' ? 'user_id' : 'participant_id',
    ...(scope === 'individual_identified' && consent
      ? {
          consent: {
            status: consent.consent_status,
            scope: consent.consent_scope,
            guardianVerified: !consent.guardian_required || consent.guardian_verified,
            consentedAt: consent.consented_at,
          },
        }
      : {}),
    metrics: {
      totalChoices: behavioralProfile?.total_choices ?? 0,
      totalSkillDemonstrations: skillRows.length,
      dominantPattern: patternSummary[0]?.patternName ?? 'emerging',
      engagementLevel: cognitiveResearch.engagement.level,
      lastSession,
      strongAffinities: careers.filter((career) => career.score >= 50).length,
      topCareer: topCareer
        ? {
            name: topCareer.careerName,
            score: topCareer.score,
            readiness: topCareer.readiness,
          }
        : null,
    },
    behavioralProfile: {
      responseSpeed: behavioralProfile?.response_speed ?? null,
      stressResponse: behavioralProfile?.stress_response ?? null,
      socialOrientation: behavioralProfile?.social_orientation ?? null,
      problemApproach: behavioralProfile?.problem_approach ?? null,
      communicationStyle: behavioralProfile?.communication_style ?? null,
      culturalAlignment: behavioralProfile?.cultural_alignment ?? null,
      averageResponseTimeMs: behavioralProfile?.avg_response_time_ms ?? null,
    },
    patternSummary,
    cognitiveResearch,
    careers,
    ...(includeLongitudinal
      ? {
          longitudinal: buildLongitudinalRecord(
            skillRows,
            patternRows,
            careerRows,
            profile,
            behavioralProfile
          ),
        }
      : {}),
  }
}
