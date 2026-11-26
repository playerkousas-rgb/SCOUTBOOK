import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

/**
 * 指定入口白名單（Store Gate）契約測試。
 *
 * 閘檔案 `web/public/store_gate_v1.0.js` 由治理真理倉
 * `playerkousas-rgb/readme` @ `6ebfdd72a1ea5a5e83df4a6644fc66d0236df98e`
 * 的 `templates/vercel/store_gate_v1.0.js` 原樣複製（與 VSBOOK 同一做法），
 * 只由 `web/index.html` 傳入 SCOUTBOOK 的設定，不在 App 內改動閘邏輯。
 */
const gateSource = fs.readFileSync('web/public/store_gate_v1.0.js', 'utf8');
const context = vm.createContext({ URL, console });
vm.runInContext(gateSource, context);
const gate = context.ScoutStoreGate;

// 與 web/index.html 的 initStoreGate 設定逐字對齊（改設定就要兩邊一齊改）
const OPTIONS = {
  appKey: 'scoutbook',
  mode: 'entry-gate',
  portalIds: ['appstore'],
  silentPortalIds: ['member'],
  allowStandalone: true,
  autoRedirectSeconds: 0,
};

function page(referrer = '', { pass = false, standalone = false } = {}) {
  const nodes = new Map();
  function element(tag) {
    const el = {
      tagName: tag,
      children: [],
      attributes: {},
      style: {},
      textContent: '',
      setAttribute(k, v) {
        this.attributes[k] = String(v);
      },
      getAttribute(k) {
        return this.attributes[k] || '';
      },
      appendChild(child) {
        this.children.push(child);
        if (child.id) nodes.set(child.id, child);
        return child;
      },
      removeChild(child) {
        this.children.splice(this.children.indexOf(child), 1);
      },
    };
    Object.defineProperty(el, 'firstChild', {
      get() {
        return this.children[0];
      },
    });
    return el;
  }
  const document = {
    referrer,
    documentElement: element('html'),
    head: element('head'),
    body: element('body'),
    createElement: element,
    getElementById: (id) => nodes.get(id) || null,
  };
  const values = new Map(pass ? [['scoutbook.store_pass', '1']] : []);
  const win = {
    document,
    location: { origin: 'https://scoutbook-five.vercel.app' },
    navigator: { serviceWorker: {} },
    matchMedia: () => ({ matches: standalone }),
    sessionStorage: {
      getItem: (key) => values.get(key) || null,
      setItem: (key, value) => values.set(key, value),
    },
  };
  win.self = win;
  win.top = win;
  return { document, win, values, nodes };
}

test('入口來源精確比對、靜默放行並保留工作階段', () => {
  // 唯一公開入口 = APP STORE；成員系統係唯一例外（靜默放行，唔畫掣）
  for (const [origin, id] of [
    ['https://scoutappstore.vercel.app/', 'appstore'],
    ['https://member-portal-sigma-swart.vercel.app/books', 'member'],
  ]) {
    const p = page(origin);
    const decision = gate.initStoreGate(OPTIONS, p.win);
    assert.equal(decision.allowed, true);
    assert.equal(decision.matchedPortalId, id);
    assert.equal(p.values.get('scoutbook.store_pass'), '1');
  }
  // 偽造前綴（appstore.vercel.app.evil.com）與未列入清單的入口一律攔截；
  // 圖書館唔再係放行來源：APP STORE 落架就真係「普通人都入唔到」（見 ADR 0005 §落架開關）
  for (const referrer of [
    '',
    'https://scoutappstore.vercel.app.evil.com/',
    'https://scout-district-portal.vercel.app/',
    'https://scout-circulars.vercel.app/',
  ]) {
    assert.equal(gate.evaluateStoreGate(OPTIONS, { referrer }).allowed, false);
  }
  assert.equal(gate.initStoreGate(OPTIONS, page('', { pass: true }).win).reason, 'session-pass');
  assert.equal(gate.initStoreGate(OPTIONS, page('', { standalone: true }).win).reason, 'standalone-pwa');
});

