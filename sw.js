// ★ 코드를 수정할 때마다 이 버전 번호를 올려주세요 ★
// 예: v1 → v2 → v3 …
const VERSION = ‘v1.1’;
const CACHE   = `stock-mgr-${VERSION}`;

// 캐시할 파일 목록
const ASSETS = [
‘./’,
‘./index.html’,
];

// ── 설치: 새 버전 파일을 캐시에 저장 ──
self.addEventListener(‘install’, e => {
e.waitUntil(
caches.open(CACHE).then(c => c.addAll(ASSETS))
);
});

// ── 활성화: 이전 버전 캐시 삭제 ──
self.addEventListener(‘activate’, e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys.filter(k => k !== CACHE).map(k => caches.delete(k))
)
).then(() => self.clients.claim())
);
});

// ── 요청 처리: 캐시 우선, 없으면 네트워크 ──
self.addEventListener(‘fetch’, e => {
e.respondWith(
caches.match(e.request).then(cached => cached || fetch(e.request))
);
});

// ── 메시지 수신: index.html에서 SKIP_WAITING 요청 시 즉시 교체 ──
self.addEventListener(‘message’, e => {
if (e.data?.type === ‘SKIP_WAITING’) self.skipWaiting();
});
