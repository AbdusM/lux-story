# IP Tracking for Urban Chamber Pilot - Analysis

## Current State

**User Identification:**
- localStorage-based: `player-{timestamp}-{random}` (generated in `lib/safe-storage.ts`)
- Persists across sessions on same device/browser
- **Breaks if:** localStorage cleared, different browser, different device

**IP Infrastructure (Exists):**
- `lib/rate-limit.ts` → `getClientIp()` extracts IP from headers
- `lib/audit-logger.ts` → Can log IP in metadata
- Not currently used for user identification

---

## Problem Statement

**Urban Chamber Pilot Context:**
- 16 Birmingham graduates
- Mobile-first experience (likely switching devices)
- Need accurate participant count for success metrics

**Current Risk:**
- Student plays on phone → `player-123`
- Same student plays on laptop → `player-456` (looks like 2 participants)
- **Inflates engagement metrics** (16 graduates could appear as 20+ "users")

---

## Proposed Solution: Hybrid IP + localStorage

### Strategy

Use **IP address as a fallback** for user identification when localStorage isn't available or is suspicious.

### Implementation

**File:** `lib/user-identification.ts` (NEW)

```typescript
/**
 * User Identification for Pilot
 * Combines localStorage (primary) + IP address (fallback) for accurate pilot metrics
 */

import { safeStorage } from './safe-storage'

export interface UserIdentifier {
  userId: string           // Primary ID (localStorage-based)
  ipAddress?: string       // Secondary ID (for deduplication)
  deviceType: 'mobile' | 'desktop' | 'unknown'
  createdAt: string
}

/**
 * Get or create user identifier with IP fallback
 *
 * Priority:
 * 1. Existing localStorage ID (if valid)
 * 2. IP-based lookup (check if IP already has a userId)
 * 3. Create new userId and associate with IP
 */
export async function getUserIdentifier(ipAddress: string): Promise<UserIdentifier> {
  const existingId = safeStorage.getItem('lux-player-id')
  const deviceType = getDeviceType()

  // Case 1: Valid localStorage ID exists
  if (existingId && existingId.startsWith('player-')) {
    return {
      userId: existingId,
      ipAddress,
      deviceType,
      createdAt: getOrCreateTimestamp(existingId)
    }
  }

  // Case 2: Check if this IP already has a userId (returning user, different device)
  const ipBasedId = await lookupUserByIp(ipAddress)
  if (ipBasedId) {
    // Save this userId to localStorage for future visits
    safeStorage.setItem('lux-player-id', ipBasedId)
    return {
      userId: ipBasedId,
      ipAddress,
      deviceType,
      createdAt: getOrCreateTimestamp(ipBasedId)
    }
  }

  // Case 3: New user - create userId and associate with IP
  const newUserId = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  safeStorage.setItem('lux-player-id', newUserId)
  await associateIpWithUser(ipAddress, newUserId)

  return {
    userId: newUserId,
    ipAddress,
    deviceType,
    createdAt: new Date().toISOString()
  }
}

function getDeviceType(): 'mobile' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown'

  const userAgent = window.navigator.userAgent.toLowerCase()
  const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

  return isMobile ? 'mobile' : 'desktop'
}

function getOrCreateTimestamp(userId: string): string {
  // Extract timestamp from userId (player-{timestamp}-{random})
  const match = userId.match(/player-(\d+)-/)
  if (match) {
    return new Date(parseInt(match[1])).toISOString()
  }
  return new Date().toISOString()
}

/**
 * Lookup userId associated with this IP
 * Uses Supabase to check if IP already has a userId
 */
async function lookupUserByIp(ipAddress: string): Promise<string | null> {
  try {
    const response = await fetch('/api/user/lookup-by-ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ipAddress })
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.userId || null
  } catch (error) {
    console.warn('IP lookup failed:', error)
    return null
  }
}

/**
 * Associate IP with userId in database
 * Stores IP → userId mapping for cross-device tracking
 */
async function associateIpWithUser(ipAddress: string, userId: string): Promise<void> {
  try {
    await fetch('/api/user/associate-ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ipAddress, userId })
    })
  } catch (error) {
    console.warn('Failed to associate IP with user:', error)
  }
}
```

---

