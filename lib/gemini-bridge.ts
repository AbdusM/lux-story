/**
 * Minimal Gemini Bridge for Choice Acknowledgment
 *
 * This adds a simple AI layer that acknowledges user choices
 * before delivering the pre-written scene content.
 *
 * Key principle: Don't replace content, just bridge to it.
 */

interface BridgeRequest {
  userChoice: string
  nextSpeaker: string
  nextSceneHint?: string
  context?: {
    platform?: string
    previousSpeaker?: string
  }
}

/**
 * Generate 1-2 sentences acknowledging the user's choice
 * before transitioning to the pre-written content
 */
export async function generateChoiceBridge(request: BridgeRequest): Promise<string> {
  // Fallback for when API is unavailable
  const fallbackBridge = `${request.nextSpeaker} considers your words.`

  try {
    const response = await fetch('/api/gemini-bridge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      console.error('Bridge API error:', response.status)
      return fallbackBridge
    }

    const data = await response.json()
    return data.bridge || fallbackBridge

  } catch (error) {
    console.error('Bridge generation error:', error)
    return fallbackBridge
  }
}

/**
 * Cache common transitions to reduce API calls
 */
const transitionCache = new Map<string, string>()

export async function getCachedBridge(request: BridgeRequest): Promise<string> {
  const cacheKey = `${request.userChoice}-${request.nextSpeaker}`

  if (transitionCache.has(cacheKey)) {
    return transitionCache.get(cacheKey)!
  }

  const bridge = await generateChoiceBridge(request)
  transitionCache.set(cacheKey, bridge)

  // Limit cache size
  if (transitionCache.size > 100) {
    const firstKey = transitionCache.keys().next().value
    transitionCache.delete(firstKey)
  }

  return bridge
}

/**
 * Pre-generate bridges for common paths during idle time
 */
export async function preloadCommonBridges() {
  const commonPaths = [
    { userChoice: "I don't know what I want to do", nextSpeaker: "Samuel" },
    { userChoice: "Tell me about healthcare careers", nextSpeaker: "Maya" },
    { userChoice: "I'm interested in technology", nextSpeaker: "Devon" },
    { userChoice: "What opportunities are in Birmingham?", nextSpeaker: "Samuel" },
    { userChoice: "I feel lost", nextSpeaker: "Jordan" }
  ]

  for (const path of commonPaths) {
    await getCachedBridge(path)
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}