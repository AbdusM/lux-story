import React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorRecoveryStateProps {
  title: string
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  severity?: 'error' | 'warning' | 'info'
}

export function ErrorRecoveryState({
  title,
  message,
  onRetry,
  onDismiss,
  severity = 'warning'
}: ErrorRecoveryStateProps) {
  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-900'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      text: 'text-amber-900'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-900'
    }
  }[severity]
  
  return (
    <div className={cn(
      "p-4 rounded-lg border shadow-md",
      styles.bg,
      styles.border,
      "animate-fade-in"
    )}>
      <div className="flex items-start gap-3">
        <AlertCircle className={cn("w-5 h-5 flex-shrink-0", styles.icon)} />
        
        <div className="flex-1">
          <h4 className={cn("font-semibold mb-1", styles.text)}>
            {title}
          </h4>
          <p className={cn("text-sm", styles.text, "opacity-90")}>
            {message}
          </p>
          
          {/* Actions */}
          <div className="flex gap-3 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className={cn(
                  "text-sm font-medium px-4 py-2 rounded-md",
                  "hover:bg-white/50 transition-colors",
                  styles.text
                )}
              >
                Try again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Continue anyway
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