## Database Schema Changes

**New Table:** `user_ip_associations`

```sql
CREATE TABLE user_ip_associations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,           -- player-{timestamp}-{random}
  ip_address TEXT NOT NULL,        -- 192.168.1.1 or hashed version
  device_type TEXT,                -- 'mobile', 'desktop', 'unknown'
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(ip_address)  -- One IP = One user (handles device switching)
);

CREATE INDEX idx_user_ip_associations_user_id ON user_ip_associations(user_id);
CREATE INDEX idx_user_ip_associations_ip ON user_ip_associations(ip_address);
```

---

## Privacy & Compliance

### FERPA Compliance
- IP addresses are **NOT** considered PII under FERPA (education records only)
- However, IP + name could be PII
- **Safe approach:** Hash IPs before storing

### IP Hashing Strategy

```typescript
/**
 * Hash IP address for privacy (one-way, deterministic)
 * Uses SHA-256 with salt
 */
export async function hashIp(ipAddress: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT || 'lux-story-pilot-2025'
  const data = `${ipAddress}-${salt}`

  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return `ip-${hashHex.substring(0, 16)}` // First 16 chars sufficient for deduplication
}
```

**Benefits:**
- Can't reverse-engineer IP from hash
- Same IP always produces same hash (consistent user ID)
- Compliant with FERPA/GDPR

---

## API Routes Needed

### 1. `/api/user/lookup-by-ip` (POST)

```typescript
// app/api/user/lookup-by-ip/route.ts
import { NextResponse } from 'next/server'
import { getClientIp } from '@/lib/rate-limit'
import { hashIp } from '@/lib/user-identification'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { ipAddress } = await request.json()

    if (!ipAddress || ipAddress === 'unknown') {
      return NextResponse.json({ userId: null })
    }

    const ipHash = await hashIp(ipAddress)

    const { data, error } = await supabase
      .from('user_ip_associations')
      .select('user_id')
      .eq('ip_address', ipHash)
      .single()

    if (error || !data) {
      return NextResponse.json({ userId: null })
    }

    return NextResponse.json({ userId: data.user_id })
  } catch (error) {
    console.error('Lookup by IP failed:', error)
    return NextResponse.json({ userId: null }, { status: 500 })
  }
}
```

### 2. `/api/user/associate-ip` (POST)

```typescript
// app/api/user/associate-ip/route.ts
import { NextResponse } from 'next/server'
import { hashIp } from '@/lib/user-identification'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { ipAddress, userId } = await request.json()

    if (!ipAddress || ipAddress === 'unknown') {
      return NextResponse.json({ success: false })
    }

    const ipHash = await hashIp(ipAddress)

    const { error } = await supabase
      .from('user_ip_associations')
      .upsert({
        user_id: userId,
        ip_address: ipHash,
        device_type: 'unknown', // Will be updated by client
        last_seen_at: new Date().toISOString()
      }, {
        onConflict: 'ip_address'
      })

    if (error) {
      console.error('Failed to associate IP:', error)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Associate IP failed:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
```

---

## Integration with StatefulGameInterface

**Current code (line 348):**
```typescript
const userId = generateUserId()
```

**Updated code:**
```typescript
// Get IP address server-side
const ipResponse = await fetch('/api/user/get-client-ip')
const { ipAddress } = await ipResponse.json()

// Get user identifier with IP fallback
const identifier = await getUserIdentifier(ipAddress)
const userId = identifier.userId
```

**New API route:** `/api/user/get-client-ip` (GET)

```typescript
// app/api/user/get-client-ip/route.ts
import { NextResponse } from 'next/server'
import { getClientIp } from '@/lib/rate-limit'

export async function GET(request: Request) {
  const ipAddress = getClientIp(request)
  return NextResponse.json({ ipAddress })
}
```

---

## Benefits for Pilot Metrics

### Accurate Participant Count
- **Before:** Student on phone + laptop = 2 users
- **After:** Same IP = Same user (accurate 16-graduate count)

### Device Switching Detection
- Track when students switch devices
- Insight: "60% of students used both mobile + desktop"

### Cross-Session Continuity
- Student clears localStorage → Still recognized by IP
- Better completion rate tracking

