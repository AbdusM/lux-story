const fs = require('fs');
const path = require('path');

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Prepare the analysis context
function prepareAnalysisContext() {
  // Read key files
  const storyData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'grand-central-story.json'), 'utf8'));
  const storyEngine = fs.readFileSync(path.join(__dirname, '..', 'lib', 'story-engine.ts'), 'utf8').substring(0, 2000);
  const grandCentralState = fs.readFileSync(path.join(__dirname, '..', 'lib', 'grand-central-state.ts'), 'utf8').substring(0, 2000);
  
  // Calculate statistics
  const totalScenes = storyData.chapters.reduce((sum, ch) => sum + ch.scenes.length, 0);
  const chapter1Scenes = storyData.chapters[0]?.scenes.length || 0;
  const chapter2Scenes = storyData.chapters[1]?.scenes.length || 0;
  const chapter3Scenes = storyData.chapters[2]?.scenes.length || 0;
  
  // Sample scenes for analysis
  const sampleScenes = {
    opening: storyData.chapters[0]?.scenes[0],
    samuelIntro: storyData.chapters[0]?.scenes.find(s => s.speaker === 'Samuel'),
    mayaCrisis: storyData.chapters[1]?.scenes.find(s => s.text?.includes('failed')),
    birmingham: storyData.chapters[2]?.scenes.find(s => s.text?.includes('UAB'))
  };
  
  return {
    statistics: {
      totalScenes,
      chapter1Scenes,
      chapter2Scenes,
      chapter3Scenes,
      totalCharacters: ['Samuel', 'Maya', 'Devon', 'Jordan', 'Alex'].length,
      birminghamReferences: JSON.stringify(storyData).match(/Birmingham|UAB|Innovation Depot/g)?.length || 0
    },
    codeExcerpts: {
      storyEngine,
      grandCentralState
    },
    sampleScenes
  };
}

// Create the Gemini prompt
function createGeminiPrompt(context) {
  return `
# Comprehensive Analysis: Grand Central Terminus Career Exploration Platform

## Project Context
- **Purpose**: Career exploration tool for Birmingham youth (ages 16-24)
- **Grant**: $250K Birmingham Catalyze Challenge
- **Philosophy**: "Confident Complexity" - simple foundation, selective richness
- **Current State**: 173 scenes across 3 chapters, transformed from meditation app

## Statistical Overview
- Total Scenes: ${context.statistics.totalScenes}
- Chapter Distribution: Ch1(${context.statistics.chapter1Scenes}), Ch2(${context.statistics.chapter2Scenes}), Ch3(${context.statistics.chapter3Scenes})
- Main Characters: ${context.statistics.totalCharacters}
- Birmingham References: ${context.statistics.birminghamReferences}

## Code Architecture Sample
### Story Engine (TypeScript)
\`\`\`typescript
${context.codeExcerpts.storyEngine}
\`\`\`

## Narrative Samples
### Opening Scene
${JSON.stringify(context.sampleScenes.opening, null, 2)}

### Character Crisis Example
${JSON.stringify(context.sampleScenes.mayaCrisis, null, 2)}

## Analysis Request

### 1. TECHNICAL ASSESSMENT (10 points)
Evaluate:
- JSON-based narrative scalability
- TypeScript implementation quality
- State management robustness
- Mobile responsiveness approach
- Deployment readiness

### 2. NARRATIVE EFFECTIVENESS (10 points)
Evaluate:
- Train station metaphor clarity
- Character authenticity (Maya's medical crisis, etc.)
- Progression from mystical to practical
- Samuel's distinct voice with train terminology
- Choice-driven discovery vs exposition

### 3. BIRMINGHAM INTEGRATION (10 points)
Evaluate:
- Authenticity of local references (UAB, Innovation Depot)
- Real wage/program accuracy ($19-35/hour)
- Cultural sensitivity to Birmingham demographics
- Practical connection to actual opportunities
- Regional voice and terminology

### 4. USER EXPERIENCE (10 points)
Evaluate:
- Text presentation and breaking
- Character differentiation (emoji, colors)
- Choice clarity and weight
- Information retention design
- Mobile-first considerations

### 5. EDUCATIONAL VALUE (10 points)
Evaluate:
- Career value identification system
- Values-to-careers mapping validity
- Engagement for 17-year-olds
- Practical takeaway value
- Comparison to traditional career counseling

### 6. GRANT WORTHINESS (10 points)
Evaluate:
- Problem-solution fit for Birmingham
- Scalability to other cities
- Measurable impact potential
- Cost-effectiveness
- Innovation vs existing tools

## Critical Questions

1. **Fatal Flaw**: What one issue could kill grant funding?
2. **Unique Value**: What makes this better than a standard career quiz?
3. **Youth Engagement**: Will Birmingham teenagers actually complete this?
4. **Practical Outcome**: Does this lead to real career action?
5. **Cultural Fit**: Does this respect Birmingham's diverse communities?

## Required Verdict

### Numerical Scores (60 total)
- Technical: __/10
- Narrative: __/10
- Birmingham: __/10
- UX: __/10
- Educational: __/10
- Grant Worthy: __/10

### Final Recommendation
**FUND** / **REVISE** / **REJECT**

### Three Critical Changes
1. [Most urgent]
2. [Second priority]
3. [Third priority]

### One-Paragraph Summary
[Will this help Birmingham youth find careers? Why or why not?]
`;
}

// Main analysis function
async function runGeminiAnalysis() {
  console.log('Preparing analysis context...');
  const context = prepareAnalysisContext();
  
  console.log('\n📊 Project Statistics:');
  console.log(`   Total Scenes: ${context.statistics.totalScenes}`);
  console.log(`   Birmingham References: ${context.statistics.birminghamReferences}`);
  
  const prompt = createGeminiPrompt(context);
  
  // Save prompt for manual use if API key not available
  fs.writeFileSync(
    path.join(__dirname, '..', 'docs', 'GEMINI_ANALYSIS_REQUEST.md'),
    prompt
  );
  
  console.log('\n✅ Analysis prompt saved to docs/GEMINI_ANALYSIS_REQUEST.md');
  
  if (GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('\n⚠️  No API key found. Please set GEMINI_API_KEY environment variable.');
    console.log('   You can copy the prompt from docs/GEMINI_ANALYSIS_REQUEST.md');
    console.log('   and paste it into Google AI Studio: https://makersuite.google.com/');
    return;
  }
  
  console.log('\n🤖 Calling Gemini API...');
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    const result = await response.json();
    
    if (result.error) {
      console.error('❌ API Error:', result.error.message);
      return;
    }
    
    const analysis = result.candidates[0].content.parts[0].text;
    
    // Save analysis result
    fs.writeFileSync(
      path.join(__dirname, '..', 'docs', 'GEMINI_ANALYSIS_RESULT.md'),
      `# Gemini Analysis Results\n\nGenerated: ${new Date().toISOString()}\n\n${analysis}`
    );
    
    console.log('\n✨ Analysis complete! Results saved to docs/GEMINI_ANALYSIS_RESULT.md');
    console.log('\nKey findings preview:');
    console.log(analysis.substring(0, 500) + '...');
    
  } catch (error) {
    console.error('❌ Error calling Gemini:', error.message);
    console.log('\n💡 You can still use the prompt manually:');
    console.log('   1. Copy docs/GEMINI_ANALYSIS_REQUEST.md');
    console.log('   2. Visit https://makersuite.google.com/');
    console.log('   3. Paste and run the analysis');
  }
}

// Run the analysis
runGeminiAnalysis();