import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import {
  ALL_AWARDS,
  OTHER_BADGES,
  PRINT_PAGES,
  allStats,
  badgeStats,
  demoBook,
  exportForBadge,
  newBook,
  toBadgeId,
} from '../shared/book.js';
import { FORM_META, buildFormValues, formReadiness } from '../shared/forms.js';
import { applySignoff, decodePayload, decodeTransfer, encodeSignoff, encodeTransfer } from '../shared/transfer.js';
import {
  BRIDGE_ENDPOINT,
  DEFAULT_SCOUTBADGE_URL,
  TROOP_NOT_FOUND,
  isBadgeProgressFile,
  isBookBackupFile,
  pickTroopId,
  probeScoutBadgeBridge,
  safeBadgeOrigin,
  sortTroopEntries,
} from '../web/src/scoutbadgeBridge.js';

const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8');

/** web/src 之下全部 .js／.jsx 原始檔（相對於倉庫根目錄）。 */
function listWebSources(rel = 'web/src') {
  const out = [];
  for (const entry of readdirSync(new URL(`../${rel}/`, import.meta.url), { withFileTypes: true })) {
    const child = `${rel}/${entry.name}`;
    if (entry.isDirectory()) out.push(...listWebSources(child));
    else if (/\.jsx?$/.test(entry.name)) out.push(child);
  }
  return out;
}

/** 由 `const name = ` 起，到該函式結尾（縮排兩格的 `};`）為止的原始碼。 */
function functionSource(src, name) {
  const start = src.indexOf(`const ${name} = `);
  assert.ok(start >= 0, `找不到 ${name}`);
  const end = src.indexOf('\n  };\n', start);
  assert.ok(end > start, `找不到 ${name} 的結尾`);
  return src.slice(start, end);
}

const jsonRes = (body, { ok = true, status = 200, type = 'application/json; charset=utf-8' } = {}) => ({
  ok,
  status,
  headers: { get: (k) => (k.toLowerCase() === 'content-type' ? type : null) },
  json: async () => body,
});

