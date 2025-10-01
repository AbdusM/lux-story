/**
 * Migration 003: Urgency Triage System (Glass Box Architecture)
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Purpose: Enable administrators to identify students needing intervention
 * through transparent, narrative-justified urgency scoring.
 *
 * Philosophy: "Glass Box" - Every score comes with a human-readable explanation
 * of WHY the score is what it is. Scores without justification are not trustworthy.
 *
 * Created: 2025-10-01
 */

-- ============================================================================
-- TABLE: player_urgency_scores
-- Stores urgency scores with transparent narrative justification
-- ============================================================================

CREATE TABLE IF NOT EXISTS player_urgency_scores (
  player_id TEXT PRIMARY KEY REFERENCES player_profiles(user_id) ON DELETE CASCADE,

  -- Overall urgency assessment
  urgency_score DECIMAL(3,2) NOT NULL CHECK (urgency_score BETWEEN 0 AND 1),
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),

  -- Contributing factor scores (each 0-1, normalized)
  disengagement_score DECIMAL(3,2) DEFAULT 0.0 CHECK (disengagement_score BETWEEN 0 AND 1),
  confusion_score DECIMAL(3,2) DEFAULT 0.0 CHECK (confusion_score BETWEEN 0 AND 1),
  stress_score DECIMAL(3,2) DEFAULT 0.0 CHECK (stress_score BETWEEN 0 AND 1),
  isolation_score DECIMAL(3,2) DEFAULT 0.0 CHECK (isolation_score BETWEEN 0 AND 1),

  -- CRITICAL: Human-readable narrative explaining the score (Glass Box Principle)
  urgency_narrative TEXT,

  -- Metadata
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  calculation_reason TEXT DEFAULT 'initial_calculation',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient dashboard queries
CREATE INDEX idx_urgency_level ON player_urgency_scores(urgency_level, urgency_score DESC);
CREATE INDEX idx_urgency_score ON player_urgency_scores(urgency_score DESC);
CREATE INDEX idx_last_calculated ON player_urgency_scores(last_calculated DESC);

-- ============================================================================
-- FUNCTION: calculate_urgency_score
-- Calculates urgency score AND generates narrative justification
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_urgency_score(p_player_id TEXT)
RETURNS VOID AS $$
DECLARE
  -- Score components
  v_disengagement DECIMAL(3,2) := 0.0;
  v_confusion DECIMAL(3,2) := 0.0;
  v_stress DECIMAL(3,2) := 0.0;
  v_isolation DECIMAL(3,2) := 0.0;
  v_total_score DECIMAL(3,2) := 0.0;
  v_level TEXT := 'low';

  -- Narrative components
  v_narrative TEXT := '';
  v_primary_factors TEXT[] := ARRAY[]::TEXT[];

  -- Data points for calculation
  v_last_activity TIMESTAMPTZ;
  v_days_inactive INT;
  v_total_choices INT;
  v_total_scenes INT;
  v_unique_scenes INT;
  v_total_demonstrations INT;
  v_rushing_pattern DECIMAL(3,2);
  v_helping_pattern DECIMAL(3,2);
  v_relationships INT;
  v_milestones INT;

