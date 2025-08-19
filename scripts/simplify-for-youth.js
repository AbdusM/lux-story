const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Simplification mappings
const simplifications = {
  // Opening scene - make it relatable
  "The letter arrived this morning, slipped under your door while the world slept. The paper felt thick between your fingers, expensive, with a faint smell of brass polish.": 
    "You found a letter under your door this morning. Nice paper. Smelled weird - like metal.",
  
  "Now you're standing at the entrance to Grand Central Terminus - a station that wasn't here yesterday. Cold November air bites at your exposed skin. The clock tower shows 11:47 PM, its mechanical tick echoing against wet concrete.":
    "Now you're at Grand Central Station. Weird thing is, this place wasn't here yesterday. It's cold - almost midnight. The big clock says 11:47.",
  
  "Thirteen minutes to find Platform 7. Thirteen minutes to meet your future.":
    "You got 13 minutes to find Platform 7. Whatever's there is supposed to change everything.",
  
  // Remove pretentious descriptions
  "The station unfolds before you - impossibly high ceilings that smell of machine oil and old wood. Your footsteps echo on marble floors worn smooth by decades of travelers.":
    "The station is huge. Smells like oil and old stuff. Your footsteps echo on the floor.",
  
  "Platform 7's sign flickers in the distance, the fluorescent bulb buzzing like an angry wasp.":
    "Platform 7's sign flickers up ahead. The light's buzzing.",
  
  "As you walk, the temperature drops five degrees. You notice the other travelers, their coats rustling, shoes clicking in different rhythms - some rushed, some peaceful, some lost.":
    "It gets colder as you walk. Other people are around - some rushing, some lost, some just walking.",
  
  // Simplify Samuel's descriptions
  "An older man in a conductor's uniform steps from behind a pillar. The fabric looks like wool but shimmers like water. His watch hangs from a brass chain, ticking backwards every third beat - too slow for seconds, too fast for minutes, too sideways for time.":
    "An old guy in a train conductor uniform appears. His uniform looks weird - shiny somehow. He's got an old watch on a chain.",
  
  "The departure board towers above you, its mechanical letters flipping with sharp clicks that echo in the vaulted space.":
    "The big departure board is right above you. The letters flip with loud clicks.",
  
  // Fix Maya's crisis to be more relatable
  "I failed my anatomy exam last week. First time I've ever failed anything. My parents called it 'a minor setback.' They don't know I threw up before the test because I couldn't remember if the radial nerve runs over or under the supinator. Four years of straight A's, and suddenly I can't even hold a scalpel without my hand shaking.":
    "I failed a big test last week. First F ever. My parents said 'it's fine, try again.' But they don't know I was so stressed I threw up before the test. Been getting good grades for years, now I can't even focus. My hands shake when I try to study.",
  
  // Remove temporal paradoxes from Samuel
  "Right on schedule for a train that hasn't been built yet":
    "Right on time, as usual",
  
  "I'm the Chief Conductor of possibilities, the Dispatcher of destinations that haven't been imagined":
    "I'm the conductor here. I help people figure out where they're going",
  
  "Time works differently when you're choosing between futures":
    "Take your time. Big decisions need thinking",
  
  "This station exists in the space between tick and tock":
    "This place helps you figure things out",
  
  "Every track leads somewhere that hasn't happened yet":
    "Every track here shows a different career path",
};

// Function to simplify Samuel's dialogue specifically
function simplifySamuelVoice(text) {
  if (!text) return text;
  
  // Remove all temporal paradoxes
  let simplified = text
    .replace(/hasn't been built yet/g, "is coming")
    .replace(/hasn't happened yet/g, "could happen")
    .replace(/between tick and tock/g, "right now")
    .replace(/sideways for time/g, "different")
    .replace(/temporal/g, "timing")
    .replace(/paradox/g, "question")
    .replace(/exists outside of/g, "is beyond")
    .replace(/chronology/g, "schedule");
  
  // Keep train terminology but make it clearer
  simplified = simplified
    .replace(/Chief Conductor of possibilities/g, "head conductor")
    .replace(/Dispatcher of destinations/g, "route planner")
    .replace(/coupling dreams to reality/g, "connecting ideas to jobs")
    .replace(/switch tracks of fate/g, "change direction");
  
  return simplified;
}

// Function to simplify any text
function simplifyText(text) {
  if (!text) return text;
  
  let simplified = text;
  
  // Apply all simplification mappings
  for (const [complex, simple] of Object.entries(simplifications)) {
    simplified = simplified.replace(complex, simple);
  }
  
  // General simplifications
  simplified = simplified
    // Complex words to simple
    .replace(/endeavor/g, "try")
    .replace(/commence/g, "start")
    .replace(/utilize/g, "use")
    .replace(/acquire/g, "get")
    .replace(/demonstrate/g, "show")
    .replace(/subsequently/g, "then")
    .replace(/illuminate/g, "light up")
    .replace(/contemplat/g, "think about")
    .replace(/insurmountable/g, "too hard")
    .replace(/ephemeral/g, "temporary")
    .replace(/visceral/g, "gut")
    .replace(/metamorphosis/g, "change")
    .replace(/labyrinthine/g, "maze-like")
    .replace(/cacophony/g, "noise")
    .replace(/reverberations/g, "echoes")
    
    // Pretentious phrases to normal
    .replace(/dance of light and shadow/g, "lights and shadows")
    .replace(/symphony of/g, "sound of")
    .replace(/tapestry of/g, "mix of")
    .replace(/kaleidoscope of/g, "bunch of")
    .replace(/the weight of countless/g, "many")
    .replace(/etched in/g, "marked by")
    .replace(/whispers of/g, "hints of")
    
    // Overly descriptive to simple
    .replace(/impossibly high ceilings/g, "really high ceilings")
    .replace(/pneumatic hiss/g, "hissing sound")
    .replace(/mechanical precision/g, "exactly")
    .replace(/ethereal glow/g, "soft light")
    .replace(/worn smooth by decades/g, "worn down")
    .replace(/pristine condition/g, "perfect shape")
    
    // Fix sentence structure
    .replace(/\. The air carries/g, ". You smell")
    .replace(/One notices/g, "You notice")
    .replace(/It becomes apparent/g, "You see");
  
  return simplified;
}

// Process all scenes
let changeCount = 0;

storyData.chapters.forEach(chapter => {
  chapter.scenes.forEach(scene => {
    if (scene.text) {
      const originalText = scene.text;
      
      // Apply special handling for Samuel
      if (scene.speaker === 'Samuel') {
        scene.text = simplifySamuelVoice(scene.text);
      }
      
      // Apply general simplifications
      scene.text = simplifyText(scene.text);
      
      if (scene.text !== originalText) {
        changeCount++;
        console.log(`✓ Simplified scene ${scene.id}${scene.speaker ? ` (${scene.speaker})` : ''}`);
      }
    }
    
    // Simplify choices too
    if (scene.choices) {
      scene.choices.forEach(choice => {
        const originalText = choice.text;
        choice.text = simplifyText(choice.text);
        if (choice.text !== originalText) {
          console.log(`  ✓ Simplified choice in scene ${scene.id}`);
        }
      });
    }
  });
});

// Save the simplified version
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log(`\n✅ Simplified ${changeCount} scenes for youth readability`);
console.log('📚 Target reading level: 6th-8th grade');
console.log('🎯 Removed: temporal paradoxes, pretentious language, complex descriptions');
console.log('✨ Kept: train terminology, character voices, Birmingham connections');