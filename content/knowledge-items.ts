/**
 * Knowledge Items & Trade Chains
 * Feature ID: D-056
 * 
 * Defines discrete pieces of knowledge that can be traded between characters.
 */

export interface KnowledgeItem {
    id: string
    sourceCharacterId: string
    topic: string
    content: string
    relatedCharacters: string[]   // Who this info is about
    unlocksTradesWith: string[]   // Which characters care about this
    tier: 'rumor' | 'insight' | 'secret' | 'truth'
}

export interface KnowledgeTradeChain {
    id: string
    description: string
    steps: {
        characterId: string
        requiresKnowledge: string[]
        grantsKnowledge: string
        trustChange: number
    }[]
}

// ═══════════════════════════════════════════════════════════════════════════
// KNOWLEDGE ITEMS
// ═══════════════════════════════════════════════════════════════════════════

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
    // --- WORKSHOP CHAIN ---
    {
        id: 'maya_workshop_location',
        sourceCharacterId: 'maya',
        topic: 'The Hidden Workshop',
        content: 'Maya\'s workshop is beyond Platform 3, through the maintenance door.',
        relatedCharacters: ['maya', 'devon'],
        unlocksTradesWith: ['devon', 'silas'],
        tier: 'insight'
    },
    {
        id: 'devon_systems_room',
        sourceCharacterId: 'devon',
        topic: 'The Systems Room',
        content: 'Devon monitors the grid from a server room hidden behind the ticket counter.',
        relatedCharacters: ['devon', 'silas'],
        unlocksTradesWith: ['silas', 'alex'],
        tier: 'secret'
    },
    {
        id: 'manufacturing_basement',
        sourceCharacterId: 'silas',
        topic: 'The Manufacturing Floor',
        content: 'There is a factory floor beneath the station where the replacement parts are grown, not built.',
        relatedCharacters: ['silas', 'maya'],
        unlocksTradesWith: ['maya', 'rohan'],
        tier: 'truth'
    },

    // --- MYSTERY DEPTHS CHAIN ---
    {
        id: 'rohan_tunnel_map',
        sourceCharacterId: 'rohan',
        topic: 'The Tunnel Map',
        content: 'Rohan has mapped tunnels that don\'t appear on the official blueprints.',
        relatedCharacters: ['rohan', 'elena'],
        unlocksTradesWith: ['elena', 'samuel'],
        tier: 'secret'
    },
    {
        id: 'archive_key_location',
        sourceCharacterId: 'elena',
        topic: 'The Archive Key',
        content: 'The key to the restricted section is hidden inside a hollowed-out ledger from 1924.',
        relatedCharacters: ['elena', 'samuel'],
        unlocksTradesWith: ['samuel', 'zara'],
        tier: 'secret'
    },
    {
        id: 'samuel_age_secret',
        sourceCharacterId: 'samuel', // Or rather about him
        topic: 'The Conductor\'s Age',
        content: 'Records confirm Samuel has been the Conductor for at least 130 years.',
        relatedCharacters: ['samuel', 'elena'],
        unlocksTradesWith: ['rohan', 'elena'],
        tier: 'truth'
    },

    // --- MISC ITEMS ---
    {
        id: 'quiet_hour_schedule',
        sourceCharacterId: 'lira',
        topic: 'The Quiet Hour Schedule',
        content: 'The Quiet Hour doesn\'t just happen at midnight. It happens whenever the station is "rebooting".',
        relatedCharacters: ['lira', 'samuel'],
        unlocksTradesWith: ['samuel', 'kai'],
        tier: 'insight'
    },
    {
        id: 'lira_code_cypher',
        sourceCharacterId: 'lira',
        topic: 'The Station Cypher',
        content: 'Lira has decoded the announcements. They are coordinates for time, not space.',
        relatedCharacters: ['lira', 'asha'],
        unlocksTradesWith: ['asha', 'devon'],
        tier: 'secret'
    },
    {
        id: 'marcus_med_log',
        sourceCharacterId: 'marcus',
        topic: 'The Medical Log',
        content: 'The injuries Marcus treats aren\'t always physical. Some people come in "faded".',
        relatedCharacters: ['marcus', 'kai'],
        unlocksTradesWith: ['kai', 'grace'],
        tier: 'insight'
    },
    {
        id: 'station_blueprints',
        sourceCharacterId: 'kai',
        topic: 'The Original Blueprints',
        content: 'Kai found blueprints signed by an architect who doesn\'t exist in history books.',
        relatedCharacters: ['kai', 'devon'],
        unlocksTradesWith: ['devon', 'elena'],
        tier: 'secret'
    },

    // --- SHADOW MARKET CHAIN ---
    {
        id: 'zara_black_market',
        sourceCharacterId: 'zara',
        topic: 'The Data Brokers',
        content: 'There is a marketplace in the unused signal frequencies where data is traded for favors.',
        relatedCharacters: ['zara', 'lira'],
        unlocksTradesWith: ['lira', 'rohan'],
        tier: 'secret'
    },
    {
        id: 'lira_ghost_recordings',
        sourceCharacterId: 'lira',
        topic: 'The Ghost Recordings',
        content: 'Lira has recordings of passengers who don\'t exist yet. They trade them for silence.',
        relatedCharacters: ['lira', 'samuel'],
        unlocksTradesWith: ['samuel', 'zara'],
        tier: 'secret'
    },
    {
        id: 'rohan_digital_backdoor',
        sourceCharacterId: 'rohan',
        topic: 'The Digital Backdoor',
        content: 'Rohan found a way to inject code into the station\'s announcer system.',
        relatedCharacters: ['rohan', 'zara'],
        unlocksTradesWith: ['zara', 'devon'],
        tier: 'secret'
    },

    // --- CULTURAL ARCHIVE CHAIN ---
    {
        id: 'asha_station_song',
        sourceCharacterId: 'asha',
        topic: 'The Station Song',
        content: 'Asha believes the hum of the station is a song in a key humans can\'t hear.',
        relatedCharacters: ['asha', 'lira'],
        unlocksTradesWith: ['lira', 'elena'],
        tier: 'insight'
    },
    {
        id: 'elena_music_history',
        sourceCharacterId: 'elena',
        topic: 'The Hymn of Arrival',
        content: 'Old records mention a "Hymn of Arrival" played when the first train arrived in 1854.',
        relatedCharacters: ['elena', 'asha'],
        unlocksTradesWith: ['asha', 'samuel'],
        tier: 'secret'
    },
    {
        id: 'samuel_humming_habit',
        sourceCharacterId: 'samuel',
        topic: 'Samuel\'s Humming',
        content: 'Samuel hums a tune when he thinks no one is listening. It matches the Station Song.',
        relatedCharacters: ['samuel', 'asha'],
        unlocksTradesWith: ['asha', 'lira'],
        tier: 'truth'
    },

    // --- SHADOW WAR ARC ---
    {
        id: 'zara_signal_origin',
        sourceCharacterId: 'zara',
        topic: 'The Unknown Signal',
        content: 'The transmission isn\'t coming from outside the station. It\'s coming from thousands of internal devices syncing up.',
        relatedCharacters: ['zara', 'rohan'],
        unlocksTradesWith: ['rohan', 'lira'],
        tier: 'secret'
    },
    {
        id: 'shadow_broker_identity',
        sourceCharacterId: 'rohan',
        topic: 'The Broker\'s Handle',
        content: 'The entity signs its messages as "Archive_Null". It claims to sell memories that never happened.',
        relatedCharacters: ['rohan', 'zara'],
        unlocksTradesWith: ['zara', 'elena'],
        tier: 'secret'
    },
    {
        id: 'station_surveillance_backdoor',
        sourceCharacterId: 'zara',
        topic: 'The Backdoor',
        content: 'There is a root access port in the maintenance tunnels that bypasses all security.',
        relatedCharacters: ['zara', 'rohan'],
        unlocksTradesWith: ['rohan', 'samuel'],
        tier: 'truth'
    },
    {
        id: 'passenger_tracking_glitch',
        sourceCharacterId: 'lira',
        topic: 'Ghost Passengers',
        content: 'The roster shows 4,000 passengers. The life support system registers 4,005 heartbeats.',
        relatedCharacters: ['lira', 'samuel'],
        unlocksTradesWith: ['samuel', 'zara'],
        tier: 'secret'
    }
    ,
    // --- COMMUNITY BRIDGE ITEMS ---
    {
        id: 'jordan_relief_fund',
        sourceCharacterId: 'jordan',
        topic: 'Relief Fund Ledger',
        content: 'Jordan keeps a private ledger of emergency relief that never makes the public reports.',
        relatedCharacters: ['jordan', 'isaiah'],
        unlocksTradesWith: ['isaiah', 'grace'],
        tier: 'insight'
    },
    {
        id: 'tess_classroom_network',
        sourceCharacterId: 'tess',
        topic: 'Classroom Network',
        content: 'Tess built a quiet network of teachers sharing resources outside official budgets.',
        relatedCharacters: ['tess', 'grace'],
        unlocksTradesWith: ['grace', 'asha'],
        tier: 'insight'
    },
    {
        id: 'quinn_impact_fund',
        sourceCharacterId: 'quinn',
        topic: 'Impact Fund',
        content: 'Quinn is quietly backing a fund that prioritizes community outcomes over returns.',
        relatedCharacters: ['quinn', 'nadia'],
        unlocksTradesWith: ['nadia', 'dante'],
        tier: 'secret'
    },
    {
        id: 'dante_client_story',
        sourceCharacterId: 'dante',
        topic: 'The Client Who Said No',
        content: 'Dante once advised a client to walk away from a deal that would harm families.',
        relatedCharacters: ['dante', 'isaiah'],
        unlocksTradesWith: ['isaiah', 'quinn'],
        tier: 'insight'
    },
    {
        id: 'nadia_bias_toolkit',
        sourceCharacterId: 'nadia',
        topic: 'Bias Audit Toolkit',
        content: 'Nadia has a checklist she uses to catch harm before it ships.',
        relatedCharacters: ['nadia', 'jordan'],
        unlocksTradesWith: ['jordan', 'quinn'],
        tier: 'insight'
    },
    {
        id: 'isaiah_youth_sponsor',
        sourceCharacterId: 'isaiah',
        topic: 'Youth Sponsor Circle',
        content: 'Isaiah keeps a list of donors willing to sponsor students without publicity.',
        relatedCharacters: ['isaiah', 'tess'],
        unlocksTradesWith: ['tess', 'jordan'],
        tier: 'secret'
    },
    {
        id: 'grace_home_visit',
        sourceCharacterId: 'grace',
        topic: 'Home Visit Notes',
        content: 'Grace tracks patterns from home visits that hospital intake never sees.',
        relatedCharacters: ['grace', 'marcus'],
        unlocksTradesWith: ['marcus', 'tess'],
        tier: 'insight'
    },
    {
        id: 'alex_supply_manifest',
        sourceCharacterId: 'alex',
        topic: 'Supply Manifest',
        content: 'Alex found a supply route that could cut emergency response time in half.',
        relatedCharacters: ['alex', 'kai'],
        unlocksTradesWith: ['kai', 'jordan'],
        tier: 'secret'
    },
    // ─────────────────────────────────────────────────────────────────────────
    // Quinn, Dante, Nadia, Marcus, Yaquin, Kai knowledge items
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'quinn_performance_theory',
        sourceCharacterId: 'quinn',
        topic: 'Performance Theory',
        content: 'Quinn believes every interaction is a performance, and authenticity is the hardest role to play.',
        relatedCharacters: ['quinn', 'dante'],
        unlocksTradesWith: ['dante', 'nadia'],
        tier: 'insight'
    },
    {
        id: 'dante_lost_manuscript',
        sourceCharacterId: 'dante',
        topic: 'Lost Manuscript',
        content: 'Dante has been writing a novel for years but has never shown anyone a single page.',
        relatedCharacters: ['dante', 'elena'],
        unlocksTradesWith: ['elena', 'quinn'],
        tier: 'secret'
    },
    {
        id: 'nadia_family_pressure',
        sourceCharacterId: 'nadia',
        topic: 'Family Expectations',
        content: 'Nadia\'s family expects her to take over the business, but she dreams of something else entirely.',
        relatedCharacters: ['nadia', 'marcus'],
        unlocksTradesWith: ['marcus', 'isaiah'],
        tier: 'insight'
    },
    {
        id: 'marcus_old_debt',
        sourceCharacterId: 'marcus',
        topic: 'Old Debt',
        content: 'Marcus once made a promise he couldn\'t keep, and it still haunts his decisions.',
        relatedCharacters: ['marcus', 'samuel'],
        unlocksTradesWith: ['samuel', 'grace'],
        tier: 'secret'
    },
    {
        id: 'yaquin_hidden_garden',
        sourceCharacterId: 'yaquin',
        topic: 'Hidden Garden',
        content: 'Yaquin maintains a secret garden in an abandoned section of the station.',
        relatedCharacters: ['yaquin', 'lira'],
        unlocksTradesWith: ['lira', 'asha'],
        tier: 'insight'
    },
    {
        id: 'kai_prototype_vault',
        sourceCharacterId: 'kai',
        topic: 'Prototype Vault',
        content: 'Kai keeps a vault of abandoned prototypes—ideas too risky to release but too precious to destroy.',
        relatedCharacters: ['kai', 'devon'],
        unlocksTradesWith: ['devon', 'silas'],
        tier: 'secret'
    },
    // ─────────────────────────────────────────────────────────────────────────
    // Jordan, Tess, Yaquin source items (completing full coverage)
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'jordan_relief_fund',
        sourceCharacterId: 'jordan',
        topic: 'Emergency Relief Network',
        content: 'Jordan maintains a quiet network of people who help others without asking questions.',
        relatedCharacters: ['jordan', 'isaiah', 'grace'],
        unlocksTradesWith: ['isaiah', 'grace'],
        tier: 'insight'
    },
    {
        id: 'tess_classroom_network',
        sourceCharacterId: 'tess',
        topic: 'Student Support Web',
        content: 'Tess knows which students are struggling before they ask for help—and who can mentor them.',
        relatedCharacters: ['tess', 'grace', 'isaiah'],
        unlocksTradesWith: ['grace', 'isaiah'],
        tier: 'insight'
    },
    {
        id: 'yaquin_time_perception',
        sourceCharacterId: 'yaquin',
        topic: 'Time Perception Studies',
        content: 'Yaquin has been tracking how the station affects people\'s sense of time—some lose hours, others gain clarity.',
        relatedCharacters: ['yaquin', 'elena', 'samuel'],
        unlocksTradesWith: ['elena', 'samuel'],
        tier: 'secret'
    }
]