### Admin Dashboard Enhancement
```typescript
// In cohort analytics
interface ParticipantMetrics {
  uniqueParticipants: number  // Deduplicated by IP
  totalSessions: number        // Raw localStorage IDs
  avgDevicesPerUser: number    // sessions / participants
  mobileVsDesktop: { mobile: number, desktop: number }
}
```

---

## Risks & Mitigations

### Risk 1: Shared IPs (School WiFi)
**Problem:** Multiple students on same network appear as 1 user

**Mitigation:**
- Combine IP + User-Agent fingerprint
- Track session timing (simultaneous sessions = different users)
- Anthony can provide roster to verify count

### Risk 2: Dynamic IPs (Mobile Networks)
**Problem:** Student's IP changes between sessions

**Mitigation:**
- localStorage remains primary ID
- IP is fallback only (for cross-device scenarios)
- Most residential/school IPs are stable for 24-48 hours

### Risk 3: Privacy Concerns
**Problem:** Storing IPs feels invasive

**Mitigation:**
- Hash IPs before storage (can't be reversed)
- Auto-delete after 90 days
- Disclosed in STUDENT_INSTRUCTIONS.md

---

## Recommended Approach

### Phase 1: MVP (For Pilot)
1. Add IP lookup/association APIs
2. Hash IPs before storage
3. Update `StatefulGameInterface` to use hybrid identification
4. Test with 2-3 beta users on multiple devices

### Phase 2: Analytics Enhancement
1. Add IP-based deduplication to cohort dashboard
2. Track device switching patterns
3. CSV export includes "Unique IPs" vs "Total Sessions"

### Phase 3: Future Improvements
1. Browser fingerprinting (more accurate than IP)
2. Email/code-based identification (explicit opt-in)
3. Cross-cohort deduplication

---

## Implementation Checklist

- [ ] Create `lib/user-identification.ts` with `getUserIdentifier()`
- [ ] Create `lib/ip-hashing.ts` with `hashIp()`
- [ ] Add Supabase migration for `user_ip_associations` table
- [ ] Create API route `/api/user/lookup-by-ip`
- [ ] Create API route `/api/user/associate-ip`
- [ ] Create API route `/api/user/get-client-ip`
- [ ] Update `StatefulGameInterface.tsx` line 348 to use hybrid ID
- [ ] Add IP deduplication to `lib/cohort-analytics.ts`
- [ ] Update `STUDENT_INSTRUCTIONS.md` with privacy disclosure
- [ ] Test with 2 devices, same IP
- [ ] Test with localStorage cleared
- [ ] Verify FERPA compliance with Anthony

---

## Timeline Estimate

**Total:** 6-8 hours

- Database schema + migration: 1 hour
- API routes (3 endpoints): 2 hours
- User identification logic: 2 hours
- StatefulGameInterface integration: 1 hour
- Testing + edge cases: 2 hours

---

## Decision Point

**Should we implement IP-based tracking for the pilot?**

### Arguments FOR:
- More accurate participant count (critical for success metrics)
- Better cross-device experience for students
- Useful for Anthony's grant reporting

### Arguments AGAINST:
- Adds complexity (3 new API routes, database table)
- Privacy concerns (even with hashing)
- May not be necessary if students only use 1 device

### **DECISION: NO - Skip IP tracking for pilot**

**Rationale:**
- Prioritize simplicity and faster launch
- Accept some metric inaccuracy (multi-device users counted separately)
- Can add later if pilot shows strong demand
- Focus development time on core experience quality

**Trade-offs Accepted:**
- 16 graduates may appear as 18-20 "users" if device-switching is common
- Admin dashboard will show raw user count (not deduplicated)
- Anthony will need to account for this in reporting

---

## Alternative: Email/Code-Based Identification

**Instead of IP tracking:**
- Anthony provides list of 16 emails
- Students enter email on first load
- Email → userId mapping (explicit, no privacy concerns)

**Pros:**
- 100% accurate (no deduplication issues)
- FERPA compliant (explicit consent)
- Simple implementation

**Cons:**
- Extra friction (students must enter email)
- Breaks "no login" UX principle
- Students may enter wrong email

**Verdict:** IP tracking is less intrusive for pilot. Email-based can be added later for paid cohorts.
