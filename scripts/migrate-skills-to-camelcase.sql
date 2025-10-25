-- ============================================================================
-- Skill Name Format Migration: Underscore → camelCase
-- ============================================================================
-- Purpose: Migrate historical skill data from underscore format to camelCase
-- Date: October 24, 2025
-- 
-- This script updates skill_name fields across all tables to use camelCase
-- format that matches the FutureSkills TypeScript interface.
--
-- BEFORE: emotional_intelligence, critical_thinking, problem_solving
-- AFTER: emotionalIntelligence, criticalThinking, problemSolving
-- ============================================================================

-- ============================================================================
-- STEP 1: Backup existing data (CRITICAL - run this first!)
-- ============================================================================

-- Create backup tables
CREATE TABLE IF NOT EXISTS skill_demonstrations_backup AS 
SELECT * FROM skill_demonstrations;

CREATE TABLE IF NOT EXISTS skill_summaries_backup AS 
SELECT * FROM skill_summaries;

-- Verify backups
SELECT COUNT(*) AS skill_demonstrations_backup_count FROM skill_demonstrations_backup;
SELECT COUNT(*) AS skill_summaries_backup_count FROM skill_summaries_backup;

-- ============================================================================
-- STEP 2: Check current format distribution
-- ============================================================================

-- Count skills by format
SELECT 
  'Underscore format' AS format_type,
  COUNT(*) AS count,
  ARRAY_AGG(DISTINCT skill_name) AS examples
FROM skill_demonstrations 
WHERE skill_name LIKE '%_%'
UNION ALL
SELECT 
  'camelCase format' AS format_type,
  COUNT(*) AS count,
  ARRAY_AGG(DISTINCT skill_name) AS examples
FROM skill_demonstrations 
WHERE skill_name NOT LIKE '%_%';

-- ============================================================================
-- STEP 3: Update skill_demonstrations table
-- ============================================================================

UPDATE skill_demonstrations
SET skill_name = 
  CASE skill_name
    -- Core 2030 Skills (multi-word)
    WHEN 'emotional_intelligence' THEN 'emotionalIntelligence'
    WHEN 'critical_thinking' THEN 'criticalThinking'
    WHEN 'problem_solving' THEN 'problemSolving'
    WHEN 'digital_literacy' THEN 'digitalLiteracy'
    WHEN 'cultural_competence' THEN 'culturalCompetence'
    WHEN 'time_management' THEN 'timeManagement'
    WHEN 'financial_literacy' THEN 'financialLiteracy'
    
    -- Single-word skills (already correct)
    WHEN 'communication' THEN 'communication'
    WHEN 'collaboration' THEN 'collaboration'
    WHEN 'creativity' THEN 'creativity'
    WHEN 'adaptability' THEN 'adaptability'
    WHEN 'leadership' THEN 'leadership'
    
    -- Edge cases (if any old format slipped through)
    WHEN 'empathy' THEN 'emotionalIntelligence'  -- Mapped to EI
    WHEN 'self_awareness' THEN 'emotionalIntelligence'  -- Mapped to EI
    WHEN 'mindfulness' THEN 'emotionalIntelligence'  -- Mapped to EI
    WHEN 'integrity' THEN 'leadership'  -- Mapped to leadership
    WHEN 'active_listening' THEN 'communication'  -- Mapped to communication
    WHEN 'systems_thinking' THEN 'criticalThinking'  -- Mapped to critical thinking
    WHEN 'curiosity' THEN 'criticalThinking'  -- Mapped to critical thinking
    
    -- Default: keep as-is if already correct
    ELSE skill_name
  END
WHERE skill_name != 
  CASE skill_name
    WHEN 'emotional_intelligence' THEN 'emotionalIntelligence'
    WHEN 'critical_thinking' THEN 'criticalThinking'
    WHEN 'problem_solving' THEN 'problemSolving'
    WHEN 'digital_literacy' THEN 'digitalLiteracy'
    WHEN 'cultural_competence' THEN 'culturalCompetence'
    WHEN 'time_management' THEN 'timeManagement'
    WHEN 'financial_literacy' THEN 'financialLiteracy'
    WHEN 'empathy' THEN 'emotionalIntelligence'
    WHEN 'self_awareness' THEN 'emotionalIntelligence'
    WHEN 'mindfulness' THEN 'emotionalIntelligence'
    WHEN 'integrity' THEN 'leadership'
    WHEN 'active_listening' THEN 'communication'
    WHEN 'systems_thinking' THEN 'criticalThinking'
    WHEN 'curiosity' THEN 'criticalThinking'
    ELSE skill_name
  END;

