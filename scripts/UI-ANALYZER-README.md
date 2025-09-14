# UI/UX Analyzer for Birmingham Youth Career Game

A comprehensive Node.js script that uses Google Gemini 2.0 Flash API to analyze game UI/UX screenshots with a focus on Birmingham youth career exploration through interactive fiction.

## Features

- **Vision-based Analysis**: Uses Gemini 2.0 Flash to analyze actual screenshot images
- **Youth-Focused Evaluation**: Tailored for Birmingham teens (ages 16-24)
- **Comprehensive Scoring**: 100-point evaluation across 4 key areas
- **Mobile-First Assessment**: Prioritizes mobile usability and accessibility
- **Narrative Game UX**: Specialized evaluation for interactive fiction interfaces
- **Batch Processing**: Analyze multiple screenshots at once
- **Detailed Recommendations**: Specific, actionable improvement suggestions

## Installation & Setup

1. **Prerequisites**: Node.js (v14 or later)

2. **API Key**: The script includes the Gemini API key, but you can override it:
   ```bash
   export GEMINI_API_KEY="your-key-here"
   ```

3. **Make executable** (already done):
   ```bash
   chmod +x scripts/ui-ux-analyzer.js
   ```

## Usage

### Analyze Single Screenshot

```bash
node scripts/ui-ux-analyzer.js /path/to/screenshot.png "Optional description"
```

**Example:**
```bash
node scripts/ui-ux-analyzer.js ./screenshot.png "Game interface with narrative text blocks"
```

### Batch Analysis

```bash
node scripts/ui-ux-analyzer.js batch /path/to/screenshots/ "Optional description"
```

**Example:**
```bash
node scripts/ui-ux-analyzer.js batch ./ui-screenshots/ "Various game interface states"
```

### Test the Setup

```bash
node scripts/test-ui-analyzer.js
```

## Analysis Framework

The script evaluates UI screenshots across four key areas:

### 1. Visual Hierarchy & Readability (25 points)
- Text legibility and contrast ratios
- Information architecture and content organization  
- Visual flow and eye movement patterns
- Typography choices (size, weight, spacing)
- Use of whitespace and visual breathing room
- Color accessibility for diverse users

### 2. User Engagement Factors (25 points)
- Emotional resonance and narrative immersion
- Call-to-action clarity and prominence
- Visual interest without distraction
- Progression indicators and user orientation
- Interactive element affordances
- Age-appropriate design for 16-24 demographic

### 3. Narrative Game UX Best Practices (25 points)
- Story text presentation and pacing
- Character voice differentiation
- Choice presentation and decision clarity
- Narrative flow and continuity
- Balance between reading and interaction
- Immersion vs. usability trade-offs

### 4. Mobile Usability (25 points)
- Touch target sizes (44px minimum recommended)
- Thumb-friendly interaction zones
- Portrait orientation optimization
- Text scaling and responsive layout
- One-handed usability considerations
- Performance implications

## Output Files

All analysis results are saved in the `docs/` directory:

- **Individual Analysis**: `UI_ANALYSIS_RESULT_[timestamp].md`
- **Batch Summary**: `UI_ANALYSIS_BATCH_SUMMARY.md`
- **Analysis Prompt**: `UI_ANALYSIS_PROMPT.md`

## Sample Interface Analysis

Based on your description, the script will analyze:

```
Interface Elements:
- Dark background with centered white card
- Three narrative text blocks about finding a letter
- Text: "You found a letter under your door this morning..."
- Text: "Your future awaits at Platform 7. Midnight. Don't be late."
- Text: "You have one year before everything changes. Choose wisely. - Future You"
- Blue "Continue" button at bottom
- Clean, minimal design with good spacing
- Mobile-friendly responsive layout
```

## Example Analysis Output

```markdown
## Overall UI/UX Score: 78/100

### HIGH IMPACT (Must Fix)
1. Increase contrast ratio for better accessibility (WCAG compliance)
2. Expand touch target size for Continue button (current appears < 44px)

### MEDIUM IMPACT (Should Fix)  
3. Add visual hierarchy between message blocks
4. Include progress indicator for narrative flow

### LOW IMPACT (Nice to Have)
5. Consider subtle animations for engagement
6. Add skip/speed options for repeat users
```

## Birmingham Youth Focus

The analysis specifically considers:

- **Local Relevance**: Connection to Birmingham culture and opportunities
- **Age Appropriateness**: Design patterns familiar to 16-24 demographic  
- **Career Integration**: How well the UI supports career exploration goals
- **Cultural Sensitivity**: Inclusive design for diverse Birmingham communities
- **Mobile Priority**: Birmingham youth primarily use mobile devices

## Competitive Context

The script compares your interface against:

- **Career Assessment Tools**: 16personalities, MyPlan.com
- **Narrative Games**: Twine games, interactive fiction platforms
- **Youth-Focused Apps**: Discord, TikTok UI patterns
- **Educational Platforms**: Modern learning app interfaces

## Troubleshooting

### Common Issues

1. **Image Not Found**: Ensure file path is correct and image exists
2. **API Error**: Check internet connection and API key
3. **Large File**: Images must be under 20MB
4. **Format Issues**: Use PNG, JPEG, GIF, or WebP formats

### Support

- Check `docs/UI_ANALYSIS_PROMPT.md` for manual analysis
- Review individual result files for detailed feedback
- Use batch summary for overview across multiple screens

## Technical Details

- **API**: Google Gemini 2.0 Flash with vision capabilities
- **Supported Formats**: PNG, JPEG, GIF, WebP (under 20MB)
- **Rate Limiting**: 2-second delay between batch analyses
- **Safety Settings**: Content filtering enabled for appropriate analysis

## Next Steps

1. **Analyze Current Screenshots**: Run the script on your game interfaces
2. **Prioritize Changes**: Focus on HIGH IMPACT recommendations first
3. **Test with Users**: Validate improvements with Birmingham youth
4. **Iterate**: Re-analyze after implementing changes
5. **Monitor**: Track user engagement improvements

---

**Created for**: Birmingham Youth Career Exploration Game  
**Focus**: Interactive Fiction UI/UX Optimization  
**Target Demographic**: Ages 16-24, Birmingham area  
**Analysis Model**: Gemini 2.0 Flash Vision API