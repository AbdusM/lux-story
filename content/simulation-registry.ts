
import { SimulationDefaultContext, SimulationType } from '@/components/game/simulations/types'
import { SimulationPhase, SimulationDifficulty } from '@/lib/dialogue-graph'

// ISP: The "Context Factory"
// This registry defines the "Pure Form" of each simulation, independent of the dialogue node.
// It serves as the Truth for God Mode and a template for the actual game.
// Extended for 3-Phase System (Jan 2026)

export type SimulationDefinition = {
    id: string
    characterId: string
    title: string
    type: SimulationType // Enforce strict union
    icon: string
    description: string

    // 3-Phase System fields
    phase: SimulationPhase
    difficulty: SimulationDifficulty

    // The default context used when loaded via God Mode
    defaultContext: SimulationDefaultContext
}

export const SIMULATION_REGISTRY: SimulationDefinition[] = [
    // --- CORE GAMEPLAY ---
    // 1. MAYA (Reference Standard)
    {
        id: 'maya_servo_debugger',
        characterId: 'maya',
        title: 'Servo Control Debugger',
        type: 'system_architecture',
        icon: 'wrench',
        description: 'Calibrate mechanical arm PID parameters.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'The loading arm is oscillating wildly. The PID controller needs retuning. Analyze the wave pattern and adjust the P-gain and D-gain to stabilize the signal.',
            initialContext: {
                label: 'Servo Motor A7 Status',
                content: 'ERROR: Oscillation detected. Stability: 42%.',
                displayStyle: 'code'
            },
            successFeedback: '✓ STABILIZED: Signal variance < 5%. Servo tracking optimal.'
        }
    },

    // 2. KAI (Blueprint)
    {
        id: 'kai_blueprint',
        characterId: 'kai',
        title: 'Safety System Blueprint',
        type: 'visual_canvas', // ISP: Will be 'blueprint_editor'
        icon: 'draftjs',
        description: 'Design fail-safe mechanisms.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'The airlock cycling mechanism is jamming. Redesign the safety interlock circuit.',
            initialContext: {
                label: 'Schematic: Airlock Delta',
                content: '[BLUEPRINT LOADED] Missing redundant circuit detected.',
                displayStyle: 'code'
            },
            successFeedback: '✓ DESIGN APPROVED: Redundancy verified.'
        }
    },

    // 3. LIRA (Audio - ISP Synesthesia)
    {
        id: 'lira_audio',
        characterId: 'lira',
        title: 'Harmonic Visualizer',
        type: 'audio_studio', // New Type
        icon: 'music',
        description: 'Visualize the station\'s ambient hum.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'The station\'s reactor hum has a dissonance. Isolate the irregular frequency.',
            initialContext: {
                label: 'Audio Stream: Deck 4',
                content: 'Analyzing harmonic spectrum...',
                displayStyle: 'code',
                // Synesthesia Target: "Dementia/Confusion" -> Slow, Dark, Sparse but irregular
                target: {
                    targetState: {
                        tempo: 30,    // Slow / Lethargic
                        mood: 25,     // Dark / Minor key
                        texture: 60   // Dense/Confused texture (unlike the 20 in the placeholder)
                    },
                    tolerance: 12     // A bit flexible
                }
            },
            successFeedback: '✓ HARMONIC ALIGNED: Resonance optimal.'
        }
    },

    // 4. MARCUS (Triage)
    {
        id: 'marcus_triage',
        characterId: 'marcus',
        title: 'Casualty Triage Board',
        type: 'dashboard_triage',
        icon: 'activity',
        description: 'Manage patient inflow during crisis.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Emergency overflow. Sort patients by urgency level.',
            initialContext: {
                label: 'ER Status',
                content: 'Capacity: 110%. Incoming: 3.',
                displayStyle: 'code'
            },
            successFeedback: '✓ QUEUE CLEARED: Survival probability maximized.'
        }
    },

    // 5. TESS (Botany)
    {
        id: 'tess_botany',
        characterId: 'tess',
        title: 'Hydroponic Grid',
        type: 'botany_grid', // ISP: Cellular Automata
        icon: 'sprout',
        description: 'Optimize nutrient flow for rare flora.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'The Moonlight Orchid is fading. Rebalance nutrient mix to match genetic markers.',
            initialContext: {
                label: 'Genetic Profile: Moonlight Orchid',
                displayStyle: 'visual',
                target: {
                    targetState: {
                        nitrogen: 65,
                        phosphorus: 40,
                        potassium: 55
                    },
                    tolerance: 8,
                    plantName: 'Moonlight Orchid (Rare)',
                    hint: 'High nitrogen requirements observed. Phosphorus toxicity risk at high levels.'
                }
            },
            successFeedback: 'GROWTH OPTIMIZED. GENETIC MARKERS STABILIZED.'
        },

    },

    // --- HIDDEN / SPECIALIST ---

    // 6. SILAS (Farming/Soil)
    {
        id: 'silas_soil',
        characterId: 'silas',
        title: 'Soil Composition Analysis',
        type: 'dashboard_triage', // Fallback for now
        icon: 'sprout',
        description: 'Analyze soil microbiome data.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Determine why the Basil crop failed despite optimal sensor readings.',
            initialContext: {
                label: 'Sensor Logs',
                content: 'Moisture: 65% (Optimal). Plant Status: Dead.',
                displayStyle: 'code'
            },
            successFeedback: '✓ HYPOTHESIS CONFIRMED: Sensor placement error.'
        }
    },

    // 7. ALEX (Diplomacy)
    {
        id: 'alex_negotiation',
        characterId: 'alex',
        title: 'Diplomacy Table',
        type: 'chat_negotiation', // ISP: Influence Vector
        icon: 'users',
        description: 'Navigate complex social dynamics.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Convince the Bootcamp Director that the curriculum is failing students.',
            initialContext: {
                label: 'Meeting: Director Chen',
                content: '"Our placement rates are 95%. What is the problem?"',
                displayStyle: 'text'
            },
            successFeedback: '✓ PERSUADED: Director agrees to review outcome data.'
        }
    },

    // 8. ASHA (Mural)
    {
        id: 'asha_mural',
        characterId: 'asha',
        title: 'Mural Design Canvas',
        type: 'visual_canvas', // ISP: Art Canvas
        icon: 'palette',
        description: 'Design public art for the station.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'The Grand Hall wall is empty. Design a mural that represents "Unity".',
            initialContext: {
                label: 'Canvas: North Wall',
                content: 'Subject: Unity. Style: Abstract.',
                displayStyle: 'code'
            },
            successFeedback: '✓ ARTWORK COMMISSIONED: Public sentiment +5.'
        }
    },

    // 9. GRACE (Medical)
    {
        id: 'grace_diagnostics',
        characterId: 'grace',
        title: 'Medical Diagnostics',
        type: 'dashboard_triage', // Medical variant
        icon: 'activity',
        description: 'Analyze complex patient vitals.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Patient presenting with unknown toxicity. Isolate the compound.',
            initialContext: {
                label: 'Blood Panel',
                content: 'Unknown alkaloids detected. HR: 120bpm.',
                displayStyle: 'code'
            },
            successFeedback: '✓ TOXIN IDENTIFIED: Administering counter-agent.'
        }
    },

    // 10. ELENA (Economics)
    {
        id: 'elena_market',
        characterId: 'elena',
        title: 'Market Flow Visualizer',
        type: 'market_visualizer', // ISP: Ticker
        icon: 'trending-up',
        description: 'Tracking resource scarcity.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'There is a run on water filters. Stabilize the price.',
            initialContext: {
                label: 'Exchange Ticker',
                content: 'H2O-Filter: +400% (Panic Buy).',
                displayStyle: 'code'
            },
            successFeedback: '✓ MARKET STABILIZED: Release reserve stock.'
        }
    },

    // 11. JORDAN (Architecture)
    {
        id: 'jordan_structural',
        characterId: 'jordan',
        title: 'Structural Load Analysis',
        type: 'architect_3d',
        icon: 'drafting-compass',
        description: 'Ensure station integrity.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Micro-fractures detected in Sector 7 supports.',
            initialContext: {
                label: 'Load Map',
                content: 'Stress concentration: 98% of tolerance.',
                displayStyle: 'code'
            },
            successFeedback: '✓ REINFORCEMENT PLANNED: Load redistributed.'
        }
    },

    // 12. YAQUIN (History)
    {
        id: 'yaquin_timeline',
        characterId: 'yaquin',
        title: 'Historical Archive',
        type: 'historical_timeline',
        icon: 'book',
        description: 'Cross-reference historical events.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Verify the date of the "Great Blackout". Records conflict.',
            initialContext: {
                label: 'Archive Query',
                content: 'Source A: 2042. Source B: 2045.',
                displayStyle: 'code'
            },
            successFeedback: '✓ TIMELINE RECONCILED: Correlation found in maintenance logs.'
        }
    },

    // 13. ZARA (Data)
    {
        id: 'zara_audit',
        characterId: 'zara',
        title: 'Dataset Auditor',
        type: 'data_audit',
        icon: 'database',
        description: 'Find anomalies in large datasets.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'The water usage logs show phantom consumption.',
            initialContext: {
                label: 'Table: H2O_Usage_Q3',
                content: 'Rows: 50,000. Anomalies: 12.',
                displayStyle: 'code'
            },
            successFeedback: '✓ LEAK DETECTED: Physical leak in Zone 3.'
        }
    },

    // 14. DEVON (Therapy/Logic)
    {
        id: 'devon_logic',
        characterId: 'devon',
        title: 'Cognitive Web',
        type: 'conversation_tree',
        icon: 'network',
        description: 'Map family dynamics.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Map the communication breakdown between Father and Son.',
            initialContext: {
                label: 'Node Map',
                content: 'Link broken: Validating Emotion.',
                displayStyle: 'code'
            },
            successFeedback: '✓ CONNECTION RESTORED: Shared context established.'
        }
    },

    // 15. SAMUEL (Conductor)
    {
        id: 'samuel_ops',
        characterId: 'samuel',
        title: 'Station Operations',
        type: 'conductor_interface',
        icon: 'train-front',
        description: 'Monitor total station health.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Override lock on Express Line for emergency transport.',
            initialContext: {
                label: 'Metro Ops',
                content: 'Block 4: Locked.',
                displayStyle: 'code'
            },
            successFeedback: '✓ OVERRIDE AUTHENTICATED: Track clear.'
        }
    },

    // --- LINKEDIN 2026 CHARACTERS ---
    // 16. QUINN (Finance)
    {
        id: 'quinn_pitch',
        characterId: 'quinn',
        title: 'Portfolio Analysis',
        type: 'creative_direction',
        icon: 'presentation',
        description: 'Analyze investment risk and opportunity.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Investors are skeptical. Build a slide deck that sells the vision.',
            initialContext: {
                label: 'Slide Editor',
                content: 'Current Slide: "Why Us?". Missing: Data.',
                displayStyle: 'code'
            },
            successFeedback: '✓ FUNDING SECURED.'
        }
    },

    // 17. DANTE (Sales Strategy)
    {
        id: 'dante_pitch',
        characterId: 'dante',
        title: 'Pitch Deck Builder',
        type: 'chat_negotiation',
        icon: 'megaphone',
        description: 'Craft persuasive sales narratives.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'A potential client thinks they know what they want. They\'re wrong. Navigate to the real need.',
            initialContext: {
                label: 'Client Meeting',
                content: '"We need a CRM system."',
                displayStyle: 'text'
            },
            successFeedback: '✓ DEAL CLOSED: Client sees the deeper value.'
        }
    },

    // 18. ISAIAH (Nonprofit Leadership)
    {
        id: 'isaiah_logistics',
        characterId: 'isaiah',
        title: 'Supply Chain Map',
        type: 'dashboard_triage',
        icon: 'truck',
        description: 'Route critical resources to communities.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Food shipment delayed. Reroute via Sector 9.',
            initialContext: {
                label: 'Route Map',
                content: 'Sector 9: Clearance Required.',
                displayStyle: 'code'
            },
            successFeedback: '✓ DELIVERY CONFIRMED.'
        }
    },

    // 19. NADIA (AI Strategy)
    {
        id: 'nadia_news',
        characterId: 'nadia',
        title: 'Headline Editor',
        type: 'chat_negotiation',
        icon: 'newspaper',
        description: 'Shape public perception through strategic framing.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'A riot is starting. Edit the headline to de-escalate.',
            initialContext: {
                label: 'Headline Draft',
                content: '"Riots in Sector 4!"',
                displayStyle: 'text',
                // Synesthesia Target: "De-escalation" -> Low Urgency, Neutral Tone, High Nuance
                target: {
                    targetState: {
                        tempo: 20,    // Low Urgency
                        mood: 40,     // Neutral/Calm Tone
                        texture: 80   // High Nuance (Complex)
                    },
                    tolerance: 15
                }
            },
            successFeedback: '✓ SENTIMENT IMPROVED: Headline changed to "Protests in Sector 4".'
        }
    },

    // 20. ROHAN (Deep Tech)
    {
        id: 'rohan_nav',
        characterId: 'rohan',
        title: 'Constellation Navigator',
        type: 'visual_canvas',
        icon: 'compass',
        description: 'Chart routes through the stars.',
        phase: 1,
        difficulty: 'introduction',
        defaultContext: {
            taskDescription: 'Plot a course to the "Lost Sector".',
            initialContext: {
                label: 'Star Map',
                content: 'Coordinates unknown.',
                displayStyle: 'code'
            },
            successFeedback: '✓ ROUTE PLOTTED.'
        }
    }
]
