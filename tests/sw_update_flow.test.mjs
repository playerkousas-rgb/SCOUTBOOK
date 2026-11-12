// 行為測試：模擬 Service Worker 的生命週期與前台更新協定（無瀏覽器環境）。
// 以最小假物（caches / clients / self / navigator / document）真跑一次，
// 證明「切回前景 → 查更新 → 彈提示 → SKIP_WAITING → controllerchange → reload」整條鏈成立。
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function loadServiceWorker() {
  const handlers = {};
  const calls = { skipWaiting: 0, claim: 0, deleted: [] };
  const cacheStore = new Map();
  const makeCache = (name) => ({
    add: async () => {},
    put: async () => {},
    match: async () => undefined,
    name,
  });
  const sandbox = {
    self: {
      location: { origin: 'https://scoutbook-five.vercel.app' },
      addEventListener: (type, fn) => { handlers[type] = fn; },
      skipWaiting: () => { calls.skipWaiting += 1; },
      clients: { claim: async () => { calls.claim += 1; } },
    },
    caches: {
      open: async (name) => {
        if (!cacheStore.has(name)) cacheStore.set(name, makeCache(name));
        return cacheStore.get(name);
      },
      keys: async () => ['scoutbook-cache-v1', 'scoutbook-cache-v2', 'scoutbook-cache-v3', 'scoutbook-cache-v4', 'scoutbook-cache-v5', 'scoutbook-cache-v6', 'other-app-cache'],
      delete: async (k) => { calls.deleted.push(k); return true; },
    },
    fetch: async () => new Response('ok'),
    Request: class { constructor(url, opts) { this.url = url; this.opts = opts; } },
    Response: class { constructor(body, init) { this.body = body; this.ok = true; Object.assign(this, init || {}); } },
    URL,
    Promise,
  };
  sandbox.self.self = sandbox.self;
  vm.createContext(sandbox);
  vm.runInContext(read('web/public/sw.js'), sandbox);
  return { handlers, calls };
}

test('SW：預快取／啟用清走所有舊 cache，且不動其他 app 的 cache', async () => {
  const { handlers, calls } = loadServiceWorker();
  let installPromise;
  handlers.install({ waitUntil: (p) => { installPromise = p; } });
  await installPromise;

  let activatePromise;
  handlers.activate({ waitUntil: (p) => { activatePromise = p; } });
  await activatePromise;

  assert.deepEqual(calls.deleted.sort(), ['scoutbook-cache-v1', 'scoutbook-cache-v2', 'scoutbook-cache-v3', 'scoutbook-cache-v4', 'scoutbook-cache-v5'], '只刪自家舊版快取');
  assert.equal(calls.claim, 1, 'activate 後要 clients.claim()');
  assert.equal(calls.skipWaiting, 0, 'install／activate 不得自動 skipWaiting（新版要停在 waiting 等用戶按）');
});

test('SW：收到 SKIP_WAITING 才接管', () => {
  const { handlers, calls } = loadServiceWorker();
  handlers.message({ data: { type: 'SKIP_WAITING' } });
  assert.equal(calls.skipWaiting, 1, '收到 SKIP_WAITING 要即刻 skipWaiting()');
  handlers.message({ data: { type: 'PING' } });
  assert.equal(calls.skipWaiting, 1, '其他訊息不應觸發 skipWaiting');
});

test('SW：導覽請求 network-first、圖示 cache-first、跨網域不攔截', async () => {
  const { handlers } = loadServiceWorker();
  const seen = [];
  const respond = (req) => {
    let handled = null;
    handlers.fetch({ request: req, respondWith: (p) => { handled = p; } });
    if (handled) seen.push(handled);
  };
  respond({ method: 'GET', mode: 'navigate', url: 'https://scoutbook-five.vercel.app/p/p012' });
  respond({ method: 'GET', mode: 'cors', url: 'https://scoutbook-five.vercel.app/icons/icon-192-v2.png' });
  // 導覽以外的同源請求（例如 API）不攔截
  respond({ method: 'GET', mode: 'cors', url: 'https://scoutbook-five.vercel.app/api/scoutbadge' });
  // 跨網域請求不攔截
  respond({ method: 'GET', mode: 'cors', url: 'https://scoutbadge.example/api/x' });
  respond({ method: 'POST', mode: 'cors', url: 'https://scoutbook-five.vercel.app/api/leader' });
  assert.equal(seen.length, 2, '只有導覽與靜態資源交由 SW 處理');
  const [nav, icon] = await Promise.all(seen);
  assert.ok(nav, '導覽請求要回 Response');
  assert.ok(icon, '圖示請求要回 Response');
});

/* ── 前台（pwa.js）協定 ─────────────────────────────────────────────── */

