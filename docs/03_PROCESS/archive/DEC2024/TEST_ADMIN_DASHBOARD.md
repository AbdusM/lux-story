# Admin Dashboard Testing Guide

## Prerequisites

1. **Environment Variables**: Ensure `.env.local` has:
   ```bash
   ADMIN_API_TOKEN=your_admin_token_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

2. **Database**: Ensure Supabase has some test data (at least 1-2 student profiles)

## Testing Steps

### 1. Start Development Server

```bash
npm run dev
```

Server should start on `http://localhost:3000`

---

### 2. Test Authentication

#### 2a. Unauthenticated Access (Should Redirect)
- Navigate to: `http://localhost:3000/admin`
- **Expected**: Redirects to `/admin/login` with `?redirect=/admin`
- Navigate to: `http://localhost:3000/admin/skills?userId=test_user`
- **Expected**: Redirects to `/admin/login` with `?redirect=/admin/skills...`

#### 2b. Login Flow
- Go to: `http://localhost:3000/admin/login`
- Enter admin password (value of `ADMIN_API_TOKEN` from `.env.local`)
- Click "Login"
- **Expected**: 
  - Cookie `admin_auth_token` set in browser
  - Redirects to `/admin` dashboard
  - No redirect loop

#### 2c. Authenticated Access
- After login, navigate to `/admin`
- **Expected**: Should see student list (not redirected)
- Navigate to `/admin/skills?userId=<any_user_id>`
- **Expected**: Should load detail page (not redirected)

---

### 3. Test Performance Improvements

#### 3a. Student List Pagination
- Go to: `http://localhost:3000/admin` (while authenticated)
- **Expected Behavior**:
  - Loads first 50 students maximum
  - Loads in batches of 10 (progressively updates UI)
  - Console should show batches loading, not all at once
  - With 100+ students, should load faster than before

**Check Browser Console:**
```javascript
// Should see logs like:
// [SkillProfileAdapter] Found X users in Supabase
// Loading batch 1/5...
// Loading batch 2/5...
```

#### 3b. API Call Optimization
- Open Browser DevTools → Network tab
- Go to: `/admin/skills?userId=<some_user_id>`
- **Expected**: 
  - Single request to `/api/admin-proxy/urgency?userId=<id>` (not `?level=all&limit=200`)
  - Response should be single user object: `{ user: {...}, timestamp: "..." }`
  - Not array of 200 students

**Verify in Network Tab:**
- Request URL: Should contain `userId=` parameter
- Response: Should be `{"user": {...}}` not `{"students": [...]}`

---

### 4. Test Authentication on API Routes

#### 4a. Test Unauthenticated API Access
Open browser console and run:
```javascript
// Test urgency API without auth
fetch('/api/admin-proxy/urgency?userId=test')
  .then(r => r.json())
  .then(console.log)
// Expected: { error: "Unauthorized - Admin access required" }, status: 401

// Test skill-data API without auth
fetch('/api/admin/skill-data?userId=test')
  .then(r => r.json())
  .then(console.log)
// Expected: { error: "Unauthorized - Admin access required" }, status: 401

// Test evidence API without auth
fetch('/api/admin/evidence/test')
  .then(r => r.json())
  .then(console.log)
// Expected: { error: "Unauthorized - Admin access required" }, status: 401
```

#### 4b. Test Authenticated API Access
After logging in (cookie set), same requests should work:
```javascript
// Should succeed with proper auth cookie
fetch('/api/admin-proxy/urgency?userId=<real_user_id>')
  .then(r => r.json())
  .then(console.log)
// Expected: { user: {...}, timestamp: "..." }

fetch('/api/admin/skill-data?userId=<real_user_id>')
  .then(r => r.json())
  .then(console.log)
// Expected: { success: true, profile: {...} }
```

---

### 5. Test Single User Endpoint

#### 5a. Test Urgency Single User Lookup
```bash
# Using curl (with auth cookie from browser)
curl -H "Cookie: admin_auth_token=<your_token>" \
  "http://localhost:3000/api/admin-proxy/urgency?userId=<user_id>"

# Expected response:
# {
#   "user": {
#     "userId": "...",
#     "urgencyScore": ...,
#     "urgencyLevel": "...",
#     ...
#   },
#   "timestamp": "..."
# }
```

Or test directly on admin API (requires ADMIN_API_TOKEN header):
```bash
curl -H "Authorization: Bearer <ADMIN_API_TOKEN>" \
  "http://localhost:3000/api/admin/urgency?userId=<user_id>"
```

#### 5b. Test Fallback Behavior
- Try with invalid userId: `?userId=nonexistent_user`
- **Expected**: Returns `{ user: null }` or 404, not error

---

### 6. Verify No Regressions

#### 6a. Main Dashboard Still Works
- List shows all students (up to 50)
- Clicking student card navigates to detail page
- Cards show trust levels, patterns, current activity

#### 6b. Detail Page Still Works
- All tabs load: Urgency, Skills, Careers, Gaps, Actions, Evidence
- Urgency data displays correctly
- Skills data displays correctly
- No console errors

---

## Manual Testing Checklist

- [ ] Can access `/admin/login` without auth
- [ ] Cannot access `/admin` without auth (redirects)
- [ ] Login works with correct password
- [ ] After login, can access `/admin`
- [ ] Student list loads progressively (batches of 10)
- [ ] Student list limits to 50 max
- [ ] Detail page loads with single user urgency API call
- [ ] Network tab shows `?userId=` not `?level=all&limit=200`
- [ ] Unauthenticated API requests return 401
- [ ] Authenticated API requests succeed
- [ ] Single user endpoint returns correct format
- [ ] All tabs on detail page still work
- [ ] No console errors
- [ ] No TypeScript/build errors

---

## Automated Testing (Future)

Consider adding:
- Jest/React Testing Library for component tests
- Playwright for E2E tests (auth flow, pagination, API calls)
- API integration tests for auth middleware

---

## Troubleshooting

### Issue: "Unauthorized" even after login
- **Check**: Browser cookies - should have `admin_auth_token`
- **Fix**: Clear cookies, login again
- **Verify**: `ADMIN_API_TOKEN` in `.env.local` matches what you're entering

### Issue: Still loading all students
- **Check**: Browser console for batch loading logs
- **Verify**: Code changes in `app/admin/page.tsx` lines 41-67

### Issue: Urgency API still fetching all users
- **Check**: Network tab - request URL should have `userId=`
- **Verify**: `components/admin/SingleUserDashboard.tsx` line 383 updated

### Issue: Build errors
- Run: `npm run build` to see TypeScript errors
- Fix: Any unused variable warnings or type errors

