// Service Worker for Button Hold Game PWA
const CACHE_NAME = 'button-hold-v1.0.0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',

    '/goku-evolutions.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/images/goku/base.jpg',
    '/screenshot-mobile.svg',
    '/screenshot-desktop.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                // Force the waiting service worker to become the active service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                // Take control of all pages immediately
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('Service Worker: Activation failed', error);
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip external requests (different origin)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', event.request.url);
                    return cachedResponse;
                }
                
                // Otherwise, fetch from network
                console.log('Service Worker: Fetching from network', event.request.url);
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response because it's a stream
                        const responseToCache = response.clone();
                        
                        // Cache the fetched resource for future use
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('Service Worker: Fetch failed', error);
                        
                        // If it's a navigation request, return the offline page
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        // For other requests, just throw the error
                        throw error;
                    });
            })
    );
});

// Background sync for sharing (when network is restored)
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'share-score') {
        event.waitUntil(
            // Handle background sharing if needed
            handleBackgroundShare()
        );
    }
});

// Push notifications (for future features)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push message received', event);
    
    const options = {
        body: event.data ? event.data.text() : 'New challenge available!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Play Now',
                icon: '/icon-192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Button Hold Challenge', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification click received', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Helper function for background sharing
async function handleBackgroundShare() {
    try {
        // Get pending share data from IndexedDB or localStorage
        const shareData = await getStoredShareData();
        
        if (shareData) {
            // Attempt to share the data
            await fetch('/api/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shareData)
            });
            
            // Clear the stored data after successful share
            await clearStoredShareData();
            
            console.log('Service Worker: Background share completed');
        }
    } catch (error) {
        console.error('Service Worker: Background share failed', error);
    }
}

// Helper functions for data storage (simplified)
async function getStoredShareData() {
    // In a real app, this would use IndexedDB
    // For now, return null as we don't have a backend
    return null;
}

async function clearStoredShareData() {
    // Clear stored share data
    return Promise.resolve();
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
    // Log performance metrics
    const startTime = performance.now();
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                if (duration > 1000) {
                    console.warn(`Service Worker: Slow response (${duration}ms) for ${event.request.url}`);
                }
                
                return response || fetch(event.request);
            })
    );
});

console.log('Service Worker: Script loaded successfully'); 