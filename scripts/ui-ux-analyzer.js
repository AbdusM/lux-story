const fs = require('fs');
const path = require('path');

// Gemini API configuration for vision analysis
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required');
  console.error('💡 Add it to your .env.local file');
  process.exit(1);
}
const GEMINI_FLASH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

/**
 * UI/UX Analysis Script for Birmingham Youth Career Exploration Game
 * 
 * This script analyzes game UI screenshots using Gemini 2.0 Flash API to evaluate:
 * - Visual hierarchy and readability
 * - User engagement factors
 * - Narrative game UX best practices
 * - Mobile usability
 * - Specific improvement recommendations
 */

// Convert image file to base64 for API
function imageToBase64(imagePath) {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image file not found: ${imagePath}`);
  }
  
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
}

// Get MIME type from file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'image/jpeg';
}

// Create comprehensive analysis prompt for UI/UX evaluation
function createUIAnalysisPrompt(description = '') {
  return `# UI/UX Analysis: Birmingham Youth Career Exploration Game

## Context
You are analyzing a game interface for a career exploration platform targeting Birmingham youth (ages 16-24). This is an interactive fiction game that helps young people discover career paths through storytelling and choice-driven experiences.

## Game Description (provided by developer):
${description}

## Analysis Framework

Please analyze this UI screenshot across these key areas:

### 1. VISUAL HIERARCHY & READABILITY (25 points)
**Evaluate:**
- Text legibility and contrast ratios
- Information architecture and content organization  
- Visual flow and eye movement patterns
- Typography choices (size, weight, spacing)
- Use of whitespace and visual breathing room
- Color accessibility for diverse users
- Content chunking and scanability

**Score: __/25**

### 2. USER ENGAGEMENT FACTORS (25 points)
**Evaluate:**
- Emotional resonance and narrative immersion
- Call-to-action clarity and prominence
- Visual interest without distraction
- Progression indicators and user orientation
- Interactive element affordances
- Motivation to continue/explore further
- Age-appropriate design language for 16-24 demographic

**Score: __/25**

### 3. NARRATIVE GAME UX BEST PRACTICES (25 points)
**Evaluate:**
- Story text presentation and pacing
- Character voice differentiation (if applicable)
- Choice presentation and decision clarity
- Narrative flow and continuity
- Context preservation between screens
- Balance between reading and interaction
- Immersion vs. usability trade-offs

**Score: __/25**

### 4. MOBILE USABILITY (25 points)
**Evaluate:**
- Touch target sizes (minimum 44px recommended)
- Thumb-friendly interaction zones
- Portrait orientation optimization
- Text scaling and responsive layout
- Scrolling behavior and content organization
- One-handed usability considerations
- Performance implications of visual design

**Score: __/25**

## Critical Analysis Questions

Answer these specific questions:

1. **First Impression**: What's the immediate emotional response this interface creates?

2. **Clarity**: Can a 17-year-old understand what to do next without explanation?

3. **Accessibility**: Are there any barriers for users with disabilities or different devices?

4. **Birmingham Youth Appeal**: Does this feel relevant and engaging for local young people?

5. **Career Connection**: How does this interface support career exploration goals?

## Specific Improvement Recommendations

Provide 5-7 concrete, actionable recommendations ranked by impact:

### HIGH IMPACT (Must Fix)
1. [Specific change with rationale]
2. [Specific change with rationale]

### MEDIUM IMPACT (Should Fix)
3. [Specific change with rationale]
4. [Specific change with rationale]

### LOW IMPACT (Nice to Have)
5. [Specific change with rationale]
6. [Specific change with rationale]
7. [Specific change with rationale]

## Technical Implementation Notes

For each major recommendation, provide:
- CSS/styling approach
- Responsive design considerations  
- Accessibility attributes needed
- Performance implications

## Competitive Analysis Context

Compare against:
- **Career assessment tools** (16personalities, MyPlan.com)
- **Narrative games** (Twine games, interactive fiction)
- **Youth-focused apps** (Discord, TikTok UI patterns)

## Final Verdict

### Overall UI/UX Score: __/100

### One-Sentence Summary:
[Will this interface effectively engage Birmingham youth in career exploration?]

### Top 3 Priorities:
1. [Most critical change needed]
2. [Second priority change]  
3. [Third priority change]

---

**Analysis Instructions:**
- Be specific and actionable in recommendations
- Consider the unique needs of Birmingham youth demographic
- Balance storytelling immersion with usability
- Prioritize mobile-first accessibility
- Focus on career exploration effectiveness
- Provide measurable improvement suggestions where possible`;
}

// Analyze a screenshot with Gemini 2.0 Flash
async function analyzeScreenshot(imagePath, description = '') {
  console.log(`📸 Analyzing UI screenshot: ${imagePath}`);
  
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Image file not found: ${imagePath}`);
    return null;
  }
  
  try {
    // Convert image to base64
    const imageData = imageToBase64(imagePath);
    const mimeType = getMimeType(imagePath);
    
    const prompt = createUIAnalysisPrompt(description);
    
    // Save prompt for manual use if needed
    const promptPath = path.join(__dirname, '..', 'docs', 'UI_ANALYSIS_PROMPT.md');
    fs.writeFileSync(promptPath, prompt);
    console.log(`📝 Analysis prompt saved to: ${promptPath}`);
    
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      console.log('\n⚠️  No API key found. Please set GEMINI_API_KEY environment variable.');
      console.log('   Or use the provided key in the script.');
      console.log(`   Prompt saved to: ${promptPath}`);
      return null;
    }
    
    console.log('\n🤖 Calling Gemini 2.0 Flash API for vision analysis...');
    
    const response = await fetch(`${GEMINI_FLASH_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageData
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.error) {
      console.error('❌ API Error:', result.error.message);
      return null;
    }
    
    if (!result.candidates || result.candidates.length === 0) {
      console.error('❌ No analysis results returned from API');
      return null;
    }
    
    const analysis = result.candidates[0].content.parts[0].text;
    
    // Save analysis result with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultPath = path.join(__dirname, '..', 'docs', `UI_ANALYSIS_RESULT_${timestamp}.md`);
    
    const fullResult = `# UI/UX Analysis Results

**Generated:** ${new Date().toISOString()}
**Image Analyzed:** ${path.basename(imagePath)}
**Analysis Model:** Gemini 2.0 Flash

## Developer Description
${description || 'No description provided'}

---

${analysis}

---

## Technical Details
- **Image Path:** ${imagePath}
- **Image Size:** ${fs.statSync(imagePath).size} bytes
- **MIME Type:** ${mimeType}
- **Analysis Duration:** Complete
`;
    
    fs.writeFileSync(resultPath, fullResult);
    
    console.log(`\n✨ Analysis complete! Results saved to: ${resultPath}`);
    console.log('\n📊 Key findings preview:');
    console.log(analysis.substring(0, 800) + '...\n');
    
    return {
      analysis,
      resultPath,
      promptPath,
      imagePath
    };
    
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Check image file exists and is readable');
    console.log('   2. Verify API key is correct');
    console.log('   3. Ensure image is under 20MB');
    console.log('   4. Try different image format (PNG, JPEG)');
    return null;
  }
}

// Batch analyze multiple screenshots
async function batchAnalyze(imageDirectory, description = '') {
  console.log(`🔍 Scanning directory for images: ${imageDirectory}`);
  
  if (!fs.existsSync(imageDirectory)) {
    console.error(`❌ Directory not found: ${imageDirectory}`);
    return;
  }
  
  const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const imageFiles = fs.readdirSync(imageDirectory)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedFormats.includes(ext);
    })
    .map(file => path.join(imageDirectory, file));
  
  if (imageFiles.length === 0) {
    console.log('📭 No supported image files found in directory');
    console.log(`   Supported formats: ${supportedFormats.join(', ')}`);
    return;
  }
  
  console.log(`📸 Found ${imageFiles.length} images to analyze`);
  
  const results = [];
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imagePath = imageFiles[i];
    console.log(`\n[${i + 1}/${imageFiles.length}] Processing: ${path.basename(imagePath)}`);
    
    const result = await analyzeScreenshot(imagePath, description);
    if (result) {
      results.push(result);
    }
    
    // Add delay between requests to be respectful to the API
    if (i < imageFiles.length - 1) {
      console.log('⏳ Waiting 2 seconds before next analysis...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Create summary report
  if (results.length > 0) {
    const summaryPath = path.join(__dirname, '..', 'docs', 'UI_ANALYSIS_BATCH_SUMMARY.md');
    const timestamp = new Date().toISOString();
    
    let summary = `# Batch UI/UX Analysis Summary

**Generated:** ${timestamp}
**Images Analyzed:** ${results.length}
**Directory:** ${imageDirectory}

## Analysis Results

`;
    
    results.forEach((result, index) => {
      summary += `### ${index + 1}. ${path.basename(result.imagePath)}
- **Result File:** ${path.basename(result.resultPath)}
- **Status:** Complete ✅

`;
    });
    
    summary += `
## Next Steps

1. Review individual analysis files in the docs/ directory
2. Prioritize recommendations by impact level
3. Create implementation plan for high-impact changes
4. Test improvements with Birmingham youth focus groups
5. Iterate based on user feedback

## File Locations

All analysis files are saved in: \`docs/\`
- Individual results: \`UI_ANALYSIS_RESULT_*.md\`
- Analysis prompt: \`UI_ANALYSIS_PROMPT.md\`
- This summary: \`UI_ANALYSIS_BATCH_SUMMARY.md\`
`;
    
    fs.writeFileSync(summaryPath, summary);
    console.log(`\n📋 Batch summary saved to: ${summaryPath}`);
  }
  
  return results;
}

