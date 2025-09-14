"use client"

import { Component, ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

interface MessageErrorBoundaryProps {
  children: ReactNode
  messageId: string
}

/**
 * Message-specific Error Boundary
 * Handles errors in message rendering gracefully
 */
export class MessageErrorBoundary extends Component<MessageErrorBoundaryProps> {
  render() {
    return (
      <ErrorBoundary
        resetKeys={[this.props.messageId]}
        fallback={
          <div className="apple-message-wrapper">
            <div className="apple-message apple-message-narration">
              <div className="apple-message-speaker">System</div>
              <div className="apple-message-text">
                This message could not be displayed properly. The story continues...
              </div>
            </div>
          </div>
        }
      >
        {this.props.children}
      </ErrorBoundary>
    )
  }
}
