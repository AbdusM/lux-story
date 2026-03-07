-- ============================================================================
-- Migration 023: Guidance State Tables
-- ============================================================================
-- Purpose: Move adaptive guidance persistence out of action-plan JSON and into
-- dedicated task-progress + trajectory-snapshot tables.
-- Date: 2026-03-07
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS guidance_task_progress (
  user_id TEXT NOT NULL REFERENCES player_profiles(user_id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  capability_id TEXT NOT NULL,
  highest_progress_state TEXT NOT NULL CHECK (
    highest_progress_state IN (
      'unseen',
      'exposed',
      'attempted',
      'assisted',
      'completed',
      'repeated',
      'evidenced',
      'autonomous'
    )
  ),
  latest_assist_mode TEXT CHECK (
    latest_assist_mode IS NULL OR latest_assist_mode IN ('manual', 'augmented', 'delegated')
  ),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  abandon_count INTEGER NOT NULL DEFAULT 0,
  completion_count INTEGER NOT NULL DEFAULT 0,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  last_touched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_completed_at TIMESTAMPTZ,
  last_dismissed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_guidance_task_progress_user_updated
  ON guidance_task_progress(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_guidance_task_progress_capability_updated
  ON guidance_task_progress(capability_id, updated_at DESC);

ALTER TABLE guidance_task_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own guidance task progress" ON guidance_task_progress;
CREATE POLICY "Users can view own guidance task progress"
  ON guidance_task_progress FOR SELECT
  USING (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "Users can insert own guidance task progress" ON guidance_task_progress;
CREATE POLICY "Users can insert own guidance task progress"
  ON guidance_task_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "Users can update own guidance task progress" ON guidance_task_progress;
CREATE POLICY "Users can update own guidance task progress"
  ON guidance_task_progress FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "Service role can manage guidance task progress" ON guidance_task_progress;
CREATE POLICY "Service role can manage guidance task progress"
  ON guidance_task_progress FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE TABLE IF NOT EXISTS guidance_trajectory_snapshots (
  user_id TEXT PRIMARY KEY REFERENCES player_profiles(user_id) ON DELETE CASCADE,
  schema_version TEXT NOT NULL,
  ontology_version TEXT NOT NULL,
  recommendation_version TEXT NOT NULL,
  assignment_version TEXT,
  experiment_variant TEXT NOT NULL CHECK (
    experiment_variant IN ('control', 'adaptive')
  ),
  dimensions JSONB NOT NULL DEFAULT '{}'::jsonb,
  next_best_move JSONB,
  missed_doors JSONB NOT NULL DEFAULT '[]'::jsonb,
  shadow_artifacts JSONB NOT NULL DEFAULT '[]'::jsonb,
  reachable_task_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  friction_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guidance_trajectory_snapshots_updated
  ON guidance_trajectory_snapshots(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_guidance_trajectory_snapshots_variant_updated
  ON guidance_trajectory_snapshots(experiment_variant, updated_at DESC);

ALTER TABLE guidance_trajectory_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own guidance snapshots" ON guidance_trajectory_snapshots;
CREATE POLICY "Users can view own guidance snapshots"
  ON guidance_trajectory_snapshots FOR SELECT
  USING (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "Users can insert own guidance snapshots" ON guidance_trajectory_snapshots;
CREATE POLICY "Users can insert own guidance snapshots"
  ON guidance_trajectory_snapshots FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "Users can update own guidance snapshots" ON guidance_trajectory_snapshots;
CREATE POLICY "Users can update own guidance snapshots"
  ON guidance_trajectory_snapshots FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "Service role can manage guidance snapshots" ON guidance_trajectory_snapshots;
CREATE POLICY "Service role can manage guidance snapshots"
  ON guidance_trajectory_snapshots FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

COMMENT ON TABLE guidance_task_progress IS
  'Normalized adaptive-guidance task progress state per user/task.';
COMMENT ON TABLE guidance_trajectory_snapshots IS
  'Precomputed adaptive-guidance read model for fast home/menu/admin rendering.';

COMMIT;
