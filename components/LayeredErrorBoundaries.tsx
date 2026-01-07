"use client"

import { Component, ReactNode } from 'react'
import { logger } from '@/lib/logger'

/**
 * Layered Error Boundary System
 *
 * Three levels of error containment:
 * - PageErrorBoundary: Catches page-level errors, shows full-page recovery UI
 * - GameErrorBoundary: Catches game errors, preserves state, allows restart
 * - SectionErrorBoundary: Catches section errors (Journal, etc.), minimal disruption
 *
 * Philosophy: Errors in one section shouldn't crash the entire game.
 */

// ============= TYPES =============

interface ErrorInfo {
  componentStack: string
}

type BoundaryLevel = 'page' | 'game' | 'section'

interface BaseProps {
  children: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

// ============= BASE ERROR BOUNDARY =============

abstract class BaseErrorBoundary extends Component<BaseProps, State> {
  protected abstract level: BoundaryLevel
  protected abstract levelName: string
  private resetTimeoutId: number | null = null

  constructor(props: BaseProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId

    // Log with boundary level context
    logger.error(`${this.levelName} caught an error`, {
      error: error.message,
      stack: error.stack,
      errorId,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.levelName,
      level: this.level
    })

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    this.setState({ errorInfo })

    // Report to Sentry with level context
    if (typeof window !== 'undefined') {
      try {
        // @ts-expect-error - Sentry may not be available
        if (window.Sentry) {
          // @ts-expect-error - Sentry types may not be loaded
          window.Sentry.captureException(error, {
            contexts: {
              react: { componentStack: errorInfo.componentStack },
              custom: { errorId, errorBoundary: this.levelName, level: this.level }
            },
            tags: {
              errorBoundary: this.levelName,
              boundaryLevel: this.level
            }
          })
        }
      } catch {
        // Silently fail if Sentry is not available
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  protected resetErrorBoundary() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    // Call onReset callback before clearing state
    if (this.props.onReset) {
      this.props.onReset()
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    })
  }

  // Bound version for use in onClick handlers
  protected handleReset = () => {
    this.resetErrorBoundary()
  }

  protected abstract renderFallback(): ReactNode

  render() {
    if (this.state.hasError) {
      return this.renderFallback()
    }
    return this.props.children
  }
}

// ============= PAGE ERROR BOUNDARY =============

interface PageErrorBoundaryProps extends BaseProps {
  /** Show full reload option */
  showReload?: boolean
}

/**
 * PageErrorBoundary - Top-level error containment
 *
 * Use at the app/layout level. Shows full-page recovery UI.
 * Last line of defense before the app crashes completely.
 */
export class PageErrorBoundary extends BaseErrorBoundary {
  protected level: BoundaryLevel = 'page'
  protected levelName = 'PageErrorBoundary'

  declare props: PageErrorBoundaryProps & { children: ReactNode }

  protected renderFallback(): ReactNode {
    const { error, errorId } = this.state
    const showReload = (this.props as PageErrorBoundaryProps).showReload ?? true

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="text-center max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Something unexpected happened
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The station has encountered an anomaly. Your journey is safe.
          </p>

          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 mb-2">
                Error Details (Development)
              </summary>
              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded text-xs font-mono text-slate-700 dark:text-slate-300 overflow-auto max-h-32">
                <div className="font-semibold mb-1">Error ID: {errorId}</div>
                <div className="mb-2">{error.message}</div>
                <div className="text-slate-500 dark:text-slate-400">
                  {error.stack?.split('\n').slice(0, 5).join('\n')}
                </div>
              </div>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            {showReload && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Refresh Page
              </button>
            )}
          </div>

          <div className="mt-6 text-xs text-slate-500 dark:text-slate-400">
            Error ID: {errorId}
          </div>
        </div>
      </div>
    )
  }
}

// ============= GAME ERROR BOUNDARY =============

