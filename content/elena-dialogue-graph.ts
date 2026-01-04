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
      variation_id: 'default'
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
  }
]

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
