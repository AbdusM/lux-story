-- =====================================================
-- Supabase Auth Setup for Lux Story
-- =====================================================
-- Creates profiles table with role-based access control
-- Roles: student (default), educator, admin
--
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tavalvqcebosfxamuvlx/editor
-- =====================================================

-- ==================
-- 1. PROFILES TABLE
-- ==================

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'educator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ==================
-- 2. AUTO-UPDATE TRIGGER
-- ==================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before any update
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==================
-- 3. AUTO-CREATE PROFILE TRIGGER
-- ==================

-- Function to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'student' -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own profile (but NOT role)
-- This policy checks that the role hasn't changed
CREATE POLICY "Users can update own profile (not role)"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
  );

-- Policy: Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update any profile (including role)
CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Service role can do anything (for migrations/admin operations)
-- This is automatically handled by Supabase service_role key

-- ==================
-- 5. HELPER FUNCTIONS
-- ==================

-- Function to check if current user is educator or admin
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

-- Function to check if current user is admin
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

-- Function to get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================
-- 6. GRANT PERMISSIONS
-- ==================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on profiles table
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon; -- For public profile views (if needed)

-- ==================
-- 7. INITIAL DATA (OPTIONAL)
-- ==================

-- Uncomment to create initial admin user
-- Replace 'your-email@example.com' with your actual email
-- You'll need to sign up first, then run this to promote yourself to admin

-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'your-email@example.com';

-- ==================
-- MIGRATION COMPLETE
-- ==================
--
-- Next steps:
-- 1. Enable Google OAuth in Supabase Dashboard:
--    Authentication > Providers > Google > Enable
-- 2. Enable Magic Link (Email) in Supabase Dashboard:
--    Authentication > Providers > Email > Enable
-- 3. Configure site URL in Supabase Dashboard:
--    Authentication > URL Configuration
--    - Site URL: https://lux-story.vercel.app (or your domain)
--    - Redirect URLs: https://lux-story.vercel.app/auth/callback
--                      http://localhost:3005/auth/callback
--
