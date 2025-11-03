"use client"

import { useState, useEffect } from 'react'
import { NeuralState, BrainOptimization } from '@/lib/neuroscience-system'

interface NeuroscienceSupportProps {
  neuralState: NeuralState
  brainPrompt: string | null
  brainOptimization: BrainOptimization
  neuroplasticitySupport: Record<string, any>
  neuralEfficiencyTips: Record<string, any>
  onDismiss?: () => void
}

/**
 * Neuroscience Support Component
 * Provides brain-based learning and neuroplasticity support for Birmingham youth
 */
export function NeuroscienceSupport({ 
  neuralState, 
  brainPrompt, 
  brainOptimization,
  neuroplasticitySupport,
  neuralEfficiencyTips,
  onDismiss 
}: NeuroscienceSupportProps) {
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
      brainPrompt ||
      Object.values(brainOptimization).some(Boolean) ||
      Object.keys(neuroplasticitySupport).length > 0 ||
      Object.keys(neuralEfficiencyTips).length > 0
    )
    
    if (shouldShow) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [brainPrompt, brainOptimization, neuroplasticitySupport, neuralEfficiencyTips])

  if (!isVisible) return null

  const getNeuralStateIcon = () => {
    switch (neuralState.attentionNetwork) {
      case 'alerting': return '🔔'
      case 'orienting': return '👀'
      case 'executive': return '🧠'
      case 'integrated': return '✨'
      default: return '💭'
    }
  }

  const getNeuralStateColor = () => {
    switch (neuralState.attentionNetwork) {
      case 'alerting': return 'text-yellow-600'
      case 'orienting': return 'text-blue-600'
      case 'executive': return 'text-purple-600'
      case 'integrated': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getNeuralStateMessage = () => {
    switch (neuralState.attentionNetwork) {
      case 'alerting': return 'Your brain is alert and ready to learn!'
      case 'orienting': return 'Your attention is focused and directed!'
      case 'executive': return 'Your executive functions are engaged!'
      case 'integrated': return 'Your brain networks are working together beautifully!'
      default: return 'Your brain is learning and growing!'
    }
  }

  const getNeuroplasticityIcon = () => {
    switch (neuralState.neuroplasticity) {
      case 'low': return '🌱'
      case 'moderate': return '🌿'
      case 'high': return '🌳'
      case 'optimal': return '🌟'
      default: return '💭'
    }
  }

  const getNeuroplasticityColor = () => {
    switch (neuralState.neuroplasticity) {
      case 'low': return 'text-green-600'
      case 'moderate': return 'text-blue-600'
      case 'high': return 'text-purple-600'
      case 'optimal': return 'text-gold-600'
      default: return 'text-gray-600'
    }
  }

  const getNeuroplasticityMessage = () => {
    switch (neuralState.neuroplasticity) {
      case 'low': return 'Your brain is ready to make new connections!'
      case 'moderate': return 'Your brain is building new pathways!'
      case 'high': return 'Your brain is creating strong neural networks!'
      case 'optimal': return 'Your brain is at peak learning capacity!'
      default: return 'Your brain is growing and adapting!'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="text-center">
          {/* Neural state indicator */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-2">{getNeuralStateIcon()}</span>
            <span className={`text-sm font-medium ${getNeuralStateColor()}`}>
              {neuralState.attentionNetwork.charAt(0).toUpperCase() + neuralState.attentionNetwork.slice(1)} Attention
            </span>
          </div>

          {/* Neural state message */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {getNeuralStateMessage()}
          </p>

          {/* Neuroplasticity indicator */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-2">{getNeuroplasticityIcon()}</span>
            <span className={`text-sm font-medium ${getNeuroplasticityColor()}`}>
              {neuralState.neuroplasticity.charAt(0).toUpperCase() + neuralState.neuroplasticity.slice(1)} Neuroplasticity
            </span>
          </div>

          {/* Neuroplasticity message */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {getNeuroplasticityMessage()}
          </p>

          {/* Brain-based prompt */}
          {brainPrompt && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                🧠 {brainPrompt}
              </p>
            </div>
          )}

          {/* Brain optimization strategies */}
          {Object.values(brainOptimization).some(Boolean) && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800 font-medium mb-2">
                🎯 Brain Optimization:
              </p>
              <ul className="text-xs text-purple-700 space-y-1">
                {brainOptimization.attentionTraining && (
                  <li>• Focus training to strengthen attention networks</li>
                )}
                {brainOptimization.memoryEnhancement && (
                  <li>• Memory techniques to improve encoding and retrieval</li>
                )}
                {brainOptimization.executiveFunctionBoost && (
                  <li>• Executive function exercises for better planning</li>
                )}
                {brainOptimization.stressReduction && (
                  <li>• Stress reduction techniques for optimal learning</li>
                )}
                {brainOptimization.rewardOptimization && (
                  <li>• Reward systems to boost motivation and dopamine</li>
                )}
                {brainOptimization.socialConnection && (
                  <li>• Social engagement to enhance neuroplasticity</li>
                )}
                {brainOptimization.noveltyIntroduction && (
                  <li>• Novel experiences to create new neural pathways</li>
                )}
                {brainOptimization.repetitionSpacing && (
                  <li>• Spaced repetition for better memory consolidation</li>
                )}
              </ul>
            </div>
          )}

          {/* Neuroplasticity support */}
          {Object.keys(neuroplasticitySupport).length > 0 && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-2">
                🌱 Neuroplasticity Support:
              </p>
              <ul className="text-xs text-green-700 space-y-1">
                {neuroplasticitySupport.noveltyEncouragement && (
                  <li>• {neuroplasticitySupport.noveltyEncouragement}</li>
                )}
                {neuroplasticitySupport.explorationBoost && (
                  <li>• {neuroplasticitySupport.explorationBoost}</li>
                )}
                {neuroplasticitySupport.challengeIncrease && (
                  <li>• {neuroplasticitySupport.challengeIncrease}</li>
                )}
                {neuroplasticitySupport.challengeReduction && (
                  <li>• {neuroplasticitySupport.challengeReduction}</li>
                )}
                {neuroplasticitySupport.rewardBoost && (
                  <li>• {neuroplasticitySupport.rewardBoost}</li>
                )}
                {neuroplasticitySupport.achievementRecognition && (
                  <li>• {neuroplasticitySupport.achievementRecognition}</li>
                )}
                {neuroplasticitySupport.memorySupport && (
                  <li>• {neuroplasticitySupport.memorySupport}</li>
                )}
                {neuroplasticitySupport.consolidationHelp && (
                  <li>• {neuroplasticitySupport.consolidationHelp}</li>
                )}
              </ul>
            </div>
          )}

          {/* Neural efficiency tips */}
          {Object.keys(neuralEfficiencyTips).length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800 font-medium mb-2">
                ⚡ Neural Efficiency Tips:
              </p>
              <ul className="text-xs text-orange-700 space-y-1">
                {neuralEfficiencyTips.attentionFocus && (
                  <li>• {neuralEfficiencyTips.attentionFocus}</li>
                )}
                {neuralEfficiencyTips.distractionReduction && (
                  <li>• {neuralEfficiencyTips.distractionReduction}</li>
                )}
                {neuralEfficiencyTips.processingSupport && (
                  <li>• {neuralEfficiencyTips.processingSupport}</li>
                )}
                {neuralEfficiencyTips.patienceEncouragement && (
                  <li>• {neuralEfficiencyTips.patienceEncouragement}</li>
                )}
                {neuralEfficiencyTips.memoryChunking && (
                  <li>• {neuralEfficiencyTips.memoryChunking}</li>
                )}
                {neuralEfficiencyTips.loadReduction && (
                  <li>• {neuralEfficiencyTips.loadReduction}</li>
                )}
              </ul>
            </div>
          )}

          {/* Neural state details (collapsible) */}
          <div className="mb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {showDetails ? 'Hide' : 'Show'} brain details
            </button>
            
            {showDetails && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <strong>Memory Consolidation:</strong> {neuralState.memoryConsolidation}
                  </div>
                  <div>
                    <strong>Dopamine Level:</strong> {neuralState.dopamineLevel}
                  </div>
                  <div>
                    <strong>Stress Response:</strong> {neuralState.stressResponse}
                  </div>
                  <div>
                    <strong>Cognitive Load:</strong> {neuralState.cognitiveLoad}
                  </div>
                  <div>
                    <strong>Neural Efficiency:</strong> {neuralState.neuralEfficiency}
                  </div>
                  <div>
                    <strong>Neuroplasticity:</strong> {neuralState.neuroplasticity}
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
