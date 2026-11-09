/* SCOUTBOOK Service Worker — 確保露營、遠足及離線集會現場仍可完整開啟與讀寫紀錄冊。
 *
 * 自動更新三件事（換版本時必須同步）：
 *   1. CACHE_NAME 的版本尾碼每次發版都要遞增；只改程式不改快取名，已安裝的 APP 永遠收舊版面。
 *      （現行版號 = scoutbook-cache-v3，必須與 package.json／APP_VERSION／index.html meta 同步遞增。）
 *   2. install 時不自動 skipWaiting，新版先停在 waiting，由前台彈「立即更新」給用戶決定。
 *   3. 前台收到 SKIP_WAITING 後才接管；activate 清走所有舊 cache 並 clients.claim()。
 */

const CACHE_NAME = 'scoutbook-cache-v3';
const SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/favicon-v2.ico',
  '/icons/favicon-16-v2.png',
  '/icons/favicon-32-v2.png',
  '/icons/favicon-48-v2.png',
  '/icons/apple-touch-icon-v2.png',
  '/icons/icon-192-v2.png',
  '/icons/icon-512-v2.png',
  '/icons/icon-maskable-192-v2.png',
  '/icons/icon-maskable-512-v2.png',
  '/icons/og-image-v2.png',
];

self.addEventListener('install', (event) => {
  // 預快取主殼層：全部以 cache: 'reload' 抓，避免用 HTTP cache 的舊檔填新 cache。
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(SHELL.map((url) => cache.add(new Request(url, { cache: 'reload' }))));
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('scoutbook-') && k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function networkFirstNav(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) cache.put('/index.html', fresh.clone());
    return fresh;
  } catch {
    return (
      (await cache.match('/index.html')) ||
      (await cache.match('/')) ||
      new Response('<h1>SCOUTBOOK</h1><p>目前離線且尚未快取主頁面，請先在連網狀態開啟一次。</p>', {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    );
  }
}

async function cacheFirstStatic(request) {
  const cache = await caches.open(CACHE_NAME);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res && res.ok) cache.put(request, res.clone());
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(networkFirstNav(req));
    return;
  }
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/img/') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname === '/manifest.webmanifest'
  ) {
    event.respondWith(cacheFirstStatic(req));
  }
});
