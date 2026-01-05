/**
 * Samuel's "Welcome Back" Dialogue
 *
 * Triggered when a returning player arrives at the station.
 * Samuel acknowledges their absence and mentions who's been asking about them.
 *
 * Philosophy:
 * - No punishment for being away
 * - Characters feel alive between sessions
 * - Samuel as the connective tissue
 */

import { DialogueNode } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'

/**
 * Entry point constants for cross-graph navigation
 */
export const samuelWaitingEntryPoints = {
  /** Main welcome back node */
  WELCOME_BACK: 'samuel_welcome_back',
  /** Short return (4-12 hours) */
  WELCOME_BACK_SHORT: 'samuel_welcome_back_short',
  /** Medium return (12-48 hours) */
  WELCOME_BACK_MEDIUM: 'samuel_welcome_back_medium',
  /** Long return (48+ hours) */
  WELCOME_BACK_LONG: 'samuel_welcome_back_long'
} as const

export type SamuelWaitingEntryPoint = typeof samuelWaitingEntryPoints[keyof typeof samuelWaitingEntryPoints]

/**
 * Dynamic welcome back text based on who's waiting
 * Uses template patterns that will be filled in at runtime
 */
export function getWelcomeBackText(
  hoursSince: number,
  waitingCharacterNames: string[]
): string {
  const count = waitingCharacterNames.length

  // Time-based greeting
  let timeGreeting: string
  if (hoursSince < 12) {
    timeGreeting = "Back already? Good."
  } else if (hoursSince < 24) {
    timeGreeting = "Ah, you're back. Station's been quieter without you."
  } else if (hoursSince < 48) {
    timeGreeting = "Been a little while. The platforms remember you, though."
  } else if (hoursSince < 168) {
    timeGreeting = "It's been a few days. Some things are the same. Some ain't."
  } else {
    timeGreeting = "Well now. Thought maybe you'd found your train. But here you are."
  }

  // Waiting characters mention
  let waitingMention: string
  if (count === 0) {
    waitingMention = "Folks have been goin' about their business. But I think they'd be glad to see you."
  } else if (count === 1) {
    waitingMention = `${waitingCharacterNames[0]} has been asking about you, actually.`
  } else if (count === 2) {
    waitingMention = `${waitingCharacterNames[0]} and ${waitingCharacterNames[1]} have both been wondering when you'd come back.`
  } else {
    const allButLast = waitingCharacterNames.slice(0, -1).join(', ')
    const last = waitingCharacterNames[waitingCharacterNames.length - 1]
    waitingMention = `${allButLast}, and ${last} have all asked about you. Seems you made an impression.`
  }

  return `${timeGreeting}\n\n${waitingMention}`
}

/**
 * Get character-specific waiting detail
 * Samuel can elaborate on why a specific character was waiting
 */
export function getCharacterWaitingDetail(characterId: CharacterId): string {
  const details: Record<CharacterId, string> = {
    samuel: "", // Samuel doesn't wait for himself
    maya: "Maya's been tinkerin' more than usual. That robot of hers keeps wheelin' toward the main platform. I think it knows somethin'.",
    devon: "Devon ran some kind of analysis. Somethin' about optimal conversation intervals. Think he's just tryin' to figure out if he missed you.",
    elena: "Elena fixed three things that weren't broken. That's how she thinks.",
    grace: "Grace saved your spot by the window. Said she had more to tell you.",
    marcus: "Marcus mentioned you during his break. Said you 'get it.' High praise from him.",
    tess: "Tess has new music she's been savin'. Won't play it for anyone else.",
    yaquin: "Yaquin's students asked about 'the visitor.' She smiled.",
    rohan: "Rohan's been contemplatin' somethin'. He does that more when he's got someone to share it with.",
    jordan: "Jordan reorganized the career pamphlets three times. Restless without direction to give.",
    kai: "Kai's been runnin' extra safety checks. His way of keepin' busy.",
    silas: "Silas has been more... present. Your conversations shifted somethin'.",
    alex: "Alex found some new corners of the station. Says they're savin' 'em to show you.",
    asha: "Asha is calibrating the telescope.",
    lira: "Lira is digitizing old records.",
    zara: "Zara is optimizing the power grid.",
    station_entry: "The entry is quiet.",
    grand_hall: "The hall is bustling.",
    market: "The market is active.",
    deep_station: "The deep station hums."
  }

  return details[characterId] || ""
}

/**
 * Waiting dialogue nodes
 * These can be conditionally activated when a returning player is detected
 */
