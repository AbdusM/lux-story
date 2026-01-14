# Lux Story E2E Testing Guide

**Version:** 2.0
**Last Updated:** January 2026
**Coverage:** Core game loop, mobile UX, performance

---

## 🚀 Quick Start

### Running Tests

```bash
# All tests
npm run test:e2e

# Specific project
npm run test:e2e -- --project=core-game
npm run test:e2e -- --project=mobile-iphone-se

# Specific file
npm run test:e2e tests/e2e/core-game-loop.spec.ts

# Headed mode (visual debugging)
npm run test:e2e:headed

# Debug mode (step-through)
npm run test:e2e:debug

# Update snapshots
npm run test:e2e -- --update-snapshots
```

### Test Projects

| Project | Description | Parallelization |
|---------|-------------|-----------------|
| `auth` | Admin authentication tests | Serial (1 worker) |
| `core-game` | Game loop, journey summary | Parallel (2 workers) |
| `ui-components` | Constellation, homepage | Parallel (2 workers) |
| `mobile-iphone-se` | Mobile tests (375×667) | Parallel (2 workers) |
| `mobile-iphone-14` | Mobile tests (390×844) | Parallel (2 workers) |
| `mobile-galaxy-s21` | Mobile tests (360×800) | Parallel (2 workers) |

---

## 📝 Writing a New Test

### Pattern: Use Fixtures for State

```typescript
import { test, expect } from '../fixtures/game-state-fixtures'

test('My new feature', async ({ page, journeyComplete }) => {
  // State already seeded by fixture!
  const featureButton = page.getByTestId('my-feature')
  await expect(featureButton).toBeVisible()
})
```

### Available Fixtures

**`freshGame`** - New player at station entrance
```typescript
test('New user flow', async ({ page, freshGame }) => {
  // Ready to start game
})
```

**`journeyComplete`** - 2 arcs complete, patterns developed
```typescript
test('Advanced feature', async ({ page, journeyComplete }) => {
  // Player has significant progress
})
```

**`withDemonstratedSkills`** - Skills unlocked for constellation
```typescript
test('Constellation shows skills', async ({ page, withDemonstratedSkills }) => {
  // Skills constellation populated
})
```

**`withHighTrust`** - Maya at trust 6 (vulnerability unlocked)
```typescript
test('Vulnerability arc unlocks', async ({ page, withHighTrust }) => {
  // High-trust content available
})
```

**`adminAuth`** - Admin authenticated
```typescript
test('Admin dashboard', async ({ page, adminAuth }) => {
  // Already logged into admin panel
})
```

---

## ✅ Selector Standards

### Priority (High to Low Stability)

1. ✅ **data-testid** - Most stable, semantic
2. ✅ **role + accessible name** - Semantic, resilient
3. ❌ **text content** - LAST RESORT (breaks on copy changes)

### Good Selectors

```typescript
// ✅ data-testid (best)
page.getByTestId('dialogue-content')
page.getByTestId('choice-button')

// ✅ role + name (semantic)
page.getByRole('button', { name: /enter the station/i })
page.getByRole('tab', { name: /skills/i })

// ✅ label (accessibility-focused)
page.getByLabel('Open Journal')
page.getByLabel('Open Skill Constellation')
```

### Bad Selectors

```typescript
// ❌ Text content (brittle)
page.locator('text=Samuel')

// ❌ CSS class (implementation detail)
page.locator('.glass-panel')

// ❌ nth-child (breaks on reorder)
page.locator('button').nth(2)
```

### Adding testid to Components

```tsx
// Before
<button onClick={handleClick}>Continue</button>

// After
<button data-testid="continue-button" onClick={handleClick}>
  Continue
</button>
```

---

## ⏱️ Wait Patterns (NO HARD WAITS)

### Pattern 1: Element Visibility

```typescript
// ✅ GOOD: Wait for element
await expect(page.getByTestId('dialogue-content')).toBeVisible({ timeout: 5000 })

// ❌ BAD: Arbitrary timeout
await page.waitForTimeout(2000)
```

### Pattern 2: Attribute Changes

```typescript
// ✅ GOOD: Wait for state
await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 3000 })
```