test('BOOK 核心功能完全不需要 BADGE：無網絡亦能建立、填寫、統計、出表、簽名、備份', async () => {
  // 1. 建立完全空白的紀錄冊（第 1 頁也是空白）
  const book = newBook();
  assert.equal(book.member.nameZh, '');
  assert.equal(book.member.scoutId, '');

  // 2. 只靠本機輸入，逐項記錄進度（模擬使用者自行填寫 + 領袖當面簽名）
  book.member = { ...book.member, nameZh: '陳小鷹', nameEn: 'CHAN Siu-ying', dob: '2013-04-12', scoutId: '0012345678' };
  book.progress['L1-M1'] = { date: '2026-09-05', assessor: '李團長' };
  book.progress['L1-M2'] = { date: '2026-09-12', assessor: '李團長' };
  book.progress['L2-A1'] = { date: '2026-10-03', assessor: '李團長' };
  book.otherBadges['SC-PUR-001'] = { date: '2026-10-10', cert: 'PUR/2026/0102' };
  book.pages.award_L1 = { date: '2026-09-19', certNo: 'MB/2026/0111', presentedBy: '李團長' };

  // 3. 統計即時反映，不依賴任何雲端
  const stats = allStats(book);
  assert.equal(stats.done, 3);
  assert.equal(stats.activityBadges, 1);
  assert.equal(stats.earned, 1);
  assert.equal(badgeStats(book, 'L1').percent, Math.round((2 / 11) * 100));
  assert.equal(stats.awards.find((a) => a.award.id === 'L4').percent, 0);

  // 4. 官方表格自動帶入（PT/18、P120A1、P120A2）
  const v = buildFormValues(book, 'pt18');
  assert.equal(v.nameZh, '陳小鷹');
  assert.equal(v.scoutId, '0012345678');
  const r = formReadiness(book, 'pt18');
  assert.ok(r.missing.includes('性別'), '未填性別時應如實回報缺漏，而不是假裝齊備');
  book.member.gender = 'M';
  book.member.troop = '沙田第 12 旅童軍團';
  book.member.group = '沙田第 12 旅';
  book.member.district = '沙田北區';
  book.member.region = '新界東地域';
  assert.equal(formReadiness(book, 'pt18').ready, true);
  assert.equal(Object.values(FORM_META).every((m) => m.official === false || m.pages > 0), true);

  // 5. 二維碼出示／領袖核簽回傳，全程離線
  const code = await encodeTransfer(book, ['particulars', 'progress']);
  assert.match(code.value, /^SB1/);
  const decoded = await decodeTransfer(code.value);
  assert.equal(decoded.member.nameZh, '陳小鷹');
  assert.equal(decoded.progress['L1-M1'].date, '2026-09-05');

  const signoff = await encodeSignoff({
    member: book.member,
    leader: { name: '李團長', title: '童軍團長 SL' },
    items: [{ id: 'L2-A2', date: '2026-10-17' }],
    otherBadges: [],
  });
  assert.match(signoff.value, /^SB1S\./);
  const applied = applySignoff(book, await decodePayload(signoff.value));
  assert.equal(applied.book.progress['L2-A2'].date, '2026-10-17');
  assert.equal(applied.book.progress['L2-A2'].assessor, '李團長');
  // 本地簽名不等於 scoutbadge 已核實，這個欄位永遠不會被離線流程寫成 true
  assert.equal(applied.book.progress['L2-A2'].confirmedByBadge ?? false, false);

  // 6. 整本列印頁序固定 110 頁，附錄不列印
  assert.equal(PRINT_PAGES.length, 110);
  assert.deepEqual(PRINT_PAGES.map((p) => p.id).slice(0, 3), ['p001', 'p002', 'p003']);

  // 7. 備份／還原（純 JSON，經 localStorage 或檔案）
  const backup = JSON.parse(JSON.stringify(book));
  assert.equal(backup.progress['L2-A1'].date, '2026-10-03');
  assert.equal(backup.otherBadges['SC-PUR-001'].cert, 'PUR/2026/0102');
});

