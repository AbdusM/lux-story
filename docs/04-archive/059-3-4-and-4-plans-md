# Phase 3.4 & Phase 4 Implementation Plans

## Phase 3.4: Real-Time Supabase Subscriptions (Optional Enhancement)

### Objective
Enable live admin dashboard updates when urgency scores change, eliminating need for manual page refresh.

### Architecture Decision: Pragmatic vs Over-Engineered

**Option 1: Simple Polling (RECOMMENDED for MVP)**
- Client polls GET /api/admin/urgency every 30 seconds
- Zero infrastructure complexity
- Works with existing API
- Graceful degradation (continues working if WebSocket fails)
- Sufficient for pilot program (3 admins, low concurrency)

**Option 2: Supabase Real-Time (Advanced)**
- WebSocket subscriptions to `urgent_students` table
- Instant updates, no polling overhead
- Requires additional Supabase setup and client-side subscription logic
- More complex error handling (connection drops, reconnection)
- Better for production scale (10+ concurrent admins)

### Recommended Approach: Simple Polling

**Implementation Steps:**

1. **Create useUrgencyPolling Hook** (`hooks/useUrgencyPolling.ts`):
   ```typescript
   import { useEffect, useState } from 'react'
   import type { UrgentStudent } from '@/lib/types/admin'

   export function useUrgencyPolling(
     level: 'all' | 'critical' | 'high' = 'all',
     intervalMs: number = 30000 // 30 seconds
   ) {
     const [students, setStudents] = useState<UrgentStudent[]>([])
     const [loading, setLoading] = useState(true)
     const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

     useEffect(() => {
       async function fetchStudents() {
         const token = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN || 'demo-token'
         const response = await fetch(`/api/admin/urgency?level=${level}`, {
           headers: { 'Authorization': `Bearer ${token}` }
         })
         const data = await response.json()
         setStudents(data.students || [])
         setLastUpdate(new Date())
         setLoading(false)
       }

       fetchStudents()
       const interval = setInterval(fetchStudents, intervalMs)
       return () => clearInterval(interval)
     }, [level, intervalMs])

     return { students, loading, lastUpdate }
   }
   ```

2. **Update Admin Page** (`app/admin/page.tsx`):
   ```typescript
   // Replace useState + useEffect with polling hook
   const { students: urgentStudents, loading: urgencyLoading, lastUpdate } = useUrgencyPolling(urgencyFilter)

   // Add "Last updated" indicator in UI
   <CardDescription>
     Glass Box urgency scoring with transparent narrative justifications
     {lastUpdate && (
       <span className="text-xs text-gray-500 ml-2">
         (Last updated: {lastUpdate.toLocaleTimeString()})
       </span>
     )}
   </CardDescription>
   ```

3. **Add Manual Refresh** (keep existing recalculate button working)

**Estimated Effort**: 1-2 hours
**Testing**: Verify updates appear within 30 seconds of recalculation
**Rollback**: Remove hook, revert to original useState/useEffect

---

## Phase 4: End-to-End Tests & Production Readiness

### Objective
Verify entire system works end-to-end and meets production quality standards.

### 4.1: Integration Test Suite

**Create `scripts/test-e2e-admin-urgency.ts`:**

Tests full workflow from player actions → urgency calculation → admin visibility:

