/**
 * Phase 1 Fixture Verification (Unit Tests)
 * Verifies that fixtures can be imported and have correct structure
 */

import { describe, it, expect } from 'vitest'

describe('Phase 1 Fixtures Verification', () => {
  it('should be able to import game-state-fixtures module', async () => {
    const module = await import('../../e2e/fixtures/game-state-fixtures')
    expect(module).toBeDefined()
    expect(module.test).toBeDefined()
    expect(module.expect).toBeDefined()
  })

  it('should be able to import auth-fixtures module', async () => {
    const module = await import('../../e2e/fixtures/auth-fixtures')
    expect(module).toBeDefined()
    expect(module.test).toBeDefined()
    expect(module.expect).toBeDefined()
  })

  it('should have testid attributes in game-choice component', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')

    const componentPath = path.resolve(
      process.cwd(),
      'components/game/game-choice.tsx'
    )

    const content = await fs.readFile(componentPath, 'utf-8')

    // Verify data-testid="choice-button" exists
    expect(content).toContain('data-testid="choice-button"')

    // Verify data-choice-id={choice.choiceId} exists
    expect(content).toContain('data-choice-id={choice.choiceId}')

    // Verify data-testid="game-choices" exists
    expect(content).toContain('data-testid="game-choices"')
  })

  it('should have testid attributes in StatefulGameInterface component', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')

    const componentPath = path.resolve(
      process.cwd(),
      'components/StatefulGameInterface.tsx'
    )

    const content = await fs.readFile(componentPath, 'utf-8')

    // Verify critical testids exist
    expect(content).toContain('data-testid="dialogue-card"')
    expect(content).toContain('data-testid="dialogue-content"')
    expect(content).toContain('data-testid="speaker-name"')
    expect(content).toContain('data-testid="game-interface"')
    expect(content).toContain('data-testid="character-header"')
  })

  it('should have global-setup.ts file', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')

    const setupPath = path.resolve(
      process.cwd(),
      'tests/e2e/global-setup.ts'
    )

    const exists = await fs
      .access(setupPath)
      .then(() => true)
      .catch(() => false)

    expect(exists).toBe(true)

    // Verify it exports a default function
    const content = await fs.readFile(setupPath, 'utf-8')
    expect(content).toContain('export default globalSetup')
    expect(content).toContain('async function globalSetup')
  })

  it('should have playwright.config.ts updated with globalSetup', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')

    const configPath = path.resolve(process.cwd(), 'playwright.config.ts')

    const content = await fs.readFile(configPath, 'utf-8')

    // Verify globalSetup is configured
    expect(content).toContain('globalSetup:')
    expect(content).toContain('./tests/e2e/global-setup')
  })

  it('should have .auth directory created', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')

    const authPath = path.resolve(process.cwd(), 'tests/e2e/.auth')

    const exists = await fs
      .access(authPath)
      .then(() => true)
      .catch(() => false)

    expect(exists).toBe(true)
  })
})