// ═══════════════════════════════════════════════════════════════════════════
// TRADE CHAINS
// ═══════════════════════════════════════════════════════════════════════════

export const TRADE_CHAINS: KnowledgeTradeChain[] = [
    {
        id: 'workshop_discovery_chain',
        description: 'Learn about the hidden workshops through character connections',
        steps: [
            {
                characterId: 'maya',
                requiresKnowledge: [],
                grantsKnowledge: 'maya_workshop_location',
                trustChange: 0
            },
            {
                characterId: 'devon',
                requiresKnowledge: ['maya_workshop_location'],
                grantsKnowledge: 'devon_systems_room',
                trustChange: 1
            },
            {
                characterId: 'silas',
                requiresKnowledge: ['devon_systems_room'],
                grantsKnowledge: 'manufacturing_basement',
                trustChange: 1
            }
        ]
    },
    {
        id: 'mystery_depths_chain',
        description: 'Uncover the physical and historical depths of the station',
        steps: [
            {
                characterId: 'rohan',
                requiresKnowledge: [],
                grantsKnowledge: 'rohan_tunnel_map',
                trustChange: 0
            },
            {
                characterId: 'elena',
                requiresKnowledge: ['rohan_tunnel_map'],
                grantsKnowledge: 'archive_key_location',
                trustChange: 1
            },
            {
                characterId: 'samuel',
                requiresKnowledge: ['archive_key_location', 'samuel_age_secret'], // Complex trigger
                grantsKnowledge: 'samuel_age_secret', // Confirmation
                trustChange: 2
            }
        ]
    },
    {
        id: 'station_pulse_chain',
        description: 'Track the living nature of the station',
        steps: [
            {
                characterId: 'lira',
                requiresKnowledge: [],
                grantsKnowledge: 'quiet_hour_schedule',
                trustChange: 0
            },
            {
                characterId: 'lira',
                requiresKnowledge: ['quiet_hour_schedule'],
                grantsKnowledge: 'lira_code_cypher',
                trustChange: 1
            },
            {
                characterId: 'asha', // Asha validates the cypher/mood
                requiresKnowledge: ['lira_code_cypher'],
                grantsKnowledge: 'station_blueprints', // Odd jump, maybe Kai instead? Sticking to logic.
                trustChange: 1
            }
        ]
    },
    {
        id: 'shadow_market_chain',
        description: 'Infiltrate the station\'s underground data economy',
        steps: [
            {
                characterId: 'zara',
                requiresKnowledge: [],
                grantsKnowledge: 'zara_black_market',
                trustChange: 0
            },
            {
                characterId: 'lira',
                requiresKnowledge: ['zara_black_market'],
                grantsKnowledge: 'lira_ghost_recordings',
                trustChange: 1
            },
            {
                characterId: 'rohan',
                requiresKnowledge: ['lira_ghost_recordings'],
                grantsKnowledge: 'rohan_digital_backdoor',
                trustChange: 2
            }
        ]
    },
    {
        id: 'station_culture_chain',
        description: 'Recover the lost musical history of the station',
        steps: [
            {
                characterId: 'asha',
                requiresKnowledge: [],
                grantsKnowledge: 'asha_station_song',
                trustChange: 0
            },
            {
                characterId: 'elena',
                requiresKnowledge: ['asha_station_song'],
                grantsKnowledge: 'elena_music_history',
                trustChange: 1
            },
            {
                characterId: 'lira',
                requiresKnowledge: ['elena_music_history'], // Lira confirms the match
                grantsKnowledge: 'samuel_humming_habit',
                trustChange: 2
            }
        ]
    },
    {
        id: 'shadow_war_intel_chain',
        description: 'Track the source of the rogue signal and the Entity behind it',
        steps: [
            {
                characterId: 'zara',
                requiresKnowledge: [],
                grantsKnowledge: 'zara_signal_origin',
                trustChange: 0
            },
            {
                characterId: 'lira',
                requiresKnowledge: ['zara_signal_origin'],
                grantsKnowledge: 'passenger_tracking_glitch',
                trustChange: 1
            },
            {
                characterId: 'rohan',
                requiresKnowledge: ['passenger_tracking_glitch'],
                grantsKnowledge: 'shadow_broker_identity',
                trustChange: 2
            },
            {
                characterId: 'zara',
                requiresKnowledge: ['shadow_broker_identity'],
                grantsKnowledge: 'station_surveillance_backdoor',
                trustChange: 2
            }
        ]
    },
    {
        id: 'community_bridge_chain',
        description: 'Connect community resources across the station',
        steps: [
            {
                characterId: 'jordan',
                requiresKnowledge: [],
                grantsKnowledge: 'jordan_relief_fund',
                trustChange: 0
            },
            {
                characterId: 'isaiah',
                requiresKnowledge: ['jordan_relief_fund'],
                grantsKnowledge: 'isaiah_youth_sponsor',
                trustChange: 1
            },
            {
                characterId: 'tess',
                requiresKnowledge: ['isaiah_youth_sponsor'],
                grantsKnowledge: 'tess_classroom_network',
                trustChange: 1
            },
            {
                characterId: 'grace',
                requiresKnowledge: ['tess_classroom_network'],
                grantsKnowledge: 'grace_home_visit',
                trustChange: 1
            },
            {
                characterId: 'alex',
                requiresKnowledge: ['grace_home_visit'],
                grantsKnowledge: 'alex_supply_manifest',
                trustChange: 2
            }
        ]
    },
    {
        id: 'creative_underground_chain',
        description: 'Discover the hidden creative network beneath the station\'s surface',
        steps: [
            {
                characterId: 'quinn',
                requiresKnowledge: [],
                grantsKnowledge: 'quinn_performance_theory',
                trustChange: 0
            },
            {
                characterId: 'dante',
                requiresKnowledge: ['quinn_performance_theory'],
                grantsKnowledge: 'dante_lost_manuscript',
                trustChange: 1
            },
            {
                characterId: 'kai',
                requiresKnowledge: ['dante_lost_manuscript'],
                grantsKnowledge: 'kai_prototype_vault',
                trustChange: 1
            },
            {
                characterId: 'yaquin',
                requiresKnowledge: ['kai_prototype_vault'],
                grantsKnowledge: 'yaquin_hidden_garden',
                trustChange: 2
            }
        ]
    },
    {
        id: 'legacy_pressure_chain',
        description: 'Uncover the weight of expectations across generations',
        steps: [
            {
                characterId: 'nadia',
                requiresKnowledge: [],
                grantsKnowledge: 'nadia_family_pressure',
                trustChange: 0
            },
            {
                characterId: 'marcus',
                requiresKnowledge: ['nadia_family_pressure'],
                grantsKnowledge: 'marcus_old_debt',
                trustChange: 1
            },
            {
                characterId: 'samuel',
                requiresKnowledge: ['marcus_old_debt'],
                grantsKnowledge: 'samuel_age_secret',
                trustChange: 2
            }
        ]
    }
]

export function getKnowledgeItem(id: string): KnowledgeItem | undefined {
    return KNOWLEDGE_ITEMS.find(k => k.id === id)
}

export function getTradeChain(id: string): KnowledgeTradeChain | undefined {
    return TRADE_CHAINS.find(c => c.id === id)
}
