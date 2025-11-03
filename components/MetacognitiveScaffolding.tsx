"use client"

import { useState, useEffect } from 'react'
import { CognitiveState } from '@/lib/cognitive-development-system'

interface MetacognitiveScaffoldingProps {
  cognitiveState: CognitiveState
  metacognitivePrompt: string | null
  flowOptimization: Record<string, any>
  cognitiveScaffolding: Record<string, any>
  learningStyleAdaptations: Record<string, any>
  onDismiss?: () => void
}

/**
 * Metacognitive Scaffolding Component
 * Provides cognitive development support and flow state optimization for Birmingham youth
 */
export function MetacognitiveScaffolding({ 
  cognitiveState, 
  metacognitivePrompt, 
  flowOptimization, 
  cognitiveScaffolding,
  learningStyleAdaptations,
  onDismiss 
}: MetacognitiveScaffoldingProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Show scaffolding when appropriate
  useEffect(() => {
    const shouldShow = (
      metacognitivePrompt ||
      flowOptimization.challengeReduction ||
      flowOptimization.challengeIncrease ||
      cognitiveScaffolding.decisionSupport ||
      cognitiveScaffolding.reflectionPrompts
    )
    
    if (shouldShow) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [metacognitivePrompt, flowOptimization, cognitiveScaffolding])

  if (!isVisible) return null

  const getFlowStateIcon = () => {
    switch (cognitiveState.flowState) {
      case 'struggle': return '🌱'
      case 'flow': return '✨'
      case 'boredom': return '😴'
      case 'anxiety': return '😰'
      default: return '💭'
    }
  }

  const getFlowStateColor = () => {
    switch (cognitiveState.flowState) {
      case 'struggle': return 'text-yellow-600'
      case 'flow': return 'text-green-600'
      case 'boredom': return 'text-blue-600'
      case 'anxiety': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getFlowStateMessage = () => {
    switch (cognitiveState.flowState) {
      case 'struggle': return 'You\'re learning! This is exactly how growth happens.'
      case 'flow': return 'You\'re in the zone! Keep going!'
      case 'boredom': return 'Ready for something more interesting?'
      case 'anxiety': return 'Let\'s take a step back and try something simpler.'
      default: return 'Keep exploring!'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg mx-4 shadow-xl">
        <div className="text-center">
          {/* Flow state indicator */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-2">{getFlowStateIcon()}</span>
            <span className={`text-sm font-medium ${getFlowStateColor()}`}>
              {cognitiveState.flowState.charAt(0).toUpperCase() + cognitiveState.flowState.slice(1)}
            </span>
          </div>

          {/* Flow state message */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {getFlowStateMessage()}
          </p>

          {/* Metacognitive prompt */}
          {metacognitivePrompt && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                💭 {metacognitivePrompt}
              </p>
            </div>
          )}

          {/* Flow optimization suggestions */}
          {Object.keys(flowOptimization).length > 0 && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-2">
                🎯 Suggestions:
              </p>
              <ul className="text-xs text-green-700 space-y-1">
                {flowOptimization.challengeReduction && (
                  <li>• Let's try something simpler</li>
                )}
                {flowOptimization.challengeIncrease && (
                  <li>• Ready for more complexity?</li>
                )}
                {flowOptimization.skillBuilding && (
                  <li>• Focus on building your skills</li>
                )}
                {flowOptimization.guidanceIncrease && (
                  <li>• More guidance available</li>
                )}
                {flowOptimization.celebration && (
                  <li>• {flowOptimization.celebration}</li>
                )}
              </ul>
            </div>
          )}

          {/* Cognitive scaffolding */}
          {Object.keys(cognitiveScaffolding).length > 0 && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800 font-medium mb-2">
                🧠 Learning Support:
              </p>
              <ul className="text-xs text-purple-700 space-y-1">
                {cognitiveScaffolding.decisionSupport && (
                  <li>• Take your time with decisions</li>
                )}
                {cognitiveScaffolding.choiceClarification && (
                  <li>• Ask questions if you need clarity</li>
                )}
                {cognitiveScaffolding.oneThingAtATime && (
                  <li>• Focus on one choice at a time</li>
                )}
                {cognitiveScaffolding.reflectionPrompts && (
                  <li>• Notice what you're learning about yourself</li>
                )}
                {cognitiveScaffolding.patternHighlighting && (
                  <li>• Look for patterns in your choices</li>
                )}
              </ul>
            </div>
          )}

          {/* Learning style adaptations */}
          {Object.keys(learningStyleAdaptations).length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800 font-medium mb-2">
                🎨 Your Learning Style:
              </p>
              <ul className="text-xs text-orange-700 space-y-1">
                {learningStyleAdaptations.visualCues && (
                  <li>• Visual cues and diagrams available</li>
                )}
                {learningStyleAdaptations.verbalCues && (
                  <li>• Verbal explanations and dialogue</li>
                )}
                {learningStyleAdaptations.interactiveElements && (
                  <li>• Interactive elements and movement</li>
                )}
                {learningStyleAdaptations.multimodal && (
                  <li>• Multiple ways to learn and explore</li>
                )}
              </ul>
            </div>
          )}

          {/* Cognitive state details (collapsible) */}
          <div className="mb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {showDetails ? 'Hide' : 'Show'} learning details
            </button>
            
            {showDetails && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <strong>Challenge Level:</strong> {Math.round(cognitiveState.challengeLevel * 100)}%
                  </div>
                  <div>
                    <strong>Skill Level:</strong> {Math.round(cognitiveState.skillLevel * 100)}%
                  </div>
                  <div>
                    <strong>Executive Function:</strong> {cognitiveState.executiveFunction}
                  </div>
                  <div>
                    <strong>Working Memory:</strong> {cognitiveState.workingMemory}
                  </div>
                  <div>
                    <strong>Attention Span:</strong> {cognitiveState.attentionSpan}
                  </div>
                  <div>
                    <strong>Learning Style:</strong> {cognitiveState.learningStyle}
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
