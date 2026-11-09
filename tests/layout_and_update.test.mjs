import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_VERSION, BADGE_SYLLABUS, OTHER_BADGES, demoBook, newBook } from '../shared/book.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

/* 量真實內容：全書每一個「名稱欄」的最長字數。
   數字本身就是欄寬的依據 —— 不照 PDF 比例、不憑感覺。 */
const width = (s) => [...String(s || '')].length;
const items = [];
const segments = [];
const badges = [];
for (const badge of BADGE_SYLLABUS) {
  badges.push(badge.name);
  for (const seg of badge.segments || []) {
    segments.push(seg.name);
    for (const item of seg.items || []) items.push(item.name);
  }
}
const activityBadges = OTHER_BADGES.map((b) => b.name);
const max = (arr) => Math.max(...arr.map(width));
const median = (arr) => {
  const a = [...arr.map(width)].sort((x, y) => x - y);
  return a[Math.floor(a.length / 2)];
};

test('欄寬量度：先量真實最長內容（進度項目 20 字／活動徽章 8 字／範疇 4 字）', () => {
  assert.equal(max(items), 20, '進度項目名最長應為 20 字（B2 科學、科技、工程、藝術、數學及創意）');
  assert.equal(median(items), 7, '進度項目名中位數 7 字');
  assert.ok(max(segments) <= 12, `範疇／分段名不應超過 12 字，實測 ${max(segments)}`);
  assert.ok(max(activityBadges) <= 10, `活動徽章名不應超過 10 字，實測 ${max(activityBadges)}`);
  assert.ok(max(badges) <= 8, `獎章名不應超過 8 字，實測 ${max(badges)}`);
  // 名稱欄只需 40–50% 闊度即可放得下最長內容 → 表格欄寬據此而定
  assert.ok(max(items) < 24, '沒有超長名稱需要獨佔半版');
});