test('儲存遭封鎖時入口仍可進入，但不能保證重整通行', () => {
  const p = page('https://scoutappstore.vercel.app/');
  Object.defineProperty(p.win, 'sessionStorage', {
    get() {
      throw new Error('blocked');
    },
  });
  assert.equal(gate.initStoreGate(OPTIONS, p.win).allowed, true);
  const next = page();
  Object.defineProperty(next.win, 'sessionStorage', {
    get() {
      throw new Error('blocked');
    },
  });
  assert.equal(gate.initStoreGate(OPTIONS, next.win).allowed, false);
});

test('直接開啟顯示單一主站按鈕且不暴露底層', () => {
  const p = page();
  assert.equal(gate.initStoreGate(OPTIONS, p.win).allowed, false);
  assert.equal(p.document.documentElement.getAttribute('data-store-gated'), 'missing-whitelist-entry');
  const overlay = p.nodes.get('scoutStoreGate');
  assert.equal(overlay.attributes.role, 'dialog');
  const actions = overlay.children.find((child) => child.className === 'sg-actions');
  // SG19：圖書館／成員系統靜默放行，唔畫掣 → 只剩 APP STORE 一粒
  assert.equal(actions.children.length, 1);
  assert.equal(actions.children[0].href, 'https://scoutappstore.vercel.app/');
  assert.equal(actions.children[0].target, '_top');
  assert.match(p.nodes.get('scoutStoreGateStyle').textContent, /body > :not\(#scoutStoreGate\).*display: none !important/);

  // 檔嘅係一般用家：卡上自訂文案要即刻講清楚「紀錄冇被刪」，中英分開
  const q = page();
  gate.initStoreGate({ ...OPTIONS, customTitle: 'T', customMessage: 'M' }, q.win);
  const custom = q.nodes.get('scoutStoreGate');
  assert.equal(custom.children[1].textContent, 'T');
  assert.equal(custom.children[2].textContent, 'M');
});

test('閘放在 HTML head、隨 PWA 離線快取，並避開 SPA rewrite', () => {
  const html = fs.readFileSync('web/index.html', 'utf8');
  assert.ok(html.indexOf('<meta charset=') < html.indexOf('<script src="/store_gate_v1.0.js">'));
  assert.ok(html.indexOf('<script src="/store_gate_v1.0.js">') < html.indexOf('<title>'));
  assert.match(html, /appKey: 'scoutbook'/);
  assert.match(html, /mode: localDev \? 'open' : 'entry-gate'/);
  // 本機開發唔可以被自己的閘擋住（localhost／127.0.0.1 直接開放）
  assert.match(html, /\/\^\(localhost\|127\\\.0\\\.0\\\.1\|\\\[::1\\\]\)\$\//);
  assert.match(html, /portalIds: \['appstore'\],[\s\S]{0,400}?silentPortalIds: \['member'\]/);
  // 成員系統只放行、唔宣傳：index.html 唔可以出現成員系統網址或名稱（卡上亦唔會有第二粒掣）
  assert.equal(/member-portal/.test(html), false);
  assert.equal(/圖書館|通告圖書館/.test(html), false);
  // 圖書館唔係放行來源：落架開關要「APP STORE 一落架，普通人都入唔到」
  assert.equal(/['"]library['"]/.test(html), false);
  assert.match(html, /allowStandalone: true/);
  // 一般用家版本：白名單卡要即時安撫「紀錄唔會冇咗」，中英分開、唔並排
  assert.match(html, /customTitle: en \? 'Open this app from SCOUT APP STORE' : '需經由 SCOUT APP STORE 開啟'/);
  assert.match(html, /紀錄不會被刪除/);
  assert.match(html, /not deleted/);
  // 前端零寫死入口網址（一律由治理倉註冊表提供）
  const initBlock = html.slice(html.indexOf('initStoreGate({'), html.indexOf('</script>', html.indexOf('initStoreGate({')));
  assert.equal(/https?:\/\//.test(initBlock), false);
  const sw = fs.readFileSync('web/public/sw.js', 'utf8');
  assert.match(sw, /'\/store_gate_v1\.0\.js'/);
  assert.match(fs.readFileSync('web/src/main.jsx', 'utf8'), /!document\.documentElement\.hasAttribute\('data-store-gated'\)/);
  const rewrite = JSON.parse(fs.readFileSync('vercel.json', 'utf8')).rewrites[0].source;
  const regex = new RegExp('^' + rewrite + '$');
  // 閘檔案必須由靜態檔提供，唔可以被 SPA rewrite 吞成 index.html
  assert.equal(regex.test('/store_gate_v1.0.js'), false);
  assert.equal(regex.test('/p/p001'), true);
});

test('支持連結使用已核實 slug、失敗隱藏並且列印不顯示', () => {
  // slug 對照主站 migration 20261116-app-slug-seed.sql：scoutbook-five.vercel.app → scoutbook
  assert.equal(gate.getAppStoreUrl('scoutbook'), 'https://scoutappstore.vercel.app/?app=scoutbook');
  const component = fs.readFileSync('web/src/components/StoreSupport.jsx', 'utf8');
  assert.match(component, /helper\('scoutbook'\)/);
  assert.match(component, /hidden={!href}/);
  assert.match(component, /target="_blank"[\s\S]{0,40}rel="noopener"/);
  // 子 App 嚴禁直連主站 Supabase／自行呼叫統計函式
  assert.equal(/supabase|bump_hearts|bump_stars|anon/i.test(component), false);
  assert.ok(fs.readFileSync('web/src/App.jsx', 'utf8').includes('<StoreSupport />'));
  assert.ok(fs.readFileSync('web/src/pages/Welcome.jsx', 'utf8').includes('<StoreSupport onPaper />'));
  const css = fs.readFileSync('web/src/styles.css', 'utf8');
  assert.match(css, /\.store-support\[hidden\]\s*\{\s*display:\s*none/);
  assert.match(css, /@media print\s*\{\s*\.store-support\s*\{\s*display:\s*none/);
});

test('閘檔案保持治理倉原樣（唔改閘邏輯，只改 App 設定）', () => {
  // 由治理倉 templates/vercel/store_gate_v1.0.js 原樣複製；版本字串留在檔案內
  assert.match(gateSource, /const VERSION = 'v1\.0';/);
  assert.match(gateSource, /const PORTAL_REGISTRY = Object\.freeze\(/);
  // 五個官方入口的 Origin 全部由真理倉維護，App 唔准自行加減
  assert.deepEqual([...gate.PORTAL_IDS], ['appstore', 'library', 'member', 'district', 'gemini']);
  // SCOUTBOOK 係 BOOK 類：唔可以用 iframe-only（會令已裝主畫面用戶被踢走）
  assert.equal(/mode: 'iframe-only'/.test(fs.readFileSync('web/index.html', 'utf8')), false);
  // 閘只係前端導流，唔可以當安全邊界：文件要講明
  const readme = fs.readFileSync('README.md', 'utf8');
  // 用戶定案：擋一般用家，唔係擋技術人員（唔可以日後偷偷改寫成「防線」）
  assert.ok(readme.includes('不是身份驗證或安全邊界'));
  assert.ok(readme.includes('擋**一般用家**'));
  assert.ok(readme.includes('唔係擋技術人員'));
  const adr = fs.readFileSync('docs/adr/0005-entry-gate-whitelist.md', 'utf8');
  assert.ok(adr.includes('擋一般用家，唔係擋技術人員'));
  // 落架開關：APP STORE 落架 → 普通人入唔到；成員系統係唯一安靜例外
  assert.ok(adr.includes('落架開關：APP STORE 一落架，普通人就入唔到'));
  assert.ok(adr.includes('卡上永不顯示'));
  assert.ok(readme.includes('落架開關（呢個閘存在的理由）'));
  assert.ok(readme.includes('由通告圖書館、區管理系統等其他網站進入 | 不放行'));
  assert.ok(adr.includes('fail-open'));
  // 唔准為咗「防技術人員」加後端驗票／反調試
  assert.equal(/\/api\/enter/.test(readme), false);
  assert.ok(readme.includes('store_gate_v1.0.js'));
});
