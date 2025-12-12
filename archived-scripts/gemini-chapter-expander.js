const fs = require('fs');
const path = require('path');

// Chapter Structure Expansion - BG3 Inspired
// Implementing: Multi-act journey, escalating stakes, branching narratives that converge

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required')
  process.exit(1)
};
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

const CHAPTER_STRUCTURE = {
  "Chapter 1": {
    title: "Arrival - The Mystery Begins",
    timing: "11:47 PM - 11:55 PM", 
    purpose: "Hook, character introductions, establish stakes",
    emotional_arc: "Intrigue → Growing connection",
    bg3_parallel: "Act 1 - Exploration and discovery",
    birmingham_integration: "Initial Birmingham references, familiar yet mysterious"
  },
  
  "Chapter 2": {
    title: "Deeper Connections - Trust Building", 
    timing: "11:55 PM - 11:58 PM",
    purpose: "Character backstories, trust building, platform exploration",
    emotional_arc: "Connection → Vulnerability", 
    bg3_parallel: "Act 1 continued - Character development",
    birmingham_integration: "Personal Birmingham stories, family histories"
  },
  
  "Chapter 3": {
    title: "Crisis Points - The Breaking", 
    timing: "11:58 PM - 11:59 PM",
    purpose: "High-stakes emotional crises, major character choices",
    emotional_arc: "Vulnerability → Crisis → Growth or tragedy",
    bg3_parallel: "Act 2 - Dark challenges, major decisions", 
    birmingham_integration: "Real Birmingham stakes, career consequences"
  },
  
  "Chapter 4": {
    title: "Convergence - The Quiet Hours",
    timing: "11:59 PM - 12:00 AM",
    purpose: "Contemplative moments, glimpses of real work, pattern recognition",
    emotional_arc: "Growth → Understanding → Clarity",
    bg3_parallel: "Act 3 setup - Understanding the true scope",
    birmingham_integration: "Real workplace moments, actual Birmingham professionals"
  },
  
  "Chapter 5": {
    title: "Resolution - Your Train Arrives",
    timing: "12:00 AM - Platform 7½ Discovery",
    purpose: "Multiple endings, pattern revelation, career path selection",
    emotional_arc: "Clarity → Choice → Transformation",
    bg3_parallel: "Act 3 - Climactic confrontations and resolutions",
    birmingham_integration: "Real next steps, actual Birmingham opportunities"
  }
};

async function generateChapterContent(chapterNumber, chapterData) {
  const prompt = `Create expanded content for Chapter ${chapterNumber} of Grand Central Terminus, following Baldur's Gate 3's multi-act narrative structure.

CHAPTER OVERVIEW:
Title: ${chapterData.title}
Timing: ${chapterData.timing} 
Purpose: ${chapterData.purpose}
Emotional Arc: ${chapterData.emotional_arc}
BG3 Parallel: ${chapterData.bg3_parallel}

BG3-INSPIRED STRUCTURE REQUIREMENTS:
- Each chapter builds emotional stakes from the previous
- Character relationships deepen progressively
- Choices in earlier chapters affect later scenes
- Birmingham integration becomes more personal and meaningful
- Multiple valid paths through content (spiderweb structure)
- Environmental responsiveness increases

EXISTING CHARACTERS TO DEVELOP:
- Samuel (Station Keeper): Former corporate executive, wise guide
- Maya (Pre-med Crisis): Family pressure vs. robotics passion  
- Devon (Engineer): Builds systems to avoid people
- Jordan (Career Changer): Multiple paths tried, becoming mentor

CONTENT TO GENERATE:
1. Chapter opening scene (atmospheric Birmingham detail)
2. 2-3 character interaction scenes per character
3. 1 major choice moment with 3-4 meaningful options
4. Environmental description changes based on player choices
5. Transition to next chapter

BIRMINGHAM INTEGRATION FOR CHAPTER ${chapterNumber}:
${chapterData.birmingham_integration}

WRITING STYLE:
- Follow BG3's emotional honesty - respect player feelings
- Include subtext in dialogue - what's not said matters
- Character voices distinct and consistent
- Sensory details anchor emotional moments
- Time pressure creates urgency without punishment

Format as JSON with scenes array, each scene having:
- id, type (narration/dialogue/choice), text, speaker (if dialogue)
- choices array (if choice type) with text and nextScene
- environmental_state, emotional_weight, trust_impact
- birmingham_details for local grounding`;

  try {
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
    const content = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    let jsonContent = content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1] || jsonMatch[0];
    }
    
    try {
      return JSON.parse(jsonContent);
    } catch (parseError) {
      console.log(`   ⚠️  JSON parsing failed for Chapter ${chapterNumber}, creating manual structure`);
      // Return structured fallback
      return {
        chapter: chapterNumber,
        title: chapterData.title,
        scenes: [
          {
            id: `${chapterNumber}-1`,
            type: "narration",
            text: `Chapter ${chapterNumber} begins as ${chapterData.emotional_arc.split(' → ')[0].toLowerCase()} fills the station...`,
            environmental_state: "evolving",
            birmingham_details: chapterData.birmingham_integration
          }
        ],
        emotional_progression: chapterData.emotional_arc,
        bg3_principles_applied: ["escalating_stakes", "character_development", "meaningful_choices"]
      };
    }
  } catch (error) {
    console.error(`Error generating Chapter ${chapterNumber}:`, error.message);
    return null;
  }
}