### Pattern 3: Multiple Possible States

```typescript
// ✅ GOOD: Race multiple conditions
await Promise.race([
  page.locator('text=No Students Yet').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
  page.locator('a[href*="/urgency"]').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
  page.locator('text=Database Connection Issue').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
])
```

### Pattern 4: Content Changes

```typescript
// ✅ GOOD: Wait for dialogue to update
await page.waitForFunction(
  (initial) => {
    const current = document.querySelector('[data-testid="dialogue-content"]')?.textContent
    return current && current !== initial
  },
  initialDialogue,
  { timeout: 10000 }
)
```

### Pattern 5: Network Idle

```typescript
// ✅ GOOD: Wait for network
await page.goto('/admin', { waitUntil: 'networkidle' })
```

---

## 🎯 Test Structure

### Standard Pattern

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup common to all tests in this describe block
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
  })

  test('Happy path: User completes primary action', async ({ page }) => {
    // STEP 1: Arrange
    const button = page.getByRole('button', { name: /submit/i })

    // STEP 2: Act
    await button.click()

    // STEP 3: Assert
    await expect(page.getByText('Success')).toBeVisible()
  })

  test('Edge case: User encounters error', async ({ page }) => {
    // Test error handling
  })
})
```

### Mobile-Specific Tests

```typescript
const MOBILE_VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'Galaxy S21', width: 360, height: 800 }
]

