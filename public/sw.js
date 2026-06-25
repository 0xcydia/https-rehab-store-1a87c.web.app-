const CACHE = 'rehab-store-v2'
const ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/styles.css',
  '/app.js'
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  )
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(res => {
        const clone = res.clone()
        if (res.ok && res.type === 'basic') {
          caches.open(CACHE).then(c => c.put(e.request, clone))
        }
        return res
      }).catch(() => cached)
      return cached || fetched
    })
  )
})