```typescript
/**
 * End-to-End Admin Urgency Test
 *
 * Simulates complete workflow:
 * 1. Create test player with specific behavioral patterns
 * 2. Trigger urgency calculation
 * 3. Verify urgency score and narrative accuracy
 * 4. Verify admin API returns correct data
 * 5. Cleanup test data
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function testE2E() {
  const supabase = createClient(supabaseUrl, serviceKey)

  // Test Case 1: Critical Disengagement Pattern
  console.log('📍 Test 1: Critical Disengagement (9 days inactive)')

  // Create player profile
  await supabase.from('player_profiles').insert({
    user_id: 'test_critical_inactive',
    current_scene: 'maya-intro',
    last_active_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) // 9 days ago
  })

  // Add minimal engagement (2 choices, 1 scene = stuck pattern)
  await supabase.from('choice_history').insert([
    { user_id: 'test_critical_inactive', scene_id: 'maya-intro', choice_text: 'choice 1', chosen_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
    { user_id: 'test_critical_inactive', scene_id: 'maya-intro', choice_text: 'choice 2', chosen_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) }
  ])

  await supabase.from('scene_visits').insert({
    user_id: 'test_critical_inactive',
    scene_id: 'maya-intro',
    reached_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
  })

  // Calculate urgency
  await supabase.rpc('calculate_urgency_score', { p_player_id: 'test_critical_inactive' })

  // Verify urgency score
  const { data: urgency } = await supabase
    .from('player_urgency_scores')
    .select('*')
    .eq('user_id', 'test_critical_inactive')
    .single()

  console.log('  Urgency Level:', urgency?.urgency_level)
  console.log('  Urgency Score:', Math.round((urgency?.urgency_score || 0) * 100) + '%')
  console.log('  Narrative:', urgency?.urgency_narrative)

  // Assertions
  if (urgency?.urgency_level !== 'critical') {
    throw new Error(`Expected critical, got ${urgency?.urgency_level}`)
  }

  if (!urgency?.urgency_narrative?.includes('inactive for 9 days')) {
    throw new Error('Narrative should mention 9 days inactive')
  }

  if (!urgency?.urgency_narrative?.toLowerCase().includes('immediate outreach')) {
    throw new Error('Critical level should recommend immediate action')
  }

  // Verify API returns data
  const token = process.env.ADMIN_API_TOKEN!
  const response = await fetch('http://localhost:3000/api/admin/urgency?level=critical', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const apiData = await response.json()

  const foundStudent = apiData.students.find((s: any) => s.user_id === 'test_critical_inactive')
  if (!foundStudent) {
    throw new Error('Test student not returned by API')
  }

  console.log('  ✅ PASSED - Critical disengagement detected and explained')

  // Cleanup
  await supabase.from('player_urgency_scores').delete().eq('user_id', 'test_critical_inactive')
  await supabase.from('choice_history').delete().eq('user_id', 'test_critical_inactive')
  await supabase.from('scene_visits').delete().eq('user_id', 'test_critical_inactive')
  await supabase.from('player_profiles').delete().eq('user_id', 'test_critical_inactive')

  // Test Case 2: Healthy Engagement Pattern
  console.log('\\n📍 Test 2: Healthy Engagement (low urgency)')

  await supabase.from('player_profiles').insert({
    user_id: 'test_healthy_active',
    current_scene: 'samuel-mentorship',
    last_active_at: new Date() // Active today
  })

  // Active exploration (10 choices, 5 scenes)
  for (let i = 0; i < 10; i++) {
    await supabase.from('choice_history').insert({
      user_id: 'test_healthy_active',
      scene_id: `scene-${i % 5}`,
      choice_text: `choice ${i}`,
      chosen_at: new Date()
    })
  }

  for (let i = 0; i < 5; i++) {
    await supabase.from('scene_visits').insert({
      user_id: 'test_healthy_active',
      scene_id: `scene-${i}`,
      reached_at: new Date()
    })
  }

  // Calculate urgency
  await supabase.rpc('calculate_urgency_score', { p_player_id: 'test_healthy_active' })

  const { data: healthyUrgency } = await supabase
    .from('player_urgency_scores')
    .select('*')
    .eq('user_id', 'test_healthy_active')
    .single()

  console.log('  Urgency Level:', healthyUrgency?.urgency_level)
  console.log('  Urgency Score:', Math.round((healthyUrgency?.urgency_score || 0) * 100) + '%')

  if (healthyUrgency?.urgency_level === 'critical' || healthyUrgency?.urgency_level === 'high') {
    throw new Error('Healthy engagement should not be high/critical urgency')
  }

  console.log('  ✅ PASSED - Healthy engagement correctly identified')

  // Cleanup
  await supabase.from('player_urgency_scores').delete().eq('user_id', 'test_healthy_active')
  await supabase.from('choice_history').delete().eq('user_id', 'test_healthy_active')
  await supabase.from('scene_visits').delete().eq('user_id', 'test_healthy_active')
  await supabase.from('player_profiles').delete().eq('user_id', 'test_healthy_active')

  console.log('\\n' + '='.repeat(60))
  console.log('✅ ALL E2E TESTS PASSED (2/2)')
  console.log('='.repeat(60))
}

testE2E().catch(error => {
  console.error('❌ E2E Test Failed:', error)
  process.exit(1)
})
```

