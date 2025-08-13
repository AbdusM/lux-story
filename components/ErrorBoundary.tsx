"use client"

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Simple error boundary to prevent white screen failures
 * Keeps the contemplative experience graceful
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
          <div className="text-center max-w-md">
            <p className="text-lg mb-4">Something unexpected happened.</p>
            <p className="text-sm text-muted-foreground mb-6">
              The contemplation continues. Refresh to return.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Return
            </button>
          </div>
        </div>
      )
    }
    
    return this.props.children
  }
}