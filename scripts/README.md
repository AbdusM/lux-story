# Scripts Directory

This directory contains all utility, test, and migration scripts for the Birmingham Career Exploration project.

## Script Organization

### Testing Scripts
- **test-supabase-connection.ts** - Validates Supabase client configuration
- **test-http-basic.js** - Basic HTTP/UX testing without browser automation
- **test-ux-puppeteer.js** - Comprehensive Puppeteer-based UX testing
- **test-admin-api.ts** - Admin dashboard API endpoint testing
- **test-dual-write-consistency.ts** - Database dual-write validation
- **test-maya-vertical-slice.ts** - Maya character narrative testing
- **test-ui-analyzer.js** - UI/UX analysis tools

### Data Management Scripts
- **generate-test-user.ts** - Creates test user data
- **seed-test-urgency-data.ts** - Seeds urgency calculation test data
- **cleanup-test-urgency-data.ts** - Cleans up test data
- **debug-test-data.ts** - Debugging tools for test data

### Content & Narrative Scripts
- **audit-scenes.js** - Scene data integrity auditor
- **validate-story.js** - Story flow validation
- **story-validator.ts** - Comprehensive story validation
- **narrative-audit.ts** - Narrative consistency checks
- **choice-pattern-audit.ts** - Choice quality analysis

### Fix & Migration Scripts
(Historical - most one-time migrations have been completed)
- **fix-dialogue-systematically.ts** - Dialogue formatting fixes
- **fix-broken-navigation.js** - Navigation flow repairs
- **fix-maya-crisis.js** - Maya character crisis scene fixes
- **fix-mobile-text-presentation.js** - Mobile readability improvements

### Birmingham Integration
- **birmingham-integration-optimizer.ts** - Birmingham career context optimization
- **complete-birmingham-grounding.js** - Local opportunity integration

### AI & Analytics
- **gemini-*.js** - Gemini AI-powered analysis tools (character, crisis, skills, trust)
- **choice-quality-enhancer.ts** - AI-powered choice improvement
- **generate-adaptive-content.ts** - Dynamic content generation

## Running Scripts

Most scripts can be run directly with Node or tsx:

```bash
# TypeScript scripts
npx tsx scripts/test-supabase-connection.ts

# JavaScript scripts  
node scripts/audit-scenes.js

# With environment variables
NODE_ENV=development node scripts/test-http-basic.js
```

## Recent Cleanup (October 2025)

**Removed from root directory:**
- All empty test/fix scripts (10 files)
- Duplicate Supabase connection tests
- Obsolete user migration scripts

**Moved to scripts directory:**
- audit-scenes.js
- simple-test.js → test-http-basic.js
- ux-test.js → test-ux-puppeteer.js

## Best Practices

1. **New Scripts**: Always place in `/scripts` directory, not project root
2. **Naming**: Use descriptive prefixes (test-, fix-, generate-, validate-)
3. **One-Time Migrations**: Document completion date and archive if needed
4. **Documentation**: Add script purpose as header comment
5. **Environment**: Use dotenv for environment variables

## Script Categories

- **test-*** - Testing and validation
- **fix-*** - One-time fixes and migrations (historical)
- **generate-*** - Data generation utilities
- **validate-*** - Validation and auditing
- **gemini-*** - AI-powered analysis and generation
- **audit-*** - System audits and reports
