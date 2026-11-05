import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_VERSION, AWARD_ART, PAGE_TOTAL, SECTIONS, PRINT_PAGES } from '../shared/book.js';
import leaderHandler from '../api/leader.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function luminance(hex) {
  const c = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrastRatio(hexA, hexB) {
  const l1 = luminance(hexA);
  const l2 = luminance(hexB);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function callLeaderApi(method, body, envCode) {
  const prev = process.env.LEADER_CODE;
  if (envCode === undefined) delete process.env.LEADER_CODE;
  else process.env.LEADER_CODE = envCode;
  let status = 200;
  let payload = null;
  const res = {
    setHeader() {},
    status(c) {
      status = c;
      return this;
    },
    json(data) {
      payload = data;
      return this;
    },
  };
  try {
    leaderHandler({ method, body }, res);
  } finally {
    if (prev === undefined) delete process.env.LEADER_CODE;
    else process.env.LEADER_CODE = prev;
  }
  return { status, payload };
}

test('110 頁官方紙本 + 目錄 + 數位附錄全部映射於 App.jsx，並可整本列印', () => {
  assert.equal(PAGE_TOTAL, 110);
  assert.equal(SECTIONS.filter((s) => !s.digital).length, 110);
  assert.equal(PRINT_PAGES.length, 110);

  const app = read('web/src/App.jsx');
  // 110 頁由 OFFICIAL_PAGES 數據驅動，不再逐頁手寫路由
  assert.ok(app.includes('OFFICIAL_PAGES'));
  assert.ok(app.includes('Object.fromEntries(OFFICIAL_PAGES.map'));
  assert.ok(app.includes('makePaperRoute'));
  for (const legacy of ['BookFront', 'BookTraining', 'BookSkills', 'BookL5']) {
    assert.equal(app.includes(legacy), false, `App 不得再引用舊頁面模組 ${legacy}`);
  }
  assert.match(app, /\bcontents\s*:/);
  assert.match(app, /\bprint\b/);
  assert.match(app, /'\/print'/);
  // 表格以 /forms/:id 動態路由，並以 FORM_META 白名單核對編號
  assert.ok(app.includes('FormDoc'));
  assert.ok(app.includes('FormsIndex'));
  assert.ok(app.includes('FormsAll'));
  assert.ok(app.includes("path.startsWith('/forms')"));
  const formsPage = read('web/src/pages/Forms.jsx');
  for (const formId of ['pt18', 'p120a1', 'p120a2']) {
    assert.ok(formsPage.includes(`'${formId}'`) || formsPage.includes(`"${formId}"`), `Forms.jsx 缺少 ${formId}`);
  }

  // PaperBook 匯出通用渲染器及數據驅動目錄
  const paper = read('web/src/pages/PaperBook.jsx');
  assert.ok(paper.includes('export function PaperPage'));
  assert.ok(paper.includes('export function ContentsPage'));
  assert.ok(paper.includes('OFFICIAL_GROUPS'));
});

test('版權與非官方聲明只出現於封面頁腳、數位附錄、選單「關於」三處', () => {
  const legal = read('web/src/components/Legal.jsx');
  assert.ok(legal.includes('Copyright © 2026 SCOUT SYSTEM'));
  assert.ok(legal.includes('本網站為非官方獨立工具，旨在方便成員，與香港童軍總會無任何官方從屬關係'));
  assert.ok(legal.includes('This site is an independent, unofficial tool for members'));

  const usages = [];
  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (/\.jsx$/.test(ent.name)) {
        const txt = fs.readFileSync(full, 'utf8');
        if (/<Legal(Line|Note)\b/.test(txt)) usages.push(path.relative(root, full));
      }
    }
  };
  walk(path.join(root, 'web/src'));
  assert.deepEqual(usages.sort(), [
    'web/src/components/MenuDialog.jsx',
    'web/src/pages/BookBack.jsx',
    'web/src/pages/CoverPage.jsx',
  ]);

  // 內頁、目錄、列印及表格不得重複版權聲明
  for (const rel of ['web/src/pages/Welcome.jsx', 'web/src/components/Paper.jsx', 'web/src/pages/BookFront.jsx', 'web/src/pages/BookTraining.jsx', 'web/src/pages/BookSkills.jsx', 'web/src/pages/BookL5.jsx', 'web/src/pages/PaperBook.jsx', 'web/src/pages/Forms.jsx', 'web/src/pages/Scan.jsx']) {
    assert.ok(!/Legal(Line|Note)/.test(read(rel)), `${rel} 不得重複版權聲明`);
  }
});