export const samuelWaitingNodes: DialogueNode[] = [
  // ============= WELCOME BACK (Dynamic Entry) =============
  {
    nodeId: 'samuel_welcome_back',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "{{returning_player:Ah, you're back. The station's been waitin'.|Good to see you.}}",
        emotion: 'warm',
        variation_id: 'welcome_back_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['returning_player']
    },
    choices: [
      {
        choiceId: 'acknowledge_return',
        text: "It's good to be back.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience'
      },
      {
        choiceId: 'who_asked',
        text: "Who's been asking about me?",
        nextNodeId: 'samuel_waiting_details',
        pattern: 'exploring'
      },
      {
        choiceId: 'lets_get_going',
        text: "I'm ready to talk to someone.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
      }
    ]
  },

  // ============= WAITING DETAILS =============
  {
    nodeId: 'samuel_waiting_details',
    speaker: 'Samuel Washington',
    content: [
      {
        // This text will be dynamically replaced based on actual waiting characters
        text: "Well now, let me think...\n\n{{waiting_maya:Maya's been tinkerin' more than usual. That robot of hers keeps wheelin' toward the main platform.|}}{{waiting_devon:Devon ran some kind of analysis. Think he's just tryin' to figure out if he missed you.|}}{{waiting_elena:Elena fixed three things that weren't broken. That's how she thinks.|}}{{waiting_grace:Grace saved your spot by the window. Said she had more to tell you.|}}{{waiting_marcus:Marcus mentioned you during his break. Said you 'get it.'|}}{{waiting_tess:Tess has new music she's been savin'. Won't play it for anyone else.|}}{{waiting_yaquin:Yaquin's students asked about 'the visitor.' She smiled.|}}{{waiting_rohan:Rohan's been contemplatin' somethin' deep.|}}",
        emotion: 'knowing',
        variation_id: 'waiting_details_v1'
      }
    ],
    choices: [
      {
        choiceId: 'visit_first_waiting',
        text: "I should go see them.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping'
      },
      {
        choiceId: 'continue_exploring',
        text: "Thanks, Samuel. I'll make the rounds.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
      }
    ]
  },

  // ============= SHORT ABSENCE (4-12 hours) =============
  {
    nodeId: 'samuel_welcome_back_short',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Back already? Good.\n\nStation's still hummin' along. Same folks, same questions. But they're your questions to find now.",
        emotion: 'warm',
        variation_id: 'welcome_short_v1'
      }
    ],
    choices: [
      {
        choiceId: 'short_continue',
        text: "Let's pick up where we left off.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience'
      }
    ]
  },

  // ============= MEDIUM ABSENCE (12-48 hours) =============
  {
    nodeId: 'samuel_welcome_back_medium',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Been a little while. The platforms remember you, though.\n\nSome conversations keep going even when you're not here. That's how it works in a place like this.",
        emotion: 'reflective',
        variation_id: 'welcome_medium_v1'
      }
    ],
    choices: [
      {
        choiceId: 'medium_catch_up',
        text: "What did I miss?",
        nextNodeId: 'samuel_waiting_details',
        pattern: 'exploring'
      },
      {
        choiceId: 'medium_continue',
        text: "I'm ready to continue.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience'
      }
    ]
  },

  // ============= LONG ABSENCE (48+ hours) =============
  {
    nodeId: 'samuel_welcome_back_long',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Well now. It's been a few days.\n\nThought maybe you'd found your train. But here you are. That's the thing about crossroads—they don't close. They wait.\n\nSome folks here have been doin' the same.",
        emotion: 'warm',
        variation_id: 'welcome_long_v1'
      }
    ],
    choices: [
      {
        choiceId: 'long_who_waiting',
        text: "Who's been waiting?",
        nextNodeId: 'samuel_waiting_details',
        pattern: 'helping'
      },
      {
        choiceId: 'long_i_needed_time',
        text: "I needed some time away.",
        nextNodeId: 'samuel_welcome_back_understanding',
        pattern: 'patience'
      },
      {
        choiceId: 'long_ready_now',
        text: "I'm ready now.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
      }
    ]
  },

  // ============= UNDERSTANDING (Player needed time) =============
  {
    nodeId: 'samuel_welcome_back_understanding',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's wisdom, not weakness. Knowin' when to step back.\n\nThis place don't keep score. Don't matter how long you're gone—matters that you came back when you were ready.\n\nNow. Who would you like to see?",
        emotion: 'understanding',
        variation_id: 'welcome_understanding_v1'
      }
    ],
    choices: [
      {
        choiceId: 'understanding_hub',
        text: "Show me who's around.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
      }
    ]
  }
]

export default samuelWaitingNodes
