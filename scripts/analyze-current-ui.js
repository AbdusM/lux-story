// Node 22 has built-in fetch support

const GEMINI_API_KEY = 'AIzaSyDEQloxDXlFD2HnFNUrAIr8aANhvr_Ivxg';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

async function analyzeUI() {
  const interfaceDescription = `
GRAND CENTRAL TERMINUS UI/UX ANALYSIS

Current Interface Description:
- Dark background with centered white card design
- Three distinct message blocks with clean borders
- Text content:
  Block 1: "You found a letter under your door this morning. Many paths remain undiscovered."
  Block 2: "Your future awaits at Platform 7. Midnight. Don't be late." 
  Block 3: "At the bottom of the letter, in smaller text: 'You have one year before everything changes. Choose wisely. - Future You' Many paths remain undiscovered."
- Blue "Continue" button at bottom, full width
- Clean typography, good spacing between elements
- Mobile-responsive design
- Card-based layout with rounded corners
- Minimalist, focused interface

Context:
- Birmingham youth career exploration game (ages 16-24)
- Interactive fiction/narrative choice game
- Recently improved from auto-advancing to user-controlled pacing
- Focus on bite-sized, digestible content
- Career guidance through storytelling
`;

  const prompt = `Analyze this game UI/UX design for effectiveness with Birmingham youth (ages 16-24) career exploration:

${interfaceDescription}

Please provide comprehensive analysis covering:

1. VISUAL DESIGN & HIERARCHY
- Layout effectiveness and visual appeal
- Typography and readability 
- Color scheme and contrast
- Information organization

2. USER EXPERIENCE
- Ease of navigation and interaction
- Pacing and content flow
- Mobile usability and touch targets
- Accessibility considerations

3. ENGAGEMENT FACTORS
- How well does this retain young adult attention?
- Does the design encourage progression?
- Are there psychological engagement principles at play?
- What might cause users to drop off?

4. NARRATIVE GAME BEST PRACTICES
- How does this compare to successful interactive fiction?
- Balance between text density and user control
- Effective use of progressive disclosure
- Story immersion vs usability

5. BIRMINGHAM YOUTH FOCUS
- Appeal to 16-24 demographic in Birmingham area
- Cultural and regional considerations
- Career exploration context effectiveness
- Modern digital native expectations

6. SPECIFIC IMPROVEMENTS
- List 5-7 concrete UI/UX improvements
- Consider both quick wins and strategic changes
- Include mobile-first considerations
- Focus on increasing completion rates

Provide detailed, actionable recommendations with reasoning.`;

  try {
    console.log('🔍 Starting UI/UX analysis with Gemini...\n');
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const analysis = data.candidates[0].content.parts[0].text;
      
      console.log('📊 GEMINI UI/UX ANALYSIS RESULTS');
      console.log('='.repeat(50));
      console.log(analysis);
      console.log('='.repeat(50));
      
      // Save analysis to file
      const fs = require('fs');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `ui-analysis-${timestamp}.md`;
      const filepath = `/Users/abdusmuwwakkil/Development/30_lux-story/docs/${filename}`;
      
      // Ensure docs directory exists
      const docsDir = '/Users/abdusmuwwakkil/Development/30_lux-story/docs';
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }
      
      fs.writeFileSync(filepath, analysis);
      console.log(`\n💾 Analysis saved to: ${filename}`);
      
    } else {
      console.error('❌ Unexpected response format:', data);
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

// Run the analysis
analyzeUI();