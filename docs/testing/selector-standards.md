# Selector Standards for E2E Tests

**Version:** 1.0
**Last Updated:** January 2026
**Purpose:** Ensure stable, maintainable selectors across all Playwright tests

---

## 🎯 Priority Hierarchy

Selectors listed from **most stable** to **least stable**:

| Priority | Selector Type | Stability | Use When |
|----------|---------------|-----------|----------|
| 1 | `data-testid` | ⭐⭐⭐⭐⭐ | Always preferred |
| 2 | Role + Accessible Name | ⭐⭐⭐⭐ | Interactive elements |
| 3 | Label | ⭐⭐⭐ | Form inputs, buttons |
| 4 | Text Content | ⭐⭐ | LAST RESORT only |
| 5 | CSS Class/ID | ⭐ | NEVER (breaks on refactoring) |

---

## ✅ Recommended Selectors

### 1. data-testid (Best Practice)

**Why:** Explicit test hooks, immune to refactoring

```typescript
// ✅ EXCELLENT
page.getByTestId('dialogue-content')
page.getByTestId('choice-button')
page.getByTestId('game-interface')
page.getByTestId('speaker-name')
```

**Adding testid to Components:**

```tsx
// StatefulGameInterface.tsx
<div data-testid="game-interface">
  <div data-testid="dialogue-card">
    <span data-testid="speaker-name">{speaker}</span>
    <div data-testid="dialogue-content">{content}</div>
  </div>
</div>

// game-choice.tsx
<button
  data-testid="choice-button"
  data-choice-id={choice.choiceId}
  data-pattern={choice.pattern}
>
  {choice.text}
</button>
```

### 2. Role + Accessible Name (Semantic)

**Why:** Resilient to implementation changes, enforces accessibility

```typescript
// ✅ EXCELLENT
page.getByRole('button', { name: /enter the station/i })
page.getByRole('tab', { name: /skills/i })
page.getByRole('dialog')
page.getByRole('heading', { name: /welcome/i })
```

**Case-Insensitive Regex:**

```typescript
// ✅ Good: Case-insensitive, partial match
page.getByRole('button', { name: /submit/i })

// ❌ Brittle: Exact case, full string
page.getByRole('button', { name: 'Submit' })
```

### 3. Label (Accessibility-Focused)

**Why:** Connects to ARIA labels, good for forms and buttons

```typescript
// ✅ GOOD
page.getByLabel('Open Journal')
page.getByLabel('Open Skill Constellation')
page.getByLabel(/close/i)
```

**Adding aria-label:**

```tsx
<button aria-label="Open Journal" onClick={openJournal}>
  <CompassIcon />
</button>

<button aria-label="Open Skill Constellation" onClick={openConstellation}>
  <NetworkIcon />
</button>
```

---

## ❌ Avoid These Selectors

### Text Content (Last Resort)

**Why:** Breaks on copy changes, localization

```typescript
// ❌ BRITTLE (breaks when text changes)
page.locator('text=Samuel')
page.locator('text=Enter the Station')

// ✅ BETTER
page.getByTestId('speaker-name') // If Samuel is speaker name
page.getByRole('button', { name: /enter.*station/i }) // If button
```

**When Text Selectors Are OK:**

```typescript
// ✅ Acceptable: Checking for error messages
await expect(page.getByText('Invalid password')).toBeVisible()

// ✅ Acceptable: Looking for specific heading text
await expect(page.getByText('Your Journey')).toBeVisible()
```

### CSS Classes (Never)

**Why:** Implementation detail, changes during refactoring

```typescript
// ❌ TERRIBLE (breaks on CSS refactoring)
page.locator('.glass-panel')
page.locator('.btn-primary')
page.locator('#main-content')

// ✅ BETTER
page.getByTestId('dialogue-card')
page.getByRole('button', { name: /submit/i })
page.getByTestId('main-content')
```

### nth-child / Positional Selectors (Never)

**Why:** Breaks when elements are reordered

```typescript
// ❌ TERRIBLE (breaks on reorder)
page.locator('button').nth(2)
page.locator('div:nth-child(3)')

// ✅ BETTER
page.locator('[data-testid="choice-button"]').nth(2) // OK if order is semantic
page.getByRole('button', { name: /specific action/i })
```

---

## 🎨 Selector Patterns by Use Case

### Game Dialogue

```typescript
// Dialogue container
await expect(page.getByTestId('dialogue-card')).toBeVisible()

// Dialogue content
const dialogue = page.getByTestId('dialogue-content')
await expect(dialogue).toBeVisible()

// Speaker name
const speaker = page.getByTestId('speaker-name')
await expect(speaker).toHaveText('Samuel')

// Character avatar/header
const characterHeader = page.getByTestId('character-header')
await expect(characterHeader).toBeVisible()
```

### Choice Buttons

```typescript
// All choices
const choices = page.locator('[data-testid="choice-button"]')
const choiceCount = await choices.count()

// Specific choice by text
const analyticalChoice = page.locator('[data-testid="choice-button"]')
  .filter({ hasText: /analyze/i })

// Specific choice by choiceId
const specificChoice = page.locator('[data-testid="choice-button"][data-choice-id="maya_tech_path"]')

// First choice
await choices.first().click()
```

