-- ============================================================================
-- Migration 022: Research Participant Consent Registry
-- ============================================================================
-- Purpose: Gate identified research exports behind persisted participant consent
-- and support guardian verification when required.
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS research_participant_consents (
  user_id TEXT PRIMARY KEY REFERENCES player_profiles(user_id) ON DELETE CASCADE,
  consent_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (consent_status IN ('pending', 'granted', 'revoked')),
  consent_scope TEXT NOT NULL DEFAULT 'cohort_only'
    CHECK (consent_scope IN ('cohort_only', 'individual_research', 'full_research')),
  guardian_required BOOLEAN NOT NULL DEFAULT FALSE,
  guardian_verified BOOLEAN NOT NULL DEFAULT FALSE,
  consented_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT consent_granted_requires_timestamp
    CHECK (consent_status <> 'granted' OR consented_at IS NOT NULL),
  CONSTRAINT consent_revoked_requires_timestamp
    CHECK (consent_status <> 'revoked' OR revoked_at IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_research_consents_status
  ON research_participant_consents(consent_status);

CREATE INDEX IF NOT EXISTS idx_research_consents_scope
  ON research_participant_consents(consent_scope);

ALTER TABLE research_participant_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own research consent" ON research_participant_consents;
CREATE POLICY "Users can view own research consent"
  ON research_participant_consents FOR SELECT
  USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own research consent" ON research_participant_consents;
CREATE POLICY "Users can insert own research consent"
  ON research_participant_consents FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own research consent" ON research_participant_consents;
CREATE POLICY "Users can update own research consent"
  ON research_participant_consents FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Service role can manage research consent" ON research_participant_consents;
CREATE POLICY "Service role can manage research consent"
  ON research_participant_consents FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

DROP TRIGGER IF EXISTS research_participant_consents_updated_at
  ON research_participant_consents;
CREATE TRIGGER research_participant_consents_updated_at
  BEFORE UPDATE ON research_participant_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE research_participant_consents IS
  'Participant consent registry for identified research export and longitudinal tracking access.';

COMMENT ON COLUMN research_participant_consents.consent_scope IS
  'cohort_only = pseudonymized only, individual_research = identified individual export, full_research = identified + longitudinal research export.';

COMMIT;
