const fs = require('fs');
const path = require('path');

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyDEQloxDXlFD2HnFNUrAIr8aANhvr_Ivxg';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Prepare the analysis context
function prepareAnalysisContext() {
  // Read key files
  const storyData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'grand-central-story.json'), 'utf8'));
  const storyEngine = fs.readFileSync(path.join(__dirname, '..', 'lib', 'story-engine.ts'), 'utf8').substring(0, 1500);
  const grandCentralState = fs.readFileSync(path.join(__dirname, '..', 'lib', 'grand-central-state.ts'), 'utf8').substring(0, 1500);
  
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
    birminghamConnection: storyData.chapters[2]?.scenes.find(s => s.text?.includes('UAB'))
  };
  
  return {
    statistics: {
      totalScenes,
      chapter1Scenes,
      chapter2Scenes,
      chapter3Scenes,
      totalCharacters: 5,
      birminghamReferences: JSON.stringify(storyData).match(/Birmingham|UAB|Innovation Depot|Regions/g)?.length || 0
    },
    sampleScenes
  };
}

// Create the Gemini prompt
function createGeminiPrompt(context) {
  return `You are evaluating Grand Central Terminus, a career exploration platform for Birmingham youth workforce development, competing for a $250K grant.

PROJECT STATISTICS:
- Total Scenes: ${context.statistics.totalScenes} (Ch1: ${context.statistics.chapter1Scenes}, Ch2: ${context.statistics.chapter2Scenes}, Ch3: ${context.statistics.chapter3Scenes})
- Birmingham References: ${context.statistics.birminghamReferences}
- Target: Youth ages 16-24

SAMPLE OPENING SCENE:
${context.sampleScenes.opening.text}

KEY FEATURES:
1. Train station metaphor for career paths (platforms = career sectors)
2. Samuel speaks in train conductor terminology with temporal paradoxes
3. Characters have relatable crises (Maya failed medical exam, hands shake)
4. Progresses from mystical arrival to practical Birmingham job applications
5. Real Birmingham integration (UAB, Innovation Depot, $19-35/hour programs)

PLEASE EVALUATE:

1. NARRATIVE EFFECTIVENESS (10 pts)
- Does the train station metaphor work for career exploration?
- Are character crises authentic and relatable?
- Is Samuel's voice distinct enough?
- Does progression from mystical to practical make sense?

2. BIRMINGHAM INTEGRATION (10 pts)
- Do local references feel authentic or forced?
- Are the career paths realistic for Birmingham?
- Will local youth recognize and trust these references?

3. USER EXPERIENCE (10 pts)
- Is text presentation clear (left-aligned, character emojis)?
- Are choices meaningful for career exploration?
- Would this work on mobile phones?

4. EDUCATIONAL VALUE (10 pts)
- Does this effectively identify career interests?
- Is it better than a standard career quiz?
- Will teenagers complete this?

5. GRANT WORTHINESS (10 pts)
- Does this solve Birmingham's workforce development needs?
- Is $250K justified for this approach?
- How does it compare to existing tools?

PROVIDE:
- Numerical scores (50 total)
- FUND/REVISE/REJECT verdict
- Three critical improvements needed
- One paragraph summary of whether this helps Birmingham youth

Be brutally honest. Grade inflation helps no one.`;
}

// Main analysis function
async function runGeminiAnalysis() {
  console.log('🚀 Starting Gemini Analysis...\n');
  
  const context = prepareAnalysisContext();
  console.log(`📊 Analyzing ${context.statistics.totalScenes} scenes with ${context.statistics.birminghamReferences} Birmingham references\n`);
  
  const prompt = createGeminiPrompt(context);
  
  console.log('🤖 Calling Gemini API...\n');
  
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }
    
    const result = await response.json();
    
    if (result.error) {
      console.error('❌ API Error:', result.error.message);
      return;
    }
    
    if (!result.candidates || !result.candidates[0]) {
      console.error('❌ No response from Gemini');
      console.log('Full response:', JSON.stringify(result, null, 2));
      return;
    }
    
    const analysis = result.candidates[0].content.parts[0].text;
    
    // Save full analysis
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `GEMINI_ANALYSIS_${timestamp}.md`;
    fs.writeFileSync(
      path.join(__dirname, '..', 'docs', filename),
      `# Gemini Analysis of Grand Central Terminus\n\nGenerated: ${new Date().toISOString()}\n\n${analysis}`
    );
    
    console.log('✨ Analysis complete!\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(analysis);
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`\n📄 Full analysis saved to docs/${filename}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

// Run the analysis
runGeminiAnalysis().catch(console.error);