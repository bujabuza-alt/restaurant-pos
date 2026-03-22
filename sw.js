const CACHE_VERSION = ‘v1.0.3’;
const CACHE_NAME = `order-checklist-${CACHE_VERSION}`;

const urlsToCache = [
‘./’,
‘./index.html’
];

self.addEventListener(‘install’, event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
);
// skipWaiting 제거 - 앱 사용 중 강제 활성화 방지
});

self.addEventListener(‘activate’, event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys
.filter(key => key !== CACHE_NAME)
.map(key => caches.delete(key))
)
)
);
// clients.claim 제거 - 강제 페이지 재시작 방지
});

self.addEventListener(‘fetch’, event => {
event.respondWith(
caches.match(event.request).then(cached => {
return fetch(event.request)
.then(response => {
const clone = response.clone();
caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
return response;
})
.catch(() => cached);
})
);
});
