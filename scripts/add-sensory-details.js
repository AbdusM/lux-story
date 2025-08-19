const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Sensory detail enhancements for key scenes
const sensoryEnhancements = {
  // Chapter 1 - Arrival
  "1-1": {
    original: "The letter arrived this morning, slipped under your door while the world slept.\n\n'Your future awaits at Platform 7. Midnight. Don't be late.'\n\nNo signature. No postmark. Just your name written in handwriting that feels familiar but impossible to place.\n\nNow you're standing at the entrance to Grand Central Terminus - a station that wasn't here yesterday. The clock tower shows 11:47 PM.\n\nThirteen minutes to find Platform 7. Thirteen minutes to meet your future.\n\nIf you believe the letter.",
    enhanced: "The letter arrived this morning, slipped under your door while the world slept. The paper felt thick between your fingers, expensive, with a faint smell of brass polish.\n\n'Your future awaits at Platform 7. Midnight. Don't be late.'\n\nNo signature. No postmark. Just your name written in handwriting that feels familiar but impossible to place.\n\nNow you're standing at the entrance to Grand Central Terminus - a station that wasn't here yesterday. Cold November air bites at your exposed skin. The clock tower shows 11:47 PM, its mechanical tick echoing against wet concrete.\n\nThirteen minutes to find Platform 7. Thirteen minutes to meet your future.\n\nIf you believe the letter."
  },
  
  "1-2": {
    original: "The station entrance looms before you, all brass and shadows. Through the glass doors, you see platforms stretching into misty distances, more than any station should hold.",
    enhanced: "The station entrance looms before you, all brass and shadows. The revolving doors are warm to the touch despite the cold night. Through the glass, fogged with condensation, you see platforms stretching into misty distances, more than any station should hold. A low rumble vibrates through the ground - trains arriving and departing on tracks you can't quite see."
  },
  
  "1-3a": {
    original: "You push through the heavy doors, their brass handles warm despite the late hour. The station unfolds before you like a Victorian fever dream - impossibly high ceilings, platforms that seem to multiply when you're not looking directly at them.\n\nPlatform 7's sign flickers in the distance, the number shifting between 7 and something else... 7½? No, that's impossible.\n\nAs you walk, you notice the other travelers. They all move with purpose, but different kinds - some rushed, some peaceful, some lost. None of them seem to see you.",
    enhanced: "You push through the heavy doors, their brass handles warm and slightly sticky with the residue of countless hands. The station unfolds before you - impossibly high ceilings that smell of machine oil and old wood. Your footsteps echo on marble floors worn smooth by decades of travelers.\n\nPlatform 7's sign flickers in the distance, the fluorescent bulb buzzing like an angry wasp. The number shifts between 7 and something else... 7½? No, that's impossible.\n\nAs you walk, the temperature drops five degrees. You notice the other travelers, their coats rustling, shoes clicking in different rhythms - some rushed, some peaceful, some lost. None of them seem to see you."
  },
  
  "1-3b": {
    original: "An older man in a conductor's uniform that belongs to no rail company you know steps from behind a pillar. His watch hangs from a chain, ticking to a rhythm that doesn't match seconds.",
    enhanced: "An older man in a conductor's uniform steps from behind a pillar. The fabric looks like wool but shimmers like water. His watch hangs from a brass chain, ticking with a sound like distant hammering on metal - too slow for seconds, too fast for minutes."
  },
  
  "1-3c": {
    original: "You tear the letter into precise quarters, then eighths, letting the pieces flutter to the ground. As they fall, they catch fire - a soft blue flame that doesn't burn, just transforms the paper into moths that spiral upward and disappear.\n\nThe station doors swing open on their own.\n\n'Interesting choice,' says a voice. You turn to see a janitor with knowing eyes, pushing a cart that rattles with keys to doors that shouldn't exist.",
    enhanced: "You tear the letter into precise quarters, then eighths. The paper resists slightly, like tearing fabric. As the pieces flutter down, they catch fire - a soft blue flame that gives off no heat but smells of burnt sugar.\n\nThe station doors swing open with a pneumatic hiss.\n\n'Interesting choice,' says a voice. You turn to see a janitor with knowing eyes, pushing a cart that rattles metallically - hundreds of brass keys clinking against each other like wind chimes."
  },
  
  "1-3d": {
    original: "The departure board towers above you, its mechanical letters flipping with satisfying clicks. But something's wrong - the destinations keep changing:",
    enhanced: "The departure board towers above you, its mechanical letters flipping with sharp clicks that echo in the vaulted space. The sound has a rhythm - click-click-pause, click-click-pause. Up close, you smell the faint ozone of electrical motors working overtime. The destinations keep changing:"
  },
  
  "1-5a": {
    original: "You pull out your multi-tool - the one you always carry, though you can't remember why. The bench practically tells you how to fix it, wood worn smooth by thousands of waiting travelers.",
    enhanced: "You pull out your multi-tool - the steel cold and familiar in your palm. The bench's broken joint reveals pine wood, still fragrant with sap. As you work, sawdust falls onto your shoes, and the screws make a satisfying squeak as they bite into the old wood."
  },
  
  "1-7d": {
    original: "You sit on the bench you fixed - your bench now. It feels different from before, warm despite the late hour, solid in a way that suggests permanence in this temporary place.",
    enhanced: "You sit on the bench you fixed - your bench now. The wood is warm against your back, almost body temperature. It creaks slightly as you settle, a comfortable sound like an old house breathing. The varnish smells faintly of lemon oil."
  },
  
  "1-8-quiet": {
    original: "Time has crystallized around you. You can move, but everyone else is caught between heartbeats.",
    enhanced: "Time has crystallized around you. The air feels thick, like walking through water. You can move, but each step makes no sound - absolute silence except for your own heartbeat, loud as a drum in your ears. The temperature has dropped to exactly skin temperature - you can't tell where you end and the air begins."
  },
  
  // Chapter 2 - Key Character Moments
  "2-1": {
    original: "Chapter 2 begins. The station has accepted you, or perhaps you've accepted it.",
    enhanced: "Chapter 2 begins. The station has accepted you, or perhaps you've accepted it. The air tastes different now - less metallic, more alive. Somewhere distant, a coffee cart opens with the hiss of a steam machine."
  },
  
  "2-3a1": {
    original: "Maya sits on a bench near Platform 1, medical textbooks spread around her. But her hands are assembling what looks like a tiny robotic heart.",
    enhanced: "Maya sits on a bench near Platform 1, medical textbooks spread around her. The pages smell of highlighter and desperation. But her hands are assembling what looks like a tiny robotic heart - tiny gears clicking together with precision, the metal components still warm from her pocket."
  },
  
  "2-3c1": {
    original: "Devon crouches by a malfunctioning turnstile, completely absorbed. His toolkit spreads around him like an altar to functionality.",
    enhanced: "Devon crouches by a malfunctioning turnstile, completely absorbed. The sharp scent of WD-40 cuts through the station air. His toolkit spreads around him - screwdrivers still warm from use, wire strippers with rubber handles worn smooth."
  },
  
  "2-5a": {
    original: "Platform 1 feels different as you approach - warmer, almost alive. The air itself seems to pulse with purpose.",
    enhanced: "Platform 1 feels different as you approach - the temperature rises three degrees, and you smell antiseptic mixed with coffee. The fluorescent lights here have a different quality, softer, like hospital corridors at 3 AM. The air itself seems to pulse with exhausted purpose."
  },
  
  "2-7": {
    original: "Jordan's data center occupies a forgotten corner between Platforms 7 and 8. Servers hum in harmonious frequencies.",
    enhanced: "Jordan's data center occupies a forgotten corner between Platforms 7 and 8. The servers hum at precisely 60Hz, creating a bass note you feel in your chest. The air is cooler here, dry, with the burnt-dust smell of overworked electronics."
  },
  
  "2-9": {
    original: "Platform 9 shouldn't exist at night, but here it flourishes. Alex tends to vertical gardens that climb the pillars.",
    enhanced: "Platform 9 shouldn't exist at night, but here it flourishes. The air is humid, thick with the green smell of photosynthesis. Grow lights cast purple shadows, and somewhere water drips steadily into a collection barrel - plip, plip, plip."
  },
  
  // Chapter 3 - Birmingham Connections
  "3-1": {
    original: "The station has shifted. Platform signs now flicker between their mystical names and Birmingham locations.",
    enhanced: "The station has shifted overnight. The marble floors now have a faint red tint - Birmingham clay seeping through impossible architecture. Platform signs flicker between mystical names and Birmingham locations, the electrical buzz taking on a Southern drawl."
  },
  
  "3-2": {
    original: "UAB Medical Center\nChildren's Hospital\nCooper Green Mercy\n\nThe hospitals of Birmingham, but also more - places where caring becomes a calling.",
    enhanced: "UAB Medical Center\nChildren's Hospital\nCooper Green Mercy\n\nThe platform smells of hand sanitizer and hope. You hear the distant squeak of gurney wheels on linoleum, the soft chime of elevator doors. The hospitals of Birmingham, but also more - places where caring becomes tangible as gauze and sutures."
  },
  
  "3-3a": {
    original: "I spent a semester at UAB. The anatomy lab... you never forget that first cut. How the scalpel feels like it weighs a thousand pounds.",
    enhanced: "I spent a semester at UAB. The anatomy lab... you never forget that first cut. The formaldehyde smell that clings to your clothes for days. How the scalpel feels like it weighs a thousand pounds, cold steel warming slowly in your grip."
  },
  
  "3-5": {
    original: "The Innovation Depot\nRegions Bank Data Center\nProtective Life Analytics\n\nBirmingham's data heart beats here, processing millions of decisions per second.",
    enhanced: "The Innovation Depot\nRegions Bank Data Center\nProtective Life Analytics\n\nThe platform hums with server fans and air conditioning. The air tastes of ozone and ambition. Birmingham's data heart beats here, each keystroke a tiny metallic click in the symphony of processing."
  },
  
  "3-9": {
    original: "Platform 9 has transformed into a greenhouse overnight. Birmingham steel beams support walls of living glass.",
    enhanced: "Platform 9 has transformed into a greenhouse overnight. The humidity hits you like a warm towel. Birmingham steel beams, still smelling faintly of rust and oil, support walls of living glass. Condensation drips steadily, each drop catching the grow lights like purple diamonds."
  },
  
  "3-11": {
    original: "The Forgotten Platform reveals itself as the night shift - the invisible workforce that keeps Birmingham running while others sleep.",
    enhanced: "The Forgotten Platform reveals itself as the night shift. The air here smells of strong coffee and industrial cleaner. Fluorescent lights flicker with the exhausted persistence of 3 AM. You hear the distant rumble of delivery trucks, the whir of floor polishers - Birmingham's invisible workforce maintaining the illusion of effortless mornings."
  }
};