### Navigation

```typescript
// Journal button
const journalBtn = page.getByLabel('Open Journal')
await journalBtn.click()

// Constellation button
const constellationBtn = page.getByLabel('Open Skill Constellation')
await constellationBtn.click()

// Close dialog
const closeBtn = page.getByLabel(/close/i)
await closeBtn.click()
```

### Modal Dialogs

```typescript
// Dialog container
const dialog = page.getByRole('dialog')
await expect(dialog).toBeVisible()

// Tab navigation
const skillsTab = page.getByRole('tab', { name: /skills/i })
await skillsTab.click()

// Tab active state
await expect(skillsTab).toHaveAttribute('aria-selected', 'true')
```

### Forms & Inputs

```typescript
// Input by label
await page.getByLabel('Password').fill('secret')

// Input by placeholder
await page.getByPlaceholder('Enter your name').fill('Alex')

// Submit button
await page.getByRole('button', { name: /submit/i }).click()
```

---

## 📏 Advanced Patterns

### Filtering by Attribute

```typescript
// Choice button with specific pattern
const buildingChoice = page.locator('[data-testid="choice-button"][data-pattern="building"]')

// Active tab
const activeTab = page.locator('[role="tab"][aria-selected="true"]')
```

### Combining Selectors

```typescript
// Dialog with specific content
const journeyDialog = page.getByRole('dialog')
  .filter({ has: page.getByText('Your Journey') })

// Button within specific container
const submitBtn = page.getByTestId('form-container')
  .getByRole('button', { name: /submit/i })
```

### Waiting for Multiple Possible States

```typescript
// Wait for any of several possible outcomes
await Promise.race([
  page.getByText('Success').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
  page.getByText('Error').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
  page.getByText('Pending').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
])
```

---

## 🛠️ Adding testid to Components

### React Component Example

```tsx
interface GameChoiceProps {
  choice: {
    choiceId: string
    text: string
    pattern?: string
  }
  onClick: () => void
}

export function GameChoice({ choice, onClick }: GameChoiceProps) {
  return (
    <button
      data-testid="choice-button"
      data-choice-id={choice.choiceId}
      data-pattern={choice.pattern}
      onClick={onClick}
    >
      {choice.text}
    </button>
  )
}
```

### Container Components

```tsx
export function GameInterface({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="game-interface" className="game-interface">
      <div data-testid="dialogue-card" className="dialogue-card">
        {children}
      </div>
      <div data-testid="game-choices" role="group" aria-label="Story choices">
        {/* Choice buttons */}
      </div>
    </div>
  )
}
```

### Naming Conventions

| Element Type | testid Pattern | Example |
|--------------|----------------|---------|
| Container | `{feature}-{type}` | `dialogue-card`, `game-interface` |
| Button | `{action}-button` | `choice-button`, `submit-button` |
| Input | `{field}-input` | `password-input`, `email-input` |
| Content | `{feature}-content` | `dialogue-content`, `error-content` |
| Header | `{feature}-header` | `character-header`, `page-header` |

---

## 🔍 Debugging Selectors

### Playwright Inspector

```bash
# Open inspector to test selectors
npx playwright test --debug
```

### Browser DevTools

```typescript
// Log element to debug
const element = page.getByTestId('my-element')
await element.evaluate(el => console.log(el))

// Check if element exists
const count = await page.getByTestId('my-element').count()
console.log(`Found ${count} elements`)

// Get all matching elements
const elements = await page.locator('[data-testid="choice-button"]').all()
console.log(`Found ${elements.length} choices`)
```

### Selector Playground

```typescript
// Test selector in page context
await page.evaluate(() => {
  const elements = document.querySelectorAll('[data-testid="choice-button"]')
  console.log(`Found ${elements.length} elements`)
  elements.forEach((el, i) => console.log(`${i}:`, el.textContent))
})
```

---

## 📊 Selector Audit Checklist

When reviewing tests, verify:

- [ ] All selectors use testid, role, or label
- [ ] No CSS class selectors (`.class-name`)
- [ ] No CSS ID selectors (`#id-name`)
- [ ] No nth-child or positional selectors
- [ ] Text selectors only for content verification
- [ ] Regex patterns are case-insensitive (`/pattern/i`)
- [ ] testid names follow naming conventions

---

## 🚀 Migration Guide

### Converting Old Selectors

```typescript
// ❌ OLD (brittle)
await page.click('text=Submit')

// ✅ NEW (stable)
await page.getByRole('button', { name: /submit/i }).click()

// ---

// ❌ OLD (brittle)
const dialogue = page.locator('.dialogue-content')

// ✅ NEW (stable)
const dialogue = page.getByTestId('dialogue-content')

// ---

// ❌ OLD (brittle)
await page.locator('button').nth(2).click()

// ✅ NEW (stable)
await page.locator('[data-testid="choice-button"]').nth(2).click()
// OR better:
await page.getByRole('button', { name: /specific action/i }).click()
```

---

## 📚 References

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [ARIA Roles Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles/)

---

**Last Updated:** January 13, 2026
**Maintained By:** Engineering Team
**Questions?** Create an issue or ask in #engineering
