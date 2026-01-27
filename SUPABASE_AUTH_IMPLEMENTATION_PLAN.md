# Supabase Auth Implementation Plan

## Overview
Implement role-based access control for God Mode using Supabase Auth.
This plan is adapted for the current codebase state (Next.js 15, `@supabase/ssr` already present).

**Auth Methods:**
- ✅ Google OAuth (primary - educators have Gmail)
- ✅ Magic Link (backup - passwordless email)
- ❌ GitHub (skip - not relevant for educators)

**Roles:**
- `student` (default) - Normal gameplay, no God Mode
- `educator` - God Mode access, can demonstrate features
- `admin` - God Mode + user management dashboard

---

## Phase 1: Database Setup (30 minutes)

### 1.1 Enable Auth Providers in Supabase Dashboard

**Navigate to**: Supabase Dashboard → Authentication → Providers

**Enable:**
1. **Email (Magic Link)**
   - Toggle "Enable Email provider" ON
   - Toggle "Confirm email" OFF (for easier onboarding)
   - Save

2. **Google OAuth**
   - Toggle "Google enabled" ON
   - Get credentials from Google Cloud Console:
     ```
     1. Go to https://console.cloud.google.com
     2. Create new project "Lux Story"
     3. Enable Google+ API
     4. Create OAuth 2.0 credentials
     5. Add authorized redirect URI:
        https://[your-project-ref].supabase.co/auth/v1/callback
     6. Copy Client ID and Client Secret
     ```
   - Paste into Supabase
   - Save

### 1.2 Database Schema

**Run in Supabase SQL Editor:**

```sql
-- 1. Create profiles table with role
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'educator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Anyone can read their own profile
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Only allow role changes from admin
CREATE POLICY "Users cannot change their own role"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 5. Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger first to avoid conflicts on re-run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Create your first admin user (REPLACE with your email)
-- Run this AFTER you sign up for the first time:
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'your-email@example.com';
```

---

## Phase 2: Codebase Cleanup (15 minutes)

### 2.1 Dependencies
The project currently has both `@supabase/auth-helpers-nextjs` and `@supabase/ssr`. We will consolidate.

```bash
npm uninstall @supabase/auth-helpers-nextjs
npm install @supabase/ssr
```

### 2.2 Verify Existing Files
*Checked: 2026-01-27*
- `lib/supabase/client.ts`: ✅ Correctly uses `createBrowserClient`.
- `lib/supabase/server.ts`: ✅ Correctly uses `createServerClient` and awaits `cookies()` (Next.js 15 compatible).
- `lib/supabase/middleware.ts`: ✅ Correctly implements session refreshing.
- `middleware.ts`: ✅ Correctly calls `updateSession`.

**Action**: No file creation needed for Supabase clients. Proceed to Auth UI.

---

## Phase 3: Auth UI Components (2 hours)

### 3.1 Login Modal Component

**File**: `components/auth/LoginModal.tsx` (NEW)

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Chrome } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for the login link!')
    }

    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to Lux Story</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Google Sign-In */}
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Magic Link */}
          <form onSubmit={handleMagicLink} className="space-y-2">
            <Input
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>

          {message && (
            <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### 3.2 Auth Callback Route

**File**: `app/auth/callback/route.ts` (NEW)

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // Note: createClient() is async in our codebase (Next.js 15)
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to home page after successful login
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
```

### 3.3 User Role Hook

**File**: `hooks/useUserRole.ts` (NEW)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export type UserRole = 'student' | 'educator' | 'admin'

export function useUserRole() {
  const [role, setRole] = useState<UserRole>('student')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setLoading(false)
        return
      }

      setUser(session.user)

      // Get user profile with role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      setRole(profile?.role || 'student')
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user)

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()

        setRole(profile?.role || 'student')
      } else {
        setUser(null)
        setRole('student')
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    isEducator: role === 'educator' || role === 'admin',
    isAdmin: role === 'admin'
  }
}
```

---

## Phase 4: Update God Mode Components (30 minutes)

### 4.1 Update GodModeBootstrap

**File**: `components/GodModeBootstrap.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { useUserRole } from '@/hooks/useUserRole'

export function GodModeBootstrap() {
  const { isEducator, loading } = useUserRole()

  useEffect(() => {
    if (loading) return

    // Load God Mode if:
    // 1. Development mode (always)
    // 2. Production with educator/admin role
    const shouldLoadGodMode = process.env.NODE_ENV === 'development' || isEducator

    if (!shouldLoadGodMode) {
      return
    }

    // Lazy load God Mode API
    import('@/lib/dev-tools').then(({ createGodModeAPI }) => {
      (window as any).godMode = createGodModeAPI()
      // ... logging ...
    }).catch(err => {
      console.error('[God Mode] Failed to load:', err)
    })
  }, [isEducator, loading])

  return null
}
```

### 4.2 Update Journal Component

**File**: `components/Journal.tsx`

Update to use `useUserRole` instead of checking URL params for the God Mode tab visibility.

---

## Phase 5: User Menu & Admin Dashboard (2 hours)

### 5.1 User Menu Component

**File**: `components/auth/UserMenu.tsx` (NEW)
*Standard dropdown implementation using shadcn/ui or simple buttons.*

### 5.2 Admin Dashboard

**File**: `app/admin/page.tsx` (NEW)
**File**: `components/admin/UserManagementTable.tsx` (NEW)

*Implementation details unchanged from previous version, but ensure `createClient()` is awaited in Server Components.*

---

## Phase 6: Integration (15 minutes)

**File**: `components/StatefulGameInterface.tsx`

Insert `UserMenu` into the header. Note: This file is a large monolith. Search for the "Header Controls" section (usually `div className="absolute top-4 right-4 ..."` or similar).

---

## Phase 7: Automated Testing (NEW)

### 7.1 Setup

Ensure `playwright.config.ts` is configured for local web server.

### 7.2 Auth Test Spec

**File**: `tests/e2e/auth.spec.ts` (NEW)

```typescript
import { test, expect } from '@playwright/test';

test('auth flow - magic link UI', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /user/i }).click(); // Open login modal
  
  const emailInput = page.getByPlaceholder('your-email@example.com');
  await expect(emailInput).toBeVisible();
  
  await emailInput.fill('test@example.com');
  await page.getByRole('button', { name: /send magic link/i }).click();
  
  await expect(page.getByText(/check your email/i)).toBeVisible();
});

// Note: Full E2E auth testing often requires a specific Supabase test helper or specialized mock. 
// For now, we verify the UI exists.
```

---

## Phase 8: Future Scope (Cloud Save)

**Note:** This plan **only** covers Access Control (RBAC). It does **not** implement:
1.  Saving game state (Zustand) to Supabase.
2.  Syncing progress across devices.

Game state remains in `localStorage` for now.
**Future Phase:** Create `lib/game-persistence-cloud.ts` to sync `game-store` with a new `save_states` table in Supabase.

---

## Summary of Changes from v1 Plan
1.  **Next.js 15 Compliance**: Explicitly noted `await cookies()` and async `createClient()` usage.
2.  **Existing Code**: Leverage `lib/supabase/*` files that already exist; skip redundant creation.
3.  **Dependency Clean**: Remove deprecated `auth-helpers`.
4.  **Testing**: Added Phase 7.
5.  **Scope**: Clarified Cloud Save exclusion.