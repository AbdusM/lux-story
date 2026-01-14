# Security Implementation Guide

## Overview
This document outlines the security measures implemented in the Grand Central Terminus application.

## Authentication & Authorization

### Admin Dashboard Protection
- **Location**: `/app/admin/*` routes
- **Middleware**: `/middleware.ts`
- **Authentication Method**: Secure HTTP-only cookies with token-based auth
- **Login Page**: `/app/admin/login`

#### How It Works
1. Users must authenticate at `/admin/login`
2. Password verified against `ADMIN_API_TOKEN` environment variable
3. On success, HTTP-only cookie set with token
4. Middleware checks cookie on all `/admin/*` routes
5. Unauthorized users redirected to login page

#### Setup
```bash
# Generate secure admin token
openssl rand -base64 32

# Add to .env.local
ADMIN_API_TOKEN=<generated_token>
```

## Row Level Security (RLS)

### Database Policies
- **Migration**: `/supabase/migrations/008_fix_rls_policies.sql`
- **Policy Type**: User-scoped using session variables
- **Implementation**: `current_setting('app.current_user_id', true)`

### Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| player_profiles | Own data | Own data | Own data | ❌ |
| skill_demonstrations | Own data | Own data | ❌ | ❌ |
| career_explorations | Own data | Own data | Own data | ❌ |
| relationship_progress | Own data | Own data | Own data | ❌ |
| platform_states | Own data | Own data | Own data | ❌ |

### Using RLS in API Routes
```typescript
import { createClient } from '@supabase/supabase-js'

// For user operations (respects RLS)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Set user context before queries
await supabase.rpc('set_current_user_id', { p_user_id: userId })

// For admin operations (bypasses RLS)
const adminClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role bypasses RLS
)
```

## Rate Limiting

### Implementation
- **Utility**: `/lib/rate-limit.ts`
- **Type**: In-memory token bucket
- **Cleanup**: Automatic LRU eviction

### Applied To
1. **Admin Login**: 5 attempts per 15 minutes per IP
2. **Career Explorations**: 30 requests per minute per IP
3. **User Profile Creation**: (Add as needed)

### Usage
```typescript
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  try {
    await limiter.check(ip, 30) // 30 requests per interval
  } catch {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }

  // Process request...
}
```

## Environment Variable Security

### Public vs Private Variables

#### ✅ SAFE for Client (NEXT_PUBLIC_)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  # Has RLS restrictions
```

#### ❌ SERVER-SIDE ONLY (Never use NEXT_PUBLIC_)
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Bypasses RLS
ADMIN_API_TOKEN=your-secure-token
GEMINI_API_KEY=your-api-key
ANTHROPIC_API_KEY=your-api-key
```

### Best Practices
1. **Never commit real credentials** to version control
2. **Use `.env.example`** with placeholders
3. **Server-side API routes** should NEVER use `NEXT_PUBLIC_` for sensitive operations
4. **Rotate tokens regularly** (every 90 days recommended)

## Secrets Management

### What to Keep Secret
- ❌ Service Role Keys (bypasses all security)
- ❌ Admin API Tokens
- ❌ Third-party API keys (Gemini, Anthropic)
- ❌ Database passwords
- ✅ Anon keys (safe to expose, RLS protected)
- ✅ Public URLs

### Rotation Procedure
1. Generate new token: `openssl rand -base64 32`
2. Update production environment variables
3. Deploy application
4. Verify new token works
5. Revoke old token in Supabase dashboard

## HTTPS & Transport Security

### Production Requirements
- ✅ All traffic over HTTPS (enforced by Cloudflare Pages)
- ✅ HTTP-only cookies (prevents XSS access)
- ✅ SameSite=Strict cookies (prevents CSRF)
- ✅ Secure cookie flag in production

### Cookie Configuration
```typescript
response.cookies.set('admin_auth_token', token, {
  httpOnly: true, // Prevents JavaScript access
  secure: process.env.NODE_ENV === 'production', // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
})
```

## IP Detection & Proxy Headers

### Supported Headers (in priority order)
1. `cf-connecting-ip` (Cloudflare)
2. `x-real-ip` (Nginx)
3. `x-forwarded-for` (General proxy)

### Usage
```typescript
import { getClientIp } from '@/lib/rate-limit'

const ip = getClientIp(request)
// Returns: "192.168.1.1" or "unknown"
```

## Security Checklist

### Before Production Deployment

- [ ] All real credentials removed from documentation
- [ ] `.env.example` has placeholders only
- [ ] `ADMIN_API_TOKEN` is strong (32+ characters)
- [ ] Service role key is NOT exposed to client
- [ ] RLS policies tested for data isolation
- [ ] Rate limiting enabled on all public endpoints
- [ ] HTTPS enforced (automatic with Cloudflare)
- [ ] Admin routes require authentication
- [ ] Session cookies are HTTP-only and Secure
- [ ] Database backups configured in Supabase
- [ ] Error messages don't leak sensitive info

### Monitoring

#### Log What Matters
```typescript
// ✅ Good - No sensitive data
console.log('[Admin API] User authenticated successfully')

// ❌ Bad - Logs sensitive token
console.log('[Admin API] Token:', adminToken)
```

#### Watch For
- Repeated failed login attempts (potential brute force)
- High rate limit rejections (potential abuse)
- Database errors (potential injection attempts)
- Unauthorized access attempts to admin routes

## Incident Response

### If Credentials Compromised

1. **Immediately rotate** in Supabase Dashboard → Settings → API
2. **Update environment variables** in Cloudflare Pages
3. **Redeploy application**
4. **Review access logs** in Supabase → Logs
5. **Verify no unauthorized data access**
6. **Document incident** and timeline

### Emergency Contacts
- Supabase Support: https://supabase.com/dashboard/support
- Cloudflare Support: https://dash.cloudflare.com/

## Additional Resources

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
