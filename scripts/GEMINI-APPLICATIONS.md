# Gemini-Powered Content Improvement Applications

This document describes three powerful Gemini AI applications for systematically improving Lux Story's content quality, consistency, and psychological effectiveness.

## Overview

All three applications leverage the robust `GeminiContentFramework` to provide:
- Automatic content extraction and analysis
- AI-powered improvements with validation
- Confidence scoring and quality checks
- Batch processing with rate limiting
- Automatic backups before modifications
- Detailed reporting

## Prerequisites

1. **API Key**: Ensure `GEMINI_API_KEY` is set in `.env.local`
2. **Dependencies**: Install required packages:
   ```bash
   npm install @google/generative-ai dotenv
   ```

## Application 1: Choice Calibration

### Purpose
Ensures every choice in the game clearly maps to one of four behavioral patterns, improving the accuracy of the invisible metrics system.

### Script
`scripts/run-choice-calibration.ts`

### Run Command
```bash
npx tsx scripts/run-choice-calibration.ts
```

### What It Does
1. Extracts all scenes with choices from `useSimpleGame.ts`
2. Analyzes each choice set for pattern clarity
3. Ensures all four patterns are represented when possible
4. Refines ambiguous or redundant choices
5. Maintains character voice and game tone

### Patterns Tracked
- **Analytical**: Logic-based, data-driven thinking
- **Helping**: People-focused, supportive, empathetic
- **Building**: Creative, hands-on, systems-oriented
- **Patience**: Thoughtful, observational, long-term view

### Output
- Modified `useSimpleGame.ts` with calibrated choices
- `choice-calibration-report.txt` with detailed analysis

## Application 2: Adaptive Content Generation

### Purpose
Creates a library of anxiety-reducing narrative snippets that respond to different player psychological states.

### Script
`scripts/generate-adaptive-content.ts`

### Run Command
```bash
npx tsx scripts/generate-adaptive-content.ts
```

### What It Does
1. Generates calming snippets for four emotional states
2. Creates Birmingham-specific affirmations
3. Includes sensory details and character wisdom
4. Outputs JSON library for runtime integration

### Emotional States Supported
- **Anxious**: Player showing signs of overwhelm
- **Exploring**: Player actively discovering paths
- **Confident**: Player making decisive choices
- **Struggling**: Player needs encouragement

### Output
- `data/adaptive-snippets.json` - Complete snippet library
- `adaptive-content-report.md` - Human-readable report

### Integration Example
```typescript
// In your game logic
import snippets from '../data/adaptive-snippets.json'

function getAdaptiveMessage(playerState: string): string {
  const relevant = snippets.snippets.filter(s => s.state === playerState)
  return relevant[Math.floor(Math.random() * relevant.length)].content
}
```

## Application 3: Character Voice Audit

### Purpose
Maintains consistent character voices across all dialogue, ensuring each character sounds authentic throughout the game.

### Script
`scripts/run-voice-audit.ts`

### Run Command
```bash
npx tsx scripts/run-voice-audit.ts
```

### What It Does
1. Extracts all character dialogue from the game
2. Compares each line against character profiles
3. Adjusts dialogue that doesn't match voice patterns
4. Preserves meaning while fixing delivery

### Character Profiles
- **Devon Kumar**: Analytical, systematic, socially awkward
- **Maya Chen**: Empathetic, driven, conflicted
- **Samuel Washington**: Wise, calming, observational
- **Jordan Packard**: Experienced, searching, honest

### Output
- Modified `useSimpleGame.ts` with consistent voices
- `voice-audit-report.md` with character analysis

## Running All Applications

### Recommended Order
1. **Choice Calibration** - Improves core mechanics
2. **Voice Audit** - Ensures narrative consistency
3. **Adaptive Content** - Generates new supportive content

### Batch Execution Script
```bash
#!/bin/bash
# run-all-gemini.sh

echo "🚀 Running Gemini Content Improvements..."

echo "\n📊 Step 1: Choice Calibration"
npx tsx scripts/run-choice-calibration.ts

echo "\n🎭 Step 2: Voice Consistency Audit"
npx tsx scripts/run-voice-audit.ts

echo "\n💚 Step 3: Adaptive Content Generation"
npx tsx scripts/generate-adaptive-content.ts

echo "\n✅ All improvements complete!"
```

## Rate Limiting Considerations

The free Gemini API tier allows:
- 10 requests per minute
- 1,000 requests per day

All scripts include:
- Batch processing (3-5 items per batch)
- Delays between batches (1-2 seconds)
- Progress indicators
- Graceful handling of rate limits

## Backup and Recovery

All scripts that modify files:
1. Create timestamped backups before changes
2. Validate improvements before applying
3. Report all changes made

Backup files are named: `[original-name].backup-[timestamp].ts`

## Quality Assurance

Each application includes:
- **Validation Rules**: Ensure improvements meet quality standards
- **Confidence Scoring**: Only apply high-confidence changes
- **Skip Logic**: Avoid processing already-optimized content
- **Detailed Reports**: Track all changes and issues

## Customization

### Adjusting Confidence Thresholds
In any script, modify the `minConfidence` parameter:
```typescript
await applyImprovements(filePath, improvements, {
  minConfidence: 0.8, // Increase for more conservative changes
  createBackup: true
})
```

### Modifying Batch Sizes
Adjust for your API tier:
```typescript
await batchProcess(items, processor, {
  batchSize: 5,    // Increase if you have higher rate limits
  delayMs: 1000,    // Decrease for faster processing
})
```

## Troubleshooting

### Common Issues

1. **Rate Limiting**
   - Error: `Rate limited. Retry after X seconds`
   - Solution: Reduce batch size or increase delays

2. **API Key Missing**
   - Error: `GEMINI_API_KEY not found`
   - Solution: Add key to `.env.local`

3. **Parsing Errors**
   - Error: `No scenes found`
   - Solution: Check regex patterns match your file format

4. **Low Confidence Results**
   - Warning: `Low confidence for scene X`
   - Solution: Review and adjust validation rules

## Future Enhancements

Potential additions to the framework:
1. **Difficulty Calibration**: Adjust challenge based on player performance
2. **Emotion Detection**: Analyze player choices for emotional state
3. **Dynamic Story Generation**: Create new scenes based on player patterns
4. **Personalized Endings**: Generate unique conclusions for each playthrough

## Support

For issues or questions:
1. Check script output logs for detailed error messages
2. Review backup files if changes need reverting
3. Consult the generated reports for analysis details

---

*These Gemini applications transform Lux Story from a static narrative into an intelligent, responsive experience that adapts to each player's psychological needs and exploration style.*