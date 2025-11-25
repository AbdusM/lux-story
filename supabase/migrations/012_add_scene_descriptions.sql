-- Migration: Add scene_description to skill_demonstrations
-- Purpose: Provide readable context for admin dashboard instead of raw scene IDs
-- Date: 2024-11-25

-- Add scene_description column to skill_demonstrations
ALTER TABLE skill_demonstrations
ADD COLUMN IF NOT EXISTS scene_description TEXT;

-- Add comment for documentation
COMMENT ON COLUMN skill_demonstrations.scene_description IS 'Human-readable description of the scene where skill was demonstrated';

-- Backfill existing rows with default description based on scene_id
-- This provides basic context for historical data
UPDATE skill_demonstrations
SET scene_description = CASE
    WHEN scene_id LIKE 'maya_%' THEN 'Maya Chen''s story arc'
    WHEN scene_id LIKE 'devon_%' THEN 'Devon Kumar''s story arc'
    WHEN scene_id LIKE 'jordan_%' THEN 'Jordan Packard''s story arc'
    WHEN scene_id LIKE 'samuel_%' THEN 'Samuel Washington''s guidance'
    WHEN scene_id LIKE 'kai_%' THEN 'Kai''s instructional design arc'
    WHEN scene_id LIKE 'rohan_%' THEN 'Rohan''s deep tech arc'
    WHEN scene_id LIKE 'silas_%' THEN 'Silas''s sustainability arc'
    ELSE 'Career exploration scene'
END
WHERE scene_description IS NULL;

-- Add scene_description to skill_summaries for aggregated context
ALTER TABLE skill_summaries
ADD COLUMN IF NOT EXISTS scene_descriptions TEXT[];

COMMENT ON COLUMN skill_summaries.scene_descriptions IS 'Array of readable scene descriptions where skill was demonstrated';

-- Add pattern context to pattern_demonstrations if not exists
ALTER TABLE pattern_demonstrations
ADD COLUMN IF NOT EXISTS scene_description TEXT;

COMMENT ON COLUMN pattern_demonstrations.scene_description IS 'Human-readable description of the scene where pattern was demonstrated';
