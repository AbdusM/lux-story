# Admin API Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Admin API Token (for authentication)
ADMIN_API_TOKEN=3f52086db613f78c1db6daff10557ebd6d3deed456f6ba151092c42567095b34

# Supabase Service Role Key (for admin database access)
# Get from: https://supabase.com/dashboard → Your Project → Settings → API → service_role
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Getting Your Supabase Service Role Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`tavalvqcebosfxamuvlx`)
3. Navigate to **Settings** → **API**
4. Copy the `service_role` key (NOT the `anon` key)
5. Add to `.env.local` as shown above

**⚠️ SECURITY WARNING**: The service role key bypasses Row Level Security and grants full database access. NEVER commit this to git or expose to client-side code.

## Testing the Admin API

After adding the environment variables:

```bash
# Run the test suite
npx tsx scripts/test-admin-api.ts
```

Expected output:
```
✅ ALL TESTS PASSED (4/4)
```

## API Endpoints

### GET /api/admin/urgency

Fetch urgent students with Glass Box narratives.

**Request:**
```bash
curl http://localhost:3000/api/admin/urgency?level=all&limit=50 \
  -H "Authorization: Bearer 3f52086db613f78c1db6daff10557ebd6d3deed456f6ba151092c42567095b34"
```

**Response:**
```json
{
  "students": [
    {
      "userId": "player-123",
      "urgencyLevel": "critical",
      "urgencyScore": 0.82,
      "urgencyNarrative": "Urgency level is CRITICAL (82%). CRITICAL: Student has been inactive for 9 days. Strong confusion signals: 15 choices made but only 3 scenes explored (stuck pattern). RECOMMENDED ACTION: Immediate outreach required. Primary factors: severe disengagement, navigation confusion.",
      "currentScene": "maya-intro",
      "lastActivity": "2025-09-21T14:30:00Z",
      ...
    }
  ],
  "count": 1,
  "timestamp": "2025-09-30T12:00:00Z"
}
```

### POST /api/admin/urgency

Trigger urgency recalculation for all players.

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/urgency \
  -H "Authorization: Bearer 3f52086db613f78c1db6daff10557ebd6d3deed456f6ba151092c42567095b34" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "message": "Urgency calculation complete: 42 players processed",
  "playersProcessed": 42,
  "timestamp": "2025-09-30T12:05:00Z"
}
```

## Query Parameters

**GET /api/admin/urgency**

- `level`: Filter by urgency level
  - `all` (default) - All students
  - `critical` - Only critical urgency
  - `high` - Only high urgency
  - `medium` - Only medium urgency
  - `low` - Only low urgency

- `limit`: Max students to return (1-200, default: 50)

**Examples:**
```bash
# Get top 10 critical students
curl "http://localhost:3000/api/admin/urgency?level=critical&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get all high/critical students
curl "http://localhost:3000/api/admin/urgency?level=high" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Authentication

All admin endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer 3f52086db613f78c1db6daff10557ebd6d3deed456f6ba151092c42567095b34
```

Without authentication, requests will receive:
```json
{
  "error": "Unauthorized - Admin access required"
}
```

## Future Improvements

The current Bearer token authentication is sufficient for the pilot program (internal network, ~3 admin users). Before production:

- [ ] Implement OAuth/JWT with Supabase Auth
- [ ] Add admin role claims to user tokens
- [ ] Implement rate limiting
- [ ] Add audit logging for admin actions
- [ ] Set up admin user management UI