function loadPwa({ controller = {} } = {}) {
  const listeners = { window: {}, document: {}, sw: {} };
  const events = [];
  let reloads = 0;
  const registration = {
    waiting: null,
    installing: null,
    updates: 0,
    listeners: {},
    update() { this.updates += 1; return Promise.resolve(); },
    addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); },
  };
  const win = {
    addEventListener: (t, fn) => { (listeners.window[t] = listeners.window[t] || []).push(fn); },
    removeEventListener: () => {},
    dispatchEvent: (e) => { events.push(e); },
    location: { reload: () => { reloads += 1; }, search: '' },
    CustomEvent: class { constructor(type) { this.type = type; } },
    setInterval: () => 0,
    clearInterval: () => {},
  };
  const doc = {
    visibilityState: 'visible',
    addEventListener: (t, fn) => { (listeners.document[t] = listeners.document[t] || []).push(fn); },
  };
  const swContainer = {
    controller,
    addEventListener: (t, fn) => { (listeners.sw[t] = listeners.sw[t] || []).push(fn); },
    register: async () => registration,
    getRegistration: async () => registration,
  };
  const sandbox = {
    window: win,
    document: doc,
    navigator: { serviceWorker: swContainer },
    URLSearchParams,
    CustomEvent: class { constructor(type, init) { this.type = type; Object.assign(this, init || {}); } },
    setTimeout: () => 0,
    console,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  // 去掉 ESM export 語法後在 vm 內執行，import.meta.env 由外部注入
  const src = read('web/src/pwa.js')
    .replace(/^export\s+/gm, '')
    .replace(/import\.meta\.env/g, '__env');
  sandbox.__env = { PROD: true };
  vm.runInContext(src + '\n;globalThis.__api = { registerPwa, applyPwaUpdate };', sandbox);
  return {
    api: sandbox.__api,
    registration,
    listeners,
    events,
    reloads: () => reloads,
    fire: (scope, type, arg) => (listeners[scope][type] || []).forEach((fn) => fn(arg)),
    setVisibility: (v) => { doc.visibilityState = v; },
  };
}

const tick = () => new Promise((r) => setTimeout(r, 0));
async function boot(ctx) {
  ctx.api.registerPwa();
  ctx.fire('window', 'load');
  await tick();
  await tick();
  return ctx;
}

test('前台：切回前景會主動 reg.update()；背景時不查', async () => {
  const ctx = await boot(loadPwa());
  assert.equal(ctx.listeners.document.visibilitychange?.length, 1, '要註冊 visibilitychange');
  ctx.setVisibility('hidden');
  ctx.fire('document', 'visibilitychange');
  assert.equal(ctx.registration.updates, 0, '在背景不應查更新');
  ctx.setVisibility('visible');
  ctx.fire('document', 'visibilitychange');
  await tick();
  assert.ok(ctx.registration.updates >= 1, '切回前景要 reg.update()');
  assert.equal(ctx.registration.updates, 1, '每切一次只查一次');
});

test('前台：偵測到新版即派發 UPDATE_EVENT；按下後 SKIP_WAITING，controllerchange 自動重載', async () => {
  const ctx = await boot(loadPwa());
  assert.ok(ctx.registration.listeners.updatefound?.length, '要監聽 updatefound');

  // 新版安裝完成（已安裝 → waiting），且已有 controller ⇒ 這是「更新」
  const installing = { state: 'installing', l: [], addEventListener(t, fn) { this.l.push(fn); } };
  ctx.registration.installing = installing;
  ctx.registration.listeners.updatefound.forEach((fn) => fn());
  installing.state = 'installed';
  installing.l.forEach((fn) => fn());
  assert.equal(ctx.events.filter((e) => e.type === 'scoutbook:update').length, 1, '要派發 UPDATE_EVENT 讓畫面彈提示');

  // 用戶按下「立即更新」
  ctx.registration.waiting = { messages: [], postMessage(m) { this.messages.push(m); } };
  await ctx.api.applyPwaUpdate();
  assert.deepEqual(
    ctx.registration.waiting.messages.map((m) => m.type),
    ['SKIP_WAITING'],
    '按下即 postMessage SKIP_WAITING',
  );
  assert.equal(ctx.reloads(), 0, '未 controllerchange 前不應先重載');

  // 新 SW 接管 → 自動 reload
  ctx.fire('sw', 'controllerchange');
  assert.equal(ctx.reloads(), 1, 'controllerchange 後要自動 location.reload()');
  // 重複觸發只 reload 一次
  ctx.fire('sw', 'controllerchange');
  assert.equal(ctx.reloads(), 1);
});

test('前台：首次安裝（無 controller）不應彈更新提示', async () => {
  const ctx = await boot(loadPwa({ controller: null }));
  const installing = { state: 'installing', l: [], addEventListener(t, fn) { this.l.push(fn); } };
  ctx.registration.installing = installing;
  ctx.registration.listeners.updatefound.forEach((fn) => fn());
  installing.state = 'installed';
  installing.l.forEach((fn) => fn());
  assert.equal(ctx.events.length, 0, '首次安裝不是更新，不應彈提示');
});
