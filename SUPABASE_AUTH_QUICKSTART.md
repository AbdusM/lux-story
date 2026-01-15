# Supabase Auth Quick Start Guide

**Simple email/password + Google OAuth authentication for Lux Story**

---

## 🎯 What You Get

- ✅ **Email/Password** - Traditional sign up/sign in (works immediately, no email config needed)
- ✅ **Google OAuth** - One-click sign in with Gmail (requires Google setup)
- ✅ **Role-based access** - student/educator/admin
- ✅ **God Mode for educators** - Automatic access based on role

---

## 📋 Step 1: Run Database Migration

### 1.1 Open Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/tavalvqcebosfxamuvlx/sql/new

### 1.2 Copy & Run Migration

Copy the **entire contents** of `supabase/migrations/001_auth_setup.sql` (200 lines) and paste into the SQL editor, then click **Run**.

**Expected output:**
```
Success. No rows returned
```

✅ **That's it!** Email/password auth works immediately.

---

## 🔐 Step 2: Enable Email/Password (Already Works!)

Good news: Email/password authentication is **enabled by default** in Supabase. No configuration needed!

Users can:
- Sign up with email + password (6 character minimum)
- Sign in with their credentials
- Profile auto-created with role='student'

---

## 🔑 Step 3: Enable Google OAuth (Optional)

If you want one-click Google sign-in:

### 3.1 Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project: **"Lux Story Auth"**
3. Enable **Google+ API**
4. Create OAuth credentials:
   - Type: **Web application**
   - Authorized redirect URI:
     ```
     https://tavalvqcebosfxamuvlx.supabase.co/auth/v1/callback
     ```
5. Copy **Client ID** and **Client Secret**

### 3.2 Configure in Supabase

1. Go to: https://supabase.com/dashboard/project/tavalvqcebosfxamuvlx/auth/providers
2. Click **Google** provider
3. Toggle **Enable Sign in with Google** to ON
4. Paste Client ID and Secret
5. Click **Save**

---

## 🌐 Step 4: Configure Redirect URLs

Go to: https://supabase.com/dashboard/project/tavalvqcebosfxamuvlx/auth/url-configuration

**Site URL:**
```
https://lux-story.vercel.app
```

**Redirect URLs:** (add both)
```
https://lux-story.vercel.app/auth/callback
http://localhost:3005/auth/callback
```

Click **Save**.

---

## 🧪 Step 5: Test Locally

### 5.1 Start Dev Server

```bash
npm run dev
```

Visit: http://localhost:3005

### 5.2 Test Email/Password Sign Up

1. Click **Sign In** button
2. Click "**Don't have an account? Sign up**"
3. Enter email and password (min 6 characters)
4. Click **Create Account**
5. ✅ You're signed in! Modal closes, user menu appears

### 5.3 Verify Profile Created

In Supabase SQL Editor:

```sql
SELECT * FROM profiles;
```

You should see your email with `role = 'student'`.

### 5.4 Test Sign Out & Sign In

1. Click your user menu (top right)
2. Click **Sign Out**
3. Click **Sign In** again
4. Enter same email/password
5. Click **Sign In**
6. ✅ You're back in!

### 5.5 Promote Yourself to Admin

In Supabase SQL Editor:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

Replace with your actual email.

### 5.6 Test God Mode Access

1. Refresh the page (Cmd+R)
2. Open The Prism (Journal)
3. **God Mode tab should now be visible** ✅
4. Open browser console
5. `window.godMode` should be available
6. Console shows: `⚠️ God Mode enabled (Educator Access)`

### 5.7 Test Admin Dashboard

1. Navigate to: http://localhost:3005/admin/users
2. Should see table with your user
3. Try promoting yourself to educator:
   - Click **Make Educator**
   - Role badge updates
4. Try changing back to student:
   - Click **Make Student**
   - Role badge updates

---

## 🚀 Step 6: Deploy to Production

### 6.1 Verify Environment Variables in Vercel

Already set! (You showed me earlier):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 6.2 Deploy

```bash
npm run deploy:vercel
```

Or push to `main` for auto-deploy.

### 6.3 Test on Production

1. Visit https://lux-story.vercel.app
2. Click **Sign In**
3. Test email/password sign up
4. Test Google OAuth (if configured)

---

## 🎓 Educator Onboarding Workflow

### Simple 3-Step Process

1. **Educator signs up**
   - Visit https://lux-story.vercel.app
   - Click "Sign In" → "Sign up"
   - Enter email + password
   - ✅ Account created (role: student)

2. **Admin promotes to educator**
   - Admin visits https://lux-story.vercel.app/admin/users
   - Finds educator's email in table
   - Clicks **Make Educator**
   - ✅ Role updated to educator

3. **Educator gets God Mode**
   - Educator refreshes page
   - Opens The Prism (Journal)
   - ✅ God Mode tab visible
   - ✅ `window.godMode` API available

---

## 🔒 Security Summary

### What's Protected

- ✅ Users cannot change their own role (RLS policy)
- ✅ Only admins can promote users (RLS policy)
- ✅ God Mode only loads for educators/admins
- ✅ Admin dashboard only accessible to admins
- ✅ Passwords hashed with bcrypt (Supabase default)

### Fallback Access

URL parameter `?godmode=true` still works as fallback for non-authenticated educators during transition period.

---

## 📊 Quick SQL Commands

### Check all users
```sql
SELECT email, role, created_at
FROM profiles
ORDER BY created_at DESC;
```

### Promote user to educator
```sql
UPDATE profiles
SET role = 'educator'
WHERE email = 'educator@example.com';
```

### Promote user to admin
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@example.com';
```

### Count users by role
```sql
SELECT role, COUNT(*) as count
FROM profiles
GROUP BY role;
```

---

## 🐛 Troubleshooting

### "User already registered" on sign up

**Cause:** Email already exists.

**Fix:** Click "Already have an account? Sign in" instead.

### "Invalid login credentials" on sign in

**Cause:** Wrong password or email doesn't exist.

**Fix:** Double-check email/password. If forgot password, use "Sign up" to create new account (different email).

### God Mode not appearing after role update

**Cause:** User session cached with old role.

**Fix:** Sign out and back in, or hard refresh (Cmd+Shift+R).

### "Invalid redirect URL" with Google OAuth

**Cause:** Callback URL not whitelisted.

**Fix:** Add `https://tavalvqcebosfxamuvlx.supabase.co/auth/v1/callback` to Google Cloud Console authorized redirect URIs.

---

## ✅ Success Checklist

Before sharing with educators:

- [ ] Database migration run successfully
- [ ] Email/password sign up tested
- [ ] Email/password sign in tested
- [ ] Profile auto-created on signup
- [ ] Admin account promoted via SQL
- [ ] God Mode visible for admin/educator role
- [ ] Admin dashboard accessible at `/admin/users`
- [ ] Role promotion tested via admin dashboard
- [ ] Production deployment tested
- [ ] (Optional) Google OAuth configured and tested

---

## 🎉 You're Done!

**What works now:**
- ✅ Email/password authentication (immediate, no config needed)
- ✅ Google OAuth (if you configured Step 3)
- ✅ Role-based God Mode access
- ✅ Admin dashboard for user management

**Next steps:**
- Share sign-up link with educators: https://lux-story.vercel.app
- Promote educators via `/admin/users` dashboard
- They get God Mode automatically!

---

**Questions?** Check the full setup guide: `SUPABASE_AUTH_SETUP.md`
