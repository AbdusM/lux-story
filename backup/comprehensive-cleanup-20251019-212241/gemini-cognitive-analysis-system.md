# Gemini 2.5 Pro Cognitive Behavioral Analysis System

## Overview

Complete system for analyzing UI/UX video recordings using Gemini 2.5 Pro from cognitive science and behavioral psychology perspectives. Provides comprehensive insights into cognitive load, attention mechanics, user engagement, and flow state optimization.

## System Components

### 1. Core Analysis Script
**File**: `scripts/gemini-cognitive-analysis.js`
- **Purpose**: Main cognitive behavioral analysis using Gemini 2.5 Pro
- **Framework**: Cognitive Load Theory + Behavioral Psychology + Flow State Research
- **Output**: Comprehensive markdown report with actionable recommendations

### 2. Video Compression Helper
**File**: `scripts/compress-video.js`
- **Purpose**: Compress videos to <20MB for Gemini API compatibility
- **Technology**: FFmpeg with optimized settings for UI content
- **Quality**: Maintains visual clarity while reducing file size

### 3. Workflow Automation
**File**: `scripts/run-analysis.sh`
- **Purpose**: Complete workflow automation with validation
- **Features**: File size checking, API key validation, error handling
- **Guidance**: Provides compression options when needed

### 4. Documentation
**File**: `scripts/README-cognitive-analysis.md`
- **Purpose**: Complete usage guide and troubleshooting
- **Coverage**: Setup, configuration, advanced usage, research background

## Cognitive Analysis Framework

### 1. Cognitive Load Assessment
- **Intrinsic Load**: Essential information processing requirements
- **Extraneous Load**: Distracting elements that waste cognitive resources  
- **Germane Load**: Meaningful engagement that builds understanding

### 2. Attention & Focus Mechanics
- Visual hierarchy effectiveness
- Attention guidance systems
- Cognitive switching costs analysis
- Flow state maintenance patterns

### 3. Behavioral Psychology Principles
- Operant conditioning patterns
- Habit formation support
- Motivation maintenance systems
- Decision fatigue management

### 4. Flow State Optimization
- Challenge-skill balance evaluation
- Immediate feedback quality assessment
- Goal clarity and progress indication analysis

### 5. Decision Architecture
- Choice overload prevention strategies
- Cognitive bias utilization analysis
- Decision fatigue impact assessment

## Usage Workflow

### Quick Start
```bash
# 1. Set up API key
export GEMINI_API_KEY="your_api_key_here"

# 2. Run complete analysis workflow
./scripts/run-analysis.sh "/path/to/your/video.mov"
```

### Manual Process
```bash
# 1. Check/compress video if needed
node scripts/compress-video.js "/path/to/video.mov"

# 2. Run cognitive analysis
node scripts/gemini-cognitive-analysis.js "/path/to/compressed-video.mp4"
```

## Output Example

### Quantified Metrics
- **Cognitive Load Distribution**: Intrinsic 60% | Extraneous 25% | Germane 15%
- **Attention Efficiency Score**: 8.1/10
- **Decision Fatigue Index**: 6.2/10
- **Flow State Probability**: 7.4/10
- **Engagement Sustainability**: 8.7/10

### Critical Findings Format
```markdown
1. **Typography Hierarchy** (Impact: 9/10)
   - Problem: Inconsistent font weights create cognitive switching costs
   - Solution: Standardize weight progression (400→500→600)
   - Priority: High
   - Expected Outcome: 15% reduction in cognitive load

2. **Choice Presentation** (Impact: 8/10)
   - Problem: Too many options presented simultaneously
   - Solution: Progressive disclosure with 2-3 initial choices
   - Priority: High
   - Expected Outcome: Improved decision quality, reduced fatigue
```

### Technical Implementation
- Specific CSS modifications
- Behavioral pattern adjustments
- A/B testing recommendations
- Measurement strategies

## Research Foundation

Based on established cognitive science research:
- **Cognitive Load Theory** (Sweller, 1988)
- **Flow Theory** (Csikszentmihalyi, 1990)
- **Attention Restoration Theory** (Kaplan, 1995)
- **Behavioral Design Principles** (Fogg, 2009)
- **Choice Architecture** (Thaler & Sunstein, 2008)

## Context-Specific Optimization

Pre-configured for your Grand Central Terminus game:
- **Target Audience**: Young adults (16-24) in Birmingham, UK
- **Interface Style**: Pokemon-style dialogue boxes with recent typography improvements
- **Use Case**: Narrative career exploration through story choices
- **Learning Objectives**: Career path discovery and skill identification

## File Preparation Guidelines

### Optimal Video Characteristics
- **Duration**: 30-120 seconds of clear UI interaction
- **Size**: Under 18MB (20MB hard limit)
- **Resolution**: 720p-1080p (balance quality vs file size)
- **Content**: Complete user workflows, not static screens
- **Interaction**: Real usage patterns, not staged demonstrations

### Compression Options

1. **QuickTime Player (macOS)**:
   - File > Export As... > 480p
   - Quick and effective for UI content

2. **FFmpeg (Technical)**:
   ```bash
   # Install FFmpeg
   brew install ffmpeg
   
   # Use our compression script
   node scripts/compress-video.js "/path/to/video.mov"
   ```

3. **Online Tools**:
   - [FreeConvert](https://www.freeconvert.com/video-compressor)
   - [Media.io](https://www.media.io/compress-video.html)

## API Requirements

### Gemini API Key
1. Get key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set environment variable: `export GEMINI_API_KEY="your_key"`
3. Verify with: `echo $GEMINI_API_KEY`

### Node.js Dependencies
```bash
npm install @google/generative-ai
```

## Expected Analysis Time

- **File Processing**: 30-60 seconds
- **Gemini Analysis**: 60-120 seconds
- **Report Generation**: 5-10 seconds
- **Total Workflow**: 2-3 minutes

## Quality Assurance

### Validation Checks
- ✅ File size under 20MB
- ✅ API key configured
- ✅ Video format supported
- ✅ Node.js dependencies installed

### Error Handling
- Clear error messages with solution guidance
- Automatic file size checking
- API key validation
- Graceful failure with next steps

## Results Integration

### Immediate Actions
1. Review **Critical Findings** for high-impact improvements
2. Implement **High Priority** recommendations first
3. Use **Technical Implementation Notes** for specific changes

### Continuous Improvement
1. Set up A/B tests based on recommendations
2. Measure cognitive metrics before/after changes
3. Iterate based on user behavior data

## System Benefits

### For Developers
- **Evidence-based decisions**: Cognitive science backing for UI choices
- **Prioritized improvements**: Impact scoring guides development effort
- **Technical specificity**: CSS and implementation details provided

### For UX Designers
- **Attention flow analysis**: See how users actually process information
- **Cognitive load optimization**: Balance complexity with usability
- **Behavioral insights**: Understand psychological impact of design choices

### For Product Managers
- **User engagement metrics**: Quantified engagement and retention factors
- **ROI guidance**: Effort-to-impact ratios for feature prioritization
- **Risk assessment**: Identify friction points affecting user goals

This comprehensive system transforms UI/UX analysis from subjective feedback to scientific, actionable insights based on cognitive behavioral research.