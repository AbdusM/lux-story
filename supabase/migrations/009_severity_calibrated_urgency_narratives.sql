/**
 * Migration 009: Severity-Calibrated Urgency Narratives
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Purpose: Rewrite Glass Box urgency narratives with severity calibration
 * - Critical: 15-20 words, immediate action
 * - High: 20-25 words, 48-hour action
 * - Medium: 25-30 words, 2-week action
 * - Low: 30-40 words, monthly check-in
 *
 * Changes:
 * - Concise, action-oriented narratives
 * - Lead with the problem (no buried lede)
 * - Severity-appropriate word limits
 * - Support for dual modes: family-friendly and research-focused
 *
 * Created: 2025-10-03
 */

-- ============================================================================
-- FUNCTION: generate_urgency_narrative
-- Generates severity-calibrated narrative for Glass Box transparency
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_urgency_narrative(
  p_level TEXT,
  p_total_score DECIMAL,
  p_disengagement DECIMAL,
  p_confusion DECIMAL,
  p_stress DECIMAL,
  p_isolation DECIMAL,
  p_days_inactive INT,
  p_total_choices INT,
  p_unique_scenes INT,
  p_total_scenes INT,
  p_relationships INT,
  p_milestones INT,
  p_helping_pattern DECIMAL,
  p_view_mode TEXT DEFAULT 'family'
)
RETURNS TEXT AS $$
DECLARE
  v_narrative TEXT := '';
  v_problem TEXT := '';
  v_hypothesis TEXT := '';
  v_action TEXT := '';
BEGIN
  -- ============================================================================
  -- CRITICAL URGENCY (15-20 words)
  -- Format: 🚨 [Name] [Problem]. [Hypothesis]. **Action:** [Action] today.
  -- ============================================================================
  IF p_level = 'critical' THEN
    -- Identify primary problem
    IF p_disengagement >= 0.75 THEN
      v_problem := 'stopped playing ' || p_days_inactive || ' days ago';
      IF p_total_choices > 5 THEN
        v_problem := v_problem || ' after a strong start (' || p_total_choices || ' choices)';
      END IF;
    ELSIF p_confusion >= 0.75 THEN
      v_problem := 'made ' || p_total_choices || ' choices but visited only ' || p_unique_scenes || ' scenes';
    ELSIF p_isolation >= 0.75 THEN
      v_problem := 'explored ' || p_total_scenes || ' scenes without forming any relationships';
    ELSE
      v_problem := 'shows critical engagement issues';
    END IF;

    -- Hypothesis
    IF p_confusion >= 0.75 THEN
      v_hypothesis := 'Likely stuck or confused';
    ELSIF p_stress >= 0.7 THEN
      v_hypothesis := 'May be overwhelmed';
    ELSE
      v_hypothesis := 'Needs immediate support';
    END IF;

    -- Action (mode-specific)
    IF p_view_mode = 'family' THEN
      v_action := 'Reach out';
    ELSE
      v_action := 'Immediate contact protocol';
    END IF;

    -- Assemble (15-20 words)
    v_narrative := '🚨 Student ' || v_problem || '. ' || v_hypothesis || '. **Action:** ' || v_action || ' today.';

  -- ============================================================================
  -- HIGH URGENCY (20-25 words)
  -- Format: 🟠 [Concern]. [Reason]. **Action:** [Action] this week.
  -- ============================================================================
  ELSIF p_level = 'high' THEN
    -- Identify concern
    IF p_disengagement >= 0.5 THEN
      v_problem := 'No activity for ' || p_days_inactive || ' days';
    ELSIF p_confusion >= 0.5 THEN
      v_problem := p_total_choices || ' choices but only ' || p_unique_scenes || ' unique scenes';
    ELSIF p_stress >= 0.5 THEN
      v_problem := 'Rushing through choices without reflection';
    ELSIF p_isolation >= 0.5 THEN
      v_problem := p_total_scenes || ' scenes visited, no relationships built';
    ELSE
      v_problem := 'Engagement concerns detected';
    END IF;

    -- Reason/hypothesis
    IF p_stress >= 0.5 THEN
      v_hypothesis := 'Anxiety patterns suggest need for support';
    ELSIF p_confusion >= 0.5 THEN
      v_hypothesis := 'May be stuck navigating the platform';
    ELSE
      v_hypothesis := 'Disengagement risk increasing';
    END IF;

    -- Action
    IF p_view_mode = 'family' THEN
      v_action := 'Check in';
    ELSE
      v_action := 'Counselor intervention within 48 hours';
    END IF;

    -- Assemble (20-25 words)
    v_narrative := '🟠 ' || v_problem || '. ' || v_hypothesis || '. **Action:** ' || v_action || ' this week.';

  -- ============================================================================
  -- MEDIUM URGENCY (25-30 words)
  -- Format: 🟡 [Observation]. [Context]. **Action:** [Action] within 2 weeks.
  -- ============================================================================
  ELSIF p_level = 'medium' THEN
    -- Observation
    IF p_disengagement >= 0.25 THEN
      v_problem := 'Last active ' || p_days_inactive || ' days ago';
    ELSIF p_confusion >= 0.25 THEN
      v_problem := 'Progress slower than peers (' || p_unique_scenes || ' scenes in ' || p_total_choices || ' choices)';
    ELSIF p_isolation >= 0.3 THEN
      v_problem := 'Limited social engagement (no relationships formed)';
    ELSE
      v_problem := 'Moderate engagement detected';
    END IF;

    -- Context
    IF p_helping_pattern >= 0.5 THEN
      v_hypothesis := 'Shows positive helping patterns but needs encouragement';
    ELSIF p_unique_scenes < 5 THEN
      v_hypothesis := 'Comfortable with current path but might benefit from broader exploration';
    ELSE
      v_hypothesis := 'Stable engagement but room for growth';
    END IF;

    -- Action
    IF p_view_mode = 'family' THEN
      v_action := 'Gentle nudge to explore new areas';
    ELSE
      v_action := 'Monitor and encourage broader career exploration';
    END IF;

    -- Assemble (25-30 words)
    v_narrative := '🟡 ' || v_problem || '. ' || v_hypothesis || '. **Action:** ' || v_action || ' within 2 weeks.';

  -- ============================================================================
  -- LOW URGENCY (30-40 words)
  -- Format: ✅ [Status]! [Details]. **Action:** [Action].
  -- ============================================================================
  ELSE
    -- Status (positive framing)
    IF p_unique_scenes >= 4 AND p_relationships >= 2 THEN
      v_problem := 'Thriving with balanced exploration';
    ELSIF p_helping_pattern >= 0.5 THEN
      v_problem := 'Strong helping patterns and positive engagement';
    ELSIF p_milestones >= 3 THEN
      v_problem := 'Steady progress with ' || p_milestones || ' milestones achieved';
    ELSE
      v_problem := 'Healthy engagement levels';
    END IF;

    -- Details
    IF p_unique_scenes >= 4 THEN
      v_hypothesis := 'Explored ' || p_unique_scenes || ' careers, formed ' || COALESCE(p_relationships, 0) || ' relationships, demonstrating thoughtful decision-making';
    ELSIF p_total_choices >= 10 THEN
      v_hypothesis := 'Consistent activity (' || p_total_choices || ' choices) with good reflection patterns';
    ELSE
      v_hypothesis := 'Early stages but showing positive indicators';
    END IF;

    -- Action
    IF p_view_mode = 'family' THEN
      v_action := 'Monthly check-in to celebrate progress';
    ELSE
      v_action := 'Schedule monthly progress review to discuss next steps';
    END IF;

    -- Assemble (30-40 words)
    v_narrative := '✅ ' || v_problem || '! ' || v_hypothesis || '. **Action:** ' || v_action || '.';
  END IF;

  RETURN v_narrative;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION generate_urgency_narrative IS 'Generates severity-calibrated Glass Box narratives with word count limits: Critical (15-20), High (20-25), Medium (25-30), Low (30-40)';