interface GameErrorBoundaryProps extends BaseProps {
  /** Callback to save game state before reset */
  onSaveState?: () => void
  /** Character name for context */
  characterName?: string
}

/**
 * GameErrorBoundary - Game-level error containment
 *
 * Wraps the main game interface. On error:
 * - Saves game state if possible
 * - Shows in-game recovery UI
 * - Allows restarting the current conversation
 *
 * Does NOT refresh the page - preserves app state.
 */
export class GameErrorBoundary extends BaseErrorBoundary {
  protected level: BoundaryLevel = 'game'
  protected levelName = 'GameErrorBoundary'

  declare props: GameErrorBoundaryProps & { children: ReactNode }

  protected resetErrorBoundary() {
    // Try to save state before reset
    const gameProps = this.props as GameErrorBoundaryProps
    if (gameProps.onSaveState) {
      try {
        gameProps.onSaveState()
      } catch (e) {
        logger.warn('Failed to save game state during error recovery', { error: e })
      }
    }

    // Call parent reset
    super.resetErrorBoundary()
  }

  protected renderFallback(): ReactNode {
    const { error, errorId } = this.state
    const { characterName } = this.props as GameErrorBoundaryProps

    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-sm bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
          <div className="w-12 h-12 mx-auto mb-4 bg-amber-500/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-slate-100 mb-2">
            A moment of interference
          </h3>

          <p className="text-sm text-slate-400 mb-4">
            {characterName
              ? `Your conversation with ${characterName} hit a snag. Your progress is safe.`
              : 'The station experienced a brief disruption. Your journey continues.'}
          </p>

          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-xs text-slate-500 mb-1">
                Technical Details
              </summary>
              <div className="bg-slate-900/50 p-2 rounded text-xs font-mono text-slate-400 overflow-auto max-h-20">
                {error.message}
              </div>
            </details>
          )}

          <button
            onClick={this.handleReset}
            className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Resume Journey
          </button>

          <div className="mt-3 text-xs text-slate-600">
            {errorId}
          </div>
        </div>
      </div>
    )
  }
}

// ============= SECTION ERROR BOUNDARY =============

interface SectionErrorBoundaryProps extends BaseProps {
  /** Section name for error context */
  sectionName: string
  /** Compact mode for smaller sections */
  compact?: boolean
}

/**
 * SectionErrorBoundary - Section-level error containment
 *
 * Wraps individual UI sections (Journal, Constellation, etc.)
 * Shows minimal disruption - just the section shows an error,
 * rest of the game continues normally.
 */
export class SectionErrorBoundary extends BaseErrorBoundary {
  protected level: BoundaryLevel = 'section'
  protected levelName = 'SectionErrorBoundary'

  declare props: SectionErrorBoundaryProps & { children: ReactNode }

  protected renderFallback(): ReactNode {
    const { error, errorId } = this.state
    const { sectionName, compact } = this.props as SectionErrorBoundaryProps

    if (compact) {
      return (
        <div className="p-3 bg-slate-800/50 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{sectionName} unavailable</span>
          </div>
          <button
            onClick={this.handleReset}
            className="mt-2 text-xs text-slate-400 hover:text-slate-300 underline"
          >
            Retry
          </button>
        </div>
      )
    }

    return (
      <div className="p-4 bg-slate-800/80 rounded-xl border border-red-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-slate-200 mb-1">
              {sectionName} encountered an issue
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              This section is temporarily unavailable. The rest of your journey continues.
            </p>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="mb-3">
                <summary className="cursor-pointer text-xs text-slate-500">
                  Details
                </summary>
                <div className="mt-1 p-2 bg-slate-900/50 rounded text-xs font-mono text-slate-500 overflow-auto max-h-16">
                  {error.message}
                </div>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-medium transition-colors"
            >
              Try Again
            </button>

            <span className="ml-2 text-xs text-slate-600">{errorId}</span>
          </div>
        </div>
      </div>
    )
  }
}

// ============= EXPORTS =============

export type { BoundaryLevel, ErrorInfo }
