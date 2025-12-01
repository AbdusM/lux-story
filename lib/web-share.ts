// Web Share API for Progress Sharing
// Allows users to share their career exploration progress

import { generateShareCard, formatShareText, type ShareCardType, type ShareCardData } from './share-result-generator'

export class WebShare {
  private static instance: WebShare | null = null
  private isSupported: boolean = false

  private constructor() {
    // Only check support in browser environment
    if (typeof window !== 'undefined') {
      this.isSupported = this.checkSupport()
    }
  }

  static getInstance(): WebShare {
    if (!WebShare.instance) {
      WebShare.instance = new WebShare()
    }
    return WebShare.instance
  }

  private checkSupport(): boolean {
    if (typeof window === 'undefined') return false
    
    // Check for Web Share API support
    return typeof navigator !== 'undefined' && 'share' in navigator
  }

  // Share current game progress
  async shareProgress(sceneId: string, sceneText: string): Promise<boolean> {
    if (!this.isSupported) {
      // Fallback to clipboard
      return this.fallbackToClipboard(sceneId, sceneText)
    }

    try {
      const shareData = {
        title: 'Grand Central Terminus - My Career Journey',
        text: `I'm exploring my career path in Grand Central Terminus. Currently at: "${sceneText.substring(0, 100)}..."`,
        url: window.location.href
      }

      await navigator.share(shareData)
      return true
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled sharing
        return false
      }
      
      console.warn('Web Share failed, falling back to clipboard:', error)
      return this.fallbackToClipboard(sceneId, sceneText)
    }
  }

  // Share career insights
  async shareInsights(insights: string[]): Promise<boolean> {
    if (!this.isSupported) {
      return this.fallbackToClipboard('insights', insights.join(', '))
    }

    try {
      const shareData = {
        title: 'My Career Insights from Grand Central Terminus',
        text: `I discovered these career insights: ${insights.join(', ')}`,
        url: window.location.href
      }

      await navigator.share(shareData)
      return true
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false
      }
      
      console.warn('Web Share failed, falling back to clipboard:', error)
      return this.fallbackToClipboard('insights', insights.join(', '))
    }
  }

  // Share Birmingham career opportunities
  async shareOpportunities(opportunities: string[]): Promise<boolean> {
    if (!this.isSupported) {
      return this.fallbackToClipboard('opportunities', opportunities.join(', '))
    }

    try {
      const shareData = {
        title: 'Birmingham Career Opportunities I Found',
        text: `Check out these Birmingham career opportunities: ${opportunities.join(', ')}`,
        url: window.location.href
      }

      await navigator.share(shareData)
      return true
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false
      }
      
      console.warn('Web Share failed, falling back to clipboard:', error)
      return this.fallbackToClipboard('opportunities', opportunities.join(', '))
    }
  }

  // Fallback to clipboard when Web Share API is not available
  private async fallbackToClipboard(type: string, content: string): Promise<boolean> {
    try {
      const text = `Grand Central Terminus - ${type}: ${content}\n\nExplore your career path: ${window.location.href}`
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        return true
      }
    } catch (error) {
      console.error('Clipboard fallback failed:', error)
      return false
    }
  }

  // Share result card (TikTok-optimized)
  async shareResultCard(
    cardType: ShareCardType,
    cardData: ShareCardData,
    includeUrl: boolean = true,
    includeHashtags: boolean = false
  ): Promise<boolean> {
    try {
      const shareText = generateShareCard(cardType, cardData)
      const formattedText = formatShareText(shareText, includeUrl, includeHashtags)
      
      if (!this.isSupported) {
        return this.fallbackToClipboard(cardType, formattedText)
      }

      const shareData = {
        title: 'Lux Story - Career Exploration',
        text: formattedText,
        url: window.location.href
      }

      await navigator.share(shareData)
      return true
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false
      }
      
      console.warn('Web Share failed, falling back to clipboard:', error)
      const shareText = generateShareCard(cardType, cardData)
      const formattedText = formatShareText(shareText, includeUrl, includeHashtags)
      return this.fallbackToClipboard(cardType, formattedText)
    }
  }

  // Check if Web Share API is supported
  getSupported(): boolean {
    return this.isSupported
  }

  // Get share button text based on support
  getShareButtonText(): string {
    return this.isSupported ? 'Share' : 'Copy Link'
  }
}

// Export singleton instance - lazy initialization for SSR safety
let webShareInstance: WebShare | null = null

function getWebShareInstance(): WebShare {
  if (!webShareInstance) {
    webShareInstance = WebShare.getInstance()
  }
  return webShareInstance
}

export const webShare = {
  async shareProgress(sceneId: string, sceneText: string): Promise<boolean> {
    return getWebShareInstance().shareProgress(sceneId, sceneText)
  },
  async shareResultCard(
    cardType: ShareCardType,
    cardData: ShareCardData,
    includeUrl: boolean = true,
    includeHashtags: boolean = false
  ): Promise<boolean> {
    return getWebShareInstance().shareResultCard(cardType, cardData, includeUrl, includeHashtags)
  },
  getSupported(): boolean {
    if (typeof window === 'undefined') return false
    return getWebShareInstance().getSupported()
  },
  getShareButtonText(): string {
    return getWebShareInstance().getShareButtonText()
  }
}
