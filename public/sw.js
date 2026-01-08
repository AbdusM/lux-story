// Service Worker for Grand Central Terminus
// Provides offline capability and caching

const CACHE_NAME = 'gct-v2.1.0'
const STATIC_CACHE = 'gct-static-v2.1.0'
const DYNAMIC_CACHE = 'gct-dynamic-v2.1.0'

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/favicon.ico'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing v2.1.0...')
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating v2.1.0...')
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activation complete')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache:', event.request.url)
          return cachedResponse
        }

        // Otherwise fetch from network
        console.log('Service Worker: Fetching from network:', event.request.url)
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response for caching
            const responseToCache = response.clone()

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/')
            }
          })
      })
  )
})

// Background sync for game progress
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered')
    event.waitUntil(
      // Sync game progress when online
      syncGameProgress()
    )
  }
})

// Sync game progress function
async function syncGameProgress() {
  try {
    // Get game state from IndexedDB
    const gameState = await getGameState()

    if (gameState) {
      // Sync with server when available
      console.log('Service Worker: Syncing game progress')
      // Implementation would go here when backend is available
    }
  } catch (error) {
    console.error('Service Worker: Sync failed:', error)
  }
}

// Get game state from IndexedDB
async function getGameState() {
  // Implementation would use IndexedDB to get game state
  // For now, return null
  return null
}