// Command-line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎨 UI/UX Analysis Tool for Birmingham Youth Career Game

Usage:
  node ui-ux-analyzer.js <image_path> [description]
  node ui-ux-analyzer.js batch <directory> [description]

Examples:
  # Analyze single screenshot
  node ui-ux-analyzer.js /path/to/screenshot.png "Game interface with narrative text"
  
  # Analyze all images in directory  
  node ui-ux-analyzer.js batch ./screenshots "Game UI variations"

Features:
  ✅ Gemini 2.0 Flash vision analysis
  ✅ Comprehensive UI/UX evaluation
  ✅ Birmingham youth-focused recommendations
  ✅ Mobile usability assessment
  ✅ Narrative game UX best practices
  ✅ Accessibility considerations
  ✅ Batch processing support

API Key: ${GEMINI_API_KEY ? '✅ Configured' : '❌ Missing (set GEMINI_API_KEY)'}
`);
    return;
  }
  
  const command = args[0];
  const description = args.slice(-1)[0] || `
The interface shows:
- Dark background with a centered white card interface
- Three separate message blocks showing narrative text about finding a letter
- Text reads: "You found a letter under your door this morning. Many paths remain undiscovered."
- Second block: "Your future awaits at Platform 7. Midnight. Don't be late."  
- Third block: "At the bottom of the letter, in smaller text: 'You have one year before everything changes. Choose wisely. - Future You' Many paths remain undiscovered."
- Blue "Continue" button at the bottom
- Clean, minimal design with good spacing
- Appears to be responsive/mobile-friendly
- Part of Birmingham youth career exploration game through interactive fiction
`;
  
  if (command === 'batch') {
    const directory = args[1];
    if (!directory) {
      console.error('❌ Please provide directory path for batch analysis');
      return;
    }
    await batchAnalyze(directory, description);
  } else {
    // Single image analysis
    const imagePath = command;
    await analyzeScreenshot(imagePath, description);
  }
}

// Export functions for use in other scripts
module.exports = {
  analyzeScreenshot,
  batchAnalyze,
  createUIAnalysisPrompt,
  imageToBase64,
  getMimeType
};

// Run main function if script is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  });
}