BEGIN
  -- ==========================
  -- STEP 1: Gather data points
  -- ==========================

  -- Player profile data
  SELECT
    last_activity,
    total_demonstrations,
    EXTRACT(EPOCH FROM (NOW() - last_activity)) / (24 * 60 * 60) -- days since last activity
  INTO v_last_activity, v_total_demonstrations, v_days_inactive
  FROM player_profiles
  WHERE user_id = p_player_id;

  -- If player doesn't exist, exit
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Choice and scene data
  SELECT COUNT(*) INTO v_total_choices
  FROM choice_history WHERE player_id = p_player_id;

  SELECT COUNT(*) INTO v_total_scenes
  FROM visited_scenes WHERE player_id = p_player_id;

  SELECT COUNT(DISTINCT scene_id) INTO v_unique_scenes
  FROM visited_scenes WHERE player_id = p_player_id;

  -- Pattern data
  SELECT pattern_value INTO v_rushing_pattern
  FROM player_patterns
  WHERE player_id = p_player_id AND pattern_name = 'rushing';

  SELECT pattern_value INTO v_helping_pattern
  FROM player_patterns
  WHERE player_id = p_player_id AND pattern_name = 'helping';

  -- Relationship data
  SELECT COUNT(*) INTO v_relationships
  FROM relationship_progress WHERE player_id = p_player_id;

  -- Milestone data
  SELECT COUNT(*) INTO v_milestones
  FROM skill_milestones WHERE player_id = p_player_id;

  -- ==========================
  -- STEP 2: Calculate factor scores
  -- ==========================

  -- DISENGAGEMENT: Based on days since last activity
  -- 0 days = 0.0, 7+ days = 1.0
  v_disengagement := LEAST(1.0, v_days_inactive / 7.0);

  -- CONFUSION: High choice count but low scene variety
  -- Indicates player is "stuck" making choices but not progressing
  IF v_total_choices > 15 AND v_unique_scenes < 5 THEN
    v_confusion := 1.0;
  ELSIF v_total_choices > 10 AND v_unique_scenes < 4 THEN
    v_confusion := 0.8;
  ELSIF v_total_choices > 5 AND v_unique_scenes < 3 THEN
    v_confusion := 0.5;
  ELSE
    v_confusion := 0.0;
  END IF;

  -- STRESS: Based on rushing pattern
  v_stress := COALESCE(v_rushing_pattern, 0.0);

  -- ISOLATION: No relationships formed despite scene exploration
  IF v_relationships = 0 AND v_total_scenes > 5 THEN
    v_isolation := 1.0;
  ELSIF v_relationships = 0 AND v_total_scenes > 3 THEN
    v_isolation := 0.7;
  ELSIF v_relationships = 0 THEN
    v_isolation := 0.3;
  ELSE
    v_isolation := 0.0;
  END IF;

  -- ==========================
  -- STEP 3: Calculate weighted total score
  -- ==========================

  -- Weights: Disengagement is highest priority (40%)
  v_total_score := (
    v_disengagement * 0.4 +  -- Days inactive (most critical)
    v_confusion * 0.3 +       -- Stuck without progress
    v_stress * 0.2 +          -- Rushing behavior
    v_isolation * 0.1         -- No relationships
  );

  -- ==========================
  -- STEP 4: Determine urgency level
  -- ==========================

  IF v_total_score >= 0.75 THEN
    v_level := 'critical';
  ELSIF v_total_score >= 0.5 THEN
    v_level := 'high';
  ELSIF v_total_score >= 0.25 THEN
    v_level := 'medium';
  ELSE
    v_level := 'low';
  END IF;

  -- ==========================
  -- STEP 5: BUILD NARRATIVE (Glass Box Principle)
  -- ==========================

  -- Opening statement
  v_narrative := 'Urgency level is ' || UPPER(v_level) || ' (' || ROUND(v_total_score * 100) || '%). ';

  -- Disengagement narrative
  IF v_disengagement >= 0.75 THEN
    v_narrative := v_narrative || 'CRITICAL: Student has been inactive for ' || v_days_inactive || ' days. ';
    v_primary_factors := array_append(v_primary_factors, 'severe disengagement');
  ELSIF v_disengagement >= 0.5 THEN
    v_narrative := v_narrative || 'Student inactive for ' || v_days_inactive || ' days (concerning). ';
    v_primary_factors := array_append(v_primary_factors, 'disengagement');
  ELSIF v_disengagement >= 0.25 THEN
    v_narrative := v_narrative || 'Student last active ' || v_days_inactive || ' days ago. ';
  END IF;

  -- Confusion narrative
  IF v_confusion >= 0.75 THEN
    v_narrative := v_narrative || 'Strong confusion signals: ' || v_total_choices || ' choices made but only ' || v_unique_scenes || ' scenes explored (stuck pattern). ';
    v_primary_factors := array_append(v_primary_factors, 'navigation confusion');
  ELSIF v_confusion >= 0.5 THEN
    v_narrative := v_narrative || 'Potential confusion: Low scene variety (' || v_unique_scenes || ') despite ' || v_total_choices || ' choices. ';
    v_primary_factors := array_append(v_primary_factors, 'possible confusion');
  END IF;

  -- Stress narrative
  IF v_stress >= 0.7 THEN
    v_narrative := v_narrative || 'High stress indicated by rushing pattern (rapid clicking without reflection). ';
    v_primary_factors := array_append(v_primary_factors, 'stress/rushing');
  ELSIF v_stress >= 0.5 THEN
    v_narrative := v_narrative || 'Moderate stress: Some rushing behavior detected. ';
  END IF;

  -- Isolation narrative
  IF v_isolation >= 0.7 THEN
    v_narrative := v_narrative || 'No character relationships formed despite exploring ' || v_total_scenes || ' scenes (social isolation pattern). ';
    v_primary_factors := array_append(v_primary_factors, 'social isolation');
  ELSIF v_isolation >= 0.5 THEN
    v_narrative := v_narrative || 'Limited relationship building observed. ';
  END IF;

  -- Positive factors (protective factors)
  IF v_helping_pattern >= 0.5 THEN
    v_narrative := v_narrative || 'Positive: Strong helping pattern detected (protective factor). ';
  END IF;

  IF v_milestones >= 3 THEN
    v_narrative := v_narrative || 'Positive: ' || v_milestones || ' milestones achieved. ';
  END IF;

  -- Summary recommendation
  IF v_level = 'critical' THEN
    v_narrative := v_narrative || 'RECOMMENDED ACTION: Immediate outreach required. ';
  ELSIF v_level = 'high' THEN
    v_narrative := v_narrative || 'RECOMMENDED ACTION: Contact within 48 hours. ';
  ELSIF v_level = 'medium' THEN
    v_narrative := v_narrative || 'RECOMMENDED ACTION: Monitor for next session. ';
  END IF;

  -- Add primary factors summary
  IF array_length(v_primary_factors, 1) > 0 THEN
    v_narrative := v_narrative || 'Primary factors: ' || array_to_string(v_primary_factors, ', ') || '.';
  END IF;

  -- ==========================
  -- STEP 6: Upsert urgency record
  -- ==========================

  INSERT INTO player_urgency_scores (
    player_id,
    urgency_score,
    urgency_level,
    disengagement_score,
    confusion_score,
    stress_score,
    isolation_score,
    urgency_narrative,
    last_calculated,
    calculation_reason,
    updated_at
  ) VALUES (
    p_player_id,
    v_total_score,
    v_level,
    v_disengagement,
    v_confusion,
    v_stress,
    v_isolation,
    v_narrative,
    NOW(),
    'scheduled_calculation',
    NOW()
  )
  ON CONFLICT (player_id) DO UPDATE SET
    urgency_score = v_total_score,
    urgency_level = v_level,
    disengagement_score = v_disengagement,
    confusion_score = v_confusion,
    stress_score = v_stress,
    isolation_score = v_isolation,
    urgency_narrative = v_narrative,
    last_calculated = NOW(),
    calculation_reason = 'scheduled_calculation',
    updated_at = NOW();

