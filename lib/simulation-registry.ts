/**
 * Simulation Registry
 * Metadata for all character simulations in the game
 *
 * Simulations are immersive experiences where players help characters
 * navigate challenging scenarios that reveal their growth arcs.
 */

import { CharacterId } from './graph-registry'

export interface SimulationMeta {
  id: string
  characterId: CharacterId
  title: string
  subtitle: string
  description: string
  theme: string
  aiTool?: string // Real-world AI tool parallel
  completionFlag: {
    type: 'global' | 'knowledge' | 'tag'
    flag: string
  }
  entryNodeId: string
  icon: 'briefcase' | 'heart' | 'code' | 'mic' | 'search' | 'shield' | 'palette' | 'users' | 'book' | 'wrench' | 'zap' | 'compass'
}

/**
 * All simulations in the game
 * Order: Core characters first, then by narrative importance
 */
export const SIMULATION_REGISTRY: SimulationMeta[] = [
  // === CORE CHARACTERS ===
  {
    id: 'maya_pitch',
    characterId: 'maya',
    title: 'The Pitch',
    subtitle: 'Innovation Showcase',
    description: 'Help Maya present her robotics prototype to investors while her skeptical parents watch from the audience.',
    theme: 'Authenticity vs. Expectation',
    completionFlag: { type: 'global', flag: 'maya_simulation_complete' },
    entryNodeId: 'maya_simulation_intro',
    icon: 'briefcase'
  },
  {
    id: 'grace_comfort',
    characterId: 'grace',
    title: 'Patient Comfort',
    subtitle: 'Home Health Visit',
    description: 'Navigate a difficult home health situation where medical knowledge meets human compassion.',
    theme: 'Care Beyond Protocol',
    completionFlag: { type: 'knowledge', flag: 'grace_simulation_complete' },
    entryNodeId: 'grace_simulation_intro',
    icon: 'heart'
  },
  {
    id: 'tess_classroom',
    characterId: 'tess',
    title: 'The Classroom',
    subtitle: 'Teaching Moment',
    description: 'Step into Tess\'s past as a teacher facing a pivotal moment that changed her career path.',
    theme: 'Purpose Through Sacrifice',
    completionFlag: { type: 'knowledge', flag: 'tess_simulation_complete' },
    entryNodeId: 'tess_simulation_intro',
    icon: 'book'
  },
  {
    id: 'alex_logistics',
    characterId: 'alex',
    title: 'The Logistics Puzzle',
    subtitle: 'Supply Chain Crisis',
    description: 'Help Alex solve a critical supply chain problem using systems thinking and creative problem-solving.',
    theme: 'Order From Chaos',
    aiTool: 'Logistics AI',
    completionFlag: { type: 'knowledge', flag: 'alex_logistics_completed' },
    entryNodeId: 'alex_simulation_intro',
    icon: 'compass'
  },
  {
    id: 'yaquin_review',
    characterId: 'yaquin',
    title: 'The Review',
    subtitle: 'EdTech Demo',
    description: 'Guide Yaquin through a high-stakes product review that could make or break their startup.',
    theme: 'Vision vs. Reality',
    completionFlag: { type: 'global', flag: 'yaquin_review_simulation_complete' },
    entryNodeId: 'yaquin_simulation_intro',
    icon: 'zap'
  },

  // Devon's system debugging simulation
  {
    id: 'devon_system',
    characterId: 'devon',
    title: 'The System',
    subtitle: 'Logic Debugging',
    description: 'Help Devon debug an emotional logic flow that reveals deeper truths about human connection.',
    theme: 'Logic vs. Emotion',
    completionFlag: { type: 'global', flag: 'devon_arc_complete' },
    entryNodeId: 'devon_explains_system',
    icon: 'code'
  },
  // Jordan's UX negotiation simulation
  {
    id: 'jordan_launch',
    characterId: 'jordan',
    title: 'Launch Crisis',
    subtitle: 'Product Negotiation',
    description: 'Navigate a high-stakes product launch negotiation where user retention hangs in the balance.',
    theme: 'Compromise vs. Conviction',
    completionFlag: { type: 'global', flag: 'jordan_arc_complete' },
    entryNodeId: 'jordan_job_reveal_7',
    icon: 'users'
  },
  // Marcus's code automation simulation
  {
    id: 'marcus_automation',
    characterId: 'marcus',
    title: 'The Automation',
    subtitle: 'Code Evolution',
    description: 'Experience the tension between human expertise and AI automation in healthcare systems.',
    theme: 'Human Touch vs. Efficiency',
    aiTool: 'Cursor AI',
    completionFlag: { type: 'global', flag: 'marcus_arc_complete' },
    entryNodeId: 'marcus_simulation_automation',
    icon: 'code'
  },

  // === SECONDARY CHARACTERS ===
  {
    id: 'kai_drill',
    characterId: 'kai',
    title: 'The Safety Drill',
    subtitle: 'Emergency Protocol',
    description: 'Experience Kai\'s world of safety protocols when a routine drill becomes unexpectedly real.',
    theme: 'Preparation Meets Crisis',
    completionFlag: { type: 'tag', flag: 'simulation_complete' },
    entryNodeId: 'kai_safety_drill_intro',
    icon: 'shield'
  },
  {
    id: 'rohan_ghost',
    characterId: 'rohan',
    title: 'The Ghost',
    subtitle: 'System Anomaly',
    description: 'Dive deep into the station\'s systems with Rohan to trace a mysterious anomaly to its source.',
    theme: 'Truth in the Machine',
    completionFlag: { type: 'tag', flag: 'simulation_complete' },
    entryNodeId: 'rohan_ghost_intro',
    icon: 'code'
  },
  {
    id: 'silas_drought',
    characterId: 'silas',
    title: 'The Drought',
    subtitle: 'Manufacturing Crisis',
    description: 'Face a critical resource shortage with Silas that tests leadership under pressure.',
    theme: 'Scarcity and Innovation',
    completionFlag: { type: 'tag', flag: 'simulation_complete' },
    entryNodeId: 'silas_drought_intro',
    icon: 'wrench'
  },
  {
    id: 'elena_search',
    characterId: 'elena',
    title: 'The Search',
    subtitle: 'Pattern Analysis',
    description: 'Help Elena trace suspicious patterns through the station\'s data archives.',
    theme: 'Signal vs. Noise',
    aiTool: 'Perplexity',
    completionFlag: { type: 'global', flag: 'elena_arc_complete' },
    entryNodeId: 'elena_perplexity_intro',
    icon: 'search'
  },

  // === EXTENDED CHARACTERS ===
  {
    id: 'asha_canvas',
    characterId: 'asha',
    title: 'The Canvas',
    subtitle: 'Visual Creation',
    description: 'Explore the intersection of AI and art with Asha as she creates something meaningful.',
    theme: 'Human Touch in AI Art',
    aiTool: 'Stable Diffusion',
    completionFlag: { type: 'global', flag: 'asha_arc_complete' },
    entryNodeId: 'asha_visual_canvas_intro',
    icon: 'palette'
  },
  {
    id: 'lira_studio',
    characterId: 'lira',
    title: 'The Studio',
    subtitle: 'Sound Design',
    description: 'Craft audio experiences with Lira that capture emotion beyond words.',
    theme: 'Memory in Sound',
    aiTool: 'Suno/Udio',
    completionFlag: { type: 'knowledge', flag: 'lira_composition_complete' },
    entryNodeId: 'lira_audio_studio_intro',
    icon: 'mic'
  },
  {
    id: 'zara_analysis',
    characterId: 'zara',
    title: 'The Analysis',
    subtitle: 'Data Ethics',
    description: 'Navigate the ethical complexities of data with Zara when numbers tell uncomfortable truths.',
    theme: 'Truth in Data',
    aiTool: 'Excel/Data Tools',
    completionFlag: { type: 'global', flag: 'zara_arc_complete' },
    entryNodeId: 'zara_data_analysis_intro',
    icon: 'palette'
  },
  {
    id: 'samuel_listener',
    characterId: 'samuel',
    title: 'The Listener\'s Log',
    subtitle: 'Station Wisdom',
    description: 'Learn the art of truly hearing others through Samuel\'s accumulated wisdom.',
    theme: 'The Power of Listening',
    aiTool: 'HubSpot (metaphor)',
    completionFlag: { type: 'global', flag: 'samuel_listener_complete' },
    entryNodeId: 'samuel_listener_intro',
    icon: 'users'
  }
]

/**
 * Get simulation by ID
 */
export function getSimulationById(id: string): SimulationMeta | undefined {
  return SIMULATION_REGISTRY.find(s => s.id === id)
}

/**
 * Get simulation by character
 */
export function getSimulationByCharacter(characterId: CharacterId): SimulationMeta | undefined {
  return SIMULATION_REGISTRY.find(s => s.characterId === characterId)
}

/**
 * Get all simulations for a list of characters
 */
export function getSimulationsForCharacters(characterIds: CharacterId[]): SimulationMeta[] {
  return SIMULATION_REGISTRY.filter(s => characterIds.includes(s.characterId))
}
