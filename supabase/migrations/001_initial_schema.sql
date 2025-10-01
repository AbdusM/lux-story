-- Grand Central Terminus Database Schema
-- Birmingham Career Exploration Platform
-- Migration 001: Initial Schema Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Player Profiles Table
-- Stores core player information and current game state
CREATE TABLE IF NOT EXISTS player_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    current_scene TEXT,
    total_demonstrations INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),

    -- Metadata
    game_version TEXT DEFAULT '2.0',
    platform TEXT DEFAULT 'web',

    -- Indexes
    CONSTRAINT user_id_unique UNIQUE (user_id)
);

CREATE INDEX idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX idx_player_profiles_last_activity ON player_profiles(last_activity DESC);

-- Skill Demonstrations Table
-- Tracks each individual skill demonstration through choices
CREATE TABLE IF NOT EXISTS skill_demonstrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    scene_id TEXT NOT NULL,
    choice_text TEXT,
    context TEXT,
    demonstrated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Foreign key to player profile
    CONSTRAINT fk_skill_user
        FOREIGN KEY (user_id)
        REFERENCES player_profiles(user_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_skill_demos_user_id ON skill_demonstrations(user_id);
CREATE INDEX idx_skill_demos_skill_name ON skill_demonstrations(skill_name);
CREATE INDEX idx_skill_demos_demonstrated_at ON skill_demonstrations(demonstrated_at DESC);

-- Career Explorations Table
-- Tracks which careers a player has explored and their match scores
CREATE TABLE IF NOT EXISTS career_explorations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    career_name TEXT NOT NULL,
    match_score DECIMAL(3,2) CHECK (match_score >= 0 AND match_score <= 1),
    explored_at TIMESTAMPTZ DEFAULT NOW(),
    readiness_level TEXT CHECK (readiness_level IN ('exploratory', 'emerging', 'near_ready', 'ready')),

    -- Birmingham-specific data
    local_opportunities JSONB DEFAULT '[]'::jsonb,
    education_paths JSONB DEFAULT '[]'::jsonb,

    -- Foreign key to player profile
    CONSTRAINT fk_career_user
        FOREIGN KEY (user_id)
        REFERENCES player_profiles(user_id)
        ON DELETE CASCADE,

    -- Unique constraint: one exploration per career per user
    CONSTRAINT unique_career_exploration UNIQUE (user_id, career_name)
);

CREATE INDEX idx_career_explorations_user_id ON career_explorations(user_id);
CREATE INDEX idx_career_explorations_match_score ON career_explorations(match_score DESC);

-- Relationship Progress Table
-- Tracks trust levels and key moments with NPCs
CREATE TABLE IF NOT EXISTS relationship_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    character_name TEXT NOT NULL,
    trust_level INTEGER DEFAULT 0 CHECK (trust_level >= 0 AND trust_level <= 10),
    last_interaction TIMESTAMPTZ DEFAULT NOW(),
    key_moments JSONB DEFAULT '[]'::jsonb,

    -- Foreign key to player profile
    CONSTRAINT fk_relationship_user
        FOREIGN KEY (user_id)
        REFERENCES player_profiles(user_id)
        ON DELETE CASCADE,

    -- Unique constraint: one relationship per character per user
    CONSTRAINT unique_character_relationship UNIQUE (user_id, character_name)
);

CREATE INDEX idx_relationship_progress_user_id ON relationship_progress(user_id);
CREATE INDEX idx_relationship_progress_character ON relationship_progress(character_name);

-- Platform State Table (for environmental responsiveness)
-- Tracks warmth and accessibility of different platforms
CREATE TABLE IF NOT EXISTS platform_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    platform_id TEXT NOT NULL,
    warmth INTEGER DEFAULT 0 CHECK (warmth >= 0 AND warmth <= 100),
    accessible BOOLEAN DEFAULT TRUE,
    discovered BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Foreign key to player profile
    CONSTRAINT fk_platform_user
        FOREIGN KEY (user_id)
        REFERENCES player_profiles(user_id)
        ON DELETE CASCADE,

    -- Unique constraint: one state per platform per user
    CONSTRAINT unique_platform_state UNIQUE (user_id, platform_id)
);

CREATE INDEX idx_platform_states_user_id ON platform_states(user_id);

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply auto-update trigger to player_profiles
CREATE TRIGGER update_player_profiles_updated_at
    BEFORE UPDATE ON player_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply auto-update trigger to platform_states
CREATE TRIGGER update_platform_states_updated_at
    BEFORE UPDATE ON platform_states
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- For now, allow all operations (will be refined with authentication)
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_demonstrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_explorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_states ENABLE ROW LEVEL SECURITY;

-- Temporary permissive policies (replace with proper auth later)
CREATE POLICY "Allow all operations on player_profiles" ON player_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on skill_demonstrations" ON skill_demonstrations FOR ALL USING (true);
CREATE POLICY "Allow all operations on career_explorations" ON career_explorations FOR ALL USING (true);
CREATE POLICY "Allow all operations on relationship_progress" ON relationship_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations on platform_states" ON platform_states FOR ALL USING (true);

-- Grant access to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

COMMENT ON TABLE player_profiles IS 'Core player information and current game state';
COMMENT ON TABLE skill_demonstrations IS 'Individual skill demonstrations through narrative choices';
COMMENT ON TABLE career_explorations IS 'Career paths explored with Birmingham-specific opportunities';
COMMENT ON TABLE relationship_progress IS 'Trust progression with NPCs (Samuel, Maya, Devon, Jordan)';
COMMENT ON TABLE platform_states IS 'Environmental responsiveness - platform warmth and accessibility';
