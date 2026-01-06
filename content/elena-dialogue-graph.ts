import { DialogueNode, DialogueGraph } from '@/lib/dialogue-graph'

const nodes: DialogueNode[] = [
  {
    nodeId: 'elena_intro',
    speaker: 'Elena',
    content: [{
      text: "Can you hear the hum? Not the station... the data. It's screaming.",
      emotion: 'anxious',
      microAction: 'She runs her hands through a chaotic spread of holographic documents.',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'what_data',
        text: 'What kind of data?',
        nextNodeId: 'elena_overload',
        pattern: 'exploring',
        skills: ['observation']
      },
      {
        choiceId: 'calm_down',
        text: 'Focus, Elena. One stream at a time.',
        nextNodeId: 'elena_synthesis_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['met_elena']
      }
    ]
  },
  {
    nodeId: 'elena_overload',
    speaker: 'Elena',
    content: [{
      text: "Everything. Supply chains, crew manifestos, external comms. There's a contradiction in the archives. A lie buried under three petabytes of noise.",
      emotion: 'paranoid',
      microAction: 'She swipes a document away violently.',
      variation_id: 'default',
      interrupt: {
        duration: 3500,
        type: 'grounding',
        action: 'Gently close the holographic display',
        targetNodeId: 'elena_interrupt_grounding',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    }],
    choices: [
      {
        choiceId: 'brute_force',
        text: 'We can read it all. If we split the workload...',
        nextNodeId: 'elena_fail_manual',
        pattern: 'building'
      },
      {
        choiceId: 'ai_research',
        text: 'We don\'t read it. We query it. Let me show you how to filter the noise.',
        nextNodeId: 'elena_simulation_perplexity', // Launches Simulation
        pattern: 'analytical',
        skills: ['digitalLiteracy'],
        visibleCondition: {
          patterns: {
            analytical: { min: 1 } // Lowered req for accessibility
          }
        }
      }
    ]
  },
  {
    nodeId: 'elena_simulation_perplexity',
    speaker: 'Elena',
    content: [{
      text: "Show me. The raw logs are a mess.",
      emotion: 'skeptical',
      variation_id: 'default'
    }],
    simulation: {
      type: 'prompt_engineering',
      title: 'Deep Research Protocol',
      taskDescription: 'The archives are flooded with noise. Construct a search query that isolates timestamp anomalies excluding standard maintenance logs.',
      initialContext: {
        label: 'Current Search Query',
        content: 'search "station errors"',
        displayStyle: 'code'
      },
      successFeedback: '✓ FILTER ACTIVE: 3 anomalies isolated in Sector 7.'
    },
    choices: [
      {
        choiceId: 'sim_basic_search',
        text: 'SEARCH: "error logs timestamp issue"',
        nextNodeId: 'elena_simulation_perplexity_fail',
        pattern: 'exploring'
      },
      {
        choiceId: 'sim_advanced_search',
        text: 'SEARCH: "timestamp_gap" -maintenance filetype:log',
        nextNodeId: 'elena_truth_found',
        pattern: 'analytical',
        skills: ['promptEngineering'],
        consequence: {
          characterId: 'elena',
          trustChange: 10,
          addKnowledgeFlags: ['unlocked_perplexity'],
          addGlobalFlags: ['golden_prompt_deep_search']
        }
      }
    ]
  },
  {
    nodeId: 'elena_simulation_perplexity_fail',
    speaker: 'Elena',
    content: [{
      text: "Still too much noise. thousands of matches. We need to be more specific.",
      emotion: 'frustrated',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_search',
        text: 'Let me try a different filter parameters.',
        nextNodeId: 'elena_simulation_perplexity'
      }
    ]
  },
  {
    nodeId: 'elena_truth_found',
    speaker: 'Elena',
    content: [{
      text: "It worked... The noise is gone. The anomaly wasn't in the data... it was in the timestamp. Someone paused the logs for three seconds.",
      emotion: 'amazed',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'keep_going',
        text: 'This is just the beginning. Let me show you how to synthesize it.',
        nextNodeId: 'elena_notebook_intro'
      }
    ]
  },
  {
    nodeId: 'elena_notebook_intro',
    speaker: 'Elena',
    content: [{
      text: "Synthesize? These reports are dense. It will take weeks to cross-reference the anomaly with the crew logs.",
      emotion: 'neutral',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'notebook_sim_start',
        text: 'Don\'t read them linearly. Let the AI map the connections.',
        nextNodeId: 'elena_simulation_notebooklm',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },
  {
    nodeId: 'elena_simulation_notebooklm',
    speaker: 'Elena',
    content: [{
      text: "Map the connections? How? It's just flat text.",
      emotion: 'skeptical',
      variation_id: 'default'
    }],
    simulation: {
      type: 'data_analysis',
      title: 'Contextual Synthesis',
      taskDescription: 'The crew logs are 500 pages of bureaucratic jargon. Generate an "Audio Overview" that focuses specifically on the 3-second time gap.',
      initialContext: {
        label: 'Crew_Logs_Vol_1-5.pdf',
        content: '[UPLOADED]',
        displayStyle: 'text'
      },
      successFeedback: '✓ AUDIO GENERATED: Two voices discussing the "missing seconds" in the engine room.'
    },
    choices: [
      {
        choiceId: 'sim_summarize',
        text: 'PROMPT: "Summarize this document."',
        nextNodeId: 'elena_simulation_notebook_fail',
        pattern: 'exploring'
      },
      {
        choiceId: 'sim_audio_deep',
        text: 'PROMPT: "Generate Audio Overview. Focus on: Engine Room status during the timestamp gap."',
        nextNodeId: 'elena_notebook_success',
        pattern: 'analytical',
        skills: ['informationLiteracy'],
        consequence: {
          characterId: 'elena',
          trustChange: 10,
          addKnowledgeFlags: ['unlocked_notebooklm'],
          addGlobalFlags: ['golden_prompt_notebooklm']
        }
      }
    ]
  },
  {
    nodeId: 'elena_simulation_notebook_fail',
    speaker: 'Elena',
    content: [{
      text: "It just gave me a generic summary of cafeteria menus and maintenance schedules. Useless.",
      emotion: 'annoyed',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_notebook',
        text: 'You have to direct the focus. Tell it WHAT to look for.',
        nextNodeId: 'elena_simulation_notebooklm'
      }
    ]
  },
  {
    nodeId: 'elena_notebook_success',
    speaker: 'Elena',
    content: [{
      text: "I hear it... the voices are discussing a power surge. But the logs don't show a surge.",
      emotion: 'intrigued',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'visualize_data',
        text: 'The text is hiding the surge. But maybe we can see it.',
        nextNodeId: 'elena_midjourney_intro',
        pattern: 'exploring'
      }
    ]
  },
  {
    nodeId: 'elena_midjourney_intro',
    speaker: 'Elena',
    content: [{
      text: "See it? How? We don't have camera footage from that sector.",
      emotion: 'confused',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'start_mj_sim',
        text: 'We reconstruct it. Based on the ambient sensor data.',
        nextNodeId: 'elena_simulation_midjourney',
        pattern: 'exploring',
        skills: ['visionaryThinking']
      }
    ]
  },
  {
    nodeId: 'elena_simulation_midjourney',
    speaker: 'Elena',
    content: [{
      text: "Reconstruct the scene... from scattered sensor data?",
      emotion: 'curious',
      variation_id: 'default'
    }],
    simulation: {
      type: 'creative_direction',
      title: 'Visual Reconstruction',
      taskDescription: 'Reconstruct the engine room environment during the surge using sensor metadata. We need to see the "Shadow" that triggered the sensors.',
      initialContext: {
        label: 'Sensor Data',
        content: 'Temp: 450K, Light: +2000%, Air: Ionized',
        displayStyle: 'code'
      },
      successFeedback: '✓ IMAGE GENERATED: A blinding white silhouette standing in the core.'
    },
    choices: [
      {
        choiceId: 'sim_mj_basic',
        text: 'PROMPT: "/imagine engine room explosion"',
        nextNodeId: 'elena_simulation_mj_fail',
        pattern: 'exploring'
      },
      {
        choiceId: 'sim_mj_pro',
        text: 'PROMPT: "/imagine engine room, volumetric lighting, blinding white silhouette, ionized air, cinematic, 8k --v 6.0"',
        nextNodeId: 'elena_mj_success',
        pattern: 'exploring',
        skills: ['creativity', 'promptEngineering'],
        consequence: {
          characterId: 'elena',
          trustChange: 15,
          addKnowledgeFlags: ['unlocked_midjourney'],
          addGlobalFlags: ['golden_prompt_midjourney']
        }
      }
    ]
  },
  {
    nodeId: 'elena_simulation_mj_fail',
    speaker: 'Elena',
    content: [{
      text: "This looks like a cartoon. It doesn't help me analyze the physics.",
      emotion: 'disappointed',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_mj',
        text: 'Too generic. Be specific about the lighting and atmosphere.',
        nextNodeId: 'elena_simulation_midjourney'
      }
    ]
  },
  {
    nodeId: 'elena_mj_success',
    speaker: 'Elena',
    content: [{
      text: "That silhouette... it matches the heat signature perfectly. It wasn't a malfunction. Someone was IN the core.",
      emotion: 'horrified',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'finish_elena',
        text: 'Now you see. The tools don\'t just process data. They reveal truth.',
        nextNodeId: 'hub_return',
        consequence: {
          characterId: 'elena',
          trustChange: 5
        }
      }
    ]
  },
  // ============= INTERRUPT TARGET NODES =============
  {
    nodeId: 'elena_interrupt_grounding',
    speaker: 'Elena',
    content: [{
      text: `*The holographics fade. She blinks like waking from a trance.*

*Long breath.*

Sorry. I... I get lost in it. The patterns. The noise.

*Quieter.*

You're the first person who's tried to pull me out instead of pushing me deeper.

*Looks at her hands.*

My therapist calls it "data spiraling." I call it... not being able to look away from the fire.

Thank you. For closing the display. Most people want me to find things faster.`,
      emotion: 'vulnerable_grateful',
      variation_id: 'interrupt_grounding_v1'
    }],
    choices: [
      {
        choiceId: 'elena_from_interrupt',
        text: "The truth will still be there after you breathe.",
        nextNodeId: 'elena_synthesis_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'interrupt_response']
  },

  // ============= VULNERABILITY ARC (Trust ≥ 6) =============
  // "The signal she missed" - why she's obsessed with finding hidden truths
  {
    nodeId: 'elena_vulnerability_arc',
    speaker: 'Elena',
    content: [{
      text: `*She stops scrolling. Stares at nothing.*

Can I tell you why I do this? Why I can't stop looking?

*Pause.*

Three years ago. Station Seven. I was the data analyst on duty.

There was an anomaly in the life support logs. Three data points. I flagged it as "sensor drift." Standard procedure.

*Voice drops.*

It wasn't drift. It was a slow leak. By the time anyone noticed... four people. Four people who trusted that someone was watching the data.

*Looks at you.*

I was watching. And I dismissed it as noise.`,
      emotion: 'haunted_guilty',
      variation_id: 'vulnerability_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_vulnerability_revealed', 'knows_about_station_seven']
      }
    ],
    choices: [
      {
        choiceId: 'elena_vuln_not_your_fault',
        text: "You followed procedure. The system failed, not you.",
        nextNodeId: 'elena_vulnerability_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'elena_vuln_carry_them',
        text: "You carry them with you. Every anomaly you chase.",
        nextNodeId: 'elena_vulnerability_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'elena_vuln_silence',
        text: "[Let the weight of it sit. She needs a witness, not absolution.]",
        nextNodeId: 'elena_vulnerability_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ],
    tags: ['elena_arc', 'vulnerability', 'emotional_core']
  },

  {
    nodeId: 'elena_vulnerability_response',
    speaker: 'Elena',
    content: [{
      text: `*She wipes her eyes.*

I know I can't save them. But every lie I uncover... every contradiction I surface... it's for them.

*Quiet.*

The paranoia isn't paranoia when you know what you missed. When you know what "noise" can hide.

*Small, tired smile.*

So I keep looking. Because somewhere in three petabytes of data, there might be another three data points. And this time... this time I won't dismiss them.

That's why I can't stop. That's why I need the tools. Not to replace my judgment—to extend it. To see what I couldn't see before.`,
      emotion: 'resolved_determined',
      interaction: 'nod',
      variation_id: 'vulnerability_response_v1'
    }],
    choices: [
      {
        choiceId: 'elena_vuln_to_truth',
        text: "Then let's find what's hiding in this noise. Together.",
        nextNodeId: 'elena_truth_found',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'vulnerability', 'resolution']
  }
]

export const elenaDialogueNodes = nodes

export const elenaDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(nodes.map(n => [n.nodeId, n])),
  startNodeId: 'elena_intro',
  metadata: {
    title: 'Elena Arc',
    author: 'System',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: nodes.length,
    totalChoices: nodes.reduce((acc, n) => acc + n.choices.length, 0)
  }
}
