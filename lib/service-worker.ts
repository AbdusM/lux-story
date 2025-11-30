// Service Worker Registration
// Registers the service worker for PWA functionality

import { logger } from './logger'

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          logger.debug('Service Worker registered successfully', { operation: 'service-worker.register', scope: registration.scope })
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, prompt user to refresh
                  logger.debug('New content available, please refresh', { operation: 'service-worker.update' })
                  // Could show a notification here
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    })
  }
}

// Unregister service worker (for development)
export function unregisterServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
        logger.debug('Service Worker unregistered', { operation: 'service-worker.unregister' })
      })
    })
  }
}