test('欄寬：名稱欄不得以 minmax(0, 1fr) 獨佔餘下全部闊度', () => {
  const css = read('web/src/styles.css');
  // 三欄簽核表（項目｜主考｜日期）與活動徽章表的舊寫法必須絕跡
  assert.equal(css.includes('minmax(0, 1fr) 92px 96px'), false, '活動徽章表仍有 minmax(0, 1fr) ＋ 92／96px 舊欄寬');
  assert.equal(css.includes('minmax(0, 1fr) 128px 118px'), false, '細項表仍有 minmax(0, 1fr) ＋ 128／118px 舊欄寬');
  assert.equal(css.includes('minmax(0, 1fr) 96px 104px 26px'), false, '專科徽章表仍有舊欄寬');

  // 名稱欄必須是 minmax(clamp(下限, 百分比, 上限), 比例fr)
  assert.match(css, /\.asstable\s*\{[^}]*--cols:\s*minmax\(clamp\(\d+px, 4[0-9]%, \d+px\), [\d.]+fr\)/, '細項表名稱欄要用 minmax(clamp(下限, 40–49%, 上限), 比例fr)');
  // 名稱欄必須有上限，才會把多出的闊度還給主考／日期
  assert.match(css, /\.asstable\s*\{[^}]*--cols:\s*minmax\(clamp\(152px, 40%, 280px\)/, '名稱欄上限 280px（實測最長 20 字，超出即浪費）');
  assert.match(css, /\.otrow\s*\{[^}]*minmax\(clamp\(\d+px, 4[0-9]%, \d+px\), [\d.]+fr\)/, '活動徽章表名稱欄要用 minmax(clamp(…), fr)');
  assert.match(css, /\.pgtable__row\s*\{[^}]*minmax\(clamp\(132px, 42%, 260px\), 1\.15fr\)/, '通用表格預設名稱欄要用 minmax(clamp(…), fr)');
});

test('欄寬：日期欄下限 ≥ 104px（放得下完整 YYYY-MM-DD 連日曆鈕）', () => {
  const css = read('web/src/styles.css');
  const token = css.match(/--col-date-min:\s*(\d+)px/);
  assert.ok(token, 'styles.css 需定義 --col-date-min 欄寬下限');
  assert.ok(Number(token[1]) >= 104, `日期欄下限 ${token[1]}px 太窄，原生日曆輸入需 ≥104px`);
  // 日期輸入本身亦不得被壓縮
  assert.match(css, /\.write__date\s*\{[^}]*min-width:\s*var\(--col-date-min\)/, '日期輸入框需有 min-width: var(--col-date-min)');
  // 所有表身日期欄都要用到這個下限
  for (const rule of ['.asstable', '.otrow', '.pgtable__row']) {
    assert.ok(css.includes('var(--col-date-min)'), '日期欄要共用 --col-date-min');
  }
  // 舊版的日期欄下限是裸 px（58／72／82px）；現在一律要經 --col-date-min
  assert.ok(
    !/grid-template-columns:\s*(minmax\(\s*)?(58|62|72|82)px/.test(css),
    '不得再出現 58–82px 的日期欄舊下限（要改用 var(--col-date-min)）',
  );
  assert.ok(!/,\s*(58|72|82)px(\s*,\s*(58|72|82)px)?\s*;/.test(css), '表格欄寬不得硬寫 58／72／82px');
});

test('欄寬：簽署欄只按姓名計寬，簽署視窗不預填職銜，示範資料只有純姓名', () => {
  const ink = read('web/src/components/Ink.jsx');
  const paper = read('web/src/pages/PaperBook.jsx');
  for (const rel of [
    'web/src/components/AwardBlock.jsx',
    'web/src/components/Form.jsx',
    'web/src/components/OtherBadgeTable.jsx',
    'web/src/components/SignoffPanel.jsx',
  ]) {
    assert.equal(read(rel).includes('defaultTitle'), false, `${rel} 仍預填職銜（簽署只寫名字）`);
  }
  assert.equal(paper.includes('defaultTitle'), false, 'PaperBook 仍預填職銜');
  assert.ok(ink.includes('export function SignatureBlock({ label, en, value, onChange, defaultName = \'\' })'), 'SignatureBlock 不應再收 defaultTitle');
  // 簽署欄寬度以姓名為準（clamp 下限 96px，不預留「姓名＋職銜」）
  const css = read('web/src/styles.css');
  assert.match(css, /\.asstable\s*\{[^}]*minmax\(clamp\(96px, 2[0-9]%, 2[0-9]{2}px\), [\d.]+fr\)/, '主考欄應按姓名計寬（clamp 96px 起）');
  // 示範資料人名只放純姓名，不帶職銜
  const demo = demoBook();
  for (const name of [demo.member.sl, demo.pages.award_L1.presentedBy, demo.renewals[0].leaderName]) {
    assert.equal(/團長|領袖|SL|Assessor|Scout Leader/.test(name), false, `示範資料人名不應含職銜：${name}`);
  }
});

test('欄寬：表頭與表身共用同一組 grid-template-columns', () => {
  const css = read('web/src/styles.css');
  // 細項表：表頭與表身同一條規則
  assert.match(css, /\.asstable__head,\s*\n\.assrow\s*\{[^}]*grid-template-columns:\s*var\(--cols\)/, '表頭與表身必須共用 var(--cols)');
  const form = read('web/src/components/Form.jsx');
  assert.match(form, /export function columnTemplate\(/, 'Rows 需以 columnTemplate() 產生單一欄寬模板');
  assert.match(form, /const rowStyle = \{ '--cols': template \};/, '表頭與表身使用同一個 rowStyle');
  assert.equal((form.match(/style=\{rowStyle\}/g) || []).length, 2, '表頭與表身各用一次 rowStyle（共兩次）');
  // 續期／紀錄表同樣是 grid + 共用 --cols
  assert.match(css, /\.renewtable__head,\s*\n\.renewrow\s*\{[^}]*grid-template-columns:\s*var\(--cols/, '續期表表頭與表身要共用 var(--cols)');
  assert.equal(css.includes('.pgtable__row--'), false, '不應再靠 row--N class 分別設定欄數');
});

test('欄寬：兩行制的資料標籤齊備（否則展開後欄位無標題）', () => {
  const ot = read('web/src/components/OtherBadgeTable.jsx');
  assert.match(ot, /className="otrow__date" data-label=/, '活動徽章日期欄需 data-label');
  assert.match(ot, /className="otrow__cert" data-label=/, '活動徽章證書欄需 data-label');
  for (const rel of ['web/src/components/AwardBlock.jsx', 'web/src/components/Form.jsx']) {
    const src = read(rel);
    assert.match(src, /className="assrow__init" data-label=/, `${rel} 主考欄需 data-label`);
    assert.match(src, /className="assrow__date" data-label=/, `${rel} 日期欄需 data-label`);
  }
});

test('欄寬：簽名圖同時限寬限高', () => {
  const css = read('web/src/styles.css');
  for (const sel of ['.assrow__sigbtn img', '.otrow__sig img', '.renewrow__sigarea img', '.sigblock__preview img']) {
    const re = new RegExp(`${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{[^}]*max-width:\\s*100%`);
    assert.match(css, re, `${sel} 需要 max-width: 100%（只限高會越出欄外壓住鄰欄）`);
  }
  assert.match(css, /\.write--date \.write__zoom\s*\{\s*display:\s*none/, '窄欄不顯示會遮住文字的浮動小按鈕');
});

test('欄寬：窄欄斷點段放在樣式表末端（否則會被後面的桌面規則蓋過）', () => {
  const css = read('web/src/styles.css');
  const narrow = css.indexOf('窄欄（斷點分段，不用 container query）');
  const desktop = css.indexOf('.assrow { display: grid; grid-template-columns: var(--cols');
  const desktopOt = css.indexOf('.otrow { display: grid;');
  assert.ok(narrow > desktop && narrow > desktopOt, '斷點段必須排在三欄表桌面規則之後，否則 { display: none } 與覆寫會失效');
  assert.match(css.slice(narrow), /@media \(max-width: 820px\)/, '斷點值 820px（涵蓋手機全寬與矮桌面視窗）');
});

test('欄寬：禁止 container-type／container query 量度頁闊', () => {
  const css = read('web/src/styles.css');
  assert.equal(/container-type\s*:/.test(css), false, 'styles.css 不得用 container-type（會困住 position: fixed 彈窗）');
  assert.equal(/@container/.test(css), false, 'styles.css 不得用 container query');
  const stack = ['web/src/App.jsx', 'web/src/pages/PaperBook.jsx', 'web/src/components/Form.jsx'];
  for (const rel of stack) {
    const src = read(rel);
    assert.equal(src.includes('containerType'), false, `${rel} 不得設定 containerType`);
  }
});

test('自動更新：四處版本號同步（package.json／APP_VERSION／index.html／SW 快取名）', () => {
  const pkg = JSON.parse(read('package.json'));
  const html = read('web/index.html');
  const sw = read('web/public/sw.js');
  assert.equal(APP_VERSION, `v${pkg.version}`, 'APP_VERSION 必須等於 package.json 版號');
  assert.ok(html.includes(`content="${APP_VERSION}"`), 'index.html meta app-version 未同步');
  assert.ok(html.includes(`window.APP_VERSION = '${APP_VERSION}'`), 'index.html window.APP_VERSION 未同步');
  const cache = sw.match(/const CACHE_NAME = 'scoutbook-cache-v(\d+)'/);
  assert.ok(cache, 'SW 需有 CACHE_NAME 版本尾碼');
  assert.ok(Number(cache[1]) >= 3, 'SW 快取名必須遞增（v2 → v3 起），只改程式不改快取名用戶永遠收舊版面');
  assert.ok(!html.includes('v2.0.'), 'index.html 仍殘留舊版號');
});

test('自動更新：切回前景主動 reg.update()、SKIP_WAITING、controllerchange 自動重載', () => {
  const pwa = read('web/src/pwa.js');
  assert.match(pwa, /document\.addEventListener\('visibilitychange'/, '需監聽 visibilitychange');
  assert.match(pwa, /reg\.update\(\)\.catch/, '切回前景要主動 reg.update()');
  assert.match(pwa, /visibilit(y|yState)/, '需判斷可見性');
  assert.match(pwa, /type: 'SKIP_WAITING'/, '按下更新要 postMessage SKIP_WAITING');
  assert.match(pwa, /addEventListener\('controllerchange'/, '需監聽 controllerchange');
  assert.match(pwa, /window\.location\.reload\(\)/, 'controllerchange 後要自動 reload');
  assert.match(pwa, /updateViaCache: 'none'/, '註冊 SW 時要 updateViaCache: none，避免 HTTP cache 令更新永遠查不到');
  // SW 端要真的處理 SKIP_WAITING
  assert.match(read('web/public/sw.js'), /event\.data\.type === 'SKIP_WAITING'\) self\.skipWaiting\(\)/, 'SW 需回應 SKIP_WAITING');
  // 前台要有更新提示
  const app = read('web/src/App.jsx');
  assert.match(app, /updateReady &&/, 'App 需顯示更新提示');
  assert.match(app, /applyPwaUpdate\(\)/, '提示按鈕要呼叫 applyPwaUpdate()');
  assert.ok(app.includes('毋須刪除或重裝'), '提示要說明用戶不用刪除／重裝 APP');
});

test('示範資料仍可用（改名後不破 JSON 契約）', () => {
  const book = demoBook();
  assert.equal(typeof book.member.sl, 'string');
  assert.ok(book.renewals.length > 0);
  const blank = newBook();
  assert.ok(blank.member);
});