END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_urgency_score IS 'Glass Box urgency scoring: Generates both numeric scores AND human-readable narrative justification';

-- ============================================================================
-- MATERIALIZED VIEW: urgent_students
-- Pre-computed dashboard view for admin performance
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS urgent_students AS
SELECT
  -- Player identity
  p.user_id,
  p.current_scene,
  p.total_demonstrations,
  p.last_activity,

  -- Urgency assessment
  u.urgency_score,
  u.urgency_level,
  u.urgency_narrative, -- CRITICAL: The "why" behind the score
  u.disengagement_score,
  u.confusion_score,
  u.stress_score,
  u.isolation_score,
  u.last_calculated,

  -- Activity summary
  (SELECT COUNT(*) FROM choice_history WHERE player_id = p.user_id) as total_choices,
  (SELECT COUNT(DISTINCT scene_id) FROM visited_scenes WHERE player_id = p.user_id) as unique_scenes_visited,
  (SELECT COUNT(*) FROM visited_scenes WHERE player_id = p.user_id) as total_scene_visits,

  -- Pattern summary
  (SELECT pattern_value FROM player_patterns WHERE player_id = p.user_id AND pattern_name = 'helping') as helping_pattern,
  (SELECT pattern_value FROM player_patterns WHERE player_id = p.user_id AND pattern_name = 'rushing') as rushing_pattern,
  (SELECT pattern_value FROM player_patterns WHERE player_id = p.user_id AND pattern_name = 'exploring') as exploring_pattern,

  -- Relationship summary
  (SELECT COUNT(*) FROM relationship_progress WHERE player_id = p.user_id) as relationships_formed,
  (SELECT AVG(trust_level) FROM relationship_progress WHERE player_id = p.user_id) as avg_trust_level,

  -- Milestone summary
  (SELECT COUNT(*) FROM skill_milestones WHERE player_id = p.user_id) as milestones_reached

FROM player_profiles p
LEFT JOIN player_urgency_scores u ON p.user_id = u.player_id
WHERE
  -- Show high/critical urgency OR inactive players
  u.urgency_level IN ('high', 'critical')
  OR p.last_activity < NOW() - INTERVAL '7 days'
  OR u.urgency_score IS NULL -- Never scored (new players)
ORDER BY
  -- Critical first, then by score descending
  CASE u.urgency_level
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
    ELSE 5
  END,
  u.urgency_score DESC NULLS LAST;

-- Indexes on materialized view for fast dashboard queries
CREATE INDEX idx_urgent_students_level ON urgent_students(urgency_level);
CREATE INDEX idx_urgent_students_score ON urgent_students(urgency_score DESC);

-- ============================================================================
-- HELPER FUNCTION: refresh_urgent_students_view
-- Refreshes materialized view (called after bulk scoring)
-- ============================================================================

CREATE OR REPLACE FUNCTION refresh_urgent_students_view()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW urgent_students;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_urgent_students_view IS 'Refreshes the urgent_students materialized view after urgency calculations';

-- ============================================================================
-- TRIGGER: auto_update_timestamp
-- Automatically update updated_at on row changes
-- ============================================================================

CREATE OR REPLACE FUNCTION update_urgency_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_urgency_timestamp
  BEFORE UPDATE ON player_urgency_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_urgency_timestamp();

-- ============================================================================
-- END OF MIGRATION 003
-- ============================================================================

COMMENT ON TABLE player_urgency_scores IS 'Glass Box urgency scoring: Transparent, narrative-justified student intervention prioritization';
COMMENT ON MATERIALIZED VIEW urgent_students IS 'Pre-computed dashboard view of students needing intervention (refresh every 5-15 minutes)';