// Function to update scenes with sensory details
function enhanceScenes() {
  let enhancedCount = 0;
  
  storyData.chapters.forEach(chapter => {
    chapter.scenes.forEach(scene => {
      if (sensoryEnhancements[scene.id]) {
        const enhancement = sensoryEnhancements[scene.id];
        if (scene.text === enhancement.original) {
          scene.text = enhancement.enhanced;
          enhancedCount++;
          console.log(`✓ Enhanced scene ${scene.id} with sensory details`);
        } else if (scene.text && scene.text.includes(enhancement.original.substring(0, 50))) {
          // Partial match - update anyway
          scene.text = enhancement.enhanced;
          enhancedCount++;
          console.log(`✓ Enhanced scene ${scene.id} (partial match)`);
        }
      }
    });
  });
  
  return enhancedCount;
}

// Main execution
console.log('Starting sensory detail enhancement...\n');

const count = enhanceScenes();

if (count > 0) {
  // Save the enhanced story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  console.log(`\n✨ Successfully enhanced ${count} scenes with sensory details`);
  console.log('Sensory elements added:');
  console.log('  • Temperature (cold metal, warm brass, skin temperature)');
  console.log('  • Texture (rough wood, smooth marble, sticky residue)');
  console.log('  • Smell (machine oil, antiseptic, sawdust, coffee)');
  console.log('  • Sound (footsteps, mechanical clicks, distant rumbles)');
} else {
  console.log('\n⚠️ No scenes were updated - they may have already been enhanced');
}