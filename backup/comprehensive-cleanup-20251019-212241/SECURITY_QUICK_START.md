# Security Quick Start Guide

**For Birmingham Educators & Administrators**

## Admin Dashboard Access (New!)

The admin dashboard at `/admin` is now protected with authentication.

### First Time Setup

1. **Get your admin password** from your program coordinator
2. **Navigate to** `/admin` in your browser
3. **You'll be redirected** to the login page
4. **Enter the password** and click Login
5. **You're in!** Your session lasts 7 days

### Troubleshooting

**"Too many login attempts"**
- Wait 15 minutes and try again
- This protects against unauthorized access

**"Authentication not configured"**
- Contact your program coordinator
- Admin token may not be set in environment

**Logged out unexpectedly**
- Sessions expire after 7 days for security
- Just log in again with the same password

---

## For Developers

### Local Development Setup

```bash
# 1. Generate admin token
openssl rand -base64 32

# 2. Add to .env.local
ADMIN_API_TOKEN=<your_generated_token>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<from_supabase_dashboard>

# 3. Run migrations
npx supabase db push

# 4. Start dev server
npm run dev

# 5. Navigate to http://localhost:3003/admin
# Login with the token you generated
```

### Production Deployment

```bash
# 1. In Cloudflare Pages Dashboard
#    Settings → Environment Variables → Production

ADMIN_API_TOKEN=<secure_token_here>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# 2. Redeploy application

# 3. Test login at yourdomain.com/admin
```

### Testing Authentication

```bash
# Test 1: Protected route
curl https://yourdomain.com/admin
# Expected: Redirect to /admin/login

# Test 2: Login
curl -X POST https://yourdomain.com/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"your-token"}'
# Expected: {"success":true} + Set-Cookie header

# Test 3: Rate limiting
# Make 6 login attempts quickly
# Expected: 6th attempt returns 429 Rate Limited
```

---

## Security Features Implemented

### ✅ Admin Authentication
- Password-based login with secure tokens
- HTTP-only cookies (JavaScript can't access)
- 7-day session expiration
- Automatic redirect for unauthorized users

### ✅ Rate Limiting
- **Admin login**: 5 attempts per 15 minutes per IP
- **API endpoints**: 30 requests per minute per IP
- Prevents brute force attacks and abuse

### ✅ Row Level Security
- Users can only access their own data
- Database enforces isolation at the row level
- Admin operations use service role (bypasses RLS)

### ✅ Secure Environment Variables
- Sensitive keys never exposed to client
- Service role key server-side only
- Clear separation of public vs private variables

---

## Common Tasks

### Rotate Admin Password

```bash
# 1. Generate new token
openssl rand -base64 32

# 2. Update environment variables (Cloudflare/local)
ADMIN_API_TOKEN=<new_token>

# 3. Redeploy application

# 4. Notify all admin users of new password
```

### Add New Admin User

Simply share the `ADMIN_API_TOKEN` value with them.
All admins use the same password (for now).

**Future**: Individual accounts with role-based access control

### Revoke Admin Access

1. Generate new token: `openssl rand -base64 32`
2. Update `ADMIN_API_TOKEN` in environment
3. Redeploy application
4. Old token immediately invalid

---

## Need Help?

- **Detailed docs**: `/SECURITY.md`
- **Implementation summary**: `/SECURITY_IMPLEMENTATION_SUMMARY.md`
- **Questions**: Contact your program coordinator

---

## Security Best Practices

### ✅ DO
- Keep admin password secure and private
- Log out when using shared computers
- Rotate admin token every 90 days
- Report suspicious login attempts

### ❌ DON'T
- Share admin password publicly
- Commit admin token to version control
- Use same password for multiple services
- Access admin dashboard on public WiFi without VPN

---

**Questions or Issues?**
Contact your Birmingham Career Exploration program coordinator.
