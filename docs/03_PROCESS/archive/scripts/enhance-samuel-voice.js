const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Samuel's enhanced dialogue with train terminology and temporal paradoxes
const samuelEnhancements = {
  "1-3b": {
    old: "First time at Grand Central Terminus?\n\nAn older man in a conductor's uniform steps from behind a pillar. The fabric looks like wool but shimmers like water. His watch hangs from a brass chain, ticking with a sound like distant hammering on metal - too slow for seconds, too fast for minutes.\n\n'I'm Samuel. I keep the station... oriented. You look like someone who received an invitation.'",
    new: "First time at Grand Central Terminus? Or perhaps... the last?\n\nAn older man in a conductor's uniform steps from behind a pillar. The fabric looks like wool but shimmers like water. His watch hangs from a brass chain, ticking backwards every third beat - too slow for seconds, too fast for minutes, too sideways for time.\n\n'I'm Samuel. Chief Conductor of possibilities, Dispatcher of destinations. I keep the rails from tangling, the switches from lying. You have the look of someone riding a return ticket they haven't bought yet.'"
  },
  
  "1-5d": {
    old: "'Who sends any letter, really? The person writing, or the person who needs to receive it?' Samuel pulls out a worn journal, its leather cover soft with age, smelling of pipe tobacco though he doesn't smoke.\n\n'I've seen hundreds of letters. The paper always feels the same - heavy, important. They all claim to know your future, but futures aren't fixed things. They're more like... probability clouds.' His fingers trace invisible patterns in the air. 'Platform 7 especially. It only solidifies when someone approaches it with absolute certainty. And you, my friend, don't look certain at all.'",
    new: "'Who sends any letter, really? The engineer or the rails? The whistle or the steam?' Samuel pulls out a worn conductor's log, its leather cover soft with age, smelling of coal smoke and tomorrow's rain.\n\n'I've punched a thousand tickets to futures that haven't departed yet. Each one claims to know your destination, but destinations are like signals in fog - red until you're close enough to see they were always green.' His fingers trace invisible track patterns in the air. 'Platform 7 especially. It only couples to trains that know where they're going before they know where they've been. And you, young switchman, you're standing on tracks that haven't been laid yet.'"
  },
  
  "1-5e": {
    old: "'Temperamental is kind. Platform 7 has been flickering between existing and not existing for three days. The electrical buzz changes pitch - sometimes a low hum, sometimes a high whine like feedback. Sometimes it shows 7, sometimes 7½, sometimes just... static that makes your teeth ache.'\n\nHe checks his impossible watch, the brass warm against his wrist. 'The trains that arrive at Platform 7 go to futures people think they want. But thinking and wanting are different beasts. The station knows the difference, even if we don't. What do YOU want? Not what the letter tells you to want.'",
    new: "'Temperamental is putting it on a siding. Platform 7's been derailing between dimensions for three days straight. Listen to those rails sing - sometimes they hum the arrival hymn, sometimes the departure dirge, sometimes just... static from trains that forgot to exist.'\n\nHe checks his backwards watch, its hands moving counterclockwise except when you blink. 'The trains that call at Platform 7? They run express to futures folks think they've bought tickets for. But the timetable and the heart run on different gauges, if you catch my meaning. The station's a shrewd conductor - knows the difference between passengers and freight. So tell me, are you cargo or captain? Not what your ticket says you are.'"
  },
  
  "1-5g": {
    old: "Samuel takes the letter with hands that have held a thousand such messages. As he reads, his expression shifts through surprise, recognition, and something that might be pride.\n\n'Well, well. [Your name]. I was wondering when you'd arrive.' He knows your name though you never said it. 'This handwriting... do you recognize it? Look closer. The way you make your letters, that specific curve on the lowercase 'a'...'\n\nHe holds the letter up to the station's strange light, and you see it clearly - the handwriting is yours. But older. More confident.\n\n'You wrote this to yourself. From a future where you found your way. The question is: will you follow your own advice, or discover why future-you sent you to the wrong platform?'",
    new: "Samuel takes the letter with hands that have punched ten thousand tickets to nowhere. As he reads, his expression shifts through the stations of surprise, recognition, and something that might be pride.\n\n'Well, well. [Your name]. Right on schedule for a train that hasn't been built yet.' He knows your name though you never spoke it, reading it from rails that haven't been laid. 'This penmanship... it's got the wear of miles on it. See how the ink flows? Like tracks worn smooth by a journey you haven't taken yet...'\n\nHe holds the letter up to the station's gaslight, and you see it clearly - the handwriting is yours. But weathered by travels you've never made.\n\n'You wrote yourself a return ticket from a destination you haven't reached. The real question, young engineer: will you ride the rails future-you laid down, or will you discover why they switched you to the wrong track? Sometimes the best conductors send trains to sidings to avoid collisions that haven't happened yet.'"
  },
  
  "1-11": {
    old: "Samuel finds you, his footsteps deliberate on the marble, his expression knowing. 'Eight minutes to midnight. Though midnight means something different now, doesn't it? You've learned the station's first secret: Time isn't your enemy here. Rushing is.'",
    new: "Samuel finds you, his conductor's boots clicking a rhythm that sounds like wheels on tracks, his expression reading you like a punch card. 'Eight minutes to the witching whistle. Though midnight runs on a different schedule now, doesn't it? You've learned what every good engineer knows: It's not about beating the timetable. It's about knowing when to brake and when to build steam. Speed kills trains. Patience builds railways.'"
  },
  
  "2-11a": {
    old: "You want to know why I'm here? Why I guide people through their crossroads? Because I stood at my own Platform 7 thirty years ago. Had a letter just like yours. Was supposed to become a surgeon. Had the hands for it, the mind for it, the acceptance letter from Johns Hopkins.",
    new: "You want to know why I work this particular junction? Why I switch souls between tracks? Because I stood at my own Platform 7 thirty years back down the line. Had a first-class ticket just like yours. Was supposed to ride the express to Johns Hopkins, become a surgeon. Had the steady hands for coupling arteries, the sharp mind for reading the body's timetables."
  },
  
  "2-11b": {
    old: "But I was scared. Terrified, actually. Of the responsibility. Of holding lives literally in my hands. So I got on the wrong train. Became an insurance adjuster. Safe. Predictable. No one dies if you make a mistake on a claim form. My daughter needed surgery last year. The surgeon who saved her? He was supposed to be me. That's why my watch stopped at 11:47. The moment I chose fear over purpose.",
    new: "But I got cold feet on the platform. Terrified of being the last stop for someone's journey. Of holding life's timetable in my hands. So I took the local instead of the express. Became an insurance adjuster - all paperwork, no people. Safe as a train in the depot. No one gets derailed if you misfile a claim. My daughter needed surgery last year. The surgeon who saved her was riding the train I abandoned. Should've been me at those controls. That's why my watch runs backwards from 11:47. It's trying to return to the junction where I took the wrong switch."
  },
  
  "2-12b4": {
    old: "It started moving again when I told you the truth. Thirty years of stopped time, and honesty was all it took. Maybe Platform 7 isn't about choosing right. Maybe it's about choosing honestly.",
    new: "The old ticker started running forward when I told you the truth. Thirty years of backwards time, and honesty was all it took to oil the gears. Maybe Platform 7 isn't about catching the right train. Maybe it's about being honest about which ticket you're really holding. Every passenger lies about their destination. The brave ones admit they're lost."
  },
  
  "3-13-birmingham": {
    old: "These connections aren't random. Innovation Depot has a waiting list, but I know Tom Brock. UAB's biomedical engineering program? Dr. Zhang remembers every student who showed real passion. Southern Company's renewable division? They're specifically looking for Alabama natives who understand why change here matters more. Birmingham's small enough that everyone knows someone. That's not nepotism - that's community.",
    new: "These connections aren't random, no more than coupling cars is luck. Innovation Depot's got a waiting list longer than a freight train, but I know Tom Brock - we're on the same line, if you follow my track. UAB's biomedical engineering program? Dr. Zhang remembers every student who showed real steam in their boiler. Southern Company's renewable division? They're specifically recruiting engineers who understand why Birmingham needs new rails, not just new trains. This city's small enough that all tracks eventually cross. That's not nepotism - that's a working railway. Every conductor knows every engineer, every engineer knows every station master. We keep each other running on time."
  },
  
  // New scenes with Samuel's enhanced voice
  newSamuelScenes: [
    {
      afterId: "1-8-quiet",
      scene: {
        id: "1-8-quiet-samuel",
        type: "dialogue",
        speaker: "Samuel",
        text: "Ah, you've found it. The Quiet Hour. When the timetable holds its breath and even the rails stop humming. Not everyone gets a ticket to this particular service. Time's not stopped, mind you - it's just running on a different gauge. Wide gauge, where seconds stretch like rails across prairies. Look at Platform 7 now - see how it's not one platform but a whole roundhouse of possibilities? That's what happens when you stop trying to catch trains and start learning to build them."
      }
    },
    
    {
      afterId: "2-4",
      scene: {
        id: "2-4-samuel",
        type: "dialogue",
        speaker: "Samuel",
        text: "The young ones think they're choosing careers like picking seats on a train - window or aisle, first class or coach. But that's passenger thinking. What you're really choosing is whether to ride the rails someone else laid down or grab a sledgehammer and start driving spikes yourself. Maya there? She's got one foot on her parents' track, one on her own. That's how you derail, standing between two moving trains. Eventually, you've got to pick your locomotive and trust it to carry you."
      }
    },
    
    {
      afterId: "3-15-birmingham",
      scene: {
        id: "3-15-samuel-final",
        type: "dialogue",
        speaker: "Samuel",
        text: "Birmingham's changing gauge, you see. Used to run on coal and steel rails - heavy gauge, slow but strong. Now it's trying to lay light rail over the old tracks - medical, digital, green energy. The trick isn't choosing the old or the new. It's understanding that sometimes you need to run both gauges on the same line. That's what Platform 7½ is really about - not a destination, but a transfer station between what was and what will be. Your future-self knew that. That's why they sent you here, to the junction where all of Birmingham's tracks converge."
      }
    }
  ]
};