test('probeScoutBadgeBridge：純靜態部署／404／HTML fallback／壞 payload／逾時 一律安全降級', async () => {
  // 正常伺服器
  let probed = null;
  const ok = await probeScoutBadgeBridge({
    fetchImpl: async (url, init) => {
      probed = { url, init };
      return jsonRes({ success: true, origin: 'https://scoutbadge.vercel.app', upstreamOk: true, troops: { T12: { name: '沙田第 12 旅' } } });
    },
  });
  assert.equal(ok.available, true);
  assert.equal(ok.origin, 'https://scoutbadge.vercel.app');
  assert.equal(ok.upstreamOk, true);
  assert.equal(ok.troops.T12.name, '沙田第 12 旅');
  assert.equal(probed.url, '/api/scoutbadge', '只探測同源橋接，瀏覽器不直接接觸 scoutbadge');
  assert.equal(probed.init.cache, 'no-store');

  // 橋接存在，但暫時讀不到 scoutbadge 的已登記旅團清單：仍算可用，並如實回報
  const emptyUp = await probeScoutBadgeBridge({
    fetchImpl: async () => jsonRes({ success: true, upstreamOk: false, troops: {} }),
  });
  assert.equal(emptyUp.available, true);
  assert.equal(emptyUp.upstreamOk, false);
  assert.equal(emptyUp.origin, 'https://scoutbadge.vercel.app', '橋接沒有回報來源時，開戶連結用預設網址');
  assert.deepEqual(emptyUp.troops, {});

  // 舊版橋接沒有 upstreamOk 欄位：未明確回報失敗即視為已讀到清單
  const legacy = await probeScoutBadgeBridge({
    fetchImpl: async () => jsonRes({ success: true, origin: 'https://scoutbadge.vercel.app', troops: {} }),
  });
  assert.equal(legacy.upstreamOk, true);

  // 橋接回報的來源不是 https（例如本機測試位址）：開戶連結一律退回預設網址
  const local = await probeScoutBadgeBridge({
    fetchImpl: async () => jsonRes({ success: true, origin: 'http://127.0.0.1:8787', troops: {} }),
  });
  assert.equal(local.origin, 'https://scoutbadge.vercel.app');

  // troops 不是物件（陣列）＝不是橋接介面
  const arr = await probeScoutBadgeBridge({ fetchImpl: async () => jsonRes({ success: true, troops: [] }) });
  assert.deepEqual(arr, { available: false, reason: 'bad-payload' });

  // 靜態主機：SPA rewrite 回 200 text/html
  const html = await probeScoutBadgeBridge({ fetchImpl: async () => jsonRes(null, { type: 'text/html; charset=utf-8' }) });
  assert.deepEqual(html, { available: false, reason: 'not-json' });

  // 404（例如只部署 dist、沒有 serverless function）
  const missing = await probeScoutBadgeBridge({ fetchImpl: async () => jsonRes(null, { ok: false, status: 404 }) });
  assert.equal(missing.available, false);
  assert.equal(missing.reason, 'http-404');

  // 有 JSON 但不是橋接介面
  const wrong = await probeScoutBadgeBridge({ fetchImpl: async () => jsonRes({ error: 'nope' }) });
  assert.deepEqual(wrong, { available: false, reason: 'bad-payload' });

  // 離線／DNS 失敗
  const offline = await probeScoutBadgeBridge({
    fetchImpl: async () => {
      throw new TypeError('Failed to fetch');
    },
  });
  assert.deepEqual(offline, { available: false, reason: 'network' });

  // 沒有 fetch（極端環境）
  assert.deepEqual(await probeScoutBadgeBridge({ fetchImpl: null }), { available: false, reason: 'no-fetch' });

  // 逾時：AbortController 生效
  const slow = await probeScoutBadgeBridge({
    timeoutMs: 20,
    fetchImpl: (url, init) =>
      new Promise((resolve, reject) => {
        init.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
      }),
  });
  assert.deepEqual(slow, { available: false, reason: 'timeout' });
});

