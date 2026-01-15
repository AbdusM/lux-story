/**
 * Share Result Generator - TikTok-Optimized
 *
 * Generates casual, human-sounding shareable content optimized for TikTok/social media.
 * Uses conversational language, trendy phrases, and relatable moments.
 * Makes achievements sound like a friend sharing, not a corporate announcement.
 */

import { getCharacterName } from '@/lib/character-names'

export type ShareCardType = 'skill' | 'character' | 'career' | 'journey'

export interface ShareCardData {
  skillName?: string
  level?: string
  count?: number
  characterName?: string
  trustLevel?: string
  careerName?: string
  matchScore?: number
  demonstrations?: number
  charactersMet?: number
}

// Character names now imported from @/lib/character-names

/**
 * Skill level to casual description mapping
 */
const SKILL_LEVEL_PHRASES: Record<string, string[]> = {
  'dormant': ['just discovered', 'found out i have', 'realized i\'m good at'],
  'emerging': ['getting better at', 'lowkey good at', 'starting to understand'],
  'developing': ['actually decent at', 'getting the hang of', 'pretty good at'],
  'proficient': ['really good at', 'nailing', 'crushing it with'],
  'advanced': ['expert level', 'mastering', 'absolutely killing it with']
}

/**
 * Trust level to casual description
 */
const TRUST_LEVEL_PHRASES: Record<string, string> = {
  'stranger': 'just met',
  'acquaintance': 'getting to know',
  'friend': 'became friends with',
  'confidant': 'deep connection with',
  'ally': 'fully trust'
}

/**
 * Generate multiple variations and pick one randomly
 */
function pickVariation(variations: string[]): string {
  return variations[Math.floor(Math.random() * variations.length)]
}

/**
 * Generate skill milestone share card
 */
export function generateSkillMilestoneCard(
  skillName: string,
  level: string,
  count: number
): string {
  const levelPhrases = SKILL_LEVEL_PHRASES[level.toLowerCase()] || ['good at']
  const phrase = pickVariation(levelPhrases)
  
  const variations = [
    `ok so i ${phrase} ${skillName.toLowerCase()} and i'm feeling smart 😎✨`,
    `POV: you realize you're actually good at ${skillName.toLowerCase()} 🧠💡`,
    `me after unlocking ${skillName.toLowerCase()}: wait this actually makes sense now 🤯`,
    `just discovered i'm ${phrase} ${skillName.toLowerCase()}?? wild 🌟`,
    `update: i've demonstrated ${skillName.toLowerCase()} ${count} times and we're vibing 💫`,
    `no because why am i suddenly good at ${skillName.toLowerCase()} 😭✨`,
    `the game said i'd be good at ${skillName.toLowerCase()} and honestly... they're not wrong 🎯`
  ]
  
  return pickVariation(variations)
}

/**
 * Generate character completion share card
 */
export function generateCharacterCompletionCard(
  characterName: string,
  trustLevel: string
): string {
  const displayName = getCharacterName(characterName)
  const trustPhrase = TRUST_LEVEL_PHRASES[trustLevel.toLowerCase()] || 'talked to'
  
  const variations = [
    `just had the deepest convo with ${displayName} and my mind is blown 🤯`,
    `me after talking to ${displayName} for 2 hours: wait this actually makes sense now 💭`,
    `update: i ${trustPhrase} ${displayName} and we're on the same wavelength now ✨`,
    `just finished talking to ${displayName} and my career path is clearer than my future 🌟`,
    `POV: you have a whole conversation with ${displayName} and realize you know nothing 😅`,
    `me: *talks to ${displayName}*\n\nalso me: wait i should do what now?? 🤔✨`,
    `just ${trustPhrase} ${displayName} and honestly? game changer 🚀`
  ]
  
  return pickVariation(variations)
}

/**
 * Generate career match share card
 */
export function generateCareerMatchCard(
  careerName: string,
  matchScore: number
): string {
  const score = Math.round(matchScore)
  
  const variations = [
    `apparently i'm ${score}% ready for ${careerName}?? wild 🏥✨`,
    `the game said i'd be good at ${careerName} and honestly... they're not wrong 🎯`,
    `me: *plays career game*\n\ngame: you're ${score}% ready for ${careerName}\n\nme: wait what 😳`,
    `update: i'm ${score}% match for ${careerName} and i'm not mad about it 💫`,
    `POV: you find out you're ${score}% ready for ${careerName} and it actually makes sense 🤯`,
    `just discovered i'm a ${score}% match for ${careerName} and honestly? we're vibing 🌟`,
    `the career game said ${careerName} and i'm like... ok but fr? ${score}%?? 🚀`
  ]
  
  return pickVariation(variations)
}

/**
 * Generate journey summary share card
 */
export function generateJourneySummaryCard(
  demonstrations: number,
  charactersMet: number
): string {
  const variations = [
    `${demonstrations} skills unlocked and i still don't know what i'm doing but we're vibing 🌟`,
    `update: i've talked to ${charactersMet} characters and my career path is clearer than my future 💭`,
    `me after ${demonstrations} skill demonstrations: wait i'm actually learning things?? 🤯✨`,
    `POV: you've unlocked ${demonstrations} skills and talked to ${charactersMet} people and you're still confused but having fun 😅`,
    `update: ${demonstrations} skills, ${charactersMet} conversations, and i still have no idea what i'm doing but we're here 🌟`,
    `just hit ${demonstrations} skill demonstrations and ${charactersMet} character conversations... this is fine 😭✨`,
    `me: *unlocks ${demonstrations} skills*\n\nalso me: ok but what does this mean for my future?? 🤔💫`
  ]
  
  return pickVariation(variations)
}

/**
 * Main function to generate share card based on type
 */
export function generateShareCard(
  type: ShareCardType,
  data: ShareCardData
): string {
  switch (type) {
    case 'skill':
      if (!data.skillName || !data.level || !data.count) {
        throw new Error('Missing required data for skill share card')
      }
      return generateSkillMilestoneCard(data.skillName, data.level, data.count)
    
    case 'character':
      if (!data.characterName || !data.trustLevel) {
        throw new Error('Missing required data for character share card')
      }
      return generateCharacterCompletionCard(data.characterName, data.trustLevel)
    
    case 'career':
      if (!data.careerName || data.matchScore === undefined) {
        throw new Error('Missing required data for career share card')
      }
      return generateCareerMatchCard(data.careerName, data.matchScore)
    
    case 'journey':
      if (data.demonstrations === undefined || data.charactersMet === undefined) {
        throw new Error('Missing required data for journey share card')
      }
      return generateJourneySummaryCard(data.demonstrations, data.charactersMet)
    
    default:
      throw new Error(`Unknown share card type: ${type}`)
  }
}

/**
 * Add game URL and optional hashtags to share text
 */
export function formatShareText(
  shareText: string,
  includeUrl: boolean = true,
  includeHashtags: boolean = false
): string {
  let formatted = shareText
  
  if (includeUrl) {
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://lux-story.com'
    formatted += `\n\n${url}`
  }
  
  if (includeHashtags) {
    const hashtags = ['#CareerGame', '#CareerExploration', '#LuxStory']
    formatted += `\n\n${hashtags.join(' ')}`
  }
  
  return formatted
}