// Function to enhance Samuel's dialogue
function enhanceSamuelVoice() {
  let enhancedCount = 0;
  let insertedCount = 0;
  
  // Update existing Samuel dialogue
  storyData.chapters.forEach(chapter => {
    chapter.scenes.forEach(scene => {
      const enhancement = samuelEnhancements[scene.id];
      if (enhancement && scene.text) {
        // For dialogue scenes, just update the text
        if (scene.type === 'dialogue' && scene.speaker === 'Samuel') {
          scene.text = enhancement.new.split('\n\n')[1]; // Get just the dialogue part
          enhancedCount++;
          console.log(`✓ Enhanced Samuel's dialogue in scene ${scene.id}`);
        } else if (scene.text === enhancement.old || scene.text.includes(enhancement.old.substring(0, 50))) {
          scene.text = enhancement.new;
          enhancedCount++;
          console.log(`✓ Enhanced scene ${scene.id} with Samuel's train voice`);
        }
      }
    });
  });
  
  // Insert new Samuel scenes
  samuelEnhancements.newSamuelScenes.forEach(item => {
    const chapter = storyData.chapters.find(c => 
      c.scenes.some(s => s.id === item.afterId)
    );
    
    if (chapter) {
      const afterIndex = chapter.scenes.findIndex(s => s.id === item.afterId);
      if (afterIndex !== -1) {
        const exists = chapter.scenes.some(s => s.id === item.scene.id);
        if (!exists) {
          chapter.scenes.splice(afterIndex + 1, 0, item.scene);
          insertedCount++;
          console.log(`✓ Inserted new Samuel scene ${item.scene.id}`);
        }
      }
    }
  });
  
  return { enhanced: enhancedCount, inserted: insertedCount };
}

// Main execution
console.log('Enhancing Samuel\'s voice with train terminology and temporal paradoxes...\n');

const result = enhanceSamuelVoice();

if (result.enhanced > 0 || result.inserted > 0) {
  // Save the enhanced story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  
  console.log(`\n✨ Samuel's Voice Enhanced!`);
  console.log(`   Updated ${result.enhanced} existing dialogues`);
  console.log(`   Added ${result.inserted} new Samuel scenes`);
  console.log('\n📊 Train Terminology Added:');
  console.log('   • Junction, switches, signals, coupling, gauge');
  console.log('   • Express, local, siding, roundhouse, derailing');
  console.log('   • Conductor, engineer, dispatcher, switchman');
  console.log('   • Rails, tracks, locomotives, freight, timetables');
  console.log('\n⏰ Temporal Paradoxes Added:');
  console.log('   • Watch ticking backwards every third beat');
  console.log('   • "Right on schedule for a train that hasn\'t been built"');
  console.log('   • "Standing on tracks that haven\'t been laid yet"');
  console.log('   • "Return ticket from a destination you haven\'t reached"');
  console.log('\n✅ Samuel now speaks like a mystical train conductor navigating time');
} else {
  console.log('\n⚠️ No changes made');
}