test('同步卡純函式：開戶連結只接受 https、旅團排序固定、不代選旅團、備份檔與進度檔分類', () => {
  assert.equal(BRIDGE_ENDPOINT, '/api/scoutbadge');
  assert.equal(DEFAULT_SCOUTBADGE_URL, 'https://scoutbadge.vercel.app');
  assert.equal(TROOP_NOT_FOUND, '__NOT_FOUND__');

  // 「前往 scoutbadge 開戶」連結：只接受 https 來源，其餘一律退回預設網址
  assert.equal(safeBadgeOrigin('https://scoutbadge.vercel.app/some/path?q=1#top'), 'https://scoutbadge.vercel.app');
  assert.equal(safeBadgeOrigin('  https://badge.example.org:8443/  '), 'https://badge.example.org:8443');
  for (const bad of [
    undefined,
    null,
    '',
    42,
    {},
    'not a url',
    '//evil.example',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'ftp://scoutbadge.vercel.app',
    'http://scoutbadge.vercel.app',
    'http://127.0.0.1:8787',
    'https://user:pw@evil.example',
  ]) {
    assert.equal(safeBadgeOrigin(bad), 'https://scoutbadge.vercel.app', `不安全的來源 ${String(bad)} 必須退回預設網址`);
  }

  // 旅團選單次序：純數字編號按數值由小至大，其後為英數編號；編號本身逐字保留
  const named = (ids) => Object.fromEntries(ids.map((id) => [id, { name: `第 ${id} 旅` }]));
  const live = named(['1187', '0004', '0008', '0013', '0042', '0060', '0082']);
  const idsOf = (troops) => sortTroopEntries(troops).map(([id]) => id);
  assert.deepEqual(idsOf(live), ['0004', '0008', '0013', '0042', '0060', '0082', '1187']);
  assert.deepEqual(idsOf(named(['T99', 'A1', '82', '0082', '10', '9', '012'])), ['9', '10', '012', '0082', '82', 'A1', 'T99']);
  assert.deepEqual(
    idsOf(named(['100000000000000000001', '100000000000000000000', '99'])),
    ['99', '100000000000000000000', '100000000000000000001'],
    '長編號不可轉成數字比較（會失準）',
  );
  assert.deepEqual(sortTroopEntries(live)[5], ['0082', { name: '第 0082 旅' }], '排序只改次序，不改編號與內容');
  assert.deepEqual(idsOf({ X: null, Y: 'text', Z: { name: 'Z' } }), ['Z'], '不是物件的條目不列入選單');
  for (const junk of [null, undefined, [], 'troops', 7]) assert.deepEqual(sortTroopEntries(junk), []);

  // 重新讀取清單後的預設選擇：有多個旅團時必須由用戶自己揀
  assert.equal(pickTroopId('', live), '', '多個旅團：不代選第一個');
  assert.equal(pickTroopId(undefined, live), '');
  assert.equal(pickTroopId('0082', live), '0082', '之前的選擇仍在清單：保留');
  assert.equal(pickTroopId('9999', live), '', '之前的選擇已不在清單：清空');
  assert.equal(pickTroopId('82', live), '', '82 不等於 0082：逐字比對，不補零');
  assert.equal(pickTroopId(TROOP_NOT_FOUND, live), '', '剛選了「找不到旅團」：重新讀取後留空再揀');
  assert.equal(pickTroopId('', named(['0082'])), '0082', '只有一個已登記旅團：直接選取');
  assert.equal(pickTroopId('9999', named(['0082'])), '0082');
  assert.equal(pickTroopId('MANUAL', {}), 'MANUAL', '清單為空：保留手動輸入的編號');
  assert.equal(pickTroopId(TROOP_NOT_FOUND, {}), '', '「找不到旅團」選項值永不當作旅團編號');

  // 檔案分類：完整備份（member＋pages）與 scoutbadge 進度檔必須分得清
  const book = JSON.parse(JSON.stringify(demoBook()));
  assert.equal(isBookBackupFile(book), true);
  assert.equal(isBookBackupFile(JSON.parse(JSON.stringify(newBook()))), true, '空白冊的備份亦是完整備份');
  assert.equal(isBadgeProgressFile(book), false, '完整備份內亦有 progress／otherBadges，但不算進度檔');

  const pendingFile = JSON.parse(JSON.stringify(exportForBadge(demoBook(), '0082')));
  assert.equal(isBookBackupFile(pendingFile), false);
  assert.equal(isBadgeProgressFile(pendingFile), true, '同步卡匯出的「待領袖核實」申報檔是進度檔');
  for (const progressFile of [
    { success: true, progress: { '0012345678': { 'L1-M1': '2026-09-05' } } },
    { flatProgress: { '0012345678': {} } },
    { otherBadges: { '0012345678': {} } },
    { pendingProgress: {} },
    { pendingRequests: [] },
    { members: [] },
    { schema: 'scoutbadge.pending.v1' },
  ]) {
    assert.equal(isBadgeProgressFile(progressFile), true, `${JSON.stringify(progressFile)} 應判定為 scoutbadge 進度檔`);
    assert.equal(isBookBackupFile(progressFile), false);
  }
  for (const junk of [null, undefined, 'text', 42, [], [{ progress: {} }], {}, { hello: 'world' }, { member: {} }, { pages: {} }]) {
    assert.equal(isBookBackupFile(junk), false, `${JSON.stringify(junk)} 不是完整備份`);
    assert.equal(isBadgeProgressFile(junk), false, `${JSON.stringify(junk)} 不是進度檔`);
  }
});