### 4.2: Performance Benchmarks

**Create `scripts/benchmark-urgency-calculation.ts`:**

```typescript
/**
 * Performance Benchmark: Urgency Calculation
 *
 * Tests system performance under load:
 * - 10 players: < 2 seconds
 * - 50 players: < 10 seconds
 * - 100 players: < 20 seconds
 */

async function benchmark() {
  const startTime = Date.now()

  // Trigger recalculation for all players
  const response = await fetch('http://localhost:3000/api/admin/urgency', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()
  const endTime = Date.now()
  const duration = endTime - startTime

  console.log(`Processed ${data.playersProcessed} players in ${duration}ms`)
  console.log(`Average: ${Math.round(duration / data.playersProcessed)}ms per player`)

  // Assertions
  if (data.playersProcessed <= 10 && duration > 2000) {
    console.warn('⚠️  Small dataset took >2s (may indicate performance issue)')
  }

  if (data.playersProcessed >= 50 && duration > 10000) {
    console.warn('⚠️  Medium dataset took >10s (consider parallelization)')
  }
}

benchmark()
```

### 4.3: Production Readiness Checklist

**Create `docs/PRODUCTION_CHECKLIST.md`:**

```markdown
# Production Readiness Checklist

## Database
- [ ] All migrations run successfully in production Supabase
- [ ] Row Level Security (RLS) policies tested
- [ ] Materialized views refreshing correctly
- [ ] Database indexes optimized (query performance <100ms)

## API
- [ ] ADMIN_API_TOKEN stored in production env variables (not .env.local)
- [ ] SUPABASE_SERVICE_ROLE_KEY stored securely
- [ ] Rate limiting configured (if needed)
- [ ] Error logging configured (Sentry/etc)
- [ ] CORS policies reviewed

## Admin Dashboard
- [ ] Authentication working in production
- [ ] Glass Box narratives displaying correctly
- [ ] Filter/recalculate UI functional
- [ ] Mobile responsive design tested
- [ ] Accessibility (ARIA labels, keyboard navigation)

## Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Performance benchmarks acceptable
- [ ] Manual QA completed

## Security
- [ ] Service role key never exposed to client
- [ ] Admin token rotated from default
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] HTTPS enforced in production

## Monitoring
- [ ] Error tracking configured
- [ ] Performance monitoring configured
- [ ] Admin action audit logging
- [ ] Database query performance tracked

## Documentation
- [ ] API documentation complete
- [ ] Setup guide tested by non-developer
- [ ] Troubleshooting guide created
- [ ] User training materials prepared
```

### 4.4: Implementation Order

1. **E2E Tests First** (validates everything works)
2. **Performance Benchmarks** (identifies bottlenecks)
3. **Production Checklist** (ensures nothing forgotten)
4. **Address any issues found**
5. **Document lessons learned**

### Estimated Effort
- E2E Test Suite: 3-4 hours
- Performance Benchmarks: 1-2 hours
- Production Checklist: 1 hour review
- Total: ~6 hours for comprehensive Phase 4

---

## Decision Point: Which Phase Next?

**Phase 3.4 (Real-Time Updates):**
- **Effort**: 1-2 hours
- **Value**: Nice-to-have UX improvement
- **Risk**: Low (simple polling, easy rollback)
- **Blocker**: None

**Phase 4 (Production Readiness):**
- **Effort**: 6+ hours
- **Value**: Critical for production deployment
- **Risk**: Low (testing only, no changes)
- **Blocker**: Requires SUPABASE_SERVICE_ROLE_KEY

**Recommendation**: Add SUPABASE_SERVICE_ROLE_KEY to `.env.local`, then proceed with Phase 4 for production confidence. Phase 3.4 can be added later if real-time updates prove necessary during pilot.