-- Verify skill_demonstrations update
SELECT 
  skill_name, 
  COUNT(*) AS demonstration_count
FROM skill_demonstrations
GROUP BY skill_name
ORDER BY demonstration_count DESC;

-- ============================================================================
-- STEP 4: Update skill_summaries table
-- ============================================================================

UPDATE skill_summaries
SET skill_name = 
  CASE skill_name
    -- Core 2030 Skills (multi-word)
    WHEN 'emotional_intelligence' THEN 'emotionalIntelligence'
    WHEN 'critical_thinking' THEN 'criticalThinking'
    WHEN 'problem_solving' THEN 'problemSolving'
    WHEN 'digital_literacy' THEN 'digitalLiteracy'
    WHEN 'cultural_competence' THEN 'culturalCompetence'
    WHEN 'time_management' THEN 'timeManagement'
    WHEN 'financial_literacy' THEN 'financialLiteracy'
    
    -- Single-word skills (already correct)
    WHEN 'communication' THEN 'communication'
    WHEN 'collaboration' THEN 'collaboration'
    WHEN 'creativity' THEN 'creativity'
    WHEN 'adaptability' THEN 'adaptability'
    WHEN 'leadership' THEN 'leadership'
    
    -- Edge cases
    WHEN 'empathy' THEN 'emotionalIntelligence'
    WHEN 'self_awareness' THEN 'emotionalIntelligence'
    WHEN 'mindfulness' THEN 'emotionalIntelligence'
    WHEN 'integrity' THEN 'leadership'
    WHEN 'active_listening' THEN 'communication'
    WHEN 'systems_thinking' THEN 'criticalThinking'
    WHEN 'curiosity' THEN 'criticalThinking'
    
    -- Default: keep as-is
    ELSE skill_name
  END
WHERE skill_name != 
  CASE skill_name
    WHEN 'emotional_intelligence' THEN 'emotionalIntelligence'
    WHEN 'critical_thinking' THEN 'criticalThinking'
    WHEN 'problem_solving' THEN 'problemSolving'
    WHEN 'digital_literacy' THEN 'digitalLiteracy'
    WHEN 'cultural_competence' THEN 'culturalCompetence'
    WHEN 'time_management' THEN 'timeManagement'
    WHEN 'financial_literacy' THEN 'financialLiteracy'
    WHEN 'empathy' THEN 'emotionalIntelligence'
    WHEN 'self_awareness' THEN 'emotionalIntelligence'
    WHEN 'mindfulness' THEN 'emotionalIntelligence'
    WHEN 'integrity' THEN 'leadership'
    WHEN 'active_listening' THEN 'communication'
    WHEN 'systems_thinking' THEN 'criticalThinking'
    WHEN 'curiosity' THEN 'criticalThinking'
    ELSE skill_name
  END;

-- Verify skill_summaries update
SELECT 
  skill_name, 
  SUM(demonstration_count) AS total_demonstrations,
  COUNT(DISTINCT user_id) AS user_count
FROM skill_summaries
GROUP BY skill_name
ORDER BY total_demonstrations DESC;

-- ============================================================================
-- STEP 5: Final validation
-- ============================================================================

-- Check for any remaining underscore format
SELECT 
  'skill_demonstrations' AS table_name,
  COUNT(*) AS underscore_count
FROM skill_demonstrations 
WHERE skill_name LIKE '%_%'
UNION ALL
SELECT 
  'skill_summaries' AS table_name,
  COUNT(*) AS underscore_count
FROM skill_summaries 
WHERE skill_name LIKE '%_%';

-- Expected result: 0 for both tables

-- ============================================================================
-- STEP 6: Cleanup (OPTIONAL - only after verifying migration worked)
-- ============================================================================

-- Drop backup tables (run this ONLY after confirming migration is correct)
-- DROP TABLE IF EXISTS skill_demonstrations_backup;
-- DROP TABLE IF EXISTS skill_summaries_backup;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- 
-- Next steps:
-- 1. Verify dashboard displays skills correctly
-- 2. Test skill gap calculation
-- 3. Confirm new demonstrations use camelCase
-- 
-- Rollback (if needed):
-- DELETE FROM skill_demonstrations;
-- INSERT INTO skill_demonstrations SELECT * FROM skill_demonstrations_backup;
-- DELETE FROM skill_summaries;
-- INSERT INTO skill_summaries SELECT * FROM skill_summaries_backup;
-- ============================================================================