test('數位附錄把 scoutbadge 標示為「可選」；未連接前鎖定進度檔匯出匯入，找不到旅團可前往開戶', () => {
  const card = read('web/src/components/ScoutBadgeSyncCard.jsx');
  assert.ok(card.includes('probeScoutBadgeBridge'));
  assert.ok(card.includes('獨立模式') && card.includes('standalone mode'));
  assert.ok(card.includes('不連接亦可用完整紀錄冊'));
  assert.ok(card.includes('exportForBadge') && card.includes('importFromBadge'), '已連接時保留進度檔匯出／匯入');
  assert.ok(card.includes("push(isEn ? 'Signed out of scoutbadge'"), '登出只影響雲端連線，不影響本機資料');

  // 鎖定（介面）：匯出／匯入按鈕連同檔案輸入框只存在於已連接分支；未連接時改為顯示鎖定提示
  assert.match(
    card,
    /\{session \? \(\s*<div className="appxbtns scoutsync__files">[\s\S]*?<input ref=\{fileRef\} type="file"[\s\S]*?\) : \(\s*<div className="scoutsync__locked">/,
    '未連接 scoutbadge 前不可顯示進度檔匯出／匯入按鈕',
  );
  assert.equal(card.match(/type="file"/g).length, 1, '同步卡只可有一個檔案輸入框，而且必須在已連接分支內');
  assert.equal(card.match(/scoutsync__files/g).length, 1);
  assert.ok(card.includes('未連接 scoutbadge 前不可匯出或匯入 scoutbadge 進度檔'));
  assert.ok(card.includes('完整紀錄冊備份與換機轉移'), '鎖定提示必須指出完整備份仍可離線使用');

  // 鎖定（邏輯）：處理函式本身先檢查連線，不能只靠隱藏按鈕
  const guard = 'if (!session?.token || !session?.ymis)';
  const exportFn = functionSource(card, 'onExportFile');
  assert.ok(exportFn.includes(guard), 'onExportFile 必須先檢查已連接 scoutbadge');
  assert.ok(exportFn.indexOf(guard) < exportFn.indexOf('exportForBadge('), '檢查必須在產生進度檔之前');
  assert.ok(exportFn.indexOf(guard) < exportFn.indexOf('download('), '檢查必須在下載之前');
  const importFn = functionSource(card, 'onImportFile');
  assert.ok(importFn.includes(guard), 'onImportFile 必須先檢查已連接 scoutbadge');
  assert.ok(importFn.indexOf(guard) < importFn.indexOf('new FileReader()'), '檢查必須在讀取檔案之前');
  assert.ok(importFn.indexOf(guard) < importFn.indexOf('importFromBadge('));
  // 殘缺的登入狀態（例如只有旅團編號、沒有 token）不算已連接
  assert.ok(card.includes('sess.token && sess.ymis && sess.troopId ? sess : null'));

  // 舊有「未接駁時仍可用 JSON 檔交換進度」的說法必須清走
  for (const stale of ['你仍可用下方 JSON 檔與領袖交換進度', 'exchange progress with a leader using the JSON file', '離線 JSON 交換']) {
    assert.equal(card.includes(stale), false, `同步卡仍有舊說法：${stale}`);
  }

  // 旅團必須從自動讀取的已登記清單選取；找不到即引導前往 scoutbadge 開戶
  assert.ok(card.includes('sortTroopEntries(troops)') && card.includes('pickTroopId(prev, nextTroops)'));
  assert.ok(card.includes('<select id={troopFieldId} value={troopId}'));
  assert.ok(card.includes('<option value={TROOP_NOT_FOUND}>'));
  assert.equal(card.includes('__NOT_FOUND__'), false, '同步卡只可經 TROOP_NOT_FOUND 常數引用該選項值');
  assert.ok(card.includes('cleanTroop === TROOP_NOT_FOUND'), '「找不到旅團」選項值永不可當作旅團編號送出');
  assert.ok(card.includes('前往 scoutbadge 開戶') && card.includes('Open an Account on scoutbadge'));
  assert.ok(
    card.includes('<a className="btn btn--gold btn--sm" href={badgeOrigin} target="_blank" rel="noopener noreferrer">'),
    '開戶連結必須另開分頁，並帶 noopener noreferrer',
  );
  assert.ok(card.includes('重新讀取旅團清單') && card.includes('暫時未能讀取已登記旅團清單'));

  // 其他入口不得繞過同步卡匯入／匯出 scoutbadge 進度檔
  const welcome = read('web/src/pages/Welcome.jsx');
  assert.equal(welcome.includes('importFromBadge'), false, '歡迎頁未連接 scoutbadge 前不得直接匯入 scoutbadge 進度檔');
  assert.ok(welcome.includes('isBookBackupFile(data)') && welcome.includes('isBadgeProgressFile(data)'));
  const menu = read('web/src/components/MenuDialog.jsx');
  assert.equal(menu.includes('importFromBadge'), false, '選單不得提供未連接的 scoutbadge 進度檔匯入');
  assert.ok(menu.includes('isBookBackupFile(data)'));
  for (const rel of listWebSources()) {
    if (rel === 'web/src/components/ScoutBadgeSyncCard.jsx') continue;
    assert.equal(/\b(importFromBadge|exportForBadge)\b/.test(read(rel)), false, `${rel} 不得自行匯入／匯出 scoutbadge 進度檔`);
  }

  const bridge = read('web/src/scoutbadgeBridge.js');
  assert.ok(bridge.includes("DEFAULT_SCOUTBADGE_URL = 'https://scoutbadge.vercel.app'"));
  assert.equal(/^\s*import\s/m.test(bridge), false, '橋接模組必須零依賴，node --test 才可直接驗證');
  assert.ok(bridge.includes("cache: 'no-store'"));
  assert.ok(bridge.includes('not-json'), '必須識破 SPA fallback 的 HTML 回應');

  // 只有可選同步卡會呼叫 /api；其餘紀錄冊功能不得依賴後端
  const webFiles = ['web/src/App.jsx', 'web/src/pages/PaperBook.jsx', 'web/src/pages/Appendix.jsx', 'web/src/pages/Forms.jsx', 'web/src/components/AwardBlock.jsx', 'web/src/components/Write.jsx', 'web/src/components/Ink.jsx', 'shared/book.js', 'shared/forms.js', 'shared/transfer.js'];
  for (const rel of webFiles) {
    const src = read(rel);
    assert.equal(/fetch\(\s*['"`]\/api/.test(src), false, `${rel} 不得直接依賴後端 API`);
  }
});

test('第 63 頁制服清單可剔選並存入 pages.p63.uniform，重整後仍在', () => {
  const src = read('web/src/pages/Appendix.jsx');
  assert.ok(src.includes('uniformChecked'));
  assert.ok(src.includes('pages: { ...b.pages, p63'));
  assert.ok(src.includes("role={readOnly ? undefined : 'checkbox'}"), '正常模式可剔選、領袖模式只讀');
  // 七個項目各有穩定 key，避免改字後勾選狀態對錯位
  for (const key of ['cap', 'scarf', 'shirt', 'trousers', 'shoes', 'badges', 'groupName']) {
    assert.ok(src.includes(`key: '${key}'`), `缺少制服項目 ${key}`);
  }
  const css = read('web/src/styles.css');
  assert.ok(css.includes('.checklist__box.is-on'));
  assert.ok(css.includes('.checklist li.is-interactive'));
});

test('示範資料只示範版面，不冒充任何領袖核實或簽名', () => {
  const demo = demoBook();
  assert.ok(Object.keys(demo.progress).length >= 8);
  assert.equal(ALL_AWARDS.length, 5);
  assert.equal(OTHER_BADGES.length, 143);
  for (const [id, entry] of Object.entries(demo.progress)) {
    assert.equal(entry.signature ?? null, null, `${id} 不應有假冒簽名`);
  }
  assert.equal(toBadgeId('SC-PUR-001'), 'SC-PUR-001');
});
