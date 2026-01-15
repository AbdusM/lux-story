# God Mode Access Control - Implementation Guide

## Current Solution: URL Parameter Access ✅ IMPLEMENTED

### How It Works

**Educators/Facilitators** access God Mode by adding `?godmode=true` to the URL:
```
https://lux-story.vercel.app/?godmode=true
```

**Students** use the normal URL (no God Mode):
```
https://lux-story.vercel.app
```

### What Gets Enabled

| Feature | Students (Normal URL) | Educators (?godmode=true) |
|---------|----------------------|---------------------------|
| **God Mode Tab in Journal** | ❌ Hidden | ✅ Visible |
| **Console API** (`window.godMode.*`) | ❌ Not loaded | ✅ Available |
| **All other features** | ✅ Normal gameplay | ✅ Normal gameplay |

### Benefits

✅ **Zero setup** - Just share different URLs
✅ **No authentication required** - Works immediately
✅ **No database changes** - Pure client-side check
✅ **Easy to share** - Send educators the special link
✅ **Still secure** - Students won't randomly discover it

### Drawbacks

⚠️ **URL-based** - If students discover the parameter, they can use it
⚠️ **No audit trail** - Can't track who's using God Mode
⚠️ **No granular permissions** - Everyone with URL has full access

---

## Future Solution: Supabase Auth with Roles

### When to Implement

Implement proper auth when:
1. You have 10+ educators regularly using the platform
2. You need to audit who's using God Mode
3. Students are discovering/sharing the `?godmode=true` URL
4. You want granular permissions (some educators get limited access)

### Architecture

```
┌─────────────────┐
│   User Signs Up │
│  (Supabase Auth)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Check Profile  │
│ role = 'admin'? │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    ▼         ▼
 God Mode   Normal
  Enabled   Student
```

### Implementation Steps

#### **1. Database Schema (Supabase)**

```sql
-- Add role column to profiles table
ALTER TABLE profiles
ADD COLUMN role TEXT DEFAULT 'student'
CHECK (role IN ('student', 'educator', 'admin'));

-- Create index for faster role checks
CREATE INDEX idx_profiles_role ON profiles(role);

-- RLS policy to prevent users from changing their own role
CREATE POLICY "Users cannot change their own role"
ON profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (role = (SELECT role FROM profiles WHERE user_id = auth.uid()));
```

#### **2. Server-Side Auth Check**

**File**: `app/api/auth/check-role/route.ts` (NEW)

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ role: 'student' })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({
    role: profile?.role || 'student',
    isEducator: profile?.role === 'educator' || profile?.role === 'admin',
    isAdmin: profile?.role === 'admin'
  })
}
```

#### **3. Client-Side Hook**

**File**: `hooks/useUserRole.ts` (NEW)

```typescript
import { useState, useEffect } from 'react'

export function useUserRole() {
  const [role, setRole] = useState<'student' | 'educator' | 'admin'>('student')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/check-role')
      .then(res => res.json())
      .then(data => {
        setRole(data.role)
        setLoading(false)
      })
      .catch(() => {
        setRole('student') // Fail safe
        setLoading(false)
      })
  }, [])

  return {
    role,
    loading,
    isEducator: role === 'educator' || role === 'admin',
    isAdmin: role === 'admin'
  }
}
```

#### **4. Update Journal Component**

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

#### **5. Update GodModeBootstrap**

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
      console.warn('⚠️ God Mode enabled (Educator access)')
    })
  }, [isEducator, loading])

  return null
}
```

#### **6. Admin Dashboard for Role Management**

**File**: `app/admin/users/page.tsx` (NEW)

```typescript
// Simple admin page to assign educator role
export default function UsersPage() {
  const [users, setUsers] = useState([])

  // Fetch all users
  // Show table with:
  // - Email
  // - Current role
  // - "Make Educator" button (admin only)

  return (
    <div>
      <h1>User Management</h1>
      <table>
        {/* User list with role assignment */}
      </table>
    </div>
  )
}
```

---

## Migration Path

### Phase 1: Current (URL Parameter) ✅
- **Time**: Already done
- **Access**: Share `?godmode=true` URL with educators
- **Duration**: Use until you have 10+ educators

### Phase 2: Add Sign-Up (Students Only)
- **Time**: 1-2 days
- **Goal**: Track student progress in database
- **Access**: URL parameter still works for educators

### Phase 3: Educator Accounts (Full Auth)
- **Time**: 1 week
- **Goal**: Proper role-based access control
- **Access**: URL parameter deprecated, use auth roles

---

## Recommendations

### For Now (Next 3-6 months)
✅ **Use URL parameter approach**
- Share `https://lux-story.vercel.app/?godmode=true` with Birmingham educators
- Monitor usage via analytics
- Students use normal URL

### When You See
- Students discovering/sharing the God Mode URL
- Need to track which educators are using which features
- 10+ educators needing access
- Requirement for granular permissions (some educators can't access all simulations)

### Then Implement
- Full Supabase auth with role-based access
- Admin dashboard for role management
- Audit logging for God Mode usage

---

## Security Comparison

| Approach | Security Level | Effort | Audit Trail |
|----------|---------------|---------|-------------|
| **URL Parameter** (Current) | 🟡 Medium | ✅ 5 min | ❌ No |
| **Supabase Auth Roles** | 🟢 High | ⏱️ 1 week | ✅ Yes |
| **Everyone Has Access** | 🔴 None | ✅ 1 min | ❌ No |

---

## Current Implementation Details

### Files Modified
- `components/Journal.tsx` (lines 126-134)
- `components/GodModeBootstrap.tsx` (lines 13-21)

### How to Use
**Educators:**
```
https://lux-story.vercel.app/?godmode=true
```

**Students:**
```
https://lux-story.vercel.app
```

### Testing
```bash
# Local dev (God Mode always enabled)
npm run dev
http://localhost:3005

# Test production URL parameter
# Deploy to Vercel, then visit:
https://your-app.vercel.app/?godmode=true  # Has God Mode
https://your-app.vercel.app                 # No God Mode
```

---

## Questions?

**Q: Can students guess the `?godmode=true` parameter?**
A: Unlikely unless they inspect the code or another student shares it. For Birmingham youth, this is acceptable risk for now.

**Q: What if we need it removed urgently?**
A: Just delete lines 129-130 in `Journal.tsx` and lines 16-17 in `GodModeBootstrap.tsx`. Takes 30 seconds.

**Q: Can we track who's using God Mode?**
A: Not with URL parameter approach. Need Supabase auth for that (Phase 3).

**Q: What's the recommended timeline?**
A: Use URL parameter for 3-6 months while you build proper auth system.
