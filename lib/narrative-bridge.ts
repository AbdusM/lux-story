/**
 * Narrative Bridge System
 *
 * Generates connecting text that acknowledges user choices
 * before transitioning to the next story beat
 */

/**
 * Interface for bridge text generation
 */
export interface BridgeTextRequest {
  userChoiceText: string;
  nextSceneText: string;
  sceneContext?: string;
  pattern?: string;
}

export interface BridgeTextResponse {
  bridgeText: string;
  confidence: number;
  generatedAt: number;
}

/**
 * Generate bridge text using Gemini API
 */
export async function generateBridgeText(request: BridgeTextRequest): Promise<string> {
  const prompt = createBridgePrompt(request);

  try {
    console.log('🌉 Generating bridge text for choice:', request.userChoiceText);

    const response = await fetch('/api/live-choices/bridge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        userChoice: request.userChoiceText,
        nextScene: request.nextSceneText
      })
    });

    if (!response.ok) {
      throw new Error(`Bridge generation failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Bridge text generated:', data.bridgeText);

    return data.bridgeText;

  } catch (error) {
    console.error('❌ Bridge generation failed:', error);

    // Fallback to simple connecting text
    return generateSimpleBridge(request.userChoiceText, request.nextSceneText);
  }
}

/**
 * Create optimized prompt for bridge text generation
 */
function createBridgePrompt(request: BridgeTextRequest): string {
  return `You are an expert narrative writer creating seamless story transitions.

TASK: Write ONE connecting sentence that bridges the user's choice to the next story moment.

USER'S CHOICE: "${request.userChoiceText}"
NEXT STORY BEAT: "${request.nextSceneText}"

REQUIREMENTS:
- Write exactly ONE sentence (15-25 words)
- Acknowledge the user's action naturally
- Connect smoothly to the next story moment
- Use natural, flowing language
- Maintain Birmingham teen voice when appropriate

EXAMPLES:
User choice: "Check out how they built this station"
Next scene: "The big clock says 11:47 PM"
Bridge: "You're studying the massive steel beams when your eyes are drawn to the ornate clock face."

User choice: "Help that lost family"
Next scene: "The station feels colder now"
Bridge: "After pointing them toward Platform 3, you notice the temperature has dropped."

User choice: "Look for secret passages"
Next scene: "Samuel appears from behind a pillar"
Bridge: "Your search along the brick walls is interrupted when someone clears their throat behind you."

Generate ONLY the bridge sentence:`;
}

/**
 * Simple fallback bridge generation using templates
 */
function generateSimpleBridge(userChoice: string, nextScene: string): string {
  const templates = [
    "After {action}, you notice that {scene}",
    "While {action}, {scene}",
    "As you {action}, {scene}",
    "Having {action}, {scene}",
    "Just as you {action}, {scene}"
  ];

  // Extract action from user choice
  const action = extractAction(userChoice);
  const sceneStart = extractSceneStart(nextScene);

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template
    .replace('{action}', action)
    .replace('{scene}', sceneStart.toLowerCase());
}

/**
 * Extract action verb from user choice text
 */
function extractAction(choiceText: string): string {
  // Simple extraction - take the choice text and make it past tense
  const cleaned = choiceText.replace(/['"]/g, '').toLowerCase();

  if (cleaned.includes('check out')) return 'checking out the area';
  if (cleaned.includes('help')) return 'helping them';
  if (cleaned.includes('look')) return 'looking around';
  if (cleaned.includes('examine')) return 'examining everything carefully';
  if (cleaned.includes('explore')) return 'exploring';
  if (cleaned.includes('ask')) return 'asking questions';
  if (cleaned.includes('volunteer')) return 'considering volunteer opportunities';
  if (cleaned.includes('figure out')) return 'trying to figure things out';

  // Fallback
  return 'doing that';
}

/**
 * Extract the beginning of the next scene for smooth transition
 */
function extractSceneStart(sceneText: string): string {
  // Take first sentence or first significant clause
  const sentences = sceneText.split(/[.!?]/);
  const firstSentence = sentences[0]?.trim();

  if (firstSentence && firstSentence.length > 10) {
    return firstSentence;
  }

  // Take first 50 characters as backup
  return sceneText.substring(0, 50).trim() + '...';
}

/**
 * Pre-defined bridge cache for common choice patterns
 */
export const BRIDGE_CACHE: Record<string, Record<string, string>> = {
  // Exploring patterns
  'exploring': {
    'clock': "Your exploration is interrupted when you notice the large clock face",
    'platform': "While investigating, you spot Platform",
    'character': "Your searching brings you near someone who",
    'mystery': "As you look around, something mysterious catches your attention"
  },

  // Helping patterns
  'helping': {
    'clock': "After helping them, you glance at the station clock",
    'platform': "Having offered assistance, you notice Platform",
    'character': "Your helpful nature draws the attention of",
    'transition': "With that good deed done, you realize"
  },

  // Analyzing patterns
  'analyzing': {
    'clock': "Your careful observation leads your eyes to the prominent clock",
    'data': "After studying the details, you discover",
    'pattern': "Your analysis reveals that",
    'conclusion': "Having thought it through, you notice"
  },

  // Building patterns
  'building': {
    'structure': "Admiring the construction, you observe",
    'materials': "Studying how it was built, you notice",
    'engineering': "Your interest in the engineering draws you to",
    'craftsmanship': "Impressed by the workmanship, you see"
  }
};

/**
 * Get cached bridge text if available
 */
export function getCachedBridge(pattern: string, sceneType: string): string | null {
  return BRIDGE_CACHE[pattern]?.[sceneType] || null;
}