test('童軍綠金配色符合 WCAG AA，且絕無白字配金黃底', () => {
  const css = read('web/src/styles.css');

  assert.ok(css.includes('--cover-bg: #143b28'));
  assert.ok(css.includes('--cover-bg-deep: #08180f'));
  assert.ok(css.includes('--scout-green: #1c5236'));
  assert.ok(css.includes('--foil: #e3c07a'));
  assert.ok(css.includes('--ink-blue: #124a26'));
  assert.ok(css.includes('--stamp: #124a26'));
  assert.ok(css.includes('--danger: #a62626'));
  assert.ok(css.includes('html[data-lang="zh"]'));
  assert.ok(css.includes('.write__dot'));
  assert.ok(css.includes('env(safe-area-inset-top)'));

  // 舊有深資童軍酒紅／幼童軍黃／姊妹倉殘留必須清零
  for (const stale of [
    '#540f1e', '#2a060f', '#7a1426', '#4a0e1b', '#7b1d31', '#5a1321', '#2b0710',
    '#8b1c31', '#5e1021', '#350711', '#5c1021', '#310710', '#4b0d1b', '#5e1122', '#2e0710',
    '#182238', '#19386b', '#26070f', '#140408', '#5b6b7a', '#5b3f7a', '#a8641f',
  ]) {
    assert.equal(css.toLowerCase().includes(stale), false, `styles.css 仍有非童軍綠殘留 ${stale}`);
  }
  for (const stale of ['cub-yellow', 'cub-ink', 'cubsync', 'parent__', 'parentbar', 'OT-GB', '酒紅', '幼童軍黃']) {
    assert.equal(css.includes(stale), false, `styles.css 仍有殘留 ${stale}`);
  }
  // 頁緣色帶一律綠系，且 L5 有專屬色帶
  for (const ribbon of ["data-badge='L1'", "data-badge='L2'", "data-badge='L3'", "data-badge='L4'", "data-badge='L5'", "data-badge='OT'"]) {
    assert.ok(css.includes(`.sheet[${ribbon}]`), `缺少 ${ribbon} 色帶`);
  }

  assert.ok(contrastRatio('#1c5236', '#f7f2e7') >= 7.0, '深童軍綠標題於象牙紙 >= 7:1');
  assert.ok(contrastRatio('#1e1a14', '#f7f2e7') >= 14.0, '主墨色於象牙紙 >= 14:1');
  assert.ok(contrastRatio('#124a26', '#f7f2e7') >= 8.0, '手寫綠墨於象牙紙 >= 8:1');
  assert.ok(contrastRatio('#f6e6bb', '#143b28') >= 7.0, '燙金字於深綠布面 >= 7:1');
  assert.ok(contrastRatio('#1a1206', '#e3c07a') >= 8.0, '深炭字於燙金 >= 8:1');
  assert.ok(contrastRatio('#ffffff', '#1c5236') >= 4.5, '白字於深綠按鈕 >= 4.5:1');

  // 反例：白字配金黃必須低於 AA，證明設計上不可用
  assert.ok(contrastRatio('#ffffff', '#e6a800') < 3.0);
  // 因此金黃底按鈕一律使用深炭文字（每條規則都要合規，不只第一條）
  for (const cls of ['btn--gold', 'chipbtn--gold']) {
    const blocks = [...css.matchAll(new RegExp(`\\.${cls}\\s*\\{[^}]*\\}`, 'g'))];
    assert.ok(blocks.length > 0, `找不到 .${cls}`);
    for (const b of blocks) assert.ok(b[0].includes('color: #1a1206'), `.${cls} 有一條規則不是深炭字`);
  }
});

