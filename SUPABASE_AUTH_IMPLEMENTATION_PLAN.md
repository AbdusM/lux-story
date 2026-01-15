# Supabase Auth Implementation Plan

## Overview
Implement role-based access control for God Mode using Supabase Auth.

**Auth Methods:**
- ✅ Google OAuth (primary - educators have Gmail)
- ✅ Magic Link (backup - passwordless email)
- ❌ GitHub (skip - not relevant for educators)

**Roles:**
- `student` (default) - Normal gameplay, no God Mode
- `educator` - God Mode access, can demonstrate features
- `admin` - God Mode + user management dashboard

---

## Phase 1: Supabase Setup (30 minutes)

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
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

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

## Phase 2: Client Setup (1 hour)

### 2.1 Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### 2.2 Environment Variables

**File**: `.env.local` (create if doesn't exist)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Get these from: Supabase Dashboard → Settings → API
```

**File**: `.env.example` (update)

```bash
# Add to existing file:

# Supabase Auth (required for user login and God Mode access control)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 2.3 Create Supabase Client

**File**: `lib/supabase/client.ts` (NEW)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**File**: `lib/supabase/server.ts` (NEW)

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

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
    const supabase = createClient()
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

      const roleLabel = process.env.NODE_ENV === 'development' ? 'Dev Mode' : 'Educator Access'
      console.warn(`⚠️ God Mode enabled (${roleLabel})`)
      console.log('%c🎮 Available Commands:', 'font-weight: bold; font-size: 14px;')
      console.log(Object.keys((window as any).godMode).sort().join(', '))
      console.log('\nType window.godMode for full API')
    }).catch(err => {
      console.error('[God Mode] Failed to load:', err)
    })
  }, [isEducator, loading])

  return null
}
```

### 4.2 Update Journal Component

**File**: `components/Journal.tsx`

```typescript
import { useUserRole } from '@/hooks/useUserRole'

export function Journal({ isOpen, onClose }: JournalProps) {
  const { isEducator, loading } = useUserRole()

  // ... existing code ...

  // Show God Mode tab if:
  // 1. Development mode (always)
  // 2. Production with educator/admin role
  const showGodMode = process.env.NODE_ENV === 'development' ||
    (!loading && isEducator)

  const tabs = showGodMode
    ? [...baseTabs, { id: 'god_mode', label: 'GOD MODE', icon: AlertTriangle }]
    : baseTabs

  // ... rest of component ...
}
```

---

## Phase 5: User Menu & Admin Dashboard (2 hours)

### 5.1 User Menu Component

**File**: `components/auth/UserMenu.tsx` (NEW)

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/hooks/useUserRole'
import { Button } from '@/components/ui/button'
import { LoginModal } from './LoginModal'
import { User, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'

export function UserMenu() {
  const { user, isAdmin, loading } = useUserRole()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (loading) {
    return <div className="h-9 w-9 animate-pulse bg-white/10 rounded-md" />
  }

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLoginModal(true)}
          className="h-9 w-9 p-0"
        >
          <User className="h-4 w-4" />
        </Button>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Shield className="h-4 w-4" />
          </Button>
        </Link>
      )}
      <Button variant="ghost" size="sm" onClick={handleSignOut} className="h-9 w-9 p-0">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

### 5.2 Admin Dashboard

**File**: `app/admin/page.tsx` (NEW)

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserManagementTable } from '@/components/admin/UserManagementTable'

export default async function AdminPage() {
  const supabase = createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Fetch all users
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <UserManagementTable users={users || []} />
    </div>
  )
}
```

**File**: `components/admin/UserManagementTable.tsx` (NEW)

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Profile = {
  user_id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

export function UserManagementTable({ users: initialUsers }: { users: Profile[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  const updateRole = async (userId: string, newRole: string) => {
    setLoading(userId)

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('user_id', userId)

    if (!error) {
      setUsers(users.map(u =>
        u.user_id === userId ? { ...u, role: newRole } : u
      ))
    }

    setLoading(null)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.user_id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.full_name || '-'}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded text-xs ${
                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                user.role === 'educator' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
            </TableCell>
            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {user.role !== 'educator' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateRole(user.user_id, 'educator')}
                    disabled={loading === user.user_id}
                  >
                    Make Educator
                  </Button>
                )}
                {user.role !== 'student' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateRole(user.user_id, 'student')}
                    disabled={loading === user.user_id}
                  >
                    Make Student
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

## Phase 6: Add Login Button to UI (15 minutes)

**File**: `components/StatefulGameInterface.tsx`

Update the header to include UserMenu:

```typescript
import { UserMenu } from '@/components/auth/UserMenu'

// In the header section (around line 3380):
<div className="flex items-center gap-2">
  <UserMenu /> {/* Add this */}

  {/* Existing buttons */}
  <Button onClick={() => setState(prev => ({ ...prev, showJournal: true }))}>
    <BookOpen className="h-4 w-4" />
  </Button>
  {/* ... rest of buttons ... */}
</div>
```

---

## Testing Checklist

### Local Testing

```bash
# 1. Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/ssr

# 2. Set up .env.local with Supabase credentials

# 3. Start dev server
npm run dev

# 4. Test login flow
- Click user icon → Login modal opens
- Click "Continue with Google" → Google OAuth flow
- Or enter email → Magic link sent

# 5. Test role check
- Sign up → Check profiles table → Should be 'student' role
- Update to 'educator' manually in Supabase
- Refresh page → God Mode tab should appear

# 6. Test admin dashboard
- Update your profile to 'admin' role
- Visit /admin → Should see user management table
- Change another user's role → Should update
```

### Production Testing

```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Update Google OAuth redirect URL
- Add production URL to Google Console
- https://your-app.vercel.app/auth/callback

# 3. Test auth flow
- Visit production site
- Sign in with Google
- Check Supabase profiles table

# 4. Promote yourself to admin
- Run SQL: UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com'

# 5. Test role assignment
- Visit /admin
- Assign educator role to test user
- Sign in as that user → Should have God Mode
```

---

## Migration from URL Parameter

**Step 1**: Deploy auth system
**Step 2**: Keep URL parameter active for 1 week (both work)
**Step 3**: Email educators: "Please create accounts"
**Step 4**: Remove URL parameter check after everyone migrated

---

## Estimated Time

| Phase | Task | Time |
|-------|------|------|
| 1 | Supabase setup | 30 min |
| 2 | Client setup | 1 hour |
| 3 | Auth UI | 2 hours |
| 4 | Update God Mode | 30 min |
| 5 | Admin dashboard | 2 hours |
| 6 | Add login button | 15 min |
| **Total** | | **~6 hours** |

---

## Security Benefits

✅ **Proper authentication** - Google OAuth + Magic Link
✅ **Role-based access** - Student/Educator/Admin permissions
✅ **Audit trail** - Track who's using God Mode
✅ **RLS policies** - Database-level security
✅ **No URL guessing** - Students can't discover access method
✅ **Scalable** - Easy to add more roles/permissions later