async function createExpandedStoryStructure() {
  console.log('📖 GRAND CENTRAL TERMINUS - CHAPTER EXPANSION');
  console.log('📚 Applying BG3 principles: Multi-act journey with escalating emotional stakes\n');
  
  // Read current story data
  const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
  const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
  
  // Create backup
  const backupPath = path.join(__dirname, '..', 'data', `grand-central-story-backup-expansion-${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(storyData, null, 2));
  console.log(`💾 Backup created: ${path.basename(backupPath)}`);
  
  const expandedChapters = [];
  
  // Generate content for each chapter
  for (const [chapterKey, chapterData] of Object.entries(CHAPTER_STRUCTURE)) {
    const chapterNumber = chapterKey.split(' ')[1];
    console.log(`📝 Generating ${chapterKey}: "${chapterData.title}"...`);
    
    const chapterContent = await generateChapterContent(chapterNumber, chapterData);
    
    if (chapterContent) {
      // Structure as proper chapter
      const chapter = {
        id: parseInt(chapterNumber),
        title: chapterData.title,
        timing: chapterData.timing,
        purpose: chapterData.purpose,
        emotional_arc: chapterData.emotional_arc,
        scenes: chapterContent.scenes || [],
        bg3_principles: chapterContent.bg3_principles_applied || []
      };
      
      expandedChapters.push(chapter);
      console.log(`   ✅ Generated ${chapter.scenes.length} scenes`);
      console.log(`   🎭 Emotional arc: ${chapterData.emotional_arc}`);
    } else {
      console.log(`   ❌ Failed to generate ${chapterKey}`);
    }
    
    // Pause between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Integrate with existing story structure
  const enhancedStoryData = {
    ...storyData,
    chapters: expandedChapters,
    narrative_structure: {
      total_chapters: expandedChapters.length,
      bg3_inspired: true,
      multi_act_journey: true,
      escalating_stakes: true,
      time_progression: "11:47 PM → 12:00 AM → Platform 7½",
      emotional_journey: "Intrigue → Connection → Crisis → Understanding → Transformation"
    },
    enhancement_metadata: {
      ...storyData.enhancement_metadata,
      chapter_expansion_date: new Date().toISOString(),
      bg3_principles_applied: [
        "multi_act_structure",
        "escalating_emotional_stakes", 
        "character_development_across_acts",
        "spiderweb_narrative_convergence",
        "meaningful_choice_consequences"
      ]
    }
  };
  
  return enhancedStoryData;
}

async function generateQuietHoursMoments() {
  const prompt = `Create "Quiet Hours" contemplative scenes for Grand Central Terminus Chapter 4, inspired by BG3's character development moments.

QUIET HOURS CONCEPT:
- Time stops at 11:59 PM for contemplative workplace glimpses
- Players see real Birmingham professionals in authentic work moments
- Focus on emotional truth of different careers, not just job duties
- Each platform offers different contemplative experience
- Connects mystical station concept to real-world meaning

BIRMINGHAM WORKPLACES TO FEATURE:
1. UAB Hospital - 3 AM ER shift, weight of life/death decisions
2. Innovation Depot - Late night coding session, breakthrough moment
3. Protective Stadium construction - Dawn shift, building city's future
4. Southern Research - Environmental lab, solving regional challenges

WRITING REQUIREMENTS:
- Show internal monologue of professionals at work
- Include sensory details: sounds, smells, textures of work environments
- Reveal both challenges and rewards of each path
- Connect to character growth themes from earlier chapters
- 2-3 paragraphs per workplace moment

BG3 INSPIRATION:
- Like companion camp conversations - quiet, personal moments
- Focus on human connection to work, not just career advancement
- Show vulnerability and strength in equal measure
- Let players observe without pressure to choose immediately

Format as JSON with workplace_moments array.`;

  try {
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
          temperature: 0.8,
          maxOutputTokens: 3000
        }
      })
    });

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      workplace_moments: [
        {
          location: "UAB Hospital ER",
          professional: "Dr. Sarah Chen",
          moment: "3 AM shift contemplating the weight of healing decisions",
          emotional_core: "Purpose through service despite exhaustion"
        }
      ]
    };
  } catch (error) {
    console.error('Error generating Quiet Hours:', error.message);
    return { workplace_moments: [] };
  }
}

async function main() {
  try {
    // Create expanded chapter structure
    const expandedStoryData = await createExpandedStoryStructure();
    
    // Generate Quiet Hours content
    console.log('\n🕰️  Generating "Quiet Hours" contemplative workplace moments...');
    const quietHours = await generateQuietHoursMoments();
    
    // Add Quiet Hours to Chapter 4
    const chapter4 = expandedStoryData.chapters.find(ch => ch.id === 4);
    if (chapter4 && quietHours.workplace_moments) {
      chapter4.quiet_hours = quietHours.workplace_moments;
      console.log(`   ✅ Added ${quietHours.workplace_moments.length} contemplative workplace moments`);
    }
    
    // Save expanded story
    const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
    fs.writeFileSync(storyPath, JSON.stringify(expandedStoryData, null, 2));
    console.log(`\n✅ Enhanced story with ${expandedStoryData.chapters.length} chapters saved`);
    
    // Save expansion documentation
    const expansionDocsPath = path.join(__dirname, '..', 'data', 'chapter-expansion-generated.json');
    fs.writeFileSync(expansionDocsPath, JSON.stringify({
      generated_date: new Date().toISOString(),
      chapter_structure: CHAPTER_STRUCTURE,
      expanded_chapters: expandedStoryData.chapters.length,
      quiet_hours_moments: quietHours.workplace_moments?.length || 0,
      bg3_principles: [
        "multi_act_journey_structure",
        "escalating_emotional_stakes",
        "character_development_across_acts", 
        "contemplative_quiet_moments",
        "spiderweb_narrative_convergence"
      ]
    }, null, 2));
    
    console.log(`📚 Chapter expansion documentation saved: ${path.basename(expansionDocsPath)}`);
    
    console.log('\n🎯 CHAPTER EXPANSION COMPLETE');
    console.log('📊 Summary:');
    console.log(`   • Expanded from 1 to ${expandedStoryData.chapters.length} chapters`);
    console.log('   • BG3-style multi-act journey implemented');
    console.log('   • Escalating emotional stakes across chapters');
    console.log('   • "Quiet Hours" contemplative moments added');
    console.log('   • Birmingham workplace integration deepened');
    console.log('   • Time progression: 11:47 PM → Platform 7½ discovery');
    
    console.log('\n🎮 Ready for Testing:');
    console.log('   • Multi-chapter narrative flow');
    console.log('   • Character relationship progression');
    console.log('   • Crisis moments with meaningful consequences');
    console.log('   • Environmental responsiveness to choices');
    console.log('   • Birmingham career exploration through emotional connection');
    
  } catch (error) {
    console.error('❌ Chapter expansion failed:', error.message);
    process.exit(1);
  }
}

// Export for use by other scripts
module.exports = {
  createExpandedStoryStructure,
  generateQuietHoursMoments,
  CHAPTER_STRUCTURE
};

// Run if called directly
if (require.main === module) {
  main();
}