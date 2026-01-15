/**
 * Toast Notification System
 * Lightweight toast notifications with Framer Motion animations
 * Matches the glass morphism aesthetic of the app
 */

'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X, Cloud, CloudOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/animations'

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'sync' | 'offline'

export interface Toast {
  id: string
  type: ToastType
  message: string
  description?: string
  duration?: number // ms, 0 = no auto-dismiss
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  sync: <Cloud className="w-5 h-5 text-green-400" />,
  offline: <CloudOff className="w-5 h-5 text-slate-400" />,
}

const TOAST_COLORS: Record<ToastType, string> = {
  success: 'border-green-500/30 bg-green-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
  sync: 'border-green-500/30 bg-green-500/10',
  offline: 'border-slate-500/30 bg-slate-500/10',
}

const DEFAULT_DURATION = 4000 // 4 seconds

/**
 * Toast Provider - Wrap your app with this to enable toasts
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const prefersReducedMotion = useReducedMotion()

  const addToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? DEFAULT_DURATION,
    }

    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}

      {/* Toast Container - Fixed position at bottom-right */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-[min(400px,calc(100vw-32px))]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

/**
 * Individual Toast Item
 */
function ToastItem({
  toast,
  onDismiss,
  prefersReducedMotion,
}: {
  toast: Toast
  onDismiss: () => void
  prefersReducedMotion: boolean | null
}) {
  // Auto-dismiss timer
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(onDismiss, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onDismiss])

  return (
    <motion.div
      layout
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 }}
      transition={springs.smooth}
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md shadow-lg',
        'bg-[#0a0c10]/90',
        TOAST_COLORS[toast.type]
      )}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {TOAST_ICONS[toast.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{toast.message}</p>
        {toast.description && (
          <p className="mt-1 text-xs text-slate-400">{toast.description}</p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </motion.div>
  )
}

/**
 * Hook to use toast notifications
 */
export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  const { addToast, removeToast, clearAll } = context

  // Convenience methods
  const success = useCallback((message: string, description?: string) => {
    return addToast({ type: 'success', message, description })
  }, [addToast])

  const error = useCallback((message: string, description?: string) => {
    return addToast({ type: 'error', message, description })
  }, [addToast])

  const info = useCallback((message: string, description?: string) => {
    return addToast({ type: 'info', message, description })
  }, [addToast])

  const warning = useCallback((message: string, description?: string) => {
    return addToast({ type: 'warning', message, description })
  }, [addToast])

  // Settings sync specific toasts
  const syncSuccess = useCallback((description?: string) => {
    return addToast({
      type: 'sync',
      message: 'Settings synced',
      description: description ?? 'Your preferences are saved to the cloud',
      duration: 3000,
    })
  }, [addToast])

  const syncError = useCallback((description?: string) => {
    return addToast({
      type: 'error',
      message: 'Sync failed',
      description: description ?? 'Settings saved locally. Will retry later.',
      duration: 5000,
    })
  }, [addToast])

  const offlineNotice = useCallback(() => {
    return addToast({
      type: 'offline',
      message: 'Offline mode',
      description: 'Settings saved locally only',
      duration: 3000,
    })
  }, [addToast])

  return {
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    info,
    warning,
    syncSuccess,
    syncError,
    offlineNotice,
  }
}
