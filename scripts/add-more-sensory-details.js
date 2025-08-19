const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Additional sensory enhancements for more scenes
const additionalEnhancements = {
  // More Chapter 1 scenes
  "1-4a": {
    text: "The flickering Platform 7 draws you forward, but you pass Platform 3 first. The wooden bench there creaks under the weight of age, split down the middle. An elderly man struggles with canvas bags that smell of motor oil and memories.",
    searchPattern: "The flickering Platform 7 draws you forward"
  },
  
  "1-5b": {
    text: "You take the man's bags - heavier than they look, the canvas rough against your palms. Inside, metal tools clink together softly. He sighs with relief, a sound like steam escaping.\n\n'Kind of you. Most people rush past, their footsteps sharp on the cold marble. They're all trying to catch trains that haven't been scheduled yet.' He walks slowly, and you match his pace. 'Platform 7, right? I can see it in how you keep glancing at the signs. Let me tell you something - the trains that matter most are never the ones you're told to catch.'\n\nPlatform 1 glows softer as you pass, warming the air by degrees. You notice other travelers helping each other with luggage, the soft rustle of shared humanity.\n\nThe clock now reads 11:51 PM.",
    searchPattern: "You take the man's bags"
  },
  
  "1-5c": {
    text: "You rush past the broken bench, your shoes clicking urgently on the marble floor. The elderly man's bags split with a harsh tearing sound, tools clattering across the platform like scattered bones. No one stops to help. The broken bench collapses completely with a crack like breaking ribs.\n\nYou reach Platform 7 faster, yes. The clock reads 11:50 PM - plenty of time. But the platform itself seems different now. The air is colder, sharp with the scent of rust. The sign flickers more violently: 7... ERROR... 7... DENIED... 7...",
    searchPattern: "You rush past the broken bench"
  },
  
  "1-5d": {
    text: "'Who sends any letter, really? The person writing, or the person who needs to receive it?' Samuel pulls out a worn journal, its leather cover soft with age, smelling of pipe tobacco though he doesn't smoke.\n\n'I've seen hundreds of letters. The paper always feels the same - heavy, important. They all claim to know your future, but futures aren't fixed things. They're more like... probability clouds.' His fingers trace invisible patterns in the air. 'Platform 7 especially. It only solidifies when someone approaches it with absolute certainty. And you, my friend, don't look certain at all.'",
    searchPattern: "Who sends any letter"
  },
  
  "1-5e": {
    text: "'Temperamental is kind. Platform 7 has been flickering between existing and not existing for three days. The electrical buzz changes pitch - sometimes a low hum, sometimes a high whine like feedback. Sometimes it shows 7, sometimes 7½, sometimes just... static that makes your teeth ache.'\n\nHe checks his impossible watch, the brass warm against his wrist. 'The trains that arrive at Platform 7 go to futures people think they want. But thinking and wanting are different beasts. The station knows the difference, even if we don't. What do YOU want? Not what the letter tells you to want.'",
    searchPattern: "Temperamental is kind"
  },
  
  "1-6": {
    text: "The clock now reads 11:52 PM. Eight minutes until midnight. The station thrums with an energy that wasn't there before - you feel it through your feet, a vibration like a massive heart beating beneath the marble floors.",
    searchPattern: "The clock now reads 11:52 PM"
  },
  
  "1-7a": {
    text: "Platform 7 draws you forward with magnetic certainty. Your footsteps echo hollowly as you approach. The flickering sign stabilizes: PLATFORM 7 - DEPARTURES - YOUR FUTURE - NOW BOARDING.\n\nBut something feels wrong. The platform is empty. Completely, eerily empty. No warmth from other bodies, no smell of coffee or cologne. Just cold metal tracks disappearing into a tunnel that smells of nothing - not even dust.\n\nA train waits. Its doors are open, releasing air that's exactly room temperature. Inside, you see... nothing. Not darkness - nothing. An absence of possibility.",
    searchPattern: "Platform 7 draws you forward"
  },
  
  "1-7b": {
    text: "You wander deeper into the station, ignoring the pull of Platform 7. Your fingers trail along the walls - rough brick giving way to smooth tile, then back to brick. Each platform tells a story through scent and sound:\n\nPlatform 1 hums with exhausted purpose - antiseptic and instant coffee, the squeak of comfortable shoes on linoleum.\n\nPlatform 3 vibrates with creation - sawdust and solder, the rhythmic hammering of making things real.\n\nPlatform 9 grows things - literally. The air is thick with humidity and earth. Vines creep along its pillars with a sound like whispered secrets.\n\nAnd there, between Platforms 9 and 10, a shimmer. The air tastes of copper pennies. The Forgotten Platform. A sign that only exists when you're not looking directly at it.",
    searchPattern: "You wander deeper into the station"
  },
  
  "1-7c": {
    text: "'You got a letter too.' It's not a question. Maya has found you, her medical books making a soft thump against her hip with each step. The little robot perched on her shoulder chirps - a sound like electronic birdsong.\n\n'Mine said Platform 1. My parents' platform. Twenty years of saving, praying, sacrificing for me to be a doctor.' She laughs, brittle as autumn leaves. 'But look.' She points to Platform 3, where sparks fly in orange cascades from someone welding. 'My hands itch when I see that. My brain lights up like touching a live wire. Platform 1 makes me feel like I'm drowning in formaldehyde.'\n\nThe robot chirps again, projecting a tiny hologram that smells faintly of ozone. A heart, but mechanical - gears and springs working in perfect rhythm.\n\n'What if our letters are tests? What if they tell us where we're supposed to go, just to see if we're brave enough to choose differently?'",
    searchPattern: "You got a letter too"
  },
  
  "1-10a": {
    text: "In the crystallized station, each platform reveals something different. The air is thick as honey, and every movement leaves trails of displaced time. Where do you look first?",
    searchPattern: "In the crystallized station"
  },
  
  "1-10a-1": {
    text: "The nurse looks up as you approach. Her scrubs smell of bleach and exhaustion. Her golden thread pulses with each heartbeat she's helped preserve - a warm thrumming you feel in your chest.\n\n'Heavy,' she says simply, her voice carrying the weight of 3 AM decisions. 'But necessary. Every life matters, even when - especially when - it costs you pieces of yourself.'\n\nYou feel the weight she carries. Beautiful. Crushing. Essential as breathing.",
    searchPattern: "The nurse looks up"
  },
  
  "1-10a-2": {
    text: "The blueprints shift as you watch - paper rustling like wings. Not just structures but relationships, communities, hope made tangible in steel and concrete.\n\nA builder's hands move through the frozen air, callused and sure, still reaching for tools. Sawdust hangs suspended around him like golden snow. 'We don't just build structures,' his frozen expression seems to say. 'We build the foundation everything else grows on.'\n\nCreation as service. Structure as caring. The smell of fresh lumber and possibility.",
    searchPattern: "The blueprints shift"
  },
  
  "1-10a-3": {
    text: "The Forgotten Platform hums with quiet necessity - a low electrical buzz you feel in your bones. A translator's fingers hover over keys worn smooth, preventing wars with each careful word. A night-shift programmer's coffee has gone cold, but their code keeps hospitals running.\n\nMarcus nods from his janitorial cart, the keys jangling a frozen symphony. 'The work that matters most,' he says in the stillness, his breath visible in the suddenly cold air, 'rarely gets applause. But without it, everything else stops.'\n\nEssential. Invisible. Profound as a heartbeat.",
    searchPattern: "The Forgotten Platform hums"
  },
  
  "1-10b-1": {
    text: "The golden rope burns hot when you touch it - not painful, but intense as holding a fever. Every strand is a life preserved, a family kept whole, a future made possible. You taste copper and salt - blood and tears.\n\nBut also: exhaustion heavy as wet wool, impossible decisions that smell of antiseptic and fear, carrying others' pain until your bones ache with it. The rope is beautiful and terrible.\n\n'Service has a price,' the nurse says without speaking, her words felt rather than heard. 'Worth paying, but never forget the cost.'",
    searchPattern: "The golden rope burns"
  },
  
  "1-10c": {
    text: "You find Maya frozen mid-step between Platforms 1 and 3, her face caught in perfect anguish. The robot on her shoulder is mid-chirp, its tiny speaker cone vibrating with trapped sound.\n\nYou touch her shoulder - warm through her jacket - and she gasps into motion while everything else stays still. The sudden sound is sharp as breaking glass.\n\n'What... how...?' She looks around at the stopped station, her breath forming clouds in the suddenly cold air. 'Is this what clarity feels like?'\n\nIn the Quiet Hour, she can see her threads too - the three-way split. Without hesitation, she grabs the threads to Platforms 1 and 3, the fibers rough as rope in her hands, and begins braiding them together.\n\n'Biomedical engineering. Surgical robots. Healing through building.' The braid becomes a bridge to Platform 7½, which suddenly exists with a sound like ice cracking, solid and real. 'I don't have to choose. I can create.'\n\nShe hugs you, fierce and grateful, smelling of textbooks and determination. 'The letter was wrong. They're all wrong. We're not supposed to find our platforms. We're supposed to build them.'",
    searchPattern: "You find Maya frozen"
  },
  
  "1-10d": {
    text: "You tear the letter into pieces, the paper making a sound like ripping silk. But this time you know what you're doing. Each piece burns with different colored fire, each with its own scent:\n\n- Blue flames for the fear (smells like rain on hot concrete)\n- Red flames for others' expectations (tastes of copper and disappointment)\n- Green flames for paths not taken (essence of cut grass, childhood summers)\n- Purple flames for futures that were never yours (ozone and distance)\n\nThe ashes rise and fly to Platform 7's sign, which cracks with a sound like winter branches breaking, shatters like your assumptions, and reforms:\n\nPLATFORM 7: UNDER CONSTRUCTION\nPLATFORM 7½: NOW ACCEPTING ARCHITECTS\nPLATFORM 7.1 - 7.9: BUILD YOUR OWN\n\nThe empty train dissolves with a hiss of released pressure, replaced by workshop spaces that smell of sawdust and solder, drafting tables still warm from recent use, and tools for building futures that don't exist yet.\n\nMarcus appears, no longer frozen, applauding slowly - each clap echoing like dropped coins. 'Finally. Someone who understands. The station isn't here to sort people into predetermined futures. It's here to help them build unprecedented ones.'\n\nPlatform 7's destruction sends ripples through the Quiet Hour. Other signs begin flickering, their electrical buzz questioning their own certainty.",
    searchPattern: "You tear the letter into pieces"
  },
  
  "1-11": {
    text: "The Quiet Hour releases its hold with a sound like inhaling after holding your breath too long. Time crashes back like a wave, bringing with it the smell of motion - sweat, perfume, coffee, life. The station returns to its chaos of footsteps and conversations. But everything has changed:\n\n- Your actions in stopped time have left echoes (warmth where there was cold)\n- People near Platform 7 look confused, rubbing their eyes as if waking\n- Maya (if freed) is already sketching designs on her medical textbooks, pencil scratching urgently\n- Platform 7½ (if created) draws curious crowds, their murmurs like distant surf\n\nThe clock reads... still 11:52 PM. The brass hands haven't moved. The Quiet Hour took no time at all. Or maybe all the time in the world.\n\nSamuel finds you, his footsteps deliberate on the marble, his expression knowing. 'Eight minutes to midnight. Though midnight means something different now, doesn't it? You've learned the station's first secret: Time isn't your enemy here. Rushing is.'",
    searchPattern: "The Quiet Hour releases"
  },
  
  // Chapter 2 character introductions
  "2-1": {
    text: "Chapter 2 begins. The station has accepted you, or perhaps you've accepted it. The air tastes different now - less metallic, more alive. Somewhere distant, a coffee cart opens with the hiss of steam, and the smell of fresh grounds cuts through the industrial atmosphere.",
    searchPattern: "Chapter 2 begins"
  },
  
  "2-3c2": {
    text: "I've been mapping the patterns. Look - everyone who helps others, their platforms warm up. The metal actually gets warmer to the touch, I've measured it. Everyone who rushes past need? Their platforms dim, and the air around them drops by exactly 3.7 degrees Celsius.",
    searchPattern: "I've been mapping the patterns"
  },
  
  "2-5a": {
    text: "Platform 1 feels different as you approach - the temperature rises noticeably, and you smell antiseptic mixed with the bitter aroma of hospital coffee. The fluorescent lights here have a different quality, softer, casting shadows like hospital corridors at 3 AM. The air itself pulses with exhausted purpose.",
    searchPattern: "Platform 1 feels different"
  },
  
  "2-7": {
    text: "Jordan's data center occupies a forgotten corner between Platforms 7 and 8. The servers hum at precisely 60Hz, creating a bass note you feel in your sternum. The air is cooler here by ten degrees, dry enough to make your skin tight, with the burnt-dust smell of overworked electronics and the faint chemical scent of thermal paste.",
    searchPattern: "Jordan's data center"
  },
  
  "2-9": {
    text: "Platform 9 shouldn't exist at night, but here it flourishes. The air is humid enough to fog your glasses, thick with the green smell of photosynthesis and rich soil. Grow lights cast purple shadows that make everything look underwater, and somewhere water drips steadily into a collection barrel - plip, plip, plip - each drop a tiny percussion in the chlorophyll symphony.",
    searchPattern: "Platform 9 shouldn't exist"
  },
  
  // Chapter 3 Birmingham connections
  "3-1": {
    text: "The station has shifted overnight. The marble floors now have a faint red tint - Birmingham clay somehow seeping through impossible architecture. Your shoes leave different prints now, slightly sticky. Platform signs flicker between mystical names and Birmingham locations, the electrical buzz taking on a distinctly Southern rhythm, slower, more deliberate.",
    searchPattern: "The station has shifted"
  },
  
  "3-2": {
    text: "UAB Medical Center\nChildren's Hospital\nCooper Green Mercy\n\nThe platform smells of hand sanitizer and hope, that particular hospital combination of cleaning products and human determination. You hear the distant squeak of gurney wheels on waxed linoleum, the soft chime of elevator doors arriving. The hospitals of Birmingham, but also more - places where caring becomes as tangible as gauze and sutures.",
    searchPattern: "UAB Medical Center"
  },
  
  "3-3a": {
    text: "I spent a semester at UAB. The anatomy lab... you never forget that first cut. The formaldehyde smell that clings to your clothes for days, seeps into your skin. How the scalpel feels like it weighs a thousand pounds, cold surgical steel warming slowly in your grip, becoming an extension of your hand.",
    searchPattern: "I spent a semester at UAB"
  },
  
  "3-5": {
    text: "The Innovation Depot\nRegions Bank Data Center\nProtective Life Analytics\n\nThe platform vibrates with server fans and industrial air conditioning. The air tastes of ozone and ambition, that particular flavor of late-night coding sessions and breakthrough moments. Birmingham's data heart beats here, each keystroke a tiny metallic click in the symphony of processing.",
    searchPattern: "The Innovation Depot"
  },
  
  "3-9": {
    text: "Platform 9 has transformed into a greenhouse overnight. The humidity hits you like stepping into a warm shower. Birmingham steel beams, still carrying the scent of rust and machine oil from their past lives, support walls of living glass. Condensation drips steadily, each drop catching the purple grow lights like amethyst tears. The sound is rhythmic, meditative - nature's metronome.",
    searchPattern: "Platform 9 has transformed"
  },
  
  "3-11": {
    text: "The Forgotten Platform reveals itself as the night shift. The air here is thick with strong coffee and industrial Pine-Sol. Fluorescent lights flicker with the exhausted persistence of 3 AM, that particular buzz that only night workers know. You hear the distant rumble of delivery trucks, their diesel engines echoing off empty streets, the whir of floor polishers - Birmingham's invisible workforce maintaining tomorrow's illusion of effortless mornings.",
    searchPattern: "The Forgotten Platform reveals"
  },
  
  "3-13": {
    text: "Samuel appears with forms that smell of fresh ink and possibility. 'These aren't applications,' he says, the papers rustling like autumn leaves. 'They're bridges. Real connections to real opportunities in Birmingham.'",
    searchPattern: "Samuel appears with forms"
  },
  
  "3-15": {
    text: "The station begins its transformation back. The Birmingham clay scent fades, replaced by that timeless smell of old brass and distant trains. But something has changed permanently - the platforms remember their connections now, humming with the frequency of a city's dreams.",
    searchPattern: "The station begins its transformation"
  }
};