for (const viewport of MOBILE_VIEWPORTS) {
  test.describe(`Feature on ${viewport.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
    })

    test('Mobile interaction', async ({ page }) => {
      // Test mobile-specific behavior
    })
  })
}
```

---

## 📱 Mobile Testing Checklist

When writing mobile tests, verify:

- [ ] **Touch targets ≥44px** (Apple HIG)
- [ ] **Safe areas respected** (top: 59px, bottom: 34px on Pro Max)
- [ ] **No horizontal overflow** (viewport width - 32px padding)
- [ ] **Portrait orientation** (height > width)
- [ ] **Smooth animations** (>50 FPS)
- [ ] **Fast rendering** (<1s for dialogue updates)

### Example: Touch Target Validation

```typescript
test('Navigation buttons meet 44px minimum', async ({ page }) => {
  const journalBtn = page.getByLabel('Open Journal')
  const btnBox = await journalBtn.boundingBox()

  expect(btnBox).not.toBeNull()
  if (btnBox) {
    expect(btnBox.width).toBeGreaterThanOrEqual(44)
    expect(btnBox.height).toBeGreaterThanOrEqual(44)
  }
})
```

---

## 🔍 Debugging

### Visual Debugging

```bash
# Run with browser visible
npm run test:e2e:headed

# Run specific test headed
npx playwright test tests/e2e/core-game-loop.spec.ts --headed
```

### Step-Through Debugging

```bash
# Debug mode (Playwright Inspector)
npm run test:e2e:debug

# Or specific test
npx playwright test tests/e2e/core-game-loop.spec.ts --debug
```

### Screenshots & Videos

```typescript
// Take screenshot during test
await page.screenshot({ path: 'debug.png' })

// Take screenshot on failure (automatic in CI)
// See: test-results/ directory
```

### Console Logs

```typescript
// Log page console messages
page.on('console', msg => console.log('PAGE LOG:', msg.text()))

// Evaluate JavaScript for debugging
const value = await page.evaluate(() => {
  return localStorage.getItem('grand-central-terminus-save')
})
console.log('State:', JSON.parse(value))
```

---

## 🎨 Best Practices

### DO

✅ Use fixtures for state seeding
✅ Use stable selectors (testid, role)
✅ Use smart waits (visibility, attributes)
✅ Test user flows, not implementation details
✅ Write descriptive test names
✅ Keep tests independent (no shared state)
✅ Test error states and edge cases

### DON'T

❌ Use `waitForTimeout()` - EVER
❌ Use text selectors (breaks on copy changes)
❌ Use CSS classes or nth-child
❌ Share state between tests
❌ Test internal implementation
❌ Write flaky tests (random failures)
❌ Skip tests without reason

---

## 🏗️ Test Organization

```
tests/
├── e2e/
│   ├── admin/                    # Auth tests (serial)
│   ├── core-game-loop.spec.ts   # Game loop tests (parallel)
│   ├── journey-summary.spec.ts  # Journey summary (parallel)
│   ├── constellation/           # UI component tests (parallel)
│   ├── user-flows/              # Homepage, navigation (parallel)
│   ├── mobile/                  # Mobile-specific tests (parallel)
│   │   ├── game-flow.spec.ts    # Core flow on mobile
│   │   ├── touch-targets.spec.ts # 44px validation
│   │   ├── safe-areas.spec.ts   # iPhone notch/home indicator
│   │   └── performance.spec.ts  # Performance benchmarks
│   └── fixtures/                # Reusable test utilities
│       ├── game-state-fixtures.ts
│       └── auth-fixtures.ts
├── lib/                         # Unit tests (Vitest)
└── browser-runtime/             # Integration tests
```

---

## 📊 Performance Benchmarks

### Target Metrics

| Metric | Target | Test Location |
|--------|--------|---------------|
| First Contentful Paint | <2s | `mobile/performance.spec.ts` |
| Game Interface Load | <3s | `mobile/performance.spec.ts` |
| Dialogue Render | <1s | `mobile/performance.spec.ts` |
| Animation FPS | >50 FPS | `mobile/performance.spec.ts` |
| Memory Increase (5 choices) | <5MB | `mobile/performance.spec.ts` |
| localStorage Save | <50ms | `mobile/performance.spec.ts` |

### Running Performance Tests

```bash
# Run all performance tests
npm run test:e2e tests/e2e/mobile/performance.spec.ts

# Run specific performance test
npx playwright test --grep "First Contentful Paint"
```

---

## 🚨 Common Pitfalls

### Pitfall 1: Hard Waits

```typescript
// ❌ BAD
await page.waitForTimeout(2000)
const element = page.getByTestId('my-element')

// ✅ GOOD
const element = page.getByTestId('my-element')
await expect(element).toBeVisible({ timeout: 5000 })
```

### Pitfall 2: Text Selectors

```typescript
// ❌ BAD (breaks on copy changes)
await page.click('text=Submit')

// ✅ GOOD
await page.getByRole('button', { name: /submit/i }).click()
```

### Pitfall 3: Shared State

```typescript
// ❌ BAD (tests depend on each other)
let globalState: any

test('Test 1', async ({ page }) => {
  globalState = await page.evaluate(() => /* ... */)
})

test('Test 2', async ({ page }) => {
  // Uses globalState - FLAKY!
})

// ✅ GOOD (tests are independent)
test('Test 1', async ({ page, freshGame }) => {
  // Isolated state
})

test('Test 2', async ({ page, freshGame }) => {
  // Fresh state
})
```

### Pitfall 4: Over-Testing Implementation

```typescript
// ❌ BAD (testing internal state)
test('State object has correct structure', async ({ page }) => {
  const state = await page.evaluate(() => window.__INTERNAL_STATE__)
  expect(state).toHaveProperty('patterns.analytical')
})

// ✅ GOOD (testing user-visible behavior)
test('Analytical choices increase analytical pattern', async ({ page }) => {
  await page.getByRole('button', { name: /analyze/i }).click()
  await expect(page.getByText(/analytical.*increased/i)).toBeVisible()
})
```

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Selector Standards](./docs/testing/selector-standards.md)
- [CLAUDE.md - Testing Workflow](../CLAUDE.md#testing)

---

## 🤝 Contributing

### Before Submitting Tests

1. ✅ All tests pass locally
2. ✅ No hard waits (`waitForTimeout`)
3. ✅ Stable selectors used (testid, role)
4. ✅ Tests are independent (no shared state)
5. ✅ Descriptive test names
6. ✅ Tests run in <30s each

### Review Checklist

- [ ] Tests use fixtures for state seeding
- [ ] No hard waits in test code
- [ ] Selectors are stable (testid, role, label)
- [ ] Tests pass in CI
- [ ] Mobile tests validate on 3+ viewports
- [ ] Performance tests have clear benchmarks

---

**Questions?** Check the [selector standards](./docs/testing/selector-standards.md) or ask the team!
