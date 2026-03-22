// sw.js — 버전 번호를 수동으로 올릴 필요 없습니다.
// index.html이 배포될 때마다 날짜 기반으로 캐시가 자동 갱신됩니다.

// 오늘 날짜를 캐시 키로 사용 (UTC 기준 일 단위 변경)
const CACHE = `stock-mgr-${new Date().toISOString().slice(0, 10)}`;

const ASSETS = [
‘./’,
‘./index.html’,
];

// ── 설치: 새 캐시에 파일 저장 ──
self.addEventListener(‘install’, e => {
e.waitUntil(
caches.open(CACHE).then(c => c.addAll(ASSETS))
);
// 대기 없이 즉시 활성화
self.skipWaiting();
});

// ── 활성화: 이전 캐시 삭제 ──
self.addEventListener(‘activate’, e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys.filter(k => k !== CACHE).map(k => caches.delete(k))
)
).then(() => self.clients.claim())
);
});

// ── 요청 처리: 네트워크 우선, 실패 시 캐시 ──
self.addEventListener(‘fetch’, e => {
e.respondWith(
fetch(e.request)
.then(res => {
// 성공 응답은 캐시에도 저장
const clone = res.clone();
caches.open(CACHE).then(c => c.put(e.request, clone));
return res;
})
.catch(() => caches.match(e.request))
);
});

// ── 메시지: SKIP_WAITING (index.html에서 요청 시) ──
self.addEventListener(‘message’, e => {
if (e.data?.type === ‘SKIP_WAITING’) self.skipWaiting();
});
