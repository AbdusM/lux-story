# Admin Dashboard Stress Test Plan

## Objective
Verify the admin dashboard is robust against edge cases, extreme data, and error conditions.

## Test Categories

### 1. Empty/Null Data Tests
Test how dashboard handles missing or incomplete data:

**User with NO data:**
- Zero skill demonstrations
- Zero pattern demonstrations
- Empty career explorations
- No skill gaps
- No urgency flags

**Partially empty data:**
- User with skills but no patterns
- User with patterns but no skills
- User with data but no career explorations

**Expected Behavior:**
- No crashes or white screens
- Graceful empty states with helpful messages
- Progress indicators show 0% correctly
- Charts render without errors (empty state or placeholder)

### 2. Extreme Values Tests
Test with unrealistic but possible data:

**Large numbers:**
- User with 10,000+ skill demonstrations
- 500+ unique skills tracked
- 100+ career explorations
- Trust values at maximum (100)
- Negative trust values (data corruption)

**Invalid values:**
- NaN in numeric fields
- Infinity in percentages
- Null/undefined in required fields
- Empty strings in text fields
- Malformed timestamps

**Expected Behavior:**
- Numbers format correctly (1,000+ → "1K")
- Percentages cap at 100%
- Invalid data caught and displayed as "N/A" or "--"
- No console errors
- Progress bars don't overflow

### 3. Performance Tests
Test dashboard with realistic large datasets:

**Heavy data load:**
- User with 6 months of daily play (180+ sessions)
- 1000+ skill demonstrations
- 50+ career explorations
- Full pattern profile data
- Complete urgency tracking

**Metrics to track:**
- Page load time (should be < 3 seconds)
- Chart render time (should be < 1 second)
- Memory usage (check for leaks)
- CPU usage during data processing
- Responsiveness during data fetch

**Expected Behavior:**
- Loading states display correctly
- No UI freezing or blocking
- Smooth scrolling
- Charts paginate or limit data points if needed

### 4. Error Handling Tests
Test how dashboard handles API/database failures:

**API failures:**
- 500 Internal Server Error
- 404 User Not Found
- 403 Forbidden (wrong user)
- Network timeout
- Malformed JSON response

**Database failures:**
- Connection timeout
- Query timeout
- Foreign key violations
- Null constraint violations
- Transaction rollback

**Expected Behavior:**
- Error messages display clearly
- No sensitive error details exposed
- User can retry or navigate away
- Partial data loads still render (graceful degradation)
- Console errors are helpful for debugging

### 5. Data Integrity Tests
Verify calculations and aggregations are correct:

**Skill calculations:**
- Total demonstrations = sum of all skill counts
- Top skills correctly sorted by count
- Skill gaps correctly identify missing skills
- Percentages add up to 100%

**Pattern calculations:**
- Pattern scores normalized correctly
- Primary pattern correctly identified
- Pattern distribution chart sums to 100%

**Urgency calculations:**
- Weighted urgency score formula correct
- Component scores match raw data
- Flags correctly counted

### 6. UI/UX Edge Cases
Test visual and interaction edge cases:

**Long text:**
- Very long skill names (100+ characters)
- Very long career exploration titles
- Extremely long user IDs

**Small screens:**
- Mobile viewport (375px width)
- Tablet viewport (768px width)
- Charts responsive and readable

**Accessibility:**
- Keyboard navigation works
- Screen reader announces loading states
- Color contrast meets WCAG AA
- Charts have alt text

## Test Execution Plan

### Phase 1: Manual Testing (30 minutes)
1. Create test user IDs with different data profiles
2. Visit dashboard for each user
3. Check console for errors
4. Verify visual rendering
5. Document any issues

### Phase 2: Code Review (20 minutes)
1. Review AdminDashboardContext data fetching
2. Check error handling in API routes
3. Verify null checks in components
4. Look for potential division by zero
5. Check for missing optional chaining

### Phase 3: Automated Testing (40 minutes)
1. Write unit tests for calculation functions
2. Write integration tests for API routes
3. Add snapshot tests for empty states
4. Test with mock extreme data
5. Run E2E tests for critical paths

## Stress Test Scenarios

### Scenario 1: The Empty User
```typescript
{
  userId: "empty-user",
  skillDemonstrations: [],
  patternDemonstrations: [],
  careerExplorations: [],
  skillGaps: [],
  urgencyProfile: null,
  totalDemonstrations: 0
}
```

**Test all 7 admin pages:**
- /admin/[userId] (overview)
- /admin/[userId]/skills
- /admin/[userId]/patterns
- /admin/[userId]/urgency
- /admin/[userId]/careers
- /admin/[userId]/evidence
- /admin/[userId]/gaps
- /admin/[userId]/action

### Scenario 2: The Data Hoarder
```typescript
{
  userId: "data-hoarder",
  skillDemonstrations: Array(10000).fill({...}),
  patternDemonstrations: Array(5000).fill({...}),
  careerExplorations: Array(200).fill({...}),
  totalDemonstrations: 10000
}
```

**Measure:**
- Initial load time
- Memory usage over 5 minutes
- Chart render performance
- Pagination/virtualization needed?

### Scenario 3: The Corrupted User
```typescript
{
  userId: "corrupted-user",
  skillDemonstrations: [
    { skill: null, count: NaN },
    { skill: "", count: -5 },
    { skill: "valid", count: Infinity }
  ],
  totalDemonstrations: "not a number",
  urgencyProfile: undefined
}
```

**Verify:**
- No crashes
- Errors logged to console
- User sees helpful error message
- Can navigate away safely

### Scenario 4: The API Failure
```typescript
// Mock API route to return errors
GET /api/admin/profile/[userId] → 500 Internal Server Error
GET /api/user/skill-demonstrations?userId=X → Network timeout
GET /api/user/pattern-profile?userId=X → { error: "Database connection failed" }
```

**Verify:**
- Loading states display
- Error boundaries catch failures
- Retry mechanisms work
- Partial data still renders

## Success Criteria

✅ **Pass**: Dashboard handles scenario gracefully
⚠️ **Warning**: Dashboard works but with console errors or poor UX
❌ **Fail**: Dashboard crashes, white screen, or data corruption

**Minimum requirements to pass:**
- Zero crashes or white screens
- All empty states display correctly
- No Infinity or NaN visible to users
- Error messages are user-friendly
- Performance acceptable with 1000+ records
- All API errors handled gracefully

## Tools and Commands

### Create Test Users
```bash
# Empty user
npx tsx scripts/create-test-user.ts --userId "test-empty" --empty

# Data hoarder
npx tsx scripts/create-test-user.ts --userId "test-hoarder" --heavy

# Corrupted data
npx tsx scripts/create-test-user.ts --userId "test-corrupt" --corrupt
```

### Run Tests
```bash
# Unit tests
npm run test tests/admin/

# Integration tests
npm run test:integration tests/api/admin/

# E2E tests
npm run test:e2e tests/e2e/admin-dashboard.spec.ts

# Performance profiling
npm run test:perf -- --target=admin-dashboard
```

### Monitor Performance
```bash
# Check bundle size
npm run analyze

# Memory profiling
node --inspect npm run dev
# Then use Chrome DevTools -> Memory

# Lighthouse audit
npx lighthouse http://localhost:3003/admin/test-user --view
```

## Deliverables

1. **ADMIN_STRESS_TEST_RESULTS.md** - Findings from all tests
2. **Bug fixes** - Code changes to address failures
3. **Test suite** - Automated tests for regression prevention
4. **Documentation updates** - Edge cases and known limitations

---

**Ready to execute?** Start with Phase 1 manual testing using real user IDs.
