# Debugging Admin Dashboard Internal Server Error

## Quick Diagnostic Steps

### 1. Check Browser Console
Open DevTools (F12) → Console tab
Look for red error messages with stack traces

### 2. Check Network Tab
Open DevTools → Network tab
Refresh the page
Click on the failed request (red)
Check:
- Request URL
- Response status (500?)
- Response body (should show error details)

### 3. Check Which Route Fails

#### If `/admin` fails:
- Check if middleware redirect is working
- Try accessing `/admin/login` directly

#### If `/admin/skills?userId=X` fails:
- Check if userId parameter is missing
- Check authentication cookie is set

#### If `/api/admin-proxy/urgency` fails:
- This should now be fixed (removed localStorage calls)
- Check response body for error details

### 4. Check Environment Variables
```bash
# Check if required vars are set
echo $ADMIN_API_TOKEN
# Should not be empty
```

### 5. Common Issues Fixed

✅ **Fixed**: Removed `loadSkillProfile` and `getAllUserIds` from server routes
- These functions check `typeof window` and return early in server context
- Now using Supabase directly in server routes

✅ **Fixed**: Removed localStorage fallback from server-side code

### 6. Test Routes Manually

```bash
# Test health endpoint
curl http://localhost:3003/api/health

# Test admin auth (should redirect without cookie)
curl -v http://localhost:3003/admin

# Test urgency proxy (should return 401 without auth)
curl http://localhost:3003/api/admin-proxy/urgency
```

## If Still Failing

Please provide:
1. **Full error message** from browser console
2. **Network request details** (URL, status, response body)
3. **Which page/route** you're trying to access
4. **Browser console output** (copy/paste errors)

Then I can fix the specific issue!

