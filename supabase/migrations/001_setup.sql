-- ============================================================================
-- Migration 001: Auth + Core Schema Setup (Consolidated)
-- ============================================================================
-- Purpose: Single source for auth profiles + core gameplay tables
-- ============================================================================

-- =====================================================
-- 1) Supabase Auth Setup for Lux Story
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'educator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile (not role)" ON public.profiles;
CREATE POLICY "Users can update own profile (not role)"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE OR REPLACE FUNCTION public.is_educator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role IN ('educator', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- =====================================================
-- 2) Core Gameplay Schema
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS player_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    current_scene TEXT,
    total_demonstrations INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    game_version TEXT DEFAULT '2.0',
    platform TEXT DEFAULT 'web',
    CONSTRAINT user_id_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_player_profiles_last_activity ON player_profiles(last_activity DESC);

CREATE TABLE IF NOT EXISTS skill_demonstrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    scene_id TEXT NOT NULL,
    choice_text TEXT,
    context TEXT,
    demonstrated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_skill_user
        FOREIGN KEY (user_id)
        REFERENCES player_profiles(user_id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_skill_demos_user_id ON skill_demonstrations(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_demos_skill_name ON skill_demonstrations(skill_name);
CREATE INDEX IF NOT EXISTS idx_skill_demos_demonstrated_at ON skill_demonstrations(demonstrated_at DESC);

CREATE TABLE IF NOT EXISTS career_explorations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    career_name TEXT NOT NULL,
    match_score DECIMAL(3,2) CHECK (match_score >= 0 AND match_score <= 1),
    explored_at TIMESTAMPTZ DEFAULT NOW(),
    readiness_level TEXT CHECK (readiness_level IN ('exploratory', 'emerging', 'near_ready', 'ready')),
    local_opportunities JSONB DEFAULT '[]'::jsonb,
    education_paths JSONB DEFAULT '[]'::jsonb,
    CONSTRAINT fk_career_user
        FOREIGN KEY (user_id)
        REFERENCES player_profiles(user_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_career_exploration UNIQUE (user_id, career_name)
);

CREATE INDEX IF NOT EXISTS idx_career_explorations_user_id ON career_explorations(user_id);
CREATE INDEX IF NOT EXISTS idx_career_explorations_match_score ON career_explorations(match_score DESC);

CREATE TABLE IF NOT EXISTS relationship_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    character_name TEXT NOT NULL,
    trust_level INTEGER DEFAULT 0 CHECK (trust_level >= 0 AND trust_level <= 10),
    last_interaction TIMESTAMPTZ DEFAULT NOW(),
    key_moments JSONB DEFAULT '[]'::jsonb,
    CONSTRAINT fk_relationship_user
        FOREIGN KEY (user_id)
        REFERENCES player_profiles(user_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_character_relationship UNIQUE (user_id, character_name)
);

CREATE INDEX IF NOT EXISTS idx_relationship_progress_user_id ON relationship_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_relationship_progress_character ON relationship_progress(character_name);

CREATE TABLE IF NOT EXISTS platform_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    platform_id TEXT NOT NULL,
    warmth INTEGER DEFAULT 0 CHECK (warmth >= 0 AND warmth <= 100),
    accessible BOOLEAN DEFAULT TRUE,
    discovered BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_platform_user
        FOREIGN KEY (user_id)
        REFERENCES player_profiles(user_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_platform_state UNIQUE (user_id, platform_id)
);

CREATE INDEX IF NOT EXISTS idx_platform_states_user_id ON platform_states(user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_player_profiles_updated_at ON player_profiles;
CREATE TRIGGER update_player_profiles_updated_at
    BEFORE UPDATE ON player_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_platform_states_updated_at ON platform_states;
CREATE TRIGGER update_platform_states_updated_at
    BEFORE UPDATE ON platform_states
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_demonstrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_explorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on player_profiles" ON player_profiles;
DROP POLICY IF EXISTS "Allow all operations on skill_demonstrations" ON skill_demonstrations;
DROP POLICY IF EXISTS "Allow all operations on career_explorations" ON career_explorations;
DROP POLICY IF EXISTS "Allow all operations on relationship_progress" ON relationship_progress;
DROP POLICY IF EXISTS "Allow all operations on platform_states" ON platform_states;
CREATE POLICY "Allow all operations on player_profiles" ON player_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on skill_demonstrations" ON skill_demonstrations FOR ALL USING (true);
CREATE POLICY "Allow all operations on career_explorations" ON career_explorations FOR ALL USING (true);
CREATE POLICY "Allow all operations on relationship_progress" ON relationship_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations on platform_states" ON platform_states FOR ALL USING (true);

GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

COMMENT ON TABLE player_profiles IS 'Core player information and current game state';
COMMENT ON TABLE skill_demonstrations IS 'Individual skill demonstrations through narrative choices';
COMMENT ON TABLE career_explorations IS 'Career paths explored with Birmingham-specific opportunities';
COMMENT ON TABLE relationship_progress IS 'Trust progression with NPCs (Samuel, Maya, Devon, Jordan)';
COMMENT ON TABLE platform_states IS 'Environmental responsiveness - platform warmth and accessibility';
