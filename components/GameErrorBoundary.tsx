"use client"

import { Component, ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { Button } from '@/components/ui/button'

interface GameErrorBoundaryProps {
  children: ReactNode
  componentName: string
  fallback?: ReactNode
}

/**
 * Game-specific Error Boundary
 * Provides game-specific error handling and recovery
 */
export class GameErrorBoundary extends Component<GameErrorBoundaryProps> {
  private handleError = (error: Error, _errorInfo: React.ErrorInfo) => {
    // Log game-specific error context
    console.error(`Game Error in ${this.props.componentName}:`, {
      error: error.message,
      component: this.props.componentName,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })

    // Try to save game state before error
    try {
      const currentSceneId = localStorage.getItem('currentSceneId')
      if (currentSceneId) {
        localStorage.setItem('lastKnownSceneId', currentSceneId)
      }
    } catch (e) {
      console.warn('Could not save game state before error:', e)
    }
  }

  render() {
    return (
      <ErrorBoundary
        onError={this.handleError}
        resetKeys={[this.props.componentName]}
        fallback={this.props.fallback || (
          <div className="apple-game-container">
            <div className="apple-game-main">
              <div className="apple-header">
                <div className="apple-text-headline">Terminus</div>
                <div className="apple-text-caption">Birmingham Career Exploration</div>
              </div>

              <div className="apple-messages-container">
                <div className="apple-message-wrapper">
                  <div className="apple-message apple-message-narration">
                    <div className="apple-message-speaker">System</div>
                    <div className="apple-message-text">
                      Your journey encountered a momentary pause. The path ahead remains clear.
                    </div>
                  </div>
                </div>
              </div>

              <div className="apple-choices-container">
                <Button
                  onClick={() => window.location.reload()}
                  variant="default"
                  size="lg"
                  className="w-full"
                >
                  Continue Your Journey
                </Button>
              </div>
            </div>
          </div>
        )}
      >
        {this.props.children}
      </ErrorBoundary >
    )
  }
}