test('官方徽章實圖：official/ 七圖齊備且已接入封面／獎章頁／制服頁（非 SVG 重繪）', () => {
  for (const f of ['membership-emblem.png', 'badge-pathfinder.png', 'badge-standard.png', 'badge-advanced.png', 'badge-csa.png', 'uniform-zh.png', 'uniform-en.png']) {
    const p = path.join(root, 'web/public/official', f);
    assert.ok(fs.existsSync(p), `缺少 web/public/official/${f}`);
    assert.ok(fs.statSync(p).size > 4000, `${f} 疑似空圖`);
  }
  // PNG 檔頭簽名（89 50 4E 47），非改副檔名的 SVG
  for (const f of ['membership-emblem.png', 'badge-pathfinder.png', 'badge-standard.png', 'badge-advanced.png', 'badge-csa.png']) {
    const head = fs.readFileSync(path.join(root, 'web/public/official', f)).subarray(0, 4);
    assert.deepEqual([...head], [0x89, 0x50, 0x4e, 0x47], `${f} 不是真 PNG`);
  }
  assert.deepEqual(Object.keys(AWARD_ART).sort(), ['L1', 'L2', 'L3', 'L4', 'L5']);
  for (const art of Object.values(AWARD_ART)) {
    assert.match(art.src, /^\/official\/.*\.png$/);
    assert.ok(art.zh.length > 0 && art.en.length > 0);
  }
  const cover = read('web/src/pages/CoverPage.jsx');
  const paper = read('web/src/pages/PaperBook.jsx');
  const back = read('web/src/pages/BookBack.jsx');
  assert.ok(cover.includes('/official/membership-emblem.png'), '封面未用會員章實圖');
  assert.ok(paper.includes('AWARD_ART'), '獎章頁未用官方圖表');
  assert.ok(paper.includes('<AwardArt'), '獎章頁未渲染實圖');
  assert.ok(paper.includes('routechain'), '途徑頁未用徽章圖');
  assert.ok(back.includes('/official/uniform-zh.png') && back.includes('/official/uniform-en.png'), '制服頁未用中英圖版');
  assert.ok(back.includes('UNIFORM_LEGEND'), '制服頁缺少 22 項圖例');
});

test('api/leader.js 只於伺服器比對 LEADER_CODE（timingSafeEqual），前端零密碼', () => {
  assert.deepEqual(callLeaderApi('GET', null, undefined), { status: 200, payload: { enabled: false } });
  assert.deepEqual(callLeaderApi('GET', null, '852963'), { status: 200, payload: { enabled: true } });
  assert.deepEqual(callLeaderApi('POST', { code: '852963' }, undefined), { status: 503, payload: { error: 'unset' } });
  assert.deepEqual(callLeaderApi('POST', { code: '' }, '852963'), { status: 400, payload: { error: 'empty' } });
  assert.deepEqual(callLeaderApi('POST', { code: '000000' }, '852963'), { status: 401, payload: { error: 'wrong' } });
  assert.deepEqual(callLeaderApi('POST', { code: '85296' }, '852963'), { status: 401, payload: { error: 'wrong' } });
  assert.deepEqual(callLeaderApi('POST', { code: '852963' }, '852963'), { status: 200, payload: { ok: true } });

  const api = read('api/leader.js');
  assert.ok(api.includes('crypto.timingSafeEqual'));
  assert.ok(!/process\.env\.VITE_/.test(api));

  const checkDir = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) checkDir(full);
      else if (/\.(js|jsx|html)$/.test(ent.name)) {
        const txt = fs.readFileSync(full, 'utf8');
        assert.ok(!txt.includes('VITE_LEADER'), `${full} 不得把領袖密碼帶入前端 bundle`);
      }
    }
  };
  checkDir(path.join(root, 'web'));
  assert.ok(!read('vite.config.js').includes('VITE_LEADER'));

  const env = read('.env.example');
  assert.match(env, /^LEADER_CODE=/m);
  assert.match(env, /^SCOUTBADGE_ORIGIN=/m);
  assert.ok(!/^VITE_/m.test(env), '.env.example 不得定義任何 VITE_ 變數');
});

