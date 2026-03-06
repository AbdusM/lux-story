import {
  RESEARCH_CONSENT_SCOPES,
  hasIndividualResearchConsent,
  hasLongitudinalResearchConsent,
  type ResearchConsentRow,
  type ResearchConsentScope,
  type ResearchConsentStatus,
} from './research-export'

export const RESEARCH_PARTICIPATION_LEVELS = [
  'none',
  ...RESEARCH_CONSENT_SCOPES,
] as const

export type ResearchParticipationLevel =
  (typeof RESEARCH_PARTICIPATION_LEVELS)[number]

export interface ResearchConsentResponse {
  status: ResearchConsentStatus
  scope: ResearchConsentScope
  selectedParticipation: ResearchParticipationLevel
  guardianRequired: boolean
  guardianVerified: boolean
  consentedAt: string | null
  revokedAt: string | null
  allowsIdentifiedExport: boolean
  allowsLongitudinalExport: boolean
}

export interface BuildResearchConsentUpsertParams {
  userId: string
  consentEnabled: boolean
  consentScope: ResearchConsentScope
  guardianRequired: boolean
  guardianVerified: boolean
  existing?: ResearchConsentRow | null
  now?: string
  source?: string
}

export interface ResearchConsentUpsertRow extends ResearchConsentRow {
  metadata: {
    source: string
    updated_via: 'user_profile'
  }
}

export function parseResearchConsentScope(
  value: unknown
): ResearchConsentScope | null {
  if (typeof value !== 'string') return null
  return RESEARCH_CONSENT_SCOPES.includes(value as ResearchConsentScope)
    ? (value as ResearchConsentScope)
    : null
}

export function getResearchParticipationLevel(
  consent: ResearchConsentRow | null | undefined
): ResearchParticipationLevel {
  if (!consent) return 'none'
  if (consent.consent_status === 'revoked') return 'none'
  return consent.consent_scope
}

export function serializeResearchConsent(
  consent: ResearchConsentRow | null | undefined
): ResearchConsentResponse | null {
  if (!consent) return null

  return {
    status: consent.consent_status,
    scope: consent.consent_scope,
    selectedParticipation: getResearchParticipationLevel(consent),
    guardianRequired: consent.guardian_required,
    guardianVerified: consent.guardian_verified,
    consentedAt: consent.consented_at,
    revokedAt: consent.revoked_at,
    allowsIdentifiedExport: hasIndividualResearchConsent(consent),
    allowsLongitudinalExport: hasLongitudinalResearchConsent(consent),
  }
}

export function buildResearchConsentUpsert({
  userId,
  consentEnabled,
  consentScope,
  guardianRequired,
  guardianVerified,
  existing = null,
  now = new Date().toISOString(),
  source = 'profile_page',
}: BuildResearchConsentUpsertParams): ResearchConsentUpsertRow {
  const normalizedGuardianRequired = consentEnabled ? guardianRequired : false
  const normalizedGuardianVerified =
    consentEnabled && normalizedGuardianRequired ? guardianVerified : false

  const consentStatus: ResearchConsentStatus = !consentEnabled
    ? 'revoked'
    : normalizedGuardianRequired && !normalizedGuardianVerified
      ? 'pending'
      : 'granted'

  const priorConsentedAt =
    existing?.consent_status === 'granted' && existing.consented_at
      ? existing.consented_at
      : existing?.consented_at ?? null

  return {
    user_id: userId,
    consent_status: consentStatus,
    consent_scope: consentEnabled ? consentScope : 'cohort_only',
    guardian_required: normalizedGuardianRequired,
    guardian_verified: normalizedGuardianVerified,
    consented_at: consentStatus === 'granted' ? priorConsentedAt ?? now : priorConsentedAt,
    revoked_at: consentStatus === 'revoked' ? now : null,
    metadata: {
      source,
      updated_via: 'user_profile',
    },
  }
}