-- ============================================================================
-- UPDATED FUNCTION: calculate_urgency_score
-- Now uses severity-calibrated narrative generation
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

  -- Narrative
  v_narrative TEXT := '';

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
  -- STEP 5: GENERATE SEVERITY-CALIBRATED NARRATIVE
  -- ==========================

  v_narrative := generate_urgency_narrative(
    v_level,
    v_total_score,
    v_disengagement,
    v_confusion,
    v_stress,
    v_isolation,
    v_days_inactive,
    v_total_choices,
    v_unique_scenes,
    v_total_scenes,
    v_relationships,
    v_milestones,
    v_helping_pattern,
    'family' -- Default to family mode; can be parameterized later
  );

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

COMMENT ON FUNCTION calculate_urgency_score IS 'Glass Box urgency scoring with severity-calibrated narratives: Critical (15-20 words), High (20-25), Medium (25-30), Low (30-40)';

-- ============================================================================
-- REFRESH EXISTING URGENCY SCORES
-- Recalculate all existing scores with new narrative format
-- ============================================================================

-- Note: This can be run manually via POST /api/admin/urgency
-- Commented out to avoid automatic recalculation on migration
-- Uncomment and run separately if you want to update all existing narratives

-- DO $$
-- DECLARE
--   v_player RECORD;
-- BEGIN
--   FOR v_player IN SELECT user_id FROM player_profiles LOOP
--     PERFORM calculate_urgency_score(v_player.user_id);
--   END LOOP;
-- END $$;

-- ============================================================================
-- END OF MIGRATION 009
-- ============================================================================
