/**
 * Grace's Dialogue Graph
 * The Companion - Platform 5 (Elder Care / Home Health)
 *
 * CHARACTER: The Presence
 * Core Conflict: Invisible labor vs. Essential humanity - proving care work has dignity
 * Arc: From "just a caregiver" to recognizing the profound skill of presence
 * Mechanic: "The Moment" - A quiet scene where small choices reveal big truths
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const graceDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'grace_introduction',
    speaker: 'Grace',
    content: [
      {
        text: `*A woman sits on a bench, a worn tote bag beside her. She's looking at her phone, but not really seeing it.*

*She notices you and puts the phone away.*

Sorry. Just got off shift. Twelve hours. My feet are having opinions.

*Small tired smile.*

You look a little lost yourself.`,
        emotion: 'tired_warm',
        variation_id: 'grace_intro_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "*A woman sits on a bench, looking tired but alert.*\n\n*She notices you and something shifts in her face—recognition.*\n\nYou have that look. The one that says you actually see people.\n\nCome sit. My feet need the break anyway.", altEmotion: 'knowing' },
          { pattern: 'patience', minLevel: 4, altText: "*A woman sits on a bench, still and quiet.*\n\n*She notices you and doesn't rush to fill the silence.*\n\nYou're not in a hurry. Good. Neither am I.\n\n*Pats the bench.*\n\nSit if you want.", altEmotion: 'calm' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_intro_concern',
        text: "Twelve hours? What kind of work?",
        voiceVariations: {
          analytical: "Twelve hours. That's a long shift. What kind of work demands that?",
          helping: "That sounds exhausting. What kind of work keeps you that long?",
          building: "Twelve hours building something. What kind of work?",
          exploring: "I'm curious—what kind of work takes twelve hours?",
          patience: "Twelve hours. You must love what you do. What is it?"
        },
        nextNodeId: 'grace_the_work',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_intro_honest',
        text: "I am a little lost. That's why I'm here.",
        voiceVariations: {
          analytical: "I'm trying to figure out my next steps. Still mapping the terrain.",
          helping: "I am a little lost. But sometimes that's how you find what matters.",
          building: "I'm between projects. Figuring out what to build next.",
          exploring: "Lost is just another word for exploring. That's why I'm here.",
          patience: "I am a little lost. Taking my time to find the right path."
        },
        nextNodeId: 'grace_understands_lost',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_intro_sit',
        text: "[Sit down beside her quietly.]",
        nextNodeId: 'grace_quiet_sit',
        pattern: 'patience',
        skills: ['adaptability'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        characterId: 'grace',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'grace_arc']
  },

  {
    nodeId: 'grace_quiet_sit',
    speaker: 'Grace',
    content: [
      {
        text: `*You sit. She doesn't say anything for a moment.*

*The station sounds wash over you both—distant announcements, footsteps, the hum of the building.*

*Finally, she exhales.*

That's nice. Most people talk right away. Fill every silence.

*Looks at you sideways.*

You know how to just... be with someone. That's rare.`,
        emotion: 'appreciative',
        interaction: 'small',
        variation_id: 'quiet_sit_v1',
        patternReflection: [
          { pattern: 'patience', minLevel: 4, altText: "*You sit. The station sounds wash over you both.*\n\n*Finally, she exhales.*\n\nThat's nice. Most people fill every silence. You just... waited.\n\n*Something softens in her expression.*\n\nYou understand stillness. That's the hardest skill to teach.", altEmotion: 'recognized' },
          { pattern: 'helping', minLevel: 4, altText: "*You sit. The silence stretches, comfortable.*\n\n*She exhales.*\n\nYou know how to be with someone without needing anything from them.\n\n*Small smile.*\n\nThat's what I do for a living. Recognize it when I see it.", altEmotion: 'kindred' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_silence_learned',
        text: "Where'd you learn that? To value silence?",
        nextNodeId: 'grace_the_work',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'grace_silence_gift',
        text: "Sometimes silence is the gift.",
        nextNodeId: 'grace_the_work',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        thoughtId: 'steady-hand'
      }
    ],
    tags: ['grace_arc', 'connection']
  },

  {
    nodeId: 'grace_understands_lost',
    speaker: 'Grace',
    content: [
      {
        text: `*She nods slowly.*

Lost is honest. Lost is where all the real figuring-out happens.

*Shifts on the bench.*

I've been lost a few times. Figured I'd end up somewhere different than where I am now.

*Small laugh.*

Turns out "different" isn't always "worse." Just... different.`,
        emotion: 'reflective',
        variation_id: 'understands_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_where_ended',
        text: "Where did you end up?",
        nextNodeId: 'grace_the_work',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['grace_arc']
  },

  // ============= THE WORK =============
  {
    nodeId: 'grace_the_work',
    speaker: 'Grace',
    content: [
      {
        text: `Home health aide. Seven years now.

I go to people's houses. Mostly elderly. Help them with... everything. Getting dressed. Eating. Bathing. Medications.

*Looks at her hands.*

The stuff nobody wants to think about. The stuff that happens when bodies get old and minds get foggy.

*Quiet.*

It's not glamorous. But somebody's gotta do it.`,
        emotion: 'matter_of_fact',
        variation_id: 'the_work_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "Home health aide. Seven years.\n\nI go to people's houses. Help them with everything. Getting dressed. Eating. The things that get hard when bodies fail.\n\n*Looks at you.*\n\nYou understand. You've got that helper energy. You know some work is about more than tasks.", altEmotion: 'knowing' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_why_this',
        text: "How did you end up in this work?",
        voiceVariations: {
          analytical: "What led you to this path? I'm trying to understand the decision.",
          helping: "How did you end up caring for others this way?",
          building: "What drew you to building this kind of career?",
          exploring: "I'd love to hear your story. How did you find this work?",
          patience: "That's a journey. How did you find your way here?"
        },
        nextNodeId: 'grace_origin',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_hard_parts',
        text: "What's the hardest part?",
        voiceVariations: {
          analytical: "What challenges you most about this work? The variables you can't control?",
          helping: "What's the hardest part? The part that stays with you?",
          building: "Every meaningful work has hard parts. What's yours?",
          exploring: "I want to understand the full picture. What's hardest?",
          patience: "What takes the most from you? The part that requires the most patience?"
        },
        nextNodeId: 'grace_the_hard',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'grace_somebody',
        text: "'Somebody's gotta do it' sounds like it's more than that to you.",
        voiceVariations: {
          analytical: "You said 'somebody's gotta do it.' But the way you said it—there's more data there.",
          helping: "That phrase—'somebody's gotta do it'—it sounds like it carries weight for you.",
          building: "'Somebody's gotta do it' usually means you've built something meaningful from it.",
          exploring: "I heard something deeper when you said that. What's underneath?",
          patience: "There's a story behind 'somebody's gotta do it.' Take your time."
        },
        nextNodeId: 'grace_more_than',
        pattern: 'analytical',
        skills: ['observation'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      }
    ],
    tags: ['grace_arc', 'work']
  },

  {
    nodeId: 'grace_more_than',
    speaker: 'Grace',
    content: [
      {
        text: `*She's quiet for a moment. Then looks at you.*

You caught that, huh.

*Sighs.*

Yeah. It's more than "somebody's gotta."

My grandmother raised me. Strong woman. Worked thirty years at a laundry, retired, thought she'd have time to rest.

Then the dementia started.

*Voice drops.*

At the end... I was the only one who could calm her down. She didn't know my name anymore. But she knew my presence.

That's when I knew. This work isn't about tasks. It's about being the calm in someone's storm.`,
        emotion: 'vulnerable',
        interaction: 'small',
        variation_id: 'more_than_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_grandmother_present',
        text: "She's still with you. I can hear it.",
        voiceVariations: {
          analytical: "The way you describe her—she's still part of how you think.",
          helping: "She's still with you. I can hear her in everything you do.",
          building: "You're still building on what she started. She's in the foundation.",
          exploring: "She's part of your story. I can hear her in your voice.",
          patience: "She's still with you. Some people stay with us like that."
        },
        nextNodeId: 'grace_grandmother_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'grace_presence_skill',
        text: "Presence. That's a skill most people don't even know exists.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'analytical',
        skills: ['observation']
      }
    ],
    tags: ['grace_arc', 'backstory', 'emotional_core']
  },

  {
    nodeId: 'grace_grandmother_response',
    speaker: 'Grace',
    content: [
      {
        text: `*Her eyes get bright. She blinks it away.*

Every day.

Every time I sit with someone who's scared and confused, I think: what if this was her? What would I want someone to do?

*Takes a breath.*

That's the job. Not the tasks. The... remembering that every person used to be someone's whole world.

Mrs. Patterson? She was a jazz singer. Mr. Chen? Built bridges. They're not just bodies that need help. They're people with stories.`,
        emotion: 'tender',
        interaction: 'nod',
        variation_id: 'grandmother_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_see_stories',
        text: "You see their stories. That matters.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['grace_arc', 'dignity']
  },

  {
    nodeId: 'grace_origin',
    speaker: 'Grace',
    content: [
      {
        text: `*She shifts on the bench.*

Fell into it, honestly. I was going to be a nurse. Had the grades, started at Jeff State.

Then my grandmother got sick. Someone had to take care of her.

*Shrugs.*

By the time she passed, I'd been doing the work for two years. Figured I might as well get paid for it.

Started as a CNA. Did the training. Now I'm certified home health. Eight clients a week.`,
        emotion: 'resigned_peaceful',
        variation_id: 'origin_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_nurse_dream',
        text: "Do you still think about nursing?",
        nextNodeId: 'grace_nurse_comparison',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'grace_fell_stayed',
        text: "Fell into it. But you stayed.",
        nextNodeId: 'grace_why_stayed',
        pattern: 'patience',
        skills: ['observation'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'origin']
  },

  {
    nodeId: 'grace_why_stayed',
    speaker: 'Grace',
    content: [
      {
        text: `*Long pause.*

Because I'm good at it.

Not the lifting. Not the medications. Those you can train.

The being there. The... stillness when someone's scared.

*Looks at her hands.*

Mrs. Richardson—she's ninety-three, end-stage heart failure—she told her daughter: "Grace is the only one who doesn't make me feel like a burden."

*Quiet.*

That's why I stayed.`,
        emotion: 'proud_quiet',
        interaction: 'small',
        variation_id: 'why_stayed_v1',
        patternReflection: [
          { pattern: 'patience', minLevel: 4, altText: "*Long pause.*\n\nBecause I'm good at it. Not the lifting—the stillness.\n\nMrs. Richardson told her daughter: 'Grace is the only one who doesn't make me feel like a burden.'\n\n*Looks at you.*\n\nYou understand waiting. You sat with me just now without needing anything. That's the same skill.", altEmotion: 'recognized' },
          { pattern: 'analytical', minLevel: 4, altText: "*Long pause.*\n\nBecause I'm good at it. The being there. The stillness.\n\n*Studies you.*\n\nYou're measuring what I said. 'Good at it'—not 'stuck with it.' There's a difference, isn't there? Most people assume I settled.", altEmotion: 'appreciative' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_not_burden',
        text: "Making someone feel like they're not a burden. That's profound work.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'meaning']
  },

  {
    nodeId: 'grace_the_hard',
    speaker: 'Grace',
    content: [
      {
        text: `*She's quiet for a long moment.*

The goodbyes.

You spend months—sometimes years—with someone. You know how they take their coffee. What songs make them smile. Which grandchild is their favorite.

And then one day... they're gone.

*Exhales.*

I've lost eleven clients in seven years. Eleven people I cared about.

*Looks at the ceiling.*

The work doesn't stop. There's always someone else who needs help. So you grieve in the car, and then you walk into the next house with a smile.`,
        emotion: 'heavy',
        interaction: 'small',
        variation_id: 'the_hard_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_how_cope',
        text: "How do you keep going? With that kind of loss?",
        nextNodeId: 'grace_coping',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_loss_silence',
        text: "[Let the weight of that sit. Don't try to fix it.]",
        nextNodeId: 'grace_appreciated_silence',
        pattern: 'patience',
        skills: ['adaptability'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      }
    ],
    tags: ['grace_arc', 'grief']
  },

  {
    nodeId: 'grace_appreciated_silence',
    speaker: 'Grace',
    content: [
      {
        text: `*She glances at you. Something softens.*

You didn't try to make it better. Most people do. "They're in a better place." "At least they're not suffering."

*Shakes head.*

Sometimes grief just needs room to breathe.

*Pause.*

Thank you for that.`,
        emotion: 'grateful',
        variation_id: 'appreciated_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_learned_patience',
        text: "Sounds like you've learned a lot about what people actually need.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['grace_arc', 'connection']
  },

  {
    nodeId: 'grace_coping',
    speaker: 'Grace',
    content: [
      {
        text: `*She thinks.*

I remember what I gave them.

Mr. Jefferson—he was terrified of dying alone. I made sure I was there. Held his hand at the end.

Mrs. Park—she wanted to die at home, not in a hospital. I helped make that happen.

*Quiet.*

I can't stop death. But I can make the journey less lonely.

That's enough. It has to be.`,
        emotion: 'resolved',
        variation_id: 'coping_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_that_enough',
        text: "That's more than enough. That's everything.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'meaning']
  },

  // ============= THE INVISIBLE SKILL =============
  {
    nodeId: 'grace_invisible_skill',
    speaker: 'Grace',
    content: [
      {
        text: `*She sits up a little straighter.*

You know what nobody teaches you? The real skill.

It's not the medications or the transfers or the wound care. That's trainable.

It's reading a room. Knowing when someone needs to talk and when they need silence. Noticing when "I'm fine" means "I'm not fine."

*Taps her temple.*

This work is emotional labor. Constant calibration. And nobody sees it.`,
        emotion: 'insistent',
        variation_id: 'invisible_v1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "*She sits up a little straighter.*\n\nThe real skill? Reading a room. Knowing when someone needs to talk and when they need silence.\n\nYou're analytical. You break things down. But this work is about feeling—and then responding. Constant calibration.\n\nNobody sees it. But you do.", altEmotion: 'knowing' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_not_automated',
        text: "That can't be automated. That's human.",
        nextNodeId: 'grace_automation_truth',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'grace_undervalued',
        text: "And probably underpaid.",
        nextNodeId: 'grace_economics',
        pattern: 'helping',
        skills: ['observation']
      },
      {
        choiceId: 'grace_show_me',
        text: "Show me what you mean. Give me an example.",
        nextNodeId: 'grace_the_moment_setup',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['grace_arc', 'invisible_labor']
  },

  {
    nodeId: 'grace_automation_truth',
    speaker: 'Grace',
    content: [
      {
        text: `*She nods firmly.*

Exactly.

You can build a robot to dispense pills. Maybe even one that can lift someone into a wheelchair.

But you can't build a robot that knows the difference between "leave me alone" meaning "I need space" versus "I'm testing to see if you'll stay."

*Looks at you.*

People talk about AI taking jobs. But this job? It's about presence. Connection. Being human with someone who's scared.

No machine can do that.`,
        emotion: 'certain',
        interaction: 'nod',
        variation_id: 'automation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_growing_need',
        text: "And there's more need for this work every year.",
        nextNodeId: 'grace_demographics',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'grace_to_future',
        text: "Where do you see this field going?",
        nextNodeId: 'grace_vision',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['grace_arc', 'automation']
  },

  {
    nodeId: 'grace_economics',
    speaker: 'Grace',
    content: [
      {
        text: `*Bitter laugh.*

Fifteen dollars an hour. No benefits until last year. Mileage? Sometimes. Paid time off? Ha.

I work twelve-hour shifts, drive fifty miles a day, and make less than the person who serves coffee at the hospital lobby.

*Crosses arms.*

We're "essential workers" when there's a pandemic. We're "unskilled labor" when it's time to set wages.

*Quiet.*

Funny how that works.`,
        emotion: 'frustrated',
        interaction: 'shake',
        variation_id: 'economics_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_why_stay_then',
        text: "With all that... why stay?",
        nextNodeId: 'grace_why_stay_real',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'grace_what_changes',
        text: "What needs to change?",
        nextNodeId: 'grace_vision',
        pattern: 'analytical',
        skills: ['systemsThinking']
      }
    ],
    tags: ['grace_arc', 'economics', 'labor_reality']
  },

  {
    nodeId: 'grace_why_stay_real',
    speaker: 'Grace',
    content: [
      {
        text: `*Long pause. She looks at something far away.*

Because Mrs. Richardson called me her angel.

Because Mr. Chen's daughter hugged me at his funeral and said, "You gave him three more years."

Because when I walk into a house and someone's eyes light up... that's not something you can put a price on.

*Looks at you.*

The money's terrible. The hours are brutal. But the meaning? The meaning is real.

I'd rather be underpaid and matter than overpaid and empty.`,
        emotion: 'fierce_tender',
        interaction: 'bloom',
        variation_id: 'why_stay_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_meaning_clear',
        text: "That's the clearest thing I've heard all day.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'meaning', 'values']
  },

  {
    nodeId: 'grace_nurse_comparison',
    speaker: 'Grace',
    content: [
      {
        text: `*She considers.*

Sometimes. But honestly? I'm not sure nursing is what I thought it was.

Nurses are amazing. But they're stretched thin. Fifteen patients. Charting. Paperwork. Running.

*Gestures.*

I get to sit. I get to know people. I'm there for the slow moments, not just the emergencies.

Different work. Not lesser. Just... different.`,
        emotion: 'reflective',
        variation_id: 'nurse_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_different_value',
        text: "Different can be exactly right.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['grace_arc', 'comparison']
  },

  {
    nodeId: 'grace_demographics',
    speaker: 'Grace',
    content: [
      {
        text: `*She nods gravely.*

Ten thousand people turn 65 every day in this country. Every. Day.

The boomers are aging. And there aren't enough of us. Not even close.

*Spreads hands.*

By 2030, we'll need a million more home health workers. A million. And right now, we can barely fill the jobs we have because the pay is garbage.

*Shakes head.*

It's a crisis in slow motion. And nobody's watching.`,
        emotion: 'worried',
        variation_id: 'demographics_v1',
        interrupt: {
          duration: 3000,
          type: 'silence',
          action: 'Hold her gaze. Let her know you see it.',
          targetNodeId: 'grace_interrupt_acknowledge',
          consequence: {
            characterId: 'grace',
            trustChange: 1
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'grace_what_solution',
        text: "What's the solution?",
        nextNodeId: 'grace_vision',
        pattern: 'analytical',
        skills: ['systemsThinking']
      }
    ],
    tags: ['grace_arc', 'demographics', 'labor_gap']
  },

  // ============= THE MOMENT (Interactive Mechanic) =============
  {
    nodeId: 'grace_the_moment_setup',
    speaker: 'Grace',
    content: [
      {
        text: `*She looks at you for a long moment.*

You want to know what this work really is?

Let me tell you about yesterday.

Mrs. Williams. Eighty-seven. Alzheimer's. Most days she doesn't know where she is.

I came in for my shift. She was sitting by the window, crying.

*Pause.*

What would you do?`,
        emotion: 'testing',
        variation_id: 'moment_setup_v1'
      }
    ],
    simulation: {
      type: 'chat_negotiation',
      title: 'The Moment of Presence',
      taskDescription: 'Mrs. Williams is crying by the window. She has Alzheimer\'s and may not remember why she\'s upset. Your response will shape whether she feels alone or accompanied.',
      initialContext: {
        label: 'Patient Context: Mrs. Williams',
        content: `PATIENT: Dorothy Williams, 87
CONDITION: Alzheimer's, mid-stage
CURRENT STATE: Sitting by window, crying softly

CARE NOTES:
- Husband passed 40 years ago
- Sometimes "relives" his death as if it just happened
- Words often fail her when distressed
- Responds well to gentle presence, not questions

QUESTION: How do you approach her?
- Asking "What's wrong?" may frustrate her
- Distraction dismisses her grief
- Sometimes presence is the answer`,
        displayStyle: 'text'
      },
      successFeedback: '✓ GRACE: "You sat. You stayed. After a few minutes, she took your hand. That\'s the work. Not fixing. Accompanying."'
    },
    choices: [
      {
        choiceId: 'moment_ask_wrong',
        text: "Ask her what's wrong.",
        nextNodeId: 'grace_moment_ask',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'moment_sit_quiet',
        text: "Sit down next to her. Don't say anything yet.",
        nextNodeId: 'grace_moment_correct',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'moment_distract',
        text: "Try to distract her. Put on music, start a task.",
        nextNodeId: 'grace_moment_distract',
        pattern: 'building',
        skills: ['adaptability']
      }
    ],
    tags: ['grace_arc', 'interactive', 'the_moment']
  },

  {
    nodeId: 'grace_moment_ask',
    speaker: 'Grace',
    content: [
      {
        text: `Good instinct. Caring.

But with Alzheimer's... she might not be able to tell you. The words get tangled. And asking can make it worse—she'll feel frustrated that she can't explain.

*Soft.*

Sometimes the question isn't "what's wrong." Sometimes it's just "I'm here."

What else might you try?`,
        emotion: 'teaching',
        variation_id: 'moment_ask_v1'
      }
    ],
    choices: [
      {
        choiceId: 'moment_try_presence',
        text: "Just... be there. Let her feel not-alone.",
        nextNodeId: 'grace_moment_correct',
        pattern: 'patience',
        skills: ['adaptability'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'the_moment']
  },

  {
    nodeId: 'grace_moment_distract',
    speaker: 'Grace',
    content: [
      {
        text: `That's what a lot of people try. And sometimes it works.

But yesterday? She wasn't confused. She was grieving.

*Quiet.*

Her husband died forty years ago. But in her mind, it just happened. Every few months, she loses him again.

Distraction would have... dismissed that. Made her feel crazy.

What do you think she needed?`,
        emotion: 'gentle',
        variation_id: 'moment_distract_v1'
      }
    ],
    choices: [
      {
        choiceId: 'moment_presence_realize',
        text: "Someone to sit with her in the grief. Not fix it.",
        nextNodeId: 'grace_moment_correct',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'the_moment']
  },

  {
    nodeId: 'grace_moment_correct',
    speaker: 'Grace',
    content: [
      {
        text: `*She looks at you with something like surprise.*

That's it. That's exactly it.

I sat down. Didn't say anything. After a few minutes, she took my hand.

We sat there for half an hour. She cried. I stayed.

Eventually she looked at me and said, "Thank you for not trying to fix it."

*Quiet.*

That's the work. Not fixing. Accompanying. Being the steady presence when everything else is chaos.

You get it. Most people don't.`,
        emotion: 'moved',
        interaction: 'bloom',
        variation_id: 'moment_correct_v1',
        interrupt: {
          duration: 3500,
          type: 'connection',
          action: 'Reach out and touch her shoulder',
          targetNodeId: 'grace_interrupt_comfort',
          consequence: {
            characterId: 'grace',
            trustChange: 2
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'grace_to_vision',
        text: "That's a skill. A real, valuable skill.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['grace_arc', 'the_moment', 'revelation']
  },

  // ============= VISION =============
  {
    nodeId: 'grace_vision',
    speaker: 'Grace',
    content: [
      {
        text: `*She sits up, energy returning.*

What needs to change? Everything.

Pay. Benefits. Respect. Career paths.

Right now, there's no ladder. I'm doing the same work I did seven years ago. No way to advance without leaving the bedside.

*Looks at the station.*

I want to train people. Not just the tasks—the presence. The emotional intelligence.

Start a program. "Companion Care." Teach people that this work isn't unskilled—it's differently skilled.

*Quiet fire.*

And then fight like hell for wages that match the value.`,
        emotion: 'determined',
        interaction: 'bloom',
        variation_id: 'vision_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_what_tell',
        text: "What would you tell someone considering this work?",
        nextNodeId: 'grace_advice',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'grace_companion_program',
        text: "Companion Care. That reframes everything.",
        nextNodeId: 'grace_farewell',
        pattern: 'building',
        skills: ['creativity'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'vision']
  },

  {
    nodeId: 'grace_advice',
    speaker: 'Grace',
    content: [
      {
        text: `*She thinks carefully.*

Ask yourself: can you be with suffering without trying to fix it?

That's the real question. Not "are you strong enough to lift someone." Not "can you handle bodily fluids."

Can you sit with someone who's dying and not run away? Can you be present without needing to solve?

*Looks at you.*

If you can... this work will break your heart and fill it at the same time.

It's not for everyone. But for the right person? It's everything.`,
        emotion: 'wise',
        variation_id: 'advice_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_final',
        text: "Thank you, Grace. Really.",
        nextNodeId: 'grace_farewell',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'advice']
  },

  // ============= INTERRUPT TARGET NODES =============
  // These nodes are reached when player takes an interrupt opportunity

  {
    nodeId: 'grace_interrupt_comfort',
    speaker: 'Grace',
    content: [
      {
        text: `*She looks at your hand on her shoulder. For a moment, her composure wavers.*

*Quiet laugh.*

Sorry. I... don't usually tell that story.

*Wipes eye quickly.*

It's just... you listened. Really listened. Not waiting to give advice. Not trying to fix me.

That's... that's what I try to give my patients. And nobody ever...

*She takes a breath.*

Thank you. For being present. That's the whole thing, isn't it? Just... being there.`,
        emotion: 'vulnerable',
        interaction: 'bloom',
        variation_id: 'interrupt_comfort_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_from_interrupt_comfort',
        text: "That's a skill. A real, valuable skill.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['grace_arc', 'interrupt_response']
  },

  {
    nodeId: 'grace_interrupt_acknowledge',
    speaker: 'Grace',
    content: [
      {
        text: `*She stops mid-sentence, caught by your silence.*

*Quiet.*

You're watching. Aren't you.

*Something shifts in her face.*

I spend so much time feeling invisible. The work I do—people don't see it. They don't want to think about aging, about needing help.

But you... you stopped. You're here.

*Small, real smile.*

That matters more than you know.`,
        emotion: 'seen',
        interaction: 'ripple',
        variation_id: 'interrupt_acknowledge_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_from_acknowledge',
        text: "What you do deserves to be seen.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'interrupt_response']
  },

  {
    nodeId: 'grace_interrupt_hug',
    speaker: 'Grace',
    content: [
      {
        text: `*She's surprised for just a moment. Then she hugs you back.*

*Tight. Real.*

*After a long moment, she pulls back, eyes bright.*

You know what? I needed that.

Twelve-hour shifts, you give and give and give. And sometimes you forget that you need to receive too.

*She picks up her bag, looking lighter.*

Go change the world, kid. Or at least... be present in it. That's enough.`,
        emotion: 'grateful',
        interaction: 'bloom',
        variation_id: 'interrupt_hug_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_after_hug',
        text: "Take care of yourself, Grace.",
        nextNodeId: samuelEntryPoints.GRACE_REFLECTION_GATEWAY,
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['grace_arc_complete'],
        thoughtId: 'long-game'
      }
    ],
    tags: ['ending', 'grace_arc', 'interrupt_response']
  },

  // ============= SIMULATION: PATIENT COMFORT =============
  // A worried family member during a medical crisis - balancing honesty with hope

  {
    nodeId: 'grace_simulation_intro',
    speaker: 'Grace',
    content: [
      {
        text: `*She looks at you thoughtfully.*

You want to understand what this work really takes? Let me share something from last week.

Mrs. Rodriguez's daughter, Maria. Twenty-eight years old. Her mother had a stroke three days ago.

*She pulls out her phone, shows you a photo of an older woman smiling.*

Maria's been at the hospital every day. But her mother was just transferred to home care. My care.

When I arrived for my first shift, Maria was pacing the living room. Red eyes. Shaking hands.

*Quieter.*

What do you do with that? Someone who's terrified they're going to lose their mother, and you're the stranger walking into their home?`,
        emotion: 'teaching',
        variation_id: 'sim_intro_v1'
      }
    ],
    simulation: {
      type: 'chat_negotiation',
      title: 'The Worried Daughter',
      taskDescription: 'Maria Rodriguez is terrified about her mother\'s condition. She needs information, but more than that, she needs to feel heard. Your approach will determine whether she trusts you with her mother\'s care.',
      initialContext: {
        label: 'Situation Context',
        content: `PATIENT: Rosa Rodriguez, 72
CONDITION: Post-stroke, day 3, transferred to home care
FAMILY: Daughter Maria (28), sole caregiver

MARIA'S STATE:
- Has not slept in 3 days
- Asking rapid-fire medical questions
- Checking and rechecking equipment
- Voice trembling when she speaks

YOUR ROLE: First home health visit
CHALLENGE: Build trust while being honest about the difficult road ahead`,
        displayStyle: 'text'
      },
      successFeedback: 'GRACE: "You found the balance. Information delivered with care. That\'s the invisible skill."'
    },
    choices: [
      {
        choiceId: 'sim_intro_medical',
        text: "Start with the medical facts. She needs information.",
        nextNodeId: 'grace_simulation_phase_1',
        pattern: 'analytical',
        skills: ['communication']
      },
      {
        choiceId: 'sim_intro_acknowledge',
        text: "Start by acknowledging how hard this must be for her.",
        nextNodeId: 'grace_simulation_phase_1',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'sim_intro_routine',
        text: "Jump into the care routine. Action calms anxiety.",
        nextNodeId: 'grace_simulation_phase_1',
        pattern: 'building',
        skills: ['adaptability']
      }
    ],
    tags: ['grace_arc', 'simulation', 'patient_comfort']
  },

  {
    nodeId: 'grace_simulation_phase_1',
    speaker: 'Grace',
    content: [
      {
        text: `*Grace nods, considering your approach.*

Okay. Let's say you chose to start there. Maria's still pacing, but she stops. Looks at you.

*Imitates Maria's voice, slightly higher, strained.*

"The hospital said she might not recover fully. What does that mean? Will she walk again? Will she know who I am? The doctor talked so fast and I couldn't—"

*She breaks off, takes a breath.*

She's spiraling. Three questions at once. Each one bigger than the last.

*Looks at you.*

How do you handle this?`,
        emotion: 'testing',
        variation_id: 'phase1_v1'
      }
    ],
    choices: [
      {
        choiceId: 'phase1_answer_all',
        text: "Answer each question honestly, one at a time.",
        nextNodeId: 'grace_simulation_phase_2',
        pattern: 'analytical',
        skills: ['communication']
      },
      {
        choiceId: 'phase1_slow_down',
        text: "Gently slow her down. 'Let's sit. I'm here. We'll take this one step at a time.'",
        nextNodeId: 'grace_simulation_phase_2',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'phase1_reassure',
        text: "Reassure her that everything will be okay.",
        nextNodeId: 'grace_simulation_fail',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'phase1_deflect',
        text: "Tell her to ask the doctor those questions.",
        nextNodeId: 'grace_simulation_fail',
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ],
    tags: ['grace_arc', 'simulation', 'patient_comfort']
  },

  {
    nodeId: 'grace_simulation_phase_2',
    speaker: 'Grace',
    content: [
      {
        text: `*Grace's expression softens.*

Better. You didn't give false hope. You didn't dodge. You met her where she was.

*Continues the scenario.*

Maria sits. Her hands are still shaking, but she's listening now.

"The doctors say there's a long road ahead. That recovery could take months or... or longer. I don't know how to do this. I work full time. I can't afford to quit. But I can't leave her alone."

*Pause.*

She's not asking a medical question anymore. She's asking you to tell her it's possible to hold all of this together.

*Looks at you directly.*

What do you say?`,
        emotion: 'serious',
        variation_id: 'phase2_v1',
        interrupt: {
          duration: 4000,
          type: 'comfort',
          action: 'Reach out and gently touch her arm',
          targetNodeId: 'grace_interrupt_comfort',
          consequence: {
            characterId: 'grace',
            trustChange: 1
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'phase2_practical',
        text: "'Let me tell you about the support systems available. Respite care, community resources, flexible scheduling.'",
        nextNodeId: 'grace_simulation_success',
        pattern: 'building',
        skills: ['problemSolving'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'phase2_honest',
        text: "'It's hard. I won't lie. But you're not alone. I'm here. And we'll figure this out together, day by day.'",
        nextNodeId: 'grace_simulation_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'phase2_boundaries',
        text: "'That's not really my area. I'm here for the medical care, not the life advice.'",
        nextNodeId: 'grace_simulation_fail',
        pattern: 'analytical',
        skills: ['communication']
      },
      {
        choiceId: 'phase2_overcommit',
        text: "'Don't worry! I'll take care of everything. You just focus on work.'",
        nextNodeId: 'grace_simulation_fail',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ],
    tags: ['grace_arc', 'simulation', 'patient_comfort']
  },

  {
    nodeId: 'grace_simulation_success',
    speaker: 'Grace',
    content: [
      {
        text: `*Grace exhales. A real smile.*

That's it. That's exactly it.

*Sits back.*

You didn't promise the impossible. You didn't dismiss her fears. You met her in the hard truth AND gave her something to hold onto.

*Quieter.*

Maria cried after that. Not the panicked crying from before. Relief. Someone finally saw how heavy this was.

*Looks at her hands.*

Her mother's recovery took eight months. Maria took a leave of absence from work—we helped her apply for FMLA. Her mother walks with a cane now. Knows her daughter's name.

*Meets your eyes.*

But here's the thing: that moment in the living room? That's when the real healing started. Not with the medicine. With being seen.

That's the invisible skill. Holding space for fear without drowning in it.`,
        emotion: 'proud',
        interaction: 'bloom',
        variation_id: 'success_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'grace',
        addKnowledgeFlags: ['grace_simulation_complete']
      }
    ],
    choices: [
      {
        choiceId: 'success_to_vision',
        text: "You make it look natural. But it's not, is it?",
        nextNodeId: 'grace_vision',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'success_learn_more',
        text: "What happens when you can't find that balance?",
        nextNodeId: 'grace_the_hard',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['grace_arc', 'simulation', 'success']
  },

  {
    nodeId: 'grace_simulation_fail',
    speaker: 'Grace',
    content: [
      {
        text: `*Grace shakes her head slowly.*

I understand the impulse. But...

*Pause.*

When you make promises you can't keep, trust breaks. When you deflect, people feel abandoned. When you set walls too high, you become just another stranger in their crisis.

*Quieter.*

Maria? With the wrong approach, she would have called the agency the next day. Asked for a different aide. Or worse—stopped asking for help at all.

*Looks at you.*

I've seen both. The families who feel supported enough to let you in. And the ones who build walls because someone before you made them feel like a burden.

*Sighs.*

This work is about more than tasks. It's about trust. And trust, once broken, is hard to rebuild.

Want to try again?`,
        emotion: 'disappointed_gentle',
        variation_id: 'fail_v1'
      }
    ],
    choices: [
      {
        choiceId: 'fail_retry',
        text: "Yes. Show me what I missed.",
        nextNodeId: 'grace_simulation_intro',
        pattern: 'patience',
        skills: ['learningAgility']
      },
      {
        choiceId: 'fail_reflect',
        text: "I see it now. The balance between honesty and hope.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'simulation', 'failure']
  },

  // ============= VULNERABILITY ARC (Trust ≥ 6) =============
  // "The night she almost quit" - when invisible labor became unbearable
  {
    nodeId: 'grace_vulnerability_arc',
    speaker: 'Grace',
    content: [
      {
        text: `*She's quiet for a long moment. Then looks at you with something raw.*

Can I tell you something I've never told anyone?

*Pause.*

Three years ago... I almost quit. Not just the job. Everything.

Mrs. Patterson—the jazz singer I mentioned—she'd just passed. Third client that month. And my daughter's school called because I missed her recital. Again.

I sat in my car in the parking lot for two hours. Couldn't go in. Couldn't go home.

*Voice drops.*

Nobody sees what this costs. They see the angel. They don't see the woman who forgot her own mother's birthday because she was too busy remembering everyone else's medications.`,
        emotion: 'raw_vulnerable',
        variation_id: 'vulnerability_v1',
        richEffectContext: 'warning'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'grace',
        addKnowledgeFlags: ['grace_vulnerability_revealed', 'knows_about_almost_quitting']
      }
    ],
    choices: [
      {
        choiceId: 'grace_vuln_what_kept',
        text: "What kept you from quitting?",
        nextNodeId: 'grace_vulnerability_what_saved',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'grace_vuln_daughter',
        text: "Your daughter... does she understand now?",
        nextNodeId: 'grace_vulnerability_daughter',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_vuln_silence',
        text: "[Just be present. Let her feel not alone in this.]",
        nextNodeId: 'grace_vulnerability_what_saved',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      }
    ],
    tags: ['grace_arc', 'vulnerability', 'emotional_core']
  },

  {
    nodeId: 'grace_vulnerability_what_saved',
    speaker: 'Grace',
    content: [
      {
        text: `*She wipes her eyes.*

Mr. Chen.

He was dying. We both knew it. But that day, in the parking lot, my phone buzzed.

A text from his daughter: "Dad's been asking for you all morning. Says you're the only one who makes him laugh."

*Quiet.*

I realized... I'm not giving too much. I'm giving exactly enough. To the people who need it.

The problem wasn't the work. It was trying to be everything to everyone. Now I draw lines. Not walls—lines.

*Looks at you.*

I still miss recitals sometimes. But my daughter knows why. And she's proud of me.

That's enough. It has to be.`,
        emotion: 'resolved_tender',
        interaction: 'bloom',
        variation_id: 'what_saved_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_vuln_to_vision',
        text: "Lines, not walls. That's wisdom.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'vulnerability', 'resolution']
  },

  {
    nodeId: 'grace_vulnerability_daughter',
    speaker: 'Grace',
    content: [
      {
        text: `*Small smile.*

She's sixteen now. Volunteers at the nursing home on weekends.

*Voice catches.*

Last month, she told me: "Mom, I used to be angry you weren't at my stuff. Then I realized you were at someone else's 'last stuff.' That's more important."

*Pause.*

I cried for an hour.

She sees me now. Really sees me. That's worth more than every recital I missed.`,
        emotion: 'tender_proud',
        interaction: 'bloom',
        variation_id: 'daughter_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_daughter_to_vision',
        text: "She learned presence from watching you.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'vulnerability', 'family']
  },

  // ============= FAREWELL =============
  {
    nodeId: 'grace_farewell',
    speaker: 'Grace',
    content: [
      {
        text: `*She stands, picks up her tote bag.*

I should get home. Sleep before my next shift.

*Looks at you.*

Whatever you're figuring out... remember this:

The world needs people who can be present. Not just productive. Present.

That's rarer than you think. And it's worth something.

*Small smile.*

Take care of yourself. And if you ever need someone to just... sit with you? You know where to find me.`,
        emotion: 'warm',
        interaction: 'nod',
        variation_id: 'farewell_v1',
        interrupt: {
          duration: 4000,
          type: 'connection',
          action: 'Step forward and hug her',
          targetNodeId: 'grace_interrupt_hug',
          consequence: {
            characterId: 'grace',
            trustChange: 2
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'grace_goodbye',
        text: "Take care, Grace.",
        nextNodeId: samuelEntryPoints.GRACE_REFLECTION_GATEWAY,
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['grace_arc_complete'],
        thoughtId: 'long-game'
      }
    ],
    tags: ['ending', 'grace_arc']
  }
]

export const graceEntryPoints = {
  INTRODUCTION: 'grace_introduction',
  SIMULATION: 'grace_simulation_intro'
} as const

export const graceDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(graceDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: graceEntryPoints.INTRODUCTION,
  metadata: {
    title: "Grace's Bench",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: graceDialogueNodes.length,
    totalChoices: graceDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
