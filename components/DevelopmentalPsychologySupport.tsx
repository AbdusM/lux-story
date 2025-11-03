"use client"

import { useState, useEffect } from 'react'
import { IdentityState, CulturalContext } from '@/lib/developmental-psychology-system'

interface DevelopmentalPsychologySupportProps {
  identityState: IdentityState
  culturalContext: CulturalContext
  identityPrompt: string | null
  culturalPrompt: string | null
  youthDevelopmentSupport: Record<string, any>
  culturalAdaptations: Record<string, any>
  identityScaffolding: Record<string, any>
  onDismiss?: () => void
}

/**
 * Developmental Psychology Support Component
 * Provides identity formation and cultural responsiveness support for Birmingham youth
 */
export function DevelopmentalPsychologySupport({ 
  identityState, 
  culturalContext,
  identityPrompt, 
  culturalPrompt,
  youthDevelopmentSupport,
  culturalAdaptations,
  identityScaffolding,
  onDismiss 
}: DevelopmentalPsychologySupportProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Handle escape key to close modal
  useEffect(() => {
    if (!isVisible) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false)
        onDismiss?.()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isVisible, onDismiss])

  // Show support when appropriate
  useEffect(() => {
    const shouldShow = (
      identityPrompt ||
      culturalPrompt ||
      Object.keys(youthDevelopmentSupport).length > 0 ||
      Object.keys(identityScaffolding).length > 0
    )
    
    if (shouldShow) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [identityPrompt, culturalPrompt, youthDevelopmentSupport, identityScaffolding])

  if (!isVisible) return null

  const getIdentityStageIcon = () => {
    switch (identityState.identityExploration) {
      case 'early': return '🌱'
      case 'active': return '🌿'
      case 'crystallizing': return '🌳'
      case 'committed': return '🏆'
      default: return '💭'
    }
  }

  const getIdentityStageColor = () => {
    switch (identityState.identityExploration) {
      case 'early': return 'text-green-600'
      case 'active': return 'text-blue-600'
      case 'crystallizing': return 'text-purple-600'
      case 'committed': return 'text-gold-600'
      default: return 'text-gray-600'
    }
  }

  const getIdentityStageMessage = () => {
    switch (identityState.identityExploration) {
      case 'early': return 'You\'re just beginning to explore who you are. That\'s exciting!'
      case 'active': return 'You\'re actively discovering what matters to you. Keep exploring!'
      case 'crystallizing': return 'You\'re starting to see patterns in who you are. Trust your instincts!'
      case 'committed': return 'You have a strong sense of who you are. How do you want to grow?'
      default: return 'Keep exploring who you are!'
    }
  }

  const getCulturalIdentityIcon = () => {
    switch (identityState.culturalIdentity) {
      case 'unexplored': return '❓'
      case 'questioning': return '🤔'
      case 'exploring': return '🔍'
      case 'affirmed': return '✨'
      default: return '💭'
    }
  }

  const getCulturalIdentityColor = () => {
    switch (identityState.culturalIdentity) {
      case 'unexplored': return 'text-gray-600'
      case 'questioning': return 'text-yellow-600'
      case 'exploring': return 'text-blue-600'
      case 'affirmed': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="text-center">
          {/* Identity stage indicator */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-2">{getIdentityStageIcon()}</span>
            <span className={`text-sm font-medium ${getIdentityStageColor()}`}>
              {identityState.identityExploration.charAt(0).toUpperCase() + identityState.identityExploration.slice(1)} Identity
            </span>
          </div>

          {/* Identity stage message */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {getIdentityStageMessage()}
          </p>

          {/* Cultural identity indicator */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-2">{getCulturalIdentityIcon()}</span>
            <span className={`text-sm font-medium ${getCulturalIdentityColor()}`}>
              {identityState.culturalIdentity.charAt(0).toUpperCase() + identityState.culturalIdentity.slice(1)} Cultural Identity
            </span>
          </div>

          {/* Identity formation prompt */}
          {identityPrompt && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                💭 {identityPrompt}
              </p>
            </div>
          )}

          {/* Cultural responsiveness prompt */}
          {culturalPrompt && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                🌍 {culturalPrompt}
              </p>
            </div>
          )}

          {/* Youth development support */}
          {Object.keys(youthDevelopmentSupport).length > 0 && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800 font-medium mb-2">
                🌟 Your Development:
              </p>
              <ul className="text-xs text-purple-700 space-y-1">
                {youthDevelopmentSupport.autonomySupport && (
                  <li>• You're in charge of your journey</li>
                )}
                {youthDevelopmentSupport.competenceSupport && (
                  <li>• Let's build on what you're good at</li>
                )}
                {youthDevelopmentSupport.relatednessSupport && (
                  <li>• How do you want to connect with others?</li>
                )}
                {youthDevelopmentSupport.purposeSupport && (
                  <li>• What gives your life meaning?</li>
                )}
                {youthDevelopmentSupport.choiceExpansion && (
                  <li>• {youthDevelopmentSupport.choiceExpansion}</li>
                )}
                {youthDevelopmentSupport.skillBuilding && (
                  <li>• {youthDevelopmentSupport.skillBuilding}</li>
                )}
                {youthDevelopmentSupport.connectionBuilding && (
                  <li>• {youthDevelopmentSupport.connectionBuilding}</li>
                )}
                {youthDevelopmentSupport.meaningMaking && (
                  <li>• {youthDevelopmentSupport.meaningMaking}</li>
                )}
              </ul>
            </div>
          )}

          {/* Cultural adaptations */}
          {Object.keys(culturalAdaptations).length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800 font-medium mb-2">
                🌍 Cultural Support:
              </p>
              <ul className="text-xs text-orange-700 space-y-1">
                {culturalAdaptations.communityFocus && (
                  <li>• Community-centered approach</li>
                )}
                {culturalAdaptations.familyHonor && (
                  <li>• Family values and traditions</li>
                )}
                {culturalAdaptations.resilienceBuilding && (
                  <li>• Strength and resilience focus</li>
                )}
                {culturalAdaptations.creativeExpression && (
                  <li>• Creative expression and innovation</li>
                )}
                {culturalAdaptations.adaptiveLanguage && (
                  <li>• Language that adapts to you</li>
                )}
                {culturalAdaptations.responsiveTone && (
                  <li>• Tone that responds to your needs</li>
                )}
              </ul>
            </div>
          )}

          {/* Identity scaffolding */}
          {Object.keys(identityScaffolding).length > 0 && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-800 font-medium mb-2">
                🧠 Identity Support:
              </p>
              <ul className="text-xs text-indigo-700 space-y-1">
                {identityScaffolding.explorationSupport && (
                  <li>• Safe space to explore who you are</li>
                )}
                {identityScaffolding.commitmentSupport && (
                  <li>• Support for your values and commitments</li>
                )}
                {identityScaffolding.integrationSupport && (
                  <li>• Help integrating your identity</li>
                )}
                {identityScaffolding.curiosityEncouragement && (
                  <li>• {identityScaffolding.curiosityEncouragement}</li>
                )}
                {identityScaffolding.safeExploration && (
                  <li>• {identityScaffolding.safeExploration}</li>
                )}
                {identityScaffolding.valueClarification && (
                  <li>• {identityScaffolding.valueClarification}</li>
                )}
                {identityScaffolding.decisionSupport && (
                  <li>• {identityScaffolding.decisionSupport}</li>
                )}
                {identityScaffolding.legacyBuilding && (
                  <li>• {identityScaffolding.legacyBuilding}</li>
                )}
                {identityScaffolding.contributionFocus && (
                  <li>• {identityScaffolding.contributionFocus}</li>
                )}
              </ul>
            </div>
          )}

          {/* Identity state details (collapsible) */}
          <div className="mb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {showDetails ? 'Hide' : 'Show'} identity details
            </button>
            
            {showDetails && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <strong>Self Concept:</strong> {identityState.selfConcept}
                  </div>
                  <div>
                    <strong>Career Identity:</strong> {identityState.careerIdentity}
                  </div>
                  <div>
                    <strong>Social Identity:</strong> {identityState.socialIdentity}
                  </div>
                  <div>
                    <strong>Future Orientation:</strong> {identityState.futureOrientation}
                  </div>
                  <div>
                    <strong>Language Preference:</strong> {culturalContext.languagePreference}
                  </div>
                  <div>
                    <strong>Cultural Values:</strong> {culturalContext.culturalValues.join(', ')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setIsVisible(false)}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              I'm ready
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