test('領袖模式（只讀、可掃描他人）與普通模式（不可讀他人）嚴格分離', () => {
  const app = read('web/src/App.jsx');
  assert.ok(app.includes('readOnly: leader'));
  assert.ok(!app.includes('parent.js'), 'v1.0.0 不設家長模式，不得引用已刪除的 parent.js');
  assert.ok(app.includes('if (isLeader()) return;'));
  assert.ok(app.includes('leader ? <HashSnapshotViewer token={hashToken} /> : <LeaderGate mode="gate" />'));
  assert.ok(app.includes('LeaderGate'));

  const write = read('web/src/components/Write.jsx');
  assert.ok(write.includes('write--readonly'));

  // 普通模式出示的二維碼只接受領袖簽發的 SB1S 核簽碼
  const showQr = read('web/src/components/ShowQrDialog.jsx');
  assert.ok(showQr.includes('payload.t !== KIND_SIGNOFF'));
  // 出示預設不剔選任何組別
  assert.ok(!/useState\(\[[^\]]*'(particulars|contact)'/.test(showQr), '出示二維碼不得預設剔選組別');

  const scan = read('web/src/pages/Scan.jsx');
  assert.ok(scan.includes('Signoff'));
  assert.ok(scan.includes('SignoffPanel'));
  // 領袖核簽碼由 SignoffPanel 簽發（SB1S.），只讀檢視不寫入本機紀錄冊
  const signoffPanel = read('web/src/components/SignoffPanel.jsx');
  assert.ok(signoffPanel.includes('encodeSignoff'));
});

test('中英文完全分離：一鍵切換、不以並排方式塞入表格', () => {
  const i18n = read('web/src/i18n.jsx');
  assert.ok(i18n.includes("setAttribute('data-lang'"));
  assert.ok(i18n.includes('toggle'));

  const css = read('web/src/styles.css');
  assert.ok(css.includes('html[data-lang="zh"]'), '中文介面必須隱藏雙語小字');
  assert.ok(css.includes('data-lang'), 'styles.css 需按語言切換排版');

  // 內頁不得把中英並列寫死於同一字串（例如「日期 Date」）
  for (const rel of ['web/src/pages/BookFront.jsx', 'web/src/pages/BookTraining.jsx', 'web/src/pages/BookSkills.jsx', 'web/src/pages/BookL5.jsx', 'web/src/pages/BookBack.jsx', 'web/src/pages/PaperBook.jsx', 'web/src/pages/CoverPage.jsx']) {
    const src = read(rel);
    for (const bad of ['日期 Date', '由 From', '或 OR', '所選項目 Selected Item', '姓名 Name']) {
      assert.equal(src.includes(bad), false, `${rel} 出現中英並列字串「${bad}」`);
    }
  }

  // 誓詞與規律中英分開呈現（第 64 頁）
  const back = read('web/src/pages/BookBack.jsx');
  assert.ok(back.includes('PROMISE_ZH') && back.includes('LAW_ZH'));
  assert.ok(back.includes('我願以信譽為誓'));
  assert.ok(back.includes('童軍信用為人敬'));
  assert.ok(back.includes('準備'));
  assert.ok(back.includes('On my honour, I promise that I will do my best'));
  // 同一頁不可把中英文串接成一行
  assert.ok(!back.includes('誓詞 Promise'));
  // v2 官方第 9 頁（PaperBook）：誓詞與規律中英分開呈現
  const paper = read('web/src/pages/PaperBook.jsx');
  assert.ok(paper.includes('我願以信譽為誓'));
  assert.ok(paper.includes('童軍信用為人敬'));
  assert.ok(paper.includes('On my honour, I promise that I will do my best'));
  assert.ok(!paper.includes('誓詞 Promise'));
});

test('圖示全套 9 個 + 根目錄 favicon、manifest 與 Service Worker 一致', () => {
  const html = read('web/index.html');
  assert.ok(html.includes(`content="${APP_VERSION}"`));
  assert.ok(html.includes('href="/favicon.svg"'));
  assert.ok(html.includes('href="/favicon.ico"'));
  assert.ok(html.includes('href="/favicon-32.png"'));
  assert.ok(html.includes('href="/favicon-48.png"'));
  assert.ok(html.includes('href="/icons/apple-touch-icon.png"'));
  assert.ok(html.includes('content="#143b28"'), '童軍綠 theme-color');

  const files = [
    'web/public/favicon.svg',
    'web/public/favicon.ico',
    'web/public/favicon-32.png',
    'web/public/favicon-48.png',
    'web/public/icons/favicon.ico',
    'web/public/icons/favicon-16.png',
    'web/public/icons/favicon-32.png',
    'web/public/icons/apple-touch-icon.png',
    'web/public/icons/icon-192.png',
    'web/public/icons/icon-512.png',
    'web/public/icons/icon-maskable-192.png',
    'web/public/icons/icon-maskable-512.png',
    'web/public/icons/og-image.png',
  ];
  for (const rel of files) {
    const f = path.join(root, rel);
    assert.ok(fs.existsSync(f) && fs.statSync(f).size > 100, `缺少或空白圖示 ${rel}`);
  }

  const manifest = JSON.parse(read('web/public/manifest.webmanifest'));
  assert.equal(manifest.short_name, 'SCOUTBOOK');
  assert.equal(manifest.theme_color, '#143b28');
  assert.equal(manifest.background_color, '#08180f');
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(path.join(root, 'web/public', icon.src.replace(/^\//, ''))), `manifest 圖示不存在 ${icon.src}`);
  }

  const sw = read('web/public/sw.js');
  assert.ok(sw.includes("const CACHE_NAME = 'scoutbook-cache-v1'"));
  assert.ok(!sw.includes('cubbook') && !sw.includes('vsbook'));
  // 預快取清單每一項都必須真實存在，否則離線首次載入會破圖
  const shell = sw.match(/const SHELL = \[([\s\S]*?)\];/)[1];
  for (const m of shell.matchAll(/'([^']+)'/g)) {
    const url = m[1];
    const rel = url === '/' || url === '/index.html' ? null : path.join(root, 'web/public', url.replace(/^\//, ''));
    if (rel) assert.ok(fs.existsSync(rel), `Service Worker 預快取檔案不存在：${url}`);
  }
  assert.ok(!fs.existsSync(path.join(root, 'web/public/img')), '不應保留其他支部圖片');
});

test('package.json / vite.config.js 已完全改用 scoutbook 及 /api/scoutbadge', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.name, 'scoutbook');
  assert.match(pkg.description, /SCOUTBOOK/);
  assert.ok(pkg.scripts.syllabus);

  const vite = read('vite.config.js');
  assert.ok(vite.includes("from './api/scoutbadge.js'"));
  assert.ok(vite.includes("'/api/scoutbadge'"));
  assert.ok(!vite.includes('vsbadge') && !vite.includes('cubbadge'));
  assert.ok(vite.includes('0.0.0.0'));

  assert.ok(!fs.existsSync(path.join(root, 'api/vsbadge.js')));
  assert.ok(!fs.existsSync(path.join(root, 'api/cubbadge.js')));
});

test('個人及AYP官方頁已接入 PaperBook（紙本欄位齊備）', () => {
  const paper = read('web/src/pages/PaperBook.jsx');
  for (const key of ['member.emergencyAddr', 'member.birthPlace', 'member.passportNo', 'member.bloodType', 'member.groupPhone', 'scouting.scoutRanks', 'scouting.stars', 'member.photo', 'holderSignature', 'transfers', 'addressChanges']) {
    assert.ok(paper.includes(key), `個人頁缺少 ${key}`);
  }
  for (let i = 91; i <= 101; i += 1) {
    const pid = i < 100 ? `p0${i}` : `p${i}`;
    assert.ok(paper.includes(pid), `AYP 缺 ${pid}`);
  }
  for (const subj of ['裝備', '導航', '營藝', '食物與烹飪', '急救', '安全措施及緊急應變程序', '旅程計劃及記錄', '保護環境']) {
    assert.ok(paper.includes(subj), `AYP 前訓缺少 ${subj}`);
  }
  assert.ok(paper.includes('評核員報告'));
  assert.ok(paper.includes('服務年星'));
});
