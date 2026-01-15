# Supabase Authentication Setup Guide

This guide walks you through setting up Google OAuth and Magic Link authentication for Lux Story with role-based God Mode access.

---

## 🎯 Overview

**What We're Building:**
- Google OAuth (primary) - Educators sign in with Gmail
- Magic Link (backup) - Passwordless email login
- Role-based access control - student/educator/admin roles
- God Mode access - Only for educators and admins
- Admin dashboard - Manage user roles

**Implementation Status:**
✅ Code complete
⏸️ Awaiting Supabase dashboard configuration

---

## 📋 Step 1: Run Database Migration

### 1.1 Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/tavalvqcebosfxamuvlx/editor)
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### 1.2 Run Migration Script

Copy the entire contents of `supabase/migrations/001_auth_setup.sql` and paste it into the SQL editor, then click **Run**.

**What this does:**
- Creates `profiles` table with `role` column (student/educator/admin)
- Sets up Row Level Security (RLS) policies
- Creates auto-profile creation trigger (runs on user signup)
- Creates helper functions (`is_educator_or_admin()`, `is_admin()`, `get_user_role()`)
- Grants necessary permissions

**Expected output:**
```
Success. No rows returned
```

### 1.3 Verify Table Creation

```sql
SELECT * FROM profiles LIMIT 5;
```

You should see an empty table with columns: `user_id`, `email`, `full_name`, `role`, `created_at`, `updated_at`.

---

## 🔐 Step 2: Enable Google OAuth

### 2.1 Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing): **"Lux Story Auth"**
3. Enable **Google+ API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API"
   - Click **Enable**
4. Create OAuth credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Application type: **Web application**
   - Name: **"Lux Story Production"**
   - Authorized redirect URIs:
     ```
     https://tavalvqcebosfxamuvlx.supabase.co/auth/v1/callback
     ```
   - For development, also add:
     ```
     http://localhost:54321/auth/v1/callback
     ```
5. Copy the **Client ID** and **Client secret**

### 2.2 Configure in Supabase

