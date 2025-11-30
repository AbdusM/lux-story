-- ============================================================================
-- Migration 016: Fix Function Search Path Security
-- ============================================================================
-- Purpose: Set search_path on all functions to prevent search_path injection attacks
-- 
-- Issues Fixed:
-- 1. Add SET search_path = '' to all functions (prevents search_path manipulation)
-- 2. Revoke public access from urgent_students materialized view
--
-- Created: 2025-11-30
-- Dependencies: All previous migrations
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. FIX FUNCTIONS: Add SET search_path = '' to prevent injection
-- ============================================================================

-- Fix set_current_user_id
CREATE OR REPLACE FUNCTION set_current_user_id(p_user_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM set_config('app.current_user_id', p_user_id, false);
END;
$$;

-- Fix calculate_urgency_score (full function from migration 009 with SET search_path)
CREATE OR REPLACE FUNCTION calculate_urgency_score(p_player_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_disengagement DECIMAL(3,2) := 0.0;
  v_confusion DECIMAL(3,2) := 0.0;
  v_stress DECIMAL(3,2) := 0.0;
  v_isolation DECIMAL(3,2) := 0.0;
  v_total_score DECIMAL(3,2) := 0.0;
  v_level TEXT := 'low';
  v_narrative TEXT := '';
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
  SELECT last_activity, total_demonstrations,
    EXTRACT(EPOCH FROM (NOW() - last_activity)) / (24 * 60 * 60)
  INTO v_last_activity, v_total_demonstrations, v_days_inactive
  FROM public.player_profiles WHERE user_id = p_player_id;
  
  IF NOT FOUND THEN RETURN; END IF;

  SELECT COUNT(*) INTO v_total_choices FROM public.choice_history WHERE player_id = p_player_id;
  SELECT COUNT(*) INTO v_total_scenes FROM public.visited_scenes WHERE player_id = p_player_id;
  SELECT COUNT(DISTINCT scene_id) INTO v_unique_scenes FROM public.visited_scenes WHERE player_id = p_player_id;
  SELECT pattern_value INTO v_rushing_pattern FROM public.player_patterns WHERE player_id = p_player_id AND pattern_name = 'rushing';
  SELECT pattern_value INTO v_helping_pattern FROM public.player_patterns WHERE player_id = p_player_id AND pattern_name = 'helping';
  SELECT COUNT(*) INTO v_relationships FROM public.relationship_progress WHERE player_id = p_player_id;
  SELECT COUNT(*) INTO v_milestones FROM public.skill_milestones WHERE player_id = p_player_id;

  v_disengagement := LEAST(1.0, COALESCE(v_days_inactive, 0) / 7.0);
  IF v_total_choices > 15 AND v_unique_scenes < 5 THEN v_confusion := 1.0;
  ELSIF v_total_choices > 10 AND v_unique_scenes < 4 THEN v_confusion := 0.8;
  ELSIF v_total_choices > 5 AND v_unique_scenes < 3 THEN v_confusion := 0.5;
  ELSE v_confusion := 0.0;
  END IF;
  v_stress := COALESCE(v_rushing_pattern, 0.0);
  IF v_relationships = 0 AND v_total_scenes > 5 THEN v_isolation := 1.0;
  ELSIF v_relationships = 0 AND v_total_scenes > 3 THEN v_isolation := 0.7;
  ELSIF v_relationships = 0 THEN v_isolation := 0.3;
  ELSE v_isolation := 0.0;
  END IF;

  v_total_score := v_disengagement * 0.4 + v_confusion * 0.3 + v_stress * 0.2 + v_isolation * 0.1;
  IF v_total_score >= 0.75 THEN v_level := 'critical';
  ELSIF v_total_score >= 0.5 THEN v_level := 'high';
  ELSIF v_total_score >= 0.25 THEN v_level := 'medium';
  ELSE v_level := 'low';
  END IF;

  v_narrative := public.generate_urgency_narrative(
    v_level, v_total_score, v_disengagement, v_confusion, v_stress, v_isolation,
    v_days_inactive, v_total_choices, v_unique_scenes, v_total_scenes,
    v_relationships, v_milestones, COALESCE(v_helping_pattern, 0.0), 'family'::text
  );

  INSERT INTO public.player_urgency_scores (
    player_id, urgency_score, urgency_level, disengagement_score, confusion_score,
    stress_score, isolation_score, urgency_narrative, last_calculated, calculation_reason, updated_at
  ) VALUES (
    p_player_id, v_total_score, v_level, v_disengagement, v_confusion,
    v_stress, v_isolation, v_narrative, NOW(), 'scheduled_calculation', NOW()
  )
  ON CONFLICT (player_id) DO UPDATE SET
    urgency_score = v_total_score, urgency_level = v_level,
    disengagement_score = v_disengagement, confusion_score = v_confusion,
    stress_score = v_stress, isolation_score = v_isolation,
    urgency_narrative = v_narrative, last_calculated = NOW(), updated_at = NOW();
END;
$$;

-- Fix generate_urgency_narrative (full function from migration 009)
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
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_narrative TEXT := '';
  v_problem TEXT := '';
  v_hypothesis TEXT := '';
  v_action TEXT := '';
BEGIN
  IF p_level = 'critical' THEN
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

    IF p_confusion >= 0.75 THEN
      v_hypothesis := 'Likely stuck or confused';
    ELSIF p_stress >= 0.7 THEN
      v_hypothesis := 'May be overwhelmed';
    ELSE
      v_hypothesis := 'Needs immediate support';
    END IF;

    IF p_view_mode = 'family' THEN
      v_action := 'Reach out';
    ELSE
      v_action := 'Immediate contact protocol';
    END IF;

    v_narrative := '🚨 Student ' || v_problem || '. ' || v_hypothesis || '. **Action:** ' || v_action || ' today.';

  ELSIF p_level = 'high' THEN
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

    IF p_stress >= 0.5 THEN
      v_hypothesis := 'Anxiety patterns suggest need for support';
    ELSIF p_confusion >= 0.5 THEN
      v_hypothesis := 'May be stuck navigating the platform';
    ELSE
      v_hypothesis := 'Disengagement risk increasing';
    END IF;

    IF p_view_mode = 'family' THEN
      v_action := 'Check in';
    ELSE
      v_action := 'Counselor intervention within 48 hours';
    END IF;

    v_narrative := '🟠 ' || v_problem || '. ' || v_hypothesis || '. **Action:** ' || v_action || ' this week.';

  ELSIF p_level = 'medium' THEN
    IF p_disengagement >= 0.25 THEN
      v_problem := 'Last active ' || p_days_inactive || ' days ago';
    ELSIF p_confusion >= 0.25 THEN
      v_problem := 'Progress slower than peers (' || p_unique_scenes || ' scenes in ' || p_total_choices || ' choices)';
    ELSIF p_isolation >= 0.3 THEN
      v_problem := 'Limited social engagement (no relationships formed)';
    ELSE
      v_problem := 'Moderate engagement detected';
    END IF;

    IF p_helping_pattern >= 0.5 THEN
      v_hypothesis := 'Shows positive helping patterns but needs encouragement';
    ELSIF p_unique_scenes < 5 THEN
      v_hypothesis := 'Comfortable with current path but might benefit from broader exploration';
    ELSE
      v_hypothesis := 'Stable engagement but room for growth';
    END IF;

    IF p_view_mode = 'family' THEN
      v_action := 'Gentle nudge to explore new areas';
    ELSE
      v_action := 'Monitor and encourage broader career exploration';
    END IF;

    v_narrative := '🟡 ' || v_problem || '. ' || v_hypothesis || '. **Action:** ' || v_action || ' within 2 weeks.';

  ELSE
    IF p_unique_scenes >= 4 AND p_relationships >= 2 THEN
      v_problem := 'Thriving with balanced exploration';
    ELSIF p_helping_pattern >= 0.5 THEN
      v_problem := 'Strong helping patterns and positive engagement';
    ELSIF p_milestones >= 3 THEN
      v_problem := 'Steady progress with ' || p_milestones || ' milestones achieved';
    ELSE
      v_problem := 'Healthy engagement levels';
    END IF;

    IF p_unique_scenes >= 4 THEN
      v_hypothesis := 'Explored ' || p_unique_scenes || ' careers, formed ' || COALESCE(p_relationships, 0) || ' relationships, demonstrating thoughtful decision-making';
    ELSIF p_total_choices >= 10 THEN
      v_hypothesis := 'Consistent activity (' || p_total_choices || ' choices) with good reflection patterns';
    ELSE
      v_hypothesis := 'Early stages but showing positive indicators';
    END IF;

    IF p_view_mode = 'family' THEN
      v_action := 'Monthly check-in to celebrate progress';
    ELSE
      v_action := 'Schedule monthly progress review to discuss next steps';
    END IF;

    v_narrative := '✅ ' || v_problem || '! ' || v_hypothesis || '. **Action:** ' || v_action || '.';
  END IF;

  RETURN v_narrative;
END;
$$;

-- Fix refresh_urgent_students_view
CREATE OR REPLACE FUNCTION refresh_urgent_students_view()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.urgent_students;
END;
$$;

-- Fix update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_behavioral_profile_timestamp
CREATE OR REPLACE FUNCTION update_behavioral_profile_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_player_pattern_timestamp
CREATE OR REPLACE FUNCTION update_player_pattern_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_urgency_timestamp
CREATE OR REPLACE FUNCTION update_urgency_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_skill_summary_timestamp
CREATE OR REPLACE FUNCTION update_skill_summary_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2. REVOKE ACCESS FROM MATERIALIZED VIEW
-- ============================================================================

-- Revoke public access from urgent_students materialized view
-- Only service_role should access this (for admin dashboard)
REVOKE SELECT ON urgent_students FROM anon;
REVOKE SELECT ON urgent_students FROM authenticated;
REVOKE SELECT ON urgent_students FROM public;

-- Ensure only service_role can access
GRANT SELECT ON urgent_students TO service_role;

COMMIT;

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 016_fix_function_search_path completed successfully';
  RAISE NOTICE 'Fixed: 9 functions (added SET search_path = '')';
  RAISE NOTICE 'Secured: urgent_students materialized view (revoked public access)';
END $$;