// Function to update scenes
function enhanceMoreScenes() {
  let enhancedCount = 0;
  
  storyData.chapters.forEach(chapter => {
    chapter.scenes.forEach(scene => {
      const enhancement = additionalEnhancements[scene.id];
      if (enhancement && scene.text) {
        // Check if we can find the scene by pattern matching
        if (scene.text.includes(enhancement.searchPattern)) {
          scene.text = enhancement.text;
          enhancedCount++;
          console.log(`✓ Enhanced scene ${scene.id} with additional sensory details`);
        }
      }
    });
  });
  
  return enhancedCount;
}

// Main execution
console.log('Adding additional sensory enhancements...\n');

const count = enhanceMoreScenes();

if (count > 0) {
  // Save the enhanced story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  console.log(`\n✨ Successfully enhanced ${count} additional scenes`);
  console.log('\nPhase 1 Sensory Grounding Progress:');
  console.log('  • Temperature variations (warmth, cold, specific degrees)');
  console.log('  • Textures (rough canvas, smooth marble, sticky surfaces)');
  console.log('  • Smells (coffee, formaldehyde, ozone, diesel, Pine-Sol)');
  console.log('  • Sounds (footsteps, mechanical hums, water drips, diesel engines)');
  console.log('  • Taste (copper, salt, ozone, ambition)');
  console.log('\nTotal scenes enhanced: ~40 key scenes with grounded sensory details');
} else {
  console.log('\n⚠️ No additional scenes were updated');
}