1. Go to [Supabase Authentication Settings](https://supabase.com/dashboard/project/tavalvqcebosfxamuvlx/auth/providers)
2. Click **Google** provider
3. Toggle **Enable Sign in with Google** to ON
4. Paste your:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
5. Click **Save**

---

## 📧 Step 3: Enable Magic Link (Email)

### 3.1 Configure Email Provider

1. Go to [Supabase Authentication Settings](https://supabase.com/dashboard/project/tavalvqcebosfxamuvlx/auth/providers)
2. Scroll to **Email** provider
3. Toggle **Enable Email provider** to ON
4. **Confirm email** toggle: ON (recommended for production)
5. Click **Save**

### 3.2 Configure Email Templates (Optional)

1. Go to [Email Templates](https://supabase.com/dashboard/project/tavalvqcebosfxamuvlx/auth/templates)
2. Customize the **Magic Link** email template:
   - Update subject line: "Sign in to Lux Story"
   - Customize button text: "Sign In"
   - Update footer with your branding

---

## 🌐 Step 4: Configure Site URLs

### 4.1 Set Redirect URLs

1. Go to [Supabase Authentication Settings](https://supabase.com/dashboard/project/tavalvqcebosfxamuvlx/auth/url-configuration)
2. **Site URL**: `https://lux-story.vercel.app`
3. **Redirect URLs** (add all):
   ```
   https://lux-story.vercel.app/auth/callback
   http://localhost:3005/auth/callback
   ```
4. Click **Save**

---

## 🎨 Step 5: Add UserMenu to Interface

### 5.1 Update StatefulGameInterface.tsx

Add the UserMenu component to your main game interface header.

**File**: `components/StatefulGameInterface.tsx`

Find the header section (where Journal and Constellation buttons are) and add:

```tsx
import { UserMenu } from './auth/UserMenu'

// Inside the header section, add:
<UserMenu />
```

**Suggested location**: Top-right corner next to the existing navigation buttons.

---

## 🧪 Step 6: Test Authentication Flow

### 6.1 Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3005

### 6.2 Test Google OAuth

1. Click **Sign In** button
2. Select **Continue with Google**
3. Choose your Google account
4. Should redirect back to game with user logged in
5. Check browser console: Should see user email and role

### 6.3 Test Magic Link

1. Click **Sign In** button
2. Enter your email address
3. Click **Send Magic Link**
4. Check your email inbox
5. Click the magic link
6. Should redirect to game with user logged in

### 6.4 Verify Profile Creation

In Supabase SQL Editor:

```sql
SELECT * FROM profiles;
```

You should see your profile with `role = 'student'` (default).

### 6.5 Test God Mode Access (Student)

1. Sign in as a new user (default role: student)
2. Open The Prism (Journal)
3. **God Mode tab should NOT be visible** ❌
4. Open browser console
5. `window.godMode` should be undefined

### 6.6 Promote Yourself to Admin

In Supabase SQL Editor:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 6.7 Test God Mode Access (Admin)

1. Refresh the page (or sign out and back in)
2. Open The Prism (Journal)
3. **God Mode tab SHOULD be visible** ✅
4. Open browser console
5. `window.godMode` should be available
6. Console should show: `⚠️ God Mode enabled (Educator Access)`

### 6.8 Test Admin Dashboard

1. As an admin, navigate to: http://localhost:3005/admin/users
2. Should see table of all users
3. Test promoting a user to educator:
   - Click **Make Educator** button
   - Verify role badge updates to "educator"
4. Test demoting back to student:
   - Click **Make Student** button
   - Verify role badge updates to "student"

---

## 🚀 Step 7: Deploy to Production

### 7.1 Verify Environment Variables

In Vercel dashboard, ensure these are set:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tavalvqcebosfxamuvlx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7.2 Deploy

```bash
npm run deploy:vercel
```

Or push to `main` branch for auto-deployment.

### 7.3 Test Production

1. Visit https://lux-story.vercel.app
2. Click **Sign In**
3. Test Google OAuth flow
4. Verify God Mode access based on role

---

## 🔒 Security Checklist

Before going live with educators:

- [ ] Google OAuth credentials configured
- [ ] Redirect URLs whitelisted in Supabase
- [ ] RLS policies enabled on `profiles` table
- [ ] Email confirmation enabled (optional but recommended)
- [ ] Admin account created and tested
- [ ] God Mode only visible to educators/admins
- [ ] Production environment variables set in Vercel
- [ ] Test full authentication flow end-to-end

---

## 🎓 Educator Onboarding

### Option 1: Email Invites (Recommended)

1. Admin visits http://localhost:3005/admin/users (or https://lux-story.vercel.app/admin/users)
2. Have educator sign up first (they'll be student by default)
3. Admin promotes them to "educator" role via dashboard
4. Educator refreshes page → God Mode unlocked

### Option 2: Manual SQL Promotion

```sql
UPDATE profiles
SET role = 'educator'
WHERE email = 'educator@birmingham.edu';
```

### Option 3: URL Parameter Fallback (Temporary)

For non-authenticated educators, share:
```
https://lux-story.vercel.app/?godmode=true
```

This still works as a fallback but doesn't provide audit trail or granular permissions.

---

## 📊 Monitoring

### Check Active Users

```sql
SELECT
  email,
  role,
  created_at,
  updated_at
FROM profiles
ORDER BY created_at DESC;
```

### Check God Mode Usage (Future Enhancement)

Currently no audit logging. To add:
1. Create `god_mode_logs` table
2. Log each God Mode API call with user_id and timestamp
3. Query for analytics

---

## 🐛 Troubleshooting

### "User not found" Error

**Cause**: Profile not auto-created after signup.

**Fix**: Run migration script again (Step 1.2).

### "Invalid redirect URL" Error

**Cause**: Callback URL not whitelisted.

**Fix**: Add URL to Supabase → Authentication → URL Configuration → Redirect URLs.

### Google OAuth Shows "Error 400: redirect_uri_mismatch"

**Cause**: Google Cloud Console redirect URI doesn't match Supabase callback URL.

**Fix**: Ensure Google OAuth redirect URI is exactly:
```
https://tavalvqcebosfxamuvlx.supabase.co/auth/v1/callback
```

### God Mode Not Loading After Role Update

**Cause**: User session cached with old role.

**Fix**: Sign out and back in, or hard refresh (Cmd+Shift+R).

### Magic Link Email Not Received

**Causes**:
1. Email in spam folder
2. Supabase SMTP limits (10 emails/hour on free tier)
3. Email provider blocking Supabase emails

**Fixes**:
1. Check spam folder
2. Upgrade Supabase plan for higher limits
3. Configure custom SMTP (Supabase → Project Settings → Email)

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `supabase/migrations/001_auth_setup.sql` | Database schema, RLS policies, triggers |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server Supabase client (for API routes) |
| `lib/supabase/middleware.ts` | Session refresh middleware |
| `hooks/useUserRole.ts` | React hook for fetching user role |
| `components/auth/LoginModal.tsx` | Google OAuth + Magic Link UI |
| `components/auth/UserMenu.tsx` | Sign in/out dropdown menu |
| `app/auth/callback/route.ts` | OAuth callback handler |
| `app/admin/users/page.tsx` | Admin dashboard for user management |
| `middleware.ts` | Updated to refresh Supabase sessions |
| `components/GodModeBootstrap.tsx` | Updated to use role-based access |
| `components/Journal.tsx` | Updated to show God Mode tab based on role |

---

## 🔄 Migration Path

### Current State (URL Parameter)
- **Access**: `?godmode=true` URL parameter
- **Security**: Medium (students could discover)
- **Audit**: None
- **Timeline**: Use for next 3-6 months

### Target State (Supabase Auth)
- **Access**: Role-based (authenticated educators/admins)
- **Security**: High (database-enforced)
- **Audit**: Full user tracking
- **Timeline**: Implement when 10+ educators using platform

### Transition Plan
1. **Phase 1** (Now): Both URL parameter AND auth work
2. **Phase 2** (After onboarding): Encourage educators to sign in
3. **Phase 3** (When stable): Deprecate URL parameter, auth-only

---

## 📞 Support

**Questions?**
- Check [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- Check [Next.js App Router Auth Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)

**Blockers?**
- Post in this repo's issues
- Check Supabase dashboard logs: Project → Logs → Auth Logs

---

**Setup Complete!** 🎉

You now have role-based authentication with Google OAuth and Magic Link, plus admin tools to manage educator access to God Mode.
