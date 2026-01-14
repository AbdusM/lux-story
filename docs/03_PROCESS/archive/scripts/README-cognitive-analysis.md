# Gemini 2.5 Pro Cognitive Behavioral UI/UX Analysis

## Overview

This script analyzes video recordings of user interfaces using Gemini 2.5 Pro from a cognitive science and behavioral psychology perspective. It provides comprehensive insights into cognitive load, attention mechanics, and user engagement optimization.

## Setup

### 1. Install Dependencies
```bash
npm install @google/generative-ai
```

### 2. Set API Key
Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey) and set it as an environment variable:

```bash
export GEMINI_API_KEY="your_api_key_here"
```

### 3. Verify Video File
- Supported formats: `.mov`, `.mp4`, `.avi`, `.mkv`, `.webm`
- File size limit: 20MB (Gemini API restriction)
- Ensure video shows clear UI interactions

## Usage

### Basic Usage (Default Video Path)
```bash
node scripts/gemini-cognitive-analysis.js
```
This will analyze `/Users/abdusmuwwakkil/Documents/testrun01.mov`

### Custom Video Path
```bash
node scripts/gemini-cognitive-analysis.js "/path/to/your/video.mov"
```

### Example Output
```
🎯 Gemini 2.5 Pro Cognitive Behavioral Analysis
🔬 Framework: Cognitive Load + Attention + Behavioral Psychology + Flow State
================================================================================
🧠 Starting Cognitive Behavioral UI/UX Analysis...
📹 Video: /Users/abdusmuwwakkil/Documents/testrun01.mov
📊 File size: 15.32 MB
🔄 Converting video to base64...
🤖 Sending to Gemini 2.5 Pro for analysis...
⏳ This may take 30-60 seconds for comprehensive cognitive analysis...
✅ Analysis complete!
📄 Analysis saved to: cognitive-analysis-testrun01-2025-09-13T15-30-45-123Z.md
```

## Analysis Framework

The script evaluates your UI through five major cognitive science dimensions:

### 1. Cognitive Load Assessment
- **Intrinsic Load**: Essential information processing requirements
- **Extraneous Load**: Distracting elements that waste cognitive resources
- **Germane Load**: Meaningful engagement that builds understanding

### 2. Attention & Focus Mechanics
- Visual hierarchy effectiveness
- Attention guidance systems
- Cognitive switching costs analysis

### 3. Behavioral Psychology Principles
- Operant conditioning patterns
- Habit formation support
- Motivation maintenance systems

### 4. Flow State Optimization
- Challenge-skill balance
- Immediate feedback quality
- Goal clarity and progress indication

### 5. Decision Architecture
- Choice overload prevention
- Cognitive bias utilization
- Decision fatigue management

## Output Structure

The analysis provides:

- **Executive Summary**: High-level cognitive assessment
- **Critical Findings**: Top 5 most impactful UI elements
- **Specific Recommendations**: Actionable improvements with implementation priority
- **Cognitive Metrics Dashboard**: Quantified scores and ratings
- **Technical Implementation Notes**: CSS/design changes and A/B testing suggestions

## Key Metrics Provided

- **Cognitive Load Distribution** (Intrinsic/Extraneous/Germane %)
- **Attention Efficiency Score** (1-10)
- **Decision Fatigue Index** (1-10)
- **Flow State Probability** (1-10)
- **Engagement Sustainability Rating** (1-10)

## Context-Specific Analysis

The script is pre-configured to understand that your interface is:
- A narrative career exploration game
- Target audience: Young adults (16-24) in Birmingham, UK
- Uses Pokemon-style dialogue boxes
- Recent improvements to typography and visual hierarchy

## Troubleshooting

### Common Issues

1. **"Gemini API key not found"**
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

2. **"Video file too large"**
   - Compress video to under 20MB
   - Use tools like HandBrake or FFmpeg

3. **"Video file not found"**
   - Check file path is correct
   - Ensure video file exists and is readable

4. **Module import errors**
   - Ensure you're using Node.js 14+ with ES modules support
   - Install dependencies: `npm install @google/generative-ai`

### Video Optimization Tips

For best analysis results:
- **Duration**: 30-120 seconds of clear UI interaction
- **Quality**: HD resolution preferred, but balance with file size
- **Content**: Show complete user workflows, not just static screens
- **Focus**: Capture real usage patterns, not staged demonstrations

## Advanced Usage

### Custom Analysis Prompts
You can modify the `COGNITIVE_ANALYSIS_PROMPT` constant in the script to:
- Focus on specific cognitive aspects
- Add domain-specific analysis criteria
- Incorporate your own research questions

### Batch Processing
For multiple videos:
```bash
for video in *.mov; do
  node scripts/gemini-cognitive-analysis.js "$video"
done
```

## Research Background

This analysis framework is based on established cognitive science research:

- **Cognitive Load Theory** (Sweller, 1988)
- **Flow Theory** (Csikszentmihalyi, 1990)
- **Attention Restoration Theory** (Kaplan, 1995)
- **Behavioral Design Principles** (Fogg, 2009)
- **Choice Architecture** (Thaler & Sunstein, 2008)

The script translates academic research into practical UI/UX recommendations for immediate implementation.

## Output Example Structure

```markdown
# Cognitive Behavioral UI/UX Analysis Report

## Executive Summary
- Overall Cognitive Load: 7.2/10 (Moderate-High)
- Attention Flow Efficiency: 8.1/10 (Good)
- Flow State Probability: 6.8/10 (Moderate)

## Critical Findings
1. **Typography Hierarchy** (Impact: 9/10)
   - Problem: Inconsistent font weights create cognitive switching costs
   - Solution: Standardize weight progression (400→500→600)
   - Priority: High

[... continued detailed analysis ...]
```

This provides both academic rigor and practical implementation guidance for optimizing your UI from a cognitive science perspective.