# Typewriter Effect Analysis & Compliance System

## Overview

This system uses **Gemini AI** to continuously analyze our codebase and ensure typewriter effects follow the **7±2 cognitive chunks principle** throughout the entire narrative experience.

## Problem Solved

- **Manual oversight**: Developers accidentally adding typewriter to medium/long content
- **Inconsistent application**: Rules not being followed across the entire story
- **Scale issues**: Hard to manually check hundreds of story scenes
- **Cognitive load violations**: Slowing down users when they can process info instantly

## Scripts Created

### 1. `scripts/gemini-typewriter-analysis.js`
**Deep AI-powered analysis of entire codebase**

```bash
# Run comprehensive analysis
npm run analyze-typewriter

# Set API key first
export GEMINI_API_KEY=your_key_here
```

**What it analyzes:**
- ✅ Rule compliance in `shouldUseTypewriter()` function
- ✅ Story content that violates 7±2 chunks principle  
- ✅ Hardcoded typewriter values bypassing rules
- ✅ Implementation gaps and scalability issues
- ✅ Performance impact on user flow

**Output:** Detailed report saved to `analysis/typewriter-compliance-[timestamp].md`

### 2. `scripts/check-typewriter-compliance.js` 
**Fast automated checker for CI/CD**

```bash
# Quick compliance check
npm run check-typewriter
```

**What it checks:**
- ❌ Hardcoded `typewriter: true` outside of rules
- ❌ Missing `shouldUseTypewriter()` usage
- ❌ Missing MESSAGE_TYPES.md documentation
- ✅ Exits with error code if violations found

### 3. Pre-commit Hook
**Prevents violations from being committed**

```bash
# Automatically runs on commit
npm run precommit

# Or manually
npm run check-typewriter && npm run lint
```

## Current Rules (Enforced)

### ✅ Typewriter ONLY for:
- **Pure letter/note content**: >85% quoted AND >20 characters
- **Example**: `"Your future awaits at Platform 7. Midnight."`

### ❌ Instant for EVERYTHING else:
- **Descriptions**: `"You found a letter under your door"`
- **Context**: `"At the bottom of the letter:"`
- **All dialogue**: Character conversations
- **All narration**: Scene descriptions
- **User choices**: Player selections

## Integration Workflow

### During Development:
1. Write story content normally
2. Run `npm run analyze-typewriter` to check compliance
3. Fix any violations identified by Gemini
4. Commit (pre-commit hook runs automatically)

### In CI/CD Pipeline:
```yaml
# Add to GitHub Actions / CI pipeline
- name: Check Typewriter Compliance
  run: npm run check-typewriter
```

### For Content Reviews:
```bash
# Generate full analysis report
npm run analyze-typewriter

# Review output in analysis/ directory
# Make recommended changes
# Re-run to verify fixes
```

## Benefits

### 🎯 **Cognitive Science Compliance**
- Ensures 7±2 chunks principle throughout entire story
- Prevents accidental user flow disruption
- Maintains optimal reading pace

### 🔄 **Scalable Quality Assurance** 
- AI analyzes entire codebase automatically
- Catches violations before users see them
- Scales to hundreds of story scenes

### 🚀 **Developer Experience**
- Clear rules documented in MESSAGE_TYPES.md
- Automated checks prevent mistakes
- Pre-commit hooks catch issues early

### 📊 **Performance Monitoring**
- Identifies narrative pace problems
- Highlights cognitive load violations  
- Provides actionable improvement recommendations

## File Structure

```
scripts/
├── gemini-typewriter-analysis.js     # Deep AI analysis
└── check-typewriter-compliance.js   # Fast automated check

analysis/
└── typewriter-compliance-*.md        # Analysis reports

MESSAGE_TYPES.md                      # Rule documentation
README-TYPEWRITER-ANALYSIS.md         # This guide
```

## Example Analysis Output

```
✅ COMPLIANCE STATUS: 8/10
- shouldUseTypewriter() logic correctly implemented
- 7±2 cognitive chunks principle followed
- User choices properly set to instant

⚠️ ISSUES FOUND:
- Scene 2-5a: Long narration (150+ chars) using typewriter
- GameInterface.tsx:245: Hardcoded typewriter: true found

🔧 RECOMMENDATIONS:
- Split long descriptions into smaller chunks
- Remove hardcoded typewriter in choice handling
- Consider adding buttonText variety for scene 3-2b

📊 STORY CONTENT AUDIT:
- 3 scenes should use typewriter (letter content)
- 247 scenes should be instant
- 0 problematic mixed content found
```

## Getting Started

```bash
# 1. Set up Gemini API key
export GEMINI_API_KEY=your_key_here

# 2. Run initial analysis
npm run analyze-typewriter

# 3. Review output and make recommended changes

# 4. Set up pre-commit hook
npm run precommit

# 5. Add CI check to your pipeline
```

This system ensures the **7±2 cognitive chunks principle** is maintained throughout the entire narrative experience, preventing the typewriter effect issues we keep encountering.