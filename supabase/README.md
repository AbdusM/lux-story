# Supabase Database Setup Guide
**Grand Central Terminus - Birmingham Career Exploration**

## Overview
This directory contains database migrations and setup instructions for integrating Supabase as the persistent storage backend for Grand Central Terminus.

## Prerequisites
- Supabase project created at https://supabase.com
- Project credentials added to `.env.local`

## Database Schema
The schema includes 5 core tables:

### 1. `player_profiles`
Stores core player information and current game state
- `user_id`: Unique player identifier
- `current_scene`: Last scene visited
- `total_demonstrations`: Total skill demonstrations
- `last_activity`: Last interaction timestamp

### 2. `skill_demonstrations`
Tracks each individual skill demonstration through narrative choices
- Links to WEF 2030 Skills Framework
- Preserves exact choice text and context
- Enables evidence-based analytics

### 3. `career_explorations`
Tracks career paths explored with Birmingham-specific opportunities
- Match scores (0.0 - 1.0)
- Readiness levels (exploratory, emerging, near_ready, ready)
- Birmingham local opportunities (UAB, Innovation Depot, etc.)
- Education pathways

### 4. `relationship_progress`
Trust progression with NPCs (Samuel, Maya, Devon, Jordan)
- Trust level (0-10)
- Key moments (JSONB array)
- Last interaction timestamp

### 5. `platform_states`
Environmental responsiveness - platform warmth and accessibility
- Warmth level (0-100)
- Discovered/accessible flags
- Enables Phase 3: Environmental Responsiveness

## Installation Steps

### Step 1: Get Supabase Credentials
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy the following values:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key (long JWT token)

### Step 2: Update Environment Variables
Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### Step 3: Run Database Migration
**Option A: Supabase Dashboard (Recommended)**
1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT_REF
2. Click "SQL Editor" in left sidebar
3. Click "New query"
4. Copy contents of `migrations/001_initial_schema.sql`
5. Paste into SQL editor
6. Click "Run"

**Option B: Command Line (requires network access)**
```bash
PGPASSWORD='your_database_password' psql \
  -h db.YOUR_PROJECT_REF.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  -f supabase/migrations/001_initial_schema.sql
```

**Option C: Supabase CLI**
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### Step 4: Verify Setup
Run this query in SQL Editor to verify tables were created:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'player_profiles',
    'skill_demonstrations',
    'career_explorations',
    'relationship_progress',
    'platform_states'
  );
```

You should see all 5 tables listed.

## Migration from localStorage

### Current State (Phase 2)
- All data stored in browser localStorage
- `safe-storage.ts` provides SSR-compatible wrappers
- Works offline, no backend required

### Future State (Phase 3+)
- Supabase as primary data store
- localStorage as offline cache/fallback
- Real-time admin dashboard updates
- Cross-device progress sync

### Migration Strategy
1. **Phase 3.1**: Dual-write mode
   - Write to both localStorage AND Supabase
   - Read from localStorage (faster)
   - Validate data consistency

2. **Phase 3.2**: Gradual migration
   - New users: Supabase-first
   - Existing users: Migrate on next session
   - Maintain localStorage fallback

3. **Phase 3.3**: Supabase-primary
   - Read from Supabase
   - localStorage as offline cache
   - Sync on reconnect

## Security Notes

### Row Level Security (RLS)
Current migration has permissive policies for development:
```sql
CREATE POLICY "Allow all operations" ON table_name FOR ALL USING (true);
```

**TODO for Production:**
- Implement proper authentication
- Restrict access based on user_id
- Add admin-only policies for sensitive data

### API Keys
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Safe to expose (client-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Never expose (server-side only)
- RLS policies protect data even with public anon key

## Troubleshooting

### Migration fails with "relation already exists"
Tables were already created. This is safe to ignore, or drop tables first:
```sql
DROP TABLE IF EXISTS platform_states CASCADE;
DROP TABLE IF EXISTS relationship_progress CASCADE;
DROP TABLE IF EXISTS career_explorations CASCADE;
DROP TABLE IF EXISTS skill_demonstrations CASCADE;
DROP TABLE IF EXISTS player_profiles CASCADE;
```

### Cannot connect to database
- Verify project is not paused (Supabase auto-pauses after inactivity)
- Check credentials in `.env.local`
- Ensure network connectivity

### RLS prevents data access
- Check that policies exist: `SELECT * FROM pg_policies;`
- Verify anon role has permissions
- Temporarily disable RLS for testing: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`

## Next Steps
1. Get actual `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase dashboard
2. Run migration via SQL Editor
3. Test connection with a simple query
4. Implement dual-write mode in Phase 3
5. Build admin dashboard real-time features

## Resources
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
